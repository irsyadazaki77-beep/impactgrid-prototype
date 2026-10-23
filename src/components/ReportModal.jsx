import React from 'react';
import { X, Printer, FileText } from 'lucide-react';

export default function ReportModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handlePrint = () => window.print();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 p-3 sm:p-5">
      <div className="relative max-h-[92vh] w-full max-w-4xl space-y-6 overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 text-slate-800 shadow-2xl md:p-8">
        <header className="flex items-start justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-red-600" />
            <div>
              <div className="text-xs font-black uppercase tracking-wide text-amber-800">Lembar kerja - bukan laporan hasil pilot</div>
              <h2 className="text-lg font-black text-slate-900">Rencana validasi data dan sensitivitas awal</h2>
              <p className="mt-1 text-xs text-slate-500">AWAKENING Reborn • ImpactGrid • BCC TSF 2026</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Tutup" className="rounded-xl bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"><X className="h-5 w-5" /></button>
        </header>

        <section className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950">
          Dokumen ini hanya merangkum asumsi perencanaan. Belum ada pengukuran site, hasil Difference-in-Differences, audit emisi, penawaran vendor yang tervalidasi, maupun persetujuan Telkomsel. Angka berikut tidak boleh dipresentasikan sebagai hasil aktual atau forecast.
        </section>

        <section className="space-y-3">
          <h3 className="font-extrabold text-slate-900">Konteks korporat yang dapat dirujuk</h3>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-3">Indikator</th><th className="p-3">Data 2025</th><th className="p-3">Batas penggunaan</th></tr></thead>
              <tbody>
                <tr className="border-t border-slate-100"><td className="p-3">Listrik Telkomsel</td><td className="p-3">1.885.417.875,2 kWh</td><td className="p-3">Konteks korporat, bukan baseline site</td></tr>
                <tr className="border-t border-slate-100"><td className="p-3">Emisi Scope 2</td><td className="p-3">1.721.967,7 tCO₂e</td><td className="p-3">Tidak dipakai menghitung reduksi pilot</td></tr>
                <tr className="border-t border-slate-100"><td className="p-3">Porsi Scope 2</td><td className="p-3">63,6% dari total emisi</td><td className="p-3">Angka laporan korporat</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="font-extrabold text-slate-900">Sensitivitas pilot 40 lokasi intervensi</h3>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-3">Asumsi baseline</th><th className="p-3">Energi tahunan</th><th className="p-3">NPV indikatif, hemat 8%</th></tr></thead>
              <tbody>
                <tr className="border-t border-slate-100"><td className="p-3">50 kWh/lokasi/hari</td><td className="p-3">730.000 kWh</td><td className="p-3">sekitar −Rp391,5 juta</td></tr>
                <tr className="border-t border-slate-100"><td className="p-3">50 MWh/lokasi/tahun</td><td className="p-3">2.000.000 kWh</td><td className="p-3">sekitar +Rp82,3 juta</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs leading-relaxed text-slate-600">Kedua baseline belum diverifikasi. NPV memakai biaya energi yang dihindari Rp1.500/kWh, CapEx Rp450 juta, OpEx Rp60 juta/tahun, diskonto 10%, 3 bulan intervensi dan 9 bulan OpEx pada 2027, lalu empat tahun operasi penuh. Perubahan tanda NPV menunjukkan kebutuhan audit sebelum keputusan investasi.</p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
          <h3 className="font-extrabold text-slate-900">Langkah validasi yang diusulkan</h3>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>Audit awal maksimal Rp95 juta selama dua bulan: cek meter, tagihan, kontrak, lokasi, baseline, dan biaya.</li>
            <li>Tetapkan lokasi intervensi dan pembanding, metrik QoS, periode observasi, serta aturan penghentian bersama pemilik jaringan.</li>
            <li>Hitung manfaat energi dan finansial menggunakan data aktual; jangan monetisasi emisi tanpa faktor resmi yang disetujui.</li>
            <li>Ajukan keputusan pilot terpisah hanya jika audit menunjukkan kelayakan teknis, finansial, dan tata kelola.</li>
          </ol>
        </section>

        <footer className="flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-[11px] text-slate-500">Sumber konteks: Laporan Keberlanjutan Telkom 2025 dan GoZero Telkomsel.</span>
          <div className="flex gap-2">
            <button onClick={onClose} className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200">Tutup</button>
            <button onClick={handlePrint} className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"><Printer className="h-4 w-4" />Cetak / PDF</button>
          </div>
        </footer>
      </div>
    </div>
  );
}
