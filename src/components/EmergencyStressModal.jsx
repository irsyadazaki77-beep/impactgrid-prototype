import React from 'react';
import { 
  Zap, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  PhoneCall, 
  Activity, 
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Lock
} from 'lucide-react';

export default function EmergencyStressModal({ isOpen, onClose, onApplyEmergency, emergencyState }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden text-slate-900">
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
                  Simulasi skenario lonjakan trafik
                </h2>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white/20 text-white">
                  Demo Direktur Network
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
                  ? 'SKENARIO DEMO AKTIF: input lonjakan trafik dipilih' 
                  : 'SKENARIO DEMO NORMAL: tidak ada sistem operasi yang berjalan'}
              </span>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                {emergencyState.active
                  ? 'Perubahan hanya memengaruhi visualisasi lokal. Tidak ada mode sleep yang dibatalkan dan tidak ada tindakan atau pengukuran jaringan.'
                  : 'Prototype tidak memantau atau mengendalikan power amplifier; seluruh nilai merupakan data contoh.'}
              </p>
            </div>
          </div>

          {/* Real-time Telemetry Comparison in Drill */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 font-semibold uppercase block">Skenario input</span>
              <span className={`text-base font-extrabold ${emergencyState.active ? 'text-red-600 animate-pulse' : 'text-slate-900'}`}>
                {emergencyState.active ? 'Lonjakan (ilustrasi)' : 'Normal (ilustrasi)'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 font-semibold uppercase block">Panggilan 112 SLA</span>
              <span className="text-base font-extrabold text-amber-700">Belum diuji</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 font-semibold uppercase block">Wake-up Latency</span>
              <span className="text-base font-extrabold text-indigo-600">
                Belum diukur
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 font-semibold uppercase block">Drop Call Probability</span>
              <span className="text-base font-extrabold text-teal-600">
                Belum diukur
              </span>
            </div>
          </div>

          {/* 3-Layer Fail-Safe Explainer for CTO */}
          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Persyaratan desain yang perlu ditinjau dan diuji</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] text-slate-300">
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                <strong className="text-white block mb-0.5">Lapis 1: Traffic Gradient</strong>
                Ambang deteksi dan respons harus ditentukan berdasarkan data serta uji operasi.
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                <strong className="text-white block mb-0.5">Lapis 2: 112 Priority Preemption</strong>
                Interaksi layanan darurat harus dirancang bersama operator dan pemilik layanan; belum diuji di prototype.
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                <strong className="text-white block mb-0.5">Lapis 3: Heartbeat Watchdog</strong>
                Perilaku saat koneksi terputus dan prosedur rollback perlu didefinisikan serta diuji sebelum pilot.
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
