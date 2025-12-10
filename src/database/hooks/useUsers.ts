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

