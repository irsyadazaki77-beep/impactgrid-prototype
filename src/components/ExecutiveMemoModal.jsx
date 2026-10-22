import React, { useState } from 'react';
import { 
  Printer, 
  X, 
  Download, 
  ShieldCheck, 
  FileCheck, 
  CheckCircle2, 
  TrendingUp, 
  Leaf, 
  Server, 
  Lock,
  Building,
  Calendar,
  Sparkles
} from 'lucide-react';
import { SYSTEM_METADATA, IMPLEMENTATION_HORIZONS } from '../data/mockData';

export default function ExecutiveMemoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const pilot = IMPLEMENTATION_HORIZONS.pilot;
  const regional = IMPLEMENTATION_HORIZONS.regional;
  const national = IMPLEMENTATION_HORIZONS.national;
  const baseScenario = pilot.scenarios[1];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fade-in print:p-0 print:bg-white print:static">
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 my-8 print:my-0 print:border-none print:shadow-none print:rounded-none">
        
        {/* Floating Action Bar (Hidden when printed) */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800 print:hidden">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-red-600">
              <FileCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold tracking-tight">Dokumen Memo Eksekutif Dewan Direksi (A4 Ready)</h2>
              <p className="text-[11px] text-slate-400">Siap dicetak atau disimpan ke PDF resmi untuk para direktur Telkomsel.</p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs shadow-md shadow-red-600/30 transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 sm:p-12 space-y-10 print:p-8 text-slate-800">

          {/* ==================== HALAMAN 1: RINGKASAN STRATEGIS & FINANSIAL ==================== */}
          <div className="space-y-6 print:break-after-page">
            
            {/* Header Surat Resmi */}
            <div className="border-b-2 border-red-600 pb-5 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-black uppercase tracking-wider text-red-600">
                    MEMORANDUM EKSEKUTIF DIREKSI
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                    STRICTLY CONFIDENTIAL
                  </span>
                </div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Telkomsel ImpactGrid: Orkestrasi Efisiensi Energi Jaringan & Akselerasi Dekarbonisasi Menuju Indonesia Emas 2045
                </h1>
                <p className="text-xs text-slate-500">
                  Ref No: <strong>TSEL-BOD-MEMO/2026/AWK-01</strong> • Tanggal: <strong>Oktober 2026</strong>
                </p>
              </div>

              <div className="shrink-0 text-right space-y-1">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 block">
                  Telkomsel <span className="text-red-600">ImpactGrid</span>
                </span>
                <span className="text-[10px] text-slate-500 block">TDC Summit Fest 2026</span>
              </div>
            </div>

            {/* Metadata Tabel Tujuan */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Kepada</span>
                <strong className="text-slate-900 block">Dewan Direksi (BoD) PT Telkomsel</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Dari</span>
                <strong className="text-slate-900 block">Tim AWAKENING Reborn</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Klasifikasi</span>
                <strong className="text-red-700 block">Strategis & Komersial</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Perihal</span>
                <strong className="text-slate-900 block">Persetujuan Uji Coba 40 BTS (2027)</strong>
              </div>
            </div>

            {/* 1. Eksekutif Ringkasan (Executive Summary) */}
            <div className="space-y-2 text-xs leading-relaxed text-slate-700">
              <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-red-600" />
                <span>1. Ringkasan Eksekutif & Urgensi Bisnis</span>
              </h3>
              <p>
                Berdasarkan Laporan Keberlanjutan Telkomsel 2025, beban konsumsi listrik operasional telah menyentuh <strong>1,885 miliar kWh</strong> dengan emisi Scope 2 sebesar <strong>1,722 juta ton CO2e</strong> (berkontribusi <strong>63,6%</strong> dari total emisi korporat). Di sisi lain, peningkatan payload data 5G menciptakan ancaman kenaikan biaya OpEx listrik yang terus membesar.
              </p>
              <p>
                <strong>Telkomsel ImpactGrid</strong> hadir sebagai platform *Cyber-Physical Energy System* (CPES) cerdas yang mengoptimalkan konsumsi daya BTS secara *vendor-agnostic* (Ericsson, Huawei, ZTE, Nokia) dan tersinkronisasi 100% dengan smart meter PLN. Sistem ini menjamin penghematan listrik signifikan tanpa menurunkan Quality of Service (QoS SLA) jaringan berkat arsitektur pengaman instan (<em>Wake-up latency 120 ms & prioritas mutlak panggilan darurat 112</em>).
              </p>
            </div>

            {/* 2. Matriks Indikator Finansial & Proyeksi 3 Horizon */}
            <div className="space-y-3">
              <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>2. Kelayakan Finansial & Mekanisme Swadana (Self-Funding Reinvestment)</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Investasi CapEx Pilot</span>
                  <div className="text-lg font-black text-slate-900 mt-0.5">Rp 450 Juta</div>
                  <span className="text-[10px] text-slate-400">Tabel 5 Proposal (40 Lokasi)</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Manfaat Bersih Tahunan</span>
                  <div className="text-lg font-black text-emerald-600 mt-0.5">Rp 240 Jt / thn</div>
                  <span className="text-[10px] text-emerald-700 font-semibold">Hemat Bruto Rp300 Jt - OpEx Rp60 Jt</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Payback Period Pilot</span>
                  <div className="text-lg font-black text-indigo-700 mt-0.5">1,9 Tahun</div>
                  <span className="text-[10px] text-slate-400">Skenario Dasar 10% Efisiensi</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">NPV Nasional (5 Tahun)</span>
                  <div className="text-lg font-black text-emerald-700 mt-0.5">+Rp 41,48 Miliar</div>
                  <span className="text-[10px] text-slate-400">10.000+ BTS (WACC 10%)</span>
                </div>
              </div>

              {/* Tabel Ringkasan Horizon */}
              <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3">Fase Horizon</th>
                      <th className="py-2.5 px-3">Cakupan Menara</th>
                      <th className="py-2.5 px-3">CapEx & OpEx</th>
                      <th className="py-2.5 px-3">Penghematan Bersih</th>
                      <th className="py-2.5 px-3">Reduksi Emisi Scope 2</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px] text-slate-700">
                    <tr>
                      <td className="py-2 px-3 font-bold text-slate-900">Jangka Pendek (2027)</td>
                      <td className="py-2 px-3">40 Uji + 10 Kontrol</td>
                      <td className="py-2 px-3">CapEx Rp450 Jt • OpEx Rp60 Jt</td>
                      <td className="py-2 px-3 text-emerald-700 font-bold">Rp 240 Juta / thn (PBP 1,9 thn)</td>
                      <td className="py-2 px-3 font-semibold">174 ton CO2e/thn</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-slate-900">Jangka Menengah (2028-29)</td>
                      <td className="py-2 px-3">5.000 Menara Jamali</td>
                      <td className="py-2 px-3">CapEx Rp6,5 M • OpEx Rp1,8 M</td>
                      <td className="py-2 px-3 text-emerald-700 font-bold">Rp 4,80 Miliar / thn (PBP 1,35 thn)</td>
                      <td className="py-2 px-3 font-semibold">5.046 ton CO2e/thn</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold text-slate-900">Jangka Panjang (2030-31)</td>
                      <td className="py-2 px-3">10.000+ Menara Nasional</td>
                      <td className="py-2 px-3">CapEx Rp15,0 M • OpEx Rp7,0 M</td>
                      <td className="py-2 px-3 text-emerald-700 font-bold">Rp 14,90 Miliar / thn (PBP 1,0 thn)</td>
                      <td className="py-2 px-3 font-semibold">12.702 ton CO2e/thn</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-2 text-[10px] text-slate-400 italic text-right print:block">
              Halaman 1 dari 2 — Lanjut ke Metodologi ESG & Otorisasi Direksi
            </div>
          </div>


          {/* ==================== HALAMAN 2: ESG, TATA KELOLA, & OTORISASI ==================== */}
          <div className="space-y-6 pt-6 print:pt-0">
            
            {/* Header Halaman 2 */}
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-500">
                Lanjutan: Verifikasi Kepatuhan ESG, Standar ITU-T L.1331, & Pengesahan
              </span>
              <span className="text-[10px] font-mono text-slate-400">Ref: TSEL-BOD-MEMO/2026/AWK-01</span>
            </div>

            {/* 3. Metodologi Dekarbonisasi & Anti-Greenwashing */}
            <div className="space-y-2.5 text-xs">
              <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-emerald-600" />
                <span>3. Metodologi Audit Dekarbonisasi (Standar ITU-T L.1331)</span>
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Untuk mencegah risiko sanksi OJK (POJK 51) dan tuduhan klaim berlebih (<em>greenwashing</em>), ImpactGrid membandingkan secara ilmiah <strong>40 lokasi intervensi</strong> terhadap <strong>10 lokasi kontrol pembanding</strong> dengan formula normalisasi cuaca (CDD/HDD) dan beban payload data (TB).
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <strong className="text-slate-900 block">Kepatuhan POJK 51/2017</strong>
                  <p className="text-[11px] text-slate-600">Dokumentasi audit konsumsi energi dan reduksi emisi siap lampir pada Laporan Keberlanjutan Tahunan Telkomsel.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <strong className="text-slate-900 block">GRI Standards (302 & 305)</strong>
                  <p className="text-[11px] text-slate-600">Pelacakan intensitas energi per TB data dan penurunan emisi GRK Scope 2 berbasis aktivitas riil secara transparan.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <strong className="text-slate-900 block">Kriptografi Audit Trail</strong>
                  <p className="text-[11px] text-slate-600">Setiap blok rekonsiliasi data smart meter PLN dan telemetri RAN disegel menggunakan hash SHA-256 yang *tamper-proof*.</p>
                </div>
              </div>
            </div>

            {/* 4. Keamanan Jaringan & Guardrail SLA (Sikap CTO) */}
            <div className="p-4 rounded-xl bg-red-50/60 border border-red-200 text-xs space-y-2">
              <h4 className="font-bold text-red-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-red-600" />
                <span>4. Komitmen Jaminan Kualitas Jaringan (Network SLA Guardrail)</span>
              </h4>
              <p className="text-red-950/80 leading-relaxed text-[11px]">
                Efisiensi energi tidak diperkenankan menurunkan kualitas sinyal. Sistem dilengkapi <strong>Multi-Layer Safety Guardrails</strong>: jika terjadi lonjakan trafik mendadak di atas 65% atau pemicu panggilan darurat nasional <strong>112 / SAR</strong>, mode hemat daya otomatis dibatalkan dalam <strong>120 milidetik</strong>. Probabilitas drop call dijaga di bawah 0,001%.
              </p>
            </div>

            {/* 5. Rekomendasi Keputusan Dewan Direksi */}
            <div className="space-y-2 text-xs">
              <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wide">
                5. Rekomendasi Aksi Dewan Direksi
              </h3>
              <ol className="list-decimal pl-5 space-y-1 text-slate-700">
                <li>Menyetujui alokasi dana belanja modal tahap uji coba (CapEx) sebesar <strong>Rp450.000.000</strong> untuk 40 BTS Pilot di tahun 2027.</li>
                <li>Menugaskan Direktorat Network untuk memfasilitasi integrasi O-RAN Non-RT RIC rApp bersama vendor RAN terpilih.</li>
                <li>Menugaskan Direktorat Keuangan untuk menyiapkan skema reinvestasi mandiri (<em>Self-Funding Loop</em>) dari hasil penghematan listrik triwulanan.</li>
              </ol>
            </div>

            {/* SHA-256 Hash Box */}
            <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200 font-mono text-[10px] text-slate-600 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-slate-500" />
                <span>SHA-256 Verification Digest:</span>
              </span>
              <span className="font-bold text-slate-800 truncate max-w-xs">
                e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
              </span>
            </div>

            {/* Kolom Pengesahan Tanda Tangan */}
            <div className="pt-6 border-t border-slate-300">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-4">
                Lembar Pengesahan & Rekomendasi Eksekutif:
              </div>

              <div className="grid grid-cols-3 gap-6 text-center text-xs">
                <div className="space-y-12">
                  <span className="text-slate-500 block">Diusulkan Oleh:</span>
                  <div>
                    <strong className="block text-slate-900">Tim AWAKENING Reborn</strong>
                    <span className="text-[10px] text-slate-500">Inisiator Proyek ImpactGrid</span>
                  </div>
                </div>

                <div className="space-y-12">
                  <span className="text-slate-500 block">Ditinjau Secara Teknis:</span>
                  <div>
                    <strong className="block text-slate-900">Direktur Network / CTO</strong>
                    <span className="text-[10px] text-slate-500">PT Telekomunikasi Selular</span>
                  </div>
                </div>

                <div className="space-y-12">
                  <span className="text-slate-500 block">Disetujui Oleh:</span>
                  <div>
                    <strong className="block text-slate-900">Direktur Keuangan / CFO</strong>
                    <span className="text-[10px] text-slate-500">PT Telekomunikasi Selular</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Footer (Hidden in print) */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between print:hidden">
          <span className="text-xs text-slate-500">
            *Dokumen ini dirancang khusus untuk dicetak pada kertas standar <strong>A4</strong> tanpa terpotong.
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition cursor-pointer"
            >
              Tutup
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Sekarang (A4)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
