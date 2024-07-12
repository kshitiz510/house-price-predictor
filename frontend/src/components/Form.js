import React, { useState } from 'react'
import axios from 'axios'
import Modal from 'react-modal'
import MapModal from './MapModal'
import Results from './Results'

const Form = () => {
    const [formData, setFormData] = useState({
        address: '',
        area: '',
        bedrooms: '',
        bathrooms: '',
        floor: ''
    })
    const [isMapOpen, setIsMapOpen] = useState(false)
    const [coordinates, setCoordinates] = useState(null)
    const [results, setResults] = useState(null)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('http://localhost:3000/predict', formData)
            setResults(response.data)
        } catch (error) {
            console.error('Error fetching prediction:', error)
        }
    }

    const openMap = () => {
        setIsMapOpen(true)
    }

    const handleMapClose = async () => {
        setIsMapOpen(false)
        if (coordinates) {
            try {
                const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates.lat},${coordinates.lng}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`)
                const address = response.data.results[0].formatted_address
                setFormData({ ...formData, address })
            } catch (error) {
                console.error('Error fetching address:', error)
            }
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white rounded px-8 pb-4">
                <div className="mb-4 w-80">
                    <label className="block text-gray-700 text-base font-bold mb-2" htmlFor="address">
                        Address
                    </label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        onClick={openMap} 
                        className="shadow-md appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter Address"
                        required
                    />
                </div>
                <div className="mb-4 w-80">
                    <label className="block text-gray-700 text-base font-bold mb-2" htmlFor="area">
                        Area (sq ft)
                    </label>
                    <input
                        type="number"
                        min="0"
                        id="area"
                        name="area"
                        value={formData.area}
                        onChange={handleChange}
                        className="shadow-md appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter Area"
                        required
                    />
                </div>
                <div className="mb-4 w-80">
                    <label className="block text-gray-700 text-base font-bold mb-2" htmlFor="bedrooms">
                        Bedrooms
                    </label>
                    <input
                        type="number"
                        min="0"
                        id="bedrooms"
                        name="bedrooms"
                        value={formData.bedrooms}
                        onChange={handleChange}
                        className="shadow-md appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter Bedrooms"
                        required
                    />
                </div>
                <div className="mb-4 w-80">
                    <label className="block text-gray-700 text-base font-bold mb-2" htmlFor="bathrooms">
                        Bathrooms
                    </label>
                    <input
                        type="number"
                        min="0"
                        id="bathrooms"
                        name="bathrooms"
                        value={formData.bathrooms}
                        onChange={handleChange}
                        className="shadow-md appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter Bathrooms"
                        required
                    />
                </div>
                <div className="mb-10 w-80">
                    <label className="block text-gray-700 text-base font-bold mb-2" htmlFor="floor">
                        Floor Level
                    </label>
                    <input
                        type="number"
                        min="0"
                        id="floor"
                        name="floor"
                        value={formData.floor}
                        onChange={handleChange}
                        className="shadow-md appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter Floor Level"
                        required    
                    />
                </div>
                <div className="flex items-center justify-center">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                    >
                        Predict Price
                    </button>
                </div>
            </form>
            <Modal
                isOpen={isMapOpen}
                onRequestClose={handleMapClose}
                contentLabel="Select Location"
                className="fixed inset-0 flex items-center justify-center"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50"
            >
                <div className="bg-white rounded-lg p-4" style={{height: '500px', width: '500px'}}>
                    <MapModal setCoordinates={setCoordinates} coordinates={coordinates} />
                    <button onClick={handleMapClose} className="mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline">
                        Close
                    </button>
                </div>
            </Modal>
            {results && <Results results={results} />}
        </div>
    )
}

export default Form
