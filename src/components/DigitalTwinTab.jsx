import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  Cpu, 
  Thermometer, 
  Zap, 
  BatteryCharging, 
  Wind, 
  Radio, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  Server, 
  ShieldCheck, 
  RefreshCw,
  Gauge,
  Layers,
  ArrowUpRight,
  TrendingDown
} from 'lucide-react';

const SITES_CATALOG = [
  {
    id: 'BDG-DGO-P04',
    name: 'Bandung Dago - Urban Macro 4G/5G',
    towerCo: 'Mitratel (Pass-Through 85%)',
    plnTariff: 'B-3/TM (Rp 1.114/kWh)',
    hardware: 'Huawei BBU5900 + 3x AAU A8972',
    bessCapacity: '48V 200Ah LiFePO4 (9.6 kWh)',
    baselinePowerKw: 4.8,
    nominalTempC: 25.4
  },
  {
    id: 'JKT-SEL-P01',
    name: 'Jakarta Selatan - Dense Urban 5G Massive MIMO',
    towerCo: 'Telkomsel Owned (100%)',
    plnTariff: 'I-3/WBP (Rp 2.250/kWh Peak)',
    hardware: 'Ericsson Baseband 6648 + 3x AIR 6449',
    bessCapacity: '48V 400Ah LiFePO4 (19.2 kWh)',
    baselinePowerKw: 6.2,
    nominalTempC: 26.2
  },
  {
    id: 'SBY-GUB-P02',
    name: 'Surabaya Gubeng - Transit Hub High Throughput',
    towerCo: 'Protelindo (Fixed 70%)',
    plnTariff: 'B-3/TM (Rp 1.114/kWh)',
    hardware: 'ZTE B8300 + 3x AAU A9611',
    bessCapacity: '48V 200Ah LiFePO4 (9.6 kWh)',
    baselinePowerKw: 5.1,
    nominalTempC: 25.8
  },
  {
    id: 'BGR-SNT-P03',
    name: 'Bogor Sentul - Suburban Macro Solar Hybrid',
    towerCo: 'Mitratel (Pass-Through 85%)',
    plnTariff: 'B-2/TR (Rp 1.444/kWh)',
    hardware: 'Huawei BBU3910 + 3x RRU 3959',
    bessCapacity: '48V 300Ah LiFePO4 (14.4 kWh)',
    baselinePowerKw: 3.9,
    nominalTempC: 24.9
  }
];

export default function DigitalTwinTab() {
  const [selectedSiteId, setSelectedSiteId] = useState('BDG-DGO-P04');
  const [trafficLoadPct, setTrafficLoadPct] = useState(38); // 10% - 100%
  const [ambientTempC, setAmbientTempC] = useState(31.5); // 24°C - 38°C
  const [optimizationMode, setOptimizationMode] = useState('autonomous'); // 'autonomous' | 'manual' | 'peak_shaving'
  const [autoRefresh, setAutoRefresh] = useState(true);

  const site = useMemo(() => {
    return SITES_CATALOG.find(s => s.id === selectedSiteId) || SITES_CATALOG[0];
  }, [selectedSiteId]);

  // Physics-Informed Neural Network (PINN) Thermodynamic & Radio Calculation Model
  const simulation = useMemo(() => {
    const trafficRatio = trafficLoadPct / 100;
    const isAutonomous = optimizationMode === 'autonomous';
    const isPeakShaving = optimizationMode === 'peak_shaving';

    // 1. Radio Frequency Subsystem Power (BBU + RRU/AAU)
    // Base static BBU power
    const bbuPowerKw = 0.45;
    // Dynamic RF transmission power based on traffic load & sleep depth
    let carrierSleepEfficiency = 0;
    let sleepState = 'Normal Operational';
    let activeCarriers = '4 / 4 Band (900/1800/2100/2300 MHz)';

    if (isAutonomous) {
      if (trafficLoadPct <= 25) {
        // Deep micro-sleep on capacity layers (1800 & 2300 MHz off)
        carrierSleepEfficiency = 0.42;
        sleepState = 'Deep Carrier Sleep (2/4 Layers Muted)';
        activeCarriers = '2 / 4 Band Aktif (Coverage 900 + 2100 MHz)';
      } else if (trafficLoadPct <= 50) {
        // Micro-sleep on 2300 MHz TDD
        carrierSleepEfficiency = 0.24;
        sleepState = 'Symbol & Micro-Sleep (1/4 Layer Muted)';
        activeCarriers = '3 / 4 Band Aktif (900/1800/2100 MHz)';
      } else {
        // Light sleep in guard intervals
        carrierSleepEfficiency = 0.08;
        sleepState = 'Adaptive Symbol Muting';
      }
    } else if (isPeakShaving) {
      carrierSleepEfficiency = 0.35;
      sleepState = 'Peak-Shaving Carrier Throttling';
      activeCarriers = '2 / 4 Band Aktif (Low-Carbon Mode)';
    }

    const unoptimizedRfKw = site.baselinePowerKw * 0.58 * (0.4 + 0.6 * trafficRatio);
    const rfPowerKw = Math.max(0.8, unoptimizedRfKw * (1 - carrierSleepEfficiency));

    // 2. Thermodynamic & HVAC Inverter Cooling Load
    // PINN heat dissipation formula: Heat_Gen = Total_Elec * 0.85
    // Delta Temp to outdoor ambient drives heat influx through cabinet wall
    const targetInternalTempC = 25.0;
    const deltaT = Math.max(0, ambientTempC - targetInternalTempC);
    
    // Inverter COP (Coefficient of Performance) varies between 3.2 and 4.2
    const cop = isAutonomous ? 4.1 : 3.4; // PINN dynamic inverter modulation optimizes COP
    const internalHeatKw = (bbuPowerKw + rfPowerKw) * 0.82;
    const cabinetConductanceKw = deltaT * 0.045; // thermal ingress
    const totalThermalLoadKw = internalHeatKw + cabinetConductanceKw;
    
    // Inverter compressor electrical power required
    const hvacPowerKw = isAutonomous && ambientTempC < 27.0
      ? 0.15 // Free cooling fan active
      : Math.max(0.35, totalThermalLoadKw / cop);

    const cabinetInternalTempC = Number((targetInternalTempC + (deltaT * 0.08) + (trafficRatio * 0.7) - (isAutonomous ? 0.6 : 0)).toFixed(1));

    // 3. Rectifier & Power Conversion (AC-DC efficiency ~96.2%)
    const dcLoadKw = bbuPowerKw + rfPowerKw + 0.12; // aux sensors
    const rectifierEfficiency = 0.962;
    const rectifierLossKw = dcLoadKw * (1 - rectifierEfficiency);

    // 4. BESS Battery Dispatch
    let bessDischargeKw = 0;
    let bessStatus = 'Float Standby (SoC 84%)';
    if (isPeakShaving) {
      bessDischargeKw = Math.min(2.0, dcLoadKw * 0.5);
      bessStatus = 'Active Peak-Shaving Discharge (-2.0 kW)';
    }

    // Total Grid AC Power Demand
    const totalGridPowerKw = Math.max(0.5, (dcLoadKw + rectifierLossKw + hvacPowerKw) - bessDischargeKw);
    const baselineCurrentKw = site.baselinePowerKw * (0.65 + 0.35 * trafficRatio) + (deltaT * 0.09);
    const powerSavedKw = Math.max(0, baselineCurrentKw - totalGridPowerKw);
    const powerSavedPct = ((powerSavedKw / baselineCurrentKw) * 100).toFixed(1);

    // Power Usage Effectiveness (PUE)
    const pue = (totalGridPowerKw / Math.max(0.1, dcLoadKw)).toFixed(2);

    // Hourly cost & carbon
    const tariffRate = site.plnTariff.includes('2.250') ? 2250 : site.plnTariff.includes('1.444') ? 1444 : 1114;
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
  }, [site, trafficLoadPct, ambientTempC, optimizationMode]);

  return (
    <div className="space-y-6">
      {/* Executive Operational Header */}
      <header className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-6 md:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs font-bold text-emerald-800 dark:text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>DIGITAL TWIN LIVE TELEMETRY • TELEMETRI BTS FISIK 15-DETIK</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Digital Twin Sub-Sistem BTS & Model Termodinamika
            </h1>
            <p className="max-w-3xl text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Model fisik-digital (Physics-Informed Neural Network) yang mereplikasi interaksi dinamis antara beban RF 4G/5G, disipasi panas kabinet, kompresor inverter pendingin, dan efisiensi konversi daya rectifier di site Telkomsel secara real-time.
            </p>
          </div>

          {/* Quick Stats Banner */}
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/70 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Efisiensi Daya Site</div>
              <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <TrendingDown className="h-5 w-5" />
                <span>-{simulation.powerSavedPct}%</span>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">PUE Real-Time</div>
              <div className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-1">
                <Gauge className="h-5 w-5 text-sky-500" />
                <span>{simulation.pue}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Site Selector Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4 text-[#ED0226]" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Pilih Site Digital Twin:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SITES_CATALOG.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSiteId(s.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  selectedSiteId === s.id
                    ? 'bg-[#ED0226] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span>{s.id}</span>
                <span className="text-[10px] opacity-80 font-normal hidden sm:inline">({s.name.split(' - ')[0]})</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Interactive Simulation Controls Console */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="h-5 w-5 text-[#ED0226]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Konsol Parameter Dinamis Lapangan & Cuaca
            </h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Mengubah parameter langsung mengkalkulasi ulang disipasi panas & konsumsi daya
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Slider 1: Traffic Load */}
          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Radio className="h-4 w-4 text-sky-500" />
                Beban Trafik PRB (RAN)
              </span>
              <span className="font-mono font-bold text-sky-600 dark:text-sky-400 text-sm">{trafficLoadPct}%</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="100" 
              value={trafficLoadPct}
              onChange={(e) => setTrafficLoadPct(Number(e.target.value))}
              className="w-full accent-[#ED0226] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Off-Peak (10%)</span>
              <span>Median (50%)</span>
              <span>Peak Hour (100%)</span>
            </div>
          </div>

          {/* Slider 2: Ambient Temperature */}
          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Thermometer className="h-4 w-4 text-amber-500" />
                Suhu Udara Luar (Ambient)
              </span>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-sm">{ambientTempC.toFixed(1)}°C</span>
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
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Sejuk (24°C)</span>
              <span>Tropis Normal (31°C)</span>
              <span>Panas Ekstrem (38°C)</span>
            </div>
          </div>

          {/* Optimization Mode Switcher */}
          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Strategi Kendali Energi Digital Twin
            </span>
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              <button
                onClick={() => setOptimizationMode('autonomous')}
                className={`p-2 rounded-lg text-center text-[11px] font-bold transition cursor-pointer ${
                  optimizationMode === 'autonomous'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                O-RAN AI (PINN)
              </button>
              <button
                onClick={() => setOptimizationMode('peak_shaving')}
                className={`p-2 rounded-lg text-center text-[11px] font-bold transition cursor-pointer ${
                  optimizationMode === 'peak_shaving'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                Peak-Shaving
              </button>
              <button
                onClick={() => setOptimizationMode('manual')}
                className={`p-2 rounded-lg text-center text-[11px] font-bold transition cursor-pointer ${
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

      {/* Subsystem Telemetry Cards: 4 Physical Layers */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Subsystem 1: RAN Radio (RRU & AAU) */}
        <article className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-5 shadow-xs space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 flex items-center gap-1">
                <Radio className="h-3.5 w-3.5" /> Radio RF & BBU
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                O1 Polled
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {(simulation.bbuPowerKw + simulation.rfPowerKw).toFixed(2)} <span className="text-sm font-semibold text-slate-500">kW</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {simulation.sleepState}
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-slate-500">
            <div className="flex justify-between">
              <span>BBU Baseband:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{simulation.bbuPowerKw} kW</span>
            </div>
            <div className="flex justify-between">
              <span>RF TRX Transmission:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{simulation.rfPowerKw} kW</span>
            </div>
            <div className="text-[10px] text-sky-600 dark:text-sky-400 pt-1">
              {simulation.activeCarriers}
            </div>
          </div>
        </article>

        {/* Subsystem 2: HVAC Inverter & Thermal PINN */}
        <article className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-5 shadow-xs space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <Wind className="h-3.5 w-3.5" /> HVAC Pendingin (PINN)
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                COP {simulation.cop}
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {simulation.hvacPowerKw} <span className="text-sm font-semibold text-slate-500">kW</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <Thermometer className="h-4 w-4 text-emerald-500" />
              <span className="font-bold text-slate-800 dark:text-slate-200">Suhu Kabinet: {simulation.cabinetInternalTempC}°C</span>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-slate-500">
            <div className="flex justify-between">
              <span>Ambang Batas Maks:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">30.0°C</span>
            </div>
            <div className="flex justify-between">
              <span>Disipasi Panas Total:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{((simulation.bbuPowerKw + simulation.rfPowerKw) * 0.82).toFixed(2)} kWth</span>
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 pt-1">
              Status Termal: Aman (Thermal Margin +{(30.0 - simulation.cabinetInternalTempC).toFixed(1)}°C)
            </div>
          </div>
        </article>

        {/* Subsystem 3: AC-DC Rectifier Conversion */}
        <article className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-5 shadow-xs space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1">
                <Zap className="h-3.5 w-3.5" /> Rectifier AC/DC
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                96.2% Eff
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              -48.2 <span className="text-sm font-semibold text-slate-500">VDC</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              4x Module Rectifier 50A Paralel
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-slate-500">
            <div className="flex justify-between">
              <span>Tegangan PLN AC:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">221 VAC / 50Hz</span>
            </div>
            <div className="flex justify-between">
              <span>Konversi Rugi-Rugi:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{simulation.rectifierLossKw} kW</span>
            </div>
            <div className="text-[10px] text-purple-600 dark:text-purple-400 pt-1">
              Harmonik THD: &lt; 3.0% (Sesuai Standar IEEE 519)
            </div>
          </div>
        </article>

        {/* Subsystem 4: BESS Battery & Energy Storage */}
        <article className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-5 shadow-xs space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <BatteryCharging className="h-3.5 w-3.5" /> BESS LiFePO4
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                SoH 98.6%
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {simulation.bessDischargeKw > 0 ? `-${simulation.bessDischargeKw}` : '0.00'} <span className="text-sm font-semibold text-slate-500">kW</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {simulation.bessStatus}
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-slate-500">
            <div className="flex justify-between">
              <span>Kapasitas String:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{site.bessCapacity.split(' (')[0]}</span>
            </div>
            <div className="flex justify-between">
              <span>Autonomous Autonomy:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">4.2 Jam</span>
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 pt-1">
              Siklus Baterai: 342 / 4.000 Cycle
            </div>
          </div>
        </article>
      </section>

      {/* Energy Balance & Cost Impact Reconciliation Bar */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-6 shadow-xs">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Layers className="h-4 w-4 text-[#ED0226]" />
          Rekapitulasi Konsumsi Daya AC & Dampak Finansial Langsung
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400">Daya Beban Grid Total Saat Ini</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {simulation.totalGridPowerKw} <span className="text-sm font-normal text-slate-500">kW</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              Baseline tanpa optimasi: {simulation.baselineCurrentKw} kW
            </div>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-xl border border-emerald-200/80 dark:border-emerald-800/50">
            <div className="text-xs text-emerald-800 dark:text-emerald-300">Daya Dihindari (Saved)</div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {simulation.powerSavedKw} <span className="text-sm font-normal text-emerald-600/70">kW</span>
            </div>
            <div className="text-[10px] text-emerald-700 dark:text-emerald-300 mt-1">
              Efisiensi aktif sebesar -{simulation.powerSavedPct}%
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400">Penghematan Biaya Listrik PLN</div>
            <div className="text-2xl font-black text-sky-600 dark:text-sky-400 mt-1">
              Rp {simulation.savingsPerHourIdr.toLocaleString('id-ID')} <span className="text-xs font-normal text-slate-500">/ jam</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              Tarif {site.plnTariff}
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400">Reduksi Karbon Emisi Scope 2</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {(simulation.powerSavedKw * 0.87).toFixed(2)} <span className="text-xs font-normal text-slate-500">kgCO₂e / jam</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              Faktor ESDM Jamali 0,87 kgCO₂e/kWh
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}