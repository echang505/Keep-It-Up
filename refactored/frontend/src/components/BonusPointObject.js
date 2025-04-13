import React from 'react';
import pointBonus from '../assets/sprites/pointBonus.png';

function BonusPointObject({ x, y }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${x - 35}px`,
        top: `${y - 35}px`,
        width: '70px',
        height: '70px',
        backgroundImage: `url(${pointBonus})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        zIndex: 1,
      }}
    />
  );
}

export default BonusPointObject; 