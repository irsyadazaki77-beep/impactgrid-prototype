import React from 'react';
import { 
  Leaf, 
  ShieldCheck, 
  Award, 
  FileCheck, 
  FileDown, 
  TrendingDown, 
  CheckCircle2, 
  Lock, 
  ExternalLink, 
  Table 
} from 'lucide-react';
import { 
  ESG_FRAMEWORK_DATA, 
  SYSTEM_METADATA, 
  IMPLEMENTATION_HORIZONS 
} from '../data/mockData';

export default function ESGComplianceTab({ onOpenReportModal }) {
  const pilot = IMPLEMENTATION_HORIZONS.pilot;
  const baseScenario = pilot.scenarios[1];

  return (
    <div className="space-y-6">
      {/* Module 4 Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              <span>Modul 4: ESG Impact Verification</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
              Verifikasi Dampak Dekarbonisasi Scope 2 & Tata Kelola (Tabel 8)
            </h1>
            <p className="text-xs text-slate-600 max-w-3xl leading-relaxed mt-1">
              Memastikan seluruh klaim penurunan emisi Scope 2 terverifikasi secara metodologis (standar <strong>ITU-T L.1331</strong>) dengan memisahkan pengaruh fluktuasi cuaca dan kenaikan trafik data, serta membandingkan hasil intervensi terhadap <strong>10 lokasi kontrol pembanding</strong> guna mencegah klaim berlebih (*anti-greenwashing*).
            </p>
          </div>

          <button
            onClick={onOpenReportModal}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition cursor-pointer shrink-0"
          >
            <FileDown className="w-4 h-4" />
            <span>Generate Laporan Verifikasi MRV</span>
          </button>
        </div>
      </div>

      {/* Skala Beban Emisi Scope 2 Telkomsel (Konteks Korporat) */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-emerald-600" />
              <span>Skala Beban Emisi Scope 2 Telkomsel Berdasarkan Laporan Keberlanjutan 2025</span>
            </h2>
            <p className="text-xs text-slate-500">Total Penggunaan Listrik Operasional: <strong>1,885 miliar kWh</strong></p>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
            Scope 2 = 63,6% Total Emisi
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-slate-500 block font-semibold text-[11px]">Total Emisi Scope 2 Telkomsel</span>
            <span className="text-2xl font-black text-slate-900">1,722 Juta ton</span>
            <p className="text-[11px] text-slate-500">berbasis lokasi dari total 2.708.749 ton CO2e</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-slate-500 block font-semibold text-[11px]">Beban Emisi Sistem Jamali</span>
            <span className="text-2xl font-black text-amber-700">726.890 ton</span>
            <p className="text-[11px] text-slate-500">konsumsi 835,5 GWh di Jawa-Madura-Bali</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-slate-500 block font-semibold text-[11px]">Reduksi Uji Coba (Skenario Dasar)</span>
            <span className="text-2xl font-black text-emerald-700">174 ton CO2e</span>
            <p className="text-[11px] text-slate-500">dari efisiensi 200 MWh/thn pada 40 lokasi</p>
          </div>
        </div>
      </div>

      {/* Matriks Kerangka Pengukuran Dampak Keberlanjutan E-S-G (Tabel 8 Proposal) */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Table className="w-4 h-4 text-emerald-600" />
            <span>Tabel 8 Proposal: Kerangka Pengukuran Dampak Keberlanjutan (E-S-G & SDGs)</span>
          </h2>
          <span className="text-xs font-mono font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">ITU-T L.1331 & GRI Standard</span>
        </div>

        <div className="space-y-3.5 text-xs">
          {ESG_FRAMEWORK_DATA.map((row, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200/80 pb-2">
                <span className="font-black text-sm text-slate-900">{row.dimension}</span>
                <span className="text-emerald-700 font-bold text-xs">{row.sdg}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">Indikator Kinerja (KPI)</span>
                  <p className="text-slate-800 font-semibold text-[11px] mt-0.5">{row.kpis}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">Metodologi Pengukuran</span>
                  <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">{row.methodology}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">Ambang Batas Keberhasilan</span>
                  <p className="text-slate-800 font-semibold text-[11px] mt-0.5">{row.threshold}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Jaminan Integritas Data & Anti-Greenwashing */}
      <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
        <div className="flex items-center space-x-3.5">
          <div className="p-2.5 rounded-xl bg-white border border-emerald-200 text-emerald-700 shadow-xs">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">Prinsip Anti-Greenwashing Berbasis Lokasi Pembanding</h4>
            <p className="text-slate-600 text-[11px] leading-relaxed mt-0.5 font-normal">
              Klaim penghematan energi wajib dikoreksi terhadap data 10 lokasi pembanding (kontrol) dan variasi cuaca/suhu udara. Jika terjadi penurunan konsumsi akibat penurunan trafik data umum, hal tersebut tidak diklaim sebagai prestasi intervensi.
            </p>
          </div>
        </div>

        <div className="font-mono text-[11px] font-bold text-emerald-800 bg-white px-3 py-1.5 rounded-xl border border-emerald-200 shadow-xs shrink-0">
          Standar: ITU-T L.1331
        </div>
      </div>
    </div>
  );
}
