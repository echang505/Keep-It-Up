import React, { useState, useEffect } from 'react';
import bomb1 from '../assets/sprites/bomb1.png';
import bomb2 from '../assets/sprites/bomb2.png';
import './BombObject.css';

function BombObject({ x, y, isExploding, onExplode }) {
  const [frame, setFrame] = useState(0);
  
  // Animate between bomb1 and bomb2 sprites
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(prev => (prev === 0 ? 1 : 0));
    }, 500);
    return () => clearInterval(interval);
  }, []);
  
  // Handle explosion
  useEffect(() => {
    if (isExploding) {
      // Call onExplode callback when explosion starts
      if (onExplode) {
        onExplode();
      }
      
      // Reset explosion state after animation completes
      const timer = setTimeout(() => {
        // This will be handled by the parent component
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isExploding, onExplode]);

  return (
    <div
      className={isExploding ? 'bomb-explode' : ''}
      style={{
        position: 'absolute',
        left: `${x - 35}px`,
        top: `${y - 35}px`,
        width: '70px',
        height: '70px',
        backgroundImage: `url(${frame === 0 ? bomb1 : bomb2})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        zIndex: 1,
      }}
    />
  );
}

export default BombObject; 