import { Routes, Route } from 'react-router-dom';
import HomePage from '../components/Home';
import LandingPage from '../components/LandingPage';
import './Styling/AppStyling.scss';

function App() {
  return (
    <div className="App-box">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default App;
