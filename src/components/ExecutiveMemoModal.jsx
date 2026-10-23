import React from 'react';
import { Printer, X, FileText, ExternalLink } from 'lucide-react';

export default function ExecutiveMemoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/80 p-2 sm:p-4">
      <div className="my-8 w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white text-slate-900 shadow-2xl print:my-0 print:rounded-none print:border-0 print:shadow-none">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-800 bg-slate-900 px-6 py-4 text-white print:hidden">
          <div className="flex items-center gap-2"><FileText className="h-5 w-5 text-amber-300" /><div><h2 className="text-sm font-extrabold">Memo konsep ImpactGrid</h2><p className="text-[11px] text-slate-300">Bahan diskusi proposal; bukan memo Telkomsel</p></div></div>
          <div className="flex items-center gap-2"><button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-500"><Printer className="h-4 w-4" />Cetak / PDF</button><button onClick={onClose} aria-label="Tutup" className="rounded-xl p-2 text-slate-300 hover:bg-slate-800"><X className="h-5 w-5" /></button></div>
        </header>

        <article className="space-y-7 p-7 sm:p-10 print:p-8">
          <div className="rounded-2xl border-2 border-amber-400 bg-amber-50 p-4 text-sm font-extrabold leading-relaxed text-amber-950">
            DRAF KONSEP UNTUK KOMPETISI — bukan memo rahasia, persetujuan investasi, rekomendasi resmi, atau pernyataan PT Telekomunikasi Selular.
          </div>

          <section className="space-y-3">
            <p className="text-xs font-black uppercase tracking-wider text-red-700">AWAKENING Reborn • BCC TSF 2026</p>
            <h1 className="text-2xl font-black">ImpactGrid: sistem pendukung keputusan untuk efisiensi energi jaringan</h1>
            <p className="text-sm leading-relaxed text-slate-700">ImpactGrid mengusulkan alur berbasis web untuk menyatukan data energi, trafik, biaya, mutu layanan, dan pengukuran ESG yang diizinkan pemilik data. Prototype saat ini hanya menampilkan data sintetis. Belum ada integrasi langsung dengan jaringan, smart meter, tagihan, atau sistem internal Telkomsel.</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-extrabold">Konteks perusahaan yang dapat dikutip</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4"><div className="text-xs text-slate-500">Listrik 2025</div><div className="mt-1 font-black">1.885.417.875,2 kWh</div><div className="mt-1 text-[11px] text-slate-500">Konteks agregat, bukan baseline lokasi</div></div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4"><div className="text-xs text-slate-500">Scope 2 2025</div><div className="mt-1 font-black">1.721.967,7 tCO₂e</div><div className="mt-1 text-[11px] text-slate-500">Tidak membuktikan dampak pilot</div></div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4"><div className="text-xs text-slate-500">Bagian Scope 2</div><div className="mt-1 font-black">63,6%</div><div className="mt-1 text-[11px] text-slate-500">Dari total emisi perusahaan yang dilaporkan</div></div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-extrabold">Temuan finansial: keputusan bergantung pada baseline</h2>
            <p className="text-sm leading-relaxed text-slate-700">Dengan asumsi hemat tambahan 8%, biaya energi yang dihindari Rp1.500/kWh, CapEx Rp450 juta, OpEx Rp60 juta per tahun, diskonto 10%, serta arus kas pilot sesuai jadwal proposal, NPV indikatif berada sekitar −Rp391,5 juta jika baseline 50 kWh/lokasi/hari dan sekitar +Rp82,3 juta jika baseline 50 MWh/lokasi/tahun. Dua angka baseline tersebut belum diverifikasi; angka ini sensitivitas, bukan forecast.</p>
            <p className="rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-600">Perbedaan satuan mengubah kesimpulan kelayakan. Jangan memilih skenario yang menguntungkan sebelum meter, kontrak energi, biaya yang dapat dihindari, biaya aktual, dan alokasi manfaat diverifikasi.</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-extrabold">Usulan keputusan bertahap</h2>
            <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-slate-700">
              <li>Mulai dari audit data dan kelayakan selama dua bulan dengan plafon usulan maksimal Rp95 juta.</li>
              <li>Lanjutkan pilot 40 lokasi intervensi dan 10 pembanding hanya setelah baseline, izin akses aset, metode evaluasi, kebutuhan integrasi, biaya, serta ambang QoS disetujui pemiliknya.</li>
              <li>Ekspansi regional/nasional hanya dipertimbangkan setelah hasil pilot terukur; skala, investasi, NPV, dan reduksi emisi belum diproyeksikan.</li>
              <li>Seluruh tindakan pada BTS tetap memerlukan proses perubahan dan otorisasi operator; prototype tidak mengirim perintah.</li>
            </ol>
          </section>

          <section className="space-y-2 border-t border-slate-200 pt-4 text-xs text-slate-500">
            <h2 className="font-extrabold text-slate-700">Rujukan utama</h2>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <a className="inline-flex items-center gap-1 underline" href="https://www.telkom.co.id/minio/show/data/lampiran/1778605801197_original_TLKM-SR2025-IND.pdf" target="_blank" rel="noreferrer">Laporan Keberlanjutan Telkom 2025<ExternalLink className="h-3 w-3" /></a>
              <a className="inline-flex items-center gap-1 underline" href="https://aro.telkom.co.id/sustainability/" target="_blank" rel="noreferrer">GoZero Telkomsel<ExternalLink className="h-3 w-3" /></a>
              <a className="inline-flex items-center gap-1 underline" href="https://www.itu.int/rec/T-REC-L.1331/en" target="_blank" rel="noreferrer">ITU-T L.1331<ExternalLink className="h-3 w-3" /></a>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
