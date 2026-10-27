export interface PilihanJawaban {
  label: string; // 'A' | 'B' | 'C' | 'D' | 'E'
  teks: string;
}

export interface SoalKuis {
  id: string;
  nomor: number;
  pertanyaan: string;
  pilihan: PilihanJawaban[];
  kunci: string;
  penjelasan: string;
}

export interface KuisModulData {
  modulId: string;
  judulModul: string;
  soal: SoalKuis[];
}

export const DATA_KUIS: Record<string, KuisModulData> = {
  'modul-1': {
    modulId: 'modul-1',
    judulModul: 'Kuis Modul 1: Konsep Laju Reaksi',
    soal: [
      {
        id: 'm1-s1',
        nomor: 1,
        pertanyaan: 'Manakah pernyataan yang paling tepat mengenai pengertian laju reaksi dalam larutan homogen?',
        pilihan: [
          { label: 'A', teks: 'Laju berkurangnya konsentrasi produk atau bertambahnya konsentrasi reaktan per satuan waktu' },
          { label: 'B', teks: 'Laju berkurangnya konsentrasi reaktan atau bertambahnya konsentrasi produk per satuan waktu' },
          { label: 'C', teks: 'Waktu yang dibutuhkan agar seluruh pereaksi habis bereaksi secara sempurna' },
          { label: 'D', teks: 'Perubahan massa total wadah reaksi dibagi dengan volume larutan' },
          { label: 'E', teks: 'Jumlah mol senyawa baru yang terbentuk tanpa memperhitungkan volume larutan' }
        ],
        kunci: 'B',
        penjelasan: 'Laju reaksi menyatakan laju berkurangnya konsentrasi pereaksi (reaktan) atau laju bertambahnya konsentrasi hasil reaksi (produk) per satuan waktu, dirumuskan r = -Δ[Reaktan]/Δt = +Δ[Produk]/Δt.'
      },
      {
        id: 'm1-s2',
        nomor: 2,
        pertanyaan: 'Satuan standar internasional yang digunakan secara konsisten untuk menyatakan laju reaksi dalam fasa larutan adalah...',
        pilihan: [
          { label: 'A', teks: 'mol / detik' },
          { label: 'B', teks: 'gram / detik' },
          { label: 'C', teks: 'M/s (molaritas per detik)' },
          { label: 'D', teks: 'liter / detik' },
          { label: 'E', teks: 'M × s' }
        ],
        kunci: 'C',
        penjelasan: 'Satuan konsentrasi molaritas adalah M (mol/L) dan satuan waktu adalah detik (s). Oleh karena itu, satuan standar laju reaksi dinyatakan dalam M/s.'
      },
      {
        id: 'm1-s3',
        nomor: 3,
        pertanyaan: 'Pada reaksi: N₂(g) + 3H₂(g) → 2NH₃(g), jika laju pembentukan gas NH₃ terukur sebesar 0,40 M/s, berapakah laju pengurangan gas H₂ pada saat yang sama?',
        pilihan: [
          { label: 'A', teks: '0,20 M/s' },
          { label: 'B', teks: '0,40 M/s' },
          { label: 'C', teks: '0,60 M/s' },
          { label: 'D', teks: '0,80 M/s' },
          { label: 'E', teks: '1,20 M/s' }
        ],
        kunci: 'C',
        penjelasan: 'Perbandingan laju zat berbanding lurus dengan koefisien reaksinya. v_H₂ : v_NH₃ = 3 : 2. Maka v_H₂ = (3/2) × v_NH₃ = (3/2) × 0,40 M/s = 0,60 M/s.'
      },
      {
        id: 'm1-s4',
        nomor: 4,
        pertanyaan: 'Dalam suatu reaksi tertutup: 2A + B → A₂B, laju reaksi dapat dinyatakan dengan persamaan berikut, KECUALI...',
        pilihan: [
          { label: 'A', teks: 'v = -1/2 (Δ[A] / Δt)' },
          { label: 'B', teks: 'v = -(Δ[B] / Δt)' },
          { label: 'C', teks: 'v = +(Δ[A₂B] / Δt)' },
          { label: 'D', teks: 'v = +1/2 (Δ[A] / Δt)' },
          { label: 'E', teks: 'v_A = 2 × v_B' }
        ],
        kunci: 'D',
        penjelasan: 'Zat A adalah reaktan, sehingga konsentrasinya berkurang seiring waktu (harus bertanda minus). Oleh sebab itu, v = +1/2 (Δ[A]/Δt) adalah pernyataan yang keliru.'
      },
      {
        id: 'm1-s5',
        nomor: 5,
        pertanyaan: 'Grafik perubahan konsentrasi reaktan terhadap waktu pada reaksi kimia normal akan memperlihatkan pola...',
        pilihan: [
          { label: 'A', teks: 'Kurva mendatar konstan sejak detik pertama' },
          { label: 'B', teks: 'Kurva turun curam di awal, kemudian semakin melandai mendekati kesetimbangan' },
          { label: 'C', teks: 'Garis lurus vertikal tegak lurus sumbu konsentrasi' },
          { label: 'D', teks: 'Kurva naik melengkung ke atas' },
          { label: 'E', teks: 'Kurva berbentuk gelombang sinus bolak-balik' }
        ],
        kunci: 'B',
        penjelasan: 'Pada awal reaksi konsentrasi reaktan masih tinggi sehingga reaksi berlangsung cepat (kurva turun curam). Seiring reaktan berkurang, frekuensi tumbukan menurun dan laju reaksi melambat (kurva melandai).'
      }
    ]
  },
  'modul-2': {
    modulId: 'modul-2',
    judulModul: 'Kuis Modul 2: Teori Tumbukan dan Faktor Laju Reaksi',
    soal: [
      {
        id: 'm2-s1',
        nomor: 1,
        pertanyaan: 'Menurut teori tumbukan, dua syarat yang harus dipenuhi agar tumbukan antarmolekul menghasilkan reaksi kimia (tumbukan efektif) adalah...',
        pilihan: [
          { label: 'A', teks: 'Massa partikel identik dan volume bejana diperbesar' },
          { label: 'B', teks: 'Orientasi tumbukan tepat dan energi kinetik partikel ≥ Energi Aktivasi (Eₐ)' },
          { label: 'C', teks: 'Suhu reaksi diturunkan dan tekanan wadah dinolkan' },
          { label: 'D', teks: 'Partikel bermuatan netral dan berada dalam fasa gas' },
          { label: 'E', teks: 'Nilai perubahan entalpi (ΔH) bernilai nol' }
        ],
        kunci: 'B',
        penjelasan: 'Tumbukan efektif membutuhkan arah tabrakan (orientasi) yang tepat dan energi kinetik partikel yang cukup untuk melampaui bukit batas energi aktivasi (Eₐ).'
      },
      {
        id: 'm2-s2',
        nomor: 2,
        pertanyaan: 'Mengapa kenaikan konsentrasi larutan dapat mempercepat laju reaksi kimia?',
        pilihan: [
          { label: 'A', teks: 'Karena menurunkan nilai energi aktivasi reaksi' },
          { label: 'B', teks: 'Karena meningkatkan jumlah partikel per satuan volume sehingga peluang frekuensi tumbukan bertambah' },
          { label: 'C', teks: 'Karena menaikkan nilai perubahan entalpi reaksi (ΔH)' },
          { label: 'D', teks: 'Karena mengubah reaksi endoterm menjadi reaksi eksoterm' },
          { label: 'E', teks: 'Karena memperbesar ukuran fisik molekul zat terlarut' }
        ],
        kunci: 'B',
        penjelasan: 'Konsentrasi yang lebih tinggi membuat partikel lebih rapat per satuan volume. Akibatnya, frekuensi tumbukan antarpartikel per satuan waktu meningkat, memperbanyak tumbukan efektif.'
      },
      {
        id: 'm2-s3',
        nomor: 3,
        pertanyaan: 'Massa yang sama dari padatan kalsium karbonat direaksikan dengan larutan HCl 1 M: CaCO₃(s) + 2HCl(aq) → CaCl₂(aq) + H₂O(l) + CO₂(g). Bentuk CaCO₃ manakah yang akan menghasilkan gas CO₂ paling cepat?',
        pilihan: [
          { label: 'A', teks: 'Satu bongkahan kristal padat utuh' },
          { label: 'B', teks: 'Kepingan batu berukuran sedang' },
          { label: 'C', teks: 'Serbuk halus (bubuk)' },
          { label: 'D', teks: 'Batang silinder silikat' },
          { label: 'E', teks: 'Semua bentuk menghasilkan gas CO₂ dengan kecepatan yang persis sama' }
        ],
        kunci: 'C',
        penjelasan: 'Serbuk halus memiliki luas permukaan bidang sentuh total yang jauh lebih besar daripada kepingan atau bongkahan, sehingga partikel ion H⁺ dari asam dapat bertumbukan di lebih banyak titik permukaan secara serentak.'
      },
      {
        id: 'm2-s4',
        nomor: 4,
        pertanyaan: 'Bagaimanakah prinsip kerja katalis dalam mempercepat laju reaksi kimia?',
        pilihan: [
          { label: 'A', teks: 'Menaikkan suhu larutan secara spontan' },
          { label: 'B', teks: 'Menyediakan mekanisme jalur reaksi alternatif dengan Energi Aktivasi (Eₐ) yang lebih rendah' },
          { label: 'C', teks: 'Mengubah nilai perubahan entalpi reaksi (ΔH) menjadi lebih negatif' },
          { label: 'D', teks: 'Meningkatkan energi kinetik rata-rata partikel reaktan' },
          { label: 'E', teks: 'Memperbanyak jumlah hasil produk akhir yang terbentuk' }
        ],
        kunci: 'B',
        penjelasan: 'Katalis bekerja dengan menurunkan bukit energi aktivasi (Eₐ) melalui jalur mekanisme reaksi baru, sehingga persentase partikel yang mampu melampaui Eₐ bertambah drastis tanpa mengubah ΔH reaksi.'
      },
      {
        id: 'm2-s5',
        nomor: 5,
        pertanyaan: 'Suatu reaksi memiliki aturan laju: setiap kenaikan suhu 10 °C laju reaksi meningkat 2 kali lipat. Jika pada suhu 25 °C laju reaksi adalah 0,05 M/s, berapakah laju reaksi pada suhu 55 °C?',
        pilihan: [
          { label: 'A', teks: '0,10 M/s' },
          { label: 'B', teks: '0,20 M/s' },
          { label: 'C', teks: '0,40 M/s' },
          { label: 'D', teks: '0,80 M/s' },
          { label: 'E', teks: '1,60 M/s' }
        ],
        kunci: 'C',
        penjelasan: 'Kenaikan suhu ΔT = 55 °C - 25 °C = 30 °C. Jumlah kenaikan 10 °C adalah n = 30 / 10 = 3 kali. Laju reaksi baru = 0,05 × 2³ = 0,05 × 8 = 0,40 M/s.'
      }
    ]
  },
  'modul-3': {
    modulId: 'modul-3',
    judulModul: 'Kuis Modul 3: Persamaan Laju dan Orde Reaksi',
    soal: [
      {
        id: 'm3-s1',
        nomor: 1,
        pertanyaan: 'Untuk reaksi: A + 2B → C, persamaan laju reaksinya dituliskan sebagai v = k[A]ᵐ[B]ⁿ. Manakah pernyataan yang BENAR mengenai penentuan nilai m dan n?',
        pilihan: [
          { label: 'A', teks: 'Nilai m pasti 1 dan n pasti 2 sesuai koefisien reaksinya' },
          { label: 'B', teks: 'Nilai m dan n hanya dapat diperoleh dari analisis data hasil percobaan eksperimen' },
          { label: 'C', teks: 'Nilai m dan n selalu bernilai positif dan bulat' },
          { label: 'D', teks: 'Orde reaksi selalu sebanding dengan perubahan entalpi (ΔH)' },
          { label: 'E', teks: 'Nilai m dan n didapatkan langsung dari massa molekul relatif (Mr)' }
        ],
        kunci: 'B',
        penjelasan: 'Orde reaksi adalah besaran empiris (eksperimental). Nilainya tidak ditentukan oleh koefisien stokiometri persamaan reaksi setara, melainkan harus diteliti lewat data percobaan laboratorium.'
      },
      {
        id: 'm3-s2',
        nomor: 2,
        pertanyaan: 'Jika suatu reaksi memiliki orde reaksi 0 terhadap reaktan A (v = k[A]⁰), apa yang terjadi pada laju reaksi bila konsentrasi [A] dinaikkan 4 kali lipat?',
        pilihan: [
          { label: 'A', teks: 'Laju reaksi meningkat 4 kali lipat' },
          { label: 'B', teks: 'Laju reaksi meningkat 16 kali lipat' },
          { label: 'C', teks: 'Laju reaksi tetap sama (tidak terpengaruh)' },
          { label: 'D', teks: 'Laju reaksi menjadi 1/4 kali semula' },
          { label: 'E', teks: 'Reaksi berhenti seketika' }
        ],
        kunci: 'C',
        penjelasan: 'Pada reaksi berorde nol, pangkat konsentrasi adalah 0 ([A]⁰ = 1). Artinya, perubahan konsentrasi reaktan sama sekali tidak memengaruhi besarnya laju reaksi (v = k).'
      },
      {
        id: 'm3-s3',
        nomor: 3,
        pertanyaan: 'Data percobaan reaksi A + B → C:\n(1) [A] = 0,1 M, [B] = 0,1 M, v = 4 M/s\n(2) [A] = 0,2 M, [B] = 0,1 M, v = 16 M/s\nBerapakah orde reaksi terhadap zat A?',
        pilihan: [
          { label: 'A', teks: '0' },
          { label: 'B', teks: '1' },
          { label: 'C', teks: '2' },
          { label: 'D', teks: '3' },
          { label: 'E', teks: '4' }
        ],
        kunci: 'C',
        penjelasan: 'Bandingkan percobaan 1 dan 2 ([B] tetap): ([A]₂ / [A]₁)ᵐ = (v₂ / v₁) ⇒ (0,2 / 0,1)ᵐ = (16 / 4) ⇒ 2ᵐ = 4 ⇒ 2ᵐ = 2² ⇒ m = 2. Jadi orde reaksi terhadap A adalah 2.'
      },
      {
        id: 'm3-s4',
        nomor: 4,
        pertanyaan: 'Jika suatu reaksi memiliki persamaan laju: v = k[P][Q]², maka orde total dari reaksi tersebut adalah...',
        pilihan: [
          { label: 'A', teks: '1' },
          { label: 'B', teks: '2' },
          { label: 'C', teks: '3' },
          { label: 'D', teks: '4' },
          { label: 'E', teks: '0' }
        ],
        kunci: 'C',
        penjelasan: 'Orde total adalah penjumlahan dari seluruh pangkat reaktan pada hukum laju: [P] berpangkat 1 dan [Q] berpangkat 2, sehingga Orde Total = 1 + 2 = 3.'
      },
      {
        id: 'm3-s5',
        nomor: 5,
        pertanyaan: 'Untuk reaksi berorde satu: v = k[A]¹, satuan tetapan laju reaksi k adalah...',
        pilihan: [
          { label: 'A', teks: 'M/s' },
          { label: 'B', teks: 's⁻¹ (1/detik)' },
          { label: 'C', teks: 'M⁻¹ s⁻¹' },
          { label: 'D', teks: 'M⁻² s⁻¹' },
          { label: 'E', teks: 'M² s⁻¹' }
        ],
        kunci: 'B',
        penjelasan: 'Dari v = k[A]¹, maka k = v / [A]. Satuan k = (M/s) / M = 1/s = s⁻¹.'
      }
    ]
  }
};
