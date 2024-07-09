import React from 'react'

const Results = ({ results }) => {

    if (!results) return null;

    // return (
    //     <div className='results'>
    //         <h2>Predicted Price: ${results.price.toFixed(2)}</h2>
    //         <h3>Nearby Amenities:</h3>
    //         <ul>
    //             {results.amenities.map((amenity, index) => (
    //                 <li key={index}>{amenity.name} - {amenity.vicinity}</li>
    //             ))}
    //         </ul>
    //     </div>
    // )

    return (
        <div className="bg-white p-4 rounded shadow-lg max-w-md w-full mt-4">
            <h2 className="text-xl font-bold mb-2">Predicted Price</h2>
            <div className="bg-gray-100 px-4 py-2 rounded-lg mb-2">
                <h3 className="text-lg font-bold text-indigo-600">Price: ${results.price.toFixed(2)}</h3>
            </div>
            <div>
                <h3 className="text-lg font-bold mb-2">Nearby Amenities:</h3>
                <ul>
                    {results.amenities.map((amenity, index) => (
                        <li key={index} className="mb-1">
                            <span className="font-bold">{amenity.name}</span> - {amenity.vicinity}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Results;
