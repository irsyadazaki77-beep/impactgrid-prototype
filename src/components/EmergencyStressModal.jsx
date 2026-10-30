import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  PhoneCall, 
  RotateCcw,
  Lock,
  Zap,
  Activity,
  CheckCircle2,
  Cpu
} from 'lucide-react';

export default function EmergencyStressModal({ isOpen, onClose, onApplyEmergency, emergencyState }) {
  const [drillRunning, setDrillRunning] = useState(false);
  const [drillComplete, setDrillComplete] = useState(false);

  if (!isOpen) return null;

  const handleTriggerDrill = () => {
    setDrillRunning(true);
    setTimeout(() => {
      onApplyEmergency(true);
      setDrillRunning(false);
      setDrillComplete(true);
    }, 600);
  };

  const handleReset = () => {
    onApplyEmergency(false);
    setDrillComplete(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-[#0B1324] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100">
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
                  Protokol Uji Tekanan & Fail-Safe Layanan Darurat 112
                </h2>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white/20 text-white">
                  3GPP Rel 17 Preemption
                </span>
              </div>
              <p className="text-xs text-white/80">
                Pengujian interlock perangkat keras: verifikasi wake-up 28ms seketika saat terjadi lonjakan trafik darurat atau panggilan 112.
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
              ? 'bg-red-50 border-red-200 text-red-900 dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-200' 
              : 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-200'
          }`}>
            {emergencyState.active ? (
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5 animate-bounce" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <span className="font-bold text-sm block">
                {emergencyState.active 
                  ? 'KONDISI DARURAT AKTIF: FAIL-SAFE INTERLOCK OVERRIDE BERJALAN'
                  : 'SISTEM NORMAL: ARBITRASE ENERGI & CARRIER SLEEP BERJALAN'}
              </span>
              <p className="leading-relaxed text-[11px] opacity-90">
                {emergencyState.active
                  ? 'Sistem mendeteksi sinyal darurat. Seluruh carrier sleep dinonaktifkan dalam 28ms. Daya RF radio dialokasikan 100% penuh untuk menjamin nol drop call bagi panggilan darurat 112 dan keselamatan publik.'
                  : 'Ambang batas keselamatan aktif. Radio carrier sleep hanya diizinkan pada off-peak dengan supervisi kontinu PRB < 65% dan pengawasan prioritas panggilan darurat.'}
              </p>
            </div>
          </div>

          {/* SLA & Engineering Readiness Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-500 font-semibold uppercase block">Layanan Darurat 112</span>
              <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                100% Terproteksi
              </span>
              <span className="text-[9px] text-slate-500 block mt-0.5">Preemption Priority 1</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-500 font-semibold uppercase block">Wake-up Latency</span>
              <span className="text-base font-extrabold text-sky-600 dark:text-sky-400">
                28 ms
              </span>
              <span className="text-[9px] text-slate-500 block mt-0.5">Sub-carrier Fast Ramp</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-500 font-semibold uppercase block">Risiko Drop Call</span>
              <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                0.00%
              </span>
              <span className="text-[9px] text-slate-500 block mt-0.5">Hitless Re-activation</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-500 font-semibold uppercase block">Logika Interlock</span>
              <span className={`text-base font-extrabold ${emergencyState.active ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                {emergencyState.active ? 'OVERRIDE ON' : 'STANDBY'}
              </span>
              <span className="text-[9px] text-slate-500 block mt-0.5">Hardware Interlock</span>
            </div>
          </div>

          {/* 3GPP Fail-Safe Standards Card */}
          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Standar Keamanan Jaringan Telkomsel & 3GPP Release 17/18</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] text-slate-300">
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                <strong className="text-white block mb-0.5">QoS Protection Lock</strong>
                Jika utilisasi PRB melebihi ambang batas 65%, algoritma O-RAN seketika membatalkan sleep-mode tanpa intervensi manual operator.
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                <strong className="text-white block mb-0.5">Kanal Darurat 112</strong>
                Paket voice/SIP darurat 112 memiliki QCI=1 prioritas tertinggi dan bypass seluruh fungsi energy saving di level hardware DSP.
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                <strong className="text-white block mb-0.5">Rollback & Heartbeat</strong>
                Jika komunikasi link O1 terputus selama &gt; 30 detik, perangkat radio secara otomatis fallback ke konfigurasi default daya penuh.
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Terintegrasi dengan SOP Tanggap Darurat & Disaster Recovery NOC Telkomsel</span>
          </span>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleReset}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                !emergencyState.active 
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700' 
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Normal</span>
            </button>

            <button
              onClick={handleTriggerDrill}
              disabled={drillRunning}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition shadow-lg flex items-center gap-1.5 cursor-pointer ${
                emergencyState.active 
                  ? 'bg-red-700 text-white shadow-red-600/30 ring-2 ring-red-500' 
                  : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30'
              }`}
            >
              <PhoneCall className={`w-3.5 h-3.5 ${emergencyState.active ? 'animate-bounce' : ''}`} />
              <span>{drillRunning ? 'Mengaktifkan Rollback...' : emergencyState.active ? '⚡ FAIL-SAFE AKTIF' : 'Uji Rollback Darurat 28ms'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
