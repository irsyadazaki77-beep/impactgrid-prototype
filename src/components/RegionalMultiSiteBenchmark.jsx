import React, { useState, useMemo } from 'react';
import {
  Layers,
  ArrowUpRight,
  TrendingDown,
  Building2,
  Zap,
  Gauge,
  DollarSign,
  Leaf,
  CheckCircle2,
  Plus,
  X,
  Scale,
  Copy,
  BarChart3
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import SafeResponsiveContainer from './SafeResponsiveContainer';

export const EXTENDED_REGIONAL_SITES = [
  {
    id: 'BDG-DGO-P04',
    name: 'Bandung Dago',
    shortName: 'Dago BDG',
    region: 'Jawa Barat (Urban Macro)',
    towerCo: 'Mitratel (Pass-Through 85%)',
    tariffName: 'PLN B-3/TM',
    tariffRate: 1114,
    hardware: 'Huawei BBU5900 + 3x AAU A8972',
    bessCapacity: '48V 200Ah LiFePO4 (9.6 kWh)',
    baselinePowerKw: 4.8,
    optimizedPowerKw: 2.98,
    pueBaseline: 1.42,
    pueOptimized: 1.18,
    co2BaselineTonsYear: 36.6,
    co2OptimizedTonsYear: 22.7,
    capexRoiMonths: 7.2
  },
  {
    id: 'JKT-SEL-P01',
    name: 'Jakarta Selatan SCBD',
    shortName: 'SCBD JKT',
    region: 'DKI Jakarta (Dense 5G Massive MIMO)',
    towerCo: 'Telkomsel Owned (100%)',
    tariffName: 'PLN I-3/WBP Peak',
    tariffRate: 2250,
    hardware: 'Ericsson Baseband 6648 + 3x AIR 6449',
    bessCapacity: '48V 400Ah LiFePO4 (19.2 kWh)',
    baselinePowerKw: 6.2,
    optimizedPowerKw: 3.84,
    pueBaseline: 1.48,
    pueOptimized: 1.16,
    co2BaselineTonsYear: 47.2,
    co2OptimizedTonsYear: 29.3,
    capexRoiMonths: 5.4
  },
  {
    id: 'SBY-GUB-P02',
    name: 'Surabaya Gubeng',
    shortName: 'Gubeng SBY',
    region: 'Jawa Timur (Transit Hub High Throughput)',
    towerCo: 'Protelindo (Fixed 70%)',
    tariffName: 'PLN B-3/TM',
    tariffRate: 1114,
    hardware: 'ZTE B8300 + 3x AAU A9611',
    bessCapacity: '48V 200Ah LiFePO4 (9.6 kWh)',
    baselinePowerKw: 5.1,
    optimizedPowerKw: 3.26,
    pueBaseline: 1.39,
    pueOptimized: 1.19,
    co2BaselineTonsYear: 38.9,
    co2OptimizedTonsYear: 24.9,
    capexRoiMonths: 7.8
  },
  {
    id: 'BGR-SNT-P03',
    name: 'Bogor Sentul',
    shortName: 'Sentul BGR',
    region: 'Jawa Barat (Suburban Solar Hybrid)',
    towerCo: 'Mitratel (Pass-Through 85%)',
    tariffName: 'PLN B-2/TR',
    tariffRate: 1444,
    hardware: 'Huawei BBU3910 + 3x RRU 3959',
    bessCapacity: '48V 300Ah LiFePO4 (14.4 kWh)',
    baselinePowerKw: 3.9,
    optimizedPowerKw: 2.38,
    pueBaseline: 1.44,
    pueOptimized: 1.21,
    co2BaselineTonsYear: 29.7,
    co2OptimizedTonsYear: 18.1,
    capexRoiMonths: 6.9
  },
  {
    id: 'DPS-KUT-P05',
    name: 'Bali Kuta - Nusa Dua',
    shortName: 'Kuta DPS',
    region: 'Bali-Nusra (Tourism Cluster)',
    towerCo: 'Mitratel (Pass-Through 85%)',
    tariffName: 'PLN B-3/TM',
    tariffRate: 1114,
    hardware: 'Ericsson BB6630 + 3x AIR 3268',
    bessCapacity: '48V 200Ah LiFePO4 (9.6 kWh)',
    baselinePowerKw: 4.4,
    optimizedPowerKw: 2.73,
    pueBaseline: 1.45,
    pueOptimized: 1.17,
    co2BaselineTonsYear: 33.5,
    co2OptimizedTonsYear: 20.8,
    capexRoiMonths: 7.5
  },
  {
    id: 'MKS-PAN-P06',
    name: 'Makassar Panakkukang',
    shortName: 'Panakkukang MKS',
    region: 'Sulawesi & Luar Jawa (Hub Makro)',
    towerCo: 'Telkomsel Owned (100%)',
    tariffName: 'PLN I-3/TM',
    tariffRate: 1114,
    hardware: 'Huawei BBU5900 + 3x AAU A8972',
    bessCapacity: '48V 200Ah LiFePO4 (9.6 kWh)',
    baselinePowerKw: 4.7,
    optimizedPowerKw: 2.91,
    pueBaseline: 1.41,
    pueOptimized: 1.19,
    co2BaselineTonsYear: 35.8,
    co2OptimizedTonsYear: 22.2,
    capexRoiMonths: 7.4
  }
];

export default function RegionalMultiSiteBenchmark({ onSelectActiveSite, activeSiteId }) {
  const [selectedIds, setSelectedIds] = useState(['BDG-DGO-P04', 'JKT-SEL-P01', 'SBY-GUB-P02', 'BGR-SNT-P03']);
  const [comparisonPreset, setComparisonPreset] = useState('jawa_bali');
  const [copiedToast, setCopiedToast] = useState(false);
  const [showChart, setShowChart] = useState(true);

  const activeSites = useMemo(() => {
    return selectedIds.map(id => EXTENDED_REGIONAL_SITES.find(s => s.id === id)).filter(Boolean);
  }, [selectedIds]);

  const chartData = useMemo(() => {
    return activeSites.map(s => {
      const savedKwhYear = (s.baselinePowerKw - s.optimizedPowerKw) * 8760;
      const savingsJutaYear = Number(((savedKwhYear * s.tariffRate) / 1_000_000).toFixed(1));
      return {
        name: s.shortName || s.name,
        fullName: s.name,
        roiMonths: s.capexRoiMonths,
        savingsJuta: savingsJutaYear,
        co2Avoided: Number((s.co2BaselineTonsYear - s.co2OptimizedTonsYear).toFixed(1))
      };
    });
  }, [activeSites]);

  const toggleSite = (id) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length <= 2) return;
      setSelectedIds(prev => prev.filter(x => x !== id));
    } else {
      if (selectedIds.length >= 4) {
        setSelectedIds(prev => [...prev.slice(0, 3), id]);
      } else {
        setSelectedIds(prev => [...prev, id]);
      }
    }
  };

  const applyPreset = (preset) => {
    setComparisonPreset(preset);
    if (preset === 'jawa_bali') {
      setSelectedIds(['BDG-DGO-P04', 'JKT-SEL-P01', 'SBY-GUB-P02', 'DPS-KUT-P05']);
    } else if (preset === 'urban_dense') {
      setSelectedIds(['JKT-SEL-P01', 'BDG-DGO-P04', 'SBY-GUB-P02', 'MKS-PAN-P06']);
    } else if (preset === 'hybrid_suburban') {
      setSelectedIds(['BGR-SNT-P03', 'BDG-DGO-P04', 'DPS-KUT-P05']);
    }
  };

  const handleCopySummary = () => {
    let text = `=== IMPACTGRID MCKINSEY BENCHMARK REGIONAL TELKOMSEL ===\n`;
    text += `Tanggal: ${new Date().toLocaleDateString('id-ID')}\n\n`;
    activeSites.forEach(s => {
      const savedKwhYear = (s.baselinePowerKw - s.optimizedPowerKw) * 8760;
      const savingsJuta = ((savedKwhYear * s.tariffRate) / 1_000_000).toFixed(1);
      text += `[${s.id}] ${s.name} (${s.region})\n`;
      text += ` - Tarif: ${s.tariffName} (Rp ${s.tariffRate}/kWh)\n`;
      text += ` - Daya: ${s.baselinePowerKw} kW -> ${s.optimizedPowerKw} kW (-${(((s.baselinePowerKw - s.optimizedPowerKw)/s.baselinePowerKw)*100).toFixed(1)}%)\n`;
      text += ` - Hemat OPEX/Thn: Rp ${savingsJuta} Juta\n`;
      text += ` - Payback: ${s.capexRoiMonths} Bulan\n`;
      text += ` - Reduksi CO2: -${(s.co2BaselineTonsYear - s.co2OptimizedTonsYear).toFixed(1)} tCO2e/thn\n\n`;
    });
    text += `Rekomendasi Strategis: Prioritaskan site I-3/WBP Peak untuk pengembalian tercepat (<6 bulan) dan site Pass-Through 85% untuk volume penghematan tunai terbesar.`;

    try {
      navigator.clipboard.writeText(text);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 3000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-6 shadow-xs space-y-6">
      {/* Header McKinsey Style */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <Scale className="h-4 w-4 text-[#ED0226]" />
            <span>McKinsey Benchmark Matrix · Performa Energi Jaringan</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            03. Matriks Komparasi Multi-Site Berdampingan Lintas Regional
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
            Perbandingan analitis efisiensi daya, PUE, emisi Scope 2, dan waktu pengembalian investasi (ROI) pada 2–4 site makro pilihan untuk penentuan prioritas alokasi belanja modal (*CAPEX*).
          </p>
        </div>

        {/* Action Buttons: Presets & Copy Brief */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setShowChart(prev => !prev)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center gap-1.5 ${
              showChart
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-transparent shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span>{showChart ? 'Tutup Grafik' : 'Lihat Grafik'}</span>
          </button>

          <button
            onClick={handleCopySummary}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#ED0226] text-white hover:bg-[#d40222] transition shadow-xs flex items-center gap-1.5"
            title="Salin ringkasan matriks untuk bahan paparan Direksi"
          >
            <Copy className="h-3.5 w-3.5" />
            <span>{copiedToast ? 'Tersalin ke Clipboard!' : 'Salin Brief Direksi'}</span>
          </button>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
            <button
              onClick={() => applyPreset('jawa_bali')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                comparisonPreset === 'jawa_bali'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Jawa-Bali
            </button>
            <button
              onClick={() => applyPreset('urban_dense')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                comparisonPreset === 'urban_dense'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Urban
            </button>
            <button
              onClick={() => applyPreset('hybrid_suburban')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                comparisonPreset === 'hybrid_suburban'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Solar
            </button>
          </div>
        </div>
      </div>

      {/* Site Selector Badges */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1">
          Pilih Site Dibandingkan (Maks 4):
        </span>
        {EXTENDED_REGIONAL_SITES.map((site) => {
          const isSelected = selectedIds.includes(site.id);
          return (
            <button
              key={site.id}
              onClick={() => toggleSite(site.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium border transition cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
              }`}
            >
              <span>{site.name}</span>
              <span className="text-[10px] opacity-75 font-mono">({site.id})</span>
              {isSelected ? (
                <CheckCircle2 className="h-3 w-3 text-emerald-400 dark:text-emerald-600 ml-0.5" />
              ) : (
                <Plus className="h-3 w-3 opacity-50" />
              )}
            </button>
          );
        })}
      </div>

      {/* Visual Comparative Chart Section (McKinsey Dual Axis View) */}
      {showChart && (
        <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Grafik Komparatif: Penghematan OPEX Tahunan (Juta Rp) vs Periode Pengembalian Modal (Bulan)
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Visualisasi Komparasi Portofolio</span>
          </div>
          <div className="h-56 w-full min-w-[280px] min-h-[220px]">
            <SafeResponsiveContainer defaultHeight={220}>
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" orientation="left" stroke="#10b981" tick={{ fontSize: 11 }} unit=" Jt" />
                <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" tick={{ fontSize: 11 }} unit=" Bln" />
                <Tooltip 
                  formatter={(val, name) => {
                    if (name === 'Hemat OPEX (Juta Rp/thn)') return [`Rp ${val} Juta`, name];
                    if (name === 'Payback Period (Bulan)') return [`${val} Bulan`, name];
                    return [val, name];
                  }}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar yAxisId="left" dataKey="savingsJuta" name="Hemat OPEX (Juta Rp/thn)" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="roiMonths" name="Payback Period (Bulan)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </SafeResponsiveContainer>
          </div>
        </div>
      )}

      {/* Side-by-Side Comparison Matrix Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
              <th className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 w-52">
                Parameter & Indikator Kunci
              </th>
              {activeSites.map((s) => (
                <th key={s.id} className="py-3 px-4 font-bold text-slate-900 dark:text-white min-w-[200px]">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-black">{s.name}</div>
                      <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-normal">
                        {s.id} · {s.region}
                      </div>
                    </div>
                    {onSelectActiveSite && (
                      <button
                        onClick={() => onSelectActiveSite(s.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition ${
                          activeSiteId === s.id
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100'
                        }`}
                        title="Jadikan site aktif pada simulator 3D di atas"
                      >
                        {activeSiteId === s.id ? 'Aktif di 3D' : 'Set 3D'}
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {/* Row 1: Tower Provider & Contract */}
            <tr>
              <td className="py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                TowerCo & Skema Sewa
              </td>
              {activeSites.map((s) => (
                <td key={s.id} className="py-3 px-4 text-slate-800 dark:text-slate-200">
                  {s.towerCo}
                </td>
              ))}
            </tr>

            {/* Row 2: Hardware RAN Architecture */}
            <tr>
              <td className="py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                Arsitektur Radio & BBU
              </td>
              {activeSites.map((s) => (
                <td key={s.id} className="py-3 px-4 text-slate-800 dark:text-slate-200 font-mono text-[11px]">
                  {s.hardware}
                </td>
              ))}
            </tr>

            {/* Row 3: PLN Tariff Tier */}
            <tr>
              <td className="py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                Tarif Listrik PLN
              </td>
              {activeSites.map((s) => (
                <td key={s.id} className="py-3 px-4">
                  <span className="font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                    Rp {s.tariffRate.toLocaleString('id-ID')}
                  </span>
                  <span className="text-[10px] text-slate-500 ml-1">/ kWh ({s.tariffName})</span>
                </td>
              ))}
            </tr>

            {/* Row 4: Power Draw: Baseline vs Optimized */}
            <tr className="bg-slate-50/50 dark:bg-slate-900/30">
              <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                Daya Listrik AC (Sebelum → Sesudah)
              </td>
              {activeSites.map((s) => {
                const diffKw = (s.baselinePowerKw - s.optimizedPowerKw).toFixed(2);
                const pct = (((s.baselinePowerKw - s.optimizedPowerKw) / s.baselinePowerKw) * 100).toFixed(1);
                return (
                  <td key={s.id} className="py-3 px-4">
                    <div className="flex items-center gap-1.5 font-mono tabular-nums">
                      <span className="text-slate-400 line-through">{s.baselinePowerKw} kW</span>
                      <span className="text-slate-400">→</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{s.optimizedPowerKw} kW</span>
                    </div>
                    <div className="text-[10px] text-emerald-700 dark:text-emerald-300 font-medium mt-0.5 font-mono">
                      Hemat -{diffKw} kW (-{pct}%)
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Row 5: PUE Efficiency */}
            <tr>
              <td className="py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                Efisiensi Fasilitas (PUE)
              </td>
              {activeSites.map((s) => (
                <td key={s.id} className="py-3 px-4">
                  <div className="flex items-center gap-1.5 font-mono tabular-nums">
                    <span className="text-slate-500">{s.pueBaseline}</span>
                    <span className="text-slate-400">→</span>
                    <span className="font-bold text-sky-600 dark:text-sky-400">{s.pueOptimized}</span>
                  </div>
                  <div className="text-[10px] text-sky-700 dark:text-sky-300">
                    Sistem Inverter PINN Dinamis
                  </div>
                </td>
              ))}
            </tr>

            {/* Row 6: Annual Electricity OPEX Savings */}
            <tr className="bg-emerald-50/40 dark:bg-emerald-950/20">
              <td className="py-3 px-4 font-bold text-emerald-900 dark:text-emerald-200">
                Estimasi Penghematan OPEX / Tahun
              </td>
              {activeSites.map((s) => {
                const savedKwhYear = (s.baselinePowerKw - s.optimizedPowerKw) * 8760;
                const savingsIdrYear = Math.round(savedKwhYear * s.tariffRate);
                return (
                  <td key={s.id} className="py-3 px-4">
                    <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
                      Rp {(savingsIdrYear / 1_000_000).toFixed(1)} Juta
                    </div>
                    <div className="text-[10px] text-emerald-800 dark:text-emerald-300 font-mono tabular-nums">
                      {Math.round(savedKwhYear).toLocaleString('id-ID')} kWh dihindari
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Row 7: Carbon Scope 2 Reduction */}
            <tr>
              <td className="py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                Reduksi Emisi Scope 2 (GRI 305)
              </td>
              {activeSites.map((s) => {
                const avoidedTons = (s.co2BaselineTonsYear - s.co2OptimizedTonsYear).toFixed(1);
                return (
                  <td key={s.id} className="py-3 px-4">
                    <div className="font-bold text-slate-800 dark:text-slate-200 font-mono tabular-nums">
                      -{avoidedTons} tCO₂e / tahun
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Baseline {s.co2BaselineTonsYear} → {s.co2OptimizedTonsYear} tCO₂e
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Row 8: CAPEX Payback Period */}
            <tr className="bg-slate-50/50 dark:bg-slate-900/30">
              <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                Periode Pengembalian Modal (Payback)
              </td>
              {activeSites.map((s) => (
                <td key={s.id} className="py-3 px-4">
                  <span className="font-black text-slate-900 dark:text-white font-mono tabular-nums text-sm">
                    {s.capexRoiMonths} Bulan
                  </span>
                  <div className="text-[10px] text-slate-500">
                    {s.capexRoiMonths <= 6 ? '⚡ Prioritas Cepat (<6 Bln)' : '✓ Standar Korporat'}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* McKinsey Strategic Insight Note */}
      <div className="rounded-xl bg-slate-50 dark:bg-slate-900/80 p-4 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1.5">
        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
          <Building2 className="h-4 w-4 text-[#ED0226]" />
          <span>Kesimpulan Strategis Alokasi CAPEX Telkomsel (Strategic Investment Recommendation)</span>
        </div>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          Site dengan tarif <strong>PLN I-3/WBP Peak (seperti JKT-SEL-P01)</strong> menghasilkan pengembalian modal tercepat (<strong>5,4 bulan</strong>) karena BESS memangkas biaya pada jam beban puncak Rp 2.250/kWh. Sementara itu, klaster makro Jawa Barat dan Jawa Timur dengan kontrak *Pass-Through 85%* memberikan volume penghematan tunai terbesar secara kumulatif untuk menurunkan OPEX sewa TowerCo Mitratel & Protelindo.
        </p>
      </div>
    </div>
  );
}
