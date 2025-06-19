
import React from 'react';

interface StartScreenProps {
  onStart: () => void;
}

const playUISound = (soundUrl: string) => {
  try {
    new Audio(soundUrl).play().catch(e => console.warn("Sound play promise rejected:", e));
  } catch (error) {
    console.warn("Sound play prevented:", error);
  }
};

const StartScreenComponent: React.FC<StartScreenProps> = ({ onStart }) => {
  const handleButtonClick = () => {
    playUISound('https://geasacperu.com/imagenes/click.aac');
    onStart();
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center text-center gap-3 gap-sm-4 animate-fadeIn">
      <h1 className="display-4 fw-bold text-primary">Learn Food Words!</h1>
      <p className="fs-6 text-muted">
        Let's learn English words for delicious foods!
      </p>
      <img 
        src="https://geasacperu.com/imagenes/gameplay.jpeg" 
        alt="Food vocabulary game play" 
        className="img-fluid rounded shadow w-75 mx-auto"
        loading="lazy"
        style={{maxWidth: '220px'}}
      />
      <button
        onClick={handleButtonClick}
        className="btn btn-success btn-lg rounded-pill shadow px-4 py-2"
        aria-label="Let's Play!"
      >
        Let's Play! 🎉
      </button>
    </div>
  );
};

const StartScreen = React.memo(StartScreenComponent);
export default StartScreen;