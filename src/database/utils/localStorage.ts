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

