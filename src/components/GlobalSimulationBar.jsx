import React, { useState, useEffect, useMemo } from 'react';
import { createInitialSimulationState } from '../utils/demoState';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Sliders, 
  X,
  Sparkles,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  BatteryCharging,
  FastForward
} from 'lucide-react';

export const SIMULATION_SCENARIOS = {
  normal: {
    id: 'normal',
    category: 'Baseline 24 Jam',
    name: 'Operasional Normal (24-Hour Diurnal)',
    shortName: 'Tampilan awal',
    emergencyActive: false,
    color: 'emerald',
    description: 'Profil lalu lintas harian standar Telkomsel: sinkronisasi otomatis Carrier Sleep saat off-peak dan respons tarif puncak PLN WBP (17:00-22:00).'
  },
  heatwave: {
    id: 'heatwave',
    category: 'Tekanan Termal',
    name: 'Kondisi Cuaca Ekstrem (Heatwave +4.5°C)',
    shortName: 'Cuaca',
    emergencyActive: false,
    color: 'amber',
    description: 'Suhu selubung shelter mencapai 36.5°C: algoritma pendinginan dinamis 26°C dan kontrol disipasi termal radio aktif mencegah overheat.'
  },
  mudik: {
    id: 'mudik',
    category: 'Lonjakan Trafik',
    name: 'Lonjakan Trafik Musim Mudik (+45%)',
    shortName: 'Trafik',
    emergencyActive: false,
    color: 'blue',
    description: 'Trafik data melonjak drastis di koridor transit Jamali: kapasitas radio dialokasikan penuh dengan micro-sleep selektif pada frekuensi tinggi.'
  },
  pln_peak: {
    id: 'pln_peak',
    category: 'Struktur Biaya',
    name: 'Optimalisasi Beban Puncak WBP PLN (17:00-22:00)',
    shortName: 'Biaya energi',
    emergencyActive: false,
    color: 'purple',
    description: 'Tarif listrik PLN melonjak ke tarif WBP (Rp 2.250/kWh): aktivasi pemotongan beban puncak via BESS baterai LiFePO4 untuk memaksimalkan penghematan kas.'
  },
  blackout_sumatera: {
    id: 'blackout_sumatera',
    category: 'Ketahanan Daya',
    name: 'Transisi Darurat Pemadaman Grid PLN',
    shortName: 'Gangguan listrik',
    emergencyActive: false,
    color: 'amber',
    description: 'Simulasi transisi DC Rectifier beralih ke baterai cadangan tanpa memicu starter genset diesel secara dini.'
  },
  emergency: {
    id: 'emergency',
    category: 'Protokol Keselamatan',
    name: 'Protokol Keselamatan & Layanan Darurat 112',
    shortName: 'Keselamatan',
    emergencyActive: true,
    color: 'red',
    description: 'Fail-safe zero-wait rollback 28ms: pembatalan seketika seluruh sleep-mode radio demi menjamin 100% ketersediaan panggilan darurat publik.'
  }
};

// Computes realistic hour-by-hour operational metrics based on Telkomsel network profiles
export function calculateHourTelemetry(hour, scenarioKey = 'normal') {
  // Telkomsel nationwide diurnal traffic profile (normalized index)
  const trafficProfiles = [
    0.22, 0.18, 0.16, 0.15, 0.18, 0.28, // 00:00 - 05:00 (Deep Sleep zone)
    0.45, 0.72, 0.95, 1.08, 1.12, 1.15, // 06:00 - 11:00 (Morning Ramp & Peak)
    1.10, 1.08, 1.12, 1.18, 1.30, 1.48, // 12:00 - 17:00 (Afternoon to Evening Peak)
    1.56, 1.52, 1.40, 1.15, 0.78, 0.45  // 18:00 - 23:00 (WBP Peak & Late Night Ramp-down)
  ];

  // Base ambient temperature profile (°C)
  const tempProfiles = [
    25.2, 24.8, 24.5, 24.2, 24.6, 25.4, // 00:00 - 05:00
    26.8, 28.5, 30.2, 31.8, 32.6, 33.2, // 06:00 - 11:00
    33.8, 34.0, 33.5, 32.4, 31.0, 29.8, // 12:00 - 17:00
    28.6, 27.8, 27.2, 26.5, 26.0, 25.6  // 18:00 - 23:00
  ];

  const rawTraffic = trafficProfiles[hour] ?? 1.0;
  const rawTemp = tempProfiles[hour] ?? 28.0;

  // Scenario adjustments
  let trafficMult = rawTraffic;
  let tempC = rawTemp;
  const isWbp = (hour >= 17 && hour < 22); // PLN Waktu Beban Puncak (17:00 - 22:00)
  let tariffPerKwh = isWbp ? 2250 : 1500; // Tarif B-2 / B-3 PLN
  let emergencyActive = false;

  if (scenarioKey === 'heatwave') {
    tempC += 4.5;
  } else if (scenarioKey === 'mudik') {
    trafficMult *= 1.45;
  } else if (scenarioKey === 'pln_peak') {
    tariffPerKwh = isWbp ? 2650 : 1750;
  } else if (scenarioKey === 'emergency') {
    emergencyActive = true;
  }

  // Baseline load for 40 sites (~5.4 kW per site = 216 kW)
  const baselineKw = 216.0;

  let savingPct = 0;
  let carrierAction = '';

  if (emergencyActive) {
    savingPct = 0;
    carrierAction = 'FAIL-SAFE 112: Seluruh Carrier Aktif Penuh (0% Sleep)';
  } else if (hour >= 1 && hour <= 5) {
    // Deep sleep zone
    savingPct = 24.8;
    carrierAction = 'Deep Carrier Sleep (B3/B8 Non-Aktif, Sub-Carrier Standby 28ms)';
  } else if (hour >= 6 && hour <= 10) {
    savingPct = 12.5;
    carrierAction = 'Adaptive Symbol Sleep + Dynamic Carrier Scaling';
  } else if (isWbp) {
    // PLN WBP Peak zone: Smart Battery Peak-Shaving + Targeted Micro-sleep
    savingPct = 14.8;
    carrierAction = 'WBP Peak-Shaving (BESS Discharge + Eco-Carrier Sleep)';
  } else {
    // Daytime
    savingPct = 10.2;
    carrierAction = 'Carrier Sleep Terjadwal + HVAC Dynamic Setpoint 26°C';
  }

  const activeKw = +(baselineKw * (1 - savingPct / 100)).toFixed(1);
  const savedKw = +(baselineKw - activeKw).toFixed(1);
  const hourlyAvoidedCost = Math.round(savedKw * tariffPerKwh);
  const hourlyAvoidedCo2Kg = +(savedKw * 0.78).toFixed(1);
  const bessActive = isWbp && !emergencyActive;
  const bessDischargeKw = bessActive ? 18.5 : 0;
  const bessTotalKw = +(bessDischargeKw * 40).toFixed(1);

  const carrierSleepActive = !emergencyActive && savingPct >= 10;
  const cdrPct = emergencyActive ? '0.01' : isWbp ? '0.07' : '0.05';

  return {
    hour,
    timeString: `${String(hour).padStart(2, '0')}:00 WIB`,
    isWbp,
    tariffPerKwh,
    trafficMultiplier: +trafficMult.toFixed(2),
    prbUtilizationPct: Math.min(98, Math.round(trafficMult * 45)),
    tempC: +tempC.toFixed(1),
    baselineKw,
    activeKw,
    powerKw: activeKw,
    savedKw,
    savingPct,
    carrierAction,
    carrierSleepActive,
    cdrPct,
    hourlyAvoidedCost,
    hourlyAvoidedCo2Kg,
    bessActive,
    bessDischargeKw,
    bessTotalKw,
    emergencyActive
  };
}

export default function GlobalSimulationBar({ 
  simState, 
  setSimState, 
  isOpen, 
  onClose,
  onTriggerEmergency,
  isPlaying: externalIsPlaying,
  onTogglePlay: externalOnTogglePlay,
  onReset: externalOnReset,
  simulationMode = 'STRICT_AUDIT',
  onToggleSimulationMode,
}) {
  const [internalIsPlaying, setInternalIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1); // 1x, 2x, 5x
  const [snapshotCopied, setSnapshotCopied] = useState(false);

  const isControlled = typeof externalIsPlaying === 'boolean';
  const isPlaying = isControlled ? externalIsPlaying : internalIsPlaying;
  const togglePlay = externalOnTogglePlay || (() => setInternalIsPlaying(prev => !prev));

  // Compute live hour telemetry
  const hourTelemetry = useMemo(() => {
    return calculateHourTelemetry(simState.simHour, simState.scenarioKey);
  }, [simState.simHour, simState.scenarioKey]);

  // Interval-driven 24-hour time playback
  useEffect(() => {
    let interval = null;
    if (!isControlled && isPlaying) {
      const stepInterval = Math.max(250, Math.round(1400 / playSpeed));
      interval = setInterval(() => {
        setSimState(prev => {
          const nextHour = (prev.simHour + 1) % 24;
          return {
            ...prev,
            simHour: nextHour,
            simTimeString: `${String(nextHour).padStart(2, '0')}:00 WIB`
          };
        });
      }, stepInterval);
    }
    return () => clearInterval(interval);
  }, [isControlled, isPlaying, playSpeed, setSimState]);

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
    if (externalOnReset) {
      externalOnReset();
    } else {
      setSimState(createInitialSimulationState());
      setInternalIsPlaying(false);
    }
    setSnapshotCopied(false);
    if (onTriggerEmergency) onTriggerEmergency(false);
  };

  const handleCopySnapshot = () => {
    const snapshotJson = JSON.stringify({
      timestamp: new Date().toISOString(),
      simState,
      hourTelemetry
    }, null, 2);
    navigator.clipboard?.writeText(snapshotJson).then(() => {
      setSnapshotCopied(true);
      setTimeout(() => setSnapshotCopied(false), 2000);
    }).catch(() => setSnapshotCopied(false));
  };

  const handleTimeChange = (hour) => {
    const num = parseInt(hour, 10);
    setSimState(prev => ({
      ...prev,
      simHour: num,
      simTimeString: `${String(num).padStart(2, '0')}:00 WIB`
    }));
  };

  const handleQuickJump = (hour) => {
    handleTimeChange(hour);
  };

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-white shadow-2xl animate-in slide-in-from-top-3 duration-200 sticky top-[57px] z-30 px-3 sm:px-6 py-3.5">
      <div className="max-w-6xl mx-auto space-y-3.5">
        
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-2.5">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <Sliders className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs text-white uppercase tracking-wider">
                  Konsol Simulasi 24-Jam Operasional Jaringan Telkomsel
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  LIVE SIMULATION ENGINE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Eksplorasi perubahan beban lalu lintas seluler, fluktuasi tarif PLN WBP, dan respons algoritma Carrier Sleep sepanjang 24 jam.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onToggleSimulationMode && (
              <button
                type="button"
                onClick={onToggleSimulationMode}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                  simulationMode === 'PARAMETRIC_SANDBOX'
                    ? 'bg-[#ED0226] hover:bg-red-700 text-white border-red-500 shadow-xs'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
                title="Alihkan mode antara Audit Ketat dan Sandbox Parametrik (What-If)"
              >
                {simulationMode === 'PARAMETRIC_SANDBOX' ? (
                  <>
                    <Calculator className="w-3.5 h-3.5 text-cyan-300" />
                    <span>Mode What-If Sandbox</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Mode Audit Ketat</span>
                  </>
                )}
              </button>
            )}

            {/* Time Indicator with WBP Tag */}
            <div className="flex items-center bg-slate-950 px-3 py-1 rounded-xl border border-slate-800 text-xs font-mono">
              <Clock className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
              <span className="text-white font-bold">{simState.simTimeString}</span>
              {hourTelemetry.isWbp ? (
                <span className="ml-2 px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold border border-amber-500/40">
                  WBP (Rp 2.250)
                </span>
              ) : (
                <span className="ml-2 px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 text-[10px]">
                  LWBP
                </span>
              )}
            </div>

            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
                isPlaying 
                  ? 'bg-amber-500 text-slate-950 font-black' 
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Jeda Siklus' : 'Putar Siklus 24J'}</span>
            </button>

            {/* Speed Toggle */}
            <button
              onClick={() => setPlaySpeed(s => s === 1 ? 2 : s === 2 ? 5 : 1)}
              className="px-2 py-1 rounded-xl text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 flex items-center gap-1 cursor-pointer"
              title="Kecepatan putar jam simulasi"
            >
              <FastForward className="w-3 h-3" />
              <span>{playSpeed}x</span>
            </button>

            {/* Reset Button */}
            <button
              onClick={handleResetToBaseline}
              title="Kembalikan tampilan ke skenario operasional awal"
              className="px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1 cursor-pointer transition"
            >
              <RotateCcw className="w-3 h-3 text-slate-400" />
              <span>Reset</span>
            </button>

            {/* Snapshot Button */}
            <button
              onClick={handleCopySnapshot}
              title="Salin snapshot telemetri jam ini ke clipboard"
              className="px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1 cursor-pointer transition"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{snapshotCopied ? 'Tersalin!' : 'Snapshot'}</span>
            </button>

            {/* Close Button strictly preserving accessible name "Tutup konsol simulasi" */}
            <button
              onClick={onClose}
              aria-label="Tutup konsol simulasi"
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Interactive 24-Hour Slider & Quick Jumps */}
        <div className="space-y-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-300 font-bold flex items-center gap-1 font-mono text-[11px]">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Navigasi Waktu 24-Jam:</span>
              </span>
              <strong className="text-white font-mono bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-[11px]">
                {simState.simHour}:00 WIB
              </strong>
            </div>

            {/* Quick Jumps */}
            <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
              <span className="text-slate-400">Lompat Cepat:</span>
              <button
                onClick={() => handleQuickJump(3)}
                className={`px-2 py-0.5 rounded font-mono font-bold transition cursor-pointer ${
                  simState.simHour === 3 ? 'bg-cyan-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                03:00 (Deep Sleep)
              </button>
              <button
                onClick={() => handleQuickJump(9)}
                className={`px-2 py-0.5 rounded font-mono font-bold transition cursor-pointer ${
                  simState.simHour === 9 ? 'bg-cyan-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                09:00 (Pagi Kerja)
              </button>
              <button
                onClick={() => handleQuickJump(14)}
                className={`px-2 py-0.5 rounded font-mono font-bold transition cursor-pointer ${
                  simState.simHour === 14 ? 'bg-cyan-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                14:00 (Siang Normal)
              </button>
              <button
                onClick={() => handleQuickJump(19)}
                className={`px-2 py-0.5 rounded font-mono font-bold transition cursor-pointer ${
                  simState.simHour === 19 ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 hover:bg-slate-700 text-amber-300'
                }`}
              >
                19:00 (WBP Puncak PLN)
              </button>
              <button
                onClick={() => handleQuickJump(23)}
                className={`px-2 py-0.5 rounded font-mono font-bold transition cursor-pointer ${
                  simState.simHour === 23 ? 'bg-cyan-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                23:00 (Malam Relaksasi)
              </button>
            </div>
          </div>

          {/* Time Scrubber */}
          <input
            type="range"
            min="0"
            max="23"
            step="1"
            value={simState.simHour}
            onChange={(e) => handleTimeChange(e.target.value)}
            className="w-full accent-[#ED0226] bg-slate-950 h-2.5 rounded-lg cursor-pointer"
          />

          {/* Scrubber labels */}
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span className="text-cyan-400">00:00 (Off-Peak)</span>
            <span>06:00 (Ramp Pagi)</span>
            <span>12:00 (Siang)</span>
            <span className="text-amber-400 font-bold">17:00 - 22:00 (WBP Puncak PLN)</span>
            <span>23:00</span>
          </div>
        </div>

        {/* 3. Real-Time Dynamic Telemetry Indicators for the Selected Hour */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 text-xs">
          {/* Card 1 */}
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Beban Aktif RAN</span>
            <div className="text-base font-black text-slate-100 font-mono">{hourTelemetry.activeKw} kW</div>
            <span className="text-[10px] text-emerald-400 font-bold">
              −{hourTelemetry.savingPct}% ({hourTelemetry.savedKw} kW hemat)
            </span>
          </div>

          {/* Card 2 */}
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Trafik Seluler PRB</span>
            <div className="text-base font-black text-cyan-300 font-mono">{hourTelemetry.prbUtilizationPct}% PRB</div>
            <span className="text-[10px] text-slate-400 font-mono">Indeks: {hourTelemetry.trafficMultiplier}x</span>
          </div>

          {/* Card 3 */}
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Suhu Shelter</span>
            <div className="text-base font-black text-amber-300 font-mono">{hourTelemetry.tempC}°C</div>
            <span className="text-[10px] text-slate-400">Target Setpoint: 26°C</span>
          </div>

          {/* Card 4 */}
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Tarif Listrik PLN</span>
            <div className="text-base font-black text-purple-300 font-mono">Rp {hourTelemetry.tariffPerKwh}/kWh</div>
            <span className={`text-[10px] font-bold ${hourTelemetry.isWbp ? 'text-amber-400' : 'text-slate-400'}`}>
              {hourTelemetry.isWbp ? 'Zona WBP (Beban Puncak)' : 'Zona Reguler (LWBP)'}
            </span>
          </div>

          {/* Card 5 */}
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Hemat Kas Riil</span>
            <div className="text-base font-black text-emerald-400 font-mono">
              Rp {hourTelemetry.hourlyAvoidedCost.toLocaleString('id-ID')}
            </div>
            <span className="text-[10px] text-slate-400">per jam (40 site)</span>
          </div>

          {/* Card 6 */}
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Reduksi Emisi</span>
            <div className="text-base font-black text-cyan-400 font-mono">{hourTelemetry.hourlyAvoidedCo2Kg} kg</div>
            <span className="text-[10px] text-cyan-400">CO₂e per jam</span>
          </div>
        </div>

        {/* 3B. Dynamic BESS Peak-Shaving Alert during PLN WBP (18:00 - 22:00 WIB) */}
        {hourTelemetry.isWbp && !hourTelemetry.emergencyActive && (
          <div className="p-3 rounded-xl border border-amber-500/50 bg-gradient-to-r from-amber-950/50 via-slate-950 to-purple-950/40 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shrink-0">
                <BatteryCharging className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <strong className="text-amber-300 font-bold uppercase tracking-wider text-[11px]">
                    ⚡ BESS Peak-Shaving Aktif (PLN WBP 17:00–22:00 WIB • Tarif Rp {hourTelemetry.tariffPerKwh}/kWh)
                  </strong>
                  <span className="px-2 py-0.2 rounded-full text-[9px] font-black bg-amber-500/30 text-amber-200 border border-amber-500/40">
                    ARBITRASE BIAYA LISTRIK
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Baterai LiFePO4 melepaskan daya <strong>{hourTelemetry.bessDischargeKw} kW/site (Total {hourTelemetry.bessTotalKw} kW)</strong> memotong tagihan PLN beban puncak termahal tanpa menurunkan atau mematikan kapasitas radio 1 Mbps pun.
                </p>
              </div>
            </div>
            <div className="flex sm:flex-col items-end justify-between sm:justify-center shrink-0 border-t sm:border-t-0 border-slate-800 pt-1 sm:pt-0">
              <span className="text-[10px] text-slate-400 font-mono">Beban Throughput Radio:</span>
              <span className="text-emerald-400 font-bold text-xs">Zero Radio Degradation ✓</span>
            </div>
          </div>
        )}

        {/* 4. Active Scenario Presets */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
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
                  <span className="text-[9px] font-black uppercase text-slate-400 truncate">{sc.category}</span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-red-400 shrink-0" />}
                </div>
                <span className="font-extrabold text-[11px] truncate block text-white">
                  {sc.shortName}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 font-mono">
                  {isSelected ? 'Aktif Sekarang' : 'Klik Terapkan'}
                </span>
              </button>
            );
          })}
        </div>

        {/* 5. Live O-RAN Action & Delta Feedback Banner */}
        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              <strong className="text-white">Aksi O-RAN rApp ({simState.simTimeString}):</strong> {hourTelemetry.carrierAction}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2 py-0.5 rounded-md bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-mono font-bold">
              Proteksi 112: 100% Siaga
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {currentScenario.name}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
