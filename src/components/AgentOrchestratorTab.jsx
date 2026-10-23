import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Cpu, 
  ShieldCheck, 
  Leaf, 
  Radio, 
  Zap, 
  Terminal, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  RotateCcw, 
  ArrowRight, 
  Clock, 
  ShieldAlert,
  Flame,
  CloudRain,
  Sun,
  Activity,
  Layers
} from 'lucide-react';

export default function AgentOrchestratorTab() {
  const [selectedScenario, setSelectedScenario] = useState('midnight');
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeStep, setActiveStep] = useState(0); // Visual progress through local example logs
  const [terminalLogs, setTerminalLogs] = useState([]);
  const simulationTimers = useRef([]);

  // Four conceptual work areas; these are not deployed or autonomous agents.
  const agents = [
    {
      id: 'prophet',
      name: 'Agent 1: Prophet-RAN',
      role: 'Rancangan analisis trafik',
      tech: 'Model prediksi belum diimplementasikan/kalibrasi',
      avatarColor: 'bg-indigo-600',
      badge: 'Konsep analitik',
      description: 'Konsep analisis untuk membandingkan trafik; akurasi belum diuji karena prototype tidak memakai data trafik.'
    },
    {
      id: 'thermo',
      name: 'Agent 2: ThermoOptima',
      role: 'Rancangan analisis energi pendingin',
      tech: 'Model konseptual; belum diuji dengan data perangkat',
      avatarColor: 'bg-cyan-600',
      badge: 'Konsep energi',
      description: 'Konsep untuk menilai beban pendingin; tidak mengontrol AC dan belum menetapkan batas operasi aman.'
    },
    {
      id: 'sentinel',
      name: 'Agent 3: Sentinel-SLA',
      role: 'Rancangan batas keselamatan operasi',
      tech: 'Belum terhubung ke kontrol jaringan',
      avatarColor: 'bg-rose-600',
      badge: 'Syarat keselamatan',
      description: 'Persyaratan keselamatan dan rollback harus ditetapkan serta diuji operator; simulasi ini tidak memantau trafik atau panggilan darurat.'
    },
    {
      id: 'ledger',
      name: 'Agent 4: GreenLedger',
      role: 'Rancangan pelacakan data dan asumsi ESG',
      tech: 'Metode perlu persetujuan; hash bukan assurance',
      avatarColor: 'bg-emerald-600',
      badge: 'Asumsi ESG',
      description: 'Perhitungan emisi belum tersedia sampai baseline dan faktor emisi disahkan; tidak membuat sertifikat.'
    }
  ];

  // Scenarios presets
  const scenarios = {
    midnight: {
      id: 'midnight',
      title: 'Skenario awal (ilustrasi)',
      traffic: 'Tidak tersedia',
      weather: 'Tidak tersedia',
      emergency: 'NORMAL',
      icon: Clock,
      targetAction: 'Tinjau data dasar yang perlu diminta; tidak ada rekomendasi operasional atau perintah perangkat.',
      logs: [
        { time: 'DEMO 1', agent: 'Prophet-RAN', type: 'info', text: 'Contoh langkah: bandingkan profil trafik dengan baseline yang disahkan. Nilai trafik di sini hanya ilustrasi.' },
        { time: 'DEMO 2', agent: 'ThermoOptima', type: 'info', text: 'Contoh langkah: tinjau kebutuhan pendingin dan batas perangkat. Tidak ada setpoint yang dikirim.' },
        { time: 'DEMO 3', agent: 'Sentinel-SLA', type: 'warning', text: 'Status keselamatan: belum diuji. Tidak ada hasil latency, QoS, atau layanan darurat.' },
        { time: 'DEMO 4', agent: 'GreenLedger', type: 'info', text: 'Belum menghitung reduksi emisi. Hash data contoh tidak memverifikasi sumber atau kebenaran data.' }
      ]
    },
    concert: {
      id: 'concert',
      title: 'Perubahan trafik (ilustrasi)',
      traffic: 'Tidak tersedia',
      weather: 'Tidak digunakan',
      emergency: 'CAPACITY_SPIKE',
      icon: Activity,
      targetAction: 'Tentukan data, batas layanan, dan metode uji bersama operator sebelum menilai respons.',
      logs: [
        { time: 'DEMO 1', agent: 'Sentinel-SLA', type: 'warning', text: 'Skenario ilustratif: kenaikan beban memicu peninjauan guardrail; tidak ada deteksi jaringan nyata.' },
        { time: 'DEMO 2', agent: 'Sentinel-SLA', type: 'warning', text: 'Latency dan call drop tidak diukur oleh prototype ini.' },
        { time: 'DEMO 3', agent: 'ThermoOptima', type: 'info', text: 'Tinjau batas termal dan kapasitas sebelum mengubah kebijakan.' },
        { time: 'DEMO 4', agent: 'GreenLedger', type: 'info', text: 'Catat skenario sebagai asumsi, bukan hasil operasi.' }
      ]
    },
    disaster: {
      id: 'disaster',
      title: 'Keselamatan layanan (konsep)',
      traffic: 'Tidak tersedia',
      weather: 'Tidak digunakan',
      emergency: 'SAFETY_REVIEW_REQUIRED',
      icon: ShieldAlert,
      targetAction: 'Rumuskan kajian operator, prosedur pemulihan, dan uji layanan darurat; demo ini tidak menguji semuanya.',
      logs: [
        { time: 'DEMO 1', agent: 'Sentinel-SLA', type: 'danger', text: 'Skenario darurat dipilih. Tidak ada panggilan atau broadcast nyata diterima.' },
        { time: 'DEMO 2', agent: 'Prophet-RAN', type: 'info', text: 'Prosedur respons harus diselaraskan dengan kebijakan operator dan pemilik layanan.' },
        { time: 'DEMO 3', agent: 'ThermoOptima', type: 'info', text: 'Cadangan daya dan pendingin perlu diverifikasi per lokasi.' },
        { time: 'DEMO 4', agent: 'GreenLedger', type: 'info', text: 'Pengecualian dan bukti dicatat hanya setelah proses nyata disetujui.' }
      ]
    },
    heatwave: {
      id: 'heatwave',
      title: 'Perubahan kondisi cuaca (ilustrasi)',
      traffic: 'Tidak digunakan',
      weather: 'Tidak tersedia',
      emergency: 'THERMAL_STRESS',
      icon: Flame,
      targetAction: 'Sediakan data lokasi dan metode cuaca yang tervalidasi sebelum membuat sensitivitas.',
      logs: [
        { time: 'DEMO 1', agent: 'ThermoOptima', type: 'info', text: 'Masukkan pengukuran ambien dan keluaran PV aktual bila tersedia; demo ini tidak membaca sensor.' },
        { time: 'DEMO 2', agent: 'Prophet-RAN', type: 'info', text: 'Perubahan konfigurasi harus ditinjau operator dan vendor terkait.' },
        { time: 'DEMO 3', agent: 'Sentinel-SLA', type: 'warning', text: 'Suhu dan latency tidak diukur; keselamatan belum dibuktikan.' },
        { time: 'DEMO 4', agent: 'GreenLedger', type: 'info', text: 'Sumber energi dan emisi belum direkonsiliasi atau dihitung.' }
      ]
    }
  };

  const currentScenarioData = scenarios[selectedScenario];

  const handleRunSimulation = (scenKey) => {
    simulationTimers.current.forEach(clearTimeout);
    simulationTimers.current = [];
    const logs = scenarios[scenKey]?.logs;
    if (!Array.isArray(logs)) return;
    setSelectedScenario(scenKey);
    setIsSimulating(true);
    setTerminalLogs([]);
    setActiveStep(0);

    logs.forEach((log, index) => {
      const timer = setTimeout(() => {
        setTerminalLogs(prev => [...prev, log]);
        setActiveStep(index + 1);
        if (index === logs.length - 1) {
          setIsSimulating(false);
        }
      }, (index + 1) * 450);
      simulationTimers.current.push(timer);
    });
  };

  useEffect(() => {
    setTerminalLogs(scenarios.midnight.logs);
  }, []);

  useEffect(() => () => simulationTimers.current.forEach(clearTimeout), []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-800">
              <Bot className="w-3.5 h-3.5 text-indigo-600" />
              <span>Rancangan alur analitik (demo)</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
              Simulasi alur agen untuk mendukung keputusan manusia
            </h1>
            <p className="text-xs text-slate-600 max-w-3xl leading-relaxed mt-1">
              Panel ini menggambarkan pembagian tugas secara konseptual. Agen, model, log, dan keluaran pada layar adalah contoh sintetis; tidak ada prediksi, verifikasi keselamatan, koneksi real-time, atau perintah yang dikirim ke BTS.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-2xl border border-slate-200 shrink-0 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="font-bold text-slate-700">Mode: simulasi lokal saja</span>
          </div>
        </div>
      </div>

      {/* 4 Agent Cards Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {agents.map((agent, idx) => {
          const isHighlighted = activeStep >= idx + 1;
          return (
            <div 
              key={agent.id}
              className={`p-5 rounded-2xl bg-white border transition-all space-y-3 relative overflow-hidden ${
                isHighlighted 
                  ? 'border-indigo-400 shadow-md ring-1 ring-indigo-300' 
                  : 'border-slate-200/80 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-xl text-white ${agent.avatarColor}`}>
                  <Bot className="w-5 h-5" />
                </div>
                <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                  {agent.badge}
                </span>
              </div>

              <div>
                <h2 className="font-extrabold text-xs text-slate-900">{agent.name}</h2>
                <p className="text-[10px] text-slate-500 font-semibold">{agent.role}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-mono text-slate-600">
                <span className="font-bold text-slate-800 block text-[9px] uppercase tracking-wider">Algoritma / Engine:</span>
                {agent.tech}
              </div>

              <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                {agent.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Interactive Scenario Trigger & Live Agent Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Event Simulators (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Urutan contoh skenario</span>
              </h2>
              <p className="text-xs text-slate-500">
                Pilih salah satu skenario konseptual. Pemilihan hanya mengganti teks dan log lokal:
              </p>
            </div>

            <div className="space-y-2.5">
              {Object.keys(scenarios).map((key) => {
                const sc = scenarios[key];
                const Icon = sc.icon;
                const isSelected = selectedScenario === key;

                return (
                  <button
                    key={key}
                    onClick={() => handleRunSimulation(key)}
                    disabled={isSimulating}
                    className={`w-full p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-50/80 border-indigo-400 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-xl shrink-0 ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-extrabold text-xs text-slate-900 block">{sc.title}</span>
                        <span className="text-[10px] text-slate-500">Data trafik: {sc.traffic} • Data cuaca: {sc.weather}</span>
                      </div>
                    </div>

                    <ArrowRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-indigo-600 translate-x-1' : 'text-slate-300'}`} />
                  </button>
                );
              })}
            </div>

            {/* Target Action Callout */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-1.5 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">
                Pertanyaan untuk tinjauan manusia:
              </span>
              <p className="font-medium leading-relaxed text-slate-200 text-[11px]">
                {currentScenarioData.targetAction}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Local example log sequence */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-slate-200 text-xs">Urutan log demonstrasi</span>
              </div>
              <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>Log sintetis; tidak mengukur jaringan</span>
              </div>
            </div>

            {/* Terminal Log Area */}
            <div className="space-y-3 min-h-[280px] max-h-[340px] overflow-y-auto pr-1">
              {terminalLogs.map((log, index) => {
                const colorMap = {
                  info: 'text-cyan-300',
                  success: 'text-emerald-400',
                  warning: 'text-amber-400',
                  danger: 'text-rose-400'
                };

                return (
                  <div key={index} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-1 animate-fade-in">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-bold text-slate-300">[{log.time}] • {log.agent}</span>
                      <span className={`uppercase font-bold ${colorMap[log.type]}`}>{log.type}</span>
                    </div>
                    <p className={`text-[11px] leading-relaxed ${colorMap[log.type]}`}>
                      {log.text}
                    </p>
                  </div>
                );
              })}

              {isSimulating && (
                <div className="flex items-center space-x-2 text-[11px] text-slate-400 italic py-2 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  <span>Memutar urutan log demonstrasi...</span>
                </div>
              )}
            </div>

            {/* Terminal Status Footer */}
            <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400">
              <span>Protokol: belum diimplementasikan</span>
              <span className="text-amber-300 font-bold">Status: simulasi, belum diverifikasi</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
