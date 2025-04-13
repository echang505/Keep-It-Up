import React, { useRef, useEffect, useState } from 'react';
import * as vision from "@mediapipe/tasks-vision";
import BallObject from './BallObject';
import BombObject from './BombObject';
import BonusPointObject from './BonusPointObject';
import './GameCanvas.css';
import boing from '../assets/sprites/boing.mp3';
import { useAudio } from '../context/AudioContext';

function GameCanvas({setGameStatus, currentScoreRef, setScore}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const handLandmarkerRef = useRef(null);
  const lastVideoTimeRef = useRef(-1);
  const { playSound } = useAudio();

  // const fingerRef = React.useRef([{ x: 0, y: 0 }, { x: 0, y: 0 }]);
  // const [fingerVelocity, setFingerVelocity] = React.useState([{ dx: 0, dy: 0 }, { dx: 0, dy: 0 }]);

  const fingerRef = React.useRef({ x: 0, y: 0 });
  const [fingerVelocity, setFingerVelocity] = React.useState({ dx: 0, dy: 0 });

  // Calculate center of screen for initial balloon position
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const initialBallY = centerY - 100; // Spawn 100 pixels above center
  
  const ballRef = useRef({ x: centerX, y: initialBallY, vx: 0, vy: 0 }); // No initial velocity during countdown
  const [renderBall, setRenderBall] = React.useState({ x: centerX, y: initialBallY });
  const [isColliding, setIsColliding] = React.useState(false);
  
  // Bomb state
  const [bombs, setBombs] = React.useState([]);
  const [explodingBombs, setExplodingBombs] = React.useState([]);
  const bombSpawnTimerRef = useRef(0);
  const bombSpawnInterval = 2000; // Spawn a bomb every 2 seconds
  
  // Countdown state
  const [countdown, setCountdown] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  
  // Add bonus point state
  const [bonusPoints, setBonusPoints] = useState([]);
  const bonusPointTimerRef = useRef(0);
  const bonusPointInterval = 5000; // Spawn a bonus point every 5 seconds
  
  // Countdown effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      // Start the game after countdown reaches 0
      setGameStarted(true);
      // Set initial downward velocity
      ballRef.current.vy = 0.5;
    }
  }, [countdown]);
  
  useEffect(() => {
    // Reset refs and state on (re)mount
    ballRef.current = { x: centerX, y: initialBallY, vx: 0, vy: 0 }; // No initial velocity during countdown
    currentScoreRef.current = 0;
    setScore(0);
    setIsColliding(false);
    setBombs([]);
    setExplodingBombs([]);
    bombSpawnTimerRef.current = 0;
    setCountdown(3);
    setGameStarted(false);
    setBonusPoints([]);
    bonusPointTimerRef.current = 0;
  }, []);

  // Function to spawn a new bomb
  const spawnBomb = () => {
    // Determine which edge to spawn from (0: top, 1: right, 2: bottom, 3: left)
    const edge = Math.floor(Math.random() * 4);
    
    let x, y;
    let vx, vy;
    
    // Set initial position and velocity based on which edge the bomb spawns from
    switch (edge) {
      case 0: // Top edge
        x = Math.random() * window.innerWidth;
        y = -50; // Start above the screen
        // Calculate direction to center with some randomness
        const angleToCenterTop = Math.atan2(centerY - y, centerX - x);
        const randomAngleTop = angleToCenterTop + (Math.random() - 0.5) * 0.5; // Small random variation
        const speedTop = 2 + Math.random() * 1.5; // Slower speed
        vx = Math.cos(randomAngleTop) * speedTop;
        vy = Math.sin(randomAngleTop) * speedTop;
        break;
      case 1: // Right edge
        x = window.innerWidth + 50;
        y = Math.random() * window.innerHeight;
        // Calculate direction to center with some randomness
        const angleToCenterRight = Math.atan2(centerY - y, centerX - x);
        const randomAngleRight = angleToCenterRight + (Math.random() - 0.5) * 0.5; // Small random variation
        const speedRight = 2 + Math.random() * 1.5; // Slower speed
        vx = Math.cos(randomAngleRight) * speedRight;
        vy = Math.sin(randomAngleRight) * speedRight;
        break;
      case 2: // Bottom edge
        x = Math.random() * window.innerWidth;
        y = window.innerHeight + 50;
        // Calculate direction to center with some randomness
        const angleToCenterBottom = Math.atan2(centerY - y, centerX - x);
        const randomAngleBottom = angleToCenterBottom + (Math.random() - 0.5) * 0.5; // Small random variation
        const speedBottom = 2 + Math.random() * 1.5; // Slower speed
        vx = Math.cos(randomAngleBottom) * speedBottom;
        vy = Math.sin(randomAngleBottom) * speedBottom;
        break;
      case 3: // Left edge
        x = -50;
        y = Math.random() * window.innerHeight;
        // Calculate direction to center with some randomness
        const angleToCenterLeft = Math.atan2(centerY - y, centerX - x);
        const randomAngleLeft = angleToCenterLeft + (Math.random() - 0.5) * 0.5; // Small random variation
        const speedLeft = 2 + Math.random() * 1.5; // Slower speed
        vx = Math.cos(randomAngleLeft) * speedLeft;
        vy = Math.sin(randomAngleLeft) * speedLeft;
        break;
    }
    
    const newBomb = {
      id: Date.now(),
      x,
      y,
      vx,
      vy,
      isExploding: false,
      lifetime: 0,
      maxLifetime: 15000, // 15 seconds maximum lifetime
      gravity: 0.03 // Reduced gravity for slower vertical acceleration
    };
    
    setBombs(prev => [...prev, newBomb]);
  };
  
  // Function to handle bomb explosion
  const handleBombExplode = (bombId) => {
    // Add bomb to exploding bombs
    setExplodingBombs(prev => [...prev, bombId]);
    
    // Remove bomb after explosion animation
    setTimeout(() => {
      setBombs(prev => prev.filter(bomb => bomb.id !== bombId));
      setExplodingBombs(prev => prev.filter(id => id !== bombId));
    }, 500);
    
    // End the game
    setGameStatus("game-over-screen");
  };

  // Function to spawn a new bonus point
  const spawnBonusPoint = () => {
    const newBonusPoint = {
      id: Date.now(),
      x: Math.random() * (window.innerWidth - 100) + 50, // Keep away from edges
      y: Math.random() * (window.innerHeight - 100) + 50, // Keep away from edges
      lifetime: 0,
      maxLifetime: 10000, // 10 seconds maximum lifetime
    };
    
    setBonusPoints(prev => [...prev, newBonusPoint]);
  };

  useEffect(() => {
    
    const initialize = async () => {
      const videoElement = videoRef.current;
      const canvasElement = canvasRef.current;
      const canvasCtx = canvasElement.getContext('2d');

      const filesetResolver = await vision.FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm'
      );

      const handLandmarker = await vision.HandLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
          delegate: 'GPU',
        },
        runningMode: "VIDEO",
        numHands: 1,
      });

      handLandmarkerRef.current = handLandmarker;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: window.innerWidth, height: window.innerHeight },
      });
      videoElement.srcObject = stream;
      await new Promise((resolve) => {
        videoElement.onloadedmetadata = () => resolve();
      });
      await videoElement.play();

      const renderLoop = () => {
        const now = videoElement.currentTime;
        const handLandmarker = handLandmarkerRef.current;

        if (
          videoElement &&
          handLandmarker &&
          videoElement.videoWidth > 0 &&
          videoElement.videoHeight > 0 &&
          now !== lastVideoTimeRef.current
        ) {
          const results = handLandmarker.detectForVideo(videoElement, performance.now());
          canvasCtx.save();
          canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
          canvasCtx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
          
          let tipCoords;
          // for (let i = 0; i < 2; i++){
          //   if (results.landmarks && results.landmarks[i]) {
          //     let tip = results.landmarks[i][4]; // 8 for indexs finger tip
          //     tipCoords = {
          //       x: canvasElement.width - tip.x * canvasElement.width, // ← flip X
          //       y: tip.y * canvasElement.height,
          //     };
          //     canvasCtx.beginPath();
          //     canvasCtx.arc(tip.x * canvasElement.width, tipCoords.y, 10, 0, 2 * Math.PI);
          //     canvasCtx.fillStyle = 'red';
          //     canvasCtx.fill();
          //     canvasCtx.strokeStyle = 'red';
          //     canvasCtx.stroke();
          //     canvasCtx.closePath();
          //     // console.log(tip);
          //     fingerRef.current[i] = tipCoords;
            
          //   }
          // }
            if (results.landmarks && results.landmarks[0]) {
              let tip = results.landmarks[0][4]; // 8 for indexs finger tip
              tipCoords = {
                x: canvasElement.width - tip.x * canvasElement.width, // ← flip X
                y: tip.y * canvasElement.height,
              };
              canvasCtx.beginPath();
              canvasCtx.arc(tip.x * canvasElement.width, tipCoords.y, 10, 0, 2 * Math.PI);
              canvasCtx.fillStyle = 'red';
              canvasCtx.fill();
              canvasCtx.strokeStyle = 'red';
              canvasCtx.stroke();
              canvasCtx.closePath();
              // console.log(tip);
              fingerRef.current = tipCoords;
            
            }
          
          lastVideoTimeRef.current = now;
        }

        // Only update ball physics if game has started
        if (gameStarted) {
          // Ball movement
          // Ball physics using ref
          let { x, y, vx, vy } = ballRef.current;
          x += vx;
          y += vy;
          vy += 0.07; // Increased gravity for lower bounces
          
          const dx1 = fingerRef.current.x - x;
          const dy1 = fingerRef.current.y - y;
          const dist1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
          // const dx2 = fingerRef.current[1].x - x;
          // const dy2 = fingerRef.current[1].y - y;
          // const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
          const collisionRadius = 35;
          // console.log(fingerRef.current.x, fingerRef.current.y, ballRef.current.x, ballRef.current.y);
          
          if (dist1 < collisionRadius) {
            console.log('Collision 1 detected');
            currentScoreRef.current += 1;
            setScore(currentScoreRef.current);
            
            // Only set isColliding to true if it's not already true
            // This prevents multiple wobble animations from being triggered
            if (!isColliding) {
              setIsColliding(true);
              
              // Add a delay before setting isColliding back to false
              setTimeout(() => {
                setIsColliding(false);
              }, 200); // Match the wobble animation duration
            }
            
            playSound(boing);

            // Compute bounce angle and preserve momentum
            const angle = Math.atan2(dy1, dx1);
            const fingerSpeed = Math.sqrt(fingerVelocity.dx ** 2 + fingerVelocity.dy ** 2) || 1;
            const bounceStrength = Math.max(7, Math.min(fingerSpeed * 0.4, 12)); // Reduced bounce strength

            vx = -Math.cos(angle) * bounceStrength;
            vy = -Math.sin(angle) * bounceStrength;

            // Move ball slightly outside collision radius to prevent repeat bouncing
            x =  fingerRef.current.x - Math.cos(angle) * (collisionRadius + 2);
            y =  fingerRef.current.y - Math.sin(angle) * (collisionRadius + 2);
          }
          // if (dist2 < collisionRadius) {
          //   console.log('Collision 2 detected');
          //   currentScoreRef.current += 1;
          //   setScore(currentScoreRef.current);
          //   // Compute bounce angle and preserve momentum
          //   const angle = Math.atan2(dy2, dx2);
          //   const fingerSpeed = Math.sqrt(fingerVelocity[1].dx ** 2 + fingerVelocity[1].dy ** 2) || 1;
          //   const bounceStrength = Math.max(8, Math.min(fingerSpeed * 0.5, 15));

          //   vx = -Math.cos(angle) * bounceStrength;
          //   vy = -Math.sin(angle) * bounceStrength;

          //   // Move ball slightly outside collision radius to prevent repeat bouncing
          //   x =  fingerRef.current[1].x - Math.cos(angle) * (collisionRadius + 2);
          //   y =  fingerRef.current[1].y - Math.sin(angle) * (collisionRadius + 2);
          // }
          // Bounce off the sides
          const ballRadius = 25;
          if (x - ballRadius <= 0) {
            x = ballRadius;
            vx = Math.abs(vx) * 0.8; // Bounce with slight energy loss
          } else if (x + ballRadius >= window.innerWidth) {
            x = window.innerWidth - ballRadius;
            vx = -Math.abs(vx) * 0.8; // Bounce with slight energy loss
          }
          
          // Allow vertical movement to go off screen
          ballRef.current = {
            x: x,
            y: y, // Allow y to go off screen
            vx,
            vy,
          };

          // Only render the ball if it's within the visible area
          if (y >= -50 && y <= window.innerHeight + 50) {
            setRenderBall({ x: ballRef.current.x, y: ballRef.current.y });
          } else {
            setRenderBall(prev => prev);
            
          }
          
          // Update bombs
          setBombs(prev => {
            return prev.map(bomb => {
              // Apply gravity to vertical velocity
              const newVy = bomb.vy + bomb.gravity;
              
              // Move bomb with parabolic motion
              let newX = bomb.x + bomb.vx;
              let newY = bomb.y + newVy;
              
              // Update lifetime
              const newLifetime = bomb.lifetime + 16; // Assuming 60fps
              
              // Remove bomb if it's been alive too long or is off-screen
              if (newLifetime > bomb.maxLifetime || 
                  newX < -100 || newX > window.innerWidth + 100 || 
                  newY < -100 || newY > window.innerHeight + 100) {
                return null; // This bomb will be filtered out
              }
              
              // Check collision with balloon
              const dx = newX - x;
              const dy = newY - y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              
              // Use a more precise collision radius and add a small buffer to prevent false collisions
              const collisionBuffer = 5; // Small buffer to prevent edge cases
              const effectiveBombRadius = 30; // Slightly smaller than visual size
              const effectiveBallRadius = ballRadius - 2; // Slightly smaller than visual size
              
              if (dist < effectiveBallRadius + effectiveBombRadius - collisionBuffer && !bomb.isExploding) {
                // Add a minimum distance check to prevent false collisions at high speeds
                const minDistance = effectiveBallRadius + effectiveBombRadius - collisionBuffer;
                if (dist > minDistance * 0.8) { // Only trigger if we're not too close to the edge
                  // Trigger explosion
                  handleBombExplode(bomb.id);
                  return { ...bomb, isExploding: true };
                }
              }
              
              return { ...bomb, x: newX, y: newY, vy: newVy, lifetime: newLifetime };
            }).filter(bomb => bomb !== null); // Remove null bombs
          });
          
          // Spawn bombs periodically
          bombSpawnTimerRef.current += 16; // Assuming 60fps
          if (currentScoreRef.current >= 5 && bombSpawnTimerRef.current >= bombSpawnInterval) {
            spawnBomb();
            bombSpawnTimerRef.current = 0;
          }
          
          // Update bonus points
          setBonusPoints(prev => {
            return prev.map(bonusPoint => {
              // Update lifetime
              const newLifetime = bonusPoint.lifetime + 16; // Assuming 60fps
              
              // Remove bonus point if it's been alive too long
              if (newLifetime > bonusPoint.maxLifetime) {
                return null;
              }
              
              // Check collision with balloon
              const dx = bonusPoint.x - x;
              const dy = bonusPoint.y - y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              
              if (dist < 50) { // Collision radius
                // Add bonus points
                currentScoreRef.current += 1; // Add 1 extra points
                setScore(currentScoreRef.current);
                return null; // Remove the bonus point
              }
              
              return { ...bonusPoint, lifetime: newLifetime };
            }).filter(bonusPoint => bonusPoint !== null);
          });
          
          // Spawn bonus points periodically
          bonusPointTimerRef.current += 16; // Assuming 60fps
          if (currentScoreRef.current >= 0 && bonusPointTimerRef.current >= bonusPointInterval) {
            spawnBonusPoint();
            bonusPointTimerRef.current = 0;
          }
          
          // end game
          if (y > window.innerHeight) {
            console.log("ENDING GAME", y);
            setGameStatus("game-over-screen");
            return; // Break out of the render loop
          }
        }
        
        requestAnimationFrame(() => renderLoop());
      };

      renderLoop();
    };
    
    initialize();
  }, [gameStarted]);

  return (
    <>
      <video
        id="video"
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          zIndex: -1,
          transform: 'scaleX(-1)'
        }}
      />
      <canvas
        id="canvas"
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          transform: 'scaleX(-1)'

        }}
      />
      <BallObject x={renderBall.x} y={renderBall.y} isColliding={isColliding} />
      {bombs.map(bomb => (
        <BombObject 
          key={bomb.id}
          x={bomb.x} 
          y={bomb.y} 
          isExploding={explodingBombs.includes(bomb.id)}
          onExplode={() => handleBombExplode(bomb.id)}
        />
      ))}
      {bonusPoints.map(bonusPoint => (
        <BonusPointObject
          key={bonusPoint.id}
          x={bonusPoint.x}
          y={bonusPoint.y}
        />
      ))}
      {!gameStarted && (
        <div className="countdown-overlay">
          <div className="countdown-number">{countdown}</div>
        </div>
      )}
    </>
  );
}

export default GameCanvas;