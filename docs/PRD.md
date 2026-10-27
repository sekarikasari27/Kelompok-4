# PRD — Web Pembelajaran Kimia: Laju Reaksi

## Identitas
Nama media: LajuKu (Belajar Laju Reaksi Interaktif)
Target pengguna: Siswa SMA kelas XI (fase F, Kurikulum Merdeka), belajar mandiri atau sebagai pendamping di kelas
Masalah belajar:
- Siswa sulit membayangkan mengapa suhu, konsentrasi, luas permukaan, dan katalis mengubah laju reaksi, karena proses tumbukan antarpartikel tidak terlihat.
- Siswa sering keliru menentukan orde reaksi dan menyusun persamaan laju dari data percobaan berbentuk tabel.
- Latihan soal biasanya hanya berupa kunci jawaban tanpa penjelasan, sehingga siswa tidak tahu letak kesalahannya.

## Tujuan
- Siswa dapat menjelaskan pengertian laju reaksi dan cara menyatakannya.
- Siswa dapat menjelaskan faktor-faktor yang memengaruhi laju reaksi menggunakan teori tumbukan.
- Siswa dapat menentukan orde reaksi dan persamaan laju dari data percobaan.

## Fitur inti
1. Tiga modul:
   - Modul 1 — Konsep Laju Reaksi: pengertian, satuan (M/s), dan hubungan perubahan konsentrasi terhadap waktu.
   - Modul 2 — Teori Tumbukan dan Faktor yang Memengaruhi Laju: konsentrasi, suhu, luas permukaan, katalis, dilengkapi ilustrasi atau simulasi sederhana.
   - Modul 3 — Persamaan Laju dan Orde Reaksi: menentukan orde dari tabel data percobaan, dengan contoh bertahap.
2. Kuis dengan umpan balik
   - Soal pilihan ganda di akhir tiap modul (5 soal per modul).
   - Setelah menjawab, siswa langsung melihat benar/salah beserta penjelasan singkat.
   - Skor akhir ditampilkan di akhir kuis, dengan opsi mengulang.
3. Penyimpanan progres anonim
   - Tanpa login atau akun; progres disimpan di perangkat siswa (localStorage).
   - Yang disimpan: modul yang sudah dibuka dan skor kuis terakhir.
   - Tidak menyimpan nama, email, atau data pribadi lain.

## Jika waktu cukup
1. Pencarian materi: kolom pencarian untuk menemukan istilah atau subtopik (misalnya "orde reaksi", "katalis") di seluruh modul.

## Di luar cakupan
- Login, akun guru, dan dashboard nilai.
- Materi kimia selain laju reaksi.
- Penyimpanan data ke server atau database.

## Alur pengguna
1. Siswa membuka beranda dan melihat tiga modul beserta status progres.
2. Siswa membaca modul secara berurutan (atau memilih modul tertentu).
3. Siswa mengerjakan kuis modul dan menerima umpan balik.
4. Progres dan skor tersimpan otomatis; saat kembali, siswa melanjutkan dari terakhir.

## Kriteria selesai
- Beranda menampilkan tiga modul dan dapat dibuka satu per satu.
- Setiap modul memiliki materi dan minimal satu ilustrasi atau contoh soal.
- Kuis memberi umpan balik per soal dan skor akhir.
- Progres tetap ada setelah halaman dimuat ulang.
- Tampilan nyaman dibuka di ponsel maupun laptop.

## Batasan teknis
- React + Vite (TypeScript), tanpa backend.
- Konten materi dan soal disimpan sebagai data lokal (file JSON/TS) agar mudah diedit.
- Dapat di-deploy sebagai situs statis.