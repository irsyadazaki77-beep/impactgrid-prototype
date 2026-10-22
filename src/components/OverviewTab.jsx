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
  ShieldAlert
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
  PILOT_SITES_SAMPLE 
} from '../data/mockData';
import IndonesiaGisMap from './IndonesiaGisMap';

export default function OverviewTab({ 
  setActiveTab, 
  selectedScale = 'pilot', 
  activeLens = 'all', 
  emergencyState = { active: false },
  onOpenEmergencyModal
}) {
  const [selectedMetric, setSelectedMetric] = useState('power');
  const [showGisMap, setShowGisMap] = useState(false); // Collapsible: clean by default!
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

  const pilot = IMPLEMENTATION_HORIZONS.pilot;

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
            <span>Listrik Dihemat: <strong className="text-slate-800">{scaleData.savingKwYear}</strong></span>
            <span>Faktor Grid: <strong>0,87 kg/kWh</strong></span>
          </div>
        </div>

        {/* Pilar 3: Mutu Layanan (QoS SLA) */}
        <div className={`bg-white rounded-2xl border p-5 shadow-xs space-y-3 transition ${
          activeLens === 'network' ? 'border-cyan-400 ring-2 ring-cyan-100' : 'border-slate-200/90'
        }`}>
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Pilar 3: Mutu Layanan (CTO)</span>
            <div className="p-1.5 rounded-lg bg-rose-50 text-[#ED0226]">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">99,98%</div>
            <p className="text-xs text-slate-600 font-semibold mt-0.5">
              Availability Jaringan (Target SLA &gt; 99,95%)
            </p>
          </div>
          <div className="pt-2.5 border-t border-slate-100 flex justify-between text-[11px] text-slate-500 font-medium">
            <span>Keluhan Layanan: <strong className="text-emerald-700">0 Anomali</strong></span>
            <span>Safety Guardrail: <strong className="text-emerald-700">112 Ready</strong></span>
          </div>
        </div>
      </div>

      {/* 3. Peta Geospasial Nusantara Interaktif (Nusantara GIS Control Tower) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-red-50 text-[#ED0226]">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Peta Geospasial Nusantara: Sebaran 293.136 BTS Nasional</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Live Monitoring
                </span>
              </h2>
              <p className="text-[11px] text-slate-500">
                Arahkan kursor pada pin kluster regional untuk melihat beban MW aktif, penghematan, status AI, dan suhu PUE shelter.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono font-semibold text-slate-400 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shrink-0">
            7 Wilayah Operasional Telkomsel
          </span>
        </div>

        <div className="p-4 sm:p-6 bg-slate-50/30">
          <IndonesiaGisMap />
        </div>
      </div>

      {/* 4. Grafik Profil Beban Listrik 24 Jam (ITU-T L.1331) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>Profil Konsumsi Listrik 24 Jam pada 40 Lokasi Intervensi</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                ITU-T L.1331 Terkoreksi Trafik
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Perbandingan beban daya dasar vs beban teroptimasi intervensi pendinginan (26°C) dan sleep mode saat jam sepi.
            </p>
          </div>

          <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
            <button
              onClick={() => setSelectedMetric('power')}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${selectedMetric === 'power' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Beban Total (kW)
            </button>
            <button
              onClick={() => setSelectedMetric('savings')}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${selectedMetric === 'savings' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Penghematan (kW)
            </button>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={HOURLY_PILOT_PROFILE} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="baselineColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="optimizedColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="savedColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
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
    </div>
  );
}
