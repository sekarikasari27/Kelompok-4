import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Home,
  BookOpen,
  FlaskConical,
  Award,
  Users,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Compass
} from 'lucide-react';

interface ModalPanduanProps {
  isOpen: boolean;
  onClose: () => void;
}

interface StepPanduan {
  nomor: number;
  tag: string;
  judul: string;
  deskripsi: string;
  ikon: React.ReactNode;
  poinKunci: string[];
  temaWarna: 'cyan' | 'indigo' | 'purple' | 'amber' | 'emerald';
}

const DAFTAR_PANDUAN: StepPanduan[] = [
  {
    nomor: 1,
    tag: 'Tahap 1 – Beranda',
    judul: 'Pusat Navigasi Belajar Kimia Kelas XI',
    deskripsi:
      'Halaman beranda merupakan pusat kendali untuk mengakses seluruh materi laju reaksi fase F SMA. Di sini Anda dapat melihat ringkasan modul, capaian pembelajaran, serta akses cepat ke simulasi dan kuis.',
    ikon: <Home size={38} className="text-cyan" />,
    poinKunci: [
      'Akses instan ke seluruh modul pembelajaran',
      'Peta konsep dan tujuan pembelajaran kurikulum merdeka',
      'Informasi status akun dan progres belajar Anda'
    ],
    temaWarna: 'cyan'
  },
  {
    nomor: 2,
    tag: 'Tahap 2 – Modul Pembelajaran',
    judul: 'Tiga Modul Berurutan & Terstruktur',
    deskripsi:
      'LajuKu menyediakan tiga materi pembelajaran kimia yang disusun secara mendalam dan berurutan untuk memudahkan pemahaman konsep ilmiah:',
    ikon: <BookOpen size={38} className="text-indigo" />,
    poinKunci: [
      'Modul 1: Konsep Laju Reaksi & Molaritas',
      'Modul 2: Teori Tumbukan dan Faktor-faktor yang Mempengaruhi Laju Reaksi',
      'Modul 3: Persamaan Laju, Orde Reaksi, dan Penentuan Konstanta Laju'
    ],
    temaWarna: 'indigo'
  },
  {
    nomor: 3,
    tag: 'Tahap 3 – Laboratorium Virtual',
    judul: 'Simulasi Partikel Interaktif',
    deskripsi:
      'Bereksperimenlah di Laboratorium Virtual Teori Tumbukan. Anda dapat mengamati pergerakan partikel reaktan secara visual dalam wadah reaksi virtual.',
    ikon: <FlaskConical size={38} className="text-purple" />,
    poinKunci: [
      'Simulasi pengaruh konsentrasi dan luas permukaan partikel',
      'Pengaruh suhu terhadap energi kinetik partikel',
      'Visualisasi tumbukan efektif pembentuk produk reaksi'
    ],
    temaWarna: 'purple'
  },
  {
    nomor: 4,
    tag: 'Tahap 4 – Evaluasi Pembelajaran',
    judul: 'Kuis & Penyimpanan Nilai Otomatis',
    deskripsi:
      'Uji pemahaman Anda dengan mengerjakan soal evaluasi pilihan ganda pada setiap modul. Kunci jawaban dan pembahasan ilmiah lengkap akan disajikan di akhir pengerjaan.',
    ikon: <Award size={38} className="text-amber" />,
    poinKunci: [
      'Nilai dan skor tersimpan otomatis ke Cloud Firestore bagi siswa login',
      'Riwayat pengerjaan dapat dilihat kapan saja di menu Riwayat Nilai',
      'Pembahasan detail untuk memperkuat pemahaman konsep'
    ],
    temaWarna: 'amber'
  },
  {
    nomor: 5,
    tag: 'Tahap 5 – Akun Pengguna & Hak Akses',
    judul: 'Peran Siswa & Mode Guru Otomatis',
    deskripsi:
      'LajuKu memiliki sistem autentikasi pintar berbasis role-based access control (RBAC):',
    ikon: <Users size={38} className="text-emerald" />,
    poinKunci: [
      'Akun Siswa: Buat akun email gratis untuk menyimpan permanen hasil kuis & progres modul',
      'Mode Tamu: Belajar fleksibel tanpa login (data tidak disimpan saat sesi ditutup)',
      'Akun Guru: Deteksi otomatis untuk memantau rekap nilai dan progres seluruh siswa'
    ],
    temaWarna: 'emerald'
  }
];

export const ModalPanduan: React.FC<ModalPanduanProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  if (!isOpen) return null;

  const totalSteps = DAFTAR_PANDUAN.length;
  const stepAktif = DAFTAR_PANDUAN[currentStep];

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSelesai();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSelesai = () => {
    try {
      window.localStorage.setItem('lajuku:onboarding_selesai', 'true');
    } catch {
      // Abaikan
    }
    onClose();
  };

  return (
    <div className="panduan-overlay" onClick={handleSelesai} role="dialog" aria-modal="true">
      <div className="panduan-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Tombol Tutup */}
        <button
          type="button"
          className="panduan-close-btn"
          onClick={handleSelesai}
          aria-label="Tutup panduan"
          title="Tutup Panduan"
        >
          <X size={20} />
        </button>

        {/* Modal Top Header */}
        <div className="panduan-header">
          <div className="panduan-welcome-badge">
            <Sparkles size={14} className="text-cyan" />
            <span>Panduan Interaktif Pengguna</span>
          </div>
          <h2 className="panduan-main-title">Selamat Datang di LajuKu!</h2>
          <p className="panduan-subtitle">Yuk, Kenali Fitur dan Cara Belajar di LajuKu!</p>
        </div>

        {/* Step Progress Dots Bar */}
        <div className="panduan-progress-bar-wrapper">
          <div className="panduan-progress-track">
            <div
              className="panduan-progress-fill"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>

          <div className="panduan-dots-row">
            {DAFTAR_PANDUAN.map((step, idx) => (
              <button
                key={step.nomor}
                type="button"
                className={`panduan-dot-btn ${idx === currentStep ? 'active' : idx < currentStep ? 'completed' : ''}`}
                onClick={() => setCurrentStep(idx)}
                title={`Lompat ke ${step.tag}`}
              >
                <span>{step.nomor}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Slide Body Card */}
        <div className={`panduan-step-card theme-${stepAktif.temaWarna}`}>
          <div className="step-card-header">
            <div className="step-icon-circle">{stepAktif.ikon}</div>
            <div className="step-title-group">
              <span className="step-tag-pill">{stepAktif.tag}</span>
              <h3 className="step-title-text">{stepAktif.judul}</h3>
            </div>
          </div>

          <p className="step-desc-text">{stepAktif.deskripsi}</p>

          <div className="step-points-box">
            <span className="points-box-title">Poin Penting:</span>
            <ul className="step-points-list">
              {stepAktif.poinKunci.map((poin, pIdx) => (
                <li key={pIdx}>
                  <CheckCircle2 size={16} className={`text-${stepAktif.temaWarna}`} />
                  <span>{poin}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Navigation Buttons */}
        <div className="panduan-footer-actions">
          <button
            type="button"
            className="panduan-skip-btn"
            onClick={handleSelesai}
          >
            Lewati Panduan
          </button>

          <div className="panduan-nav-group">
            <button
              type="button"
              className="btn btn-secondary panduan-btn"
              onClick={handlePrev}
              disabled={currentStep === 0}
            >
              <ArrowLeft size={16} />
              <span>Sebelumnya</span>
            </button>

            {currentStep < totalSteps - 1 ? (
              <button
                type="button"
                className="btn btn-primary panduan-btn"
                onClick={handleNext}
              >
                <span>Selanjutnya</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-emerald panduan-btn btn-finish-onboarding"
                onClick={handleSelesai}
              >
                <Compass size={16} />
                <span>Mulai Belajar Sekarang</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
