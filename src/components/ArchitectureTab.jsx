import React, { useState } from 'react';
import { 
  Layers, 
  ZoomIn, 
  FileText, 
  GitBranch, 
  Milestone, 
  Cpu, 
  Sparkles,
  ExternalLink,
  Info,
  Server,
  Network,
  Radio,
  Lock,
  CheckCircle2,
  Sliders,
  ShieldAlert,
  ShieldCheck,
  HelpCircle,
  Users,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Check,
  Scale
} from 'lucide-react';
import { 
  CASE_STUDY_RESPONSES,
  STAKEHOLDER_VALUE_MAPPING,
  RISK_ASSESSMENT_MATRIX,
  SOLUTION_COMPARISON_MATRIX 
} from '../data/mockData';

export default function ArchitectureTab() {
  const [activeSubView, setActiveSubView] = useState('diagrams'); // 'diagrams' | 'case_study' | 'stakeholders' | 'risks' | 'comparison'
  const [selectedDiagram, setSelectedDiagram] = useState('issue_tree');
  const [selectedLayer, setSelectedLayer] = useState('ric');
  const [selectedStakeholder, setSelectedStakeholder] = useState('all');

  const oranLayers = [
    {
      id: 'physical',
      name: '1. Physical RAN Layer (BTS Hardware)',
      protocol: 'CPRI / eCPRI, Bias Control DC',
      standard: '3GPP Rel-17/18 TS 38.104',
      description: 'Menara BTS makro, Baseband Unit (BBU), Remote Radio Unit (RRU), dan Power Amplifier (PA) multi-vendor (Ericsson, Huawei, ZTE, Nokia) serta shelter pendingin AC.',
      integrationKey: 'Mendukung dynamic symbol shutdown, shallow sleep, dan deep sleep tanpa pemutusan sirkuit kasar.'
    },
    {
      id: 'o1',
      name: '2. O1 & Netconf/YANG Interface Layer',
      protocol: 'Netconf over SSH, YANG Models',
      standard: 'O-RAN.WG10.O1-Interface.0-v08.00',
      description: 'Protokol manajemen & telemetri standar O-RAN yang menjembatani OSS Telkomsel dengan sistem manajemen elemen (EMS/NMS) multi-vendor tanpa melanggar garansi pabrikan.',
      integrationKey: 'Menarik telemetri kinerja energi (3GPP TS 28.552) dan memvalidasi health status tiap 15 menit.'
    },
    {
      id: 'datahub',
      name: '3. Data Orchestration & Smart Meter Gateway',
      protocol: 'Apache Kafka, DLMS/COSEM, TimescaleDB',
      standard: 'IEC 62056 (DLMS/COSEM Smart Meter)',
      description: 'Pipeline data real-time berlatensi rendah yang mengumpulkan ribuan stream konsumsi daya smart meter AMR/AMI PLN dan parameter beban payload (TB) harian.',
      integrationKey: '100% rekonsiliasi data konsumsi listrik aktual terhadap faktur tagihan listrik PLN.'
    },
    {
      id: 'ric',
      name: '4. Non-RT RIC & AI Energy Optimization rApp',
      protocol: 'O-RAN A1 Interface, REST/JSON, Policy API',
      standard: 'O-RAN.WG2.Non-RT-RIC-ARCH-v03.00',
      description: 'Inti kecerdasan buatan ImpactGrid yang menjalankan model prediksi trafik, optimasi kurva Pareto (efisiensi vs latensi), dan pengaturan setpoint thermostat shelter AC dinamis.',
      integrationKey: 'Mengirimkan rekomendasi kebijakan (A1-P) ke RAN dalam interval >1 detik tanpa mengganggu real-time scheduling.'
    },
    {
      id: 'guardrail',
      name: '5. Multi-Layer SLA & Emergency Guardrail',
      protocol: 'Fast-Interrupt Watchdog, 112 Priority Hook',
      standard: 'ITU-T E.106 (Emergency Telecom Services)',
      description: 'Lapisan pengaman independen yang memantau lonjakan trafik lokal. Jika gradien trafik melonjak tajam atau ada panggilan 112, seluruh sleep mode di-bypass instan.',
      integrationKey: 'Wake-up latency 120 ms dengan garansi zero drop call dan zero penalty SLA.'
    }
  ];

  const diagrams = [
    {
      id: 'issue_tree',
      title: 'Gambar 1: Analisis Akar Masalah (Issue Tree)',
      subtitle: 'Pembedahan Paradoks Dekarbonisasi: 1,885 Miliar kWh & 1,722 Juta ton CO2e',
      image: '/assets/gambar1_issue_tree.png',
      caption: 'Memetakan akar masalah mengapa emisi Scope 2 Telkomsel mencapai 63,6% (Laporan Keberlanjutan Telkom 2025): Ketiadaan Decision Support System terintegrasi multi-vendor, data silo antara Keuangan & NOC, serta ketiadaan verifikasi kausal DiD.',
      rubricMapping: 'Kriteria Pendahuluan & Identifikasi Masalah Mendalam (Bobot 10%)'
    },
    {
      id: 'roadmap',
      title: 'Gambar 2: Roadmap Implementasi 3 Jangka Waktu (2027–2031)',
      subtitle: 'Tahap 1 Uji Coba (40 Sites), Tahap 2 Regional (5k Sites), Tahap 3 Nasional (10k+ Sites)',
      image: '/assets/gambar2_roadmap.png',
      caption: 'Peta jalan eksekusi 5 tahun berbasis mekanisme swadana (Self-Funding Reinvestment Loop), mencakup standardisasi O-RAN, adopsi AI agentik, dan sertifikasi dekarbonisasi nasional.',
      rubricMapping: 'Kriteria Roadmap Implementasi & Keberlanjutan Bisnis (Bobot 20%)'
    },
    {
      id: 'arsitektur',
      title: 'Gambar 3: Arsitektur Ekosistem 4 Modul ImpactGrid',
      subtitle: 'Integrasi Multi-Vendor RAN, Digital Twin, AI Engine, dan Audit MRV',
      image: '/assets/gambar3_arsitektur.png',
      caption: 'Menunjukkan interaksi antara lapisan fisik BTS (Ericsson, Huawei, ZTE, Nokia + Smart Meter PLN), lapisan orkestrasi data (Kafka + TimescaleDB), lapisan kecerdasan buatan (Scenario Lab + Knapsack Optimization), hingga antarmuka pengguna eksekutif.',
      rubricMapping: 'Kriteria Solusi & Kelayakan Teknologi (Bobot 20%)'
    },
    {
      id: 'alur_optimasi',
      title: 'Gambar 4: Alur Pengambilan Keputusan Optimasi AI & Guardrail',
      subtitle: 'Siklus Tertutup (Closed-Loop) Rekomendasi vs Pengamanan SLA',
      image: '/assets/gambar4_alur_optimasi.png',
      caption: 'Menguraikan alur deteksi anomali trafik, kalkulasi Pareto frontier, verifikasi panggilan darurat 112 / VIP, hingga eksekusi autonomous closed-loop dengan mekanisme fail-safe instan (<120ms).',
      rubricMapping: 'Kriteria Analisis Risiko & Mitigasi Keandalan Jaringan (Bobot 15%)'
    },
    {
      id: 'logo_resmi',
      title: 'Identitas Visual: Logo Resmi Telkomsel ImpactGrid',
      subtitle: 'AI-Powered Sustainable Network Intelligence (Sphere Connectivity & Green Leaf)',
      image: '/assets/logo_utama_impactgrid.png',
      caption: 'Filosofi Logo: Jaringan bola nodus melambangkan konektivitas BTS nasional yang saling terhubung dan dioptimasi oleh AI, sedangkan siluet daun merah merepresentasikan komitmen dekarbonisasi hijau (Green Telco) yang selaras dengan warna korporat Telkomsel.',
      rubricMapping: 'Identitas Produk & Branding Korporat Telkomsel'
    }
  ];

  const currentDiagram = diagrams.find(d => d.id === selectedDiagram) || diagrams[0];

  const filteredStakeholders = selectedStakeholder === 'all' 
    ? STAKEHOLDER_VALUE_MAPPING 
    : STAKEHOLDER_VALUE_MAPPING.filter(s => s.id === selectedStakeholder);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* 1. Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-xs font-bold text-red-700">
            <Layers className="w-3.5 h-3.5 text-red-600" />
            <span>Dokumentasi Strategis Resmi • Tim AWAKENING Reborn</span>
          </div>
          <span className="text-[11px] font-semibold text-slate-500">
            Kasus Bisnis: PT Telekomunikasi Selular (TDC Summit Fest 2026)
          </span>
        </div>

        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Blueprint Strategis, Diagram Solusi & Matriks Tata Kelola
        </h1>
        <p className="text-xs text-slate-600 max-w-4xl font-normal leading-relaxed">
          Pusat integrasi dokumen dan pembuktian konsep resmi proposal semifinal: mencakup 4 diagram arsitektur utama, jawaban lengkap atas seluruh pertanyaan studi kasus Telkomsel (Tabel 1), pemetaan nilai tambah multi-stakeholder (Tabel 2), mitigasi 6 risiko utama (Tabel 3), dan matriks komparasi terhadap solusi eksisting (Tabel 9).
        </p>

        {/* Sub-View Navigation Bar */}
        <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
          <button
            onClick={() => setActiveSubView('diagrams')}
            className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeSubView === 'diagrams'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Diagram & Roadmap (4 Gambar)</span>
          </button>

          <button
            onClick={() => setActiveSubView('case_study')}
            className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeSubView === 'case_study'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
            <span>Respon Studi Kasus (Tabel 1)</span>
          </button>

          <button
            onClick={() => setActiveSubView('stakeholders')}
            className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeSubView === 'stakeholders'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-blue-500" />
            <span>Nilai Multi-Stakeholder (Tabel 2)</span>
          </button>

          <button
            onClick={() => setActiveSubView('risks')}
            className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeSubView === 'risks'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
            <span>Matriks Mitigasi Risiko (Tabel 3)</span>
          </button>

          <button
            onClick={() => setActiveSubView('comparison')}
            className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeSubView === 'comparison'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-emerald-500" />
            <span>Komparasi vs Eksisting (Tabel 9)</span>
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: DIAGRAM RESMI & PETA JALAN */}
      {activeSubView === 'diagrams' && (
        <div className="space-y-6">
          {/* Diagram Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {diagrams.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDiagram(d.id)}
                className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between shadow-xs ${
                  selectedDiagram === d.id
                    ? 'bg-red-50 border-red-300 text-slate-900 ring-2 ring-red-100'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div>
                  <span className="text-[10px] font-bold text-red-600 uppercase block mb-1">
                    {d.id === 'issue_tree' ? 'Gambar 1' : 
                     d.id === 'roadmap' ? 'Gambar 2' : 
                     d.id === 'arsitektur' ? 'Gambar 3' : 
                     d.id === 'alur_optimasi' ? 'Gambar 4' : 'Logo'}
                  </span>
                  <span className="text-xs font-extrabold text-slate-900 line-clamp-2">
                    {d.title.split(': ')[1] || d.title}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-2 block">
                  Klik untuk Menampilkan
                </span>
              </button>
            ))}
          </div>

          {/* Main Selected Diagram Showcase */}
          <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 space-y-5 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-red-600 uppercase tracking-wide">
                  {currentDiagram.rubricMapping}
                </span>
                <h2 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">
                  {currentDiagram.title}
                </h2>
                <p className="text-xs text-slate-500">{currentDiagram.subtitle}</p>
              </div>

              <a 
                href={currentDiagram.image} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold shrink-0 cursor-pointer transition shadow-xs"
              >
                <ZoomIn className="w-3.5 h-3.5 text-slate-600" />
                <span>Buka Gambar Ukuran Penuh</span>
              </a>
            </div>

            {/* Display Image Container */}
            <div className="flex items-center justify-center p-6 rounded-2xl bg-slate-50 border border-slate-200/80 overflow-hidden min-h-[380px]">
              <img 
                src={currentDiagram.image} 
                alt={currentDiagram.title}
                className="max-h-[500px] w-auto object-contain rounded-xl shadow-md transition hover:scale-[1.01]" 
              />
            </div>

            {/* Caption & Explanation */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start space-x-3 text-xs">
              <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-slate-900">Relevansi dalam Naskah Proposal Semifinal:</span>
                <p className="text-slate-600 leading-relaxed font-normal">
                  {currentDiagram.caption}
                </p>
              </div>
            </div>
          </div>

          {/* O-RAN Interactive Protocol Inspector for CTO & Technical Judges */}
          <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 space-y-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Network className="w-4 h-4 text-cyan-600" />
                <h3 className="text-sm font-extrabold text-slate-900">
                  O-RAN Technical Protocol Inspector (Spesifikasi Antarmuka Terbuka Multi-Vendor)
                </h3>
              </div>
              <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200">
                Khusus Sesi Uji Teknis CTO
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Membuktikan bahwa ImpactGrid tidak terkunci pada vendor proprietary (*Vendor Lock-in*), melainkan mengadopsi standar arsitektur terbuka <strong>O-RAN Alliance</strong> dan antarmuka <strong>3GPP Rel-18</strong> yang kompatibel dengan seluruh armada RAN Telkomsel (Ericsson, Huawei, ZTE, Nokia).
            </p>

            {/* Layer Selector Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
              {oranLayers.map((layer) => {
                const isSelected = selectedLayer === layer.id;
                return (
                  <button
                    key={layer.id}
                    onClick={() => setSelectedLayer(layer.id)}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-cyan-50/80 border-cyan-400 ring-2 ring-cyan-100 shadow-xs' 
                        : 'bg-slate-50 border-slate-200/90 hover:bg-slate-100/80 text-slate-700'
                    }`}
                  >
                    <span className={`text-[11px] font-bold block ${isSelected ? 'text-cyan-900' : 'text-slate-800'}`}>
                      {layer.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono mt-0.5 block truncate">
                      {layer.standard}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Layer Deep Dive Card */}
            {(() => {
              const activeOran = oranLayers.find(l => l.id === selectedLayer) || oranLayers[0];
              return (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 text-white space-y-3.5 shadow-md border border-slate-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                        Lapisan Arsitektur Terpilih
                      </span>
                      <h4 className="text-base font-extrabold text-white">{activeOran.name}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-mono border border-slate-700">
                        Protokol: {activeOran.protocol}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase">Fungsi & Perangkat Terhubung:</span>
                      <p className="text-slate-300 leading-relaxed font-normal">{activeOran.description}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-cyan-300 uppercase">Kunci Integrasi Tanpa Risiko Garansi:</span>
                      <p className="text-cyan-100 leading-relaxed font-normal">{activeOran.integrationKey}</p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: RESPON STUDI KASUS (TABEL 1) */}
      {activeSubView === 'case_study' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-red-600 uppercase tracking-wide">Tabel 1 Proposal Semifinal</span>
              <h2 className="text-base font-extrabold text-slate-900">
                Matriks Respon Lengkap Key Question & Sub-Questions Case Study Telkomsel
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Membuktikan keselarasan 100% antara fitur ImpactGrid dengan persoalan resmi yang diujikan oleh dewan juri.
              </p>
            </div>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
              <HelpCircle className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-3">
            {CASE_STUDY_RESPONSES.map((item) => (
              <div 
                key={item.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    item.color === 'red' ? 'bg-red-50 text-red-700 border-red-200' :
                    item.color === 'blue' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    item.color === 'purple' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                    item.color === 'emerald' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {item.badge}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">ID: {item.id}</span>
                </div>

                <div className="text-xs font-bold text-slate-900 leading-snug">
                  {item.question}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-500" />
                      Fokus Tantangan Telkomsel:
                    </span>
                    <p className="text-slate-700 leading-relaxed font-normal">
                      {item.challenge}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Strategi & Jawaban Solusi ImpactGrid:
                    </span>
                    <p className="text-slate-800 leading-relaxed font-medium">
                      {item.solution}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: PEMETAAN NILAI TAMBAH MULTI-STAKEHOLDER (TABEL 2) */}
      {activeSubView === 'stakeholders' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-red-600 uppercase tracking-wide">Tabel 2 Proposal Semifinal</span>
              <h2 className="text-base font-extrabold text-slate-900">
                Pemetaan Nilai Tambah Solusi bagi Multi-Stakeholder Telkomsel
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Memastikan bahwa setiap pihak berkepentingan memperoleh nilai tambah terukur tanpa ada yang dirugikan.
              </p>
            </div>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
              <Users className="w-5 h-5" />
            </div>
          </div>

          {/* Stakeholder Filters */}
          <div className="flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
            <button
              onClick={() => setSelectedStakeholder('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer shrink-0 ${
                selectedStakeholder === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Semua Stakeholder (4)
            </button>
            {STAKEHOLDER_VALUE_MAPPING.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedStakeholder(s.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer shrink-0 ${
                  selectedStakeholder === s.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {s.stakeholder.split(' (')[0]}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStakeholders.map((s) => (
              <div 
                key={s.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {s.roleBadge}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Pilar Stakeholder</span>
                  </div>

                  <h3 className="text-sm font-black text-slate-900 mb-1">
                    {s.stakeholder}
                  </h3>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 mb-3 text-xs">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Fokus Kepentingan Utama:</span>
                    <p className="text-slate-700 font-medium mt-0.5">{s.focus}</p>
                  </div>

                  <div className="space-y-1 text-xs">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" />
                      Manfaat & Nilai Tambah Terukur:
                    </span>
                    <p className="text-slate-800 leading-relaxed font-normal bg-emerald-50/40 p-3 rounded-xl border border-emerald-100">
                      {s.valueAdded}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: MATRIKS PENILAIAN & MITIGASI RISIKO (TABEL 3) */}
      {activeSubView === 'risks' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-red-600 uppercase tracking-wide">Tabel 3 Proposal Semifinal</span>
              <h2 className="text-base font-extrabold text-slate-900">
                Matriks Penilaian dan Mitigasi Risiko (Risk Assessment Matrix)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pengendalian komprehensif atas 6 risiko operasional, teknis, vendor, aset menara, dan audit ESG.
              </p>
            </div>
            <div className="p-2 rounded-xl bg-red-50 text-red-700 border border-red-200">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {RISK_ASSESSMENT_MATRIX.map((risk) => (
              <div 
                key={risk.no}
                className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                    <span className="text-[10px] font-bold text-slate-400">Risiko #{risk.no}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      risk.level === 'Tinggi' 
                        ? 'bg-red-50 text-red-700 border-red-200' 
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      Tingkat: {risk.level}
                    </span>
                  </div>

                  <h3 className="text-xs font-black text-slate-900 mb-1">
                    {risk.category}
                  </h3>

                  <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
                    {risk.description}
                  </p>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/90 text-[11px] space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Strategi Mitigasi Terukur:
                    </span>
                    <p className="text-slate-800 leading-relaxed font-medium">
                      {risk.mitigation}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                  <span>PIC: <strong className="text-slate-700">{risk.owner}</strong></span>
                  <span className="font-semibold text-emerald-600">{risk.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 5: KOMPARASI PENDEKATAN EKSISTING (TABEL 9) */}
      {activeSubView === 'comparison' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-red-600 uppercase tracking-wide">Tabel 9 Proposal Semifinal</span>
              <h2 className="text-base font-extrabold text-slate-900">
                Matriks Komparasi: Status Quo vs Solusi Vendor vs IoT Envion vs ImpactGrid
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Menunjukkan diferensiasi fundamental mengapa ImpactGrid memberi nilai tambah yang tidak dimiliki solusi eksisting.
              </p>
            </div>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Scale className="w-5 h-5" />
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5 w-1/5">Dimensi Evaluasi</th>
                  <th className="p-3.5 w-1/5 text-slate-300">Pendekatan Konvensional</th>
                  <th className="p-3.5 w-1/5 text-slate-300">Solusi Bawaan Vendor RAN</th>
                  <th className="p-3.5 w-1/5 text-slate-300">IoT Envion Eksisting</th>
                  <th className="p-3.5 w-1/5 bg-red-600 text-white font-black">Nilai Tambah ImpactGrid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {SOLUTION_COMPARISON_MATRIX.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition">
                    <td className="p-3.5 font-bold text-slate-900 bg-slate-50/50">
                      {row.dimension}
                    </td>
                    <td className="p-3.5 text-slate-600 text-[11px] leading-relaxed">
                      {row.statusQuo}
                    </td>
                    <td className="p-3.5 text-slate-600 text-[11px] leading-relaxed">
                      {row.vendorRan}
                    </td>
                    <td className="p-3.5 text-slate-600 text-[11px] leading-relaxed">
                      {row.iotEnvion}
                    </td>
                    <td className="p-3.5 text-slate-900 bg-red-50/40 font-semibold text-[11px] leading-relaxed border-l border-red-200">
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                        <span>{row.impactGrid}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
