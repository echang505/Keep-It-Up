import React, { createContext, useState, useContext } from 'react';

const AudioContext = createContext();

export function AudioProvider({ children }) {
  const [sfxVolume, setSfxVolume] = useState(50); // Default to 50%

  const playSound = (audio) => {
    const sound = new Audio(audio);
    sound.volume = sfxVolume / 100; // Convert percentage to decimal
    sound.play();
  };

  return (
    <AudioContext.Provider value={{ sfxVolume, setSfxVolume, playSound }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  return useContext(AudioContext);
} 