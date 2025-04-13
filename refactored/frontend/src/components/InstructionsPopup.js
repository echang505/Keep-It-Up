import React, { useState, useEffect } from 'react';
import './InstructionsPopup.css';

const InstructionsPopup = ({ onClose }) => {
  return (
    <div className="instructions-overlay">
      <div className="instructions-popup">
        <h2>How to Play</h2>
        <div className="instructions-content">
          <p>Welcome to Keep It Up!</p>
          <ul>
            <li>Use your thumb to keep falling objects in the air</li>
            <li>Each successful bounce earns you points</li>
            <li>If an object hits the ground, you lose</li>
            <li>Try to get the highest score possible!</li>
          </ul>
          <p>Good luck!</p>
        </div>
        <button className="close-button" onClick={onClose}>
          Got it!
        </button>
      </div>
    </div>
  );
};

export default InstructionsPopup; 