import React, { useState } from 'react';
import { LayoutDashboard, ShieldCheck, Zap, Bot, Radio, FlaskConical, BriefcaseBusiness, Leaf, ChartNoAxesCombined, Layers, ChevronDown, Menu, X, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

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
  if (viewMode === 'engineering') groups.push({ title: 'MODUL TEKNIS', items: engineeringItems });
  const nav = <>
    <div className="sidebar-mode"><span className="sidebar-mode-label">{viewMode === 'executive' ? 'Executive Pitch' : 'Deep Engineering'}</span><span className="sidebar-mode-dot" /></div>
    <nav aria-label="Navigasi utama" className="sidebar-nav">
      {groups.map(group => <section key={group.title} className="sidebar-group">
        <button type="button" className="sidebar-group-title" aria-expanded={expanded[group.title]} onClick={() => setExpanded(v => ({ ...v, [group.title]: !v[group.title] }))}>
          <span>{group.title}</span><ChevronDown size={16} className={expanded[group.title] ? '' : 'is-collapsed'} />
        </button>
        {expanded[group.title] && <div className="sidebar-items">{group.items.map(({ id, label, icon: Icon }) => <button type="button" key={id} title={desktopCollapsed ? label : undefined} onClick={() => { setActiveTab(id); setMobileOpen(false); }} className={`sidebar-item ${activeTab === id ? 'is-active' : ''}`} aria-current={activeTab === id ? 'page' : undefined}>
          <Icon size={18} strokeWidth={1.8} /><span className="sidebar-item-label">{label}</span>
        </button>)}</div>}
      </section>)}
    </nav>
    <div className="sidebar-foot"><strong>Telkomsel ImpactGrid</strong><span>BCC TDC 2026</span></div>
  </>;
  return <>
    <button className="mobile-nav-toggle" aria-label={mobileOpen ? 'Tutup navigasi' : 'Buka navigasi'} onClick={() => setMobileOpen(v => !v)}>{mobileOpen ? <X size={20} /> : <Menu size={20} />}<span>Menu</span></button>
    <aside className={`impact-sidebar ${mobileOpen ? 'mobile-open' : ''} ${desktopCollapsed ? 'desktop-collapsed' : ''}`}>
      <button className="sidebar-collapse-toggle" aria-label={desktopCollapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'} title={desktopCollapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'} onClick={() => setDesktopCollapsed(v => !v)}>
        {desktopCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}<span>{desktopCollapsed ? 'Perluas' : 'Ciutkan'}</span>
      </button>
      {nav}
    </aside>
    {mobileOpen && <button className="sidebar-backdrop" aria-label="Tutup navigasi" onClick={() => setMobileOpen(false)} />}
  </>;
}
