import React, { useRef, useEffect } from 'react';
import * as vision from "@mediapipe/tasks-vision";
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { HAND_CONNECTIONS } from '@mediapipe/hands';

function GameCanvas() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const handLandmarkerRef = useRef(null);
  const lastVideoTimeRef = useRef(-1);

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
        video: { width: 640, height: 480 },
      });
      videoElement.srcObject = stream;
      await new Promise((resolve) => {
        videoElement.onloadedmetadata = () => resolve();
      });
      await videoElement.play();

      const renderLoop = (video) => {
        const now = videoElement.currentTime;
        const handLandmarker = handLandmarkerRef.current;

        if (
          video &&
          handLandmarker &&
          video.videoWidth > 0 &&
          video.videoHeight > 0 &&
          now !== lastVideoTimeRef.current
        ) {
          const results = handLandmarker.detectForVideo(videoElement, performance.now());
          canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
          canvasCtx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

          if (results.landmarks) {
            // for (const landmarks of results.landmarks) {
            //   drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
            //     color: '#00FF00',
            //     lineWidth: 5,
            //   });
            //   drawLandmarks(canvasCtx, landmarks, {
            //     color: '#FF0000',
            //     lineWidth: 2,
            //   });
            // }
            console.log(results.landmarks);
          }

          lastVideoTimeRef.current = now;
        }

        requestAnimationFrame(() => renderLoop(videoElement));
      };

      renderLoop(videoElement);
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
        style={{ display: 'none' }}
      />
      <canvas
        id="canvas"
        ref={canvasRef}
        width={640}
        height={480}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 0,
        }}
      />
    </>
  );
}

export default GameCanvas;