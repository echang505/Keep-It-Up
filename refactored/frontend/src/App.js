import React from 'react';
import GameCanvas from './components/GameCanvas';
import ScoreMessage from './components/ScoreMessage';
import StartScreen from './components/StartScreen';
import GameOverScreen from './components/GameOverScreen';
function App() {
  // "start-screen": start screen
  // "game-screen": playing game
  // "scores-screen": scores screen
  // "settings-screen": settings screen
  // "game-over-screen": game over screen
  const [gameStatus, setGameStatus] = React.useState("start-screen");
  const [score, setScore] = React.useState(0); 
  const currentScoreRef = React.useRef(0); 

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
          currentScoreRef={currentScoreRef}
          setScore={setScore}
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
