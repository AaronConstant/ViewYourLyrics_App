import React, { useState } from 'react';
import axios from 'axios'; 
import VideoConverter from './VideoConverter';

const API = import.meta.env.VITE_BASE_URL || "http://localhost:4000"

export default function LyricConverter({ lyrics }) {
  const {
    mood,
    name,
    intro,
    chorus,
    verses,
    bridge
  } = lyrics;



  const [videoUrl, setVideoUrl] = useState(null);

  const handleVideoConversion = async () => {
    try {
      const response = await axios.post(`${API}/videoconverter`, { lyrics: JSON.stringify(lyrics) });
      console.log(response);
      if (response.data.videoUrl) {
        setVideoUrl(response.data.videoUrl);
        console.log("Video URL:", response.data.videoUrl);
      }
    } catch (error) {
      console.error("Error converting lyrics to video", error);
    }
  };

  return (
    <div>
      <h2>Generated Song: {name}</h2>

      <div>
        <h3>Mood: {mood}</h3>
      </div>

      <div>
        <h3>Intro:</h3>
        <p>{intro}</p>
      </div>

      <div>
        <h3>Verse 1:</h3>
        <p>{verses[0]}</p>
      </div>

      <div>
        <h3>Chorus:</h3>
        <p>{chorus}</p>
      </div>

      <div>
        <h3>Verse 2:</h3>
        <p>{verses[1]}</p>
      </div>

      <div>
        <h3>Chorus:</h3>
        <p>{chorus}</p>
      </div>

      <div>
        <h3>Verse 3:</h3>
        <p>{verses[2]}</p>
      </div>

      <div>
        <h3>Bridge:</h3>
        <p>{bridge}</p>
      </div>

      <div>
        <h3>Chorus:</h3>
        <p>{chorus}</p>
      </div>

      <button onClick={handleVideoConversion}>Convert to Video</button>

      {videoUrl && <VideoConverter videoUrl={videoUrl} />}
    </div>
  );
}
