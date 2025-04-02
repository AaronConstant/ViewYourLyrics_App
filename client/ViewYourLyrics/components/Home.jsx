import React, { useState } from 'react';
import axios from 'axios';
import VideoConverter from './VideoConverter';
import '../src/Styling/Home.scss';
const API = import.meta.env.VITE_BASE_URL || "http://localhost:4000";

function Home() {
  const [lyrics, setLyrics] = useState('');
  const [mood, setMood] = useState('');
  const [generatedLyrics, setGeneratedLyrics] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [isLyricsLoading, setIsLyricsLoading] = useState(false);
  const [error, setError] = useState('');

  const generateLyrics = async () => {
    if (!lyrics.trim() || !mood.trim()) {
      setError('Please enter both a mood and description');
      return;
    }

    setIsLyricsLoading(true);
    setError('');
    
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
      setError(error.response?.data?.error || 'Failed to generate lyrics');
    } finally {
      setIsLyricsLoading(false);
    }
  };

  const handleVideoConversion = async () => {
    if (!generatedLyrics) {
      setError('Please generate lyrics before converting to video.');
      return;
    }

    setIsVideoLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API}/videoconverter`, { 
        lyrics: JSON.stringify({
          name: formatLyrics(generatedLyrics.name),
          intro: formatLyrics(generatedLyrics.intro),
          chorus: formatLyrics(generatedLyrics.chorus),
          verses: generatedLyrics.verses.map(formatLyrics),
          bridge: formatLyrics(generatedLyrics.bridge)
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
      setIsVideoLoading(false);
    }
  };

  const formatLyrics = (text) => {
    if (!text) return '';

    const formattedText = text.replace(/,/g, ',\n');
    return formattedText;
  };


  return (
    <div className='Homepage'>
      <h2>Let's get you started!</h2>
      <input
        type="text"
        placeholder="Enter the mood..."
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        disabled={isLyricsLoading}
      />
      <textarea
        placeholder="Give us a brief description..."
        value={lyrics}
        onChange={(e) => setLyrics(e.target.value)}
        disabled={isLyricsLoading}
      />
      <button 
        onClick={generateLyrics} 
        disabled={isLyricsLoading}
        className={isLyricsLoading ? 'loading-button' : ''}
      >
        {isLyricsLoading ? (
          <div className="loading-container">
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span>Creating lyrics</span>
          </div>
        ) : 'Generate Lyrics'}
      </button>

      {error && <div className="error-message">{error}</div>}

      {isLyricsLoading && (
        <div className="lyrics-loading-animation">
          <div className="music-notes">
            <span>♪</span>
            <span>♫</span>
            <span>♪</span>
            <span>♫</span>
          </div>
          <p>Crafting your lyrics...</p>
        </div>
      )}

      {generatedLyrics && !isLyricsLoading && (
        <div className="GeneratedLyrics">
          <h2>{generatedLyrics.name}</h2>
          <p><em>{mood.toUpperCase()} MOOD</em></p>
          <br />
          <p><strong>INTRO:</strong></p>
          <p>{formatLyrics(generatedLyrics.intro)}</p>
          <br />
          {generatedLyrics.verses.map((verse, index) => (
            <div key={index}>
              <p><strong>VERSE {index + 1}:</strong></p>
              <p>{formatLyrics(verse)}</p>
              <br />
            </div>
          ))}
          <p><strong>CHORUS:</strong></p>
          <p>{formatLyrics(generatedLyrics.chorus)}</p>
          <br />
          <p><strong>BRIDGE:</strong></p>
          {  console.log(formatLyrics(generatedLyrics.bridge))}
          
          <p>{formatLyrics(generatedLyrics.bridge)}</p>
          <br />
          <p><strong>CHORUS:</strong></p>
          <p>{formatLyrics(generatedLyrics.chorus)}</p>
        </div>
      )}

      <button
        onClick={handleVideoConversion}
        disabled={isVideoLoading || !generatedLyrics}
        className={`convert-button ${isVideoLoading ? 'loading-button' : ''}`}
      >
        {isVideoLoading ? (
          <div className="loading-container">
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span>Creating Video</span>
          </div>
        ) : 'Convert to Video'}
      </button>

      {videoUrl && <VideoConverter videoUrl={videoUrl} />}
    </div>
  );
}

export default Home;