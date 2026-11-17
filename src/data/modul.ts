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
          'Laju reaksi (disimbolkan $v$ atau $r$) mengukur seberapa cepat reaktan (pereaksi) berubah menjadi produk (hasil reaksi) per satuan waktu.',
          'Secara kuantitatif, laju reaksi didefinisikan sebagai berkurangnya konsentrasi molar reaktan per satuan waktu, atau bertambahnya konsentrasi molar produk per satuan waktu:',
          '\\[ v = \\frac{\\Delta \\text{konsentrasi}}{\\Delta \\text{waktu}} \\]'
        ],
        tips: 'Ingat: Konsentrasi molar (M) menyatakan mol zat terlarut per liter larutan (mol/L). Nilai laju reaksi selalu bertanda positif.'
      },
      {
        judul: '2. Satuan dan Perumusan Laju Reaksi',
        konten: [
          'Satuan standar laju reaksi dalam larutan adalah $\\text{M/s}$ atau dapat dituliskan sebagai pecahan bertingkat:',
          '\\[ \\text{Satuan Laju} = \\frac{\\text{mol}}{\\text{L} \\cdot \\text{s}} = \\text{M/s} \\]',
          'Tinjau reaksi umum sederhana berikut: $\\text{A} + \\text{B} \\rightarrow \\text{C} + \\text{D}$',
          'Laju pengurangan reaktan A per satuan waktu:',
          '\\[ v_A = -\\frac{\\Delta [A]}{\\Delta t} \\]',
          'Laju pengurangan reaktan B per satuan waktu:',
          '\\[ v_B = -\\frac{\\Delta [B]}{\\Delta t} \\]',
          'Laju pembentukan produk C per satuan waktu:',
          '\\[ v_C = +\\frac{\\Delta [C]}{\\Delta t} \\]',
          'Tanda negatif ($-$) menandakan konsentrasi zat berkurang seiring berjalannya waktu, sedangkan tanda positif ($+$) menandakan konsentrasi produk bertambah.'
        ]
      },
      {
        judul: '3. Hubungan Koefisien Reaksi dan Laju Relatif',
        konten: [
          'Perbandingan laju zat-zat yang terlibat dalam reaksi setara berbanding lurus dengan koefisien reaksinya masing-masing.',
          'Tinjau reaksi sintesis amonia: $\\text{N}_2(g) + 3\\text{H}_2(g) \\rightarrow 2\\text{NH}_3(g)$',
          'Untuk setiap 1 mol $\\text{N}_2$ yang bereaksi, dibutuhkan 3 mol $\\text{H}_2$ dan akan menghasilkan 2 mol $\\text{NH}_3$ dalam selang waktu yang sama.',
          'Maka hubungan matematis laju masing-masing zat dirumuskan secara pecahan bertingkat sebagai berikut:',
          '\\[ v = -\\frac{\\Delta [\\text{N}_2]}{\\Delta t} = -\\frac{1}{3}\\frac{\\Delta [\\text{H}_2]}{\\Delta t} = +\\frac{1}{2}\\frac{\\Delta [\\text{NH}_3]}{\\Delta t} \\]',
          'Secara umum, untuk reaksi: $p\\text{A} + q\\text{B} \\rightarrow r\\text{C} + s\\text{D}$, hubungan laju reaksi dinyatakan:',
          '\\[ v = -\\frac{1}{p}\\frac{\\Delta [A]}{\\Delta t} = -\\frac{1}{q}\\frac{\\Delta [B]}{\\Delta t} = +\\frac{1}{r}\\frac{\\Delta [C]}{\\Delta t} = +\\frac{1}{s}\\frac{\\Delta [D]}{\\Delta t} \\]',
          'Sehingga perbandingan laju pengurangan dan penambahan zat setara dengan rasio koefisiennya: $v_A : v_B : v_C : v_D = p : q : r : s$.'
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
          '2. Partikel harus memiliki energi kinetik yang cukup untuk melampaui batas energi minimum, yang dinamakan Energi Aktivasi ($E_a$).',
          'Perubahan entalpi reaksi ($\\Delta H$) merupakan selisih energi produk dan reaktan:',
          '\\[ \\Delta H = E_{\\text{produk}} - E_{\\text{reaktan}} \\]'
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
          'Kenaikan suhu tidak hanya meningkatkan frekuensi tumbukan, tetapi yang paling utama adalah melipatgandakan fraksi partikel ($f$) yang memiliki energi melampaui $E_a$ sesuai persamaan Arrhenius:',
          '\\[ f = e^{-\\frac{E_a}{R \\cdot T}} \\]',
          '\\[ k = A \\cdot e^{-\\frac{E_a}{R \\cdot T}} \\]',
          'Secara empiris, kenaikan suhu sebesar 10 °C umumnya melipatgandakan laju reaksi menjadi 2 hingga 3 kali lebih cepat.'
        ]
      },
      {
        judul: '4. Faktor 3: Luas Permukaan Bidang Sentuh',
        konten: [
          'Faktor ini berlaku untuk reaksi heterogen (misalnya padatan dengan larutan atau padatan dengan gas). Reaksi hanya terjadi pada permukaan batas tempat kedua zat saling bersentuhan.',
          'Zat padat berbentuk serbuk halus memiliki total luas permukaan bidang sentuh yang jauh lebih besar daripada zat padat berukuran kepingan atau bongkahan dengan massa yang sama.',
          'Semakin luas bidang sentuh, semakin banyak titik kontak tumbukan antarpartikel, sehingga laju reaksi berlangsung lebih cepat.',
          'Contoh: Reaksi serbuk $\\text{CaCO}_3$ dengan larutan $\\text{HCl}$ encer jauh lebih cepat menghasilkan gas $\\text{CO}_2$ dibandingkan menggunakan bongkahan marmer padat.'
        ]
      },
      {
        judul: '5. Faktor 4: Katalis',
        konten: [
          'Katalis adalah zat yang dapat mempercepat laju reaksi tanpa mengalami perubahan kimia yang kekal pada akhir reaksi.',
          'Cara kerja katalis: Katalis menyediakan mekanisme atau rute reaksi alternatif dengan Energi Aktivasi ($E_a$) yang lebih rendah.',
          'Perlu diingat: Katalis TIDAK mengubah nilai perubahan entalpi reaksi ($\\Delta H$) dan TIDAK menambah jumlah produk akhir, melainkan hanya mempercepat waktu untuk mencapai keadaan akhir reaksi.'
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
          'Untuk reaksi umum: $a\\text{A} + b\\text{B} \\rightarrow c\\text{C} + d\\text{D}$, bentuk hukum lajunya adalah:',
          '\\[ v = k[A]^m[B]^n \\]',
          'Keterangan: $v$ = laju reaksi (M/s), $k$ = tetapan jenis laju reaksi, $[A]$ & $[B]$ = konsentrasi molar reaktan (M), $m$ = orde reaksi terhadap A, $n$ = orde reaksi terhadap B.',
          'Orde total (tingkat reaksi keseluruhan) adalah penjumlahan seluruh pangkat: $\\text{Orde Total} = m + n$.',
          'PENTING: Nilai $m$ dan $n$ TIDAK SELALU SAMA dengan koefisien reaksi ($a$ dan $b$). Orde reaksi HANYA DAPAT DITENTUKAN MELALUI DATA PERCOBAAN LAB, bukan dari persamaan reaksi di atas kertas.'
        ]
      },
      {
        judul: '2. Karakteristik Grafik Orde Reaksi',
        konten: [
          'Orde Nol ($m = 0$): $v = k[A]^0 = k$. Laju reaksi sama sekali tidak dipengaruhi oleh konsentrasi reaktan. Grafik $v$ terhadap $[A]$ berupa garis lurus horizontal.',
          'Orde Satu ($m = 1$): $v = k[A]^1$. Laju reaksi berbanding lurus dengan konsentrasi pereaksi. Jika $[A]$ dinaikkan 2 kali lipat, laju reaksi ikut naik 2 kali lipat. Grafiknya berupa garis linier miring ke atas.',
          'Orde Dua ($m = 2$): $v = k[A]^2$. Laju reaksi sebanding dengan kuadrat konsentrasi pereaksi. Jika $[A]$ dinaikkan 2 kali lipat, laju reaksi melonjak $2^2 = 4$ kali lipat. Grafiknya berupa parabola melengkung ke atas.'
        ]
      },
      {
        judul: '3. Langkah Bertahap Menentukan Orde dari Tabel Percobaan',
        konten: [
          'Langkah 1: Untuk mencari orde terhadap pereaksi A ($m$), pilih dua percobaan di mana konsentrasi pereaksi lain (B) dibuat tetap (konstan).',
          'Langkah 2: Bandingkan laju reaksi kedua percobaan tersebut menggunakan format pecahan bertingkat:',
          '\\[ \\frac{v_1}{v_2} = \\left( \\frac{[A]_1}{[A]_2} \\right)^m \\]',
          'Langkah 3: Untuk mencari orde terhadap pereaksi B ($n$), pilih dua percobaan di mana konsentrasi A tetap, lalu bandingkan:',
          '\\[ \\frac{v_1}{v_3} = \\left( \\frac{[B]_1}{[B]_3} \\right)^n \\]',
          'Langkah 4: Tuliskan persamaan laju lengkap $v = k[A]^m[B]^n$ dengan memasukkan nilai $m$ dan $n$ yang telah diperoleh.',
          'Langkah 5: Untuk mencari nilai $k$ dan satuannya, substitusikan data dari salah satu percobaan ke dalam persamaan laju.'
        ],
        contohTabel: {
          judul: 'Tabel Data Eksperimen Reaksi: 2NO(g) + Br₂(g) → 2NOBr(g)',
          kolom: ['Percobaan', '[NO] (M)', '[Br₂] (M)', 'Laju Awal v (M/s)'],
          baris: [
            [1, '0,10', '0,05', '6,0 × 10⁻³'],
            [2, '0,10', '0,10', '1,2 × 10⁻²'],
            [3, '0,20', '0,05', '2,4 × 10⁻²']
          ],
          keterangan: 'Penyelesaian bertahap: (a) Cari orde Br₂ dengan membandingkan Percobaan 1 dan 2 ([NO] tetap = 0,10 M): \\[ \\left( \\frac{0{,}05}{0{,}10} \\right)^n = \\frac{6{,}0 \\times 10^{-3}}{1{,}2 \\times 10^{-2}} \\implies \\left(\\frac{1}{2}\\right)^n = \\frac{1}{2} \\implies n = 1 \\] (b) Cari orde NO dengan membandingkan Percobaan 1 dan 3 ([Br₂] tetap = 0,05 M): \\[ \\left( \\frac{0{,}10}{0{,}20} \\right)^m = \\frac{6{,}0 \\times 10^{-3}}{2{,}4 \\times 10^{-2}} \\implies \\left(\\frac{1}{2}\\right)^m = \\frac{1}{4} = \\left(\\frac{1}{2}\\right)^2 \\implies m = 2 \\] Maka persamaan laju reaksinya adalah: $v = k[\\text{NO}]^2[\\text{Br}_2]$ dengan orde total = 2 + 1 = 3.'
        }
      }
    ]
  }
];
