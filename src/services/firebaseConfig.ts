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
  apiKey: "AIzaSyAvsi0R9uhefsFI2Hb6PsXugpb3tN_Vh3Q",
  authDomain: "lajuku.firebaseapp.com",
  projectId: "lajuku",
  storageBucket: "lajuku.firebasestorage.app",
  messagingSenderId: "145270132230",
  appId: "1:145270132230:web:d6a3614549decda11b7d87",
  measurementId: "G-BVEK2YX37P"
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
