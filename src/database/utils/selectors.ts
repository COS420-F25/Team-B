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

