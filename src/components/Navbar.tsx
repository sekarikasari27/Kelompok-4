import React from 'react';
import { BookOpen, Search, Sparkles, CheckCircle2 } from 'lucide-react';
import type { Progres } from '../utils/progres';

interface NavbarProps {
  progres: Progres;
  onBukaBeranda: () => void;
  onBukaPencarian: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  progres,
  onBukaBeranda,
  onBukaPencarian
}) => {
  const jumlahModulSelesai = Object.keys(progres.skorKuis).length;

  return (
    <header className="navbar-lajuku">
      <div className="navbar-content">
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
        </div>
      </div>
    </header>
  );
};
