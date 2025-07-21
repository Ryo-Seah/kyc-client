import { auth } from '../firebase'; 
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth';

/**
 * Handles Google Sign-In with a pop-up.
 */
export const handleGoogleSignIn = async (): Promise<User> => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Unknown error during Google sign-in');
    }
  }
};

/**
 * Handles user sign-out.
 */
export const handleSignOut = async () => {
  await signOut(auth);
};

/**
 * Subscribes to authentication state changes.
 */
export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};