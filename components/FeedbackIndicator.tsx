
import React from 'react';

interface FeedbackIndicatorProps {
  isCorrect: boolean;
  correctAnswer: string;
}

const FeedbackIndicatorComponent: React.FC<FeedbackIndicatorProps> = ({ isCorrect, correctAnswer }) => {
  if (isCorrect) {
    return (
      <div className="mt-2 sm:mt-3 p-2 sm:p-3 rounded-lg bg-green-100 border-2 border-green-500 text-green-700 text-center">
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold">Awesome! 🎉</h3>
        <p className="text-sm sm:text-base">That's correct!</p>
      </div>
    );
  } else {
    return (
      <div className="mt-2 sm:mt-3 p-2 sm:p-3 rounded-lg bg-red-100 border-2 border-red-500 text-red-700 text-center">
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold">Oops! 🙈</h3>
        <p className="text-sm sm:text-base">Not quite. The correct answer is <strong className="font-semibold">{correctAnswer}</strong>.</p>
      </div>
    );
  }
};

const FeedbackIndicator = React.memo(FeedbackIndicatorComponent);
export default FeedbackIndicator;
    