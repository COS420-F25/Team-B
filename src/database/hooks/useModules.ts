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

