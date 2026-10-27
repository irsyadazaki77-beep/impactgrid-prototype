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
  { id: 'overview', label: 'Ringkasan', icon: LayoutDashboard },
  { id: 'pilotvalidation', label: 'Validasi Pilot', icon: ShieldCheck },
  { id: 'scenariolab', label: 'Simulasi Skenario', icon: FlaskConical },
  { id: 'financial', label: 'Dampak Finansial', icon: ChartNoAxesCombined },
  { id: 'esg', label: 'Dampak ESG', icon: Leaf },
];

const engineeringItems = [
  { id: 'digitaltwin', label: 'Digital Twin', icon: Zap },
  { id: 'agents', label: 'Orkestrasi Agen', icon: Bot },
  { id: 'telemetry', label: 'Telemetri', icon: Radio },
  { id: 'optimization', label: 'Optimasi', icon: BriefcaseBusiness },
  { id: 'architecture', label: 'Arsitektur', icon: Layers },
];

export default function Sidebar({ activeTab, setActiveTab, viewMode = 'executive' }) {
  const [expanded, setExpanded] = useState({ 'PRESENTASI DIREKSI': true, 'MODUL TEKNIS': true });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  const groups = [{ title: 'PRESENTASI DIREKSI', items: executiveItems }];
  if (viewMode === 'engineering') {
    groups.push({ title: 'MODUL TEKNIS', items: engineeringItems });
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
        {/* Sidebar Header: Mode Label + Collapse Toggle docked side by side */}
        <div className="sidebar-header flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="sidebar-mode flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-[#ED0226] shrink-0 animate-pulse" />
            <span className="sidebar-mode-label text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 truncate">
              {viewMode === 'executive' ? 'Executive Pitch' : 'Deep Engineering'}
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
        <nav aria-label="Navigasi utama" className="sidebar-nav flex-1 space-y-4 overflow-y-auto">
          {groups.map((group) => (
            <section key={group.title} className="sidebar-group">
              <button 
                type="button" 
                className="sidebar-group-title w-full flex items-center justify-between py-1.5 px-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer" 
                aria-expanded={expanded[group.title]} 
                onClick={() => setExpanded(v => ({ ...v, [group.title]: !v[group.title] }))}
              >
                <span className="truncate">{group.title}</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${expanded[group.title] ? '' : '-rotate-90'}`} />
              </button>

              {expanded[group.title] && (
                <div className="sidebar-items mt-1 space-y-1">
                  {group.items.map(({ id, label, icon: Icon }) => {
                    const isActive = activeTab === id;
                    return (
                      <button 
                        type="button" 
                        key={id} 
                        title={desktopCollapsed ? label : undefined} 
                        onClick={() => { 
                          setActiveTab(id); 
                          setMobileOpen(false); 
                        }} 
                        className={`sidebar-item w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition cursor-pointer text-left ${
                          isActive 
                            ? 'bg-red-50 text-[#ED0226] border border-red-200/80 shadow-xs dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50' 
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/60'
                        }`} 
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <Icon size={18} className={`shrink-0 ${isActive ? 'text-[#ED0226] dark:text-red-400' : 'text-slate-400 dark:text-slate-400'}`} />
                        <span className="sidebar-item-label truncate">{label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>
          ))}
        </nav>

        {/* Footer info badge */}
        <div className="sidebar-foot pt-3 mt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
          <p className="font-bold text-slate-700 dark:text-slate-300">ImpactGrid DSS</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">Telkomsel Case • BCC 2026</p>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <button 
          className="sidebar-backdrop fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-xs md:hidden" 
          aria-label="Tutup navigasi" 
          onClick={() => setMobileOpen(false)} 
        />
      )}
    </>
  );
}
