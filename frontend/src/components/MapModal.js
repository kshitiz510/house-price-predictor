import React, { useState } from 'react'
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api'

const mapContainerStyle = {
    width: '100%',
    height: '100%',
}

const center = {
    lat: 28.6474, 
    lng: 77.1302
}

const MapModal = ({ setCoordinates, coordinates }) => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    })

    const [selected, setSelected] = useState(coordinates)

    const handleMapClick = (event) => {
        const lat = event.latLng.lat()
        const lng = event.latLng.lng()
        setCoordinates({ lat, lng })
        setSelected({ lat, lng })
    }

    if (loadError) return <div>Error loading maps</div>
    if (!isLoaded) return <div>Loading maps</div>

    return (
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={7}
            center={selected || center}
            onClick={handleMapClick}
        >
            {selected && <Marker position={selected} />}
        </GoogleMap>
    )
}

export default MapModal
