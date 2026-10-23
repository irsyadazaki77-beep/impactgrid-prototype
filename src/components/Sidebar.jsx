import React from 'react';
import { 
  LayoutDashboard, 
  Radio, 
  Cpu, 
  Briefcase, 
  Leaf, 
  TrendingUp, 
  Layers,
  Bot,
  Zap
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    {
      id: 'overview',
      label: 'Executive Summary',
      sublabel: 'Ringkasan & 3 Pilar Utama',
      icon: LayoutDashboard,
    },
    {
      id: 'digitaltwin',
      label: 'Digital Twin BTS 3D',
      sublabel: 'Carrier Sleep & Termodinamika',
      icon: Zap,
    },
    {
      id: 'agents',
      label: 'Autonomous AI Swarm',
      sublabel: '4 Agen Konsensus Non-RT RIC',
      icon: Bot,
    },
    {
      id: 'telemetry',
      label: 'Modul 1: Network Data Hub',
      sublabel: 'Konsolidasi Telemetri Multi-Vendor',
      icon: Radio,
    },
    {
      id: 'scenariolab',
      label: 'Modul 2: Scenario Lab',
      sublabel: 'Simulasi 5%, 10%, 15% (Tabel 6)',
      icon: Cpu,
    },
    {
      id: 'optimization',
      label: 'Modul 3: Investment Prioritizer',
      sublabel: 'Alokasi CapEx & Portofolio Proyek',
      icon: Briefcase,
    },
    {
      id: 'esg',
      label: 'Modul 4: ESG Verification',
      sublabel: 'Metodologi & Verifikasi (Tabel 8)',
      icon: Leaf,
    },
    {
      id: 'financial',
      label: 'Model Finansial 5 Tahun',
      sublabel: 'Mekanisme Swadana (Tabel 7)',
      icon: TrendingUp,
    },
    {
      id: 'architecture',
      label: 'Diagram Resmi Proposal',
      sublabel: 'Arsitektur, Roadmap, & Pohon Masalah',
      icon: Layers,
    }
  ];

  return (
    <aside className="w-full md:w-64 border-r border-slate-200/80 bg-white p-4 flex flex-col justify-between shrink-0 md:sticky md:top-[60px] md:h-[calc(100vh-60px)] md:overflow-y-auto">
      <div className="space-y-4">
        <div className="px-3 pt-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Navigasi Proposal
          </p>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-red-50 text-red-700 font-bold border border-red-200 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent font-medium'
                }`}
              >
                <div className={`p-1.5 rounded-lg shrink-0 ${
                  isActive ? 'bg-[#ED0226] text-white shadow-xs' : 'bg-slate-100 text-slate-500'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="truncate min-w-0">
                  <p className="text-xs truncate">{item.label}</p>
                  <p className="text-[10px] text-slate-400 font-normal truncate">{item.sublabel}</p>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Clean minimal footer note & Presenter Shortcuts */}
      <div className="space-y-2">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Presenter Hotkeys</span>
          <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-slate-600">
            <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200"><strong>1-9</strong> Tab</span>
            <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200"><strong>T</strong> Pitch</span>
            <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200"><strong>S</strong> Drill</span>
            <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200"><strong>P</strong> Memo</span>
            <span className="col-span-2 px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-center">
              <strong>Q</strong> BoD Defense Q&A
            </span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs space-y-0.5">
          <span className="text-[11px] font-bold text-slate-700 block">PT Telekomunikasi Selular</span>
          <p className="text-[10px] text-slate-500 leading-relaxed font-normal">
            BCC TDC Summit Fest 2026 • AWAKENING Reborn
          </p>
        </div>
      </div>
    </aside>
  );
}
