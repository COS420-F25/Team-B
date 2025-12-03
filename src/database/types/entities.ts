import { User as FirebaseUser } from 'firebase/auth';

/**
 * User entity with local preferences and profile data
 * Extends Firebase user with additional local state
 */
export interface User {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  preferences?: UserPreferences;
  createdAt: number;
  updatedAt: number;
}

/**
 * User preferences stored locally
 */
export interface UserPreferences {
  theme?: 'light' | 'dark' | 'auto';
  notifications?: boolean;
  [key: string]: any; // Allow for future preferences
}

/**
 * Quiz result entity
 */
export interface QuizResult {
  id: string;
  userId: string;
  chapter: number;
  score: {
    correct: number;
    total: number;
    percentage: number;
    isPerfect: boolean;
  };
  answers: Record<number, number>; // questionIndex -> selectedAnswerIndex
  submittedAt: number;
  createdAt: number;
}

/**
 * Module/Chapter entity
 */
export interface Module {
  id: string;
  chapter: number;
  completed: boolean;
  completedAt?: number;
  lastAccessedAt?: number;
  createdAt: number;
  updatedAt: number;
}

/**
 * Entity metadata for tracking state
 */
export interface EntityMetadata {
  loading: boolean;
  error: string | null;
  lastSync?: number;
}

