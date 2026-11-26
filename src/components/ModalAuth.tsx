import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  KeyRound
} from 'lucide-react';
import { masukDenganEmail, daftarDenganEmail, masukDenganGoogle } from '../services/authService';
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
  initialMode = 'masuk',
  onClose,
  onSuccess,
  onPilihModeTamu
}) => {
  const [mode, setMode] = useState<'masuk' | 'daftar'>(initialMode);
  const [nama, setNama] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [konfirmasiPassword, setKonfirmasiPassword] = useState<string>('');
  const [errorPesan, setErrorPesan] = useState<string | null>(null);
  const [suksesPesan, setSuksesPesan] = useState<string | null>(null);
  const [memproses, setMemproses] = useState<boolean>(false);
  const [memprosesGoogle, setMemprosesGoogle] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleMasukGoogle = async () => {
    setErrorPesan(null);
    setSuksesPesan(null);
    setMemprosesGoogle(true);

    try {
      const res = await masukDenganGoogle();
      if (res.sukses && res.status) {
        setSuksesPesan('Berhasil masuk dengan akun Google! Mengarahkan ke halaman...');
        setTimeout(() => {
          onSuccess(res.status!);
          onClose();
        }, 500);
      } else {
        setErrorPesan(res.pesan || 'Gagal masuk dengan akun Google.');
      }
    } catch {
      setErrorPesan('Terjadi kesalahan saat menghubungkan ke akun Google.');
    } finally {
      setMemprosesGoogle(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorPesan(null);
    setSuksesPesan(null);
    setMemproses(true);

    try {
      if (mode === 'masuk') {
        const res = await masukDenganEmail(email, password);
        if (res.sukses && res.status) {
          setSuksesPesan('Berhasil masuk! Mengarahkan ke halaman...');
          setTimeout(() => {
            onSuccess(res.status!);
            onClose();
          }, 400);
        } else {
          setErrorPesan(res.pesan || 'Email atau kata sandi salah. Silakan periksa kembali.');
        }
      } else {
        // Validasi pendaftaran
        if (password !== konfirmasiPassword) {
          setErrorPesan('Konfirmasi kata sandi tidak cocok. Mohon ketik ulang kata sandi Anda.');
          setMemproses(false);
          return;
        }

        const res = await daftarDenganEmail(nama, email, password, konfirmasiPassword);
        if (res.sukses && res.status) {
          setSuksesPesan('Pendaftaran berhasil! Akun Anda telah siap.');
          setTimeout(() => {
            onSuccess(res.status!);
            onClose();
          }, 500);
        } else {
          setErrorPesan(res.pesan || 'Gagal mendaftar. Pastikan email dan kata sandi valid.');
        }
      }
    } catch {
      setErrorPesan('Terjadi gangguan jaringan atau sistem. Silakan coba kembali.');
    } finally {
      setMemproses(false);
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

        {/* Modal Header */}
        <div className="auth-modal-header">
          <div className="auth-header-badge">
            <ShieldCheck size={14} className="text-cyan" />
            <span>Autentikasi Pengguna LajuKu</span>
          </div>

          <h2 className="auth-modal-title">
            {mode === 'masuk' ? 'Masuk ke Akun Anda' : 'Buat Akun Siswa Baru'}
          </h2>
          <p className="auth-modal-subtitle">
            {mode === 'masuk'
              ? 'Gunakan akun Google atau email Anda. Sistem akan mengenali akun Siswa maupun Guru secara otomatis.'
              : 'Daftarkan akun Google atau email Anda agar hasil kuis, nilai modul, dan riwayat belajar tersimpan secara permanen.'}
          </p>
        </div>

        {/* Notifikasi Pesan Sukses jika ada */}
        {suksesPesan && (
          <div className="auth-alert auth-alert-success" role="status">
            <CheckCircle2 size={16} />
            <span>{suksesPesan}</span>
          </div>
        )}

        {/* Notifikasi Pesan Error jika ada */}
        {errorPesan && (
          <div className="auth-alert auth-alert-error" role="alert">
            <AlertTriangle size={16} />
            <span>{errorPesan}</span>
          </div>
        )}

        {/* Pilihan Cepat: Masuk dengan Akun Google */}
        <div className="auth-social-section">
          <button
            type="button"
            className="btn-google"
            onClick={handleMasukGoogle}
            disabled={memproses || memprosesGoogle}
            title="Masuk secara instan menggunakan akun Google Anda"
          >
            {memprosesGoogle ? (
              <span className="google-btn-loading">Menghubungkan ke Google...</span>
            ) : (
              <>
                <svg className="google-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{mode === 'masuk' ? 'Lanjutkan dengan Akun Google' : 'Daftar dengan Akun Google'}</span>
              </>
            )}
          </button>
        </div>

        <div className="auth-divider-line">
          <span>atau masuk dengan email</span>
        </div>

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
                  autoFocus
                  placeholder="Contoh: Ahmad Fauzi"
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
                placeholder="nama@email.com"
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
                minLength={6}
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
              />
            </div>
          </div>

          {mode === 'daftar' && (
            <div className="auth-input-group">
              <label htmlFor="auth-konfirmasi-password" className="auth-label">
                Konfirmasi Kata Sandi
              </label>
              <div className="auth-input-wrapper">
                <KeyRound size={18} className="auth-input-icon" />
                <input
                  id="auth-konfirmasi-password"
                  type="password"
                  required
                  minLength={6}
                  placeholder="Ulangi kata sandi di atas"
                  value={konfirmasiPassword}
                  onChange={(e) => setKonfirmasiPassword(e.target.value)}
                  className="auth-input"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-block auth-submit-btn"
            disabled={memproses}
          >
            {memproses ? (
              <span>Memproses data...</span>
            ) : mode === 'masuk' ? (
              <>
                <span>Masuk Sekarang</span>
                <ArrowRight size={16} />
              </>
            ) : (
              <>
                <span>Daftar Akun Siswa</span>
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
                  setSuksesPesan(null);
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
                  setSuksesPesan(null);
                }}
              >
                Masuk di sini
              </button>
            </span>
          )}
        </div>

        {/* Opsi Akses Tanpa Login (Mode Tamu) */}
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
            <span className="guest-title">Lanjutkan Tanpa Login (Mode Tamu)</span>
            <span className="guest-subtitle">
              Tetap dapat mengakses seluruh modul materi (namun data nilai tidak disimpan)
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
