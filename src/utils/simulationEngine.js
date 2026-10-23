// Conceptual scenarios only. This module has no connection to operational systems.
export const DEFAULT_SIM_CONFIG = {
  simHour: null, scenarioKey: 'illustrative', tempC: null, trafficMultiplier: null,
  carrierSleepActive: null, plnTariffIDR: null, emergencyActive: null,
  activeScale: null, dataClassification: 'SYNTHETIC'
};

export const SIMULATION_PRESETS = {
  normal: { id: 'normal', name: 'Skenario ilustratif normal', shortName: 'Ilustrasi normal', dataClassification: 'SYNTHETIC', description: 'Parameter untuk diskusi; bukan data operasi.' },
  heatwave: { id: 'heatwave', name: 'Skenario ilustratif suhu tinggi', shortName: 'Ilustrasi suhu tinggi', dataClassification: 'SYNTHETIC', description: 'Bukan prakiraan cuaca atau model kinerja perangkat.' },
  mudik: { id: 'mudik', name: 'Skenario ilustratif lonjakan trafik', shortName: 'Ilustrasi trafik', dataClassification: 'SYNTHETIC', description: 'Bukan profil trafik atau uji layanan aktual.' },
  pln_peak: { id: 'pln_peak', name: 'Skenario ilustratif perubahan biaya energi', shortName: 'Ilustrasi biaya', dataClassification: 'SYNTHETIC', description: 'Tarif dan kontrak aktual belum tersedia.' },
  blackout_sumatera: { id: 'blackout_sumatera', name: 'Skenario ilustratif gangguan listrik', shortName: 'Ilustrasi gangguan', dataClassification: 'SYNTHETIC', description: 'Tidak memodelkan atau menguji islanding dan daya cadangan.' },
  emergency: { id: 'emergency', name: 'Skenario ilustratif kebutuhan keselamatan', shortName: 'Ilustrasi keselamatan', dataClassification: 'SYNTHETIC', description: 'Tidak menguji QoS, latency, rollback, atau layanan darurat.' }
};

export function deriveSimulationMetrics() {
  return {
    dataClassification: 'NOT_MEASURED', energySavedKWh: null, costSavingsIDR: null,
    emissionsAvoidedTon: null, qosAvailabilityPct: null, latencyDeltaMs: null,
    emergency112ProtectionPct: null,
    note: 'Metrik operasi tidak dihitung karena tidak ada input operasional terverifikasi.'
  };
}
