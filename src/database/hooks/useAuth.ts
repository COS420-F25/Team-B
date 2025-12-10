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

