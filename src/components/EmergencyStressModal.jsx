import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  PhoneCall, 
  RotateCcw,
  Lock
} from 'lucide-react';

export default function EmergencyStressModal({ isOpen, onClose, onApplyEmergency, emergencyState }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100">
        {/* Header with Alarm Style */}
        <div className={`p-5 flex items-center justify-between border-b ${
          emergencyState.active 
            ? 'bg-red-600 text-white border-red-700' 
            : 'bg-slate-900 text-white border-slate-800'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl ${emergencyState.active ? 'bg-red-700 text-white' : 'bg-red-500/20 text-red-400'}`}>
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold tracking-tight">
                  Pemilihan skenario keselamatan
                </h2>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white/20 text-white">
                  Pratinjau lokal
                </span>
              </div>
              <p className="text-xs text-white/80">
                Skenario visual lokal; bukan uji ketahanan, layanan 112, atau jaringan Telkomsel.
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* Status Box */}
          <div className={`p-4 rounded-xl border flex items-start space-x-3.5 ${
            emergencyState.active 
              ? 'bg-red-50 border-red-200 text-red-900' 
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}>
            {emergencyState.active ? (
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <span className="font-bold text-sm block">
                {emergencyState.active 
                  ? 'SKENARIO KESELAMATAN DIPILIH UNTUK DEMO'
                  : 'TIDAK ADA SKENARIO YANG DIPILIH'}
              </span>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                {emergencyState.active
                  ? 'Perubahan hanya memengaruhi tampilan lokal. Tidak ada perubahan konfigurasi atau pengukuran jaringan.'
                  : 'Prototype tidak memantau atau mengendalikan jaringan; tidak ada data lokasi yang terhubung.'}
              </p>
            </div>
          </div>

          {/* Status bukti keselamatan yang belum tersedia */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-500 font-semibold uppercase block">Pilihan tampilan</span>
              <span className={`text-base font-extrabold ${emergencyState.active ? 'text-red-600 animate-pulse' : 'text-slate-900'}`}>
                {emergencyState.active ? 'Keselamatan (konsep)' : 'Belum dipilih'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-500 font-semibold uppercase block">Layanan darurat 112</span>
              <span className="text-base font-extrabold text-amber-700">Belum diuji</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-500 font-semibold uppercase block">Wake-up latency</span>
              <span className="text-base font-extrabold text-sky-600 dark:text-sky-400">
                Belum diukur
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-500 font-semibold uppercase block">Risiko drop call</span>
              <span className="text-base font-extrabold text-amber-700 dark:text-amber-400">
                Belum diukur
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Hal yang harus ditetapkan sebelum pilot</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] text-slate-300">
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                <strong className="text-white block mb-0.5">Batas mutu layanan</strong>
                Pemilik jaringan perlu menetapkan ambang dan metode pemantauan dari data yang disetujui.
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                <strong className="text-white block mb-0.5">Layanan darurat</strong>
                Dampak dan tanggung jawab layanan 112 perlu ditinjau bersama operator serta pemilik layanan.
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                <strong className="text-white block mb-0.5">Pemulihan dan rollback</strong>
                Perilaku saat koneksi terputus dan prosedur pemulihan harus ditetapkan serta diuji.
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] text-slate-500">
            Simulasi ini tidak membuktikan keamanan, latency, availability, atau dampak pada pengalaman pelanggan.
          </span>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => onApplyEmergency(false)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                !emergencyState.active 
                  ? 'bg-slate-200 text-slate-800 border border-slate-300' 
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Normal</span>
            </button>

            <button
              onClick={() => onApplyEmergency(true)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition shadow-lg flex items-center gap-1.5 cursor-pointer ${
                emergencyState.active 
                  ? 'bg-red-700 text-white shadow-red-600/30 ring-2 ring-red-500' 
                  : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5 animate-bounce" />
              <span>{emergencyState.active ? '⚡ SKENARIO DEMO AKTIF' : 'Pilih skenario lonjakan (demo)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
