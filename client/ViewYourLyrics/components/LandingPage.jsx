import { useNavigate } from 'react-router-dom'

function LandingPage() {
  const navigate = useNavigate()

  const handleStartClick = () => {
    navigate('/home')
  }

  return (
    <div className='LandingPage'>
      <h1>Want to create Passionate Song?</h1>
      <button onClick={handleStartClick}>Yes!</button>
    </div>
  )
}

export default LandingPage