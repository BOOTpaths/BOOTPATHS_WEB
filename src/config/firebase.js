/*
 * Copyright (c) 2026 BOOTpaths. All Rights Reserved.
 *
 * This software and its source code are the confidential and proprietary property of BOOTpaths. 
 * Unauthorized copying, modifying, cloning, distribution, or downloading of this file, via any medium, 
 * is strictly prohibited without express written permission from BOOTpaths.
 */
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: (import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDjzFMBlwAoN3y6KOUPWHbAD7w4xZEJGq8").trim(),
  authDomain: (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "bootpaths-4b877.firebaseapp.com").trim(),
  databaseURL: (import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://bootpaths-4b877-default-rtdb.asia-southeast1.firebasedatabase.app").trim(),
  projectId: (import.meta.env.VITE_FIREBASE_PROJECT_ID || "bootpaths-4b877").trim(),
  storageBucket: (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "bootpaths-4b877.firebasestorage.app").trim(),
  messagingSenderId: (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "889967197840").trim(),
  appId: (import.meta.env.VITE_FIREBASE_APP_ID || "1:889967197840:web:6012b652e68d25cb866215").trim(),
  measurementId: (import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-9GSGSGJ7N0").trim()
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export default app;