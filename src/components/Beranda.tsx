import React from 'react';
import {
  BookOpen,
  CheckCircle,
  Clock,
  Award,
  Play,
  Sparkles,
  Zap,
  Flame,
  BarChart3,
  GraduationCap,
  ShieldCheck,
  AlertCircle,
  LogIn,
  UserCheck,
  ArrowRight,
  Lock,
  Compass
} from 'lucide-react';
import { DATA_MODUL } from '../data/modul';
import type { Progres } from '../utils/progres';
import type { StatusAuth } from '../types/auth';

interface BerandaProps {
  progres: Progres;
  statusAuth: StatusAuth;
  onPilihModul: (modulId: string) => void;
  onMulaiKuis: (modulId: string) => void;
  onBukaModalAuth: (role?: 'siswa' | 'guru', mode?: 'masuk' | 'daftar') => void;
  onPilihModeTamu: () => void;
  onBukaDashboardGuru: () => void;
  onBukaRiwayatNilai?: () => void;
  onBukaPanduan?: () => void;
  onKeluar: () => void;
}

export const Beranda: React.FC<BerandaProps> = ({
  progres,
  statusAuth,
  onPilihModul,
  onMulaiKuis,
  onBukaModalAuth,
  onPilihModeTamu,
  onBukaDashboardGuru,
  onBukaRiwayatNilai,
  onBukaPanduan,
  onKeluar
}) => {
  const totalModul = DATA_MODUL.length;
  const modulDibuka = Array.isArray(progres?.modulDibuka) ? progres.modulDibuka : [];
  const skorKuis = progres?.skorKuis && typeof progres.skorKuis === 'object' ? progres.skorKuis : {};
  const modulDibukaCount = modulDibuka.length;
  const modulSelesaiKuisCount = Object.keys(skorKuis).length;

  const isTamu = !statusAuth || statusAuth.peran === 'tamu';
  const isSiswa = statusAuth?.peran === 'siswa' && Boolean(statusAuth?.terautentikasi);
  const isGuru = statusAuth?.peran === 'guru' && Boolean(statusAuth?.terautentikasi);

  return (
    <div className="beranda-container" id="beranda-view">
      {/* Hero Welcome */}
      <section className="beranda-hero">
        <div className="hero-top-row">
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>Media Interaktif Kimia SMA Kelas XI • Fase F</span>
          </div>
          {onBukaPanduan && (
            <button
              type="button"
              className="btn btn-outline-cyan hero-guide-btn"
              onClick={onBukaPanduan}
              title="Buka pop-up panduan cara belajar di LajuKu"
            >
              <Compass size={15} />
              <span>Panduan Penggunaan</span>
            </button>
          )}
        </div>

        <h1 className="beranda-hero-title">
          Kuasai Konsep <span className="gradient-text">Laju Reaksi</span> Secara Nyata & Terarah
        </h1>

        <p className="beranda-hero-desc">
          Pelajari bagaimana partikel mikroskopis bertumbukan, pahami pengaruh konsentrasi, suhu,
          luas permukaan, dan katalis lewat laboratorium virtual, serta tentukan orde reaksi dengan mudah.
        </p>

        {/* =========================================================================
            PORTAL AKSES SISWA & GURU (DI HALAMAN DEPAN)
            ========================================================================= */}
        <div className="beranda-access-portal-section">
          <div className="access-cards-grid">
            {/* Kartu Akses Siswa */}
            <div className={`access-card access-card-student ${isSiswa ? 'is-active-role' : ''}`}>
              <div className="access-card-header">
                <div className="access-icon-box bg-cyan-subtle">
                  <GraduationCap size={26} className="text-cyan" />
                </div>
                <div className="access-badge">Akses Siswa</div>
              </div>

              <h2 className="access-card-title">Portal Belajar Siswa</h2>
              <p className="access-card-desc">
                Pelajari 3 modul laju reaksi, amati simulasi tumbukan molekul, dan uji kemampuanmu
                melalui latihan soal kuis bertahap.
              </p>

              {isSiswa ? (
                <div className="access-active-info">
                  <div className="active-user-badge">
                    <UserCheck size={16} className="text-cyan" />
                    <span>
                      Masuk sebagai: <strong>{statusAuth.pengguna?.nama}</strong>
                    </span>
                  </div>
                  <span className="active-user-email">{statusAuth.pengguna?.email}</span>
                  <div className="active-status-tag tag-success">
                    ✓ Progres belajar & nilai kuis Anda tersimpan aman
                  </div>
                  {onBukaRiwayatNilai && (
                    <button
                      type="button"
                      className="btn btn-primary btn-block mt-2"
                      onClick={onBukaRiwayatNilai}
                    >
                      <Award size={16} />
                      <span>Lihat Riwayat Nilai Saya</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="access-actions-dual">
                  {/* Pilihan 1: Tanpa Login (Mode Tamu) */}
                  <button
                    type="button"
                    className="btn btn-outline-cyan access-btn"
                    onClick={onPilihModeTamu}
                    title="Akses materi tanpa login (data tidak tersimpan)"
                  >
                    <BookOpen size={16} />
                    <div className="btn-label-group">
                      <span className="btn-main-text">Akses Tanpa Login</span>
                      <span className="btn-sub-text">Mode Tamu (Data Tidak Tersimpan)</span>
                    </div>
                  </button>

                  {/* Pilihan 2: Masuk dengan Email */}
                  <button
                    type="button"
                    className="btn btn-primary access-btn"
                    onClick={() => onBukaModalAuth('siswa', 'masuk')}
                    title="Masuk atau daftar dengan akun email"
                  >
                    <LogIn size={16} />
                    <div className="btn-label-group">
                      <span className="btn-main-text">Masuk dengan Email</span>
                      <span className="btn-sub-text">Simpan Progres & Nilai Kuis</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Kartu Akses Guru */}
            <div className={`access-card access-card-teacher ${isGuru ? 'is-active-role' : ''}`}>
              <div className="access-card-header">
                <div className="access-icon-box bg-purple-subtle">
                  <ShieldCheck size={26} className="text-purple" />
                </div>
                <div className="access-badge badge-teacher">Akses Pendidik</div>
              </div>

              <h2 className="access-card-title">Portal Guru & Pengajar</h2>
              <p className="access-card-desc">
                Akses kunci jawaban lengkap 15 butir kuis, pembahasan ilmiah, rekapitulasi nilai kuis
                siswa, serta panduan tautan integrasi Firebase.
              </p>

              {isGuru ? (
                <div className="access-active-info">
                  <div className="active-user-badge">
                    <ShieldCheck size={16} className="text-purple" />
                    <span>
                      Guru: <strong>{statusAuth.pengguna?.nama}</strong>
                    </span>
                  </div>
                  <span className="active-user-email">{statusAuth.pengguna?.email}</span>
                  <button
                    type="button"
                    className="btn btn-primary btn-block mt-2"
                    onClick={onBukaDashboardGuru}
                  >
                    <span>Buka Ruang Guru & Kunci Jawaban</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              ) : (
                <div className="access-actions-single">
                  <button
                    type="button"
                    className="btn btn-outline-purple access-btn btn-block"
                    onClick={() => onBukaModalAuth('guru', 'masuk')}
                    title="Masuk sebagai Guru Kimia"
                  >
                    <Lock size={16} />
                    <div className="btn-label-group">
                      <span className="btn-main-text">Masuk sebagai Guru</span>
                      <span className="btn-sub-text">Gunakan Akun Email Pendidik</span>
                    </div>
                  </button>
                  <p className="teacher-helper-note">
                    Akun pendidik kimia SMA terverifikasi secara otomatis saat login.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* =========================================================================
            BANNER INFORMASI MODE AKSES (TAMU vs LOGIN)
            ========================================================================= */}
        {isTamu && (
          <div className="guest-alert-banner" role="alert">
            <div className="banner-left">
              <AlertCircle size={22} className="banner-alert-icon" />
              <div>
                <strong className="banner-title">Mode Siswa Tanpa Login Aktif</strong>
                <p className="banner-desc">
                  Anda dapat membaca seluruh modul dan mencoba kuis interaktif, namun{' '}
                  <span className="highlight-warning">data progres dan nilai kuis Anda TIDAK tersimpan</span>{' '}
                  jika halaman ditutup atau dimuat ulang (refresh).
                </p>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-warning-pill"
              onClick={() => onBukaModalAuth('siswa', 'masuk')}
            >
              <LogIn size={15} />
              <span>Simpan Nilai (Masuk Email)</span>
            </button>
          </div>
        )}

        {isSiswa && (
          <div className="logged-in-banner" role="status">
            <div className="banner-left">
              <CheckCircle size={22} className="banner-success-icon" />
              <div>
                <strong className="banner-title">Akun Siswa Terhubung: {statusAuth.pengguna?.nama}</strong>
                <p className="banner-desc">
                  Progres modul dan nilai kuis Anda otomatis tersimpan di akun ({statusAuth.pengguna?.email})
                  dan siap disinkronkan ke Firebase.
                </p>
              </div>
            </div>
            <div className="banner-actions-group">
              {onBukaRiwayatNilai && (
                <button
                  type="button"
                  className="btn btn-outline-cyan btn-sm"
                  onClick={onBukaRiwayatNilai}
                  title="Lihat riwayat nilai kuis Anda"
                >
                  <Award size={14} />
                  <span>Riwayat Nilai</span>
                </button>
              )}
              <button
                type="button"
                className="btn btn-ghost-sm"
                onClick={onKeluar}
                title="Keluar dari akun siswa"
              >
                Keluar Akun
              </button>
            </div>
          </div>
        )}

        {isGuru && (
          <div className="teacher-alert-banner" role="status">
            <div className="banner-left">
              <ShieldCheck size={22} className="banner-teacher-icon" />
              <div>
                <strong className="banner-title">Mode Guru Aktif: {statusAuth.pengguna?.nama}</strong>
                <p className="banner-desc">
                  Anda sedang dalam mode guru. Anda dapat mempratinjau modul siswa atau membuka Dashboard Guru
                  untuk melihat kunci jawaban lengkap dan pemantauan siswa.
                </p>
              </div>
            </div>
            <div className="banner-actions-group">
              <button
                type="button"
                className="btn btn-purple-pill"
                onClick={onBukaDashboardGuru}
              >
                <span>Dashboard Guru</span>
                <ArrowRight size={15} />
              </button>
              <button
                type="button"
                className="btn btn-ghost-sm"
                onClick={onKeluar}
                title="Keluar dari sesi guru"
              >
                Keluar
              </button>
            </div>
          </div>
        )}

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
              <span className={`stat-dot ${isTamu ? 'dot-warning' : 'dot-active'}`} />
              <span>
                {isTamu
                  ? 'Tidak Tersimpan (Mode Tamu)'
                  : isSiswa
                  ? 'Tersimpan (Akun Email Siswa)'
                  : 'Sesi Akun Guru'}
              </span>
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
            const sudahDibuka = modulDibuka.includes(modul.id);
            const skor = skorKuis[modul.id];
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
