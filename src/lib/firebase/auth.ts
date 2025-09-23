import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  createUserWithEmailAndPassword,
  User,
} from 'firebase/auth';
import { auth } from './config';
import type { LoginFormValues, RegisterFormValues } from '@/lib/schema';

export async function signIn({ email, password }: LoginFormValues) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signUp({ email, password }: RegisterFormValues) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function signOut() {
  return firebaseSignOut(auth);
}

export function onAuthStateChanged(callback: (user: User | null) => void) {
  return firebaseOnAuthStateChanged(auth, callback);
}
