// Forecasting is disabled until site-level inputs, cost quotes, and scenarios are validated.
export function runMonteCarloSimulation() {
  return {
    status: 'NOT_CALCULATED', reason: 'Belum ada input terverifikasi untuk simulasi probabilistik.',
    p5: null, p50: null, p95: null, mean: null, probabilityPositive: null, histogram: []
  };
}
