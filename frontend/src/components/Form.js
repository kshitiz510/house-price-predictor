import React, { useState } from 'react'
import axios from 'axios'

const Form = ({ setResults }) => {
    const [formData, setFormData] = useState({
        address: '',
        area: '',
        bedrooms: '',
        bathrooms: '',
        floor: ''
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const response = await axios.post('http://localhost:5000/predict', formData)
        setResults(response.data);
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" required />
            <input type="number" name="area" value={formData.area} onChange={handleChange} placeholder="Area (sq ft)" required />
            <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} placeholder="Bedrooms" required />
            <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} placeholder="Bathrooms" required />
            <input type="number" name="floor" value={formData.floor} onChange={handleChange} placeholder="Floor Level" required />
            <button type="submit">Predict Price</button>
        </form>
    )
}

export default Form;
