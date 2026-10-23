import React from 'react';
import { X, Info, Database, ShieldCheck, CircleDollarSign, Leaf } from 'lucide-react';

const checks = [
  { icon: Database, title: 'Kualitas dan sumber data', text: 'Meter, tagihan, trafik, interval, satuan, kelengkapan, dan rekonsiliasi harus diperiksa sebelum analisis.' },
  { icon: ShieldCheck, title: 'Mutu layanan dan keselamatan', text: 'Ambang QoS, risiko, persetujuan operasi, serta cara penghentian intervensi harus ditetapkan pemilik jaringan.' },
  { icon: CircleDollarSign, title: 'Kelayakan finansial', text: 'Gunakan biaya aktual yang dapat dihindari, CapEx, OpEx, kontrak, horizon, dan tingkat diskonto yang disahkan Finance.' },
  { icon: Leaf, title: 'Dampak ESG', text: 'Klaim emisi menunggu penghematan kWh yang terukur dan faktor emisi resmi sesuai lokasi serta periode.' },
];

export default function ExplainableAiModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4">
      <div className="my-8 w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <header className="flex items-start justify-between bg-slate-900 p-6 text-white">
          <div>
            <span className="rounded-full bg-amber-400/15 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-amber-200">Penjelasan konsep DSS</span>
            <h2 className="mt-2 text-lg font-black">Belum ada rekomendasi site berbasis data tervalidasi</h2>
            <p className="mt-1 text-xs text-slate-300">Prototype ini tidak menjalankan model prediksi atau kendali jaringan.</p>
          </div>
          <button onClick={onClose} aria-label="Tutup" className="rounded-xl bg-slate-800 p-1.5 text-slate-300 hover:text-white"><X className="h-5 w-5" /></button>
        </header>

        <div className="space-y-5 p-6 text-sm">
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-xs leading-relaxed text-amber-950"><strong>Contoh tampilan saja.</strong> Nilai, profil lokasi, dan pilihan pada modul optimasi berasal dari data sintetis. Tidak ada tingkat confidence yang dapat dipertanggungjawabkan atau tindakan yang dikirim.</div>
          <section>
            <h3 className="font-extrabold text-slate-900">Informasi yang diperlukan sebelum rekomendasi dibuat</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {checks.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-xl border border-slate-200 bg-slate-50 p-3"><div className="flex items-center gap-2 font-bold text-slate-800"><Icon className="h-4 w-4 text-slate-500" />{title}</div><p className="mt-2 text-xs leading-relaxed text-slate-600">{text}</p></article>)}
            </div>
          </section>
          <div className="rounded-xl border border-slate-200 p-4 text-xs leading-relaxed text-slate-600"><strong className="text-slate-800">Alur kendali yang diusulkan:</strong> model menyusun skenario → pemilik data memeriksa asumsi → Network/Finance/ESG meninjau → pejabat berwenang memberi keputusan → operator menjalankan perubahan melalui proses resmi. Prototype hanya menggambarkan antarmuka dan belum menerapkan alur tersebut.</div>
          <div className="flex justify-end"><button onClick={onClose} className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800">Tutup</button></div>
        </div>
      </div>
    </div>
  );
}
