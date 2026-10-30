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
  Lock, 
  QrCode,
  ShieldCheck,
  Activity,
  Briefcase,
  Cpu,
  Check,
  Users,
  FileText
} from 'lucide-react';
import DataProvenanceModal from './DataProvenanceModal';
import { ENTERPRISE_ROLES } from '../data/enterpriseRoles';

export default function Navbar({ 
  onOpenReportModal,
  onOpenDirectorTour,
  onTogglePitchWalkthrough,
  isPitchWalkthroughActive,
  onOpenEmergencyModal,
  onOpenExecutiveMemo,
  onOpenBodDefense,
  onOpenAiCopilot,
  onOpenQrShare,
  onOpenOfficialBaRe,
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
  currentRole = 'vp_network',
  onRoleChange,
  onOpenSsoModal,
  ssoSession,
  theme = 'light',
  onToggleTheme,
  onResetDemo,
  connectivityStatus = 'reachable'
}) {
  const [isToolkitOpen, setIsToolkitOpen] = useState(false);
  const [isProvenanceOpen, setIsProvenanceOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [iamNotification, setIamNotification] = useState(null);
  const toolkitRef = useRef(null);
  const roleDropdownRef = useRef(null);

  const activeRoleObj = ENTERPRISE_ROLES.find(r => r.id === currentRole) || ENTERPRISE_ROLES[0];

  const handleSelectRole = (role) => {
    if (onRoleChange) onRoleChange(role.id);
    setIsRoleDropdownOpen(false);
    setIamNotification({
      title: role.title,
      department: role.department,
      time: new Date().toLocaleTimeString('id-ID')
    });
    window.setTimeout(() => setIamNotification(null), 4000);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (toolkitRef.current && !toolkitRef.current.contains(event.target)) {
        setIsToolkitOpen(false);
      }
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target)) {
        setIsRoleDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const statusText = connectivityStatus === 'reachable' 
    ? 'DEMO LOKAL • Engine Telemetri Telkomsel Aktif (Simulasi Interaktif & Fail-Safe)' 
    : connectivityStatus === 'checking' 
      ? 'MEMERIKSA HOST DEMO • Menghubungkan engine telemetri lokal' 
      : connectivityStatus === 'offline' 
        ? 'OFFLINE • Peta offline SVG & simulasi telemetri tetap berjalan penuh' 
        : 'HOST DEMO TIDAK TERJANGKAU • Mode fallback telemetri lokal tetap aktif';

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-[#0B1324]/95 backdrop-blur-md shadow-xs transition-colors">
        <div className="px-3 sm:px-5 py-2 flex flex-wrap items-center justify-between w-full gap-2">
          
          {/* Left Brand Group */}
          <div className="flex items-center justify-between w-full md:w-auto shrink-0 gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center p-1.5 rounded-xl bg-red-500/10 border border-red-500/20">
                <img 
                  src="/assets/logo_utama_impactgrid.webp" 
                  alt="Logo konsep ImpactGrid" 
                  className="h-6 sm:h-7 w-auto object-contain" 
                  decoding="async"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-black tracking-tight text-slate-900 dark:text-white">
                    <span className="text-[#ED0226]">Impact</span>Grid
                  </span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-red-500/10 text-[#ED0226] border border-red-500/20">
                    TSF 2026
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden 2xl:block whitespace-nowrap">
                  DSS Telkomsel • <strong className="text-slate-800 dark:text-slate-200">RAN Energy Operations Suite</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Center Mode Switcher: Executive Pitch vs Deep Engineering */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs shrink-0 w-full sm:w-auto justify-center order-2 md:order-none">
            <button
              onClick={() => setViewMode && setViewMode('executive')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                viewMode === 'executive'
                  ? 'bg-[#ED0226] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Executive View Mode: Menyederhanakan tampilan dan menonjolkan ringkasan KPI finansial & karbon dewan direksi"
            >
              <Presentation className="w-3.5 h-3.5" />
              <span className="whitespace-nowrap">Executive Command Center</span>
            </button>
            <button
              onClick={() => setViewMode && setViewMode('engineering')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                viewMode === 'engineering'
                  ? 'bg-slate-900 dark:bg-slate-700 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Menampilkan tab analisis teknis O-RAN, telemetri, dan digital twin"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span className="whitespace-nowrap">NOC & Deep Engineering</span>
            </button>
          </div>

          {/* Enterprise Persona / IAM Selector */}
          <div className="relative shrink-0 order-2 md:order-none" ref={roleDropdownRef}>
            <button
              type="button"
              onClick={() => setIsRoleDropdownOpen(prev => !prev)}
              aria-expanded={isRoleDropdownOpen}
              aria-haspopup="menu"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200/90 dark:border-slate-700 bg-slate-100/90 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold transition cursor-pointer"
              title="Ganti Persona / Hak Akses Pengguna Telkomsel (IAM SSO)"
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-black text-slate-800 dark:text-slate-100">
                  {activeRoleObj.shortTitle}
                </span>
              </div>
              <span className={`hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] font-black border ${activeRoleObj.badgeColor}`}>
                {activeRoleObj.badge}
              </span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-150 ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isRoleDropdownOpen && (
              <div 
                role="menu"
                aria-label="Pilih Persona Telkomsel"
                className="absolute left-0 md:left-auto md:right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#0B1324] border border-slate-200 dark:border-slate-800 shadow-2xl z-50 p-2 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="p-2.5 border-b border-slate-100 dark:border-slate-800 mb-1.5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      Telkomsel Corporate IAM SSO
                    </p>
                    <span className="font-mono text-[9px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      OIDC Session Aktif
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Pilih persona untuk mengadaptasi dashboard, lensa KPI, dan level otorisasi
                  </p>
                </div>

                <div className="space-y-1">
                  {ENTERPRISE_ROLES.map((role) => {
                    const isSelected = role.id === currentRole;
                    return (
                      <button
                        key={role.id}
                        role="menuitem"
                        onClick={() => handleSelectRole(role)}
                        className={`w-full flex items-start gap-2.5 p-2.5 rounded-xl text-left transition cursor-pointer ${
                          isSelected
                            ? 'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                          role.id === 'vp_network' ? 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400' :
                          role.id === 'noc_leader' ? 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400' :
                          role.id === 'rno_engineer' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' :
                          role.id === 'esg_lead' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                          'bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400'
                        }`}>
                          {role.id === 'vp_network' && <Briefcase className="w-3.5 h-3.5" />}
                          {role.id === 'noc_leader' && <Activity className="w-3.5 h-3.5" />}
                          {role.id === 'rno_engineer' && <Cpu className="w-3.5 h-3.5" />}
                          {role.id === 'esg_lead' && <Leaf className="w-3.5 h-3.5" />}
                          {role.id === 'auditor' && <ShieldCheck className="w-3.5 h-3.5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className={`text-xs font-black truncate ${isSelected ? 'text-[#ED0226]' : 'text-slate-900 dark:text-white'}`}>
                              {role.title}
                            </span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#ED0226] shrink-0" />}
                          </div>
                          <div className="text-[10px] text-slate-500 font-medium line-clamp-1 mt-0.5">
                            {role.department}
                          </div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 line-clamp-1 leading-relaxed">
                            {role.description}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Telkomsel IAM SSO Portal Button */}
          <button
            type="button"
            onClick={onOpenSsoModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-500/30 bg-red-50 dark:bg-red-950/40 text-xs font-bold text-[#ED0226] hover:bg-red-100 dark:hover:bg-red-900/60 transition cursor-pointer order-2 md:order-none shrink-0"
            title="Buka Portal Telkomsel IAM SSO (OAuth2 / PKCE Login)"
          >
            <Lock className="w-3.5 h-3.5 text-[#ED0226]" />
            <span className="hidden sm:inline font-mono">
              {ssoSession?.name ? `${ssoSession.name.split(' ')[0]} (${ssoSession.nik})` : 'SSO Telkomsel'}
            </span>
            <span className="sm:hidden font-mono">SSO</span>
          </button>

          {/* Right Action Tools: Controls & Dropdowns */}
          <div className="flex items-center justify-center md:justify-end flex-wrap gap-1.5 sm:gap-2 shrink-0 order-3 md:order-none">
            {/* Reset Demo */}
            <button 
              type="button" 
              onClick={onResetDemo} 
              aria-label="Reset seluruh simulasi" 
              title="Kembalikan seluruh state demo ke awal" 
              className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200/90 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold cursor-pointer shrink-0"
            >
              <RotateCcw size={14} />
              <span className="hidden xl:inline">Reset demo</span>
            </button>

            {/* Theme Toggle */}
            <button 
              type="button" 
              onClick={onToggleTheme} 
              aria-label={`Aktifkan mode ${theme === 'light' ? 'gelap' : 'terang'}`} 
              title={`Aktifkan mode ${theme === 'light' ? 'gelap' : 'terang'}`} 
              className="theme-toggle inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200/90 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold cursor-pointer shrink-0"
            >
              {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
              <span className="hidden xl:inline">{theme === 'light' ? 'Gelap' : 'Terang'}</span>
            </button>

            {/* Simulation Scenario Console Toggle */}
            <button
              onClick={onToggleSimBar}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer shrink-0 ${
                isSimBarOpen
                  ? 'bg-slate-900 text-white border-slate-800 dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200/90 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700'
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
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-black shadow-xs transition cursor-pointer border shrink-0 ${
                isPitchWalkthroughActive 
                  ? 'bg-[#ED0226] text-white border-red-600 ring-2 ring-red-500/40' 
                  : 'bg-[#ED0226] hover:bg-red-700 text-white border-red-600 shadow-sm'
              }`}
              aria-label={isPitchWalkthroughActive ? 'Briefing aktif, tutup briefing' : 'Executive Briefing (7 Menit)'}
              title={isPitchWalkthroughActive ? 'Tutup briefing (W)' : 'Mulai Executive Briefing 7 menit (W)'}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">{isPitchWalkthroughActive ? 'Briefing Aktif' : 'Executive Briefing (7 Menit)'}</span>
            </button>

            {/* Scan QR for Mobile Button */}
            <button
              type="button"
              onClick={onOpenQrShare}
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200/90 dark:border-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition cursor-pointer shrink-0"
              title="Akses Konsol Pengawasan Mobile / Tablet Lapangan"
            >
              <QrCode className="w-3.5 h-3.5 text-[#ED0226]" />
              <span className="whitespace-nowrap">Akses Mobile</span>
            </button>

            {/* Consolidated Dropdown: Executive & Defense Toolkit */}
            <div className="relative shrink-0" ref={toolkitRef}>
              <button
                onClick={() => setIsToolkitOpen(prev => !prev)}
                aria-expanded={isToolkitOpen}
                aria-haspopup="menu"
                aria-label="Executive & Defense Toolkit"
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  isToolkitOpen
                    ? 'bg-amber-500 text-slate-950 border-amber-400 ring-2 ring-amber-500/30 shadow-md'
                    : emergencyState.active
                      ? 'bg-red-100 text-red-700 border-red-400 animate-pulse dark:bg-red-950/60 dark:text-red-300'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200/90 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700'
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
                <div 
                  role="menu"
                  aria-label="Menu Aksi Cepat & Navigasi Direksi"
                  className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-[#0B1324] border border-slate-200 dark:border-slate-800 shadow-xl z-50 p-2 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="p-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Executive Toolkit</p>
                    <p className="text-[11px] text-slate-500">Shortcut instrumen pengawasan direksi</p>
                  </div>

                  <div className="space-y-1">
                    {/* BoD Q&A Defense */}
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
                          <p className="text-xs font-bold text-slate-900 dark:text-white">Q&A Defense Direksi</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">10 Jawaban kritis pertanyaan direksi & CISO</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-slate-500 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">Q</span>
                    </button>

                    {/* AI Reasoning Copilot */}
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
                          <p className="text-xs font-bold text-slate-900 dark:text-white">AI Strategy Copilot</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">Asisten penalaran operasional & data</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-slate-500 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">A</span>
                    </button>

                    {/* Emergency Stress Drill */}
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
                          <p className="text-xs font-bold text-slate-900 dark:text-white">Drill Darurat & Fail-Safe</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">Uji skenario QoS dan lonjakan trafik</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-slate-500 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">S</span>
                    </button>

                    {/* Executive Memo A4 */}
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

                    {/* Official Berita Acara Rekonsiliasi (BA-RE) */}
                    <button
                      onClick={() => {
                        onOpenOfficialBaRe?.();
                        setIsToolkitOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer group"
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">Berita Acara Rekonsiliasi (BA-RE)</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">Kop resmi Telkomsel &amp; PLN UID Jabar + QR SHA-256</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-300 dark:border-emerald-700">BA-RE</span>
                    </button>

                    {/* QR Code Share for Mobile */}
                    <button
                      onClick={() => {
                        onOpenQrShare?.();
                        setIsToolkitOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer group"
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className="p-1.5 rounded-lg bg-rose-50 text-[#ED0226] dark:bg-rose-950/40 dark:text-red-400">
                          <QrCode className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">Akses Konsol Mobile / Tablet</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">Buka tautan supervisi di perangkat mobile</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-slate-500 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">QR</span>
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

        {/* Consolidated Telemetry & Status Ticker (Unified Single Strip) */}
        <div className="telemetry-ticker px-3 sm:px-5 py-1 text-xs font-mono flex flex-wrap md:flex-nowrap items-center justify-between border-t border-slate-200/60 dark:border-slate-800 bg-slate-50/70 dark:bg-[#060B14]/80 gap-2">
          {/* Status Metrics */}
          <div className="telemetry-ticker-metrics flex items-center flex-wrap gap-x-3.5 gap-y-1">
            <div className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>LIVE SSE STREAM (SENTUL DC &bull; 14ms)</span>
            </div>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline select-none" aria-hidden="true">•</span>
            <span className="text-slate-600 dark:text-slate-300">
              Beban RAN: <strong className="text-emerald-600 dark:text-emerald-400">184.2 kW (-14.8%)</strong>
            </span>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline select-none" aria-hidden="true">•</span>
            <span className="text-slate-600 dark:text-slate-300">
              Pilot Sites: <strong className="text-slate-900 dark:text-slate-100 font-bold">40 Aktif (36 Eco-Sleep)</strong>
            </span>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline select-none" aria-hidden="true">•</span>
            <span className="text-slate-600 dark:text-slate-300">
              SLA Drop Call: <strong className="text-emerald-600 dark:text-emerald-400">0.06% (&lt; 0.8%)</strong>
            </span>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline select-none" aria-hidden="true">•</span>
            <span className="text-slate-600 dark:text-slate-300">
              Rekonsiliasi: <strong className="text-cyan-600 dark:text-cyan-400">Class 0.5s Sinkron (Δ=0.8%)</strong>
            </span>
          </div>

          {/* Integrated Status Pill (Preserves required role="status" and text "DEMO LOKAL") */}
          <div 
            role="status"
            className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 font-sans font-semibold text-[10px] tracking-normal shrink-0"
          >
            <Activity className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>{statusText}</span>
          </div>

          <div className="hidden xl:flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400 shrink-0">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              O-RAN O1: 300ms Loop Siaga
            </span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1">
              <Lock className="w-3 h-3 text-indigo-500" />
              Audit Ledger SHA-256 Valid
            </span>
          </div>
        </div>

        {/* IAM Session Switch Notification Banner */}
        {iamNotification && (
          <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white text-xs font-bold px-4 py-1.5 flex items-center justify-between shadow-md animate-in slide-in-from-top duration-200">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-white shrink-0" />
              <span>Sesi IAM Telkomsel Dialihkan: <strong>{iamNotification.title}</strong> ({iamNotification.department}) • Hak Akses Terverifikasi OIDC Token ({iamNotification.time})</span>
            </div>
            <button onClick={() => setIamNotification(null)} className="text-white/80 hover:text-white text-xs px-2 cursor-pointer font-bold">
              ✕
            </button>
          </div>
        )}
      </header>

      {/* Provenance & Data Transparency Modal */}
      <DataProvenanceModal 
        isOpen={isProvenanceOpen} 
        onClose={() => setIsProvenanceOpen(false)} 
      />
    </>
  );
}
