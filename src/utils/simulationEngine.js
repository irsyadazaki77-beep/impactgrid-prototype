// Centralized Simulation Engine and Reactive State Hub
// Synchronizes Overview, Digital Twin, Agent Orchestrator, Telemetry, Scenario Lab, Optimization, Financial, and ESG

export const DEFAULT_SIM_CONFIG = {
  seed: 2026,
  simHour: 14,
  simTimeString: '14:00 WIB',
  scenarioKey: 'normal',
  tempC: 28,
  trafficMultiplier: 1.0,
  carrierSleepActive: true,
  plnTariffIDR: 1500,
  emergencyActive: false,
  solarIrradianceW: 850,
  batterySoC: 92,
  forcedBtsOutageId: null, // e.g. site id experiencing power/grid cut
  coolingMode: 'ECO_SMART', // 'ECO_SMART' | 'MAX_COOLING' | 'ISLANDING'
  activeScale: 'pilot' // 'pilot' | 'regional' | 'national'
};

export const SIMULATION_PRESETS = {
  normal: {
    id: 'normal',
    name: 'Operasi Normal 24 Jam (Hari Kerja Standar)',
    shortName: '🟢 Normal 24 Jam',
    tempC: 28,
    trafficMultiplier: 1.0,
    carrierSleepActive: true,
    plnTariffIDR: 1500,
    emergencyActive: false,
    coolingMode: 'ECO_SMART',
    color: 'emerald',
    description: 'Siklus operasi normal: off-peak jam 01-05 WIB memanfaatkan sleep mode, peak jam 19-21 WIB seluruh kapasitas aktif.'
  },
  heatwave: {
    id: 'heatwave',
    name: 'Gelombang Panas Ekstrem (BMKG 36°C Heatwave)',
    shortName: '☀️ Heatwave 36°C',
    tempC: 36,
    trafficMultiplier: 1.15,
    carrierSleepActive: true,
    plnTariffIDR: 1500,
    emergencyActive: false,
    coolingMode: 'MAX_COOLING',
    color: 'amber',
    description: 'Beban pendingin shelter naik +35%. AI mengaktifkan dynamic setpoint 26°C dan optimasi airflow untuk mencegah kompresor trip.'
  },
  mudik: {
    id: 'mudik',
    name: 'Lonjakan Mudik Lebaran / Pantura (+250% Trafik)',
    shortName: '🚗 Mudik Pantura +250%',
    tempC: 30,
    trafficMultiplier: 2.5,
    carrierSleepActive: false, // Bypass sleep mode
    plnTariffIDR: 1500,
    emergencyActive: false,
    coolingMode: 'ECO_SMART',
    color: 'blue',
    description: 'Koridor Trans-Jawa & Pantura mengalami lonjakan trafik masif. Seluruh sleep mode di-bypass otomatis demi menjamin zero drop call.'
  },
  pln_peak: {
    id: 'pln_peak',
    name: 'PLN Waktu Beban Puncak (WBP Tarif Rp1.950/kWh)',
    shortName: '⚡ PLN Tarif WBP',
    tempC: 29,
    trafficMultiplier: 1.2,
    carrierSleepActive: true,
    plnTariffIDR: 1950,
    emergencyActive: false,
    coolingMode: 'ECO_SMART',
    color: 'purple',
    description: 'Jam 17:00 - 22:00 tarif listrik PLN naik 30%. Sistem memprioritaskan pemakaian baterai BESS dan penghematan agresif.'
  },
  blackout_sumatera: {
    id: 'blackout_sumatera',
    name: 'Blackout Transmisi PLN Sumatera (Grid Collapse Islanding)',
    shortName: '⚠️ Blackout PLN Grid',
    tempC: 31,
    trafficMultiplier: 0.9,
    carrierSleepActive: true,
    plnTariffIDR: 0,
    emergencyActive: false,
    coolingMode: 'ISLANDING',
    color: 'amber',
    description: 'Grid PLN terputus total. Shelter otomatis isolasi (islanding), beralih ke baterai LiFePO4 & solar hybrid, membatasi beban radio non-esensial.'
  },
  emergency: {
    id: 'emergency',
    name: 'Tanggap Darurat Bencana (Gempa / Panggilan 112)',
    shortName: '🚨 Darurat 112 Drill',
    tempC: 27,
    trafficMultiplier: 3.0,
    carrierSleepActive: false, // Strict bypass
    plnTariffIDR: 1500,
    emergencyActive: true,
    coolingMode: 'MAX_COOLING',
    color: 'red',
    description: 'Kanal darurat 112 menerima lonjakan prioritas. Fast-wakeup 120ms aktif, seluruh layer frekuensi dihidupkan 100% tanpa kompromi efisiensi.'
  }
};

// Compute dynamic telemetry and metrics derived from central simulation state
export function deriveSimulationMetrics(simState) {
  const isOffPeak = simState.simHour >= 1 && simState.simHour <= 5;
  const isPeak = simState.simHour >= 18 && simState.simHour <= 21;

  // Traffic load scaling factor
  let baseHourlyLoad = 0.65;
  if (isOffPeak) baseHourlyLoad = 0.25;
  if (isPeak) baseHourlyLoad = 0.95;

  const currentTrafficLoad = Math.min(1.0, Math.max(0.1, baseHourlyLoad * simState.trafficMultiplier));

  // Shelter Temperature factor
  const coolingDemandFactor = 1.0 + Math.max(0, (simState.tempC - 26) * 0.04);

  // Power Consumption Model (kW per BTS average)
  // Baseline without AI: ~3.8 kW - 5.2 kW
  const baselineKwPerBts = (3.5 + (currentTrafficLoad * 1.5)) * coolingDemandFactor;

  // Optimized with AI:
  // Carrier sleep gives up to 35% reduction on off-peak, ~12% on average
  let savingsRatio = 0.101; // 10.1% baseline DiD
  if (simState.carrierSleepActive && !simState.emergencyActive) {
    if (isOffPeak) savingsRatio = 0.285;
    else if (isPeak) savingsRatio = 0.065;
    else savingsRatio = 0.125;
  } else {
    // If emergency or carrier sleep disabled, savings dropped to shelter cooling only ~3%
    savingsRatio = 0.032;
  }

  const optimizedKwPerBts = baselineKwPerBts * (1 - savingsRatio);
  const deltaKwPerBts = Math.max(0, baselineKwPerBts - optimizedKwPerBts);

  // Scale calculations (40 pilot sites, 5,000 regional, 10,000 national)
  const numSites = simState.activeScale === 'national' ? 10000 : simState.activeScale === 'regional' ? 5000 : 40;
  const currentTotalKwBaseline = baselineKwPerBts * numSites;
  const currentTotalKwOptimized = optimizedKwPerBts * numSites;
  const currentTotalKwSaved = currentTotalKwBaseline - currentTotalKwOptimized;

  // Hourly cost at current PLN tariff
  const costPerHourBaseline = (currentTotalKwBaseline * simState.plnTariffIDR);
  const costPerHourOptimized = (currentTotalKwOptimized * simState.plnTariffIDR);
  const hourlySavingsIDR = costPerHourBaseline - costPerHourOptimized;

  // Carbon factor (0.78 kg CO2 / kWh grid Jamali)
  const hourlyCo2SavedKg = currentTotalKwSaved * 0.78;

  // SLA & Latency impact
  let avgLatencyDeltaMs = 0.8;
  if (simState.emergencyActive) {
    avgLatencyDeltaMs = 0.0; // 0ms penalty in full emergency bypass
  } else if (isOffPeak && simState.carrierSleepActive) {
    avgLatencyDeltaMs = 1.6; // slightly higher during deep sleep off-peak
  }

  return {
    isOffPeak,
    isPeak,
    currentTrafficLoadPct: Math.round(currentTrafficLoad * 100),
    coolingDemandFactor: +coolingDemandFactor.toFixed(2),
    baselineKwPerBts: +baselineKwPerBts.toFixed(2),
    optimizedKwPerBts: +optimizedKwPerBts.toFixed(2),
    savingsRatioPct: +(savingsRatio * 100).toFixed(1),
    numSites,
    currentTotalKwBaseline: Math.round(currentTotalKwBaseline),
    currentTotalKwOptimized: Math.round(currentTotalKwOptimized),
    currentTotalKwSaved: Math.round(currentTotalKwSaved),
    hourlySavingsIDR: Math.round(hourlySavingsIDR),
    hourlyCo2SavedKg: Math.round(hourlyCo2SavedKg),
    avgLatencyDeltaMs: +avgLatencyDeltaMs.toFixed(2)
  };
}
