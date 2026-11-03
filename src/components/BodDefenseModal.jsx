import React, { useState } from 'react';
import { HelpCircle, ChevronRight, CheckCircle2, ShieldCheck, X, FileText, Sparkles, ArrowRight, Download } from 'lucide-react';

const DEFENSE_QUESTIONS = [
  {
    id: 1,
    category: "CTO / Network Director",
    question: "Bukankah fitur sleep mode ini sudah ada di vendor RAN kami (Ericsson ENM / Huawei iMaster)? Kenapa harus buat ImpactGrid?",
    shortAnswer: "Solusi Vendor Bersifat Silo, ImpactGrid Mengorkestrasi Lintas-Domain",
    fullExplanation: "Fitur sleep mode bawaan vendor (Huawei iMaster / Ericsson ENM / ZTE NetNumen) hanya mengoptimalkan radio secara terisolasi tanpa integrasi data submetering listrik PLN, kondisi mikroklimat HVAC shelter, profil tarif WBP/LWBP, maupun klausul pass-through TowerCo. ImpactGrid bertindak sebagai Non-RT RIC (RAN Intelligent Controller) berbasis O-RAN O1 yang mengorkestrasi multi-vendor secara terpadu demi efisiensi biaya menyeluruh.",
    targetTab: "architecture",
    proofPoint: "Lihat Arsitektur Multi-Tier O-RAN O1 & TMF API"
  },
  {
    id: 2,
    category: "CTO / Network Director",
    question: "Bagaimana jika BTS sleep mode saat konser besar, mudik Lebaran, atau gempa bumi? Apakah panggilan darurat 112 aman?",
    shortAnswer: "Fail-Safe 28ms Hardware Interlock & Prioritas Mutlak 112",
    fullExplanation: "Sistem mengadopsi standar 3GPP Rel 17 dengan interlock perangkat keras. Jika utilisasi PRB melonjak > 65% atau terdeteksi panggilan darurat 112, seluruh sub-carrier sleep dibangunkan dalam waktu < 28 ms tanpa pemutusan sesi aktif. Pada area publik berkepadatan tinggi dan rumah sakit, status situs otomatis di-lock pada mode zero-sleep.",
    targetTab: "optimization",
    proofPoint: "Uji Rollback 28ms & Protokol Keselamatan 112"
  },
  {
    id: 3,
    category: "CFO / Finance Director",
    question: "Apakah proyek ini akan membebani CapEx Telkomsel di tengah efisiensi anggaran?",
    shortAnswer: "Model Swadana Bertahap & Plafon Belanja Berpagar Gerbang G0",
    fullExplanation: "Turn-key CapEx Rp450 juta dan OpEx Rp60 juta/tahun untuk pilot 40 site dialokasikan bertahap melalui tata kelola Stage-Gate (G0 plafon Rp95 jt). Pada penghematan 8% - 18.8%, payback tercapai dalam 0.6 s/d 1.8 tahun, dan penghematan langsung membiayai ekspansi regional secara swadana.",
    targetTab: "financial",
    proofPoint: "Buka Model Finansial 4-Horizon & Swadana"
  },
  {
    id: 4,
    category: "CFO / Finance Director",
    question: "Bagaimana jika hasil uji coba meleset dan efisiensi hanya 5%?",
    shortAnswer: "Stop-Loss Mandat Dewan & Perlindungan Arus Kas di Gerbang G1",
    fullExplanation: "Jika efisiensi di bawah batas toleransi minimum 6.5% pada evaluasi 90 hari Gerbang G1, protokol stop-loss otomatis membekukan belanja lanjutan tanpa sanksi denda. Model finansial juga menguji sensitivitas konservatif (8%) hingga moderat (14.8%) dengan NPV tetap terjaga positif pada skala regional.",
    targetTab: "scenariolab",
    proofPoint: "Lihat Analisis Sensitivitas & Stop-Loss G1"
  },
  {
    id: 5,
    category: "ESG / Sustainability Director",
    question: "Bagaimana menjamin klaim penurunan emisi ini tidak dituduh Greenwashing oleh OJK dan Bursa Efek?",
    shortAnswer: "Metodologi Causal DiD TWFE & Ledger Kriptografis SHA-256 Anti-Greenwashing",
    fullExplanation: "Perhitungan emisi Scope 2 menggunakan faktor emisi resmi ESDM Jamali (0.87 kgCO2e/kWh) dan metodologi Difference-in-Differences (DiD) Two-Way Fixed Effects yang mengisolasi efek eksternal cuaca dan trafik (p < 0.01). Setiap kilowatt-hour yang dihemat dicatat dalam ledger blockchain-style SHA-256 yang siap diaudit oleh PwC, KPMG, maupun Bursa Efek Indonesia.",
    targetTab: "esg",
    proofPoint: "Buka Verifikasi Integritas SHA-256 & Sertifikat Audit"
  },
  {
    id: 6,
    category: "CEO / President Director",
    question: "Berapa lama waktu yang dibutuhkan hingga sistem ini benar-benar bisa go-live di lapangan?",
    shortAnswer: "Roadmap 3 Horizon: Pilot 9 Bulan Menuju Net-Zero 2030",
    fullExplanation: "Horizon 1 Pilot (40 site intervensi + 10 kontrol) berjalan selama 9 bulan untuk validasi lapangan. Horizon 2 Scale-Out (5.000 site di koridor Jamali) ditargetkan dalam 24 bulan, dan Horizon 3 Nasional (10.000 site) menuju target Net-Zero Telkomsel 2030.",
    targetTab: "overview",
    proofPoint: "Buka Roadmap Eksekutif 3 Horizon"
  },
  {
    id: 7,
    category: "Asset / Towerco Mitra",
    question: "Bagaimana jika menara BTS adalah sewa milik TowerCo (Mitratel/lainnya) dan ada batasan izin shelter AC?",
    shortAnswer: "Skema Insentif 85/15 Pass-Through Kontrak Sewa Mitratel/Protelindo",
    fullExplanation: "Dalam kontrak sewa menara pass-through listrik PLN, penurunan kWh langsung memangkas tagihan bulanan Telkomsel. Melalui skema pembagian manfaat (shared savings) 85% untuk Telkomsel dan 15% untuk TowerCo, kedua pihak mendapatkan insentif finansial langsung tanpa sengketa komersial.",
    targetTab: "architecture",
    proofPoint: "Buka Rincian Skema Pass-Through TowerCo"
  },
  {
    id: 8,
    category: "AI Governance & Ethics",
    question: "Bagaimana jika rekomendasi AI merugikan masyarakat di area pelosok/3T demi mengejar target efisiensi energi?",
    shortAnswer: "Human-In-The-Loop & Social Protection Exclusion Zone",
    fullExplanation: "Algoritma 0-1 Knapsack memberlakukan hard constraint x_i,j = 0 untuk menara di zona fasilitas darurat, sekolah binaan Telkomsel Jaga Cita, dan sentra UMKM. Operator NOC dan Radio Optimization tetap memegang kendali manual tertinggi untuk menolak atau mengubah rekomendasi AI setiap saat.",
    targetTab: "optimization",
    proofPoint: "Buka Peta Zona Proteksi Sosial & Audit RBAC"
  }
];

export default function BodDefenseModal({
  isOpen,
  onClose,
  onNavigateTab,
  simState,
  selectedScale = 'pilot',
  operationalSummary,
  resolvedSites = [],
  onOpenOfficialBaRe
}) {
  const [selectedQuestion, setSelectedQuestion] = useState(DEFENSE_QUESTIONS[0]);
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = [
    { key: 'all', label: 'Semua' },
    { key: 'CTO / Network Director', label: 'CTO (Network)' },
    { key: 'CFO / Finance Director', label: 'CFO (Finance)' },
    { key: 'ESG / Sustainability Director', label: 'ESG / Legal' },
    { key: 'CEO / President Director', label: 'CEO' },
    { key: 'Asset / Towerco Mitra', label: 'TowerCo' }
  ];

  const filteredQuestions = filterCategory === 'all' 
    ? DEFENSE_QUESTIONS 
    : DEFENSE_QUESTIONS.filter(q => q.category === filterCategory);

  if (!isOpen) return null;

  const siteCount = operationalSummary?.siteCount ?? 50;
  const savedMwh = operationalSummary?.annualizedSavedMwh ?? 200;
  const simHour = typeof simState?.simHour === 'number' ? simState.simHour : 14;

  const handleExportDefenseCsv = () => {
    const rows = [
      ['ID', 'Persona Direksi', 'Pertanyaan Kritis', 'Jawaban Inti (Quick Hook)', 'Argumen Kuantitatif & Solusi', 'Modul Bukti'],
      ...DEFENSE_QUESTIONS.map((q) => [
        q.id,
        q.category,
        q.question,
        q.shortAnswer,
        q.fullExplanation,
        `${q.proofPoint} (${q.targetTab})`
      ])
    ];
    const csvContent = rows.map((r) => r.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ImpactGrid_BoD_Defense_QA_Telkomsel_${selectedScale}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0B1324] rounded-2xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[88vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-xs">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-base tracking-tight">BoD Defense Simulator: 8 Pertanyaan Kritis Direksi</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white">
                  Panduan Eksekutif Dewan Direksi
                </span>
              </div>
              <p className="text-xs text-amber-100 mt-0.5">
                Kompilasi jawaban taktis &amp; navigasi bukti langsung untuk menghadapi CEO, CTO, CFO &amp; ESG Director.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportDefenseCsv}
              className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition cursor-pointer inline-flex items-center gap-1.5 border border-white/25"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Q&amp;A Direksi (CSV)</span>
            </button>
            <button 
              onClick={onClose}
              aria-label="Tutup BoD Defense"
              className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Synchronized Operational Proof Strip */}
        <div className="px-6 py-2.5 bg-slate-900 text-slate-200 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] shrink-0">
          <div className="flex flex-wrap items-center gap-3">
            <span>Skala Aktif: <strong className="text-amber-400 uppercase">{selectedScale} ({siteCount} Site)</strong></span>
            <span>•</span>
            <span>Jam Simulasi: <strong className="text-emerald-400">{String(simHour).padStart(2, '0')}:00 WIB</strong></span>
            <span>•</span>
            <span>Hemat Tahunan: <strong className="text-white">{savedMwh} MWh/Thn</strong></span>
            <span>•</span>
            <span>Kalibrasi FOP: <strong className="text-emerald-400">{resolvedSites.length} Site Klop</strong></span>
          </div>
          {onOpenOfficialBaRe && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenOfficialBaRe();
              }}
              className="text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
            >
              Buka Berita Acara (BA-RE)
            </button>
          )}
        </div>

        {/* Content Body: Split Left (Question List) & Right (Deep Answer & Live Proof) */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
          {/* Left Questions List */}
          <div className="md:col-span-5 border-r border-slate-200 dark:border-slate-800 overflow-y-auto p-4 space-y-2 bg-slate-50/50 dark:bg-slate-950/40">
            <div className="space-y-1.5 mb-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block px-1">
                Filter Persona Dewan Direksi &amp; Stakeholder:
              </span>
              <div className="flex flex-wrap gap-1">
                {categories.map(cat => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setFilterCategory(cat.key)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                      filterCategory === cat.key
                        ? 'bg-amber-500 text-white shadow-2xs'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
            {filteredQuestions.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedQuestion(item)}
                className={`w-full text-left p-3 rounded-2xl border transition cursor-pointer flex flex-col gap-1 ${
                  selectedQuestion.id === item.id
                    ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                    : 'bg-white dark:bg-[#0B1324] border-slate-200 dark:border-slate-800 hover:border-amber-400 text-slate-700 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    selectedQuestion.id === item.id ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {item.category}
                  </span>
                  <ChevronRight className={`w-3.5 h-3.5 ${selectedQuestion.id === item.id ? 'text-white' : 'text-slate-400'}`} />
                </div>
                <span className={`text-xs font-bold leading-snug mt-1 ${selectedQuestion.id === item.id ? 'text-white' : 'text-slate-900 dark:text-slate-100'}`}>
                  {item.question}
                </span>
              </button>
            ))}
          </div>

          {/* Right Deep Answer Box */}
          <div className="md:col-span-7 p-6 overflow-y-auto space-y-5 bg-white dark:bg-[#0B1324]">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>{selectedQuestion.category} Focus</span>
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight mt-2 leading-snug">
                &ldquo;{selectedQuestion.question}&rdquo;
              </h3>
            </div>

            {/* Quick One-Liner Hook */}
            <div className="p-3.5 rounded-2xl bg-slate-900 text-white space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                Jawaban Inti Eksekutif (Executive Hook):
              </span>
              <p className="text-xs font-semibold leading-relaxed">
                &ldquo;{selectedQuestion.shortAnswer}&rdquo;
              </p>
            </div>

            {/* Detailed Tactical Reasoning */}
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block">
                Argumen Kuantitatif &amp; Landasan Solusi:
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-normal bg-slate-50 dark:bg-slate-900/70 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800">
                {selectedQuestion.fullExplanation}
              </p>
            </div>

            {/* Proof Point Navigator */}
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/90 dark:border-emerald-800 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase text-emerald-800 dark:text-emerald-300 tracking-wider block">
                  Modul Bukti Operasional Langsung:
                </span>
                <span className="text-xs font-bold text-emerald-950 dark:text-emerald-100">
                  {selectedQuestion.proofPoint}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onNavigateTab?.(selectedQuestion.targetTab);
                  onClose();
                }}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center space-x-1.5 shrink-0 cursor-pointer shadow-xs"
              >
                <span>Buka Layar Bukti</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

