import React, { useState, useEffect } from 'react';
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
  const [activeStep, setActiveStep] = useState(4); // 0 to 4
  const [terminalLogs, setTerminalLogs] = useState([]);

  // 4 Autonomous Agents definition
  const agents = [
    {
      id: 'prophet',
      name: 'Agent 1: Prophet-RAN',
      role: 'Traffic & Mobility Predictive Forecaster',
      tech: 'Spatio-Temporal Graph Neural Network (ST-GNN) & GRU',
      avatarColor: 'bg-indigo-600',
      badge: 'Non-RT RIC rApp',
      description: 'Menganalisis deret waktu trafik seluler 6 jam ke depan dengan akurasi 96,4% untuk mengidentifikasi celah off-peak.'
    },
    {
      id: 'thermo',
      name: 'Agent 2: ThermoOptima',
      role: 'Shelter Physics & HVAC Reinforcement Learning',
      tech: 'Deep Deterministic Policy Gradient (DDPG) & Inverter PID',
      avatarColor: 'bg-cyan-600',
      badge: 'Edge Node Agent',
      description: 'Menyeimbangkan disipasi panas perangkat radio vs efisiensi pendingin AC secara tertutup tanpa melewati suhu aman 28°C.'
    },
    {
      id: 'sentinel',
      name: 'Agent 3: Sentinel-SLA',
      role: 'Sub-120ms Fast Interrupt & Emergency Guardrail',
      tech: 'Kernel eBPF Fast-Path Watchdog & 3GPP Hook',
      avatarColor: 'bg-rose-600',
      badge: 'Zero-Tolerance Safety',
      description: 'Memantau trafik real-time secara terisolasi. Jika terdeteksi spike darurat atau call 112, seluruh sleep mode di-bypass instan.'
    },
    {
      id: 'ledger',
      name: 'Agent 4: GreenLedger',
      role: 'Cryptographic MRV & Carbon Accounting Auditor',
      tech: 'ITU-T L.1331 DiD Engine & SHA-256 Merkle Audit Trail',
      avatarColor: 'bg-emerald-600',
      badge: 'Anti-Greenwash',
      description: 'Menghitung dekarbonisasi murni terkoreksi cuaca terhadap 10 lokasi kontrol dan mengunci sertifikat reduksi emisi.'
    }
  ];

  // Scenarios presets
  const scenarios = {
    midnight: {
      id: 'midnight',
      title: '1. Dini Hari Jam 02:30 (Off-Peak Datar)',
      traffic: '8,4% Kapasitas',
      weather: '24°C Malam Normal',
      emergency: 'NORMAL',
      icon: Clock,
      targetAction: 'Autonomous Sleep Mode pada Carrier 1.8GHz, 2.1GHz, 2.3GHz + Shelter AC Set 26°C',
      logs: [
        { time: '02:30:00.104', agent: 'Prophet-RAN', type: 'info', text: 'Trafik sektor Alpha/Beta/Gamma diproyeksikan stagnan <10% hingga pukul 05:00 WIB (Confidence 97.8%). Mengusulkan DEEP_SLEEP carrier 2300MHz & MICRO_SLEEP 1800MHz.' },
        { time: '02:30:00.128', agent: 'ThermoOptima', type: 'info', text: 'Disipasi panas internal akan turun dari 1.250W ke 420W. Menyetel thermostat shelter ke 26.5°C dan menurunkan kompresor inverter ke 32 Hz. Estimasi hemat pendingin: 41%.' },
        { time: '02:30:00.142', agent: 'Sentinel-SLA', type: 'success', text: 'Evaluasi Guardrail: Kanal darurat 112 terisolasi di band 900MHz (Full Active). Latensi wake-up benchmark: 94 ms (<120 ms threshold). KELAYAKAN SLA: 100% DISETUJUI.' },
        { time: '02:30:00.160', agent: 'GreenLedger', type: 'success', text: 'Penghematan daya 2.140 Watt dieksekusi. Dihitung terhadap baseline DiD: 0,0018 ton CO2e/jam. Hash blok di-sign: 0x7fa9c21b4...' }
      ]
    },
    concert: {
      id: 'concert',
      title: '2. Konser Musik / Event GBK (Lonjakan Trafik 350%)',
      traffic: '96,2% Kapasitas Ekstrem',
      weather: '29°C Lembab',
      emergency: 'CAPACITY_SPIKE',
      icon: Activity,
      targetAction: 'Instant Wake-Up 120ms: Aktifkan 100% Seluruh Carrier Massive MIMO + AC Full Cooling',
      logs: [
        { time: '19:45:00.012', agent: 'Sentinel-SLA', type: 'warning', text: 'DETEKSI INTERRUPT: Lonjakan payload tiba-tiba +320% pada sektor Alpha (Stadion GBK). eBPF bypass trigger langsung diaktifkan!' },
        { time: '19:45:00.098', agent: 'Sentinel-SLA', type: 'success', text: 'Carrier 2.3GHz Massive MIMO 64T64R berhasil bangun dalam 98 ms (Benchmark <120 ms terpenuhi). ZERO CALL DROP tercapai.' },
        { time: '19:45:00.114', agent: 'ThermoOptima', type: 'warning', text: 'Daya radio melonjak ke 3.800W. Kompresor AC dinaikkan ke 68 Hz untuk mencegah penumpukan panas junction di atas 30°C.' },
        { time: '19:45:00.130', agent: 'GreenLedger', type: 'info', text: 'Mode hemat ditangguhkan sementara demi prioritas QoS & keselamatan konektivitas pengguna sesuai O-RAN WG2 policy.' }
      ]
    },
    disaster: {
      id: 'disaster',
      title: '3. Status Bencana / Gempa & Panggilan 112 Aktif',
      traffic: 'Panggilan Darurat Penuh',
      weather: 'Anomali Bencana',
      emergency: 'DISASTER_112_OVERRIDE',
      icon: ShieldAlert,
      targetAction: 'Emergency Override: Seluruh Algoritma Efisiensi Dibekukan, Daya Baterai Disedot Maksimal',
      logs: [
        { time: '14:12:00.005', agent: 'Sentinel-SLA', type: 'danger', text: 'KRITIS: Panggilan darurat 112 & broadcast BMKG aktif! Protokol penyelamatan jiwa diaktifkan. Freeze seluruh modul sleep.' },
        { time: '14:12:00.024', agent: 'Prophet-RAN', type: 'info', text: 'Membatalkan prediksi model reguler. Mengalokasikan 100% resource block untuk jalur prioritas telekomunikasi kebencanaan (ITU-T E.106).' },
        { time: '14:12:00.040', agent: 'ThermoOptima', type: 'info', text: 'Mengaktifkan redundansi pendingin Fan B (Dual fail-safe mode). Baterai LiFePO4 siaga penuh.' },
        { time: '14:12:00.062', agent: 'GreenLedger', type: 'info', text: 'Audit trail mencatat pengecualian resmi (Disaster Exemption Log SHA-256). Kepatuhan regulasi 100% terjaga.' }
      ]
    },
    heatwave: {
      id: 'heatwave',
      title: '4. Gelombang Panas Terik Siang Hari (35°C)',
      traffic: '62,0% Kapasitas Siang',
      weather: '35,4°C Panas Terik',
      emergency: 'THERMAL_STRESS',
      icon: Flame,
      targetAction: 'Solar Maximum Yield Absorption + Dynamic Free-Air Shifting + Smart Modulation',
      logs: [
        { time: '12:15:00.045', agent: 'ThermoOptima', type: 'warning', text: 'Suhu lingkungan ambien 35.4°C. Pemanfaatan solar rooftop mencapai 4.1 kWp. Mengarahkan daya solar murni ke beban inverter pendingin.' },
        { time: '12:15:00.082', agent: 'Prophet-RAN', type: 'info', text: 'Mengalihkan sebagian beban data ke band 1800MHz untuk menurunkan densitas panas pada modul Massive MIMO 2.3GHz.' },
        { time: '12:15:00.110', agent: 'Sentinel-SLA', type: 'success', text: 'Suhu shelter stabil di 26.8°C. Tidak ada risiko thermal throttling radio. Latensi jaringan tetap prima (14.2 ms).' },
        { time: '12:15:00.145', agent: 'GreenLedger', type: 'success', text: '100% energi pendingin disuplai dari energi terbarukan mandiri (Scope 2 Emisi = 0 gCO2e selama jam terik).' }
      ]
    }
  };

  const currentScenarioData = scenarios[selectedScenario];

  const handleRunSimulation = (scenKey) => {
    setSelectedScenario(scenKey);
    setIsSimulating(true);
    setTerminalLogs([]);
    setActiveStep(0);

    const logs = scenarios[scenKey].logs;
    logs.forEach((log, index) => {
      setTimeout(() => {
        setTerminalLogs(prev => [...prev, log]);
        setActiveStep(index + 1);
        if (index === logs.length - 1) {
          setIsSimulating(false);
        }
      }, (index + 1) * 450);
    });
  };

  useEffect(() => {
    setTerminalLogs(scenarios.midnight.logs);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-800">
              <Bot className="w-3.5 h-3.5 text-indigo-600" />
              <span>O-RAN Non-RT RIC Multi-Agent Swarm</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
              Orkestrasi Multi-Agent Otonom & Mekanisme Konsensus Real-Time
            </h1>
            <p className="text-xs text-slate-600 max-w-3xl leading-relaxed mt-1">
              ImpactGrid tidak digerakkan oleh aturan statis, melainkan oleh <strong>4 Agen AI Spesialis</strong> yang berkolaborasi secara terus-menerus melalui arsitektur <em>Closed-Loop Non-RT RIC</em>. Setiap tindakan diverifikasi dengan pengamanan instan sub-120ms sebelum dikirim ke perangkat keras BTS.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-2xl border border-slate-200 shrink-0 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold text-slate-700">Autonomous Closed-Loop: ACTIVE</span>
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
                <span>Simulasi Skenario Dinamis (Uji Respon Agen)</span>
              </h2>
              <p className="text-xs text-slate-500">
                Pilih skenario operasional lapangan untuk melihat bagaimana para agen bernegosiasi dan mengambil keputusan otonom:
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
                        <span className="text-[10px] text-slate-500">Beban: {sc.traffic} • Cuaca: {sc.weather}</span>
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
                Target Keputusan Otonom:
              </span>
              <p className="font-medium leading-relaxed text-slate-200 text-[11px]">
                {currentScenarioData.targetAction}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Live Agent Thought Terminal & Closed-Loop Output (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-slate-200 text-xs">O-RAN Non-RT RIC Consensus Stream</span>
              </div>
              <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Sub-120ms Latency Loop</span>
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
                  <span>Agen sedang menghitung optimasi multi-objektif...</span>
                </div>
              )}
            </div>

            {/* Terminal Status Footer */}
            <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400">
              <span>Protokol: A1-P Policy REST / Netconf over SSH</span>
              <span className="text-emerald-400 font-bold">Consensus Status: APPROVED & VERIFIED</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
