import React from 'react';
import { BookOpen, CheckCircle, Clock, Award, Play, Sparkles, Zap, Flame, BarChart3 } from 'lucide-react';
import { DATA_MODUL } from '../data/modul';
import type { Progres } from '../utils/progres';

interface BerandaProps {
  progres: Progres;
  onPilihModul: (modulId: string) => void;
  onMulaiKuis: (modulId: string) => void;
}

export const Beranda: React.FC<BerandaProps> = ({
  progres,
  onPilihModul,
  onMulaiKuis
}) => {
  const totalModul = DATA_MODUL.length;
  const modulDibukaCount = progres.modulDibuka.length;
  const modulSelesaiKuisCount = Object.keys(progres.skorKuis).length;

  return (
    <div className="beranda-container" id="beranda-view">
      {/* Hero Welcome */}
      <section className="beranda-hero">
        <div className="hero-badge">
          <Sparkles size={16} />
          <span>Media Interaktif Kimia SMA Kelas XI • Fase F</span>
        </div>

        <h1 className="beranda-hero-title">
          Kuasai Konsep <span className="gradient-text">Laju Reaksi</span> Secara Nyata & Terarah
        </h1>

        <p className="beranda-hero-desc">
          Pelajari bagaimana partikel mikroskopis bertumbukan, pahami pengaruh konsentrasi, suhu,
          luas permukaan, dan katalis lewat laboratorium virtual, serta tentukan orde reaksi dengan mudah.
        </p>

        {/* Learning Statistics Bar */}
        <div className="learning-stats-card">
          <div className="stat-col">
            <span className="stat-label">Modul Dipelajari</span>
            <div className="stat-val-group">
              <span className="stat-number">{modulDibukaCount}</span>
              <span className="stat-max">/ {totalModul}</span>
            </div>
          </div>
          <div className="stat-divider" />
          <div className="stat-col">
            <span className="stat-label">Kuis Diselesaikan</span>
            <div className="stat-val-group">
              <span className="stat-number text-emerald">{modulSelesaiKuisCount}</span>
              <span className="stat-max">/ {totalModul}</span>
            </div>
          </div>
          <div className="stat-divider" />
          <div className="stat-col">
            <span className="stat-label">Penyimpanan Progres</span>
            <div className="stat-status-badge">
              <span className="stat-dot" />
              <span>Otomatis di Perangkat (Anonim)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Module Cards Grid */}
      <section className="modul-grid-section">
        <div className="section-header-row">
          <div>
            <h2 className="section-title-clean">Daftar Modul Pembelajaran</h2>
            <p className="section-subtitle-clean">
              Pilih modul untuk mulai membaca materi atau uji pemahamanmu dengan kuis interaktif.
            </p>
          </div>
        </div>

        <div className="modul-cards-grid">
          {DATA_MODUL.map((modul) => {
            const sudahDibuka = progres.modulDibuka.includes(modul.id);
            const skor = progres.skorKuis[modul.id];
            const kuisSelesai = skor !== undefined;

            return (
              <div
                key={modul.id}
                className={`modul-card ${kuisSelesai ? 'card-completed' : sudahDibuka ? 'card-active' : ''}`}
                id={`card-${modul.id}`}
              >
                <div className="modul-card-top">
                  <span className="modul-tag">Modul {modul.nomor}</span>
                  <div className="modul-status-pill">
                    {kuisSelesai ? (
                      <span className="status-done">
                        <CheckCircle size={14} /> Selesai ({skor}%)
                      </span>
                    ) : sudahDibuka ? (
                      <span className="status-progress">Sedang Dipelajari</span>
                    ) : (
                      <span className="status-unread">Belum Dibuka</span>
                    )}
                  </div>
                </div>

                <div className="modul-card-icon-area">
                  {modul.nomor === 1 && <BarChart3 size={28} className="text-cyan" />}
                  {modul.nomor === 2 && <Flame size={28} className="text-amber" />}
                  {modul.nomor === 3 && <Zap size={28} className="text-purple" />}
                </div>

                <h3 className="modul-card-title">{modul.judul}</h3>
                <p className="modul-card-desc">{modul.ringkasan}</p>

                <div className="modul-card-meta">
                  <span className="meta-time">
                    <Clock size={14} />
                    <span>{modul.waktuBacaMenit} menit baca</span>
                  </span>
                  {kuisSelesai && (
                    <span className="meta-score">
                      <Award size={14} />
                      <span>Skor: {skor}/100</span>
                    </span>
                  )}
                </div>

                <div className="modul-card-actions">
                  <button
                    type="button"
                    className="btn btn-primary btn-block"
                    onClick={() => onPilihModul(modul.id)}
                    id={`btn-baca-${modul.id}`}
                  >
                    <BookOpen size={16} />
                    <span>{sudahDibuka ? 'Lanjutkan Belajar' : 'Mulai Belajar'}</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary btn-block"
                    onClick={() => onMulaiKuis(modul.id)}
                    id={`btn-kuis-${modul.id}`}
                  >
                    <Play size={15} />
                    <span>{kuisSelesai ? 'Ulangi Kuis' : 'Kerjakan Kuis'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Highlight Cards */}
      <section className="beranda-features-section">
        <h2 className="section-title-clean text-center">Mengapa Belajar di LajuKu?</h2>

        <div className="features-preview-grid">
          <div className="preview-card">
            <div className="preview-icon-box">
              <Zap size={24} className="text-cyan" />
            </div>
            <h4>Visualisasi Teori Tumbukan</h4>
            <p>
              Jangan hanya menghafal! Lihat bagaimana partikel bertumbukan dan bukit Energi Aktivasi (Eₐ) turun saat katalis ditambahkan.
            </p>
          </div>

          <div className="preview-card">
            <div className="preview-icon-box">
              <BarChart3 size={24} className="text-purple" />
            </div>
            <h4>Penentuan Orde Bertahap</h4>
            <p>
              Pelajari trik menentukan orde reaksi dari data percobaan tabel dengan eliminasi terstruktur dan penjelasan langkah demi langkah.
            </p>
          </div>

          <div className="preview-card">
            <div className="preview-icon-box">
              <Award size={24} className="text-emerald" />
            </div>
            <h4>Kuis dengan Umpan Balik</h4>
            <p>
              Setiap soal kuis langsung memberikan umpan balik alasan mengapa pilihan jawabanmu benar atau salah tanpa harus menunggu akhir sesi.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
