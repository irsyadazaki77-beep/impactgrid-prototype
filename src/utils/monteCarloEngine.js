// Probabilistic Risk Engine using Seeded PRNG & Box-Muller Transformation.
// Dual-Mode Architecture:
// 1. 'STRICT_AUDIT' (default): returns NOT_CALCULATED to honor unmeasured state.
// 2. 'PARAMETRIC_SANDBOX': runs 1000-iteration deterministic Monte Carlo simulation.

/**
 * Seeded Pseudo-Random Number Generator using Mulberry32.
 * Produces deterministic 32-bit float between 0 and 1.
 *
 * @param {number} seed
 * @returns {() => number}
 */
export function createSeededRandom(seed = 20260324) {
  let a = seed >>> 0;
  return function mulberry32() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Samples from Gaussian Normal Distribution N(mean, stdDev^2)
 * using the Box-Muller transform with the provided deterministic PRNG.
 *
 * @param {() => number} rng
 * @param {number} mean
 * @param {number} stdDev
 * @returns {number}
 */
export function sampleNormal(rng, mean, stdDev) {
  let u1 = rng();
  let u2 = rng();
  // Avoid log(0)
  while (u1 === 0) u1 = rng();
  while (u2 === 0) u2 = rng();

  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return mean + z0 * stdDev;
}

/**
 * Runs Monte Carlo NPV Simulation.
 *
 * @param {Object} [params]
 * @param {'STRICT_AUDIT'|'PARAMETRIC_SANDBOX'} [params.simulationMode]
 * @param {number} [params.iterations=1000]
 * @param {number} [params.seed=20260324]
 * @param {number} [params.siteCount=40]
 * @param {number} [params.avgSiteAnnualKWh=42000]
 * @param {number} [params.targetEfficiencyPct=8.5]
 * @param {number} [params.tariffPerKWh=1500]
 * @param {number} [params.discountRate=0.10]
 * @param {number} [params.capexPerSiteIDR=25000000]
 * @param {number} [params.annualOpexPerSiteIDR=2500000]
 * @param {boolean} [params.emergencyActive=false]
 * @param {string} [params.scenarioKey='normal']
 * @returns {Object}
 */
export function runMonteCarloSimulation(params = {}) {
  if (!params || params.simulationMode !== 'PARAMETRIC_SANDBOX') {
    return {
      status: 'NOT_CALCULATED',
      dataClassification: 'NOT_MEASURED',
      reason: 'Belum ada input terverifikasi untuk simulasi probabilistik.',
      p5: null,
      p50: null,
      p95: null,
      mean: null,
      probabilityPositive: null,
      histogram: [],
    };
  }

  const iterations = params.iterations || 1000;
  const seed = params.seed || 20260324;
  const rng = createSeededRandom(seed);

  const siteCount = params.siteCount || 40;
  const avgSiteAnnualKWh = params.avgSiteAnnualKWh || 42000;
  const targetEfficiencyPct = params.targetEfficiencyPct ?? 8.5;
  const tariffPerKWh = params.tariffPerKWh || 1500;
  const discountRate = params.discountRate ?? 0.10;
  const capexPerSiteIDR = params.capexPerSiteIDR ?? 25000000;
  const annualOpexPerSiteIDR = params.annualOpexPerSiteIDR ?? 2500000;
  const isEmergency = Boolean(params.emergencyActive) || params.scenarioKey === 'emergency';

  const totalCapexIDR = siteCount * capexPerSiteIDR;
  const annualOpexIDR = siteCount * annualOpexPerSiteIDR;

  const baseEfficiency = isEmergency ? 0 : targetEfficiencyPct;

  const npvList = new Float64Array(iterations);

  for (let i = 0; i < iterations; i++) {
    // Stochastic variations
    // 1. Efficiency realization: normal distribution with mean baseEfficiency, 20% relative std dev, capped at min 0%
    const effPct = Math.max(0, sampleNormal(rng, baseEfficiency, baseEfficiency * 0.20));

    // 2. Load & Tariff stochastic factor: normal around 1.0 with 8% std dev
    const loadFactor = Math.max(0.5, sampleNormal(rng, 1.0, 0.08));

    const annualBaselineKWh = siteCount * avgSiteAnnualKWh * loadFactor;
    const energySavedKWh = annualBaselineKWh * (effPct / 100);
    const grossSavingsIDR = energySavedKWh * tariffPerKWh;
    const netCashflowIDR = grossSavingsIDR - annualOpexIDR;

    // 5-year discounted cashflow
    let dcfSum = 0;
    for (let t = 1; t <= 5; t++) {
      dcfSum += netCashflowIDR / Math.pow(1 + discountRate, t);
    }
    const npv = -totalCapexIDR + dcfSum;
    npvList[i] = npv;
  }

  // Sort ascending for percentile calculation
  npvList.sort();

  const p5Index = Math.floor(iterations * 0.05);
  const p50Index = Math.floor(iterations * 0.50);
  const p95Index = Math.floor(iterations * 0.95);

  const p5 = Math.round(npvList[p5Index]);
  const p50 = Math.round(npvList[p50Index]);
  const p95 = Math.round(npvList[p95Index]);

  let sum = 0;
  let positiveCount = 0;
  for (let i = 0; i < iterations; i++) {
    sum += npvList[i];
    if (npvList[i] > 0) positiveCount++;
  }
  const mean = Math.round(sum / iterations);
  const probabilityPositive = Number(((positiveCount / iterations) * 100).toFixed(1));

  // Generate 20-bin histogram
  const minNpv = npvList[0];
  const maxNpv = npvList[iterations - 1];
  const binCount = 20;
  const binWidth = (maxNpv - minNpv) / binCount || 1;

  const bins = Array.from({ length: binCount }, (_, idx) => {
    const minIDR = minNpv + idx * binWidth;
    const maxIDR = minIDR + binWidth;
    const midIDR = (minIDR + maxIDR) / 2;
    return {
      binIndex: idx,
      label: `Rp ${Math.round(midIDR / 1_000_000).toLocaleString('id-ID')}M`,
      minIDR: Math.round(minIDR),
      maxIDR: Math.round(maxIDR),
      midIDR: Math.round(midIDR),
      count: 0,
      percentage: 0,
    };
  });

  for (let i = 0; i < iterations; i++) {
    const val = npvList[i];
    let binIdx = Math.floor((val - minNpv) / binWidth);
    if (binIdx >= binCount) binIdx = binCount - 1;
    if (binIdx < 0) binIdx = 0;
    bins[binIdx].count++;
  }

  for (let b = 0; b < binCount; b++) {
    bins[b].percentage = Number(((bins[b].count / iterations) * 100).toFixed(1));
  }

  return {
    status: 'SIMULATED_PARAMETRIC',
    dataClassification: 'PARAMETRIC_PROJECTION',
    iterations,
    seed,
    p5,
    p50,
    p95,
    mean,
    probabilityPositive,
    histogram: bins,
  };
}

export default runMonteCarloSimulation;
