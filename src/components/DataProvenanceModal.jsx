import React from 'react';
import { ShieldCheck, Database, Zap, Activity, FileText, CheckCircle2, AlertTriangle, ExternalLink, X } from 'lucide-react';

export default function DataProvenanceModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const validationChecks = [
    {
      title: 'Status Lingkungan Demo',
      status: 'Aktif (Offline Standalone)',
      badge: 'Lokal',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
      description: 'Aplikasi berjalan 100% di browser lokal, tidak mengirimkan perintah atau mengubah konfigurasi BTS jaringan Telkomsel.',
      icon: ShieldCheck,
    },
    {
      title: 'Konsumsi Energi Korporat 2025',
      status: '1.885.417.875,2 kWh',
      badge: 'Data Publik TLKM',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800',
      description: 'Diambil dari Laporan Keberlanjutan Telkom 2025 sebagai acuan baseline makro tingkat korporat.',
      icon: Database,
    },
    {
      title: 'Emisi Scope 2 Korporat 2025',
      status: '1.721.967,7 tCO₂e',
      badge: 'Data Publik TLKM',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800',
      description: 'Konteks emisi resmi Telkomsel / Telkom Group (faktor emisi grid nasional).',
      icon: Activity,
    },
    {
      title: 'Desain Intervensi Pilot',
      status: '40 Site Usulan + 10 Pembanding',
      badge: 'Simulasi Terkendali',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800',
      description: 'Desain metodologi quasi-experiment Difference-in-Differences (DiD) untuk membuktikan penghematan energi tanpa mengorbankan QoS.',
      icon: Zap,
    },
    {
      title: 'Integrasi O-RAN & Telemetri O1',
      status: 'Arsitektur Usulan',
      badge: 'Tahap Desain',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800',
      description: 'Konektivitas live ke EMS/NMS vendor memerlukan clearance keamanan, API token, dan persetujuan Network Ops.',
      icon: FileText,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="provenance-modal-title"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-50 text-[#ED0226] dark:bg-red-950/50 dark:text-red-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 id="provenance-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
                Transparansi & Provenance Data Demo
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pondasi integritas teknis konsep DSS ImpactGrid untuk Telkomsel
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 space-y-3 overflow-y-auto">
          {validationChecks.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:bg-slate-50/60 dark:hover:bg-slate-800/70 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {item.title}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>
                <div className="mt-1 ml-6.5">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {item.status}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <a
            href="https://www.telkom.co.id/minio/show/data/lampiran/1778605801197_original_TLKM-SR2025-IND.pdf"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-cyan-700 dark:text-cyan-400 hover:underline font-semibold"
          >
            <span>Sumber: Laporan Keberlanjutan Telkom 2025</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 font-bold transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
