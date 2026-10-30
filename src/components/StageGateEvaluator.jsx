import React, { useState, useMemo } from 'react';
import { Award, CheckCircle2, XCircle, AlertTriangle, ArrowRight, ShieldCheck, HelpCircle, RotateCcw, Scale } from 'lucide-react';
import { STAGE_GATE_DECISION_FRAMEWORK } from '../data/mockData';

export default function StageGateEvaluator() {
  const [activeGateIndex, setActiveGateIndex] = useState(0);

  // Status kriteria untuk masing-masing gerbang: Map of criterion id -> boolean (true: pass, false: fail)
  const [criteriaStatus, setCriteriaStatus] = useState(() => {
    const initial = {};
    STAGE_GATE_DECISION_FRAMEWORK.forEach(gate => {
      gate.criteria.forEach(crit => {
        initial[crit.id] = crit.passDefault ?? true;
      });
    });
    return initial;
  });

  const toggleCriterion = (id) => {
    setCriteriaStatus(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const resetAllPass = () => {
    const next = {};
    STAGE_GATE_DECISION_FRAMEWORK.forEach(gate => {
      gate.criteria.forEach(crit => {
        next[crit.id] = true;
      });
    });
    setCriteriaStatus(next);
  };

  const triggerG0InternalExists = () => {
    resetAllPass();
    setCriteriaStatus(prev => ({
      ...prev,
      g0_c1: false // Kapabilitas sudah ada di internal Telkomsel
    }));
    setActiveGateIndex(0);
  };

  const triggerG2QosDrop = () => {
    resetAllPass();
    setCriteriaStatus(prev => ({
      ...prev,
      g2_c2: false // Terjadi isu availability atau komplain 112
    }));
    setActiveGateIndex(2);
  };

  const currentGate = STAGE_GATE_DECISION_FRAMEWORK[activeGateIndex];

  // Hitung status kelulusan tiap gerbang
  const gateStatusSummary = useMemo(() => {
    return STAGE_GATE_DECISION_FRAMEWORK.map(gate => {
      const allPass = gate.criteria.every(c => criteriaStatus[c.id] === true);
      const passedCount = gate.criteria.filter(c => criteriaStatus[c.id] === true).length;
      return {
        gateId: gate.gateId,
        allPass,
        passedCount,
        totalCount: gate.criteria.length
      };
    });
  }, [criteriaStatus]);

  const currentGateAllPass = gateStatusSummary[activeGateIndex].allPass;

  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-5 sm:p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <Award className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wide">
              STANDAR TATA KELOLA TSEL • STAGE-GATE GOVERNANCE FRAMEWORK
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 mt-1 tracking-tight">
            Simulator Gerbang Kelanjutan (Stage-Gate Decision Logic G0 – G3)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Membuktikan tata kelola investasi defensif: setiap tahap memiliki gerbang evaluasi Go / No-Go nyata untuk melindungi modal Telkomsel.
          </p>
        </div>

        {/* Quick Simulation Presets */}
        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          <button
            onClick={resetAllPass}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer flex items-center gap-1"
            title="Kembalikan semua kriteria lulus"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Preset Ideal</span>
          </button>
          <button
            onClick={triggerG0InternalExists}
            className="px-2.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-800 dark:text-amber-300 text-xs font-bold transition cursor-pointer border border-amber-200 dark:border-amber-800"
            title="Uji jika audit menemukan kapabilitas internal Telkomsel sudah mencukupi"
          >
            <span>Simulasi G0 Pivot (Hemat Rp450 Jt)</span>
          </button>
          <button
            onClick={triggerG2QosDrop}
            className="px-2.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-800 dark:text-rose-300 text-xs font-bold transition cursor-pointer border border-rose-200 dark:border-rose-800"
            title="Uji jika terjadi degradasi QoS pada pilot"
          >
            <span>Simulasi G2 Rollback (Proteksi 112)</span>
          </button>
        </div>
      </div>

      {/* Gate Tabs Selector (G0 - G3) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {STAGE_GATE_DECISION_FRAMEWORK.map((gate, idx) => {
          const summary = gateStatusSummary[idx];
          const isSelected = activeGateIndex === idx;
          return (
            <button
              key={gate.gateId}
              onClick={() => setActiveGateIndex(idx)}
              className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between space-y-1.5 ${
                isSelected
                  ? 'border-[#ED0226] bg-red-50/40 dark:bg-red-950/20 ring-1 ring-[#ED0226]/30 shadow-2xs'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black text-slate-800 dark:text-slate-200">
                  {gate.gateId}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                  summary.allPass
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                }`}>
                  {summary.allPass ? 'GO (Lulus)' : 'NO-GO / PIVOT'}
                </span>
              </div>
              <div className="text-xs font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
                {gate.title.split(':')[1]?.trim() || gate.title}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                {gate.timing}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Gate Detail Card */}
      <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-700/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700/80 pb-3">
          <div>
            <span className="text-[10px] font-mono font-bold text-red-600 dark:text-red-400 uppercase">
              {currentGate.timing} • Pemilik Keputusan: {currentGate.stageOwner}
            </span>
            <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100">
              {currentGate.title}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 italic">
              Pertanyaan Inti: &ldquo;{currentGate.question}&rdquo;
            </p>
          </div>

          <div className="shrink-0">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black ${
              currentGateAllPass
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-rose-600 text-white shadow-xs animate-pulse'
            }`}>
              {currentGateAllPass ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
              <span>{currentGateAllPass ? 'STATUS: GO (LANJUTKAN)' : 'STATUS: NO-GO / PIVOT'}</span>
            </span>
          </div>
        </div>

        {/* Criteria Checklist (Interactive Toggles) */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
            Kriteria Kelulusan Gerbang (Klik untuk mensimulasikan hasil audit):
          </span>
          <div className="space-y-2">
            {currentGate.criteria.map((crit) => {
              const isPassed = criteriaStatus[crit.id] === true;
              return (
                <div
                  key={crit.id}
                  onClick={() => toggleCriterion(crit.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition select-none ${
                    isPassed
                      ? 'bg-white dark:bg-[#0B1324] border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                      : 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60 hover:border-rose-400'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <button
                      type="button"
                      aria-label={isPassed ? "Kriteria terpenuhi" : "Kriteria tidak terpenuhi"}
                      className={`mt-0.5 w-4 h-4 rounded-md flex items-center justify-center shrink-0 transition ${
                        isPassed ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    </button>
                    <div>
                      <div className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                        {crit.label}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Target/Ambang: <strong className="text-slate-700 dark:text-slate-300">{crit.target}</strong>
                      </div>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 ${
                    isPassed 
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                  }`}>
                    {isPassed ? 'Terpenuhi (Pass)' : 'Gagal (Fail)'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Action & Consequence Box */}
        <div className={`p-4 rounded-xl border space-y-1.5 transition ${
          currentGateAllPass
            ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-100'
            : 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/80 text-rose-950 dark:text-rose-100'
        }`}>
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider">
            {currentGateAllPass ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
            <span>Tindakan Resmi Sesuai Tata Kelola Investasi Modal Telkomsel:</span>
          </div>
          <p className="text-xs leading-relaxed font-semibold">
            {currentGateAllPass ? currentGate.passAction : currentGate.failAction}
          </p>
          <div className="pt-2 border-t border-current/10 text-[10px] opacity-80">
            <strong>Prinsip Tata Kelola:</strong> {currentGate.governancePrinciple}
          </div>
        </div>
      </div>
    </section>
  );
}
