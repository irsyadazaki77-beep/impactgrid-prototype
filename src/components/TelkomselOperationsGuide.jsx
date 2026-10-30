import React, { useState } from 'react';
import {
  Compass,
  Layers,
  Users,
  PlayCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Activity,
  Terminal,
  Cpu,
  Radio,
  Server,
  Wrench,
  Check,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Flame,
  BatteryCharging,
  Sliders,
  DollarSign,
  FileText
} from 'lucide-react';

const OPERATIONAL_ROLES = [
  {
    id: 'vp_network',
    title: 'VP / GM Network Operations',
    persona: 'Pimpinan Pengambil Keputusan Bisnis & Jaringan',
    badge: 'Executive & Strategy',
    color: 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300',
    icon: DollarSign,
    focus: 'Penghematan OPEX Energi Nasional, Pemenuhan Target ESG Scope 2, & Jaminan SLA 99,994%',
    dailyRoutine: [
      'Pantau realisasi kas bersih efisiensi listrik bulanan vs target KPI (Baseline 1.885,4 GWh)',
      'Tinjau skor ketaatan ESG Scope 2 dan kelayakan alokasi reinvestasi Dividen Sosial (Telkomsel Jaga Cita)',
      'Verifikasi tidak ada penalti SLA ketersediaan jaringan akibat inisiatif hemat energi (Call Drop Rate < 0.8%)',
      'Setujui penyesuaian parameter skema pembagian nilai sewa menara dengan TowerCo (85/15)'
    ],
    metricTarget: 'NPV +Rp 460 Jt (Pilot) s/d +Rp 41,48 M (Nasional) • Payback 1,0–1,9 Thn'
  },
  {
    id: 'noc_leader',
    title: 'NOC Shift Leader',
    persona: 'Komandan Operasi Pengawasan 24/7',
    badge: 'NOC Surveillance & Triage',
    color: 'border-red-500 bg-red-50/60 dark:bg-red-950/30 text-red-700 dark:text-red-300',
    icon: Activity,
    focus: 'Triage Anomali Real-Time, Eksekusi Runbook SOP 01–04, & Berita Acara Serah Terima 3-Shift',
    dailyRoutine: [
      'Lakukan audit telemetri masuk via TMF628 setiap pergantian jam kerja',
      'Tindak lanjuti alarm kritis kebocoran daya atau anomali termal shelter dari dashboard triage',
      'Eksekusi runbook darurat 1-klik (SOP 01-04) jika terjadi blackout PLN atau gelombang panas',
      'Lakukan digital sign-off pada logbook serah terima piket (Shift 1, 2, atau 3) dan unduh berita acara'
    ],
    metricTarget: 'SLA Respon Alarm < 5 Menit • 100% Runbook Automated Rollback < 28ms'
  },
  {
    id: 'rno_engineer',
    title: 'Radio Optimization Engineer (RNO)',
    persona: 'Spesialis Kinerja Frekuensi & Mutu Layanan Radio',
    badge: 'Radio Access Network',
    color: 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300',
    icon: Radio,
    focus: 'Konfigurasi Mode Tidur Carrier O-RAN, Ambang PRB Max 70%, & Perlindungan Panggilan Darurat 112',
    dailyRoutine: [
      'Validasi kurva diurnal trafik 24 jam untuk menentukan jendela aman carrier micro-sleep per cluster',
      'Pastikan hard-limit ambang batas utilisasi PRB aktif di 70% (mencegah degradasi throughput pelanggan)',
      'Uji mekanisme fail-safe 28ms instant wake-up pada sektor radio makro Ericsson ENM & Huawei MAE',
      'Monitor kestabilan KPI Radio: RRC Connection Success Rate > 99.5%, E-RAB Drop Rate < 0.1%'
    ],
    metricTarget: 'Efisiensi Daya Radio -14.8% • Call Drop Rate Tetap Rendah (0.06%)'
  },
  {
    id: 'fop_technician',
    title: 'Field Operations & Mitratel',
    persona: 'Teknisi Pemeliharaan Fisik Shelter BTS & Genset',
    badge: 'Field Maintenance',
    color: 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300',
    icon: Wrench,
    focus: 'Penerimaan Tiket e-WO SOM Telkomsel, Checklist Fisik Shelter BTS, & Perawatan Baterai/AC',
    dailyRoutine: [
      'Terima disposisi tiket e-Work Order dengan prioritas P1/P2 melalui integrasi SOM Telkomsel',
      'Lakukan inspeksi fisik shelter: cek segel meter PLN, kencangkan busbar DC -48V, bersihkan filter AC',
      'Kalibrasi akurasi submetering IoT Class 0.5s terhadap pembacaan clamp meter standar industri',
      'Unggah foto bukti penyelesaian pekerjaan dan catat hasil pengukuran sebelum menutup tiket'
    ],
    metricTarget: 'MTTR Respon Fisik < 1.8 Jam (Target SLA < 4.0 Jam) • Health BESS SoH > 92%'
  }
];

const FLIGHT_DRILLS = [
  {
    id: 'drill_blackout',
    title: 'Drill 1: Pemadaman Listrik Total PLN (Grid Blackout)',
    triggerDesc: 'Tegangan masukan AC dari PLN mendadak turun ke 0 VAC pada jam operasional puncak.',
    expectedSla: '< 10 ms Transisi Bus Inverter (Tanpa Kedip)',
    initialState: {
      acGrid: '0 VAC (Padam Total)',
      bessStatus: 'Discharging 48V DC • 8.4 kW',
      dieselGenset: 'Siaga (Standby - Tidak Perlu Start)',
      radioStatus: '100% Aktif Normal (Zero Drop Call)',
      carbonAvoided: '14.2 kg CO₂e (Hemat Solar 100%)'
    },
    runbookLogs: [
      '[00:00.002] SENSOR: AC Input Loss terdeteksi oleh Submeter Class 0.5s di panel ATS.',
      '[00:00.008] AUTOMATION: Inverter hybrid LiFePO4 mengalihkan pasokan daya DC secara instan (8ms).',
      '[00:00.015] POLICY: Beban sekunder pendingin non-kritis dimodulasi ke batas ekonomis.',
      '[00:00.022] NOC NOTIF: Tiket anomali diterbitkan ke IBM Netcool (TMF642). Genset dicegah start (BESS SoH 94%).'
    ]
  },
  {
    id: 'drill_emergency112',
    title: 'Drill 2: Panggilan Darurat 112 & Lonjakan Trafik Tiba-Tiba',
    triggerDesc: 'Lonjakan trafik tidak terduga atau panggilan darurat 112 masuk saat sektor radio dalam mode micro-sleep.',
    expectedSla: '< 28 ms Instant Wake-up (Regulasi Keselamatan Publik)',
    initialState: {
      acGrid: '220 VAC Normal',
      bessStatus: 'Floating 53.5V DC',
      dieselGenset: 'Mati',
      radioStatus: 'Kapasitas 100% Dipulihkan (Zero-Wait)',
      carbonAvoided: 'SLA Prioritas 100% Terlindungi'
    },
    runbookLogs: [
      '[00:00.001] RADIO: Sinyal prioritas panggilan 112 terdeteksi pada sektor makro 2.',
      '[00:00.012] O-RAN A1: Perintah interupsi darurat dikirim ke O-DU/Near-RT RIC.',
      '[00:00.028] RAN RECOVERY: Seluruh sub-carrier dibangkitkan dari sleep mode dalam 28ms.',
      '[00:00.035] AUDIT: Perekaman insiden selesai, kepatuhan regulasi keselamatan publik terjamin.'
    ]
  },
  {
    id: 'drill_heatwave',
    title: 'Drill 3: Gelombang Panas & Filter AC Shelter Tersumbat',
    triggerDesc: 'Suhu luar ruangan melonjak ke 36°C dan delta disipasi panas kabinet menunjukkan filter AC kotor.',
    expectedSla: 'Setpoint Dinamis 25°C + Auto e-WO Dispatched',
    initialState: {
      acGrid: '220 VAC Normal',
      bessStatus: 'Normal Floating',
      dieselGenset: 'Mati',
      radioStatus: 'Disipasi Panas Stabil di 27.2°C',
      carbonAvoided: 'Mencegah Radio Thermal Shutdown (> 45°C)'
    },
    runbookLogs: [
      '[00:00.005] IOT SENSOR: Suhu kabinet BTS mencapai 33.8°C (ambang batas: 32.0°C).',
      '[00:00.018] AI TWIN: Korelasi PINN mendeteksi anomali daya fan pendingin naik 18% (Filter Mampet).',
      '[00:00.040] SMART HVAC: Setpoint pendingin diturunkan ke 25°C untuk mencegah thermal shutdown.',
      '[00:00.055] WORK ORDER: Tiket P2 diterbitkan otomatis ke tim FOP Mitratel untuk pembersihan filter.'
    ]
  }
];

const OPERATIONAL_FAQS = [
  {
    q: 'Apakah ImpactGrid bermaksud menggantikan IBM Netcool atau OSS yang sudah ada di Telkomsel?',
    a: 'Sama sekali tidak. ImpactGrid dirancang sebagai Intelligent Layer (rApp pada Non-RT RIC O-RAN) yang bertindak sebagai orkestrator cerdas efisiensi energi. ImpactGrid mengirimkan alarm ke IBM Netcool via TM Forum TMF642, menerbitkan tiket ke Telkomsel SOM, dan menginjeksi kebijakan hemat energi ke Near-RT RIC/EMS (Ericsson ENM & Huawei MAE). Sistem eksisting Telkomsel tetap menjadi single pane of glass utama.'
  },
  {
    q: 'Bagaimana jika sensor submetering IoT atau jaringan telemetri putus tiba-tiba?',
    a: 'Sistem dilengkapi fail-safe fails-open. Jika telemetri terputus selama lebih dari 3 interval (45 detik), ImpactGrid secara otomatis menonaktifkan seluruh aksi sleep-mode dan mengembalikan BTS ke mode normal default (100% daya operasional statis). Tidak ada risiko BTS mati atau layanan terganggu akibat hilangnya koneksi sensor.'
  },
  {
    q: 'Apakah algoritma penghematan bisa mematikan sektor radio saat trafik mendadak padat?',
    a: 'Tidak mungkin. Sistem menerapkan Hard Safety Lock: algoritma micro-sleep hanya aktif jika utilisasi PRB berada di bawah 15% selama minimal 15 menit berturut-turut pada jam sepi (off-peak). Jika PRB naik di atas 70% atau terdeteksi panggilan 112, fitur instant wake-up mengembalikan kapasitas radio seketika dalam 28 milidetik.'
  },
  {
    q: 'Bagaimana mekanisme pembagian keuntungan listrik pada menara yang disewa dari TowerCo (Mitratel/Protelindo/STP)?',
    a: 'ImpactGrid mengadopsi klausul sewa menara modern (Green Lease Formula) dengan pembagian penghematan 85/15 atau 70/30. Telkomsel sebagai penyewa menerima 85% penghematan tagihan PLN, sedangkan TowerCo menerima 15% incentive fee untuk membiayai perawatan BESS LiFePO4 dan insulasi termal shelter. Model ini telah disimulasikan di Tab Finansial.'
  }
];

export default function TelkomselOperationsGuide({ setActiveTab }) {
  const [activeTabSub, setActiveTabSub] = useState('ecosystem'); // 'ecosystem', 'roles', 'flight_drill', 'faq'
  const [selectedRole, setSelectedRole] = useState(OPERATIONAL_ROLES[0].id);
  const [selectedDrill, setSelectedDrill] = useState(FLIGHT_DRILLS[0].id);
  const [isDrillRunning, setIsDrillRunning] = useState(false);
  const [drillSuccess, setDrillSuccess] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(0);

  const currentRole = OPERATIONAL_ROLES.find(r => r.id === selectedRole) || OPERATIONAL_ROLES[0];
  const currentDrill = FLIGHT_DRILLS.find(d => d.id === selectedDrill) || FLIGHT_DRILLS[0];

  const handleRunDrill = () => {
    setIsDrillRunning(true);
    setDrillSuccess(false);
    setTimeout(() => {
      setIsDrillRunning(false);
      setDrillSuccess(true);
    }, 1200);
  };

  return (
    <div id="telkomsel-ops-guide" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-5 md:p-7 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-xs font-bold text-[#ED0226] dark:text-red-400">
            <Compass className="h-4 w-4" />
            <span>PANDUAN OPERASIONAL & ONBOARDING TELKOMSEL</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Pusat Edukasi & Pengenalan Produk untuk Tim Operasional Telkomsel
          </h2>
          <p className="max-w-4xl text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
            Memandu bagaimana ImpactGrid bekerja berdampingan dengan ekosistem OSS/BSS Telkomsel eksisting, mendefinisikan alur kerja harian sesuai peran, serta menyediakan simulasi uji terbang (*flight simulator*) untuk membuktikan keandalan jaringan.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>IT Architecture & SOP Aligned</span>
          </span>
        </div>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800">
        <button
          onClick={() => setActiveTabSub('ecosystem')}
          className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2 ${
            activeTabSub === 'ecosystem'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-red-600" />
          <span>1. Peta Posisi di Ekosistem OSS Telkomsel</span>
        </button>

        <button
          onClick={() => setActiveTabSub('roles')}
          className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2 ${
            activeTabSub === 'roles'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-indigo-600" />
          <span>2. Alur Kerja Harian per Peran (4 Persona)</span>
        </button>

        <button
          onClick={() => setActiveTabSub('flight_drill')}
          className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2 ${
            activeTabSub === 'flight_drill'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <PlayCircle className="w-3.5 h-3.5 text-amber-600" />
          <span>3. Flight Simulator Uji Operasional (3 Skenario)</span>
        </button>

        <button
          onClick={() => setActiveTabSub('faq')}
          className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2 ${
            activeTabSub === 'faq'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5 text-cyan-600" />
          <span>4. FAQ & Safety Guardrails Telkomsel</span>
        </button>
      </div>

      {/* 1. ECOSYSTEM ARCHITECTURE VIEW */}
      {activeTabSub === 'ecosystem' && (
        <div className="space-y-5 animate-fade-in">
          <div className="p-4 rounded-xl bg-blue-50/80 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/40 text-xs text-blue-950 dark:text-blue-300 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Klarifikasi Arsitektur Utama untuk Tim IT & NOC Telkomsel:</strong>
              <p className="mt-0.5 leading-relaxed text-blue-900/90 dark:text-blue-300">
                ImpactGrid <strong>BUKAN pengganti</strong> sistem monitoring yang sudah diinvestasikan oleh Telkomsel (seperti IBM Netcool, ServiceNow, atau Telkomsel SOM). Sebaliknya, ImpactGrid berperan sebagai <strong>"Intelligent Optimization & Decision Engine"</strong> (Non-RT RIC rApp) yang terhubung melalui standar terbuka TM Forum (TMF628/TMF642) dan O-RAN (O1/A1).
              </p>
            </div>
          </div>

          {/* 3-Tier Visual Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Top Tier: Existing Enterprise Systems */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Tier 1 • Layer Eksisting</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-300 text-[10px] font-bold">Tetap Beroperasi</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <span>Telkomsel Enterprise OSS / SOM</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Pusat pengawasan utama perusahaan dan alur kerja tiket:
              </p>
              <ul className="text-xs space-y-1.5 text-slate-700 dark:text-slate-300 font-medium">
                <li className="flex items-center gap-1.5">• <strong>IBM Tivoli Netcool</strong> (Master Alarm Umbrella)</li>
                <li className="flex items-center gap-1.5">• <strong>Telkomsel SOM</strong> (Service Order Management)</li>
                <li className="flex items-center gap-1.5">• <strong>MyTech & ServiceNow</strong> (Trouble Ticketing FOP)</li>
              </ul>
            </div>

            {/* Middle Tier: ImpactGrid Intelligence */}
            <div className="p-4 rounded-xl border-2 border-red-500/80 bg-red-50/40 dark:bg-red-950/20 space-y-3 relative shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#ED0226] dark:text-red-400">Tier 2 • Mesin Cerdas (Overlay)</span>
                <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold animate-pulse">ImpactGrid DSS</span>
              </div>
              <h3 className="text-sm font-bold text-red-900 dark:text-red-300 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#ED0226]" />
                <span>ImpactGrid rApp & Anomaly Engine</span>
              </h3>
              <p className="text-xs text-red-950/80 dark:text-red-300/80">
                Orkestrator pintar hemat daya & pendukung keputusan:
              </p>
              <ul className="text-xs space-y-1.5 text-red-950 dark:text-red-200 font-medium">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-red-600 shrink-0" /> Rekonsiliasi telemetri daya 3-arah (PLN-Rectifier-OSS)</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-red-600 shrink-0" /> Dynamic carrier micro-sleep & setpoint HVAC shelter</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-red-600 shrink-0" /> Kirim alarm via TMF642 & suntik kebijakan O-RAN A1</li>
              </ul>
            </div>

            {/* Bottom Tier: Multi-Vendor RAN & Infrastructure */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Tier 3 • Layer Lapangan</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-300 text-[10px] font-bold">Multi-Vendor</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <span>RAN & Infrastruktur Menara BTS</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Perangkat keras radio dan fasilitas fisik site menara:
              </p>
              <ul className="text-xs space-y-1.5 text-slate-700 dark:text-slate-300 font-medium">
                <li className="flex items-center gap-1.5">• <strong>Ericsson ENM & Huawei MAE</strong> (OSS Radio)</li>
                <li className="flex items-center gap-1.5">• <strong>Submeter IoT Class 0.5s</strong> di Rectifier DC -48V</li>
                <li className="flex items-center gap-1.5">• <strong>Mitratel, Protelindo, STP</strong> (TowerCo Shelters & BESS)</li>
              </ul>
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
            <span className="text-slate-600 dark:text-slate-400">
              Ingin melihat spesifikasi teknis REST API, manifest Kubernetes Sentul-Surabaya, atau UU PDP?
            </span>
            <button
              onClick={() => setActiveTab('architecture')}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <span>Buka Arsitektur & K8s Telkomsel</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. ROLES JOURNEY VIEW */}
      {activeTabSub === 'roles' && (
        <div className="space-y-5 animate-fade-in">
          {/* Role selector pill tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {OPERATIONAL_ROLES.map((role) => {
              const isSelected = selectedRole === role.id;
              const Icon = role.icon;
              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between gap-2 ${
                    isSelected
                      ? 'border-[#ED0226] bg-red-50/50 dark:bg-red-950/20 ring-1 ring-red-500/30'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {role.badge}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{role.title}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{role.persona}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Role Detail Box */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#ED0226]">Alur Kerja Khusus Peran</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{currentRole.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium">
                  <strong>Fokus Utama:</strong> {currentRole.focus}
                </p>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Keberhasilan</span>
                <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 font-mono">{currentRole.metricTarget}</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 block mb-2.5">
                Checklist 5-Menit Rutinitas Harian di ImpactGrid:
              </span>
              <div className="space-y-2">
                {currentRole.dailyRoutine.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-xs">
                    <span className="w-5 h-5 rounded-full bg-red-100 text-[#ED0226] dark:bg-red-950 dark:text-red-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Action Button to relevant module */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <span className="text-[11px] text-slate-500">
                Akses instan ke ruang kerja yang dirancang untuk peran ini.
              </span>
              {currentRole.id === 'vp_network' && (
                <button
                  onClick={() => setActiveTab('financial')}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Buka Model Finansial & OPEX</span>
                </button>
              )}
              {currentRole.id === 'noc_leader' && (
                <button
                  onClick={() => {
                    const el = document.getElementById('noc-fop-operations-center');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#ED0226] hover:bg-red-700 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Buka Runbook SOP 01-04 & Logbook Shift</span>
                </button>
              )}
              {currentRole.id === 'rno_engineer' && (
                <button
                  onClick={() => setActiveTab('scenariolab')}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>Buka Simulator Kebijakan O-RAN</span>
                </button>
              )}
              {currentRole.id === 'fop_technician' && (
                <button
                  onClick={() => {
                    const el = document.getElementById('noc-fop-operations-center');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Buka Tiket Disposisi e-Work Order</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. FLIGHT SIMULATOR DRILL VIEW */}
      {activeTabSub === 'flight_drill' && (
        <div className="space-y-5 animate-fade-in">
          {/* Drill selector tabs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {FLIGHT_DRILLS.map((drill) => {
              const isSelected = selectedDrill === drill.id;
              return (
                <button
                  key={drill.id}
                  onClick={() => {
                    setSelectedDrill(drill.id);
                    setDrillSuccess(false);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition cursor-pointer space-y-1.5 ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 ring-1 ring-amber-500/30'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      Uji Kasus Nyata
                    </span>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{drill.title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {drill.triggerDesc}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Drill Interactive Console */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-white space-y-4 shadow-md font-mono">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block font-sans">
                  Flight Simulator Sandbox • Bukti Keandalan Jaringan
                </span>
                <h3 className="text-sm font-bold text-white font-sans">{currentDrill.title}</h3>
                <span className="text-xs text-slate-400 font-sans block mt-0.5">
                  Target SLA: <strong>{currentDrill.expectedSla}</strong>
                </span>
              </div>

              <button
                onClick={handleRunDrill}
                disabled={isDrillRunning}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-sans text-xs transition cursor-pointer flex items-center space-x-2 shrink-0 disabled:opacity-50"
              >
                {isDrillRunning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Mengeksekusi Otomasi...</span>
                  </>
                ) : (
                  <>
                    <PlayCircle className="w-4 h-4" />
                    <span>Jalankan Simulasi Drill</span>
                  </>
                )}
              </button>
            </div>

            {/* Telemetry Status Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-400 block">Jala-Jala PLN</span>
                <span className="font-bold text-amber-300">{currentDrill.initialState.acGrid}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-400 block">Status BESS LiFePO4</span>
                <span className="font-bold text-emerald-400">{currentDrill.initialState.bessStatus}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-400 block">Genset Cadangan</span>
                <span className="font-bold text-slate-300">{currentDrill.initialState.dieselGenset}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-400 block">Ketersediaan Radio</span>
                <span className="font-bold text-cyan-300">{currentDrill.initialState.radioStatus}</span>
              </div>
            </div>

            {/* Terminal Log Execution Box */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  <span>Log Eksekusi Otomasi Real-Time:</span>
                </span>
                {drillSuccess && (
                  <span className="text-emerald-400 font-bold flex items-center gap-1 font-sans">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>DRILL BERHASIL • SLA TERPENUHI</span>
                  </span>
                )}
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] space-y-1 max-h-36 overflow-y-auto leading-relaxed">
                {currentDrill.runbookLogs.map((log, idx) => (
                  <div key={idx} className="text-slate-300">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. OPERATIONAL FAQ & GUARDRAILS */}
      {activeTabSub === 'faq' && (
        <div className="space-y-3 animate-fade-in">
          {OPERATIONAL_FAQS.map((faq, index) => {
            const isExpanded = expandedFaq === index;
            return (
              <div
                key={index}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 overflow-hidden transition"
              >
                <button
                  onClick={() => setExpandedFaq(isExpanded ? -1 : index)}
                  className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100/60 dark:hover:bg-slate-800/50"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-[#ED0226] shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${isExpanded ? 'rotate-90 text-red-600' : ''}`} />
                </button>

                {isExpanded && (
                  <div className="p-4 pt-0 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/50 dark:border-slate-800/60 mt-1">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
