import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './components/HomePage'
import Form from './components/Form'
import Results from './components/Results'

const App = () => {
  const [results, setResults] = useState(null)

  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route 
            path="/" 
            element={
              <HomePage />
            } 
          />

          <Route
            path="/predict"
            element={
              <div className="bg-[rgb(200,220,240)] flex items-center justify-center" style={{minHeight: '91vh'}} >
                <div className="max-w-3xl mx-auto px-4 py-6">
                  <h1 className="text-3xl font-bold mb-3.5 text-center">House Price Predictor</h1>
                  <div className="bg-white px-4 pt-6 pb-2 rounded-lg shadow-lg">
                    <Form setResults={setResults} />
                    {results && <Results results={results} />}
                  </div>
                </div>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
