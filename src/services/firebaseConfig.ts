// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAvsi0R9uhefsFI2Hb6PsXugpb3tN_Vh3Q",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "lajuku.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "lajuku",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "lajuku.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "145270132230",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:145270132230:web:d6a3614549decda11b7d87",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-BVEK2YX37P"
};

// Alias agar kompatibel dengan seluruh komponen
export const FIREBASE_CONFIG = firebaseConfig;

/**
 * Mengecek apakah konfigurasi Firebase telah diisi dengan kredensial riil
 */
export function isFirebaseConfigured(): boolean {
  return (
    Boolean(firebaseConfig.apiKey) &&
    !firebaseConfig.apiKey.includes("GANTI_DENGAN") &&
    firebaseConfig.apiKey.trim().length > 15
  );
}
