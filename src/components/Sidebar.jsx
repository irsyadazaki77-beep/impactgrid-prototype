import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Zap, 
  Bot, 
  Radio, 
  FlaskConical, 
  BriefcaseBusiness, 
  Leaf, 
  ChartNoAxesCombined, 
  Layers, 
  ChevronDown, 
  Menu, 
  X, 
  PanelLeftClose, 
  PanelLeftOpen 
} from 'lucide-react';

const executiveItems = [
  { id: 'overview', label: 'Ringkasan', icon: LayoutDashboard, keyHint: '1' },
  { id: 'pilotvalidation', label: 'Validasi Pilot', icon: ShieldCheck, keyHint: '2' },
  { id: 'scenariolab', label: 'Simulasi Skenario', icon: FlaskConical, keyHint: '6' },
  { id: 'financial', label: 'Dampak Finansial', icon: ChartNoAxesCombined, keyHint: '9' },
  { id: 'esg', label: 'Dampak ESG', icon: Leaf, keyHint: '8' },
];

const engineeringItems = [
  { id: 'digitaltwin', label: 'Digital Twin', icon: Zap, keyHint: '3' },
  { id: 'agents', label: 'Orkestrasi Agen', icon: Bot, keyHint: '4' },
  { id: 'telemetry', label: 'Telemetri', icon: Radio, keyHint: '5' },
  { id: 'optimization', label: 'Optimasi', icon: BriefcaseBusiness, keyHint: '7' },
  { id: 'architecture', label: 'Arsitektur', icon: Layers, keyHint: '0' },
];

export default function Sidebar({ activeTab, setActiveTab, viewMode = 'executive' }) {
  const [expanded, setExpanded] = useState({ 'Menu Operasi': true, 'Teknis & O-RAN': true });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  const groups = [{ title: 'Menu Operasi', items: executiveItems }];
  if (viewMode === 'engineering') {
    groups.push({ title: 'Teknis & O-RAN', items: engineeringItems });
  }

  return (
    <>
      {/* Mobile Nav Trigger */}
      <button 
        className="mobile-nav-toggle" 
        aria-label={mobileOpen ? 'Tutup navigasi' : 'Buka navigasi'} 
        onClick={() => setMobileOpen(v => !v)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        <span>Menu</span>
      </button>

      {/* Main Sidebar */}
      <aside className={`impact-sidebar ${mobileOpen ? 'mobile-open' : ''} ${desktopCollapsed ? 'desktop-collapsed' : ''}`}>
        {/* Sidebar Header: Mode Label + Collapse Toggle */}
        <div className="sidebar-header flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80 dark:border-slate-800">
          <div className="sidebar-mode flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-[#ED0226] shrink-0 animate-pulse" />
            <span className="sidebar-mode-label text-[11px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 truncate">
              {viewMode === 'executive' ? 'Executive Mode' : 'NOC Engineering'}
            </span>
          </div>
          <button 
            type="button"
            className="sidebar-collapse-toggle inline-flex items-center justify-center p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer" 
            aria-label={desktopCollapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'} 
            title={desktopCollapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'} 
            onClick={() => setDesktopCollapsed(v => !v)}
          >
            {desktopCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
            <span className="sr-only">{desktopCollapsed ? 'Perluas' : 'Ciutkan'}</span>
          </button>
        </div>

        {/* Navigation Groups */}
        <nav aria-label="Navigasi utama" className="sidebar-nav flex-1 space-y-4 overflow-y-auto pr-0.5">
          {groups.map((group) => (
            <section key={group.title} className="sidebar-group">
              <button 
                type="button" 
                className="sidebar-group-title w-full flex items-center justify-between py-1.5 px-2 text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition cursor-pointer" 
                aria-expanded={expanded[group.title]} 
                onClick={() => setExpanded(v => ({ ...v, [group.title]: !v[group.title] }))}
              >
                <span className="truncate">{group.title}</span>
                <ChevronDown size={13} className={`transition-transform duration-200 ${expanded[group.title] ? '' : '-rotate-90'}`} />
              </button>

              {expanded[group.title] && (
                <div className="sidebar-items mt-1.5 space-y-1">
                  {group.items.map(({ id, label, icon: Icon, keyHint }) => {
                    const isActive = activeTab === id;
                    return (
                      <button 
                        type="button" 
                        key={id} 
                        title={desktopCollapsed ? `${label} (Shortcut: ${keyHint})` : undefined} 
                        onClick={() => { 
                          setActiveTab(id); 
                          setMobileOpen(false); 
                        }} 
                        className={`sidebar-item relative w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
                          isActive 
                            ? 'bg-gradient-to-r from-red-500/12 to-red-500/5 text-[#ED0226] border border-red-500/25 shadow-2xs dark:from-red-950/50 dark:to-red-950/20 dark:text-red-400 dark:border-red-800/60' 
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/50 border border-transparent'
                        }`} 
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon size={17} className={`shrink-0 transition-transform ${isActive ? 'text-[#ED0226] dark:text-red-400 scale-105' : 'text-slate-400 dark:text-slate-500'}`} />
                          <span className="sidebar-item-label truncate">{label}</span>
                        </div>
                        {!desktopCollapsed && keyHint && (
                          <span aria-hidden="true" className={`sidebar-item-label font-mono text-[10px] px-1.5 py-0.5 rounded border shrink-0 ${
                            isActive
                              ? 'bg-[#ED0226] text-white border-[#ED0226]'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200/80 dark:border-slate-700'
                          }`}>
                            {keyHint}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </section>
          ))}
        </nav>

        {/* Footer info badge (Telkomsel SNOC Identity Card) */}
        <div className="sidebar-foot pt-3 mt-3 border-t border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#ED0226] dark:text-red-400">
                SNOC • JAMALI
              </span>
              <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Tier-III DC
              </span>
            </div>
            <p className="font-black text-xs text-slate-900 dark:text-slate-100 leading-tight">
              ImpactGrid Enterprise DSS
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
              Telkomsel RAN Energy Operations
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <button 
          className="sidebar-backdrop fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-xs md:hidden" 
          aria-label="Tutup navigasi" 
          onClick={() => setMobileOpen(false)} 
        />
      )}
    </>
  );
}
