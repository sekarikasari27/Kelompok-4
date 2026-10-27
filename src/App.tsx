import { useState } from 'react';
import { bacaProgres, simpanProgres, type Progres } from './utils/progres';
import { DATA_MODUL } from './data/modul';
import { Navbar } from './components/Navbar';
import { Beranda } from './components/Beranda';
import { ModulDetail } from './components/ModulDetail';
import { KuisModul } from './components/KuisModul';
import { PencarianMateri } from './components/PencarianMateri';
import './App.css';

export function App() {
  const [progres, setProgres] = useState<Progres>(() => bacaProgres());
  const [tampilan, setTampilan] = useState<'beranda' | 'modul' | 'kuis'>('beranda');
  const [modulAktifId, setModulAktifId] = useState<string>('modul-1');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Simpan progres setiap kali state progres berubah
  const updateDanSimpanProgres = (updater: (prev: Progres) => Progres) => {
    setProgres((prev) => {
      const baru = updater(prev);
      simpanProgres(baru);
      return baru;
    });
  };

  const handlePilihModul = (modulId: string) => {
    setModulAktifId(modulId);
    setTampilan('modul');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Tandai modul sebagai sudah dibuka jika belum ada di daftar
    updateDanSimpanProgres((prev) => {
      if (!prev.modulDibuka.includes(modulId)) {
        return {
          ...prev,
          modulDibuka: [...prev.modulDibuka, modulId]
        };
      }
      return prev;
    });
  };

  const handleMulaiKuis = (modulId: string) => {
    setModulAktifId(modulId);
    setTampilan('kuis');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelesaiKuis = (skor: number) => {
    updateDanSimpanProgres((prev) => ({
      ...prev,
      skorKuis: {
        ...prev.skorKuis,
        [modulAktifId]: skor
      }
    }));
  };

  const handleBukaBeranda = () => {
    setTampilan('beranda');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const modulAktif = DATA_MODUL.find((m) => m.id === modulAktifId) || DATA_MODUL[0];

  return (
    <div className="lajuku-app-wrapper">
      {/* Background Decorative Ambient Glow */}
      <div className="ambient-background-glow" aria-hidden="true" />

      {/* Navigation Bar */}
      <Navbar
        progres={progres}
        onBukaBeranda={handleBukaBeranda}
        onBukaPencarian={() => setIsSearchOpen(true)}
      />

      {/* Main Learning Content Area */}
      <main className="lajuku-main-container">
        {tampilan === 'beranda' && (
          <Beranda
            progres={progres}
            onPilihModul={handlePilihModul}
            onMulaiKuis={handleMulaiKuis}
          />
        )}

        {tampilan === 'modul' && (
          <ModulDetail
            modul={modulAktif}
            skorKuis={progres.skorKuis[modulAktif.id]}
            onKembaliKeBeranda={handleBukaBeranda}
            onMulaiKuis={() => handleMulaiKuis(modulAktif.id)}
            onNavigasiModul={handlePilihModul}
          />
        )}

        {tampilan === 'kuis' && (
          <KuisModul
            modulId={modulAktifId}
            skorSebelumnya={progres.skorKuis[modulAktifId]}
            onSelesaiKuis={handleSelesaiKuis}
            onKembaliKeModul={() => {
              setTampilan('modul');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onKembaliKeBeranda={handleBukaBeranda}
          />
        )}
      </main>

      {/* Pencarian Materi Modal */}
      <PencarianMateri
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onPilihModul={handlePilihModul}
      />

      {/* Footer */}
      <footer className="lajuku-footer">
        <div className="footer-inner">
          <div className="footer-left">
            <span className="footer-brand">LajuKu • Belajar Laju Reaksi Interaktif</span>
            <span className="footer-sub">
              Dirancang untuk Siswa SMA Kelas XI (Fase F - Kurikulum Merdeka)
            </span>
          </div>
          <div className="footer-right">
            <span>Satuan Laju: M/s • Teori Tumbukan • Orde Reaksi v = k[A]ᵐ[B]ⁿ</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
