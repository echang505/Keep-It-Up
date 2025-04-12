import React from 'react';
import GameCanvas from './components/GameCanvas';
import ScoreMessage from './components/ScoreMessage';

function App() {
  return (
    <div>
      <ScoreMessage />
      <GameCanvas />
    </div>
  );
}

export default App;
