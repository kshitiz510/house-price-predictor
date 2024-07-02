import React, { useState } from 'react'
import Form from './components/Form'
import Results from './components/Results'

const App = () => {
  const [results, setResults] = useState(null)

  return (
    <div className="app">
      <h1>House Price Predictor</h1>
      <Form setResults={setResults} />
      {results && <Results data={results} />}
    </div>
  )
}

export default App 
