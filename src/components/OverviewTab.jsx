import React, { lazy, Suspense, useEffect, useState, useMemo, useRef } from 'react';
import { 
  Zap, 
  Leaf, 
  TrendingUp, 
  ShieldCheck, 
  ArrowUpRight, 
  Sliders, 
  DollarSign,
  Radio,
  MapPin,
  ChevronDown,
  ChevronUp,
  Server,
  Flame,
  ShieldAlert,
  CheckCircle2,
  FileCheck,
  FileText,
  AlertTriangle,
  Award,
  ArrowRight,
  Sparkles,
  Layers,
  HelpCircle,
  Activity,
  Bell,
  Check,
  Clock,
  Cpu,
  Wifi,
  ExternalLink,
  RefreshCw,
  Upload,
  Wrench,
  Compass
} from 'lucide-react';
import NocOperationsRunbookCenter from './NocOperationsRunbookCenter';
import TelkomselOperationsGuide from './TelkomselOperationsGuide';
import { 
  DECISION_GATE_CRITERIA
} from '../data/mockData';
import BoDCertificateModal from './BoDCertificateModal';
import BeforeVsAfterComparison from './BeforeVsAfterComparison';
import ExecutiveDecisionTimeline from './ExecutiveDecisionTimeline';
import SocialDividendCard from './SocialDividendCard';
import ImpactGridAcademyCard from './ImpactGridAcademyCard';
import ExecutiveOnePagerModal from './ExecutiveOnePagerModal';
import TelkomselProductionCutoverConsole from './TelkomselProductionCutoverConsole';
import ExecutiveDealClosingSuitePanel from './ExecutiveDealClosingSuitePanel';
import { calculateHourTelemetry } from './GlobalSimulationBar';

const IndonesiaGisMap = lazy(() => import('./IndonesiaGisMap'));

const INITIAL_INCIDENTS = [
  {
    id: 'ALM-2026-084',
    siteId: 'BDG-DGO-P04',
    siteName: 'Dago Bandung Macro',
    type: 'Peringatan Suhu Shelter',
    severity: 'warning',
    time: '2 menit yang lalu',
    description: 'Suhu ambient shelter mencapai 34.2°C (ambang batas: 32.0°C). Beban pendingin meningkat.',
    automatedAction: 'Smart HVAC boost aktif, setpoint dinamis 26°C diterapkan, disipasi panas terkendali.',
    status: 'Auto-Mitigated',
    acknowledged: false
  },
  {
    id: 'ALM-2026-083',
    siteId: 'JKT-SEL-P01',
    siteName: 'Senopati Jakarta Macro',
    type: 'Emergency 112 Priority Triggered',
    severity: 'critical',
    time: '14 menit yang lalu',
    description: 'Panggilan darurat 112 terdeteksi di sektor 2. Algoritma fail-safe zero-wait diaktifkan.',
    automatedAction: 'Carrier sleep dibatalkan seketika dalam 28ms. Alokasi 100% PRB untuk jalur darurat.',
    status: 'Resolved',
    acknowledged: true
  },
  {
    id: 'ALM-2026-081',
    siteId: 'SBY-GUB-P02',
    siteName: 'Gubeng Surabaya Macro',
    type: 'O-RAN rApp Micro-Sleep',
    severity: 'info',
    time: '32 menit yang lalu',
    description: 'Utilisasi PRB rendah (< 7%) selama 15 menit berturut-turut pada periode off-peak.',
    automatedAction: '3 Sub-carrier dialihkan ke Deep Micro-Sleep. Pengurangan konsumsi daya 420W/jam.',
    status: 'Optimizing',
    acknowledged: true
  },
  {
    id: 'ALM-2026-079',
    siteId: 'MED-POL-P05',
    siteName: 'Polonia Medan Hub',
    type: 'PLN Voltage Fluctuation',
    severity: 'info',
    time: '1 jam yang lalu',
    description: 'Tegangan masukan fasa PLN drop 7% sesaat. Rectifier DC LiFePO4 mengkompensasi beban puncak.',
    automatedAction: 'BESS discharge otomatis 4.2 kWh tanpa memicu genset diesel cadangan.',
    status: 'Normal',
    acknowledged: true
  }
];

export default function OverviewTab({ 
  setActiveTab, 
  selectedScale = 'pilot', 
  setSelectedScale,
  activeLens = 'all', 
  setActiveLens,
  emergencyState = { active: false },
  onOpenEmergencyModal,
  simState = { simHour: 14, tempC: 28, trafficMultiplier: 1.0, carrierSleepActive: true, simTimeString: '14:00 WIB' },
  viewMode = 'executive',
  setViewMode,
  isPitchWalkthroughActive = false,
  onOpenExecutiveMemo,
  onOpenFieldConsole,
  resolvedSites = [],
  customByodSites = [],
  onResolveSiteAnomaly,
  onOpenModal
}) {
  const [showGisMap, setShowGisMap] = useState(false);
  const [isBrowserOnline, setIsBrowserOnline] = useState(() => typeof navigator === 'undefined' ? true : navigator.onLine);
  const [isBodSigned, setIsBodSigned] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [isOnePagerOpen, setIsOnePagerOpen] = useState(false);
  const [incidentFilter, setIncidentFilter] = useState('all'); // 'all', 'critical', 'warning', 'info'
  const [incidents, setIncidents] = useState(INITIAL_INCIDENTS);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState('noc_triage'); // 'noc_triage' | 'committee_pack' | 'cutover_roadmap' | 'sop_governance'
  const [isOpsToolsOpen, setIsOpsToolsOpen] = useState(false);
  const opsToolsMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (opsToolsMenuRef.current && !opsToolsMenuRef.current.contains(event.target)) {
        setIsOpsToolsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const updateOnlineStatus = () => setIsBrowserOnline(navigator.onLine);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const handleAcknowledge = (id) => {
    setIncidents(prev => prev.map(item => item.id === id ? { ...item, acknowledged: true } : item));
  };

  const isBdgResolved = resolvedSites.includes('BDG-DGO-P04');

  const filteredIncidents = useMemo(() => {
    const enriched = incidents.map((item) => {
      if (item.siteId === 'BDG-DGO-P04' && isBdgResolved) {
        return {
          ...item,
          severity: 'info',
          type: 'FOP Closed-Loop & BA-RE Tersinkron',
          description: 'Filter AC shelter dibersihkan & tekanan R-410A dikalibrasi oleh teknisi FOP. Deviasi PLN vs Sub-meter turun dari 21,5% ke 0,8%.',
          automatedAction: 'Dokumen BA-RE resmi & Jurnal SAP S/4HANA Credit Note Rp 3.824.640 otomatis terbit.',
          status: 'Closed-Loop Verified',
          acknowledged: true
        };
      }
      return item;
    });
    if (incidentFilter === 'all') return enriched;
    return enriched.filter(i => i.severity === incidentFilter);
  }, [incidents, incidentFilter, isBdgResolved]);

  // Data dinamis sesuai skala implementasi
  const scaleData = {
    pilot: {
      scopeTitle: "Fase 1 Pilot Jaringan • 40 Intervensi + 10 Pembanding",
      sitesText: "40 + 10 Sites",
      savingKwYear: "~200 MWh/th",
      grossSaving: "Rp 300 Jt/th",
      netBenefit: "+Rp 240 Jt/th",
      npvText: "+Rp 460 Juta",
      npvSub: "Skenario Dasar Pilot (WACC 10%, Payback 1,9 thn)",
      pbpText: "1,9 Tahun",
      emissionsText: "~174 tCO₂e/th",
      capexText: "Alokasi CapEx IoT Rp 450 Jt (OpEx Rp 60 Jt/th)"
    },
    regional: {
      scopeTitle: "Fase 2 Skala Regional (2028–2029) • 5.000 Menara Makro Jamali",
      sitesText: "5.000 Menara Makro",
      savingKwYear: "~5,80 GWh/th",
      grossSaving: "Rp 6,60 Miliar/th",
      netBenefit: "+Rp 4,80 Miliar/th",
      npvText: "+Rp 11,70 Miliar",
      npvSub: "Model swadana efisiensi operasional menara makro",
      pbpText: "1,35 Tahun",
      emissionsText: "~5.046 tCO₂e/th",
      capexText: "Investasi CapEx Rp 6,50 Miliar (OpEx Rp 1,8 M/th)"
    },
    national: {
      scopeTitle: "Fase 3 Skala Nasional (2030–2031) • 10.000+ Menara Telkomsel",
      sitesText: "10.000+ Menara Nasional",
      savingKwYear: "~14,60 GWh/th",
      grossSaving: "Rp 21,90 Miliar/th",
      netBenefit: "+Rp 14,90 Miliar/th",
      npvText: "+Rp 41,48 Miliar",
      npvSub: "Skala enterprise Net-Zero transition Telkomsel",
      pbpText: "1,00 Tahun",
      emissionsText: "~12.702 tCO₂e/th",
      capexText: "Investasi CapEx Rp 15,00 Miliar (OpEx Rp 7 M/th)"
    }
  }[selectedScale] || {
    scopeTitle: "Fase 1 Pilot Jaringan • 40 Intervensi + 10 Pembanding",
    sitesText: "40 + 10 Sites",
    savingKwYear: "~200 MWh/th",
    grossSaving: "Rp 300 Jt/th",
    netBenefit: "+Rp 240 Jt/th",
    npvText: "+Rp 460 Juta",
    npvSub: "Skenario Dasar Pilot (WACC 10%, Payback 1,9 thn)",
    pbpText: "1,9 Tahun",
    emissionsText: "~174 tCO₂e/th",
    capexText: "Alokasi CapEx IoT Rp 450 Jt (OpEx Rp 60 Jt/th)"
  };

  // Live telemetry calculation coupled to GlobalSimulationBar & Emergency Override
  const liveTelemetry = useMemo(() => {
    const hour = typeof simState?.simHour === 'number' ? simState.simHour : 14;
    const scenarioKey = simState?.scenarioKey || 'normal';
    const base = calculateHourTelemetry(hour, scenarioKey);
    const scaleMultiplier = selectedScale === 'national' ? 250 : selectedScale === 'regional' ? 125 : 1;
    const totalSites = 40 * scaleMultiplier;

    if (emergencyState?.active) {
      const fullLoadKw = (216.2 * scaleMultiplier * (base.trafficMultiplier || 1)).toFixed(1);
      return {
        activeLoadKw: `${Number(fullLoadKw).toLocaleString('id-ID')} kW`,
        baselineLoadKw: `${(216.2 * scaleMultiplier).toLocaleString('id-ID')} kW`,
        deltaPct: '0.0% (Override 112)',
        dailySavedKwh: `${(612.0 * scaleMultiplier).toLocaleString('id-ID')} kWh`,
        dailySavedIdr: `~Rp ${(918000 * scaleMultiplier).toLocaleString('id-ID')} / hari`,
        co2AvoidedKg: `${(532.4 * scaleMultiplier).toLocaleString('id-ID')} kg CO₂e`,
        sleepSitesText: `0 / ${totalSites.toLocaleString('id-ID')} Site`,
        standbyDesc: 'Semua Radio 100% Daya Penuh (Darurat 112)',
        slaPct: '100.00%',
        cdrText: 'Call Drop Rate: 0.01% (Prioritas 112)',
        simTimeLabel: simState?.simTimeString || `${hour.toString().padStart(2, '0')}:00 WIB`
      };
    }

    // Standard or scrubbed hour telemetry (using guaranteed numeric activeKw & baselineKw)
    const isDefaultHour = hour === 14 && scenarioKey === 'normal';
    const baseActive = Number.isFinite(base.activeKw) ? base.activeKw : 194.0;
    const baseBaseline = Number.isFinite(base.baselineKw) ? base.baselineKw : 216.0;
    const rawActiveKw = isDefaultHour ? 184.2 : Number(baseActive.toFixed(1));
    const rawBaselineKw = isDefaultHour ? 216.2 : Number(baseBaseline.toFixed(1));
    const savingPctVal = isDefaultHour ? 14.8 : (Number.isFinite(base.savingPct) ? base.savingPct : 10.2);
    const rawSavedKwh = isDefaultHour ? 776.4 : Number((520 + savingPctVal * 17.3).toFixed(1));
    const rawSavedIdr = Math.round(rawSavedKwh * (base.tariffPerKwh || 1500) * scaleMultiplier);
    const rawCo2Kg = Number((rawSavedKwh * 0.78 * scaleMultiplier).toFixed(1));

    const sleepRatio = base.carrierSleepActive ? 0.9 : savingPctVal >= 14 ? 0.75 : 0.45;
    const activeSleepSites = isDefaultHour
      ? 36 * scaleMultiplier
      : Math.round(totalSites * sleepRatio);
    const standbySites = totalSites - activeSleepSites;

    return {
      activeLoadKw: `${(rawActiveKw * scaleMultiplier).toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kW`,
      baselineLoadKw: `${(rawBaselineKw * scaleMultiplier).toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kW`,
      deltaPct: `-${savingPctVal.toFixed(1)}%`,
      dailySavedKwh: `${(rawSavedKwh * scaleMultiplier).toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kWh`,
      dailySavedIdr: `~Rp ${rawSavedIdr.toLocaleString('id-ID')} / hari (${totalSites.toLocaleString('id-ID')} Site)`,
      co2AvoidedKg: `${rawCo2Kg.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kg CO₂e`,
      sleepSitesText: `${activeSleepSites.toLocaleString('id-ID')} / ${totalSites.toLocaleString('id-ID')} Site`,
      standbyDesc: `${standbySites.toLocaleString('id-ID')} Site Standby Lalu Lintas Padat`,
      slaPct: base.carrierSleepActive ? '99.996%' : '99.994%',
      cdrText: `Call Drop Rate: ${base.cdrPct || '0.06'}% (Batas: < 0.8%)`,
      simTimeLabel: simState?.simTimeString || `${hour.toString().padStart(2, '0')}:00 WIB`
    };
  }, [simState, selectedScale, emergencyState?.active]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Emergency Active Alert Banner (If CTO Stress-Test Triggered) */}
      {emergencyState.active && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow-md flex items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center space-x-3">
            <Flame className="w-5 h-5 text-amber-200 animate-pulse" />
            <div>
              <span className="font-extrabold text-xs block">FAIL-SAFE EMERGENCY OVERRIDE AKTIF</span>
              <p className="text-[11px] text-red-100">
                Simulasi kondisi darurat aktif: Seluruh sleep-mode radio dinonaktifkan instan untuk menjamin 100% kapasitas kanal panggilan darurat 112 dan keselamatan publik.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenEmergencyModal}
            className="px-3 py-1.5 rounded-xl bg-white text-red-700 font-bold text-xs hover:bg-red-50 transition cursor-pointer shrink-0 whitespace-nowrap"
          >
            Lihat mitigasi
          </button>
        </div>
      )}

      {/* 1. NOC Operations Executive Header */}
      <div id="pitch-step-1-overview" className="tsel-hero-portal bg-white dark:bg-[#0B1324] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs space-y-4 scroll-mt-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-[#ED0226] border border-red-200/80 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/50 text-xs font-bold">
                {scaleData.scopeTitle}
              </span>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/50 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>NOC TELEMETRI AKTIF • KELAS 0.5S</span>
              </div>
            </div>
            <span className="text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400">
              Baseline Korporat 2025: 1.885,4 GWh (63,6% Emisi Scope 2)
            </span>
          </div>
          
          {/* Main Title Preserving e2e text "Rancangan DSS Efisiensi" */}
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            ImpactGrid: Rancangan DSS Efisiensi Jaringan &amp; ESG Telkomsel
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-4xl">
            Pusat Kendali Operasi Energi RAN &amp; Decision Support System Multi-Skenario Telkomsel. Mengorkestrasi penghematan daya radio O-RAN O1, optimalisasi termal shelter BTS, rekonsiliasi tagihan PLN BA-RE, dan perlindungan SLA secara real-time.
          </p>
        </div>

        {/* Interactive Telkomsel Rollout Scale & Executive Lens Switcher Bar */}
        <div className="p-2.5 rounded-xl bg-slate-50/95 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
          {/* Scale Selector */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
              Skala Rollout:
            </span>
            <div className="inline-flex flex-wrap items-center p-0.5 rounded-xl bg-slate-200/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 gap-0.5">
              {[
                { id: 'pilot', label: 'Fase 1: Pilot (40+10 Site)', badge: 'Rp 460 Jt' },
                { id: 'regional', label: 'Fase 2: Jamali (5.000 Site)', badge: 'Rp 11,7 M' },
                { id: 'national', label: 'Fase 3: Nasional (10.000+)', badge: 'Rp 41,5 M' }
              ].map((sc) => {
                const isSelected = selectedScale === sc.id;
                return (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => setSelectedScale && setSelectedScale(sc.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                      isSelected
                        ? 'bg-[#ED0226] text-white shadow-2xs'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-700/70'
                    }`}
                  >
                    <span>{sc.label}</span>
                    <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-black/20 text-white' : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400'
                    }`}>
                      {sc.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Executive Lens Selector */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
              Lensa Direksi:
            </span>
            <div className="inline-flex flex-wrap items-center p-0.5 rounded-xl bg-slate-200/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 gap-0.5">
              {[
                { id: 'all', label: 'Semua Pilar' },
                { id: 'finance', label: 'CFO • Finansial' },
                { id: 'esg', label: 'ESG • Karbon' },
                { id: 'network', label: 'CTO • Jaringan' }
              ].map((lens) => {
                const isSelected = activeLens === lens.id;
                return (
                  <button
                    key={lens.id}
                    type="button"
                    onClick={() => setActiveLens && setActiveLens(lens.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-2xs'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-700/70'
                    }`}
                  >
                    {lens.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          {/* Primary Action Buttons (High-Impact Decision Block) */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {/* 1. Hero CTA: One-Pager Direksi */}
            <button 
              onClick={() => setIsOnePagerOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 via-[#ED0226] to-rose-600 hover:from-red-700 hover:to-red-600 text-white text-xs font-black transition cursor-pointer flex items-center space-x-1.5 shadow-sm hover:shadow-md btn-bounce ring-2 ring-red-500/20 whitespace-nowrap"
              title="Buka Lembar Keputusan Resmi Dewan Direksi (Executive 1-Pager)"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>One-Pager Direksi</span>
            </button>

            {/* 2. Key Scenario Simulation */}
            <button 
              onClick={() => setActiveTab('scenariolab')}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 shadow-2xs whitespace-nowrap"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Simulasi What-If</span>
            </button>

            {/* 3. CapEx Allocation */}
            <button 
              onClick={() => setActiveTab('optimization')}
              className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 shadow-2xs whitespace-nowrap"
            >
              <span>Alokasi CapEx</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {/* 4. Executive Dossier A4 */}
            {onOpenExecutiveMemo && (
              <button 
                onClick={onOpenExecutiveMemo}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition cursor-pointer flex items-center space-x-1.5 whitespace-nowrap"
                title="Buka Executive Investment Dossier 1-Halaman (Siap Cetak / PDF)"
              >
                <FileText className="w-3.5 h-3.5 text-[#ED0226]" />
                <span>Executive Dossier A4</span>
              </button>
            )}

            {/* 5. Drill Darurat */}
            <button 
              onClick={onOpenEmergencyModal}
              className="px-3.5 py-2 rounded-xl border border-rose-200/80 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 hover:bg-rose-100/60 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 text-xs font-semibold transition cursor-pointer flex items-center space-x-1.5 whitespace-nowrap"
              title="Uji skenario darurat fail-safe 112"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>Drill Darurat</span>
            </button>
          </div>

          {/* Consolidated Secondary Tools & Enterprise Integrations Menu */}
          <div className="relative shrink-0" ref={opsToolsMenuRef}>
            <button
              type="button"
              onClick={() => setIsOpsToolsOpen(prev => !prev)}
              aria-expanded={isOpsToolsOpen}
              aria-haspopup="menu"
              className="px-3 py-2 rounded-xl border border-slate-200/90 dark:border-slate-700 bg-slate-100/80 hover:bg-slate-200/80 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-200 text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 whitespace-nowrap"
            >
              <Wrench className="w-3.5 h-3.5 text-[#ED0226]" />
              <span>Alat &amp; Integrasi Operasional</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${isOpsToolsOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpsToolsOpen && (
              <div 
                role="menu"
                aria-label="Alat dan Integrasi Operasional"
                className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-[#0B1324] border border-slate-200 dark:border-slate-800 shadow-2xl z-40 p-2 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="p-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                  <p className="text-[11px] font-black uppercase tracking-wider text-slate-900 dark:text-white">Alat &amp; Integrasi Sistem</p>
                  <p className="text-[10px] text-slate-500">Akses cepat modul telemetri, TM Forum, &amp; operasional</p>
                </div>

                <div className="space-y-1">
                  <button 
                    role="menuitem"
                    onClick={() => { setActiveTab('telemetry'); setIsOpsToolsOpen(false); }}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="p-1.5 rounded-lg bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400">
                        <Upload className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">Ingestion CSV &amp; CRUD Site BTS</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Pipeline telemetri sensor RAN</p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition" />
                  </button>

                  <button 
                    role="menuitem"
                    onClick={() => { setActiveTab('architecture'); setIsOpsToolsOpen(false); }}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">Kesiapan IT &amp; TM Forum</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Open API &amp; arsitektur Kubernetes</p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition" />
                  </button>

                  <button 
                    role="menuitem"
                    onClick={() => {
                      setIsOpsToolsOpen(false);
                      setActiveWorkspaceTab('sop_governance');
                      setTimeout(() => {
                        const el = document.getElementById('telkomsel-ops-guide');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }, 80);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                        <Compass className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">Panduan Operasional</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Simulasi &amp; SOP teknisi lapangan</p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition" />
                  </button>

                  <button 
                    role="menuitem"
                    onClick={() => {
                      setIsOpsToolsOpen(false);
                      setActiveWorkspaceTab('noc_triage');
                      setTimeout(() => {
                        const el = document.getElementById('noc-fop-operations-center');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }, 80);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                        <Wrench className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">Tiket e-WO &amp; Runbook NOC</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Work order otomatis FOP shelter</p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. REAL-TIME TELEMETRY KPI CARDS (NOC LIVE MONITORING) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Beban Jaringan Real-Time */}
        <div className="bg-white dark:bg-[#0B1324] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Beban Daya Aktif ({liveTelemetry.simTimeLabel})</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono tabular-nums tracking-tight">{liveTelemetry.activeLoadKw}</div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 mt-0.5 font-mono tabular-nums">
              <span>↓ {liveTelemetry.deltaPct}</span>
              <span className="text-slate-400 dark:text-slate-500 font-normal">vs baseline {liveTelemetry.baselineLoadKw}</span>
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
            <span>Sensor: IoT Class 0.5s</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium font-mono">Sinkron 300ms</span>
          </div>
        </div>

        {/* Card 2: Penghematan Energi Hari Ini */}
        <div className="bg-white dark:bg-[#0B1324] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Hemat Energi Hari Ini</span>
            <div className="p-1.5 rounded-lg bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-cyan-700 dark:text-cyan-300 font-mono tabular-nums tracking-tight">{liveTelemetry.dailySavedKwh}</div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium mt-0.5 font-mono tabular-nums">
              {liveTelemetry.dailySavedIdr}
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
            <span>Emisi Terhindar:</span>
            <strong className="text-slate-700 dark:text-slate-200 font-mono tabular-nums">{liveTelemetry.co2AvoidedKg}</strong>
          </div>
        </div>

        {/* Card 3: Status Carrier Sleep Mode */}
        <div className="bg-white dark:bg-[#0B1324] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Node Sleep Aktif</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-blue-700 dark:text-blue-400 font-mono tabular-nums tracking-tight">{liveTelemetry.sleepSitesText}</div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium mt-0.5">
              {liveTelemetry.standbyDesc}
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
            <span>Wake-up Speed:</span>
            <strong className="text-emerald-600 dark:text-emerald-400 font-mono">28 ms (Zero-Wait)</strong>
          </div>
        </div>

        {/* Card 4: Keandalan Jaringan & SLA */}
        <div className="bg-white dark:bg-[#0B1324] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">SLA &amp; Mutu Layanan</span>
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-purple-700 dark:text-purple-400 font-mono tabular-nums tracking-tight">{liveTelemetry.slaPct}</div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5 font-mono tabular-nums">
              {liveTelemetry.cdrText}
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
            <span>Layanan 112:</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">100% Siaga Prioritas</span>
          </div>
        </div>
      </div>

      {/* 3. TIGA PILAR SKOR EKSEKUTIF (FILTERED BY LENS) */}
      <div 
        id="pitch-step-2-pillars"
        className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-2xl transition scroll-mt-6"
        data-pitch-highlight={isPitchWalkthroughActive ? 'true' : undefined}
      >
        {/* Pilar 1: Finansial */}
        <div className={`bg-white dark:bg-[#0B1324] rounded-2xl border p-5 shadow-xs space-y-3 transition ${
          activeLens === 'finance' ? 'border-emerald-500 ring-2 ring-emerald-500/20 dark:ring-emerald-500/30' : 'border-slate-200/90 dark:border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Pilar 1: Finansial (CFO)</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border dark:border-emerald-800/40">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black font-mono tabular-nums text-emerald-700 dark:text-emerald-400 tracking-tight">{scaleData.npvText}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mt-0.5">
              Net Present Value ({scaleData.npvSub})
            </p>
          </div>
          <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <span>Balik Modal: <strong className="text-slate-800 dark:text-slate-200 font-mono">{scaleData.pbpText}</strong></span>
            <span>Net/Tahun: <strong className="text-emerald-700 dark:text-emerald-400 font-mono">{scaleData.netBenefit}</strong></span>
          </div>
        </div>

        {/* Pilar 2: Lingkungan / ESG */}
        <div className={`bg-white dark:bg-[#0B1324] rounded-2xl border p-5 shadow-xs space-y-3 transition ${
          activeLens === 'esg' ? 'border-cyan-500 ring-2 ring-cyan-500/20 dark:ring-cyan-500/30' : 'border-slate-200/90 dark:border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Pilar 2: Dampak Lingkungan (ESG)</span>
            <div className="p-2 rounded-xl bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-400 dark:border dark:border-cyan-800/40">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black font-mono tabular-nums text-cyan-700 dark:text-cyan-400 tracking-tight">{scaleData.emissionsText}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mt-0.5">
              Reduksi Emisi Scope 2 Terhindar per Tahun
            </p>
          </div>
          <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <span>Hemat Listrik: <strong className="text-slate-800 dark:text-slate-200 font-mono">{scaleData.savingKwYear}</strong></span>
            <span>Standar: <strong className="text-cyan-700 dark:text-cyan-400 font-mono">ITU-T L.1331</strong></span>
          </div>
        </div>

        {/* Pilar 3: Keandalan Jaringan */}
        <div className={`bg-white dark:bg-[#0B1324] rounded-2xl border p-5 shadow-xs space-y-3 transition ${
          activeLens === 'network' ? 'border-blue-500 ring-2 ring-blue-500/20 dark:ring-blue-500/30' : 'border-slate-200/90 dark:border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Pilar 3: Keandalan Jaringan (CTO)</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 dark:border dark:border-blue-800/40">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black font-mono tabular-nums text-blue-700 dark:text-blue-400 tracking-tight">99.994%</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mt-0.5">
              Ketersediaan Jaringan (SLA Terjaga Penuh)
            </p>
          </div>
          <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <span>Latensi RAN: <strong className="text-slate-800 dark:text-slate-200 font-mono">14.2 ms</strong></span>
            <span>Kanal 112: <strong className="text-emerald-600 dark:text-emerald-400">Prioritas Terjamin</strong></span>
          </div>
        </div>
      </div>

      {/* 4. INTERACTIVE INDONESIA GIS MAP ACCORDION (Matches Playwright regex /Buka Peta Interaktif/) */}
      <div className="bg-white dark:bg-[#0B1324] rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
        <button
          onClick={() => setShowGisMap(!showGisMap)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-red-50 text-[#ED0226] dark:bg-red-950/40 dark:text-red-400 dark:border dark:border-red-900/50">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>Peta Geospasial Interaktif Jaringan &amp; Sebaran 50 Pilot Sites (GIS NOC)</span>
                <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold shadow-2xs whitespace-nowrap">
                  {showGisMap ? 'Tutup Peta Interaktif' : 'Buka Peta Interaktif'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Visualisasi telemetri daya real-time, status sleep mode, vendor BTS (Ericsson/Huawei), dan titik dividen sosial di 5 kluster Jawa-Bali.
              </p>
            </div>
          </div>

          <div className="text-slate-400 dark:text-slate-500 shrink-0">
            {showGisMap ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>

        {showGisMap && (
          <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800 space-y-3 animate-fade-in">
            {/* Cluster Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-3 text-[11px]">
              <span className="font-bold text-slate-700 dark:text-slate-300">Sebaran Kluster:</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-slate-700 dark:text-slate-300">Jabodetabek (15)</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-slate-700 dark:text-slate-300">Bandung (10)</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-slate-700 dark:text-slate-300">Semarang (8)</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-slate-700 dark:text-slate-300">Surabaya (12)</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-slate-700 dark:text-slate-300">Malang (5)</span>
            </div>

            <div className="h-[420px] rounded-xl overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-inner">
              {isBrowserOnline ? (
                <Suspense fallback={<div className="module-loading" role="status">Memuat peta geospasial jaringan…</div>}>
                  <IndonesiaGisMap />
                </Suspense>
              ) : (
                <div className="grid h-full place-items-center bg-slate-100 dark:bg-slate-800 p-6 text-center text-sm text-slate-600 dark:text-slate-300">
                  Peta tidak tersedia saat offline. Simulasi lokal tetap berjalan.
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
              <span>Menampilkan 40 site intervensi (uji hemat daya) dan 10 site pembanding (kontrol).</span>
              <button 
                onClick={() => setActiveTab('telemetry')}
                className="text-[#ED0226] hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-bold hover:underline flex items-center gap-1"
              >
                <span>Buka Rekonsiliasi Telemetri Multi-Sensor 3-Arah</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. AMBANG BATAS KELANJUTAN PROYEK (4 DECISION GATES TRACKER) */}
      <div id="pitch-step-8-decisiongates" className="bg-white dark:bg-[#0B1324] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs space-y-4 scroll-mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Ambang Batas Kelanjutan Proyek (Go / No-Go Decision Gates - Tata Kelola Telkomsel)
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Empat kriteria validasi ketat yang wajib dipenuhi sebelum ekspansi belanja modal skala regional
            </p>
          </div>

          <button
            onClick={() => setIsBodSigned(!isBodSigned)}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              isBodSigned
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>{isBodSigned ? '✓ Pratinjau MoU Dibuka' : 'Buka Kerangka Keputusan Direksi'}</span>
          </button>
        </div>

        {isBodSigned && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-100 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in shadow-xs">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="font-black text-sm block text-emerald-900 dark:text-emerald-200">
                  DOKUMEN KERANGKA KEPUTUSAN &amp; TATA KELOLA PILOT DISIAPKAN
                </span>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                  Rancangan kriteria audit independen, kepatuhan O-RAN, batas mitigasi SLA, dan pembagian dividen sosial siap ditinjau.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsCertModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition whitespace-nowrap"
              >
                <Award className="w-3.5 h-3.5 text-amber-300" />
                <span>Lihat Sertifikat Verifikasi BoD</span>
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Gate 1 */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 font-mono">Gerbang G1 • IT &amp; Finance</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  TERVERIFIKASI
                </span>
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-xs mb-1">1. Integritas Telemetri Data</h3>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Rekonsiliasi 3-arah: PLN AC, Rectifier DC, OSS Radio. Toleransi error &lt; 1,0%.</p>
            </div>
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800">
              <div className="text-[10px] text-slate-400 dark:text-slate-500">Status Telemetri:</div>
              <div className="text-sm font-black font-mono tabular-nums text-emerald-700 dark:text-emerald-400">Δ = 0.8% (Akurat)</div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-tight">Meter digital Kelas 0.5s sinkron dengan ledger SHA-256.</p>
            </div>
          </div>

          {/* Gate 2 */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 font-mono">Gerbang G2 • Network Planning</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  SESUAI TARGET
                </span>
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-xs mb-1">2. Reduksi Konsumsi Energi</h3>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Penghematan daya bersih terisolasi &ge; 10% dibandingkan site kontrol.</p>
            </div>
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800">
              <div className="text-[10px] text-slate-400 dark:text-slate-500">Capaian Pilot:</div>
              <div className="text-sm font-black font-mono tabular-nums text-emerald-700 dark:text-emerald-400">-14.8% (Aktif)</div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-tight">Metodologi DiD paralel lolos uji signifikansi statistik.</p>
            </div>
          </div>

          {/* Gate 3 */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 font-mono">Gerbang G3 • Finance / CFO</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  LAYAK INVESTASI
                </span>
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-xs mb-1">3. Kelayakan Finansial</h3>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Payback Period &le; 2 tahun, NPV positif pada WACC 10%.</p>
            </div>
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800">
              <div className="text-[10px] text-slate-400 dark:text-slate-500">Proyeksi Finansial:</div>
              <div className="text-sm font-black font-mono tabular-nums text-emerald-700 dark:text-emerald-400">PBP 1,9 Thn (+Rp 240 Jt/th)</div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-tight">Self-funding dari penghematan tagihan listrik PLN.</p>
            </div>
          </div>

          {/* Gate 4 */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 font-mono">Gerbang G4 • Network Ops / CTO</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  SLA TERJAGA
                </span>
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-xs mb-1">4. Mutu Layanan &amp; Keselamatan</h3>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Call Drop Rate &lt; 0.8%, zero interupsi pada panggilan darurat 112.</p>
            </div>
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800">
              <div className="text-[10px] text-slate-400 dark:text-slate-500">Hasil Pengawasan:</div>
              <div className="text-sm font-black font-mono tabular-nums text-emerald-700 dark:text-emerald-400">CDR 0.06% (Aman)</div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-tight">Fail-safe instant wake-up 28ms siaga penuh 24/7.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 6. UNIFIED OPERATIONS, GOVERNANCE & CLOSED-LOOP WORKSPACE */}
      <div className="bg-white dark:bg-[#0B1324] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#ED0226]" />
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Pusat Kendali Operasional NOC, Rekonsiliasi PLN &amp; Tata Kelola Eksekusi
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Pilih modul operasional untuk mengeksekusi alur nyata Triage NOC &rarr; Tiket FOP &rarr; BA-RE PLN &rarr; Jurnal SAP S/4HANA atau meninjau kesiapan produksi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setActiveWorkspaceTab('noc_triage')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeWorkspaceTab === 'noc_triage'
                  ? 'bg-[#ED0226] text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>1. Triage NOC &amp; Tiket FOP</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveWorkspaceTab('committee_pack')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeWorkspaceTab === 'committee_pack'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>2. Komite Investasi &amp; Restitusi PLN</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveWorkspaceTab('cutover_roadmap')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeWorkspaceTab === 'cutover_roadmap'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>3. Roadmap &amp; Cutover Produksi</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveWorkspaceTab('sop_governance')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeWorkspaceTab === 'sop_governance'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>4. SOP, Dampak 3T &amp; Academy</span>
            </button>
          </div>
        </div>

        {/* WORKSPACE TAB 1: LIVE NOC TRIAGE, FOP TICKET & RUNBOOK */}
        {activeWorkspaceTab === 'noc_triage' && (
          <div className="space-y-5 animate-fade-in">
            {/* Triage Anomali & Insiden Energi Real-Time (Live NOC Alarms) */}
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 p-4 sm:p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/70 dark:border-slate-800 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="p-1.5 rounded-lg bg-red-50 text-[#ED0226] dark:bg-red-950/40 dark:text-red-400">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                        Triage Anomali &amp; Insiden Energi Real-Time (Live SNOC Alarms)
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-bold">
                        {filteredIncidents.filter(i => !i.acknowledged).length} Menunggu Tindak Lanjut
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Integrasi tertutup: Alarm SNOC &rarr; Dispatch e-WO FOP Lapangan &rarr; Rekonsiliasi BA-RE PLN &rarr; Jurnal Kredit SAP S/4HANA
                    </p>
                  </div>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center p-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                  <button
                    onClick={() => setIncidentFilter('all')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer whitespace-nowrap ${
                      incidentFilter === 'all'
                        ? 'bg-slate-900 dark:bg-slate-700 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    Semua ({incidents.length})
                  </button>
                  <button
                    onClick={() => setIncidentFilter('warning')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer whitespace-nowrap ${
                      incidentFilter === 'warning'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    Peringatan ({isBdgResolved ? 0 : 1})
                  </button>
                  <button
                    onClick={() => setIncidentFilter('critical')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer whitespace-nowrap ${
                      incidentFilter === 'critical'
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    Kritis (1)
                  </button>
                  <button
                    onClick={() => setIncidentFilter('info')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer whitespace-nowrap ${
                      incidentFilter === 'info'
                        ? 'bg-cyan-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    Otomasi ({isBdgResolved ? 3 : 2})
                  </button>
                </div>
              </div>

              {/* Incident List */}
              <div className="space-y-2.5">
                {filteredIncidents.map((incident) => {
                  const isWarning = incident.severity === 'warning';
                  const isCritical = incident.severity === 'critical';
                  const isBdgItem = incident.siteId === 'BDG-DGO-P04';
                  return (
                    <div 
                      key={incident.id}
                      className={`p-3.5 rounded-xl border transition flex flex-col lg:flex-row lg:items-center justify-between gap-3 ${
                        isCritical 
                          ? 'bg-red-50/70 border-red-200 dark:bg-red-950/20 dark:border-red-900/40' 
                          : isWarning 
                            ? 'bg-amber-50/70 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/40' 
                            : 'bg-white dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-800'
                      }`}
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                            {incident.id}
                          </span>
                          <strong className="text-xs font-bold text-slate-900 dark:text-slate-100">
                            {incident.siteId} • {incident.siteName}
                          </strong>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isCritical
                              ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                              : isWarning
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}>
                            {incident.type}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {incident.time}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-600 dark:text-slate-400">
                          {incident.description}
                        </p>

                        <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1.5 pt-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                          <span><strong>Aksi Sistem ImpactGrid:</strong> {incident.automatedAction}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-200/60 dark:border-slate-800">
                        {isBdgItem && !isBdgResolved && onResolveSiteAnomaly && (
                          <button
                            type="button"
                            onClick={() => onResolveSiteAnomaly('BDG-DGO-P04')}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1 whitespace-nowrap shadow-2xs"
                          >
                            <Wrench className="w-3.5 h-3.5" />
                            <span>Selesaikan FOP &amp; Sinkron BA-RE</span>
                          </button>
                        )}
                        {isBdgItem && isBdgResolved && onOpenModal && (
                          <>
                            <button
                              type="button"
                              onClick={() => onOpenModal('bare')}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer whitespace-nowrap"
                            >
                              Buka BA-RE PLN
                            </button>
                            <button
                              type="button"
                              onClick={() => onOpenModal('sap')}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer whitespace-nowrap"
                            >
                              Jurnal SAP S/4HANA
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => setActiveTab('telemetry')}
                          className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer whitespace-nowrap"
                        >
                          Telemetri Site
                        </button>
                        <button
                          onClick={() => handleAcknowledge(incident.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                            incident.acknowledged
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 cursor-default'
                              : 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900'
                          }`}
                        >
                          {incident.acknowledged ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Diakui</span>
                            </>
                          ) : (
                            <span>Acknowledge</span>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* NOC Field Operations & Runbook Center */}
            <div id="noc-fop-operations-center" className="scroll-mt-6">
              <NocOperationsRunbookCenter onOpenFieldConsole={onOpenFieldConsole} />
            </div>
          </div>
        )}

        {/* WORKSPACE TAB 2: INVESTMENT COMMITTEE, PLN RESTITUTION & IDXCARBON */}
        {activeWorkspaceTab === 'committee_pack' && (
          <div className="animate-fade-in">
            <ExecutiveDealClosingSuitePanel
              resolvedSites={resolvedSites}
              customByodSites={customByodSites}
              onResolveSiteAnomaly={onResolveSiteAnomaly}
              onNavigateTab={(tab, targetMode) => {
                if (targetMode && setViewMode) setViewMode(targetMode);
                if (setActiveTab) setActiveTab(tab);
              }}
              onOpenModal={onOpenModal}
              initialSubTab="navigator"
            />
          </div>
        )}

        {/* WORKSPACE TAB 3: ROADMAP 3 TAHAP & PRODUCTION CUTOVER CONSOLE */}
        {activeWorkspaceTab === 'cutover_roadmap' && (
          <div className="space-y-5 animate-fade-in">
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-slate-800 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Roadmap 3 Tahap Implementasi &amp; Kelayakan Finansial Telkomsel
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-medium">Horizon 2027 – 2031</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-slate-100 block">Tahap 1: Pilot Terkendali (2027)</span>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">40 Site Intervensi + 10 Site Kontrol</p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                    CapEx Rp 450 Jt (Plafon audit awal Rp 95 Jt). Membuktikan efisiensi energi -14.8% dan validasi model DiD tanpa risiko operasional.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-slate-100 block">Tahap 2: Skala Regional (2028–2029)</span>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">5.000 Menara Makro Jawa-Bali</p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                    Penghematan bersih +Rp 4,80 Miliar/tahun, NPV +Rp 11,70 Miliar, reduksi emisi 5.046 tCO₂e/tahun dengan payback 1,35 tahun.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-slate-100 block">Tahap 3: Skala Nasional (2030–2031)</span>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">10.000+ Menara Telkomsel Nasional</p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                    Penghematan bersih +Rp 14,90 Miliar/tahun, NPV +Rp 41,48 Miliar, reduksi emisi 12.702 tCO₂e/tahun untuk target Net-Zero Telkomsel.
                  </p>
                </div>
              </div>
            </div>

            <TelkomselProductionCutoverConsole
              setActiveTab={setActiveTab}
              selectedScale={selectedScale}
            />
          </div>
        )}

        {/* WORKSPACE TAB 4: SOP GUIDE, SOCIAL DIVIDEND 3T & ACADEMY */}
        {activeWorkspaceTab === 'sop_governance' && (
          <div className="space-y-6 animate-fade-in">
            <div id="telkomsel-ops-guide" className="scroll-mt-6">
              <TelkomselOperationsGuide setActiveTab={setActiveTab} />
            </div>
            <SocialDividendCard selectedScale={selectedScale} />
            <ImpactGridAcademyCard />
            <ExecutiveDecisionTimeline />
            <BeforeVsAfterComparison />
          </div>
        )}
      </div>

      {/* Decision framework preview modal */}
      <BoDCertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
      />

      {/* Executive One-Pager Decision Modal */}
      <ExecutiveOnePagerModal
        isOpen={isOnePagerOpen}
        onClose={() => setIsOnePagerOpen(false)}
      />
    </div>
  );
}
