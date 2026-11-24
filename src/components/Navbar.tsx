import React from 'react';
import { BookOpen, Search, Sparkles, CheckCircle2, LogIn, LogOut, ShieldCheck, User, Menu } from 'lucide-react';
import type { Progres } from '../utils/progres';
import type { StatusAuth } from '../types/auth';

interface NavbarProps {
  progres: Progres;
  statusAuth: StatusAuth;
  isSidebarOpen?: boolean;
  onToggleSidebar: () => void;
  onBukaBeranda: () => void;
  onBukaPencarian: () => void;
  onBukaModalAuth: (role?: 'siswa' | 'guru') => void;
  onBukaDashboardGuru: () => void;
  onKeluar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  progres,
  statusAuth,
  isSidebarOpen,
  onToggleSidebar,
  onBukaBeranda,
  onBukaPencarian,
  onBukaModalAuth,
  onBukaDashboardGuru,
  onKeluar
}) => {
  const skorKuis = progres?.skorKuis && typeof progres.skorKuis === 'object' ? progres.skorKuis : {};
  const jumlahModulSelesai = Object.keys(skorKuis).length;
  const isTamu = !statusAuth || statusAuth.peran === 'tamu';
  const isSiswa = statusAuth?.peran === 'siswa' && Boolean(statusAuth?.terautentikasi);
  const isGuru = statusAuth?.peran === 'guru' && Boolean(statusAuth?.terautentikasi);

  return (
    <header className="navbar-lajuku">
      <div className="navbar-content">
        <div className="navbar-left-group">
          {/* Tombol Hamburger Toggle Sidebar */}
          <button
            type="button"
            className={`navbar-hamburger-btn ${isSidebarOpen ? 'active' : ''}`}
            onClick={onToggleSidebar}
            aria-label="Buka atau tutup menu samping navigasi"
            title="Menu Navigasi Sidebar"
          >
            <Menu size={22} />
          </button>

          <button
            type="button"
            className="brand-button"
            onClick={onBukaBeranda}
            aria-label="Kembali ke Beranda LajuKu"
          >
            <div className="brand-icon-wrapper">
              <Sparkles size={20} className="brand-sparkle" />
            </div>
            <div className="brand-text">
              <span className="brand-name">LajuKu</span>
              <span className="brand-tagline">Kimia SMA Kelas XI</span>
            </div>
          </button>
        </div>

        <div className="navbar-actions">
          <button
            type="button"
            className="search-nav-btn"
            onClick={onBukaPencarian}
            title="Cari materi dan rumus kimia"
          >
            <Search size={16} />
            <span className="search-text">Cari Materi...</span>
            <kbd className="search-kbd">Ctrl+K</kbd>
          </button>

          <div className="progress-badge" title="Jumlah modul yang kuisnya telah dikerjakan">
            <CheckCircle2 size={16} className="progress-badge-icon" />
            <span>{jumlahModulSelesai} / 3 Modul Selesai</span>
          </div>

          <button
            type="button"
            className="home-nav-btn"
            onClick={onBukaBeranda}
            title="Buka Beranda Modul"
          >
            <BookOpen size={16} />
            <span>Beranda</span>
          </button>

          {/* User Auth Status & Buttons */}
          <div className="navbar-auth-controls">
            {isTamu && (
              <div className="guest-nav-group">
                <span className="nav-role-badge badge-guest" title="Data tidak tersimpan saat sesi berakhir">
                  Mode Tamu
                </span>
                <button
                  type="button"
                  className="nav-auth-btn nav-login-btn"
                  onClick={() => onBukaModalAuth('siswa')}
                  title="Masuk dengan email agar progres tersimpan"
                >
                  <LogIn size={15} />
                  <span>Masuk Email</span>
                </button>
              </div>
            )}

            {isSiswa && (
              <div className="user-nav-group">
                <div className="nav-user-pill" title={`Masuk sebagai ${statusAuth.pengguna?.email}`}>
                  <User size={15} className="text-cyan" />
                  <span className="nav-user-name">{statusAuth.pengguna?.nama}</span>
                </div>
                <button
                  type="button"
                  className="nav-auth-btn nav-logout-btn"
                  onClick={onKeluar}
                  title="Keluar dari akun siswa"
                >
                  <LogOut size={15} />
                </button>
              </div>
            )}

            {isGuru && (
              <div className="teacher-nav-group">
                <button
                  type="button"
                  className="nav-teacher-dashboard-btn"
                  onClick={onBukaDashboardGuru}
                  title="Buka Ruang Guru & Kunci Jawaban"
                >
                  <ShieldCheck size={16} />
                  <span>Ruang Guru</span>
                </button>
                <button
                  type="button"
                  className="nav-auth-btn nav-logout-btn"
                  onClick={onKeluar}
                  title="Keluar dari sesi guru"
                >
                  <LogOut size={15} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
