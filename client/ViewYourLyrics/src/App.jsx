import { useState } from 'react'
import './App.css'
import axios from 'axios'
import lyricConverter from '../components/lyricConverter'

function App() {
  const [lyrics, setLyrics] = useState()
  const [mood, setMood] = useState()
  const API = import.meta.env.VITE_BASE_URL

  const generateLyrics = async () => {
    try {
      const response = await axios.post('http://localhost:3001/ai', {
        prompt: lyrics,
        mood: mood
      })
      console.log(response.data)
    } catch (error) {
      console.error(error)
    }

  }
  


  return (
    <div> Want to create Passionate Song? </div>


  )
}

export default App
