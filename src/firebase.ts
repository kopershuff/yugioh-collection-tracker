import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAIfyj8uRoY_75Cqxv-d-z7wFyIxZXwGYQ",
  authDomain: "yu-gi-oh-checklist.firebaseapp.com",
  projectId: "yu-gi-oh-checklist",
  storageBucket: "yu-gi-oh-checklist.firebasestorage.app",
  messagingSenderId: "1021281584814",
  appId: "1:1021281584814:web:1d2b428731fc49beae4f3f",
  measurementId: "G-NW9NKHCHMD",
};

const APP_NAME = 'yugioh-checklist';
export const app = getApps().find(a => a.name === APP_NAME) ?? initializeApp(firebaseConfig, APP_NAME);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Fonction pour s'authentifier anonymement (requis pour Firestore)
export async function ensureAuth() {
  if (!auth.currentUser) {
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.error('Erreur d\'authentification anonyme:', error);
      throw error;
    }
  }
}
