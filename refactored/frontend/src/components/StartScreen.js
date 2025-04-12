import React from 'react';

function StartScreen({setGameStatus}) {
  console.log("StartScreen");
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
      <h1 style={{ fontSize: '4rem', margin: '0.5rem' }}>KEEP IT UP!</h1>

      <button
        onClick={() => {
            setGameStatus("game-screen");}}
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
        START
      </button>

      <button
        onClick={() => setGameStatus("scores-screen")}
        style={{
          fontSize: '2rem',
          padding: '10px 30px',
          borderRadius: '20px',
          margin: '1rem',
          border: '5px solid black',
          background: 'white',
        }}
      >
        SCORES
      </button>

      <button
        onClick={() => setGameStatus("settings-screen")}
        style={{
          fontSize: '2rem',
          padding: '10px 30px',
          borderRadius: '20px',
          margin: '1rem',
          border: '5px solid black',
          background: 'white',
        }}
      >
        SETTINGS
      </button>
    </div>
  );
}

export default StartScreen;