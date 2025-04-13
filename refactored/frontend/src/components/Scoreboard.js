import React from 'react';

function Scoreboard({setGameStatus}) {
  // This would typically fetch scores from a backend or local storage
  const scores = [
    { name: "Player 1", score: 120 },
    { name: "Player 2", score: 100 },
    { name: "Player 3", score: 80 },
    { name: "Player 4", score: 60 },
    { name: "Player 5", score: 40 },
  ];

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Comic Sans MS, sans-serif',
      }}
    >
      <h1 style={{ fontSize: '4rem', margin: '0.5rem' }}>HIGH SCORES</h1>
      
      <div
        style={{
          width: '80%',
          maxWidth: '600px',
          margin: '2rem',
          padding: '1rem',
          borderRadius: '10px',
          border: '5px solid black',
          background: 'white',
        }}
      >
        {scores.map((score, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0.5rem',
              borderBottom: index < scores.length - 1 ? '1px solid #ccc' : 'none',
              fontSize: '1.5rem',
            }}
          >
            <span>{index + 1}. {score.name}</span>
            <span>{score.score}</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => setGameStatus("start-screen")}
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
        BACK
      </button>
    </div>
  );
}

export default Scoreboard;