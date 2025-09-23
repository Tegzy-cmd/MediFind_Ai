import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  createUserWithEmailAndPassword,
  User,
} from 'firebase/auth';
import { auth } from './config';
import type { LoginFormValues, RegisterFormValues } from '@/lib/schema';
import { FirebaseError } from 'firebase/app';

export async function signIn({ email, password }: LoginFormValues) {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw error as FirebaseError;
  }
}

export async function signUp({ email, password }: RegisterFormValues) {
  try {
    return await createUserWithEmailAndPassword(auth, email, password);
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
