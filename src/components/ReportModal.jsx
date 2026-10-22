import React from 'react';
import { 
  X, 
  Printer, 
  ShieldCheck, 
  CheckCircle2, 
  FileText 
} from 'lucide-react';
import { SYSTEM_METADATA, IMPLEMENTATION_HORIZONS } from '../data/mockData';

export default function ReportModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const pilot = IMPLEMENTATION_HORIZONS.pilot;
  const baseScenario = pilot.scenarios[1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-slate-200 p-6 md:p-8 shadow-2xl text-slate-800 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-2 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs">
              <img 
                src="/assets/logo_utama_impactgrid.png" 
                alt="ImpactGrid Logo" 
                className="h-10 w-auto object-contain" 
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  Laporan Hasil Verifikasi Tahap Uji Coba (Tabel 6 & 8 Proposal)
                </h2>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800">
                  VERIFIED
                </span>
              </div>
              <p className="text-xs text-slate-500">
                PT Telekomunikasi Selular • ImpactGrid Pilot Stage (40 Intervensi + 10 Pembanding)
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

        {/* Certificate / Statement Content */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4 text-xs">
          <div className="flex justify-between items-center text-slate-500 text-[11px] border-b border-slate-200 pb-2">
            <span>Nomor Dokumen: <strong className="text-slate-800">TSEL-TSF2026-IG-PILOT-01</strong></span>
            <span>Tanggal Verifikasi: <strong className="text-slate-800">21 Oktober 2026</strong></span>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-sm font-bold text-slate-900">Ringkasan Eksekutif Uji Coba 40 Lokasi (Skenario Dasar 10%):</h3>
            <p className="text-slate-600 leading-relaxed font-normal">
              Berdasarkan hasil pemantauan terstruktur Network Data Hub pada 40 lokasi intervensi dan 10 lokasi kontrol di kluster Jamali, intervensi penyesuaian suhu pendinginan dan optimasi sleep mode perangkat terbukti menghasilkan efisiensi energi terukur sesuai standar <strong>ITU-T L.1331</strong>:
            </p>
          </div>

          {/* Metric Grid Data Asli Proposal */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-1">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">Listrik Dihemat</span>
              <span className="text-base font-black text-emerald-700">200.000 kWh</span>
              <span className="text-[10px] text-slate-400">200 MWh / tahun</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">Reduksi Scope 2</span>
              <span className="text-base font-black text-emerald-700">~174 Ton</span>
              <span className="text-[10px] text-slate-400">CO2e terhindar / thn</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">Manfaat Bersih</span>
              <span className="text-base font-black text-slate-900">Rp 240 Juta</span>
              <span className="text-[10px] text-slate-400">setelah OpEx Rp60 Jt</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">NPV 5 Thn (10%)</span>
              <span className="text-base font-black text-cyan-800">+Rp 460 Juta</span>
              <span className="text-[10px] text-slate-400">Balik modal 1,9 tahun</span>
            </div>
          </div>

          {/* Kesesuaian Standar Pelaporan */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <span className="font-bold text-slate-800">Kesesuaian Standar Keberlanjutan & Regulasi:</span>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-slate-600 font-medium">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>ITU-T L.1331 (Baseline Terkoreksi Trafik/Cuaca)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>POJK No. 51/POJK.03/2017 (Keuangan Berkelanjutan)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>GRI 302 (Konsumsi Energi) & GRI 305 (Scope 2)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Panduan Pelaporan ESG Bursa Efek Indonesia (BEI)</span>
              </li>
            </ul>
          </div>

          {/* Signature Block */}
          <div className="pt-3 border-t border-slate-200 flex justify-between items-end text-[11px] text-slate-500">
            <div>
              <p className="font-bold text-slate-700">Modul Verifikasi:</p>
              <p className="font-mono text-[10px] text-slate-600">ImpactGrid ESG Impact Verification (Modul 4)</p>
              <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">Koreksi: 10 Lokasi Kontrol Pembanding</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-700">Tim Pengusul:</p>
              <p className="text-slate-900 font-bold">AWAKENING Reborn</p>
              <p className="text-[10px] text-slate-500">Proposal Semifinal BCC TSF 2026</p>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition shadow-xs"
          >
            Tutup
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm shadow-red-500/20 flex items-center space-x-2 cursor-pointer transition"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
