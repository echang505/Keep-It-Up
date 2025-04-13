import React, { useState, useEffect } from 'react';
import bliss from '../assets/sprites/bliss.png';
import settings1 from '../assets/sprites/settingsTitle1.png';
import settings2 from '../assets/sprites/settingsTitle2.png';
import backSprite1 from '../assets/sprites/back1.png';
import backSprite2 from '../assets/sprites/back2.png';

function SpriteImage({ frames, width = 170, height = 50 }) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(prev => (prev === 0 ? 1 : 0));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundImage: `url(${frames[frame]})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        marginTop: '-180px'
      }}
    />
  );
}

function SpriteButton({ onClick, text, frames }) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(prev => (prev === 0 ? 1 : 0));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <button
      onClick={onClick}
      style={{
        width: '370px',
        height: '110px',
        backgroundImage: `url(${frames[frame]})`,
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: 'black',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        margin: '2rem 0',
      }}
    >
      {text}
    </button>
  );
}

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
        overflow: 'hidden',  // Prevent scrolling
        position: 'fixed',   // Fix the component in place
        top: 0,             // Start from the top
        left: 0,            // Start from the left
        right: 0,           // Span full width
        bottom: 0,          // Span full height
      }}
    >
      {/* Background Layer */}
      <div
        style={{
          backgroundImage: `url(${bliss})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          opacity: 0.3,
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
          zIndex: 0,
        }}
      />

      {/* Foreground Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* <h1 style={{ fontSize: '4rem', margin: '0.5rem' }}>SETTINGS</h1> */}
        <SpriteImage frames={[settings1, settings2]} width={700} height={200} />
        
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

        {/* <button
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
        </button> */}
        <SpriteButton
            onClick={() => setGameStatus("start-screen")}
            frames={[backSprite1, backSprite2]}
        />
      </div>
    </div>
  );
}

export default Settings; 