import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import backgroundMusic from '../assets/sprites/background_music.mp3';

const AudioContext = createContext();

export function AudioProvider({ children }) {
  const [sfxVolume, setSfxVolume] = useState(50); // Default to 50%
  const [musicVolume, setMusicVolume] = useState(50); // Default to 50%
  const backgroundMusicRef = useRef(null);

  // Initialize background music but don't start playing immediately
  useEffect(() => {
    backgroundMusicRef.current = new Audio(backgroundMusic);
    backgroundMusicRef.current.loop = true; // Loop the background music
    
    // Set initial volume
    backgroundMusicRef.current.volume = musicVolume / 100;
    
    // Clean up on unmount
    return () => {
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current = null;
      }
    };
  }, []);

  // Update music volume when it changes
  useEffect(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.volume = musicVolume / 100;
    }
  }, [musicVolume]);

  const playSound = (audio) => {
    const sound = new Audio(audio);
    sound.volume = sfxVolume / 100; // Convert percentage to decimal
    sound.play();
  };

  const startBackgroundMusic = () => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.play().catch(error => {
        console.error("Error playing background music:", error);
      });
    }
  };

  return (
    <AudioContext.Provider value={{ 
      sfxVolume, 
      setSfxVolume, 
      musicVolume, 
      setMusicVolume, 
      playSound,
      startBackgroundMusic
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  return useContext(AudioContext);
} 