import React from 'react';

export default function VideoConverter({ videoUrl }) {
  return (
    <div>
      <h3>Your Video:</h3>
      <video width="100%" controls>
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>  
  );
}
