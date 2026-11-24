import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Award,
  HelpCircle,
  AlertTriangle,
  BookOpen,
  Sparkles,
  Check,
  ChevronDown,
  ChevronUp,
  Flame,
  Home
} from 'lucide-react';
import { DATA_KUIS } from '../data/kuis';
import { TeksDenganRumus } from './MathFormula';

interface KuisModulProps {
  modulId: string;
  skorSebelumnya?: number;
  onSelesaiKuis: (skor: number) => void;
  onKembaliKeModul: () => void;
  onKembaliKeBeranda: () => void;
}

interface HasilEvaluasi {
  skor: number;
  persentase: number;
  jumlahBenar: number;
  jumlahSalah: number;
  totalSoal: number;
}

export const KuisModul: React.FC<KuisModulProps> = ({
  modulId,
  skorSebelumnya,
  onSelesaiKuis,
  onKembaliKeModul,
  onKembaliKeBeranda
}) => {
  const dataKuis = DATA_KUIS[modulId];

  const [indexSoal, setIndexSoal] = useState<number>(0);
  const [jawabanDipilih, setJawabanDipilih] = useState<Record<number, string>>({});
  const [sudahSelesai, setSudahSelesai] = useState<boolean>(false);
  const [hasil, setHasil] = useState<HasilEvaluasi | null>(null);
  const [pesanPeringatan, setPesanPeringatan] = useState<string | null>(null);

  // State Accordion untuk pembahasan jawaban
  const [expandedSoal, setExpandedSoal] = useState<Record<number, boolean>>({});

  if (!dataKuis) {
    return (
      <div className="kuis-container">
        <p>Data kuis untuk modul ini belum tersedia.</p>
        <button type="button" className="btn btn-secondary" onClick={onKembaliKeBeranda}>
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  const totalSoal = dataKuis.soal.length;
  const soalSekarang = dataKuis.soal[indexSoal];
  const jawabanSaya = jawabanDipilih[indexSoal];
  const totalTerjawab = Object.keys(jawabanDipilih).length;

  // Pemilihan jawaban: HANYA MENYIMPAN PILIHAN, TIDAK MENAMPILKAN HASIL BENAR/SALAH
  const handlePilihJawaban = (label: string) => {
    setJawabanDipilih((prev) => ({
      ...prev,
      [indexSoal]: label
    }));
    setPesanPeringatan(null);
  };

  const handleKeSoalSebelumnya = () => {
    if (indexSoal > 0) {
      setIndexSoal(indexSoal - 1);
      setPesanPeringatan(null);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleKeSoalBerikutnya = () => {
    if (indexSoal < totalSoal - 1) {
      setIndexSoal(indexSoal + 1);
      setPesanPeringatan(null);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleLompatKeSoal = (targetIdx: number) => {
    setIndexSoal(targetIdx);
    setPesanPeringatan(null);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Validasi dan pengumpulan seluruh kuis
  const handleSelesaikanKuis = () => {
    // Periksa apakah seluruh soal sudah dijawab
    const soalBelumDijawab: number[] = [];
    for (let i = 0; i < totalSoal; i++) {
      if (!jawabanDipilih[i]) {
        soalBelumDijawab.push(i + 1);
      }
    }

    if (soalBelumDijawab.length > 0) {
      setPesanPeringatan(
        `Ada ${soalBelumDijawab.length} soal yang belum dijawab (Soal No. ${soalBelumDijawab.join(', ')}). Mohon lengkapi seluruh jawaban sebelum menyelesaikan kuis.`
      );
      setIndexSoal(soalBelumDijawab[0] - 1);
      return;
    }

    // Evaluasi jawaban setelah tombol "Selesaikan Kuis" ditekan
    let jumlahBenar = 0;
    dataKuis.soal.forEach((s, idx) => {
      if (jawabanDipilih[idx] === s.kunci) {
        jumlahBenar++;
      }
    });

    const jumlahSalah = totalSoal - jumlahBenar;
    const hitungSkor = Math.round((jumlahBenar / totalSoal) * 100);

    const hasilAkhir: HasilEvaluasi = {
      skor: hitungSkor,
      persentase: hitungSkor,
      jumlahBenar,
      jumlahSalah,
      totalSoal
    };

    // Buka accordion soal pertama secara default, yang lain tertutup
    const initialAccordion: Record<number, boolean> = {};
    dataKuis.soal.forEach((_, idx) => {
      initialAccordion[idx] = true; // buka semua untuk kemudahan siswa
    });
    setExpandedSoal(initialAccordion);

    setHasil(hasilAkhir);
    setSudahSelesai(true);
    setPesanPeringatan(null);

    // Simpan progres skor kuis
    onSelesaiKuis(hitungSkor);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUlangiKuis = () => {
    setIndexSoal(0);
    setJawabanDipilih({});
    setSudahSelesai(false);
    setHasil(null);
    setPesanPeringatan(null);
    setExpandedSoal({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle satu accordion soal
  const toggleAccordionItem = (idx: number) => {
    setExpandedSoal((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  // Buka atau tutup semua accordion
  const handleToggleSemuaAccordion = (buka: boolean) => {
    const updated: Record<number, boolean> = {};
    dataKuis.soal.forEach((_, idx) => {
      updated[idx] = buka;
    });
    setExpandedSoal(updated);
  };

  // Pesan motivasi berdasarkan skor siswa
  const getPesanMotivasi = (skor: number) => {
    if (skor >= 90) {
      return {
        badge: 'Istimewa',
        title: 'Luar biasa! Kamu menguasai materi dengan sangat baik.',
        desc: 'Pemahamanmu terhadap konsep laju reaksi, teori tumbukan, dan perhitungannya sudah sangat matang. Pertahankan prestasimu!',
        themeClass: 'theme-gold',
        icon: <Award size={36} className="text-amber" />
      };
    }
    if (skor >= 80) {
      return {
        badge: 'Sangat Baik',
        title: 'Hebat! Pemahamanmu sudah sangat baik.',
        desc: 'Kamu telah memahami sebagian besar konsep dengan tepat. Pelajari pembahasan pada soal yang salah untuk hasil yang sempurna.',
        themeClass: 'theme-emerald',
        icon: <Sparkles size={36} className="text-emerald" />
      };
    }
    if (skor >= 70) {
      return {
        badge: 'Bagus',
        title: 'Bagus! Terus tingkatkan pemahamanmu.',
        desc: 'Kamu sudah memahami konsep dasar laju reaksi. Perhatikan pembahasan rumus dan grafik di bawah untuk memperdalam analisis.',
        themeClass: 'theme-cyan',
        icon: <Flame size={36} className="text-cyan" />
      };
    }
    return {
      badge: 'Perlu Latihan',
      title: 'Jangan menyerah! Yuk, pelajari kembali materi dan coba lagi.',
      desc: 'Setiap kesalahan adalah langkah belajar. Cermati pembahasan di bawah ini, pelajari modul kembali, lalu ulangi kuis untuk hasil lebih baik.',
      themeClass: 'theme-rose',
      icon: <AlertTriangle size={36} className="text-rose" />
    };
  };

  return (
    <div className="kuis-container" id="kuis-modul-wrapper">
      {/* Kuis Top Navigation Bar */}
      <div className="kuis-header">
        <button
          type="button"
          className="kuis-back-btn"
          onClick={onKembaliKeModul}
          title="Kembali ke membaca materi modul"
        >
          <ArrowLeft size={16} />
          <span>Kembali ke Materi</span>
        </button>

        <div className="kuis-progress-indicator">
          <span className="progress-text-label">
            {sudahSelesai ? 'Kuis Selesai' : `Soal ${indexSoal + 1} dari ${totalSoal}`}
          </span>
          <div className="kuis-progress-bar">
            <div
              className="kuis-progress-fill"
              style={{
                width: sudahSelesai ? '100%' : `${((indexSoal + 1) / totalSoal) * 100}%`
              }}
            />
          </div>
        </div>

        {skorSebelumnya !== undefined && (
          <div className="kuis-prev-score">
            Skor Sebelumnya: <strong>{skorSebelumnya}%</strong>
          </div>
        )}
      </div>

      {!sudahSelesai ? (
        /* =========================================================================
           TAMPILAN PENGERJAAN SOAL (TIDAK ADA HASIL LANGSUNG)
           ========================================================================= */
        <div className="kuis-card">
          {/* Header Soal & Navigasi Nomor */}
          <div className="kuis-question-topbar">
            <div className="kuis-question-badge">
              <HelpCircle size={16} />
              <span>Pertanyaan #{indexSoal + 1}</span>
            </div>

            {/* Quick Question Number Jump Pills */}
            <div className="kuis-number-navigator" aria-label="Navigasi cepat nomor soal">
              {dataKuis.soal.map((_, qIdx) => {
                const isCurrent = qIdx === indexSoal;
                const isFilled = jawabanDipilih[qIdx] !== undefined;

                return (
                  <button
                    key={qIdx}
                    type="button"
                    className={`nav-number-btn ${isCurrent ? 'current' : ''} ${isFilled ? 'filled' : 'empty'}`}
                    onClick={() => handleLompatKeSoal(qIdx)}
                    title={`Lompat ke Soal ${qIdx + 1}${isFilled ? ' (Sudah Dijawab)' : ' (Belum Dijawab)'}`}
                  >
                    <span>{qIdx + 1}</span>
                    {isFilled && <span className="answered-dot" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Teks Pertanyaan */}
          <div className="kuis-question-text">
            <TeksDenganRumus teks={soalSekarang.pertanyaan} />
          </div>

          {/* Alert Peringatan Jika Masih Ada Soal Belum Lengkap */}
          {pesanPeringatan && (
            <div className="kuis-warning-alert" role="alert">
              <AlertTriangle size={18} className="text-amber flex-shrink-0" />
              <span>{pesanPeringatan}</span>
            </div>
          )}

          {/* Daftar Pilihan Jawaban */}
          <div className="kuis-options-list">
            {soalSekarang.pilihan.map((opsi) => {
              const isSelected = jawabanSaya === opsi.label;

              return (
                <button
                  key={opsi.label}
                  type="button"
                  className={`kuis-option-item ${isSelected ? 'option-selected' : ''}`}
                  onClick={() => handlePilihJawaban(opsi.label)}
                >
                  <span className={`option-label ${isSelected ? 'label-active' : ''}`}>
                    {opsi.label}
                  </span>
                  <span className="option-text">
                    <TeksDenganRumus teks={opsi.teks} />
                  </span>
                  {isSelected && (
                    <span className="selected-check-badge">
                      <Check size={16} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Action Buttons: Sebelumnya, Selanjutnya, Selesaikan Kuis */}
          <div className="kuis-nav-actions-footer">
            <button
              type="button"
              className="btn btn-secondary kuis-nav-btn"
              onClick={handleKeSoalSebelumnya}
              disabled={indexSoal === 0}
            >
              <ArrowLeft size={16} />
              <span>Sebelumnya</span>
            </button>

            <div className="kuis-answered-summary">
              <span>{totalTerjawab} dari {totalSoal} soal terjawab</span>
            </div>

            {indexSoal < totalSoal - 1 ? (
              <button
                type="button"
                className="btn btn-primary kuis-nav-btn"
                onClick={handleKeSoalBerikutnya}
              >
                <span>Selanjutnya</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-emerald kuis-nav-btn btn-finish-quiz"
                onClick={handleSelesaikanKuis}
              >
                <CheckCircle2 size={16} />
                <span>Selesaikan Kuis</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* =========================================================================
           HALAMAN HASIL AKHIR (DESAIN ULANG INTERAKTIF & LENGKAP)
           ========================================================================= */
        <div className="kuis-result-container">
          {/* Header Card dengan Trophy Visual & Skor Fokus Utama */}
          <div className="kuis-result-header-card">
            <div className="result-celebration-badge">
              <Sparkles size={16} className="text-amber" />
              <span>Evaluasi Pembelajaran</span>
            </div>

            <h1 className="result-main-title">Kuis Selesai!</h1>
            <p className="result-modul-subtitle">{dataKuis.judulModul}</p>

            {hasil && (
              <>
                {/* Hero Focus: Big Score Display */}
                <div className="result-score-hero">
                  <div className="result-score-circle">
                    <div className="score-inner-glow" />
                    <span className="score-hero-number">{hasil.skor}</span>
                    <span className="score-hero-denom">/ 100</span>
                    <span className="score-hero-label">SKOR AKHIR</span>
                  </div>
                </div>

                {/* Kartu Informasi Metrik (Result Cards) */}
                <div className="result-metrics-grid">
                  <div className="metric-card card-percent">
                    <span className="metric-label">Persentase Nilai</span>
                    <div className="metric-val-wrap">
                      <span className="metric-number text-cyan">{hasil.persentase}%</span>
                    </div>
                    <span className="metric-subtext">Ketuntasan Materi</span>
                  </div>

                  <div className="metric-card card-correct">
                    <span className="metric-label">Jawaban Benar</span>
                    <div className="metric-val-wrap">
                      <CheckCircle2 size={22} className="text-emerald" />
                      <span className="metric-number text-emerald">{hasil.jumlahBenar}</span>
                    </div>
                    <span className="metric-subtext">dari {hasil.totalSoal} Soal</span>
                  </div>

                  <div className="metric-card card-wrong">
                    <span className="metric-label">Jawaban Salah</span>
                    <div className="metric-val-wrap">
                      <XCircle size={22} className="text-rose" />
                      <span className="metric-number text-rose">{hasil.jumlahSalah}</span>
                    </div>
                    <span className="metric-subtext">Perlu dipelajari lagi</span>
                  </div>

                  <div className="metric-card card-total">
                    <span className="metric-label">Total Soal</span>
                    <div className="metric-val-wrap">
                      <HelpCircle size={22} className="text-purple" />
                      <span className="metric-number text-purple">{hasil.totalSoal}</span>
                    </div>
                    <span className="metric-subtext">Pilihan Ganda</span>
                  </div>
                </div>

                {/* Pesan Apresiasi & Motivasi Berdasarkan Skor */}
                {(() => {
                  const motivasi = getPesanMotivasi(hasil.skor);
                  return (
                    <div className={`result-feedback-card ${motivasi.themeClass}`}>
                      <div className="feedback-card-icon">
                        {motivasi.icon}
                      </div>
                      <div className="feedback-card-text">
                        <div className="feedback-header-row">
                          <span className="feedback-pill-badge">{motivasi.badge}</span>
                          <h3 className="feedback-headline">{motivasi.title}</h3>
                        </div>
                        <p className="feedback-body-desc">{motivasi.desc}</p>
                      </div>
                    </div>
                  );
                })()}

                {/* Tombol Navigasi Setelah Kuis */}
                <div className="result-action-bar">
                  <button
                    type="button"
                    className="btn btn-secondary result-nav-btn"
                    onClick={handleUlangiKuis}
                  >
                    <RotateCcw size={18} />
                    <span>Ulangi Kuis</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary result-nav-btn"
                    onClick={onKembaliKeModul}
                  >
                    <BookOpen size={18} />
                    <span>Pelajari Materi</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-primary result-nav-btn"
                    onClick={onKembaliKeBeranda}
                  >
                    <Home size={18} />
                    <span>Kembali ke Beranda</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* =====================================================================
             PEMBAHASAN JAWABAN (ACCORDION / COLLAPSIBLE INTERAKTIF)
             ===================================================================== */}
          <div className="kuis-review-section">
            <div className="review-section-header-bar">
              <div className="review-title-group">
                <h3 className="section-title-clean">Pembahasan & Evaluasi Jawaban</h3>
                <p className="section-subtitle-clean">
                  Cermati kunci jawaban dan ulasan ilmiah berikut untuk memperkuat pemahamanmu.
                </p>
              </div>

              {/* Tombol Kontrol Buka / Tutup Semua Accordion */}
              <div className="accordion-controls">
                <button
                  type="button"
                  className="accordion-control-btn"
                  onClick={() => handleToggleSemuaAccordion(true)}
                  title="Buka seluruh pembahasan soal"
                >
                  <ChevronDown size={14} />
                  <span>Buka Semua</span>
                </button>
                <button
                  type="button"
                  className="accordion-control-btn"
                  onClick={() => handleToggleSemuaAccordion(false)}
                  title="Tutup seluruh pembahasan soal"
                >
                  <ChevronUp size={14} />
                  <span>Tutup Semua</span>
                </button>
              </div>
            </div>

            <div className="kuis-review-list">
              {dataKuis.soal.map((soal, idx) => {
                const userChoice = jawabanDipilih[idx];
                const isCorrect = userChoice === soal.kunci;
                const isExpanded = expandedSoal[idx] !== false; // default true
                const opsiUser = soal.pilihan.find((p) => p.label === userChoice);
                const opsiKunci = soal.pilihan.find((p) => p.label === soal.kunci);

                return (
                  <div
                    key={soal.id}
                    className={`review-accordion-item ${isCorrect ? 'is-correct' : 'is-wrong'}`}
                  >
                    {/* Accordion Header / Trigger Button */}
                    <button
                      type="button"
                      className="review-accordion-header"
                      onClick={() => toggleAccordionItem(idx)}
                      aria-expanded={isExpanded}
                    >
                      <div className="accordion-header-left">
                        <span className="review-soal-num">Soal #{soal.nomor}</span>
                        {isCorrect ? (
                          <span className="review-status-pill pill-correct">
                            <CheckCircle2 size={14} /> Jawaban Benar
                          </span>
                        ) : (
                          <span className="review-status-pill pill-wrong">
                            <XCircle size={14} /> Jawaban Salah
                          </span>
                        )}
                        <span className="accordion-question-preview">
                          <TeksDenganRumus teks={soal.pertanyaan} />
                        </span>
                      </div>

                      <div className="accordion-header-right">
                        <span className="review-key-tag">
                          Kunci: <strong>Pilihan {soal.kunci}</strong>
                        </span>
                        {isExpanded ? (
                          <ChevronUp size={18} className="accordion-chevron" />
                        ) : (
                          <ChevronDown size={18} className="accordion-chevron" />
                        )}
                      </div>
                    </button>

                    {/* Accordion Content Body */}
                    {isExpanded && (
                      <div className="review-accordion-body">
                        {/* Comparison: Jawaban Siswa vs Kunci Jawaban */}
                        <div className="review-answers-box">
                          <div className="answer-row">
                            <span className="answer-label">Jawaban Anda:</span>
                            {opsiUser ? (
                              <span className={`answer-val ${isCorrect ? 'text-emerald' : 'text-rose'}`}>
                                <strong>({opsiUser.label})</strong> <TeksDenganRumus teks={opsiUser.teks} />
                              </span>
                            ) : (
                              <span className="text-muted">(Tidak dijawab)</span>
                            )}
                          </div>

                          {!isCorrect && opsiKunci && (
                            <div className="answer-row">
                              <span className="answer-label">Kunci Jawaban:</span>
                              <span className="answer-val text-emerald">
                                <strong>({opsiKunci.label})</strong> <TeksDenganRumus teks={opsiKunci.teks} />
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Penjelasan Ilmiah / Pembahasan */}
                        <div className="review-explanation-box">
                          <div className="exp-title">
                            <Sparkles size={16} className="text-amber" />
                            <strong>Pembahasan Ilmiah:</strong>
                          </div>
                          <div className="exp-content">
                            <TeksDenganRumus teks={soal.penjelasan} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
