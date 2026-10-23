import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Radio, 
  Cpu, 
  Briefcase, 
  Leaf, 
  TrendingUp, 
  Layers,
  Bot,
  Zap,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Lock,
  Flame,
  Award
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  viewMode = 'executive' // 'executive' | 'engineering'
}) {
  // Collapsible state for the 3 structured sections
  const [openSections, setOpenSections] = useState({
    executive: true,
    operations: true,
    systemLab: false // collapsed by default in executive pitch mode
  });

  const toggleSection = (sectionKey) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  // Structured tab groups based on Architectural Specification
  const navSections = [
    {
      id: 'executive',
      title: 'EXECUTIVE & IMPACT',
      subtitle: 'Primary Focus Juri & Direksi',
      color: 'text-rose-400',
      tabs: [
        {
          id: 'overview',
          label: 'Executive Summary',
          sublabel: 'Ringkasan & 3 Pilar Utama',
          icon: LayoutDashboard,
          badge: '⭐ Pitch Core',
          badgeColor: 'bg-rose-500/10 text-rose-300 border-rose-500/20'
        },
        {
          id: 'financial',
          label: 'Financial Model',
          sublabel: 'Mekanisme Swadana 5 Tahun',
          icon: TrendingUp,
          badge: '⭐ Pitch Core',
          badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
        },
        {
          id: 'esg',
          label: 'ESG Compliance',
          sublabel: 'Verifikasi Scope 2 & Audit Merkle',
          icon: Leaf,
          badge: 'Audit Ready',
          badgeColor: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
        },
        {
          id: 'pilotvalidation',
          label: 'Pilot Validation Center',
          sublabel: 'Evaluasi DiD 40 Sites & Decision Gate',
          icon: ShieldCheck,
          engineeringOnly: true
        }
      ]
    },
    {
      id: 'operations',
      title: 'OPERATIONS & DIGITAL TWIN',
      subtitle: 'Demo Teknis & Real-Time Cyber-Physical',
      color: 'text-cyan-400',
      tabs: [
        {
          id: 'digitaltwin',
          label: 'Digital Twin & GIS Map',
          sublabel: 'Termodinamika BTS & Carrier Sleep',
          icon: Zap,
          badge: 'Demo 3D',
          badgeColor: 'bg-amber-500/10 text-amber-300 border-amber-500/20'
        },
        {
          id: 'optimization',
          label: 'Optimization Engine',
          sublabel: 'Netconf Dispatch & Alokasi CapEx',
          icon: Briefcase
        },
        {
          id: 'telemetry',
          label: 'Telemetry & Sensors',
          sublabel: 'Multi-Vendor Radio Hub & Ingestion',
          icon: Radio
        }
      ]
    },
    {
      id: 'systemLab',
      title: 'SYSTEM LAB & ARCHITECTURE',
      subtitle: 'Deep Dive saat Sesi Q&A Juri',
      color: 'text-indigo-400',
      tabs: [
        {
          id: 'agents',
          label: 'Agent Orchestrator',
          sublabel: '4 Agen Swarm Non-RT RIC Consensus',
          icon: Bot,
          badge: 'O-RAN',
          badgeColor: 'bg-purple-500/10 text-purple-300 border-purple-500/20'
        },
        {
          id: 'scenariolab',
          label: 'Scenario Lab',
          sublabel: 'Simulasi Monte Carlo 5%, 10%, 15%',
          icon: Cpu
        },
        {
          id: 'architecture',
          label: 'Architecture & Diagrams',
          sublabel: 'Pohon Masalah, Roadmap & Risk Matrix',
          icon: Layers
        }
      ]
    }
  ];

  return (
    <aside className="w-full md:w-72 border-r border-slate-800 bg-slate-950 p-3.5 flex flex-col justify-between shrink-0 md:sticky md:top-[60px] md:h-[calc(100vh-60px)] md:overflow-y-auto select-none">
      <div className="space-y-4">
        {/* Pitch Mode Indicator in Sidebar */}
        <div className="px-2 pt-1 flex items-center justify-between">
          <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
            {viewMode === 'executive' ? 'EXECUTIVE NAVIGATION' : 'FULL ENGINEERING TREE'}
          </span>
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
            viewMode === 'executive'
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
          }`}>
            {viewMode === 'executive' ? 'PITCH MODE' : 'DEEP MODE'}
          </span>
        </div>

        {/* Categorized Tab Sections */}
        <div className="space-y-3">
          {navSections.map((section) => {
            const isOpen = openSections[section.id] || viewMode === 'engineering';
            // Filter engineering-only tabs if in executive mode
            const visibleTabs = section.tabs.filter(t => !t.engineeringOnly || viewMode === 'engineering');

            return (
              <div key={section.id} className="rounded-xl bg-slate-900/60 border border-slate-800/80 overflow-hidden">
                {/* Collapsible Section Header */}
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-3 py-2 flex items-center justify-between text-left hover:bg-slate-800/50 transition cursor-pointer"
                >
                  <div>
                    <p className={`text-[11px] font-black tracking-wider uppercase ${section.color}`}>
                      {section.title}
                    </p>
                    <p className="text-[9px] text-slate-400 leading-tight">
                      {section.subtitle}
                    </p>
                  </div>
                  <div className="text-slate-400 p-0.5">
                    {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </div>
                </button>

                {/* Section Items */}
                {isOpen && (
                  <div className="p-1 space-y-0.5 border-t border-slate-800/60">
                    {visibleTabs.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveTab(item.id)}
                          className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-all cursor-pointer ${
                            isActive 
                              ? 'bg-gradient-to-r from-red-950/80 to-slate-900 text-white font-bold border border-red-500/40 shadow-xs' 
                              : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent font-medium'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5 truncate min-w-0">
                            <div className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                              isActive 
                                ? 'bg-[#ED0226] text-white shadow-xs ring-2 ring-red-400/20' 
                                : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                            }`}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="truncate min-w-0 text-left">
                              <p className="text-xs truncate">{item.label}</p>
                              <p className="text-[10px] text-slate-400 font-normal truncate">{item.sublabel}</p>
                            </div>
                          </div>

                          {/* Badge tag */}
                          {item.badge && (
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border shrink-0 ml-1.5 ${item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Clean Dark Footer Note & Presenter Shortcuts */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Presenter Keys</span>
            <span className="text-[9px] font-mono text-emerald-400">Ready</span>
          </div>
          <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-slate-400">
            <span className="px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700 text-slate-300"><strong>1-9</strong> Tab</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700 text-slate-300"><strong>W</strong> Walk</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700 text-slate-300"><strong>S</strong> Stress</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700 text-slate-300"><strong>E</strong> Sim</span>
            <button 
              onClick={() => setActiveTab('overview')} 
              className="col-span-2 px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 text-center hover:bg-amber-500/20 transition cursor-pointer"
            >
              <strong>Q</strong> BoD Defense Cheat Sheet
            </button>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 text-xs">
          <span className="text-[11px] font-bold text-slate-200 block">PT Telekomunikasi Selular</span>
          <p className="text-[10px] text-slate-400 font-normal leading-tight">
            Telkomsel ImpactGrid • BCC TDC 2026
          </p>
        </div>
      </div>
    </aside>
  );
}
