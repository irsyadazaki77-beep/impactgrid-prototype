import React, { useMemo } from 'react';
import { 
  X, 
  Printer, 
  ShieldCheck, 
  CheckCircle2, 
  FileText,
  AlertTriangle,
  Info,
  Scale,
  Award
} from 'lucide-react';
import { calculateDiDMetrics, evaluateExecutiveDecisionGates } from '../utils/evidenceEngine';
import { PILOT_SITES_SAMPLE } from '../data/mockData';

export default function ReportModal({ 
  isOpen, 
  onClose,
  simState = { plnTariffIDR: 1500, tempC: 28, trafficMultiplier: 1.0, carrierSleepActive: true, emergencyActive: false }
}) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const didAnalysis = useMemo(() => {
    return calculateDiDMetrics({
      sites: PILOT_SITES_SAMPLE,
      simState
    });
  }, [simState]);

  const { gates, overall } = useMemo(() => {
    return evaluateExecutiveDecisionGates(didAnalysis);
  }, [didAnalysis]);

  const { didResults, preTrendTest, meta } = didAnalysis;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/65 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white border border-slate-200 p-6 md:p-8 shadow-2xl text-slate-800 space-y-6">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs">
              <img 
                src="/assets/logo_utama_impactgrid.png" 
                alt="ImpactGrid Logo" 
                className="h-10 w-auto object-contain" 
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Laporan Hasil Validasi Uji Coba (Pilot Evidence Report)
                </h2>
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900">
                  SYNTHETIC / EVALUATION DRAFT
                </span>
              </div>
              <p className="text-xs text-slate-500">
                PT Telekomunikasi Selular • ImpactGrid Trust & Reliability Engine (40 Intervensi + 10 Kontrol Jamali)
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Executive Summary & Gate Status */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-xs">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-slate-500 text-[11px] border-b border-slate-200 pb-2.5 gap-1">
            <span>Nomor Dokumen: <strong className="text-slate-800 font-mono">TSEL-TSF2026-IG-PILOT-01-EVID</strong></span>
            <span>Metodologi: <strong className="text-slate-800">ITU-T L.1331 Difference-in-Differences</strong></span>
            <span>Klasifikasi: <strong className="text-amber-800 font-mono">SYNTHETIC_DATA_MODEL</strong></span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 text-white">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Rekomendasi Gerbang Keputusan Eksekutif:
              </span>
              <span className="text-lg font-black text-emerald-400">
                STATUS: {overall.recommendation}
              </span>
            </div>
            <div className="text-right text-[11px] font-mono text-slate-300">
              <span>Signifikansi Statistik: <strong>p {didResults.pValue}</strong></span>
              <span className="block text-slate-400">95% CI: [{didResults.confidenceInterval95.lower.toLocaleString('id-ID')} - {didResults.confidenceInterval95.upper.toLocaleString('id-ID')} kWh]</span>
            </div>
          </div>

          {/* 4 Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-1">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">Efisiensi DiD Terisolasi</span>
              <span className="text-base font-black text-emerald-700">+{didResults.isolatedEnergySavedKWh.toLocaleString('id-ID')} kWh</span>
              <span className="text-[10px] text-slate-400 block font-mono">±{didResults.standardErrorKWh.toLocaleString('id-ID')} kWh SE</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">Reduksi Emisi Scope 2</span>
              <span className="text-base font-black text-emerald-700">{didResults.isolatedEmissionsReducedTon} Ton CO2e</span>
              <span className="text-[10px] text-slate-400 block font-mono">0,87 kg CO2/kWh</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">Manfaat Bersih Tahunan</span>
              <span className="text-base font-black text-slate-900">Rp {(didResults.netAnnualBenefitIDR / 1e6).toFixed(0)} Jt</span>
              <span className="text-[10px] text-slate-400 block font-mono">Tarif: Rp{meta.tariffIDR}/kWh</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">NPV 5 Tahun (WACC 10%)</span>
              <span className="text-base font-black text-cyan-800">+Rp {(didResults.npv5YearsIDR / 1e6).toFixed(0)} Jt</span>
              <span className="text-[10px] text-slate-400 block font-mono">PBP: {didResults.paybackYears} Tahun</span>
            </div>
          </div>

          {/* 4 Decision Gates Table */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <span className="font-bold text-slate-800 block text-xs">Evaluasi 4 Ambang Batas Gerbang Keputusan (Gate Criteria):</span>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
              {gates.map((g) => (
                <div key={g.id} className="p-2.5 flex items-center justify-between text-[11px]">
                  <div>
                    <strong className="text-slate-900">{g.title}</strong>
                    <span className="text-slate-500 block text-[10px]">{g.threshold} • Aktual: {g.actual}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    g.status === 'PASS' ? 'bg-emerald-100 text-emerald-800' :
                    g.status === 'WARNING' ? 'bg-amber-100 text-amber-800' :
                    'bg-rose-100 text-rose-800'
                  }`}>
                    {g.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Asumsi, Metodologi, & Keterbatasan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200 text-[11px] text-slate-600">
            <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
              <strong className="text-slate-900 block font-sans">Metodologi & Asumsi Kunci:</strong>
              <ul className="list-disc pl-4 space-y-0.5 text-[10px]">
                <li>Pendekatan kuasi-eksperimental Difference-in-Differences (DiD) sesuai rekomendasi ITU-T L.1331.</li>
                <li>Normalisasi beban trafik (+{meta.trafficGrowthPct}%) dan suhu BMKG ({meta.tempC}°C) terhadap kelompok kontrol.</li>
                <li>WACC 10% dan asumsi tarif listrik PLN B2/B3 Rp{meta.tariffIDR}/kWh.</li>
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
              <strong className="text-slate-900 block font-sans">Keterbatasan & Pernyataan Transparansi:</strong>
              <ul className="list-disc pl-4 space-y-0.5 text-[10px]">
                <li>Data merupakan <em>synthetic simulation model</em> untuk demo pitching kompetisi BCC TSF 2026.</li>
                <li>Tidak mewakili persetujuan definitif Dewan Direksi Telkomsel komersial.</li>
                <li>Diperlukan verifikasi lapangan lanjutan sebelum penandatanganan pengadaan CapEx Fase 2.</li>
              </ul>
            </div>
          </div>

          {/* Compliance Standards Footer */}
          <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Standar: ITU-T L.1331 • ISO 14064-2 • POJK 51/POJK.03/2017 • GRI 302/305</span>
            <span>Tim Pengusul: AWAKENING Reborn (BCC TSF 2026)</span>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-[11px] text-slate-500">
            Format cetak dioptimalkan untuk PDF / A4 Portrait via dialog peramban.
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition"
            >
              Tutup
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center space-x-2 cursor-pointer transition shadow-xs shadow-red-500/20"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Unduh Laporan PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

