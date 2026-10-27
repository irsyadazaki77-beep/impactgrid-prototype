import React, { lazy, Suspense, useEffect, useState } from 'react';
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
  AlertTriangle,
  Award,
  ArrowRight,
  Sparkles,
  Layers,
  HelpCircle
} from 'lucide-react';
import { 
  DECISION_GATE_CRITERIA
} from '../data/mockData';
import BoDCertificateModal from './BoDCertificateModal';
import BeforeVsAfterComparison from './BeforeVsAfterComparison';
import ExecutiveDecisionTimeline from './ExecutiveDecisionTimeline';

const IndonesiaGisMap = lazy(() => import('./IndonesiaGisMap'));

export default function OverviewTab({ 
  setActiveTab, 
  selectedScale = 'pilot', 
  activeLens = 'all', 
  emergencyState = { active: false },
  onOpenEmergencyModal,
  simState = { simHour: 14, tempC: 28, trafficMultiplier: 1.0, carrierSleepActive: true, simTimeString: '14:00 WIB' }
}) {
  const [showGisMap, setShowGisMap] = useState(false); // Collapsible: clean by default!
  const [isBrowserOnline, setIsBrowserOnline] = useState(() => typeof navigator === 'undefined' ? true : navigator.onLine);
  const [isBodSigned, setIsBodSigned] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  useEffect(() => {
    const updateOnlineStatus = () => setIsBrowserOnline(navigator.onLine);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);
  // Static illustrative values only; this prototype has no operational telemetry connection.

  // Data dinamis sesuai skala terpilih tanpa clutter
  const scaleData = {
    pilot: {
      scopeTitle: "Desain pilot usulan (2027) • 40 intervensi + 10 pembanding",
      sitesText: "40 + 10 Sites",
      savingKwYear: "~200 MWh/th",
      grossSaving: "Rp 300 Jt/th",
      netBenefit: "+Rp 240 Jt/th",
      npvText: "−Rp 391,5 jt s.d. +Rp 82,3 jt",
      npvSub: "Sensitivitas 8%; Skenario Dasar +Rp 460 Jt (10%)",
      pbpText: "~1,9 Tahun",
      emissionsText: "~174 tCO₂e/th",
      capexText: "Asumsi Rp 450 Juta (OpEx Rp 60 Jt/th)"
    },
    regional: {
      scopeTitle: "Proyeksi Horizon 2 (2028–2029) • 5.000 Menara Jamali",
      sitesText: "5.000 Menara Makro",
      savingKwYear: "~5,80 GWh/th",
      grossSaving: "Rp 6,60 Miliar/th",
      netBenefit: "+Rp 4,80 Miliar/th",
      npvText: "+Rp 11,70 Miliar",
      npvSub: "Model swadana efisiensi operasional (Tabel 4)",
      pbpText: "~1,35 Tahun",
      emissionsText: "~5.046 tCO₂e/th",
      capexText: "Estimasi Rp 6,50 Miliar (OpEx Rp 1,8 M/th)"
    },
    national: {
      scopeTitle: "Visi Horizon 3 (2030–2031) • 10.000+ Menara Nasional",
      sitesText: "10.000+ Menara Nasional",
      savingKwYear: "~14,60 GWh/th",
      grossSaving: "Rp 21,90 Miliar/th",
      netBenefit: "+Rp 14,90 Miliar/th",
      npvText: "+Rp 41,48 Miliar",
      npvSub: "Skala enterprise Net-Zero transition (Tabel 7)",
      pbpText: "~1,00 Tahun",
      emissionsText: "~12.702 tCO₂e/th",
      capexText: "Estimasi Rp 15,00 Miliar (OpEx Rp 7 M/th)"
    }
  }[selectedScale] || {
    scopeTitle: "Desain pilot usulan (2027) • 40 intervensi + 10 pembanding",
    sitesText: "40 + 10 Sites",
    savingKwYear: "~200 MWh/th",
    grossSaving: "Rp 300 Jt/th",
    netBenefit: "+Rp 240 Jt/th",
    npvText: "−Rp 391,5 jt s.d. +Rp 82,3 jt",
    npvSub: "Sensitivitas 8%; Skenario Dasar +Rp 460 Jt (10%)",
    pbpText: "~1,9 Tahun",
    emissionsText: "~174 tCO₂e/th",
    capexText: "Asumsi Rp 450 Juta (OpEx Rp 60 Jt/th)"
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Emergency Active Alert Banner (If CTO Stress-Test Triggered) */}
      {emergencyState.active && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow-md flex items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center space-x-3">
            <Flame className="w-5 h-5 text-amber-200 animate-pulse" />
            <div>
              <span className="font-extrabold text-xs block">SKENARIO DEMO DIPILIH</span>
              <p className="text-[11px] text-red-100">
                Skenario visual untuk membahas fail-safe; tidak menguji jaringan, latency, atau layanan darurat.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenEmergencyModal}
            className="px-3 py-1.5 rounded-xl bg-white text-red-700 font-bold text-xs hover:bg-red-50 transition cursor-pointer shrink-0"
          >
            Lihat simulasi
          </button>
        </div>
      )}

      {/* 1. Clean Executive Header with Scope Indicator */}
      <div className="bg-white dark:bg-slate-900/70 rounded-2xl border border-slate-200 dark:border-slate-800/80 p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-[#ED0226] border border-red-200/80 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/50 text-xs font-bold">
              {scaleData.scopeTitle}
            </span>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/50 text-[11px] font-semibold text-amber-800 dark:text-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>DATA CONTOH • bukan telemetri live</span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">• Listrik korporat 2025: 1.885,4 GWh</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            ImpactGrid: Rancangan DSS Efisiensi Jaringan & ESG
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
            Mendemonstrasikan rancangan DSS untuk membandingkan opsi efisiensi energi. Baseline, manfaat, batas mutu layanan, dan kelayakan investasi masih harus divalidasi oleh pemilik data dan operasi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button 
            onClick={() => setActiveTab('scenariolab')}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 shadow-2xs"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Simulasi What-If</span>
          </button>
          <button 
            onClick={() => setActiveTab('optimization')}
            className="px-4 py-2 rounded-xl bg-[#ED0226] hover:bg-red-700 text-white text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 shadow-2xs"
          >
            <span>Alokasi CapEx</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* EXECUTIVE SUMMARY CONTEXT & ROOT CAUSE CALLOUT */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Konteks Masalah Utama: Laporan Keberlanjutan Telkom 2025 & Dilema Operasional
            </span>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
            Sumber: Sustainability Report Telkom 2025 (hlm. 104 & 108)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/25 border border-amber-200/80 dark:border-amber-900/40 space-y-1.5">
            <span className="text-[10px] text-amber-800 dark:text-amber-400 uppercase font-bold block tracking-wider">1. Konsumsi Listrik Korporat 2025</span>
            <div className="text-lg font-black text-amber-950 dark:text-amber-100 tracking-tight">1.885.417.875,2 kWh</div>
            <p className="text-[11px] text-amber-900/85 dark:text-amber-300/85 leading-relaxed">
              Total konsumsi listrik Telkomsel pada 2025; nilai tagihan tidak dihitung di sini.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-sky-50/70 dark:bg-sky-950/25 border border-sky-200/80 dark:border-sky-900/40 space-y-1.5">
            <span className="text-[10px] text-sky-800 dark:text-sky-400 uppercase font-bold block tracking-wider">2. Emisi Scope 2 Korporat 2025</span>
            <div className="text-lg font-black text-sky-950 dark:text-sky-100 tracking-tight">1.721.967,7 tCO₂e</div>
            <p className="text-[11px] text-sky-900/85 dark:text-sky-300/85 leading-relaxed">
              Menyumbang <strong className="font-bold text-sky-950 dark:text-sky-200">63,6%</strong> dari total emisi Telkomsel; angka ini memberi konteks perusahaan, bukan dampak yang dapat diklaim dari ImpactGrid.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/25 border border-rose-200/80 dark:border-rose-900/40 space-y-1.5">
            <span className="text-[10px] text-rose-800 dark:text-rose-400 uppercase font-bold block tracking-wider">3. Kebutuhan Integrasi Belum Dinilai</span>
            <div className="text-sm font-bold text-rose-950 dark:text-rose-100">Pemetaan sistem existing</div>
            <p className="text-[11px] text-rose-900/85 dark:text-rose-300/85 leading-relaxed">
              Kondisi integrasi sistem internal belum diverifikasi. ImpactGrid mengusulkan satu alur analisis untuk data yang diizinkan.
            </p>
          </div>
        </div>

        <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
          <span>💡 <em className="text-slate-600 dark:text-slate-300">"ImpactGrid mengusulkan prioritisasi portofolio; bukti manfaat kausal baru dapat dibuat setelah pilot."</em></span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('architecture')}
              className="text-[#ED0226] hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-bold flex items-center gap-1 cursor-pointer transition text-xs"
            >
              <span>Lihat Diagram Pohon Masalah (Gambar 1)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Tiga Pilar Skor Eksekutif (Filtered by Lens) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pilar 1: Finansial */}
        <div className={`bg-white dark:bg-slate-900/70 rounded-2xl border p-5 shadow-xs space-y-3 transition ${
          activeLens === 'finance' ? 'border-emerald-500 ring-2 ring-emerald-500/20 dark:ring-emerald-500/30' : 'border-slate-200/90 dark:border-slate-800/80'
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
              NPV indikatif ({scaleData.npvSub})
            </p>
          </div>
          <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <span>Balik Modal: <strong className="text-slate-800 dark:text-slate-200">{scaleData.pbpText}</strong></span>
            <span>Net/Tahun: <strong className="text-emerald-700 dark:text-emerald-400">{scaleData.netBenefit}</strong></span>
          </div>
        </div>

        {/* Pilar 2: Lingkungan / ESG */}
        <div className={`bg-white dark:bg-slate-900/70 rounded-2xl border p-5 shadow-xs space-y-3 transition ${
          activeLens === 'esg' ? 'border-cyan-500 ring-2 ring-cyan-500/20 dark:ring-cyan-500/30' : 'border-slate-200/90 dark:border-slate-800/80'
        }`}>
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Pilar 2: Dampak Lingkungan (ESG)</span>
            <div className="p-2 rounded-xl bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-400 dark:border dark:border-cyan-800/40">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">{scaleData.emissionsText}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mt-0.5">
              Dampak emisi belum dihitung
            </p>
          </div>
          <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <span>Hemat Daya: <strong className="text-slate-800 dark:text-slate-200">{scaleData.savingKwYear}</strong></span>
            <span>Rujukan: <strong className="text-cyan-700 dark:text-cyan-400">ITU-T L.1331</strong></span>
          </div>
        </div>

        {/* Pilar 3: Keandalan Jaringan */}
        <div className={`bg-white dark:bg-slate-900/70 rounded-2xl border p-5 shadow-xs space-y-3 transition ${
          activeLens === 'network' ? 'border-blue-500 ring-2 ring-blue-500/20 dark:ring-blue-500/30' : 'border-slate-200/90 dark:border-slate-800/80'
        }`}>
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Pilar 3: Keandalan Jaringan (CTO)</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 dark:border dark:border-blue-800/40">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-blue-700 dark:text-blue-400 tracking-tight">Belum diuji</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mt-0.5">
              QoS wajib menjadi batas keputusan pilot
            </p>
          </div>
          <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <span>Latency: <strong className="text-slate-800 dark:text-slate-200">perlu uji</strong></span>
            <span>Kanal darurat: <strong className="text-blue-700 dark:text-blue-400">perlu validasi operator</strong></span>
          </div>
        </div>
      </div>

      {/* 3. Collapsible Indonesia GIS Map */}
      <div className="bg-white dark:bg-slate-900/70 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 shadow-xs overflow-hidden">
        <button
          onClick={() => setShowGisMap(!showGisMap)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition cursor-pointer"
        >
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-red-50 text-[#ED0226] dark:bg-red-950/40 dark:text-red-400 dark:border dark:border-red-900/50">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>Peta dasar Indonesia — tanpa data lokasi</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold">
                  {showGisMap ? 'Klik untuk Ciutkan' : 'Klik untuk Buka Peta Interaktif'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Belum ada kluster, nama lokasi, atau titik intervensi yang dipetakan.
              </p>
            </div>
          </div>

          <div className="text-slate-400 dark:text-slate-500">
            {showGisMap ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>

        {showGisMap && (
          <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800 space-y-3 animate-fade-in">
            <div className="h-[420px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner">
              {isBrowserOnline ? <Suspense fallback={<div className="module-loading" role="status">Memuat peta contoh…</div>}><IndonesiaGisMap /></Suspense> : <div className="grid h-full place-items-center bg-slate-100 dark:bg-slate-800 p-6 text-center text-sm text-slate-600 dark:text-slate-300">Peta tidak tersedia saat offline. Simulasi lokal tetap berjalan.</div>}
            </div>
            <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
              <span>Peta dasar saja; belum ada kluster, lokasi, atau titik intervensi yang dipetakan.</span>
              <button 
                onClick={() => setActiveTab('telemetry')}
                className="text-[#ED0226] hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-bold hover:underline"
              >
                Lihat daftar data yang diperlukan →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. Data availability */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/70 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Zap className="h-4 w-4 text-amber-500 dark:text-amber-400" />
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">Pengukuran energi dan layanan</h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Belum ada baseline site atau telemetri operasional yang terhubung.</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3 text-xs">
          <div className="rounded-xl border border-amber-200/80 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-950/30 p-3.5 space-y-1">
            <strong className="block text-amber-950 dark:text-amber-200 font-bold">Energi per lokasi</strong>
            <span className="mt-1 block text-amber-900/80 dark:text-amber-300/80 text-[11px] leading-relaxed">Menunggu meter, tagihan, dan periode ukur.</span>
          </div>
          <div className="rounded-xl border border-amber-200/80 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-950/30 p-3.5 space-y-1">
            <strong className="block text-amber-950 dark:text-amber-200 font-bold">QoS dan latency</strong>
            <span className="mt-1 block text-amber-900/80 dark:text-amber-300/80 text-[11px] leading-relaxed">Belum diuji; batas ditetapkan operator.</span>
          </div>
          <div className="rounded-xl border border-amber-200/80 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-950/30 p-3.5 space-y-1">
            <strong className="block text-amber-950 dark:text-amber-200 font-bold">Emisi terhindar</strong>
            <span className="mt-1 block text-amber-900/80 dark:text-amber-300/80 text-[11px] leading-relaxed">Belum dihitung; faktor dan batas inventaris belum dipilih.</span>
          </div>
        </div>
      </section>

      {/* AMBANG BATAS KELANJUTAN (4 DECISION GATES TRACKER - TABEL 4 & PARAGRAF 33 EXEC SUMMARY) */}
      <div className="bg-white dark:bg-slate-900/70 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Ambang Batas Kelanjutan Proyek (Go / No-Go Decision Gates - Paragraf 33)
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Kerangka awal; ambang dan pihak yang menyetujui harus ditetapkan sebelum pilot.
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
            <span>{isBodSigned ? '✓ Pratinjau dibuka' : 'Buka kerangka keputusan'}</span>
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
                  STATUS DEMO: TIDAK MEREPRESENTASIKAN PERSETUJUAN TELKOMSEL
                </span>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                  Data dan hasil pada layar dibuat untuk demonstrasi; audit, persetujuan, dan hasil pilot belum tersedia.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsCertModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition"
              >
                <Award className="w-3.5 h-3.5 text-amber-300" />
                <span>Lihat Preview Dokumen Demo</span>
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {DECISION_GATE_CRITERIA.map((gate) => (
            <div 
              key={gate.id}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 font-mono">{gate.unit}</span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    BELUM DIUJI
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-xs mb-1">{gate.title}</h3>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">{gate.threshold}</p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800">
                <div className="text-[10px] text-slate-400 dark:text-slate-500">Hasil pilot:</div>
                <div className="text-sm font-black text-amber-800 dark:text-amber-300">Belum tersedia</div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-tight">Ambang dan bukti harus ditetapkan serta disetujui sebelum pilot.</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Tiga Horizon Ekspansi Bertahap (Tabel 7 Proposal) */}
      <div className="bg-white dark:bg-slate-900/70 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Roadmap 3 Tahap Implementasi & Kelayakan Finansial (Tabel 7 Proposal)
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Periode 2027 – 2031</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="font-bold text-slate-900 dark:text-slate-100 block">Tahap 1: Audit dan rancangan pilot</span>
            <p className="text-slate-600 dark:text-slate-400 font-medium">40 Lokasi Intervensi + 10 Kontrol</p>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
              Plafon awal yang diusulkan Rp95 juta untuk audit; baseline dan NPV belum dapat dipastikan sebelum data lokasi dan kontrak diperiksa.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="font-bold text-slate-900 dark:text-slate-100 block">Tahap 2: Evaluasi regional bersyarat</span>
            <p className="text-slate-600 dark:text-slate-400 font-medium">Cakupan ditentukan setelah hasil pilot</p>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
              Pertimbangkan hanya setelah hasil pilot, biaya marginal, izin aset, dan batas layanan ditinjau.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="font-bold text-slate-900 dark:text-slate-100 block">Tahap 3: Evaluasi perluasan</span>
            <p className="text-slate-600 dark:text-slate-400 font-medium">Skala dan waktu belum ditentukan</p>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
              Perluasan hanya dibahas jika bukti dampak, kelayakan, kesiapan operasi, dan pendanaan disetujui.
            </p>
          </div>
        </div>
      </div>

      {/* Timeline alur keputusan & Komparasi Nilai Tambah */}
      <div className="space-y-6 pt-2">
        <ExecutiveDecisionTimeline />
        <BeforeVsAfterComparison />
      </div>

      {/* Decision framework preview */}
      <BoDCertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
      />
    </div>
  );
}

