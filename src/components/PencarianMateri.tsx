import React, { useState, useEffect } from 'react';
import { Search, X, ChevronRight } from 'lucide-react';
import { DATA_MODUL } from '../data/modul';

interface PencarianMateriProps {
  isOpen: boolean;
  onClose: () => void;
  onPilihModul: (modulId: string) => void;
}

interface HasilPencarian {
  modulId: string;
  nomorModul: number;
  judulModul: string;
  judulSubtopik: string;
  potonganTeks: string;
}

export const PencarianMateri: React.FC<PencarianMateriProps> = ({
  isOpen,
  onClose,
  onPilihModul
}) => {
  const [kataKunci, setKataKunci] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle search
        if (!isOpen) {
          // Open handled outside
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const kueri = kataKunci.trim().toLowerCase();
  const hasil: HasilPencarian[] = [];

  if (kueri.length >= 2) {
    DATA_MODUL.forEach((modul) => {
      modul.subtopik.forEach((sub) => {
        const cocokJudul = sub.judul.toLowerCase().includes(kueri);
        const kontenCocok = sub.konten.find((p) => p.toLowerCase().includes(kueri));
        const tipsCocok = sub.tips && sub.tips.toLowerCase().includes(kueri);

        if (cocokJudul || kontenCocok || tipsCocok) {
          const potongan = kontenCocok || sub.tips || sub.konten[0];
          hasil.push({
            modulId: modul.id,
            nomorModul: modul.nomor,
            judulModul: modul.judul,
            judulSubtopik: sub.judul,
            potonganTeks: potongan.length > 140 ? potongan.slice(0, 140) + '...' : potongan
          });
        }
      });
    });
  }

  const handleKlikHasil = (modulId: string) => {
    onPilihModul(modulId);
    onClose();
  };

  return (
    <div className="search-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="search-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="search-modal-header">
          <Search size={20} className="search-modal-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Cari materi kimia: orde reaksi, tumbukan, suhu, Eₐ, katalis..."
            value={kataKunci}
            onChange={(e) => setKataKunci(e.target.value)}
            autoFocus
          />
          <button
            type="button"
            className="search-close-btn"
            onClick={onClose}
            aria-label="Tutup pencarian"
          >
            <X size={18} />
          </button>
        </div>

        <div className="search-modal-body">
          {kueri.length < 2 ? (
            <div className="search-empty-state">
              <p>Ketik minimal 2 karakter untuk mencari topik pembahasan di seluruh modul.</p>
              <div className="search-quick-tags">
                <span className="search-tag-label">Pencarian populer:</span>
                {['Teori Tumbukan', 'Energi Aktivasi (Eₐ)', 'Katalis', 'Orde Reaksi', 'Satuan M/s', 'Luas Permukaan'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className="quick-search-pill"
                    onClick={() => setKataKunci(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : hasil.length === 0 ? (
            <div className="search-empty-state">
              <p>Tidak ditemukan materi dengan kata kunci "{kataKunci}".</p>
              <span className="search-hint">Coba cari istilah lain seperti <em>laju</em>, <em>konsentrasi</em>, atau <em>orde</em>.</span>
            </div>
          ) : (
            <div className="search-results-list">
              <div className="search-results-count">Ditemukan {hasil.length} materi relevan:</div>
              {hasil.map((item, idx) => (
                <button
                  key={`${item.modulId}-${idx}`}
                  type="button"
                  className="search-result-item"
                  onClick={() => handleKlikHasil(item.modulId)}
                >
                  <div className="search-result-left">
                    <span className="search-badge">Modul {item.nomorModul}</span>
                    <h4 className="search-result-title">{item.judulSubtopik}</h4>
                    <p className="search-result-snippet">{item.potonganTeks}</p>
                  </div>
                  <ChevronRight size={18} className="search-result-arrow" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
