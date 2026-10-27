import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Zap, Flame, Box, ShieldAlert } from 'lucide-react';

interface Partikel {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  jenis: 'A' | 'B' | 'PRODUK';
  umurProduk?: number;
}

export const SimulasiTumbukan: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Parameter kontrol simulasi
  const [konsentrasi, setKonsentrasi] = useState<number>(30); // 15, 30, 50 partikel
  const [suhu, setSuhu] = useState<number>(40); // 20 - 80 derajat C
  const [luasPermukaan, setLuasPermukaan] = useState<'bongkahan' | 'kepingan' | 'serbuk'>('kepingan');
  const [katalisAktif, setKatalisAktif] = useState<boolean>(false);
  const [isBerjalan, setIsBerjalan] = useState<boolean>(true);

  // Statistik interaksi
  const [tumbukanTotal, setTumbukanTotal] = useState<number>(0);
  const [tumbukanEfektif, setTumbukanEfektif] = useState<number>(0);

  const partikelRef = useRef<Partikel[]>([]);
  const animFrameRef = useRef<number | null>(null);

  // Inisialisasi partikel
  const initPartikel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.width;
    const height = canvas.height;
    const jumlah = konsentrasi;
    const partikelBaru: Partikel[] = [];

    // Faktor kecepatan berdasarkan suhu (20C - 80C)
    const faktorKecepatan = 0.5 + (suhu / 40);

    for (let i = 0; i < jumlah; i++) {
      const jenis = i % 2 === 0 ? 'A' : 'B';
      const angle = Math.random() * Math.PI * 2;
      const speed = (Math.random() * 1.5 + 1) * faktorKecepatan;

      partikelBaru.push({
        x: Math.random() * (width - 40) + 20,
        y: Math.random() * (height - 40) + 20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: jenis === 'A' ? 7 : 6,
        jenis
      });
    }

    partikelRef.current = partikelBaru;
    setTumbukanTotal(0);
    setTumbukanEfektif(0);
  };

  useEffect(() => {
    initPartikel();
  }, [konsentrasi]);

  // Update kecepatan saat suhu berubah
  useEffect(() => {
    const faktor = 0.5 + (suhu / 40);
    partikelRef.current.forEach((p) => {
      const currentSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy) || 1;
      const newSpeed = (Math.random() * 1.5 + 1) * faktor;
      p.vx = (p.vx / currentSpeed) * newSpeed;
      p.vy = (p.vy / currentSpeed) * newSpeed;
    });
  }, [suhu]);

  // Loop animasi Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let totalColl = 0;
    let effColl = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Gambar area reaksi (wadah)
      ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Gambar grid tipis latar belakang
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Ambang batas energi aktivasi (Eₐ)
      // Katalis menurunkan ambang batas sebesar 45%
      const ambangEa = katalisAktif ? 1.8 : 3.2;

      // Pengaruh luas permukaan pada efisiensi kontak
      const faktorLuas = luasPermukaan === 'serbuk' ? 1.0 : luasPermukaan === 'kepingan' ? 0.7 : 0.4;

      const partikel = partikelRef.current;

      if (isBerjalan) {
        // Gerakkan partikel dan pantulkan dari dinding
        for (let i = 0; i < partikel.length; i++) {
          const p = partikel[i];

          p.x += p.vx;
          p.y += p.vy;

          if (p.x - p.radius < 0) {
            p.x = p.radius;
            p.vx = -p.vx;
          } else if (p.x + p.radius > canvas.width) {
            p.x = canvas.width - p.radius;
            p.vx = -p.vx;
          }

          if (p.y - p.radius < 0) {
            p.y = p.radius;
            p.vy = -p.vy;
          } else if (p.y + p.radius > canvas.height) {
            p.y = canvas.height - p.radius;
            p.vy = -p.vy;
          }

          // Periksa tumbukan antarpartikel
          for (let j = i + 1; j < partikel.length; j++) {
            const p2 = partikel[j];
            const dx = p2.x - p.x;
            const dy = p2.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const minDist = p.radius + p2.radius;

            if (dist < minDist) {
              totalColl++;

              // Pantulan elastis sederhana
              const nx = dx / dist;
              const ny = dy / dist;
              const kx = p.vx - p2.vx;
              const ky = p.vy - p2.vy;
              const pVel = 2 * (nx * kx + ny * ky) / 2;

              p.vx -= pVel * nx;
              p.vy -= pVel * ny;
              p2.vx += pVel * nx;
              p2.vy += pVel * ny;

              // Cek apakah tumbukan efektif: Reaktan A bertumbukan dengan Reaktan B
              if (
                (p.jenis === 'A' && p2.jenis === 'B') ||
                (p.jenis === 'B' && p2.jenis === 'A')
              ) {
                // Energi kinetik relatif
                const eKinetik = Math.sqrt(kx * kx + ky * ky);

                if (eKinetik >= ambangEa && Math.random() < faktorLuas) {
                  effColl++;
                  // Buat efek produk berkilau sementara
                  p.jenis = 'PRODUK';
                  p.umurProduk = 45;
                }
              }
            }
          }

          // Kurangi umur produk dan ubah kembali menjadi reaktan baru
          if (p.jenis === 'PRODUK' && p.umurProduk) {
            p.umurProduk--;
            if (p.umurProduk <= 0) {
              p.jenis = i % 2 === 0 ? 'A' : 'B';
            }
          }
        }

        setTumbukanTotal(totalColl);
        setTumbukanEfektif(effColl);
      }

      // Gambar semua partikel
      for (let i = 0; i < partikel.length; i++) {
        const p = partikel[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        if (p.jenis === 'PRODUK') {
          // Efek produk berkilau (tumbukan efektif berhasil)
          ctx.fillStyle = '#10b981';
          ctx.shadowColor = '#10b981';
          ctx.shadowBlur = 14;
          ctx.fill();
          ctx.strokeStyle = '#a7f3d0';
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.shadowBlur = 0;
        } else if (p.jenis === 'A') {
          ctx.fillStyle = '#38bdf8';
          ctx.fill();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 1;
          ctx.stroke();
        } else {
          ctx.fillStyle = '#f43f5e';
          ctx.fill();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isBerjalan, katalisAktif, luasPermukaan]);

  // Perhitungan laju relatif tampilan (M/s)
  const lajuRelatif = (
    (konsentrasi / 30) *
    (suhu / 35) *
    (luasPermukaan === 'serbuk' ? 1.6 : luasPermukaan === 'kepingan' ? 1.0 : 0.5) *
    (katalisAktif ? 2.5 : 1.0) *
    0.05
  ).toFixed(3);

  return (
    <div className="simulasi-wrapper" id="simulasi-tumbukan-container">
      <div className="simulasi-header">
        <div className="simulasi-title-box">
          <Zap size={22} className="simulasi-icon" />
          <div>
            <h3 className="simulasi-title">Laboratorium Virtual: Simulasi Teori Tumbukan</h3>
            <p className="simulasi-subtitle">
              Amati langsung bagaimana konsentrasi, suhu, bidang sentuh, dan katalis memicu tumbukan efektif.
            </p>
          </div>
        </div>

        <div className="simulasi-actions">
          <button
            type="button"
            className="sim-btn"
            onClick={() => setIsBerjalan(!isBerjalan)}
            title={isBerjalan ? 'Jeda Simulasi' : 'Lanjutkan Simulasi'}
          >
            {isBerjalan ? <Pause size={16} /> : <Play size={16} />}
            <span>{isBerjalan ? 'Jeda' : 'Mulai'}</span>
          </button>
          <button
            type="button"
            className="sim-btn"
            onClick={initPartikel}
            title="Ulangi Posisi Partikel"
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div className="simulasi-body-grid">
        {/* Canvas Display */}
        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            width={580}
            height={340}
            className="simulasi-canvas"
          />

          <div className="canvas-legend">
            <div className="legend-item">
              <span className="dot dot-a"></span>
              <span>Reaktan A (Biru)</span>
            </div>
            <div className="legend-item">
              <span className="dot dot-b"></span>
              <span>Reaktan B (Merah)</span>
            </div>
            <div className="legend-item">
              <span className="dot dot-prod"></span>
              <span>Tumbukan Efektif / Produk (Hijau Berkilau)</span>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="simulasi-controls-panel">
          {/* 1. Konsentrasi */}
          <div className="control-group">
            <div className="control-label-row">
              <span className="control-label">Konsentrasi Larutan:</span>
              <span className="control-value">{konsentrasi === 15 ? 'Rendah (0,5 M)' : konsentrasi === 30 ? 'Sedang (1,0 M)' : 'Tinggi (2,0 M)'}</span>
            </div>
            <div className="control-button-group">
              <button
                type="button"
                className={`ctrl-opt-btn ${konsentrasi === 15 ? 'active' : ''}`}
                onClick={() => setKonsentrasi(15)}
              >
                0,5 M
              </button>
              <button
                type="button"
                className={`ctrl-opt-btn ${konsentrasi === 30 ? 'active' : ''}`}
                onClick={() => setKonsentrasi(30)}
              >
                1,0 M
              </button>
              <button
                type="button"
                className={`ctrl-opt-btn ${konsentrasi === 50 ? 'active' : ''}`}
                onClick={() => setKonsentrasi(50)}
              >
                2,0 M
              </button>
            </div>
          </div>

          {/* 2. Suhu */}
          <div className="control-group">
            <div className="control-label-row">
              <span className="control-label"><Flame size={14} className="ctrl-icon-inline" /> Suhu Reaksi:</span>
              <span className="control-value">{suhu} °C</span>
            </div>
            <input
              type="range"
              min="20"
              max="80"
              step="5"
              value={suhu}
              onChange={(e) => setSuhu(Number(e.target.value))}
              className="sim-slider"
            />
            <div className="slider-hints">
              <span>Dingin (20 °C)</span>
              <span>Panas (80 °C)</span>
            </div>
          </div>

          {/* 3. Luas Permukaan */}
          <div className="control-group">
            <div className="control-label-row">
              <span className="control-label"><Box size={14} className="ctrl-icon-inline" /> Bentuk Padatan:</span>
              <span className="control-value capitalize">{luasPermukaan}</span>
            </div>
            <div className="control-button-group">
              <button
                type="button"
                className={`ctrl-opt-btn ${luasPermukaan === 'bongkahan' ? 'active' : ''}`}
                onClick={() => setLuasPermukaan('bongkahan')}
              >
                Bongkahan
              </button>
              <button
                type="button"
                className={`ctrl-opt-btn ${luasPermukaan === 'kepingan' ? 'active' : ''}`}
                onClick={() => setLuasPermukaan('kepingan')}
              >
                Kepingan
              </button>
              <button
                type="button"
                className={`ctrl-opt-btn ${luasPermukaan === 'serbuk' ? 'active' : ''}`}
                onClick={() => setLuasPermukaan('serbuk')}
              >
                Serbuk Halus
              </button>
            </div>
          </div>

          {/* 4. Katalis Toggle */}
          <div className="control-group katalis-group">
            <div className="control-label-row">
              <span className="control-label">Penggunaan Katalis (Menurunkan Eₐ):</span>
            </div>
            <button
              type="button"
              className={`katalis-toggle-btn ${katalisAktif ? 'katalis-on' : ''}`}
              onClick={() => setKatalisAktif(!katalisAktif)}
            >
              <ShieldAlert size={16} />
              <span>{katalisAktif ? '✓ Katalis Aktif (Eₐ Turun 45%)' : '✕ Tanpa Katalis (Eₐ Tinggi)'}</span>
            </button>
          </div>

          {/* Real-time Rate Metric */}
          <div className="metric-box">
            <div className="metric-item">
              <span className="metric-title">Estimasi Laju Reaksi (v):</span>
              <span className="metric-number accent-glow">{lajuRelatif} M/s</span>
            </div>
            <div className="metric-sub">
              <span>Tumbukan Terjadi: <strong>{tumbukanTotal}</strong></span>
              <span>•</span>
              <span>Tumbukan Efektif: <strong className="text-emerald">{tumbukanEfektif}</strong></span>
            </div>
          </div>
        </div>
      </div>

      <div className="simulasi-footer-insight">
        <strong>💡 Insight Teori Tumbukan:</strong>
        {katalisAktif && ' Katalis membuka jalur rute baru dengan bukit Eₐ yang jauh lebih rendah, melipatgandakan tumbukan yang berhasil menjadi produk tanpa mengubah nilai ΔH.'}
        {!katalisAktif && suhu > 50 && ' Pada suhu tinggi, molekul bergerak sangat gesit dengan energi kinetik tinggi, sehingga lebih banyak partikel yang mampu menembus batas Energi Aktivasi (Eₐ).'}
        {!katalisAktif && suhu <= 50 && konsentrasi === 50 && ' Konsentrasi tinggi merapatkan partikel dalam larutan, memicu frekuensi tabrakan yang jauh lebih padat.'}
        {!katalisAktif && suhu <= 50 && konsentrasi < 50 && ' Coba naikkan suhu atau aktifkan katalis untuk melihat partikel hijau produk reaksi bermunculan lebih cepat!'}
      </div>
    </div>
  );
};
