import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoKeyForBOOTpathsEnvironmentVar01",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "bootpaths-app.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "bootpaths-app",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "bootpaths-app.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "109283746501",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:109283746501:web:a1b2c3d4e5f6g7h8i9j0"
};

// Initialize Firebase once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
