import React from 'react';
import { X, Keyboard } from 'lucide-react';

export default function ShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Shift + ?', desc: 'Buka panduan pintasan keyboard ini' },
    { key: 'Cmd / Ctrl + K', desc: 'Buka ImpactGrid AI Reasoning Copilot' },
    { key: 'Cmd / Ctrl + E', desc: 'Buka modal ekspor lembar kerja asumsi / laporan' },
    { key: 'Cmd / Ctrl + Shift + R', desc: 'Reset seluruh simulasi & tampilan demo' },
    { key: 'Space', desc: 'Putar / jeda jam simulasi otomatis (Auto-Sim)' },
    { key: 'E', desc: 'Buka / tutup konsol simulasi & alihkan ke mode Eksekutif' },
    { key: 'G', desc: 'Alihkan mode ke Deep Engineering' },
    { key: '1 - 5', desc: 'Pindah tab navigasi sesuai mode aktif (Executive / Engineering)' },
    { key: 'V', desc: 'Buka tab Validasi Pilot' },
    { key: 'W', desc: 'Buka / tutup teleprompter presentasi 7 menit' },
    { key: 'T', desc: 'Buka Tur Presentasi Direktur' },
    { key: 'S', desc: 'Buka pengujian stres darurat / keselamatan' },
    { key: 'P', desc: 'Buka Memo Eksekutif Dewan Direksi' },
    { key: 'Q', desc: 'Buka cheat sheet tanya-jawab pertahanan Direksi' },
    { key: 'A', desc: 'Buka asisten kecerdasan AI Copilot' },
  ];

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-modal-title"
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
    >
      <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 text-white shadow-2xl p-6 relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-600/20 border border-red-500/40 text-red-400">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 id="shortcuts-modal-title" className="text-lg font-bold">
                Panduan Pintasan Keyboard
              </h2>
              <p className="text-xs text-slate-400">Pintasan navigasi cepat demo & kendali simulasi</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Tutup panduan pintasan"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-1 text-sm">
          {shortcuts.map((sc) => (
            <div
              key={sc.key}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition"
            >
              <span className="text-slate-300 text-xs sm:text-sm">{sc.desc}</span>
              <kbd className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-amber-400 shadow-inner shrink-0 ml-2">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
