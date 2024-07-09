import React, { useState } from 'react'
import Form from './components/Form'
import Results from './components/Results'

const App = () => {
  const [results, setResults] = useState(null)

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-3xl mx-auto px-4 py-4">
        <h1 className="text-3xl font-bold mb-6 text-center">House Price Predictor</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Form setResults={setResults} />
          {results && <Results results={results} />}
        </div>
      </div>
    </div>
  )
}

export default App 
