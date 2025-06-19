
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
    new Audio(soundUrl).play().catch(e => console.warn("Sound play promise rejected:", e));
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
  let buttonClasses = "btn w-100 fw-semibold shadow-sm text-break p-2"; // Base classes
  let ariaPressed: boolean | undefined = undefined;

  switch (displayStatus) {
    case 'DEFAULT':
      buttonClasses += " btn-outline-primary";
      break;
    case 'DISABLED_LOADING':
      buttonClasses += " btn-light text-muted";
      break;
    case 'SELECTED_PENDING_FEEDBACK':
      buttonClasses += " btn-primary active"; // Bootstrap 'active' can show selection
      ariaPressed = true;
      break;
    case 'FEEDBACK_CORRECT_SELECTED':
      buttonClasses += " btn-success active";
      ariaPressed = true;
      break;
    case 'FEEDBACK_INCORRECT_SELECTED':
      buttonClasses += " btn-danger active";
      ariaPressed = true;
      break;
    case 'FEEDBACK_REVEALED_CORRECT':
      buttonClasses += " btn-outline-success border-2"; // Keep border emphasis
      break;
    case 'FEEDBACK_REVEALED_NEUTRAL':
      buttonClasses += " btn-light text-muted";
      break;
    default: 
      buttonClasses += " btn-secondary";
  }

  if (isActuallyDisabled && displayStatus !== 'DISABLED_LOADING') {
      buttonClasses += " disabled"; 
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
      type="button"
      onClick={handleButtonClick}
      onMouseEnter={handleButtonHover}
      disabled={isActuallyDisabled} 
      className={buttonClasses}
      aria-pressed={ariaPressed}
      // Ensure text is small enough but readable
      style={{ fontSize: 'clamp(0.65rem, 2.5vw, 0.8rem)'}} 
    >
      {optionText}
    </button>
  );
};

const OptionButton = React.memo(OptionButtonComponent);
export default OptionButton;
