import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  type User as FirebaseUser
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { isFirebaseConfigured } from './firebaseConfig';
import type { Pengguna, PeranPengguna, StatusAuth, SiswaProgresNilai } from '../types/auth';
import type { Progres } from '../utils/progres';

const KUNCI_AUTH_SESSION = 'lajuku:auth_session';
const KUNCI_DAFTAR_PENGGUNA = 'lajuku:registered_users';
const KUNCI_PROGRES_PREFIX = 'lajuku:progres:';

// Akun bawaan (demo) untuk kemudahan pengujian jika offline atau akun belum dibuat di Firebase
const AKUN_DEMO: Record<string, { nama: string; pass: string; peran: 'siswa' | 'guru' }> = {
  'siswa@lajuku.id': {
    nama: 'Budi Santoso',
    pass: 'siswa123',
    peran: 'siswa'
  },
  'guru@lajuku.id': {
    nama: 'Dra. Siti Rahmawati, M.Pd.',
    pass: 'guru123',
    peran: 'guru'
  }
};

// Data simulasi awal siswa untuk dashboard guru
export const DATA_SIMULASI_SISWA: SiswaProgresNilai[] = [
  {
    id: 'user-01',
    nama: 'Ahmad Fauzi',
    email: 'ahmad.fauzi@sekolah.sch.id',
    modul1: 100,
    modul2: 80,
    modul3: 100,
    rataRata: 93,
    terakhirAktivitas: '10 menit lalu'
  },
  {
    id: 'user-02',
    nama: 'Bunga Citra',
    email: 'bunga.c@sekolah.sch.id',
    modul1: 80,
    modul2: 100,
    modul3: null,
    rataRata: 90,
    terakhirAktivitas: '1 jam lalu'
  },
  {
    id: 'user-03',
    nama: 'Dimas Anggara',
    email: 'dimas.a@sekolah.sch.id',
    modul1: 60,
    modul2: 60,
    modul3: 80,
    rataRata: 67,
    terakhirAktivitas: 'Kemarin'
  },
  {
    id: 'user-04',
    nama: 'Nabila Putri',
    email: 'nabila.p@sekolah.sch.id',
    modul1: 100,
    modul2: null,
    modul3: null,
    rataRata: 100,
    terakhirAktivitas: '3 hari lalu'
  }
];

export const STATUS_TAMU_DEFAULT: StatusAuth = {
  terautentikasi: false,
  peran: 'tamu',
  pengguna: null
};

/**
 * Menerjemahkan kode error Firebase Auth ke dalam bahasa Indonesia yang ramah pengguna
 */
function terjemahkanErrorFirebase(code: string, fallbackPesan: string): string {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Email atau kata sandi salah. Silakan periksa kembali.';
    case 'auth/email-already-in-use':
      return 'Alamat email ini sudah terdaftar. Silakan pilih tab "Masuk".';
    case 'auth/weak-password':
      return 'Kata sandi terlalu lemah (minimal 6 karakter).';
    case 'auth/invalid-email':
      return 'Format alamat email tidak valid.';
    case 'auth/user-disabled':
      return 'Akun pengguna ini telah dinonaktifkan oleh administrator.';
    case 'auth/network-request-failed':
      return 'Gagal terhubung ke server Firebase. Periksa koneksi internet Anda.';
    case 'auth/operation-not-allowed':
      return 'Metode Email/Password belum diaktifkan di Firebase Console (Menu Authentication -> Sign-in method).';
    case 'auth/too-many-requests':
      return 'Terlalu banyak percobaan gagal. Silakan coba beberapa saat lagi.';
    default:
      return fallbackPesan;
  }
}

/**
 * Membaca status autentikasi dari sesi yang tersimpan
 */
export function ambilStatusAuth(): StatusAuth {
  try {
    const raw = window.localStorage.getItem(KUNCI_AUTH_SESSION);
    if (!raw) return STATUS_TAMU_DEFAULT;

    const data = JSON.parse(raw) as StatusAuth;
    if (data && data.pengguna && (data.peran === 'siswa' || data.peran === 'guru')) {
      return {
        terautentikasi: true,
        peran: data.peran,
        pengguna: data.pengguna
      };
    }
    return STATUS_TAMU_DEFAULT;
  } catch {
    return STATUS_TAMU_DEFAULT;
  }
}

/**
 * Simpan status sesi aktif ke localStorage
 */
function simpanSesi(status: StatusAuth): void {
  try {
    window.localStorage.setItem(KUNCI_AUTH_SESSION, JSON.stringify(status));
  } catch {
    // Abaikan jika diblokir
  }
}

/**
 * Masuk sebagai Tamu (Siswa tanpa login)
 * Data tidak tersimpan di Firestore atau localStorage
 */
export function masukSebagaiTamu(): StatusAuth {
  try {
    window.localStorage.removeItem(KUNCI_AUTH_SESSION);
  } catch {
    // Abaikan
  }
  return STATUS_TAMU_DEFAULT;
}

/**
 * Mendapatkan profil peran pengguna dari Firestore atau metadata lokal
 */
async function dapatkanPeranPengguna(uid: string, peranDefault: 'siswa' | 'guru'): Promise<'siswa' | 'guru'> {
  try {
    const userDocRef = doc(db, 'users', uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data.peran === 'siswa' || data.peran === 'guru') {
        return data.peran;
      }
    }
  } catch (err) {
    console.warn('[Firebase] Tidak dapat membaca dokumen user di Firestore:', err);
  }
  return peranDefault;
}

/**
 * Autentikasi Masuk dengan Akun Email (Firebase Authentication)
 */
export async function masukDenganEmail(
  email: string,
  pass: string,
  peranTarget: 'siswa' | 'guru'
): Promise<{ sukses: boolean; pesan?: string; status?: StatusAuth }> {
  const emailNormal = email.trim().toLowerCase();

  // Validasi format email dasar
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(emailNormal)) {
    return { sukses: false, pesan: 'Format alamat email tidak valid.' };
  }

  if (!pass || pass.length < 4) {
    return { sukses: false, pesan: 'Kata sandi minimal 4 karakter.' };
  }

  // 1. Coba login melalui Firebase Authentication jika terhubung
  if (isFirebaseConfigured()) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, emailNormal, pass);
      const fbUser = userCredential.user;

      // Ambil peran pengguna dari Firestore (atau gunakan peranTarget)
      const peranAktif = await dapatkanPeranPengguna(fbUser.uid, peranTarget);
      const namaPengguna = fbUser.displayName || emailNormal.split('@')[0];

      const pengguna: Pengguna = {
        id: fbUser.uid,
        nama: namaPengguna,
        email: fbUser.email || emailNormal,
        peran: peranAktif
      };

      const status: StatusAuth = {
        terautentikasi: true,
        peran: peranAktif,
        pengguna
      };

      simpanSesi(status);

      // Jika peran siswa, coba ambil progres terakhir dari Firestore untuk di-cache
      if (peranAktif === 'siswa') {
        await sinkronkanProgresDariFirebase(fbUser.uid);
      }

      return { sukses: true, status };
    } catch (err: unknown) {
      const fbError = err as { code?: string; message?: string };
      console.warn('[Firebase Auth] Gagal masuk via Firebase:', fbError.code, fbError.message);

      // Jika akun adalah salah satu akun Demo, berikan akses fallback demo
      if (AKUN_DEMO[emailNormal] && AKUN_DEMO[emailNormal].pass === pass) {
        const demo = AKUN_DEMO[emailNormal];
        const pengguna: Pengguna = {
          id: `demo-${demo.peran}`,
          nama: demo.nama,
          email: emailNormal,
          peran: demo.peran
        };
        const status: StatusAuth = {
          terautentikasi: true,
          peran: demo.peran,
          pengguna
        };
        simpanSesi(status);
        return { sukses: true, status };
      }

      const pesanUser = terjemahkanErrorFirebase(
        fbError.code || '',
        'Gagal masuk. Periksa kembali email dan kata sandi Anda.'
      );
      return { sukses: false, pesan: pesanUser };
    }
  }

  // 2. Fallback mode offline / akun demo
  if (AKUN_DEMO[emailNormal]) {
    const demo = AKUN_DEMO[emailNormal];
    if (demo.pass !== pass) {
      return { sukses: false, pesan: 'Kata sandi akun salah.' };
    }
    const pengguna: Pengguna = {
      id: `demo-${demo.peran}`,
      nama: demo.nama,
      email: emailNormal,
      peran: demo.peran
    };
    const status: StatusAuth = {
      terautentikasi: true,
      peran: demo.peran,
      pengguna
    };
    simpanSesi(status);
    return { sukses: true, status };
  }

  // Akun lokal jika disimpan sebelumnya
  const daftarAkun = ambilDaftarPenggunaLokal();
  const akunTersimpan = daftarAkun[emailNormal];
  if (akunTersimpan) {
    if (akunTersimpan.pass !== pass) {
      return { sukses: false, pesan: 'Kata sandi akun salah.' };
    }
    const pengguna: Pengguna = {
      id: akunTersimpan.id,
      nama: akunTersimpan.nama,
      email: akunTersimpan.email,
      peran: akunTersimpan.peran
    };
    const status: StatusAuth = {
      terautentikasi: true,
      peran: akunTersimpan.peran,
      pengguna
    };
    simpanSesi(status);
    return { sukses: true, status };
  }

  return {
    sukses: false,
    pesan: 'Akun belum terdaftar. Silakan pilih tab "Daftar Akun Baru" terlebih dahulu.'
  };
}

/**
 * Pendaftaran akun baru dengan Email & Password ke Firebase Authentication
 */
export async function daftarDenganEmail(
  nama: string,
  email: string,
  pass: string,
  peran: 'siswa' | 'guru'
): Promise<{ sukses: boolean; pesan?: string; status?: StatusAuth }> {
  const emailNormal = email.trim().toLowerCase();

  if (!nama || nama.trim().length < 2) {
    return { sukses: false, pesan: 'Mohon masukkan nama lengkap Anda.' };
  }

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(emailNormal)) {
    return { sukses: false, pesan: 'Format alamat email tidak valid.' };
  }

  if (!pass || pass.length < 6) {
    return { sukses: false, pesan: 'Kata sandi minimal 6 karakter sesuai standar Firebase.' };
  }

  // 1. Daftarkan ke Firebase Authentication
  if (isFirebaseConfigured()) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, emailNormal, pass);
      const fbUser = userCredential.user;

      // Update Nama Pengguna di Firebase Profile
      await updateProfile(fbUser, { displayName: nama.trim() });

      // Simpan data profil ke koleksi "users/{uid}" di Cloud Firestore
      try {
        await setDoc(doc(db, 'users', fbUser.uid), {
          uid: fbUser.uid,
          nama: nama.trim(),
          email: emailNormal,
          peran,
          dibuatPada: new Date().toISOString()
        }, { merge: true });

        // Jika peran adalah siswa, inisialisasi progres kosong di Firestore
        if (peran === 'siswa') {
          await setDoc(doc(db, 'progres', fbUser.uid), {
            modulDibuka: [],
            skorKuis: {},
            terakhirAktivitas: new Date().toISOString()
          }, { merge: true });
        }
      } catch (errDoc) {
        console.warn('[Firestore] Tidak dapat menulis dokumen profil (mungkin aturan Firestore belum disetel publik):', errDoc);
      }

      const pengguna: Pengguna = {
        id: fbUser.uid,
        nama: nama.trim(),
        email: fbUser.email || emailNormal,
        peran
      };

      const status: StatusAuth = {
        terautentikasi: true,
        peran,
        pengguna
      };

      simpanSesi(status);
      return { sukses: true, status };
    } catch (err: unknown) {
      const fbError = err as { code?: string; message?: string };
      console.error('[Firebase Register Error]', fbError.code, fbError.message);
      const pesanUser = terjemahkanErrorFirebase(
        fbError.code || '',
        'Gagal mendaftarkan akun. Silakan periksa kembali data Anda.'
      );
      return { sukses: false, pesan: pesanUser };
    }
  }

  // 2. Mode fallback lokal jika Firebase belum aktif
  const akunBaru = {
    id: `user-${Date.now()}`,
    nama: nama.trim(),
    email: emailNormal,
    pass,
    peran
  };

  simpanPenggunaLokal(akunBaru);

  const pengguna: Pengguna = {
    id: akunBaru.id,
    nama: akunBaru.nama,
    email: akunBaru.email,
    peran: akunBaru.peran
  };

  const status: StatusAuth = {
    terautentikasi: true,
    peran,
    pengguna
  };

  simpanSesi(status);
  return { sukses: true, status };
}

/**
 * Keluar / Logout dari sesi Firebase dan Sesi Lokal
 */
export async function keluarSesi(): Promise<StatusAuth> {
  try {
    if (isFirebaseConfigured()) {
      await signOut(auth);
    }
  } catch (err) {
    console.warn('[Firebase Auth] Gagal signOut:', err);
  }

  try {
    window.localStorage.removeItem(KUNCI_AUTH_SESSION);
  } catch {
    // Abaikan
  }
  return STATUS_TAMU_DEFAULT;
}

/**
 * Berlangganan perubahan status autentikasi Firebase secara real-time
 */
export function pantauStatusAuthFirebase(
  onPerubahan: (status: StatusAuth) => void
): () => void {
  if (!isFirebaseConfigured()) {
    return () => {};
  }

  return onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
    if (fbUser) {
      const sesiSekarang = ambilStatusAuth();
      const peranAktif = sesiSekarang.pengguna?.id === fbUser.uid
        ? sesiSekarang.peran
        : await dapatkanPeranPengguna(fbUser.uid, 'siswa');

      const pengguna: Pengguna = {
        id: fbUser.uid,
        nama: fbUser.displayName || sesiSekarang.pengguna?.nama || fbUser.email?.split('@')[0] || 'Pengguna',
        email: fbUser.email || '',
        peran: peranAktif === 'guru' ? 'guru' : 'siswa'
      };

      const statusBaru: StatusAuth = {
        terautentikasi: true,
        peran: pengguna.peran,
        pengguna
      };

      simpanSesi(statusBaru);
      onPerubahan(statusBaru);
    }
  });
}

/**
 * Mengambil progres belajar pengguna.
 * PENTING: Jika peran adalah 'tamu' (siswa tanpa login), kembalikan progres kosong
 * agar data tidak diambil dari penyimpanan permanen.
 */
export function ambilProgresBerdasarkanPeran(userId: string | null, peran: PeranPengguna): Progres {
  // Siswa tanpa login (tamu): datanya tidak tersimpan
  if (peran === 'tamu' || !userId) {
    return { modulDibuka: [], skorKuis: {} };
  }

  try {
    const kunci = `${KUNCI_PROGRES_PREFIX}${userId}`;
    const raw = window.localStorage.getItem(kunci);
    if (!raw) return { modulDibuka: [], skorKuis: {} };
    const data = JSON.parse(raw) as Partial<Progres>;
    return {
      modulDibuka: Array.isArray(data.modulDibuka) ? data.modulDibuka : [],
      skorKuis: data.skorKuis && typeof data.skorKuis === 'object' ? data.skorKuis : {}
    };
  } catch {
    return { modulDibuka: [], skorKuis: {} };
  }
}

/**
 * Menyimpan progres belajar pengguna.
 * ATURAN UTAMA:
 * - Jika peran adalah 'tamu' (siswa tanpa login): JANGAN PERNAH SIMPAN KE LOCALSTORAGE ATAU FIREBASE.
 * - Jika peran adalah 'siswa' (login email): Simpan ke penyimpanan lokal dan Cloud Firestore.
 */
export function simpanProgresBerdasarkanPeran(
  userId: string | null,
  peran: PeranPengguna,
  progres: Progres
): void {
  // Jika siswa tanpa login (tamu): data tidak disimpan sama sekali
  if (peran === 'tamu' || !userId) {
    return;
  }

  // Jika siswa terdaftar dengan email: simpan ke penyimpanan lokal
  try {
    const kunci = `${KUNCI_PROGRES_PREFIX}${userId}`;
    window.localStorage.setItem(kunci, JSON.stringify(progres));

    // Sinkronisasi ke Cloud Firestore
    if (isFirebaseConfigured()) {
      sinkronkanProgresKeFirebase(userId, progres);
    }
  } catch {
    // Abaikan jika penyimpanan diblokir
  }
}

/**
 * Sinkronisasi progres belajar siswa ke Cloud Firestore di koleksi "progres/{uid}"
 */
export async function sinkronkanProgresKeFirebase(userId: string, progres: Progres): Promise<void> {
  if (!isFirebaseConfigured() || !userId || userId.startsWith('demo-')) return;

  try {
    const progresRef = doc(db, 'progres', userId);
    await setDoc(progresRef, {
      modulDibuka: progres.modulDibuka,
      skorKuis: progres.skorKuis,
      terakhirAktivitas: new Date().toISOString()
    }, { merge: true });
    console.info(`[Firebase Firestore] Berhasil menyelaraskan progres siswa (${userId})`);
  } catch (err) {
    console.warn('[Firebase Firestore] Gagal menyelaraskan progres ke Firestore:', err);
  }
}

/**
 * Membaca progres belajar dari Cloud Firestore dan menyimpannya ke cache lokal
 */
export async function sinkronkanProgresDariFirebase(userId: string): Promise<Progres | null> {
  if (!isFirebaseConfigured() || !userId || userId.startsWith('demo-')) return null;

  try {
    const progresRef = doc(db, 'progres', userId);
    const snap = await getDoc(progresRef);
    if (snap.exists()) {
      const data = snap.data();
      const hasil: Progres = {
        modulDibuka: Array.isArray(data.modulDibuka) ? data.modulDibuka : [],
        skorKuis: data.skorKuis && typeof data.skorKuis === 'object' ? data.skorKuis : {}
      };
      // Perbarui cache lokal
      window.localStorage.setItem(`${KUNCI_PROGRES_PREFIX}${userId}`, JSON.stringify(hasil));
      return hasil;
    }
  } catch (err) {
    console.warn('[Firebase Firestore] Gagal mengambil data progres dari Firestore:', err);
  }
  return null;
}

/**
 * Membaca seluruh data siswa dari Cloud Firestore untuk ditampilkan di Dashboard Guru
 */
export async function ambilDataSemuaSiswaDariFirebase(): Promise<SiswaProgresNilai[]> {
  if (!isFirebaseConfigured()) return DATA_SIMULASI_SISWA;

  try {
    const usersCol = collection(db, 'users');
    const userSnapshot = await getDocs(usersCol);

    const hasil: SiswaProgresNilai[] = [];

    for (const userDoc of userSnapshot.docs) {
      const uData = userDoc.data();
      if (uData.peran === 'siswa') {
        // Ambil data progres kuis
        const pDoc = await getDoc(doc(db, 'progres', userDoc.id));
        const pData = pDoc.exists() ? pDoc.data() : null;
        const skorKuis = pData?.skorKuis || {};

        const m1 = skorKuis['modul-1'] !== undefined ? Number(skorKuis['modul-1']) : null;
        const m2 = skorKuis['modul-2'] !== undefined ? Number(skorKuis['modul-2']) : null;
        const m3 = skorKuis['modul-3'] !== undefined ? Number(skorKuis['modul-3']) : null;

        const nilaiValid = [m1, m2, m3].filter((n): n is number => n !== null);
        const rataRata = nilaiValid.length > 0
          ? Math.round(nilaiValid.reduce((a, b) => a + b, 0) / nilaiValid.length)
          : null;

        hasil.push({
          id: userDoc.id,
          nama: uData.nama || 'Siswa',
          email: uData.email || '-',
          modul1: m1,
          modul2: m2,
          modul3: m3,
          rataRata,
          terakhirAktivitas: pData?.terakhirAktivitas
            ? new Date(pData.terakhirAktivitas).toLocaleDateString('id-ID', {
                hour: '2-digit',
                minute: '2-digit'
              })
            : 'Belum aktif'
        });
      }
    }

    return hasil.length > 0 ? hasil : DATA_SIMULASI_SISWA;
  } catch (err) {
    console.warn('[Firebase Firestore] Gagal membaca koleksi siswa:', err);
    return DATA_SIMULASI_SISWA;
  }
}

/**
 * Pembantu akun lokal
 */
function ambilDaftarPenggunaLokal(): Record<string, { id: string; nama: string; email: string; pass: string; peran: 'siswa' | 'guru' }> {
  try {
    const raw = window.localStorage.getItem(KUNCI_DAFTAR_PENGGUNA);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function simpanPenggunaLokal(akun: { id: string; nama: string; email: string; pass: string; peran: 'siswa' | 'guru' }): void {
  try {
    const daftar = ambilDaftarPenggunaLokal();
    daftar[akun.email.toLowerCase()] = akun;
    window.localStorage.setItem(KUNCI_DAFTAR_PENGGUNA, JSON.stringify(daftar));
  } catch {
    // Abaikan jika gagal
  }
}
