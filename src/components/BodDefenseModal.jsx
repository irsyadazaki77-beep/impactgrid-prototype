import React, { useState } from 'react';
import { 
  ShieldAlert, 
  X, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight, 
  Compass, 
  Sparkles, 
  UserCheck,
  ChevronRight,
  Search,
  Filter
} from 'lucide-react';
import { BOD_DEFENSE_QUESTIONS } from '../data/bodQuestions';

export default function BodDefenseModal({ isOpen, onClose, onNavigateTab }) {
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [activeQuestionId, setActiveQuestionId] = useState(BOD_DEFENSE_QUESTIONS[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredQuestions = BOD_DEFENSE_QUESTIONS.filter(q => {
    const matchesRole = selectedRole === 'ALL' || q.role.toLowerCase().includes(selectedRole.toLowerCase());
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          q.shortAnswer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const activeQuestion = BOD_DEFENSE_QUESTIONS.find(q => q.id === activeQuestionId) || BOD_DEFENSE_QUESTIONS[0];

  const handleNavigateToProof = (tabName) => {
    if (onNavigateTab) {
      onNavigateTab(tabName);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-fade-in text-slate-900">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
              <ShieldAlert className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold tracking-tight">
                  BoD Defense Simulator & Contekan Tanya-Jawab Juri
                </h2>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-red-600 text-white">
                  Shortcut 'Q'
                </span>
              </div>
              <p className="text-xs text-slate-400">
                8 Pertanyaan Mematikan Direksi Telkomsel & Panduan Navigasi Layar Pembuktian
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

        {/* Filter Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center space-x-1.5 overflow-x-auto">
            <span className="text-slate-500 font-semibold text-[11px] mr-1 hidden sm:inline">Kategori Direksi:</span>
            {['ALL', 'Network', 'Keuangan', 'ESG', 'Utama'].map((roleKey) => (
              <button
                key={roleKey}
                onClick={() => setSelectedRole(roleKey)}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                  selectedRole === roleKey 
                    ? 'bg-red-600 text-white shadow-xs' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {roleKey === 'ALL' ? 'Semua Pertanyaan (8)' : roleKey}
              </button>
            ))}
          </div>

          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Cari kata kunci..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>
        </div>

        {/* Content Split Pane (Left: Question List, Right: Tactical Answer & Proof Navigator) */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          
          {/* Left Column: Question Picker */}
          <div className="md:col-span-5 p-3 space-y-2 overflow-y-auto max-h-[60vh] md:max-h-none">
            {filteredQuestions.map((item) => {
              const isSelected = item.id === activeQuestion.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveQuestionId(item.id)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-2 ${
                    isSelected 
                      ? 'bg-red-50/80 border-red-300 ring-2 ring-red-100 shadow-xs' 
                      : 'bg-white border-slate-200/80 hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        {item.role.split('/')[0]}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold truncate">
                        {item.category}
                      </span>
                    </div>
                    <p className={`text-xs font-bold leading-snug line-clamp-2 ${isSelected ? 'text-red-900' : 'text-slate-800'}`}>
                      {item.question}
                    </p>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 mt-1 transition ${isSelected ? 'text-red-600 translate-x-0.5' : 'text-slate-400'}`} />
                </button>
              );
            })}
          </div>

          {/* Right Column: Deep-Dive Tactical Answer & Screen Proof Navigator */}
          <div className="md:col-span-7 p-6 space-y-5 overflow-y-auto">
            {activeQuestion ? (
              <>
                {/* Header Question */}
                <div className="space-y-2 border-b border-slate-100 pb-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                      Target Penanya: {activeQuestion.role}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 font-semibold">
                      Kategori: {activeQuestion.category}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                    "{activeQuestion.question}"
                  </h3>
                </div>

                {/* 1-Sentence Killer Answer */}
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Jawaban Buka (Elevator One-Liner):</span>
                  </span>
                  <p className="text-slate-900 font-bold leading-relaxed text-xs">
                    "{activeQuestion.shortAnswer}"
                  </p>
                </div>

                {/* 3 Tactical Supporting Arguments */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                    Poin Penguat Data & Literatur (Bantahan Taktis):
                  </span>
                  <div className="space-y-2 text-xs">
                    {activeQuestion.tacticalPoints.map((point, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/90 flex items-start space-x-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-slate-700 leading-relaxed text-[11px] font-medium">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 1-Click Screen Navigator to Proof */}
                <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block">
                      Arahkan Layar ke Bukti Nyata:
                    </span>
                    <span className="text-xs font-bold text-white block">
                      Tab: {activeQuestion.targetTab.toUpperCase()} ({activeQuestion.targetSection})
                    </span>
                  </div>

                  <button
                    onClick={() => handleNavigateToProof(activeQuestion.targetTab)}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs shadow-md transition cursor-pointer shrink-0"
                  >
                    <span>Buka Layar Bukti</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </>
            ) : null}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between shrink-0">
          <span>*Gunakan fitur ini untuk berlatih bersama tim agar kompak saat menjawab pertanyaan direksi.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold cursor-pointer transition"
          >
            Tutup (Esc)
          </button>
        </div>

      </div>
    </div>
  );
}
