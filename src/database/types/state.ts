import { User, QuizResult, Module, EntityMetadata } from './entities';

/**
 * Normalized state structure with entities stored by ID
 */
export interface DatabaseState {
  // Entity collections (normalized by ID)
  users: Record<string, User>;
  quizResults: Record<string, QuizResult>;
  modules: Record<string, Module>;
  
  // Metadata per entity type
  metadata: {
    users: EntityMetadata;
    quizResults: EntityMetadata;
    modules: EntityMetadata;
  };
  
  // Global state
  initialized: boolean;
  lastSync: number;
  version: string; // For schema migrations
}

/**
 * Action types for database operations
 */
export type DatabaseAction =
  // User actions
  | { type: 'USER_ADD'; payload: User }
  | { type: 'USER_UPDATE'; payload: { id: string; updates: Partial<User> } }
  | { type: 'USER_DELETE'; payload: string }
  | { type: 'USERS_ADD_MULTIPLE'; payload: User[] }
  | { type: 'USERS_DELETE_MULTIPLE'; payload: string[] }
  | { type: 'USER_SET_LOADING'; payload: boolean }
  | { type: 'USER_SET_ERROR'; payload: string | null }
  
  // QuizResult actions
  | { type: 'QUIZ_RESULT_ADD'; payload: QuizResult }
  | { type: 'QUIZ_RESULT_UPDATE'; payload: { id: string; updates: Partial<QuizResult> } }
  | { type: 'QUIZ_RESULT_DELETE'; payload: string }
  | { type: 'QUIZ_RESULTS_ADD_MULTIPLE'; payload: QuizResult[] }
  | { type: 'QUIZ_RESULTS_DELETE_MULTIPLE'; payload: string[] }
  | { type: 'QUIZ_RESULT_SET_LOADING'; payload: boolean }
  | { type: 'QUIZ_RESULT_SET_ERROR'; payload: string | null }
  
  // Module actions
  | { type: 'MODULE_ADD'; payload: Module }
  | { type: 'MODULE_UPDATE'; payload: { id: string; updates: Partial<Module> } }
  | { type: 'MODULE_DELETE'; payload: string }
  | { type: 'MODULES_ADD_MULTIPLE'; payload: Module[] }
  | { type: 'MODULES_DELETE_MULTIPLE'; payload: string[] }
  | { type: 'MODULE_SET_LOADING'; payload: boolean }
  | { type: 'MODULE_SET_ERROR'; payload: string | null }
  
  // Global actions
  | { type: 'STATE_RESET' }
  | { type: 'STATE_HYDRATE'; payload: Partial<DatabaseState> }
  | { type: 'STATE_SET_INITIALIZED'; payload: boolean }
  | { type: 'STATE_SET_LAST_SYNC'; payload: number };

/**
 * Initial state for the database
 */
export const initialDatabaseState: DatabaseState = {
  users: {},
  quizResults: {},
  modules: {},
  metadata: {
    users: { loading: false, error: null },
    quizResults: { loading: false, error: null },
    modules: { loading: false, error: null },
  },
  initialized: false,
  lastSync: 0,
  version: '1.0.0',
};

