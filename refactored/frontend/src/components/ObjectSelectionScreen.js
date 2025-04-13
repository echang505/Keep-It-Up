import React, { useState, useEffect } from 'react';
import balloonBlue from '../assets/sprites/balloon_blue.png';
import petrock from '../assets/sprites/petrock.png';
import ballRed from '../assets/sprites/ball_red.png';
import bliss from '../assets/sprites/bliss.png';
import clickSound from '../assets/sprites/mouse.mp3';
import { useAudio } from '../context/AudioContext';

function SpriteButton({ onClick, text, frames }) {
  const [frame, setFrame] = useState(0);
  const { playSound } = useAudio();

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(prev => (prev === 0 ? 1 : 0));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    playSound(clickSound);
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      style={{
        width: '300px',
        height: '100px',
        backgroundImage: `url(${frames[frame]})`,
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: 'black',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        margin: '0rem 0',
      }}
    >
      {text}
    </button>
  );
}

function ObjectSelectionScreen({ setGameStatus, setSelectedObject }) {
  const { playSound } = useAudio();
  
  const handleObjectSelect = (objectType) => {
    playSound(clickSound);
    setSelectedObject(objectType);
    setGameStatus("game-screen");
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
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
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
        <h1 style={{ fontSize: '3rem', margin: '0.5rem', marginBottom: '2rem', color: 'black', textShadow: 'none' }}>
          Choose Your Object
        </h1>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
          <div 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              cursor: 'pointer',
              padding: '1rem',
              borderRadius: '10px',
              border: '3px solid transparent',
              transition: 'border-color 0.3s',
              ':hover': {
                borderColor: 'black',
              }
            }}
            onClick={() => handleObjectSelect('balloon')}
          >
            <div
              style={{
                width: '100px',
                height: '100px',
                backgroundImage: `url(${balloonBlue})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                marginBottom: '1rem',
              }}
            />
            <h3 style={{ margin: 0 }}>Balloon</h3>
          </div>
          
          <div 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              cursor: 'pointer',
              padding: '1rem',
              borderRadius: '10px',
              border: '3px solid transparent',
              transition: 'border-color 0.3s',
              ':hover': {
                borderColor: 'black',
              }
            }}
            onClick={() => handleObjectSelect('petrock')}
          >
            <div
              style={{
                width: '100px',
                height: '100px',
                backgroundImage: `url(${petrock})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                marginBottom: '1rem',
              }}
            />
            <h3 style={{ margin: 0 }}>Pet Rock</h3>
          </div>
          
          <div 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              cursor: 'pointer',
              padding: '1rem',
              borderRadius: '10px',
              border: '3px solid transparent',
              transition: 'border-color 0.3s',
              ':hover': {
                borderColor: 'black',
              }
            }}
            onClick={() => handleObjectSelect('bouncyball')}
          >
            <div
              style={{
                width: '100px',
                height: '100px',
                backgroundImage: `url(${ballRed})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                marginBottom: '1rem',
              }}
            />
            <h3 style={{ margin: 0 }}>Bouncy Ball</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ObjectSelectionScreen; 