
import React from 'react';
import { GameMode } from '../types';

interface ModeSelectScreenProps {
  onSelectMode: (mode: GameMode) => void;
}

const playUISound = (soundUrl: string) => {
  try {
    new Audio(soundUrl).play();
  } catch (error) {
    console.warn("Sound play prevented:", error);
  }
};

const ModeSelectScreenComponent: React.FC<ModeSelectScreenProps> = ({ onSelectMode }) => {
  const handleModeButtonClick = (mode: GameMode) => {
    playUISound('https://geasacperu.com/imagenes/click.aac');
    onSelectMode(mode);
  };

  const handleButtonHover = () => {
    playUISound('https://geasacperu.com/imagenes/recorrer.aac');
  };
  
  return (
    <div className="flex flex-col items-center justify-center space-y-8 animate-fadeIn">
      <h1 className="text-4xl md:text-5xl font-bold text-sky-600 drop-shadow-lg">Choose Your Adventure</h1>
      <p className="text-xl text-slate-700">
        How do you want to learn today?
      </p>
      
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 mt-4">
        <button
          onClick={() => handleModeButtonClick(GameMode.MULTIPLE_CHOICE)}
          onMouseEnter={handleButtonHover}
          className="w-full md:w-auto px-8 py-4 bg-blue-500 text-white text-xl font-semibold rounded-lg shadow-lg hover:bg-blue-600 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
          aria-label="Play Multiple Choice mode"
        >
          Multiple Choice 🤔
        </button>
        <button
          onClick={() => handleModeButtonClick(GameMode.TYPING_PRACTICE)}
          onMouseEnter={handleButtonHover}
          className="w-full md:w-auto px-8 py-4 bg-teal-500 text-white text-xl font-semibold rounded-lg shadow-lg hover:bg-teal-600 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-teal-300"
          aria-label="Play Type the Word mode"
        >
          Type the Word ⌨️
        </button>
      </div>
    </div>
  );
};

const ModeSelectScreen = React.memo(ModeSelectScreenComponent);
export default ModeSelectScreen;