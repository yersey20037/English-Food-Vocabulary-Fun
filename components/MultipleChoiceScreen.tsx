
import React, { useState, useEffect } from 'react';
import { FoodItem, OptionButtonDisplayStatus } from '../types';
import OptionButton from './OptionButton';
// FeedbackIndicator is removed as modal handles this

interface MultipleChoiceScreenProps {
  foodItem: FoodItem;
  options: string[];
  onSelectOption: (option: string) => void;
  selectedAnswer: string | null;
  // isAnswerCorrect prop is no longer needed here as modal displays feedback text
  showFeedback: boolean; 
  score: number;
  currentQuestion: number;
  totalQuestions: number;
  proceedToNextQuestion?: () => void;
  onContentLoaded?: () => void; 
}

const FALLBACK_IMAGE_URL = 'https://picsum.photos/seed/placeholder_error/400/300';

const playUISound = (soundUrl: string) => {
  try {
    new Audio(soundUrl).play().catch(e => console.warn("Sound play promise rejected:", e));
  } catch (error) {
    console.warn("Sound play prevented:", error);
  }
};

const MultipleChoiceScreen: React.FC<MultipleChoiceScreenProps> = ({
  foodItem,
  options,
  onSelectOption,
  selectedAnswer,
  // isAnswerCorrect, // Removed
  showFeedback,
  score,
  currentQuestion,
  totalQuestions,
  proceedToNextQuestion,
  onContentLoaded
}) => {
  const [currentImageSrc, setCurrentImageSrc] = useState(foodItem.imageUrl);
  const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  useEffect(() => {
    setImageStatus('loading');
    setCurrentImageSrc(foodItem.imageUrl);
  }, [foodItem.imageUrl, foodItem.id]); 

  useEffect(() => {
    if (imageStatus === 'loaded' || imageStatus === 'error') {
      onContentLoaded?.();
    }
  }, [imageStatus, onContentLoaded]);

  const handleImageLoad = () => {
    setImageStatus('loaded');
  };

  const handleImageError = () => {
    if (currentImageSrc !== FALLBACK_IMAGE_URL) {
      setCurrentImageSrc(FALLBACK_IMAGE_URL);
    } else {
      setImageStatus('error'); 
    }
  };

  const getOptionDisplayStatus = (optionText: string): OptionButtonDisplayStatus => {
    // Relies on selectedAnswer from App.tsx to determine state before feedback phase
    // During feedback phase (showFeedback=true), options are hidden, so this logic is mostly for active play.
    if (imageStatus === 'loading') {
      return 'DISABLED_LOADING';
    }
    if (optionText === selectedAnswer) { 
        // If an answer is selected, it's marked as such.
        // The actual correct/incorrect styling is handled by modal now.
        // For the button itself, 'SELECTED_PENDING_FEEDBACK' is enough.
        return 'SELECTED_PENDING_FEEDBACK';
    }
    return 'DEFAULT';
  };
  
  const isOptionActuallyDisabled = (status: OptionButtonDisplayStatus): boolean => {
    if (status === 'DISABLED_LOADING' || showFeedback) { // Options hidden/disabled in feedback
        return true;
    }
    // Disable all options once any answer is selected, even before global feedback state from App
    return selectedAnswer !== null; 
  };

  const handleNextWordClick = () => {
    if (proceedToNextQuestion) {
      playUISound('https://geasacperu.com/imagenes/click.aac');
      proceedToNextQuestion();
    }
  };

  const handleButtonHover = (isDisabled: boolean) => {
    if (!isDisabled) {
      playUISound('https://geasacperu.com/imagenes/recorrer.aac');
    }
  };

  return (
    <div className="w-100 d-flex flex-column align-items-center gap-2 gap-sm-3 animate-fadeIn">
      <div className="row w-100 fw-semibold align-items-center">
        <div className="col text-start">
          <span className="badge bg-info text-dark fs-6 px-2 px-sm-3 py-1 shadow-sm">Score: {score}</span>
        </div>
        <div className="col text-end">
          <span className="badge bg-warning text-dark fs-6 px-2 px-sm-3 py-1 shadow-sm">Question: {currentQuestion} / {totalQuestions}</span>
        </div>
      </div>
      
      <h2 className="h4 fw-bold text-secondary text-center mt-2">
        What is this?
      </h2>
      
      <div 
        className="position-relative w-100 rounded shadow-lg overflow-hidden bg-light d-flex align-items-center justify-content-center mx-auto"
        style={{maxWidth: '320px', height: '180px'}} 
      >
        {imageStatus === 'loading' && (
          <div className="spinner-grow text-secondary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        )}
        {imageStatus === 'error' && (
          <p className="small text-danger m-0">Could not load image.</p>
        )}
        <img 
          src={currentImageSrc} 
          alt={foodItem.name_en} 
          className={`img-fluid object-fit-contain h-100 transition-opacity duration-300 ${imageStatus === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          key={foodItem.id} 
        />
      </div>

      {!showFeedback && (
        <div className="row g-2 g-md-3 w-100 mx-auto mt-2" style={{maxWidth: '320px'}}>
          {options.map((option) => {
            const displayStatus = getOptionDisplayStatus(option);
            const actuallyDisabled = isOptionActuallyDisabled(displayStatus);

            return (
              <div className="col-6" key={option}>
                <OptionButton
                  optionText={option}
                  onClick={() => onSelectOption(option)}
                  displayStatus={displayStatus}
                  isActuallyDisabled={actuallyDisabled}
                />
              </div>
            );
          })}
        </div>
      )}
      
      {showFeedback && proceedToNextQuestion && (
        <div className="mt-3 w-100 mx-auto d-flex flex-column align-items-center gap-2" style={{maxWidth: '320px'}}>
            {/* FeedbackIndicator removed, modal shows this info */}
            <button
                type="button"
                onClick={handleNextWordClick}
                onMouseEnter={() => handleButtonHover(false)}
                className="btn btn-success shadow-sm btn-lg" // Made button larger
            >
                Next Word 🚀
            </button>
        </div>
      )}
    </div>
  );
};

export default MultipleChoiceScreen;
