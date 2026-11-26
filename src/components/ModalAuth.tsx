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

  if (!isOpen) return null;

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
              ? 'Gunakan email dan kata sandi Anda. Sistem akan mengenali akun Siswa maupun Guru secara otomatis.'
              : 'Daftarkan akun email Anda agar hasil kuis, nilai modul, dan riwayat belajar tersimpan secara permanen.'}
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
