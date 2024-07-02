const mongoose = require('mongoose');

const houseSchema = new mongoose.Schema({
    address: {
        type: String,
        required : true
    },
    area: {
        type: Number,
        required : true
    },
    bedrooms: {
        type: Number,
        required : true
    },
    bathrooms: {
        type: Number,
        required : true
    },
    floor: {
        type: Number,
        required : true
    },
    price: {
        type: Number
    },
    amenities: {
        type: Array
    }
})

module.exports = mongoose.model('House', houseSchema)
