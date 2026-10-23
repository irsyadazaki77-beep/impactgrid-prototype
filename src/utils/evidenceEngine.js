// Evidence calculation is unavailable until verified pilot data exists.
const PENDING = null;

export function calculateDiDMetrics() {
  return {
    meta: { dataClassification: 'DATA_NOT_AVAILABLE', standard: 'Metode evaluasi perlu disepakati sebelum pilot', interventionCount: PENDING, controlCount: PENDING },
    preTrendTest: { diffPct: PENDING, passed: PENDING, verdict: 'Belum ada data pra-intervensi untuk diuji.' },
    unadjustedDelta: { interventionKWh: PENDING, interventionPct: PENDING, controlKWh: PENDING, controlPct: PENDING },
    didResults: {
      isolatedEnergySavedKWh: PENDING, confidenceInterval95: PENDING, standardErrorKWh: PENDING, tStatistic: PENDING,
      pValue: PENDING, isSignificant: PENDING, isolatedEmissionsReducedTon: PENDING, grossFinancialSavingsIDR: PENDING,
      netAnnualBenefitIDR: PENDING, totalCapExIDR: PENDING, paybackYears: PENDING, npv5YearsIDR: PENDING,
      avgLatencyDeltaMs: PENDING, avgSlaAvailabilityPct: PENDING, emergency112ProtectionPct: PENDING
    }
  };
}

export function evaluateExecutiveDecisionGates() {
  const titles = ['Integritas dan kelengkapan data', 'Perubahan konsumsi energi', 'Kelayakan finansial', 'Mutu layanan dan keselamatan jaringan'];
  return {
    gates: titles.map((title, index) => ({
      id: 'gate-' + (index + 1), title, metric: 'Belum tersedia', standard: 'Perlu disepakati pemilik fungsi',
      threshold: 'Belum ditetapkan', actual: 'Belum ada bukti', status: 'PENDING'
    })),
    overall: {
      recommendation: 'PENDING', badgeColor: 'amber',
      rationale: 'Belum ada bukti yang cukup untuk memberi rekomendasi lanjut atau tidak lanjut.',
      decisionStatusDate: null
    }
  };
}
