import React from 'react';
import { CircleHelp, ShieldAlert } from 'lucide-react';

export default function BeforeVsAfterComparison() {
  return (
    <section className="rounded-2xl border border-amber-200 bg-white p-5 shadow-xs">
      <div className="flex items-start gap-3">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
        <div>
          <h3 className="font-extrabold text-slate-900">Perbandingan sebelum dan sesudah belum tersedia</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">Komponen ini tidak menampilkan angka dampak karena belum ada baseline lokasi, data pascaintervensi, faktor emisi yang disetujui, maupun hasil pengukuran layanan.</p>
          <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-slate-500"><CircleHelp className="mt-0.5 h-4 w-4 shrink-0" />Setelah data tersedia, metode, batas, dan sumber harus ditinjau pemilik data serta tim ESG sebelum hasil dilaporkan.</p>
        </div>
      </div>
    </section>
  );
}
