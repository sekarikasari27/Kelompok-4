import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './services/firebaseConfig';

// Inisialisasi Firebase App (Cegah inisialisasi ganda jika sudah ada)
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inisialisasi Layanan Firebase Auth & Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;

