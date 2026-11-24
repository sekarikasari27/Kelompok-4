export type PeranPengguna = 'tamu' | 'siswa' | 'guru';

export interface Pengguna {
  id: string;
  nama: string;
  email: string;
  peran: 'siswa' | 'guru';
  dibuatPada?: string;
}

export interface StatusAuth {
  terautentikasi: boolean;
  peran: PeranPengguna;
  pengguna: Pengguna | null;
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

