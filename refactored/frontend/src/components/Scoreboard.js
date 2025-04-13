import React, { useState, useEffect, useRef, useCallback } from 'react';
import leaderboard1 from '../assets/sprites/leaderboard1.png';
import leaderboard2 from '../assets/sprites/leaderboard2.png';
import backSprite1 from '../assets/sprites/back1.png';
import backSprite2 from '../assets/sprites/back2.png';
import bliss from '../assets/sprites/bliss.png';


function Scoreboard({setGameStatus}) {
  // Static dummy data
  const dummyScores = [
    { name: "Champion", score: 1200 },
    { name: "Score Hunter", score: 1100 },
    { name: "Super Star", score: 1050 },
    { name: "Super Hero", score: 1000 },
    { name: "Super Wizard", score: 980 },
    { name: "Pro Gamer", score: 950 },
    { name: "Super Legend", score: 950 },
    { name: "Elite Player", score: 920 },
    { name: "Elite Master", score: 900 },
    { name: "Bounce King", score: 890 },
    { name: "Elite Wizard", score: 850 },
    { name: "Elite Legend", score: 830 },
    { name: "Top Scorer", score: 800 },
    { name: "Top Master", score: 750 },
    { name: "Top Wizard", score: 700 },
    { name: "Top Legend", score: 680 },
    { name: "Ball Master", score: 780 },
    { name: "Score Wizard", score: 680 },
    { name: "Score Elite", score: 600 },
    { name: "Score Legend", score: 580 },
    { name: "Finger Ninja", score: 580 },
    { name: "Score Super", score: 570 },
    { name: "Game Legend", score: 550 },
    { name: "Keep It Up Expert", score: 650 },
    { name: "Game Elite", score: 500 },
    { name: "Game Super", score: 470 },
    { name: "Ball Wizard", score: 450 },
    { name: "Ball Elite", score: 400 },
    { name: "Ball Legend", score: 380 },
    { name: "Ball Bouncer", score: 420 },
    { name: "New Player", score: 320 },
    { name: "High Scorer", score: 300 },
    { name: "Score Hero", score: 300 },
    { name: "Score Legend", score: 280 },
    { name: "Game Hero", score: 250 },
    { name: "Game Master", score: 200 },
    { name: "Arcade Legend", score: 200 },
    { name: "Game Legend", score: 210 },
    { name: "Arcade Pro", score: 180 },
    { name: "Arcade Wizard", score: 190 },
    { name: "Game Wizard", score: 220 },
    { name: "First Timer", score: 150 },
    { name: "Casual Master", score: 150 },
    { name: "Casual Player", score: 120 },
    { name: "Casual Wizard", score: 130 },
    { name: "Casual Legend", score: 110 }
  ];

  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalScores, setTotalScores] = useState(0);
  const observer = useRef();
  const lastScoreElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // this is for the "LEADERBOARD" text
  function SpriteImage({ frames, width = 400, height = 120 }) {
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
          marginTop: '20px'
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
          width: '400px',
          height: '140px',
          backgroundImage: `url(${frames[frame]})`,
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: 'black',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          margin: '2rem 0',
        }}
      >
        {text}
      </button>
    );
  }
  

  // Simulate fetching scores with dummy data
  const fetchScores = (pageNum) => {
    try {
      setLoading(true);
      
      // Simulate network delay
      setTimeout(() => {
        const perPage = 10;
        const startIdx = (pageNum - 1) * perPage;
        const endIdx = Math.min(startIdx + perPage, dummyScores.length);
        
        // Get slice of dummy scores for this page
        const newScores = dummyScores.slice(startIdx, endIdx);
        
        if (pageNum === 1) {
          setScores(newScores);
        } else {
          setScores(prevScores => [...prevScores, ...newScores]);
        }
        
        setTotalScores(dummyScores.length);
        setHasMore(pageNum * perPage < dummyScores.length);
        setLoading(false);
      }, 500); // Simulate 500ms delay
      
    } catch (err) {
      console.error('Error with dummy data:', err);
      setError('Failed to load scores. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores(page);
    
    // Lock scrolling when component mounts
    document.body.style.overflow = 'hidden';
    
    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [page]);

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
        background: '#f0f0f0'
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
        <SpriteImage frames={[leaderboard1, leaderboard2]} width={750} height={150} />

        {/* <h1 style={{ fontSize: '4rem', margin: '0.5rem' }}>HIGH SCORES</h1> */}
        
        <div
          style={{
            width: '80%',
            maxWidth: '600px',
            height: '60vh',
            margin: '2rem',
            padding: '1rem',
            borderRadius: '10px',
            border: '5px solid black',
            background: 'white',
            overflowY: 'auto',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            position: 'relative'
          }}
        >
          {error ? (
            <div style={{ textAlign: 'center', fontSize: '1.5rem', color: 'red' }}>{error}</div>
          ) : scores.length === 0 && !loading ? (
            <div style={{ textAlign: 'center', fontSize: '1.5rem' }}>No scores yet. Be the first to play!</div>
          ) : (
            <>
              {scores.map((score, index) => (
                <div
                  key={index}
                  ref={index === scores.length - 1 ? lastScoreElementRef : null}
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
              {loading && (
                <div style={{ textAlign: 'center', fontSize: '1.5rem', padding: '1rem' }}>
                  Loading more scores...
                </div>
              )}
              {!hasMore && scores.length > 0 && (
                <div style={{ textAlign: 'center', fontSize: '1.2rem', padding: '1rem', color: '#666' }}>
                  Showing all {totalScores} scores
                </div>
              )}
            </>
          )}
        </div>

        <SpriteButton
          onClick={() => setGameStatus("start-screen")}
          frames={[backSprite1, backSprite2]}
        />
      </div>
    </div>
  );
}

export default Scoreboard;