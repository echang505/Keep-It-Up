import React from 'react';
import './LaserObject.css';

function LaserObject({ isHorizontal, position, state }) {
  const isWarning = state === 'warning';
  const isFiring = state === 'firing';

  return (
    <div
      className={`laser ${isWarning ? 'laser-warning' : ''} ${isFiring ? 'laser-firing' : ''}`}
      style={{
        position: 'absolute',
        ...(isHorizontal
          ? {
              left: 0,
              top: `${position}px`,
              width: '100%',
              height: '4px',
            }
          : {
              top: 0,
              left: `${position}px`,
              width: '4px',
              height: '100%',
            }),
        zIndex: 1,
      }}
    />
  );
}

export default LaserObject; 