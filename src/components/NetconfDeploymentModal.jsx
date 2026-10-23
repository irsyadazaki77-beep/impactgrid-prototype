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

export default function NetconfDeploymentModal({ isOpen, onClose, selectedSitesCount = 40, totalCapExIDR = 450000000 }) {
  const [phase, setPhase] = useState(0); // 0: Pre-flight, 1: Compiling YANG, 2: Pushing to Nodes, 3: Completed
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (!isOpen) {
      setPhase(0);
      setProgress(0);
      setLogs([]);
      return;
    }

    // Auto-run deployment sequence
    setLogs([
      "[SIMULATION MODE] Memulai simulasi O-RAN O1 Netconf/YANG closed-loop dispatch (DEMO ONLY - no real BTS connections)...",
      "Memeriksa parameter simulasi Telkomsel Non-RT RIC Policy Manager (O-RAN A1/O1)...",
      `Target Simulasi: ${selectedSitesCount} BTS Macro Nodes (CapEx simulasi: Rp ${(totalCapExIDR / 1e6).toFixed(0)} Juta)`
    ]);

    const timer1 = setTimeout(() => {
      setPhase(1);
      setProgress(35);
      setLogs(prev => [
        ...prev,
        "✓ Pre-Flight SLA Check SIMULATED: Emergency 112 Hard-Lock Rule Verified (ITU-T E.106)",
        "✓ Fast-Wakeup Latency Threshold: <120ms threshold rule confirmed across simulated models",
        "Compiling Mock Netconf YANG Payload: urn:o-ran:energy-saving:1.0 (DEMO SPECIFICATION)..."
      ]);
    }, 900);

    const timer2 = setTimeout(() => {
      setPhase(2);
      setProgress(75);
      setLogs(prev => [
        ...prev,
        "Simulating RFC 6241 SSH (Port 830) handshake against multi-vendor EMS mock emulators...",
        "• Ericsson ENM Emulator (AIR 6449 / 32T32R): Mock Policy Acknowledged (200 OK)",
        "• Huawei iMaster MAE Emulator (Blade AAU): Mock Policy Acknowledged (200 OK)",
        "• ZTE NetNumen Emulator (Uni-RAN): Mock Policy Acknowledged (200 OK)",
        "• Nokia NetAct Emulator (AirScale): Mock Policy Acknowledged (200 OK)"
      ]);
    }, 2000);

    const timer3 = setTimeout(() => {
      setPhase(3);
      setProgress(100);
      setLogs(prev => [
        ...prev,
        "✓ Simulasi closed-loop dispatch SUKSES (LINGKUNGAN DEMO / SIMULASI TERKONTROL)!",
        `${selectedSitesCount} model BTS virtual kini aktif di bawah AI Knapsack Energy Optimization.`,
        "Peringatan Keamanan: Tidak ada transmisi instruksi RF/daya riil ke menara BTS fisik komersial Telkomsel."
      ]);
    }, 3200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isOpen, selectedSitesCount, totalCapExIDR]);

  if (!isOpen) return null;

  const sampleYangXml = `<rpc message-id="101" xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">
  <edit-config>
    <target><running/></target>
    <config>
      <managed-element xmlns="urn:o-ran:energy-saving:1.0">
        <id>TSEL-PILOT-JAMALI-40SITES</id>
        <energy-saving-profile>
          <operational-state>ENABLED</operational-state>
          <carrier-sleep-depth>MICRO_AND_SHALLOW</carrier-sleep-depth>
          <emergency-112-priority>HARD_LOCKED_100PCT</emergency-112-priority>
          <max-wakeup-latency-ms>120</max-wakeup-latency-ms>
          <cooling-setpoint-celsius>26.0</cooling-setpoint-celsius>
          <budget-allocation-idr>${totalCapExIDR}</budget-allocation-idr>
        </energy-saving-profile>
      </managed-element>
    </config>
  </edit-config>
</rpc>`;

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
                <span className="font-extrabold text-sm text-white">Simulasi O-RAN O1 Netconf/YANG Dispatcher</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  DEMO ONLY / SIMULATED ENVIRONMENT
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  phase === 3 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                }`}>
                  {phase === 3 ? '✓ SIMULASI SUKSES (200 OK)' : 'DISPATCHING...'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Simulasi arsitektur penyebaran kebijakan ke {selectedSitesCount} profil BTS secara virtual tanpa koneksi langsung ke jaringan BTS live komersial Telkomsel.
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
            <span>Progress Penyebaran Kebijakan:</span>
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
              <span>1. Pre-Flight SLA Audit</span>
            </div>
            <div className={`p-2.5 rounded-xl border ${phase >= 2 ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
              <span className="text-[10px] block font-bold">Langkah 2</span>
              <span>2. Compile YANG Netconf</span>
            </div>
            <div className={`p-2.5 rounded-xl border ${phase >= 3 ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 font-bold' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
              <span className="text-[10px] block font-bold">Langkah 3</span>
              <span>3. Multi-Vendor Sync</span>
            </div>
          </div>

          {/* Terminal Logs */}
          <div className="p-4 rounded-2xl bg-black border border-slate-800 space-y-1 text-slate-300 text-[11px] leading-relaxed">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2 text-[10px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>O-RAN O1 SSH Terminal (Port 830)</span>
              </span>
              <span>RFC 6241 / RFC 6020 Compliant</span>
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
              Payload XML Standar O-RAN O1 (YANG Data Model):
            </span>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[10px] text-emerald-400 overflow-x-auto max-h-36">
              <pre>{sampleYangXml}</pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            {phase === 3 ? `Status Simulasi: ${selectedSitesCount} Profil BTS Virtual Terkonfigurasi (DEMO ONLY)` : 'Menjalankan emulator Baseband Unit virtual...'}
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
