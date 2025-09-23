import { getApp, getApps, initializeApp } from 'firebase/app';

export const firebaseConfig = {
  apiKey: "AIzaSyAoAz5EDSgmFMGL4Gvubu6sRQCZa8t7k_c",
  authDomain: "studio-4884956211-8d085.firebaseapp.com",
  projectId: "studio-4884956211-8d085",
  storageBucket: "studio-4884956211-8d085.appspot.com",
  messagingSenderId: "360937385656",
  appId: "1:360937385656:web:e64b197b8160cb1e320e4d"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { app };
