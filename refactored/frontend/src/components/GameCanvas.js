import React, { useRef, useEffect } from 'react';
import * as vision from "@mediapipe/tasks-vision";
import BallObject from './BallObject';

function GameCanvas() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const handLandmarkerRef = useRef(null);
  const lastVideoTimeRef = useRef(-1);

  const fingerRef = React.useRef({ x: 0, y: 0 });
  const [fingerVelocity, setFingerVelocity] = React.useState({ dx: 0, dy: 0 });

  const ballRef = useRef({ x: 320, y: 240, vx: 2, vy: -.01 });
  const [renderBall, setRenderBall] = React.useState({ x: 320, y: 240 });

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
        numHands: 2,
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
          if (results.landmarks && results.landmarks[0]) {
            let tip = results.landmarks[0][8]; // change to thumb??
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
        
        const dx = fingerRef.current.x - x;
        const dy = fingerRef.current.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const collisionRadius = 35;
        console.log(fingerRef.current.x, fingerRef.current.y, ballRef.current.x, ballRef.current.y);
        
        if (dist < collisionRadius) {
          console.log('Collision detected');
          // Compute bounce angle and preserve momentum
          const angle = Math.atan2(dy, dx);
          const fingerSpeed = Math.sqrt(fingerVelocity.dx ** 2 + fingerVelocity.dy ** 2) || 1;
          const bounceStrength = Math.max(8, Math.min(fingerSpeed * 0.5, 15));

          vx = -Math.cos(angle) * bounceStrength;
          vy = -Math.sin(angle) * bounceStrength;

          // Move ball slightly outside collision radius to prevent repeat bouncing
          x =  fingerRef.current.x - Math.cos(angle) * (collisionRadius + 2);
          y =  fingerRef.current.y - Math.sin(angle) * (collisionRadius + 2);
        }
        
        

        ballRef.current = {
          x: Math.max(25, Math.min(window.innerWidth - 25, x)),
          y: Math.max(25, Math.min(window.innerHeight - 25, y)),
          vx,
          vy,
        };

        setRenderBall({ x: ballRef.current.x, y: ballRef.current.y });
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