import { db, ensureAuth } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface PinUser {
  pin: string;
  createdAt: number;
}

// Cache en mémoire pour réduire les lectures Firestore
const firestoreCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Générer un PIN aléatoire de 6 chiffres
export function generatePin(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Charger les données depuis Firestore avec un PIN (avec cache)
export async function loadFromCloudWithPin(pin: string, useCache = true) {
  // Vérifier le cache d'abord (économiser les lectures Firestore)
  if (useCache) {
    const cached = firestoreCache.get(pin);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('📦 Données chargées depuis le cache (0 lecture Firestore)');
      return cached.data;
    }
  }

  await ensureAuth();
  const docRef = doc(db, 'collections', pin);
  const snap = await getDoc(docRef);

  if (snap.exists()) {
    const data = snap.data();
    // Mettre en cache
    firestoreCache.set(pin, { data, timestamp: Date.now() });
    console.log('📥 Données chargées depuis Firestore (1 lecture)');
    return data;
  }

  return null;
}

// Invalider le cache pour un PIN
export function invalidateCache(pin: string) {
  firestoreCache.delete(pin);
}

// Sauvegarder les données vers Firestore avec un PIN
export async function saveToCloudWithPin(pin: string, data: Record<string, unknown>) {
  await ensureAuth();
  await setDoc(doc(db, 'collections', pin), {
    ...data,
    lastSync: Date.now(),
  }, { merge: true });
}

// Vérifier si un PIN existe déjà
export async function checkPinExists(pin: string): Promise<boolean> {
  await ensureAuth();
  const docRef = doc(db, 'collections', pin);
  const snap = await getDoc(docRef);
  return snap.exists();
}
