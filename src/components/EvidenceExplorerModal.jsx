import React, { useState, useMemo } from 'react';
import { 
  Building, 
  Search, 
  Filter, 
  MapPin, 
  Activity, 
  Zap, 
  Thermometer, 
  Radio, 
  TrendingDown, 
  Database, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  X,
  ExternalLink,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  BarChart,
  Bar
} from 'recharts';
import { PILOT_SITES_SAMPLE } from '../data/mockData';

export default function EvidenceExplorerModal({ 
  isOpen, 
  onClose, 
  initialSiteId = null,
  simState = { plnTariffIDR: 1500, tempC: 28, trafficMultiplier: 1.0 }
}) {
  const [selectedId, setSelectedId] = useState(initialSiteId || PILOT_SITES_SAMPLE[0]?.id || 'LOC-INT-001');
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'Intervensi' | 'Pembanding'
  const [filterVendor, setFilterVendor] = useState('ALL');

  // Update selected site when initialSiteId changes
  React.useEffect(() => {
    if (initialSiteId) {
      setSelectedId(initialSiteId);
    }
  }, [initialSiteId]);

  if (!isOpen) return null;

  const filteredSites = PILOT_SITES_SAMPLE.filter(s => {
    if (filterType !== 'ALL' && s.type !== filterType) return false;
    if (filterVendor !== 'ALL' && s.vendor !== filterVendor) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.city.toLowerCase().includes(q);
    }
    return true;
  });

  const currentSite = PILOT_SITES_SAMPLE.find(s => s.id === selectedId) || filteredSites[0] || PILOT_SITES_SAMPLE[0];

  // Derive dynamic telemetry for this site based on central simulation state
  const dynamicTempC = Math.round(currentSite.shelterTempC + ((simState.tempC || 28) - 28) * 0.4);
  const dynamicTrafficGB = Math.round(currentSite.trafficDailyGB * (simState.trafficMultiplier || 1.0));
  const dynamicIntensity = +(currentSite.energyIntensityKWhPerTB * (simState.trafficMultiplier > 1.2 ? 0.92 : 1.0)).toFixed(1);
  const dynamicEmissionsTon = +(currentSite.emissionsReducedTon * ((simState.plnTariffIDR || 1500) / 1500)).toFixed(2);

  // Generate 24-hour comparative synthetic telemetry curve for selected site
  const hourlyCurve = [
    { hour: '00:00', baselineKw: 4.8, actualKw: currentSite.type === 'Intervensi' ? 3.9 : 4.8, loadPct: 22 },
    { hour: '03:00', baselineKw: 4.5, actualKw: currentSite.type === 'Intervensi' ? 3.3 : 4.6, loadPct: 14 },
    { hour: '06:00', baselineKw: 4.9, actualKw: currentSite.type === 'Intervensi' ? 4.1 : 4.9, loadPct: 38 },
    { hour: '09:00', baselineKw: 5.6, actualKw: currentSite.type === 'Intervensi' ? 5.1 : 5.7, loadPct: 78 },
    { hour: '12:00', baselineKw: 5.9, actualKw: currentSite.type === 'Intervensi' ? 5.3 : 6.0, loadPct: 92 },
    { hour: '15:00', baselineKw: 5.8, actualKw: currentSite.type === 'Intervensi' ? 5.2 : 5.8, loadPct: 88 },
    { hour: '18:00', baselineKw: 6.2, actualKw: currentSite.type === 'Intervensi' ? 5.8 : 6.2, loadPct: 98 },
    { hour: '21:00', baselineKw: 5.7, actualKw: currentSite.type === 'Intervensi' ? 4.9 : 5.7, loadPct: 82 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-5xl w-full border border-slate-200 shadow-2xl flex flex-col h-[85vh] max-h-[760px] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <Database className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-sm text-white tracking-tight">Evidence Explorer BTS Telemetry</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  SYNTHETIC EVIDENCE MODEL
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Pemeriksaan bukti empiris per lokasi: konsumsi energi, profil trafik, sensor suhu, emisi Scope 2, dan metadata audit trail.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Master-Detail Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Master List (40 Intervensi + 10 Kontrol) */}
          <div className="w-full md:w-80 border-r border-slate-200 bg-slate-50 flex flex-col shrink-0">
            {/* Search & Quick Filter */}
            <div className="p-3 border-b border-slate-200 space-y-2 bg-white">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari BTS (ID, nama, kota)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div className="flex items-center gap-1 text-[11px]">
                <button
                  onClick={() => setFilterType('ALL')}
                  className={`px-2 py-1 rounded-lg font-bold transition cursor-pointer ${
                    filterType === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Semua ({PILOT_SITES_SAMPLE.length})
                </button>
                <button
                  onClick={() => setFilterType('Intervensi')}
                  className={`px-2 py-1 rounded-lg font-bold transition cursor-pointer ${
                    filterType === 'Intervensi' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Uji (40)
                </button>
                <button
                  onClick={() => setFilterType('Pembanding')}
                  className={`px-2 py-1 rounded-lg font-bold transition cursor-pointer ${
                    filterType === 'Pembanding' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Kontrol (10)
                </button>
              </div>
            </div>

            {/* List items */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
              {filteredSites.map(s => {
                const isSelected = s.id === currentSite.id;
                const isTreat = s.type === 'Intervensi';
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedId(s.id)}
                    className={`w-full text-left p-2.5 rounded-xl transition cursor-pointer border ${
                      isSelected 
                        ? 'bg-white border-red-500 shadow-xs ring-1 ring-red-400' 
                        : 'bg-white/60 hover:bg-white border-slate-200/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-mono text-[10px] font-bold text-slate-500">{s.id}</span>
                      <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${
                        isTreat ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {isTreat ? 'INTERVENSI' : 'KONTROL'}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 truncate">{s.name}</div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 font-mono">
                      <span>{s.city} • {s.vendor}</span>
                      <span className={isTreat ? 'text-emerald-700 font-bold' : 'text-slate-500'}>
                        {isTreat ? `-${s.currentEffPct}%` : 'Baseline'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Detail Pane */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 bg-white">
            
            {/* BTS Identity & Source Attribution Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                      {currentSite.id}
                    </span>
                    <h3 className="text-base font-black text-slate-900">{currentSite.name}</h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {currentSite.cluster} • {currentSite.towerType} • Vendor: <strong>{currentSite.vendor}</strong>
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className={`inline-block px-2.5 py-1 rounded-xl text-xs font-bold ${
                    currentSite.type === 'Intervensi' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {currentSite.type === 'Intervensi' ? 'Intervention Cohort' : 'Quasi-Control Benchmark'}
                  </span>
                </div>
              </div>

              {/* Data Provenance & Evidence Sources */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1">
                <div className="p-2 rounded-xl bg-white border border-slate-200">
                  <span className="text-[9px] text-slate-400 uppercase font-bold block">Smart Meter (AMR)</span>
                  <span className="font-mono text-emerald-700 font-bold">PLN AMR Online</span>
                  <span className="text-[9px] text-slate-400 block">Polling: 15 Menit</span>
                </div>
                <div className="p-2 rounded-xl bg-white border border-slate-200">
                  <span className="text-[9px] text-slate-400 uppercase font-bold block">RAN Telemetry</span>
                  <span className="font-mono text-indigo-700 font-bold">{currentSite.vendor} EMS O1</span>
                  <span className="text-[9px] text-slate-400 block">PM Counter: ITU-T</span>
                </div>
                <div className="p-2 rounded-xl bg-white border border-slate-200">
                  <span className="text-[9px] text-slate-400 uppercase font-bold block">Sensor Lingkungan</span>
                  <span className="font-mono text-cyan-700 font-bold">IoT Modbus RTU</span>
                  <span className="text-[9px] text-slate-400 block">Suhu & PUE Shelter</span>
                </div>
                <div className="p-2 rounded-xl bg-white border border-slate-200">
                  <span className="text-[9px] text-slate-400 uppercase font-bold block">Kategori Label</span>
                  <span className="font-mono text-amber-700 font-bold">SYNTHETIC_DATA</span>
                  <span className="text-[9px] text-slate-400 block">Model Kalibrasi</span>
                </div>
              </div>
            </div>

            {/* 4 Core Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500" /> Konsumsi Listrik
                </span>
                <div className="text-xl font-black text-slate-900">
                  {currentSite.baselineKWhYear.toLocaleString('id-ID')} <span className="text-xs font-semibold text-slate-400">kWh/Thn</span>
                </div>
                <span className={`text-[10px] font-bold block ${
                  currentSite.type === 'Intervensi' ? 'text-emerald-700' : 'text-slate-500'
                }`}>
                  {currentSite.type === 'Intervensi' ? `Hemat: ${currentSite.savedKWh} kWh (-${currentSite.currentEffPct}%)` : 'Sebagai Kontrol Pembanding'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5 text-cyan-500" /> Beban Trafik Harian
                </span>
                <div className="text-xl font-black text-cyan-900">
                  {dynamicTrafficGB.toLocaleString('id-ID')} <span className="text-xs font-semibold text-slate-400">GB/Hari</span>
                </div>
                <span className="text-[10px] text-slate-500 block font-mono">
                  Intensitas: {dynamicIntensity} kWh/TB
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-rose-500" /> Termal Shelter & PUE
                </span>
                <div className="text-xl font-black text-slate-900">
                  {dynamicTempC}°C <span className="text-xs font-semibold text-slate-400">PUE {currentSite.pue}</span>
                </div>
                <span className="text-[10px] text-emerald-700 font-bold block">
                  Batas Aman Maksimal: 28°C
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5 text-emerald-500" /> Reduksi Emisi Scope 2
                </span>
                <div className="text-xl font-black text-emerald-700">
                  {dynamicEmissionsTon} <span className="text-xs font-semibold text-slate-400">Ton CO2e</span>
                </div>
                <span className="text-[10px] text-slate-500 block font-mono">
                  Faktor: 0,87 kg CO2/kWh
                </span>
              </div>
            </div>

            {/* 24-Hour Telemetry Synthetic Profile Chart */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">Kurva Beban Daya 24 Jam (kW Baseline vs Hasil Intervensi)</span>
                  <span className="text-[11px] text-slate-500">Membuktikan efek intervensi saat jam off-peak (01:00-05:00 WIB)</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white border border-slate-200 text-slate-700">
                  Sinkron: {simState.simTimeString || '14:00 WIB'}
                </span>
              </div>

              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={hourlyCurve}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
                    <YAxis unit=" kW" tick={{ fontSize: 11 }} domain={[2, 7]} />
                    <Tooltip 
                      formatter={(val, name) => [`${val} kW`, name === 'baselineKw' ? 'Baseline Tanpa AI' : 'Hasil Intervensi AI']}
                      contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
                    />
                    <Area type="monotone" dataKey="baselineKw" stroke="#94a3b8" fill="#e2e8f0" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="actualKw" stroke="#10b981" fill="#10b981" fillOpacity={0.25} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Evidence & Anomaly Check Box */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Status Integritas & Anomali Beban
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                  {currentSite.phantomStatus} (Phantom Load: {currentSite.phantomLoadWatt} W)
                </span>
              </div>

              <div className="text-[11px] text-slate-600 leading-relaxed space-y-1">
                <p>
                  <strong>Intervensi Aktif:</strong> {currentSite.intervensiUtama || 'Baseline Operational Watchdog'}.
                </p>
                <p>
                  <strong>Verifikasi SLA:</strong> Latency Delta tercatat <strong>+{currentSite.latencyDeltaMs}ms</strong> (margin aman CTO &lt; 2ms), ketersediaan jaringan {currentSite.qosSLA}.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs shrink-0">
          <span className="text-slate-500 font-medium">
            Data telemetri ditandai sebagai <strong>SYNTHETIC MODEL</strong> untuk simulasi evaluasi uji coba 40 BTS.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition cursor-pointer"
          >
            Tutup Explorer
          </button>
        </div>

      </div>
    </div>
  );
}
