import React from 'react'
import backgroundImage from '../assets/home_bg.jpg'

const HomePage = () => {
    return (
        <div 
            className="flex flex-col items-center justify-center overflow-hidden" 
            style={{ 
                backgroundImage: `url(${backgroundImage})`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center', 
                height: '91vh'
            }}
        >
            <h1 className="text-5xl font-bold text-black">Welcome to Real Estate</h1>
            <p className="mt-4 text-xl text-black">Find your dream home with us</p>
        </div>
    )
}

export default HomePage
