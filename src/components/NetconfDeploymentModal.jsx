import React, { useState, useEffect } from 'react';
import { 
  Network, 
  CheckCircle2, 
  X, 
  Server, 
  Terminal, 
  Code, 
  Cpu, 
  ShieldCheck, 
  Play, 
  RefreshCw,
  ArrowRight,
  FileText,
  Lock
} from 'lucide-react';

export default function NetconfDeploymentModal({ isOpen, onClose }) {
  const [phase, setPhase] = useState(0); // Local preview sequence only
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (!isOpen) {
      setPhase(0);
      setProgress(0);
      setLogs([]);
      return;
    }

    // Auto-run a local preview sequence only
    setLogs([
      "Demo lokal: tidak membuka koneksi ke NMS, meter, atau perangkat jaringan.",
      "Menampilkan contoh alur kebijakan; kelayakan protokol dan vendor belum diuji.",
      "Belum ada daftar site atau target perangkat yang disetujui."
    ]);

    const timer1 = setTimeout(() => {
      setPhase(1);
      setProgress(35);
      setLogs(prev => [
        ...prev,
        "Checklist demo ditampilkan; tidak ada audit SLA atau keselamatan yang dilakukan.",
        "Latency, rollback, dan layanan darurat belum diuji.",
        "Menampilkan struktur data ilustratif yang tidak dapat dikirim."
      ]);
    }, 900);

    const timer2 = setTimeout(() => {
      setPhase(2);
      setProgress(75);
      setLogs(prev => [
        ...prev,
        "Tidak ada sesi SSH/NETCONF atau handshake vendor yang dijalankan.",
        "Konektivitas Ericsson, Huawei, ZTE, Nokia, dan PLN belum diuji."
      ]);
    }, 2000);

    const timer3 = setTimeout(() => {
      setPhase(3);
      setProgress(100);
      setLogs(prev => [
        ...prev,
        "Preview selesai; tidak ada dispatch atau sinkronisasi model.",
        "Tidak ada tindakan pada BTS, data energi, atau sistem Telkomsel."
      ]);
    }, 3200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sampleYangXml = `{
  "preview_only": true,
  "send_to_network": false,
  "source_data": "synthetic_demo",
  "target_site": null,
  "policy": null,
  "note": "A production schema, safety review, vendor authorization, and operator approval are still required."
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-slate-900 text-white rounded-3xl max-w-3xl w-full border border-slate-700 shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-sm text-white">Pratinjau alur integrasi jaringan (nonoperasional)</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  DEMO ONLY / SIMULATED ENVIRONMENT
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  phase === 3 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                }`}>
                  {phase === 3 ? 'PREVIEW SELESAI' : 'MENYIAPKAN PREVIEW...'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Contoh tampilan kebijakan lokal. Tidak ada koneksi, transmisi perintah, atau bukti kompatibilitas Telkomsel.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Deployment Progress Bar */}
        <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800">
          <div className="flex justify-between text-xs font-mono mb-1.5 text-slate-300">
            <span>Progress pratinjau lokal:</span>
            <span className="font-bold text-cyan-400">{progress}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs font-mono flex-1">
          {/* 3 Steps Indicator */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-xs">
            <div className={`p-2.5 rounded-xl border ${phase >= 1 ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
              <span className="text-[10px] block font-bold">Langkah 1</span>
              <span>1. Checklist keselamatan (belum diuji)</span>
            </div>
            <div className={`p-2.5 rounded-xl border ${phase >= 2 ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
              <span className="text-[10px] block font-bold">Langkah 2</span>
              <span>2. Preview payload nonaktif</span>
            </div>
            <div className={`p-2.5 rounded-xl border ${phase >= 3 ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 font-bold' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
              <span className="text-[10px] block font-bold">Langkah 3</span>
              <span>3. Selesai menampilkan preview</span>
            </div>
          </div>

          {/* Terminal Logs */}
          <div className="p-4 rounded-2xl bg-black border border-slate-800 space-y-1 text-slate-300 text-[11px] leading-relaxed">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2 text-[10px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Log simulasi lokal</span>
              </span>
              <span>Contoh lokal; bukan pesan NETCONF/YANG</span>
            </div>
            {logs.map((log, index) => (
              <div key={index} className="flex items-start space-x-2">
                <span className="text-cyan-500 font-bold">&gt;</span>
                <span className={log.includes('✓') ? 'text-emerald-400 font-bold' : log.includes('SUCCESSFUL') ? 'text-emerald-300 font-bold' : 'text-slate-300'}>
                  {log}
                </span>
              </div>
            ))}
          </div>

          {/* Sample XML YANG Payload */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Contoh deskripsi preview (bukan payload YANG yang dapat dikirim):
            </span>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[10px] text-emerald-400 overflow-x-auto max-h-36">
              <pre>{sampleYangXml}</pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            {phase === 3 ? 'Status: preview lokal selesai; tidak ada profil perangkat yang dikonfigurasi.' : 'Menyiapkan preview lokal...'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition cursor-pointer"
          >
            {phase === 3 ? 'Tutup & Kembali ke Portofolio' : 'Batal'}
          </button>
        </div>
      </div>
    </div>
  );
}
