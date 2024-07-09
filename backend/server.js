const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())
  
const PORT = process.env.PORT

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err))

const predictRoute = require('./routes/predict.routes')
app.use('/predict', predictRoute)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
