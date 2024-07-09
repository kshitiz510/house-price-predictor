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
        type: Number,
        required: true
    },
    amenities: {
        type: Array,
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model('House', houseSchema)
