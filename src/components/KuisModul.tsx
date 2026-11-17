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
  Check
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
    // Periksa apakah semua soal sudah dijawab
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
      // Lompat ke soal pertama yang belum dijawab
      setIndexSoal(soalBelumDijawab[0] - 1);
      return;
    }

    // Evaluasi seluruh jawaban setelah tombol "Selesaikan Kuis" ditekan
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            Soal {indexSoal + 1} dari {totalSoal}
          </span>
          <div className="kuis-progress-bar">
            <div
              className="kuis-progress-fill"
              style={{ width: `${((indexSoal + 1) / totalSoal) * 100}%` }}
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
           HALAMAN HASIL AKHIR (EVALUASI SETELAH KUIS DIKUMPULKAN)
           ========================================================================= */
        <div className="kuis-result-container">
          <div className="kuis-result-header-card">
            <div className="result-icon-wrapper">
              <Award size={48} className="result-trophy text-amber" />
            </div>

            <h2 className="result-title">Hasil Evaluasi Kuis</h2>
            <p className="result-subtitle">{dataKuis.judulModul}</p>

            {/* Score Metrics Grid */}
            {hasil && (
              <div className="result-metrics-grid">
                <div className="metric-card metric-score">
                  <span className="metric-label">Skor Akhir</span>
                  <div className="metric-val-wrap">
                    <span className="metric-number">{hasil.skor}</span>
                    <span className="metric-max">/ 100</span>
                  </div>
                </div>

                <div className="metric-card metric-percent">
                  <span className="metric-label">Persentase Nilai</span>
                  <div className="metric-val-wrap">
                    <span className="metric-number text-cyan">{hasil.persentase}%</span>
                  </div>
                </div>

                <div className="metric-card metric-correct">
                  <span className="metric-label">Jawaban Benar</span>
                  <div className="metric-val-wrap">
                    <CheckCircle2 size={22} className="text-emerald" />
                    <span className="metric-number text-emerald">{hasil.jumlahBenar}</span>
                    <span className="metric-max">Soal</span>
                  </div>
                </div>

                <div className="metric-card metric-wrong">
                  <span className="metric-label">Jawaban Salah</span>
                  <div className="metric-val-wrap">
                    <XCircle size={22} className="text-rose" />
                    <span className="metric-number text-rose">{hasil.jumlahSalah}</span>
                    <span className="metric-max">Soal</span>
                  </div>
                </div>
              </div>
            )}

            {/* Result Feedback Banner */}
            {hasil && (
              <div className="result-feedback-banner">
                {hasil.skor >= 75 ? (
                  <div className="feedback-pass">
                    <Sparkles size={20} className="text-emerald" />
                    <span>
                      <strong>Selamat, Anda Tuntas (KKTP)!</strong> Pemahaman Anda pada materi modul ini sangat baik. Silakan pelajari pembahasan soal di bawah ini untuk memperdalam konsep.
                    </span>
                  </div>
                ) : (
                  <div className="feedback-remedial">
                    <AlertTriangle size={20} className="text-amber" />
                    <span>
                      <strong>Perlu Pemantapan Materi.</strong> Anda belum mencapai kriteria ketuntasan (75). Cermati pembahasan di bawah ini, baca kembali modul, lalu ulangi kuis.
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons Top */}
            <div className="result-buttons-group">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleUlangiKuis}
              >
                <RotateCcw size={16} />
                <span>Ulangi Kuis</span>
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={onKembaliKeModul}
              >
                <BookOpen size={16} />
                <span>Kembali ke Materi</span>
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={onKembaliKeBeranda}
              >
                <span>Kembali ke Beranda</span>
              </button>
            </div>
          </div>

          {/* =====================================================================
             PEMBAHASAN & KUNCI JAWABAN LENGKAP SETIAP SOAL
             ===================================================================== */}
          <div className="kuis-review-section">
            <div className="review-section-header">
              <h3 className="section-title-clean">Pembahasan Lengkap & Kunci Jawaban</h3>
              <p className="section-subtitle-clean">
                Pelajari evaluasi setiap butir soal untuk memahami konsep ilmiah dan alasan jawaban yang benar.
              </p>
            </div>

            <div className="kuis-review-list">
              {dataKuis.soal.map((soal, idx) => {
                const userChoice = jawabanDipilih[idx];
                const isCorrect = userChoice === soal.kunci;
                const opsiUser = soal.pilihan.find((p) => p.label === userChoice);
                const opsiKunci = soal.pilihan.find((p) => p.label === soal.kunci);

                return (
                  <div
                    key={soal.id}
                    className={`review-card ${isCorrect ? 'review-correct' : 'review-wrong'}`}
                  >
                    <div className="review-card-header">
                      <div className="review-badge-row">
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
                      </div>

                      <span className="review-key-tag">
                        Kunci: <strong>Pilihan {soal.kunci}</strong>
                      </span>
                    </div>

                    <div className="review-question-text">
                      <TeksDenganRumus teks={soal.pertanyaan} />
                    </div>

                    {/* Comparison: Jawaban Siswa vs Kunci */}
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
                          <span className="answer-label">Jawaban Benar:</span>
                          <span className="answer-val text-emerald">
                            <strong>({opsiKunci.label})</strong> <TeksDenganRumus teks={opsiKunci.teks} />
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Penjelasan Ilmiah */}
                    <div className="review-explanation-box">
                      <div className="exp-title">
                        <Sparkles size={15} className="text-amber" />
                        <strong>Pembahasan Ilmiah:</strong>
                      </div>
                      <div className="exp-content">
                        <TeksDenganRumus teks={soal.penjelasan} />
                      </div>
                    </div>
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
