# Build a database manager for React
_Exported on 12/3/2025 at 15:21:35 EST from Cursor (2.1.26)_

---

**User**

# Task: Create a Comprehensive Database Manager for React App with Local State and Firebase Auth



## Context

I need a robust database manager that handles local application state for a React app. The app already uses Firebase for authentication. I want clean separation of concerns, TypeScript safety, and efficient state management.



## Requirements



### 1. Database Manager Architecture

- Create a centralized database manager using React Context + useReducer pattern

- Implement a clean API for CRUD operations on local state

- Support multiple data entities (users, posts, comments, settings, etc.)

- Include TypeScript interfaces for all data models

- Add optimistic updates for better UX

- Implement state persistence to localStorage with hydration on mount



### 2. Firebase Auth Integration

- Connect to existing Firebase auth state

- Store authenticated user data in local state

- Sync user profile data between Firebase and local state

- Handle auth state changes (login/logout) and clear relevant state

- Create a custom hook `useAuth` that combines Firebase auth with local user data



### 3. State Structure

Design a normalized state structure with:

- Entities stored by ID in lookup tables

- Separate loading/error states per entity type

- Metadata (timestamps, sync status, etc.)

- User preferences and app settings



### 4. Core Features

- CRUD operations for each entity type

- Batch operations (add multiple, delete multiple)

- State selectors with memoization

- Loading and error handling utilities

- State reset/clear functions

- DevTools-friendly state inspection



### 5. Developer Experience

- Custom hooks for each entity type (e.g., `usePosts`, `useComments`)

- TypeScript autocompletion for all operations

- Clear error messages and validation

- Easy-to-use API that feels intuitive



### 6. File Structure

Organize as follows:

---

**Cursor**


Reviewing the codebase to understand the current structure and Firebase setup.



Checking the existing Firebase and auth setup:



A few clarifications before creating the plan:


---

**User**

I don't understand question 4. Are any of those options better than the other?

---

**Cursor**


Explaining the file structure options and recommending one:



Creating the implementation plan:


---

**User**

What is CRUD?

---

**Cursor**


CRUD stands for Create, Read, Update, Delete — the four basic operations for managing data.

In your database manager, this means:

- **Create**: Add new records (e.g., create a new quiz result, add a user profile)
- **Read**: Retrieve/fetch data (e.g., get all quiz results, get a user by ID)
- **Update**: Modify existing records (e.g., update a user's preferences, update a quiz score)
- **Delete**: Remove records (e.g., delete a quiz result, remove a user)

For your app, examples include:
- **Quiz Results**: Create a new result when a quiz is submitted, read results to display history, update if needed, delete old results
- **Users**: Create user profile in local state when they sign in, read user data, update preferences, clear on logout

The database manager will provide these operations for each entity type (users, quiz results, etc.) with a consistent API, so you can do things like:
```typescript
// Create
addQuizResult({ chapter: 1, score: 100, answers: [...] })

// Read
const results = getQuizResults() // or getQuizResultById(id)

// Update
updateQuizResult(id, { score: 95 })

// Delete
deleteQuizResult(id)
```

This is a standard pattern for data management systems.

```typescript
// Create
addQuizResult({ chapter: 1, score: 100, answers: [...] })

// Read
const results = getQuizResults() // or getQuizResultById(id)

// Update
updateQuizResult(id, { score: 95 })

// Delete
deleteQuizResult(id)
```

---

**User**

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**


Starting implementation. Checking existing todos, then proceeding step by step.



Setting up TypeScript configuration and installing dependencies.



Creating TypeScript configuration:


```jsonc
{
  "compilerOptions": {
    "target": "es5",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": [
    "src"
  ]
}

```


Creating TypeScript type definitions. Starting with entity interfaces:


```typescript
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

```

```typescript
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

```

```typescript
// Export all types for convenient importing
export * from './entities';
export * from './state';

```


Creating the persistence layer and reducer:


```typescript
import { DatabaseState, initialDatabaseState } from '../types';

const STORAGE_KEY = 'gogy_database_state';
const STORAGE_VERSION_KEY = 'gogy_database_version';
const CURRENT_VERSION = '1.0.0';

/**
 * Save state to localStorage with error handling
 */
export const saveStateToLocalStorage = (state: DatabaseState): void => {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
    localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
  } catch (error) {
    // Handle quota exceeded or other storage errors
    if (error instanceof Error) {
      if (error.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded. Some data may not be saved.');
      } else {
        console.error('Error saving to localStorage:', error);
      }
    }
  }
};

/**
 * Load state from localStorage
 */
export const loadStateFromLocalStorage = (): Partial<DatabaseState> | null => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (serialized === null) {
      return null;
    }
    
    const state = JSON.parse(serialized) as Partial<DatabaseState>;
    
    // Check version for potential migrations
    const storedVersion = localStorage.getItem(STORAGE_VERSION_KEY);
    if (storedVersion !== CURRENT_VERSION) {
      console.warn(`State version mismatch. Stored: ${storedVersion}, Current: ${CURRENT_VERSION}`);
      // Future: Add migration logic here
    }
    
    return state;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};

/**
 * Clear state from localStorage
 */
export const clearStateFromLocalStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_VERSION_KEY);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

/**
 * Check if localStorage is available
 */
export const isLocalStorageAvailable = (): boolean => {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

```

```typescript
import { User, QuizResult, Module, DatabaseAction } from '../types';

/**
 * Action creators for User operations
 */
export const userActions = {
  add: (user: User): DatabaseAction => ({
    type: 'USER_ADD',
    payload: user,
  }),
  
  update: (id: string, updates: Partial<User>): DatabaseAction => ({
    type: 'USER_UPDATE',
    payload: { id, updates },
  }),
  
  delete: (id: string): DatabaseAction => ({
    type: 'USER_DELETE',
    payload: id,
  }),
  
  addMultiple: (users: User[]): DatabaseAction => ({
    type: 'USERS_ADD_MULTIPLE',
    payload: users,
  }),
  
  deleteMultiple: (ids: string[]): DatabaseAction => ({
    type: 'USERS_DELETE_MULTIPLE',
    payload: ids,
  }),
  
  setLoading: (loading: boolean): DatabaseAction => ({
    type: 'USER_SET_LOADING',
    payload: loading,
  }),
  
  setError: (error: string | null): DatabaseAction => ({
    type: 'USER_SET_ERROR',
    payload: error,
  }),
};

/**
 * Action creators for QuizResult operations
 */
export const quizResultActions = {
  add: (quizResult: QuizResult): DatabaseAction => ({
    type: 'QUIZ_RESULT_ADD',
    payload: quizResult,
  }),
  
  update: (id: string, updates: Partial<QuizResult>): DatabaseAction => ({
    type: 'QUIZ_RESULT_UPDATE',
    payload: { id, updates },
  }),
  
  delete: (id: string): DatabaseAction => ({
    type: 'QUIZ_RESULT_DELETE',
    payload: id,
  }),
  
  addMultiple: (quizResults: QuizResult[]): DatabaseAction => ({
    type: 'QUIZ_RESULTS_ADD_MULTIPLE',
    payload: quizResults,
  }),
  
  deleteMultiple: (ids: string[]): DatabaseAction => ({
    type: 'QUIZ_RESULTS_DELETE_MULTIPLE',
    payload: ids,
  }),
  
  setLoading: (loading: boolean): DatabaseAction => ({
    type: 'QUIZ_RESULT_SET_LOADING',
    payload: loading,
  }),
  
  setError: (error: string | null): DatabaseAction => ({
    type: 'QUIZ_RESULT_SET_ERROR',
    payload: error,
  }),
};

/**
 * Action creators for Module operations
 */
export const moduleActions = {
  add: (module: Module): DatabaseAction => ({
    type: 'MODULE_ADD',
    payload: module,
  }),
  
  update: (id: string, updates: Partial<Module>): DatabaseAction => ({
    type: 'MODULE_UPDATE',
    payload: { id, updates },
  }),
  
  delete: (id: string): DatabaseAction => ({
    type: 'MODULE_DELETE',
    payload: id,
  }),
  
  addMultiple: (modules: Module[]): DatabaseAction => ({
    type: 'MODULES_ADD_MULTIPLE',
    payload: modules,
  }),
  
  deleteMultiple: (ids: string[]): DatabaseAction => ({
    type: 'MODULES_DELETE_MULTIPLE',
    payload: ids,
  }),
  
  setLoading: (loading: boolean): DatabaseAction => ({
    type: 'MODULE_SET_LOADING',
    payload: loading,
  }),
  
  setError: (error: string | null): DatabaseAction => ({
    type: 'MODULE_SET_ERROR',
    payload: error,
  }),
};

/**
 * Global action creators
 */
export const globalActions = {
  reset: (): DatabaseAction => ({
    type: 'STATE_RESET',
  }),
  
  hydrate: (state: Partial<import('../types').DatabaseState>): DatabaseAction => ({
    type: 'STATE_HYDRATE',
    payload: state,
  }),
  
  setInitialized: (initialized: boolean): DatabaseAction => ({
    type: 'STATE_SET_INITIALIZED',
    payload: initialized,
  }),
  
  setLastSync: (timestamp: number): DatabaseAction => ({
    type: 'STATE_SET_LAST_SYNC',
    payload: timestamp,
  }),
};

```

```typescript
import { DatabaseState, DatabaseAction, initialDatabaseState } from '../types';

/**
 * Main database reducer with CRUD operations, batch operations, and optimistic updates
 */
export const databaseReducer = (
  state: DatabaseState,
  action: DatabaseAction
): DatabaseState => {
  switch (action.type) {
    // User actions
    case 'USER_ADD': {
      const user = action.payload;
      return {
        ...state,
        users: {
          ...state.users,
          [user.id]: user,
        },
        metadata: {
          ...state.metadata,
          users: {
            ...state.metadata.users,
            lastSync: Date.now(),
          },
        },
      };
    }

    case 'USER_UPDATE': {
      const { id, updates } = action.payload;
      const existingUser = state.users[id];
      if (!existingUser) return state;

      return {
        ...state,
        users: {
          ...state.users,
          [id]: {
            ...existingUser,
            ...updates,
            updatedAt: Date.now(),
          },
        },
      };
    }

    case 'USER_DELETE': {
      const { [action.payload]: deleted, ...remainingUsers } = state.users;
      return {
        ...state,
        users: remainingUsers,
      };
    }

    case 'USERS_ADD_MULTIPLE': {
      const usersMap = action.payload.reduce(
        (acc, user) => ({ ...acc, [user.id]: user }),
        {} as Record<string, typeof action.payload[0]>
      );
      return {
        ...state,
        users: {
          ...state.users,
          ...usersMap,
        },
        metadata: {
          ...state.metadata,
          users: {
            ...state.metadata.users,
            lastSync: Date.now(),
          },
        },
      };
    }

    case 'USERS_DELETE_MULTIPLE': {
      const remainingUsers = { ...state.users };
      action.payload.forEach((id) => {
        delete remainingUsers[id];
      });
      return {
        ...state,
        users: remainingUsers,
      };
    }

    case 'USER_SET_LOADING':
      return {
        ...state,
        metadata: {
          ...state.metadata,
          users: {
            ...state.metadata.users,
            loading: action.payload,
          },
        },
      };

    case 'USER_SET_ERROR':
      return {
        ...state,
        metadata: {
          ...state.metadata,
          users: {
            ...state.metadata.users,
            error: action.payload,
          },
        },
      };

    // QuizResult actions
    case 'QUIZ_RESULT_ADD': {
      const quizResult = action.payload;
      return {
        ...state,
        quizResults: {
          ...state.quizResults,
          [quizResult.id]: quizResult,
        },
        metadata: {
          ...state.metadata,
          quizResults: {
            ...state.metadata.quizResults,
            lastSync: Date.now(),
          },
        },
      };
    }

    case 'QUIZ_RESULT_UPDATE': {
      const { id, updates } = action.payload;
      const existingResult = state.quizResults[id];
      if (!existingResult) return state;

      return {
        ...state,
        quizResults: {
          ...state.quizResults,
          [id]: {
            ...existingResult,
            ...updates,
          },
        },
      };
    }

    case 'QUIZ_RESULT_DELETE': {
      const { [action.payload]: deleted, ...remainingResults } = state.quizResults;
      return {
        ...state,
        quizResults: remainingResults,
      };
    }

    case 'QUIZ_RESULTS_ADD_MULTIPLE': {
      const resultsMap = action.payload.reduce(
        (acc, result) => ({ ...acc, [result.id]: result }),
        {} as Record<string, typeof action.payload[0]>
      );
      return {
        ...state,
        quizResults: {
          ...state.quizResults,
          ...resultsMap,
        },
        metadata: {
          ...state.metadata,
          quizResults: {
            ...state.metadata.quizResults,
            lastSync: Date.now(),
          },
        },
      };
    }

    case 'QUIZ_RESULTS_DELETE_MULTIPLE': {
      const remainingResults = { ...state.quizResults };
      action.payload.forEach((id) => {
        delete remainingResults[id];
      });
      return {
        ...state,
        quizResults: remainingResults,
      };
    }

    case 'QUIZ_RESULT_SET_LOADING':
      return {
        ...state,
        metadata: {
          ...state.metadata,
          quizResults: {
            ...state.metadata.quizResults,
            loading: action.payload,
          },
        },
      };

    case 'QUIZ_RESULT_SET_ERROR':
      return {
        ...state,
        metadata: {
          ...state.metadata,
          quizResults: {
            ...state.metadata.quizResults,
            error: action.payload,
          },
        },
      };

    // Module actions
    case 'MODULE_ADD': {
      const module = action.payload;
      return {
        ...state,
        modules: {
          ...state.modules,
          [module.id]: module,
        },
        metadata: {
          ...state.metadata,
          modules: {
            ...state.metadata.modules,
            lastSync: Date.now(),
          },
        },
      };
    }

    case 'MODULE_UPDATE': {
      const { id, updates } = action.payload;
      const existingModule = state.modules[id];
      if (!existingModule) return state;

      return {
        ...state,
        modules: {
          ...state.modules,
          [id]: {
            ...existingModule,
            ...updates,
            updatedAt: Date.now(),
          },
        },
      };
    }

    case 'MODULE_DELETE': {
      const { [action.payload]: deleted, ...remainingModules } = state.modules;
      return {
        ...state,
        modules: remainingModules,
      };
    }

    case 'MODULES_ADD_MULTIPLE': {
      const modulesMap = action.payload.reduce(
        (acc, module) => ({ ...acc, [module.id]: module }),
        {} as Record<string, typeof action.payload[0]>
      );
      return {
        ...state,
        modules: {
          ...state.modules,
          ...modulesMap,
        },
        metadata: {
          ...state.metadata,
          modules: {
            ...state.metadata.modules,
            lastSync: Date.now(),
          },
        },
      };
    }

    case 'MODULES_DELETE_MULTIPLE': {
      const remainingModules = { ...state.modules };
      action.payload.forEach((id) => {
        delete remainingModules[id];
      });
      return {
        ...state,
        modules: remainingModules,
      };
    }

    case 'MODULE_SET_LOADING':
      return {
        ...state,
        metadata: {
          ...state.metadata,
          modules: {
            ...state.metadata.modules,
            loading: action.payload,
          },
        },
      };

    case 'MODULE_SET_ERROR':
      return {
        ...state,
        metadata: {
          ...state.metadata,
          modules: {
            ...state.metadata.modules,
            error: action.payload,
          },
        },
      };

    // Global actions
    case 'STATE_RESET':
      return initialDatabaseState;

    case 'STATE_HYDRATE':
      return {
        ...initialDatabaseState,
        ...action.payload,
        initialized: true,
      };

    case 'STATE_SET_INITIALIZED':
      return {
        ...state,
        initialized: action.payload,
      };

    case 'STATE_SET_LAST_SYNC':
      return {
        ...state,
        lastSync: action.payload,
      };

    default:
      return state;
  }
};

```


Creating the DatabaseContext with Firebase auth integration:


```typescriptreact
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { databaseReducer, initialDatabaseState } from './reducers/databaseReducer';
import { DatabaseState, DatabaseAction, User } from './types';
import {
  saveStateToLocalStorage,
  loadStateFromLocalStorage,
  isLocalStorageAvailable,
} from './utils/localStorage';
import { globalActions, userActions } from './reducers/actions';

interface DatabaseContextValue {
  state: DatabaseState;
  dispatch: React.Dispatch<DatabaseAction>;
}

const DatabaseContext = createContext<DatabaseContextValue | null>(null);

interface DatabaseProviderProps {
  children: React.ReactNode;
  firebaseUser?: FirebaseUser | null;
}

/**
 * Database Provider component that manages local state with persistence
 * and integrates with Firebase auth
 */
export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({
  children,
  firebaseUser,
}) => {
  const [state, dispatch] = useReducer(databaseReducer, initialDatabaseState);

  // Hydrate state from localStorage on mount
  useEffect(() => {
    if (!isLocalStorageAvailable()) {
      console.warn('localStorage is not available. State will not persist.');
      dispatch(globalActions.setInitialized(true));
      return;
    }

    const savedState = loadStateFromLocalStorage();
    if (savedState) {
      dispatch(globalActions.hydrate(savedState));
    }
    dispatch(globalActions.setInitialized(true));
  }, []);

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    if (!state.initialized || !isLocalStorageAvailable()) {
      return;
    }

    // Debounce saves to avoid excessive writes
    const timeoutId = setTimeout(() => {
      saveStateToLocalStorage(state);
      dispatch(globalActions.setLastSync(Date.now()));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [state]);

  // Sync Firebase user with local state
  useEffect(() => {
    if (!firebaseUser) {
      // User logged out - clear user data if needed
      // Note: We might want to keep some data, so this is optional
      return;
    }

    // Check if user already exists in local state
    const existingUser = state.users[firebaseUser.uid];
    
    if (!existingUser) {
      // Create new user in local state
      const newUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        preferences: {},
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      dispatch(userActions.add(newUser));
    } else {
      // Update existing user with latest Firebase data
      const updates: Partial<User> = {
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        updatedAt: Date.now(),
      };
      dispatch(userActions.update(firebaseUser.uid, updates));
    }
  }, [firebaseUser, state.users]);

  return (
    <DatabaseContext.Provider value={{ state, dispatch }}>
      {children}
    </DatabaseContext.Provider>
  );
};

/**
 * Hook to access database context
 * @throws Error if used outside DatabaseProvider
 */
export const useDatabase = (): DatabaseContextValue => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within DatabaseProvider');
  }
  return context;
};

```


Creating selectors, then hooks:


```typescript
import { useMemo } from 'react';
import { DatabaseState, User, QuizResult, Module } from '../types';

/**
 * Get all users as an array
 */
export const selectAllUsers = (state: DatabaseState): User[] => {
  return Object.values(state.users);
};

/**
 * Get user by ID
 */
export const selectUserById = (state: DatabaseState, userId: string): User | undefined => {
  return state.users[userId];
};

/**
 * Get all quiz results as an array
 */
export const selectAllQuizResults = (state: DatabaseState): QuizResult[] => {
  return Object.values(state.quizResults);
};

/**
 * Get quiz result by ID
 */
export const selectQuizResultById = (
  state: DatabaseState,
  resultId: string
): QuizResult | undefined => {
  return state.quizResults[resultId];
};

/**
 * Get quiz results by user ID
 */
export const selectQuizResultsByUserId = (
  state: DatabaseState,
  userId: string
): QuizResult[] => {
  return Object.values(state.quizResults).filter((result) => result.userId === userId);
};

/**
 * Get quiz results by chapter
 */
export const selectQuizResultsByChapter = (
  state: DatabaseState,
  chapter: number
): QuizResult[] => {
  return Object.values(state.quizResults).filter((result) => result.chapter === chapter);
};

/**
 * Get quiz results by user and chapter
 */
export const selectQuizResultsByUserAndChapter = (
  state: DatabaseState,
  userId: string,
  chapter: number
): QuizResult[] => {
  return Object.values(state.quizResults).filter(
    (result) => result.userId === userId && result.chapter === chapter
  );
};

/**
 * Get all modules as an array
 */
export const selectAllModules = (state: DatabaseState): Module[] => {
  return Object.values(state.modules);
};

/**
 * Get module by ID
 */
export const selectModuleById = (state: DatabaseState, moduleId: string): Module | undefined => {
  return state.modules[moduleId];
};

/**
 * Get module by chapter number
 */
export const selectModuleByChapter = (
  state: DatabaseState,
  chapter: number
): Module | undefined => {
  return Object.values(state.modules).find((module) => module.chapter === chapter);
};

/**
 * Get completed modules
 */
export const selectCompletedModules = (state: DatabaseState): Module[] => {
  return Object.values(state.modules).filter((module) => module.completed);
};

/**
 * Get modules by user (if modules have userId in future)
 */
export const selectModulesByUser = (state: DatabaseState, userId: string): Module[] => {
  return Object.values(state.modules); // For now, modules are global. Can be extended later.
};

/**
 * Hook to get all users (memoized)
 */
export const useSelectAllUsers = (state: DatabaseState): User[] => {
  return useMemo(() => selectAllUsers(state), [state.users]);
};

/**
 * Hook to get user by ID (memoized)
 */
export const useSelectUserById = (state: DatabaseState, userId: string): User | undefined => {
  return useMemo(() => selectUserById(state, userId), [state.users, userId]);
};

/**
 * Hook to get all quiz results (memoized)
 */
export const useSelectAllQuizResults = (state: DatabaseState): QuizResult[] => {
  return useMemo(() => selectAllQuizResults(state), [state.quizResults]);
};

/**
 * Hook to get quiz results by user ID (memoized)
 */
export const useSelectQuizResultsByUserId = (
  state: DatabaseState,
  userId: string
): QuizResult[] => {
  return useMemo(() => selectQuizResultsByUserId(state, userId), [state.quizResults, userId]);
};

/**
 * Hook to get quiz results by chapter (memoized)
 */
export const useSelectQuizResultsByChapter = (
  state: DatabaseState,
  chapter: number
): QuizResult[] => {
  return useMemo(() => selectQuizResultsByChapter(state, chapter), [state.quizResults, chapter]);
};

/**
 * Hook to get all modules (memoized)
 */
export const useSelectAllModules = (state: DatabaseState): Module[] => {
  return useMemo(() => selectAllModules(state), [state.modules]);
};

/**
 * Hook to get module by chapter (memoized)
 */
export const useSelectModuleByChapter = (
  state: DatabaseState,
  chapter: number
): Module | undefined => {
  return useMemo(() => selectModuleByChapter(state, chapter), [state.modules, chapter]);
};

/**
 * Hook to get completed modules (memoized)
 */
export const useSelectCompletedModules = (state: DatabaseState): Module[] => {
  return useMemo(() => selectCompletedModules(state), [state.modules]);
};

```


Creating custom hooks:


```typescript
import { useDatabase as useDatabaseContext } from '../DatabaseContext';
import { DatabaseState, DatabaseAction } from '../types';

/**
 * Main hook to access database state and dispatch
 * This is a re-export of the context hook for convenience
 */
export const useDatabase = (): {
  state: DatabaseState;
  dispatch: React.Dispatch<DatabaseAction>;
} => {
  return useDatabaseContext();
};

```

```typescript
import { useCallback } from 'react';
import { useDatabase } from './useDatabase';
import { User } from '../types';
import { userActions } from '../reducers/actions';
import {
  useSelectAllUsers,
  useSelectUserById,
} from '../utils/selectors';

/**
 * Hook for user-related operations
 */
export const useUsers = () => {
  const { state, dispatch } = useDatabase();

  const users = useSelectAllUsers(state);
  const loading = state.metadata.users.loading;
  const error = state.metadata.users.error;

  const getUserById = useCallback(
    (userId: string) => useSelectUserById(state, userId),
    [state]
  );

  const addUser = useCallback(
    (user: User) => {
      dispatch(userActions.add(user));
    },
    [dispatch]
  );

  const updateUser = useCallback(
    (id: string, updates: Partial<User>) => {
      dispatch(userActions.update(id, updates));
    },
    [dispatch]
  );

  const deleteUser = useCallback(
    (id: string) => {
      dispatch(userActions.delete(id));
    },
    [dispatch]
  );

  const addUsers = useCallback(
    (users: User[]) => {
      dispatch(userActions.addMultiple(users));
    },
    [dispatch]
  );

  const deleteUsers = useCallback(
    (ids: string[]) => {
      dispatch(userActions.deleteMultiple(ids));
    },
    [dispatch]
  );

  const setLoading = useCallback(
    (loading: boolean) => {
      dispatch(userActions.setLoading(loading));
    },
    [dispatch]
  );

  const setError = useCallback(
    (error: string | null) => {
      dispatch(userActions.setError(error));
    },
    [dispatch]
  );

  return {
    users,
    loading,
    error,
    getUserById,
    addUser,
    updateUser,
    deleteUser,
    addUsers,
    deleteUsers,
    setLoading,
    setError,
  };
};

```

```typescript
import { useCallback, useMemo } from 'react';
import { useDatabase } from './useDatabase';
import { QuizResult } from '../types';
import { quizResultActions } from '../reducers/actions';
import {
  useSelectAllQuizResults,
  useSelectQuizResultsByUserId,
  useSelectQuizResultsByChapter,
} from '../utils/selectors';

/**
 * Hook for quiz result operations
 */
export const useQuizResults = (userId?: string, chapter?: number) => {
  const { state, dispatch } = useDatabase();

  const allResults = useSelectAllQuizResults(state);
  const loading = state.metadata.quizResults.loading;
  const error = state.metadata.quizResults.error;

  // Filtered results based on provided userId and/or chapter
  const results = useMemo(() => {
    let filtered = allResults;
    if (userId) {
      filtered = useSelectQuizResultsByUserId(state, userId);
    }
    if (chapter !== undefined) {
      filtered = filtered.filter((result) => result.chapter === chapter);
    }
    return filtered;
  }, [allResults, userId, chapter, state]);

  const getResultById = useCallback(
    (resultId: string): QuizResult | undefined => {
      return state.quizResults[resultId];
    },
    [state]
  );

  const getResultsByUserId = useCallback(
    (id: string) => {
      return useSelectQuizResultsByUserId(state, id);
    },
    [state]
  );

  const getResultsByChapter = useCallback(
    (ch: number) => {
      return useSelectQuizResultsByChapter(state, ch);
    },
    [state]
  );

  const addQuizResult = useCallback(
    (quizResult: QuizResult) => {
      dispatch(quizResultActions.add(quizResult));
    },
    [dispatch]
  );

  const updateQuizResult = useCallback(
    (id: string, updates: Partial<QuizResult>) => {
      dispatch(quizResultActions.update(id, updates));
    },
    [dispatch]
  );

  const deleteQuizResult = useCallback(
    (id: string) => {
      dispatch(quizResultActions.delete(id));
    },
    [dispatch]
  );

  const addQuizResults = useCallback(
    (quizResults: QuizResult[]) => {
      dispatch(quizResultActions.addMultiple(quizResults));
    },
    [dispatch]
  );

  const deleteQuizResults = useCallback(
    (ids: string[]) => {
      dispatch(quizResultActions.deleteMultiple(ids));
    },
    [dispatch]
  );

  const setLoading = useCallback(
    (loading: boolean) => {
      dispatch(quizResultActions.setLoading(loading));
    },
    [dispatch]
  );

  const setError = useCallback(
    (error: string | null) => {
      dispatch(quizResultActions.setError(error));
    },
    [dispatch]
  );

  return {
    results,
    allResults,
    loading,
    error,
    getResultById,
    getResultsByUserId,
    getResultsByChapter,
    addQuizResult,
    updateQuizResult,
    deleteQuizResult,
    addQuizResults,
    deleteQuizResults,
    setLoading,
    setError,
  };
};

```

```typescript
import { useCallback, useMemo } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { useAuth as useFirebaseAuth } from '../../AuthContext';
import { useUsers } from './useUsers';
import { useSelectUserById } from '../utils/selectors';
import { useDatabase } from './useDatabase';

/**
 * Enhanced auth hook that combines Firebase auth with local user data
 * This provides a unified interface for authentication and user profile management
 */
export const useAuth = () => {
  // Get Firebase auth state from existing AuthContext
  const firebaseAuth = useFirebaseAuth();
  const { state } = useDatabase();
  const { updateUser } = useUsers();

  // Get local user profile data
  const localUser = useMemo(() => {
    if (!firebaseAuth.user) return null;
    return useSelectUserById(state, firebaseAuth.user.uid);
  }, [firebaseAuth.user, state]);

  // Combined user object with Firebase auth + local profile
  const user = useMemo(() => {
    if (!firebaseAuth.user) return null;
    
    // Merge Firebase user with local user data
    return {
      ...firebaseAuth.user,
      // Override with local preferences if available
      preferences: localUser?.preferences,
      // Local timestamps
      createdAt: localUser?.createdAt,
      updatedAt: localUser?.updatedAt,
    };
  }, [firebaseAuth.user, localUser]);

  // Update user preferences in local state
  const updatePreferences = useCallback(
    (preferences: Partial<import('../types').UserPreferences>) => {
      if (!firebaseAuth.user) {
        throw new Error('User must be authenticated to update preferences');
      }
      
      const currentPreferences = localUser?.preferences || {};
      updateUser(firebaseAuth.user.uid, {
        preferences: {
          ...currentPreferences,
          ...preferences,
        },
      });
    },
    [firebaseAuth.user, localUser, updateUser]
  );

  return {
    // Firebase auth state
    user: firebaseAuth.user,
    loading: firebaseAuth.loading,
    loginWithGoogle: firebaseAuth.loginWithGoogle,
    logout: firebaseAuth.logout,
    
    // Local user profile
    localUser,
    userWithProfile: user,
    
    // Combined state
    isAuthenticated: !!firebaseAuth.user,
    
    // User profile operations
    updatePreferences,
  };
};

```


Fixing issues in the hooks:


```typescript
import React from 'react';
import { useDatabase as useDatabaseContext } from '../DatabaseContext';
import { DatabaseState, DatabaseAction } from '../types';

/**
 * Main hook to access database state and dispatch
 * This is a re-export of the context hook for convenience
 */
export const useDatabase = (): {
  state: DatabaseState;
  dispatch: React.Dispatch<DatabaseAction>;
} => {
  return useDatabaseContext();
};


```

```typescript
import { useCallback } from 'react';
import { useDatabase } from './useDatabase';
import { User } from '../types';
import { userActions } from '../reducers/actions';
import {
  useSelectAllUsers,
  useSelectUserById,
} from '../utils/selectors';

/**
 * Hook for user-related operations
 */
export const useUsers = () => {
  const { state, dispatch } = useDatabase();

  const users = useSelectAllUsers(state);
  const loading = state.metadata.users.loading;
  const error = state.metadata.users.error;

  const getUserById = useCallback(
    (userId: string) => {
      return state.users[userId];
    },
    [state]
  );

  const addUser = useCallback(
    (user: User) => {
      dispatch(userActions.add(user));
    },
    [dispatch]
  );

  const updateUser = useCallback(
    (id: string, updates: Partial<User>) => {
      dispatch(userActions.update(id, updates));
    },
    [dispatch]
  );

  const deleteUser = useCallback(
    (id: string) => {
      dispatch(userActions.delete(id));
    },
    [dispatch]
  );

  const addUsers = useCallback(
    (users: User[]) => {
      dispatch(userActions.addMultiple(users));
    },
    [dispatch]
  );

  const deleteUsers = useCallback(
    (ids: string[]) => {
      dispatch(userActions.deleteMultiple(ids));
    },
    [dispatch]
  );

  const setLoading = useCallback(
    (loading: boolean) => {
      dispatch(userActions.setLoading(loading));
    },
    [dispatch]
  );

  const setError = useCallback(
    (error: string | null) => {
      dispatch(userActions.setError(error));
    },
    [dispatch]
  );

  return {
    users,
    loading,
    error,
    getUserById,
    addUser,
    updateUser,
    deleteUser,
    addUsers,
    deleteUsers,
    setLoading,
    setError,
  };
};


```

```typescript
import { useCallback, useMemo } from 'react';
import { useDatabase } from './useDatabase';
import { QuizResult } from '../types';
import { quizResultActions } from '../reducers/actions';
import {
  useSelectAllQuizResults,
  useSelectQuizResultsByUserId,
  useSelectQuizResultsByChapter,
} from '../utils/selectors';

/**
 * Hook for quiz result operations
 */
export const useQuizResults = (userId?: string, chapter?: number) => {
  const { state, dispatch } = useDatabase();

  const allResults = useSelectAllQuizResults(state);
  const loading = state.metadata.quizResults.loading;
  const error = state.metadata.quizResults.error;

  // Filtered results based on provided userId and/or chapter
  const resultsByUserId = userId ? useSelectQuizResultsByUserId(state, userId) : allResults;
  const results = useMemo(() => {
    let filtered = resultsByUserId;
    if (chapter !== undefined) {
      filtered = filtered.filter((result) => result.chapter === chapter);
    }
    return filtered;
  }, [resultsByUserId, chapter]);

  const getResultById = useCallback(
    (resultId: string): QuizResult | undefined => {
      return state.quizResults[resultId];
    },
    [state]
  );

  const getResultsByUserId = useCallback(
    (id: string) => {
      return useSelectQuizResultsByUserId(state, id);
    },
    [state]
  );

  const getResultsByChapter = useCallback(
    (ch: number) => {
      return useSelectQuizResultsByChapter(state, ch);
    },
    [state]
  );

  const addQuizResult = useCallback(
    (quizResult: QuizResult) => {
      dispatch(quizResultActions.add(quizResult));
    },
    [dispatch]
  );

  const updateQuizResult = useCallback(
    (id: string, updates: Partial<QuizResult>) => {
      dispatch(quizResultActions.update(id, updates));
    },
    [dispatch]
  );

  const deleteQuizResult = useCallback(
    (id: string) => {
      dispatch(quizResultActions.delete(id));
    },
    [dispatch]
  );

  const addQuizResults = useCallback(
    (quizResults: QuizResult[]) => {
      dispatch(quizResultActions.addMultiple(quizResults));
    },
    [dispatch]
  );

  const deleteQuizResults = useCallback(
    (ids: string[]) => {
      dispatch(quizResultActions.deleteMultiple(ids));
    },
    [dispatch]
  );

  const setLoading = useCallback(
    (loading: boolean) => {
      dispatch(quizResultActions.setLoading(loading));
    },
    [dispatch]
  );

  const setError = useCallback(
    (error: string | null) => {
      dispatch(quizResultActions.setError(error));
    },
    [dispatch]
  );

  return {
    results,
    allResults,
    loading,
    error,
    getResultById,
    getResultsByUserId,
    getResultsByChapter,
    addQuizResult,
    updateQuizResult,
    deleteQuizResult,
    addQuizResults,
    deleteQuizResults,
    setLoading,
    setError,
  };
};


```

```typescript
import { useCallback, useMemo } from 'react';
import { useDatabase } from './useDatabase';
import { QuizResult } from '../types';
import { quizResultActions } from '../reducers/actions';
import {
  useSelectAllQuizResults,
  useSelectQuizResultsByUserId,
  useSelectQuizResultsByChapter,
} from '../utils/selectors';

/**
 * Hook for quiz result operations
 */
export const useQuizResults = (userId?: string, chapter?: number) => {
  const { state, dispatch } = useDatabase();

  const allResults = useSelectAllQuizResults(state);
  const loading = state.metadata.quizResults.loading;
  const error = state.metadata.quizResults.error;

  // Filtered results based on provided userId and/or chapter
  const resultsByUserId = userId ? useSelectQuizResultsByUserId(state, userId) : allResults;
  const results = useMemo(() => {
    let filtered = resultsByUserId;
    if (chapter !== undefined) {
      filtered = filtered.filter((result) => result.chapter === chapter);
    }
    return filtered;
  }, [resultsByUserId, chapter]);

  const getResultById = useCallback(
    (resultId: string): QuizResult | undefined => {
      return state.quizResults[resultId];
    },
    [state]
  );

  const getResultsByUserId = useCallback(
    (id: string) => {
      return Object.values(state.quizResults).filter((result) => result.userId === id);
    },
    [state]
  );

  const getResultsByChapter = useCallback(
    (ch: number) => {
      return Object.values(state.quizResults).filter((result) => result.chapter === ch);
    },
    [state]
  );

  const addQuizResult = useCallback(
    (quizResult: QuizResult) => {
      dispatch(quizResultActions.add(quizResult));
    },
    [dispatch]
  );

  const updateQuizResult = useCallback(
    (id: string, updates: Partial<QuizResult>) => {
      dispatch(quizResultActions.update(id, updates));
    },
    [dispatch]
  );

  const deleteQuizResult = useCallback(
    (id: string) => {
      dispatch(quizResultActions.delete(id));
    },
    [dispatch]
  );

  const addQuizResults = useCallback(
    (quizResults: QuizResult[]) => {
      dispatch(quizResultActions.addMultiple(quizResults));
    },
    [dispatch]
  );

  const deleteQuizResults = useCallback(
    (ids: string[]) => {
      dispatch(quizResultActions.deleteMultiple(ids));
    },
    [dispatch]
  );

  const setLoading = useCallback(
    (loading: boolean) => {
      dispatch(quizResultActions.setLoading(loading));
    },
    [dispatch]
  );

  const setError = useCallback(
    (error: string | null) => {
      dispatch(quizResultActions.setError(error));
    },
    [dispatch]
  );

  return {
    results,
    allResults,
    loading,
    error,
    getResultById,
    getResultsByUserId,
    getResultsByChapter,
    addQuizResult,
    updateQuizResult,
    deleteQuizResult,
    addQuizResults,
    deleteQuizResults,
    setLoading,
    setError,
  };
};


```


Fixing the import in databaseReducer:


```typescript
import { DatabaseState, DatabaseAction, initialDatabaseState } from '../types/state';

/**
 * Main database reducer with CRUD operations, batch operations, and optimistic updates
 */
export const databaseReducer = (
  state: DatabaseState,
  action: DatabaseAction
): DatabaseState => {
  switch (action.type) {
    // User actions
    case 'USER_ADD': {
      const user = action.payload;
      return {
        ...state,
        users: {
          ...state.users,
          [user.id]: user,
        },
        metadata: {
          ...state.metadata,
          users: {
            ...state.metadata.users,
            lastSync: Date.now(),
          },
        },
      };
    }

    case 'USER_UPDATE': {
      const { id, updates } = action.payload;
      const existingUser = state.users[id];
      if (!existingUser) return state;

      return {
        ...state,
        users: {
          ...state.users,
          [id]: {
            ...existingUser,
            ...updates,
            updatedAt: Date.now(),
          },
        },
      };
    }

    case 'USER_DELETE': {
      const { [action.payload]: deleted, ...remainingUsers } = state.users;
      return {
        ...state,
        users: remainingUsers,
      };
    }

    case 'USERS_ADD_MULTIPLE': {
      const usersMap = action.payload.reduce(
        (acc, user) => ({ ...acc, [user.id]: user }),
        {} as Record<string, typeof action.payload[0]>
      );
      return {
        ...state,
        users: {
          ...state.users,
          ...usersMap,
        },
        metadata: {
          ...state.metadata,
          users: {
            ...state.metadata.users,
            lastSync: Date.now(),
          },
        },
      };
    }

    case 'USERS_DELETE_MULTIPLE': {
      const remainingUsers = { ...state.users };
      action.payload.forEach((id) => {
        delete remainingUsers[id];
      });
      return {
        ...state,
        users: remainingUsers,
      };
    }

    case 'USER_SET_LOADING':
      return {
        ...state,
        metadata: {
          ...state.metadata,
          users: {
            ...state.metadata.users,
            loading: action.payload,
          },
        },
      };

    case 'USER_SET_ERROR':
      return {
        ...state,
        metadata: {
          ...state.metadata,
          users: {
            ...state.metadata.users,
            error: action.payload,
          },
        },
      };

    // QuizResult actions
    case 'QUIZ_RESULT_ADD': {
      const quizResult = action.payload;
      return {
        ...state,
        quizResults: {
          ...state.quizResults,
          [quizResult.id]: quizResult,
        },
        metadata: {
          ...state.metadata,
          quizResults: {
            ...state.metadata.quizResults,
            lastSync: Date.now(),
          },
        },
      };
    }

    case 'QUIZ_RESULT_UPDATE': {
      const { id, updates } = action.payload;
      const existingResult = state.quizResults[id];
      if (!existingResult) return state;

      return {
        ...state,
        quizResults: {
          ...state.quizResults,
          [id]: {
            ...existingResult,
            ...updates,
          },
        },
      };
    }

    case 'QUIZ_RESULT_DELETE': {
      const { [action.payload]: deleted, ...remainingResults } = state.quizResults;
      return {
        ...state,
        quizResults: remainingResults,
      };
    }

    case 'QUIZ_RESULTS_ADD_MULTIPLE': {
      const resultsMap = action.payload.reduce(
        (acc, result) => ({ ...acc, [result.id]: result }),
        {} as Record<string, typeof action.payload[0]>
      );
      return {
        ...state,
        quizResults: {
          ...state.quizResults,
          ...resultsMap,
        },
        metadata: {
          ...state.metadata,
          quizResults: {
            ...state.metadata.quizResults,
            lastSync: Date.now(),
          },
        },
      };
    }

    case 'QUIZ_RESULTS_DELETE_MULTIPLE': {
      const remainingResults = { ...state.quizResults };
      action.payload.forEach((id) => {
        delete remainingResults[id];
      });
      return {
        ...state,
        quizResults: remainingResults,
      };
    }

    case 'QUIZ_RESULT_SET_LOADING':
      return {
        ...state,
        metadata: {
          ...state.metadata,
          quizResults: {
            ...state.metadata.quizResults,
            loading: action.payload,
          },
        },
      };

    case 'QUIZ_RESULT_SET_ERROR':
      return {
        ...state,
        metadata: {
          ...state.metadata,
          quizResults: {
            ...state.metadata.quizResults,
            error: action.payload,
          },
        },
      };

    // Module actions
    case 'MODULE_ADD': {
      const module = action.payload;
      return {
        ...state,
        modules: {
          ...state.modules,
          [module.id]: module,
        },
        metadata: {
          ...state.metadata,
          modules: {
            ...state.metadata.modules,
            lastSync: Date.now(),
          },
        },
      };
    }

    case 'MODULE_UPDATE': {
      const { id, updates } = action.payload;
      const existingModule = state.modules[id];
      if (!existingModule) return state;

      return {
        ...state,
        modules: {
          ...state.modules,
          [id]: {
            ...existingModule,
            ...updates,
            updatedAt: Date.now(),
          },
        },
      };
    }

    case 'MODULE_DELETE': {
      const { [action.payload]: deleted, ...remainingModules } = state.modules;
      return {
        ...state,
        modules: remainingModules,
      };
    }

    case 'MODULES_ADD_MULTIPLE': {
      const modulesMap = action.payload.reduce(
        (acc, module) => ({ ...acc, [module.id]: module }),
        {} as Record<string, typeof action.payload[0]>
      );
      return {
        ...state,
        modules: {
          ...state.modules,
          ...modulesMap,
        },
        metadata: {
          ...state.metadata,
          modules: {
            ...state.metadata.modules,
            lastSync: Date.now(),
          },
        },
      };
    }

    case 'MODULES_DELETE_MULTIPLE': {
      const remainingModules = { ...state.modules };
      action.payload.forEach((id) => {
        delete remainingModules[id];
      });
      return {
        ...state,
        modules: remainingModules,
      };
    }

    case 'MODULE_SET_LOADING':
      return {
        ...state,
        metadata: {
          ...state.metadata,
          modules: {
            ...state.metadata.modules,
            loading: action.payload,
          },
        },
      };

    case 'MODULE_SET_ERROR':
      return {
        ...state,
        metadata: {
          ...state.metadata,
          modules: {
            ...state.metadata.modules,
            error: action.payload,
          },
        },
      };

    // Global actions
    case 'STATE_RESET':
      return initialDatabaseState;

    case 'STATE_HYDRATE':
      return {
        ...initialDatabaseState,
        ...action.payload,
        initialized: true,
      };

    case 'STATE_SET_INITIALIZED':
      return {
        ...state,
        initialized: action.payload,
      };

    case 'STATE_SET_LAST_SYNC':
      return {
        ...state,
        lastSync: action.payload,
      };

    default:
      return state;
  }
};


```

```typescriptreact
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { databaseReducer } from './reducers/databaseReducer';
import { initialDatabaseState } from './types/state';
import { DatabaseState, DatabaseAction, User } from './types';
import {
  saveStateToLocalStorage,
  loadStateFromLocalStorage,
  isLocalStorageAvailable,
} from './utils/localStorage';
import { globalActions, userActions } from './reducers/actions';

interface DatabaseContextValue {
  state: DatabaseState;
  dispatch: React.Dispatch<DatabaseAction>;
}

const DatabaseContext = createContext<DatabaseContextValue | null>(null);

interface DatabaseProviderProps {
  children: React.ReactNode;
  firebaseUser?: FirebaseUser | null;
}

/**
 * Database Provider component that manages local state with persistence
 * and integrates with Firebase auth
 */
export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({
  children,
  firebaseUser,
}) => {
  const [state, dispatch] = useReducer(databaseReducer, initialDatabaseState);

  // Hydrate state from localStorage on mount
  useEffect(() => {
    if (!isLocalStorageAvailable()) {
      console.warn('localStorage is not available. State will not persist.');
      dispatch(globalActions.setInitialized(true));
      return;
    }

    const savedState = loadStateFromLocalStorage();
    if (savedState) {
      dispatch(globalActions.hydrate(savedState));
    }
    dispatch(globalActions.setInitialized(true));
  }, []);

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    if (!state.initialized || !isLocalStorageAvailable()) {
      return;
    }

    // Debounce saves to avoid excessive writes
    const timeoutId = setTimeout(() => {
      saveStateToLocalStorage(state);
      dispatch(globalActions.setLastSync(Date.now()));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [state]);

  // Sync Firebase user with local state
  useEffect(() => {
    if (!firebaseUser) {
      // User logged out - clear user data if needed
      // Note: We might want to keep some data, so this is optional
      return;
    }

    // Check if user already exists in local state
    const existingUser = state.users[firebaseUser.uid];
    
    if (!existingUser) {
      // Create new user in local state
      const newUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        preferences: {},
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      dispatch(userActions.add(newUser));
    } else {
      // Update existing user with latest Firebase data
      const updates: Partial<User> = {
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        updatedAt: Date.now(),
      };
      dispatch(userActions.update(firebaseUser.uid, updates));
    }
  }, [firebaseUser, state.users]);

  return (
    <DatabaseContext.Provider value={{ state, dispatch }}>
      {children}
    </DatabaseContext.Provider>
  );
};

/**
 * Hook to access database context
 * @throws Error if used outside DatabaseProvider
 */
export const useDatabase = (): DatabaseContextValue => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within DatabaseProvider');
  }
  return context;
};


```


Integrating the database manager into App.js. Reviewing how state is used:



Creating a modules hook, then updating App.js:


```typescript
import { useCallback, useMemo } from 'react';
import { useDatabase } from './useDatabase';
import { Module } from '../types';
import { moduleActions } from '../reducers/actions';
import {
  useSelectAllModules,
  useSelectModuleByChapter,
  useSelectCompletedModules,
} from '../utils/selectors';

/**
 * Hook for module/chapter operations
 */
export const useModules = () => {
  const { state, dispatch } = useDatabase();

  const allModules = useSelectAllModules(state);
  const completedModules = useSelectCompletedModules(state);
  const loading = state.metadata.modules.loading;
  const error = state.metadata.modules.error;

  const getModuleByChapter = useCallback(
    (chapter: number): Module | undefined => {
      return useSelectModuleByChapter(state, chapter);
    },
    [state]
  );

  const isChapterCompleted = useCallback(
    (chapter: number): boolean => {
      const module = useSelectModuleByChapter(state, chapter);
      return module?.completed ?? false;
    },
    [state]
  );

  const getCompletedChapterNumbers = useCallback((): number[] => {
    return completedModules.map((module) => module.chapter);
  }, [completedModules]);

  const addModule = useCallback(
    (module: Module) => {
      dispatch(moduleActions.add(module));
    },
    [dispatch]
  );

  const updateModule = useCallback(
    (id: string, updates: Partial<Module>) => {
      dispatch(moduleActions.update(id, updates));
    },
    [dispatch]
  );

  const deleteModule = useCallback(
    (id: string) => {
      dispatch(moduleActions.delete(id));
    },
    [dispatch]
  );

  const addModules = useCallback(
    (modules: Module[]) => {
      dispatch(moduleActions.addMultiple(modules));
    },
    [dispatch]
  );

  const deleteModules = useCallback(
    (ids: string[]) => {
      dispatch(moduleActions.deleteMultiple(ids));
    },
    [dispatch]
  );

  const markChapterCompleted = useCallback(
    (chapter: number) => {
      const moduleId = `module-${chapter}`;
      const existingModule = state.modules[moduleId];
      
      if (existingModule) {
        dispatch(
          moduleActions.update(moduleId, {
            completed: true,
            completedAt: Date.now(),
            lastAccessedAt: Date.now(),
          })
        );
      } else {
        const newModule: Module = {
          id: moduleId,
          chapter,
          completed: true,
          completedAt: Date.now(),
          lastAccessedAt: Date.now(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        dispatch(moduleActions.add(newModule));
      }
    },
    [state, dispatch]
  );

  const markChapterIncomplete = useCallback(
    (chapter: number) => {
      const moduleId = `module-${chapter}`;
      const existingModule = state.modules[moduleId];
      
      if (existingModule) {
        dispatch(
          moduleActions.update(moduleId, {
            completed: false,
            completedAt: undefined,
            lastAccessedAt: Date.now(),
          })
        );
      }
    },
    [state, dispatch]
  );

  const setLoading = useCallback(
    (loading: boolean) => {
      dispatch(moduleActions.setLoading(loading));
    },
    [dispatch]
  );

  const setError = useCallback(
    (error: string | null) => {
      dispatch(moduleActions.setError(error));
    },
    [dispatch]
  );

  return {
    modules: allModules,
    completedModules,
    completedChapterNumbers: getCompletedChapterNumbers(),
    loading,
    error,
    getModuleByChapter,
    isChapterCompleted,
    addModule,
    updateModule,
    deleteModule,
    addModules,
    deleteModules,
    markChapterCompleted,
    markChapterIncomplete,
    setLoading,
    setError,
  };
};

```

```javascript
import './App.css';
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { AuthForm } from './Auth';
import InfoPage from './TemplateInfoPage';
import { getChapterContent, getAllChapterNumbers } from './ChapterContent';
import { getQuizQuestions, calculateQuizScore } from './QuizContent';
import { DatabaseProvider } from './database/DatabaseContext';
import { useQuizResults } from './database/hooks/useQuizResults';
import { useModules } from './database/hooks/useModules';

// Header Component
function Header({ user, onLogout, onShowInfo }) {
  return (
    <div className="header-container">
      {user.photoURL && (
        <img 
          src={user.photoURL} 
          alt="Profile" 
          className="profile-image"
        />
      )}
      <span className="welcome-text">Welcome, {user.displayName}!</span>
      <button onClick={onLogout} className="btn btn-primary">
        Logout
      </button>
      <button onClick={onShowInfo} className="btn btn-secondary">
        Info Page
      </button>
    </div>
  );
}

// Module List Item Component
function ModuleListItem({ chapter, completed, onChapterClick, onQuizClick }) {
  return (
    <div className="module-list-item">
      <span className="module-chapter-label">
        Chapter {chapter}:
      </span>
      <button onClick={onChapterClick} className="module-link">
        Link
      </button>
      <span className="module-separator">,</span>
      <button onClick={onQuizClick} className="module-link">
        mini quiz
      </button>
      <span className={`module-star ${completed ? 'completed' : ''}`}>
        ★
      </span>
    </div>
  );
}

// Home Page Component
function HomePage({ user, modules, onLogout, onShowInfo, onModuleClick }) {
  return (
    <div className="App"> 
      <div className="page-container">
        <Header user={user} onLogout={onLogout} onShowInfo={onShowInfo} />

        <div className="content-wrapper">
          <div className="hero-banner">
            <h1 className="hero-title">Gogy</h1>
          </div>

          <p className="intro-text">
            It is important to know stuff about AI Lorem ipsum dolor sit amet,
            consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
            Aenean massa. sem.
          </p>

          <div>
            <h2 className="section-title">Modules:</h2>

            {modules.map((module) => (
              <ModuleListItem
                key={module.chapter}
                chapter={module.chapter}
                completed={module.completed}
                onChapterClick={() => onModuleClick(`chapter${module.chapter}`)}
                onQuizClick={() => onModuleClick(`quiz${module.chapter}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Quiz Question Component
function QuizQuestion({ 
  question, 
  questionIndex, 
  selectedAnswer, 
  showResults, 
  onAnswerSelect 
}) {
  return (
    <div className="quiz-question-box">
      <h3 className="question-number">Question {questionIndex + 1}:</h3>
      <p className="question-text">{question.question}</p>
      <div className="options-container">
        {question.options.map((option, oIndex) => {
          const isSelected = selectedAnswer === oIndex;
          const isCorrect = question.correct === oIndex;
          
          let buttonClass = 'option-button';
          if (showResults && isSelected) {
            buttonClass += isCorrect ? ' option-correct' : ' option-incorrect';
          } else if (isSelected) {
            buttonClass += ' option-selected';
          }
          
          return (
            <button
              key={oIndex}
              onClick={() => !showResults && onAnswerSelect(questionIndex, oIndex)}
              className={buttonClass}
              disabled={showResults}
            >
              {String.fromCharCode(65 + oIndex)}) {option}
              {showResults && isCorrect && ' ✓'}
              {showResults && isSelected && !isCorrect && ' ✗'}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Quiz Component
function Quiz({ 
  quizNum, 
  questions, 
  selectedAnswers, 
  onAnswerSelect, 
  onSubmit
}) {
  const allAnswered = questions.every((q, idx) => selectedAnswers[idx] !== undefined);

  return (
    <div className="quiz-container">
      <h2 className="quiz-title">Mini Quiz {quizNum}</h2>
      <p className="quiz-description">
        Test your knowledge from Chapter {quizNum}!
      </p>
      
      {questions.map((q, qIndex) => (
        <QuizQuestion
          key={qIndex}
          question={q}
          questionIndex={qIndex}
          selectedAnswer={selectedAnswers[qIndex]}
          showResults={false}
          onAnswerSelect={onAnswerSelect}
        />
      ))}

      <button
        onClick={onSubmit}
        disabled={!allAnswered}
        className={`submit-button ${allAnswered ? 'enabled' : 'disabled'}`}
      >
        Submit Quiz
      </button>
    </div>
  );
}

// Enhanced Feedback Page Component
function QuizFeedbackPage({ 
  quizNum, 
  questions, 
  selectedAnswers, 
  onBack, 
  onRetry 
}) {
  const score = calculateQuizScore(quizNum, selectedAnswers);

  return (
    <div className="feedback-page">
      <header className="feedback-header">
        <h1 className="feedback-logo">Gogy</h1>
        <button onClick={onBack} className="btn btn-secondary">
          ← Back to Main Page
        </button>
      </header>

      <main className="feedback-main">
        <h1 className="feedback-title">
          Chapter {quizNum} Quiz Results
        </h1>
        <h2 className="feedback-score">
          Score: {score.correct} / {score.total} ({score.percentage}%)
        </h2>

        <div className="feedback-questions-list">
          {questions.map((question, idx) => {
            const userAnswer = selectedAnswers[idx];
            const isCorrect = userAnswer === question.correct;
            
            return (
              <div
                key={idx}
                className={`feedback-question-box ${isCorrect ? 'correct' : 'incorrect'}`}
              >
                <h3 className="feedback-question-header">
                  Question {idx + 1} {isCorrect ? '✓' : '✗'}
                </h3>
                <p className="feedback-question-text">
                  {question.question}
                </p>
                <p className="feedback-answer">
                  <strong>Your answer:</strong> {question.options[userAnswer] || 'Not answered'}
                </p>
                {!isCorrect && (
                  <p className="feedback-answer">
                    <strong>Correct answer:</strong> {question.options[question.correct]}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </main>

      <footer className="feedback-footer">
        <h3 className="feedback-footer-title">
          {score.isPerfect 
            ? '🎉 Perfect Score! Want to try another quiz?' 
            : 'Want to try again?'}
        </h3>
        <button onClick={onRetry} className="btn btn-primary">
          Retake Quiz
        </button>
      </footer>
    </div>
  );
}

// Chapter Page Component
function ChapterPage({ 
  chapterNum, 
  selectedAnswers, 
  onBack, 
  onAnswerSelect, 
  onQuizSubmit
}) {
  const content = getChapterContent(chapterNum);
  const questions = getQuizQuestions(chapterNum);

  return (
    <div className="App">
      <div className="page-container">
        <button onClick={onBack} className="btn btn-primary back-button">
          ← Back to Home
        </button>
        
        <div className="content-wrapper">
          <h1 className="chapter-title">{content.title}</h1>
          
          {content.sections.map((section, index) => (
            <p key={index} className="chapter-text">
              {section.content}
            </p>
          ))}

          {questions.length > 0 && (
            <Quiz
              quizNum={chapterNum}
              questions={questions}
              selectedAnswers={selectedAnswers}
              onAnswerSelect={onAnswerSelect}
              onSubmit={onQuizSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Main App Content Component
function AppContent() {
  const { user, logout, loading } = useAuth();
  const [showInfo, setShowInfo] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [completedModules, setCompletedModules] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentQuizNum, setCurrentQuizNum] = useState(null);

  // Get all available chapters dynamically
  const chapterNumbers = getAllChapterNumbers();
  const modules = chapterNumbers.map(chapter => ({
    chapter,
    completed: completedModules.includes(chapter)
  }));

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: optionIndex
    });
  };

  const handleQuizSubmit = (chapterNum) => {
    setCurrentQuizNum(chapterNum);
    const score = calculateQuizScore(chapterNum, selectedAnswers);
    
    if (score.isPerfect && !completedModules.includes(chapterNum)) {
      setCompletedModules([...completedModules, chapterNum]);
    }
    
    setCurrentView('feedback');
  };

  const handleQuizRetry = () => {
    setSelectedAnswers({});
    setCurrentView(`chapter${currentQuizNum}`);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedAnswers({});
    setCurrentQuizNum(null);
  };

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (!user) {
    return <AuthForm />;
  }

  if (showInfo) {
    return <InfoPage onBack={() => setShowInfo(false)} />;
  }

  if (currentView === 'feedback' && currentQuizNum) {
    const questions = getQuizQuestions(currentQuizNum);
    return (
      <QuizFeedbackPage
        quizNum={currentQuizNum}
        questions={questions}
        selectedAnswers={selectedAnswers}
        onBack={handleBackToHome}
        onRetry={handleQuizRetry}
      />
    );
  }

  if (currentView.startsWith('chapter')) {
    const chapterNum = parseInt(currentView.replace('chapter', ''));
    return (
      <ChapterPage
        chapterNum={chapterNum}
        selectedAnswers={selectedAnswers}
        onBack={handleBackToHome}
        onAnswerSelect={handleAnswerSelect}
        onQuizSubmit={() => handleQuizSubmit(chapterNum)}
      />
    );
  }

  if (currentView.startsWith('quiz')) {
    const quizNum = parseInt(currentView.replace('quiz', ''));
    const questions = getQuizQuestions(quizNum);

    return (
      <div className="App">
        <div className="page-container">
          <button onClick={handleBackToHome} className="btn btn-primary back-button">
            ← Back to Home
          </button>
          
          <div className="content-wrapper">
            <Quiz
              quizNum={quizNum}
              questions={questions}
              selectedAnswers={selectedAnswers}
              onAnswerSelect={handleAnswerSelect}
              onSubmit={() => {
                setCurrentQuizNum(quizNum);
                handleQuizSubmit(quizNum);
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <HomePage
      user={user}
      modules={modules}
      onLogout={logout}
      onShowInfo={() => setShowInfo(true)}
      onModuleClick={setCurrentView}
    />
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
```

```javascript
import './App.css';
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { AuthForm } from './Auth';
import InfoPage from './TemplateInfoPage';
import { getChapterContent, getAllChapterNumbers } from './ChapterContent';
import { getQuizQuestions, calculateQuizScore } from './QuizContent';
import { DatabaseProvider } from './database/DatabaseContext';
import { useQuizResults } from './database/hooks/useQuizResults';
import { useModules } from './database/hooks/useModules';

// Header Component
function Header({ user, onLogout, onShowInfo }) {
  return (
    <div className="header-container">
      {user.photoURL && (
        <img 
          src={user.photoURL} 
          alt="Profile" 
          className="profile-image"
        />
      )}
      <span className="welcome-text">Welcome, {user.displayName}!</span>
      <button onClick={onLogout} className="btn btn-primary">
        Logout
      </button>
      <button onClick={onShowInfo} className="btn btn-secondary">
        Info Page
      </button>
    </div>
  );
}

// Module List Item Component
function ModuleListItem({ chapter, completed, onChapterClick, onQuizClick }) {
  return (
    <div className="module-list-item">
      <span className="module-chapter-label">
        Chapter {chapter}:
      </span>
      <button onClick={onChapterClick} className="module-link">
        Link
      </button>
      <span className="module-separator">,</span>
      <button onClick={onQuizClick} className="module-link">
        mini quiz
      </button>
      <span className={`module-star ${completed ? 'completed' : ''}`}>
        ★
      </span>
    </div>
  );
}

// Home Page Component
function HomePage({ user, modules, onLogout, onShowInfo, onModuleClick }) {
  return (
    <div className="App"> 
      <div className="page-container">
        <Header user={user} onLogout={onLogout} onShowInfo={onShowInfo} />

        <div className="content-wrapper">
          <div className="hero-banner">
            <h1 className="hero-title">Gogy</h1>
          </div>

          <p className="intro-text">
            It is important to know stuff about AI Lorem ipsum dolor sit amet,
            consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
            Aenean massa. sem.
          </p>

          <div>
            <h2 className="section-title">Modules:</h2>

            {modules.map((module) => (
              <ModuleListItem
                key={module.chapter}
                chapter={module.chapter}
                completed={module.completed}
                onChapterClick={() => onModuleClick(`chapter${module.chapter}`)}
                onQuizClick={() => onModuleClick(`quiz${module.chapter}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Quiz Question Component
function QuizQuestion({ 
  question, 
  questionIndex, 
  selectedAnswer, 
  showResults, 
  onAnswerSelect 
}) {
  return (
    <div className="quiz-question-box">
      <h3 className="question-number">Question {questionIndex + 1}:</h3>
      <p className="question-text">{question.question}</p>
      <div className="options-container">
        {question.options.map((option, oIndex) => {
          const isSelected = selectedAnswer === oIndex;
          const isCorrect = question.correct === oIndex;
          
          let buttonClass = 'option-button';
          if (showResults && isSelected) {
            buttonClass += isCorrect ? ' option-correct' : ' option-incorrect';
          } else if (isSelected) {
            buttonClass += ' option-selected';
          }
          
          return (
            <button
              key={oIndex}
              onClick={() => !showResults && onAnswerSelect(questionIndex, oIndex)}
              className={buttonClass}
              disabled={showResults}
            >
              {String.fromCharCode(65 + oIndex)}) {option}
              {showResults && isCorrect && ' ✓'}
              {showResults && isSelected && !isCorrect && ' ✗'}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Quiz Component
function Quiz({ 
  quizNum, 
  questions, 
  selectedAnswers, 
  onAnswerSelect, 
  onSubmit
}) {
  const allAnswered = questions.every((q, idx) => selectedAnswers[idx] !== undefined);

  return (
    <div className="quiz-container">
      <h2 className="quiz-title">Mini Quiz {quizNum}</h2>
      <p className="quiz-description">
        Test your knowledge from Chapter {quizNum}!
      </p>
      
      {questions.map((q, qIndex) => (
        <QuizQuestion
          key={qIndex}
          question={q}
          questionIndex={qIndex}
          selectedAnswer={selectedAnswers[qIndex]}
          showResults={false}
          onAnswerSelect={onAnswerSelect}
        />
      ))}

      <button
        onClick={onSubmit}
        disabled={!allAnswered}
        className={`submit-button ${allAnswered ? 'enabled' : 'disabled'}`}
      >
        Submit Quiz
      </button>
    </div>
  );
}

// Enhanced Feedback Page Component
function QuizFeedbackPage({ 
  quizNum, 
  questions, 
  selectedAnswers, 
  onBack, 
  onRetry 
}) {
  const score = calculateQuizScore(quizNum, selectedAnswers);

  return (
    <div className="feedback-page">
      <header className="feedback-header">
        <h1 className="feedback-logo">Gogy</h1>
        <button onClick={onBack} className="btn btn-secondary">
          ← Back to Main Page
        </button>
      </header>

      <main className="feedback-main">
        <h1 className="feedback-title">
          Chapter {quizNum} Quiz Results
        </h1>
        <h2 className="feedback-score">
          Score: {score.correct} / {score.total} ({score.percentage}%)
        </h2>

        <div className="feedback-questions-list">
          {questions.map((question, idx) => {
            const userAnswer = selectedAnswers[idx];
            const isCorrect = userAnswer === question.correct;
            
            return (
              <div
                key={idx}
                className={`feedback-question-box ${isCorrect ? 'correct' : 'incorrect'}`}
              >
                <h3 className="feedback-question-header">
                  Question {idx + 1} {isCorrect ? '✓' : '✗'}
                </h3>
                <p className="feedback-question-text">
                  {question.question}
                </p>
                <p className="feedback-answer">
                  <strong>Your answer:</strong> {question.options[userAnswer] || 'Not answered'}
                </p>
                {!isCorrect && (
                  <p className="feedback-answer">
                    <strong>Correct answer:</strong> {question.options[question.correct]}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </main>

      <footer className="feedback-footer">
        <h3 className="feedback-footer-title">
          {score.isPerfect 
            ? '🎉 Perfect Score! Want to try another quiz?' 
            : 'Want to try again?'}
        </h3>
        <button onClick={onRetry} className="btn btn-primary">
          Retake Quiz
        </button>
      </footer>
    </div>
  );
}

// Chapter Page Component
function ChapterPage({ 
  chapterNum, 
  selectedAnswers, 
  onBack, 
  onAnswerSelect, 
  onQuizSubmit
}) {
  const content = getChapterContent(chapterNum);
  const questions = getQuizQuestions(chapterNum);

  return (
    <div className="App">
      <div className="page-container">
        <button onClick={onBack} className="btn btn-primary back-button">
          ← Back to Home
        </button>
        
        <div className="content-wrapper">
          <h1 className="chapter-title">{content.title}</h1>
          
          {content.sections.map((section, index) => (
            <p key={index} className="chapter-text">
              {section.content}
            </p>
          ))}

          {questions.length > 0 && (
            <Quiz
              quizNum={chapterNum}
              questions={questions}
              selectedAnswers={selectedAnswers}
              onAnswerSelect={onAnswerSelect}
              onSubmit={onQuizSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Main App Content Component
function AppContent() {
  const { user, logout, loading } = useAuth();
  const { markChapterCompleted, completedChapterNumbers, isChapterCompleted } = useModules();
  const { addQuizResult } = useQuizResults();
  const [showInfo, setShowInfo] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentQuizNum, setCurrentQuizNum] = useState(null);

  // Get all available chapters dynamically
  const chapterNumbers = getAllChapterNumbers();
  const modules = chapterNumbers.map(chapter => ({
    chapter,
    completed: isChapterCompleted(chapter)
  }));

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: optionIndex
    });
  };

  const handleQuizSubmit = (chapterNum) => {
    setCurrentQuizNum(chapterNum);
    const score = calculateQuizScore(chapterNum, selectedAnswers);
    
    if (score.isPerfect && !completedModules.includes(chapterNum)) {
      setCompletedModules([...completedModules, chapterNum]);
    }
    
    setCurrentView('feedback');
  };

  const handleQuizRetry = () => {
    setSelectedAnswers({});
    setCurrentView(`chapter${currentQuizNum}`);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedAnswers({});
    setCurrentQuizNum(null);
  };

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (!user) {
    return <AuthForm />;
  }

  if (showInfo) {
    return <InfoPage onBack={() => setShowInfo(false)} />;
  }

  if (currentView === 'feedback' && currentQuizNum) {
    const questions = getQuizQuestions(currentQuizNum);
    return (
      <QuizFeedbackPage
        quizNum={currentQuizNum}
        questions={questions}
        selectedAnswers={selectedAnswers}
        onBack={handleBackToHome}
        onRetry={handleQuizRetry}
      />
    );
  }

  if (currentView.startsWith('chapter')) {
    const chapterNum = parseInt(currentView.replace('chapter', ''));
    return (
      <ChapterPage
        chapterNum={chapterNum}
        selectedAnswers={selectedAnswers}
        onBack={handleBackToHome}
        onAnswerSelect={handleAnswerSelect}
        onQuizSubmit={() => handleQuizSubmit(chapterNum)}
      />
    );
  }

  if (currentView.startsWith('quiz')) {
    const quizNum = parseInt(currentView.replace('quiz', ''));
    const questions = getQuizQuestions(quizNum);

    return (
      <div className="App">
        <div className="page-container">
          <button onClick={handleBackToHome} className="btn btn-primary back-button">
            ← Back to Home
          </button>
          
          <div className="content-wrapper">
            <Quiz
              quizNum={quizNum}
              questions={questions}
              selectedAnswers={selectedAnswers}
              onAnswerSelect={handleAnswerSelect}
              onSubmit={() => {
                setCurrentQuizNum(quizNum);
                handleQuizSubmit(quizNum);
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <HomePage
      user={user}
      modules={modules}
      onLogout={logout}
      onShowInfo={() => setShowInfo(true)}
      onModuleClick={setCurrentView}
    />
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
```

```javascript
import './App.css';
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { AuthForm } from './Auth';
import InfoPage from './TemplateInfoPage';
import { getChapterContent, getAllChapterNumbers } from './ChapterContent';
import { getQuizQuestions, calculateQuizScore } from './QuizContent';
import { DatabaseProvider } from './database/DatabaseContext';
import { useQuizResults } from './database/hooks/useQuizResults';
import { useModules } from './database/hooks/useModules';

// Header Component
function Header({ user, onLogout, onShowInfo }) {
  return (
    <div className="header-container">
      {user.photoURL && (
        <img 
          src={user.photoURL} 
          alt="Profile" 
          className="profile-image"
        />
      )}
      <span className="welcome-text">Welcome, {user.displayName}!</span>
      <button onClick={onLogout} className="btn btn-primary">
        Logout
      </button>
      <button onClick={onShowInfo} className="btn btn-secondary">
        Info Page
      </button>
    </div>
  );
}

// Module List Item Component
function ModuleListItem({ chapter, completed, onChapterClick, onQuizClick }) {
  return (
    <div className="module-list-item">
      <span className="module-chapter-label">
        Chapter {chapter}:
      </span>
      <button onClick={onChapterClick} className="module-link">
        Link
      </button>
      <span className="module-separator">,</span>
      <button onClick={onQuizClick} className="module-link">
        mini quiz
      </button>
      <span className={`module-star ${completed ? 'completed' : ''}`}>
        ★
      </span>
    </div>
  );
}

// Home Page Component
function HomePage({ user, modules, onLogout, onShowInfo, onModuleClick }) {
  return (
    <div className="App"> 
      <div className="page-container">
        <Header user={user} onLogout={onLogout} onShowInfo={onShowInfo} />

        <div className="content-wrapper">
          <div className="hero-banner">
            <h1 className="hero-title">Gogy</h1>
          </div>

          <p className="intro-text">
            It is important to know stuff about AI Lorem ipsum dolor sit amet,
            consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
            Aenean massa. sem.
          </p>

          <div>
            <h2 className="section-title">Modules:</h2>

            {modules.map((module) => (
              <ModuleListItem
                key={module.chapter}
                chapter={module.chapter}
                completed={module.completed}
                onChapterClick={() => onModuleClick(`chapter${module.chapter}`)}
                onQuizClick={() => onModuleClick(`quiz${module.chapter}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Quiz Question Component
function QuizQuestion({ 
  question, 
  questionIndex, 
  selectedAnswer, 
  showResults, 
  onAnswerSelect 
}) {
  return (
    <div className="quiz-question-box">
      <h3 className="question-number">Question {questionIndex + 1}:</h3>
      <p className="question-text">{question.question}</p>
      <div className="options-container">
        {question.options.map((option, oIndex) => {
          const isSelected = selectedAnswer === oIndex;
          const isCorrect = question.correct === oIndex;
          
          let buttonClass = 'option-button';
          if (showResults && isSelected) {
            buttonClass += isCorrect ? ' option-correct' : ' option-incorrect';
          } else if (isSelected) {
            buttonClass += ' option-selected';
          }
          
          return (
            <button
              key={oIndex}
              onClick={() => !showResults && onAnswerSelect(questionIndex, oIndex)}
              className={buttonClass}
              disabled={showResults}
            >
              {String.fromCharCode(65 + oIndex)}) {option}
              {showResults && isCorrect && ' ✓'}
              {showResults && isSelected && !isCorrect && ' ✗'}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Quiz Component
function Quiz({ 
  quizNum, 
  questions, 
  selectedAnswers, 
  onAnswerSelect, 
  onSubmit
}) {
  const allAnswered = questions.every((q, idx) => selectedAnswers[idx] !== undefined);

  return (
    <div className="quiz-container">
      <h2 className="quiz-title">Mini Quiz {quizNum}</h2>
      <p className="quiz-description">
        Test your knowledge from Chapter {quizNum}!
      </p>
      
      {questions.map((q, qIndex) => (
        <QuizQuestion
          key={qIndex}
          question={q}
          questionIndex={qIndex}
          selectedAnswer={selectedAnswers[qIndex]}
          showResults={false}
          onAnswerSelect={onAnswerSelect}
        />
      ))}

      <button
        onClick={onSubmit}
        disabled={!allAnswered}
        className={`submit-button ${allAnswered ? 'enabled' : 'disabled'}`}
      >
        Submit Quiz
      </button>
    </div>
  );
}

// Enhanced Feedback Page Component
function QuizFeedbackPage({ 
  quizNum, 
  questions, 
  selectedAnswers, 
  onBack, 
  onRetry 
}) {
  const score = calculateQuizScore(quizNum, selectedAnswers);

  return (
    <div className="feedback-page">
      <header className="feedback-header">
        <h1 className="feedback-logo">Gogy</h1>
        <button onClick={onBack} className="btn btn-secondary">
          ← Back to Main Page
        </button>
      </header>

      <main className="feedback-main">
        <h1 className="feedback-title">
          Chapter {quizNum} Quiz Results
        </h1>
        <h2 className="feedback-score">
          Score: {score.correct} / {score.total} ({score.percentage}%)
        </h2>

        <div className="feedback-questions-list">
          {questions.map((question, idx) => {
            const userAnswer = selectedAnswers[idx];
            const isCorrect = userAnswer === question.correct;
            
            return (
              <div
                key={idx}
                className={`feedback-question-box ${isCorrect ? 'correct' : 'incorrect'}`}
              >
                <h3 className="feedback-question-header">
                  Question {idx + 1} {isCorrect ? '✓' : '✗'}
                </h3>
                <p className="feedback-question-text">
                  {question.question}
                </p>
                <p className="feedback-answer">
                  <strong>Your answer:</strong> {question.options[userAnswer] || 'Not answered'}
                </p>
                {!isCorrect && (
                  <p className="feedback-answer">
                    <strong>Correct answer:</strong> {question.options[question.correct]}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </main>

      <footer className="feedback-footer">
        <h3 className="feedback-footer-title">
          {score.isPerfect 
            ? '🎉 Perfect Score! Want to try another quiz?' 
            : 'Want to try again?'}
        </h3>
        <button onClick={onRetry} className="btn btn-primary">
          Retake Quiz
        </button>
      </footer>
    </div>
  );
}

// Chapter Page Component
function ChapterPage({ 
  chapterNum, 
  selectedAnswers, 
  onBack, 
  onAnswerSelect, 
  onQuizSubmit
}) {
  const content = getChapterContent(chapterNum);
  const questions = getQuizQuestions(chapterNum);

  return (
    <div className="App">
      <div className="page-container">
        <button onClick={onBack} className="btn btn-primary back-button">
          ← Back to Home
        </button>
        
        <div className="content-wrapper">
          <h1 className="chapter-title">{content.title}</h1>
          
          {content.sections.map((section, index) => (
            <p key={index} className="chapter-text">
              {section.content}
            </p>
          ))}

          {questions.length > 0 && (
            <Quiz
              quizNum={chapterNum}
              questions={questions}
              selectedAnswers={selectedAnswers}
              onAnswerSelect={onAnswerSelect}
              onSubmit={onQuizSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Main App Content Component
function AppContent() {
  const { user, logout, loading } = useAuth();
  const { markChapterCompleted, completedChapterNumbers, isChapterCompleted } = useModules();
  const { addQuizResult } = useQuizResults();
  const [showInfo, setShowInfo] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentQuizNum, setCurrentQuizNum] = useState(null);

  // Get all available chapters dynamically
  const chapterNumbers = getAllChapterNumbers();
  const modules = chapterNumbers.map(chapter => ({
    chapter,
    completed: isChapterCompleted(chapter)
  }));

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: optionIndex
    });
  };

  const handleQuizSubmit = (chapterNum) => {
    setCurrentQuizNum(chapterNum);
    const score = calculateQuizScore(chapterNum, selectedAnswers);
    
    // Save quiz result to database
    if (user) {
      const quizResult = {
        id: `quiz-${user.uid}-${chapterNum}-${Date.now()}`,
        userId: user.uid,
        chapter: chapterNum,
        score: score,
        answers: selectedAnswers,
        submittedAt: Date.now(),
        createdAt: Date.now(),
      };
      addQuizResult(quizResult);
    }
    
    // Mark chapter as completed if perfect score
    if (score.isPerfect && !isChapterCompleted(chapterNum)) {
      markChapterCompleted(chapterNum);
    }
    
    setCurrentView('feedback');
  };

  const handleQuizRetry = () => {
    setSelectedAnswers({});
    setCurrentView(`chapter${currentQuizNum}`);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedAnswers({});
    setCurrentQuizNum(null);
  };

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (!user) {
    return <AuthForm />;
  }

  if (showInfo) {
    return <InfoPage onBack={() => setShowInfo(false)} />;
  }

  if (currentView === 'feedback' && currentQuizNum) {
    const questions = getQuizQuestions(currentQuizNum);
    return (
      <QuizFeedbackPage
        quizNum={currentQuizNum}
        questions={questions}
        selectedAnswers={selectedAnswers}
        onBack={handleBackToHome}
        onRetry={handleQuizRetry}
      />
    );
  }

  if (currentView.startsWith('chapter')) {
    const chapterNum = parseInt(currentView.replace('chapter', ''));
    return (
      <ChapterPage
        chapterNum={chapterNum}
        selectedAnswers={selectedAnswers}
        onBack={handleBackToHome}
        onAnswerSelect={handleAnswerSelect}
        onQuizSubmit={() => handleQuizSubmit(chapterNum)}
      />
    );
  }

  if (currentView.startsWith('quiz')) {
    const quizNum = parseInt(currentView.replace('quiz', ''));
    const questions = getQuizQuestions(quizNum);

    return (
      <div className="App">
        <div className="page-container">
          <button onClick={handleBackToHome} className="btn btn-primary back-button">
            ← Back to Home
          </button>
          
          <div className="content-wrapper">
            <Quiz
              quizNum={quizNum}
              questions={questions}
              selectedAnswers={selectedAnswers}
              onAnswerSelect={handleAnswerSelect}
              onSubmit={() => {
                setCurrentQuizNum(quizNum);
                handleQuizSubmit(quizNum);
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <HomePage
      user={user}
      modules={modules}
      onLogout={logout}
      onShowInfo={() => setShowInfo(true)}
      onModuleClick={setCurrentView}
    />
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
```

```javascript
import './App.css';
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { AuthForm } from './Auth';
import InfoPage from './TemplateInfoPage';
import { getChapterContent, getAllChapterNumbers } from './ChapterContent';
import { getQuizQuestions, calculateQuizScore } from './QuizContent';
import { DatabaseProvider } from './database/DatabaseContext';
import { useQuizResults } from './database/hooks/useQuizResults';
import { useModules } from './database/hooks/useModules';

// Header Component
function Header({ user, onLogout, onShowInfo }) {
  return (
    <div className="header-container">
      {user.photoURL && (
        <img 
          src={user.photoURL} 
          alt="Profile" 
          className="profile-image"
        />
      )}
      <span className="welcome-text">Welcome, {user.displayName}!</span>
      <button onClick={onLogout} className="btn btn-primary">
        Logout
      </button>
      <button onClick={onShowInfo} className="btn btn-secondary">
        Info Page
      </button>
    </div>
  );
}

// Module List Item Component
function ModuleListItem({ chapter, completed, onChapterClick, onQuizClick }) {
  return (
    <div className="module-list-item">
      <span className="module-chapter-label">
        Chapter {chapter}:
      </span>
      <button onClick={onChapterClick} className="module-link">
        Link
      </button>
      <span className="module-separator">,</span>
      <button onClick={onQuizClick} className="module-link">
        mini quiz
      </button>
      <span className={`module-star ${completed ? 'completed' : ''}`}>
        ★
      </span>
    </div>
  );
}

// Home Page Component
function HomePage({ user, modules, onLogout, onShowInfo, onModuleClick }) {
  return (
    <div className="App"> 
      <div className="page-container">
        <Header user={user} onLogout={onLogout} onShowInfo={onShowInfo} />

        <div className="content-wrapper">
          <div className="hero-banner">
            <h1 className="hero-title">Gogy</h1>
          </div>

          <p className="intro-text">
            It is important to know stuff about AI Lorem ipsum dolor sit amet,
            consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
            Aenean massa. sem.
          </p>

          <div>
            <h2 className="section-title">Modules:</h2>

            {modules.map((module) => (
              <ModuleListItem
                key={module.chapter}
                chapter={module.chapter}
                completed={module.completed}
                onChapterClick={() => onModuleClick(`chapter${module.chapter}`)}
                onQuizClick={() => onModuleClick(`quiz${module.chapter}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Quiz Question Component
function QuizQuestion({ 
  question, 
  questionIndex, 
  selectedAnswer, 
  showResults, 
  onAnswerSelect 
}) {
  return (
    <div className="quiz-question-box">
      <h3 className="question-number">Question {questionIndex + 1}:</h3>
      <p className="question-text">{question.question}</p>
      <div className="options-container">
        {question.options.map((option, oIndex) => {
          const isSelected = selectedAnswer === oIndex;
          const isCorrect = question.correct === oIndex;
          
          let buttonClass = 'option-button';
          if (showResults && isSelected) {
            buttonClass += isCorrect ? ' option-correct' : ' option-incorrect';
          } else if (isSelected) {
            buttonClass += ' option-selected';
          }
          
          return (
            <button
              key={oIndex}
              onClick={() => !showResults && onAnswerSelect(questionIndex, oIndex)}
              className={buttonClass}
              disabled={showResults}
            >
              {String.fromCharCode(65 + oIndex)}) {option}
              {showResults && isCorrect && ' ✓'}
              {showResults && isSelected && !isCorrect && ' ✗'}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Quiz Component
function Quiz({ 
  quizNum, 
  questions, 
  selectedAnswers, 
  onAnswerSelect, 
  onSubmit
}) {
  const allAnswered = questions.every((q, idx) => selectedAnswers[idx] !== undefined);

  return (
    <div className="quiz-container">
      <h2 className="quiz-title">Mini Quiz {quizNum}</h2>
      <p className="quiz-description">
        Test your knowledge from Chapter {quizNum}!
      </p>
      
      {questions.map((q, qIndex) => (
        <QuizQuestion
          key={qIndex}
          question={q}
          questionIndex={qIndex}
          selectedAnswer={selectedAnswers[qIndex]}
          showResults={false}
          onAnswerSelect={onAnswerSelect}
        />
      ))}

      <button
        onClick={onSubmit}
        disabled={!allAnswered}
        className={`submit-button ${allAnswered ? 'enabled' : 'disabled'}`}
      >
        Submit Quiz
      </button>
    </div>
  );
}

// Enhanced Feedback Page Component
function QuizFeedbackPage({ 
  quizNum, 
  questions, 
  selectedAnswers, 
  onBack, 
  onRetry 
}) {
  const score = calculateQuizScore(quizNum, selectedAnswers);

  return (
    <div className="feedback-page">
      <header className="feedback-header">
        <h1 className="feedback-logo">Gogy</h1>
        <button onClick={onBack} className="btn btn-secondary">
          ← Back to Main Page
        </button>
      </header>

      <main className="feedback-main">
        <h1 className="feedback-title">
          Chapter {quizNum} Quiz Results
        </h1>
        <h2 className="feedback-score">
          Score: {score.correct} / {score.total} ({score.percentage}%)
        </h2>

        <div className="feedback-questions-list">
          {questions.map((question, idx) => {
            const userAnswer = selectedAnswers[idx];
            const isCorrect = userAnswer === question.correct;
            
            return (
              <div
                key={idx}
                className={`feedback-question-box ${isCorrect ? 'correct' : 'incorrect'}`}
              >
                <h3 className="feedback-question-header">
                  Question {idx + 1} {isCorrect ? '✓' : '✗'}
                </h3>
                <p className="feedback-question-text">
                  {question.question}
                </p>
                <p className="feedback-answer">
                  <strong>Your answer:</strong> {question.options[userAnswer] || 'Not answered'}
                </p>
                {!isCorrect && (
                  <p className="feedback-answer">
                    <strong>Correct answer:</strong> {question.options[question.correct]}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </main>

      <footer className="feedback-footer">
        <h3 className="feedback-footer-title">
          {score.isPerfect 
            ? '🎉 Perfect Score! Want to try another quiz?' 
            : 'Want to try again?'}
        </h3>
        <button onClick={onRetry} className="btn btn-primary">
          Retake Quiz
        </button>
      </footer>
    </div>
  );
}

// Chapter Page Component
function ChapterPage({ 
  chapterNum, 
  selectedAnswers, 
  onBack, 
  onAnswerSelect, 
  onQuizSubmit
}) {
  const content = getChapterContent(chapterNum);
  const questions = getQuizQuestions(chapterNum);

  return (
    <div className="App">
      <div className="page-container">
        <button onClick={onBack} className="btn btn-primary back-button">
          ← Back to Home
        </button>
        
        <div className="content-wrapper">
          <h1 className="chapter-title">{content.title}</h1>
          
          {content.sections.map((section, index) => (
            <p key={index} className="chapter-text">
              {section.content}
            </p>
          ))}

          {questions.length > 0 && (
            <Quiz
              quizNum={chapterNum}
              questions={questions}
              selectedAnswers={selectedAnswers}
              onAnswerSelect={onAnswerSelect}
              onSubmit={onQuizSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Main App Content Component
function AppContent() {
  const { user, logout, loading } = useAuth();
  const { markChapterCompleted, completedChapterNumbers, isChapterCompleted } = useModules();
  const { addQuizResult } = useQuizResults();
  const [showInfo, setShowInfo] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentQuizNum, setCurrentQuizNum] = useState(null);

  // Get all available chapters dynamically
  const chapterNumbers = getAllChapterNumbers();
  const modules = chapterNumbers.map(chapter => ({
    chapter,
    completed: isChapterCompleted(chapter)
  }));

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: optionIndex
    });
  };

  const handleQuizSubmit = (chapterNum) => {
    setCurrentQuizNum(chapterNum);
    const score = calculateQuizScore(chapterNum, selectedAnswers);
    
    // Save quiz result to database
    if (user) {
      const quizResult = {
        id: `quiz-${user.uid}-${chapterNum}-${Date.now()}`,
        userId: user.uid,
        chapter: chapterNum,
        score: score,
        answers: selectedAnswers,
        submittedAt: Date.now(),
        createdAt: Date.now(),
      };
      addQuizResult(quizResult);
    }
    
    // Mark chapter as completed if perfect score
    if (score.isPerfect && !isChapterCompleted(chapterNum)) {
      markChapterCompleted(chapterNum);
    }
    
    setCurrentView('feedback');
  };

  const handleQuizRetry = () => {
    setSelectedAnswers({});
    setCurrentView(`chapter${currentQuizNum}`);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedAnswers({});
    setCurrentQuizNum(null);
  };

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (!user) {
    return <AuthForm />;
  }

  if (showInfo) {
    return <InfoPage onBack={() => setShowInfo(false)} />;
  }

  if (currentView === 'feedback' && currentQuizNum) {
    const questions = getQuizQuestions(currentQuizNum);
    return (
      <QuizFeedbackPage
        quizNum={currentQuizNum}
        questions={questions}
        selectedAnswers={selectedAnswers}
        onBack={handleBackToHome}
        onRetry={handleQuizRetry}
      />
    );
  }

  if (currentView.startsWith('chapter')) {
    const chapterNum = parseInt(currentView.replace('chapter', ''));
    return (
      <ChapterPage
        chapterNum={chapterNum}
        selectedAnswers={selectedAnswers}
        onBack={handleBackToHome}
        onAnswerSelect={handleAnswerSelect}
        onQuizSubmit={() => handleQuizSubmit(chapterNum)}
      />
    );
  }

  if (currentView.startsWith('quiz')) {
    const quizNum = parseInt(currentView.replace('quiz', ''));
    const questions = getQuizQuestions(quizNum);

    return (
      <div className="App">
        <div className="page-container">
          <button onClick={handleBackToHome} className="btn btn-primary back-button">
            ← Back to Home
          </button>
          
          <div className="content-wrapper">
            <Quiz
              quizNum={quizNum}
              questions={questions}
              selectedAnswers={selectedAnswers}
              onAnswerSelect={handleAnswerSelect}
              onSubmit={() => {
                setCurrentQuizNum(quizNum);
                handleQuizSubmit(quizNum);
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <HomePage
      user={user}
      modules={modules}
      onLogout={logout}
      onShowInfo={() => setShowInfo(true)}
      onModuleClick={setCurrentView}
    />
  );
}

function App() {
  return (
    <AuthProvider>
      <AppWithDatabase />
    </AuthProvider>
  );
}

// Inner component that has access to both Auth and Database contexts
function AppWithDatabase() {
  const { user } = useAuth();
  
  return (
    <DatabaseProvider firebaseUser={user}>
      <AppContent />
    </DatabaseProvider>
  );
}

export default App;
```


Fixing linter warnings:


```javascript
import './App.css';
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { AuthForm } from './Auth';
import InfoPage from './TemplateInfoPage';
import { getChapterContent, getAllChapterNumbers } from './ChapterContent';
import { getQuizQuestions, calculateQuizScore } from './QuizContent';
import { DatabaseProvider } from './database/DatabaseContext';
import { useQuizResults } from './database/hooks/useQuizResults';
import { useModules } from './database/hooks/useModules';

// Header Component
function Header({ user, onLogout, onShowInfo }) {
  return (
    <div className="header-container">
      {user.photoURL && (
        <img 
          src={user.photoURL} 
          alt="Profile" 
          className="profile-image"
        />
      )}
      <span className="welcome-text">Welcome, {user.displayName}!</span>
      <button onClick={onLogout} className="btn btn-primary">
        Logout
      </button>
      <button onClick={onShowInfo} className="btn btn-secondary">
        Info Page
      </button>
    </div>
  );
}

// Module List Item Component
function ModuleListItem({ chapter, completed, onChapterClick, onQuizClick }) {
  return (
    <div className="module-list-item">
      <span className="module-chapter-label">
        Chapter {chapter}:
      </span>
      <button onClick={onChapterClick} className="module-link">
        Link
      </button>
      <span className="module-separator">,</span>
      <button onClick={onQuizClick} className="module-link">
        mini quiz
      </button>
      <span className={`module-star ${completed ? 'completed' : ''}`}>
        ★
      </span>
    </div>
  );
}

// Home Page Component
function HomePage({ user, modules, onLogout, onShowInfo, onModuleClick }) {
  return (
    <div className="App"> 
      <div className="page-container">
        <Header user={user} onLogout={onLogout} onShowInfo={onShowInfo} />

        <div className="content-wrapper">
          <div className="hero-banner">
            <h1 className="hero-title">Gogy</h1>
          </div>

          <p className="intro-text">
            It is important to know stuff about AI Lorem ipsum dolor sit amet,
            consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
            Aenean massa. sem.
          </p>

          <div>
            <h2 className="section-title">Modules:</h2>

            {modules.map((module) => (
              <ModuleListItem
                key={module.chapter}
                chapter={module.chapter}
                completed={module.completed}
                onChapterClick={() => onModuleClick(`chapter${module.chapter}`)}
                onQuizClick={() => onModuleClick(`quiz${module.chapter}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Quiz Question Component
function QuizQuestion({ 
  question, 
  questionIndex, 
  selectedAnswer, 
  showResults, 
  onAnswerSelect 
}) {
  return (
    <div className="quiz-question-box">
      <h3 className="question-number">Question {questionIndex + 1}:</h3>
      <p className="question-text">{question.question}</p>
      <div className="options-container">
        {question.options.map((option, oIndex) => {
          const isSelected = selectedAnswer === oIndex;
          const isCorrect = question.correct === oIndex;
          
          let buttonClass = 'option-button';
          if (showResults && isSelected) {
            buttonClass += isCorrect ? ' option-correct' : ' option-incorrect';
          } else if (isSelected) {
            buttonClass += ' option-selected';
          }
          
          return (
            <button
              key={oIndex}
              onClick={() => !showResults && onAnswerSelect(questionIndex, oIndex)}
              className={buttonClass}
              disabled={showResults}
            >
              {String.fromCharCode(65 + oIndex)}) {option}
              {showResults && isCorrect && ' ✓'}
              {showResults && isSelected && !isCorrect && ' ✗'}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Quiz Component
function Quiz({ 
  quizNum, 
  questions, 
  selectedAnswers, 
  onAnswerSelect, 
  onSubmit
}) {
  const allAnswered = questions.every((q, idx) => selectedAnswers[idx] !== undefined);

  return (
    <div className="quiz-container">
      <h2 className="quiz-title">Mini Quiz {quizNum}</h2>
      <p className="quiz-description">
        Test your knowledge from Chapter {quizNum}!
      </p>
      
      {questions.map((q, qIndex) => (
        <QuizQuestion
          key={qIndex}
          question={q}
          questionIndex={qIndex}
          selectedAnswer={selectedAnswers[qIndex]}
          showResults={false}
          onAnswerSelect={onAnswerSelect}
        />
      ))}

      <button
        onClick={onSubmit}
        disabled={!allAnswered}
        className={`submit-button ${allAnswered ? 'enabled' : 'disabled'}`}
      >
        Submit Quiz
      </button>
    </div>
  );
}

// Enhanced Feedback Page Component
function QuizFeedbackPage({ 
  quizNum, 
  questions, 
  selectedAnswers, 
  onBack, 
  onRetry 
}) {
  const score = calculateQuizScore(quizNum, selectedAnswers);

  return (
    <div className="feedback-page">
      <header className="feedback-header">
        <h1 className="feedback-logo">Gogy</h1>
        <button onClick={onBack} className="btn btn-secondary">
          ← Back to Main Page
        </button>
      </header>

      <main className="feedback-main">
        <h1 className="feedback-title">
          Chapter {quizNum} Quiz Results
        </h1>
        <h2 className="feedback-score">
          Score: {score.correct} / {score.total} ({score.percentage}%)
        </h2>

        <div className="feedback-questions-list">
          {questions.map((question, idx) => {
            const userAnswer = selectedAnswers[idx];
            const isCorrect = userAnswer === question.correct;
            
            return (
              <div
                key={idx}
                className={`feedback-question-box ${isCorrect ? 'correct' : 'incorrect'}`}
              >
                <h3 className="feedback-question-header">
                  Question {idx + 1} {isCorrect ? '✓' : '✗'}
                </h3>
                <p className="feedback-question-text">
                  {question.question}
                </p>
                <p className="feedback-answer">
                  <strong>Your answer:</strong> {question.options[userAnswer] || 'Not answered'}
                </p>
                {!isCorrect && (
                  <p className="feedback-answer">
                    <strong>Correct answer:</strong> {question.options[question.correct]}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </main>

      <footer className="feedback-footer">
        <h3 className="feedback-footer-title">
          {score.isPerfect 
            ? '🎉 Perfect Score! Want to try another quiz?' 
            : 'Want to try again?'}
        </h3>
        <button onClick={onRetry} className="btn btn-primary">
          Retake Quiz
        </button>
      </footer>
    </div>
  );
}

// Chapter Page Component
function ChapterPage({ 
  chapterNum, 
  selectedAnswers, 
  onBack, 
  onAnswerSelect, 
  onQuizSubmit
}) {
  const content = getChapterContent(chapterNum);
  const questions = getQuizQuestions(chapterNum);

  return (
    <div className="App">
      <div className="page-container">
        <button onClick={onBack} className="btn btn-primary back-button">
          ← Back to Home
        </button>
        
        <div className="content-wrapper">
          <h1 className="chapter-title">{content.title}</h1>
          
          {content.sections.map((section, index) => (
            <p key={index} className="chapter-text">
              {section.content}
            </p>
          ))}

          {questions.length > 0 && (
            <Quiz
              quizNum={chapterNum}
              questions={questions}
              selectedAnswers={selectedAnswers}
              onAnswerSelect={onAnswerSelect}
              onSubmit={onQuizSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Main App Content Component
function AppContent() {
  const { user, logout, loading } = useAuth();
  const { markChapterCompleted, completedChapterNumbers, isChapterCompleted } = useModules();
  const { addQuizResult } = useQuizResults();
  const [showInfo, setShowInfo] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentQuizNum, setCurrentQuizNum] = useState(null);

  // Get all available chapters dynamically
  const chapterNumbers = getAllChapterNumbers();
  const modules = chapterNumbers.map(chapter => ({
    chapter,
    completed: isChapterCompleted(chapter)
  }));

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: optionIndex
    });
  };

  const handleQuizSubmit = (chapterNum) => {
    setCurrentQuizNum(chapterNum);
    const score = calculateQuizScore(chapterNum, selectedAnswers);
    
    // Save quiz result to database
    if (user) {
      const quizResult = {
        id: `quiz-${user.uid}-${chapterNum}-${Date.now()}`,
        userId: user.uid,
        chapter: chapterNum,
        score: score,
        answers: selectedAnswers,
        submittedAt: Date.now(),
        createdAt: Date.now(),
      };
      addQuizResult(quizResult);
    }
    
    // Mark chapter as completed if perfect score
    if (score.isPerfect && !isChapterCompleted(chapterNum)) {
      markChapterCompleted(chapterNum);
    }
    
    setCurrentView('feedback');
  };

  const handleQuizRetry = () => {
    setSelectedAnswers({});
    setCurrentView(`chapter${currentQuizNum}`);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedAnswers({});
    setCurrentQuizNum(null);
  };

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (!user) {
    return <AuthForm />;
  }

  if (showInfo) {
    return <InfoPage onBack={() => setShowInfo(false)} />;
  }

  if (currentView === 'feedback' && currentQuizNum) {
    const questions = getQuizQuestions(currentQuizNum);
    return (
      <QuizFeedbackPage
        quizNum={currentQuizNum}
        questions={questions}
        selectedAnswers={selectedAnswers}
        onBack={handleBackToHome}
        onRetry={handleQuizRetry}
      />
    );
  }

  if (currentView.startsWith('chapter')) {
    const chapterNum = parseInt(currentView.replace('chapter', ''));
    return (
      <ChapterPage
        chapterNum={chapterNum}
        selectedAnswers={selectedAnswers}
        onBack={handleBackToHome}
        onAnswerSelect={handleAnswerSelect}
        onQuizSubmit={() => handleQuizSubmit(chapterNum)}
      />
    );
  }

  if (currentView.startsWith('quiz')) {
    const quizNum = parseInt(currentView.replace('quiz', ''));
    const questions = getQuizQuestions(quizNum);

    return (
      <div className="App">
        <div className="page-container">
          <button onClick={handleBackToHome} className="btn btn-primary back-button">
            ← Back to Home
          </button>
          
          <div className="content-wrapper">
            <Quiz
              quizNum={quizNum}
              questions={questions}
              selectedAnswers={selectedAnswers}
              onAnswerSelect={handleAnswerSelect}
              onSubmit={() => {
                setCurrentQuizNum(quizNum);
                handleQuizSubmit(quizNum);
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <HomePage
      user={user}
      modules={modules}
      onLogout={logout}
      onShowInfo={() => setShowInfo(true)}
      onModuleClick={setCurrentView}
    />
  );
}

function App() {
  return (
    <AuthProvider>
      <AppWithDatabase />
    </AuthProvider>
  );
}

// Inner component that has access to both Auth and Database contexts
function AppWithDatabase() {
  const { user } = useAuth();
  
  return (
    <DatabaseProvider firebaseUser={user}>
      <AppContent />
    </DatabaseProvider>
  );
}

export default App;
```

```javascript
import './App.css';
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { AuthForm } from './Auth';
import InfoPage from './TemplateInfoPage';
import { getChapterContent, getAllChapterNumbers } from './ChapterContent';
import { getQuizQuestions, calculateQuizScore } from './QuizContent';
import { DatabaseProvider } from './database/DatabaseContext';
import { useQuizResults } from './database/hooks/useQuizResults';
import { useModules } from './database/hooks/useModules';

// Header Component
function Header({ user, onLogout, onShowInfo }) {
  return (
    <div className="header-container">
      {user.photoURL && (
        <img 
          src={user.photoURL} 
          alt="Profile" 
          className="profile-image"
        />
      )}
      <span className="welcome-text">Welcome, {user.displayName}!</span>
      <button onClick={onLogout} className="btn btn-primary">
        Logout
      </button>
      <button onClick={onShowInfo} className="btn btn-secondary">
        Info Page
      </button>
    </div>
  );
}

// Module List Item Component
function ModuleListItem({ chapter, completed, onChapterClick, onQuizClick }) {
  return (
    <div className="module-list-item">
      <span className="module-chapter-label">
        Chapter {chapter}:
      </span>
      <button onClick={onChapterClick} className="module-link">
        Link
      </button>
      <span className="module-separator">,</span>
      <button onClick={onQuizClick} className="module-link">
        mini quiz
      </button>
      <span className={`module-star ${completed ? 'completed' : ''}`}>
        ★
      </span>
    </div>
  );
}

// Home Page Component
function HomePage({ user, modules, onLogout, onShowInfo, onModuleClick }) {
  return (
    <div className="App"> 
      <div className="page-container">
        <Header user={user} onLogout={onLogout} onShowInfo={onShowInfo} />

        <div className="content-wrapper">
          <div className="hero-banner">
            <h1 className="hero-title">Gogy</h1>
          </div>

          <p className="intro-text">
            It is important to know stuff about AI Lorem ipsum dolor sit amet,
            consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
            Aenean massa. sem.
          </p>

          <div>
            <h2 className="section-title">Modules:</h2>

            {modules.map((module) => (
              <ModuleListItem
                key={module.chapter}
                chapter={module.chapter}
                completed={module.completed}
                onChapterClick={() => onModuleClick(`chapter${module.chapter}`)}
                onQuizClick={() => onModuleClick(`quiz${module.chapter}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Quiz Question Component
function QuizQuestion({ 
  question, 
  questionIndex, 
  selectedAnswer, 
  showResults, 
  onAnswerSelect 
}) {
  return (
    <div className="quiz-question-box">
      <h3 className="question-number">Question {questionIndex + 1}:</h3>
      <p className="question-text">{question.question}</p>
      <div className="options-container">
        {question.options.map((option, oIndex) => {
          const isSelected = selectedAnswer === oIndex;
          const isCorrect = question.correct === oIndex;
          
          let buttonClass = 'option-button';
          if (showResults && isSelected) {
            buttonClass += isCorrect ? ' option-correct' : ' option-incorrect';
          } else if (isSelected) {
            buttonClass += ' option-selected';
          }
          
          return (
            <button
              key={oIndex}
              onClick={() => !showResults && onAnswerSelect(questionIndex, oIndex)}
              className={buttonClass}
              disabled={showResults}
            >
              {String.fromCharCode(65 + oIndex)}) {option}
              {showResults && isCorrect && ' ✓'}
              {showResults && isSelected && !isCorrect && ' ✗'}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Quiz Component
function Quiz({ 
  quizNum, 
  questions, 
  selectedAnswers, 
  onAnswerSelect, 
  onSubmit
}) {
  const allAnswered = questions.every((q, idx) => selectedAnswers[idx] !== undefined);

  return (
    <div className="quiz-container">
      <h2 className="quiz-title">Mini Quiz {quizNum}</h2>
      <p className="quiz-description">
        Test your knowledge from Chapter {quizNum}!
      </p>
      
      {questions.map((q, qIndex) => (
        <QuizQuestion
          key={qIndex}
          question={q}
          questionIndex={qIndex}
          selectedAnswer={selectedAnswers[qIndex]}
          showResults={false}
          onAnswerSelect={onAnswerSelect}
        />
      ))}

      <button
        onClick={onSubmit}
        disabled={!allAnswered}
        className={`submit-button ${allAnswered ? 'enabled' : 'disabled'}`}
      >
        Submit Quiz
      </button>
    </div>
  );
}

// Enhanced Feedback Page Component
function QuizFeedbackPage({ 
  quizNum, 
  questions, 
  selectedAnswers, 
  onBack, 
  onRetry 
}) {
  const score = calculateQuizScore(quizNum, selectedAnswers);

  return (
    <div className="feedback-page">
      <header className="feedback-header">
        <h1 className="feedback-logo">Gogy</h1>
        <button onClick={onBack} className="btn btn-secondary">
          ← Back to Main Page
        </button>
      </header>

      <main className="feedback-main">
        <h1 className="feedback-title">
          Chapter {quizNum} Quiz Results
        </h1>
        <h2 className="feedback-score">
          Score: {score.correct} / {score.total} ({score.percentage}%)
        </h2>

        <div className="feedback-questions-list">
          {questions.map((question, idx) => {
            const userAnswer = selectedAnswers[idx];
            const isCorrect = userAnswer === question.correct;
            
            return (
              <div
                key={idx}
                className={`feedback-question-box ${isCorrect ? 'correct' : 'incorrect'}`}
              >
                <h3 className="feedback-question-header">
                  Question {idx + 1} {isCorrect ? '✓' : '✗'}
                </h3>
                <p className="feedback-question-text">
                  {question.question}
                </p>
                <p className="feedback-answer">
                  <strong>Your answer:</strong> {question.options[userAnswer] || 'Not answered'}
                </p>
                {!isCorrect && (
                  <p className="feedback-answer">
                    <strong>Correct answer:</strong> {question.options[question.correct]}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </main>

      <footer className="feedback-footer">
        <h3 className="feedback-footer-title">
          {score.isPerfect 
            ? '🎉 Perfect Score! Want to try another quiz?' 
            : 'Want to try again?'}
        </h3>
        <button onClick={onRetry} className="btn btn-primary">
          Retake Quiz
        </button>
      </footer>
    </div>
  );
}

// Chapter Page Component
function ChapterPage({ 
  chapterNum, 
  selectedAnswers, 
  onBack, 
  onAnswerSelect, 
  onQuizSubmit
}) {
  const content = getChapterContent(chapterNum);
  const questions = getQuizQuestions(chapterNum);

  return (
    <div className="App">
      <div className="page-container">
        <button onClick={onBack} className="btn btn-primary back-button">
          ← Back to Home
        </button>
        
        <div className="content-wrapper">
          <h1 className="chapter-title">{content.title}</h1>
          
          {content.sections.map((section, index) => (
            <p key={index} className="chapter-text">
              {section.content}
            </p>
          ))}

          {questions.length > 0 && (
            <Quiz
              quizNum={chapterNum}
              questions={questions}
              selectedAnswers={selectedAnswers}
              onAnswerSelect={onAnswerSelect}
              onSubmit={onQuizSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Main App Content Component
function AppContent() {
  const { user, logout, loading } = useAuth();
  const { markChapterCompleted, isChapterCompleted } = useModules();
  const { addQuizResult } = useQuizResults();
  const [showInfo, setShowInfo] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentQuizNum, setCurrentQuizNum] = useState(null);

  // Get all available chapters dynamically
  const chapterNumbers = getAllChapterNumbers();
  const modules = chapterNumbers.map(chapter => ({
    chapter,
    completed: isChapterCompleted(chapter)
  }));

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: optionIndex
    });
  };

  const handleQuizSubmit = (chapterNum) => {
    setCurrentQuizNum(chapterNum);
    const score = calculateQuizScore(chapterNum, selectedAnswers);
    
    // Save quiz result to database
    if (user) {
      const quizResult = {
        id: `quiz-${user.uid}-${chapterNum}-${Date.now()}`,
        userId: user.uid,
        chapter: chapterNum,
        score: score,
        answers: selectedAnswers,
        submittedAt: Date.now(),
        createdAt: Date.now(),
      };
      addQuizResult(quizResult);
    }
    
    // Mark chapter as completed if perfect score
    if (score.isPerfect && !isChapterCompleted(chapterNum)) {
      markChapterCompleted(chapterNum);
    }
    
    setCurrentView('feedback');
  };

  const handleQuizRetry = () => {
    setSelectedAnswers({});
    setCurrentView(`chapter${currentQuizNum}`);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedAnswers({});
    setCurrentQuizNum(null);
  };

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (!user) {
    return <AuthForm />;
  }

  if (showInfo) {
    return <InfoPage onBack={() => setShowInfo(false)} />;
  }

  if (currentView === 'feedback' && currentQuizNum) {
    const questions = getQuizQuestions(currentQuizNum);
    return (
      <QuizFeedbackPage
        quizNum={currentQuizNum}
        questions={questions}
        selectedAnswers={selectedAnswers}
        onBack={handleBackToHome}
        onRetry={handleQuizRetry}
      />
    );
  }

  if (currentView.startsWith('chapter')) {
    const chapterNum = parseInt(currentView.replace('chapter', ''));
    return (
      <ChapterPage
        chapterNum={chapterNum}
        selectedAnswers={selectedAnswers}
        onBack={handleBackToHome}
        onAnswerSelect={handleAnswerSelect}
        onQuizSubmit={() => handleQuizSubmit(chapterNum)}
      />
    );
  }

  if (currentView.startsWith('quiz')) {
    const quizNum = parseInt(currentView.replace('quiz', ''));
    const questions = getQuizQuestions(quizNum);

    return (
      <div className="App">
        <div className="page-container">
          <button onClick={handleBackToHome} className="btn btn-primary back-button">
            ← Back to Home
          </button>
          
          <div className="content-wrapper">
            <Quiz
              quizNum={quizNum}
              questions={questions}
              selectedAnswers={selectedAnswers}
              onAnswerSelect={handleAnswerSelect}
              onSubmit={() => {
                setCurrentQuizNum(quizNum);
                handleQuizSubmit(quizNum);
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <HomePage
      user={user}
      modules={modules}
      onLogout={logout}
      onShowInfo={() => setShowInfo(true)}
      onModuleClick={setCurrentView}
    />
  );
}

function App() {
  return (
    <AuthProvider>
      <AppWithDatabase />
    </AuthProvider>
  );
}

// Inner component that has access to both Auth and Database contexts
function AppWithDatabase() {
  const { user } = useAuth();
  
  return (
    <DatabaseProvider firebaseUser={user}>
      <AppContent />
    </DatabaseProvider>
  );
}

export default App;
```


Fixing the useModules hook to avoid calling hooks inside callbacks:


```typescript
import { useCallback, useMemo } from 'react';
import { useDatabase } from './useDatabase';
import { Module } from '../types';
import { moduleActions } from '../reducers/actions';
import {
  useSelectAllModules,
  useSelectModuleByChapter,
  useSelectCompletedModules,
} from '../utils/selectors';

/**
 * Hook for module/chapter operations
 */
export const useModules = () => {
  const { state, dispatch } = useDatabase();

  const allModules = useSelectAllModules(state);
  const completedModules = useSelectCompletedModules(state);
  const loading = state.metadata.modules.loading;
  const error = state.metadata.modules.error;

  const getModuleByChapter = useCallback(
    (chapter: number): Module | undefined => {
      return Object.values(state.modules).find((module) => module.chapter === chapter);
    },
    [state]
  );

  const isChapterCompleted = useCallback(
    (chapter: number): boolean => {
      const module = Object.values(state.modules).find((m) => m.chapter === chapter);
      return module?.completed ?? false;
    },
    [state]
  );

  const getCompletedChapterNumbers = useCallback((): number[] => {
    return completedModules.map((module) => module.chapter);
  }, [completedModules]);

  const addModule = useCallback(
    (module: Module) => {
      dispatch(moduleActions.add(module));
    },
    [dispatch]
  );

  const updateModule = useCallback(
    (id: string, updates: Partial<Module>) => {
      dispatch(moduleActions.update(id, updates));
    },
    [dispatch]
  );

  const deleteModule = useCallback(
    (id: string) => {
      dispatch(moduleActions.delete(id));
    },
    [dispatch]
  );

  const addModules = useCallback(
    (modules: Module[]) => {
      dispatch(moduleActions.addMultiple(modules));
    },
    [dispatch]
  );

  const deleteModules = useCallback(
    (ids: string[]) => {
      dispatch(moduleActions.deleteMultiple(ids));
    },
    [dispatch]
  );

  const markChapterCompleted = useCallback(
    (chapter: number) => {
      const moduleId = `module-${chapter}`;
      const existingModule = state.modules[moduleId];
      
      if (existingModule) {
        dispatch(
          moduleActions.update(moduleId, {
            completed: true,
            completedAt: Date.now(),
            lastAccessedAt: Date.now(),
          })
        );
      } else {
        const newModule: Module = {
          id: moduleId,
          chapter,
          completed: true,
          completedAt: Date.now(),
          lastAccessedAt: Date.now(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        dispatch(moduleActions.add(newModule));
      }
    },
    [state, dispatch]
  );

  const markChapterIncomplete = useCallback(
    (chapter: number) => {
      const moduleId = `module-${chapter}`;
      const existingModule = state.modules[moduleId];
      
      if (existingModule) {
        dispatch(
          moduleActions.update(moduleId, {
            completed: false,
            completedAt: undefined,
            lastAccessedAt: Date.now(),
          })
        );
      }
    },
    [state, dispatch]
  );

  const setLoading = useCallback(
    (loading: boolean) => {
      dispatch(moduleActions.setLoading(loading));
    },
    [dispatch]
  );

  const setError = useCallback(
    (error: string | null) => {
      dispatch(moduleActions.setError(error));
    },
    [dispatch]
  );

  return {
    modules: allModules,
    completedModules,
    completedChapterNumbers: getCompletedChapterNumbers(),
    loading,
    error,
    getModuleByChapter,
    isChapterCompleted,
    addModule,
    updateModule,
    deleteModule,
    addModules,
    deleteModules,
    markChapterCompleted,
    markChapterIncomplete,
    setLoading,
    setError,
  };
};


```


Creating an index file for easier imports and verifying everything works:


```typescript
// Export all hooks for convenient importing
export { useDatabase } from './useDatabase';
export { useUsers } from './useUsers';
export { useQuizResults } from './useQuizResults';
export { useModules } from './useModules';
export { useAuth } from './useAuth';

```


Verifying the implementation is complete. Checking for any remaining issues:



Testing the build with a PowerShell-compatible command:



Fixing the hook usage error:


```typescript
import { useCallback, useMemo } from 'react';
import { useDatabase } from './useDatabase';
import { QuizResult } from '../types';
import { quizResultActions } from '../reducers/actions';
import {
  useSelectAllQuizResults,
  useSelectQuizResultsByUserId,
  useSelectQuizResultsByChapter,
} from '../utils/selectors';

/**
 * Hook for quiz result operations
 */
export const useQuizResults = (userId?: string, chapter?: number) => {
  const { state, dispatch } = useDatabase();

  const allResults = useSelectAllQuizResults(state);
  const resultsByUserId = userId ? useSelectQuizResultsByUserId(state, userId) : allResults;
  const loading = state.metadata.quizResults.loading;
  const error = state.metadata.quizResults.error;

  // Filtered results based on provided userId and/or chapter
  const results = useMemo(() => {
    let filtered = userId ? resultsByUserId : allResults;
    if (chapter !== undefined) {
      filtered = filtered.filter((result) => result.chapter === chapter);
    }
    return filtered;
  }, [userId, resultsByUserId, allResults, chapter]);

  const getResultById = useCallback(
    (resultId: string): QuizResult | undefined => {
      return state.quizResults[resultId];
    },
    [state]
  );

  const getResultsByUserId = useCallback(
    (id: string) => {
      return Object.values(state.quizResults).filter((result) => result.userId === id);
    },
    [state]
  );

  const getResultsByChapter = useCallback(
    (ch: number) => {
      return Object.values(state.quizResults).filter((result) => result.chapter === ch);
    },
    [state]
  );

  const addQuizResult = useCallback(
    (quizResult: QuizResult) => {
      dispatch(quizResultActions.add(quizResult));
    },
    [dispatch]
  );

  const updateQuizResult = useCallback(
    (id: string, updates: Partial<QuizResult>) => {
      dispatch(quizResultActions.update(id, updates));
    },
    [dispatch]
  );

  const deleteQuizResult = useCallback(
    (id: string) => {
      dispatch(quizResultActions.delete(id));
    },
    [dispatch]
  );

  const addQuizResults = useCallback(
    (quizResults: QuizResult[]) => {
      dispatch(quizResultActions.addMultiple(quizResults));
    },
    [dispatch]
  );

  const deleteQuizResults = useCallback(
    (ids: string[]) => {
      dispatch(quizResultActions.deleteMultiple(ids));
    },
    [dispatch]
  );

  const setLoading = useCallback(
    (loading: boolean) => {
      dispatch(quizResultActions.setLoading(loading));
    },
    [dispatch]
  );

  const setError = useCallback(
    (error: string | null) => {
      dispatch(quizResultActions.setError(error));
    },
    [dispatch]
  );

  return {
    results,
    allResults,
    loading,
    error,
    getResultById,
    getResultsByUserId,
    getResultsByChapter,
    addQuizResult,
    updateQuizResult,
    deleteQuizResult,
    addQuizResults,
    deleteQuizResults,
    setLoading,
    setError,
  };
};


```


Fixing the conditional hook call:


```typescript
  const allResults = useSelectAllQuizResults(state);
  const loading = state.metadata.quizResults.loading;
  const error = state.metadata.quizResults.error;

  // Filtered results based on provided userId and/or chapter
  // Always call hooks unconditionally, then filter
  const results = useMemo(() => {
    let filtered = allResults;
    if (userId) {
      filtered = filtered.filter((result) => result.userId === userId);
    }
    if (chapter !== undefined) {
      filtered = filtered.filter((result) => result.chapter === chapter);
    }
    return filtered;
  }, [allResults, userId, chapter]);
```


Reading the file and fixing it:


```typescript
import { useCallback, useMemo } from 'react';
import { useDatabase } from './useDatabase';
import { QuizResult } from '../types';
import { quizResultActions } from '../reducers/actions';
import {
  useSelectAllQuizResults,
  useSelectQuizResultsByUserId,
  useSelectQuizResultsByChapter,
} from '../utils/selectors';

/**
 * Hook for quiz result operations
 */
export const useQuizResults = (userId?: string, chapter?: number) => {
  const { state, dispatch } = useDatabase();

  const allResults = useSelectAllQuizResults(state);
  const loading = state.metadata.quizResults.loading;
  const error = state.metadata.quizResults.error;

  // Filtered results based on provided userId and/or chapter
  // Always call hooks unconditionally, then filter
  const results = useMemo(() => {
    let filtered = allResults;
    if (userId) {
      filtered = filtered.filter((result) => result.userId === userId);
    }
    if (chapter !== undefined) {
      filtered = filtered.filter((result) => result.chapter === chapter);
    }
    return filtered;
  }, [allResults, userId, chapter]);

  const getResultById = useCallback(
    (resultId: string): QuizResult | undefined => {
      return state.quizResults[resultId];
    },
    [state]
  );

  const getResultsByUserId = useCallback(
    (id: string) => {
      return Object.values(state.quizResults).filter((result) => result.userId === id);
    },
    [state]
  );

  const getResultsByChapter = useCallback(
    (ch: number) => {
      return Object.values(state.quizResults).filter((result) => result.chapter === ch);
    },
    [state]
  );

  const addQuizResult = useCallback(
    (quizResult: QuizResult) => {
      dispatch(quizResultActions.add(quizResult));
    },
    [dispatch]
  );

  const updateQuizResult = useCallback(
    (id: string, updates: Partial<QuizResult>) => {
      dispatch(quizResultActions.update(id, updates));
    },
    [dispatch]
  );

  const deleteQuizResult = useCallback(
    (id: string) => {
      dispatch(quizResultActions.delete(id));
    },
    [dispatch]
  );

  const addQuizResults = useCallback(
    (quizResults: QuizResult[]) => {
      dispatch(quizResultActions.addMultiple(quizResults));
    },
    [dispatch]
  );

  const deleteQuizResults = useCallback(
    (ids: string[]) => {
      dispatch(quizResultActions.deleteMultiple(ids));
    },
    [dispatch]
  );

  const setLoading = useCallback(
    (loading: boolean) => {
      dispatch(quizResultActions.setLoading(loading));
    },
    [dispatch]
  );

  const setError = useCallback(
    (error: string | null) => {
      dispatch(quizResultActions.setError(error));
    },
    [dispatch]
  );

  return {
    results,
    allResults,
    loading,
    error,
    getResultById,
    getResultsByUserId,
    getResultsByChapter,
    addQuizResult,
    updateQuizResult,
    deleteQuizResult,
    addQuizResults,
    deleteQuizResults,
    setLoading,
    setError,
  };
};


```

```typescript
import { useCallback, useMemo } from 'react';
import { useDatabase } from './useDatabase';
import { QuizResult } from '../types';
import { quizResultActions } from '../reducers/actions';
import {
  useSelectAllQuizResults,
} from '../utils/selectors';

/**
 * Hook for quiz result operations
 */
export const useQuizResults = (userId?: string, chapter?: number) => {
  const { state, dispatch } = useDatabase();

  const allResults = useSelectAllQuizResults(state);
  const loading = state.metadata.quizResults.loading;
  const error = state.metadata.quizResults.error;

  // Filtered results based on provided userId and/or chapter
  // Always call hooks unconditionally, then filter
  const results = useMemo(() => {
    let filtered = allResults;
    if (userId) {
      filtered = filtered.filter((result) => result.userId === userId);
    }
    if (chapter !== undefined) {
      filtered = filtered.filter((result) => result.chapter === chapter);
    }
    return filtered;
  }, [allResults, userId, chapter]);

  const getResultById = useCallback(
    (resultId: string): QuizResult | undefined => {
      return state.quizResults[resultId];
    },
    [state]
  );

  const getResultsByUserId = useCallback(
    (id: string) => {
      return Object.values(state.quizResults).filter((result) => result.userId === id);
    },
    [state]
  );

  const getResultsByChapter = useCallback(
    (ch: number) => {
      return Object.values(state.quizResults).filter((result) => result.chapter === ch);
    },
    [state]
  );

  const addQuizResult = useCallback(
    (quizResult: QuizResult) => {
      dispatch(quizResultActions.add(quizResult));
    },
    [dispatch]
  );

  const updateQuizResult = useCallback(
    (id: string, updates: Partial<QuizResult>) => {
      dispatch(quizResultActions.update(id, updates));
    },
    [dispatch]
  );

  const deleteQuizResult = useCallback(
    (id: string) => {
      dispatch(quizResultActions.delete(id));
    },
    [dispatch]
  );

  const addQuizResults = useCallback(
    (quizResults: QuizResult[]) => {
      dispatch(quizResultActions.addMultiple(quizResults));
    },
    [dispatch]
  );

  const deleteQuizResults = useCallback(
    (ids: string[]) => {
      dispatch(quizResultActions.deleteMultiple(ids));
    },
    [dispatch]
  );

  const setLoading = useCallback(
    (loading: boolean) => {
      dispatch(quizResultActions.setLoading(loading));
    },
    [dispatch]
  );

  const setError = useCallback(
    (error: string | null) => {
      dispatch(quizResultActions.setError(error));
    },
    [dispatch]
  );

  return {
    results,
    allResults,
    loading,
    error,
    getResultById,
    getResultsByUserId,
    getResultsByChapter,
    addQuizResult,
    updateQuizResult,
    deleteQuizResult,
    addQuizResults,
    deleteQuizResults,
    setLoading,
    setError,
  };
};


```


Fixing the TypeScript error in useAuth:


```typescript
import { useCallback, useMemo } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
// @ts-ignore - AuthContext is JavaScript, not TypeScript
import { useAuth as useFirebaseAuth } from '../../AuthContext';
import { useUsers } from './useUsers';
import { useSelectUserById } from '../utils/selectors';
import { useDatabase } from './useDatabase';

/**
 * Enhanced auth hook that combines Firebase auth with local user data
 * This provides a unified interface for authentication and user profile management
 */
export const useAuth = () => {
  // Get Firebase auth state from existing AuthContext
  const firebaseAuth = useFirebaseAuth();
  const { state } = useDatabase();
  const { updateUser } = useUsers();

  // Get local user profile data
  const localUser = useMemo(() => {
    if (!firebaseAuth.user) return null;
    return useSelectUserById(state, firebaseAuth.user.uid);
  }, [firebaseAuth.user, state]);

  // Combined user object with Firebase auth + local profile
  const user = useMemo(() => {
    if (!firebaseAuth.user) return null;
    
    // Merge Firebase user with local user data
    return {
      ...firebaseAuth.user,
      // Override with local preferences if available
      preferences: localUser?.preferences,
      // Local timestamps
      createdAt: localUser?.createdAt,
      updatedAt: localUser?.updatedAt,
    };
  }, [firebaseAuth.user, localUser]);

  // Update user preferences in local state
  const updatePreferences = useCallback(
    (preferences: Partial<import('../types').UserPreferences>) => {
      if (!firebaseAuth.user) {
        throw new Error('User must be authenticated to update preferences');
      }
      
      const currentPreferences = localUser?.preferences || {};
      updateUser(firebaseAuth.user.uid, {
        preferences: {
          ...currentPreferences,
          ...preferences,
        },
      });
    },
    [firebaseAuth.user, localUser, updateUser]
  );

  return {
    // Firebase auth state
    user: firebaseAuth.user,
    loading: firebaseAuth.loading,
    loginWithGoogle: firebaseAuth.loginWithGoogle,
    logout: firebaseAuth.logout,
    
    // Local user profile
    localUser,
    userWithProfile: user,
    
    // Combined state
    isAuthenticated: !!firebaseAuth.user,
    
    // User profile operations
    updatePreferences,
  };
};


```

```typescript
import { useCallback, useMemo } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
// @ts-ignore - AuthContext is JavaScript, not TypeScript
import { useAuth as useFirebaseAuth } from '../../AuthContext';
import { useUsers } from './useUsers';
import { useSelectUserById } from '../utils/selectors';
import { useDatabase } from './useDatabase';

/**
 * Enhanced auth hook that combines Firebase auth with local user data
 * This provides a unified interface for authentication and user profile management
 */
export const useAuth = () => {
  // Get Firebase auth state from existing AuthContext
  const firebaseAuth = useFirebaseAuth();
  const { state } = useDatabase();
  const { updateUser } = useUsers();

  // Get local user profile data
  const localUser = useMemo(() => {
    const user = (firebaseAuth as any).user as FirebaseUser | null;
    if (!user) return null;
    return useSelectUserById(state, user.uid);
  }, [(firebaseAuth as any).user, state]);

  // Combined user object with Firebase auth + local profile
  const user = useMemo(() => {
    if (!firebaseAuth.user) return null;
    
    // Merge Firebase user with local user data
    return {
      ...firebaseAuth.user,
      // Override with local preferences if available
      preferences: localUser?.preferences,
      // Local timestamps
      createdAt: localUser?.createdAt,
      updatedAt: localUser?.updatedAt,
    };
  }, [firebaseAuth.user, localUser]);

  // Update user preferences in local state
  const updatePreferences = useCallback(
    (preferences: Partial<import('../types').UserPreferences>) => {
      if (!firebaseAuth.user) {
        throw new Error('User must be authenticated to update preferences');
      }
      
      const currentPreferences = localUser?.preferences || {};
      updateUser(firebaseAuth.user.uid, {
        preferences: {
          ...currentPreferences,
          ...preferences,
        },
      });
    },
    [firebaseAuth.user, localUser, updateUser]
  );

  return {
    // Firebase auth state
    user: firebaseAuth.user,
    loading: firebaseAuth.loading,
    loginWithGoogle: firebaseAuth.loginWithGoogle,
    logout: firebaseAuth.logout,
    
    // Local user profile
    localUser,
    userWithProfile: user,
    
    // Combined state
    isAuthenticated: !!firebaseAuth.user,
    
    // User profile operations
    updatePreferences,
  };
};


```

```typescript
import { useCallback, useMemo } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
// @ts-ignore - AuthContext is JavaScript, not TypeScript
import { useAuth as useFirebaseAuth } from '../../AuthContext';
import { useUsers } from './useUsers';
import { useSelectUserById } from '../utils/selectors';
import { useDatabase } from './useDatabase';

/**
 * Enhanced auth hook that combines Firebase auth with local user data
 * This provides a unified interface for authentication and user profile management
 */
export const useAuth = () => {
  // Get Firebase auth state from existing AuthContext
  const firebaseAuth = useFirebaseAuth();
  const { state } = useDatabase();
  const { updateUser } = useUsers();

  // Get local user profile data
  const localUser = useMemo(() => {
    const user = (firebaseAuth as any).user as FirebaseUser | null;
    if (!user) return null;
    return useSelectUserById(state, user.uid);
  }, [(firebaseAuth as any).user, state]);

  // Combined user object with Firebase auth + local profile
  const user = useMemo(() => {
    const firebaseUser = (firebaseAuth as any).user as FirebaseUser | null;
    if (!firebaseUser) return null;
    
    // Merge Firebase user with local user data
    return {
      ...firebaseUser,
      // Override with local preferences if available
      preferences: localUser?.preferences,
      // Local timestamps
      createdAt: localUser?.createdAt,
      updatedAt: localUser?.updatedAt,
    };
  }, [(firebaseAuth as any).user, localUser]);

  // Update user preferences in local state
  const updatePreferences = useCallback(
    (preferences: Partial<import('../types').UserPreferences>) => {
      if (!firebaseAuth.user) {
        throw new Error('User must be authenticated to update preferences');
      }
      
      const currentPreferences = localUser?.preferences || {};
      updateUser(firebaseAuth.user.uid, {
        preferences: {
          ...currentPreferences,
          ...preferences,
        },
      });
    },
    [firebaseAuth.user, localUser, updateUser]
  );

  return {
    // Firebase auth state
    user: firebaseAuth.user,
    loading: firebaseAuth.loading,
    loginWithGoogle: firebaseAuth.loginWithGoogle,
    logout: firebaseAuth.logout,
    
    // Local user profile
    localUser,
    userWithProfile: user,
    
    // Combined state
    isAuthenticated: !!firebaseAuth.user,
    
    // User profile operations
    updatePreferences,
  };
};


```

```typescript
import { useCallback, useMemo } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
// @ts-ignore - AuthContext is JavaScript, not TypeScript
import { useAuth as useFirebaseAuth } from '../../AuthContext';
import { useUsers } from './useUsers';
import { useSelectUserById } from '../utils/selectors';
import { useDatabase } from './useDatabase';

/**
 * Enhanced auth hook that combines Firebase auth with local user data
 * This provides a unified interface for authentication and user profile management
 */
export const useAuth = () => {
  // Get Firebase auth state from existing AuthContext
  const firebaseAuth = useFirebaseAuth();
  const { state } = useDatabase();
  const { updateUser } = useUsers();

  // Get local user profile data
  const localUser = useMemo(() => {
    const user = (firebaseAuth as any).user as FirebaseUser | null;
    if (!user) return null;
    return useSelectUserById(state, user.uid);
  }, [(firebaseAuth as any).user, state]);

  // Combined user object with Firebase auth + local profile
  const user = useMemo(() => {
    const firebaseUser = (firebaseAuth as any).user as FirebaseUser | null;
    if (!firebaseUser) return null;
    
    // Merge Firebase user with local user data
    return {
      ...firebaseUser,
      // Override with local preferences if available
      preferences: localUser?.preferences,
      // Local timestamps
      createdAt: localUser?.createdAt,
      updatedAt: localUser?.updatedAt,
    };
  }, [(firebaseAuth as any).user, localUser]);

  // Update user preferences in local state
  const updatePreferences = useCallback(
    (preferences: Partial<import('../types').UserPreferences>) => {
      const firebaseUser = (firebaseAuth as any).user as FirebaseUser | null;
      if (!firebaseUser) {
        throw new Error('User must be authenticated to update preferences');
      }
      
      const currentPreferences = localUser?.preferences || {};
      updateUser(firebaseUser.uid, {
        preferences: {
          ...currentPreferences,
          ...preferences,
        },
      });
    },
    [(firebaseAuth as any).user, localUser, updateUser]
  );

  return {
    // Firebase auth state
    user: firebaseAuth.user,
    loading: firebaseAuth.loading,
    loginWithGoogle: firebaseAuth.loginWithGoogle,
    logout: firebaseAuth.logout,
    
    // Local user profile
    localUser,
    userWithProfile: user,
    
    // Combined state
    isAuthenticated: !!firebaseAuth.user,
    
    // User profile operations
    updatePreferences,
  };
};


```

```typescript
import { useCallback, useMemo } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
// @ts-ignore - AuthContext is JavaScript, not TypeScript
import { useAuth as useFirebaseAuth } from '../../AuthContext';
import { useUsers } from './useUsers';
import { useSelectUserById } from '../utils/selectors';
import { useDatabase } from './useDatabase';

/**
 * Enhanced auth hook that combines Firebase auth with local user data
 * This provides a unified interface for authentication and user profile management
 */
export const useAuth = () => {
  // Get Firebase auth state from existing AuthContext
  const firebaseAuth = useFirebaseAuth();
  const { state } = useDatabase();
  const { updateUser } = useUsers();

  // Get local user profile data
  const localUser = useMemo(() => {
    const user = (firebaseAuth as any).user as FirebaseUser | null;
    if (!user) return null;
    return useSelectUserById(state, user.uid);
  }, [(firebaseAuth as any).user, state]);

  // Combined user object with Firebase auth + local profile
  const user = useMemo(() => {
    const firebaseUser = (firebaseAuth as any).user as FirebaseUser | null;
    if (!firebaseUser) return null;
    
    // Merge Firebase user with local user data
    return {
      ...firebaseUser,
      // Override with local preferences if available
      preferences: localUser?.preferences,
      // Local timestamps
      createdAt: localUser?.createdAt,
      updatedAt: localUser?.updatedAt,
    };
  }, [(firebaseAuth as any).user, localUser]);

  // Update user preferences in local state
  const updatePreferences = useCallback(
    (preferences: Partial<import('../types').UserPreferences>) => {
      const firebaseUser = (firebaseAuth as any).user as FirebaseUser | null;
      if (!firebaseUser) {
        throw new Error('User must be authenticated to update preferences');
      }
      
      const currentPreferences = localUser?.preferences || {};
      updateUser(firebaseUser.uid, {
        preferences: {
          ...currentPreferences,
          ...preferences,
        },
      });
    },
    [(firebaseAuth as any).user, localUser, updateUser]
  );

  const firebaseUser = (firebaseAuth as any).user as FirebaseUser | null;
  
  return {
    // Firebase auth state
    user: firebaseUser,
    loading: (firebaseAuth as any).loading as boolean,
    loginWithGoogle: (firebaseAuth as any).loginWithGoogle as () => Promise<FirebaseUser>,
    logout: (firebaseAuth as any).logout as () => Promise<void>,
    
    // Local user profile
    localUser,
    userWithProfile: user,
    
    // Combined state
    isAuthenticated: !!firebaseUser,
    
    // User profile operations
    updatePreferences,
  };
};


```


Build succeeded. Cleaning up warnings:


```typescriptreact
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { databaseReducer } from './reducers/databaseReducer';
import { initialDatabaseState } from './types/state';
import { DatabaseState, DatabaseAction, User } from './types';
import {
  saveStateToLocalStorage,
  loadStateFromLocalStorage,
  isLocalStorageAvailable,
} from './utils/localStorage';
import { globalActions, userActions } from './reducers/actions';

interface DatabaseContextValue {
  state: DatabaseState;
  dispatch: React.Dispatch<DatabaseAction>;
}

const DatabaseContext = createContext<DatabaseContextValue | null>(null);

interface DatabaseProviderProps {
  children: React.ReactNode;
  firebaseUser?: FirebaseUser | null;
}

/**
 * Database Provider component that manages local state with persistence
 * and integrates with Firebase auth
 */
export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({
  children,
  firebaseUser,
}) => {
  const [state, dispatch] = useReducer(databaseReducer, initialDatabaseState);

  // Hydrate state from localStorage on mount
  useEffect(() => {
    if (!isLocalStorageAvailable()) {
      console.warn('localStorage is not available. State will not persist.');
      dispatch(globalActions.setInitialized(true));
      return;
    }

    const savedState = loadStateFromLocalStorage();
    if (savedState) {
      dispatch(globalActions.hydrate(savedState));
    }
    dispatch(globalActions.setInitialized(true));
  }, []);

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    if (!state.initialized || !isLocalStorageAvailable()) {
      return;
    }

    // Debounce saves to avoid excessive writes
    const timeoutId = setTimeout(() => {
      saveStateToLocalStorage(state);
      dispatch(globalActions.setLastSync(Date.now()));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [state]);

  // Sync Firebase user with local state
  useEffect(() => {
    if (!firebaseUser) {
      // User logged out - clear user data if needed
      // Note: We might want to keep some data, so this is optional
      return;
    }

    // Check if user already exists in local state
    const existingUser = state.users[firebaseUser.uid];
    
    if (!existingUser) {
      // Create new user in local state
      const newUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        preferences: {},
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      dispatch(userActions.add(newUser));
    } else {
      // Update existing user with latest Firebase data
      const updates: Partial<User> = {
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        updatedAt: Date.now(),
      };
      dispatch(userActions.update(firebaseUser.uid, updates));
    }
  }, [firebaseUser, state.users]);

  return (
    <DatabaseContext.Provider value={{ state, dispatch }}>
      {children}
    </DatabaseContext.Provider>
  );
};

/**
 * Hook to access database context
 * @throws Error if used outside DatabaseProvider
 */
export const useDatabase = (): DatabaseContextValue => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within DatabaseProvider');
  }
  return context;
};


```

```typescript
import { useCallback } from 'react';
import { useDatabase } from './useDatabase';
import { Module } from '../types';
import { moduleActions } from '../reducers/actions';
import {
  useSelectAllModules,
  useSelectModuleByChapter,
  useSelectCompletedModules,
} from '../utils/selectors';

/**
 * Hook for module/chapter operations
 */
export const useModules = () => {
  const { state, dispatch } = useDatabase();

  const allModules = useSelectAllModules(state);
  const completedModules = useSelectCompletedModules(state);
  const loading = state.metadata.modules.loading;
  const error = state.metadata.modules.error;

  const getModuleByChapter = useCallback(
    (chapter: number): Module | undefined => {
      return Object.values(state.modules).find((module) => module.chapter === chapter);
    },
    [state]
  );

  const isChapterCompleted = useCallback(
    (chapter: number): boolean => {
      const module = Object.values(state.modules).find((m) => m.chapter === chapter);
      return module?.completed ?? false;
    },
    [state]
  );

  const getCompletedChapterNumbers = useCallback((): number[] => {
    return completedModules.map((module) => module.chapter);
  }, [completedModules]);

  const addModule = useCallback(
    (module: Module) => {
      dispatch(moduleActions.add(module));
    },
    [dispatch]
  );

  const updateModule = useCallback(
    (id: string, updates: Partial<Module>) => {
      dispatch(moduleActions.update(id, updates));
    },
    [dispatch]
  );

  const deleteModule = useCallback(
    (id: string) => {
      dispatch(moduleActions.delete(id));
    },
    [dispatch]
  );

  const addModules = useCallback(
    (modules: Module[]) => {
      dispatch(moduleActions.addMultiple(modules));
    },
    [dispatch]
  );

  const deleteModules = useCallback(
    (ids: string[]) => {
      dispatch(moduleActions.deleteMultiple(ids));
    },
    [dispatch]
  );

  const markChapterCompleted = useCallback(
    (chapter: number) => {
      const moduleId = `module-${chapter}`;
      const existingModule = state.modules[moduleId];
      
      if (existingModule) {
        dispatch(
          moduleActions.update(moduleId, {
            completed: true,
            completedAt: Date.now(),
            lastAccessedAt: Date.now(),
          })
        );
      } else {
        const newModule: Module = {
          id: moduleId,
          chapter,
          completed: true,
          completedAt: Date.now(),
          lastAccessedAt: Date.now(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        dispatch(moduleActions.add(newModule));
      }
    },
    [state, dispatch]
  );

  const markChapterIncomplete = useCallback(
    (chapter: number) => {
      const moduleId = `module-${chapter}`;
      const existingModule = state.modules[moduleId];
      
      if (existingModule) {
        dispatch(
          moduleActions.update(moduleId, {
            completed: false,
            completedAt: undefined,
            lastAccessedAt: Date.now(),
          })
        );
      }
    },
    [state, dispatch]
  );

  const setLoading = useCallback(
    (loading: boolean) => {
      dispatch(moduleActions.setLoading(loading));
    },
    [dispatch]
  );

  const setError = useCallback(
    (error: string | null) => {
      dispatch(moduleActions.setError(error));
    },
    [dispatch]
  );

  return {
    modules: allModules,
    completedModules,
    completedChapterNumbers: getCompletedChapterNumbers(),
    loading,
    error,
    getModuleByChapter,
    isChapterCompleted,
    addModule,
    updateModule,
    deleteModule,
    addModules,
    deleteModules,
    markChapterCompleted,
    markChapterIncomplete,
    setLoading,
    setError,
  };
};


```

```typescript
import { useCallback } from 'react';
import { useDatabase } from './useDatabase';
import { Module } from '../types';
import { moduleActions } from '../reducers/actions';
import {
  useSelectAllModules,
  useSelectCompletedModules,
} from '../utils/selectors';

/**
 * Hook for module/chapter operations
 */
export const useModules = () => {
  const { state, dispatch } = useDatabase();

  const allModules = useSelectAllModules(state);
  const completedModules = useSelectCompletedModules(state);
  const loading = state.metadata.modules.loading;
  const error = state.metadata.modules.error;

  const getModuleByChapter = useCallback(
    (chapter: number): Module | undefined => {
      return Object.values(state.modules).find((module) => module.chapter === chapter);
    },
    [state]
  );

  const isChapterCompleted = useCallback(
    (chapter: number): boolean => {
      const module = Object.values(state.modules).find((m) => m.chapter === chapter);
      return module?.completed ?? false;
    },
    [state]
  );

  const getCompletedChapterNumbers = useCallback((): number[] => {
    return completedModules.map((module) => module.chapter);
  }, [completedModules]);

  const addModule = useCallback(
    (module: Module) => {
      dispatch(moduleActions.add(module));
    },
    [dispatch]
  );

  const updateModule = useCallback(
    (id: string, updates: Partial<Module>) => {
      dispatch(moduleActions.update(id, updates));
    },
    [dispatch]
  );

  const deleteModule = useCallback(
    (id: string) => {
      dispatch(moduleActions.delete(id));
    },
    [dispatch]
  );

  const addModules = useCallback(
    (modules: Module[]) => {
      dispatch(moduleActions.addMultiple(modules));
    },
    [dispatch]
  );

  const deleteModules = useCallback(
    (ids: string[]) => {
      dispatch(moduleActions.deleteMultiple(ids));
    },
    [dispatch]
  );

  const markChapterCompleted = useCallback(
    (chapter: number) => {
      const moduleId = `module-${chapter}`;
      const existingModule = state.modules[moduleId];
      
      if (existingModule) {
        dispatch(
          moduleActions.update(moduleId, {
            completed: true,
            completedAt: Date.now(),
            lastAccessedAt: Date.now(),
          })
        );
      } else {
        const newModule: Module = {
          id: moduleId,
          chapter,
          completed: true,
          completedAt: Date.now(),
          lastAccessedAt: Date.now(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        dispatch(moduleActions.add(newModule));
      }
    },
    [state, dispatch]
  );

  const markChapterIncomplete = useCallback(
    (chapter: number) => {
      const moduleId = `module-${chapter}`;
      const existingModule = state.modules[moduleId];
      
      if (existingModule) {
        dispatch(
          moduleActions.update(moduleId, {
            completed: false,
            completedAt: undefined,
            lastAccessedAt: Date.now(),
          })
        );
      }
    },
    [state, dispatch]
  );

  const setLoading = useCallback(
    (loading: boolean) => {
      dispatch(moduleActions.setLoading(loading));
    },
    [dispatch]
  );

  const setError = useCallback(
    (error: string | null) => {
      dispatch(moduleActions.setError(error));
    },
    [dispatch]
  );

  return {
    modules: allModules,
    completedModules,
    completedChapterNumbers: getCompletedChapterNumbers(),
    loading,
    error,
    getModuleByChapter,
    isChapterCompleted,
    addModule,
    updateModule,
    deleteModule,
    addModules,
    deleteModules,
    markChapterCompleted,
    markChapterIncomplete,
    setLoading,
    setError,
  };
};


```

```typescript
import { DatabaseState } from '../types';

const STORAGE_KEY = 'gogy_database_state';
const STORAGE_VERSION_KEY = 'gogy_database_version';
const CURRENT_VERSION = '1.0.0';

/**
 * Save state to localStorage with error handling
 */
export const saveStateToLocalStorage = (state: DatabaseState): void => {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
    localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
  } catch (error) {
    // Handle quota exceeded or other storage errors
    if (error instanceof Error) {
      if (error.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded. Some data may not be saved.');
      } else {
        console.error('Error saving to localStorage:', error);
      }
    }
  }
};

/**
 * Load state from localStorage
 */
export const loadStateFromLocalStorage = (): Partial<DatabaseState> | null => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (serialized === null) {
      return null;
    }
    
    const state = JSON.parse(serialized) as Partial<DatabaseState>;
    
    // Check version for potential migrations
    const storedVersion = localStorage.getItem(STORAGE_VERSION_KEY);
    if (storedVersion !== CURRENT_VERSION) {
      console.warn(`State version mismatch. Stored: ${storedVersion}, Current: ${CURRENT_VERSION}`);
      // Future: Add migration logic here
    }
    
    return state;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};

/**
 * Clear state from localStorage
 */
export const clearStateFromLocalStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_VERSION_KEY);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

/**
 * Check if localStorage is available
 */
export const isLocalStorageAvailable = (): boolean => {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};


```


Build succeeded. The dependency warnings are acceptable; we're already depending on the specific state slices. Verifying everything is complete:



## Implementation complete

### 1. TypeScript setup
- Installed TypeScript and type definitions
- Created `tsconfig.json` for mixed JS/TS support

### 2. Type definitions (`database/types/`)
- **entities.ts**: User, QuizResult, Module interfaces
- **state.ts**: Normalized DatabaseState with action types
- **index.ts**: Centralized exports

### 3. Database reducer (`database/reducers/`)
- **databaseReducer.ts**: CRUD operations, batch operations, optimistic updates
- **actions.ts**: Type-safe action creators for all operations

### 4. Persistence layer (`database/utils/`)
- **localStorage.ts**: Save/load state with versioning and error handling

### 5. Database context (`database/DatabaseContext.tsx`)
- Context Provider with Firebase auth integration
- Automatic state hydration from localStorage
- State persistence on changes
- Firebase user sync with local state

### 6. Custom hooks (`database/hooks/`)
- **useDatabase**: Main database access hook
- **useUsers**: User CRUD operations
- **useQuizResults**: Quiz result management
- **useModules**: Module/chapter management with completion tracking
- **useAuth**: Enhanced auth hook combining Firebase + local state
- **index.ts**: Convenient exports

### 7. Selectors (`database/utils/selectors.ts`)
- Memoized selectors for efficient data access
- Helper functions and hooks for common queries

### 8. App integration
- Updated `App.js` to use DatabaseProvider
- Migrated `completedModules` state to database manager
- Quiz results now saved to database on submission
- Maintains backward compatibility

### Features
- Normalized state structure (entities by ID)
- localStorage persistence with automatic hydration
- Firebase auth integration
- TypeScript type safety
- Memoized selectors for performance
- Batch operations support
- Loading/error states per entity type
- Optimistic updates pattern

The build compiles successfully with only minor warnings (unused imports and dependency array suggestions). The database manager is ready to use.

