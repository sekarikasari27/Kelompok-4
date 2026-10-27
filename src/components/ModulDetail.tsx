import React from 'react';
import { ArrowLeft, ArrowRight, HelpCircle, Clock, BookOpen } from 'lucide-react';
import type { ModulData } from '../data/modul';
import { SimulasiTumbukan } from './SimulasiTumbukan';

interface ModulDetailProps {
  modul: ModulData;
  skorKuis?: number;
  onKembaliKeBeranda: () => void;
  onMulaiKuis: () => void;
  onNavigasiModul: (modulId: string) => void;
}

export const ModulDetail: React.FC<ModulDetailProps> = ({
  modul,
  skorKuis,
  onKembaliKeBeranda,
  onMulaiKuis,
  onNavigasiModul
}) => {
  const modulSebelumnyaId = modul.nomor > 1 ? `modul-${modul.nomor - 1}` : null;
  const modulBerikutnyaId = modul.nomor < 3 ? `modul-${modul.nomor + 1}` : null;

  return (
    <article className="modul-detail-container" id="modul-content-view">
      {/* Top Breadcrumb & Actions */}
      <div className="modul-detail-nav">
        <button
          type="button"
          className="back-link-btn"
          onClick={onKembaliKeBeranda}
        >
          <ArrowLeft size={16} />
          <span>Kembali ke Beranda</span>
        </button>

        <div className="modul-detail-meta">
          <span className="modul-number-badge">Modul {modul.nomor} dari 3</span>
          <span className="reading-time">
            <Clock size={14} />
            <span>Estimasi {modul.waktuBacaMenit} menit</span>
          </span>
          {skorKuis !== undefined && (
            <span className="quiz-score-badge">
              Skor Kuis: {skorKuis}%
            </span>
          )}
        </div>
      </div>

      {/* Title Header */}
      <header className="modul-detail-header">
        <h1 className="modul-main-title">{modul.judul}</h1>
        <p className="modul-lead-text">{modul.ringkasan}</p>
      </header>

      {/* Main Content Sections */}
      <div className="modul-sections-wrapper">
        {modul.subtopik.map((sub, idx) => (
          <section key={idx} className="subtopik-card">
            <h2 className="subtopik-title">{sub.judul}</h2>

            <div className="subtopik-body">
              {sub.konten.map((paragraf, pIdx) => (
                <p key={pIdx} className="subtopik-paragraph">
                  {paragraf}
                </p>
              ))}
            </div>

            {/* Special Interactive Table for Module 3 */}
            {sub.contohTabel && (
              <div className="modul-table-box">
                <h3 className="modul-table-title">{sub.contohTabel.judul}</h3>
                <div className="table-responsive">
                  <table className="chemistry-table">
                    <thead>
                      <tr>
                        {sub.contohTabel.kolom.map((kol, kIdx) => (
                          <th key={kIdx}>{kol}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sub.contohTabel.baris.map((row, rIdx) => (
                        <tr key={rIdx}>
                          {row.map((cell, cIdx) => (
                            <td key={cIdx}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {sub.contohTabel.keterangan && (
                  <div className="table-explanation">
                    <strong>Penyelesaian Bertahap:</strong>
                    <p>{sub.contohTabel.keterangan}</p>
                  </div>
                )}
              </div>
            )}

            {/* Key takeaway / tips box */}
            {sub.tips && (
              <div className="subtopik-tips-box">
                <span className="tips-icon">💡</span>
                <p>{sub.tips}</p>
              </div>
            )}

            {/* Embed collision simulation on Module 2 after Subtopic 1 or 2 */}
            {modul.id === 'modul-2' && idx === 1 && (
              <div className="embedded-simulation">
                <SimulasiTumbukan />
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Call to action: Quiz Button */}
      <div className="modul-quiz-banner">
        <div className="quiz-banner-text">
          <h3>Sudah Memahami Materi Modul Ini?</h3>
          <p>
            Uji pemahaman konsepmu dengan mengerjakan 5 soal latihan interaktif. Umpan balik dan pembahasan lengkap akan langsung ditampilkan pada setiap soal!
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-large"
          onClick={onMulaiKuis}
          id="btn-mulai-kuis"
        >
          <HelpCircle size={18} />
          <span>{skorKuis !== undefined ? 'Ulangi Kuis Modul' : 'Mulai Kuis Modul'}</span>
        </button>
      </div>

      {/* Bottom Pagination */}
      <div className="modul-bottom-pagination">
        {modulSebelumnyaId ? (
          <button
            type="button"
            className="pagination-btn"
            onClick={() => onNavigasiModul(modulSebelumnyaId)}
          >
            <ArrowLeft size={16} />
            <span>Modul Sebelumnya</span>
          </button>
        ) : (
          <div />
        )}

        <button
          type="button"
          className="pagination-home-btn"
          onClick={onKembaliKeBeranda}
        >
          <BookOpen size={16} />
          <span>Daftar Modul</span>
        </button>

        {modulBerikutnyaId ? (
          <button
            type="button"
            className="pagination-btn"
            onClick={() => onNavigasiModul(modulBerikutnyaId)}
          >
            <span>Modul Berikutnya</span>
            <ArrowRight size={16} />
          </button>
        ) : (
          <div />
        )}
      </div>
    </article>
  );
};
