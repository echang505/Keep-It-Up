import React from 'react';
import './ScoreMessage.css';

function ScoreMessage({score}) {
  return <div id="message">Score: {score}</div>;
}

export default ScoreMessage;
