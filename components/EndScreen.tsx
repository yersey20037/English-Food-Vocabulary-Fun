
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
  let messageColor = "text-success";

  if (percentage === 100) {
    message = "Perfect Score! You're a vocabulary superstar! ⭐";
    emoji = "🏆";
    messageColor = "text-warning"; // Gold for perfect
  } else if (percentage >= 75) {
    message = "Great job! You know a lot of food words! 👍";
    emoji = "🥳";
    messageColor = "text-primary";
  } else if (percentage >= 50) {
    message = "Good effort! Keep practicing! 🤓";
    emoji = "😊";
    messageColor = "text-info";
  } else {
    message = "Nice try! Practice makes perfect! 💪";
    emoji = "📚";
    messageColor = "text-muted";
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
    <div className="d-flex flex-column align-items-center justify-content-center text-center gap-2 gap-sm-3 animate-fadeIn">
      <h2 className="display-5 fw-bold text-info">Game Over! {emoji}</h2>
      <p className="fs-5 text-muted">
        You got <strong className="text-primary">{score}</strong> out of <strong className="text-primary">{totalQuestions}</strong> correct!
      </p>
      <p className="small text-muted fst-italic">({percentage}%)</p>
      <p className={`fs-5 fw-semibold ${messageColor}`}>{message}</p>
      
       <img 
          src="https://geasacperu.com/imagenes/findeljuego.png" 
          alt="Game Over Celebration" 
          className="img-fluid rounded shadow my-2 my-sm-3 w-75 mx-auto"
          loading="lazy"
          style={{maxWidth: '220px'}}
        />

      <button
        onClick={handleButtonClick}
        onMouseEnter={handleButtonHover}
        className="btn btn-warning btn-lg rounded-pill shadow px-4 py-2 text-dark"
      >
        Play Again? 🔁
      </button>
    </div>
  );
};

const EndScreen = React.memo(EndScreenComponent);
export default EndScreen;