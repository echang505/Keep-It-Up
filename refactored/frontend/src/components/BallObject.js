import React from 'react';
import balloonBlue from '../assets/sprites/balloon_blue.png';

function BallObject({ x, y }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${x - 25}px`,
        top: `${y - 25}px`,
        width: '50px',
        height: '50px',
        backgroundImage: `url(${balloonBlue})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        zIndex: 1,
      }}
    />
  );
}

export default BallObject;