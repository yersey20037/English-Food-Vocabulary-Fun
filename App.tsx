
import React, { useState, useEffect, useCallback } from 'react';
import { GameState, FoodItem, GameMode } from './types';
import { FOOD_ITEMS_DATA, NUMBER_OF_OPTIONS, FEEDBACK_DELAY_MS } from './constants';
import StartScreen from './components/StartScreen';
import ModeSelectScreen from './components/ModeSelectScreen';
import MultipleChoiceScreen from './components/MultipleChoiceScreen';
import TypingPracticeScreen from './components/TypingPracticeScreen';
import EndScreen from './components/EndScreen';
import FeedbackToast from './components/FeedbackToast'; // Import the new toast

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const playUISound = (soundUrl: string) => {
  try {
    new Audio(soundUrl).play().catch(e => console.warn("Sound play promise rejected:", e));
  } catch (error) {
    console.warn("Sound play prevented:", error);
  }
};

const FullPageLoader: React.FC = () => (
  <div className="d-flex flex-column align-items-center justify-content-center h-100 w-100 gap-3">
    <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
      <span className="visually-hidden">Loading...</span>
    </div>
    <p className="fs-5 text-primary fw-semibold">Loading your next challenge...</p>
  </div>
);

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [shuffledFoodItems, setShuffledFoodItems] = useState<FoodItem[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null); // Still useful for game logic
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);

  // State for Feedback Toast
  const [isFeedbackToastVisible, setIsFeedbackToastVisible] = useState<boolean>(false);
  const [feedbackToastTitle, setFeedbackToastTitle] = useState<string>('');
  const [feedbackToastBody, setFeedbackToastBody] = useState<React.ReactNode>('');
  const [toastIsCorrect, setToastIsCorrect] = useState<boolean | null>(null);


  const currentFoodItem = shuffledFoodItems[currentQuestionIndex];

  const handleContentLoaded = useCallback(() => {
    setIsPageLoading(false);
  }, []);

  const prepareMCQQuestion = useCallback((index: number) => {
    if (index >= shuffledFoodItems.length) {
      return;
    }
    const correctItem = shuffledFoodItems[index];
    const distractors = shuffleArray(
      FOOD_ITEMS_DATA.filter(item => item.id !== correctItem.id)
    ).slice(0, NUMBER_OF_OPTIONS - 1).map(item => item.name_en);
    
    setCurrentOptions(shuffleArray([correctItem.name_en, ...distractors]));
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
  }, [shuffledFoodItems]);

  const prepareTypingQuestion = useCallback((index: number) => {
    if (index >= shuffledFoodItems.length) {
      return;
    }
    setIsAnswerCorrect(null); 
  }, [shuffledFoodItems]);

  useEffect(() => {
    if (shuffledFoodItems.length === 0 || !currentFoodItem) return;

    if (gameState === GameState.PLAYING_MCQ && gameMode === GameMode.MULTIPLE_CHOICE) {
      prepareMCQQuestion(currentQuestionIndex);
    } else if (gameState === GameState.PLAYING_TYPING && gameMode === GameMode.TYPING_PRACTICE) {
      prepareTypingQuestion(currentQuestionIndex);
    }
  }, [gameState, gameMode, currentQuestionIndex, shuffledFoodItems, currentFoodItem, prepareMCQQuestion, prepareTypingQuestion]);


  const handleStartApp = () => {
    setGameState(GameState.MODE_SELECTION);
  };

  const handleModeSelect = (selectedMode: GameMode) => {
    setIsPageLoading(true); 
    setGameMode(selectedMode);
    const newShuffledItems = shuffleArray(FOOD_ITEMS_DATA);
    setShuffledFoodItems(newShuffledItems);
    setCurrentQuestionIndex(0);
    setScore(0);
    if (selectedMode === GameMode.MULTIPLE_CHOICE) {
      setGameState(GameState.PLAYING_MCQ);
    } else if (selectedMode === GameMode.TYPING_PRACTICE) {
      setGameState(GameState.PLAYING_TYPING);
    }
  };
  
  const handleCloseFeedbackToast = () => {
    setIsFeedbackToastVisible(false);
  };

  const proceedToNextQuestion = useCallback(() => {
    handleCloseFeedbackToast(); // Close toast before proceeding
    if (currentQuestionIndex < shuffledFoodItems.length - 1) {
      setIsPageLoading(true); 
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedAnswer(null);
      setIsAnswerCorrect(null);
      if (gameMode === GameMode.MULTIPLE_CHOICE) {
        setGameState(GameState.PLAYING_MCQ);
      } else if (gameMode === GameMode.TYPING_PRACTICE) {
        setGameState(GameState.PLAYING_TYPING);
      }
    } else {
      setGameState(GameState.END);
      setIsPageLoading(false); 
    }
  }, [currentQuestionIndex, shuffledFoodItems.length, gameMode]);

  const handleMCQAnswer = (answer: string) => {
    if (gameState !== GameState.PLAYING_MCQ || isPageLoading || selectedAnswer !== null) return; 

    setSelectedAnswer(answer);
    const correct = answer === currentFoodItem.name_en;
    setIsAnswerCorrect(correct); // This state can still be useful for immediate logic if needed
    
    if (correct) {
      setScore(prevScore => prevScore + 1);
      playUISound('https://geasacperu.com/imagenes/correct.aac'); 
      setFeedbackToastTitle("Awesome! 🎉");
      setFeedbackToastBody("That's correct!");
    } else {
      playUISound('https://geasacperu.com/imagenes/incorrect.aac'); 
      setFeedbackToastTitle("Oops! 🙈");
      setFeedbackToastBody(<>Not quite. The correct answer is <strong>{currentFoodItem.name_en}</strong>.</>);
    }
    setToastIsCorrect(correct);
    setIsFeedbackToastVisible(true);
    setGameState(GameState.FEEDBACK);
  };

  const handleTypingAttempt = (typedWord: string) => {
    if (gameState !== GameState.PLAYING_TYPING || isPageLoading) return;

    const correct = typedWord.trim().toLowerCase() === currentFoodItem.name_en.toLowerCase();
    setIsAnswerCorrect(correct);

    if (correct) {
      setScore(prevScore => prevScore + 1);
      playUISound('https://geasacperu.com/imagenes/correct.aac');
      setFeedbackToastTitle("Awesome! 🎉");
      setFeedbackToastBody("That's correct!");
    } else {
      playUISound('https://geasacperu.com/imagenes/incorrect.aac');
      setFeedbackToastTitle("Oops! 🙈");
      setFeedbackToastBody(<>Not quite. The correct answer is <strong>{currentFoodItem.name_en}</strong>.</>);
    }
    setToastIsCorrect(correct);
    setIsFeedbackToastVisible(true);
    setGameState(GameState.FEEDBACK); 
  };


  const handlePlayAgain = () => {
    handleCloseFeedbackToast(); // Ensure toast is closed
    setGameMode(null);
    setGameState(GameState.MODE_SELECTION);
    setIsPageLoading(false);
  };

  const renderScreen = () => {
    switch (gameState) {
      case GameState.START:
        return <StartScreen onStart={handleStartApp} />;
      case GameState.MODE_SELECTION:
        return <ModeSelectScreen onSelectMode={handleModeSelect} />;
      
      case GameState.PLAYING_MCQ:
        if (!currentFoodItem) return <FullPageLoader />; 
        return (
          <MultipleChoiceScreen
            key={currentFoodItem.id} 
            foodItem={currentFoodItem}
            options={currentOptions}
            onSelectOption={handleMCQAnswer}
            selectedAnswer={selectedAnswer}      
            showFeedback={false} 
            score={score}
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={shuffledFoodItems.length}
            onContentLoaded={handleContentLoaded}
          />
        );
      case GameState.PLAYING_TYPING:
        if (!currentFoodItem) return <FullPageLoader />;
        return (
          <TypingPracticeScreen
            key={currentFoodItem.id} 
            foodItem={currentFoodItem}
            onAttempt={handleTypingAttempt}
            showFeedbackGlobal={false} 
            score={score}
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={shuffledFoodItems.length}
            onContentLoaded={handleContentLoaded}
          />
        );
      case GameState.FEEDBACK:
        if (!currentFoodItem) return <FullPageLoader />; 
        if (gameMode === GameMode.MULTIPLE_CHOICE) {
          return (
            <MultipleChoiceScreen
              key={currentFoodItem.id + "-feedback"} 
              foodItem={currentFoodItem}
              options={currentOptions} 
              onSelectOption={() => {}} 
              selectedAnswer={selectedAnswer}
              showFeedback={true} 
              score={score}
              currentQuestion={currentQuestionIndex + 1}
              totalQuestions={shuffledFoodItems.length}
              proceedToNextQuestion={proceedToNextQuestion}
              onContentLoaded={() => {}} 
            />
          );
        } else if (gameMode === GameMode.TYPING_PRACTICE) {
           return (
            <TypingPracticeScreen
              key={currentFoodItem.id + "-feedback"} 
              foodItem={currentFoodItem}
              onAttempt={() => {}} 
              showFeedbackGlobal={true} 
              score={score}
              currentQuestion={currentQuestionIndex + 1}
              totalQuestions={shuffledFoodItems.length}
              proceedToNextQuestion={proceedToNextQuestion} 
              onContentLoaded={() => {}} 
            />
          );
        }
        return null;
      case GameState.END:
        return (
          <EndScreen
            score={score}
            totalQuestions={shuffledFoodItems.length}
            onPlayAgain={handlePlayAgain}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div 
          className="card shadow-lg text-center p-3 p-sm-4 p-md-5 mx-auto" 
          style={{
              width: '100%',
              maxWidth: '650px', 
              minHeight: 'auto', 
              height: 'auto', 
              backgroundColor: 'rgba(255, 255, 255, 0.90)' 
          }}
      >
          <div className="card-body d-flex flex-column justify-content-center align-items-center position-relative">
              {isPageLoading && (
                  <div 
                      className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center rounded" 
                      style={{backgroundColor: 'rgba(255, 255, 255, 0.95)', zIndex: 10}}
                  >
                      <FullPageLoader />
                  </div>
              )}
              <div className="w-100">
                {renderScreen()}
              </div>
          </div>
      </div>

      {/* Toast Container for positioning */}
      <div 
        className="toast-container position-fixed bottom-0 start-50 translate-middle-x p-3"
        style={{zIndex: 1100}} /* Ensure toast is above other elements */
      >
        <FeedbackToast
          show={isFeedbackToastVisible}
          onClose={handleCloseFeedbackToast}
          title={feedbackToastTitle}
          body={feedbackToastBody}
          isCorrect={toastIsCorrect}
          delay={FEEDBACK_DELAY_MS}
        />
      </div>
    </>
  );
};

export default App;
