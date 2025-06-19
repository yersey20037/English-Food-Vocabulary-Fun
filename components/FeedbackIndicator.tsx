
import React from 'react';

interface FeedbackIndicatorProps {
  isCorrect: boolean;
  correctAnswer: string;
}

// This component is not actively used by MultipleChoiceScreen or TypingPracticeScreen
// as feedback messages are now handled by the FeedbackModal.
// It's kept here in case a need for a simple inline indicator arises elsewhere,
// or it can be safely removed if no longer needed.

const FeedbackIndicatorComponent: React.FC<FeedbackIndicatorProps> = ({ isCorrect, correctAnswer }) => {
  if (isCorrect) {
    return (
      <div className="alert alert-success text-center p-2 p-sm-3 w-100" role="alert">
        <h4 className="alert-heading h5 fw-bold">Awesome! 🎉</h4>
        <p className="mb-0 small">That's correct!</p>
      </div>
    );
  } else {
    return (
      <div className="alert alert-danger text-center p-2 p-sm-3 w-100" role="alert">
        <h4 className="alert-heading h5 fw-bold">Oops! 🙈</h4>
        <p className="mb-0 small">Not quite. The correct answer is <strong className="fw-bold">{correctAnswer}</strong>.</p>
      </div>
    );
  }
};

const FeedbackIndicator = React.memo(FeedbackIndicatorComponent);
export default FeedbackIndicator;
