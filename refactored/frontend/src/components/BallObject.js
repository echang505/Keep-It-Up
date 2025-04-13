import React from 'react';

function BallObject({ x, y }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${x - 25}px`,
        top: `${y - 25}px`,
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: 'hotpink',
        zIndex: 1,
        boxShadow: '0 0 10px rgba(0,0,0,0.3)',
      }}
    />
  );
}

export default BallObject;