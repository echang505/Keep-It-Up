import React from 'react';
import SaveScoreForm from './SaveScoreForm';
function GameOverScreen({ setGameStatus, score }) {
    const [saveScreenStatus, setSaveScreenStatus] = React.useState(false);
    return (
        <div
            style={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                // backgroundImage: 'url("/background.jpg")',
                // backgroundSize: 'cover',
                fontFamily: 'Comic Sans MS, sans-serif',
            }}
        >
            <h1 style={{ fontSize: '4rem', margin: '0.5rem' }}>Game Over!</h1>
            <h2 style={{ fontSize: '2rem', margin: '0.5rem' }}>Your Score: {score}</h2>

            <button
                onClick={() => {
                    setSaveScreenStatus(true);
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
            {saveScreenStatus? <> <SaveScoreForm score={score}/>
            </>: <></>}
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

        </div>
    );
}

export default GameOverScreen;