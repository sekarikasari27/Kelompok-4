import { useState, useEffect } from 'react';
import type { Progres } from './utils/progres';
import { DATA_MODUL } from './data/modul';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Beranda } from './components/Beranda';
import { ModulDetail } from './components/ModulDetail';
import { KuisModul } from './components/KuisModul';
import { PencarianMateri } from './components/PencarianMateri';
import { ModalAuth } from './components/ModalAuth';
import { DashboardGuru } from './components/DashboardGuru';
import {
  ambilStatusAuth,
  masukSebagaiTamu,
  keluarSesi,
  ambilProgresBerdasarkanPeran,
  simpanProgresBerdasarkanPeran,
  pantauStatusAuthFirebase
} from './services/authService';
import type { StatusAuth } from './types/auth';
import './App.css';

export function App() {
  const [authStatus, setAuthStatus] = useState<StatusAuth>(() => ambilStatusAuth());

  // Progres belajar: jika siswa terdaftar, ambil dari data tersimpan; jika tamu, mulai kosong
  const [progres, setProgres] = useState<Progres>(() => {
    const currentAuth = ambilStatusAuth();
    return ambilProgresBerdasarkanPeran(currentAuth.pengguna?.id || null, currentAuth.peran);
  });

  const [tampilan, setTampilan] = useState<'beranda' | 'modul' | 'kuis' | 'guru'>(() => {
    const currentAuth = ambilStatusAuth();
    return currentAuth.peran === 'guru' ? 'guru' : 'beranda';
  });

  const [modulAktifId, setModulAktifId] = useState<string>('modul-1');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });

  // State Modal Autentikasi
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalRole, setAuthModalRole] = useState<'siswa' | 'guru'>('siswa');
  const [authModalMode, setAuthModalMode] = useState<'masuk' | 'daftar'>('masuk');

  // Dengarkan perubahan status login Firebase Authentication
  useEffect(() => {
    const unsub = pantauStatusAuthFirebase((statusBaru) => {
      setAuthStatus(statusBaru);
      if (statusBaru.peran === 'siswa') {
        const p = ambilProgresBerdasarkanPeran(statusBaru.pengguna?.id || null, 'siswa');
        setProgres(p);
      }
    });
    return () => unsub();
  }, []);

  // Simpan progres sesuai peran pengguna (jika tamu: HANYA di memory state, tidak disimpan permanen)
  const updateDanSimpanProgres = (updater: (prev: Progres) => Progres) => {
    setProgres((prev) => {
      const baru = updater(prev);
      // simpanProgresBerdasarkanPeran akan memblokir penyimpanan jika peran === 'tamu'
      simpanProgresBerdasarkanPeran(authStatus.pengguna?.id || null, authStatus.peran, baru);
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

  const handleBukaDashboardGuru = () => {
    if (authStatus.peran === 'guru') {
      setTampilan('guru');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleBukaModalAuth('guru', 'masuk');
    }
  };

  const handleBukaModalAuth = (role: 'siswa' | 'guru' = 'siswa', mode: 'masuk' | 'daftar' = 'masuk') => {
    setAuthModalRole(role);
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handlePilihModeTamu = () => {
    const statusTamu = masukSebagaiTamu();
    setAuthStatus(statusTamu);
    // Kosongkan data karena tamu tidak menyimpan data
    setProgres({ modulDibuka: [], skorKuis: {} });
    setTampilan('beranda');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthSuccess = (statusBaru: StatusAuth) => {
    setAuthStatus(statusBaru);

    if (statusBaru.peran === 'siswa') {
      // Ambil progres tersimpan untuk siswa ini
      const savedProgres = ambilProgresBerdasarkanPeran(statusBaru.pengguna?.id || null, 'siswa');

      // Jika sebelumnya siswa mengerjakan sesuatu di sesi tamu, gabungkan agar nilainya tidak hilang
      const mergedProgres: Progres = {
        modulDibuka: Array.from(new Set([...savedProgres.modulDibuka, ...progres.modulDibuka])),
        skorKuis: { ...savedProgres.skorKuis, ...progres.skorKuis }
      };

      setProgres(mergedProgres);
      simpanProgresBerdasarkanPeran(statusBaru.pengguna?.id || null, 'siswa', mergedProgres);
      setTampilan('beranda');
    } else if (statusBaru.peran === 'guru') {
      setTampilan('guru');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleKeluar = async () => {
    const statusTamu = await keluarSesi();
    setAuthStatus(statusTamu);
    // Kosongkan progres sesi karena sesi akun berakhir
    setProgres({ modulDibuka: [], skorKuis: {} });
    setTampilan('beranda');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const modulAktif = DATA_MODUL.find((m) => m.id === modulAktifId) || DATA_MODUL[0];

  return (
    <div className={`lajuku-app-wrapper ${isSidebarOpen ? 'has-sidebar-open' : 'has-sidebar-closed'}`}>
      {/* Background Decorative Ambient Glow */}
      <div className="ambient-background-glow" aria-hidden="true" />

      {/* Sidebar Navigasi Kiri */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        tampilan={tampilan}
        modulAktifId={modulAktifId}
        progres={progres}
        statusAuth={authStatus}
        onPilihModul={handlePilihModul}
        onBukaBeranda={handleBukaBeranda}
        onMulaiKuis={handleMulaiKuis}
        onBukaPencarian={() => setIsSearchOpen(true)}
        onBukaDashboardGuru={handleBukaDashboardGuru}
        onBukaModalAuth={(role) => handleBukaModalAuth(role || 'siswa', 'masuk')}
        onKeluar={handleKeluar}
      />

      {/* Konten Utama Aplikasi */}
      <div className="lajuku-main-layout">
        {/* Navigation Bar */}
        <Navbar
          progres={progres}
          statusAuth={authStatus}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          onBukaBeranda={handleBukaBeranda}
          onBukaPencarian={() => setIsSearchOpen(true)}
          onBukaModalAuth={(role) => handleBukaModalAuth(role || 'siswa', 'masuk')}
          onBukaDashboardGuru={handleBukaDashboardGuru}
          onKeluar={handleKeluar}
        />

        {/* Main Learning Content Area */}
        <main className="lajuku-main-container">
          {tampilan === 'beranda' && (
            <Beranda
              progres={progres}
              statusAuth={authStatus}
              onPilihModul={handlePilihModul}
              onMulaiKuis={handleMulaiKuis}
              onBukaModalAuth={handleBukaModalAuth}
              onPilihModeTamu={handlePilihModeTamu}
              onBukaDashboardGuru={handleBukaDashboardGuru}
              onKeluar={handleKeluar}
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

          {tampilan === 'guru' && (
            authStatus.pengguna && authStatus.peran === 'guru' ? (
              <DashboardGuru
                guru={authStatus.pengguna}
                onPratinjauSiswa={handleBukaBeranda}
                onBukaModul={handlePilihModul}
                onKeluar={handleKeluar}
              />
            ) : (
              <Beranda
                progres={progres}
                statusAuth={authStatus}
                onPilihModul={handlePilihModul}
                onMulaiKuis={handleMulaiKuis}
                onBukaModalAuth={handleBukaModalAuth}
                onPilihModeTamu={handlePilihModeTamu}
                onBukaDashboardGuru={handleBukaDashboardGuru}
                onKeluar={handleKeluar}
              />
            )
          )}
        </main>

        {/* Footer */}
        <footer className="lajuku-footer">
          <div className="footer-inner">
            <div className="footer-left">
              <span className="footer-brand">LajuKu • Belajar Laju Reaksi Interaktif</span>
              <span className="footer-sub">
                Dirancang untuk Siswa & Pendidik Kimia SMA Kelas XI (Kurikulum Merdeka) • Siap Terintegrasi Firebase
              </span>
            </div>
            <div className="footer-right">
              <span>Satuan Laju: M/s • Teori Tumbukan (Eₐ) • Orde Reaksi v = k[A]ᵐ[B]ⁿ</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Pencarian Materi Modal */}
      <PencarianMateri
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onPilihModul={handlePilihModul}
      />

      {/* Modal Autentikasi (Masuk / Daftar Akun Email Siswa & Guru) */}
      <ModalAuth
        key={`${authModalRole}-${authModalMode}-${isAuthModalOpen}`}
        isOpen={isAuthModalOpen}
        initialRole={authModalRole}
        initialMode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        onPilihModeTamu={handlePilihModeTamu}
      />
    </div>
  );
}

export default App;
