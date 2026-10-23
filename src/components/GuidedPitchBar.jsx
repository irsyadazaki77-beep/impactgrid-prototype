import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause,
  ChevronRight, 
  ChevronLeft, 
  X, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Volume2, 
  Maximize2,
  Minimize2,
  ShieldAlert,
  ArrowRight,
  Zap,
  Bot,
  RotateCcw,
  BookOpen
} from 'lucide-react';

/**
 * GuidedPitchBar (Guided Pitch Mode 2.0):
 * Sempurna untuk presentasi eksekutif 7 menit di hadapan Dewan Direksi:
 * - 8 Tahapan Terstruktur (0:00 s.d. 7:00 menit)
 * - Timer aktif mundur/maju 7:00 menit
 * - Fullscreen toggle
 * - Keyboard navigation (Space, Panah Kanan/Kiri, F untuk Fullscreen, Esc untuk keluar)
 * - Presenter Teleprompter Notes & Audience Cues
 * - Progress bar visual
 */
export default function GuidedPitchBar({ 
  isActive, 
  onClose, 
  activeTab, 
  setActiveTab,
  onNavigateTab,
  onOpenEmergencyModal,
  onOpenExecutiveMemo,
  onOpenBodDefense
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);

  const pitchSteps = [
    { step: 1, timing: '0:00 - 1:00', targetSeconds: 60, title: 'Konteks energi dan emisi perusahaan', tab: 'overview', targetAudience: 'Dewan juri', keyPill: 'Data korporat 2025', cue: 'Tunjukkan angka perusahaan dan jelaskan batas konteksnya.', script: 'Laporan 2025 mencatat konsumsi listrik Telkomsel sekitar 1,885 miliar kWh dan emisi Scope 2 sekitar 1,722 juta ton CO2e. Angka ini memberi konteks skala perusahaan, tetapi bukan baseline untuk setiap lokasi dan tidak membuktikan dampak ImpactGrid.', presenterTips: 'Sebutkan sumber dan tahun data; jangan menurunkan angka site dari data agregat.' },
    { step: 2, timing: '1:00 - 1:50', targetSeconds: 110, title: 'Masalah data dan keputusan investasi', tab: 'overview', targetAudience: 'Dewan juri', keyPill: 'Baseline site belum tersedia', cue: 'Jelaskan kesenjangan data dan mengapa audit didahulukan.', script: 'Model sebelumnya memakai dua satuan baseline yang belum terverifikasi. Karena satuan itu menghasilkan kesimpulan finansial berbeda, kami mengusulkan audit meter, tagihan, kontrak, dan biaya sebelum meminta keputusan investasi.', presenterTips: 'Tunjukkan ketidakpastian secara terbuka.' },
    { step: 3, timing: '1:50 - 2:40', targetSeconds: 160, title: 'Konsep ImpactGrid', tab: 'architecture', targetAudience: 'Dewan juri', keyPill: 'Sistem pendukung keputusan', cue: 'Tunjukkan alur dari data sampai keputusan manusia.', script: 'ImpactGrid dirancang untuk menggabungkan data energi, trafik, biaya, mutu layanan, dan metrik ESG yang disetujui. Sistem menghasilkan analisis dan rekomendasi untuk ditinjau tim jaringan, Finance, dan ESG; prototype ini tidak mengendalikan perangkat.', presenterTips: 'Jelaskan ini sebagai rancangan, bukan sistem produksi.' },
    { step: 4, timing: '2:40 - 3:30', targetSeconds: 210, title: 'Rancangan integrasi data', tab: 'telemetry', targetAudience: 'Dewan juri', keyPill: 'Perlu akses dan rekonsiliasi', cue: 'Jelaskan data yang dibutuhkan dan pemiliknya.', script: 'Integrasi vendor dan meter PLN masih perlu dibuktikan bersama pemilik sistem dan kontrak. Tabel pada website memakai data contoh, bukan telemetri aktual. Pilot hanya dimulai setelah akses, keamanan, dan rekonsiliasi datanya disetujui.', presenterTips: 'Hindari mengklaim koneksi atau kompatibilitas yang belum diuji.' },
    { step: 5, timing: '3:30 - 4:20', targetSeconds: 260, title: 'Keselamatan dan kendali operasi', tab: 'optimization', targetAudience: 'Dewan juri', keyPill: 'Guardrail harus diuji', cue: 'Tunjukkan simulasi sebagai konsep, lalu tekankan persetujuan operator.', script: 'Penghematan tidak boleh menurunkan mutu layanan. Ambang QoS, mekanisme rollback, dan interaksi dengan layanan darurat harus ditetapkan dan diuji di lingkungan yang disetujui. Simulasi pada website tidak menguji latency atau jaringan nyata.', presenterTips: 'Jangan menjanjikan 120 milidetik atau zero outage.' },
    { step: 6, timing: '4:20 - 5:20', targetSeconds: 320, title: 'Sensitivitas finansial dan audit', tab: 'financial', targetAudience: 'Dewan juri', keyPill: 'NPV berubah mengikuti baseline', cue: 'Buka model sensitivitas dan jelaskan asumsi.', script: 'Pada asumsi hemat 8 persen, Rp1.500 per kWh, CapEx Rp450 juta, OpEx Rp60 juta per tahun, dan diskonto 10 persen, NPV indikatif berkisar minus Rp391,5 juta hingga plus Rp82,3 juta tergantung baseline yang dipakai. Hasil ini bukan forecast; audit awal maksimal Rp95 juta menjadi langkah berikutnya.', presenterTips: 'Jelaskan komponen arus kas dan ketidakpastian.' },
    { step: 7, timing: '5:20 - 6:15', targetSeconds: 375, title: 'Pengukuran ESG yang dapat dipertanggungjawabkan', tab: 'esg', targetAudience: 'Dewan juri', keyPill: 'Belum ada klaim reduksi emisi', cue: 'Tunjukkan checklist validasi dan sumber resmi.', script: 'Pengurangan energi perlu diukur terhadap baseline dan pembanding yang sesuai. Klaim emisi menunggu faktor emisi resmi per lokasi dan periode serta persetujuan fungsi ESG. SHA-256 hanya mendeteksi perubahan pada berkas; hash tidak membuktikan data sumber benar.', presenterTips: 'Pisahkan standar metodologis dari hasil assurance.' },
    { step: 8, timing: '6:15 - 7:00', targetSeconds: 420, title: 'Permintaan keputusan bertahap', tab: 'overview', targetAudience: 'Dewan juri', keyPill: 'Audit dahulu; pilot bersyarat', cue: 'Tutup dengan tahapan dan gerbang keputusan.', script: 'Kami mengusulkan audit dua bulan dengan plafon Rp95 juta, lalu keputusan terpisah untuk pilot setelah baseline, kelayakan finansial, izin aset, dan guardrail QoS disepakati. Ekspansi regional atau nasional baru dinilai setelah bukti pilot tersedia. Terima kasih.', presenterTips: 'Tutup dengan kebutuhan validasi dan keputusan yang diminta.' }
  ];

  // Live Timer Effect
  useEffect(() => {
    let timer;
    if (isActive && isTimerRunning) {
      timer = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, isTimerRunning]);

  const current = pitchSteps[currentStep];

  // Sync tab on step change
  const goToStep = (idx) => {
    if (idx >= 0 && idx < pitchSteps.length) {
      setCurrentStep(idx);
      const target = pitchSteps[idx].tab;
      if (onNavigateTab) {
        onNavigateTab(target);
      } else if (setActiveTab && target !== activeTab) {
        setActiveTab(target);
      }
    }
  };

  // Keyboard navigation for presentation mode
  useEffect(() => {
    if (!isActive) return;

    const handleKey = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goToStep(Math.min(pitchSteps.length - 1, currentStep + 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToStep(Math.max(0, currentStep - 1));
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isActive, currentStep]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  if (!isActive) return null;

  const minutes = Math.floor(secondsElapsed / 60);
  const seconds = secondsElapsed % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds} / 7:00`;
  const isOvertime = secondsElapsed > 420;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/98 text-white border-t-2 border-[#ED0226] shadow-2xl backdrop-blur-md px-4 py-3 transition-all animate-fade-in font-sans">
      <div className="max-w-6xl mx-auto space-y-2.5">
        {/* Main Pitch Bar Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Step Info & Timing Badge */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#ED0226] text-white font-black text-sm shrink-0 shadow-xs">
              {current.step}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-white">{current.title}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-red-300 border border-slate-700">
                  {current.keyPill}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-normal truncate max-w-md">
                🎯 Sasaran: <strong className="text-slate-200">{current.targetAudience}</strong> • Cue: {current.cue}
              </p>
            </div>
          </div>

          {/* Controls: Timer, Step Switcher, Fullscreen */}
          <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
            {/* Live 7-Minute Timer */}
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold border ${
              isOvertime 
                ? 'bg-red-950 text-red-400 border-red-700 animate-pulse' 
                : 'bg-slate-900 text-slate-200 border-slate-800'
            }`}>
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{timeFormatted}</span>
              <button 
                onClick={() => setIsTimerRunning(prev => !prev)}
                className="hover:text-white ml-1 cursor-pointer"
                title={isTimerRunning ? "Pause" : "Play"}
              >
                {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>
              <button 
                onClick={() => setSecondsElapsed(0)}
                className="hover:text-white ml-0.5 cursor-pointer"
                title="Reset Timer"
              >
                <RotateCcw className="w-3 h-3 text-slate-400" />
              </button>
            </div>

            {/* Teleprompter Notes Toggle */}
            <button
              onClick={() => setIsNotesExpanded(prev => !prev)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                isNotesExpanded 
                  ? 'bg-amber-400 text-slate-950 border-amber-300' 
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Presenter Notes</span>
            </button>

            {/* Navigation buttons */}
            <div className="flex items-center bg-slate-900 rounded-xl p-1 border border-slate-800">
              <button
                onClick={() => goToStep(currentStep - 1)}
                disabled={currentStep === 0}
                className="p-1 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                title="Sebelumnya (ArrowLeft)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 text-xs font-bold text-slate-300 font-mono">
                {currentStep + 1}/{pitchSteps.length}
              </span>
              <button
                onClick={() => goToStep(currentStep + 1)}
                disabled={currentStep === pitchSteps.length - 1}
                className="p-1 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                title="Berikutnya (Space / ArrowRight)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition cursor-pointer"
              title="Toggle Fullscreen (F)"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition cursor-pointer"
              title="Keluar Mode Pitch (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden flex">
          {pitchSteps.map((s, idx) => (
            <div
              key={idx}
              onClick={() => goToStep(idx)}
              className={`h-full flex-1 border-r border-slate-950 transition-all cursor-pointer ${
                idx < currentStep 
                  ? 'bg-emerald-500' 
                  : idx === currentStep 
                    ? 'bg-[#ED0226]' 
                    : 'bg-slate-700/60 hover:bg-slate-600'
              }`}
              title={`Step ${idx + 1}: ${s.title}`}
            />
          ))}
        </div>

        {/* Expanded Presenter Teleprompter Notes */}
        {isNotesExpanded && (
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 space-y-2 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-amber-400 text-xs flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5" />
                Teleprompter Skrip Presenter ({current.timing})
              </span>
              <span className="text-[10px] text-slate-400">Tekan Spasi untuk lanjut</span>
            </div>
            <p className="text-white text-xs leading-relaxed font-medium bg-slate-950 p-3 rounded-lg border border-slate-800">
              "{current.script}"
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span><strong>Tips Penyampaian:</strong> {current.presenterTips}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
