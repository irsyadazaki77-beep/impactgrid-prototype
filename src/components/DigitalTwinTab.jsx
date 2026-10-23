import React, { useState, useMemo } from 'react';
import { 
  Cpu, 
  Radio, 
  Zap, 
  Thermometer, 
  BatteryCharging, 
  Sun, 
  Sliders, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Activity, 
  Layers, 
  ArrowRight, 
  Info,
  Server,
  Wind,
  Flame,
  Power
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export default function DigitalTwinTab({
  simState = { simHour: 14, tempC: 28, trafficMultiplier: 1.0, carrierSleepActive: true, emergencyActive: false },
  emergencyState = { active: false }
}) {
  // BTS Archetype presets
  const [selectedSiteKey, setSelectedSiteKey] = useState('CGK-401');

  const btsArchetypes = {
    'CGK-401': {
      name: 'CGK-401: Bandara Soekarno-Hatta Macro Hub',
      type: 'Urban Macro 5-Band Massive MIMO',
      vendor: 'Ericsson Radio System (AIR 6449)',
      lat: -6.1275,
      lng: 106.6537,
      baseLoadWatts: 4200,
      carriers: [
        { id: 'c700', band: 'B28 (700 MHz)', role: 'Ultra-Coverage & IoT', powerWatts: 350, locked: true, state: 'ACTIVE' },
        { id: 'c900', band: 'B8 (900 MHz)', role: 'Base LTE & Voice VolTE', powerWatts: 450, locked: true, state: 'ACTIVE' },
        { id: 'c1800', band: 'B3 (1800 MHz)', role: 'Primary Data MIMO 4T4R', powerWatts: 720, locked: false, state: 'MICRO_SLEEP' },
        { id: 'c2100', band: 'B1 (2100 MHz)', role: 'Capacity Layer MIMO 4T4R', powerWatts: 780, locked: false, state: 'SHALLOW_SLEEP' },
        { id: 'c2300', band: 'n40 (2300 MHz)', role: 'Massive MIMO 64T64R (5G TDD)', powerWatts: 1400, locked: false, state: 'DEEP_SLEEP' },
      ],
      coolingType: 'Dual Precision Inverter HVAC with Free-Cooling Damper',
      solarInstalledKWp: 4.8,
      batteryCapacityKWh: 19.2,
      batterySoC: 94
    },
    'JKT-102': {
      name: 'JKT-102: Sudirman CBD High-Density Rooftop',
      type: 'Dense Urban High-Rise Rooftop',
      vendor: 'Huawei AAU5613 Blade Site',
      lat: -6.2146,
      lng: 106.8184,
      baseLoadWatts: 3850,
      carriers: [
        { id: 'c700', band: 'B28 (700 MHz)', role: 'Indoor Penetration', powerWatts: 320, locked: true, state: 'ACTIVE' },
        { id: 'c900', band: 'B8 (900 MHz)', role: 'Base VoLTE 99.999% SLA', powerWatts: 420, locked: true, state: 'ACTIVE' },
        { id: 'c1800', band: 'B3 (1800 MHz)', role: 'High Capacity 4T4R', powerWatts: 700, locked: false, state: 'ACTIVE' },
        { id: 'c2100', band: 'B1 (2100 MHz)', role: 'Sub-Carrier Capacity', powerWatts: 750, locked: false, state: 'MICRO_SLEEP' },
        { id: 'c2300', band: 'n40 (2300 MHz)', role: 'Massive MIMO 64T64R TDD', powerWatts: 1350, locked: false, state: 'SHALLOW_SLEEP' },
      ],
      coolingType: 'High-COP Inverter AC with Smart Louver Air-Path',
      solarInstalledKWp: 2.4,
      batteryCapacityKWh: 14.4,
      batterySoC: 88
    },
    'SBY-209': {
      name: 'SBY-209: Stasiun Surabaya Gubeng Transit Core',
      type: 'Semi-Urban Core Transport Node',
      vendor: 'ZTE Uni-RAN SDR Platform',
      lat: -7.2654,
      lng: 112.7521,
      baseLoadWatts: 3400,
      carriers: [
        { id: 'c700', band: 'B28 (700 MHz)', role: 'Coverage Backbone', powerWatts: 300, locked: true, state: 'ACTIVE' },
        { id: 'c900', band: 'B8 (900 MHz)', role: 'Primary Voice & Emergency 112', powerWatts: 380, locked: true, state: 'ACTIVE' },
        { id: 'c1800', band: 'B3 (1800 MHz)', role: 'Commuter Data Layer', powerWatts: 650, locked: false, state: 'MICRO_SLEEP' },
        { id: 'c2100', band: 'B1 (2100 MHz)', role: 'Dynamic Carrier Capacity', powerWatts: 710, locked: false, state: 'DEEP_SLEEP' },
        { id: 'c2300', band: 'n40 (2300 MHz)', role: '5G Hotspot 32T32R', powerWatts: 1100, locked: false, state: 'DEEP_SLEEP' },
      ],
      coolingType: 'Precision Dual AC with Phase-Change Thermal Buffer',
      solarInstalledKWp: 3.6,
      batteryCapacityKWh: 16.8,
      batterySoC: 92
    },
    'KLO-508': {
      name: 'KLO-508: Kulon Progo Rural Eco-Green Greenfield',
      type: 'Suburban / Rural Hybrid Eco-Site',
      vendor: 'Nokia AirScale Hybrid Zero-Emission Ready',
      lat: -7.8341,
      lng: 110.1612,
      baseLoadWatts: 2400,
      carriers: [
        { id: 'c700', band: 'B28 (700 MHz)', role: 'Long Range 15km Radius', powerWatts: 350, locked: true, state: 'ACTIVE' },
        { id: 'c900', band: 'B8 (900 MHz)', role: 'Rural VoLTE Connectivity', powerWatts: 400, locked: true, state: 'ACTIVE' },
        { id: 'c1800', band: 'B3 (1800 MHz)', role: 'Local Town Broadband', powerWatts: 600, locked: false, state: 'SHALLOW_SLEEP' },
        { id: 'c2100', band: 'B1 (2100 MHz)', role: 'On-Demand Expansion', powerWatts: 650, locked: false, state: 'DEEP_SLEEP' },
      ],
      coolingType: 'Direct DC Free-Air Cooling + Passive Heat Pipe Chimney',
      solarInstalledKWp: 7.2,
      batteryCapacityKWh: 24.0,
      batterySoC: 98
    }
  };

  const activeSite = btsArchetypes[selectedSiteKey];

  // Carrier Sleep state map: { [carrierId]: 'ACTIVE' | 'SHALLOW_SLEEP' | 'MICRO_SLEEP' | 'DEEP_SLEEP' }
  const [carrierStates, setCarrierStates] = useState({
    c700: 'ACTIVE',
    c900: 'ACTIVE',
    c1800: 'MICRO_SLEEP',
    c2100: 'SHALLOW_SLEEP',
    c2300: 'DEEP_SLEEP'
  });

  // Shelter Environment Controls
  const [shelterThermostatC, setShelterThermostatC] = useState(26); // Safe target 26°C (Proposal baseline)
  const [ambientTempC, setAmbientTempC] = useState(32); // Tropical midday ambient
  const [solarIrradianceW, setSolarIrradianceW] = useState(850); // W/m2 midday sun
  const [trafficLoadPct, setTrafficLoadPct] = useState(28); // 28% off-peak load

  // Synchronize internal state with Central Simulation State
  useEffect(() => {
    if (simState.tempC) {
      setAmbientTempC(simState.tempC);
    }
    if (emergencyState.active || simState.emergencyActive) {
      // Force all carriers ACTIVE for emergency hard-lock
      setCarrierStates({
        c700: 'ACTIVE',
        c900: 'ACTIVE',
        c1800: 'ACTIVE',
        c2100: 'ACTIVE',
        c2300: 'ACTIVE'
      });
      setTrafficLoadPct(95);
    } else if (!simState.carrierSleepActive) {
      setCarrierStates({
        c700: 'ACTIVE',
        c900: 'ACTIVE',
        c1800: 'ACTIVE',
        c2100: 'ACTIVE',
        c2300: 'ACTIVE'
      });
    } else {
      // Normal schedule: off peak vs peak
      const isOffPeak = simState.simHour >= 1 && simState.simHour <= 5;
      if (isOffPeak) {
        setCarrierStates({
          c700: 'ACTIVE',
          c900: 'ACTIVE',
          c1800: 'MICRO_SLEEP',
          c2100: 'SHALLOW_SLEEP',
          c2300: 'DEEP_SLEEP'
        });
        setTrafficLoadPct(22);
      } else {
        setCarrierStates({
          c700: 'ACTIVE',
          c900: 'ACTIVE',
          c1800: 'ACTIVE',
          c2100: 'SHALLOW_SLEEP',
          c2300: 'MICRO_SLEEP'
        });
        setTrafficLoadPct(Math.round(65 * (simState.trafficMultiplier || 1.0)));
      }
    }
  }, [simState.tempC, simState.simHour, simState.trafficMultiplier, simState.carrierSleepActive, simState.emergencyActive, emergencyState.active]);

  // Sleep Power Factors
  const sleepFactors = {
    ACTIVE: 1.0,           // 100% PA power
    SHALLOW_SLEEP: 0.55,   // Bias voltage dropped, fast symbol blanking (-45%)
    MICRO_SLEEP: 0.25,     // Power amplifier disabled during silence intervals (-75%)
    DEEP_SLEEP: 0.08       // Carrier locked down, baseband asleep (-92%)
  };

  // Calculate Radio Power consumption
  const radioPowerWatts = useMemo(() => {
    return activeSite.carriers.reduce((acc, carrier) => {
      const state = carrier.locked ? 'ACTIVE' : (carrierStates[carrier.id] || 'ACTIVE');
      const factor = sleepFactors[state] || 1.0;
      return acc + (carrier.powerWatts * factor);
    }, 0);
  }, [activeSite, carrierStates]);

  const maxRadioPowerWatts = useMemo(() => {
    return activeSite.carriers.reduce((acc, c) => acc + c.powerWatts, 0);
  }, [activeSite]);

  // Rectifier 48V DC conversion efficiency: ~96.5%
  const rectifierLossWatts = Math.round(radioPowerWatts * 0.035);

  // Shelter Thermal physics:
  // Heat dissipation in shelter = Base electronics + Rectifier loss + (1 - antenna radiation efficiency ~ 55%) * radio power
  const heatDissipationWatts = Math.round(500 + rectifierLossWatts + (radioPowerWatts * 0.45));
  
  // HVAC Power calculation:
  // Higher thermostat = less compressor work. Every +1°C saves ~5.2% cooling power.
  // Standard shelter COP ~ 2.8 at 20°C, increases to ~3.4 at 26°C.
  const tempDeltaTo20 = Math.max(0, shelterThermostatC - 20);
  const hvacSavingsFactor = Math.max(0.4, 1 - (tempDeltaTo20 * 0.052));
  const baseHvacWatts = (heatDissipationWatts / 2.8) * (ambientTempC / 30);
  const activeHvacWatts = Math.round(baseHvacWatts * hvacSavingsFactor);

  // Solar generation (kWp * irradiance factor * system efficiency ~ 82%)
  const solarGenWatts = Math.round(activeSite.solarInstalledKWp * (solarIrradianceW / 1000) * 820);

  // Total BTS Power Draw from PLN Grid
  const totalInternalWatts = Math.round(radioPowerWatts + rectifierLossWatts + activeHvacWatts + 250); // 250W auxiliary/lighting/BBU
  const netPlnDrawWatts = Math.max(120, totalInternalWatts - solarGenWatts);

  // Power Usage Effectiveness (PUE)
  const pue = (totalInternalWatts / Math.max(1, radioPowerWatts + 250)).toFixed(2);

  // Energy & OpEx Savings vs Legacy (Legacy: All Active + 20°C AC + 0 Solar)
  const legacyHvacWatts = Math.round((maxRadioPowerWatts * 0.45 + 500) / 2.6);
  const legacyTotalWatts = maxRadioPowerWatts + legacyHvacWatts + 250 + Math.round(maxRadioPowerWatts * 0.04);
  const powerSavedWatts = Math.max(0, legacyTotalWatts - netPlnDrawWatts);
  const efficiencyGainPct = ((powerSavedWatts / legacyTotalWatts) * 100).toFixed(1);
  const annualSavingsIDR = Math.round((powerSavedWatts / 1000) * 24 * 365 * 1500);

  // Cycle carrier state
  const handleToggleCarrierState = (carrierId, locked) => {
    if (locked) return;
    const states = ['ACTIVE', 'SHALLOW_SLEEP', 'MICRO_SLEEP', 'DEEP_SLEEP'];
    const current = carrierStates[carrierId] || 'ACTIVE';
    const nextIdx = (states.indexOf(current) + 1) % states.length;
    setCarrierStates(prev => ({
      ...prev,
      [carrierId]: states[nextIdx]
    }));
  };

  // 24-Hour Digital Twin Power Curve
  const powerCurveData = useMemo(() => {
    return [
      { hour: '00:00', plnLegacy: 4100, plnOptimized: 1850, solar: 0, tempShelter: 26 },
      { hour: '02:00', plnLegacy: 3950, plnOptimized: 1450, solar: 0, tempShelter: 26.2 },
      { hour: '04:00', plnLegacy: 3900, plnOptimized: 1380, solar: 0, tempShelter: 26.1 },
      { hour: '06:00', plnLegacy: 4200, plnOptimized: 1950, solar: 400, tempShelter: 25.8 },
      { hour: '08:00', plnLegacy: 4700, plnOptimized: 2600, solar: 1800, tempShelter: 26 },
      { hour: '10:00', plnLegacy: 4900, plnOptimized: 2850, solar: 3400, tempShelter: 26.3 },
      { hour: '12:00', plnLegacy: 5050, plnOptimized: 2900, solar: 3900, tempShelter: 26.5 },
      { hour: '14:00', plnLegacy: 4950, plnOptimized: 2750, solar: 3600, tempShelter: 26.4 },
      { hour: '16:00', plnLegacy: 4800, plnOptimized: 2900, solar: 2100, tempShelter: 26.1 },
      { hour: '18:00', plnLegacy: 5100, plnOptimized: 3400, solar: 200, tempShelter: 26.0 },
      { hour: '20:00', plnLegacy: 5200, plnOptimized: 3600, solar: 0, tempShelter: 26.0 },
      { hour: '22:00', plnLegacy: 4600, plnOptimized: 2500, solar: 0, tempShelter: 26.1 },
    ];
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-xs font-bold text-cyan-800">
              <Cpu className="w-3.5 h-3.5 text-cyan-600" />
              <span>Cyber-Physical BTS Digital Twin Engine</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
              Digital Twin Fisika BTS & Topologi Seluler Berbasis Carrier (O-RAN O1)
            </h1>
            <p className="text-xs text-slate-600 max-w-3xl leading-relaxed mt-1">
              Simulasi mikroskopik perangkat fisik BTS: mengorkestrasi <strong>dynamic carrier sleep</strong> (700MHz–2.3GHz), termodinamika pendingin shelter AC inverter, aliran daya 48V DC, hingga bauran Rooftop Solar PV & BESS tanpa memicu degradasi sinyal.
            </p>
          </div>

          {/* BTS Archetype Selector */}
          <div className="flex items-center space-x-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 shrink-0">
            {Object.keys(btsArchetypes).map((key) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedSiteKey(key);
                  setCarrierStates({
                    c700: 'ACTIVE',
                    c900: 'ACTIVE',
                    c1800: 'MICRO_SLEEP',
                    c2100: 'SHALLOW_SLEEP',
                    c2300: 'DEEP_SLEEP'
                  });
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedSiteKey === key
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Digital Twin Grid: Tower/Carrier Topo + Shelter Thermodynamics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Radio Frequency & Carrier Level Control (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-red-50 text-red-600 border border-red-100">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    RAN Multi-Band Carrier Sleep Matrix
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    {activeSite.name} • {activeSite.vendor}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                Radio Draw: {Math.round(radioPowerWatts)} W / {maxRadioPowerWatts} W
              </span>
            </div>

            {/* Visual Tower Graphic Representation */}
            <div className="relative p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 text-white overflow-hidden">
              <div className="absolute top-2 right-3 flex items-center space-x-1.5 text-[10px] text-emerald-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>O-RAN O1 TELEMETRY SYNCED</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                {/* Tower Schematic Visual */}
                <div className="flex flex-col items-center justify-center p-3">
                  <div className="w-16 h-20 border-2 border-red-500/70 rounded-t-xl flex flex-col items-center justify-around bg-red-500/10 p-1 relative">
                    <span className="text-[9px] font-bold text-red-300">SECTOR A</span>
                    <Radio className="w-6 h-6 text-red-400 animate-pulse" />
                    <span className="text-[8px] text-slate-400">3-SECTOR RRU</span>
                  </div>
                  <div className="w-2 h-16 bg-slate-700"></div>
                  <div className="w-24 h-8 border-t-2 border-slate-600 bg-slate-800/80 rounded-b-lg flex items-center justify-center text-[9px] font-mono text-slate-300">
                    BBU BASEBAND
                  </div>
                </div>

                {/* Live Real-time Status Readout */}
                <div className="flex-1 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Efisiensi Radio Saat Ini:</span>
                    <span className="font-mono font-black text-emerald-400 text-sm">
                      {((1 - (radioPowerWatts / maxRadioPowerWatts)) * 100).toFixed(1)}% Daya Terpangkas
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${Math.round((radioPowerWatts / maxRadioPowerWatts) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 pt-1 font-mono">
                    <span>Aktif: {Math.round(radioPowerWatts)} W</span>
                    <span>Kapasitas Penuh: {maxRadioPowerWatts} W</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Carrier Control List */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 px-1">
                <span>SPECTRUM BAND & ROLE</span>
                <span>STATUS TIDUR & KONSUMSI DAYA (KLIK UNTUK MENGUBAH)</span>
              </div>

              {activeSite.carriers.map((carrier) => {
                const state = carrier.locked ? 'ACTIVE' : (carrierStates[carrier.id] || 'ACTIVE');
                const factor = sleepFactors[state] || 1.0;
                const currentWatts = Math.round(carrier.powerWatts * factor);

                const stateStyles = {
                  ACTIVE: 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold',
                  SHALLOW_SLEEP: 'bg-amber-50 border-amber-300 text-amber-800 font-bold',
                  MICRO_SLEEP: 'bg-cyan-50 border-cyan-300 text-cyan-800 font-bold',
                  DEEP_SLEEP: 'bg-slate-100 border-slate-300 text-slate-600 font-bold'
                };

                return (
                  <div 
                    key={carrier.id}
                    onClick={() => handleToggleCarrierState(carrier.id, carrier.locked)}
                    className={`p-3 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                      carrier.locked 
                        ? 'bg-slate-50/80 border-slate-200 cursor-not-allowed opacity-90' 
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs cursor-pointer'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-xs text-slate-900">{carrier.band}</span>
                        {carrier.locked && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-bold">
                            LOCKED GUARDBAND 112
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">{carrier.role}</p>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      <div className="text-right">
                        <span className="font-mono text-xs font-bold text-slate-900 block">
                          {currentWatts} W
                        </span>
                        <span className="text-[10px] text-slate-400">
                          dari {carrier.powerWatts} W
                        </span>
                      </div>

                      <span className={`text-[10px] px-2.5 py-1 rounded-xl border ${stateStyles[state]}`}>
                        {state === 'ACTIVE' && '● FULL ACTIVE'}
                        {state === 'SHALLOW_SLEEP' && '◑ SHALLOW SLEEP (-45%)'}
                        {state === 'MICRO_SLEEP' && '◔ MICRO SLEEP (-75%)'}
                        {state === 'DEEP_SLEEP' && '○ DEEP SLEEP (-92%)'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <p className="text-[11px] text-slate-500 italic bg-slate-50 p-3 rounded-xl border border-slate-200">
              💡 <strong>Safety Rule:</strong> Carrier 700 MHz & 900 MHz selalu terkunci <em>Full Active</em> untuk menjamin cakupan wilayah darurat 112 dan zero call drop. Hanya layer kapasitas 1800–2300 MHz yang diatur secara otonom saat trafik rendah.
            </p>
          </div>
        </div>

        {/* Right Column: Shelter Thermodynamics, HVAC & BESS Power (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-100">
                  <Thermometer className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Termodinamika Shelter & Smart AC
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Pendinginan Dinamis & Efisiensi PUE
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                PUE: {pue}
              </span>
            </div>

            {/* Interactive Thermostat Slider */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-800">Target Suhu Thermostat Shelter:</span>
                <span className="font-mono font-extrabold text-base text-red-600 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                  {shelterThermostatC}°C
                </span>
              </div>

              <input 
                type="range"
                min="18"
                max="30"
                step="1"
                value={shelterThermostatC}
                onChange={(e) => setShelterThermostatC(Number(e.target.value))}
                className="w-full accent-red-600 cursor-pointer"
              />

              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>18°C (Konvensional/Boros)</span>
                <span className="text-emerald-700 font-bold">26°C (ImpactGrid Baseline)</span>
                <span>30°C (Batas Termal Maks)</span>
              </div>
            </div>

            {/* Thermal Parameters Metric Box */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-white border border-slate-200 space-y-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Disipasi Panas Shelter</span>
                <span className="font-mono text-base font-extrabold text-amber-600 block">
                  {heatDissipationWatts} W
                </span>
                <span className="text-[10px] text-slate-500">Beban termal perangkat internal</span>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-slate-200 space-y-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Daya Konsumsi AC</span>
                <span className="font-mono text-base font-extrabold text-cyan-700 block">
                  {activeHvacWatts} W
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold">
                  Hemat {Math.round(((legacyHvacWatts - activeHvacWatts) / legacyHvacWatts) * 100)}% vs konvensional
                </span>
              </div>
            </div>

            {/* Hybrid Solar & BESS Power Matrix */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-amber-900 font-extrabold text-xs">
                  <Sun className="w-4 h-4 text-amber-600" />
                  <span>Rooftop Solar PV & LiFePO4 BESS</span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded text-amber-800 border border-amber-200">
                  SoC: {activeSite.batterySoC}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-amber-800 block">Generasi Solar Saat Ini:</span>
                  <span className="font-mono font-black text-amber-900 text-sm">
                    {solarGenWatts} W
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-amber-800 block">Kapasitas Baterai BESS:</span>
                  <span className="font-mono font-black text-amber-900 text-sm">
                    {activeSite.batteryCapacityKWh} kWh
                  </span>
                </div>
              </div>
            </div>

            {/* Net PLN Draw & Total Summary */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Total Tarikan Daya Listrik PLN:</span>
                <span className="font-mono font-black text-lg text-emerald-400">
                  {netPlnDrawWatts} W
                </span>
              </div>

              <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-800">
                <span className="text-slate-400">Potensi Hemat Tahunan (Per Site):</span>
                <span className="font-mono font-bold text-white">
                  Rp {(annualSavingsIDR / 1000000).toFixed(1)} Juta / Tahun
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 24-Hour Digital Twin Power Simulation Chart */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>Simulasi Kurva Beban Daya 24 Jam (Legacy vs ImpactGrid Autonomous)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Menunjukkan fenomena *Peak Shaving* saat malam hari dan bauran Solar PV saat siang hari
            </p>
          </div>
          <div className="flex items-center space-x-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span> Legacy Konvensional
            </span>
            <span className="flex items-center gap-1.5 text-emerald-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> ImpactGrid AI Shaved
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={powerCurveData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
              <YAxis unit=" W" tick={{ fontSize: 11 }} />
              <Tooltip 
                formatter={(value) => [`${value} Watt`, '']}
                contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
              />
              <Area type="monotone" dataKey="plnLegacy" name="Beban Listrik Legacy" stroke="#94a3b8" fill="#e2e8f0" fillOpacity={0.6} />
              <Area type="monotone" dataKey="plnOptimized" name="ImpactGrid Shaved" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
