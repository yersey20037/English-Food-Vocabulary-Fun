
import React, { useState, useEffect, useRef } from 'react';
import { FoodItem } from '../types';
import FeedbackIndicator from './FeedbackIndicator';

interface TypingPracticeScreenProps {
  foodItem: FoodItem;
  onAttempt: (typedWord: string) => void;
  isAnswerCorrect: boolean | null;
  showFeedbackGlobal: boolean;
  score: number;
  currentQuestion: number;
  totalQuestions: number;
  proceedToNextQuestion?: () => void;
  onContentLoaded?: () => void; // Made optional
}

const FALLBACK_IMAGE_URL = 'https://picsum.photos/seed/placeholder_error/400/300';

const playUISound = (soundUrl: string) => {
  try {
    new Audio(soundUrl).play();
  } catch (error) {
    console.warn("Sound play prevented:", error);
  }
};

const TypingPracticeScreen: React.FC<TypingPracticeScreenProps> = ({
  foodItem,
  onAttempt,
  isAnswerCorrect,
  showFeedbackGlobal,
  score,
  currentQuestion,
  totalQuestions,
  proceedToNextQuestion,
  onContentLoaded,
}) => {
  const [typedWord, setTypedWord] = useState<string>('');
  const [currentImageSrc, setCurrentImageSrc] = useState(foodItem.imageUrl);
  const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setImageStatus('loading');
    setCurrentImageSrc(foodItem.imageUrl);
    setTypedWord(''); 
  }, [foodItem.imageUrl]); 

  useEffect(() => {
    if (imageStatus === 'loaded' || imageStatus === 'error') {
      onContentLoaded?.();
    }
  }, [imageStatus, onContentLoaded]);

  useEffect(() => {
    if (!showFeedbackGlobal && imageStatus === 'loaded' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showFeedbackGlobal, imageStatus]);

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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTypedWord(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (areControlsDisabled || !typedWord.trim()) return;
    playUISound('https://geasacperu.com/imagenes/click.aac');
    onAttempt(typedWord.trim());
  };
  
  const areControlsDisabled = showFeedbackGlobal || imageStatus !== 'loaded';
  const isCheckButtonDisabled = areControlsDisabled || !typedWord.trim();

  const handleButtonHover = (isDisabled: boolean) => {
    if (!isDisabled) {
      playUISound('https://geasacperu.com/imagenes/recorrer.aac');
    }
  };

  const handleNextWordClick = () => {
    if (proceedToNextQuestion) {
      playUISound('https://geasacperu.com/imagenes/click.aac');
      proceedToNextQuestion();
    }
  };

  return (
    <div className="w-full flex flex-col items-center space-y-4 md:space-y-6 animate-fadeIn">
      <div className="w-full flex justify-between items-center text-slate-700 font-semibold">
        <span className="text-lg bg-sky-200 px-3 py-1 rounded-full shadow">Score: {score}</span>
        <span className="text-lg bg-amber-200 px-3 py-1 rounded-full shadow">Question: {currentQuestion} / {totalQuestions}</span>
      </div>

      <h2 className="text-3xl md:text-4xl font-bold text-purple-600 drop-shadow-md">
        Type the word:
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

      {!showFeedbackGlobal && (
        <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col items-center space-y-3 mt-4">
          <label htmlFor="typing-input" className="sr-only">Type the food name</label>
          <input
            id="typing-input"
            ref={inputRef}
            type="text"
            value={typedWord}
            onChange={handleInputChange}
            placeholder="Type here..."
            className="p-3 border-2 border-sky-300 rounded-lg w-full text-lg shadow-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
            aria-label="Type the food name"
            disabled={areControlsDisabled}
          />
          <button
            type="submit"
            onMouseEnter={() => handleButtonHover(isCheckButtonDisabled)}
            className="px-8 py-3 bg-yellow-400 hover:bg-yellow-500 text-yellow-800 font-semibold rounded-lg shadow-md transform hover:scale-105 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isCheckButtonDisabled}
          >
            Check ✅
          </button>
        </form>
      )}
      
      {showFeedbackGlobal && isAnswerCorrect !== null && (
        <div className="mt-4 w-full flex flex-col items-center space-y-4">
            <FeedbackIndicator isCorrect={isAnswerCorrect} correctAnswer={foodItem.name_en} />
            {proceedToNextQuestion && (
                 <button
                    type="button"
                    onClick={handleNextWordClick}
                    onMouseEnter={() => handleButtonHover(false)}
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

export default TypingPracticeScreen;