
import React from 'react';
import { OptionButtonDisplayStatus } from '../types';

interface OptionButtonProps {
  optionText: string;
  onClick: () => void;
  displayStatus: OptionButtonDisplayStatus;
  isActuallyDisabled: boolean;
}

const playUISound = (soundUrl: string) => {
  try {
    new Audio(soundUrl).play();
  } catch (error) {
    console.warn("Sound play prevented:", error);
  }
};

const OptionButtonComponent: React.FC<OptionButtonProps> = ({
  optionText,
  onClick,
  displayStatus,
  isActuallyDisabled,
}) => {
  let buttonStyle = "";
  let ariaPressed: boolean | undefined = undefined;

  switch (displayStatus) {
    case 'DEFAULT':
      buttonStyle = "bg-sky-500 hover:bg-sky-600 text-white";
      break;
    case 'DISABLED_LOADING':
      buttonStyle = "bg-slate-300 text-slate-500 cursor-not-allowed";
      break;
    case 'SELECTED_PENDING_FEEDBACK':
      buttonStyle = "bg-sky-700 text-white ring-4 ring-sky-300";
      ariaPressed = true;
      break;
    case 'FEEDBACK_CORRECT_SELECTED':
      buttonStyle = "bg-green-500 text-white ring-4 ring-green-300";
      ariaPressed = true;
      break;
    case 'FEEDBACK_INCORRECT_SELECTED':
      buttonStyle = "bg-red-500 text-white ring-4 ring-red-300";
      ariaPressed = true;
      break;
    case 'FEEDBACK_REVEALED_CORRECT':
      buttonStyle = "bg-green-300 text-green-700 border-2 border-green-500";
      break;
    case 'FEEDBACK_REVEALED_NEUTRAL':
      buttonStyle = "bg-slate-300 text-slate-500";
      break;
    default: // Should not happen
      buttonStyle = "bg-slate-400 text-white";
  }

  const handleButtonClick = () => {
    if (!isActuallyDisabled) {
      playUISound('https://geasacperu.com/imagenes/click.aac');
      onClick();
    }
  };

  const handleButtonHover = () => {
    if (!isActuallyDisabled) {
      playUISound('https://geasacperu.com/imagenes/recorrer.aac');
    }
  };

  return (
    <button
      onClick={handleButtonClick}
      onMouseEnter={handleButtonHover}
      disabled={isActuallyDisabled} 
      className={`w-full p-4 md:p-5 text-lg md:text-xl font-semibold rounded-lg shadow-md transition-all duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 ${buttonStyle} ${isActuallyDisabled ? 'opacity-70 cursor-not-allowed' : ''}`}
      aria-pressed={ariaPressed}
    >
      {optionText}
    </button>
  );
};

const OptionButton = React.memo(OptionButtonComponent);
export default OptionButton;