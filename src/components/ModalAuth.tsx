import React, { useState } from 'react';
import { X, Mail, Lock, User, GraduationCap, ShieldCheck, AlertTriangle, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { masukDenganEmail, daftarDenganEmail } from '../services/authService';
import type { StatusAuth } from '../types/auth';

interface ModalAuthProps {
  isOpen: boolean;
  initialRole?: 'siswa' | 'guru';
  initialMode?: 'masuk' | 'daftar';
  onClose: () => void;
  onSuccess: (status: StatusAuth) => void;
  onPilihModeTamu: () => void;
}

export const ModalAuth: React.FC<ModalAuthProps> = ({
  isOpen,
  initialRole = 'siswa',
  initialMode = 'masuk',
  onClose,
  onSuccess,
  onPilihModeTamu
}) => {
  const [role, setRole] = useState<'siswa' | 'guru'>(initialRole);
  const [mode, setMode] = useState<'masuk' | 'daftar'>(initialMode);
  const [nama, setNama] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorPesan, setErrorPesan] = useState<string | null>(null);
  const [memproses, setMemproses] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorPesan(null);
    setMemproses(true);

    try {
      if (mode === 'masuk') {
        const res = await masukDenganEmail(email, password, role);
        if (res.sukses && res.status) {
          onSuccess(res.status);
          onClose();
        } else {
          setErrorPesan(res.pesan || 'Gagal masuk. Periksa kembali email dan kata sandi Anda.');
        }
      } else {
        const res = await daftarDenganEmail(nama, email, password, role);
        if (res.sukses && res.status) {
          onSuccess(res.status);
          onClose();
        } else {
          setErrorPesan(res.pesan || 'Gagal mendaftar. Silakan lengkapi data dengan benar.');
        }
      }
    } catch {
      setErrorPesan('Terjadi kesalahan pada sistem. Silakan coba lagi.');
    } finally {
      setMemproses(false);
    }
  };

  const handleIsiAkunDemo = (demoRole: 'siswa' | 'guru') => {
    setRole(demoRole);
    setMode('masuk');
    setErrorPesan(null);
    if (demoRole === 'siswa') {
      setEmail('siswa@lajuku.id');
      setPassword('siswa123');
    } else {
      setEmail('guru@lajuku.id');
      setPassword('guru123');
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="auth-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Tombol Tutup */}
        <button
          type="button"
          className="auth-modal-close"
          onClick={onClose}
          aria-label="Tutup formulir masuk"
        >
          <X size={20} />
        </button>

        {/* Tab Pemilihan Peran (Siswa vs Guru) */}
        <div className="auth-role-tabs">
          <button
            type="button"
            className={`auth-role-tab ${role === 'siswa' ? 'active' : ''}`}
            onClick={() => {
              setRole('siswa');
              setErrorPesan(null);
            }}
          >
            <GraduationCap size={18} />
            <span>Akses Siswa</span>
          </button>
          <button
            type="button"
            className={`auth-role-tab ${role === 'guru' ? 'active' : ''}`}
            onClick={() => {
              setRole('guru');
              setErrorPesan(null);
            }}
          >
            <ShieldCheck size={18} />
            <span>Akses Guru</span>
          </button>
        </div>

        {/* Modal Header */}
        <div className="auth-modal-header">
          <h2 className="auth-modal-title">
            {mode === 'masuk' ? 'Masuk dengan Email' : 'Daftar Akun Baru'}
          </h2>
          <p className="auth-modal-subtitle">
            {role === 'siswa' ? (
              mode === 'masuk' ? (
                'Masuk sebagai Siswa untuk menyimpan progres belajar dan riwayat nilai kuis.'
              ) : (
                'Buat akun siswa agar modul yang dipelajari dan nilai kuis otomatis tersimpan.'
              )
            ) : (
              mode === 'masuk' ? (
                'Masuk sebagai Guru untuk mengakses kunci jawaban, bank soal, dan pemantauan nilai.'
              ) : (
                'Daftar akun pendidik kimia SMA untuk mengakses ruang kerja guru.'
              )
            )}
          </p>
        </div>

        {/* Notifikasi Error jika ada */}
        {errorPesan && (
          <div className="auth-alert auth-alert-error" role="alert">
            <AlertTriangle size={16} />
            <span>{errorPesan}</span>
          </div>
        )}

        {/* Form Email & Password */}
        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'daftar' && (
            <div className="auth-input-group">
              <label htmlFor="auth-nama" className="auth-label">
                Nama Lengkap
              </label>
              <div className="auth-input-wrapper">
                <User size={18} className="auth-input-icon" />
                <input
                  id="auth-nama"
                  type="text"
                  required
                  placeholder={role === 'siswa' ? 'Contoh: Ahmad Fauzi' : 'Contoh: Dra. Siti Rahmawati'}
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="auth-input"
                />
              </div>
            </div>
          )}

          <div className="auth-input-group">
            <label htmlFor="auth-email" className="auth-label">
              Alamat Email
            </label>
            <div className="auth-input-wrapper">
              <Mail size={18} className="auth-input-icon" />
              <input
                id="auth-email"
                type="email"
                required
                placeholder={role === 'siswa' ? 'nama@sekolah.sch.id' : 'guru@sekolah.sch.id'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label htmlFor="auth-password" className="auth-label">
              Kata Sandi
            </label>
            <div className="auth-input-wrapper">
              <Lock size={18} className="auth-input-icon" />
              <input
                id="auth-password"
                type="password"
                required
                placeholder="Minimal 4 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block auth-submit-btn"
            disabled={memproses}
          >
            {memproses ? (
              <span>Memproses...</span>
            ) : mode === 'masuk' ? (
              <>
                <span>Masuk Sekarang</span>
                <ArrowRight size={16} />
              </>
            ) : (
              <>
                <span>Daftar Akun {role === 'siswa' ? 'Siswa' : 'Guru'}</span>
                <CheckCircle2 size={16} />
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode Masuk / Daftar */}
        <div className="auth-toggle-mode">
          {mode === 'masuk' ? (
            <span>
              Belum memiliki akun?{' '}
              <button
                type="button"
                className="auth-link-btn"
                onClick={() => {
                  setMode('daftar');
                  setErrorPesan(null);
                }}
              >
                Daftar sekarang
              </button>
            </span>
          ) : (
            <span>
              Sudah memiliki akun?{' '}
              <button
                type="button"
                className="auth-link-btn"
                onClick={() => {
                  setMode('masuk');
                  setErrorPesan(null);
                }}
              >
                Masuk di sini
              </button>
            </span>
          )}
        </div>

        {/* Akses Cepat Akun Uji Coba (Demo) */}
        <div className="auth-demo-section">
          <span className="auth-demo-label">Uji Coba Cepat (Akun Demo):</span>
          <div className="auth-demo-buttons">
            <button
              type="button"
              className="auth-demo-chip"
              onClick={() => handleIsiAkunDemo('siswa')}
              title="Isi email siswa@lajuku.id"
            >
              <Sparkles size={13} />
              <span>Demo Siswa</span>
            </button>
            <button
              type="button"
              className="auth-demo-chip"
              onClick={() => handleIsiAkunDemo('guru')}
              title="Isi email guru@lajuku.id"
            >
              <ShieldCheck size={13} />
              <span>Demo Guru</span>
            </button>
          </div>
        </div>

        {/* Opsi Siswa Masuk Tanpa Login (Mode Tamu) */}
        {role === 'siswa' && (
          <div className="auth-guest-option">
            <div className="auth-guest-divider">
              <span>atau</span>
            </div>
            <button
              type="button"
              className="auth-guest-btn"
              onClick={() => {
                onPilihModeTamu();
                onClose();
              }}
            >
              <span className="guest-title">Masuk Tanpa Login (Mode Tamu)</span>
              <span className="guest-subtitle">
                Akses semua materi & kuis (data & nilai tidak tersimpan)
              </span>
            </button>
          </div>
        )}

        {/* Firebase Ready Info Box */}
        <div className="auth-firebase-badge">
          <span className="firebase-dot" />
          <span>Sistem login email siap dihubungkan langsung ke Firebase Authentication.</span>
        </div>
      </div>
    </div>
  );
};

