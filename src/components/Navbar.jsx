import React, { useState, useEffect, useRef } from 'react';
import { 
  FileDown, 
  Sparkles, 
  ShieldAlert, 
  ShieldCheck, 
  Radio, 
  DollarSign, 
  Leaf, 
  Sliders,
  Printer,
  HelpCircle,
  Bot,
  Zap,
  Lock,
  ChevronDown,
  Layers,
  Terminal,
  Activity,
  Presentation,
  Wrench,
  Check,
  Moon,
  Sun,
  RotateCcw
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
  simState = { scenarioKey: 'normal', simTimeString: '14:00 WIB' },
  viewMode = 'executive', // 'executive' | 'engineering'
  setViewMode,
  theme = 'light',
  onToggleTheme,
  onResetDemo
}) {
  const [isToolkitOpen, setIsToolkitOpen] = useState(false);
  const toolkitRef = useRef(null);

  // Close toolkit dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (toolkitRef.current && !toolkitRef.current.contains(event.target)) {
        setIsToolkitOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/95 backdrop-blur-md shadow-md text-slate-100">
      {/* Top Main Navigation Row */}
      <div className="px-3 sm:px-5 py-2 flex items-center justify-between w-full mx-auto gap-2 lg:gap-3">
        {/* Brand & Subtitle */}
        <div className="flex items-center space-x-2.5 shrink-0">
          <div className="flex items-center justify-center p-1.5 rounded-xl bg-slate-900 border border-slate-800 shadow-2xs">
            <img 
              src="/assets/logo_utama_impactgrid.webp"
                alt="Logo konsep ImpactGrid"
              className="h-7 sm:h-8 w-auto object-contain" 
                decoding="async"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm sm:text-base font-black tracking-tight text-white whitespace-nowrap">
                <span className="text-[#ED0226]">ImpactGrid</span>
              </span>
              <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                BCC TSF 2026
              </span>
              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 shrink-0 shadow-2xs">
                DEMO / SIMULATED
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden xl:block whitespace-nowrap">
              Konsep DSS untuk studi kasus Telkomsel • Tim <strong className="text-slate-200">AWAKENING Reborn</strong>
            </p>
          </div>
        </div>

        {/* Center-Left: Presentation View Switcher (Instruction #2) */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs shrink-0 shadow-inner">
          <button
            onClick={() => setViewMode && setViewMode('executive')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
              viewMode === 'executive'
                ? 'bg-[#ED0226] text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Executive Pitch Mode: Menyederhanakan tampilan, menonjolkan KPI finansial/karbon & panduan juri"
          >
            <Presentation className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">Executive Pitch</span>
          </button>
          <button
            onClick={() => setViewMode && setViewMode('engineering')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
              viewMode === 'engineering'
                ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Menampilkan tab analisis teknis; prototype tidak memuat telemetri live"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">Deep Engineering</span>
          </button>
        </div>

        {/* Center: Integrated Clean Controls (Scale & Perspective) */}
        <div className="hidden 2xl:flex items-center space-x-2 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs shrink-0">
          {/* Scale Phase Selector */}
          <div className="flex items-center space-x-0.5 pr-2 border-r border-slate-800">
            <button
              onClick={() => setSelectedScale('pilot')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                selectedScale === 'pilot' 
                  ? 'bg-slate-800 text-white shadow-2xs' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Pilot (40 Sites)
            </button>
            <button
              onClick={() => setSelectedScale('regional')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                selectedScale === 'regional' 
                  ? 'bg-slate-800 text-white shadow-2xs' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Regional (belum dihitung)
            </button>
            <button
              onClick={() => setSelectedScale('national')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                selectedScale === 'national' 
                  ? 'bg-slate-800 text-white shadow-2xs' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Nasional (belum dihitung)
            </button>
          </div>

          {/* Stakeholder Lens */}
          <div className="flex items-center space-x-0.5">
            <span className="text-[10px] font-bold text-slate-400 px-1 uppercase">Lensa:</span>
            <button
              onClick={() => setActiveLens('all')}
              className={`px-2 py-0.5 rounded-md font-medium transition cursor-pointer ${
                activeLens === 'all' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setActiveLens('finance')}
              className={`px-2 py-0.5 rounded-md font-medium transition cursor-pointer flex items-center gap-1 ${
                activeLens === 'finance' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <DollarSign className="w-3 h-3 text-amber-400" />
              <span>CFO</span>
            </button>
            <button
              onClick={() => setActiveLens('network')}
              className={`px-2 py-0.5 rounded-md font-medium transition cursor-pointer flex items-center gap-1 ${
                activeLens === 'network' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Radio className="w-3 h-3 text-cyan-400" />
              <span>CTO</span>
            </button>
            <button
              onClick={() => setActiveLens('esg')}
              className={`px-2 py-0.5 rounded-md font-medium transition cursor-pointer flex items-center gap-1 ${
                activeLens === 'esg' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Leaf className="w-3 h-3 text-emerald-400" />
              <span>ESG</span>
            </button>
          </div>
        </div>

        {/* Right Action Tools: Consolidated Executive Toolkit (Instruction #4) */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          <button type="button" onClick={onResetDemo} aria-label="Reset seluruh simulasi" title="Kembalikan seluruh state demo ke awal" className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer">
            <RotateCcw size={15} /><span className="hidden xl:inline">Reset demo</span>
          </button>
          <button type="button" onClick={onToggleTheme} aria-label={`Aktifkan mode ${theme === 'light' ? 'gelap' : 'terang'}`} title={`Aktifkan mode ${theme === 'light' ? 'gelap' : 'terang'}`} className="theme-toggle inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 text-xs font-semibold cursor-pointer">
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}<span className="hidden xl:inline">{theme === 'light' ? 'Gelap' : 'Terang'}</span>
          </button>
          {/* Live Global Simulation Bar Toggle */}
          <button
            onClick={onToggleSimBar}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer shrink-0 ${
              isSimBarOpen
                ? 'bg-slate-800 text-white border-slate-700 ring-2 ring-slate-600'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800'
            }`}
            title="Buka konsol skenario demo lokal (Shortcut: 'E')"
          >
            <Sliders className="w-3.5 h-3.5 text-[#ED0226]" />
            <span className="whitespace-nowrap font-black">
              {simState.scenarioKey === 'normal' ? 'Demo lokal' :
               simState.scenarioKey === 'heatwave' ? 'Asumsi cuaca' :
               simState.scenarioKey === 'mudik' ? 'Asumsi trafik' :
               simState.scenarioKey === 'pln_peak' ? 'Asumsi biaya' :
               simState.scenarioKey === 'blackout_sumatera' ? 'Gangguan (konsep)' : 'Keselamatan (konsep)'}
            </span>
          </button>

          {/* Guided Pitch Walkthrough Teleprompter */}
          <button
            onClick={onTogglePitchWalkthrough}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-black shadow-xs transition cursor-pointer border shrink-0 ${
              isPitchWalkthroughActive 
                ? 'bg-[#ED0226] text-white border-red-600 ring-2 ring-red-500/40' 
                : 'bg-red-500/10 hover:bg-red-500/20 text-rose-300 border-red-500/30'
            }`}
            aria-label={isPitchWalkthroughActive ? 'Presentasi aktif, tutup presentasi' : 'Start Presentation 7 menit'}
            title={isPitchWalkthroughActive ? 'Tutup presentasi (W)' : 'Mulai presentasi 7 menit (W)'}
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-300" />
            <span className="whitespace-nowrap">{isPitchWalkthroughActive ? 'Presentasi aktif' : 'Start Presentation'}</span>
          </button>

          {/* CONSOLIDATED DROPDOWN: "Executive & Defense Toolkit" (Instruction #4) */}
          <div className="relative shrink-0" ref={toolkitRef}>
            <button
              onClick={() => setIsToolkitOpen(prev => !prev)}
              aria-expanded={isToolkitOpen}
              aria-haspopup="menu"
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer border ${
                isToolkitOpen
                  ? 'bg-amber-500 text-slate-950 border-amber-400 ring-2 ring-amber-500/30 shadow-md'
                  : emergencyState.active
                    ? 'bg-red-950/80 text-red-300 border-red-600 animate-pulse'
                    : 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border-amber-500/40 shadow-xs'
              }`}
              title="Akses Seluruh Modal Aksi Direksi, Q&A Defense, Drill Darurat, dan Memo Eksekutif"
            >
              <Zap className={`w-3.5 h-3.5 ${isToolkitOpen ? 'text-slate-950 fill-slate-950' : 'text-amber-400'}`} />
              <span className="whitespace-nowrap">⚡ Executive & Defense Toolkit</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isToolkitOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu Modal Hub */}
            {isToolkitOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-2 border-b border-slate-800">
                  <p className="text-[11px] font-black text-amber-400 uppercase tracking-wider">
                    Executive Action Center
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Pusat kendali presentasi, verifikasi & simulasi dewan direksi
                  </p>
                </div>

                <div className="py-1 space-y-1">
                  {/* BoD Q&A Defense Simulator */}
                  <button
                    onClick={() => {
                      onOpenBodDefense();
                      setIsToolkitOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-800 transition cursor-pointer group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white group-hover:text-amber-300">BoD Defense Q&A</p>
                        <p className="text-[10px] text-slate-400">Contekan 8 pertanyaan tajam dewan direksi</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">Q</span>
                  </button>

                  {/* Director Presentation Tour Modal */}
                  <button
                    onClick={() => {
                      onOpenDirectorTour();
                      setIsToolkitOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-800 transition cursor-pointer group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 group-hover:bg-[#ED0226] group-hover:text-white transition">
                        <Presentation className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white group-hover:text-rose-300">Director Pitch Tour</p>
                        <p className="text-[10px] text-slate-400">Tur berpemandu khusus juri & direksi</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">T</span>
                  </button>

                  {/* AI Copilot Intelligence Assistant */}
                  <button
                    onClick={() => {
                      onOpenAiCopilot();
                      setIsToolkitOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-800 transition cursor-pointer group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white group-hover:text-purple-300">AI Energy Copilot</p>
                        <p className="text-[10px] text-slate-400">Asisten konseptual; tanpa data jaringan live</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">A</span>
                  </button>

                  {/* CTO Emergency Stress Test Modal */}
                  <button
                    onClick={() => {
                      onOpenEmergencyModal();
                      setIsToolkitOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-800 transition cursor-pointer group ${
                      emergencyState.active ? 'bg-red-950/60 border border-red-500/40' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className={`p-1.5 rounded-lg ${
                        emergencyState.active 
                          ? 'bg-red-600 text-white' 
                          : 'bg-rose-500/20 text-rose-400 group-hover:bg-red-600 group-hover:text-white'
                      } transition`}>
                        <ShieldAlert className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white group-hover:text-rose-300">
                          {emergencyState.active ? 'Skenario keselamatan dipilih' : 'Tinjauan keselamatan layanan'}
                        </p>
                        <p className="text-[10px] text-slate-400">Checklist konseptual; tidak menguji trafik atau layanan 112</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">S</span>
                  </button>

                  {/* Executive Board Memo Modal */}
                  <button
                    onClick={() => {
                      onOpenExecutiveMemo();
                      setIsToolkitOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-800 transition cursor-pointer group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition">
                        <Printer className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white group-hover:text-cyan-300">Executive Memo A4</p>
                        <p className="text-[10px] text-slate-400">Cetak ringkasan eksekutif untuk ditinjau</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">P</span>
                  </button>

                  {/* Planning assumptions worksheet */}
                  <button
                    onClick={() => {
                      onOpenReportModal();
                      setIsToolkitOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-800 transition cursor-pointer group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition">
                        <FileDown className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white group-hover:text-emerald-300">Lihat Lembar Kerja Asumsi</p>
                        <p className="text-[10px] text-slate-400">Konteks, sensitivitas, dan langkah validasi</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">LEMBAR</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Demo provenance and connection status */}
      <div className="telemetry-ticker px-3 sm:px-5 py-2 text-xs font-mono flex items-center justify-between border-t">
        <div className="telemetry-ticker-metrics flex items-center gap-x-4 gap-y-1">
          <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>PROTOTIPE LOKAL</span>
          </div>
          <span className="text-slate-400">
            Data operasi: <strong className="text-amber-300">Belum terhubung</strong>
          </span>
          <span className="text-slate-400">
            Hemat energi: <strong className="text-amber-300">Belum diukur</strong>
          </span>
          <span className="text-slate-400">
            QoS & 112: <strong className="text-amber-300">Belum diuji</strong>
          </span>
          <span className="text-slate-400">
            Audit ledger: <strong className="text-amber-300">Belum aktif</strong>
          </span>
        </div>

        <div className="hidden lg:flex items-center space-x-3 text-xs text-slate-400 shrink-0">
          <span>Integrasi O-RAN O1: belum tersedia</span>
          <span className="text-indigo-400 font-bold flex items-center gap-1">
            <Lock className="w-3 h-3 text-indigo-400" />
            Data sumber perlu validasi
          </span>
        </div>
      </div>
    </header>
  );
}
