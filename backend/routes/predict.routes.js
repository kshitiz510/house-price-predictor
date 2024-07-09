const express = require('express')
const router = express.Router()
const axios = require('axios')
const { PythonShell } = require('python-shell')
const House = require('../models/House.models')
require('dotenv').config()

router.post('/', async (req, res) => {
    console.log('Received request:', req.body);
    const { address, area, bedrooms, bathrooms, floor } = req.body

    try {
        
        const geocodeResponse = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
            params: {
                address,
                key: process.env.GOOGLE_MAPS_API_KEY
            }
        })
        // console.log(geocodeResponse)

        const location = geocodeResponse.data.results[0]?.geometry?.location;
        if (!location) {
            return res.status(400).json({ error: 'Location not found' });
        }
        const { lat, lng } = location
        console.log('Location: ', {lat, lng})

        const placesResponse = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1500&type=school|hospital|park|supermarket&key=${process.env.GOOGLE_MAPS_API_KEY}`)
        // console.log(placesResponse)

        const amenities = placesResponse.data.results
        console.log(amenities)
        
        // PythonShell.run('scripts/predict.py',    { args: [area, bedrooms, bathrooms, floor, amenities.length] }, async (err, results) => {
        //     if (err) throw err

        //     const price = parseFloat(results[0])
        // const house = new House({ address, area, bedrooms, bathrooms, floor, amenities })
        // await house.save()
        // res.json({ amenities })
        // res.json({ price, amenities })
        // })
        
    } catch (error) {
        console.error('Error in prediction route:', error)
        res.status(500).send('Server error')
    }
})

function calculatePrice(area, bedrooms, bathrooms, floor, amenities) {

    return area * 10 + bedrooms * 1000 + bathrooms * 500 + floor * 200;
}

module.exports = router
