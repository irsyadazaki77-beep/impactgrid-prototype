import React from 'react';
import {
  Briefcase,
  Activity,
  Cpu,
  Leaf,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Flame
} from 'lucide-react';
import { ENTERPRISE_ROLES } from '../data/enterpriseRoles';
import { getRoleWorkspaceConfig } from '../utils/roleBasedWorkspaceEngine';

const ROLE_ICON_MAP = {
  vp_network: Briefcase,
  noc_leader: Activity,
  rno_engineer: Cpu,
  esg_lead: Leaf,
  auditor: ShieldCheck
};

export default function RoleBasedWorkspaceBanner({
  currentRole = 'vp_network',
  onRoleChange,
  selectedScale = 'pilot',
  resolvedSites = [],
  emergencyState = { active: false },
  onNavigateTab,
  onOpenModal
}) {
  const workspace = getRoleWorkspaceConfig(currentRole, {
    resolvedSites,
    selectedScale,
    emergencyActive: emergencyState?.active
  });

  const handleActionClick = (action) => {
    if (action.targetTab && onNavigateTab) {
      onNavigateTab(action.targetTab);
    } else if (action.modalKey && onOpenModal) {
      onOpenModal(action.modalKey);
    }
  };

  return (
    <section
      aria-label="Ruang Kerja Terpadu Berbasis Peran Telkomsel"
      data-testid="role-based-workspace-banner"
      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-4 sm:p-5 shadow-xs space-y-4 mb-5"
    >
      {/* Top Row: Quick Role Selector Bar (Tim Bisnis vs Tim Operasional) */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 pb-3.5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-extrabold text-slate-900 dark:text-white">
            Ruang Kerja Terpadu (Role-Based Workspace)
          </span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
          <span className="font-semibold text-[#ED0226] dark:text-red-400">
            {workspace.teamCategory}
          </span>
          {emergencyState?.active && (
            <>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
              <span className="inline-flex items-center gap-1 font-bold text-red-600 dark:text-red-400">
                <Flame className="w-3.5 h-3.5" />
                <span>Prioritas Darurat 112 Aktif</span>
              </span>
            </>
          )}
        </div>

        {/* Segmented Role Switcher Controls */}
        <div
          role="group"
          aria-label="Pilih Peran Pengguna Telkomsel"
          className="flex flex-wrap xl:flex-nowrap items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shrink-0"
        >
          {ENTERPRISE_ROLES.map((role) => {
            const Icon = ROLE_ICON_MAP[role.id] || Briefcase;
            const isSelected = currentRole === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => onRoleChange && onRoleChange(role.id)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-[#ED0226] text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{role.shortTitle}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Middle Row: Role Headline, Mission & 3 Tailored KPIs */}
      <div className="grid gap-4 lg:grid-cols-12 items-stretch">
        <div className="lg:col-span-5 flex flex-col justify-between space-y-2 pr-1">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {workspace.title}
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight leading-snug">
              {workspace.focusHeadline}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {workspace.missionSummary}
            </p>
          </div>
          <div className="pt-1 flex items-center gap-2 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>Data Bisnis &amp; Operasional Tersinkron Real-Time ({resolvedSites.length} Site FOP Terverifikasi)</span>
          </div>
        </div>

        <div className="lg:col-span-7 grid gap-3 sm:grid-cols-3">
          {workspace.primaryKpis.map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-3.5 flex flex-col justify-between"
            >
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                {kpi.label}
              </div>
              <div className="mt-1.5 text-base sm:text-lg font-black font-mono tabular-nums text-slate-900 dark:text-white">
                {kpi.value}
              </div>
              <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                {kpi.sub}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Row: 4 Contextual Quick Workflow Actions */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
          Pintasan Alur Kerja Prioritas ({workspace.teamCategory}):
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {workspace.quickActions.map((act) => (
            <button
              key={act.id}
              type="button"
              onClick={() => handleActionClick(act)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap shrink-0 ${
                act.variant === 'primary'
                  ? 'bg-[#ED0226] hover:bg-red-700 text-white shadow-2xs'
                  : act.variant === 'secondary'
                    ? 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white'
                    : 'border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
              }`}
            >
              <span>{act.label}</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
