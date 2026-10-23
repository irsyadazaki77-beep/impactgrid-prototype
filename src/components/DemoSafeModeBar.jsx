import React from 'react';
import { 
  RotateCcw, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Camera, 
  WifiOff, 
  Database,
  Radio,
  Flame,
  Zap,
  HelpCircle
} from 'lucide-react';
import { SIMULATION_SCENARIOS } from './GlobalSimulationBar';

/**
 * DemoSafeModeBar:
 * Safeguard controller for high-stakes executive demonstrations:
 * - 1-Click Fast State Reset (returns all parameters to clean baseline)
 * - Preset Scenario Snapshots (Normal, Heatwave, Mudik, PLN Peak, Blackout)
 * - Offline Fallback status indicator
 * - Data Category Disclaimer (Synthetic / Projection / Verified)
 */
export default function DemoSafeModeBar({
  simState,
  setSimState,
  onResetState,
  isOfflineMode = true
}) {
  const handleSelectScenario = (key) => {
    const sc = SIMULATION_SCENARIOS[key];
    if (sc) {
      setSimState(prev => ({
        ...prev,
        scenarioKey: key,
        tempC: sc.tempC,
        trafficMultiplier: sc.trafficMultiplier,
        carrierSleepActive: sc.carrierSleepActive,
        plnTariffIDR: sc.plnTariffIDR,
        emergencyActive: sc.emergencyActive || false
      }));
    }
  };

  const currentScenario = SIMULATION_SCENARIOS[simState.scenarioKey] || SIMULATION_SCENARIOS.normal;

  return (
    <div className="bg-slate-900 text-white px-4 py-2 text-xs border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-inner">
      {/* Left: Safe Mode & Scenario Presets */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-[10px]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>DEMO SAFE MODE 2.0</span>
        </div>

        {/* Quick Snapshot Presets */}
        <span className="text-slate-400 text-[11px] hidden sm:inline">Snapshot:</span>
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          {Object.entries(SIMULATION_SCENARIOS).map(([key, sc]) => {
            const isSelected = simState.scenarioKey === key;
            return (
              <button
                key={key}
                onClick={() => handleSelectScenario(key)}
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition whitespace-nowrap cursor-pointer ${
                  isSelected 
                    ? 'bg-[#ED0226] text-white shadow-2xs' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {sc.shortName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: 1-Click Reset & Offline Fallback & Tagging */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1 text-[10px] text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
          <Database className="w-3 h-3 text-cyan-400" />
          <span className="hidden md:inline">Mode:</span>
          <span className="text-cyan-300 font-bold">Offline High-Speed Cache</span>
        </div>

        {/* One-Click Clean Reset */}
        <button
          onClick={onResetState}
          className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-red-900/60 text-slate-200 hover:text-white border border-slate-700 hover:border-red-500 text-[10px] font-bold transition cursor-pointer flex items-center gap-1.5"
          title="Reset parameter simulasi ke kondisi awal dalam 1 klik"
        >
          <RotateCcw className="w-3 h-3 text-red-400" />
          <span>Reset 1-Klik</span>
        </button>
      </div>
    </div>
  );
}
