import React, { useState, useEffect } from 'react';
import { createInitialSimulationState } from '../utils/demoState';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Thermometer, 
  Activity, 
  Zap, 
  Sun, 
  CloudRain, 
  Flame, 
  Car, 
  ShieldAlert, 
  CheckCircle2, 
  Radio, 
  Sliders, 
  ChevronDown, 
  ChevronUp,
  X,
  Sparkles
} from 'lucide-react';

export const SIMULATION_SCENARIOS = {
  normal: {
    id: 'normal',
    category: 'Tampilan demo',
    name: 'Tampilan awal',
    shortName: 'Tampilan awal',
    emergencyActive: false,
    color: 'emerald',
    description: 'Status visual lokal; tidak menggambarkan kondisi operasi atau baseline jaringan.'
  },
  heatwave: {
    id: 'heatwave',
    category: 'Sensitivitas',
    name: 'Perubahan kondisi cuaca',
    shortName: 'Cuaca',
    emergencyActive: false,
    color: 'amber',
    description: 'Skenario konseptual; tidak memakai observasi BMKG, sensor lokasi, atau model cuaca terkalibrasi.'
  },
  mudik: {
    id: 'mudik',
    category: 'Sensitivitas',
    name: 'Perubahan pola trafik',
    shortName: 'Trafik',
    emergencyActive: false,
    color: 'blue',
    description: 'Skenario konseptual; tidak memakai profil trafik, lokasi, atau kapasitas jaringan aktual.'
  },
  pln_peak: {
    id: 'pln_peak',
    category: 'Sensitivitas',
    name: 'Perubahan biaya energi',
    shortName: 'Biaya energi',
    emergencyActive: false,
    color: 'purple',
    description: 'Skenario konseptual; tarif efektif dan struktur kontrak perlu diperiksa, tidak ada data PLN yang terhubung.'
  },
  blackout_sumatera: {
    id: 'blackout_sumatera',
    category: 'Skenario konseptual',
    name: 'Gangguan pasokan listrik',
    shortName: 'Gangguan listrik',
    emergencyActive: false,
    color: 'amber',
    description: 'Tidak memodelkan keandalan grid, islanding, UPS, baterai, atau genset; perlu analisis teknis terpisah.'
  },
  emergency: {
    id: 'emergency',
    category: 'Skenario konseptual',
    name: 'Keselamatan dan layanan darurat',
    shortName: 'Keselamatan',
    emergencyActive: true,
    color: 'red',
    description: 'Hanya pengingat kebutuhan kajian operator; tidak memicu layanan 112, mengukur QoS, atau menguji respons.'
  }
};

export default function GlobalSimulationBar({ 
  simState, 
  setSimState, 
  isOpen, 
  onClose,
  onTriggerEmergency 
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [snapshotCopied, setSnapshotCopied] = useState(false);

  // Play timeline simulation
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setSimState(prev => {
          const nextHour = (prev.simHour + 1) % 24;
          return {
            ...prev,
            simHour: nextHour,
            simTimeString: `${String(nextHour).padStart(2, '0')}:00 WIB`
          };
        });
      }, 1400);
    }
    return () => clearInterval(interval);
  }, [isPlaying, setSimState]);

  if (!isOpen) return null;

  const currentScenario = SIMULATION_SCENARIOS[simState.scenarioKey] || SIMULATION_SCENARIOS.normal;

  const handleSelectScenario = (key) => {
    const sc = SIMULATION_SCENARIOS[key];
    if (!sc) return;
    setSimState(prev => ({
      ...prev,
      scenarioKey: key,
      tempC: null,
      trafficMultiplier: null,
      carrierSleepActive: null,
      plnTariffIDR: null,
      emergencyActive: sc.emergencyActive
    }));

    if (onTriggerEmergency) {
      onTriggerEmergency(sc.emergencyActive);
    }
  };

  const handleResetToBaseline = () => {
    setSimState(createInitialSimulationState());
    setIsPlaying(false);
    setSnapshotCopied(false);
    if (onTriggerEmergency) onTriggerEmergency(false);
  };

  const handleCopySnapshot = () => {
    const snapshotJson = JSON.stringify({
      timestamp: new Date().toISOString(),
      simState
    }, null, 2);
    navigator.clipboard?.writeText(snapshotJson).then(() => {
      setSnapshotCopied(true);
      setTimeout(() => setSnapshotCopied(false), 2000);
    }).catch(() => setSnapshotCopied(false));
  };

  const handleTimeChange = (hour) => {
    setSimState(prev => ({
      ...prev,
      simHour: parseInt(hour, 10),
      simTimeString: `${String(hour).padStart(2, '0')}:00 WIB`
    }));
  };

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-white shadow-xl animate-in slide-in-from-top-3 duration-200 sticky top-[57px] z-30 px-3 sm:px-6 py-3">
      <div className="max-w-6xl mx-auto space-y-3">
        {/* Top Control Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <Sliders className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs text-white uppercase tracking-wider">
                  Konsol Skenario Demo
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  DATA SIMULASI
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Kontrol di bawah hanya mengubah tampilan lokal. Tidak ada telemetri, data BMKG/PLN, model operasi, atau perintah jaringan yang terhubung.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800 text-xs font-mono text-cyan-400">
              <Clock className="w-3.5 h-3.5 mr-1.5 text-cyan-500" />
              <span>{simState.simTimeString}</span>
            </div>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                isPlaying 
                  ? 'bg-amber-500 text-slate-950 font-black' 
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause' : 'Putar jam demo'}</span>
            </button>

            <button
              onClick={handleResetToBaseline}
              title="Kembalikan tampilan ke skenario demo awal"
              className="px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1 cursor-pointer transition"
            >
              <RotateCcw className="w-3 h-3 text-slate-400" />
              <span>Reset</span>
            </button>

            <button
              onClick={handleCopySnapshot}
              title="Salin snapshot state simulasi saat ini ke clipboard"
              className="px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1 cursor-pointer transition"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{snapshotCopied ? 'Tersalin!' : 'Snapshot'}</span>
            </button>

            <button
              onClick={onClose}
              aria-label="Tutup konsol simulasi"
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scenario Presets */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
          {Object.values(SIMULATION_SCENARIOS).map((sc) => {
            const isSelected = simState.scenarioKey === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => handleSelectScenario(sc.id)}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-800 border-red-500 ring-1 ring-red-400 text-white shadow-xs'
                    : 'bg-slate-950/70 border-slate-800 hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-[10px] font-black uppercase text-slate-400">{sc.category}</span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-red-400" />}
                </div>
                <span className="font-extrabold text-[11px] truncate block text-white">
                  {sc.shortName}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 font-mono">Data tidak terhubung</span>
              </button>
            );
          })}
        </div>

        {/* Timeline Scrubbing Slider & Status Monitor */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center pt-1 text-xs">
          <div className="md:col-span-7 space-y-1">
            <div className="flex justify-between text-[11px] text-slate-300 font-mono">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-cyan-400" />
                <span>Geser jam demo (kontrol visual saja):</span>
              </span>
              <strong className="text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                {simState.simHour}:00 WIB (ilustrasi)
              </strong>
            </div>

            <input
              type="range"
              min="0"
              max="23"
              step="1"
              value={simState.simHour}
              onChange={(e) => handleTimeChange(e.target.value)}
              className="w-full accent-[#ED0226] bg-slate-950 h-2 rounded-lg cursor-pointer"
            />

            <div className="flex justify-between text-[9px] text-slate-500 font-mono">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>23:00</span>
            </div>
          </div>

          <div className="md:col-span-5 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[9px] text-slate-400 uppercase block">Data cuaca</span>
              <span className="text-xs font-black text-amber-400">Tidak terhubung</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[9px] text-slate-400 uppercase block">Data trafik</span>
              <span className="text-xs font-black text-cyan-400">Tidak terhubung</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[9px] text-slate-400 uppercase block">Uji keselamatan / 112</span>
              <span className="text-xs font-black text-amber-300">Belum dilakukan</span>
            </div>
          </div>
        </div>

        {/* Narrative Description Banner */}
        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              <strong>Dinamika Sistem:</strong> {currentScenario.description}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono shrink-0 hidden sm:inline">
            Mode demonstrasi lokal
          </span>
        </div>
      </div>
    </div>
  );
}
