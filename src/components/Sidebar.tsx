import React, { useState } from 'react';
import {
  Home,
  BookOpen,
  BarChart3,
  Flame,
  Zap,
  FlaskConical,
  HelpCircle,
  Search,
  ShieldCheck,
  CheckCircle,
  X,
  ChevronDown,
  ChevronRight,
  Sparkles,
  LogIn,
  LogOut,
  User
} from 'lucide-react';
import type { Progres } from '../utils/progres';
import type { StatusAuth } from '../types/auth';
import { DATA_MODUL } from '../data/modul';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  tampilan: 'beranda' | 'modul' | 'kuis' | 'guru';
  modulAktifId: string;
  progres: Progres;
  statusAuth: StatusAuth;
  onPilihModul: (modulId: string) => void;
  onBukaBeranda: () => void;
  onMulaiKuis: (modulId: string) => void;
  onBukaPencarian: () => void;
  onBukaDashboardGuru: () => void;
  onBukaModalAuth: (role?: 'siswa' | 'guru') => void;
  onKeluar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  tampilan,
  modulAktifId,
  progres,
  statusAuth,
  onPilihModul,
  onBukaBeranda,
  onMulaiKuis,
  onBukaPencarian,
  onBukaDashboardGuru,
  onBukaModalAuth,
  onKeluar
}) => {
  const [kuisDropdownOpen, setKuisDropdownOpen] = useState<boolean>(true);

  const modulDibuka = Array.isArray(progres?.modulDibuka) ? progres.modulDibuka : [];
  const skorKuis = progres?.skorKuis && typeof progres.skorKuis === 'object' ? progres.skorKuis : {};

  const isTamu = !statusAuth || statusAuth.peran === 'tamu';
  const isSiswa = statusAuth?.peran === 'siswa' && Boolean(statusAuth?.terautentikasi);
  const isGuru = statusAuth?.peran === 'guru' && Boolean(statusAuth?.terautentikasi);

  const handleNavClick = (aksi: () => void) => {
    aksi();
    // Pada layar kecil (mobile/tablet), tutup sidebar setelah item dipilih
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const getModulIcon = (nomor: number) => {
    if (nomor === 1) return <BarChart3 size={18} className="text-cyan" />;
    if (nomor === 2) return <Flame size={18} className="text-amber" />;
    return <Zap size={18} className="text-purple" />;
  };

  return (
    <>
      {/* Backdrop overlay untuk tablet & mobile */}
      <div
        className={`sidebar-backdrop ${isOpen ? 'active' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`lajuku-sidebar ${isOpen ? 'is-open' : 'is-closed'}`} aria-label="Navigasi Utama">
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-brand" onClick={() => handleNavClick(onBukaBeranda)}>
            <div className="sidebar-brand-icon">
              <Sparkles size={18} />
            </div>
            <div className="sidebar-brand-text">
              <span className="sidebar-brand-name">LajuKu</span>
              <span className="sidebar-brand-badge">Kimia XI SMA</span>
            </div>
          </div>

          <button
            type="button"
            className="sidebar-close-btn"
            onClick={onClose}
            aria-label="Tutup menu samping"
          >
            <X size={18} />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="sidebar-scrollable-content">
          {/* Quick Search Shortcut */}
          <div className="sidebar-search-wrapper">
            <button
              type="button"
              className="sidebar-search-button"
              onClick={() => handleNavClick(onBukaPencarian)}
              title="Cari materi dan rumus kimia"
            >
              <Search size={15} />
              <span>Cari Materi...</span>
              <kbd className="sidebar-kbd">Ctrl+K</kbd>
            </button>
          </div>

          {/* Group 1: Navigasi Utama */}
          <div className="sidebar-menu-group">
            <span className="sidebar-group-title">Navigasi Utama</span>
            <ul className="sidebar-nav-list">
              <li>
                <button
                  type="button"
                  className={`sidebar-nav-item ${tampilan === 'beranda' ? 'active' : ''}`}
                  onClick={() => handleNavClick(onBukaBeranda)}
                >
                  <Home size={18} className="nav-item-icon" />
                  <span className="nav-item-text">Beranda</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Group 2: Modul Pembelajaran */}
          <div className="sidebar-menu-group">
            <span className="sidebar-group-title">Modul Pembelajaran</span>
            <ul className="sidebar-nav-list">
              {DATA_MODUL.map((m) => {
                const isActive = tampilan === 'modul' && modulAktifId === m.id;
                const isSelesai = skorKuis[m.id] !== undefined;
                const isDibuka = modulDibuka.includes(m.id);

                return (
                  <li key={m.id}>
                    <button
                      type="button"
                      className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                      onClick={() => handleNavClick(() => onPilihModul(m.id))}
                    >
                      <span className="nav-item-icon">{getModulIcon(m.nomor)}</span>
                      <div className="nav-item-dual">
                        <span className="nav-item-text">Modul {m.nomor}</span>
                        <span className="nav-item-subtext">{m.judul}</span>
                      </div>
                      {isSelesai ? (
                        <span className="sidebar-status-pill done" title={`Kuis Selesai (${skorKuis[m.id]}%)`}>
                          <CheckCircle size={12} />
                        </span>
                      ) : isDibuka ? (
                        <span className="sidebar-status-pill in-progress" title="Sedang dipelajari">
                          •
                        </span>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Group 3: Praktik & Evaluasi */}
          <div className="sidebar-menu-group">
            <span className="sidebar-group-title">Praktik & Evaluasi</span>
            <ul className="sidebar-nav-list">
              {/* Simulasi Tumbukan */}
              <li>
                <button
                  type="button"
                  className={`sidebar-nav-item ${tampilan === 'modul' && modulAktifId === 'modul-2' ? 'active-accent' : ''}`}
                  onClick={() => handleNavClick(() => onPilihModul('modul-2'))}
                  title="Laboratorium Virtual Teori Tumbukan"
                >
                  <FlaskConical size={18} className="nav-item-icon text-cyan" />
                  <div className="nav-item-dual">
                    <span className="nav-item-text">Lab Virtual Tumbukan</span>
                    <span className="nav-item-subtext">Simulasi Partikel Interaktif</span>
                  </div>
                </button>
              </li>

              {/* Kuis Interaktif Dropdown */}
              <li>
                <button
                  type="button"
                  className={`sidebar-nav-item kuis-trigger ${tampilan === 'kuis' ? 'active' : ''}`}
                  onClick={() => setKuisDropdownOpen(!kuisDropdownOpen)}
                >
                  <HelpCircle size={18} className="nav-item-icon text-amber" />
                  <span className="nav-item-text">Latihan & Kuis</span>
                  {kuisDropdownOpen ? (
                    <ChevronDown size={15} className="dropdown-arrow" />
                  ) : (
                    <ChevronRight size={15} className="dropdown-arrow" />
                  )}
                </button>

                {kuisDropdownOpen && (
                  <ul className="sidebar-sub-list">
                    {DATA_MODUL.map((m) => {
                      const isKuisActive = tampilan === 'kuis' && modulAktifId === m.id;
                      const skor = skorKuis[m.id];
                      return (
                        <li key={m.id}>
                          <button
                            type="button"
                            className={`sidebar-sub-item ${isKuisActive ? 'active' : ''}`}
                            onClick={() => handleNavClick(() => onMulaiKuis(m.id))}
                          >
                            <span className="sub-item-dot" />
                            <span className="sub-item-text">Kuis Modul {m.nomor}</span>
                            {skor !== undefined && (
                              <span className="sub-item-score">{skor}%</span>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            </ul>
          </div>

          {/* Group 4: Ruang Pendidik (khusus Guru) */}
          {isGuru && (
            <div className="sidebar-menu-group">
              <span className="sidebar-group-title">Pendidik & Guru</span>
              <ul className="sidebar-nav-list">
                <li>
                  <button
                    type="button"
                    className={`sidebar-nav-item teacher-item ${tampilan === 'guru' ? 'active' : ''}`}
                    onClick={() => handleNavClick(onBukaDashboardGuru)}
                  >
                    <ShieldCheck size={18} className="nav-item-icon text-purple" />
                    <div className="nav-item-dual">
                      <span className="nav-item-text">Ruang Guru</span>
                      <span className="nav-item-subtext">Kunci Jawaban & Rekap Siswa</span>
                    </div>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Sidebar Footer: Info Pengguna & Autentikasi */}
        <div className="sidebar-footer">
          <div className="sidebar-user-card">
            <div className="user-card-avatar">
              {isGuru ? (
                <ShieldCheck size={18} className="text-purple" />
              ) : isSiswa ? (
                <User size={18} className="text-cyan" />
              ) : (
                <BookOpen size={18} className="text-amber" />
              )}
            </div>

            <div className="user-card-details">
              <span className="user-card-name">
                {isTamu
                  ? 'Mode Tamu'
                  : statusAuth.pengguna?.nama || 'Pengguna'}
              </span>
              <span className="user-card-sub">
                {isTamu
                  ? 'Data tidak disimpan'
                  : isSiswa
                  ? 'Siswa (Tersimpan)'
                  : 'Pendidik Kimia'}
              </span>
            </div>
          </div>

          <div className="sidebar-footer-actions">
            {isTamu ? (
              <button
                type="button"
                className="sidebar-auth-btn login-btn"
                onClick={() => handleNavClick(() => onBukaModalAuth('siswa'))}
              >
                <LogIn size={15} />
                <span>Masuk Email</span>
              </button>
            ) : (
              <button
                type="button"
                className="sidebar-auth-btn logout-btn"
                onClick={() => handleNavClick(onKeluar)}
                title="Keluar dari akun"
              >
                <LogOut size={15} />
                <span>Keluar</span>
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

