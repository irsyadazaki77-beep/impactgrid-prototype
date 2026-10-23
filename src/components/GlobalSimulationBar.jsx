import React, { useState, useEffect } from 'react';
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
    name: 'Operasi Normal 24 Jam (Hari Kerja Standar)',
    shortName: '🟢 Normal 24 Jam',
    tempC: 28,
    trafficMultiplier: 1.0,
    carrierSleepActive: true,
    plnTariffIDR: 1500,
    emergencyActive: false,
    color: 'emerald',
    description: 'Skenario normal untuk antarmuka demo; tidak mengubah operasi jaringan.'
  },
  heatwave: {
    id: 'heatwave',
    name: 'Gelombang Panas Ekstrem (BMKG 36°C Heatwave)',
    shortName: '☀️ Heatwave 36°C',
    tempC: 36,
    trafficMultiplier: 1.15,
    carrierSleepActive: true,
    plnTariffIDR: 1500,
    emergencyActive: false,
    color: 'amber',
    description: 'Skenario cuaca ilustratif; suhu, beban, dan respons tidak berasal dari sensor atau model terkalibrasi.'
  },
  mudik: {
    id: 'mudik',
    name: 'Lonjakan Mudik Lebaran / Pantura (+250% Trafik)',
    shortName: '🚗 Mudik Pantura +250%',
    tempC: 30,
    trafficMultiplier: 2.5,
    carrierSleepActive: false,
    plnTariffIDR: 1500,
    emergencyActive: false,
    color: 'blue',
    description: 'Skenario kenaikan trafik lokal; tidak menguji tindakan fail-safe, latency, QoS, atau call drop.'
  },
  pln_peak: {
    id: 'pln_peak',
    name: 'PLN Waktu Beban Puncak (WBP Tarif Rp1.950/kWh)',
    shortName: '⚡ PLN Tarif WBP',
    tempC: 29,
    trafficMultiplier: 1.2,
    carrierSleepActive: true,
    plnTariffIDR: 1950,
    emergencyActive: false,
    color: 'purple',
    description: 'Skenario perubahan biaya energi; tarif, BESS, dan kebijakan operasi aktual belum dihubungkan.'
  },
  blackout_sumatera: {
    id: 'blackout_sumatera',
    name: 'Blackout Transmisi PLN Sumatera (Grid Collapse Islanding)',
    shortName: '⚠️ Blackout PLN Grid',
    tempC: 31,
    trafficMultiplier: 0.9,
    carrierSleepActive: true,
    plnTariffIDR: 0,
    emergencyActive: false,
    color: 'amber',
    description: 'Skenario gangguan listrik dalam demo; tidak memodelkan transisi islanding atau daya cadangan secara tervalidasi.'
  },
  emergency: {
    id: 'emergency',
    name: 'Skenario darurat (ilustrasi)',
    shortName: '🚨 Darurat 112 Drill',
    tempC: 27,
    trafficMultiplier: 3.0,
    carrierSleepActive: false,
    plnTariffIDR: 1500,
    emergencyActive: true,
    color: 'red',
    description: 'Skenario untuk membahas kebutuhan keselamatan; tidak memicu layanan 112 atau mengukur fast-wakeup.'
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
    setSimState(prev => ({
      ...prev,
      scenarioKey: key,
      tempC: sc.tempC,
      trafficMultiplier: sc.trafficMultiplier,
      carrierSleepActive: sc.carrierSleepActive,
      plnTariffIDR: sc.plnTariffIDR,
      emergencyActive: sc.emergencyActive
    }));

    if (onTriggerEmergency) {
      onTriggerEmergency(sc.emergencyActive);
    }
  };

  const handleResetToBaseline = () => {
    setSimState({
      seed: 2026,
      simHour: 14,
      simTimeString: '14:00 WIB',
      scenarioKey: 'normal',
      tempC: 28,
      trafficMultiplier: 1.0,
      carrierSleepActive: true,
      plnTariffIDR: 1500,
      emergencyActive: false
    });
    if (onTriggerEmergency) onTriggerEmergency(false);
  };

  const handleCopySnapshot = () => {
    const snapshotJson = JSON.stringify({
      timestamp: new Date().toISOString(),
      seed: simState.seed || 2026,
      simState
    }, null, 2);
    navigator.clipboard.writeText(snapshotJson);
    setSnapshotCopied(true);
    setTimeout(() => setSnapshotCopied(false), 2000);
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
                  Konsol Simulasi Eksekutif
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  DATA SIMULASI
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Uji respon dinamis platform terhadap waktu 24 jam, fluktuasi cuaca ekstrem BMKG, dan lonjakan beban darurat.
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
              <span>{isPlaying ? 'Pause' : 'Play 24 Jam'}</span>
            </button>

            <button
              onClick={handleResetToBaseline}
              title="Reset seluruh parameter simulasi ke baseline awal"
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

        {/* 5 Scenario Presets Buttons */}
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
                  <span className="text-[10px] font-black uppercase text-slate-400">
                    {sc.id === 'normal' ? 'Baseline' : sc.id === 'heatwave' ? 'Cuaca' : sc.id === 'mudik' ? 'Trafik' : sc.id === 'pln_peak' ? 'Tarif' : 'QoS SLA'}
                  </span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-red-400" />}
                </div>
                <span className="font-extrabold text-[11px] truncate block text-white">
                  {sc.shortName}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 font-mono">
                  {sc.tempC}°C • {sc.trafficMultiplier}x Load
                </span>
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
                <span>Geser Waktu Simulasi 24 Jam (00:00 - 23:00 WIB):</span>
              </span>
              <strong className="text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                {simState.simHour}:00 WIB {simState.simHour >= 1 && simState.simHour <= 5 ? '(Off-Peak Malam)' : simState.simHour >= 18 && simState.simHour <= 21 ? '(Prime-Time Peak)' : '(Normal)'}
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
              <span>00:00 (Malam)</span>
              <span>06:00 (Pagi)</span>
              <span>12:00 (Siang Terik)</span>
              <span>18:00 (Peak Malam)</span>
              <span>23:00 (Trough)</span>
            </div>
          </div>

          <div className="md:col-span-5 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[9px] text-slate-400 uppercase block">Suhu Lingkungan</span>
              <span className="text-xs font-black text-amber-400">{simState.tempC}°C BMKG</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[9px] text-slate-400 uppercase block">Beban Trafik</span>
              <span className="text-xs font-black text-cyan-400">
                {(simState.trafficMultiplier * (simState.simHour >= 1 && simState.simHour <= 5 ? 0.25 : simState.simHour >= 18 && simState.simHour <= 21 ? 1.0 : 0.65) * 100).toFixed(0)}% Kapasitas
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[9px] text-slate-400 uppercase block">Perlindungan layanan darurat</span>
              <span className="text-xs font-black text-amber-300">Belum diuji</span>
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
            Tarif PLN: Rp{simState.plnTariffIDR}/kWh
          </span>
        </div>
      </div>
    </div>
  );
}
