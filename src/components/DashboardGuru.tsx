import React, { useState } from 'react';
import {
  ShieldCheck,
  BookOpen,
  CheckCircle,
  Database,
  Eye,
  Key,
  Users,
  ExternalLink,
  Code2,
  HelpCircle,
  Sparkles,
  Search
} from 'lucide-react';
import type { Pengguna, SiswaProgresNilai } from '../types/auth';
import { DATA_KUIS } from '../data/kuis';
import { DATA_MODUL } from '../data/modul';
import { DATA_SIMULASI_SISWA, ambilDataSemuaSiswaDariFirebase } from '../services/authService';
import { isFirebaseConfigured, FIREBASE_CONFIG } from '../services/firebaseConfig';

interface DashboardGuruProps {
  guru: Pengguna;
  onPratinjauSiswa: () => void;
  onBukaModul: (modulId: string) => void;
  onKeluar: () => void;
}

export const DashboardGuru: React.FC<DashboardGuruProps> = ({
  guru,
  onPratinjauSiswa,
  onBukaModul,
  onKeluar
}) => {
  const [tabAktif, setTabAktif] = useState<'kunci' | 'siswa' | 'firebase'>('kunci');
  const [modulKunciPilihan, setModulKunciPilihan] = useState<string>('modul-1');
  const [pencarianSoal, setPencarianSoal] = useState<string>('');
  const [daftarSiswa, setDaftarSiswa] = useState<SiswaProgresNilai[]>(DATA_SIMULASI_SISWA);

  React.useEffect(() => {
    ambilDataSemuaSiswaDariFirebase().then((data) => {
      if (data && data.length > 0) {
        setDaftarSiswa(data);
      }
    });
  }, []);

  const kuisAktif = DATA_KUIS[modulKunciPilihan];
  const modulAktif = DATA_MODUL.find((m) => m.id === modulKunciPilihan);
  const statusFirebase = isFirebaseConfigured();

  const soalFiltered = kuisAktif
    ? kuisAktif.soal.filter(
        (s) =>
          s.pertanyaan.toLowerCase().includes(pencarianSoal.toLowerCase()) ||
          s.penjelasan.toLowerCase().includes(pencarianSoal.toLowerCase())
      )
    : [];

  return (
    <div className="guru-dashboard-container">
      {/* Top Banner Dashboard */}
      <header className="guru-header-card">
        <div className="guru-header-info">
          <div className="guru-avatar-badge">
            <ShieldCheck size={28} className="text-cyan" />
          </div>
          <div>
            <div className="guru-title-row">
              <h1 className="guru-main-heading">Ruang Pendidik & Dashboard Guru</h1>
              <span className="guru-verified-pill">Terverifikasi Pendidik</span>
            </div>
            <p className="guru-subheading">
              Selamat datang, <strong>{guru.nama}</strong> ({guru.email}) • Media Pembelajaran Kimia SMA Kelas XI
            </p>
          </div>
        </div>

        <div className="guru-header-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onPratinjauSiswa}
            title="Lihat materi dari sudut pandang siswa"
          >
            <Eye size={16} />
            <span>Pratinjau Siswa</span>
          </button>
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={onKeluar}
            title="Keluar dari sesi guru"
          >
            <span>Keluar Akun</span>
          </button>
        </div>
      </header>

      {/* Overview Stat Cards */}
      <section className="guru-stats-grid">
        <div className="guru-stat-card">
          <div className="stat-icon-wrapper bg-blue-subtle">
            <BookOpen size={20} className="text-cyan" />
          </div>
          <div className="stat-data">
            <span className="stat-data-number">3 Modul</span>
            <span className="stat-data-desc">Kurikulum Merdeka Fase F</span>
          </div>
        </div>

        <div className="guru-stat-card">
          <div className="stat-icon-wrapper bg-emerald-subtle">
            <Key size={20} className="text-emerald" />
          </div>
          <div className="stat-data">
            <span className="stat-data-number">15 Soal Kuis</span>
            <span className="stat-data-desc">Kunci & Pembahasan Ilmiah</span>
          </div>
        </div>

        <div className="guru-stat-card">
          <div className="stat-icon-wrapper bg-purple-subtle">
            <Users size={20} className="text-purple" />
          </div>
          <div className="stat-data">
            <span className="stat-data-number">{daftarSiswa.length} Siswa Terpantau</span>
            <span className="stat-data-desc">Data Progres & Nilai</span>
          </div>
        </div>

        <div className="guru-stat-card">
          <div className="stat-icon-wrapper bg-amber-subtle">
            <Database size={20} className="text-amber" />
          </div>
          <div className="stat-data">
            <span className="stat-data-number">
              {statusFirebase ? 'Firebase Aktif' : 'Siap Ditautkan'}
            </span>
            <span className="stat-data-desc">
              {statusFirebase ? 'Tersambung ke Cloud' : 'Mode Autentikasi Email'}
            </span>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <nav className="guru-tabs-nav">
        <button
          type="button"
          className={`guru-tab-btn ${tabAktif === 'kunci' ? 'active' : ''}`}
          onClick={() => setTabAktif('kunci')}
        >
          <Key size={18} />
          <span>Kunci Jawaban & Bank Soal</span>
        </button>

        <button
          type="button"
          className={`guru-tab-btn ${tabAktif === 'siswa' ? 'active' : ''}`}
          onClick={() => setTabAktif('siswa')}
        >
          <Users size={18} />
          <span>Pemantauan Nilai Siswa</span>
        </button>

        <button
          type="button"
          className={`guru-tab-btn ${tabAktif === 'firebase' ? 'active' : ''}`}
          onClick={() => setTabAktif('firebase')}
        >
          <Database size={18} />
          <span>Panduan Tautan Firebase</span>
        </button>
      </nav>

      {/* =========================================================================
          TAB 1: Kunci Jawaban & Bank Soal
          ========================================================================= */}
      {tabAktif === 'kunci' && (
        <section className="guru-tab-content">
          <div className="guru-section-toolbar">
            {/* Filter Modul */}
            <div className="modul-filter-group">
              {DATA_MODUL.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={`modul-pill-btn ${modulKunciPilihan === m.id ? 'active' : ''}`}
                  onClick={() => setModulKunciPilihan(m.id)}
                >
                  <span>Modul {m.nomor}: {m.judul}</span>
                </button>
              ))}
            </div>

            {/* Pencarian Soal */}
            <div className="soal-search-box">
              <Search size={16} />
              <input
                type="text"
                placeholder="Cari dalam soal / pembahasan..."
                value={pencarianSoal}
                onChange={(e) => setPencarianSoal(e.target.value)}
              />
            </div>
          </div>

          {/* Module Info Header */}
          {modulAktif && (
            <div className="guru-modul-context-box">
              <div className="context-left">
                <h3>Modul {modulAktif.nomor}: {modulAktif.judul}</h3>
                <p>{modulAktif.ringkasan}</p>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => onBukaModul(modulAktif.id)}
              >
                <BookOpen size={14} />
                <span>Buka Materi Modul</span>
              </button>
            </div>
          )}

          {/* Question List */}
          <div className="guru-soal-list">
            {soalFiltered.map((soal) => (
              <div key={soal.id} className="guru-soal-card">
                <div className="guru-soal-header">
                  <span className="guru-soal-nomor">Soal #{soal.nomor}</span>
                  <span className="guru-soal-kunci-badge">
                    Kunci Jawaban: <strong>Pilihan {soal.kunci}</strong>
                  </span>
                </div>

                <p className="guru-soal-pertanyaan">{soal.pertanyaan}</p>

                {/* Option list */}
                <div className="guru-pilihan-list">
                  {soal.pilihan.map((p) => {
                    const isKunci = p.label === soal.kunci;
                    return (
                      <div
                        key={p.label}
                        className={`guru-pilihan-item ${isKunci ? 'is-kunci' : ''}`}
                      >
                        <span className="pilihan-label-badge">{p.label}</span>
                        <span className="pilihan-teks">{p.teks}</span>
                        {isKunci && (
                          <span className="kunci-tag">
                            <CheckCircle size={14} /> Kunci Benar
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Penjelasan / Pembahasan Guru */}
                <div className="guru-penjelasan-box">
                  <div className="penjelasan-header">
                    <Sparkles size={16} className="text-amber" />
                    <strong>Pembahasan Konsep & Alasan Ilmiah:</strong>
                  </div>
                  <p>{soal.penjelasan}</p>
                </div>
              </div>
            ))}

            {soalFiltered.length === 0 && (
              <div className="guru-empty-search">
                <HelpCircle size={32} />
                <p>Tidak ada soal yang cocok dengan kata kunci "{pencarianSoal}".</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* =========================================================================
          TAB 2: Pemantauan Nilai Siswa (Firestore Ready)
          ========================================================================= */}
      {tabAktif === 'siswa' && (
        <section className="guru-tab-content">
          <div className="guru-table-intro">
            <div>
              <h2 className="section-title-clean">Rekapitulasi Hasil Belajar Siswa</h2>
              <p className="section-subtitle-clean">
                Data nilai kuis siswa kelas XI. Saat Firebase ditautkan, tabel ini akan otomatis
                menampilkan data langsung dari Cloud Firestore secara real-time.
              </p>
            </div>
            <div className="table-badge-note">
              <span>Kriteria Ketuntasan (KKTP): 75</span>
            </div>
          </div>

          <div className="guru-table-wrapper">
            <table className="guru-score-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Siswa</th>
                  <th>Email Siswa</th>
                  <th>Modul 1 (Konsep)</th>
                  <th>Modul 2 (Tumbukan)</th>
                  <th>Modul 3 (Orde)</th>
                  <th>Rata-rata</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {daftarSiswa.map((siswa, idx) => {
                  const tuntas = siswa.rataRata !== null && siswa.rataRata >= 75;
                  return (
                    <tr key={siswa.id}>
                      <td className="col-center">{idx + 1}</td>
                      <td className="col-name">
                        <strong>{siswa.nama}</strong>
                        <span className="activity-time">{siswa.terakhirAktivitas}</span>
                      </td>
                      <td className="col-email">{siswa.email}</td>
                      <td className="col-score">
                        {siswa.modul1 !== null ? (
                          <span className={`score-badge ${siswa.modul1 >= 75 ? 'score-good' : 'score-low'}`}>
                            {siswa.modul1}
                          </span>
                        ) : (
                          <span className="score-empty">-</span>
                        )}
                      </td>
                      <td className="col-score">
                        {siswa.modul2 !== null ? (
                          <span className={`score-badge ${siswa.modul2 >= 75 ? 'score-good' : 'score-low'}`}>
                            {siswa.modul2}
                          </span>
                        ) : (
                          <span className="score-empty">-</span>
                        )}
                      </td>
                      <td className="col-score">
                        {siswa.modul3 !== null ? (
                          <span className={`score-badge ${siswa.modul3 >= 75 ? 'score-good' : 'score-low'}`}>
                            {siswa.modul3}
                          </span>
                        ) : (
                          <span className="score-empty">-</span>
                        )}
                      </td>
                      <td className="col-score">
                        {siswa.rataRata !== null ? (
                          <strong className="text-cyan">{siswa.rataRata}</strong>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="col-center">
                        {tuntas ? (
                          <span className="status-tuntas">Tuntas</span>
                        ) : (
                          <span className="status-remedial">Remedial</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Firestore Schema Documentation Box */}
          <div className="guru-schema-box">
            <div className="schema-title">
              <Code2 size={18} className="text-cyan" />
              <span>Struktur Koleksi Firestore (Siap Pakai untuk Pengembang/Guru):</span>
            </div>
            <pre className="schema-code">
{`// Koleksi Siswa: "users/{uid}"
{
  "nama": "Ahmad Fauzi",
  "email": "ahmad.fauzi@sekolah.sch.id",
  "peran": "siswa",
  "dibuatPada": "2026-11-17T15:00:00Z"
}

// Koleksi Progres: "progres/{uid}"
{
  "modulDibuka": ["modul-1", "modul-2"],
  "skorKuis": {
    "modul-1": 100,
    "modul-2": 80
  },
  "terakhirAktivitas": "2026-11-17T15:10:00Z"
}`}
            </pre>
          </div>
        </section>
      )}

      {/* =========================================================================
          TAB 3: Panduan Tautan Firebase
          ========================================================================= */}
      {tabAktif === 'firebase' && (
        <section className="guru-tab-content">
          <div className="firebase-guide-card">
            <div className="guide-header">
              <Database size={24} className="text-cyan" />
              <div>
                <h2>Panduan Menautkan Akun Email & Nilai ke Google Firebase</h2>
                <p>
                  Aplikasi LajuKu telah dirancang secara modular agar mudah dihubungkan ke Firebase.
                  Ikuti langkah mudah di bawah ini untuk mengaktifkan sinkronisasi cloud:
                </p>
              </div>
            </div>

            <div className="guide-steps-list">
              <div className="guide-step-item">
                <div className="step-number">1</div>
                <div className="step-body">
                  <h4>Pasang Paket Firebase di Terminal Proyek</h4>
                  <p>Buka terminal di direktori proyek dan jalankan perintah:</p>
                  <pre className="step-terminal-code">npm install firebase</pre>
                </div>
              </div>

              <div className="guide-step-item">
                <div className="step-number">2</div>
                <div className="step-body">
                  <h4>Buat Proyek di Google Firebase Console</h4>
                  <p>
                    Buka{' '}
                    <a
                      href="https://console.firebase.google.com/"
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan inline-flex items-center gap-1"
                    >
                      console.firebase.google.com <ExternalLink size={12} />
                    </a>
                    , buat proyek baru (misalnya <code>lajuku-kimia</code>), lalu tambahkan aplikasi Web.
                  </p>
                </div>
              </div>

              <div className="guide-step-item">
                <div className="step-number">3</div>
                <div className="step-body">
                  <h4>Aktifkan Autentikasi Email & Password</h4>
                  <p>
                    Pada menu <strong>Authentication</strong> &rarr; Tab <strong>Sign-in method</strong>,
                    aktifkan penyedia <strong>Email/Password</strong>.
                  </p>
                </div>
              </div>

              <div className="guide-step-item">
                <div className="step-number">4</div>
                <div className="step-body">
                  <h4>Salin Kredensial ke File <code>src/services/firebaseConfig.ts</code></h4>
                  <p>
                    Buka file <code className="text-cyan">src/services/firebaseConfig.ts</code> dan masukkan
                    objek konfigurasi dari Firebase Console:
                  </p>
                  <pre className="step-terminal-code">
{`export const FIREBASE_CONFIG = {
  apiKey: "${FIREBASE_CONFIG.apiKey}",
  authDomain: "${FIREBASE_CONFIG.authDomain}",
  projectId: "${FIREBASE_CONFIG.projectId}",
  storageBucket: "${FIREBASE_CONFIG.storageBucket}",
  messagingSenderId: "${FIREBASE_CONFIG.messagingSenderId}",
  appId: "${FIREBASE_CONFIG.appId}"
};`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Status Info Box */}
            <div className="firebase-status-box">
              <div className="status-row">
                <span className="status-label">Status Deteksi Firebase Saat Ini:</span>
                <span className={`status-badge-val ${statusFirebase ? 'is-connected' : 'is-mock'}`}>
                  {statusFirebase
                    ? '✓ Firebase Terkonfigurasi'
                    : 'ℹ️ Mode Simulasi Lokal (Kredensial Belum Diisi)'}
                </span>
              </div>
              <p className="status-explanation">
                Saat kredensial belum diisi, sistem autentikasi email dan hak akses
                berjalan menggunakan simulasi sesi lokal sehingga Anda dapat menguji seluruh alur kerja dengan sempurna.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
