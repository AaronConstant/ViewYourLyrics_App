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

  console.log("Full Video URL from Home Component: ", videoUrl);
  console.log()

  return (
    <div className="video-container">
      <h3>Your Lyrics Video</h3>
      <video width="120%" controls>
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      <div className="video-controls">
        {console.log("Video URL: ", videoUrl)}
        <button onClick={handleDownload} className="download-button">
          Download Video
        </button>
      </div>
    </div>  
  );
}