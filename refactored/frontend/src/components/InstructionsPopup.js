import React, { useState, useEffect } from 'react';
import '../styles/InstructionsPopup.css';
import clickSound from '../assets/sprites/mouse.mp3';
import { useAudio } from '../context/AudioContext';

const InstructionsPopup = ({ onClose }) => {
  const { playSound } = useAudio();
  
  const handleClose = () => {
    playSound(clickSound);
    onClose();
  };
  
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
        <button className="close-button" onClick={handleClose}>
          Got it!
        </button>
      </div>
    </div>
  );
};

export default InstructionsPopup; 