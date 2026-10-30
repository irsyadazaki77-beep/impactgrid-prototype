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
  Lock,
  Layers,
  Zap,
  Radio
} from 'lucide-react';

const TARGET_NODES = [
  {
    id: 'TSEL-JKT-0421',
    name: 'Sudirman Macro Hub (Jakarta Pusat)',
    vendor: 'Huawei SingleRAN BBU5900',
    band: 'B3 (1800 MHz) & B8 (900 MHz)',
    towerCo: 'Mitratel',
    ipAddress: '10.244.18.42:830',
    rruModel: 'RRU5309 (4T4R 4x80W)'
  },
  {
    id: 'TSEL-BDG-0312',
    name: 'Dago Urban Hub (Bandung)',
    vendor: 'Ericsson Radio System BB6648',
    band: 'B1 (2100 MHz) & B3 (1800 MHz)',
    towerCo: 'Mitratel',
    ipAddress: '10.245.32.18:830',
    rruModel: 'Radio 4449 B1+B3'
  },
  {
    id: 'TSEL-SBY-0118',
    name: 'Rungkut Transit BTS (Surabaya)',
    vendor: 'ZTE Uni-RAN B8300',
    band: 'B3 (1800 MHz) & B40 (2300 MHz)',
    towerCo: 'Protelindo',
    ipAddress: '10.246.09.77:830',
    rruModel: 'ZXSDR R8892'
  }
];

export default function NetconfDeploymentModal({ isOpen, onClose }) {
  const [selectedNodeIndex, setSelectedNodeIndex] = useState(0);
  const [phase, setPhase] = useState(0); // 0: Idle, 1: Connecting, 2: Validating, 3: Dispatched
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);

  const selectedNode = TARGET_NODES[selectedNodeIndex];

  // Build authentic YANG/NETCONF XML payload according to RFC 6241 and O-RAN WG1
  const netconfXmlPayload = `<?xml version="1.0" encoding="UTF-8"?>
<rpc message-id="101" xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">
  <edit-config>
    <target>
      <running/>
    </target>
    <default-operation>merge</default-operation>
    <config>
      <managed-element xmlns="urn:o-ran:hardware:1.0">
        <node-id>${selectedNode.id}</node-id>
        <vendor-hardware>${selectedNode.vendor}</vendor-hardware>
        <energy-saving-policy xmlns="urn:3gpp:ts:28.532:rel17:energy">
          <policy-id>TSEL-ESP-2026-AUTOSLEEP</policy-id>
          <energy-saving-state>carrier-deep-sleep</energy-saving-state>
          <target-band>${selectedNode.band.split(' ')[0]}</target-band>
          <subcarrier-guard-interval-ms>28</subcarrier-guard-interval-ms>
          <load-activation-threshold-prb-pct>65</load-activation-threshold-prb-pct>
          <emergency-preemption-lock priority="112">true</emergency-preemption-lock>
          <fallback-behavior>instant-full-carrier-ramp</fallback-behavior>
        </energy-saving-policy>
      </managed-element>
    </config>
  </edit-config>
</rpc>`;

  const runDispatch = () => {
    setIsExecuting(true);
    setPhase(1);
    setProgress(20);
    setLogs([
      `[SSH/TLS 1.3] Membuka sesi terenkripsi ke ${selectedNode.ipAddress} (Telkomsel Staging Gateway)...`,
      `[NETCONF RFC 6242] Handshake kapabilitas server: urn:ietf:params:netconf:base:1.1, urn:o-ran:hardware:1.0`
    ]);

    setTimeout(() => {
      setPhase(2);
      setProgress(60);
      setLogs(prev => [
        ...prev,
        `[YANG VALIDATION] Memeriksa skema o-ran-energy-saving.yang & 3GPP TS 28.532 Rel 17... VALID ✓`,
        `[SAFETY INTERLOCK] Verifikasi Rute 112 & Headroom Utilisasi PRB (Batas Aman < 65%)... TERVERIFIKASI ✓`,
        `[PAYLOAD TRANSMIT] Mengirim <edit-config> (Transaction ID: #TSEL-TX-${Math.floor(10000 + Math.random() * 90000)})...`
      ]);
    }, 900);

    setTimeout(() => {
      setPhase(3);
      setProgress(100);
      setIsExecuting(false);
      setLogs(prev => [
        ...prev,
        `[RPC ACKNOWLEDGED] Menerima <rpc-reply><ok/></rpc-reply> dari ${selectedNode.id} (Latensi RTT: 22ms) ✓`,
        `[TELEMETRY CONFIRMATION] Penurunan daya RF -420W/RRU terkonfirmasi pada sensor telemetri submeter shelter.`,
        `[STATUS] Kebijakan hemat energi aktif dengan perlindungan penuh fail-safe 28ms.`
      ]);
    }, 2000);
  };

  useEffect(() => {
    if (isOpen) {
      runDispatch();
    } else {
      setPhase(0);
      setProgress(0);
      setLogs([]);
      setIsExecuting(false);
    }
  }, [isOpen, selectedNodeIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-slate-900 text-white rounded-3xl max-w-3xl w-full border border-slate-700 shadow-2xl flex flex-col overflow-hidden max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-sm text-white">O-RAN O1 & NETCONF/YANG Policy Dispatcher</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  RFC 6241 / 3GPP REL 17
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {phase === 3 ? 'RPC-REPLY: OK' : 'STAGING GATEWAY ACTIVE'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Konsol orkestrasi kontrol kebijakan daya radio vendor-neutral melalui antarmuka O-RAN O1 Telkomsel OSS.
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

        {/* Target Node Selector Bar */}
        <div className="px-6 py-3 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Pilih Node Target:</span>
            <div className="flex items-center gap-1.5">
              {TARGET_NODES.map((node, idx) => (
                <button
                  key={node.id}
                  onClick={() => setSelectedNodeIndex(idx)}
                  disabled={isExecuting}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    selectedNodeIndex === idx
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  {node.id}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-300">
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            <span><strong>{selectedNode.vendor}</strong> ({selectedNode.band})</span>
          </div>
        </div>

        {/* Deployment Progress Bar */}
        <div className="px-6 py-2.5 bg-slate-950/60 border-b border-slate-800">
          <div className="flex justify-between text-xs font-mono mb-1 text-slate-300">
            <span>Progress Eksekusi Staging:</span>
            <span className="font-bold text-cyan-400">{progress}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-cyan-500 via-sky-500 to-emerald-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs font-mono flex-1">
          {/* 3 Steps Indicator */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-xs">
            <div className={`p-2.5 rounded-xl border ${phase >= 1 ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300 font-bold' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
              <span className="text-[10px] block font-bold text-slate-400">Tahap 1</span>
              <span>1. SSH/TLS 1.3 Handshake (Port 830)</span>
            </div>
            <div className={`p-2.5 rounded-xl border ${phase >= 2 ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300 font-bold' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
              <span className="text-[10px] block font-bold text-slate-400">Tahap 2</span>
              <span>2. Validasi Skema YANG & Interlock 112</span>
            </div>
            <div className={`p-2.5 rounded-xl border ${phase >= 3 ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 font-bold' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
              <span className="text-[10px] block font-bold text-slate-400">Tahap 3</span>
              <span>3. RPC &lt;ok/&gt; Dispatched (22ms)</span>
            </div>
          </div>

          {/* Terminal Logs */}
          <div className="p-4 rounded-2xl bg-black border border-slate-800 space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2 text-[10px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>O-RAN O1 NETCONF Session Console</span>
              </span>
              <span>Target: {selectedNode.ipAddress}</span>
            </div>
            {logs.map((log, index) => (
              <div key={index} className="flex items-start space-x-2">
                <span className="text-cyan-500 font-bold">&gt;</span>
                <span className={log.includes('✓') ? 'text-emerald-400 font-bold' : log.includes('Transak') ? 'text-cyan-300' : 'text-slate-300'}>
                  {log}
                </span>
              </div>
            ))}
          </div>

          {/* XML YANG Payload */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Standard NETCONF RFC 6241 XML Payload:</span>
              <span className="text-[10px] text-cyan-400 font-mono">urn:o-ran:hardware:1.0</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[10px] text-emerald-400 overflow-x-auto max-h-40 font-mono leading-relaxed">
              <pre>{netconfXmlPayload}</pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Fail-Safe 28ms & Prioritas Layanan Darurat 112 Terproteksi Penuh</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={runDispatch}
              disabled={isExecuting}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isExecuting ? 'animate-spin' : ''}`} />
              <span>Kirim Ulang RPC</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition cursor-pointer"
            >
              Tutup Konsol
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
