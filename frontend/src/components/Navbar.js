import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div 
          className="flex justify-between items-center h-14"
          style = {{ height: "9vh" }}
        >
          <div className="flex space-x-4">
            <div>
              <Link to="/" className="flex items-center py-5 px-2 text-gray-700 hover:text-gray-900">
                <span className="font-bold">UrbanNest</span>
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Link to="/" className="py-5 px-3 text-gray-700 hover:text-gray-900">Buy</Link>
            <Link to="/" className="py-5 px-3 text-gray-700 hover:text-gray-900">Sell</Link>
            {/* <Link to="/" className="py-5 px-3 text-gray-700 hover:text-gray-900">Rent</Link> */}
            <Link to="/" className="py-5 px-3 text-gray-700 hover:text-gray-900">Saved Homes</Link>
            <Link to="/predict" className="py-5 px-3 text-gray-700 hover:text-gray-900">Predict</Link>
            <Link to="/" className="py-5 px-3 text-gray-700 hover:text-gray-900">Contact</Link>
          </div>
          <div className="flex items-center space-x-1.5">
            <Link to="/login" className="py-2 px-3 bg-blue-500 text-white rounded-md hover:bg-blue-700">Login</Link>
            <Link to="/signup" className="py-2 px-3 bg-gray-500 text-white rounded-md hover:bg-gray-700">Signup</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
