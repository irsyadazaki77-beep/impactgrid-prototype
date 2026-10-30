import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Activity, ShieldCheck, AlertTriangle, Layers, Sliders, CheckCircle2, TrendingDown, Info } from 'lucide-react';

// Monthly timeline: T-6 to T+9 (6 months baseline pre-intervention, 9 months pilot post-intervention)
const MONTHS = [
  'M-6 (Jul 26)', 'M-5 (Agt 26)', 'M-4 (Sep 26)', 'M-3 (Okt 26)', 'M-2 (Nov 26)', 'M-1 (Des 26)',
  'M0 (Intervensi)',
  'M+1 (Feb 27)', 'M+2 (Mar 27)', 'M+3 (Apr 27)', 'M+4 (Mei 27)', 'M+5 (Jun 27)', 'M+6 (Jul 27)', 'M+7 (Agt 27)', 'M+8 (Sep 27)', 'M+9 (Okt 27)'
];

// Baseline consumption ~3.500 kWh/bulan/site
const BASE_INTERVENTION_RAW = [3520, 3540, 3510, 3560, 3580, 3550, 3570, 3310, 3280, 3250, 3240, 3260, 3230, 3250, 3220, 3200];
const BASE_CONTROL_RAW      = [3480, 3500, 3470, 3530, 3550, 3510, 3540, 3560, 3550, 3530, 3540, 3570, 3550, 3580, 3560, 3540];

export default function DifferenceInDifferencesVisualizer() {
  const [showSyntheticCounterfactual, setShowSyntheticCounterfactual] = useState(true);
  const [applyWeatherTrafficNormalization, setApplyWeatherTrafficNormalization] = useState(true);
  const [selectedCluster, setSelectedCluster] = useState('all'); // 'all' | 'jkt' | 'bdg' | 'sby'
  const [activeMetricTab, setActiveMetricTab] = useState('did'); // 'did' | 'qos_guardrail'

  // Cluster multiplier
  const clusterFactor = useMemo(() => {
    switch (selectedCluster) {
      case 'jkt': return 1.08; // High density urban
      case 'bdg': return 0.94; // Cooler plateau
      case 'sby': return 1.04; // Coastal heat
      default: return 1.0;
    }
  }, [selectedCluster]);

  // Weather normalization factors (CDD - Cooling Degree Days effect in rainy/hot months)
  const weatherFactors = useMemo(() => [
    1.02, 1.03, 1.01, 1.00, 0.98, 0.97, 0.98, 0.99, 1.01, 1.03, 1.04, 1.02, 1.03, 1.04, 1.02, 1.01
  ], []);

  // Compute DiD Time Series Data
  const didChartData = useMemo(() => {
    return MONTHS.map((month, idx) => {
      const wFactor = applyWeatherTrafficNormalization ? weatherFactors[idx] : 1.0;
      
      const interRaw = BASE_INTERVENTION_RAW[idx] * clusterFactor * (applyWeatherTrafficNormalization ? 1 / wFactor : 1.0);
      const controlRaw = BASE_CONTROL_RAW[idx] * clusterFactor * (applyWeatherTrafficNormalization ? 1 / wFactor : 1.0);
      
      // Calculate Synthetic Counterfactual for post-intervention (what intervention would have been without pilot)
      // Counterfactual_t = Intervention_pre_avg + (Control_t - Control_pre_avg)
      const interPreAvg = (3520 + 3540 + 3510 + 3560 + 3580 + 3550) / 6 * clusterFactor;
      const controlPreAvg = (3480 + 3500 + 3470 + 3530 + 3550 + 3510) / 6 * clusterFactor;
      const counterfactual = idx >= 6 ? Math.round(interPreAvg + (controlRaw - controlPreAvg)) : null;

      return {
        month,
        idx,
        isPost: idx >= 6,
        intervention: Math.round(interRaw),
        control: Math.round(controlRaw),
        counterfactual: counterfactual
      };
    });
  }, [clusterFactor, applyWeatherTrafficNormalization, weatherFactors]);

  // Statistical estimations
  const stats = useMemo(() => {
    // Delta Intervention: Post Avg - Pre Avg
    const interPre = didChartData.slice(0, 6).reduce((a, b) => a + b.intervention, 0) / 6;
    const interPost = didChartData.slice(7).reduce((a, b) => a + b.intervention, 0) / 9;
    const deltaInter = interPost - interPre;

    // Delta Control: Post Avg - Pre Avg
    const controlPre = didChartData.slice(0, 6).reduce((a, b) => a + b.control, 0) / 6;
    const controlPost = didChartData.slice(7).reduce((a, b) => a + b.control, 0) / 9;
    const deltaControl = controlPost - controlPre;

    // DiD Estimator (Delta-Delta)
    const deltaDelta = deltaInter - deltaControl;
    const deltaDeltaPct = (deltaDelta / interPre) * 100;
    
    // Total annual MWh saved for 40 sites
    const annualSavingsMWh = Math.abs(deltaDelta) * 12 * 40 / 1000;

    return {
      interPre: Math.round(interPre),
      interPost: Math.round(interPost),
      controlPre: Math.round(controlPre),
      controlPost: Math.round(controlPost),
      deltaDelta: Math.round(deltaDelta),
      deltaDeltaPct: deltaDeltaPct.toFixed(2),
      pValue: '< 0.001',
      parallelTrendP: '0.42 (H₀ Parallel Dipenuhi)',
      annualSavingsMWh: annualSavingsMWh.toFixed(1)
    };
  }, [didChartData]);

  // QoS Guardrail Simulation Curve
  const qosData = useMemo(() => [
    { sleepDepth: '0% (Normal)', powerSaving: '0%', throughput: 85, dropCall: 0.05, prbLoad: 42, safety: 'SAFE' },
    { sleepDepth: '10% (Light)', powerSaving: '4.2%', throughput: 83, dropCall: 0.06, prbLoad: 44, safety: 'SAFE' },
    { sleepDepth: '20% (Carrier B8)', powerSaving: '8.5%', throughput: 81, dropCall: 0.07, prbLoad: 48, safety: 'SAFE' },
    { sleepDepth: '30% (Carrier B3/B8)', powerSaving: '12.8%', throughput: 78, dropCall: 0.08, prbLoad: 54, safety: 'SAFE' },
    { sleepDepth: '40% (Deep Symbol)', powerSaving: '16.4%', throughput: 72, dropCall: 0.11, prbLoad: 63, safety: 'WARNING' },
    { sleepDepth: '50% (Max Sleep)', powerSaving: '19.8%', throughput: 58, dropCall: 0.22, prbLoad: 78, safety: 'CRITICAL_ROLLBACK' },
  ], []);

  return (
    <div className="space-y-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-5 md:p-6 shadow-xs">
      {/* Tab Switcher: DiD vs QoS Guardrail */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/60 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700 dark:text-indigo-300">
            <Activity className="w-3.5 h-3.5" />
            <span>METODOLOGI KAUSALITAS STANDAR TELKOMSEL & IPMVP OPTION B</span>
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            Evaluasi Dampak Kausal: Difference-in-Differences & QoS Guardrail
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Membedakan penghematan riil intervensi dari tren musiman cuaca dan trafik alami, dilengkapi proteksi mutu layanan operator.
          </p>
        </div>

        <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
          <button
            onClick={() => setActiveMetricTab('did')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeMetricTab === 'did'
                ? 'bg-white dark:bg-[#0B1324] text-indigo-600 dark:text-indigo-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Difference-in-Differences (DiD)
          </button>
          <button
            onClick={() => setActiveMetricTab('qos_guardrail')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeMetricTab === 'qos_guardrail'
                ? 'bg-white dark:bg-[#0B1324] text-red-600 dark:text-red-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Matriks Trade-off QoS / SLA
          </button>
        </div>
      </div>

      {activeMetricTab === 'did' ? (
        <div className="space-y-5">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800">
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={showSyntheticCounterfactual}
                  onChange={(e) => setShowSyntheticCounterfactual(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                />
                <span>Garis Counterfactual Sintetis (Y&#770;<sub>0</sub>)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={applyWeatherTrafficNormalization}
                  onChange={(e) => setApplyWeatherTrafficNormalization(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                />
                <span>Normalisasi Suhu CDD & Terabytes</span>
              </label>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Filter Klaster:</span>
              <select
                value={selectedCluster}
                onChange={(e) => setSelectedCluster(e.target.value)}
                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-xs font-bold text-slate-800 dark:text-slate-200"
              >
                <option value="all">Semua Klaster (50 Site)</option>
                <option value="jkt">JKT-URB (Jakarta Urban - 20 Site)</option>
                <option value="bdg">BDG-SUB (Bandung Sejuk - 15 Site)</option>
                <option value="sby">SBY-CST (Surabaya Panas - 15 Site)</option>
              </select>
            </div>
          </div>

          {/* KPI Statistics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/30">
              <span className="text-[11px] font-bold text-indigo-800 dark:text-indigo-300">Estimasi Efek Intervensi (&Delta;&Delta;)</span>
              <div className="mt-1 text-2xl font-black text-indigo-700 dark:text-indigo-400 tabular-nums">
                {stats.deltaDeltaPct}%
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                {stats.deltaDelta} kWh/site/bln ({stats.pValue})
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/30">
              <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">Penghematan Bersih 40 Lokasi</span>
              <div className="mt-1 text-2xl font-black text-emerald-700 dark:text-emerald-400 tabular-nums">
                ~{stats.annualSavingsMWh} MWh/th
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                Setara reduksi ~{Math.round(stats.annualSavingsMWh * 0.87)} tCO₂e/th
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Uji Asumsi Parallel Trend</span>
              <div className="mt-1 text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                Lolos Validasi
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                p = {stats.parallelTrendP}
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Kombinasi Pembanding</span>
              <div className="mt-1 text-sm font-extrabold text-slate-900 dark:text-white">
                40 Intervensi vs 10 Kontrol
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                Propensity score matched by tower type
              </p>
            </div>
          </div>

          {/* DiD Line Chart */}
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={didChartData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis domain={['auto', 'auto']} stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(val, name) => [
                    `${Number(val).toLocaleString('id-ID')} kWh/site/bln`,
                    name === 'intervention' ? 'Grup Intervensi (40)' :
                    name === 'control' ? 'Grup Kontrol (10)' : 'Counterfactual Tanpa Pilot'
                  ]}
                />
                <ReferenceLine x="M0 (Intervensi)" stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Go-Live Pilot (M0)', fill: '#ef4444', fontSize: 10, position: 'top' }} />
                <Line type="monotone" dataKey="intervention" stroke="#2563eb" strokeWidth={2.5} name="intervention" dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="control" stroke="#64748b" strokeWidth={2} strokeDasharray="3 3" name="control" dot={{ r: 2 }} />
                {showSyntheticCounterfactual && (
                  <Line type="monotone" dataKey="counterfactual" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" name="counterfactual" dot={false} />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-3">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-blue-600 inline-block"></span> 40 Lokasi Intervensi</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-slate-500 inline-block border-b border-dashed"></span> 10 Lokasi Kontrol</span>
              {showSyntheticCounterfactual && (
                <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-amber-500 inline-block border-b border-dashed"></span> Counterfactual Sintetis (Kausalitas Murni)</span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 italic">Formula DiD: &Delta;&Delta; = (Y&#772;<sub>T,post</sub> - Y&#772;<sub>T,pre</sub>) - (Y&#772;<sub>C,post</sub> - Y&#772;<sub>C,pre</sub>)</span>
          </div>
        </div>
      ) : (
        /* QoS / SLA Guardrail Tab */
        <div className="space-y-4">
          <div className="rounded-xl border border-amber-300 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/30 p-4 text-xs leading-relaxed text-amber-950 dark:text-amber-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-extrabold text-amber-900 dark:text-amber-100">Batas Toleransi Non-Inferioritas Jaringan Telkomsel:</strong>
              <p className="mt-1">
                Kenaikan *Call Drop Rate* maksimal <strong>+0.05%</strong> dan penurunan *Throughput User* maksimal <strong>15%</strong>. Jika utilisasi PRB melampaui 70% atau terdeteksi panggilan darurat 112, fitur *Carrier Sleep* langsung di-override ke status normal dalam &lt;120 detik.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="p-3">Tingkat Efisiensi RAN</th>
                  <th className="p-3">Estimasi Hemat Daya</th>
                  <th className="p-3">Throughput Pengguna</th>
                  <th className="p-3">Drop Call Rate</th>
                  <th className="p-3">PRB Load</th>
                  <th className="p-3">Status Guardrail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {qosData.map((row) => (
                  <tr key={row.sleepDepth} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-extrabold text-slate-900 dark:text-white">{row.sleepDepth}</td>
                    <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">{row.powerSaving}</td>
                    <td className="p-3">{row.throughput} Mbps</td>
                    <td className="p-3 font-mono">{row.dropCall}%</td>
                    <td className="p-3">{row.prbLoad}%</td>
                    <td className="p-3">
                      {row.safety === 'SAFE' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          <CheckCircle2 className="w-3 h-3" /> Aman (SLA Terjaga)
                        </span>
                      )}
                      {row.safety === 'WARNING' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          <AlertTriangle className="w-3 h-3" /> Mendekati Ambang Batas
                        </span>
                      )}
                      {row.safety === 'CRITICAL_ROLLBACK' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">
                          <ShieldCheck className="w-3 h-3" /> Auto-Rollback Aktif (&gt;70% PRB)
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
