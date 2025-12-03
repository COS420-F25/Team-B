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

