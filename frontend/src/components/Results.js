import React from 'react';

const Results = ({ results }) => {
    if (!results) return null;

    return (
        <div className="w-80 mx-auto mt-20">
            <div className="bg-white rounded">
                <h2 className="text-xl font-bold mb-2">Predicted Price</h2>
                <div className="bg-gray-200 px-4 py-2 rounded-lg mb-2">
                    <h3 className="text-lg font-bold text-indigo-600">Price: ${results.price.toFixed(2)}</h3>
                </div>
            </div>
            <div className="bg-white rounded mt-4">
                <h3 className="text-lg font-bold mb-2">Nearby Amenities:</h3>
                <ul>
                    {results.amenities.map((amenity, index) => (
                        <li key={index} className="mb-2">
                            <div className="bg-gray-200 px-4 py-2 rounded-lg">
                                <span className="font-bold">{amenity.name}</span> - {amenity.vicinity} ({amenity.rating} stars, {amenity.user_ratings_total} reviews)
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Results;
