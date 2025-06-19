
import React from 'react';
import { GameMode } from '../types';

interface ModeSelectScreenProps {
  onSelectMode: (mode: GameMode) => void;
}

const playUISound = (soundUrl: string) => {
  try {
    new Audio(soundUrl).play().catch(e => console.warn("Sound play promise rejected:", e));
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
    <div className="d-flex flex-column align-items-center justify-content-center text-center gap-3 gap-sm-4 animate-fadeIn">
      <h1 className="display-5 fw-bold text-primary">Choose Your Adventure</h1>
      <p className="fs-5 text-muted">
        How do you want to learn today?
      </p>
      
      <div className="d-grid gap-2 d-md-flex justify-content-md-center mt-2">
        <button
          onClick={() => handleModeButtonClick(GameMode.MULTIPLE_CHOICE)}
          onMouseEnter={handleButtonHover}
          className="btn btn-primary btn-lg shadow"
          aria-label="Play Multiple Choice mode"
        >
          Multiple Choice 🤔
        </button>
        <button
          onClick={() => handleModeButtonClick(GameMode.TYPING_PRACTICE)}
          onMouseEnter={handleButtonHover}
          className="btn btn-info btn-lg shadow text-white"
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
