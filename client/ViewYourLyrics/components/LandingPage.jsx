import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../src/Styling/LandingPage.scss';

function LandingPage() {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [yesConfirmed, setYesConfirmed] = useState(true);
  const navigate = useNavigate();

  const handleHomeRouting = () => {
    navigate('/home');
    setYesConfirmed(true);
  }


  const handleStartClick = () => {
    setShowConfirmation(true);
    setYesConfirmed(false);
  };

  const handleConfirmYes = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      navigate('/home'); 
    }, 2000); 
  };

  return (
    <div className={`LandingPage ${isFadingOut ? 'fade-out' : ''}`}>
      <h1>Oh Hello There!</h1>
      <h2>Welcome to our Platform</h2>
      <h1 className="brand">Kanioki</h1>
      <h3>Are you ready to start?</h3>
      <div className="button-container">
        <button onClick={handleHomeRouting}>Yes</button>
        <button onClick={handleStartClick}>No</button>
      </div>

      {showConfirmation && !yesConfirmed && (
        <div className="confirmation-dialog fade-in">
          <h3>I Think you meant to click...?</h3>
          <div className="button-container">
            <button onClick={handleConfirmYes}>Yes</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;