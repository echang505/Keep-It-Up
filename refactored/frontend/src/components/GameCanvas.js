import React, { useRef, useEffect } from 'react';
import * as vision from "@mediapipe/tasks-vision";
import BallObject from './BallObject';



function GameCanvas({setGameStatus, currentScoreRef, setScore}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const handLandmarkerRef = useRef(null);
  const lastVideoTimeRef = useRef(-1);

  // const fingerRef = React.useRef([{ x: 0, y: 0 }, { x: 0, y: 0 }]);
  // const [fingerVelocity, setFingerVelocity] = React.useState([{ dx: 0, dy: 0 }, { dx: 0, dy: 0 }]);

  const fingerRef = React.useRef({ x: 0, y: 0 });
  const [fingerVelocity, setFingerVelocity] = React.useState({ dx: 0, dy: 0 });


  const ballRef = useRef({ x: 320, y: 240, vx: 2, vy: -.01 });
  const [renderBall, setRenderBall] = React.useState({ x: 320, y: 240 });
  useEffect(() => {
    // Reset refs and state on (re)mount
    ballRef.current = { x: 320, y: 240, vx: 2, vy: -0.01 };
    currentScoreRef.current = 0;
    setScore(0);
  }, []);

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

        // Ball movement
        // Ball physics using ref
        let { x, y, vx, vy } = ballRef.current;
        x += vx;
        y += vy;
        vy += 0.05; // gravity
        
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
          // Compute bounce angle and preserve momentum
          const angle = Math.atan2(dy1, dx1);
          const fingerSpeed = Math.sqrt(fingerVelocity.dx ** 2 + fingerVelocity.dy ** 2) || 1;
          const bounceStrength = Math.max(8, Math.min(fingerSpeed * 0.5, 15));

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
        // end game
        if (y > window.innerHeight) {
          console.log("ENDING GAME", y);
          setGameStatus("game-over-screen");
          return; // Break out of the render loop
        }
        
        requestAnimationFrame(() => renderLoop());
      };

      renderLoop();
    };
    
    initialize();
  }, []);

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
      <BallObject x={renderBall.x} y={renderBall.y} />
    </>
  );
}

export default GameCanvas;