# AGENTS.md — Aturan Kerja: Web Pembelajaran Kimia (Laju Reaksi)

Acuan produk: lihat `PRD.md`. Jika aturan ini bertentangan dengan permintaan di chat, tanyakan dulu sebelum mengubah.

## 1. Teknologi
- Gunakan React + Vite dengan TypeScript.
- Tulis hanya komponen fungsional dan hooks; tanpa class component.
- Jangan menambah library baru (UI, state, grafik, dll.) tanpa persetujuan; pakai CSS biasa atau CSS Modules.
- Tidak ada backend, API eksternal, atau layanan pihak ketiga.

## 2. Penyimpanan
- Simpan progres hanya di `localStorage`.
- Data yang boleh disimpan: modul yang sudah dibuka dan skor kuis terakhir.
- Dilarang menyimpan nama, email, atau data pribadi lain; tidak ada login.
- Semua kunci `localStorage` diawali `lajuku:` (contoh: `lajuku:progres`).
- Akses `localStorage` dibungkus `try/catch` agar aplikasi tetap jalan jika penyimpanan diblokir.

## 3. Struktur
- Komponen berada di `src/components/`, satu komponen per file, nama file PascalCase (contoh: `KuisModul.tsx`).
- Materi dan soal disimpan sebagai data di `src/data/` (`modul.ts`, `kuis.ts`), bukan ditulis langsung di komponen.
- Fungsi bantu (misalnya baca/tulis progres) berada di `src/utils/`.
- Ada tepat tiga modul: Konsep Laju Reaksi, Teori Tumbukan dan Faktor yang Memengaruhi, Persamaan Laju dan Orde Reaksi.
- Setiap soal kuis wajib memiliki: pertanyaan, pilihan jawaban, kunci, dan penjelasan.

## 4. Bahasa
- Seluruh teks tampilan memakai bahasa Indonesia baku dan komunikatif, ditujukan untuk siswa SMA kelas XI.
- Kalimat singkat; setiap istilah baru dijelaskan saat pertama muncul.
- Umpan balik kuis menjelaskan alasan jawaban benar atau salah, bukan hanya "Benar" atau "Salah".
- Nama variabel dan fungsi dalam kode memakai bahasa Inggris atau Indonesia secara konsisten (pilih Indonesia untuk domain: `modul`, `kuis`, `progres`).

## 5. Notasi
- Rumus dan ion ditulis dengan subskrip/superskrip yang benar: H₂SO₄, Ca²⁺, Na⁺, SO₄²⁻.
- Perubahan entalpi ditulis ΔH; energi aktivasi ditulis Eₐ.
- Persamaan laju ditulis v = k[A]ᵐ[B]ⁿ; konsentrasi memakai kurung siku.
- Satuan laju reaksi: M/s (atau mol L⁻¹ s⁻¹); gunakan satu bentuk secara konsisten di seluruh situs.
- Gunakan karakter Unicode atau tag `<sub>`/`<sup>`, bukan tulisan datar seperti H2SO4 atau Ca2+.

## Uji cepat (jawab ya/tidak setelah tiap perubahan)
- Apakah aplikasi memakai backend luar? (harus: tidak)
- Apakah ada library baru di `package.json` tanpa persetujuan? (harus: tidak)
- Apakah ada data pribadi yang disimpan? (harus: tidak)
- Apakah semua komponen berada di `src/components/`? (harus: ya)
- Apakah semua rumus kimia tampil dengan subskrip/superskrip benar? (harus: ya)
- Apakah setiap soal kuis punya penjelasan? (harus: ya)
- Apakah `npm run build` berhasil tanpa error? (harus: ya)