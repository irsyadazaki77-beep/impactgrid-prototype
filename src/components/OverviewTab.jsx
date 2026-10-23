import React, { useState } from 'react';
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
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { 
  SYSTEM_METADATA, 
  IMPLEMENTATION_HORIZONS, 
  HOURLY_PILOT_PROFILE, 
  PILOT_SITES_SAMPLE,
  DECISION_GATE_CRITERIA
} from '../data/mockData';
import IndonesiaGisMap from './IndonesiaGisMap';
import BoDCertificateModal from './BoDCertificateModal';

export default function OverviewTab({ 
  setActiveTab, 
  selectedScale = 'pilot', 
  activeLens = 'all', 
  emergencyState = { active: false },
  onOpenEmergencyModal,
  simState = { simHour: 14, tempC: 28, trafficMultiplier: 1.0, carrierSleepActive: true, simTimeString: '14:00 WIB' }
}) {
  const [selectedMetric, setSelectedMetric] = useState('power');
  const [showGisMap, setShowGisMap] = useState(false); // Collapsible: clean by default!
  const [isBodSigned, setIsBodSigned] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [telemetryPulse, setTelemetryPulse] = useState({
    activeBtsPower: 384.2,
    trafficThroughput: 84.6,
    co2AvoidedToday: 478.5,
    lastUpdate: 'Baru saja'
  });

  // Live Telemetry Simulation Effect (Every 4s)
  React.useEffect(() => {
    const timer = setInterval(() => {
      setTelemetryPulse({
        activeBtsPower: +(384 + (Math.random() * 4 - 2)).toFixed(1),
        trafficThroughput: +(84.5 + (Math.random() * 2.5 - 1.2)).toFixed(1),
        co2AvoidedToday: +(478.5 + (Math.random() * 0.8)).toFixed(1),
        lastUpdate: new Date().toLocaleTimeString('id-ID', { hour12: false })
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Dynamic 24-hour load curve responding to emergency state and global simulation conditions
  const dynamicHourlyData = HOURLY_PILOT_PROFILE.map(item => {
    const isCurrentSimHour = parseInt(item.hour, 10) === simState.simHour;
    if (emergencyState.active || !simState.carrierSleepActive) {
      // During emergency surge or non-sleep scenario: sleep mode deactivated, power restored to 100% capacity
      const scaledBaseline = +(item.baselineKW * (simState.trafficMultiplier > 1.5 ? 1.25 : 1.0)).toFixed(1);
      return {
        ...item,
        baselineKW: scaledBaseline,
        optimizedKW: scaledBaseline,
        savedKW: 0,
        isCurrent: isCurrentSimHour
      };
    }

    // Modulate by ambient temperature (HVAC compressor load) and traffic multiplier
    const weatherFactor = simState.tempC > 32 ? 1.12 : 1.0;
    const loadFactor = simState.trafficMultiplier > 1.2 ? 1.15 : 1.0;
    const dynamicBaseline = +(item.baselineKW * weatherFactor * loadFactor).toFixed(1);
    const dynamicOptimized = +(item.optimizedKW * (weatherFactor > 1 ? 1.05 : 1.0)).toFixed(1);

    return {
      ...item,
      baselineKW: dynamicBaseline,
      optimizedKW: dynamicOptimized,
      savedKW: Math.max(0, +(dynamicBaseline - dynamicOptimized).toFixed(1)),
      isCurrent: isCurrentSimHour
    };
  });

  // Data dinamis sesuai skala terpilih tanpa clutter
  const scaleData = {
    pilot: {
      scopeTitle: "Tahap Uji Coba (2027) • 40 Lokasi Uji & 10 Pembanding",
      sitesText: "40 + 10 Sites",
      savingKwYear: "200.000 kWh",
      grossSaving: "Rp 300 Juta",
      netBenefit: "Rp 240 Juta",
      npvText: "+Rp 460 Juta",
      npvSub: "WACC 10% (5 Tahun)",
      pbpText: "1,9 Tahun",
      emissionsText: "174 Ton CO2e",
      capexText: "Rp 450 Juta"
    },
    regional: {
      scopeTitle: "Fase Ekspansi Regional (2028–2029) • 5.000 Menara Jamali",
      sitesText: "5.000 BTS",
      savingKwYear: "5,80 GWh",
      grossSaving: "Rp 6,6 Miliar",
      netBenefit: "Rp 4,8 Miliar",
      npvText: "+Rp 11,7 Miliar",
      npvSub: "WACC 10% (5 Tahun)",
      pbpText: "1,35 Tahun",
      emissionsText: "5.046 Ton CO2e",
      capexText: "Rp 6,5 Miliar"
    },
    national: {
      scopeTitle: "Fase Perluasan Nasional (2030–2031) • 10.000+ Menara Makro",
      sitesText: "10.000+ BTS",
      savingKwYear: "14,60 GWh",
      grossSaving: "Rp 21,9 Miliar",
      netBenefit: "Rp 14,9 Miliar",
      npvText: "+Rp 41,48 Miliar",
      npvSub: "WACC 10% (5 Tahun)",
      pbpText: "1,00 Tahun",
      emissionsText: "12.702 Ton CO2e",
      capexText: "Rp 15,0 Miliar"
    }
  }[selectedScale];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Emergency Active Alert Banner (If CTO Stress-Test Triggered) */}
      {emergencyState.active && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow-md flex items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center space-x-3">
            <Flame className="w-5 h-5 text-amber-200 animate-pulse" />
            <div>
              <span className="font-extrabold text-xs block">CTO EMERGENCY STRESS DRILL AKTIF (TRAFIK +300%)</span>
              <p className="text-[11px] text-red-100">
                AI otomatis mematikan mode hemat dalam 120 ms. Seluruh kapasitas BTS disiagakan untuk panggilan darurat 112.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenEmergencyModal}
            className="px-3 py-1.5 rounded-xl bg-white text-red-700 font-bold text-xs hover:bg-red-50 transition cursor-pointer shrink-0"
          >
            Cek Respon SLA
          </button>
        </div>
      )}

      {/* 1. Clean Executive Header with Scope Indicator */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-bold">
              {scaleData.scopeTitle}
            </span>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>LIVE OSS & AMR: {telemetryPulse.activeBtsPower} kW</span>
            </div>
            <span className="text-[11px] text-slate-400">• Beban Listrik: 1,885 Miliar kWh/thn</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            ImpactGrid: Platform Keputusan Investasi Efisiensi Jaringan & ESG
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed font-normal">
            Memecahkan dilema dekarbonisasi dan biaya energi RAN Telkomsel melalui optimasi portofolio investasi yang memaksimalkan <strong>Net Present Value (NPV)</strong> sambil menggaransi <strong>QoS SLA &gt; 99,95%</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button 
            onClick={() => setActiveTab('scenariolab')}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 shadow-2xs"
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
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-md border border-slate-700 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700 pb-2.5">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
              Konteks Masalah Utama: Laporan Keberlanjutan Telkom 2025 & Dilema Operasional
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Sumber: Sustainability Report Telkom 2025 (hlm. 104 & 108)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
            <span className="text-[10px] text-amber-400 uppercase font-bold block">1. Skala Beban Energi Korporat</span>
            <div className="text-xl font-black text-white">1,885 Miliar kWh</div>
            <p className="text-[11px] text-slate-300">
              Total konsumsi listrik tahunan Telkomsel dengan estimasi tagihan PLN ~<strong>Rp 3,2 Triliun/tahun</strong>.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
            <span className="text-[10px] text-cyan-400 uppercase font-bold block">2. Emisi Scope 2 Dominan</span>
            <div className="text-xl font-black text-white">1,722 Juta ton CO₂e</div>
            <p className="text-[11px] text-slate-300">
              Menyumbang <strong>63,6%</strong> dari total emisi GRK Telkomsel, menjadikannya prioritas absolut dekarbonisasi.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
            <span className="text-[10px] text-red-400 uppercase font-bold block">3. Kesenjangan Integrasi (Data Silo)</span>
            <div className="text-sm font-bold text-white">IoT Envion vs PLN vs NOC</div>
            <p className="text-[11px] text-slate-300">
              Pemantauan energi eksisting terpisah dari penagihan keuangan & QoS SLA. ImpactGrid menyatukan ketiganya dalam 1 DSS.
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-300">
          <span>💡 <em>"Pembeda ImpactGrid adalah optimasi portofolio antarlokasi dan pembuktian manfaat kausal DiD."</em></span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('architecture')}
              className="text-red-400 hover:text-red-300 font-bold flex items-center gap-1 cursor-pointer"
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
        <div className={`bg-white rounded-2xl border p-5 shadow-xs space-y-3 transition ${
          activeLens === 'finance' ? 'border-amber-400 ring-2 ring-amber-100' : 'border-slate-200/90'
        }`}>
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Pilar 1: Finansial (CFO)</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-emerald-700 tracking-tight">{scaleData.npvText}</div>
            <p className="text-xs text-slate-600 font-semibold mt-0.5">
              Net Present Value ({scaleData.npvSub})
            </p>
          </div>
          <div className="pt-2.5 border-t border-slate-100 flex justify-between text-[11px] text-slate-500 font-medium">
            <span>Balik Modal: <strong className="text-slate-800">{scaleData.pbpText}</strong></span>
            <span>Net/Tahun: <strong className="text-emerald-700">{scaleData.netBenefit}</strong></span>
          </div>
        </div>

        {/* Pilar 2: Lingkungan / ESG */}
        <div className={`bg-white rounded-2xl border p-5 shadow-xs space-y-3 transition ${
          activeLens === 'esg' ? 'border-emerald-400 ring-2 ring-emerald-100' : 'border-slate-200/90'
        }`}>
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Pilar 2: Dampak Lingkungan (ESG)</span>
            <div className="p-1.5 rounded-lg bg-cyan-50 text-cyan-700">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">{scaleData.emissionsText}</div>
            <p className="text-xs text-slate-600 font-semibold mt-0.5">
              Reduksi Emisi Scope 2 / Tahun Terhindar
            </p>
          </div>
          <div className="pt-2.5 border-t border-slate-100 flex justify-between text-[11px] text-slate-500 font-medium">
            <span>Hemat Daya: <strong className="text-slate-800">{scaleData.savingKwYear}</strong></span>
            <span>Audit: <strong className="text-cyan-700">ITU-T L.1331</strong></span>
          </div>
        </div>

        {/* Pilar 3: Keandalan Jaringan */}
        <div className={`bg-white rounded-2xl border p-5 shadow-xs space-y-3 transition ${
          activeLens === 'network' ? 'border-blue-400 ring-2 ring-blue-100' : 'border-slate-200/90'
        }`}>
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Pilar 3: Keandalan Jaringan (CTO)</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-blue-700 tracking-tight">99,98%</div>
            <p className="text-xs text-slate-600 font-semibold mt-0.5">
              SLA Availability Terjaga (Zero Penalty)
            </p>
          </div>
          <div className="pt-2.5 border-t border-slate-100 flex justify-between text-[11px] text-slate-500 font-medium">
            <span>Fast-Wakeup: <strong className="text-slate-800">&lt; 120 ms</strong></span>
            <span>Kanal Darurat: <strong className="text-blue-700">112 Locked 100%</strong></span>
          </div>
        </div>
      </div>

      {/* 3. Collapsible Indonesia GIS Map */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <button
          onClick={() => setShowGisMap(!showGisMap)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50/80 transition cursor-pointer"
        >
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-red-50 text-red-600">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <span>Peta Geografis Sebaran 50 Lokasi Uji Coba Pilot (Jamali & Outer Islands)</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold">
                  {showGisMap ? 'Klik untuk Ciutkan' : 'Klik untuk Buka Peta Interaktif'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                40 Site Intervensi + 10 Site Kontrol dengan penanda status telemetri O-RAN
              </p>
            </div>
          </div>

          <div className="text-slate-400">
            {showGisMap ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>

        {showGisMap && (
          <div className="p-6 pt-0 border-t border-slate-100 space-y-3 animate-fade-in">
            <div className="h-[420px] rounded-xl overflow-hidden border border-slate-200 shadow-inner">
              <IndonesiaGisMap />
            </div>
            <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1">
              <div className="flex items-center space-x-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Intervensi Pendingin (26°C)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Intervensi RAN Sleep Mode
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Intervensi Gabungan (A+B)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Solar PV + BESS
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span> Kontrol Pembanding (DiD)
                </span>
              </div>
              <button 
                onClick={() => setActiveTab('telemetry')}
                className="text-red-600 font-bold hover:underline"
              >
                Lihat Tabel Detail 50 Site di Tab Telemetri →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. Kurva Beban Daya Dinamis 24 Jam */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Profil Konsumsi Daya Dinamis 24 Jam (Tahap Pilot 40 Lokasi)
              </span>
              {emergencyState.active && (
                <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-extrabold animate-pulse">
                  DRILL AKTIF: 100% KAPASITAS
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Perbandingan konsumsi listrik sebelum intervensi (Baseline) vs hasil optimasi closed-loop O-RAN.
            </p>
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl text-xs">
            <button
              onClick={() => setSelectedMetric('power')}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                selectedMetric === 'power' 
                  ? 'bg-white text-slate-900 shadow-2xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Beban Total (kW)
            </button>
            <button
              onClick={() => setSelectedMetric('saving')}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                selectedMetric === 'saving' 
                  ? 'bg-white text-slate-900 shadow-2xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Daya Dihemat (kW)
            </button>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dynamicHourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="baselineColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="optimizedColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="savedColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="hour" tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderColor: '#e2e8f0', 
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  fontSize: '12px',
                  color: '#0f172a'
                }} 
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />

              {selectedMetric === 'power' ? (
                <>
                  <Area 
                    type="monotone" 
                    dataKey="baselineKW" 
                    name="Baseline Terkoreksi (kW)" 
                    stroke="#ef4444" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#baselineColor)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="optimizedKW" 
                    name="Konsumsi Teroptimasi (kW)" 
                    stroke="#10b981" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#optimizedColor)" 
                  />
                </>
              ) : (
                <Area 
                  type="monotone" 
                  dataKey="savedKW" 
                  name="Daya Dihemat per Jam (kW)" 
                  stroke="#0284c7" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#savedColor)" 
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AMBANG BATAS KELANJUTAN (4 DECISION GATES TRACKER - TABEL 4 & PARAGRAF 33 EXEC SUMMARY) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-emerald-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Ambang Batas Kelanjutan Proyek (Go / No-Go Decision Gates - Paragraf 33)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Kriteria mutlak dewan direksi untuk meluluskan proyek dari Tahap Pilot (2027) ke Tahap Regional (2028).
            </p>
          </div>

          <button
            onClick={() => setIsBodSigned(!isBodSigned)}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer ${
              isBodSigned
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>{isBodSigned ? '✓ Disahkan BoD Telkomsel' : 'Simulasikan Pengesahan BoD'}</span>
          </button>
        </div>

        {isBodSigned && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in shadow-xs">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="font-black text-sm block text-emerald-900">
                  STATUS: DISETUJUI RESMI OLEH BOD UNTUK EKSPANSI REGIONAL (5.000 MENARA JAMALI)
                </span>
                <span className="text-[11px] text-emerald-700 font-medium">
                  Seluruh 4 ambang batas terpenuhi: Integritas Data 98,4%, Efisiensi Positif DiD, NPV +Rp460 Juta, dan SLA 99,98%.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsCertModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition"
              >
                <Award className="w-3.5 h-3.5 text-amber-300" />
                <span>Buka Sertifikat Kelulusan</span>
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {DECISION_GATE_CRITERIA.map((gate) => (
            <div 
              key={gate.id}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-slate-400 font-mono">{gate.unit}</span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {gate.status}
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-xs mb-1">{gate.title}</h3>
                <p className="text-[11px] text-slate-600 font-medium">{gate.threshold}</p>
              </div>

              <div className="pt-2 border-t border-slate-200/60">
                <div className="text-[10px] text-slate-400">Pencapaian Riil:</div>
                <div className="text-sm font-black text-emerald-700">{gate.currentValue}</div>
                <p className="text-[10px] text-slate-500 mt-1 leading-tight">{gate.evidence}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Tiga Horizon Ekspansi Bertahap (Tabel 7 Proposal) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Roadmap 3 Tahap Implementasi & Kelayakan Finansial (Tabel 7 Proposal)
          </h2>
          <span className="text-xs text-slate-500 font-medium">Periode 2027 – 2031</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="font-bold text-slate-900 block">Fase 1: Uji Coba 9 Bulan (2027)</span>
            <p className="text-slate-600 font-medium">40 Lokasi Intervensi + 10 Kontrol</p>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              CapEx Rp 450 Jt • Hemat 200 MWh/thn • Net Rp 240 Jt/thn • <strong>NPV +Rp 460 Jt (PBP 1,9 thn)</strong>.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="font-bold text-slate-900 block">Fase 2: Regional Jamali (2028–2029)</span>
            <p className="text-slate-600 font-medium">5.000 Menara Biaya Listrik Tinggi</p>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              CapEx Rp 6,5 M (Swadana) • Hemat 5,8 GWh/thn • Net Rp 4,8 M/thn • <strong>NPV +Rp 11,7 Miliar</strong>.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="font-bold text-slate-900 block">Fase 3: Skala Nasional (2030–2031)</span>
            <p className="text-slate-600 font-medium">10.000+ Menara Makro Terpilih</p>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              CapEx Rp 15 M • Hemat 14,6 GWh/thn • Net Rp 14,9 M/thn • <strong>NPV +Rp 41,48 Miliar (PBP 1,0 thn)</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Official BoD Approval Certificate Modal */}
      <BoDCertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
      />
    </div>
  );
}
