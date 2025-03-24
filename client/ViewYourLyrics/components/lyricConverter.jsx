import React from 'react'

export default function lyricConverter({ lyrics }) {
  return (
    <div>
      <h2>Generated Song</h2>
      <pre>{JSON.stringify(lyrics, null, 2)}</pre>
    </div>
  )
}
