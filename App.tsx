
import React, { useState, useEffect, useCallback } from 'react';
import { GameState, FoodItem, GameMode } from './types';
import { FOOD_ITEMS_DATA, NUMBER_OF_OPTIONS } from './constants';
import StartScreen from './components/StartScreen';
import ModeSelectScreen from './components/ModeSelectScreen';
import MultipleChoiceScreen from './components/MultipleChoiceScreen';
import TypingPracticeScreen from './components/TypingPracticeScreen';
import EndScreen from './components/EndScreen';

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const FullPageLoader: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full w-full space-y-3 sm:space-y-4">
    <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 border-sky-500"></div>
    <p className="text-lg sm:text-xl text-sky-600 font-semibold">Loading your next challenge...</p>
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
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);

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
    setIsAnswerCorrect(null); // Reset feedback for typing
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
  
  const proceedToNextQuestion = useCallback(() => {
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
    setIsAnswerCorrect(correct);
    if (correct) {
      setScore(prevScore => prevScore + 1);
    }
    setGameState(GameState.FEEDBACK);
  };

  const handleTypingAttempt = (typedWord: string) => {
    if (gameState !== GameState.PLAYING_TYPING || isPageLoading) return;

    const correct = typedWord.trim().toLowerCase() === currentFoodItem.name_en.toLowerCase();
    setIsAnswerCorrect(correct);
    if (correct) {
      setScore(prevScore => prevScore + 1);
    }
    setGameState(GameState.FEEDBACK); 
  };


  const handlePlayAgain = () => {
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
            isAnswerCorrect={null}       
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
            isAnswerCorrect={null} 
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
              isAnswerCorrect={isAnswerCorrect}
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
              isAnswerCorrect={isAnswerCorrect}
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
    <div className="bg-white/80 backdrop-blur-md shadow-2xl rounded-xl p-4 sm:p-5 md:p-6 lg:p-8 text-center min-h-[500px] sm:min-h-[550px] md:min-h-[600px] w-full flex flex-col justify-center items-center transform transition-all duration-300 hover:scale-105 relative">
      {isPageLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-xl">
          <FullPageLoader />
        </div>
      )}
      {renderScreen()}
    </div>
  );
};

export default App;
    