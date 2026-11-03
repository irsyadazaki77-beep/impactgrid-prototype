import React, { useMemo } from 'react';
import { ShieldCheck, Leaf, Zap, ClipboardCheck } from 'lucide-react';
import { calculateHourTelemetry } from './GlobalSimulationBar';

export default function KpiStatRow({
  simState = { simHour: 14, scenarioKey: 'normal', simTimeString: '14:00 WIB' },
  selectedScale = 'pilot',
  operationalSummary = null,
  emergencyState = { active: false },
  className = ''
}) {
  const liveSiteCount = operationalSummary?.siteCount ?? 50;
  const interventionCount = operationalSummary?.interventionCount ?? 40;
  const controlCount = operationalSummary?.controlCount ?? 10;
  const resolvedCount = operationalSummary?.resolvedSitesCount ?? 0;
  const postedSapCount = operationalSummary?.postedSapVouchersCount ?? 1;

  const liveMetrics = useMemo(() => {
    const hour = typeof simState?.simHour === 'number' ? simState.simHour : 14;
    const scenarioKey = simState?.scenarioKey || 'normal';
    const base = calculateHourTelemetry(hour, scenarioKey);
    const scaleMultiplier = selectedScale === 'national' ? 250 : selectedScale === 'regional' ? 125 : 1;
    const totalSites = interventionCount * scaleMultiplier;

    if (emergencyState?.active) {
      const fullLoadKw = (216.2 * scaleMultiplier * (base.trafficMultiplier || 1)).toFixed(1);
      return {
        activeLoadKw: `${Number(fullLoadKw).toLocaleString('id-ID')} kW`,
        deltaPct: '0,0% (Override 112)',
        dailySavedKwh: `${(612.0 * scaleMultiplier).toLocaleString('id-ID')} kWh/hr`,
        co2AvoidedKg: `${(532.4 * scaleMultiplier).toLocaleString('id-ID')} kg CO₂e`,
        sleepSitesText: `0 / ${totalSites.toLocaleString('id-ID')} Site`,
        slaPct: '100,00%',
        cdrText: 'Drop Call 0,01% (Prioritas 112)',
        simTimeLabel: simState?.simTimeString || `${hour.toString().padStart(2, '0')}:00 WIB`
      };
    }

    const isDefaultHour = hour === 14 && scenarioKey === 'normal';
    const baseActive = Number.isFinite(base.activeKw) ? base.activeKw : 194.0;
    const rawActiveKw = isDefaultHour ? 184.2 : Number(baseActive.toFixed(1));
    const savingPctVal = isDefaultHour ? 14.8 : (Number.isFinite(base.savingPct) ? base.savingPct : 10.2);
    const rawSavedKwh = isDefaultHour ? 776.4 : Number((520 + savingPctVal * 17.3).toFixed(1));
    const rawCo2Kg = Number((rawSavedKwh * 0.78 * scaleMultiplier).toFixed(1));

    const sleepRatio = base.carrierSleepActive ? 0.9 : savingPctVal >= 14 ? 0.75 : 0.45;
    const activeSleepSites = isDefaultHour ? 36 * scaleMultiplier : Math.round(totalSites * sleepRatio);

    return {
      activeLoadKw: `${(rawActiveKw * scaleMultiplier).toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kW`,
      deltaPct: `−${savingPctVal.toFixed(1)}%`,
      dailySavedKwh: `${(rawSavedKwh * scaleMultiplier).toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kWh/hr`,
      co2AvoidedKg: `${rawCo2Kg.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kg CO₂e/hr`,
      sleepSitesText: `${activeSleepSites.toLocaleString('id-ID')} / ${totalSites.toLocaleString('id-ID')} Eco-Sleep`,
      slaPct: base.carrierSleepActive ? '99,996%' : '99,994%',
      cdrText: `CDR ${base.cdrPct || '0,06'}% (< 0,8%)`,
      simTimeLabel: simState?.simTimeString || `${hour.toString().padStart(2, '0')}:00 WIB`
    };
  }, [simState, selectedScale, emergencyState?.active, interventionCount]);

  const scaleInfo = {
    pilot: {
      value: liveSiteCount === 50 ? '40+10 Site' : `${liveSiteCount} Site`,
      tag: `SLA ${liveMetrics.slaPct}`,
      note: `${liveMetrics.sleepSitesText} • ${liveMetrics.cdrText}`
    },
    regional: {
      value: '5.000 Site',
      tag: `SLA ${liveMetrics.slaPct}`,
      note: `Kluster Jamali • ${liveMetrics.cdrText}`
    },
    national: {
      value: '10.000+ Site',
      tag: `SLA ${liveMetrics.slaPct}`,
      note: `Skala Nasional • ${liveMetrics.cdrText}`
    }
  }[selectedScale] || {
    value: '40+10 Site',
    tag: `SLA ${liveMetrics.slaPct}`,
    note: `${liveMetrics.sleepSitesText} • ${liveMetrics.cdrText}`
  };

  const unifiedKpis = [
    {
      id: 'electricity',
      title: `Daya RAN & Baseline (${liveMetrics.simTimeLabel})`,
      value: liveMetrics.activeLoadKw,
      tag: `${liveMetrics.deltaPct} Hemat`,
      note: 'Baseline Korporat: 1.885,4 GWh/thn (SR2025)',
      icon: Zap,
      topGradient: 'from-amber-500 to-amber-600',
      iconStyle: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-500/20',
    },
    {
      id: 'scope2',
      title: 'Emisi Scope 2 & Reduksi ESG',
      value: '1,72 Jt tCO₂e',
      tag: `−${liveMetrics.co2AvoidedKg}`,
      note: `63,6% emisi korporat • Hemat ${liveMetrics.dailySavedKwh}`,
      icon: Leaf,
      topGradient: 'from-emerald-500 to-teal-600',
      iconStyle: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20',
    },
    {
      id: 'pilot',
      title: 'Cakupan Rollout & Proteksi SLA',
      value: scaleInfo.value,
      tag: scaleInfo.tag,
      note: scaleInfo.note,
      icon: ShieldCheck,
      topGradient: 'from-sky-500 to-blue-600',
      iconStyle: 'bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400 border border-sky-500/20',
    },
    {
      id: 'validation',
      title: 'Rekonsiliasi PLN & Jurnal SAP',
      value: resolvedCount > 0 ? `${resolvedCount} Terkalibrasi` : `${liveSiteCount} Site Aktif`,
      tag: `SAP: ${postedSapCount} Jurnal`,
      note: resolvedCount > 0
        ? 'BA-RE PLN & Credit Note Rp 3,82 Jt/site sinkron'
        : `Sub-meter Kelas 0.5s (${interventionCount} uji + ${controlCount} kontrol)`,
      icon: ClipboardCheck,
      topGradient: 'from-[#ED0226] to-rose-600',
      iconStyle: 'bg-red-500/10 text-[#ED0226] dark:bg-red-500/20 dark:text-red-400 border border-red-500/20',
    }
  ];

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-4 ${className}`}>
      {unifiedKpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div 
            key={kpi.id} 
            className="card-interactive group relative rounded-2xl bg-white dark:bg-[#0B1324] border border-slate-200/90 dark:border-slate-800 p-3.5 sm:p-4 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 overflow-hidden"
          >
            <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${kpi.topGradient} opacity-80 group-hover:opacity-100 transition-opacity`} />

            <div className="flex items-start justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 leading-tight">
                {kpi.title}
              </span>
              <div className={`p-1.5 rounded-xl shrink-0 ${kpi.iconStyle}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="mt-2 flex items-baseline justify-between gap-2">
              <div className="text-lg sm:text-xl font-black font-mono text-slate-900 dark:text-white tracking-tight tabular-nums whitespace-nowrap">
                {kpi.value}
              </div>
              {kpi.tag && (
                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0">
                  {kpi.tag}
                </span>
              )}
            </div>

            <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-snug truncate" title={kpi.note}>
              {kpi.note}
            </div>
          </div>
        );
      })}
    </div>
  );
}

