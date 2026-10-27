import React, { useState, useEffect, useRef } from 'react';
import { 
  FileDown, 
  Sparkles, 
  ShieldAlert, 
  Radio, 
  DollarSign, 
  Leaf, 
  Sliders,
  Printer,
  HelpCircle,
  Bot,
  Zap,
  ChevronDown,
  Presentation,
  Wrench,
  Moon,
  Sun,
  RotateCcw,
  Lock
} from 'lucide-react';
import DataProvenanceModal from './DataProvenanceModal';

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
  onToggleSimBar,
  isSimBarOpen,
  simState = { scenarioKey: 'normal', simTimeString: '14:00 WIB' },
  viewMode = 'executive',
  setViewMode,
  theme = 'light',
  onToggleTheme,
  onResetDemo
}) {
  const [isToolkitOpen, setIsToolkitOpen] = useState(false);
  const [isProvenanceOpen, setIsProvenanceOpen] = useState(false);
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
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xs transition-colors">
        <div className="px-2 sm:px-4 py-1.5 md:py-0 md:h-14 flex flex-wrap md:flex-nowrap items-center justify-between w-full gap-1.5 sm:gap-2">
          
          {/* Top row on mobile / Left group on desktop: Brand + Theme & Reset */}
          <div className="flex items-center justify-between w-full md:w-auto shrink-0">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <img 
                  src="/assets/logo_utama_impactgrid.webp" 
                  alt="Logo konsep ImpactGrid" 
                  className="h-6 sm:h-7 w-auto object-contain" 
                  decoding="async"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm sm:text-base font-black tracking-tight text-slate-900 dark:text-white">
                    <span className="text-[#ED0226]">Impact</span>Grid
                  </span>
                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hidden sm:inline">
                    TSF 2026
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden 2xl:block whitespace-nowrap">
                  DSS Telkomsel • Tim <strong className="text-slate-700 dark:text-slate-200">AWAKENING Reborn</strong>
                </p>
              </div>
            </div>

            {/* Unique Theme & Reset Buttons (Docked right on mobile, visible on desktop) */}
            <div className="flex md:hidden items-center space-x-1">
              <button 
                type="button" 
                onClick={onResetDemo} 
                aria-label="Reset seluruh simulasi" 
                title="Kembalikan seluruh state demo ke awal" 
                className="inline-flex items-center justify-center gap-1 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer"
              >
                <RotateCcw size={14} />
              </button>

              <button 
                type="button" 
                onClick={onToggleTheme} 
                aria-label={`Aktifkan mode ${theme === 'light' ? 'gelap' : 'terang'}`} 
                title={`Aktifkan mode ${theme === 'light' ? 'gelap' : 'terang'}`} 
                className="theme-toggle inline-flex items-center justify-center gap-1 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer"
              >
                {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
              </button>
            </div>
          </div>

          {/* Mode Switcher: Executive Pitch vs Deep Engineering */}
          <div className="flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs shrink-0 w-full sm:w-auto justify-center order-2 md:order-none">
            <button
              onClick={() => setViewMode && setViewMode('executive')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                viewMode === 'executive'
                  ? 'bg-[#ED0226] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Executive Pitch Mode: Menyederhanakan tampilan, menonjolkan KPI finansial/karbon & panduan juri"
            >
              <Presentation className="w-3.5 h-3.5" />
              <span className="whitespace-nowrap">Executive Pitch</span>
            </button>
            <button
              onClick={() => setViewMode && setViewMode('engineering')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                viewMode === 'engineering'
                  ? 'bg-slate-900 dark:bg-slate-700 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Menampilkan tab analisis teknis; prototype tidak memuat telemetri live"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span className="whitespace-nowrap">Deep Engineering</span>
            </button>
          </div>

          {/* Right Action Tools: Controls & Dropdowns */}
          <div className="flex items-center justify-center md:justify-end flex-wrap sm:flex-nowrap w-full md:w-auto gap-1 sm:gap-1.5 shrink-0 order-3 md:order-none">
            {/* Desktop Theme & Reset (Hidden on mobile to avoid duplicates) */}
            <button 
              type="button" 
              onClick={onResetDemo} 
              aria-label="Reset seluruh simulasi" 
              title="Kembalikan seluruh state demo ke awal" 
              className="hidden md:inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold cursor-pointer"
            >
              <RotateCcw size={14} />
              <span className="hidden xl:inline">Reset demo</span>
            </button>

            <button 
              type="button" 
              onClick={onToggleTheme} 
              aria-label={`Aktifkan mode ${theme === 'light' ? 'gelap' : 'terang'}`} 
              title={`Aktifkan mode ${theme === 'light' ? 'gelap' : 'terang'}`} 
              className="theme-toggle hidden md:inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold cursor-pointer"
            >
              {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
              <span className="hidden xl:inline">{theme === 'light' ? 'Gelap' : 'Terang'}</span>
            </button>

            {/* Simulation Scenario Console Toggle */}
            <button
              onClick={onToggleSimBar}
              className={`flex items-center space-x-1 px-2 sm:px-2.5 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer shrink-0 ${
                isSimBarOpen
                  ? 'bg-slate-900 text-white border-slate-800 dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700'
              }`}
              title="Buka konsol skenario demo lokal (Shortcut: 'E')"
            >
              <Sliders className="w-3.5 h-3.5 text-[#ED0226]" />
              <span className="whitespace-nowrap font-bold">
                {simState.scenarioKey === 'normal' ? 'Demo lokal' :
                 simState.scenarioKey === 'heatwave' ? 'Asumsi cuaca' :
                 simState.scenarioKey === 'mudik' ? 'Asumsi trafik' :
                 simState.scenarioKey === 'pln_peak' ? 'Asumsi biaya' :
                 simState.scenarioKey === 'blackout_sumatera' ? 'Gangguan (konsep)' : 'Keselamatan (konsep)'}
              </span>
            </button>

            {/* Start Presentation 7 menit */}
            <button
              onClick={onTogglePitchWalkthrough}
              className={`flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs transition cursor-pointer border shrink-0 ${
                isPitchWalkthroughActive 
                  ? 'bg-[#ED0226] text-white border-red-600 ring-2 ring-red-500/40' 
                  : 'bg-red-50 hover:bg-red-100 text-[#ED0226] border-red-200 dark:bg-red-950/30 dark:hover:bg-red-900/40 dark:border-red-900/50'
              }`}
              aria-label={isPitchWalkthroughActive ? 'Presentasi aktif, tutup presentasi' : 'Start Presentation 7 menit'}
              title={isPitchWalkthroughActive ? 'Tutup presentasi (W)' : 'Mulai presentasi 7 menit (W)'}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap font-extrabold">{isPitchWalkthroughActive ? 'Presentasi aktif' : 'Start Presentation 7 menit'}</span>
            </button>

            {/* Consolidated Dropdown: Executive & Defense Toolkit */}
            <div className="relative shrink-0" ref={toolkitRef}>
              <button
                onClick={() => setIsToolkitOpen(prev => !prev)}
                aria-expanded={isToolkitOpen}
                aria-haspopup="menu"
                aria-label="Executive & Defense Toolkit"
                className={`flex items-center space-x-1 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  isToolkitOpen
                    ? 'bg-amber-500 text-slate-950 border-amber-400 ring-2 ring-amber-500/30 shadow-md'
                    : emergencyState.active
                      ? 'bg-red-100 text-red-700 border-red-400 animate-pulse dark:bg-red-950/60 dark:text-red-300'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700'
                }`}
                title="Akses Seluruh Modal Aksi Direksi, Q&A Defense, Drill Darurat, dan Memo Eksekutif"
              >
                <Zap className={`w-3.5 h-3.5 shrink-0 ${isToolkitOpen ? 'text-slate-950 fill-slate-950' : 'text-amber-500'}`} />
                <span className="whitespace-nowrap hidden xl:inline">Executive & Defense Toolkit</span>
                <span className="whitespace-nowrap xl:hidden">Toolkit</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isToolkitOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isToolkitOpen && (
                <div className="absolute right-0 mt-2 w-76 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl p-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-[11px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                      Executive Action Center
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      Pusat kendali presentasi, verifikasi & simulasi dewan direksi
                    </p>
                  </div>

                  <div className="py-1 space-y-1">
                    {/* BoD Defense Q&A */}
                    <button
                      onClick={() => {
                        onOpenBodDefense();
                        setIsToolkitOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer group"
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                          <HelpCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">BoD Defense Q&A</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">8 pertanyaan tajam dewan direksi</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-slate-500 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">Q</span>
                    </button>

                    {/* Director Pitch Tour */}
                    <button
                      onClick={() => {
                        onOpenDirectorTour();
                        setIsToolkitOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer group"
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className="p-1.5 rounded-lg bg-red-50 text-[#ED0226] dark:bg-red-950/40 dark:text-red-400">
                          <Presentation className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">Director Pitch Tour</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">Tur presentasi terstruktur</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-slate-500 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">T</span>
                    </button>

                    {/* AI Copilot */}
                    <button
                      onClick={() => {
                        onOpenAiCopilot();
                        setIsToolkitOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer group"
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">AI Energy Copilot</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">Asisten penalaran DSS</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-slate-500 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">A</span>
                    </button>

                    {/* CTO Emergency Stress Test */}
                    <button
                      onClick={() => {
                        onOpenEmergencyModal();
                        setIsToolkitOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer group"
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                          <ShieldAlert className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">Tinjauan Keselamatan Layanan</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">Drill darurat & proteksi QoS/112</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-slate-500 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">S</span>
                    </button>

                    {/* Executive Memo */}
                    <button
                      onClick={() => {
                        onOpenExecutiveMemo();
                        setIsToolkitOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer group"
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className="p-1.5 rounded-lg bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400">
                          <Printer className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">Executive Memo A4</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">Cetak lembar ringkasan direksi</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-slate-500 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">P</span>
                    </button>

                    {/* Planning Assumptions */}
                    <button
                      onClick={() => {
                        onOpenReportModal();
                        setIsToolkitOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer group"
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                          <FileDown className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">Lihat Lembar Kerja Asumsi</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">Sensitivitas finansial & metodologi</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-slate-500 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">LEMBAR</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Telemetry Ticker (Required by E2E test suite) */}
        <div className="telemetry-ticker px-3 sm:px-5 py-1 text-xs font-mono flex items-center justify-between border-t border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="telemetry-ticker-metrics flex items-center gap-x-4 gap-y-1">
            <div className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>PROTOTIPE LOKAL</span>
            </div>
            <span className="text-slate-500 dark:text-slate-400">
              Data operasi: <strong className="text-amber-700 dark:text-amber-300">Belum terhubung</strong>
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              Hemat energi: <strong className="text-amber-700 dark:text-amber-300">Belum diukur</strong>
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              QoS & 112: <strong className="text-amber-700 dark:text-amber-300">Belum diuji</strong>
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              Audit ledger: <strong className="text-amber-700 dark:text-amber-300">Belum aktif</strong>
            </span>
          </div>

          <div className="hidden lg:flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400 shrink-0">
            <span>Integrasi O-RAN O1: belum tersedia</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1">
              <Lock className="w-3 h-3 text-indigo-500" />
              Data sumber perlu validasi
            </span>
          </div>
        </div>
      </header>

      {/* Provenance & Data Transparency Modal */}
      <DataProvenanceModal 
        isOpen={isProvenanceOpen} 
        onClose={() => setIsProvenanceOpen(false)} 
      />
    </>
  );
}
