import React, { useState, useEffect } from 'react';
import SaveScoreForm from './SaveScoreForm';
import bliss from '../assets/sprites/bliss.png';
import gameOverSprite1 from '../assets/sprites/gameover1.png';
import gameOverSprite2 from '../assets/sprites/gameover2.png';
import saveSprite1 from '../assets/sprites/savescore.png';
import saveSprite2 from '../assets/sprites/savescore2.png';
import saveSpriteGray1 from '../assets/sprites/savescoreGrayed.png';
import saveSpriteGray2 from '../assets/sprites/savescoreGrayed2.png';
import playAgainSprite1 from '../assets/sprites/playagain.png';
import playAgainSprite2 from '../assets/sprites/playagain2.png';
import mainMenu1 from '../assets/sprites/mainmenu.png';
import mainMenu2 from '../assets/sprites/mainmenu2.png';

function SpriteImage({ frames, width = 200, height = 80 }) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(prev => (prev === 0 ? 1 : 0));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundImage: `url(${frames[frame]})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        marginTop:'-40px'
      }}
    />
  );
}


function SpriteButton({ onClick, text, frames }) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(prev => (prev === 0 ? 1 : 0));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <button
      onClick={onClick}
      style={{
        width: '300px',
        height: '100px',
        backgroundImage: `url(${frames[frame]})`,
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: 'black',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        margin: '0rem 0',
      }}
    >
      {text}
    </button>
  );
}

function GameOverScreen({ setGameStatus, score }) {
    const [showSaveForm, setShowSaveForm] = React.useState(false);
    
    return (
        <div
            style={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Comic Sans MS, sans-serif',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                overflow: 'hidden',
            }}
        >
            {/* Background Layer */}
            <div
                style={{
                    backgroundImage: `url(${bliss})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    opacity: 0.3,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: '100%',
                    zIndex: 0,
                }}
            />

            {/* Foreground Content */}
            <div
                style={{
                    position: 'relative',
                    zIndex: 1,
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {/* <h1 style={{ fontSize: '4rem', margin: '0.5rem' }}>Game Over!</h1> */}
                <SpriteImage frames={[gameOverSprite1, gameOverSprite2]} width={700} height={200} />
                <h2 style={{ fontSize: '3rem', margin: '0.5rem', marginBottom: '1.8rem' }}>Your Score: {score}</h2>

                {/* <button
                    onClick={() => {
                        setShowSaveForm(true);
                    }}
                    style={{
                        fontSize: '2rem',
                        padding: '10px 30px',
                        borderRadius: '20px',
                        margin: '1rem',
                        border: '5px solid black',
                        background: 'white',
                        cursor: 'pointer',
                    }}
                >
                    Save Score
                </button> */}

                <SpriteButton
                    onClick={() => setShowSaveForm(true)}
                    frames={[saveSprite1, saveSprite2]}
                />
                
                {/* <button
                    onClick={() => {
                        setGameStatus("game-screen");
                    }}
                    style={{
                        fontSize: '2rem',
                        padding: '10px 30px',
                        borderRadius: '20px',
                        margin: '1rem',
                        border: '5px solid black',
                        background: 'white',
                        cursor: 'pointer',
                    }}
                >
                    Play Again
                </button>             */}

                <SpriteButton
                    onClick={() => setGameStatus("game-screen")}
                    frames={[playAgainSprite1, playAgainSprite2]}
                />

                {/* <button
                    onClick={() => {
                        setGameStatus("start-screen");
                    }}
                    style={{
                        fontSize: '2rem',
                        padding: '10px 30px',
                        borderRadius: '20px',
                        margin: '1rem',
                        border: '5px solid black',
                        background: 'white',
                        cursor: 'pointer',
                    }}
                >
                    Return to Main Menu
                </button> */}
                
                <SpriteButton
                    onClick={() => setGameStatus("start-screen")}
                    frames={[mainMenu1, mainMenu2]}
                />

                {showSaveForm && (
                    <SaveScoreForm 
                        score={score} 
                        onClose={() => setShowSaveForm(false)} 
                    />
                )}
            </div>
        </div>
    );
}

export default GameOverScreen;