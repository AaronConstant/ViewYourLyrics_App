import React from 'react'
import lyricConverter from './lyricConverter';

export default function Homepage({ mood, setMood, lyrics, setLyrics, generateLyrics, generatedLyrics }) {
  return (
    <div className='App-box'>
      <form className='form' onSubmit={(e) => { e.preventDefault(); generateLyrics(); }}>
        <div className='form__mood'>
          <label>Set the Mood:</label>
          <input placeholder='Give us a Vibe' type="text" value={mood} onChange={(e) => setMood(e.target.value)} />
        </div>
        <div className='form__lyrics'>
          <label>Create the Dream:</label>
          <textarea  placeholder='Brief description of Your Song' value={lyrics} onChange={(e) => setLyrics(e.target.value)} />
        </div>
        <button type="submit">Generate Lyrics</button>
      </form>
      {generatedLyrics && <lyricConverter lyrics={generatedLyrics} />}
    </div>
  )
}
