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
  Sliders
} from 'lucide-react';

export default function ArchitectureTab() {
  const [selectedDiagram, setSelectedDiagram] = useState('arsitektur');
  const [selectedLayer, setSelectedLayer] = useState('ric');

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
      integrationKey: 'Mengirimkan rekomendasi kebijakan (A1-P) ke RAN dalam interval &gt;1 detik tanpa mengganggu real-time scheduling.'
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
      id: 'arsitektur',
      title: 'Gambar 3: Arsitektur Ekosistem 4 Modul ImpactGrid',
      subtitle: 'Integrasi Multi-Vendor RAN, Digital Twin, AI Engine, dan Audit MRV',
      image: '/assets/gambar3_arsitektur.png',
      caption: 'Menunjukkan interaksi antara lapisan fisik BTS (Ericsson, Huawei, ZTE, Nokia + Smart Meter), lapisan orkestrasi data (Kafka + TimescaleDB), lapisan kecerdasan buatan (Scenario Lab + Multi-Objective Optimization), hingga antarmuka pengguna eksekutif.',
      rubricMapping: 'Kriteria Solusi & Kelayakan Teknologi (Bobot 20%)'
    },
    {
      id: 'alur_optimasi',
      title: 'Gambar 4: Alur Pengambilan Keputusan Optimasi AI & Guardrail',
      subtitle: 'Siklus Tertutup (Closed-Loop) Rekomendasi vs Pengamanan SLA',
      image: '/assets/gambar4_alur_optimasi.png',
      caption: 'Menguraikan alur deteksi anomali trafik, kalkulasi Pareto frontier, verifikasi panggilan darurat 112 / VIP, hingga eksekusi autonomous closed-loop dengan mekanisme fail-safe instan.',
      rubricMapping: 'Kriteria Analisis Risiko & Mitigasi Keandalan Jaringan (Bobot 15%)'
    },
    {
      id: 'issue_tree',
      title: 'Gambar 1: Analisis Akar Masalah (Issue Tree)',
      subtitle: 'Pembedahan Paradoks Dekarbonisasi & Lonjakan Emisi Scope 2',
      image: '/assets/gambar1_issue_tree.png',
      caption: 'Memetakan mengapa emisi absolut Telkomsel justru naik 16,79% meskipun efisiensi per TB membaik 10,82%, mengidentifikasi ketiadaan sistem telemetri terpadu dan decision support system.',
      rubricMapping: 'Kriteria Pendahuluan & Identifikasi Masalah Mendalam (Bobot 10%)'
    },
    {
      id: 'roadmap',
      title: 'Gambar 2: Roadmap Implementasi 3 Jangka Waktu (2027–2031)',
      subtitle: 'Jangka Pendek (Pilot 10k BTS), Menengah (50k BTS), hingga Panjang (200k+ BTS)',
      image: '/assets/gambar2_roadmap.png',
      caption: 'Peta jalan eksekusi 5 tahun berbasis mekanisme swadana (Self-Funding Reinvestment Loop), mencakup standardisasi O-RAN, adopsi AI agentik, dan sertifikasi dekarbonisasi nasional.',
      rubricMapping: 'Kriteria Roadmap Implementasi & Keberlanjutan Bisnis (Bobot 20%)'
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

  const current = diagrams.find(d => d.id === selectedDiagram) || diagrams[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-xs font-bold text-red-700">
          <Layers className="w-3.5 h-3.5 text-red-600" />
          <span>Visualisasi Proposal Semifinal TSF 2026</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Diagram Arsitektur & Peta Jalan AWAKENING Reborn
        </h1>
        <p className="text-xs text-slate-600 max-w-3xl font-normal leading-relaxed">
          Visualisasi teknis resmi yang dirancang tim AWAKENING Reborn untuk menjawab masukan dewan juri babak preliminary (memperkuat narasi analitis dengan diagram arsitektur, pohon masalah, dan alur optimasi yang jelas).
        </p>
      </div>

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
              <span className="text-[10px] font-bold text-red-600 block uppercase tracking-wider">
                {d.id.replace('_', ' ')}
              </span>
              <h3 className="text-xs font-bold leading-tight mt-1 truncate text-slate-900">
                {d.title.split(':')[0]}
              </h3>
            </div>
            <span className="text-[10px] text-slate-500 font-medium mt-2 block truncate">
              {d.rubricMapping.split('(')[0]}
            </span>
          </button>
        ))}
      </div>

      {/* Main Selected Diagram Showcase */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 space-y-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold text-red-600 uppercase tracking-wide">
              {current.rubricMapping}
            </span>
            <h2 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">
              {current.title}
            </h2>
            <p className="text-xs text-slate-500">{current.subtitle}</p>
          </div>

          <a 
            href={current.image} 
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
            src={current.image} 
            alt={current.title}
            className="max-h-[500px] w-auto object-contain rounded-xl shadow-md transition hover:scale-[1.01]" 
          />
        </div>

        {/* Caption & Explanation */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start space-x-3 text-xs">
          <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-slate-900">Relevansi dalam Naskah Proposal Semifinal:</span>
            <p className="text-slate-600 leading-relaxed font-normal">
              {current.caption}
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
          Membuktikan bahwa ImpactGrid tidak terkunci pada vendor proprietary (*Vendor Lock-in*), melainkan mengadopsi standar arsitektur terbuka <strong>O-RAN Alliance</strong> dan antarmuka <strong>3GPP Rel-18</strong> yang kompatibel dengan seluruh armada RAN Telkomsel.
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
  );
}
