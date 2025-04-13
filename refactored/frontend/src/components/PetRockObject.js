import React, { useState, useEffect, useRef } from 'react';
import petrock from '../assets/sprites/petrock.png';
import './BallObject.css'; // Reusing the same CSS for wobble animation

function PetRockObject({ x, y, isColliding }) {
  const [isWobbling, setIsWobbling] = useState(false);
  const wobbleTimeoutRef = useRef(null);
  const prevCollisionRef = useRef(false);

  useEffect(() => {
    // Only trigger wobble when collision state changes from false to true
    if (isColliding && !prevCollisionRef.current) {
      // Clear any existing timeout to prevent animation interruption
      if (wobbleTimeoutRef.current) {
        clearTimeout(wobbleTimeoutRef.current);
      }
      
      // Force a re-render by setting isWobbling to false first
      setIsWobbling(false);
      
      // Use requestAnimationFrame to ensure the state change is processed
      requestAnimationFrame(() => {
        setIsWobbling(true);
        
        // Set up timeout to end the wobble
        wobbleTimeoutRef.current = setTimeout(() => {
          setIsWobbling(false);
        }, 200);
      });
    }
    
    // Update the previous collision state
    prevCollisionRef.current = isColliding;
    
    // Clean up timeout on unmount
    return () => {
      if (wobbleTimeoutRef.current) {
        clearTimeout(wobbleTimeoutRef.current);
      }
    };
  }, [isColliding]);

  return (
    <div
      className={isWobbling ? 'balloon-wobble' : ''}
      style={{
        position: 'absolute',
        left: `${x - 25}px`,
        top: `${y - 25}px`,
        width: '50px',
        height: '50px',
        backgroundImage: `url(${petrock})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        zIndex: 1,
      }}
    />
  );
}

export default PetRockObject; 