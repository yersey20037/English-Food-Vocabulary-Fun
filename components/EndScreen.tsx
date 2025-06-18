
import React, { useEffect } from 'react';

interface EndScreenProps {
  score: number;
  totalQuestions: number;
  onPlayAgain: () => void;
}

const playUISound = (soundUrl: string) => {
  try {
    new Audio(soundUrl).play();
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
    <div className="flex flex-col items-center justify-center space-y-8 animate-fadeIn">
      <h2 className="text-4xl md:text-5xl font-bold text-indigo-600 drop-shadow-lg">Game Over! {emoji}</h2>
      <p className="text-2xl text-slate-700">
        You got <strong className="text-pink-500">{score}</strong> out of <strong className="text-pink-500">{totalQuestions}</strong> correct!
      </p>
      <p className="text-xl text-slate-600 italic">({percentage}%)</p>
      <p className="text-2xl text-center text-teal-700 font-medium">{message}</p>
      
       <img 
          src="https://geasacperu.com/imagenes/findeljuego.png" 
          alt="Game Over Celebration" 
          className="rounded-lg shadow-lg my-4 w-full max-w-xs h-auto" 
          loading="lazy"
        />

      <button
        onClick={handleButtonClick}
        onMouseEnter={handleButtonHover}
        className="px-8 py-4 bg-orange-500 text-white text-2xl font-semibold rounded-full shadow-lg hover:bg-orange-600 transform hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-orange-300"
      >
        Play Again? 🔁
      </button>
    </div>
  );
};

const EndScreen = React.memo(EndScreenComponent);
export default EndScreen;