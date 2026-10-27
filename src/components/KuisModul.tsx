import React, { useState } from 'react';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, ArrowLeft, Award, HelpCircle } from 'lucide-react';
import { DATA_KUIS } from '../data/kuis';

interface KuisModulProps {
  modulId: string;
  skorSebelumnya?: number;
  onSelesaiKuis: (skor: number) => void;
  onKembaliKeModul: () => void;
  onKembaliKeBeranda: () => void;
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
  const [skorAkhir, setSkorAkhir] = useState<number>(0);

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

  const soalSekarang = dataKuis.soal[indexSoal];
  const totalSoal = dataKuis.soal.length;
  const sudahDijawab = jawabanDipilih[indexSoal] !== undefined;
  const jawabanSaya = jawabanDipilih[indexSoal];
  const isBenar = sudahDijawab && jawabanSaya === soalSekarang.kunci;

  const handlePilihJawaban = (label: string) => {
    if (sudahDijawab) return; // Kunci setelah dijawab agar siswa membaca penjelasan

    const jawabanBaru = { ...jawabanDipilih, [indexSoal]: label };
    setJawabanDipilih(jawabanBaru);

    // Hitung apakah sudah menjawab soal terakhir
    if (Object.keys(jawabanBaru).length === totalSoal) {
      let jumlahBenar = 0;
      dataKuis.soal.forEach((s, idx) => {
        if (jawabanBaru[idx] === s.kunci) {
          jumlahBenar++;
        }
      });
      const hitungSkor = Math.round((jumlahBenar / totalSoal) * 100);
      setSkorAkhir(hitungSkor);
      onSelesaiKuis(hitungSkor);
    }
  };

  const handleLanjut = () => {
    if (indexSoal < totalSoal - 1) {
      setIndexSoal(indexSoal + 1);
    } else {
      setSudahSelesai(true);
    }
  };

  const handleUlangiKuis = () => {
    setIndexSoal(0);
    setJawabanDipilih({});
    setSudahSelesai(false);
  };

  return (
    <div className="kuis-container" id="kuis-modul-wrapper">
      {/* Kuis Top Bar */}
      <div className="kuis-header">
        <button
          type="button"
          className="kuis-back-btn"
          onClick={onKembaliKeModul}
          title="Kembali ke membaca materi"
        >
          <ArrowLeft size={16} />
          <span>Kembali ke Materi</span>
        </button>

        <div className="kuis-progress-indicator">
          <span>Soal {indexSoal + 1} dari {totalSoal}</span>
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
        <div className="kuis-card">
          <div className="kuis-question-badge">
            <HelpCircle size={16} />
            <span>Pertanyaan No. {indexSoal + 1}</span>
          </div>

          <h3 className="kuis-question-text">{soalSekarang.pertanyaan}</h3>

          <div className="kuis-options-list">
            {soalSekarang.pilihan.map((opsi) => {
              const isSelected = jawabanSaya === opsi.label;
              const isKunci = opsi.label === soalSekarang.kunci;

              let kelasOpsi = 'kuis-option-item';
              if (sudahDijawab) {
                if (isKunci) {
                  kelasOpsi += ' option-correct';
                } else if (isSelected && !isBenar) {
                  kelasOpsi += ' option-wrong';
                } else {
                  kelasOpsi += ' option-disabled';
                }
              }

              return (
                <button
                  key={opsi.label}
                  type="button"
                  className={kelasOpsi}
                  onClick={() => handlePilihJawaban(opsi.label)}
                  disabled={sudahDijawab}
                >
                  <span className="option-label">{opsi.label}</span>
                  <span className="option-text">{opsi.teks}</span>
                  {sudahDijawab && isKunci && (
                    <CheckCircle2 size={18} className="option-icon text-emerald" />
                  )}
                  {sudahDijawab && isSelected && !isBenar && (
                    <XCircle size={18} className="option-icon text-rose" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Umpan Balik Langsung */}
          {sudahDijawab && (
            <div className={`kuis-feedback-box ${isBenar ? 'feedback-correct' : 'feedback-wrong'}`}>
              <div className="feedback-title-row">
                {isBenar ? (
                  <>
                    <CheckCircle2 size={20} className="text-emerald" />
                    <strong>Hebat, Jawaban Benar! 🎉</strong>
                  </>
                ) : (
                  <>
                    <XCircle size={20} className="text-rose" />
                    <strong>Jawaban Kurang Tepat (Kunci: Pilihan {soalSekarang.kunci})</strong>
                  </>
                )}
              </div>
              <p className="feedback-explanation">
                <strong>Penjelasan:</strong> {soalSekarang.penjelasan}
              </p>

              <div className="feedback-action-row">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleLanjut}
                >
                  <span>{indexSoal < totalSoal - 1 ? 'Soal Berikutnya' : 'Lihat Hasil Akhir'}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Ringkasan Skor Akhir */
        <div className="kuis-result-card">
          <div className="result-icon-wrapper">
            <Award size={48} className="result-trophy" />
          </div>

          <h2 className="result-title">Kuis Selesai!</h2>
          <p className="result-subtitle">{dataKuis.judulModul}</p>

          <div className="result-score-circle">
            <span className="result-score-number">{skorAkhir}</span>
            <span className="result-score-max">/ 100</span>
          </div>

          <div className="result-message">
            {skorAkhir === 100 && 'Sempurna! Anda telah menguasai konsep pada modul ini dengan luar biasa! 🌟'}
            {skorAkhir >= 80 && skorAkhir < 100 && 'Kerja sangat bagus! Pemahaman Anda terhadap materi sudah sangat solid. 👏'}
            {skorAkhir >= 60 && skorAkhir < 80 && 'Cukup baik! Anda bisa membaca kembali beberapa subtopik dan mengulang kuis untuk hasil maksimal. 👍'}
            {skorAkhir < 60 && 'Jangan berkecil hati! Buka kembali materi modul dan cermati contoh soal sebelum mencoba lagi. Semangat! 💪'}
          </div>

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
              <ArrowLeft size={16} />
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
      )}
    </div>
  );
};
