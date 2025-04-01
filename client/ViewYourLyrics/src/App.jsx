import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './Styling/App.scss'
import HomePage from '../components/Home'
import LandingPage from '../components/LandingPage'
import Home from '../components/Homepage'

function App() {

  return (
    <div className='App-box'>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage/>}
        />
      </Routes>
    </div>
  )
}

export default App
