import React, { useState } from 'react';
import {
  X,
  Monitor,
  Radio,
  CheckCircle2,
  Copy,
  Check,
  Zap,
  ExternalLink,
  RefreshCw,
  ShieldAlert,
  Play,
  Layers
} from 'lucide-react';
import { PRESENTATION_STEPS } from '../data/presentationScript';

export default function DualScreenSyncModal({
  isOpen,
  onClose,
  syncStats = { connectedPeers: 0, lastEvent: null, role: 'controller' },
  onSetSyncRole,
  onBroadcastTestAction,
  onNavigateTab,
  onTriggerEmergency,
  onStartPitch
}) {
  const [copiedUrl, setCopiedUrl] = useState(false);

  if (!isOpen) return null;

  const audienceUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?screen=audience`
    : 'http://localhost:3000/?screen=audience';

  const handleCopyAudienceUrl = () => {
    navigator.clipboard?.writeText(audienceUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-slate-950/85 p-3 sm:p-4 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dual-screen-sync-title"
    >
      <div className="my-6 w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] text-slate-900 dark:text-slate-100 shadow-2xl flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#ED0226] text-white">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <h2 id="dual-screen-sync-title" className="text-sm sm:text-base font-black tracking-tight">
                Dual-Screen Presenter &amp; Jury Projector Live Sync
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">
                Channel: impactgrid-live-sync-v1 • Sinkronisasi Lokal Tanpa Internet (BroadcastChannel)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup Sinkronisasi Layar Ganda"
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* Role Switcher */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onSetSyncRole?.('controller')}
              className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                syncStats.role === 'controller'
                  ? 'border-[#ED0226] bg-red-50/70 dark:bg-red-950/30'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <strong className="text-xs font-black uppercase text-slate-900 dark:text-white">
                  Layar 1: Presenter Controller
                </strong>
                {syncStats.role === 'controller' && <CheckCircle2 className="w-4 h-4 text-[#ED0226]" />}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Layar laptop pembicara: menampilkan teleprompter 7 menit, catatan skrip, dan mengendalikan perpindahan tab di layar proyektor.
              </p>
            </button>

            <button
              type="button"
              onClick={() => onSetSyncRole?.('audience')}
              className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                syncStats.role === 'audience'
                  ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/30'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <strong className="text-xs font-black uppercase text-slate-900 dark:text-white">
                  Layar 2: Audience / Proyektor Juri
                </strong>
                {syncStats.role === 'audience' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Layar proyektor dewan direksi: tampilan bersih tanpa distraksi contekan skrip, otomatis mengikuti tab &amp; skenario presenter.
              </p>
            </button>
          </div>

          {/* Audience Link Copy Box */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-2">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
              Langkah Penggunaan Dual-Screen (2 Tab / 2 Monitor):
            </span>
            <p className="text-[11px] text-slate-500">
              Salin tautan di bawah ini dan buka di Tab Baru (geser ke layar proyektor kedua). Setiap perubahan tab, skenario, atau resolusi FOP di tab ini akan tersinkronisasi instan (&lt;5ms):
            </p>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                readOnly
                value={audienceUrl}
                aria-label="URL Layar Proyektor Juri"
                className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono text-xs text-slate-800 dark:text-slate-200"
              />
              <button
                type="button"
                onClick={handleCopyAudienceUrl}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs cursor-pointer"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedUrl ? 'Tersalin' : 'Salin URL Proyektor'}</span>
              </button>
            </div>
          </div>

          {/* Remote Trigger Deck */}
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Remote Deck Presenter (Kirim Komando Instan ke Layar Proyektor)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PRESENTATION_STEPS.slice(0, 6).map((step) => (
                <button
                  key={step.step}
                  type="button"
                  onClick={() => {
                    onNavigateTab?.(step.tab);
                    onBroadcastTestAction?.('REMOTE_STAGE_JUMP', { step: step.step, tab: step.tab, title: step.title });
                  }}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#ED0226] bg-white dark:bg-slate-900 text-left transition cursor-pointer"
                >
                  <span className="font-mono text-[10px] font-bold text-[#ED0226] block">
                    Tahap {step.step} · {step.timing}
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                    {step.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Telemetry Sync Footer */}
          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs">
              <Radio className="w-4 h-4 text-emerald-600" />
              <span>
                Status Bus Lokal: <strong className="text-emerald-600 dark:text-emerald-400">BroadcastChannel + Storage Event Aktif</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onTriggerEmergency?.(true);
                  onBroadcastTestAction?.('EMERGENCY_TOGGLE', { active: true });
                }}
                className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs cursor-pointer"
              >
                Broadcast Uji 112
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs cursor-pointer"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
