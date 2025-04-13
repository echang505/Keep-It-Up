import React from 'react';
import SaveScoreForm from './SaveScoreForm';
import bliss from '../assets/sprites/bliss.png';

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
                <h1 style={{ fontSize: '4rem', margin: '0.5rem' }}>Game Over!</h1>
                <h2 style={{ fontSize: '2rem', margin: '0.5rem' }}>Your Score: {score}</h2>

                <button
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
                </button>
                
                <button
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
                </button>            

                <button
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
                </button>
                
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