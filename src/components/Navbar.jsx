import React, { useState, useEffect } from 'react';
import { 
  FileDown, 
  Sparkles, 
  ShieldAlert, 
  ShieldCheck, 
  Radio, 
  DollarSign, 
  Leaf, 
  Sliders,
  SlidersHorizontal,
  Printer,
  HelpCircle,
  Bot,
  Activity,
  Zap,
  Lock,
  CheckCircle2
} from 'lucide-react';
import { SYSTEM_METADATA } from '../data/mockData';

export default function Navbar({ 
  onOpenReportModal,
  onOpenDirectorTour,
  onTogglePitchWalkthrough,
  isPitchWalkthroughActive,
  onOpenEmergencyModal,
  onOpenExecutiveMemo,
  onOpenBodDefense,
  onOpenAiCopilot,
  emergencyState = { active: false },
  selectedScale,
  setSelectedScale,
  activeLens,
  setActiveLens,
  isAutonomous,
  setIsAutonomous,
  onToggleSimBar,
  isSimBarOpen,
  simState = { scenarioKey: 'normal', simTimeString: '14:00 WIB' }
}) {
  // Live simulation ticker numbers that subtly pulse
  const [liveMetrics, setLiveMetrics] = useState({
    shavedMW: 48.7,
    savedTodayM: 1.42,
    activeNodes: 293136,
    heartbeatTime: '00:00:02'
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveMetrics(prev => ({
        ...prev,
        shavedMW: +(48.5 + Math.random() * 0.4).toFixed(1),
        savedTodayM: +(1.41 + Math.random() * 0.03).toFixed(2),
        heartbeatTime: new Date().toLocaleTimeString('id-ID')
      }));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md shadow-xs">
      {/* Top Main Navigation Row */}
      <div className="px-3 sm:px-5 py-2 flex items-center justify-between w-full mx-auto gap-2 lg:gap-3">
        {/* Brand & Subtitle */}
        <div className="flex items-center space-x-2.5 shrink-0">
          <div className="flex items-center justify-center p-1.5 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
            <img 
              src="/assets/logo_utama_impactgrid.png" 
              alt="Telkomsel ImpactGrid Logo" 
              className="h-7 sm:h-8 w-auto object-contain" 
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm sm:text-base font-black tracking-tight text-slate-900 whitespace-nowrap">
                Telkomsel <span className="text-[#ED0226]">ImpactGrid</span>
              </span>
              <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                BCC TSF 2026
              </span>
            </div>
            <p className="text-[10px] text-slate-500 hidden xl:block whitespace-nowrap">
              Cyber-Physical Energy System & DSS • Tim <strong className="text-slate-700">AWAKENING Reborn</strong>
            </p>
          </div>
        </div>

        {/* Center: Integrated Clean Controls (Scale & Perspective) */}
        <div className="hidden 2xl:flex items-center space-x-2 bg-slate-100/80 p-1 rounded-xl border border-slate-200 text-xs shrink-0">
          {/* Scale Phase Selector */}
          <div className="flex items-center space-x-0.5 pr-2 border-r border-slate-200">
            <button
              onClick={() => setSelectedScale('pilot')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                selectedScale === 'pilot' 
                  ? 'bg-white text-slate-900 shadow-2xs' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Pilot (40 Sites)
            </button>
            <button
              onClick={() => setSelectedScale('regional')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                selectedScale === 'regional' 
                  ? 'bg-white text-slate-900 shadow-2xs' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Regional (5k BTS)
            </button>
            <button
              onClick={() => setSelectedScale('national')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                selectedScale === 'national' 
                  ? 'bg-white text-slate-900 shadow-2xs' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Nasional (10k+)
            </button>
          </div>

          {/* Stakeholder Lens */}
          <div className="flex items-center space-x-0.5">
            <span className="text-[10px] font-bold text-slate-400 px-1 uppercase">Lensa:</span>
            <button
              onClick={() => setActiveLens('all')}
              className={`px-2 py-0.5 rounded-md font-medium transition cursor-pointer ${
                activeLens === 'all' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setActiveLens('finance')}
              className={`px-2 py-0.5 rounded-md font-medium transition cursor-pointer flex items-center gap-1 ${
                activeLens === 'finance' ? 'bg-amber-100 text-amber-900 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <DollarSign className="w-3 h-3 text-amber-600" />
              <span>CFO</span>
            </button>
            <button
              onClick={() => setActiveLens('network')}
              className={`px-2 py-0.5 rounded-md font-medium transition cursor-pointer flex items-center gap-1 ${
                activeLens === 'network' ? 'bg-cyan-100 text-cyan-900 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Radio className="w-3 h-3 text-cyan-600" />
              <span>CTO</span>
            </button>
            <button
              onClick={() => setActiveLens('esg')}
              className={`px-2 py-0.5 rounded-md font-medium transition cursor-pointer flex items-center gap-1 ${
                activeLens === 'esg' ? 'bg-emerald-100 text-emerald-900 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Leaf className="w-3 h-3 text-emerald-600" />
              <span>ESG</span>
            </button>
          </div>
        </div>

        {/* Right Action Tools: Pitching Mode, Stress Test, and Verification */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0 overflow-x-auto py-0.5 max-w-full">
          {/* Global Simulation Console Toggle */}
          <button
            onClick={onToggleSimBar}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer shrink-0 ${
              isSimBarOpen
                ? 'bg-slate-900 text-white border-slate-950 shadow-xs ring-2 ring-slate-400'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
            }`}
            title="Buka Konsol Simulasi Lapangan Real-Time (Shortcut: 'E')"
          >
            <Sliders className="w-3.5 h-3.5 text-[#ED0226]" />
            <span className="whitespace-nowrap font-black">
              {simState.scenarioKey === 'normal' ? '🟢 Normal 24 Jam' : 
               simState.scenarioKey === 'heatwave' ? '☀️ Heatwave 36°C' :
               simState.scenarioKey === 'mudik' ? '🚗 Mudik Pantura' :
               simState.scenarioKey === 'pln_peak' ? '⚡ Tarif WBP' :
               simState.scenarioKey === 'blackout_sumatera' ? '⚠️ Blackout PLN' : '🚨 Darurat 112'}
            </span>
          </button>

          {/* Live Pitch Walkthrough Bar Toggle */}
          <button
            onClick={onTogglePitchWalkthrough}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-black shadow-2xs transition cursor-pointer border shrink-0 ${
              isPitchWalkthroughActive 
                ? 'bg-[#ED0226] text-white border-red-700 ring-2 ring-red-200' 
                : 'bg-red-50 hover:bg-red-100 text-[#ED0226] border-red-200'
            }`}
            title="Mulai Mode Panduan Presentasi 7 Menit (Shortcut: 'W')"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">{isPitchWalkthroughActive ? 'Walkthrough On' : 'Walkthrough 7m'}</span>
          </button>

          {/* Executive Tour / Pitch Button */}
          <button
            onClick={onOpenDirectorTour}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-2xs transition cursor-pointer shrink-0"
            title="Mode Panduan Presentasi Khusus Direksi Telkomsel (Shortcut: 'T')"
          >
            <span className="whitespace-nowrap">Pitch Modal</span>
          </button>

          {/* BoD Q&A Defense Simulator Button */}
          <button
            onClick={onOpenBodDefense}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold shadow-2xs transition cursor-pointer shrink-0"
            title="Contekan 8 Pertanyaan Mematikan Direksi Telkomsel & Layar Bukti (Shortcut: 'Q')"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span className="whitespace-nowrap">Q&A BoD</span>
          </button>

          {/* AI Energy Copilot Button */}
          <button
            onClick={onOpenAiCopilot}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-300 text-xs font-bold shadow-2xs transition cursor-pointer shrink-0"
            title="Tanya AI Copilot tentang O-RAN, QoS, & Finansial (Shortcut: 'A')"
          >
            <Bot className="w-3.5 h-3.5 text-purple-600" />
            <span className="whitespace-nowrap">AI Copilot</span>
          </button>

          {/* CTO Emergency Stress Test Trigger */}
          <button
            onClick={onOpenEmergencyModal}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer shrink-0 ${
              emergencyState.active
                ? 'bg-red-600 text-white border-red-700 animate-pulse'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-2xs'
            }`}
            title="Simulasi Lonjakan Trafik Ekstrem 300% & Uji Respon SLA 112 (Shortcut: 'S')"
          >
            <ShieldAlert className={`w-3.5 h-3.5 ${emergencyState.active ? 'text-white' : 'text-amber-500'}`} />
            <span className="whitespace-nowrap">{emergencyState.active ? 'Drill Aktif' : 'CTO Stress'}</span>
          </button>

          {/* 1-Click Executive Memo Print / PDF */}
          <button
            onClick={onOpenExecutiveMemo}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold shadow-2xs transition cursor-pointer shrink-0"
            title="Cetak Dokumen Memo Eksekutif Resmi Format A4 (Shortcut: 'P')"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span className="whitespace-nowrap">Memo A4</span>
          </button>

          {/* Report Button */}
          <button
            onClick={onOpenReportModal}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-[#ED0226] hover:bg-red-700 text-white text-xs font-bold shadow-2xs transition cursor-pointer shrink-0"
            title="Download Laporan Format Resmi ISO & ITU-T (Tabel 8)"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">Laporan</span>
          </button>
        </div>
      </div>

      {/* Real-Time Live Telemetry Ticker (Mission Control Cockpit) */}
      <div className="bg-slate-900 text-slate-300 px-3 sm:px-5 py-1 text-[11px] font-mono flex items-center justify-between overflow-x-auto border-t border-slate-800">
        <div className="flex items-center space-x-4 shrink-0">
          <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>TELEMETRI LIVE</span>
          </div>
          <span className="text-slate-400">
            BTS Aktif: <strong className="text-white">{liveMetrics.activeNodes.toLocaleString('id-ID')} Menara</strong>
          </span>
          <span className="text-slate-400">
            Beban Puncak Dipangkas: <strong className="text-cyan-400">{liveMetrics.shavedMW} MW</strong>
          </span>
          <span className="text-slate-400">
            Estimasi Hemat Hari Ini: <strong className="text-emerald-400">Rp {liveMetrics.savedTodayM} Miliar</strong>
          </span>
          <span className="text-slate-400">
            Kanal Darurat 112: <strong className="text-emerald-400">100.0% Terproteksi</strong>
          </span>
        </div>

        <div className="hidden lg:flex items-center space-x-3 text-[10px] text-slate-400 shrink-0">
          <span>O-RAN O1 Heartbeat: {liveMetrics.heartbeatTime}</span>
          <span className="text-indigo-400 font-bold flex items-center gap-1">
            <Lock className="w-3 h-3 text-indigo-400" />
            SHA-256 Merkle Ledger Valid
          </span>
        </div>
      </div>
    </header>
  );
}
