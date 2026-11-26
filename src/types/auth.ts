export type PeranPengguna = 'tamu' | 'siswa' | 'guru';

export interface Pengguna {
  id: string;
  nama: string;
  email: string;
  peran: 'siswa' | 'guru';
  role?: 'student' | 'teacher';
  dibuatPada?: string;
}

export interface StatusAuth {
  terautentikasi: boolean;
  peran: PeranPengguna;
  pengguna: Pengguna | null;
}

export interface RiwayatEvaluasiSiswa {
  id?: string;
  userId: string;
  namaSiswa: string;
  emailSiswa: string;
  modulId: string;
  namaModul: string;
  jenisEvaluasi: string;
  skor: number;
  persentase: number;
  jumlahBenar: number;
  jumlahSalah: number;
  totalSoal: number;
  tanggal: string;
  statusPenyelesaian: 'Tuntas' | 'Perlu Remedial';
}

export interface SiswaProgresNilai {
  id: string;
  nama: string;
  email: string;
  modul1: number | null;
  modul2: number | null;
  modul3: number | null;
  rataRata: number | null;
  terakhirAktivitas: string;
}
