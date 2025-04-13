import React, { useState } from 'react';

function Settings({setGameStatus}) {
  const [volume, setVolume] = useState(50);

  const handleVolumeChange = (value) => {
    setVolume(value);
    // In a real app, you would save this setting to localStorage or a backend
    console.log('Volume updated:', value);
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Comic Sans MS, sans-serif',
      }}
    >
      <h1 style={{ fontSize: '4rem', margin: '0.5rem' }}>SETTINGS</h1>
      
      <div
        style={{
          width: '80%',
          maxWidth: '600px',
          margin: '2rem',
          padding: '1rem',
          borderRadius: '10px',
          border: '5px solid black',
          background: 'white',
        }}
      >
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '1.5rem', marginRight: '1rem' }}>
            Volume:
          </label>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={volume}
            onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
            style={{ width: '200px' }}
          />
          <span style={{ fontSize: '1.2rem', marginLeft: '1rem' }}>{volume}%</span>
        </div>
      </div>

      <button
        onClick={() => setGameStatus("start-screen")}
        style={{
          fontSize: '2rem',
          padding: '10px 30px',
          borderRadius: '20px',
          margin: '1rem',
          border: '5px solid black',
          background: 'white',
          cursor: 'pointer',
        }}
      >
        BACK
      </button>
    </div>
  );
}

export default Settings; 