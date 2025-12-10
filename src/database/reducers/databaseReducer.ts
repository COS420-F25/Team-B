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

