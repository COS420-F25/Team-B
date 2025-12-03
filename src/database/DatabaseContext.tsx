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

