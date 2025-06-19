
import React, { useState, useEffect, useRef } from 'react';
import { FoodItem } from '../types';
// FeedbackIndicator is removed as modal handles this

interface TypingPracticeScreenProps {
  foodItem: FoodItem;
  onAttempt: (typedWord: string) => void;
  // isAnswerCorrect: boolean | null; // Removed
  showFeedbackGlobal: boolean;
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

const TypingPracticeScreen: React.FC<TypingPracticeScreenProps> = ({
  foodItem,
  onAttempt,
  // isAnswerCorrect, // Removed
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
  }, [foodItem.imageUrl, foodItem.id]);


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
    playUISound('https://geasacperu.com/imagenes/click.aac'); // Sound for submitting
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
        Type the word:
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

      {!showFeedbackGlobal && (
        <form onSubmit={handleSubmit} className="w-100 mx-auto d-flex flex-column align-items-center gap-2 mt-2" style={{maxWidth: '320px'}}>
          <label htmlFor="typing-input" className="visually-hidden">Type the food name</label>
          <input
            id="typing-input"
            ref={inputRef}
            type="text"
            value={typedWord}
            onChange={handleInputChange}
            placeholder="Type here..."
            className="form-control form-control-sm shadow-sm w-100" 
            aria-label="Type the food name"
            disabled={areControlsDisabled}
            autoComplete="off"
            spellCheck="false"
          />
          <button
            type="submit"
            onMouseEnter={() => handleButtonHover(isCheckButtonDisabled)}
            className="btn btn-warning btn-sm shadow-sm text-dark"
            disabled={isCheckButtonDisabled}
          >
            Check ✅
          </button>
        </form>
      )}
      
      {showFeedbackGlobal && proceedToNextQuestion && (
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

export default TypingPracticeScreen;
