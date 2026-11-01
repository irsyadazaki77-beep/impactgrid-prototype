import React, { useState, useMemo } from 'react';
import {
  Thermometer,
  Zap,
  BatteryCharging,
  Wind,
  Radio,
  CheckCircle2,
  Sliders,
  Server,
  Gauge,
  Layers,
  TrendingDown,
  Box,
  Wrench,
  RefreshCw
} from 'lucide-react';
import Bts3DDigitalTwinCanvas from './Bts3DDigitalTwinCanvas';
import RegionalMultiSiteBenchmark, { EXTENDED_REGIONAL_SITES } from './RegionalMultiSiteBenchmark';
import { MULTI_VENDOR_RAN_COMPARISON } from '../data/mockData';
import { calculateHourTelemetry } from './GlobalSimulationBar';

export default function DigitalTwinTab({
  simState,
  operationalState,
  resolvedSites = [],
  onResolveSiteAnomaly,
  onDispatchOranPolicy,
  onOpenOfficialBaRe,
  onOpenSapVoucher
}) {
  const [selectedSiteId, setSelectedSiteId] = useState('BDG-DGO-P04');
  const [vendorFilter, setVendorFilter] = useState('ALL'); // 'ALL' | 'Ericsson' | 'Huawei' | 'ZTE'
  const [trafficLoadPct, setTrafficLoadPct] = useState(38); // 10% - 100%
  const [ambientTempC, setAmbientTempC] = useState(31.5); // 24°C - 38°C
  const [optimizationMode, setOptimizationMode] = useState('autonomous'); // 'autonomous' | 'manual' | 'peak_shaving'
  const [dispatchNotice, setDispatchNotice] = useState(null);

  const currentHour = typeof simState?.simHour === 'number' ? simState.simHour : 14;
  const hourTelemetry = calculateHourTelemetry(currentHour, simState?.scenarioKey || 'normal');

  // Merge EXTENDED_REGIONAL_SITES with any newly added custom sites from operationalState
  const combinedSites = useMemo(() => {
    const baseIds = new Set(EXTENDED_REGIONAL_SITES.map((s) => s.id));
    const extraSites = (operationalState?.sites || [])
      .map((s) => {
        const resolvedId = s.siteId || s.id || s.code;
        const resolvedName = s.name || s.siteName || s.location || s.cluster || resolvedId;
        return {
          id: resolvedId,
          name: resolvedName,
          region: s.cluster || s.region || 'Jabodetabek',
          vendor: s.vendor || 'Ericsson',
          baselinePowerKw: Number(s.plnKw || s.baselinePowerKw || 4.8),
          tariffName: 'B-3 TM',
          tariffRate: 1500,
          bessCapacity: '19.2 kWh (4x 100Ah 48V)'
        };
      })
      .filter((s) => Boolean(s.id && s.name) && !baseIds.has(s.id))
      .slice(0, 4);
    return [...EXTENDED_REGIONAL_SITES, ...extraSites];
  }, [operationalState?.sites]);

  const filteredSites = useMemo(() => {
    if (vendorFilter === 'ALL') return combinedSites;
    return combinedSites.filter((s) => (s.vendor || '').toLowerCase().includes(vendorFilter.toLowerCase()));
  }, [combinedSites, vendorFilter]);

  const site = useMemo(() => {
    return combinedSites.find((s) => s.id === selectedSiteId) || filteredSites[0] || EXTENDED_REGIONAL_SITES[0];
  }, [combinedSites, filteredSites, selectedSiteId]);

  const isSelectedResolved = resolvedSites.includes(site.id);

  const handleSyncWithSimHour = () => {
    const simulatedPrb = currentHour >= 1 && currentHour <= 5 ? 16 : currentHour >= 18 && currentHour <= 22 ? 78 : 42;
    const simulatedTemp = currentHour >= 11 && currentHour <= 15 ? 33.5 : currentHour >= 0 && currentHour <= 5 ? 25.5 : 29.0;
    setTrafficLoadPct(simulatedPrb);
    setAmbientTempC(simulatedTemp);
    setOptimizationMode(currentHour >= 17 && currentHour <= 22 ? 'peak_shaving' : 'autonomous');
  };

  const handleDispatchPolicyToSite = () => {
    if (onDispatchOranPolicy) {
      void onDispatchOranPolicy({
        siteId: site.id,
        mode: optimizationMode === 'peak_shaving' ? 'WBP_PEAK_SHAVING' : 'CARRIER_SLEEP_PINN',
        targetTempC: 26.0
      });
    }
    setDispatchNotice(`Kebijakan O-RAN O1 (${optimizationMode.toUpperCase()}) berhasil dikirim ke ${site.id} (${site.vendor || 'Multi-Vendor'}).`);
    setTimeout(() => setDispatchNotice(null), 4000);
  };

  // Physics-Informed Neural Network (PINN) Thermodynamic & Radio Calculation Model
  const simulation = useMemo(() => {
    const trafficRatio = trafficLoadPct / 100;
    const isAutonomous = optimizationMode === 'autonomous';
    const isPeakShaving = optimizationMode === 'peak_shaving';

    // 1. Radio Frequency Subsystem Power (BBU + RRU/AAU)
    const bbuPowerKw = 0.45;
    let carrierSleepEfficiency = 0;
    let sleepState = 'Normal Operational';
    let activeCarriers = '4 / 4 Band (900/1800/2100/2300 MHz)';

    if (isAutonomous) {
      if (trafficLoadPct <= 25) {
        carrierSleepEfficiency = 0.42;
        sleepState = 'Deep Carrier Sleep (2/4 Layers Muted)';
        activeCarriers = '2 / 4 Band Aktif (Coverage 900 + 2100 MHz)';
      } else if (trafficLoadPct <= 50) {
        carrierSleepEfficiency = 0.24;
        sleepState = 'Symbol & Micro-Sleep (1/4 Layer Muted)';
        activeCarriers = '3 / 4 Band Aktif (900/1800/2100 MHz)';
      } else {
        carrierSleepEfficiency = 0.08;
        sleepState = 'Adaptive Symbol Muting';
      }
    } else if (isPeakShaving) {
      carrierSleepEfficiency = 0.35;
      sleepState = 'Peak-Shaving Carrier Throttling';
      activeCarriers = '2 / 4 Band Aktif (Low-Carbon Mode)';
    }

    const unoptimizedRfKw = (site.baselinePowerKw || 4.8) * 0.58 * (0.4 + 0.6 * trafficRatio);
    const rfPowerKw = Math.max(0.8, unoptimizedRfKw * (1 - carrierSleepEfficiency));

    // 2. Thermodynamic & HVAC Inverter Cooling Load
    const targetInternalTempC = 25.0;
    const deltaT = Math.max(0, ambientTempC - targetInternalTempC);

    const cop = isAutonomous ? 4.1 : 3.4;
    const internalHeatKw = (bbuPowerKw + rfPowerKw) * 0.82;
    const cabinetConductanceKw = deltaT * 0.045;
    const totalThermalLoadKw = internalHeatKw + cabinetConductanceKw;

    const hvacPowerKw = isAutonomous && ambientTempC < 27.0
      ? 0.15
      : Math.max(0.35, totalThermalLoadKw / cop);

    const cabinetInternalTempC = Number((targetInternalTempC + (deltaT * 0.08) + (trafficRatio * 0.7) - (isAutonomous ? 0.6 : 0)).toFixed(1));

    // 3. Rectifier & Power Conversion
    const dcLoadKw = bbuPowerKw + rfPowerKw + 0.12;
    const rectifierEfficiency = isSelectedResolved ? 0.968 : 0.962;
    const rectifierLossKw = dcLoadKw * (1 - rectifierEfficiency);

    // 4. BESS Battery Dispatch
    let bessDischargeKw = 0;
    let bessStatus = 'Float Standby (SoC 84%)';
    if (isPeakShaving) {
      bessDischargeKw = Math.min(2.0, dcLoadKw * 0.5);
      bessStatus = 'Active Peak-Shaving Discharge (-2.0 kW)';
    }

    const totalGridPowerKw = Math.max(0.5, (dcLoadKw + rectifierLossKw + hvacPowerKw) - bessDischargeKw);
    const baselineCurrentKw = (site.baselinePowerKw || 4.8) * (0.65 + 0.35 * trafficRatio) + (deltaT * 0.09);
    const powerSavedKw = Math.max(0, baselineCurrentKw - totalGridPowerKw);
    const powerSavedPct = ((powerSavedKw / baselineCurrentKw) * 100).toFixed(1);

    const pue = (totalGridPowerKw / Math.max(0.1, dcLoadKw)).toFixed(2);

    const tariffRate = site.tariffRate || 1500;
    const costPerHourIdr = Math.round(totalGridPowerKw * tariffRate);
    const savingsPerHourIdr = Math.round(powerSavedKw * tariffRate);
    const carbonHourlyKg = Number((totalGridPowerKw * 0.87).toFixed(2));

    return {
      bbuPowerKw: Number(bbuPowerKw.toFixed(2)),
      rfPowerKw: Number(rfPowerKw.toFixed(2)),
      hvacPowerKw: Number(hvacPowerKw.toFixed(2)),
      rectifierLossKw: Number(rectifierLossKw.toFixed(2)),
      totalGridPowerKw: Number(totalGridPowerKw.toFixed(2)),
      baselineCurrentKw: Number(baselineCurrentKw.toFixed(2)),
      powerSavedKw: Number(powerSavedKw.toFixed(2)),
      powerSavedPct,
      cabinetInternalTempC,
      pue,
      cop,
      costPerHourIdr,
      savingsPerHourIdr,
      carbonHourlyKg,
      sleepState,
      activeCarriers,
      bessStatus,
      bessDischargeKw
    };
  }, [site, trafficLoadPct, ambientTempC, optimizationMode, isSelectedResolved]);

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-6 md:p-8 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="text-[#ED0226] font-bold">SNOC DIGITAL TWIN</span>
              <span>·</span>
              <span>SUB-SISTEM BTS &amp; TERMODINAMIKA PINN</span>
              <span>·</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                Jam Simulasi {String(currentHour).padStart(2, '0')}:00 WIB (-{hourTelemetry.savingPct}%)
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Digital Twin Fisik Menara BTS, Termodinamika Kabinet &amp; Multi-Vendor RAN
            </h1>
            <p className="max-w-3xl text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Replikasi real-time disipasi termal Radio 4G/5G (Ericsson, Huawei, ZTE), inverter pendingin shelter, konversi daya rectifier 48V DC, dan baterai BESS LiFePO4 yang tersinkron langsung dengan database site operasional.
            </p>
          </div>

          {/* Metrics Summary Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-900/80 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shrink-0">
            <div>
              <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Efisiensi Daya Site</div>
              <div className="text-lg md:text-xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                <TrendingDown className="h-4 w-4" />
                <span>-{simulation.powerSavedPct}%</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Fasilitas PUE</div>
              <div className="text-lg md:text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white flex items-center gap-1 mt-0.5">
                <Gauge className="h-4 w-4 text-sky-500" />
                <span>{simulation.pue}</span>
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-800">
              <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Hemat Listrik / Jam</div>
              <div className="text-lg md:text-xl font-bold font-mono tabular-nums text-sky-600 dark:text-sky-400 mt-0.5">
                Rp {simulation.savingsPerHourIdr.toLocaleString('id-ID')}
              </div>
            </div>
          </div>
        </div>

        {/* Multi-Vendor Filter & Direct Operational Actions */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 mr-1">Filter Ekosistem Vendor:</span>
            {['ALL', 'Ericsson', 'Huawei', 'ZTE'].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setVendorFilter(v)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  vendorFilter === v
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {v === 'ALL' ? 'Semua Vendor (Ericsson/Huawei/ZTE)' : v}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleSyncWithSimHour}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              <RefreshCw className="h-3.5 w-3.5 text-[#ED0226]" />
              <span>Sinkronkan Jam {String(currentHour).padStart(2, '0')}:00 WIB</span>
            </button>
            <button
              type="button"
              onClick={handleDispatchPolicyToSite}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#ED0226] hover:bg-red-700 text-white text-xs font-bold transition cursor-pointer shadow-2xs"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Dispatch O-RAN O1 ke {site.id}</span>
            </button>
            {onResolveSiteAnomaly && !isSelectedResolved && (
              <button
                type="button"
                onClick={() => onResolveSiteAnomaly(site.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer"
              >
                <Wrench className="h-3.5 w-3.5" />
                <span>Kalibrasi FOP Site Ini</span>
              </button>
            )}
            {isSelectedResolved && onOpenOfficialBaRe && (
              <button
                type="button"
                onClick={onOpenOfficialBaRe}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-bold transition cursor-pointer"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Terkalibrasi FOP · Lihat BA-RE</span>
              </button>
            )}
          </div>
        </div>

        {dispatchNotice && (
          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-4 py-2.5 text-xs font-bold text-emerald-800 dark:text-emerald-200 flex items-center justify-between">
            <span>{dispatchNotice}</span>
            {onOpenSapVoucher && (
              <button
                type="button"
                onClick={onOpenSapVoucher}
                className="underline font-extrabold ml-3 cursor-pointer"
              >
                Lihat Jurnal SAP S/4HANA
              </button>
            )}
          </div>
        )}

        {/* Site Selector Segmented Bar */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4 text-[#ED0226]" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Pilih Site Digital Twin ({filteredSites.length} Site):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {filteredSites.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedSiteId(s.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  site.id === s.id
                    ? 'bg-[#ED0226] text-white shadow-xs font-semibold'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span>{s.name}</span>
                <span className="text-[10px] opacity-80 font-mono hidden sm:inline">({s.id})</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* 02. Interactive 3D BTS & Subsystem Shelter Twin Viewport */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            <Box className="h-4 w-4 text-[#ED0226]" />
            <span>01. Visualisasi 3D Digital Twin Menara &amp; Kabinet Shelter ({site.id})</span>
          </div>
          <span className="text-xs text-slate-500 font-mono hidden sm:inline">
            Three.js WebGL · 42m Tower · {site.vendor || 'Multi-Vendor'} AAU 64T64R · IP55 Shelter
          </span>
        </div>

        <Bts3DDigitalTwinCanvas
          site={site}
          trafficLoadPct={trafficLoadPct}
          ambientTempC={ambientTempC}
          internalTempC={simulation.cabinetInternalTempC}
          rfPowerKw={Number((simulation.bbuPowerKw + simulation.rfPowerKw).toFixed(2))}
          hvacPowerKw={simulation.hvacPowerKw}
          bessDischargeKw={simulation.bessDischargeKw}
          optimizationMode={optimizationMode}
        />
      </section>

      {/* 03. Interactive Simulation Controls Console (PINN Parameter Sliders) */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-[#ED0226]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              02. Konsol Parameter Beban Lapangan &amp; Model Termodinamika PINN
            </h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Mengubah slider langsung mereposisi kalkulasi daya &amp; visual 3D
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Slider 1: Traffic Load */}
          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Radio className="h-4 w-4 text-sky-500" />
                Beban Trafik PRB (Radio RAN)
              </span>
              <span className="font-mono font-bold text-sky-600 dark:text-sky-400 text-sm tabular-nums">
                {trafficLoadPct}%
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={trafficLoadPct}
              onChange={(e) => setTrafficLoadPct(Number(e.target.value))}
              className="w-full accent-[#ED0226] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Off-Peak (10%)</span>
              <span>Median (50%)</span>
              <span>Peak Hour (100%)</span>
            </div>
          </div>

          {/* Slider 2: Ambient Temperature */}
          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Thermometer className="h-4 w-4 text-amber-500" />
                Suhu Udara Luar (Ambient)
              </span>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-sm tabular-nums">
                {ambientTempC.toFixed(1)}°C
              </span>
            </div>
            <input
              type="range"
              min="24"
              max="38"
              step="0.5"
              value={ambientTempC}
              onChange={(e) => setAmbientTempC(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Sejuk (24°C)</span>
              <span>Tropis Normal (31°C)</span>
              <span>Panas Ekstrem (38°C)</span>
            </div>
          </div>

          {/* Optimization Mode Switcher */}
          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
              Strategi Kendali Energi Digital Twin
            </span>
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setOptimizationMode('autonomous')}
                className={`p-2 rounded-lg text-center text-[11px] font-semibold transition cursor-pointer ${
                  optimizationMode === 'autonomous'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                O-RAN AI (PINN)
              </button>
              <button
                type="button"
                onClick={() => setOptimizationMode('peak_shaving')}
                className={`p-2 rounded-lg text-center text-[11px] font-semibold transition cursor-pointer ${
                  optimizationMode === 'peak_shaving'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                Peak-Shaving
              </button>
              <button
                type="button"
                onClick={() => setOptimizationMode('manual')}
                className={`p-2 rounded-lg text-center text-[11px] font-semibold transition cursor-pointer ${
                  optimizationMode === 'manual'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                Baseline Pasif
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 04. Subsystem Telemetry Cards: 4 Physical Layers */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-5 shadow-xs space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 flex items-center gap-1">
                <Radio className="h-3.5 w-3.5" /> Radio RF &amp; BBU
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                O1 Polled
              </span>
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {(simulation.bbuPowerKw + simulation.rfPowerKw).toFixed(2)} <span className="text-sm font-normal text-slate-500">kW</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {simulation.sleepState}
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-slate-500">
            <div className="flex justify-between">
              <span>BBU Baseband:</span>
              <span className="font-mono tabular-nums text-slate-800 dark:text-slate-200">{simulation.bbuPowerKw} kW</span>
            </div>
            <div className="flex justify-between">
              <span>RF TRX Transmission:</span>
              <span className="font-mono tabular-nums text-slate-800 dark:text-slate-200">{simulation.rfPowerKw} kW</span>
            </div>
            <div className="text-[10px] text-sky-600 dark:text-sky-400 pt-1">
              {simulation.activeCarriers}
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-5 shadow-xs space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <Wind className="h-3.5 w-3.5" /> HVAC Pendingin (PINN)
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                COP {simulation.cop}
              </span>
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {simulation.hvacPowerKw} <span className="text-sm font-normal text-slate-500">kW</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <Thermometer className="h-4 w-4 text-emerald-500" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Suhu Kabinet: <strong className="font-mono tabular-nums">{simulation.cabinetInternalTempC}°C</strong>
              </span>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-slate-500">
            <div className="flex justify-between">
              <span>Ambang Batas Maks:</span>
              <span className="font-mono tabular-nums text-slate-800 dark:text-slate-200">30.0°C</span>
            </div>
            <div className="flex justify-between">
              <span>Disipasi Panas Total:</span>
              <span className="font-mono tabular-nums text-slate-800 dark:text-slate-200">{((simulation.bbuPowerKw + simulation.rfPowerKw) * 0.82).toFixed(2)} kWth</span>
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 pt-1">
              Thermal Margin: +{(30.0 - simulation.cabinetInternalTempC).toFixed(1)}°C
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-5 shadow-xs space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1">
                <Zap className="h-3.5 w-3.5" /> Rectifier AC/DC
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {isSelectedResolved ? '96.8% Eff (Calibrated)' : '96.2% Eff'}
              </span>
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              -48.2 <span className="text-sm font-normal text-slate-500">VDC</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              4x Module Rectifier 50A Paralel
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-slate-500">
            <div className="flex justify-between">
              <span>Tegangan PLN AC:</span>
              <span className="font-mono tabular-nums text-slate-800 dark:text-slate-200">221 VAC / 50Hz</span>
            </div>
            <div className="flex justify-between">
              <span>Konversi Rugi-Rugi:</span>
              <span className="font-mono tabular-nums text-slate-800 dark:text-slate-200">{simulation.rectifierLossKw} kW</span>
            </div>
            <div className="text-[10px] text-purple-600 dark:text-purple-400 pt-1">
              Harmonik THD: &lt; 3.0% (Standar IEEE 519)
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-5 shadow-xs space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <BatteryCharging className="h-3.5 w-3.5" /> BESS LiFePO4
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                SoH 98.6%
              </span>
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {simulation.bessDischargeKw > 0 ? `-${simulation.bessDischargeKw}` : '0.00'} <span className="text-sm font-normal text-slate-500">kW</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {simulation.bessStatus}
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-slate-500">
            <div className="flex justify-between">
              <span>Kapasitas String:</span>
              <span className="font-mono tabular-nums text-slate-800 dark:text-slate-200">{(site.bessCapacity || '19.2 kWh').split(' (')[0]}</span>
            </div>
            <div className="flex justify-between">
              <span>Cadangan Otonom:</span>
              <span className="font-mono tabular-nums text-slate-800 dark:text-slate-200">4.2 Jam</span>
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 pt-1">
              Siklus Baterai: 342 / 4.000 Cycle
            </div>
          </div>
        </article>
      </section>

      {/* 05. Multi-Vendor RAN Hardware & O1 Telemetry Comparison */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              03. Matriks Interoperabilitas &amp; Performa Multi-Vendor RAN (Ericsson, Huawei, ZTE)
            </h3>
            <p className="text-xs text-slate-500">
              Komparasi dukungan protokol O-RAN O1, mode tidur perangkat radio, latensi wake-up, dan populasi menara pada skala Pilot vs Regional Jamali.
            </p>
          </div>
        </div>
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 text-[11px] uppercase text-slate-500 font-bold">
              <tr>
                <th className="p-3">Vendor &amp; Platform OSS</th>
                <th className="p-3">Seri Perangkat Radio</th>
                <th className="p-3">Protokol O-RAN &amp; Mode Sleep</th>
                <th className="p-3 text-right">Wake-Up Latency</th>
                <th className="p-3 text-right">Efisiensi Rata-rata</th>
                <th className="p-3 text-right">Populasi Pilot / Jamali</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {MULTI_VENDOR_RAN_COMPARISON.map((v) => (
                <tr key={v.vendor} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30">
                  <td className="p-3">
                    <div className="font-bold text-slate-900 dark:text-white">{v.vendor}</div>
                    <div className="text-[11px] text-slate-500">{v.ossPlatform}</div>
                  </td>
                  <td className="p-3 font-mono text-slate-700 dark:text-slate-300">{v.hardwareSeries}</td>
                  <td className="p-3">
                    <div className="text-slate-800 dark:text-slate-200 font-medium">{v.sleepModes}</div>
                    <div className="text-[11px] text-slate-500">{v.oranO1Protocol}</div>
                  </td>
                  <td className="p-3 text-right font-mono tabular-nums font-bold text-emerald-600">{v.wakeUpLatencyMs} ms</td>
                  <td className="p-3 text-right font-mono tabular-nums font-bold text-slate-900 dark:text-white">-{v.avgEfficiencyPct}%</td>
                  <td className="p-3 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                    {v.pilotSitesCount} Site / {v.jamaliSitesCount.toLocaleString('id-ID')} Site
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 06. Regional Multi-Site Side-by-Side Benchmark Matrix */}
      <RegionalMultiSiteBenchmark
        activeSiteId={site.id}
        onSelectActiveSite={(id) => setSelectedSiteId(id)}
      />

      {/* 07. Energy Balance & Financial Impact Reconciliation Grid */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-6 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Layers className="h-4 w-4 text-[#ED0226]" />
          <span>05. Rekapitulasi Neraca Daya &amp; Dampak Finansial Langsung ({site.id})</span>
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400">Daya Beban Grid Total Saat Ini</div>
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">
              {simulation.totalGridPowerKw} <span className="text-sm font-normal text-slate-500">kW</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-1">
              Baseline tanpa optimasi: {simulation.baselineCurrentKw} kW
            </div>
          </div>

          <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-4 rounded-xl border border-emerald-200/80 dark:border-emerald-800/50">
            <div className="text-xs text-emerald-800 dark:text-emerald-300">Daya Dihindari (Saved)</div>
            <div className="text-2xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-1">
              {simulation.powerSavedKw} <span className="text-sm font-normal text-emerald-600/70">kW</span>
            </div>
            <div className="text-[10px] text-emerald-700 dark:text-emerald-300 font-mono mt-1">
              Efisiensi aktif sebesar -{simulation.powerSavedPct}%
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400">Penghematan Biaya Listrik PLN</div>
            <div className="text-2xl font-bold font-mono tabular-nums text-sky-600 dark:text-sky-400 mt-1">
              Rp {simulation.savingsPerHourIdr.toLocaleString('id-ID')} <span className="text-xs font-normal text-slate-500">/ jam</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-1">
              Tarif {site.tariffName || 'B-3 TM'} (Rp {site.tariffRate || 1500}/kWh)
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400">Reduksi Karbon Emisi Scope 2</div>
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">
              {(simulation.powerSavedKw * 0.87).toFixed(2)} <span className="text-xs font-normal text-slate-500">kgCO₂e / jam</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-1">
              Faktor ESDM Jamali 0,87 kgCO₂e/kWh
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}