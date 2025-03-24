import { useState, useRef } from 'react'
import './Styling/App.scss'
import axios from 'axios'
import Homepage from '../components/Homepage'
import { CSSTransition } from 'react-transition-group'

function App() {
  const [lyrics, setLyrics] = useState('')
  const [mood, setMood] = useState('')
  const [generatedLyrics, setGeneratedLyrics] = useState(null)
  const API = import.meta.env.VITE_BASE_URL
  const [showHomepage, setShowHomepage] = useState(false)
  const nodeRef = useRef(null)

  const generateLyrics = async () => {
    try {
      const response = await axios.post(`${API}/ai`, {
        prompt: lyrics,
        mood: mood
      })
      setGeneratedLyrics(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleStartClick = () => {
    setShowHomepage(true)
  }

  return (
    <div className='App-box'>
      <h1>Want to create Passionate Song?</h1>
      <button onClick={handleStartClick}>Yes!</button>
      <CSSTransition
        in={showHomepage}
        timeout={1000}
        classNames="fade"
        unmountOnExit
        nodeRef={nodeRef}
      >
        <div ref={nodeRef}>
          <h2>Let's get you started!</h2>
          <Homepage 
            mood={mood} 
            setMood={setMood} 
            lyrics={lyrics} 
            setLyrics={setLyrics} 
            generateLyrics={generateLyrics} 
            generatedLyrics={generatedLyrics} 
          />
        </div>
      </CSSTransition>
    </div>
  )
}

export default App
