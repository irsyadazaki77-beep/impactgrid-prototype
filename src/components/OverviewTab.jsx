import React, { lazy, Suspense, useEffect, useState, useMemo } from 'react';
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
  activeLens = 'all', 
  emergencyState = { active: false },
  onOpenEmergencyModal,
  simState = { simHour: 14, tempC: 28, trafficMultiplier: 1.0, carrierSleepActive: true, simTimeString: '14:00 WIB' },
  viewMode = 'executive',
  setViewMode,
  isPitchWalkthroughActive = false,
  onOpenExecutiveMemo,
  onOpenFieldConsole
}) {
  const [showGisMap, setShowGisMap] = useState(false);
  const [isBrowserOnline, setIsBrowserOnline] = useState(() => typeof navigator === 'undefined' ? true : navigator.onLine);
  const [isBodSigned, setIsBodSigned] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [isOnePagerOpen, setIsOnePagerOpen] = useState(false);
  const [incidentFilter, setIncidentFilter] = useState('all'); // 'all', 'critical', 'warning', 'info'
  const [incidents, setIncidents] = useState(INITIAL_INCIDENTS);
  const [showOpsCenter, setShowOpsCenter] = useState(false);

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

  const filteredIncidents = useMemo(() => {
    if (incidentFilter === 'all') return incidents;
    return incidents.filter(i => i.severity === incidentFilter);
  }, [incidents, incidentFilter]);

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
            className="px-3 py-1.5 rounded-xl bg-white text-red-700 font-bold text-xs hover:bg-red-50 transition cursor-pointer shrink-0"
          >
            Lihat mitigasi
          </button>
        </div>
      )}

      {/* 1. NOC Operations Executive Header */}
      <div id="pitch-step-1-overview" className="bg-white dark:bg-[#0B1324] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs space-y-4 scroll-mt-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-[#ED0226] border border-red-200/80 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/50 text-xs font-bold">
              {scaleData.scopeTitle}
            </span>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/50 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>NOC TELEMETRI AKTIF • KELAS 0.5S</span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">• Listrik korporat 2025: 1.885,4 GWh (63,6% Emisi Scope 2)</span>
          </div>
          
          {/* Main Title Preserving e2e text "Rancangan DSS Efisiensi" */}
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            ImpactGrid: Rancangan DSS Efisiensi Jaringan & ESG
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Pusat Kendali Operasi Energi RAN & Decision Support System Multi-Skenario Telkomsel. Mengorkestrasi penghematan daya radio O-RAN, optimalisasi termal shelter BTS, dan perlindungan SLA secara real-time.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={() => setActiveTab('scenariolab')}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 shadow-2xs"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Simulasi What-If</span>
            </button>
            <button 
              onClick={() => setActiveTab('optimization')}
              className="px-4 py-2 rounded-xl bg-[#ED0226] hover:bg-red-700 text-white text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 shadow-2xs"
            >
              <span>Alokasi CapEx</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={onOpenEmergencyModal}
              className="px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 text-xs font-bold transition cursor-pointer flex items-center space-x-1.5"
              title="Uji skenario darurat fail-safe 112"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Drill Darurat</span>
            </button>
            {onOpenExecutiveMemo && (
              <button 
                onClick={onOpenExecutiveMemo}
                className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 shadow-2xs"
                title="Buka Executive Investment Dossier 1-Halaman (Siap Cetak / PDF)"
              >
                <FileText className="w-3.5 h-3.5 text-[#ED0226]" />
                <span>Executive Dossier A4</span>
              </button>
            )}
            <button 
              onClick={() => setIsOnePagerOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 via-[#ED0226] to-rose-600 text-white hover:from-red-700 hover:to-red-600 text-xs font-black transition cursor-pointer flex items-center space-x-1.5 shadow-xs btn-bounce"
              title="Buka Lembar Keputusan Resmi Dewan Direksi (Executive 1-Pager)"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>One-Pager Direksi</span>
            </button>
          </div>

          {/* Secondary Tools & Enterprise Hub Shortcuts */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mr-1 hidden md:inline">Integrasi:</span>
            <button 
              onClick={() => setActiveTab('telemetry')}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition cursor-pointer flex items-center space-x-1"
              title="Buka Pusat Ingestion & Analisis Telemetri CSV BTS"
            >
              <Upload className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
              <span>Ingestion CSV BTS</span>
            </button>
            <button 
              onClick={() => setActiveTab('architecture')}
              className="px-2.5 py-1.5 rounded-lg border border-indigo-200/80 dark:border-indigo-900/60 bg-indigo-50/50 hover:bg-indigo-100/60 dark:bg-indigo-950/30 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold transition cursor-pointer flex items-center space-x-1"
              title="Buka Pusat Kesiapan Integrasi IT, TM Forum API & K8s Telkomsel"
            >
              <ShieldCheck className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
              <span>Kesiapan IT & TM Forum</span>
            </button>
            <button 
              onClick={() => {
                const el = document.getElementById('telkomsel-ops-guide');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-2.5 py-1.5 rounded-lg border border-amber-200/80 dark:border-amber-900/60 bg-amber-50/50 hover:bg-amber-100/60 dark:bg-amber-950/30 dark:hover:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-xs font-semibold transition cursor-pointer flex items-center space-x-1"
              title="Buka Panduan Edukasi & Simulator Operasional Telkomsel"
            >
              <Compass className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              <span>Panduan Operasional</span>
            </button>
            <button 
              onClick={() => {
                setShowOpsCenter(true);
                setTimeout(() => {
                  const el = document.getElementById('noc-fop-operations-center');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }, 80);
              }}
              className="px-2.5 py-1.5 rounded-lg border border-red-200/80 dark:border-red-900/60 bg-red-50/50 hover:bg-red-100/60 dark:bg-red-950/30 dark:hover:bg-red-900/40 text-red-700 dark:text-red-300 text-xs font-semibold transition cursor-pointer flex items-center space-x-1"
              title="Buka Pusat Operasional Lapangan (FOP), Tiket e-WO & Runbook NOC"
            >
              <Wrench className="w-3 h-3 text-red-600 dark:text-red-400" />
              <span>Tiket e-WO & Runbook NOC</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. REAL-TIME TELEMETRY KPI CARDS (NOC LIVE MONITORING) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Beban Jaringan Real-Time */}
        <div className="bg-white dark:bg-[#0B1324] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Beban Daya Aktif</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono tracking-tight">184.2 kW</div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
              <span>↓ -14.8%</span>
              <span className="text-slate-400 dark:text-slate-500 font-normal">vs baseline 216.2 kW</span>
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
            <span>Sensor: IoT Class 0.5s</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Sinkron 300ms</span>
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
            <div className="text-2xl font-black text-cyan-700 dark:text-cyan-300 font-mono tracking-tight">776.4 kWh</div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium mt-0.5">
              ~Rp 1.164.600 / hari (40 Site)
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
            <span>Emisi Terhindar:</span>
            <strong className="text-slate-700 dark:text-slate-200">605.6 kg CO₂e</strong>
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
            <div className="text-2xl font-black text-blue-700 dark:text-blue-400 font-mono tracking-tight">36 / 40 Site</div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium mt-0.5">
              4 Site Standby Lalu Lintas Padat
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
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">SLA & Mutu Layanan</span>
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-purple-700 dark:text-purple-400 font-mono tracking-tight">99.994%</div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
              Call Drop Rate: 0.06% (Batas: &lt; 0.8%)
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
            <span>Layanan 112:</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">100% Siaga Prioritas</span>
          </div>
        </div>
      </div>

      {/* 3. PANDUAN EDUKASI & ONBOARDING OPERASIONAL TELKOMSEL */}
      <div id="telkomsel-ops-guide" className="scroll-mt-6">
        <TelkomselOperationsGuide setActiveTab={setActiveTab} />
      </div>

      {/* 4. TIGA PILAR SKOR EKSEKUTIF (FILTERED BY LENS) */}
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
            <div className="text-3xl font-black text-emerald-700 dark:text-emerald-400 tracking-tight">{scaleData.npvText}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mt-0.5">
              Net Present Value ({scaleData.npvSub})
            </p>
          </div>
          <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <span>Balik Modal: <strong className="text-slate-800 dark:text-slate-200">{scaleData.pbpText}</strong></span>
            <span>Net/Tahun: <strong className="text-emerald-700 dark:text-emerald-400">{scaleData.netBenefit}</strong></span>
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
            <div className="text-3xl font-black text-cyan-700 dark:text-cyan-400 tracking-tight">{scaleData.emissionsText}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mt-0.5">
              Reduksi Emisi Scope 2 Terhindar per Tahun
            </p>
          </div>
          <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <span>Hemat Listrik: <strong className="text-slate-800 dark:text-slate-200">{scaleData.savingKwYear}</strong></span>
            <span>Standar: <strong className="text-cyan-700 dark:text-cyan-400">ITU-T L.1331</strong></span>
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
            <div className="text-3xl font-black text-blue-700 dark:text-blue-400 tracking-tight">99.994%</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mt-0.5">
              Ketersediaan Jaringan (SLA Terjaga Penuh)
            </p>
          </div>
          <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <span>Latensi RAN: <strong className="text-slate-800 dark:text-slate-200">14.2 ms</strong></span>
            <span>Kanal 112: <strong className="text-emerald-600 dark:text-emerald-400">Prioritas Terjamin</strong></span>
          </div>
        </div>
      </div>



      {/* 5. INTERACTIVE INDONESIA GIS MAP ACCORDION (Matches Playwright regex /Buka Peta Interaktif/) */}
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
                <span>Peta Geospasial Interaktif Jaringan & Sebaran 50 Pilot Sites (GIS NOC)</span>
                <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold shadow-2xs">
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

      {/* 6. AMBANG BATAS KELANJUTAN PROYEK (4 DECISION GATES TRACKER) */}
      <div className="bg-white dark:bg-[#0B1324] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs space-y-4">
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
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer ${
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
                  DOKUMEN KERANGKA KEPUTUSAN & TATA KELOLA PILOT DISIAPKAN
                </span>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                  Rancangan kriteria audit independen, kepatuhan O-RAN, batas mitigasi SLA, dan pembagian dividen sosial siap ditinjau.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsCertModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition"
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
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 font-mono">Gerbang G1 • IT & Finance</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  TERVERIFIKASI
                </span>
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-xs mb-1">1. Integritas Telemetri Data</h3>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Rekonsiliasi 3-arah: PLN AC, Rectifier DC, OSS Radio. Toleransi error &lt; 1,0%.</p>
            </div>
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800">
              <div className="text-[10px] text-slate-400 dark:text-slate-500">Status Telemetri:</div>
              <div className="text-sm font-black text-emerald-700 dark:text-emerald-400">Δ = 0.8% (Akurat)</div>
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
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Penghematan daya bersih terisolasi $\ge 10\%$ dibandingkan site kontrol.</p>
            </div>
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800">
              <div className="text-[10px] text-slate-400 dark:text-slate-500">Capaian Pilot:</div>
              <div className="text-sm font-black text-emerald-700 dark:text-emerald-400">-14.8% (Aktif)</div>
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
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Payback Period $\le 2$ tahun, NPV positif pada WACC 10%.</p>
            </div>
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800">
              <div className="text-[10px] text-slate-400 dark:text-slate-500">Proyeksi Finansial:</div>
              <div className="text-sm font-black text-emerald-700 dark:text-emerald-400">PBP 1,9 Thn (+Rp 240 Jt/th)</div>
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
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-xs mb-1">4. Mutu Layanan & Keselamatan</h3>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Call Drop Rate &lt; 0.8%, zero interupsi pada panggilan darurat 112.</p>
            </div>
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800">
              <div className="text-[10px] text-slate-400 dark:text-slate-500">Hasil Pengawasan:</div>
              <div className="text-sm font-black text-emerald-700 dark:text-emerald-400">CDR 0.06% (Aman)</div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-tight">Fail-safe instant wake-up 28ms siaga penuh 24/7.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 7. ROADMAP 3 TAHAP IMPLEMENTASI & KELAYAKAN FINANSIAL */}
      <div className="bg-white dark:bg-[#0B1324] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Roadmap 3 Tahap Implementasi & Kelayakan Finansial Telkomsel
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Horizon 2027 – 2031</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="font-bold text-slate-900 dark:text-slate-100 block">Tahap 1: Pilot Terkendali (2027)</span>
            <p className="text-slate-600 dark:text-slate-400 font-medium">40 Site Intervensi + 10 Site Kontrol</p>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
              CapEx Rp 450 Jt (Plafon audit awal Rp 95 Jt). Membuktikan efisiensi energi -14.8% dan validasi model DiD tanpa risiko operasional.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="font-bold text-slate-900 dark:text-slate-100 block">Tahap 2: Skala Regional (2028–2029)</span>
            <p className="text-slate-600 dark:text-slate-400 font-medium">5.000 Menara Makro Jawa-Bali</p>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
              Penghematan bersih +Rp 4,80 Miliar/tahun, NPV +Rp 11,70 Miliar, reduksi emisi 5.046 tCO₂e/tahun dengan payback 1,35 tahun.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="font-bold text-slate-900 dark:text-slate-100 block">Tahap 3: Skala Nasional (2030–2031)</span>
            <p className="text-slate-600 dark:text-slate-400 font-medium">10.000+ Menara Telkomsel Nasional</p>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
              Penghematan bersih +Rp 14,90 Miliar/tahun, NPV +Rp 41,48 Miliar, reduksi emisi 12.702 tCO₂e/tahun untuk target Net-Zero Telkomsel.
            </p>
          </div>
        </div>
      </div>

      {/* 7. OPERASIONAL & RESILIENSI NOC TELKOMSEL */}
      {viewMode === 'executive' && !showOpsCenter ? (
        <div className="bg-white dark:bg-[#0B1324] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/40 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Resiliensi Operasional & Live Triage NOC Telkomsel
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-bold">
                  {incidents.filter(i => !i.acknowledged).length} Baru • 4 Alarms Auto-Mitigated
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                O-RAN rApp fail-safe siaga 28ms untuk panggilan darurat 112. SOP runbook terotomasi & integrasi 3-shift FOP teknisi siap ditinjau.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setShowOpsCenter(true);
                setTimeout(() => {
                  const el = document.getElementById('noc-fop-operations-center');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }, 80);
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition cursor-pointer flex items-center space-x-1.5"
            >
              <Wrench className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
              <span>Buka Triage Alarm & Runbook NOC</span>
            </button>
            {setViewMode && (
              <button
                onClick={() => setViewMode('engineering')}
                className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer flex items-center space-x-1"
                title="Beralih ke tampilan teknis O-RAN & telemetri"
              >
                <span>Buka Mode Teknis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          {viewMode === 'executive' && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-[#ED0226]" />
                <span>Panel Operasional NOC & Runbook Lapangan Terbuka</span>
              </span>
              <button
                onClick={() => setShowOpsCenter(false)}
                className="px-3 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold border border-slate-200 dark:border-slate-600 transition cursor-pointer"
              >
                Ciutkan Detail Operasional
              </button>
            </div>
          )}

          {/* Triage Anomali & Insiden Energi Real-Time (Live NOC Alarms) */}
          <div className="bg-white dark:bg-[#0B1324] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 rounded-lg bg-red-50 text-[#ED0226] dark:bg-red-950/40 dark:text-red-400">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      Triage Anomali & Insiden Energi Real-Time (Live NOC Alarms)
                    </h2>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-bold">
                      {incidents.filter(i => !i.acknowledged).length} Baru
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Peringatan otomatis telemetri IoT submeter, O-RAN rApp fail-safe, dan respons anomali termal shelter
                  </p>
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs">
                <button
                  onClick={() => setIncidentFilter('all')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                    incidentFilter === 'all'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Semua ({incidents.length})
                </button>
                <button
                  onClick={() => setIncidentFilter('warning')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                    incidentFilter === 'warning'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Peringatan (1)
                </button>
                <button
                  onClick={() => setIncidentFilter('critical')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                    incidentFilter === 'critical'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Kritis (1)
                </button>
                <button
                  onClick={() => setIncidentFilter('info')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                    incidentFilter === 'info'
                      ? 'bg-cyan-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Otomasi (2)
                </button>
              </div>
            </div>

            {/* Incident List */}
            <div className="space-y-2.5">
              {filteredIncidents.map((incident) => {
                const isWarning = incident.severity === 'warning';
                const isCritical = incident.severity === 'critical';
                return (
                  <div 
                    key={incident.id}
                    className={`p-3.5 rounded-xl border transition flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                      isCritical 
                        ? 'bg-red-50/70 border-red-200 dark:bg-red-950/20 dark:border-red-900/40' 
                        : isWarning 
                          ? 'bg-amber-50/70 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/40' 
                          : 'bg-slate-50/70 border-slate-200/80 dark:bg-slate-800/40 dark:border-slate-800'
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
                              : 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300'
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
                        <span><strong>Aksi Otomatis ImpactGrid:</strong> {incident.automatedAction}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200/60 dark:border-slate-800">
                      <button
                        onClick={() => setActiveTab('telemetry')}
                        className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
                      >
                        Telemetri Site
                      </button>
                      <button
                        onClick={() => handleAcknowledge(incident.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
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

      {/* 8. DIVIDEN SOSIAL, ACADEMY, ALUR KEPUTUSAN & SEBELUM VS SESUDAH */}
      <div id="pitch-step-8-decisiongates" className="space-y-6 pt-2 scroll-mt-6">
        <SocialDividendCard selectedScale={selectedScale} />
        <ImpactGridAcademyCard />
        <ExecutiveDecisionTimeline />
        <BeforeVsAfterComparison />
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
