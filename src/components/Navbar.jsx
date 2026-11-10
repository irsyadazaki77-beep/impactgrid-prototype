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
  FileText,
  Database,
  Smartphone,
  Search,
  Scale,
  Monitor,
  Award
} from 'lucide-react';
import DataProvenanceModal from './DataProvenanceModal';
import { ENTERPRISE_ROLES } from '../data/enterpriseRoles';
import { calculateHourTelemetry } from './GlobalSimulationBar';

export default function Navbar({ 
  onOpenReportModal,
  onOpenDirectorTour,
  onTogglePitchWalkthrough,
  isPitchWalkthroughActive,
  onOpenEmergencyModal,
  onOpenExecutiveMemo,
  onOpenBodDefense,
  onOpenAiCopilot,
  onOpenCommandPalette,
  onOpenProcurementBoq,
  onOpenJuryScorecard,
  onOpenDualScreenSync,
  onOpenQrShare,
  onOpenOfficialBaRe,
  onOpenFieldConsole,
  onOpenSapVoucher,
  onOpenTechInspector,
  onOpenShortcuts,
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
  securityStatus,
  onVerifyAuditChain,
  onSimulateSecurityAttack,
  onUnlockSecuritySession,
  theme = 'light',
  onToggleTheme,
  onResetDemo,
  connectivityStatus = 'reachable'
}) {
  const [isToolkitOpen, setIsToolkitOpen] = useState(false);
  const [isProvenanceOpen, setIsProvenanceOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isSecurityPopoverOpen, setIsSecurityPopoverOpen] = useState(false);
  const [securityFeedback, setSecurityFeedback] = useState(null);
  const [iamNotification, setIamNotification] = useState(null);
  const toolkitRef = useRef(null);
  const roleDropdownRef = useRef(null);
  const securityDropdownRef = useRef(null);

  const isSessionLocked = Boolean(securityStatus?.lockout?.isLocked);
  const strikeCount = Number(securityStatus?.lockout?.strikeCount || 0);
  const maxStrikes = Number(securityStatus?.lockout?.maxStrikes || 3);
  const intrusionBlockedCount = Number(securityStatus?.threatCounters?.intrusionBlockedCount || 0);
  const hmacVerifiedCount = Number(securityStatus?.threatCounters?.hmacVerifiedCount || 42);
  const totalInspectedCount = Number(securityStatus?.threatCounters?.totalInspectedRequests || 18);
  const chainEntriesCount = Number(securityStatus?.auditChainIntegrity?.entriesChecked || 1);
  const isChainVerified = securityStatus?.auditChainIntegrity?.verified !== false;

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

  const handleTriggerVerifyChain = async () => {
    if (!onVerifyAuditChain) return;
    const res = await onVerifyAuditChain(activeRoleObj.title);
    const entries = res?.chainIntegrity?.entriesChecked || chainEntriesCount;
    setSecurityFeedback(`Integritas Rantai Audit SHA-256 Terverifikasi (${entries} blok utuh).`);
    window.setTimeout(() => setSecurityFeedback(null), 4500);
  };

  const handleTriggerSecurityDrill = async (attackType) => {
    if (!onSimulateSecurityAttack) return;
    const res = await onSimulateSecurityAttack(attackType);
    if (res?.message) {
      setSecurityFeedback(res.message);
      window.setTimeout(() => setSecurityFeedback(null), 5000);
    }
  };

  const handleQuickMfaUnlock = async () => {
    if (!onUnlockSecuritySession) return;
    await onUnlockSecuritySession({
      otpCode: '881026',
      nik: ssoSession?.nik || '8810429',
      actor: ssoSession?.name || activeRoleObj.title
    });
    setSecurityFeedback('Kunci Sesi Otomatis (Auto-Lockout) berhasil dibuka melalui verifikasi MFA OTP 881026.');
    window.setTimeout(() => setSecurityFeedback(null), 4500);
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
      if (securityDropdownRef.current && !securityDropdownRef.current.contains(event.target)) {
        setIsSecurityPopoverOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.altKey && (event.key === 'i' || event.key === 'I')) {
        event.preventDefault();
        onOpenTechInspector?.();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onOpenTechInspector]);

  const statusText = connectivityStatus === 'reachable' 
    ? 'DEMO LOKAL • SENTUL DC AKTIF • Engine Telemetri O-RAN O1 Telkomsel Sinkron (Fail-Safe 28ms)' 
    : connectivityStatus === 'checking' 
      ? 'MEMERIKSA NODE • Menghubungkan engine telemetri Sentul DC' 
      : connectivityStatus === 'offline' 
        ? 'OFFLINE • Mode lokal aktif & simulasi telemetri berjalan penuh' 
        : 'HOST DEMO TIDAK TERJANGKAU • Mode fallback lokal edge tetap aktif';

  const tickerTelemetry = calculateHourTelemetry(
    typeof simState?.simHour === 'number' ? simState.simHour : 14,
    simState?.scenarioKey || 'normal'
  );
  const isDefaultHour = (simState?.simHour ?? 14) === 14 && (simState?.scenarioKey || 'normal') === 'normal';
  const tickerRanKw = emergencyState?.active
    ? '216.2 kW (0.0% Override 112)'
    : isDefaultHour
      ? '184.2 kW (-14.8%)'
      : `${tickerTelemetry.activeKw} kW (-${tickerTelemetry.savingPct}%)`;
  const tickerSleepSites = emergencyState?.active
    ? '40 Aktif (0 Eco-Sleep • Siaga 112)'
    : isDefaultHour
      ? '40 Aktif (36 Eco-Sleep)'
      : `40 Aktif (${tickerTelemetry.savingPct >= 20 ? 38 : tickerTelemetry.savingPct >= 12 ? 36 : 28} Eco-Sleep)`;

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-[#0B1324]/95 backdrop-blur-md shadow-xs transition-colors">
        {/* Telkomsel Signature Corporate Portal Top Ribbon */}
        <div className="h-[3px] w-full bg-gradient-to-r from-[#ED0226] via-[#FF3B5C] to-[#001A41]" />

        {/* Main Sleek Enterprise Navbar (Single 54px Row on Desktop, Clean Wrap on Mobile) */}
        <div className="min-h-13 xl:h-14 px-2.5 sm:px-3.5 py-1.5 xl:py-0 flex flex-wrap xl:flex-nowrap items-center justify-between w-full gap-1 sm:gap-1.5">
          
          {/* Left Brand & View Mode Switcher Group */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Logo Brand */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center justify-center p-1 rounded-xl bg-gradient-to-br from-red-500/15 to-rose-500/5 border border-red-500/25 shadow-2xs shrink-0">
                <img 
                  src="/assets/logo_utama_impactgrid.webp" 
                  alt="Logo ImpactGrid Telkomsel Enterprise" 
                  className="h-5 w-auto object-contain" 
                  decoding="async"
                />
              </div>
              <div className="flex flex-col leading-none">
                <div className="flex items-center gap-1">
                  <span className="text-xs sm:text-sm font-black tracking-tight text-slate-900 dark:text-white">
                    <span className="text-[#ED0226]">Impact</span>Grid
                  </span>
                  <span className="hidden 2xl:inline-block text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full bg-red-500/10 text-[#ED0226] border border-red-500/20">
                    SNOC v2.4
                  </span>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 hidden 2xl:block mt-0.5">
                  Telkomsel Smart Network DSS
                </span>
              </div>
            </div>

            {/* Subtle Divider */}
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

            {/* Mode Switcher: Executive Command vs NOC & Engineering */}
            <div className="flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-xs shrink-0 shadow-2xs">
              <button
                onClick={() => setViewMode && setViewMode('executive')}
                aria-label="Executive Command Center (Mode Eksekutif)"
                className={`flex items-center justify-center gap-1 px-2 py-1 rounded-lg font-bold text-[11px] transition cursor-pointer btn-bounce ${
                  viewMode === 'executive'
                    ? 'bg-[#ED0226] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Mode Eksekutif: Ringkasan KPI finansial, efisiensi energi regional, dan tata kelola dewan direksi"
              >
                <Presentation className="w-3.5 h-3.5 shrink-0" />
                <span className="whitespace-nowrap hidden 2xl:inline">Executive Command Center</span>
                <span className="whitespace-nowrap 2xl:hidden">Eksekutif</span>
              </button>
              <button
                onClick={() => setViewMode && setViewMode('engineering')}
                aria-label="NOC & Deep Engineering (Mode Teknis)"
                className={`flex items-center justify-center gap-1 px-2 py-1 rounded-lg font-bold text-[11px] transition cursor-pointer btn-bounce ${
                  viewMode === 'engineering'
                    ? 'bg-slate-900 dark:bg-slate-700 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Mode NOC & Engineering: Tab analisis teknis O-RAN, telemetri, dan digital twin"
              >
                <Wrench className="w-3.5 h-3.5 shrink-0" />
                <span className="whitespace-nowrap hidden 2xl:inline">NOC & Deep Engineering</span>
                <span className="whitespace-nowrap 2xl:hidden">Engineering</span>
              </button>
            </div>
          </div>

          {/* Right Action Tools: Controls, Briefing, Persona & Utilities */}
          <div className="flex flex-wrap items-center gap-1 shrink-0">
            {/* Global Command Palette Search Button (Ctrl+K) */}
            {onOpenCommandPalette && (
              <button
                type="button"
                onClick={onOpenCommandPalette}
                aria-label="Buka Command Palette (Ctrl+K)"
                title="Cari 50 Site BTS, 10 Q&A Direksi, BoQ, SAP, atau Aksi Cepat (Ctrl+K)"
                className="flex items-center gap-1 px-2 py-1 rounded-xl border border-slate-200/90 dark:border-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold transition cursor-pointer shrink-0"
              >
                <Search className="w-3.5 h-3.5 text-[#ED0226] shrink-0" />
                <span className="whitespace-nowrap hidden 2xl:inline">Cari Site</span>
                <span className="whitespace-nowrap hidden lg:inline 2xl:hidden">Cari</span>
                <kbd className="hidden 2xl:inline text-[9px] font-mono px-1 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500">
                  Ctrl+K
                </kbd>
              </button>
            )}

            {/* Telkomsel IT, RAN & SecOps Live Technical Inspector Button (Alt+I) */}
            {onOpenTechInspector && (
              <button
                type="button"
                onClick={onOpenTechInspector}
                aria-label="IT Inspector - Buka IT Technical Inspector (Alt+I)"
                title="Buka Live Technical Inspector: Bukti HTTP DevTools, OpenAPI 3.1, WebCrypto SHA-256 & CLI Vendor (Alt+I)"
                className="flex items-center gap-1 px-2 py-1 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-900 text-white text-[11px] font-bold transition cursor-pointer shrink-0"
              >
                <Cpu className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="whitespace-nowrap hidden 2xl:inline">IT Inspector</span>
                <span className="whitespace-nowrap hidden sm:inline 2xl:hidden">IT</span>
                <kbd className="hidden 2xl:inline text-[9px] font-mono px-1 py-0.5 rounded bg-slate-900 border border-slate-700 text-emerald-300">
                  Alt+I
                </kbd>
              </button>
            )}

            {/* Simulation Scenario Toggle */}
            <button
              onClick={onToggleSimBar}
              aria-label={
                simState.scenarioKey === 'normal' ? 'Demo lokal • Simulasi 24-Jam' :
                simState.scenarioKey === 'heatwave' ? 'Asumsi cuaca • Skenario Termal' :
                simState.scenarioKey === 'mudik' ? 'Asumsi trafik • Lonjakan Trafik' :
                simState.scenarioKey === 'pln_peak' ? 'Asumsi biaya energi • Tarif WBP PLN' :
                simState.scenarioKey === 'blackout_sumatera' ? 'Asumsi gangguan listrik • Transisi Baterai' : 'Asumsi keselamatan • Protokol 112'
              }
              className={`flex items-center gap-1 px-2 py-1 rounded-xl border text-[11px] font-bold transition cursor-pointer shrink-0 ${
                isSimBarOpen
                  ? 'bg-slate-900 text-white border-slate-800 dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200/90 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700'
              }`}
              title="Buka konsol simulasi skenario operasional 24-jam (Shortcut: 'E')"
            >
              <Sliders className="w-3.5 h-3.5 text-[#ED0226] shrink-0" />
              <span className="whitespace-nowrap font-bold hidden 2xl:inline">
                {simState.scenarioKey === 'normal' ? 'Simulasi 24-Jam' :
                 simState.scenarioKey === 'heatwave' ? 'Skenario Termal' :
                 simState.scenarioKey === 'mudik' ? 'Lonjakan Trafik' :
                 simState.scenarioKey === 'pln_peak' ? 'Tarif WBP PLN' :
                 simState.scenarioKey === 'blackout_sumatera' ? 'Transisi Baterai' : 'Protokol 112'}
              </span>
              <span className="whitespace-nowrap font-bold hidden md:inline 2xl:hidden">
                {simState.scenarioKey === 'normal' ? 'Simulasi' :
                 simState.scenarioKey === 'heatwave' ? 'Termal' :
                 simState.scenarioKey === 'mudik' ? 'Mudik' :
                 simState.scenarioKey === 'pln_peak' ? 'WBP PLN' :
                 simState.scenarioKey === 'blackout_sumatera' ? 'Baterai' : '112'}
              </span>
            </button>

            {/* Start Presentation 7 menit */}
            <button
              onClick={onTogglePitchWalkthrough}
              className={`flex items-center gap-1 px-2 py-1 rounded-xl text-[11px] font-black transition cursor-pointer border shrink-0 btn-bounce ${
                isPitchWalkthroughActive 
                  ? 'bg-gradient-to-r from-red-600 to-[#ED0226] text-white border-red-500 ring-2 ring-red-500/50 shadow-md' 
                  : 'bg-gradient-to-r from-red-600 via-[#ED0226] to-rose-600 hover:from-red-700 hover:to-red-600 text-white border-red-500/80 shadow-xs hover:shadow-md'
              }`}
              aria-label={isPitchWalkthroughActive ? 'Briefing aktif, tutup briefing' : 'Executive Briefing (7 Menit)'}
              title={isPitchWalkthroughActive ? 'Tutup briefing (W)' : 'Mulai Executive Briefing 7 menit (W)'}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap hidden 2xl:inline">Executive Briefing</span>
              <span className="whitespace-nowrap hidden sm:inline 2xl:hidden">Briefing</span>
            </button>

            {/* Consolidated Dropdown: Pusat Dokumen & Alat (Executive & Defense Toolkit) */}
            <div className="relative shrink-0" ref={toolkitRef}>
              <button
                onClick={() => setIsToolkitOpen(prev => !prev)}
                aria-expanded={isToolkitOpen}
                aria-haspopup="menu"
                aria-label="Pusat Dokumen & Alat (Executive & Defense Toolkit)"
                className={`flex items-center gap-1 px-2 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer border ${
                  isToolkitOpen
                    ? 'bg-slate-900 text-white border-slate-800 dark:bg-white dark:text-slate-900 shadow-md'
                    : emergencyState.active
                      ? 'bg-red-100 text-red-700 border-red-400 animate-pulse dark:bg-red-950/60 dark:text-red-300'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200/90 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700'
                }`}
                title="Buka Pusat Dokumen Resmi (BA-RE PLN, Jurnal SAP S/4HANA, BoQ/RKS) & Alat Operasional"
              >
                <Briefcase className={`w-3.5 h-3.5 shrink-0 ${isToolkitOpen ? 'text-amber-400 dark:text-[#ED0226]' : 'text-[#ED0226]'}`} />
                <span className="whitespace-nowrap hidden 2xl:inline">Pusat Dokumen &amp; Alat</span>
                <span className="whitespace-nowrap hidden lg:inline 2xl:hidden">Dokumen</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isToolkitOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Categorized Dropdown Menu */}
              {isToolkitOpen && (
                <div 
                  role="menu"
                  aria-label="Pusat Dokumen Resmi dan Alat Operasional"
                  className="absolute right-0 mt-2 w-84 sm:w-92 rounded-2xl bg-white dark:bg-[#0B1324] border border-slate-200 dark:border-slate-800 shadow-2xl z-50 p-2.5 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[84vh] overflow-y-auto space-y-2.5"
                >
                  {/* Group 1: Official Documents & Financial Proof */}
                  <div>
                    <div className="px-2 py-1 border-b border-slate-100 dark:border-slate-800 mb-1">
                      <p className="text-[10px] font-black text-[#ED0226] dark:text-red-400 uppercase tracking-wider">
                        1. Dokumen Resmi, Kontrak &amp; Akuntansi
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <button
                        onClick={() => { onOpenOfficialBaRe?.(); setIsToolkitOpen(false); }}
                        className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      >
                        <div className="flex items-center space-x-2.5">
                          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">Berita Acara Rekonsiliasi (BA-RE)</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">Dokumen resmi Telkomsel &amp; PLN UID + CSV</p>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-300 dark:border-emerald-700">BA-RE</span>
                      </button>

                      <button
                        onClick={() => { onOpenSapVoucher?.(); setIsToolkitOpen(false); }}
                        className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      >
                        <div className="flex items-center space-x-2.5">
                          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                            <Database className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">Jurnal Akuntansi SAP S/4HANA</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">Voucher kredit GL 510100 &amp; ekspor CSV</p>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono text-blue-700 bg-blue-50 dark:bg-blue-950/50 px-1.5 py-0.5 rounded border border-blue-300 dark:border-blue-700">SAP</span>
                      </button>

                      {onOpenProcurementBoq && (
                        <button
                          onClick={() => { onOpenProcurementBoq(); setIsToolkitOpen(false); }}
                          className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                        >
                          <div className="flex items-center space-x-2.5">
                            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                              <Scale className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900 dark:text-white">BoQ, RKS &amp; Diferensiasi Vendor</p>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400">RAB Fase 0/1, TKDN &amp; komparasi ENM/NCE</p>
                            </div>
                          </div>
                          <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-300 dark:border-emerald-700">RKS</span>
                        </button>
                      )}

                      <button
                        onClick={() => { onOpenExecutiveMemo(); setIsToolkitOpen(false); }}
                        className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      >
                        <div className="flex items-center space-x-2.5">
                          <div className="p-1.5 rounded-lg bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400">
                            <Printer className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">Executive Memo A4</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">Cetak lembar ringkasan investasi direksi</p>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono text-slate-500 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">P</span>
                      </button>

                      <button
                        onClick={() => { onOpenReportModal(); setIsToolkitOpen(false); }}
                        className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      >
                        <div className="flex items-center space-x-2.5">
                          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                            <FileDown className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">Lihat Lembar Kerja Asumsi</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">Sensitivitas finansial &amp; metodologi</p>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono text-slate-500 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">LEMBAR</span>
                      </button>
                    </div>
                  </div>

                  {/* Group 2: Operational Console & Executive Evaluation */}
                  <div>
                    <div className="px-2 py-1 border-b border-slate-100 dark:border-slate-800 mb-1">
                      <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        2. Alat Operasional &amp; Evaluasi Direksi
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <button
                        onClick={() => { onOpenFieldConsole?.(); setIsToolkitOpen(false); }}
                        className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      >
                        <div className="flex items-center space-x-2.5">
                          <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                            <Wrench className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">Konsol Teknisi FOP Lapangan</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">Eksekusi e-WO shelter &amp; kalibrasi AC</p>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono text-amber-800 bg-amber-50 dark:bg-amber-950/50 px-1.5 py-0.5 rounded border border-amber-300 dark:border-amber-700">FOP</span>
                      </button>

                      <button
                        onClick={() => { onOpenBodDefense(); setIsToolkitOpen(false); }}
                        className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      >
                        <div className="flex items-center space-x-2.5">
                          <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                            <HelpCircle className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">Q&amp;A Defense Direksi</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">Jawaban kritis pertanyaan direksi &amp; CISO</p>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono text-slate-500 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">Q</span>
                      </button>

                      <button
                        onClick={() => { onOpenAiCopilot(); setIsToolkitOpen(false); }}
                        className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      >
                        <div className="flex items-center space-x-2.5">
                          <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
                            <Bot className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">AI Strategy Copilot</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">Asisten penalaran operasional &amp; data</p>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono text-slate-500 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">A</span>
                      </button>

                      {onOpenJuryScorecard && (
                        <button
                          onClick={() => { onOpenJuryScorecard(); setIsToolkitOpen(false); }}
                          className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                        >
                          <div className="flex items-center space-x-2.5">
                            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                              <Award className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900 dark:text-white">Evaluasi Komite Investasi &amp; BYOD</p>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400">Skor kelayakan 5 pilar &amp; injeksi CSV</p>
                            </div>
                          </div>
                          <span className="text-[9px] font-mono text-amber-700 bg-amber-50 dark:bg-amber-950/50 px-1.5 py-0.5 rounded border border-amber-300 dark:border-amber-700">J</span>
                        </button>
                      )}

                      <button
                        onClick={() => { onOpenEmergencyModal(); setIsToolkitOpen(false); }}
                        className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      >
                        <div className="flex items-center space-x-2.5">
                          <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                            <ShieldAlert className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">Drill Darurat &amp; Fail-Safe 112</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">Uji skenario QoS dan lonjakan trafik</p>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono text-slate-500 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">S</span>
                      </button>
                    </div>
                  </div>

                  {/* Group 3: Corporate SSO, Mobile QR & Multi-Screen Sync */}
                  <div>
                    <div className="px-2 py-1 border-b border-slate-100 dark:border-slate-800 mb-1">
                      <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        3. Otorisasi IAM SSO &amp; Sinkronisasi Layar
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <button
                        onClick={() => { onOpenSsoModal?.(); setIsToolkitOpen(false); }}
                        className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      >
                        <div className="flex items-center space-x-2.5">
                          <div className="p-1.5 rounded-lg bg-red-50 text-[#ED0226] dark:bg-red-950/40 dark:text-red-400">
                            <Lock className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">Portal Login SSO Telkomsel</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">
                              {ssoSession?.name ? `Aktif: ${ssoSession.name} (${ssoSession.nik})` : 'Otentikasi OIDC / OAuth2 PKCE'}
                            </p>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono text-[#ED0226] bg-red-50 dark:bg-red-950/50 px-1.5 py-0.5 rounded border border-red-200 dark:border-red-800">SSO</span>
                      </button>

                      {onOpenDualScreenSync && (
                        <button
                          onClick={() => { onOpenDualScreenSync(); setIsToolkitOpen(false); }}
                          className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                        >
                          <div className="flex items-center space-x-2.5">
                            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                              <Monitor className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900 dark:text-white">Dual-Screen Presenter Sync</p>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400">Sinkronisasi layar pembicara &amp; proyektor</p>
                            </div>
                          </div>
                          <span className="text-[9px] font-mono text-indigo-700 bg-indigo-50 dark:bg-indigo-950/50 px-1.5 py-0.5 rounded border border-indigo-300 dark:border-indigo-700">SYNC</span>
                        </button>
                      )}

                      <button
                        onClick={() => { onOpenQrShare?.(); setIsToolkitOpen(false); }}
                        className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      >
                        <div className="flex items-center space-x-2.5">
                          <div className="p-1.5 rounded-lg bg-rose-50 text-[#ED0226] dark:bg-rose-950/40 dark:text-red-400">
                            <QrCode className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">Akses Konsol Mobile / Tablet</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">Tautan QR untuk pengawasan lapangan</p>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono text-slate-500 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">QR</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Subtle Divider */}
            <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 hidden md:block" />

            {/* Enterprise Persona / IAM Selector */}
            <div className="relative shrink-0" ref={roleDropdownRef}>
              <button
                type="button"
                onClick={() => setIsRoleDropdownOpen(prev => !prev)}
                aria-expanded={isRoleDropdownOpen}
                aria-haspopup="menu"
                className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-xl border border-slate-200/90 dark:border-slate-700 bg-slate-100/90 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold transition cursor-pointer"
                title="Ganti Persona / Hak Akses Pengguna Telkomsel (IAM SSO)"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="text-[11px] font-black text-slate-800 dark:text-slate-100 hidden md:inline truncate max-w-[95px] lg:max-w-none">
                  {activeRoleObj.shortTitle}
                </span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-150 ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isRoleDropdownOpen && (
                <div 
                  role="menu"
                  aria-label="Pilih Persona Telkomsel"
                  className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#0B1324] border border-slate-200 dark:border-slate-800 shadow-2xl z-50 p-2 animate-in fade-in slide-in-from-top-2 duration-150"
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

            {/* Compact Zero-Trust & Auto-Lockout Security Posture Indicator */}
            <div className="relative shrink-0" ref={securityDropdownRef}>
              <button
                type="button"
                onClick={() => setIsSecurityPopoverOpen((prev) => !prev)}
                aria-expanded={isSecurityPopoverOpen}
                aria-haspopup="dialog"
                aria-label="Status Pertahanan Siber Zero-Trust & Auto-Lockout"
                title="Lihat Postur Keamanan Zero-Trust API, IDS Real-Time, Rantai Audit SHA-256 & Status Auto-Lockout"
                className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-xl border text-[11px] font-bold transition cursor-pointer shrink-0 ${
                  isSessionLocked
                    ? 'bg-red-600 text-white border-red-500 shadow-xs'
                    : intrusionBlockedCount > 0
                      ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                      : 'bg-emerald-50/90 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
                }`}
              >
                {isSessionLocked ? (
                  <Lock className="w-3.5 h-3.5 text-white shrink-0" />
                ) : intrusionBlockedCount > 0 ? (
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                )}
                <span className="whitespace-nowrap hidden lg:inline font-mono tabular-nums">
                  {isSessionLocked
                    ? 'Sesi Terkunci'
                    : intrusionBlockedCount > 0
                      ? `IDS (${intrusionBlockedCount})`
                      : 'Zero-Trust'}
                </span>
              </button>

              {isSecurityPopoverOpen && (
                <div
                  role="dialog"
                  aria-label="Postur Pertahanan Siber Zero-Trust ImpactGrid"
                  className="absolute right-0 mt-2 w-84 sm:w-96 rounded-2xl bg-white dark:bg-[#0B1324] border border-slate-200 dark:border-slate-800 shadow-2xl z-50 p-3.5 text-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                        <span>POSTUR PERTAHANAN BACKEND</span>
                        <span>·</span>
                        <span>FIPS 180-4</span>
                      </div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                        {isSessionLocked
                          ? 'Sesi Dikunci Otomatis (Auto-Lockout)'
                          : intrusionBlockedCount > 0
                            ? 'Zero-Trust Aktif · Intrusi Dikarantina'
                            : 'Zero-Trust API & IDS Aktif'}
                      </h3>
                    </div>
                    <span
                      className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border tabular-nums ${
                        isSessionLocked
                          ? 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-300 dark:border-red-800'
                          : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                      }`}
                    >
                      {isSessionLocked ? 'HTTP 423 LOCKED' : 'PROTECTED'}
                    </span>
                  </div>

                  {securityFeedback && (
                    <div className="p-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-emerald-300 font-mono text-[11px] leading-relaxed border border-slate-700">
                      {securityFeedback}
                    </div>
                  )}

                  {/* 4-Metric Tabular Telemetry Strip */}
                  <div className="grid grid-cols-2 gap-2 font-mono tabular-nums">
                    <div className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60">
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">HMAC / SHA-256 Valid</div>
                      <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                        {hmacVerifiedCount} paket
                      </div>
                    </div>
                    <div className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60">
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">IDS Karantina</div>
                      <div className="text-sm font-black text-amber-600 dark:text-amber-400 mt-0.5">
                        {intrusionBlockedCount} serangan
                      </div>
                    </div>
                    <div className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60">
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Rantai Audit Ledger</div>
                      <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                        {chainEntriesCount} blok utuh
                      </div>
                    </div>
                    <div className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60">
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Ambang Auto-Lockout</div>
                      <div className={`text-sm font-black mt-0.5 ${isSessionLocked ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                        {strikeCount} / {maxStrikes} strike
                      </div>
                    </div>
                  </div>

                  {/* Active Layers List */}
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
                      <span className="font-semibold text-slate-700 dark:text-slate-200">1. Zero-Trust API, JWT/HMAC &amp; Nonce</span>
                      <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">AKTIF</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
                      <span className="font-semibold text-slate-700 dark:text-slate-200">2. Deteksi Intrusi (IDS) &amp; Karantina</span>
                      <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">AKTIF</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
                      <span className="font-semibold text-slate-700 dark:text-slate-200">3. Rantai Audit SHA-256 Anti-Tamper</span>
                      <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                        {isChainVerified ? 'TERVERIFIKASI' : 'PERINGATAN'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="font-semibold text-slate-700 dark:text-slate-200">4. Rate-Limit Bertingkat &amp; Sanitasi ({totalInspectedCount})</span>
                      <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">AKTIF</span>
                    </div>
                  </div>

                  {/* Self-Test & Audit Verification Controls */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                      Uji Pertahanan Siber &amp; Verifikasi Kriptografi:
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={handleTriggerVerifyChain}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-[11px] transition cursor-pointer whitespace-nowrap truncate"
                      >
                        Verifikasi Rantai SHA-256
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTriggerSecurityDrill('IDS_INJECTION')}
                        className="px-2.5 py-1.5 rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-bold text-[11px] transition cursor-pointer whitespace-nowrap truncate"
                      >
                        Simulasi Injeksi IDS
                      </button>
                    </div>

                    {isSessionLocked ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={handleQuickMfaUnlock}
                          className="flex-1 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition cursor-pointer whitespace-nowrap"
                        >
                          Buka Kunci Sesi (MFA 881026)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsSecurityPopoverOpen(false);
                            onOpenSsoModal?.();
                          }}
                          className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold text-[11px] transition cursor-pointer whitespace-nowrap"
                        >
                          Portal SSO
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleTriggerSecurityDrill('AUTO_LOCKOUT_TRIGGER')}
                        className="w-full px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-900/70 bg-red-50/80 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 font-bold text-[11px] transition cursor-pointer whitespace-nowrap"
                      >
                        Simulasi Brute-Force &amp; Auto-Lockout (3x Strike)
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Utility Icon Group */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Keyboard Shortcuts Help (?) */}
              {onOpenShortcuts && (
                <button
                  type="button"
                  onClick={onOpenShortcuts}
                  aria-label="Panduan pintasan keyboard (Shift+?)"
                  title="Buka panduan pintasan keyboard operasional (Shift+?)"
                  className="hidden sm:inline-flex w-7 h-7 sm:w-8 sm:h-8 items-center justify-center rounded-xl border border-slate-200/90 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-mono font-bold cursor-pointer shrink-0 transition"
                >
                  ?
                </button>
              )}

              {/* Reset Baseline */}
              <button 
                type="button" 
                onClick={onResetDemo} 
                aria-label="Reset seluruh parameter ke baseline" 
                title="Kembalikan seluruh parameter simulasi ke baseline standar" 
                className="w-7 h-7 sm:w-8 sm:h-8 inline-flex items-center justify-center rounded-xl border border-slate-200/90 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold cursor-pointer shrink-0 transition"
              >
                <RotateCcw size={13} />
                <span className="sr-only">Reset baseline</span>
              </button>

              {/* Theme Toggle */}
              <button 
                type="button" 
                onClick={onToggleTheme} 
                aria-label={`Aktifkan mode ${theme === 'light' ? 'gelap' : 'terang'}`} 
                title={`Aktifkan mode ${theme === 'light' ? 'gelap' : 'terang'}`} 
                className="theme-toggle w-7 h-7 sm:w-8 sm:h-8 inline-flex items-center justify-center rounded-xl border border-slate-200/90 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold cursor-pointer shrink-0 transition"
              >
                {theme === 'light' ? <Moon size={13} /> : <Sun size={13} />}
                <span className="sr-only">{theme === 'light' ? 'Gelap' : 'Terang'}</span>
              </button>
            </div>

          </div>

        </div>

        {/* Consolidated Telemetry & Status Ticker (Unified Single Micro-Strip) */}
        <div className="telemetry-ticker px-3 sm:px-4 py-1 text-[11px] font-mono flex items-center justify-between border-t border-slate-200/60 dark:border-slate-800 bg-slate-50/90 dark:bg-[#060B14]/95 gap-2 overflow-x-auto no-scrollbar whitespace-nowrap">
          {/* Status Metrics */}
          <div className="telemetry-ticker-metrics flex items-center gap-x-3 shrink-0">
            <div className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>LIVE SSE STREAM (SENTUL DC &bull; 14ms)</span>
            </div>
            <span className="text-slate-300 dark:text-slate-700 select-none" aria-hidden="true">•</span>
            <span className="text-slate-600 dark:text-slate-300 shrink-0">
              Beban RAN ({simState?.simTimeString || '14:00 WIB'}): <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{tickerRanKw}</strong>
            </span>
            <span className="text-slate-300 dark:text-slate-700 select-none" aria-hidden="true">•</span>
            <span className="text-slate-600 dark:text-slate-300 shrink-0">
              Pilot Sites: <strong className="text-slate-900 dark:text-slate-100 font-bold">{tickerSleepSites}</strong>
            </span>
            <span className="text-slate-300 dark:text-slate-700 select-none" aria-hidden="true">•</span>
            <span className="text-slate-600 dark:text-slate-300 shrink-0">
              SLA Drop Call: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">0.06% (&lt; 0.8%)</strong>
            </span>
            <span className="text-slate-300 dark:text-slate-700 select-none" aria-hidden="true">•</span>
            <span className="text-slate-600 dark:text-slate-300 shrink-0">
              Rekonsiliasi: <strong className="text-cyan-600 dark:text-cyan-400 font-bold">Class 0.5s Sinkron (Δ=0.8%)</strong>
            </span>
          </div>

          {/* Right Status Pill & Security Audit Signatures */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div 
              role="status"
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 font-sans font-semibold text-[10px] tracking-normal shrink-0"
            >
              <Activity className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{statusText}</span>
            </div>

            <div className="hidden xl:flex items-center space-x-2.5 text-[10px] text-slate-500 dark:text-slate-400 shrink-0 tabular-nums">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                O-RAN O1: 300ms Siaga
              </span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1">
                <Lock className="w-3 h-3 text-indigo-500" />
                Ledger SHA-256 Valid ({hmacVerifiedCount} HMAC)
              </span>
            </div>
          </div>
        </div>

        {/* Auto-Lockout Security Alert Banner when Session is Locked Out */}
        {isSessionLocked && (
          <div
            role="alert"
            className="bg-red-700 text-white text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-2 border-t border-red-500"
          >
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-white shrink-0" />
              <span>
                <strong>Sesi Dikunci Otomatis (Auto-Lockout HTTP 423):</strong>{' '}
                {securityStatus?.lockout?.lockReason || 'Terdeteksi aktivitas mencurigakan / pelanggaran integritas berulang.'}{' '}
                Eksekusi perintah kritis ditangguhkan hingga verifikasi MFA dilakukan.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleQuickMfaUnlock}
                className="px-3 py-1 rounded-lg bg-white text-red-700 hover:bg-red-50 font-bold text-xs cursor-pointer transition whitespace-nowrap"
              >
                Buka Kunci via MFA OTP
              </button>
              <button
                type="button"
                onClick={() => onOpenSsoModal?.()}
                className="px-3 py-1 rounded-lg border border-white/40 hover:bg-white/10 text-white font-bold text-xs cursor-pointer transition whitespace-nowrap"
              >
                Portal Login SSO
              </button>
            </div>
          </div>
        )}

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
