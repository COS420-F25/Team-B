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

