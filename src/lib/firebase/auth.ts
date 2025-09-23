import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  createUserWithEmailAndPassword,
  User,
  getAuth,
} from 'firebase/auth';
import { app } from './config';
import type { LoginFormValues, RegisterFormValues } from '@/lib/schema';
import { FirebaseError } from 'firebase/app';
import { createUserProfile } from './firestore';

export const auth = getAuth(app);

export async function signIn({ email, password }: LoginFormValues) {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw error as FirebaseError;
  }
}

export async function signUp({ email, password }: RegisterFormValues) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { user } = userCredential;
    // Create a user profile document in Firestore
    await createUserProfile(user.uid, { email });
    return userCredential;
  } catch (error) {
    throw error as FirebaseError;
  }
}

export async function signOut() {
  return firebaseSignOut(auth);
}

export function onAuthStateChanged(callback: (user: User | null) => void) {
  return firebaseOnAuthStateChanged(auth, callback);
}
