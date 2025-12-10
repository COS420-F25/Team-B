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

