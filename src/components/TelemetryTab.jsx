import React, { useMemo, useState } from 'react';
import { 
  Radio, 
  Search, 
  Filter, 
  RefreshCw, 
  Database, 
  CheckCircle2, 
  AlertTriangle,
  Layers,
  FileSpreadsheet,
  Building,
  Zap,
  Activity,
  SunMedium,
  ShieldCheck,
  Flame,
  Upload,
  X,
  ArrowRight,
  TrendingDown,
  Clock,
  Cpu,
  MapPin,
  Check
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  PILOT_SITES_SAMPLE, 
  HOURLY_PILOT_PROFILE, 
  SYSTEM_METADATA 
} from '../data/mockData';

export default function TelemetryTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL'); // 'ALL' | 'Intervensi' | 'Pembanding'
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [selectedVendor, setSelectedVendor] = useState('ALL');
  const [anomalyFilter, setAnomalyFilter] = useState('ALL'); // 'ALL' | 'ANOMALY_ONLY' | 'DISCREPANCY_ONLY'
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedSiteDetail, setSelectedSiteDetail] = useState(null);
  const [isIngestionModalOpen, setIsIngestionModalOpen] = useState(false);
  const [ingestionPhase, setIngestionPhase] = useState(0); // 0: Idle, 1: Connecting, 2: Fetching, 3: Reconciling, 4: Done
  const [injectedIncident, setInjectedIncident] = useState(null); // null | 'RECTIFIER_LEAK' | 'SMART_METER_DESYNC'
  const [isInjectorOpen, setIsInjectorOpen] = useState(false);

  const handleRunIngestionTest = () => {
    setIsIngestionModalOpen(true);
    setIngestionPhase(1);
    setTimeout(() => setIngestionPhase(2), 700);
    setTimeout(() => setIngestionPhase(3), 1500);
    setTimeout(() => setIngestionPhase(4), 2200);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const currentSitesSample = useMemo(() => {
    return PILOT_SITES_SAMPLE.map(site => {
      if (injectedIncident === 'RECTIFIER_LEAK' && site.id === 'TSEL-JTG-014') {
        return {
          ...site,
          phantomLoadWatts: 184,
          phantomStatus: 'ANOMALY_HIGH',
          phantomAnomalyReason: 'Degradasi efisiensi konverter rectifier <84% (Injeksi Insiden)'
        };
      }
      if (injectedIncident === 'SMART_METER_DESYNC' && site.id === 'TSEL-JBR-008') {
        return {
          ...site,
          smartMeterStatus: 'DISCREPANCY_FLAGGED',
          smartMeterDiscrepancyReason: 'Packet loss AMR PLN vs Sub-meter Radio draw (Injeksi Insiden)'
        };
      }
      return site;
    });
  }, [injectedIncident]);

  const filteredSites = currentSitesSample.filter(site => {
    const matchesSearch = site.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          site.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          site.cluster.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'ALL' || site.type.includes(selectedType);
    const matchesRegion = selectedRegion === 'ALL' || site.region === selectedRegion;
    const matchesVendor = selectedVendor === 'ALL' || site.vendor === selectedVendor;
    
    let matchesAnomaly = true;
    if (anomalyFilter === 'ANOMALY_ONLY') {
      matchesAnomaly = site.phantomStatus !== 'NORMAL';
    } else if (anomalyFilter === 'DISCREPANCY_ONLY') {
      matchesAnomaly = site.smartMeterStatus === 'DISCREPANCY_FLAGGED';
    }

    return matchesSearch && matchesType && matchesRegion && matchesVendor && matchesAnomaly;
  });

  const totalAnomalies = currentSitesSample.filter(s => s.phantomStatus !== 'NORMAL').length;
  const totalDiscrepancies = currentSitesSample.filter(s => s.smartMeterStatus === 'DISCREPANCY_FLAGGED').length;

  return (
    <div className="space-y-6">
      {/* Module 1 Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-xs font-bold text-cyan-800">
                <Radio className="w-3.5 h-3.5 text-cyan-600" />
                <span>Modul 1: Network Data Hub (demo)</span>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                💡 Pertanyaan Kunci: Bagaimana data multi-vendor & faktur PLN disatukan secara akurat?
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
              Rancangan konsolidasi telemetri dan rekonsiliasi energi
            </h1>
            <p className="text-xs text-slate-600 max-w-3xl leading-relaxed mt-1">
              Prototype ini tidak terhubung ke vendor, smart meter, tagihan, atau data aktual. Tabel, status, anomali, nama site, dan vendor pada halaman ini adalah contoh sintetis untuk memperagakan rancangan alur.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Live Incident Injector */}
            <div className="relative">
              <button
                onClick={() => setIsInjectorOpen(!isInjectorOpen)}
                className="flex items-center space-x-2 px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs cursor-pointer transition shadow-xs"
                title="Ubah data contoh lokal; tidak mengubah perangkat atau data lapangan"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-slate-950" />
                <span>Simulasikan anomali demo</span>
              </button>
              {isInjectorOpen && (
                <div className="absolute right-0 mt-2 w-72 p-3 bg-slate-900 border border-slate-700 text-white rounded-2xl shadow-2xl z-30 space-y-2 text-xs">
                  <div className="font-extrabold text-[11px] text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-1.5 flex justify-between items-center">
                    <span>Contoh anomali sintetis:</span>
                    <button onClick={() => setIsInjectorOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
                  </div>
                  <button
                    onClick={() => {
                      setInjectedIncident('RECTIFIER_LEAK');
                      setIsInjectorOpen(false);
                      const site = currentSitesSample.find(s => s.id === 'TSEL-JTG-014');
                      if (site) setSelectedSiteDetail(site);
                    }}
                    className="w-full text-left p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition cursor-pointer space-y-0.5"
                  >
                    <strong className="text-amber-300 block text-[11px]">⚡ Injeksi: Rectifier Degradasi</strong>
                    <p className="text-[10px] text-slate-400">Baris demo TSEL-JTG-014 (contoh +184W)</p>
                  </button>
                  <button
                    onClick={() => {
                      setInjectedIncident('SMART_METER_DESYNC');
                      setIsInjectorOpen(false);
                      const site = currentSitesSample.find(s => s.id === 'TSEL-JBR-008');
                      if (site) setSelectedSiteDetail(site);
                    }}
                    className="w-full text-left p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition cursor-pointer space-y-0.5"
                  >
                    <strong className="text-cyan-300 block text-[11px]">📡 Injeksi: Desinkronisasi PLN AMR</strong>
                    <p className="text-[10px] text-slate-400">Baris demo TSEL-JBR-008 (contoh packet drop)</p>
                  </button>
                  {injectedIncident && (
                    <button
                      onClick={() => {
                        setInjectedIncident(null);
                        setIsInjectorOpen(false);
                      }}
                      className="w-full text-center py-1.5 rounded-lg bg-red-600/30 hover:bg-red-600/50 text-red-300 font-bold text-[10px] cursor-pointer"
                    >
                      🔄 Reset Seluruh Site ke Normal
                    </button>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={handleRunIngestionTest}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold cursor-pointer transition shadow-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Simulasikan alur ingesti</span>
            </button>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold cursor-pointer transition shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-600' : 'text-slate-600'}`} />
              <span>{isRefreshing ? 'Memuat...' : 'Muat ulang contoh'}</span>
            </button>
          </div>
        </div>

        {/* Live Incident Notification Alert */}
        {injectedIncident && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-fade-in shadow-xs">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <span className="font-black text-sm text-slate-900 block">
                  SIMULASI DATA CONTOH: {injectedIncident === 'RECTIFIER_LEAK' ? 'Anomali rectifier pada baris TSEL-JTG-014 (+184 Watt)' : 'Selisih tagihan contoh pada baris TSEL-JBR-008'}
                </span>
                <span className="text-[11px] text-slate-600">
                  Perubahan hanya mengubah nilai demo lokal. Tidak ada AI deteksi atau tiket operasi yang dijalankan.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const siteId = injectedIncident === 'RECTIFIER_LEAK' ? 'TSEL-JTG-014' : 'TSEL-JBR-008';
                  const target = currentSitesSample.find(s => s.id === siteId);
                  if (target) setSelectedSiteDetail(target);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition cursor-pointer shrink-0"
              >
                Buka Diagnosis Deep-Dive
              </button>
              <button
                onClick={() => setInjectedIncident(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-200 text-slate-800 font-bold text-xs hover:bg-slate-300 transition cursor-pointer shrink-0"
              >
                Pulihkan
              </button>
            </div>
          </div>
        )}

        {/* 4 Pipa Data Utama Network Data Hub */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
            <span className="text-slate-500 font-semibold block text-[11px]">Pipa Meter & Tagihan PLN</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Belum ada koneksi meter
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
            <span className="text-slate-500 font-semibold block text-[11px]">Multi-Vendor RAN Ingestion</span>
            <span className="text-cyan-800 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600" />
              Integrasi belum diuji
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
            <span className="text-slate-500 font-semibold block text-[11px]">Deteksi Phantom Load</span>
            <span className={`font-bold flex items-center gap-1.5 ${totalAnomalies > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              {totalAnomalies} anomali pada data demo
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
            <span className="text-slate-500 font-semibold block text-[11px]">Kelengkapan data (target usulan)</span>
            <span className="text-indigo-700 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              Kelengkapan aktual belum diketahui
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 text-xs">
          {/* Search Box */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              aria-label="Cari lokasi BTS"
              placeholder="Cari Site ID, Nama BTS, atau Kota..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-cyan-600 text-xs bg-slate-50 focus:bg-white transition"
            />
          </div>

          {/* Type Filter */}
          <div className="lg:col-span-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
            >
              <option value="ALL">Semua Tipe (50)</option>
              <option value="Intervensi">Intervensi Saja (40)</option>
              <option value="Pembanding">Kontrol Pembanding (10)</option>
            </select>
          </div>

          {/* Region Filter */}
          <div className="lg:col-span-2">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
            >
              <option value="ALL">Semua Wilayah</option>
              <option value="Jabodetabek">Jabodetabek</option>
              <option value="Jawa Barat">Jawa Barat</option>
              <option value="Jawa Timur">Jawa Timur</option>
              <option value="Jawa Tengah">Jateng & DIY</option>
              <option value="Bali-Nusra">Bali-Nusra</option>
              <option value="Sumatera">Sumatera</option>
              <option value="Kalimantan">Kalimantan</option>
              <option value="Sulampua">Sulampua</option>
            </select>
          </div>

          {/* Vendor Filter */}
          <div className="lg:col-span-2">
            <select
              value={selectedVendor}
              onChange={(e) => setSelectedVendor(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
            >
              <option value="ALL">Semua Vendor</option>
              <option value="Ericsson">Ericsson</option>
              <option value="Huawei">Huawei</option>
              <option value="ZTE">ZTE</option>
              <option value="Nokia">Nokia</option>
            </select>
          </div>

          {/* Anomaly Filter */}
          <div className="lg:col-span-2">
            <select
              value={anomalyFilter}
              onChange={(e) => setAnomalyFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
            >
              <option value="ALL">Semua Kondisi</option>
              <option value="ANOMALY_ONLY">Anomali Phantom Saja ({totalAnomalies})</option>
              <option value="DISCREPANCY_ONLY">Selisih PLN Saja ({totalDiscrepancies})</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>Menampilkan <strong>{filteredSites.length}</strong> dari <strong>{PILOT_SITES_SAMPLE.length}</strong> lokasi pemantauan terverifikasi</span>
          <span className="text-[11px] text-cyan-700 font-bold">Pilih kartu lokasi untuk melihat profil telemetri 24 jam</span>
        </div>
      </div>

      {/* Grid of BTS Sites */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSites.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center" role="status">
            <Search className="mx-auto mb-3 h-7 w-7 text-slate-400" />
            <h3 className="text-base font-bold text-slate-900">Tidak ada lokasi yang cocok</h3>
            <p className="mt-1 text-sm text-slate-600">Ubah kata kunci atau longgarkan filter wilayah, vendor, maupun kondisi.</p>
            <button type="button" onClick={() => { setSearchQuery(''); setSelectedType('ALL'); setSelectedRegion('ALL'); setSelectedVendor('ALL'); setAnomalyFilter('ALL'); }} className="mt-4 rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50">Hapus semua filter</button>
          </div>
        ) : filteredSites.map((site) => {
          const isIntervention = site.type === 'Intervensi';
          const isAnomaly = site.phantomStatus !== 'NORMAL';

          return (
            <div 
              key={site.id} 
              onClick={() => setSelectedSiteDetail(site)}
              onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedSiteDetail(site); } }}
              role="button"
              tabIndex={0}
              aria-label={`Lihat telemetri ${site.name}, ${site.id}`}
              className={`p-5 rounded-3xl bg-white border transition shadow-xs hover:shadow-md cursor-pointer space-y-3.5 relative overflow-hidden ${
                isAnomaly ? 'border-amber-300 ring-1 ring-amber-100' : 'border-slate-200 hover:border-cyan-300'
              }`}
            >
              {/* Type Badge Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-red-600 uppercase tracking-wider">{site.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isIntervention 
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {site.type}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-1 leading-snug">{site.name}</h3>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{site.city} • {site.vendor}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`text-xs font-black px-2 py-1 rounded-xl block ${
                    isIntervention ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 bg-slate-100'
                  }`}>
                    {site.currentEffPct > 0 ? `+${site.currentEffPct}%` : `${site.currentEffPct}%`}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Efisiensi</span>
                </div>
              </div>

              {/* Status Tags */}
              <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                  {site.towerType}
                </span>

                {isAnomaly ? (
                  <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-bold border border-amber-200 flex items-center gap-1">
                    <Flame className="w-2.5 h-2.5 text-amber-600" />
                    Phantom: {site.phantomLoadWatt}W
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                    Rectifier Normal
                  </span>
                )}

                {site.smartMeterStatus === 'DISCREPANCY_FLAGGED' && (
                  <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-bold border border-rose-200">
                    Discrepancy Meter
                  </span>
                )}
              </div>

              {/* Metric Breakdown */}
              <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-slate-100">
                <div className="p-2 rounded-xl bg-slate-50">
                  <span className="text-[10px] text-slate-400 block">Listrik Dihemat</span>
                  <span className="font-bold text-slate-900">{site.savedKWh.toLocaleString('id-ID')} kWh</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50">
                  <span className="text-[10px] text-slate-400 block">Penghematan</span>
                  <span className="font-bold text-emerald-700">Rp {(site.costSavedIDR / 1000000).toFixed(1)} Jt</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50">
                  <span className="text-[10px] text-slate-400 block">QoS Latensi</span>
                  <span className="font-bold text-slate-900">{site.qosLatencyMs} ms</span>
                </div>
              </div>

              {/* Intervention Label */}
              <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl flex items-center justify-between">
                <span className="truncate pr-2 font-medium">{site.intervensiUtama}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Site Detail Deep-Dive Modal */}
      {selectedSiteDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto text-slate-800">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-red-600 uppercase tracking-wider">{selectedSiteDetail.id}</span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800">
                    {selectedSiteDetail.type}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    Vendor: {selectedSiteDetail.vendor}
                  </span>
                </div>
                <h2 className="text-lg font-black text-slate-900 mt-1">{selectedSiteDetail.name}</h2>
                <p className="text-xs text-slate-500">
                  {selectedSiteDetail.cluster} • Koordinat: [{selectedSiteDetail.lat}, {selectedSiteDetail.lng}]
                </p>
              </div>

              <button 
                onClick={() => setSelectedSiteDetail(null)}
                aria-label="Tutup rincian lokasi"
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 24-Hour Load Profile Chart for this Site */}
            <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-cyan-600" />
                  Profil Beban Daya 24 Jam (Baseline vs ImpactGrid AI Optimized)
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold">Terkoreksi Trafik 3GPP</span>
              </div>

              <div className="h-48 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={HOURLY_PILOT_PROFILE}>
                    <defs>
                      <linearGradient id="baselineColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="optColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={10} domain={['dataMin - 10', 'dataMax + 10']} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }} />
                    <Area type="monotone" dataKey="baselineKW" name="Baseline Beban (kW)" stroke="#64748b" strokeWidth={2} fillOpacity={1} fill="url(#baselineColor)" />
                    <Area type="monotone" dataKey="optimizedKW" name="ImpactGrid Teroptimasi (kW)" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#optColor)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Operational Deep-Dive Parameters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Baseline Tahunan</span>
                <span className="font-bold text-slate-900">{selectedSiteDetail.baselineKWhYear.toLocaleString('id-ID')} kWh</span>
                <span className="text-[10px] text-slate-400 block">137 kWh/hari rata-rata</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Beban Trafik Harian</span>
                <span className="font-bold text-cyan-800">{selectedSiteDetail.trafficDailyGB} GB/hari</span>
                <span className="text-[10px] text-slate-400 block">{selectedSiteDetail.energyIntensityKWhPerTB} kWh/TB</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Suhu Shelter & PUE</span>
                <span className="font-bold text-slate-900">{selectedSiteDetail.shelterTempC}°C</span>
                <span className="text-[10px] text-emerald-700 block font-semibold">PUE {selectedSiteDetail.pue}</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Status Meter PLN</span>
                <span className={`font-bold block ${selectedSiteDetail.smartMeterStatus === 'ONLINE_RECONCILED' ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {selectedSiteDetail.smartMeterStatus === 'ONLINE_RECONCILED' ? '100% Cocok' : 'Selisih Tagihan'}
                </span>
                <span className="text-[10px] text-slate-400 block">AMR Smart Meter</span>
              </div>
            </div>

            {/* Diagnosis & Field Recommendation */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                Diagnosis Cerdas & Rekomendasi Aksi Lapangan ImpactGrid:
              </span>
              <p className="text-slate-600 leading-relaxed font-normal">
                {selectedSiteDetail.phantomStatus === 'NORMAL' ? (
                  <>Lokasi beroperasi optimal dengan rectifier efisiensi tinggi (<strong>{selectedSiteDetail.rectifierHealth}</strong>) dan phantom load minimal ({selectedSiteDetail.phantomLoadWatt}W). Rekomendasi intervensi: <strong>{selectedSiteDetail.intervensiUtama}</strong> dengan estimasi manfaat bersih <strong>Rp {(selectedSiteDetail.netAnnualBenefitIDR / 1000000).toFixed(1)} Juta/tahun</strong>.</>
                ) : (
                  <>Terdeteksi anomali <strong>Phantom Load sebesar {selectedSiteDetail.phantomLoadWatt} Watt</strong> pada modul pendingin/rectifier shelter. Direkomendasikan kalibrasi sensor temperatur dan peremajaan sambungan rectifier DC guna memulihkan inefisiensi energi sebelum mengaktifkan micro-sleep carrier penuh.</>
                )}
              </p>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedSiteDetail(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition cursor-pointer"
              >
                Tutup Rincian
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ingestion Pipeline Simulation Modal */}
      {isIngestionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-200 space-y-5 text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Pipeline Ingesti Telemetri Multi-Vendor</h3>
                  <p className="text-[11px] text-slate-500">O-RAN O1 Adapter & Smart Meter AMR PLN</p>
                </div>
              </div>
              {ingestionPhase === 4 && (
                <button 
                  onClick={() => setIsIngestionModalOpen(false)}
                  aria-label="Tutup dialog ingesti"
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Stepper */}
            <div className="space-y-3 text-xs">
              <div className={`p-3 rounded-2xl border transition flex items-center gap-3 ${
                ingestionPhase >= 1 ? 'bg-cyan-50 border-cyan-200 text-cyan-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}>
                {ingestionPhase > 1 ? <Check className="w-4 h-4 text-cyan-600" /> : <RefreshCw className="w-4 h-4 animate-spin text-cyan-600" />}
                <span>1. Pratinjau konektor NMS (simulasi lokal)</span>
              </div>

              <div className={`p-3 rounded-2xl border transition flex items-center gap-3 ${
                ingestionPhase >= 2 ? 'bg-cyan-50 border-cyan-200 text-cyan-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}>
                {ingestionPhase > 2 ? <Check className="w-4 h-4 text-cyan-600" /> : ingestionPhase === 2 ? <RefreshCw className="w-4 h-4 animate-spin text-cyan-600" /> : <div className="w-4 h-4" />}
                <span>2. Pratinjau data meter/tagihan (tanpa pengambilan data)</span>
              </div>

              <div className={`p-3 rounded-2xl border transition flex items-center gap-3 ${
                ingestionPhase >= 3 ? 'bg-cyan-50 border-cyan-200 text-cyan-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}>
                {ingestionPhase > 3 ? <Check className="w-4 h-4 text-cyan-600" /> : ingestionPhase === 3 ? <RefreshCw className="w-4 h-4 animate-spin text-cyan-600" /> : <div className="w-4 h-4" />}
                <span>3. Pratinjau pemeriksaan data (belum diaudit)</span>
              </div>

              <div className={`p-3 rounded-2xl border transition flex items-center gap-3 ${
                ingestionPhase >= 4 ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}>
                {ingestionPhase >= 4 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <div className="w-4 h-4" />}
                <span>4. Demo selesai • data tetap contoh</span>
              </div>
            </div>

            {ingestionPhase === 4 && (
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs space-y-1">
                <span className="font-bold block">Simulasi antarmuka selesai</span>
                <p className="text-[11px] text-emerald-800">
                  Tidak ada data lapangan yang ditarik, diperbarui, direkonsiliasi, atau diaudit.
                </p>
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                disabled={ingestionPhase < 4}
                onClick={() => setIsIngestionModalOpen(false)}
                className={`px-4 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                  ingestionPhase === 4 
                    ? 'bg-slate-900 text-white hover:bg-slate-800' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                {ingestionPhase === 4 ? 'Tutup & Tampilkan Data' : 'Memproses...'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
