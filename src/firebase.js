// File inisialisasi Firebase untuk Proyek LajuKu
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './services/firebaseConfig';

// Inisialisasi Firebase App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inisialisasi Firebase Auth & Cloud Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;

