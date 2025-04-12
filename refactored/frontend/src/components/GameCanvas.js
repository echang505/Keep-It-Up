import React, { useRef, useEffect } from 'react';
import * as vision from "@mediapipe/tasks-vision";
import BallObject from './BallObject';

function GameCanvas() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const handLandmarkerRef = useRef(null);
  const lastVideoTimeRef = useRef(-1);

  const [ballPos, setBallPos] = React.useState({ x: 320, y: 240 });
  const [ballVelocity, setBallVelocity] = React.useState({ dx: 2, dy: -2 });
  const [fingerPos, setFingerPos] = React.useState({ x: 0, y: 0 });
  const [fingerVelocity, setFingerVelocity] = React.useState({ dx: 0, dy: 0 });
  
  useEffect(() => {
    const initialize = async () => {
      const videoElement = videoRef.current;
      const canvasElement = canvasRef.current;
      const canvasCtx = canvasElement.getContext('2d');

      const filesetResolver = await vision.FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm'
      );

      const handLandmarker = await vision.HandLandmarker.createFromOptions(filesetResolver , {
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

          if (results.landmarks && results.landmarks[0]) {
            let tip = results.landmarks[0][8]; // change to thumb??
            let tipCoords = {
              x: tip.x * canvasElement.width,
              y: tip.y * canvasElement.height,
            };
            canvasCtx.beginPath();
            canvasCtx.arc(tipCoords.x, tipCoords.y, 10, 0, 2 * Math.PI);
            canvasCtx.fillStyle = 'red';
            canvasCtx.fill();
            canvasCtx.strokeStyle = 'red';
            canvasCtx.stroke();
            canvasCtx.closePath();
            // console.log(tip);

            setFingerPos(tipCoords);
          }
          lastVideoTimeRef.current = now;
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
          display: 'none', 
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          zIndex: -1,
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
        }}
      />
      <BallObject x={ballPos.x} y={ballPos.y} />
    </>
  );
}

export default GameCanvas;