import React, { useState } from 'react';
import { HelpCircle, ChevronRight, CheckCircle2, ShieldCheck, X, FileText, Sparkles, ArrowRight } from 'lucide-react';

const DEFENSE_QUESTIONS = [
  {
    id: 1,
    category: "CTO / Network Director",
    question: "Bukankah fitur sleep mode ini sudah ada di vendor RAN kami (Ericsson ENM / Huawei iMaster)? Kenapa harus buat ImpactGrid?",
    shortAnswer: "Nilai tambah lintas data masih perlu dibuktikan",
    fullExplanation: "Jangan mengasumsikan fitur existing vendor terisolasi. Audit proses dan sistem Telkomsel terlebih dahulu, lalu tunjukkan gap yang belum terlayani. ImpactGrid adalah usulan decision-support lintas fungsi; kompatibilitas O-RAN, akses meter, dan manfaat tambahannya belum diuji.",
    targetTab: "architecture",
    proofPoint: "Lihat arsitektur usulan dan daftar validasi"
  },
  {
    id: 2,
    category: "CTO / Network Director",
    question: "Bagaimana jika BTS sleep mode saat konser besar, mudik Lebaran, atau gempa bumi? Apakah panggilan darurat 112 aman?",
    shortAnswer: "Belum ada jaminan; wajib desain dan uji keselamatan",
    fullExplanation: "Prototype tidak terhubung ke jaringan dan tidak membuktikan 112, latency, atau QoS. Pilot memerlukan kajian keselamatan bersama tim operasi, batas non-inferiority, mekanisme rollback, uji aman, dan persetujuan pemilik jaringan sebelum perubahan apa pun.",
    targetTab: "optimization",
    proofPoint: "Stress drill di website hanya simulasi visual"
  },
  {
    id: 3,
    category: "CFO / Finance Director",
    question: "Apakah proyek ini akan membebani CapEx Telkomsel di tengah efisiensi anggaran?",
    shortAnswer: "Kelayakan belum dapat dipastikan",
    fullExplanation: "CapEx Rp450 juta dan OpEx Rp60 juta per tahun adalah asumsi proposal. Pada penghematan 8%, NPV indikatif sekitar minus Rp391,5 juta untuk baseline 50 kWh/lokasi/hari dan plus Rp82,3 juta untuk baseline 50 MWh/lokasi/tahun. Audit kontrak, biaya, baseline, dan alokasi manfaat diperlukan; model swadana belum terbukti.",
    targetTab: "financial",
    proofPoint: "Buka sensitivitas finansial dan bandingkan dua baseline"
  },
  {
    id: 4,
    category: "CFO / Finance Director",
    question: "Bagaimana jika hasil uji coba meleset dan efisiensi hanya 5%?",
    shortAnswer: "Baseline dan biaya menentukan hasil",
    fullExplanation: "Dengan baseline rendah 730.000 kWh/tahun untuk 40 lokasi, CapEx Rp450 juta, OpEx Rp60 juta/tahun, dan biaya energi Rp1.500/kWh, NPV ilustratif tetap sensitif terhadap tingkat hemat. Pada asumsi 8%, NPV sekitar minus Rp391,5 juta. Baseline alternatif belum diverifikasi dan memberi hasil berbeda; tidak ada tingkat efisiensi yang telah diuji.",
    targetTab: "scenariolab",
    proofPoint: "Lihat What-if; seluruh input ditandai sebagai asumsi"
  },
  {
    id: 5,
    category: "ESG / Sustainability Director",
    question: "Bagaimana menjamin klaim penurunan emisi ini tidak dituduh Greenwashing oleh OJK dan Bursa Efek?",
    shortAnswer: "Metode diusulkan; belum ada klaim atau assurance",
    fullExplanation: "ITU-T L.1331 dapat dirujuk untuk mengukur efisiensi energi jaringan. Desain pembanding, periode, faktor emisi, perhitungan, dan assurance harus disepakati ESG dan pemilik data. Hash SHA-256 hanya memeriksa perubahan payload, bukan membuktikan kebenaran atau kepatuhan laporan.",
    targetTab: "esg",
    proofPoint: "Buka rancangan ESG dan daftar validasi"
  },
  {
    id: 6,
    category: "CEO / President Director",
    question: "Berapa lama waktu yang dibutuhkan hingga sistem ini benar-benar bisa go-live di lapangan?",
    shortAnswer: "Jadwal bersyarat pada audit, akses, dan persetujuan",
    fullExplanation: "Proposal mengusulkan audit awal dua bulan, lalu keputusan terpisah mengenai pilot. Waktu go-live bergantung pada kelayakan data, integrasi, kontrak, izin aset, pengadaan, dan uji keselamatan; durasi dan ekspansi belum dapat dijanjikan.",
    targetTab: "overview",
    proofPoint: "Buka roadmap bersyarat dan tahap audit"
  },
  {
    id: 7,
    category: "Asset / Towerco Mitra",
    question: "Bagaimana jika menara BTS adalah sewa milik TowerCo (Mitratel/lainnya) dan ada batasan izin shelter AC?",
    shortAnswer: "Izin pemilik aset dan kontrak harus diperiksa",
    fullExplanation: "Kepemilikan dan batas kendali perangkat, shelter, pendingin, serta jaringan akses berbeda menurut lokasi dan kontrak. Setiap lokasi memerlukan pemetaan aset, izin pemilik menara, persetujuan vendor, dan tinjauan hukum sebelum intervensi.",
    targetTab: "architecture",
    proofPoint: "Buka daftar validasi aset dan risiko"
  },
  {
    id: 8,
    category: "AI Governance & Ethics",
    question: "Bagaimana jika rekomendasi AI merugikan masyarakat di area pelosok/3T demi mengejar target efisiensi energi?",
    shortAnswer: "Rancangan human-in-the-loop harus diuji",
    fullExplanation: "Proposal menempatkan persetujuan manusia sebagai prinsip desain. Daftar area yang dikecualikan, perlindungan cakupan, proses eskalasi, dan pemilik persetujuan perlu ditetapkan bersama tim operasi dan ESG; prototype belum mengimplementasikan atau membuktikan aturan tersebut.",
    targetTab: "optimization",
    proofPoint: "Buka rancangan prioritisasi dan batas validasinya"
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
