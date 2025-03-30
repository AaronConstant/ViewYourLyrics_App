import React from 'react';

export default function VideoConverter({ videoUrl }) {
  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = 'lyrics-video.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="video-container">
      <h3>Your Lyrics Video</h3>
      <video width="100%" controls>
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      <div className="video-controls">
        <button onClick={handleDownload} className="download-button">
          Download Video
        </button>
      </div>
    </div>  
  );
}