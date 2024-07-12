const express = require('express')
const router = express.Router()
const axios = require('axios')
const { PythonShell } = require('python-shell')
const House = require('../models/House.models')
require('dotenv').config()

router.post('/', async (req, res) => {
    console.log('Received request:', req.body)
    const { address, area, bedrooms, bathrooms, floor } = req.body

    try {
        const geocodeResponse = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address,
                key: process.env.GOOGLE_MAPS_API_KEY
            }
        })

        const location = geocodeResponse.data.results[0]?.geometry?.location
        if (!location) {
            return res.status(400).json({ error: 'Location not found' })
        }
        const { lat, lng } = location
        console.log('Location: ', { lat, lng })

        const types = [
            'school', 'hospital', 'park', 'supermarket', 'food',
            'gym', 'library', 'pharmacy', 'bank', 'restaurant'
        ]
        let topAmenities = []

        for (const type of types) {
            const placesResponse = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
                params: {
                    location: `${lat},${lng}`,
                    radius: 2000,
                    type,
                    key: process.env.GOOGLE_MAPS_API_KEY
                }
            })

            const amenities = placesResponse.data.results
            console.log(`Number of ${type} amenities are ${amenities.length}`)
            if(amenities.length < 5) {
                topAmenities = topAmenities.concat(amenities)
            }
            else {
                const filteredAmenities = amenities
                    .filter(amenity => (amenity.user_ratings_total > 20))
                    .sort((a, b) => b.rating - a.rating)
                    .slice(0, 5)
    
                topAmenities = topAmenities.concat(filteredAmenities)
            }
        }

        console.log('Top Amenities: ', topAmenities)

        const amenitiesLength = topAmenities.length
        console.log('Number of amenities: ', amenitiesLength)

        const options = {
            args: [area, bedrooms, bathrooms, floor, amenitiesLength]
        }

        // PythonShell.run('scripts/predict.py', options, async (err, results) => {
        //     if (err) {
        //         console.error('Error running Python script:', err)
        //         return res.status(500).send('Error running prediction')
        //     }

            // const price = parseFloat(results[0])
            const price = 10000000
            console.log('Predicted price:', price)

            const house = new House({ address, area, bedrooms, bathrooms, floor, price, amenities: topAmenities })
            await house.save()

            res.json({ price, amenities: topAmenities })
        // })

    } catch (error) {
        console.error('Error in prediction route:', error)
        res.status(500).send('Server error')
    }
})

module.exports = router
