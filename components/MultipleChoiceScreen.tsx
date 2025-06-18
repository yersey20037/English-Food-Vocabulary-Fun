
import React, { useState, useEffect } from 'react';
import { FoodItem, OptionButtonDisplayStatus } from '../types';
import OptionButton from './OptionButton';
import FeedbackIndicator from './FeedbackIndicator';

interface MultipleChoiceScreenProps {
  foodItem: FoodItem;
  options: string[];
  onSelectOption: (option: string) => void;
  selectedAnswer: string | null;
  isAnswerCorrect: boolean | null;
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
    new Audio(soundUrl).play();
  } catch (error) {
    console.warn("Sound play prevented:", error);
  }
};

const MultipleChoiceScreen: React.FC<MultipleChoiceScreenProps> = ({
  foodItem,
  options,
  onSelectOption,
  selectedAnswer,
  isAnswerCorrect,
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
  }, [foodItem.imageUrl]);

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
    const isCorrectOption = optionText === foodItem.name_en;

    if (imageStatus === 'loading') {
      return 'DISABLED_LOADING';
    }

    if (showFeedback) { // Global feedback phase is active
      if (optionText === selectedAnswer) { // This option was the one selected by the user
        return isAnswerCorrect ? 'FEEDBACK_CORRECT_SELECTED' : 'FEEDBACK_INCORRECT_SELECTED';
      } else { // This option was not selected by the user
        return isCorrectOption ? 'FEEDBACK_REVEALED_CORRECT' : 'FEEDBACK_REVEALED_NEUTRAL';
      }
    } else { // Not in global feedback phase (user is actively choosing or has chosen)
      if (optionText === selectedAnswer) {
        return 'SELECTED_PENDING_FEEDBACK';
      }
      return 'DEFAULT';
    }
  };
  
  const isOptionActuallyDisabled = (status: OptionButtonDisplayStatus): boolean => {
    // Buttons are disabled if loading, or if in feedback mode, or if an option has been selected (pending feedback)
    if (status === 'DISABLED_LOADING' || showFeedback) {
        return true;
    }
    // If not in feedback mode and image is loaded, allow interaction unless an answer is already selected
    return status === 'SELECTED_PENDING_FEEDBACK'; 
  };

  const handleNextWordClick = () => {
    if (proceedToNextQuestion) {
      playUISound('https://geasacperu.com/imagenes/click.aac');
      proceedToNextQuestion();
    }
  };

  const handleButtonHover = () => {
      playUISound('https://geasacperu.com/imagenes/recorrer.aac');
  };

  return (
    <div className="w-full flex flex-col items-center space-y-4 md:space-y-6 animate-fadeIn">
      <div className="w-full flex justify-between items-center text-slate-700 font-semibold">
        <span className="text-lg bg-sky-200 px-3 py-1 rounded-full shadow">Score: {score}</span>
        <span className="text-lg bg-amber-200 px-3 py-1 rounded-full shadow">Question: {currentQuestion} / {totalQuestions}</span>
      </div>
      
      <h2 className="text-3xl md:text-4xl font-bold text-purple-600 drop-shadow-md">
        What is this?
      </h2>
      
      <div className="relative w-full max-w-sm h-52 md:h-64 rounded-xl shadow-2xl overflow-hidden group bg-slate-200 flex items-center justify-center">
        {imageStatus === 'loading' && (
          <p className="text-slate-500 animate-pulse">Image loading...</p>
        )}
        {imageStatus === 'error' && (
          <p className="text-red-500">Could not load image.</p>
        )}
        <img 
          src={currentImageSrc} 
          alt={foodItem.name_en} 
          className={`w-full h-full object-contain transform transition-opacity duration-300 group-hover:scale-110 ${imageStatus === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
          key={foodItem.id} 
        />
        {imageStatus === 'loaded' && <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-200"></div>}
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-4 w-full mt-2">
        {options.map((option) => {
          const displayStatus = getOptionDisplayStatus(option);
          // Determine if the button should be *actually* disabled from an HTML perspective
          // This prevents click events even if styling doesn't make it look fully disabled.
          let actuallyDisabled = displayStatus === 'DISABLED_LOADING' || showFeedback;
          if (!showFeedback && selectedAnswer !== null) { // If an answer is selected, disable all options
            actuallyDisabled = true;
          }

          return (
            <OptionButton
              key={option}
              optionText={option}
              onClick={() => onSelectOption(option)}
              displayStatus={displayStatus}
              isActuallyDisabled={actuallyDisabled}
            />
          );
        })}
      </div>
      
      {showFeedback && isAnswerCorrect !== null && (
        <div className="mt-4 w-full flex flex-col items-center space-y-4">
            <FeedbackIndicator isCorrect={isAnswerCorrect} correctAnswer={foodItem.name_en} />
            {proceedToNextQuestion && (
                 <button
                    type="button"
                    onClick={handleNextWordClick}
                    onMouseEnter={handleButtonHover}
                    className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-300"
                  >
                    Next Word 🚀
                  </button>
            )}
        </div>
      )}
    </div>
  );
};

export default MultipleChoiceScreen;