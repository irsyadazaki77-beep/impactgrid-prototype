import React, { useState, useEffect, useRef } from 'react';
import ExplainableAiModal from './ExplainableAiModal';
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
  Activity,
  Layers,
  Network,
  Check,
  Server
} from 'lucide-react';

export default function AgentOrchestratorTab() {
  const [selectedScenario, setSelectedScenario] = useState('midnight');
  const [activeOrchestratorSection, setActiveOrchestratorSection] = useState('scenarios'); // 'scenarios' | 'arbitration' | 'feature_io'
  const [selectedConflict, setSelectedConflict] = useState('112_priority');
  const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState([]);
  const simulationTimers = useRef([]);

  // 4 AI Agents powering the O-RAN Non-RT RIC Architecture
  const agents = [
    {
      id: 'prophet',
      name: 'Agent 1: Prophet-RAN',
      role: 'Prediksi Trafik & Jendela Carrier Sleep',
      tech: 'Temporal Fusion Transformer & O1 PM Stream',
      avatarColor: 'bg-sky-600',
      badge: 'MAPE 4.2% Akurasi',
      description: 'Memprediksi kurva volume PRB dan trafik seluler 15–60 menit ke depan per sektor untuk menentukan jendela aman aktivasi Carrier Sleep tanpa risiko kemacetan jaringan.'
    },
    {
      id: 'thermo',
      name: 'Agent 2: ThermoOptima',
      role: 'Optimasi Termal Shelter & HVAC Dinamis',
      tech: 'Physics-Informed Neural Network (PINN)',
      avatarColor: 'bg-cyan-600',
      badge: 'Hemat HVAC 14.8%',
      description: 'Mengendalikan inverter AC shelter dan sistem ventilasi udara luar adaptif dengan setpoint dinamis 26°C berdasarkan suhu cuaca dan disipasi panas radio BTS.'
    },
    {
      id: 'sentinel',
      name: 'Agent 3: Sentinel-SLA',
      role: 'Penegakan Guardrail & Fail-Safe 112',
      tech: 'Real-Time Interlock & Zero-Wait Rollback',
      avatarColor: 'bg-rose-600',
      badge: '28ms Rollback',
      description: 'Memantau Call Drop Rate (CDR) dan latensi paket secara real-time. Jika beban PRB >60% atau ada panggilan darurat 112, seluruh sleep dibatalkan seketika dalam 28ms.'
    },
    {
      id: 'ledger',
      name: 'Agent 4: GreenLedger',
      role: 'Akuntansi Karbon & Kriptografi Hash',
      tech: 'Difference-in-Differences & SHA-256',
      avatarColor: 'bg-emerald-600',
      badge: 'ISO 14064 & PSPK 1/2',
      description: 'Memvalidasi penghematan energi kausal terhadap site kontrol pembanding, mengonversi kWh menjadi reduksi emisi Scope 2, dan menyegel hash ke buku besar audit.'
    }
  ];

  // Scenarios presets with realistic telecom NOC event sequences
  const scenarios = {
    midnight: {
      id: 'midnight',
      title: 'Off-Peak Midnight Sleep (03:00 WIB)',
      traffic: 'Rendah (16% PRB)',
      weather: '24.5°C Normal',
      emergency: 'NORMAL',
      icon: Clock,
      targetAction: 'Prophet-RAN mendeteksi utilisasi rendah; mengaktifkan Deep Sleep pada carrier B3/B8 di 36 site pilot.',
      logs: [
        { time: '03:00:02', agent: 'Prophet-RAN', type: 'info', text: 'Trafik PRB stabil di 16.2% selama 15m. Mengirim rekomendasi Carrier Sleep B3/B8 via O-RAN A1 policy.' },
        { time: '03:00:04', agent: 'Sentinel-SLA', type: 'success', text: 'Verifikasi SLA: CDR 0.05%, kanal darurat 112 idle. Memberikan izin eksekusi O-RAN O1 dispatch.' },
        { time: '03:00:06', agent: 'ThermoOptima', type: 'info', text: 'Disipasi panas radio turun 420W/site. Mengatur inverter AC ke Eco-Mode (26°C).' },
        { time: '03:00:08', agent: 'GreenLedger', type: 'success', text: 'Penghematan terisolasi tercatat: 54.2 kW/jam. Payload disegel ke Block #BLK-2026-088 (SHA-256 Valid).' }
      ]
    },
    concert: {
      id: 'concert',
      title: 'Lonjakan Trafik Konser Stadion (19:30 WIB)',
      traffic: 'Sangat Tinggi (88% PRB)',
      weather: '28.0°C Normal',
      emergency: 'CAPACITY_SPIKE',
      icon: Activity,
      targetAction: 'Sentinel-SLA mendeteksi lonjakan trafik mendadak; instant wake-up membatalkan seluruh sleep mode.',
      logs: [
        { time: '19:30:01', agent: 'Sentinel-SLA', type: 'warning', text: 'ALERT: PRB sektor 1-3 melonjak drastis ke 88.4%. Memicu interlock kapasitas.' },
        { time: '19:30:02', agent: 'Prophet-RAN', type: 'danger', text: 'Zero-Wait Override: Seluruh sub-carrier diaktifkan seketika (Wake-up latency: 28ms).' },
        { time: '19:30:04', agent: 'ThermoOptima', type: 'info', text: 'Beban termal radio melonjak ke 4.2 kW. Memaksimalkan pendinginan HVAC shelter.' },
        { time: '19:30:06', agent: 'Sentinel-SLA', type: 'success', text: 'Throughput stabil 145 Mbps, Call Drop Rate terjaga di 0.07% (SLA Safe).' }
      ]
    },
    disaster: {
      id: 'disaster',
      title: 'Panggilan Darurat 112 (Hospital Zone)',
      traffic: 'Sedang (42% PRB)',
      weather: 'Normal',
      emergency: 'SAFETY_INTERLOCK',
      icon: ShieldAlert,
      targetAction: 'Deteksi panggilan 112 memicu pembatalan seketika sleep mode dan penguncian kanal radio prioritas.',
      logs: [
        { time: '14:12:01', agent: 'Sentinel-SLA', type: 'danger', text: 'PRIORITY 112 DETECTED: Panggilan darurat terdeteksi di sektor JKT-SEL-P01.' },
        { time: '14:12:02', agent: 'Sentinel-SLA', type: 'success', text: 'Instant Rollback: Sleep mode dibatalkan dalam 24ms. 100% resource blok dialokasikan ke kanal 112.' },
        { time: '14:12:04', agent: 'Prophet-RAN', type: 'info', text: 'Mengunci status radio ke Full Available selama sesi darurat berlangsung.' },
        { time: '14:12:06', agent: 'GreenLedger', type: 'info', text: 'Log insiden darurat dicatat ke buku besar audit tanpa penalti efisiensi energi.' }
      ]
    },
    heatwave: {
      id: 'heatwave',
      title: 'Gelombang Panas Ekstrem (Ambient 36.5°C)',
      traffic: 'Normal (35% PRB)',
      weather: '36.5°C Ekstrem',
      emergency: 'THERMAL_STRESS',
      icon: Flame,
      targetAction: 'ThermoOptima mengorkestrasi kompensasi pendinginan cerdas untuk mencegah thermal throttling radio.',
      logs: [
        { time: '13:00:01', agent: 'ThermoOptima', type: 'warning', text: 'Suhu ambien luar mencapai 36.5°C. Ventilasi udara luar ditutup rapat.' },
        { time: '13:00:03', agent: 'ThermoOptima', type: 'info', text: 'Inverter pendingin presisi shelter dinaikkan ke kapasitas optimal untuk menjaga selubung di 26°C.' },
        { time: '13:00:05', agent: 'Prophet-RAN', type: 'info', text: 'Menyeimbangkan daya transmit radio antar sektor untuk meratakan disipasi panas termal.' },
        { time: '13:00:07', agent: 'Sentinel-SLA', type: 'success', text: 'Suhu PA (Power Amplifier) radio aman di 68°C. Nol degradasi performa RF.' }
      ]
    }
  };

  const conflictScenarios = {
    '112_priority': {
      id: '112_priority',
      title: 'Konflik 1: Penghematan Energi vs Panggilan Darurat 112',
      parties: ['Prophet-RAN (Rekomendasi Sleep B3)', 'Sentinel-SLA (Deteksi Panggilan 112)'],
      weights: { energy: '0% (Dibatalkan)', qos: '100% (Veto Mutlak)', thermal: 'Normal' },
      resolution: 'VETO MUTLAK SENTINEL-SLA: Instant Zero-Wait Rollback dalam 24 ms. 100% Resource Block dialokasikan ke kanal darurat. Penghematan energi diabaikan seketika demi keselamatan nyawa manusia.',
      status: 'Hard Constraint Triggered (Rollback 24ms)',
      badgeColor: 'bg-rose-500'
    },
    'thermal_vs_sleep': {
      id: 'thermal_vs_sleep',
      title: 'Konflik 2: Deep Sleep vs Disipasi Panas Suhu Ekstrem 37°C',
      parties: ['Prophet-RAN (Rekomendasi Deep Sleep)', 'ThermoOptima (Suhu Ambien 36.8°C, PA Panas)'],
      weights: { energy: '50% (Dibatasi ke Light Sleep)', qos: '30% (Aman)', thermal: '70% (Prioritas Termal)' },
      resolution: 'ARBITRASE PARETO: ThermoOptima membatasi kedalaman sleep ke Micro-Sleep parsial dan memerintahkan perataan daya pancar RF ke sektor tetangga untuk mendinginkan Power Amplifier tanpa mematikan total.',
      status: 'Multi-Objective Pareto Compromise',
      badgeColor: 'bg-amber-500'
    },
    'did_control_locking': {
      id: 'did_control_locking',
      title: 'Konflik 3: Ekspansi Agresif vs Kemurnian Baseline Kausal DiD',
      parties: ['Prophet-RAN (Ingin Mengaktifkan Sleep di Site Pembanding)', 'GreenLedger (Integritas Kontrol DiD)'],
      weights: { energy: '0% (Ditolak)', qos: 'Normal', audit: '100% (Proteksi Kausalitas)' },
      resolution: 'SAFETY LOCKING AUDIT: GreenLedger mengunci 10 site kontrol secara kriptografis (x_i,j = 0) agar baseline pembanding tidak terkontaminasi intervensi, menjaga validitas sertifikasi asurans KAP.',
      status: 'Cryptographic Audit Lock (x_i,j = 0)',
      badgeColor: 'bg-emerald-500'
    }
  };

  const featureIoSpecs = [
    {
      agent: 'Prophet-RAN',
      role: 'Prediksi Trafik & Jendela Carrier Sleep',
      model: 'Temporal Fusion Transformer (TFT) + Multi-Horizon Quantile Forecaster',
      inputs: [
        'PRB Utilization 15m window (Ericsson O1 PM)',
        'RRC Connected User count (Huawei MAE)',
        'Distribusi CQI / SINR seluler',
        'Kalender hari libur nasional & jadwal konser',
        'Tren musiman historis 7 hari'
      ],
      outputs: [
        'A1 Policy Target: CarrierSleepTarget(Site_ID, Band, WindowMinutes)',
        'Prediksi kurva PRB 15-60 menit (p10/p50/p90)',
        'Congestion Risk Probability Score'
      ],
      loop: '15–30 Menit (O-RAN Non-RT RIC Loop)'
    },
    {
      agent: 'ThermoOptima',
      role: 'Optimasi Termal Shelter & HVAC Dinamis',
      model: 'Physics-Informed Neural Network (PINN) Kalorimetri Shelter',
      inputs: [
        'Suhu outdoor ambient (API BMKG & IoT Sensor)',
        'Suhu indoor shelter (Sensor Kelas 0.5s)',
        'Suhu heat sink Power Amplifier (PA) radio BTS',
        'Total disipasi daya DC Rectifier (Watt)',
        'Status kompresor & inverter AC saat ini'
      ],
      outputs: [
        'Setpoint suhu dinamis inverter AC (24°C–27°C)',
        'Sinyal buka/tutup damper ventilasi udara luar (Free Cooling)',
        'Kompensasi beban termal antar-sektor radio'
      ],
      loop: '5 Menit (Facility Control Loop)'
    },
    {
      agent: 'Sentinel-SLA',
      role: 'Penegakan Guardrail & Fail-Safe 112',
      model: 'Real-Time Interlock Engine & Anomaly Detector',
      inputs: [
        'Call Drop Rate (CDR) interval 10 detik',
        'Paket Latensi & Packet Loss Rate (PLR)',
        'Flag Panggilan Darurat 112 (Priority Event Trigger)',
        'Throughput 10th percentile (p10 Threshold)',
        'Alarm OSS Network Event (FM Alarm Stream)'
      ],
      outputs: [
        'Instant Rollback Signal: Zero-Wait Carrier Wakeup (<28 ms)',
        'Emergency Radio Resource Reservation (100% kanal 112)',
        'Safety Lockout: Penonaktifan sleep mode di sektor terkait'
      ],
      loop: '< 100 ms (Near-RT RIC / E2 Interface Shadow Loop)'
    },
    {
      agent: 'GreenLedger',
      role: 'Akuntansi Karbon & Kriptografi Hash',
      model: 'Difference-in-Differences (DiD) Econometric Model',
      inputs: [
        'Data kWh meter induk PLN AMR (15-menitan)',
        'Submeter IoT output rectifier shelter (DC)',
        'Data baseline 10 site kontrol pembanding',
        'Faktor Emisi Resmi ESDM Jamali (0,87 kgCO2e/kWh)',
        'Normalisasi payload data (Gigabyte)'
      ],
      outputs: [
        'Net Kausal Penghematan Energi (ΔkWh)',
        'Reduksi Emisi Karbon Scope 2 (tCO2e)',
        'Blok Ledger Kriptografis Bersegel SHA-256'
      ],
      loop: 'Hourly & Daily Reconciliation'
    }
  ];

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
      <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-[#0B1324] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-200/80 dark:border-red-900/50 text-xs font-bold text-[#ED0226] dark:text-red-400">
              <Bot className="w-3.5 h-3.5 text-[#ED0226] dark:text-red-400" />
              <span>O-RAN Non-RT RIC • 4 Autonomous Agents Engine</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-2">
              Orkestrasi Multi-Agent O-RAN Non-RT RIC & Tata Kelola Multi-Vendor
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-4xl leading-relaxed mt-1">
              Empat agen kecerdasan buatan beroperasi secara terkoordinasi dalam arsitektur Open RAN (O-RAN O1 & A1 Interface) untuk mengorkestrasi penghematan energi jaringan Telkomsel, mengendalikan pendingin shelter, dan menjamin 100% keandalan layanan darurat.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsExplainModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Inspeksi Logika AI (XAI)</span>
            </button>
            <div className="flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-2 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>4 Agents Siaga (Loop 300ms)</span>
            </div>
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
              className={`p-5 rounded-2xl bg-white dark:bg-[#0B1324] border transition-all space-y-3 relative overflow-hidden ${
                isHighlighted 
                  ? 'border-[#ED0226] shadow-sm ring-1 ring-red-400/40 dark:border-red-500' 
                  : 'border-slate-200/80 dark:border-slate-800 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-xl text-white ${agent.avatarColor}`}>
                  <Bot className="w-5 h-5" />
                </div>
                <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {agent.badge}
                </span>
              </div>

              <div>
                <h2 className="font-extrabold text-xs text-slate-900 dark:text-slate-100">{agent.name}</h2>
                <p className="text-[10px] text-slate-500 font-semibold">{agent.role}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-400">
                <span className="font-bold text-slate-800 dark:text-slate-200 block text-[9px] uppercase tracking-wider">Engine Kunci:</span>
                {agent.tech}
              </div>

              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                {agent.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* MULTI-VENDOR RAN GOVERNANCE & COORDINATION MATRIX (ERICSSON vs HUAWEI) */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0B1324] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
              <Network className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                Matriks Interoperabilitas & Tata Kelola Multi-Vendor (Ericsson ENM vs Huawei MAE)
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Arsitektur vendor-agnostic O-RAN O1/A1 menyatukan koordinasi carrier sleep di wilayah perbatasan kluster tanpa blind-spot
              </p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
            ✓ Koordinasi Batas Seluler Aktif
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Vendor A */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-slate-100">Kluster Barat: Ericsson</span>
              <span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-[10px] font-mono font-bold">Jabodetabek / Jabar</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Interface O-RAN O1 terhubung ke Ericsson ENM OSS via REST/NETCONF. Menerima kebijakan A1 untuk Carrier Sleep B3 (1800 MHz) saat off-peak.
            </p>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 text-[10px] text-slate-500 font-mono">
              Status O1: Connected (22 sites)
            </div>
          </div>

          {/* Central O-RAN Non-RT RIC */}
          <div className="p-4 rounded-xl border-2 border-red-500 bg-red-50/20 dark:bg-red-950/10 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-[#ED0226] dark:text-red-400">ImpactGrid Non-RT RIC</span>
              <span className="px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 text-[10px] font-mono font-bold">Orkestrator Pusat</span>
            </div>
            <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              Mengorkestrasi kebijakan hemat energi lintas batas vendor. Mencegah coverage hole di perbatasan wilayah (misal Cirebon-Brebes) dengan sinkronisasi inter-cell handover.
            </p>
            <div className="pt-2 border-t border-red-200 dark:border-red-900/60 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Nol Coverage Hole Lintas Vendor</span>
            </div>
          </div>

          {/* Vendor B */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-slate-100">Kluster Timur: Huawei</span>
              <span className="px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 text-[10px] font-mono font-bold">Jateng / Jatim</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Interface O-RAN O1 terhubung ke Huawei MAE / U2020. Sinkronisasi parameter RF transmit power dan dynamic symbol shutdown terpantau terpusat.
            </p>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 text-[10px] text-slate-500 font-mono">
              Status O1: Connected (28 sites)
            </div>
          </div>
        </div>
      </div>

      {/* Subview Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveOrchestratorSection('scenarios')}
            className={`px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 ${
              activeOrchestratorSection === 'scenarios'
                ? 'bg-white dark:bg-slate-900 text-[#ED0226] shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>1. Simulasi Live & Log Terminal</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveOrchestratorSection('arbitration')}
            className={`px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 ${
              activeOrchestratorSection === 'arbitration'
                ? 'bg-white dark:bg-slate-900 text-[#ED0226] shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>2. Mekanisme Arbitrase Konflik Antar-Agen</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveOrchestratorSection('feature_io')}
            className={`px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 ${
              activeOrchestratorSection === 'feature_io'
                ? 'bg-white dark:bg-slate-900 text-[#ED0226] shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>3. Spesifikasi Input/Output Fitur Nyata</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: SCENARIOS & LIVE TERMINAL */}
      {activeOrchestratorSection === 'scenarios' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          {/* Left: Event Simulators (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0B1324] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                  <span>Uji Skenario Interaktif Keputusan Agen</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Pilih skenario operasional nyata di bawah untuk menjalankan simulasi orkestrasi 4 agen secara langsung
                </p>
              </div>

              <div className="space-y-2.5">
                {Object.values(scenarios).map((sc) => {
                  const Icon = sc.icon;
                  const isSelected = selectedScenario === sc.id;
                  return (
                    <button
                      key={sc.id}
                      onClick={() => handleRunSimulation(sc.id)}
                      className={`w-full p-3.5 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                        isSelected 
                          ? 'border-[#ED0226] bg-red-50/20 dark:bg-red-950/20 ring-1 ring-red-400/40' 
                          : 'border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-[#ED0226] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100 block">
                            {sc.title}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            Trafik: {sc.traffic} • Cuaca: {sc.weather}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className={`w-4 h-4 transition ${isSelected ? 'text-[#ED0226] translate-x-1' : 'text-slate-400'}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Live Terminal Stream (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-slate-950 border border-slate-800 shadow-xl overflow-hidden font-mono text-xs flex flex-col h-[480px]">
              {/* Terminal Header */}
              <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-slate-400">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-slate-200 text-xs">Live O-RAN Non-RT RIC Decision Log</span>
                </div>
                <div className="flex items-center space-x-2 text-[10px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-emerald-400 font-bold">Engine Aktif</span>
                </div>
              </div>

              {/* Terminal Body */}
              <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
                <div className="text-[11px] text-slate-500 pb-2 border-b border-slate-900">
                  # ImpactGrid O-RAN Orchestrator v2.6 • Telkomsel Autonomous RAN Energy Suite
                  <br /># Menghubungkan 4 Agen ke antarmuka O-RAN O1 (3GPP TS 28.552) & A1 Policy
                </div>

                {terminalLogs.map((log, index) => {
                  const isInfo = log.type === 'info';
                  const isSuccess = log.type === 'success';
                  const isWarning = log.type === 'warning';
                  const isDanger = log.type === 'danger';

                  return (
                    <div key={index} className="flex items-start space-x-2 animate-fade-in leading-relaxed text-[11px]">
                      <span className="text-slate-600 shrink-0 select-none">[{log.time}]</span>
                      <span className={`font-bold shrink-0 ${
                        log.agent.includes('Prophet') ? 'text-sky-400' :
                        log.agent.includes('Thermo') ? 'text-cyan-400' :
                        log.agent.includes('Sentinel') ? 'text-rose-400' : 'text-emerald-400'
                      }`}>
                        {log.agent}:
                      </span>
                      <span className={`${
                        isDanger ? 'text-red-400 font-bold' :
                        isWarning ? 'text-amber-300' :
                        isSuccess ? 'text-emerald-300 font-semibold' : 'text-slate-300'
                      }`}>
                        {log.text}
                      </span>
                    </div>
                  );
                })}

                {isSimulating && (
                  <div className="flex items-center space-x-2 text-cyan-400 pt-2 animate-pulse text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    <span>Mengeksekusi loop orkestrasi berikutnya...</span>
                  </div>
                )}
              </div>

              {/* Terminal Footer */}
              <div className="p-3 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Skenario aktif: <strong className="text-white">{scenarios[selectedScenario].title}</strong></span>
                <button
                  onClick={() => handleRunSimulation(selectedScenario)}
                  className="text-xs text-red-400 hover:text-red-300 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Ulangi Log Skenario</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: POLICY ARBITRATION & CONFLICT RESOLUTION */}
      {activeOrchestratorSection === 'arbitration' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0B1324] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-500" />
                  <span>Matriks Arbitrase Kebijakan & Resolusi Konflik (Multi-Objective Optimization)</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Bagaimana sistem memutuskan saat agen memiliki kepentingan bertentangan: Hemat Daya vs Keandalan Layanan vs Suhu Perangkat.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 font-mono">
                Pareto Reward Function Active
              </span>
            </div>

            {/* Conflict Selector Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {Object.values(conflictScenarios).map((cf) => {
                const isSelected = selectedConflict === cf.id;
                return (
                  <button
                    key={cf.id}
                    type="button"
                    onClick={() => setSelectedConflict(cf.id)}
                    className={`p-4 rounded-xl border text-left transition cursor-pointer space-y-2 ${
                      isSelected
                        ? 'border-[#ED0226] bg-red-50/20 dark:bg-red-950/20 ring-1 ring-red-400'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                        {cf.id.replace('_', ' ')}
                      </span>
                      <span className={`w-2 h-2 rounded-full ${cf.badgeColor}`} />
                    </div>
                    <div className="font-extrabold text-xs text-slate-900 dark:text-slate-100 leading-snug">
                      {cf.title}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Conflict Resolution Detail Card */}
            {conflictScenarios[selectedConflict] && (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-red-600 dark:text-red-400 tracking-wider">Hasil Arbitrase O-RAN:</span>
                    <h4 className="font-black text-sm text-slate-900 dark:text-slate-100">
                      {conflictScenarios[selectedConflict].title}
                    </h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                    Status: {conflictScenarios[selectedConflict].status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5 p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block text-[11px]">Pihak yang Terlibat Konflik:</span>
                    <ul className="space-y-1 text-slate-600 dark:text-slate-400 text-[11px]">
                      {conflictScenarios[selectedConflict].parties.map((p, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1.5 p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block text-[11px]">Alokasi Bobot Keputusan:</span>
                    <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-center">
                      <div className="p-1.5 rounded bg-slate-100 dark:bg-slate-700">
                        <span className="text-slate-500 block">Efisiensi:</span>
                        <strong className="text-slate-900 dark:text-white">{conflictScenarios[selectedConflict].weights.energy}</strong>
                      </div>
                      <div className="p-1.5 rounded bg-slate-100 dark:bg-slate-700">
                        <span className="text-slate-500 block">QoS SLA:</span>
                        <strong className="text-rose-600 dark:text-rose-400">{conflictScenarios[selectedConflict].weights.qos}</strong>
                      </div>
                      <div className="p-1.5 rounded bg-slate-100 dark:bg-slate-700">
                        <span className="text-slate-500 block">Termal/Audit:</span>
                        <strong className="text-slate-900 dark:text-white">{conflictScenarios[selectedConflict].weights.thermal || conflictScenarios[selectedConflict].weights.audit}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 text-white space-y-1 text-xs">
                  <div className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">Keputusan Final Arbitrator O-RAN Non-RT RIC:</div>
                  <p className="leading-relaxed text-slate-200 font-sans">
                    {conflictScenarios[selectedConflict].resolution}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: FEATURE ENGINEERING & I/O SPECIFICATIONS */}
      {activeOrchestratorSection === 'feature_io' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0B1324] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-sky-500" />
                <span>Spesifikasi Input/Output Fitur Nyata (Feature Engineering per Agen O-RAN)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Rincian parameter telemetri O-RAN O1, arsitektur model kecerdasan buatan, dan kontrol loop untuk implementasi teknis skala nasional.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featureIoSpecs.map((spec, i) => (
                <div key={i} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-900 dark:text-slate-100">{spec.agent}</h4>
                      <p className="text-[10px] text-slate-500">{spec.role}</p>
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 font-bold">
                      {spec.loop}
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-mono">
                    <span className="text-slate-400 block uppercase font-bold">Model / Algoritma:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{spec.model}</strong>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <span className="font-bold text-[11px] text-slate-700 dark:text-slate-300 block">Fitur Input Telemetri:</span>
                    <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                      {spec.inputs.map((inp, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                          <span>{inp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1.5 text-xs pt-2 border-t border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-[11px] text-slate-700 dark:text-slate-300 block text-emerald-600 dark:text-emerald-400">Output Aksi Kontrol:</span>
                    <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                      {spec.outputs.map((out, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{out}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Explainable AI Modal */}
      <ExplainableAiModal 
        isOpen={isExplainModalOpen}
        onClose={() => setIsExplainModalOpen(false)}
      />
    </div>
  );
}
