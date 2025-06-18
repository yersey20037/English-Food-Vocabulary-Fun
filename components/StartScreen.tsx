
import React from 'react';

interface StartScreenProps {
  onStart: () => void;
}

const playUISound = (soundUrl: string) => {
  try {
    new Audio(soundUrl).play();
  } catch (error) {
    console.warn("Sound play prevented:", error);
  }
};

const StartScreenComponent: React.FC<StartScreenProps> = ({ onStart }) => {
  const handleButtonClick = () => {
    playUISound('https://geasacperu.com/imagenes/click.aac');
    onStart();
  };

  // Hover sound removed from the initial button to prevent autoplay errors
  // const handleButtonHover = () => {
  //   playUISound('https://geasacperu.com/imagenes/recorrer.aac');
  // };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 animate-fadeIn">
      <h1 className="text-5xl md:text-6xl font-bold text-sky-600 drop-shadow-lg">Learn Food Words!</h1>
      <p className="text-xl text-slate-700">
        Let's learn English words for delicious foods!
      </p>
      <img 
        src="https://geasacperu.com/imagenes/gameplay.jpeg" 
        alt="Food vocabulary game play" 
        className="rounded-lg shadow-lg w-full max-w-xs h-auto" 
        loading="lazy"
      />
      <button
        onClick={handleButtonClick}
        // onMouseEnter={handleButtonHover} // Removed hover sound
        className="px-8 py-4 bg-green-500 text-white text-2xl font-semibold rounded-full shadow-lg hover:bg-green-600 transform hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-300"
      >
        Let's Play! 🎉
      </button>
    </div>
  );
};

const StartScreen = React.memo(StartScreenComponent);
export default StartScreen;
