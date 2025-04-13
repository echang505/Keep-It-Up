import React from 'react';
import GameCanvas from './components/GameCanvas';
import ScoreMessage from './components/ScoreMessage';
import StartScreen from './components/StartScreen';
import Scoreboard from './components/Scoreboard';
import Settings from './components/Settings';

function App() {
  // "start-screen": start screen
  // "game-screen": playing game
  // "scores-screen": scores screen
  // "settings-screen": settings screen
  // "game-over-screen": game over screen
  const [gameStatus, setGameStatus] = React.useState("start-screen");

  let content;
  if (gameStatus === "start-screen") {
    content = (
      <StartScreen
        setGameStatus={setGameStatus}
      />
    );
  } else if (gameStatus === "game-screen") {
    content = (
      <>
        <GameCanvas
          setGameStatus={setGameStatus}
        />
        <ScoreMessage />
      </>
    );
  } else if (gameStatus === "scores-screen") {
    content = (
      <Scoreboard
        setGameStatus={setGameStatus}
      />
    );
  } else if (gameStatus === "settings-screen") {
    content = (
      <Settings
        setGameStatus={setGameStatus}
      />
    );
  } else {
    content = <>Testing</>;
  }

  return (
    <div>
      {content}
    </div>
  );
}

export default App;
