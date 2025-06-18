
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

  // Hover sound intentionally removed for the very first button to avoid autoplay errors
  // const handleButtonHover = () => {
  //   playUISound('https://geasacperu.com/imagenes/recorrer.aac');
  // };

  return (
    <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 md:space-y-5 animate-fadeIn">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-sky-600 drop-shadow-lg text-center">Learn Food Words!</h1>
      <p className="text-xs sm:text-sm md:text-base text-slate-700 text-center">
        Let's learn English words for delicious foods!
      </p>
      <img 
        src="https://geasacperu.com/imagenes/gameplay.jpeg" 
        alt="Food vocabulary game play" 
        className="rounded-lg shadow-lg w-full max-w-[180px] sm:max-w-[200px] md:max-w-xs h-auto" 
        loading="lazy"
      />
      <button
        onClick={handleButtonClick}
        // onMouseEnter={handleButtonHover} 
        className="px-4 py-2 bg-green-500 text-white text-sm sm:text-base md:text-lg font-semibold rounded-full shadow-lg hover:bg-green-600 transform hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-300"
      >
        Let's Play! 🎉
      </button>
    </div>
  );
};

const StartScreen = React.memo(StartScreenComponent);
export default StartScreen;
    