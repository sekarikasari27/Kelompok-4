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
  getDocs,
  query,
  where,
  addDoc
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { isFirebaseConfigured } from './firebaseConfig';
import type { Pengguna, PeranPengguna, StatusAuth, SiswaProgresNilai, RiwayatEvaluasiSiswa } from '../types/auth';
import type { Progres } from '../utils/progres';

const KUNCI_AUTH_SESSION = 'lajuku:auth_session';
const KUNCI_DAFTAR_PENGGUNA = 'lajuku:registered_users';
const KUNCI_PROGRES_PREFIX = 'lajuku:progres:';
const KUNCI_EVALUASI_PREFIX = 'lajuku:evaluasi:';

/**
 * Akun Guru Resmi Tunggal LajuKu
 * Pembatasan hak akses pendidik/guru secara eksklusif hanya untuk: lajuku615@gmail.com
 */
export const EMAIL_GURU_TUNGGAL = 'lajuku615@gmail.com';

/**
 * Daftar email guru resmi. Sesuai ketentuan, lajuku615@gmail.com adalah akun guru satu-satunya.
 */
export const DAFTAR_EMAIL_GURU: readonly string[] = [EMAIL_GURU_TUNGGAL];

// Data simulasi awal siswa untuk dashboard guru jika Firestore belum terisi
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

/**
 * Mengecek apakah sebuah email merupakan email yang terdaftar sebagai Guru.
 * Akun guru dibatasi secara ketat dan eksklusif hanya untuk: lajuku615@gmail.com
 */
export function cekApakahEmailGuru(email: string): boolean {
  if (!email) return false;
  const emailNorm = email.trim().toLowerCase();
  return emailNorm === EMAIL_GURU_TUNGGAL.toLowerCase();
}

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
      return 'Email atau kata sandi salah. Silakan periksa kembali akun Anda.';
    case 'auth/email-already-in-use':
      return 'Alamat email ini sudah terdaftar. Silakan gunakan tab "Masuk".';
    case 'auth/weak-password':
      return 'Kata sandi terlalu lemah. Gunakan minimal 6 karakter kombinasi.';
    case 'auth/invalid-email':
      return 'Format alamat email tidak valid.';
    case 'auth/user-disabled':
      return 'Akun pengguna ini telah dinonaktifkan oleh administrator.';
    case 'auth/network-request-failed':
      return 'Gagal terhubung ke server Firebase. Pastikan koneksi internet Anda aktif.';
    case 'auth/operation-not-allowed':
      return 'Metode Email/Password belum diaktifkan di Firebase Console.';
    case 'auth/too-many-requests':
      return 'Terlalu banyak percobaan gagal. Silakan tunggu sejenak sebelum mencoba lagi.';
    default:
      return fallbackPesan;
  }
}

/**
 * Membaca status autentikasi dari sesi yang tersimpan di localStorage
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
 * Data evaluasi dan progres tidak tersimpan permanen
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
 * Deteksi role pengguna secara otomatis berdasarkan Firestore atau daftar email guru.
 * Menyimpan role 'teacher' untuk guru dan 'student' untuk siswa.
 */
export async function dapatkanPeranPenggunaOtomatis(uid: string, email: string): Promise<'siswa' | 'guru'> {
  const emailNorm = email.trim().toLowerCase();

  // 1. Cek apakah email terdaftar sebagai akun guru resmi tunggal (lajuku615@gmail.com)
  const isGuruByEmail = cekApakahEmailGuru(emailNorm);

  try {
    if (isFirebaseConfigured()) {
      const userDocRef = doc(db, 'users', uid);
      const snap = await getDoc(userDocRef);

      if (snap.exists()) {
        const data = snap.data();

        // Jika email bukan email guru tunggal, paksa peran siswa (student)
        if (!isGuruByEmail) {
          if (data.role === 'teacher' || data.peran === 'guru') {
            await setDoc(userDocRef, { peran: 'siswa', role: 'student' }, { merge: true });
          }
          return 'siswa';
        }

        // Jika email adalah guru resmi tunggal, pastikan peran guru (teacher)
        if (data.role !== 'teacher' || data.peran !== 'guru') {
          await setDoc(userDocRef, { peran: 'guru', role: 'teacher' }, { merge: true });
        }
        return 'guru';
      } else {
        // Dokumen belum ada, buat dokumen profil awal sesuai deteksi email guru resmi
        const peranHasil = isGuruByEmail ? 'guru' : 'siswa';
        await setDoc(userDocRef, {
          uid,
          email: emailNorm,
          peran: peranHasil,
          role: peranHasil === 'guru' ? 'teacher' : 'student',
          dibuatPada: new Date().toISOString()
        }, { merge: true });
        return peranHasil;
      }
    }
  } catch (err) {
    console.warn('[Firebase] Gagal membaca profil pengguna Firestore:', err);
  }

  // Fallback berdasarkan email guru resmi tunggal
  return isGuruByEmail ? 'guru' : 'siswa';
}

/**
 * Autentikasi Masuk dengan Akun Email (Firebase Authentication)
 * Otomatis mendeteksi peran Guru atau Siswa.
 */
export async function masukDenganEmail(
  email: string,
  pass: string
): Promise<{ sukses: boolean; pesan?: string; status?: StatusAuth }> {
  const emailNormal = email.trim().toLowerCase();

  // Validasi format email dasar
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(emailNormal)) {
    return { sukses: false, pesan: 'Format alamat email tidak valid.' };
  }

  if (!pass || pass.length < 6) {
    return { sukses: false, pesan: 'Kata sandi minimal 6 karakter.' };
  }

  // 1. Coba login melalui Firebase Authentication jika terkonfigurasi
  if (isFirebaseConfigured()) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, emailNormal, pass);
      const fbUser = userCredential.user;

      // Deteksi peran pengguna secara otomatis dari Firestore / Konfigurasi Guru
      const peranAktif = await dapatkanPeranPenggunaOtomatis(fbUser.uid, emailNormal);
      const namaPengguna = fbUser.displayName || emailNormal.split('@')[0];

      const pengguna: Pengguna = {
        id: fbUser.uid,
        nama: namaPengguna,
        email: fbUser.email || emailNormal,
        peran: peranAktif,
        role: peranAktif === 'guru' ? 'teacher' : 'student'
      };

      const status: StatusAuth = {
        terautentikasi: true,
        peran: peranAktif,
        pengguna
      };

      simpanSesi(status);

      // Jika peran siswa, sinkronkan data progres dan riwayat nilai dari Firestore
      if (peranAktif === 'siswa') {
        await sinkronkanProgresDariFirebase(fbUser.uid);
      }

      return { sukses: true, status };
    } catch (err: unknown) {
      const fbError = err as { code?: string; message?: string };
      console.warn('[Firebase Auth] Gagal masuk via Firebase:', fbError.code, fbError.message);

      const pesanUser = terjemahkanErrorFirebase(
        fbError.code || '',
        'Email atau kata sandi salah. Silakan periksa kembali.'
      );
      return { sukses: false, pesan: pesanUser };
    }
  }

  // 2. Fallback mode offline jika Firebase tidak terkonfigurasi
  const daftarAkun = ambilDaftarPenggunaLokal();
  const akunTersimpan = daftarAkun[emailNormal];
  if (akunTersimpan) {
    if (akunTersimpan.pass !== pass) {
      return { sukses: false, pesan: 'Kata sandi akun salah.' };
    }
    const peranOtomatis = cekApakahEmailGuru(emailNormal) ? 'guru' : akunTersimpan.peran;
    const pengguna: Pengguna = {
      id: akunTersimpan.id,
      nama: akunTersimpan.nama,
      email: akunTersimpan.email,
      peran: peranOtomatis,
      role: peranOtomatis === 'guru' ? 'teacher' : 'student'
    };
    const status: StatusAuth = {
      terautentikasi: true,
      peran: peranOtomatis,
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
 * Pendaftaran akun baru dengan Email & Password ke Firebase Authentication.
 * Setiap akun baru secara default memiliki role 'student' (siswa), kecuali jika email terdaftar sebagai guru.
 */
export async function daftarDenganEmail(
  nama: string,
  email: string,
  pass: string,
  konfirmasiPass: string
): Promise<{ sukses: boolean; pesan?: string; status?: StatusAuth }> {
  const emailNormal = email.trim().toLowerCase();

  if (!nama || nama.trim().length < 2) {
    return { sukses: false, pesan: 'Nama lengkap harus diisi (minimal 2 karakter).' };
  }

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(emailNormal)) {
    return { sukses: false, pesan: 'Format alamat email tidak valid.' };
  }

  if (!pass || pass.length < 6) {
    return { sukses: false, pesan: 'Kata sandi minimal 6 karakter demi keamanan akun Anda.' };
  }

  if (pass !== konfirmasiPass) {
    return { sukses: false, pesan: 'Konfirmasi kata sandi tidak cocok. Mohon periksa kembali.' };
  }

  // Tentukan role: akun baru otomatis student kecuali terdaftar di email guru
  const isGuru = cekApakahEmailGuru(emailNormal);
  const peran: 'siswa' | 'guru' = isGuru ? 'guru' : 'siswa';
  const role: 'student' | 'teacher' = isGuru ? 'teacher' : 'student';

  // 1. Daftarkan ke Firebase Authentication
  if (isFirebaseConfigured()) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, emailNormal, pass);
      const fbUser = userCredential.user;

      // Perbarui Display Name di Firebase Profile
      await updateProfile(fbUser, { displayName: nama.trim() });

      // Simpan data profil ke koleksi "users/{uid}" di Cloud Firestore
      try {
        await setDoc(doc(db, 'users', fbUser.uid), {
          uid: fbUser.uid,
          nama: nama.trim(),
          email: emailNormal,
          peran,
          role,
          dibuatPada: new Date().toISOString()
        }, { merge: true });

        // Jika peran adalah siswa, inisialisasi dokumen progres kosong
        if (peran === 'siswa') {
          await setDoc(doc(db, 'progres', fbUser.uid), {
            modulDibuka: [],
            skorKuis: {},
            terakhirAktivitas: new Date().toISOString()
          }, { merge: true });
        }
      } catch (errDoc) {
        console.warn('[Firestore] Gagal menulis profil di Firestore:', errDoc);
      }

      const pengguna: Pengguna = {
        id: fbUser.uid,
        nama: nama.trim(),
        email: fbUser.email || emailNormal,
        peran,
        role
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
        'Gagal mendaftarkan akun. Silakan coba kembali.'
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
    peran,
    role
  };

  simpanPenggunaLokal(akunBaru);

  const pengguna: Pengguna = {
    id: akunBaru.id,
    nama: akunBaru.nama,
    email: akunBaru.email,
    peran: akunBaru.peran,
    role: akunBaru.role
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
 * Berlangganan perubahan status autentikasi Firebase secara real-time.
 * Menjaga pengguna tetap dalam kondisi login saat halaman di-refresh.
 */
export function pantauStatusAuthFirebase(
  onPerubahan: (status: StatusAuth) => void
): () => void {
  if (!isFirebaseConfigured()) {
    return () => {};
  }

  return onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
    if (fbUser) {
      // Dapatkan peran secara otomatis dari Firestore / Konfigurasi
      const peranAktif = await dapatkanPeranPenggunaOtomatis(fbUser.uid, fbUser.email || '');

      const pengguna: Pengguna = {
        id: fbUser.uid,
        nama: fbUser.displayName || fbUser.email?.split('@')[0] || 'Pengguna',
        email: fbUser.email || '',
        peran: peranAktif,
        role: peranAktif === 'guru' ? 'teacher' : 'student'
      };

      const statusBaru: StatusAuth = {
        terautentikasi: true,
        peran: pengguna.peran,
        pengguna
      };

      simpanSesi(statusBaru);
      onPerubahan(statusBaru);
    } else {
      // Jika Firebase melaporkan user logout
      const sesiSekarang = ambilStatusAuth();
      if (sesiSekarang.terautentikasi) {
        simpanSesi(STATUS_TAMU_DEFAULT);
        onPerubahan(STATUS_TAMU_DEFAULT);
      }
    }
  });
}

/**
 * Mengambil progres belajar pengguna.
 * Siswa tanpa login (tamu) tidak mengambil progres dari database permanen.
 */
export function ambilProgresBerdasarkanPeran(userId: string | null, peran: PeranPengguna): Progres {
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
 * Siswa tanpa login (tamu) tidak disimpan ke Firestore maupun localStorage.
 */
export function simpanProgresBerdasarkanPeran(
  userId: string | null,
  peran: PeranPengguna,
  progres: Progres
): void {
  if (peran === 'tamu' || !userId) {
    return;
  }

  try {
    const kunci = `${KUNCI_PROGRES_PREFIX}${userId}`;
    window.localStorage.setItem(kunci, JSON.stringify(progres));

    if (isFirebaseConfigured()) {
      sinkronkanProgresKeFirebase(userId, progres);
    }
  } catch {
    // Abaikan jika diblokir
  }
}

/**
 * Sinkronisasi progres belajar siswa ke Cloud Firestore di koleksi "progres/{uid}"
 */
export async function sinkronkanProgresKeFirebase(userId: string, progres: Progres): Promise<void> {
  if (!isFirebaseConfigured() || !userId) return;

  try {
    const progresRef = doc(db, 'progres', userId);
    await setDoc(progresRef, {
      modulDibuka: progres.modulDibuka,
      skorKuis: progres.skorKuis,
      terakhirAktivitas: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('[Firebase Firestore] Gagal menyelaraskan progres ke Firestore:', err);
  }
}

/**
 * Membaca progres belajar dari Cloud Firestore dan menyimpannya ke cache lokal
 */
export async function sinkronkanProgresDariFirebase(userId: string): Promise<Progres | null> {
  if (!isFirebaseConfigured() || !userId) return null;

  try {
    const progresRef = doc(db, 'progres', userId);
    const snap = await getDoc(progresRef);
    if (snap.exists()) {
      const data = snap.data();
      const hasil: Progres = {
        modulDibuka: Array.isArray(data.modulDibuka) ? data.modulDibuka : [],
        skorKuis: data.skorKuis && typeof data.skorKuis === 'object' ? data.skorKuis : {}
      };
      window.localStorage.setItem(`${KUNCI_PROGRES_PREFIX}${userId}`, JSON.stringify(hasil));
      return hasil;
    }
  } catch (err) {
    console.warn('[Firebase Firestore] Gagal mengambil data progres dari Firestore:', err);
  }
  return null;
}

/**
 * ============================================================================
 * SISTEM PENYIMPANAN NILAI & RIWAYAT EVALUASI SISWA KE FIREBASE FIRESTORE
 * ============================================================================
 */

/**
 * Simpan data riwayat pengerjaan evaluasi secara permanen ke Firebase Firestore
 * Koleksi: 'riwayat_evaluasi' dan subkoleksi 'users/{uid}/evaluasi'
 */
export async function simpanRiwayatEvaluasiKeFirebase(
  evaluasi: RiwayatEvaluasiSiswa
): Promise<boolean> {
  if (!evaluasi.userId) return false;

  const dataSimpan = {
    ...evaluasi,
    dibuatPada: new Date().toISOString()
  };

  // Simpan ke cache lokal agar tidak hilang offline
  try {
    const kunci = `${KUNCI_EVALUASI_PREFIX}${evaluasi.userId}`;
    const raw = window.localStorage.getItem(kunci);
    const list: RiwayatEvaluasiSiswa[] = raw ? JSON.parse(raw) : [];
    list.unshift(dataSimpan);
    window.localStorage.setItem(kunci, JSON.stringify(list));
  } catch {
    // Abaikan
  }

  // Simpan ke Cloud Firestore jika terhubung
  if (isFirebaseConfigured()) {
    try {
      // 1. Simpan ke koleksi utama 'riwayat_evaluasi'
      await addDoc(collection(db, 'riwayat_evaluasi'), dataSimpan);

      // 2. Simpan juga ke subkoleksi 'users/{uid}/evaluasi'
      await addDoc(collection(db, 'users', evaluasi.userId, 'evaluasi'), dataSimpan);

      // 3. Update progres ringkasan di Firestore
      const progresRef = doc(db, 'progres', evaluasi.userId);
      const snap = await getDoc(progresRef);
      const skorLama = snap.exists() ? (snap.data().skorKuis || {}) : {};
      const skorBaru = {
        ...skorLama,
        [evaluasi.modulId]: Math.max(skorLama[evaluasi.modulId] || 0, evaluasi.skor)
      };

      await setDoc(progresRef, {
        skorKuis: skorBaru,
        terakhirAktivitas: new Date().toISOString()
      }, { merge: true });

      return true;
    } catch (err) {
      console.warn('[Firebase Firestore] Gagal menyimpan riwayat evaluasi ke Firestore:', err);
    }
  }

  return true;
}

/**
 * Mengambil daftar riwayat evaluasi siswa dari Cloud Firestore
 */
export async function ambilRiwayatEvaluasiSiswaDariFirebase(
  userId: string
): Promise<RiwayatEvaluasiSiswa[]> {
  if (!userId) return [];

  // Coba ambil dari Firestore
  if (isFirebaseConfigured()) {
    try {
      const q = query(
        collection(db, 'riwayat_evaluasi'),
        where('userId', '==', userId)
      );
      const snap = await getDocs(q);

      if (!snap.empty) {
        const hasil: RiwayatEvaluasiSiswa[] = snap.docs.map((d) => {
          const data = d.data() as RiwayatEvaluasiSiswa;
          return {
            ...data,
            id: d.id
          };
        });

        // Urutkan dari yang terbaru ke terlama
        hasil.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());

        // Update cache lokal
        try {
          window.localStorage.setItem(`${KUNCI_EVALUASI_PREFIX}${userId}`, JSON.stringify(hasil));
        } catch {
          // Abaikan
        }

        return hasil;
      }
    } catch (err) {
      console.warn('[Firebase Firestore] Gagal mengambil riwayat dari Firestore:', err);
    }
  }

  // Fallback membaca cache lokal
  try {
    const raw = window.localStorage.getItem(`${KUNCI_EVALUASI_PREFIX}${userId}`);
    if (raw) {
      const list: RiwayatEvaluasiSiswa[] = JSON.parse(raw);
      list.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
      return list;
    }
  } catch {
    // Abaikan
  }

  return [];
}

/**
 * Membaca seluruh data siswa dari Cloud Firestore untuk ditampilkan di Dashboard Guru
 */
export async function ambilDataSemuaSiswaDariFirebase(): Promise<SiswaProgresNilai[]> {
  if (!isFirebaseConfigured()) return ambilDataSiswaLokal();

  try {
    const usersCol = collection(db, 'users');
    const userSnapshot = await getDocs(usersCol);

    const hasil: SiswaProgresNilai[] = [];

    for (const userDoc of userSnapshot.docs) {
      const uData = userDoc.data();
      if (uData.peran === 'siswa' || uData.role === 'student') {
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

    return hasil.length > 0 ? hasil : ambilDataSiswaLokal();
  } catch (err) {
    console.warn('[Firebase Firestore] Gagal membaca koleksi siswa:', err);
    return ambilDataSiswaLokal();
  }
}

/**
 * Pembantu akun lokal jika offline
 */
function ambilDaftarPenggunaLokal(): Record<string, { id: string; nama: string; email: string; pass: string; peran: 'siswa' | 'guru'; role?: 'student' | 'teacher' }> {
  try {
    const raw = window.localStorage.getItem(KUNCI_DAFTAR_PENGGUNA);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function simpanPenggunaLokal(akun: { id: string; nama: string; email: string; pass: string; peran: 'siswa' | 'guru'; role?: 'student' | 'teacher' }): void {
  try {
    const daftar = ambilDaftarPenggunaLokal();
    daftar[akun.email.toLowerCase()] = akun;
    window.localStorage.setItem(KUNCI_DAFTAR_PENGGUNA, JSON.stringify(daftar));
  } catch {
    // Abaikan jika gagal
  }
}

function ambilDataSiswaLokal(): SiswaProgresNilai[] {
  const akun = ambilDaftarPenggunaLokal();
  const siswa = Object.values(akun).filter(a => a.peran === 'siswa');
  return siswa.map((s, idx) => ({
    id: s.id,
    nama: s.nama,
    email: s.email,
    modul1: 85 + (idx % 15),
    modul2: 80 + (idx % 20),
    modul3: null,
    rataRata: 82,
    terakhirAktivitas: 'Baru saja'
  }));
}
