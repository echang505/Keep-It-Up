import React, { useState, useEffect } from 'react';
import logoSprite1 from '../assets/sprites/logo1.png';
import logoSprite2 from '../assets/sprites/logo2.png';
import startSprite1 from '../assets/sprites/start1.png';
import startSprite2 from '../assets/sprites/start2.png';
import scoresSprite1 from '../assets/sprites/scores1.png';
import scoresSprite2 from '../assets/sprites/scores2.png';
import settingsSprite1 from '../assets/sprites/settings1.png';
import settingsSprite2 from '../assets/sprites/settings2.png';
import bliss from '../assets/sprites/bliss.png';

function SpriteImage({ frames, width = 200, height = 80 }) {
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
        width: '450px',
        height: '120px',
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

function StartScreen({ setGameStatus }) {
  console.log("StartScreen");
      <button
        onClick={() => {
          setGameStatus("game-screen");
        }}
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
        START
      </button>

  return (
    <div style={{ 
      height: '100vh', 
      width: '100vw', 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden'
    }}>
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
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          fontFamily: 'Comic Sans MS, sans-serif',
        }}
      >
        {/* Left Side: Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'right',
          }}
        >
          <SpriteImage frames={[logoSprite1, logoSprite2]} width={650} height={650} />
        </div>

        {/* Right Side: Buttons */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SpriteButton
            onClick={() => setGameStatus("game-screen")}
            frames={[startSprite1, startSprite2]}
          />
          <SpriteButton
            onClick={() => setGameStatus("scores-screen")}
            frames={[scoresSprite1, scoresSprite2]}
          />
          <SpriteButton
            onClick={() => setGameStatus("settings-screen")}
            frames={[settingsSprite1, settingsSprite2]}
          />
        </div>
      </div>
    </div>
  );
}

export default StartScreen;
