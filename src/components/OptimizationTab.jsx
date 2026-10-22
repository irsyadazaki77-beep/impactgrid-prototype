import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  ShieldAlert, 
  Check, 
  X, 
  ArrowRight, 
  Activity, 
  Sliders, 
  Zap, 
  Clock,
  Layers,
  Info,
  DollarSign,
  TrendingUp,
  Briefcase,
  Cpu,
  Code
} from 'lucide-react';
import { 
  INVESTMENT_PORTFOLIO_RECOMMENDATIONS,
  PILOT_CAPEX_BREAKDOWN,
  SYSTEM_METADATA 
} from '../data/mockData';

export default function OptimizationTab({ 
  isAutonomous, 
  setIsAutonomous, 
  failsafeActive,
  onOpenEmergencyModal,
  emergencyState = { active: false }
}) {
  const [recommendations, setRecommendations] = useState(INVESTMENT_PORTFOLIO_RECOMMENDATIONS);
  const [selectedExplainer, setSelectedExplainer] = useState(null);

  const handleApprove = (id) => {
    setRecommendations(prev => prev.map(rec => {
      if (rec.id === id) {
        return { ...rec, humanDecision: 'TELAH DISETUJUI & DIVALIDASI' };
      }
      return rec;
    }));
  };

  return (
    <div className="space-y-6">
      {/* Module 3 Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800">
              <Briefcase className="w-3.5 h-3.5 text-amber-600" />
              <span>Modul 3: Investment Prioritizer</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
              Optimasi Portofolio Investasi Antarlokasi dalam Batas Anggaran
            </h1>
            <p className="text-xs text-slate-600 max-w-3xl leading-relaxed mt-1">
              Memecahkan keterbatasan anggaran korporat Telkomsel dengan memilih kombinasi intervensi (pendinginan, micro-sleep, pembaruan perangkat, atau solar) yang memberikan <strong>manfaat NPV tertinggi</strong> sambil memastikan kepatuhan penuh terhadap kendali aset menara dan mutu layanan (QoS).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* CTO Emergency Surge Drill Button */}
            <button
              onClick={onOpenEmergencyModal}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition shadow-xs flex items-center space-x-1.5 cursor-pointer ${
                emergencyState.active 
                  ? 'bg-amber-400 text-slate-950 animate-pulse border-2 border-red-500' 
                  : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
              }`}
              title="Uji Lonjakan Beban 300% & Pembuktian SLA 112"
            >
              <ShieldAlert className={`w-3.5 h-3.5 ${emergencyState.active ? 'text-red-700' : 'text-red-600'}`} />
              <span>{emergencyState.active ? '⚡ KONDISI DARURAT AKTIF' : 'Simulasi Lonjakan Trafik (CTO Drill)'}</span>
            </button>

            <div className="flex items-center space-x-1.5">
              <span className="text-xs text-slate-500 font-semibold">Otorisasi:</span>
              <button
                onClick={() => setIsAutonomous(!isAutonomous)}
                className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition cursor-pointer shadow-xs ${
                  isAutonomous 
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                {isAutonomous ? 'AI REKOMENDASI TERVALIDASI' : 'MANUAL APPROVAL WAJIB'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Rincian Komponen Biaya Investasi Awal CapEx (Tabel 5 Proposal) */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>Rincian Komponen Biaya Investasi Awal CapEx Uji Coba (Tabel 5 Proposal)</span>
            </h2>
            <p className="text-xs text-slate-500">Total Belanja Modal (CapEx) Tahap Uji Coba: <strong>Rp450.000.000</strong></p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">OpEx: Rp60 Juta/Tahun</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {PILOT_CAPEX_BREAKDOWN.map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex justify-between items-start">
                <span className="font-bold text-slate-900 text-xs">{item.komponen}</span>
                <span className="text-xs font-mono font-bold text-emerald-700 shrink-0 ml-2">
                  Rp {(item.biayaIDR).toLocaleString('id-ID')}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                {item.justifikasi}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Rekomendasi Portofolio Berdasarkan Horizon (Tabel 7 Proposal) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>Rekomendasi Portofolio Proyek Terpilih (Sesuai 3 Horizon Proposal)</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {recommendations.length} Rekomendasi Portofolio
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {recommendations.map((rec) => (
            <div 
              key={rec.id} 
              className="p-5 md:p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition space-y-3.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono text-red-600 font-bold uppercase tracking-wider">{rec.id}</span>
                  <h3 className="text-sm font-bold text-slate-900 mt-0.5">{rec.siteGroup}</h3>
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-50 border border-indigo-200 text-indigo-700 shrink-0">
                  {rec.humanDecision}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">Ruang Lingkup Intervensi Terpilih:</span>
                <p className="font-bold text-slate-900 mt-0.5">{rec.intervention}</p>
                <p className="text-[11px] text-emerald-700 font-semibold mt-1">Perlindungan QoS: {rec.qosAssurance}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-semibold">Kebutuhan CapEx</span>
                  <span className="font-bold text-rose-600">Rp {(rec.estCostIDR).toLocaleString('id-ID')}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-semibold">Manfaat Bersih / Thn</span>
                  <span className="font-bold text-emerald-700">Rp {(rec.netAnnualBenefitIDR).toLocaleString('id-ID')}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-semibold">Balik Modal (PBP)</span>
                  <span className="font-bold text-slate-900">{rec.paybackYears} Tahun</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-semibold">Reduksi Emisi</span>
                  <span className="font-bold text-cyan-800">{rec.carbonReducedTon.toLocaleString('id-ID')} tCO2e/thn</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-[11px] text-slate-600">
                  NPV 5 Tahun (Diskonto 10%): <strong className="text-emerald-700 font-bold">+Rp {(rec.npv10PctIDR).toLocaleString('id-ID')}</strong>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedExplainer(rec)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center space-x-1 cursor-pointer border border-slate-200"
                    title="Inspeksi Bobot Algoritma AI & Payload API Multi-Vendor"
                  >
                    <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Explain AI (XAI)</span>
                  </button>
                  <button 
                    onClick={() => handleApprove(rec.id)}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Validasi Portofolio</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Decision Inspector Modal (XAI / SHAP Explainer) */}
      {selectedExplainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 space-y-5 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase">AI Decision Explainability (XAI)</span>
                  <h3 className="text-base font-black text-slate-900">{selectedExplainer.siteGroup}</h3>
                </div>
              </div>
              <button 
                onClick={() => setSelectedExplainer(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Faktor Bobot Penentu Keputusan (SHAP Feature Importance):
              </span>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between font-semibold text-slate-600 mb-1">
                    <span>1. Histori & Prediksi Trafik Rendah (00:00 - 05:00)</span>
                    <span className="text-indigo-600 font-bold">45% Bobot</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-semibold text-slate-600 mb-1">
                    <span>2. Suhu Shelter & Efisiensi PUE (Pendingin AC)</span>
                    <span className="text-emerald-600 font-bold">25% Bobot</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-semibold text-slate-600 mb-1">
                    <span>3. Toleransi Margin Latensi QoS (&lt; 15 ms)</span>
                    <span className="text-amber-600 font-bold">20% Bobot</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-semibold text-slate-600 mb-1">
                    <span>4. Cadangan Daya Baterai / Genset Telemetri</span>
                    <span className="text-slate-600 font-bold">10% Bobot</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-slate-400 h-2 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Vendor API Command Preview */}
            <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 text-xs font-mono space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-1.5">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <Code className="w-3.5 h-3.5" /> Outbound Vendor Command Payload (JSON-RPC)
                </span>
                <span>Standar 3GPP Rel 17</span>
              </div>
              <pre className="text-[11px] leading-relaxed overflow-x-auto text-emerald-300">
{`{
  "command": "TRIGGER_MICRO_SLEEP_TRX",
  "target_sites": ["BDG-KAC-001", "BDG-KAC-002"],
  "vendor_adapter": "Ericsson ENM / Huawei iMaster",
  "policy": {
    "wake_up_latency_limit_ms": 120,
    "bypass_on_emergency_call": true,
    "max_duration_minutes": 360
  },
  "audit_hash": "sha256-4a9f73b18c..."
}`}
              </pre>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedExplainer(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition cursor-pointer"
              >
                Tutup Inspeksi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
