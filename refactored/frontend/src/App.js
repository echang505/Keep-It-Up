import React from 'react';
import GameCanvas from './components/GameCanvas';
import ScoreMessage from './components/ScoreMessage';
import StartScreen from './components/StartScreen';
import Scoreboard from './components/Scoreboard';
import Settings from './components/Settings';
import GameOverScreen from './components/GameOverScreen';
import ObjectSelectionScreen from './components/ObjectSelectionScreen';


function App() {
  // "start-screen": start screen
  // "object-selection-screen": object selection screen
  // "game-screen": playing game
  // "scores-screen": scores screen
  // "settings-screen": settings screen
  // "game-over-screen": game over screen
  const [gameStatus, setGameStatus] = React.useState("start-screen");
  const [score, setScore] = React.useState(0); 
  const currentScoreRef = React.useRef(0); 
  const [selectedObject, setSelectedObject] = React.useState("balloon"); // Default to balloon

  let content;
  if (gameStatus === "start-screen") {
    content = (
      <StartScreen
        setGameStatus={setGameStatus}
      />
    );
  } else if (gameStatus === "object-selection-screen") {
    content = (
      <ObjectSelectionScreen
        setGameStatus={setGameStatus}
        setSelectedObject={setSelectedObject}
      />
    );
  } else if (gameStatus === "game-screen") {
    content = (
      <>
        <GameCanvas
          setGameStatus={setGameStatus}
          currentScoreRef={currentScoreRef}
          setScore={setScore}
          selectedObject={selectedObject}
        />
        <ScoreMessage
            score={score} 
          />
      </>
    );
  } else if (gameStatus === "game-over-screen") {
    content = (
      <>
        
        <GameOverScreen 
          setGameStatus={setGameStatus}
          score={score}
          />
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
