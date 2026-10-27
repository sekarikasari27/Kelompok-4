export interface Subtopik {
  judul: string;
  konten: string[];
  tips?: string;
  contohTabel?: {
    judul: string;
    kolom: string[];
    baris: (string | number)[][];
    keterangan?: string;
  };
}

export interface ModulData {
  id: string;
  nomor: number;
  judul: string;
  ringkasan: string;
  waktuBacaMenit: number;
  subtopik: Subtopik[];
}

export const DATA_MODUL: ModulData[] = [
  {
    id: 'modul-1',
    nomor: 1,
    judul: 'Konsep Laju Reaksi',
    ringkasan: 'Memahami definisi laju reaksi, cara menyatakan laju zat, satuan baku (M/s), serta hubungan matematis perubahan konsentrasi terhadap waktu.',
    waktuBacaMenit: 7,
    subtopik: [
      {
        judul: '1. Pengertian Laju Reaksi',
        konten: [
          'Dalam kehidupan sehari-hari, beberapa peristiwa kimia berlangsung sangat cepat, seperti ledakan kembang api. Sebaliknya, proses perkaratan besi pada jembatan berlangsung sangat lambat.',
          'Laju reaksi (biasa disimbolkan v atau r) mengukur seberapa cepat reaktan (pereaksi) berubah menjadi produk (hasil reaksi) per satuan waktu.',
          'Secara kuantitatif, laju reaksi didefinisikan sebagai berkurangnya konsentrasi molar reaktan per satuan waktu, atau bertambahnya konsentrasi molar produk per satuan waktu.'
        ],
        tips: 'Ingat: Konsentrasi molar (M) menyatakan mol zat terlarut per liter larutan (mol/L). Laju reaksi selalu bernilai positif.'
      },
      {
        judul: '2. Satuan dan Perumusan Laju Reaksi',
        konten: [
          'Satuan standar laju reaksi dalam larutan adalah M/s (molaritas per detik, atau mol L⁻¹ s⁻¹). Jika reaksi berfase gas, konsentrasi sering digantikan dengan tekanan parsial zat (misalnya atm/s).',
          'Tinjau reaksi umum sederhana berikut: A + B → C + D',
          'Laju pengurangan reaktan A: v_A = -Δ[A] / Δt',
          'Laju pengurangan reaktan B: v_B = -Δ[B] / Δt',
          'Laju pembentukan produk C: v_C = +Δ[C] / Δt',
          'Tanda negatif (-) menandakan zat berkurang selama reaksi, sedangkan tanda positif (+) menandakan zat bertambah seiring berjalannya waktu.'
        ]
      },
      {
        judul: '3. Hubungan Koefisien Reaksi dan Laju Relatif',
        konten: [
          'Perbandingan laju zat-zat yang terlibat dalam reaksi setara berbanding lurus dengan koefisien reaksinya masing-masing.',
          'Tinjau reaksi sintesis amonia: N₂(g) + 3H₂(g) → 2NH₃(g)',
          'Untuk setiap 1 mol N₂ yang bereaksi, dibutuhkan 3 mol H₂ dan akan menghasilkan 2 mol NH₃ dalam waktu yang sama.',
          'Maka hubungan lajunya dinyatakan sebagai: v = -Δ[N₂]/Δt = -(1/3)(Δ[H₂]/Δt) = +(1/2)(Δ[NH₃]/Δt)',
          'Secara umum, untuk reaksi: pA + qB → rC + sD, perbandingan laju zat adalah: v_A : v_B : v_C : v_D = p : q : r : s.'
        ],
        tips: 'Contoh aplikasi: Jika laju pengurangan gas N₂ adalah 0,2 M/s, maka laju pengurangan H₂ adalah 3 × 0,2 M/s = 0,6 M/s, dan laju pembentukan NH₃ adalah 2 × 0,2 M/s = 0,4 M/s.'
      }
    ]
  },
  {
    id: 'modul-2',
    nomor: 2,
    judul: 'Teori Tumbukan dan Faktor Laju Reaksi',
    ringkasan: 'Menjelaskan mekanisme reaksi pada tingkat partikel melalui teori tumbukan efektif, energi aktivasi (Eₐ), serta 4 faktor penentu laju reaksi.',
    waktuBacaMenit: 10,
    subtopik: [
      {
        judul: '1. Teori Tumbukan Efektif dan Energi Aktivasi (Eₐ)',
        konten: [
          'Agar suatu reaksi kimia dapat terjadi, partikel-partikel reaktan (atom, ion, atau molekul) harus bertumbukan satu sama lain. Namun, tidak semua tumbukan menghasilkan reaksi.',
          'Tumbukan yang berhasil menghasilkan zat baru disebut tumbukan efektif. Suatu tumbukan efektif harus memenuhi dua syarat mutlak:',
          '1. Orientasi posisi tumbukan harus tepat (arah tabrakan partikel memungkinkan ikatan lama putus dan ikatan baru terbentuk).',
          '2. Partikel harus memiliki energi kinetik yang cukup untuk melampaui batas energi minimum, yang dinamakan Energi Aktivasi (Eₐ).',
          'Perubahan entalpi reaksi (ΔH) merupakan selisih energi produk dan reaktan: ΔH = E_produk - E_reaktan.'
        ],
        tips: 'Energi Aktivasi (Eₐ) ibarat bukit pembatas. Semakin rendah bukit Eₐ, semakin mudah partikel melompatinya sehingga reaksi berlangsung lebih cepat.'
      },
      {
        judul: '2. Faktor 1: Konsentrasi dan Tekanan',
        konten: [
          'Semakin tinggi konsentrasi pereaksi dalam larutan, jumlah partikel per satuan volume akan semakin banyak.',
          'Partikel yang semakin rapat menyebabkan peluang dan frekuensi tumbukan antarpartikel meningkat tajam.',
          'Dengan meningkatnya frekuensi tumbukan, jumlah tumbukan efektif bertambah, sehingga laju reaksi semakin cepat.',
          'Pada reaksi berfase gas, memperbesar tekanan sama efeknya dengan memperbesar konsentrasi (karena volume wadah menyusut dan partikel makin rapat).'
        ]
      },
      {
        judul: '3. Faktor 2: Suhu (Temperatur)',
        konten: [
          'Menaikkan suhu menyebabkan energi kinetik rata-rata partikel meningkat, sehingga partikel bergerak lebih cepat dan bergetar lebih kuat.',
          'Kenaikan suhu tidak hanya meningkatkan frekuensi tumbukan, tetapi yang paling utama adalah melipatgandakan fraksi (persentase) partikel yang memiliki energi ≥ Eₐ.',
          'Secara umum dalam kimia, kenaikan suhu sebesar 10 °C dapat melipatgandakan laju reaksi menjadi 2 hingga 3 kali lebih cepat.'
        ]
      },
      {
        judul: '4. Faktor 3: Luas Permukaan Bidang Sentuh',
        konten: [
          'Faktor ini berlaku untuk reaksi heterogen (misalnya padatan dengan larutan atau padatan dengan gas). Reaksi hanya terjadi pada permukaan batas tempat kedua zat saling bersentuhan.',
          'Zat padat berbentuk serbuk halus memiliki total luas permukaan bidang sentuh yang jauh lebih besar daripada zat padat berukuran kepingan atau bongkahan dengan massa yang sama.',
          'Semakin luas bidang sentuh, semakin banyak titik kontak tumbukan antarpartikel, sehingga laju reaksi berlangsung lebih cepat.',
          'Contoh: Reaksi serbuk CaCO₃ dengan larutan HCl encer jauh lebih cepat menghasilkan gas CO₂ dibandingkan menggunakan bongkahan marmer CaCO₃ padat.'
        ]
      },
      {
        judul: '5. Faktor 4: Katalis',
        konten: [
          'Katalis adalah zat yang dapat mempercepat laju reaksi tanpa mengalami perubahan kimia yang kekal pada akhir reaksi.',
          'Cara kerja katalis: Katalis menyediakan mekanisme atau rute reaksi alternatif dengan Energi Aktivasi (Eₐ) yang lebih rendah.',
          'Perlu diingat: Katalis TIDAK mengubah nilai perubahan entalpi reaksi (ΔH) dan TIDAK menambah jumlah produk akhir, melainkan hanya mempercepat waktu untuk mencapai keadaan akhir reaksi.'
        ],
        tips: 'Penting diingat: Katalis menurunkan Eₐ, bukan menaikkan energi partikel reaktan!'
      }
    ]
  },
  {
    id: 'modul-3',
    nomor: 3,
    judul: 'Persamaan Laju dan Orde Reaksi',
    ringkasan: 'Menyusun persamaan laju reaksi v = k[A]ᵐ[B]ⁿ, memahami makna grafik orde reaksi 0, 1, dan 2, serta menentukan orde dari tabel data eksperimen.',
    waktuBacaMenit: 10,
    subtopik: [
      {
        judul: '1. Bentuk Umum Persamaan Laju Reaksi',
        konten: [
          'Hubungan antara laju reaksi dengan konsentrasi reaktan dinyatakan secara matematis melalui Persamaan Laju Reaksi (Hukum Laju).',
          'Untuk reaksi umum: aA + bB → cC + dD, bentuk hukum lajunya adalah:',
          'v = k[A]ᵐ[B]ⁿ',
          'Keterangan: v = laju reaksi (M/s), k = tetapan jenis laju reaksi (bergantung suhu dan katalis), [A] & [B] = konsentrasi molar reaktan (M), m = orde reaksi terhadap A, n = orde reaksi terhadap B.',
          'Orde total (tingkat reaksi keseluruhan) adalah penjumlahan seluruh pangkat: Orde Total = m + n.',
          'PENTING: Nilai m dan n TIDAK SELALU SAMA dengan koefisien reaksi (a dan b). Orde reaksi HANYA DAPAT DITENTUKAN MELALUI DATA PERCOBAAN LAB, bukan dari persamaan reaksi di atas kertas.'
        ]
      },
      {
        judul: '2. Karakteristik Grafik Orde Reaksi',
        konten: [
          'Orde Nol (m = 0): v = k[A]⁰ = k. Laju reaksi sama sekali tidak dipengaruhi oleh konsentrasi reaktan. Grafik v terhadap [A] berupa garis lurus horizontal.',
          'Orde Satu (m = 1): v = k[A]¹. Laju reaksi berbanding lurus dengan konsentrasi pereaksi. Jika [A] dinaikkan 2 kali lipat, laju reaksi ikut naik 2 kali lipat. Grafiknya berupa garis linier miring ke atas.',
          'Orde Dua (m = 2): v = k[A]². Laju reaksi sebanding dengan kuadrat konsentrasi pereaksi. Jika [A] dinaikkan 2 kali lipat, laju reaksi melonjak 2² = 4 kali lipat. Grafiknya berupa parabola melengkung ke atas.'
        ]
      },
      {
        judul: '3. Langkah Bertahap Menentukan Orde dari Tabel Percobaan',
        konten: [
          'Langkah 1: Untuk mencari orde terhadap pereaksi A (m), pilih dua percobaan di mana konsentrasi pereaksi lain (B) dibuat tetap (konstan).',
          'Langkah 2: Bandingkan laju reaksi kedua percobaan tersebut: (v₁ / v₂) = ([A]₁ / [A]₂)ᵐ.',
          'Langkah 3: Untuk mencari orde terhadap pereaksi B (n), pilih dua percobaan di mana konsentrasi A tetap, lalu bandingkan: (v₁ / v₃) = ([B]₁ / [B]₃)ⁿ.',
          'Langkah 4: Tuliskan persamaan laju lengkap v = k[A]ᵐ[B]ⁿ dengan memasukkan nilai m dan n yang telah dihitung.',
          'Langkah 5: Untuk mencari nilai k dan satuannya, substitusikan data dari salah satu percobaan ke dalam persamaan laju.'
        ],
        contohTabel: {
          judul: 'Tabel Data Eksperimen Reaksi: 2NO(g) + Br₂(g) → 2NOBr(g)',
          kolom: ['Percobaan', '[NO] (M)', '[Br₂] (M)', 'Laju Awal v (M/s)'],
          baris: [
            [1, '0,10', '0,05', '6,0 × 10⁻³'],
            [2, '0,10', '0,10', '1,2 × 10⁻²'],
            [3, '0,20', '0,05', '2,4 × 10⁻²']
          ],
          keterangan: 'Penyelesaian bertahap: (a) Cari orde Br₂ dengan membandingkan Percobaan 1 dan 2 ([NO] tetap = 0,10 M): (0,05 / 0,10)ⁿ = (6,0 × 10⁻³ / 1,2 × 10⁻²) ⇒ (1/2)ⁿ = 1/2 ⇒ n = 1. (b) Cari orde NO dengan membandingkan Percobaan 1 dan 3 ([Br₂] tetap = 0,05 M): (0,10 / 0,20)ᵐ = (6,0 × 10⁻³ / 2,4 × 10⁻²) ⇒ (1/2)ᵐ = 1/4 ⇒ (1/2)ᵐ = (1/2)² ⇒ m = 2. Maka persamaan laju reaksinya adalah: v = k[NO]²[Br₂] dengan orde total = 2 + 1 = 3.'
        }
      }
    ]
  }
];
