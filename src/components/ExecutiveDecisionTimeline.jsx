import React, { useState } from 'react';
import { 
  Database, 
  Cpu, 
  Briefcase, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Zap, 
  Sparkles,
  Info,
  Clock,
  FileCheck
} from 'lucide-react';

/**
 * ExecutiveDecisionTimeline:
 * Visual interactive step-by-step pipeline mapping how ImpactGrid transforms
 * raw RAN telemetries into verified executive board decisions:
 * Step 1: Telemetry Data Ingestion & Sanitization
 * Step 2: Physics-informed What-If Simulation
 * Step 3: Multi-Objective Knapsack Optimization
 * Step 4: Difference-in-Differences (DiD) & Cryptographic Validation
 * Step 5: Executive Board Decision & Automated Netconf Provisioning
 */
export default function ExecutiveDecisionTimeline({ onNavigateTab }) {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 'step-1',
      title: '1. Ingest Data Telemetri',
      sub: 'Konsolidasi Multi-Vendor',
      icon: Database,
      tab: 'telemetry',
      badge: 'OSS / AMR Real-Time',
      description: 'Mengumpulkan 120+ metrik real-time dari 4 vendor RAN (Ericsson, Huawei, ZTE, Nokia) dan smart meter PLN melalui Network Data Hub secara vendor-agnostic.',
      metrics: [
        { label: 'Latency Data', val: '< 5 detik' },
        { label: 'Reconciled AMR', val: '100% PLN Match' },
        { label: 'Sample Rates', val: '15-Menit Interval' }
      ]
    },
    {
      id: 'step-2',
      title: '2. Simulasi What-If',
      sub: 'Digital Twin & Beban Dinamis',
      icon: Cpu,
      tab: 'scenariolab',
      badge: 'Non-RT RIC Engine',
      description: 'Model fisika termodinamika shelter dan profil trafik deret waktu menguji skenario 5%, 10%, dan 15% efisiensi di bawah berbagai variasi cuaca dan beban listrik WBP.',
      metrics: [
        { label: 'Skenario Diuji', val: '3 Skenario + 5 Anomali' },
        { label: 'Model Akurasi', val: 'MAPE < 3.2%' },
        { label: 'Safety Threshold', val: '120ms Max Wake-up' }
      ]
    },
    {
      id: 'step-3',
      title: '3. Optimasi Portofolio',
      sub: 'Multi-Objective Knapsack DSS',
      icon: Briefcase,
      tab: 'optimization',
      badge: 'Alokasi CapEx Presisi',
      description: 'Algoritma Knapsack mengalokasikan anggaran CapEx Rp 450 Juta secara optimal ke 40 site kandidat, memaksimalkan penghematan kWh & NPV dengan constraint SLA > 99,95%.',
      metrics: [
        { label: 'CapEx Terserap', val: 'Rp 450 Juta (100%)' },
        { label: 'PBP Proyek', val: '1,78 Tahun' },
        { label: 'Intervensi', val: 'Combined Sleep + Solar' }
      ]
    },
    {
      id: 'step-4',
      title: '4. Validasi Empiris & Hash',
      sub: 'Metodologi DiD & SHA-256',
      icon: ShieldCheck,
      tab: 'pilotvalidation',
      badge: 'ITU-T L.1331 Kepatuhan',
      description: 'Evaluasi Difference-in-Differences membandingkan 40 site intervensi terhadap 10 site kontrol untuk mengisolasi efek eksternal, dikunci oleh GreenLedger SHA-256 anti-tamper.',
      metrics: [
        { label: 'Estimator DiD', val: '-10,4% (p < 0.001)' },
        { label: 'Audit Trail', val: 'SHA-256 Locked' },
        { label: 'Data Integrity', val: '98,4% Valid' }
      ]
    },
    {
      id: 'step-5',
      title: '5. Keputusan BoD & Action',
      sub: 'Mekanisme Swadana 5 Tahun',
      icon: FileCheck,
      tab: 'financial',
      badge: 'Executive Authorization',
      description: 'Dewan Direksi menerbitkan otorisasi digital. Penghematan OpEx langsung mendanai roll-out tahap berikutnya secara mandiri (self-funding mechanism) dengan marjin EBITDA +0,38%.',
      metrics: [
        { label: '5-Yr NPV', val: 'Rp 41,48 Miliar' },
        { label: 'IRR', val: '54,2%' },
        { label: 'Pemerataan', val: '10.000+ BTS Nasional' }
      ]
    }
  ];

  const current = steps[activeStep];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-red-50 text-[#ED0226]">
              <Layers className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
              Executive Decision Pipeline: Data → Simulasi → Optimasi → Validasi → Rekomendasi
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 font-normal">
            Alur transparansi tata kelola keputusan investasi efisiensi energi RAN Telkomsel end-to-end
          </p>
        </div>
        <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 self-start sm:self-auto">
          Closed-Loop Governance
        </span>
      </div>

      {/* Interactive Step Navigator */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {steps.map((st, idx) => {
          const Icon = st.icon;
          const isSelected = activeStep === idx;
          const isPassed = activeStep > idx;

          return (
            <button
              key={st.id}
              onClick={() => setActiveStep(idx)}
              className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                isSelected 
                  ? 'bg-red-50/80 border-[#ED0226] text-slate-900 shadow-xs' 
                  : isPassed
                    ? 'bg-slate-50 border-slate-200 text-slate-700'
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-1.5 rounded-lg ${
                  isSelected 
                    ? 'bg-[#ED0226] text-white' 
                    : isPassed 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-slate-100 text-slate-500'
                }`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className={`text-[10px] font-extrabold ${
                  isSelected ? 'text-[#ED0226]' : isPassed ? 'text-emerald-700' : 'text-slate-400'
                }`}>
                  {isPassed ? '✓' : `0${idx + 1}`}
                </span>
              </div>
              <div>
                <p className="text-xs font-bold leading-tight line-clamp-1">{st.title.replace(/^\d+\.\s*/, '')}</p>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">{st.sub}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Step Deep Dive Banner */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xs text-slate-900">{current.title}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-[#ED0226]">
              {current.badge}
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            {current.description}
          </p>

          <div className="flex flex-wrap gap-4 pt-1 text-[11px]">
            {current.metrics.map((m, i) => (
              <span key={i} className="text-slate-500">
                {m.label}: <strong className="text-slate-900 font-bold">{m.val}</strong>
              </span>
            ))}
          </div>
        </div>

        {onNavigateTab && (
          <button
            onClick={() => onNavigateTab(current.tab)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 shadow-2xs"
          >
            <span>Buka Modul</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
