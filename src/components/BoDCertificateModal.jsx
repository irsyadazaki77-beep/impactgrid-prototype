import React from 'react';
import { X, FileCheck, Lock } from 'lucide-react';

export default function BoDCertificateModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-4">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] shadow-2xl">
        <header className="flex items-center justify-between bg-slate-900 dark:bg-slate-950 px-6 py-4 text-white border-b border-slate-800">
          <div className="flex items-center gap-2"><FileCheck className="h-5 w-5 text-amber-300" /><span className="font-extrabold text-sm">Pratinjau kerangka keputusan pilot</span></div>
          <button onClick={onClose} aria-label="Tutup" className="rounded-lg p-1 text-slate-300 hover:bg-slate-800 hover:text-white"><X className="h-5 w-5" /></button>
        </header>
        <div className="space-y-5 p-6 sm:p-8">
          <div className="rounded-xl border border-amber-200/80 dark:border-amber-900/50 bg-amber-50/70 dark:bg-amber-950/30 p-4 text-xs font-bold leading-relaxed text-amber-900 dark:text-amber-200">
            DOKUMEN CONTOH — bukan sertifikat, surat keputusan, persetujuan, atau dokumen resmi Telkomsel. Tidak ada pilot yang dinyatakan lulus oleh tampilan ini.
          </div>
          <div className="text-center">
            <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600"><Lock className="h-5 w-5" /></div>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">Keputusan masih menunggu bukti dan otorisasi</h2>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">Sebelum keputusan dibuat, penanggung jawab perlu meninjau data baseline, hasil uji energi, dampak QoS, arus kas yang disetujui Finance, metodologi emisi, dan risiko pelaksanaan.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              'Kelengkapan meter dan rekonsiliasi tagihan',
              'Penghematan energi setelah koreksi trafik dan cuaca',
              'NPV berdasarkan biaya dan kontrak aktual',
              'Batas QoS, prosedur penghentian, dan persetujuan operasi',
            ].map((item, index) => (
              <div key={item} className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-3 text-xs text-slate-700 dark:text-slate-300"><strong className="mr-2 text-slate-400">{index + 1}.</strong>{item}<div className="mt-2 text-[10px] font-bold uppercase text-amber-800 dark:text-amber-400">Belum dievaluasi</div></div>
            ))}
          </div>
          <div className="border-t border-slate-200 pt-4 text-xs text-slate-500">Kolom keputusan dan tanda tangan harus diisi oleh pemegang wewenang setelah bukti pilot tersedia. Prototipe tidak dapat mengesahkan keputusan tersebut.</div>
          <div className="flex justify-end"><button onClick={onClose} className="rounded-xl bg-[#ED0226] hover:bg-red-700 px-5 py-2 text-xs font-bold text-white transition cursor-pointer shadow-2xs">Tutup</button></div>
        </div>
      </div>
    </div>
  );
}
