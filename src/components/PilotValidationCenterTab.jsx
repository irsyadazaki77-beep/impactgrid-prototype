import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Leaf, 
  Radio, 
  DollarSign, 
  Sliders, 
  Database, 
  BarChart3, 
  Layers, 
  FileText, 
  Download, 
  Printer, 
  HelpCircle, 
  Info,
  Clock,
  Sparkles,
  ArrowRight,
  RotateCcw,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend, 
  LineChart, 
  Line,
  ReferenceLine 
} from 'recharts';
import { PILOT_SITES_SAMPLE } from '../data/mockData';
import { calculateDiDMetrics, evaluateExecutiveDecisionGates } from '../utils/evidenceEngine';
import EvidenceExplorerModal from './EvidenceExplorerModal';

export default function PilotValidationCenterTab({
  simState = { plnTariffIDR: 1500, tempC: 28, trafficMultiplier: 1.0, carrierSleepActive: true, emergencyActive: false },
  emergencyState = { active: false },
  onOpenReportModal
}) {
  const [selectedSiteForEvidence, setSelectedSiteForEvidence] = useState(null);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [sensitivityTariff, setSensitivityTariff] = useState(simState.plnTariffIDR || 1500);

  // Sync sensitivity tariff if simState changes
  React.useEffect(() => {
    if (simState.plnTariffIDR) {
      setSensitivityTariff(simState.plnTariffIDR);
    }
  }, [simState.plnTariffIDR]);

  // Compute live mathematical DiD analysis
  const didAnalysis = useMemo(() => {
    return calculateDiDMetrics({
      sites: PILOT_SITES_SAMPLE,
      simState: {
        ...simState,
        plnTariffIDR: sensitivityTariff,
        emergencyActive: emergencyState.active || simState.emergencyActive
      }
    });
  }, [sensitivityTariff, simState, emergencyState.active]);

  // Evaluate 4 Decision Gates
  const decisionEvaluation = useMemo(() => {
    return evaluateExecutiveDecisionGates(didAnalysis);
  }, [didAnalysis]);

  const { didResults, preTrendTest, unadjustedDelta } = didAnalysis;
  const { gates, overall } = decisionEvaluation;

  // Chart data: Pre vs Post DiD Comparison
  const didChartData = [
    {
      group: 'Kontrol (10 BTS)',
      baseline: 50000,
      postIntervention: Math.round(50000 * (1 + unadjustedDelta.controlPct / 100)),
      isolatedEffect: 0
    },
    {
      group: 'Intervensi (40 BTS)',
      baseline: 50000,
      postIntervention: Math.round(50000 * (1 + unadjustedDelta.interventionPct / 100)),
      isolatedEffect: Math.round(didResults.isolatedEnergySavedKWh / 40)
    }
  ];

  // Pre-Intervention Parallel Trends Series (Quarterly -Q3, -Q2, -Q1, Post)
  const parallelTrendsData = [
    { quarter: 'Q-3 (Pre)', intervensiIndex: 100.0, kontrolIndex: 100.0 },
    { quarter: 'Q-2 (Pre)', intervensiIndex: 102.1, kontrolIndex: 102.3 },
    { quarter: 'Q-1 (Pre)', intervensiIndex: 104.5, kontrolIndex: 104.6 },
    { quarter: 'Q+1 (Post)', intervensiIndex: 94.4, kontrolIndex: 105.1 },
    { quarter: 'Q+2 (Post)', intervensiIndex: 94.1, kontrolIndex: 105.4 }
  ];

  const handleOpenEvidence = (siteId) => {
    setSelectedSiteForEvidence(siteId);
    setIsEvidenceModalOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Pilot Validation & Governance Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-xs font-bold text-red-800">
                <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
                <span>Pusat Validasi Uji Coba & Evidence Intelligence</span>
              </div>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                SYNTHETIC PILOT MODEL • ITU-T L.1331
              </span>
            </div>

            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
              Evaluasi Kausal Kuasi-Eksperimental (40 Lokasi Uji vs 10 Lokasi Kontrol)
            </h1>
            <p className="text-xs text-slate-600 max-w-4xl leading-relaxed mt-1">
              Menghilangkan bias evaluasi melalui metodologi <strong>Difference-in-Differences (DiD)</strong>. Memisahkan efek murni algoritma ImpactGrid terhadap faktor eksternal (anomali gelombang panas BMKG & lonjakan trafik data) guna menyajikan dasar rekomendasi keputusan Dewan Direksi yang <strong>objektif dan anti-greenwashing</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleOpenEvidence(null)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Database className="w-4 h-4 text-cyan-400" />
              <span>Evidence Explorer</span>
            </button>
            {onOpenReportModal && (
              <button
                onClick={onOpenReportModal}
                className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-2xs cursor-pointer"
              >
                <FileText className="w-4 h-4 text-red-600" />
                <span>Unduh Audit PDF</span>
              </button>
            )}
          </div>
        </div>

        {/* Taxonomy Disclaimer Pill */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
          <span className="font-bold text-slate-700">Taksonomi Data Terverifikasi:</span>
          <span className="px-2 py-0.5 rounded-md bg-slate-100 font-mono text-[10px] text-slate-600">
            [SYNTHETIC] Model Uji Kalibrasi
          </span>
          <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 font-mono text-[10px] border border-sky-200">
            [PROJECTED] Estimasi Skalabilitas
          </span>
          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-mono text-[10px] border border-emerald-200 font-bold">
            [VERIFIED] Model Kausal ITU-T L.1331
          </span>
          <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-mono text-[10px] border border-amber-200">
            [DEMO] Simulasi Pitching
          </span>
        </div>
      </div>

      {/* SECTION 1: EXECUTIVE DECISION GATE BANNER (GO / CONDITIONAL GO / NO-GO) */}
      <div className={`p-6 md:p-8 rounded-3xl border shadow-md space-y-5 transition-colors ${
        overall.recommendation === 'GO' 
          ? 'bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-950 text-white border-emerald-500/50' 
          : overall.recommendation === 'CONDITIONAL_GO'
          ? 'bg-gradient-to-br from-amber-950 via-slate-900 to-amber-950 text-white border-amber-500/50'
          : 'bg-gradient-to-br from-rose-950 via-slate-900 to-rose-950 text-white border-rose-500/50'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300 block">
              Dewan Direksi Telkomsel • Executive Decision Gate Framework
            </span>
            <div className="flex items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Rekomendasi Keputusan Uji Coba:
              </h2>
              <span className={`px-4 py-1 rounded-full text-sm font-black tracking-wider uppercase shadow-md ${
                overall.recommendation === 'GO'
                  ? 'bg-emerald-500 text-slate-950'
                  : overall.recommendation === 'CONDITIONAL_GO'
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-rose-600 text-white'
              }`}>
                {overall.recommendation}
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              {overall.rationale}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono shrink-0 space-y-1 text-slate-300">
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Status Validasi:</span>
              <strong className="text-emerald-400">4 DARI 4 EVALUATED</strong>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Signifikansi Kausal:</span>
              <strong className="text-cyan-300">p {didResults.pValue}</strong>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Tanggal Sesi:</span>
              <span>{overall.decisionStatusDate}</span>
            </div>
          </div>
        </div>

        {/* 4 Decision Gate Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {gates.map((gate) => {
            const isPass = gate.status === 'PASS';
            const isWarn = gate.status === 'WARNING';
            return (
              <div 
                key={gate.id}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{gate.title.split(':')[0]}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                      isPass ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30' :
                      isWarn ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' :
                      'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {gate.status}
                    </span>
                  </div>
                  <strong className="text-white text-xs block leading-snug">{gate.metric}</strong>
                  <span className="text-[10px] text-slate-400 block font-mono">Batas: {gate.threshold}</span>
                </div>

                <div className="pt-2 border-t border-white/10">
                  <span className="text-[11px] font-bold text-cyan-300 block">{gate.actual}</span>
                  <span className="text-[9px] text-slate-400">{gate.standard}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: MATHEMATICAL DID & PARALLEL TRENDS AUDIT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left DiD Formula & Parallel Trends (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-red-600" />
                <h3 className="text-sm font-black text-slate-900">
                  Pembuktian Kausal Matematis Difference-in-Differences (DiD)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Formula resmi: Δ_DiD = (Y_treat,post - Y_treat,pre) - (Y_ctrl,post - Y_ctrl,pre)
              </p>
            </div>

            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
              p-value {didResults.pValue}
            </span>
          </div>

          {/* DiD Mathematical Step Breakdown */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center text-slate-700">
              <span>Kelompok Intervensi (40 Menara Uji):</span>
              <strong className="text-slate-900">
                {unadjustedDelta.interventionPct}% ({unadjustedDelta.interventionKWh.toLocaleString('id-ID')} kWh)
              </strong>
            </div>
            <div className="flex justify-between items-center text-slate-700">
              <span>Kelompok Pembanding (10 Menara Kontrol):</span>
              <strong className="text-amber-800">
                +{unadjustedDelta.controlPct}% (+{unadjustedDelta.controlKWh.toLocaleString('id-ID')} kWh)
              </strong>
            </div>
            <div className="pt-2 border-t border-slate-300 flex justify-between items-center text-xs">
              <span className="font-bold text-emerald-900 font-sans">
                Efek Bersih DiD (Terkoreksi Cuaca & Trafik):
              </span>
              <span className="text-base font-black text-emerald-700">
                +{didResults.isolatedEnergySavedKWh.toLocaleString('id-ID')} kWh/Thn
              </span>
            </div>
            <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200 flex justify-between items-center">
              <span>Standar Error: ±{didResults.standardErrorKWh.toLocaleString('id-ID')} kWh</span>
              <span className="text-emerald-800 font-bold">{didResults.confidenceInterval95.display}</span>
            </div>
          </div>

          {/* Parallel Trends Pre-Intervention Line Chart */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900">Uji Asumsi Parallel Trends (Q-3 s.d. Pasca Intervensi):</span>
              <span className="text-[10px] font-mono text-emerald-700 font-bold">
                {preTrendTest.verdict.split(':')[0]} (ΔPre = {preTrendTest.diffPct}%)
              </span>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={parallelTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="quarter" tick={{ fontSize: 11 }} />
                  <YAxis unit=" idx" domain={[90, 110]} tick={{ fontSize: 11 }} />
                  <Tooltip 
                    formatter={(val, name) => [`${val} indeks`, name === 'intervensiIndex' ? 'Kelompok Intervensi' : 'Kelompok Kontrol']}
                    contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
                  />
                  <Legend verticalAlign="top" height={28} />
                  <ReferenceLine x="Q-1 (Pre)" stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Intervensi Dimulai', fill: '#ef4444', fontSize: 10, position: 'top' }} />
                  <Line type="monotone" dataKey="kontrolIndex" name="Kontrol Pembanding" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="intervensiIndex" name="Intervensi ImpactGrid" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-slate-500 italic">
              Trajektori pra-intervensi (Q-3 s.d Q-1) berhimpitan membuktikan kedua kelompok identik sebelum sistem AI diaktifkan.
            </p>
          </div>
        </div>

        {/* Right Sensitivity & Financial Cross-Validation (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-black text-slate-900">
                  Uji Sensitivitas Tarif Listrik PLN
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Menguji ketahanan model finansial terhadap fluktuasi tarif B2/B3 PLN
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
              Rp {sensitivityTariff}/kWh
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Geser Tarif PLN:</span>
              <span className="font-bold">Rp 1.200 - Rp 2.200/kWh</span>
            </div>
            <input
              type="range"
              min="1200"
              max="2200"
              step="50"
              value={sensitivityTariff}
              onChange={(e) => setSensitivityTariff(parseInt(e.target.value, 10))}
              className="w-full accent-red-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
            />
          </div>

          {/* Sensitivity Outcomes */}
          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Penghematan Finansial Kotor
              </span>
              <div className="text-xl font-black text-slate-900">
                Rp {(didResults.grossFinancialSavingsIDR / 1e6).toFixed(1)} Juta/Tahun
              </div>
              <span className="text-[10px] text-slate-500 block">
                Berdasarkan reduksi {didResults.isolatedEnergySavedKWh.toLocaleString('id-ID')} kWh terverifikasi DiD
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                Manfaat Finansial Bersih (Net OpEx)
              </span>
              <div className="text-xl font-black text-emerald-950">
                Rp {(didResults.netAnnualBenefitIDR / 1e6).toFixed(1)} Juta/Tahun
              </div>
              <span className="text-[10px] text-emerald-800 block">
                Setelah dikurangi OpEx AI & pemeliharaan (Rp 60 Jt/Thn)
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900 text-white space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                NPV 5 Tahun & Periode Balik Modal
              </span>
              <div className="text-xl font-black text-cyan-300">
                +Rp {(didResults.npv5YearsIDR / 1e6).toFixed(0)} Jt | PBP {didResults.paybackYears} Tahun
              </div>
              <span className="text-[10px] text-slate-400 block font-mono">
                WACC: 10% • Investasi CapEx Awal: Rp 450 Juta
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
            <strong>Catatan Uji Stres:</strong> Pada tarif minimum Rp1.200/kWh sekalipun, NPV 5 tahun tetap positif (+Rp195 Juta) dan payback 2,8 tahun (&lt; ambang batas toleransi 3,0 tahun).
          </div>
        </div>

      </div>

      {/* SECTION 3: EVIDENCE EXPLORER QUICK ACCESS (SAMPLE CANDIDATE TABLE) */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-red-600" />
              <h3 className="text-sm font-black text-slate-900">
                Katalog Bukti Empiris Menara BTS (Klik untuk Audit Detil)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Menampilkan sampel representatif dari 40 lokasi intervensi dan 10 lokasi kontrol pembanding
            </p>
          </div>

          <button
            onClick={() => handleOpenEvidence(null)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer"
          >
            <span>Buka Seluruh 50 Lokasi</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mini Table */}
        <div className="overflow-x-auto border border-slate-100 rounded-2xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
              <tr>
                <th className="py-2.5 px-3.5">ID BTS</th>
                <th className="py-2.5 px-3.5">Nama Lokasi & Kota</th>
                <th className="py-2.5 px-3.5">Kohort</th>
                <th className="py-2.5 px-3.5">Vendor RAN</th>
                <th className="py-2.5 px-3.5 text-right">Baseline kWh</th>
                <th className="py-2.5 px-3.5 text-right">Efisiensi</th>
                <th className="py-2.5 px-3.5 text-right">Reduksi Emisi</th>
                <th className="py-2.5 px-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {PILOT_SITES_SAMPLE.slice(0, 6).map((site) => {
                const isTreat = site.type === 'Intervensi';
                return (
                  <tr key={site.id} className="hover:bg-slate-50 transition">
                    <td className="py-2.5 px-3.5 font-mono font-bold text-red-600">{site.id}</td>
                    <td className="py-2.5 px-3.5">
                      <div className="font-bold text-slate-900">{site.name}</div>
                      <div className="text-[10px] text-slate-400">{site.city} • {site.towerType}</div>
                    </td>
                    <td className="py-2.5 px-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                        isTreat ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {isTreat ? 'INTERVENSI' : 'KONTROL'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 font-medium">{site.vendor}</td>
                    <td className="py-2.5 px-3.5 text-right font-mono">{site.baselineKWhYear.toLocaleString('id-ID')}</td>
                    <td className="py-2.5 px-3.5 text-right font-mono font-bold text-emerald-700">
                      {isTreat ? `-${site.currentEffPct}%` : 'Baseline'}
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-mono">{site.emissionsReducedTon} Ton</td>
                    <td className="py-2.5 px-3.5 text-center">
                      <button
                        onClick={() => handleOpenEvidence(site.id)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold cursor-pointer transition shadow-2xs"
                      >
                        Periksa Bukti
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Evidence Explorer */}
      <EvidenceExplorerModal
        isOpen={isEvidenceModalOpen}
        onClose={() => setIsEvidenceModalOpen(false)}
        initialSiteId={selectedSiteForEvidence}
        simState={simState}
      />

    </div>
  );
}
