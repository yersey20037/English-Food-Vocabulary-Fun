
import React from 'react';
import { FoodItem, OptionButtonDisplayStatus } from '../types';
import OptionButton from './OptionButton';
import FeedbackIndicator from './FeedbackIndicator';

interface MultipleChoiceScreenProps {
  foodItem: FoodItem;
  options: string[];
  onSelectOption: (option: string) => void;
  selectedAnswer: string | null;
  isAnswerCorrect: boolean | null;
  showFeedback: boolean; // True when in global FEEDBACK state for MCQ
  score: number;
  currentQuestion: number;
  totalQuestions: number;
}

const MultipleChoiceScreen: React.FC<MultipleChoiceScreenProps> = ({
  foodItem,
  options,
  onSelectOption,
  selectedAnswer,
  isAnswerCorrect,
  showFeedback,
  score,
  currentQuestion,
  totalQuestions
}) => {

  const determineOptionState = (optionText: string): { displayStatus: OptionButtonDisplayStatus, isActuallyDisabled: boolean } => {
    const isThisOptionCorrect = optionText === foodItem.name_en;

    // This component version doesn't handle 'DISABLED_LOADING' as it doesn't manage image loading status directly.
    // If image loading were added, 'DISABLED_LOADING' state would need to be handled.

    if (showFeedback) { // Global feedback phase is active
      let status: OptionButtonDisplayStatus;
      if (optionText === selectedAnswer) { // This option was the one selected by the user
        status = isAnswerCorrect ? 'FEEDBACK_CORRECT_SELECTED' : 'FEEDBACK_INCORRECT_SELECTED';
      } else { // This option was not selected by the user
        status = isThisOptionCorrect ? 'FEEDBACK_REVEALED_CORRECT' : 'FEEDBACK_REVEALED_NEUTRAL';
      }
      return { displayStatus: status, isActuallyDisabled: true };
    } else { // Not in global feedback phase (user is actively choosing or has chosen)
      if (optionText === selectedAnswer) {
        // User has selected this option, awaiting global feedback.
        return { displayStatus: 'SELECTED_PENDING_FEEDBACK', isActuallyDisabled: true };
      }
      // Default, clickable state.
      return { displayStatus: 'DEFAULT', isActuallyDisabled: false };
    }
  };

  return (
    <div className="w-full flex flex-col items-center space-y-4 md:space-y-6 animate-fadeIn">
      <div className="w-full flex justify-between items-center text-slate-700 font-semibold">
        <span className="text-lg bg-sky-200 px-3 py-1 rounded-full shadow">Puntaje: {score}</span>
        <span className="text-lg bg-amber-200 px-3 py-1 rounded-full shadow">{currentQuestion} / {totalQuestions}</span>
      </div>
      
      <h2 className="text-3xl md:text-4xl font-bold text-purple-600 drop-shadow-md">
        ¿Qué es esto? (What is this?)
      </h2>
      
      <div className="relative w-full max-w-sm h-52 md:h-64 rounded-xl shadow-2xl overflow-hidden group">
        <img 
          src={foodItem.imageUrl} 
          alt={foodItem.name_en} 
          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/placeholder_error/400/300';
          }}
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
      </div>

      {!showFeedback && (
        <div className="grid grid-cols-2 gap-3 md:gap-4 w-full mt-2">
          {options.map((option) => {
            const { displayStatus, isActuallyDisabled } = determineOptionState(option);
            return (
              <OptionButton
                key={option}
                optionText={option}
                onClick={() => onSelectOption(option)}
                displayStatus={displayStatus}
                isActuallyDisabled={isActuallyDisabled}
              />
            );
          })}
        </div>
      )}
      
      {showFeedback && isAnswerCorrect !== null && (
        <div className="mt-4 w-full">
            <FeedbackIndicator isCorrect={isAnswerCorrect} correctAnswer={foodItem.name_en} />
        </div>
      )}
    </div>
  );
};

export default MultipleChoiceScreen;
