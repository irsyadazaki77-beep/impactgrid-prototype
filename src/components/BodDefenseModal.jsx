import React, { useState } from 'react';
import { HelpCircle, ChevronRight, CheckCircle2, ShieldCheck, X, FileText, Sparkles, ArrowRight } from 'lucide-react';

const DEFENSE_QUESTIONS = [
  {
    id: 1,
    category: "CTO / Network Director",
    question: "Bukankah fitur sleep mode ini sudah ada di vendor RAN kami (Ericsson ENM / Huawei iMaster)? Kenapa harus buat ImpactGrid?",
    shortAnswer: "Siloed Vendor vs Cross-Domain O-RAN Orchestration + Rekonsiliasi PLN",
    fullExplanation: "Fitur vendor bersifat 'pulau terisolasi'. Ericsson hanya mengatur Ericsson, Huawei hanya mengatur Huawei. Masing-masing tidak tahu fluktuasi tarif/faktur PLN dan tidak saling sinkron. ImpactGrid bertindak sebagai Cross-Vendor Service Management and Orchestration (SMO / Non-RT RIC) berbasis O-RAN O1 yang menyatukan seluruh 293.000 BTS dalam satu kebijakan terpusat dan mengawinkannya dengan Smart Meter PLN.",
    targetTab: "architecture",
    proofPoint: "Lihat Arsitektur Sistem & Blueprint O-RAN O1 (Tab 7)"
  },
  {
    id: 2,
    category: "CTO / Network Director",
    question: "Bagaimana jika BTS sleep mode saat konser besar, mudik Lebaran, atau gempa bumi? Apakah panggilan darurat 112 aman?",
    shortAnswer: "120ms Fast-Wakeup + Panggilan 112 Dikunci 100% Non-Sleepable",
    fullExplanation: "ImpactGrid menerapkan Multi-Layer Safety Guardrail. Kanal darurat 112 dan carrier VIP tidak pernah diizinkan tidur. Ketika terjadi anomali beban trafik >15% atau pemicu gempa/bencana, seluruh cell dibangunkan dalam waktu <120 milidetik (Fast-Wakeup O-RAN). Probabilitas drop call dijaga di bawah 0,001% (SLA 99,98%).",
    targetTab: "optimization",
    proofPoint: "Uji langsung tombol 'CTO Stress Drill' (Hotkey S)"
  },
  {
    id: 3,
    category: "CFO / Finance Director",
    question: "Apakah proyek ini akan membebani CapEx Telkomsel di tengah efisiensi anggaran?",
    shortAnswer: "Self-Funding Reinvestment Loop (CapEx Mandiri dari OpEx Savings)",
    fullExplanation: "Fase 1 (Pilot 40 BTS) hanya butuh CapEx Rp450 Juta dan menghasilkan penghematan listrik Rp240 Juta/tahun (Payback 1,9 tahun). 50% dari penghematan ini dialokasikan ke 'Reinvestment Pool' untuk membiayai CapEx Fase 2 (5.000 BTS) dan Fase 3 secara mandiri tanpa suntikan dana kas baru. NPV 5 Tahun mencapai +Rp41,48 Miliar.",
    targetTab: "financial",
    proofPoint: "Buka Model Finansial 5 Tahun (Tab 5) & Geser Tarif PLN"
  },
  {
    id: 4,
    category: "CFO / Finance Director",
    question: "Bagaimana jika hasil uji coba meleset dan efisiensi hanya 5%?",
    shortAnswer: "Transparansi Tabel 6 Proposal: Analisis Sensitivitas Jujur",
    fullExplanation: "Proposal kami secara transparan menyatakan bahwa pada skenario konservatif 5%, NPV bernilai negatif (-Rp109 Jt) dan payback 5 tahun. Namun titik impas kelayakan tercapai di angka efisiensi 6,8%. Dengan intervensi terpadu (suhu shelter AC 26°C + 3GPP micro-sleep), pengujian menghasilkan efisiensi 10%–11,2% (Skenario Dasar), menghasilkan NPV positif +Rp460 Juta.",
    targetTab: "scenariolab",
    proofPoint: "Lihat Skenario Lab (Tab 3) & Tabel 6 Proposal"
  },
  {
    id: 5,
    category: "ESG / Sustainability Director",
    question: "Bagaimana menjamin klaim penurunan emisi ini tidak dituduh Greenwashing oleh OJK dan Bursa Efek?",
    shortAnswer: "Metodologi ITU-T L.1331 + 10 Lokasi Pembanding + SHA-256 Hash",
    fullExplanation: "Kami menggunakan desain kuasi-eksperimen: 40 lokasi intervensi dibandingkan langsung dengan 10 lokasi kontrol berkarakteristik identik. Formula kami memisahkan efek cuaca dan lonjakan trafik data. Setiap log telemetri dan sertifikat MRV disegel dengan enkripsi SHA-256 yang siap diaudit oleh akuntan publik dan memenuhi POJK No. 51/2017 & GRI 302/305.",
    targetTab: "esg",
    proofPoint: "Buka Tab ESG (Tab 6) & Modal Laporan Audit SHA-256"
  },
  {
    id: 6,
    category: "CEO / President Director",
    question: "Berapa lama waktu yang dibutuhkan hingga sistem ini benar-benar bisa go-live di lapangan?",
    shortAnswer: "9 Bulan Uji Coba Pilot (2027) ➡️ Full Rollout 2028-2031",
    fullExplanation: "Karena mengusung arsitektur berbasis software (*Zero Heavy Hardware Replacement*), integrasi tahap awal hanya membutuhkan instalasi O-RAN data pipeline dan koneksi AMR PLN pada 40 lokasi pilot selama kuartal 1–3 2027. Begitu evaluasi 9 bulan membuktikan penghematan Rp240 Juta tercapai, sistem siap direplikasi ke 5.000 BTS Jamali di tahun 2028.",
    targetTab: "overview",
    proofPoint: "Buka Executive Control Tower (Tab 1) & Roadmap 3 Horizon"
  },
  {
    id: 7,
    category: "Asset / Towerco Mitra",
    question: "Bagaimana jika menara BTS adalah sewa milik TowerCo (Mitratel/lainnya) dan ada batasan izin shelter AC?",
    shortAnswer: "Fokus Perangkat Aktif Telkomsel + SLA Suhu Formal Standar ASHRAE TC 9.9",
    fullExplanation: "Intervensi software (3GPP RAN micro-sleep & symbol shutdown) dilakukan langsung pada Baseband Unit dan Radio milik Telkomsel tanpa menyentuh aset fisik menara. Untuk penyesuaian suhu shelter AC 26°C, Telkomsel memanfaatkan posisi sebagai anchor tenant utama untuk meratifikasi adopsi green shelter SLA standar ASHRAE TC 9.9, sehingga tidak melanggar kontrak sewa menara.",
    targetTab: "architecture",
    proofPoint: "Buka Matriks Risiko (Tabel 3) Kategori Kendali Aset Menara"
  },
  {
    id: 8,
    category: "AI Governance & Ethics",
    question: "Bagaimana jika rekomendasi AI merugikan masyarakat di area pelosok/3T demi mengejar target efisiensi energi?",
    shortAnswer: "Human-in-the-Loop DSS + Exclusion Rule Area 3T / USO (SDG 9)",
    fullExplanation: "ImpactGrid adalah Decision Support System (DSS), bukan sistem otonom buta. Setiap rekomendasi alokasi CapEx harus disetujui (sign-off) oleh pimpinan teknik & keuangan. Selain itu, terdapat aturan keras (hard constraint) yang secara permanen mengecualikan seluruh BTS di wilayah 3T/USO berkonektivitas terbatas dari sleep-mode radio, demi menjamin keadilan akses digital dan kepatuhan sosial SDG 9.",
    targetTab: "optimization",
    proofPoint: "Buka Modul 3: Prioritasi Investasi & Filter Area 3T"
  }
];

export default function BodDefenseModal({ isOpen, onClose, onNavigateTab }) {
  const [selectedQuestion, setSelectedQuestion] = useState(DEFENSE_QUESTIONS[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl flex flex-col max-h-[88vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-xs">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-base tracking-tight">BoD Defense Simulator: 8 Pertanyaan Kritis Direksi</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white">
                  Cheat Sheet Sidang BoD
                </span>
              </div>
              <p className="text-xs text-amber-100 mt-0.5">
                Kompilasi jawaban taktis & navigasi bukti langsung di web untuk menghadapi CEO, CTO, CFO & ESG Director.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Split Left (Question List) & Right (Deep Answer & Live Proof) */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
          {/* Left Questions List */}
          <div className="md:col-span-5 border-r border-slate-200 overflow-y-auto p-4 space-y-2 bg-slate-50/50">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block px-2 mb-1">
              Daftar 8 Pertanyaan Mematikan Direksi
            </span>
            {DEFENSE_QUESTIONS.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedQuestion(item)}
                className={`w-full text-left p-3 rounded-2xl border transition cursor-pointer flex flex-col gap-1 ${
                  selectedQuestion.id === item.id
                    ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-amber-300 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    selectedQuestion.id === item.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {item.category}
                  </span>
                  <ChevronRight className={`w-3.5 h-3.5 ${selectedQuestion.id === item.id ? 'text-white' : 'text-slate-400'}`} />
                </div>
                <span className={`text-xs font-bold leading-snug mt-1 ${selectedQuestion.id === item.id ? 'text-white' : 'text-slate-900'}`}>
                  {item.question}
                </span>
              </button>
            ))}
          </div>

          {/* Right Deep Answer Box */}
          <div className="md:col-span-7 p-6 overflow-y-auto space-y-5 bg-white">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>{selectedQuestion.category} Focus</span>
              </div>
              <h3 className="text-base font-black text-slate-900 tracking-tight mt-2 leading-snug">
                "{selectedQuestion.question}"
              </h3>
            </div>

            {/* Quick One-Liner Hook */}
            <div className="p-3.5 rounded-2xl bg-slate-900 text-white space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                Jawaban 1 Kalimat Paling Menusuk (Quick Hook):
              </span>
              <p className="text-xs font-semibold leading-relaxed">
                "{selectedQuestion.shortAnswer}"
              </p>
            </div>

            {/* Detailed Tactical Reasoning */}
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-600 block">
                Argumen Kuantitatif & Landasan Solusi:
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-normal bg-slate-50 p-4 rounded-2xl border border-slate-200/90">
                {selectedQuestion.fullExplanation}
              </p>
            </div>

            {/* Proof Point Navigator */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/90 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider block">
                  Layar Bukti Interaktif di Prototype:
                </span>
                <span className="text-xs font-bold text-emerald-950">
                  {selectedQuestion.proofPoint}
                </span>
              </div>
              <button
                onClick={() => {
                  onNavigateTab(selectedQuestion.targetTab);
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
