import pandas as pd
import numpy as np
import re
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.linear_model import LinearRegression, RidgeCV
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, StackingRegressor
from sklearn.svm import SVR
from xgboost import XGBRegressor
from lightgbm import LGBMRegressor
from catboost import CatBoostRegressor
import matplotlib.pyplot as plt
import seaborn as sns
import gc

# Loading and exploring the dataset

file_path = '.\\bengaluru_house_prices.csv'
data = pd.read_csv(file_path)

# Clean feature names
data.columns = [re.sub(r'\W+', '_', col) for col in data.columns]

# Check for duplicate columns
data = data.loc[:, ~data.columns.duplicated()]

# Convert the 'total_sqft' to numeric (take the average if it's a range)
def convert_sqft_to_num(x):
    tokens = x.split('-')
    if len(tokens) == 2:
        return (float(tokens[0]) + float(tokens[1])) / 2
    try:
        return float(x)
    except:
        return None

data['total_sqft'] = data['total_sqft'].apply(convert_sqft_to_num)

# Drop rows with missing target values
data = data.dropna(subset=['price'])

# Data cleaning and preprocessing
numerical_features = data.select_dtypes(include=['int64', 'float64']).columns
numerical_imputer = SimpleImputer(strategy='mean')
data[numerical_features] = numerical_imputer.fit_transform(data[numerical_features])

categorical_features = data.select_dtypes(include=['object']).columns
categorical_imputer = SimpleImputer(strategy='most_frequent')
data[categorical_features] = categorical_imputer.fit_transform(data[categorical_features])

# Encode categorical variables
data = pd.get_dummies(data, columns=categorical_features, drop_first=True)

# Handle NaN/Inf values
data.replace([np.inf, -np.inf], np.nan, inplace=True)
data.dropna(inplace=True)

# Feature Scaling
scaler = StandardScaler()
data_scaled = scaler.fit_transform(data)
data_scaled = pd.DataFrame(data_scaled, columns=data.columns)

# Splitting the Data
X = data_scaled.drop('price', axis=1)
y = data_scaled['price']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Define the parameter grids
param_grid_rf = {'n_estimators': [100], 'max_depth': [20]}
param_grid_gb = {'n_estimators': [100], 'max_depth': [5]}
param_grid_xgb = {'n_estimators': [100], 'max_depth': [5]}
param_grid_lgbm = {'n_estimators': [50, 100], 'max_depth': [3, 5]}
param_grid_cat = {'n_estimators': [100, 200], 'max_depth': [3, 5]}
param_grid_dt = {'max_depth': [10, 20]}
param_grid_svr = {'C': [0.1, 1], 'kernel': ['linear', 'rbf']}

# Initialize the models
models = {
    'LinearRegression': (LinearRegression(), {}),
    'DecisionTree': (DecisionTreeRegressor(), param_grid_dt),
    'RandomForest': (RandomForestRegressor(), param_grid_rf),
    'GradientBoosting': (GradientBoostingRegressor(), param_grid_gb),
    'XGBoost': (XGBRegressor(), param_grid_xgb),
    'LightGBM': (LGBMRegressor(), param_grid_lgbm),
    'CatBoost': (CatBoostRegressor(verbose=0), param_grid_cat),
    'SVR': (SVR(), param_grid_svr)
}

best_models = {}

for name, (model, param_grid) in models.items():
    if param_grid:  # Skip LinearRegression.....has no hyperparameters
        search = GridSearchCV(estimator=model, param_grid=param_grid, cv=3, scoring='neg_mean_absolute_error', n_jobs=-1)
        search.fit(X_train, y_train)
        best_models[name] = search.best_estimator_
        print(f"{name} - Best Params : {search.best_params_}")
    else:
        model.fit(X_train, y_train)
        best_models[name] = model

    y_pred = best_models[name].predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    print(f"{name} - MAE: {mae}, R^2: {r2}")

# Defining the base models for stacking
estimators = [
    ('lr', best_models['LinearRegression']),
    ('dt', best_models['DecisionTree']),
    ('rf', best_models['RandomForest']),
    ('gb', best_models['GradientBoosting']),
    ('xgb', best_models['XGBoost']),
    ('lgbm', best_models['LightGBM']),
    ('cat', best_models['CatBoost']),
    ('svr', best_models['SVR'])
]

# Defining the final estimator
final_estimator = RidgeCV()

# Creating the Stacking Regressor
stacking_model = StackingRegressor(estimators=estimators, final_estimator=final_estimator, n_jobs=-1)

# Training the stacking Regressor
stacking_model.fit(X_train, y_train)

# Evaluating the Stacking Regressor
y_pred_stacking = stacking_model.predict(X_test)
mae_stacking = mean_absolute_error(y_test, y_pred_stacking)
r2_stacking = r2_score(y_test, y_pred_stacking)

print(f"Stacking Regressor - MAE: {mae_stacking}, R^2: {r2_stacking}")

# Visualising model performance
model_names = list(best_models.keys()) + ["Stacking Regressor"]
mae_scores = [mean_absolute_error(y_test, best_models[name].predict(X_test)) for name in best_models] + [mae_stacking]
r2_scores = [r2_score(y_test, best_models[name].predict(X_test)) for name in best_models] + [r2_stacking]

fig, axs = plt.subplots(1, 2, figsize=(15, 5))

# MAE scores
sns.barplot(x=model_names, y=mae_scores, ax=axs[0])
axs[0].set_title('Mean Absolute Error (MAE)')
axs[0].set_ylabel('MAE Score')
axs[0].set_xticklabels(axs[0].get_xticklabels(), rotation=45)

# R2 scores
sns.barplot(x=model_names, y=r2_scores, ax=axs[1])
axs[1].set_title('R^2 Score')
axs[1].set_ylabel('R^2 Score')
axs[1].set_xticklabels(axs[1].get_xticklabels(), rotation=45)

plt.tight_layout()
plt.show()

# Saving the best model
import joblib
joblib.dump(stacking_model, 'best_model.pkl')

# Clear unused variables and force garbage collection
del data, data_scaled, X, y, X_train, X_test, y_train, y_test, y_pred, y_pred_stacking
gc.collect()

# Further analysis and predictions
# Load the saved model
best_model = joblib.load('best_model.pkl')

# Make predictions with the best model
# Example new data predictions
new_data = pd.DataFrame([X_test.iloc[0]])
new_prediction = best_model.predict(new_data)
print(f"Predicted price for new data: {new_prediction[0]}")
