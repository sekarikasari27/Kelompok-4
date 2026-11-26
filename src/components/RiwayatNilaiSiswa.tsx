import React, { useEffect, useState } from 'react';
import {
  Award,
  Calendar,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  ArrowLeft,
  Sparkles,
  TrendingUp,
  FileText,
  Clock,
  HelpCircle,
  Database
} from 'lucide-react';
import type { StatusAuth, RiwayatEvaluasiSiswa } from '../types/auth';
import { ambilRiwayatEvaluasiSiswaDariFirebase } from '../services/authService';

interface RiwayatNilaiSiswaProps {
  statusAuth: StatusAuth;
  onMulaiKuis: (modulId: string) => void;
  onBukaModul: (modulId: string) => void;
  onBukaBeranda: () => void;
}

export const RiwayatNilaiSiswa: React.FC<RiwayatNilaiSiswaProps> = ({
  statusAuth,
  onMulaiKuis,
  onBukaModul,
  onBukaBeranda
}) => {
  const [daftarRiwayat, setDaftarRiwayat] = useState<RiwayatEvaluasiSiswa[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const userId = statusAuth.pengguna?.id;
  const namaSiswa = statusAuth.pengguna?.nama || 'Siswa';
  const emailSiswa = statusAuth.pengguna?.email || '';

  useEffect(() => {
    let isMounted = true;
    const muatData = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await ambilRiwayatEvaluasiSiswaDariFirebase(userId);
        if (isMounted) {
          setDaftarRiwayat(data);
        }
      } catch (err) {
        console.warn('Gagal memuat riwayat:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    muatData();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  // Kalkulasi statistik riwayat
  const totalEvaluasi = daftarRiwayat.length;
  const nilaiList = daftarRiwayat.map((r) => r.skor);
  const rataRata =
    totalEvaluasi > 0
      ? Math.round(nilaiList.reduce((acc, curr) => acc + curr, 0) / totalEvaluasi)
      : 0;
  const nilaiTertinggi = totalEvaluasi > 0 ? Math.max(...nilaiList) : 0;
  const totalTuntas = daftarRiwayat.filter((r) => r.skor >= 75).length;

  return (
    <div className="riwayat-container">
      {/* Top Header Navigation */}
      <div className="riwayat-topbar">
        <button
          type="button"
          className="btn btn-secondary riwayat-back-btn"
          onClick={onBukaBeranda}
        >
          <ArrowLeft size={16} />
          <span>Kembali ke Beranda</span>
        </button>

        <div className="riwayat-db-badge" title="Tersimpan permanen di Cloud Firestore">
          <Database size={14} className="text-cyan" />
          <span>Tersinkronisasi Cloud Firestore</span>
        </div>
      </div>

      {/* Main Hero Header */}
      <div className="riwayat-header-card">
        <div className="riwayat-user-profile">
          <div className="riwayat-avatar">
            <Award size={32} className="text-amber" />
          </div>
          <div>
            <div className="riwayat-title-row">
              <h1 className="riwayat-main-title">Riwayat Nilai Saya</h1>
              <span className="riwayat-badge-role">Akun Siswa</span>
            </div>
            <p className="riwayat-user-info">
              {namaSiswa} &bull; <span className="text-faint">{emailSiswa}</span>
            </p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="riwayat-stats-grid">
          <div className="riwayat-stat-card">
            <div className="stat-card-icon icon-cyan">
              <TrendingUp size={20} />
            </div>
            <div className="stat-card-data">
              <span className="stat-card-label">Rata-Rata Nilai</span>
              <span className="stat-card-val text-cyan">{totalEvaluasi > 0 ? rataRata : '-'}</span>
            </div>
          </div>

          <div className="riwayat-stat-card">
            <div className="stat-card-icon icon-emerald">
              <CheckCircle2 size={20} />
            </div>
            <div className="stat-card-data">
              <span className="stat-card-label">Evaluasi Tuntas</span>
              <span className="stat-card-val text-emerald">
                {totalTuntas} <span className="stat-card-sub">/ {totalEvaluasi}</span>
              </span>
            </div>
          </div>

          <div className="riwayat-stat-card">
            <div className="stat-card-icon icon-amber">
              <Sparkles size={20} />
            </div>
            <div className="stat-card-data">
              <span className="stat-card-label">Skor Tertinggi</span>
              <span className="stat-card-val text-amber">{totalEvaluasi > 0 ? nilaiTertinggi : '-'}</span>
            </div>
          </div>

          <div className="riwayat-stat-card">
            <div className="stat-card-icon icon-purple">
              <FileText size={20} />
            </div>
            <div className="stat-card-data">
              <span className="stat-card-label">Total Percobaan</span>
              <span className="stat-card-val text-purple">{totalEvaluasi}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Riwayat List / Table */}
      <div className="riwayat-content-section">
        <div className="riwayat-section-header">
          <h2 className="riwayat-section-title">Daftar Hasil Pembelajaran & Evaluasi</h2>
          <span className="riwayat-section-desc">
            Seluruh riwayat evaluasi di bawah ini tersimpan secara permanen berdasarkan UID Anda.
          </span>
        </div>

        {loading ? (
          <div className="riwayat-loading-card">
            <div className="spinner" />
            <p>Memuat riwayat nilai dari database...</p>
          </div>
        ) : daftarRiwayat.length === 0 ? (
          <div className="riwayat-empty-card">
            <HelpCircle size={48} className="text-faint" />
            <h3>Belum Ada Riwayat Kuis</h3>
            <p>
              Anda belum menyelesaikan evaluasi modul apapun. Buka salah satu modul materi dan selesaikan
              kuis untuk melihat nilai Anda di sini.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onMulaiKuis('modul-1')}
            >
              Mulai Kuis Modul 1
            </button>
          </div>
        ) : (
          <div className="riwayat-items-list">
            {daftarRiwayat.map((item, index) => {
              const isTuntas = item.skor >= 75;
              const formattedDate = item.tanggal
                ? new Date(item.tanggal).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : '-';

              return (
                <div
                  key={item.id || index}
                  className={`riwayat-card ${isTuntas ? 'card-tuntas' : 'card-remedial'}`}
                >
                  <div className="riwayat-card-left">
                    <div className="riwayat-score-badge">
                      <span className="score-big">{item.skor}</span>
                      <span className="score-denom">/ 100</span>
                    </div>

                    <div className="riwayat-details-col">
                      <div className="riwayat-modul-title-row">
                        <h3 className="riwayat-modul-name">{item.namaModul}</h3>
                        <span className={`status-pill ${isTuntas ? 'pill-tuntas' : 'pill-remedial'}`}>
                          {isTuntas ? 'Tuntas (KKTP)' : 'Perlu Remedial'}
                        </span>
                      </div>

                      <div className="riwayat-metadata-row">
                        <span className="metadata-item">
                          <Calendar size={13} />
                          <span>{formattedDate}</span>
                        </span>
                        <span className="metadata-item">
                          <Clock size={13} />
                          <span>{item.jenisEvaluasi || 'Kuis Pilihan Ganda'}</span>
                        </span>
                      </div>

                      <div className="riwayat-counts-row">
                        <span className="count-correct">
                          <CheckCircle2 size={14} /> {item.jumlahBenar ?? '-'} Benar
                        </span>
                        <span className="count-wrong">
                          <XCircle size={14} /> {item.jumlahSalah ?? '-'} Salah
                        </span>
                        <span className="count-total">
                          dari {item.totalSoal ?? 5} Soal
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="riwayat-card-actions">
                    <button
                      type="button"
                      className="btn btn-secondary riwayat-action-btn"
                      onClick={() => onMulaiKuis(item.modulId || 'modul-1')}
                      title="Kerjakan ulang kuis ini untuk meningkatkan nilai"
                    >
                      <RotateCcw size={14} />
                      <span>Ulangi Kuis</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-cyan riwayat-action-btn"
                      onClick={() => onBukaModul(item.modulId || 'modul-1')}
                      title="Buka kembali bahan bacaan modul ini"
                    >
                      <BookOpen size={14} />
                      <span>Pelajari Modul</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
