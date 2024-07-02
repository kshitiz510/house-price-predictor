import React from 'react'

const Results = ({ data }) => (
    <div>
        <h2>Predicted Price: ${data.price.toFixed(2)}</h2>
        <h3>Nearby Amenities:</h3>
        <ul>
            {data.amenities.map((amenity) => (
                <li key={amenity.place_id}>{amenity.name} ({amenity.types.join(', ')})</li>
            ))}
        </ul>
    </div>
)

export default Results;
