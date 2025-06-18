export enum GameState {
  START,
  MODE_SELECTION,
  PLAYING_MCQ, // Multiple Choice Question
  PLAYING_TYPING,
  FEEDBACK, // Generic feedback state
  END,
}

export enum GameMode {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TYPING_PRACTICE = 'TYPING_PRACTICE',
}

export interface FoodItem {
  id: string;
  name_en: string;
  imageUrl: string;
}

export interface GroundingChunkWeb {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web?: GroundingChunkWeb;
}

// Defines the explicit visual and interactive states for an OptionButton
export type OptionButtonDisplayStatus =
  | 'DEFAULT' // Standard, interactive
  | 'DISABLED_LOADING' // Disabled because the main image/question is loading
  | 'SELECTED_PENDING_FEEDBACK' // User has selected this, awaiting global feedback
  | 'FEEDBACK_CORRECT_SELECTED' // Feedback active, user selected this, and it was correct
  | 'FEEDBACK_INCORRECT_SELECTED' // Feedback active, user selected this, and it was incorrect
  | 'FEEDBACK_REVEALED_CORRECT' // Feedback active, this is the correct answer, but user didn't select it
  | 'FEEDBACK_REVEALED_NEUTRAL'; // Feedback active, this is an incorrect answer, and user didn't select it
