import React, { useState } from 'react';
import axios from 'axios';
import VideoConverter from './VideoConverter';

const API = import.meta.env.VITE_BASE_URL || "http://localhost:4000";

function Home() {
  const [lyrics, setLyrics] = useState('');
  const [mood, setMood] = useState('');
  const [generatedLyrics, setGeneratedLyrics] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const generateLyrics = async () => {
    try {
      const response = await axios.post(
        `${API}/ai`,
        {
          prompt: lyrics,
          mood: mood
        }
      );
      setGeneratedLyrics(response.data);
    } catch (error) {
      console.error("Error generating lyrics:", error);
    }
  };

  const handleVideoConversion = async () => {
    if (!generatedLyrics) {
      setError('Please generate lyrics before converting to video.');
      return;
    }

    setIsLoading(true);
    setError('');
  
    try {
      const response = await axios.post(`${API}/videoconverter`, { 
        lyrics: JSON.stringify({
          name: generatedLyrics.name,
          intro: generatedLyrics.intro,
          chorus: generatedLyrics.chorus,
          verses: generatedLyrics.verses,
          bridge: generatedLyrics.bridge
        })
      });
  
      console.log("Video conversion response:", response);
  
      if (response.data.videoUrl) {
        const fullVideoUrl = `${API}${response.data.videoUrl}`;
        setVideoUrl(fullVideoUrl);
        console.log("Video URL:", fullVideoUrl);
      } else {
        setError('No video URL returned from server.');
      }
    } catch (error) {
      console.error("Error converting lyrics to video", error);
      setError(error.response?.data?.error || 'Failed to convert lyrics to video');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='Homepage'>
      <h2>Let's get you started!</h2>
      <textarea
        placeholder="Enter your lyrics here..."
        value={lyrics}
        onChange={(e) => setLyrics(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter the mood..."
        value={mood}
        onChange={(e) => setMood(e.target.value)}
      />
      <button onClick={generateLyrics}>Generate Lyrics</button>

      {generatedLyrics && (
        <div className="GeneratedLyrics">
          <h2>{generatedLyrics.name}</h2>
          <p><em>{mood.toUpperCase()} MOOD</em></p>
          <br />
          <p><strong>INTRO:</strong></p>
          <p>{generatedLyrics.intro}</p>
          <br />
          {generatedLyrics.verses.map((verse, index) => (
            <div key={index}>
              <p><strong>VERSE {index + 1}:</strong></p>
              <p>{verse}</p>
              <br />
            </div>
          ))}
          <p><strong>CHORUS:</strong></p>
          <p>{generatedLyrics.chorus}</p>
          <br />
          <p><strong>BRIDGE:</strong></p>
          <p>{generatedLyrics.bridge}</p>
          <br />
          <p><strong>CHORUS:</strong></p>
          <p>{generatedLyrics.chorus}</p>
        </div>
      )}

      <button
        onClick={handleVideoConversion}
        disabled={isLoading}
        className="convert-button"
      >
        {isLoading ? 'Creating Video...' : 'Convert to Video'}
      </button>

      {error && <div className="error-message">{error}</div>}
      {videoUrl && <VideoConverter videoUrl={videoUrl} />}
    </div>
  );
}

export default Home;
