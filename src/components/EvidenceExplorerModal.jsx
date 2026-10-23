import React from 'react';
import { FileSearch, ShieldAlert, X } from 'lucide-react';

export default function EvidenceExplorerModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4" role="dialog" aria-modal="true" aria-labelledby="evidence-explorer-title">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div><FileSearch className="h-5 w-5 text-indigo-600" /><h2 id="evidence-explorer-title" className="mt-3 text-lg font-black text-slate-900">Evidence Explorer belum tersedia</h2></div>
          <button type="button" onClick={onClose} aria-label="Tutup" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X className="h-4 w-4" /></button>
        </div>
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950"><ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" /><p>Belum ada bukti per lokasi yang dapat ditinjau. Prototype tidak terhubung ke meter atau jaringan; daftar site, tren, dan status rekonsiliasi belum dapat disajikan sebagai data nyata.</p></div>
      </div>
    </div>
  );
}
