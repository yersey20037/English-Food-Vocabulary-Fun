
import React, { useEffect } from 'react';

interface EndScreenProps {
  score: number;
  totalQuestions: number;
  onPlayAgain: () => void;
}

const playUISound = (soundUrl: string) => {
  try {
    new Audio(soundUrl).play().catch(e => console.warn("Sound play promise rejected:", e));
  } catch (error) {
    console.warn("Sound play prevented:", error);
  }
};

const EndScreenComponent: React.FC<EndScreenProps> = ({ score, totalQuestions, onPlayAgain }) => {
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  let message = "";
  let emoji = "🤔";

  if (percentage === 100) {
    message = "Perfect Score! You're a vocabulary superstar! ⭐";
    emoji = "🏆";
  } else if (percentage >= 75) {
    message = "Great job! You know a lot of food words! 👍";
    emoji = "🥳";
  } else if (percentage >= 50) {
    message = "Good effort! Keep practicing! 🤓";
    emoji = "😊";
  } else {
    message = "Nice try! Practice makes perfect! 💪";
    emoji = "📚";
  }

  useEffect(() => {
    const audio = new Audio('https://geasacperu.com/imagenes/victoria.aac');
    audio.play().catch(error => {
      console.warn("Audio play prevented:", error);
    });
  }, []); 

  const handleButtonClick = () => {
    playUISound('https://geasacperu.com/imagenes/click.aac');
    onPlayAgain();
  };

  const handleButtonHover = () => {
    playUISound('https://geasacperu.com/imagenes/recorrer.aac');
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2 sm:space-y-3 md:space-y-4 animate-fadeIn">
      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-indigo-600 drop-shadow-lg text-center">Game Over! {emoji}</h2>
      <p className="text-xs sm:text-sm md:text-base text-slate-700">
        You got <strong className="text-pink-500">{score}</strong> out of <strong className="text-pink-500">{totalQuestions}</strong> correct!
      </p>
      <p className="text-[10px] sm:text-xs md:text-sm text-slate-600 italic">({percentage}%)</p>
      <p className="text-xs sm:text-sm md:text-base text-center text-teal-700 font-medium">{message}</p>
      
       <img 
          src="https://geasacperu.com/imagenes/findeljuego.png" 
          alt="Game Over Celebration" 
          className="rounded-lg shadow-lg my-2 sm:my-3 w-full max-w-[180px] sm:max-w-[200px] md:max-w-xs h-auto" 
          loading="lazy"
        />

      <button
        onClick={handleButtonClick}
        onMouseEnter={handleButtonHover}
        className="px-4 py-2 bg-orange-500 text-white text-sm sm:text-base md:text-lg font-semibold rounded-full shadow-lg hover:bg-orange-600 transform hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-orange-300"
      >
        Play Again? 🔁
      </button>
    </div>
  );
};

const EndScreen = React.memo(EndScreenComponent);
export default EndScreen;
    