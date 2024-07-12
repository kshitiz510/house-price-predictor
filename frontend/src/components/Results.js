import React, { useState } from 'react';

const Results = ({ results }) => {
    const predefinedCategories = [
        'school', 'hospital', 'restaurant', 'bank', 'park', 'supermarket', 'gym', 'library', 'pharmacy' 
    ]

    const [expandedCategories, setExpandedCategories] = useState(
        predefinedCategories.reduce((acc, category) => {
            acc[category] = false;
            return acc;
        }, {})
    );

    const toggleCategory = (category) => {
        setExpandedCategories(prevState => ({
            ...prevState,
            [category]: !prevState[category]
        }));
    };

    if (!results) return null;

    const categorizedAmenities = predefinedCategories.reduce((acc, category) => {
        acc[category] = results.amenities.filter(amenity => amenity.types.includes(category));
        return acc;
    }, {});

    return (
        <div className="w-80 mx-auto mt-0">
            <hr className='mt-6 mb-10' style={{border: '1px solid black'}}></hr>
            <div className="bg-white rounded">
                <h2 className="text-xl font-bold mb-2">Predicted Price</h2>
                <div className="bg-gray-200 px-4 py-2 rounded-lg mb-2">
                    <h3 className="text-lg font-bold text-indigo-600">Price: Rs.{results.price.toFixed(0)}</h3>
                </div>
            </div>
            <div className="bg-white rounded mt-4">
                <h3 className="text-lg font-bold mb-2">In the Neighbourhood:</h3>
                {predefinedCategories.map((category, index) => (
                    <div key={index} className="mb-4">
                        <div
                            className="bg-gray-300 px-4 py-2 rounded-lg cursor-pointer"
                            onClick={() => toggleCategory(category)}
                        >
                            <h4 className="text-lg font-bold capitalize">{category}</h4>
                        </div>
                        {expandedCategories[category] && (
                            <ul className="mt-2">
                                {categorizedAmenities[category].map((amenity, idx) => (
                                    <li key={idx} className="mb-2">
                                        <div className="bg-gray-200 px-4 py-2 rounded-lg">
                                            <span className="font-bold">{amenity.name}</span> - {amenity.vicinity} ({amenity.rating} stars, {amenity.user_ratings_total} reviews)
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Results;
