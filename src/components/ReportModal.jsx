import React from 'react';
import { X, Printer, FileText, ShieldCheck, CheckCircle2, AlertTriangle, Building2, Layers } from 'lucide-react';

export default function ReportModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handlePrint = () => window.print();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 p-3 sm:p-5 print:p-0 print:bg-white print:static print:inset-auto">
      <div 
        id="printable-executive-board-memo"
        className="relative max-h-[92vh] w-full max-w-4xl space-y-5 overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 text-slate-800 shadow-2xl md:p-8 print:max-h-none print:shadow-none print:border-none print:p-4 print:space-y-4 print:text-black"
      >
        {/* Modal Header / Letterhead */}
        <header className="flex items-start justify-between border-b-2 border-red-600 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 text-[#ED0226] rounded-xl print:p-0 print:bg-transparent">
              <FileText className="h-8 w-8 text-[#ED0226]" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-red-600">
                Dokumen Telaah Eksekutif • PT Telekomunikasi Selular
              </div>
              <h2 className="text-xl font-black text-slate-900 print:text-lg">
                Rencana validasi data dan sensitivitas awal
              </h2>
              <p className="text-xs text-slate-500 font-semibold">
                Executive Board Memo: Usulan Kerangka Keputusan Efisiensi Energi RAN • ImpactGrid Enterprise Suite
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            aria-label="Tutup" 
            className="rounded-xl bg-slate-100 p-2 text-slate-600 hover:bg-slate-200 print:hidden cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* Warning / Integrity Notice */}
        <section className="rounded-xl border border-amber-300 bg-amber-50/80 p-3.5 text-xs leading-relaxed text-amber-950 print:border-slate-300 print:bg-slate-50">
          <strong>Batas Klaim & Integritas Data:</strong> Lembar kerja ini merangkum rancangan uji coba dan analisis sensitivitas parametrik. Seluruh angka finansial dan proyeksi penghematan berstatus simulasi hingga disahkannya <strong>Audit Kesiapan Gerbang G0</strong> bersama pemilik jaringan dan mitra menara.
        </section>

        {/* 1. Context & Business Materiality */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 print:grid-cols-3">
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 print:bg-white">
            <span className="text-[10px] font-bold uppercase text-slate-500">Konsumsi Listrik TLKM 2025</span>
            <div className="text-base font-black text-slate-900 mt-0.5">1,885 Miliar kWh</div>
            <p className="text-[10px] text-slate-500">Konteks laporan keberlanjutan resmi</p>
          </div>
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 print:bg-white">
            <span className="text-[10px] font-bold uppercase text-slate-500">Emisi Scope 2 (Listrik)</span>
            <div className="text-base font-black text-slate-900 mt-0.5">1.721.967 tCO₂e</div>
            <p className="text-[10px] text-slate-500">63,6% dari total emisi Telkomsel</p>
          </div>
          <div className="p-3 rounded-xl border border-red-200 bg-red-50/50 print:bg-white">
            <span className="text-[10px] font-bold uppercase text-red-600">Plafon Audit G0 yang Diminta</span>
            <div className="text-base font-black text-red-600 mt-0.5">Maks Rp 95 Juta (2 Bln)</div>
            <p className="text-[10px] text-slate-500">Biaya verifikasi sebelum pilot</p>
          </div>
        </div>

        {/* 2. Sensitivitas Finansial Pilot 40 Site */}
        <section className="space-y-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
            Tabel Sensitivitas Finansial (40 Lokasi Intervensi + 10 Kontrol)
          </h3>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[10px] uppercase text-slate-500 font-bold">
                <tr>
                  <th className="p-2.5">Asumsi Baseline Menara</th>
                  <th className="p-2.5">Volume Energi/Th</th>
                  <th className="p-2.5">NPV 5-Tahun (Hemat 8%)</th>
                  <th className="p-2.5">Payback Period</th>
                  <th className="p-2.5">Implikasi Keputusan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-2.5 font-bold">Asumsi A: 50 kWh/site/hari</td>
                  <td className="p-2.5">730.000 kWh</td>
                  <td className="p-2.5 font-bold text-rose-600">−Rp 391,5 Juta</td>
                  <td className="p-2.5">&gt; 5 Tahun</td>
                  <td className="p-2.5 text-[11px] text-slate-600">Intervensi tidak layak; tunda pemasangan fisik</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">Asumsi B: 50 MWh/site/th (Moderat)</td>
                  <td className="p-2.5">2.000.000 kWh</td>
                  <td className="p-2.5 font-bold text-emerald-600">+Rp 82,3 Jt s.d. +Rp 460 Jt</td>
                  <td className="p-2.5">1,9 Tahun</td>
                  <td className="p-2.5 text-[11px] text-slate-600">Layak dieksekusi; memenuhi kriteria swadana</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-slate-500 italic">
            *Parameter: Tarif PLN Rp1.500/kWh, CapEx Rp450 Jt (IoT submetering 0.5s), OpEx Rp60 Jt/th, WACC 10%.
          </p>
        </section>

        {/* 3. Stage-Gate De-risking Framework & Decision Flow */}
        <section className="space-y-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
            Rekomendasi Keputusan Dewan Direksi (Gerbang G0–G3)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
              <span className="font-bold text-slate-900 block text-[11px]">Gerbang G0 (Bulan 2)</span>
              <p className="text-[10px] text-slate-500 mt-0.5">Audit meter AMR, izin TowerCo, & verifikasi kapabilitas vendor.</p>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
              <span className="font-bold text-slate-900 block text-[11px]">Gerbang G1 (Bulan 5)</span>
              <p className="text-[10px] text-slate-500 mt-0.5">Uji coba terkendali 5 site percontohan; validasi zero call drop.</p>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
              <span className="font-bold text-slate-900 block text-[11px]">Gerbang G2 (Bulan 11)</span>
              <p className="text-[10px] text-slate-500 mt-0.5">Evaluasi DiD 40+10 site; audit penghematan rekening PLN.</p>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
              <span className="font-bold text-slate-900 block text-[11px]">Gerbang G3 (Bulan 14)</span>
              <p className="text-[10px] text-slate-500 mt-0.5">Keputusan skala swadana Horizon 1.5 (250 site metro).</p>
            </div>
          </div>
        </section>

        {/* 4. Board Sign-off Box */}
        <section className="pt-2 border-t border-slate-200">
          <div className="text-[10px] font-bold uppercase text-slate-500 mb-2">Persetujuan Prinsip Dewan Direksi</div>
          <div className="grid grid-cols-3 gap-4 text-center text-xs">
            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50">
              <div className="h-10 border-b border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400">
                [Tanda Tangan Elektronik]
              </div>
              <div className="mt-1 font-bold text-slate-900 text-[11px]">Direktur Network (CTO)</div>
              <div className="text-[9px] text-slate-400">Persetujuan Guardrail Mutu Layanan</div>
            </div>

            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50">
              <div className="h-10 border-b border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400">
                [Tanda Tangan Elektronik]
              </div>
              <div className="mt-1 font-bold text-slate-900 text-[11px]">Direktur Keuangan (CFO)</div>
              <div className="text-[9px] text-slate-400">Plafon Anggaran Audit G0 (Rp95 Jt)</div>
            </div>

            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50">
              <div className="h-10 border-b border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400">
                [Tanda Tangan Elektronik]
              </div>
              <div className="mt-1 font-bold text-slate-900 text-[11px]">Network Strategy & Optimization Division</div>
              <div className="text-[9px] text-slate-400">PT Telekomunikasi Selular</div>
            </div>
          </div>
        </section>

        {/* Footer Actions */}
        <footer className="flex items-center justify-between border-t border-slate-200 pt-3 print:hidden">
          <span className="text-xs text-slate-500">
            Format cetak dioptimalkan untuk 1 halaman A4 Portrait/Landscape.
          </span>
          <div className="flex gap-2">
            <button 
              onClick={onClose} 
              className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 cursor-pointer"
            >
              Tutup
            </button>
            <button 
              onClick={handlePrint} 
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 cursor-pointer shadow-2xs"
            >
              <Printer className="h-4 w-4" /> Cetak / PDF
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
