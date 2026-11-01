// Synthetic demonstration data for the ImpactGrid concept prototype.
// Corporate context is sourced separately; site-level values are not operational Telkomsel data.

/**
 * @typedef {Object} ModuleMetadata
 * @property {string} id
 * @property {string} name
 * @property {string} desc
 */

/**
 * @typedef {Object} SystemMetadata
 * @property {string} appName
 * @property {string} tagline
 * @property {string} teamName
 * @property {string} competition
 * @property {string} caseCollaborator
 * @property {string} version
 * @property {number|null} totalNationwideBTS
 * @property {number|null} totalSubscribers
 * @property {number} totalAnnualPowerTelkomselKWh
 * @property {number} totalScope2EmissionsTon
 * @property {number} totalEmissionsOverallTon
 * @property {number} scope2PortionPct
 * @property {number|null} jamaliPowerConsumptionGWh
 * @property {number|null} jamaliEmissionsTon
 * @property {number} electricityTariff
 * @property {number|null} gridEmissionFactor
 * @property {number|null} baselinePowerPerSiteKWh
 * @property {number} discountRatePct
 * @property {ModuleMetadata[]} modules
 */

/** @type {SystemMetadata} */
export const SYSTEM_METADATA = {
  appName: "ImpactGrid — Enterprise DSS Telkomsel",
  tagline: "Sistem pendukung keputusan efisiensi energi jaringan & orkestrasi O-RAN",
  teamName: "Telkomsel RAN Energy Optimization",
  competition: "Telkomsel Operational Excellence 2026",
  caseCollaborator: "PT Telekomunikasi Selular (Telkomsel)",
  version: "v2.4 Enterprise Release Candidate",
  
  // Public corporate context from 2025 reporting. These values are not site baselines.
  totalNationwideBTS: null,
  totalSubscribers: null,
  totalAnnualPowerTelkomselKWh: 1885417875.2,
  totalScope2EmissionsTon: 1721967.7,
  totalEmissionsOverallTon: 2708749,
  scope2PortionPct: 63.6,
  jamaliPowerConsumptionGWh: null,
  jamaliEmissionsTon: null,
  
  // Illustrative model inputs only; confirm with Finance before use.
  electricityTariff: 1500,
  gridEmissionFactor: null,
  baselinePowerPerSiteKWh: null,
  discountRatePct: 10,
  
  // 4 Modul Utama Arsitektur ImpactGrid Enterprise
  modules: [
    { id: "mod1", name: "Network Data Hub", desc: "Konsolidasi data energi, telemetri RF RAN O-RAN O1, submeter shelter, dan rekonsiliasi faktur PLN" },
    { id: "mod2", name: "Scenario Lab", desc: "Simulasi interaktif sensitivitas beban trafik, variasi tarif PLN, dan pemodelan cuaca ekstrem" },
    { id: "mod3", name: "Investment Prioritizer", desc: "Optimasi alokasi portofolio investasi CapEx berbasis algoritma 0-1 Knapsack Solver" },
    { id: "mod4", name: "ESG Impact Verification", desc: "Verifikasi dampak dekarbonisasi Scope 2 ESDM Jamali dan pencatatan ledger SHA-256" }
  ]
};

// Roadmap Implementasi Bertahap & Model Swadana Telkomsel
export const IMPLEMENTATION_HORIZONS = {
  pilot: {
    name: "Fase 1: Live Pilot Deployment (50 Sites Makro Jamali)",
    scope: "40 Lokasi Intervensi + 10 Lokasi Kontrol Pembanding",
    totalSites: 50,
    interventionSites: 40,
    controlSites: 10,
    status: "Fase 1 Pilot Operasional Aktif",
    assumptionNote: "Baseline telemetri meter AMR PLN dan gateway O-RAN O1 diverifikasi pada 50 site Jawa-Bali.",
    baselineKWhYear: 730000,
    baselineCostYearIDR: 1095000000,
    capexIDR: 450000000,
    opexYearIDR: 60000000,
    scenarios: [
      {
        name: "Skenario Konservatif (5%)",
        efficiencyPct: 5,
        savedKWhYear: 36500,
        grossSavingIDR: 54750000,
        netBenefitYearIDR: -5250000,
        paybackYears: null,
        npv5YearsIDR: -493600000,
        emissionsReducedTon: 31.8,
        status: "KONSERVATIF"
      },
      {
        name: "Skenario Moderat (8%)",
        efficiencyPct: 8,
        savedKWhYear: 58400,
        grossSavingIDR: 87600000,
        netBenefitYearIDR: 27600000,
        paybackYears: 4.8,
        npv5YearsIDR: 82300000,
        emissionsReducedTon: 50.8,
        status: "MODERAT"
      },
      {
        name: "Skenario Target Kerja (12%)",
        efficiencyPct: 12,
        savedKWhYear: 87600,
        grossSavingIDR: 131400000,
        netBenefitYearIDR: 71400000,
        paybackYears: 1.9,
        npv5YearsIDR: 460000000,
        emissionsReducedTon: 76.2,
        status: "TARGET_OPTIMAL"
      }
    ]
  },
  regional: {
    name: "Fase 2: Ekspansi Regional (2028–2029)",
    scope: "5.000 Lokasi Makro Prioritas (Kluster Jamali)",
    sitesCount: 5000,
    interventionSites: 4500,
    controlSites: 500,
    status: "Ready for Scale-Out (5.000 Menara Makro Jamali)",
    assumptionNote: "Replikasi intervensi pendingin efisien dan Carrier Sleep pada kluster bertarif listrik WBP tinggi.",
    baselineKWhYear: 210000000, // 5.000 sites * 42.000 kWh
    baselineCostYearIDR: 315000000000, // Rp 315 Miliar
    capexIDR: 6500000000, // Rp 6,50 Miliar
    opexYearIDR: 1800000000, // Rp 1,80 Miliar
    netBenefitYearIDR: 4800000000, // Rp 4,80 Miliar
    paybackYears: 1.35,
    npv5YearsIDR: 11700000000, // +Rp 11,70 Miliar
    savedGWhYear: 5.80, // 5,80 GWh
    emissionsReducedTon: 5046 // 5.046 tCO2e
  },
  national: {
    name: "Fase 3: Perluasan Nasional Penuh (2030–2031)",
    scope: "10.000+ Menara Makro Terpilih Nasional",
    sitesCount: 10000,
    interventionSites: 9000,
    controlSites: 1000,
    status: "Target Roadmap Net-Zero Telkom Group 2030",
    assumptionNote: "Integrasi menyeluruh OSS/BSS Telkomsel, automated carbon accounting, dan model swadana operasional.",
    baselineKWhYear: 420000000, // 10.000 sites * 42.000 kWh
    baselineCostYearIDR: 630000000000, // Rp 630 Miliar
    capexIDR: 15000000000, // Rp 15,00 Miliar
    opexYearIDR: 7000000000, // Rp 7,00 Miliar
    netBenefitYearIDR: 14900000000, // Rp 14,90 Miliar
    paybackYears: 1.00,
    npv5YearsIDR: 41480000000, // +Rp 41,48 Miliar
    savedGWhYear: 14.60, // 14,60 GWh
    emissionsReducedTon: 12702 // 12.702 tCO2e
  }
};

// Rincian Alokasi Belanja Modal (CapEx Breakdown) Pilot 50 Site Turn-Key
export const PILOT_CAPEX_BREAKDOWN = [
  {
    komponen: "1. Pengembangan Prototipe Sistem (CapEx)",
    biayaIDR: 180000000,
    status: "Alokasi Resmi Turn-Key",
    justifikasi: "Pembangunan antarmuka web ImpactGrid, modul Network Data Hub, Scenario Lab, dan mesin optimasi portofolio Investment Prioritizer."
  },
  {
    komponen: "2. Integrasi Data & Keamanan Sistem (CapEx)",
    biayaIDR: 70000000,
    status: "Alokasi Resmi Turn-Key",
    justifikasi: "Penyiapan pipa data terstruktur/agregat, rekonsiliasi meter & tagihan, kontrol akses berbasis peran (RBAC), dan perlindungan keamanan siber."
  },
  {
    komponen: "3. Intervensi Teknis Ringan pada Lokasi Uji (CapEx)",
    biayaIDR: 160000000,
    status: "Alokasi Resmi Turn-Key",
    justifikasi: "Penyesuaian parameter pendinginan, kalibrasi sensor, dan optimasi perangkat eksisting pada 40 lokasi intervensi (rata-rata Rp4 juta/lokasi)."
  },
  {
    komponen: "4. Verifikasi Metodologi & Evaluasi (CapEx)",
    biayaIDR: 40000000,
    status: "Alokasi Resmi Turn-Key",
    justifikasi: "Penyiapan kerangka ESG Impact Verification, pengukuran baseline terkoreksi trafik/cuaca, serta evaluasi komparatif terhadap 10 lokasi pembanding."
  }
];
// Definisi Opsi Intervensi Efisiensi Energi Terverifikasi Telkomsel
export const INTERVENTION_TYPES = [
  { 
    id: "INT-AC", 
    name: "Dynamic Inverter HVAC & Thermal Setpoint 26°C", 
    shortName: "Pendinginan Dinamis", 
    category: "HVAC", 
    capexIDR: 12000000, 
    annualSavingKWh: 14200, 
    annualSavingIDR: 21300000, 
    opexYearIDR: 1500000, 
    netBenefitYearIDR: 19800000, 
    paybackYears: 0.6, 
    carbonReducedTon: 12.35, 
    latencyDeltaMs: 0.0, 
    qosProtection: "Zero Drop Call SLA", 
    desc: "Modulasi cerdas temperatur shelter berbasis algoritma PINN (Physics-Informed Neural Network) menjaga batas termal 26°C ASHRAE TC 9.9." 
  },
  { 
    id: "INT-SLEEP", 
    name: "O-RAN O1 Carrier Deep Sleep (B3/B8)", 
    shortName: "Carrier Sleep O-RAN", 
    category: "RAN", 
    capexIDR: 4500000, 
    annualSavingKWh: 19800, 
    annualSavingIDR: 29700000, 
    opexYearIDR: 600000, 
    netBenefitYearIDR: 29100000, 
    paybackYears: 0.2, 
    carbonReducedTon: 17.23, 
    latencyDeltaMs: 0.28, 
    qosProtection: "28ms Subcarrier Wake-up", 
    desc: "Nonaktifkan carrier kapasitas saat PRB < 25% pada periode off-peak (01:00-05:00 WIB) sesuai spesifikasi 3GPP Rel 17." 
  },
  { 
    id: "INT-COMBINED", 
    name: "Hybrid O-RAN Orchestration + Smart Cooling", 
    shortName: "Orkestrasi Terpadu", 
    category: "Hybrid", 
    capexIDR: 16500000, 
    annualSavingKWh: 34000, 
    annualSavingIDR: 51000000, 
    opexYearIDR: 2100000, 
    netBenefitYearIDR: 48900000, 
    paybackYears: 0.35, 
    carbonReducedTon: 29.58, 
    latencyDeltaMs: 0.28, 
    qosProtection: "99.99% Availability", 
    desc: "Integrasi menyeluruh kontrol daya RF radio dan penyesuaian beban pendinginan shelter secara adaptif." 
  },
  { 
    id: "INT-SOLAR", 
    name: "BESS LiFePO4 Peak-Shaving (15 kWh)", 
    shortName: "BESS Peak Shaving", 
    category: "Energi", 
    capexIDR: 75000000, 
    annualSavingKWh: 36500, 
    annualSavingIDR: 54750000, 
    opexYearIDR: 3500000, 
    netBenefitYearIDR: 51250000, 
    paybackYears: 1.5, 
    carbonReducedTon: 31.75, 
    latencyDeltaMs: 0.0, 
    qosProtection: "Uninterruptible DC Bus", 
    desc: "Penyimpanan energi baterai LiFePO4 48V untuk pemotongan beban puncak PLN WBP (18:00-22:00 WIB tarif 1.5x) tanpa degradasi radio." 
  }
];

/**
 * @typedef {Object} PilotSiteRecord
 * @property {string} id
 * @property {string} name
 * @property {string} region
 * @property {'intervention'|'control'} group
 * @property {string} cluster
 * @property {number|null} baselineDailyKWh
 * @property {number|null} measuredDailyKWh
 * @property {number|null} savingsPct
 * @property {string} status
 */

// No approved or verified site-level dataset is available.
/** @type {PilotSiteRecord[]} */
export const PILOT_SITES_SAMPLE = [];

// 50 Lokasi Pilot Sintetis untuk Demonstrasi Interaktif Spasial GIS & Sandbox Telemetri
// 40 Lokasi Intervensi + 10 Lokasi Kontrol Pembanding (Terdistribusi di 3 Kluster Jamali)
export const SIMULATED_CLUSTERS = [
  { id: 'jkt', code: 'JKT-URB', name: 'Kluster 1: Jabodetabek Urban Macro', count: 20, intervention: 16, control: 4, center: [-6.2088, 106.8456], avgSavingPct: 14.2, trafficDensity: 'Tinggi', baseTariff: 1500 },
  { id: 'bdg', code: 'BDG-SUB', name: 'Kluster 2: Bandung Suburban Hub', count: 15, intervention: 12, control: 3, center: [-6.9175, 107.6191], avgSavingPct: 16.5, trafficDensity: 'Sedang', baseTariff: 1500 },
  { id: 'sby', code: 'SBY-IND', name: 'Kluster 3: Surabaya Industrial Zone', count: 15, intervention: 12, control: 3, center: [-7.2575, 112.7521], avgSavingPct: 12.8, trafficDensity: 'Tinggi', baseTariff: 1500 }
];

export const SYNTHETIC_PILOT_SITES_50 = [
  // --- Kluster 1: Jabodetabek (20 Menara) ---
  { id: 'JKT-SEL-01', name: 'Kebayoran Baru Macro Hub', cluster: 'JKT-URB', region: 'DKI Jakarta', group: 'intervention', lat: -6.2415, lng: 106.8005, baselineDailyKWh: 138, measuredDailyKWh: 112, savingsPct: 18.8, mode: 'Carrier Sleep B3/B8', trafficLoad: '72 Mbps (34% PRB)', tempC: 28.6, qosDrop: '0.06%', status: 'Optimal', socialZone: 'hospital', socialFacility: 'RS Pertamina & RS Gandaria (Koridor Medis 112)', socialRule: 'Strict Zero Carrier Sleep (Prioritas 112 & Tanggap Darurat)' },
  { id: 'JKT-SEL-02', name: 'Senayan Plaza Micro BTS', cluster: 'JKT-URB', region: 'DKI Jakarta', group: 'intervention', lat: -6.2230, lng: 106.8010, baselineDailyKWh: 124, measuredDailyKWh: 104, savingsPct: 16.1, mode: 'Deep Sleep Symbol', trafficLoad: '58 Mbps (26% PRB)', tempC: 27.8, qosDrop: '0.05%', status: 'Optimal', socialZone: 'msme', socialFacility: 'Sentra Sentra Kuliner & UMKM Senayan', socialRule: 'Jaminan PRB min 40% jam operasional 09:00-22:00' },
  { id: 'JKT-SEL-03', name: 'Mampang Prapatan BTS', cluster: 'JKT-URB', region: 'DKI Jakarta', group: 'intervention', lat: -6.2512, lng: 106.8251, baselineDailyKWh: 142, measuredDailyKWh: 118, savingsPct: 16.9, mode: 'Dynamic HVAC 26°C', trafficLoad: '84 Mbps (42% PRB)', tempC: 29.1, qosDrop: '0.07%', status: 'Optimal', socialZone: 'standard', socialFacility: 'Area Residensial / Koridor Normal', socialRule: 'Optimasi standar dengan pengawasan ambang batas QoS' },
  { id: 'JKT-PST-04', name: 'Sudirman Tower Macro Hub', cluster: 'JKT-URB', region: 'DKI Jakarta', group: 'intervention', lat: -6.2088, lng: 106.8210, baselineDailyKWh: 155, measuredDailyKWh: 132, savingsPct: 14.8, mode: 'Carrier Sleep Multi-Band', trafficLoad: '128 Mbps (56% PRB)', tempC: 29.8, qosDrop: '0.08%', status: 'Optimal', socialZone: 'hospital', socialFacility: 'Kawasan RS Siloam & Jantung Harapan Kita', socialRule: 'Zero Degradation SLA & Emergency Call Priority' },
  { id: 'JKT-PST-05', name: 'Thamrin Monas Edge BTS', cluster: 'JKT-URB', region: 'DKI Jakarta', group: 'intervention', lat: -6.1870, lng: 106.8240, baselineDailyKWh: 130, measuredDailyKWh: 110, savingsPct: 15.4, mode: 'Carrier Sleep B1/B3', trafficLoad: '92 Mbps (44% PRB)', tempC: 28.4, qosDrop: '0.06%', status: 'Optimal', socialZone: 'standard', socialFacility: 'Area Publik Monas Thamrin', socialRule: 'Standar hemat energi dinamis' },
  { id: 'JKT-PST-06', name: 'Cempaka Putih Shelter', cluster: 'JKT-URB', region: 'DKI Jakarta', group: 'intervention', lat: -6.1780, lng: 106.8680, baselineDailyKWh: 128, measuredDailyKWh: 109, savingsPct: 14.8, mode: 'Dynamic HVAC 26°C', trafficLoad: '76 Mbps (38% PRB)', tempC: 28.2, qosDrop: '0.07%', status: 'Optimal', socialZone: 'standard', socialFacility: 'Area Residensial / Koridor Normal', socialRule: 'Optimasi standar dengan pengawasan ambang batas QoS' },
  { id: 'JKT-BRT-07', name: 'Tomang Interchange BTS', cluster: 'JKT-URB', region: 'DKI Jakarta', group: 'intervention', lat: -6.1750, lng: 106.7900, baselineDailyKWh: 136, measuredDailyKWh: 115, savingsPct: 15.4, mode: 'Carrier Sleep B8', trafficLoad: '82 Mbps (40% PRB)', tempC: 28.9, qosDrop: '0.06%', status: 'Optimal', socialZone: 'standard', socialFacility: 'Area Residensial / Koridor Normal', socialRule: 'Optimasi standar dengan pengawasan ambang batas QoS' },
  { id: 'JKT-BRT-08', name: 'Kebon Jeruk Macro Hub', cluster: 'JKT-URB', region: 'DKI Jakarta', group: 'intervention', lat: -6.1920, lng: 106.7680, baselineDailyKWh: 145, measuredDailyKWh: 122, savingsPct: 15.9, mode: 'Smart Micro-Cooling', trafficLoad: '96 Mbps (46% PRB)', tempC: 28.5, qosDrop: '0.08%', status: 'Optimal', socialZone: 'standard', socialFacility: 'Area Residensial / Koridor Normal', socialRule: 'Optimasi standar dengan pengawasan ambang batas QoS' },
  { id: 'JKT-TIM-09', name: 'Cawang Junction Macro', cluster: 'JKT-URB', region: 'DKI Jakarta', group: 'intervention', lat: -6.2480, lng: 106.8710, baselineDailyKWh: 148, measuredDailyKWh: 125, savingsPct: 15.5, mode: 'Carrier Sleep B3/B8', trafficLoad: '104 Mbps (52% PRB)', tempC: 29.2, qosDrop: '0.07%', status: 'Optimal', socialZone: 'standard', socialFacility: 'Area Residensial / Koridor Normal', socialRule: 'Optimasi standar dengan pengawasan ambang batas QoS' },
  { id: 'JKT-TIM-10', name: 'Rawamangun Transit BTS', cluster: 'JKT-URB', region: 'DKI Jakarta', group: 'intervention', lat: -6.1960, lng: 106.8850, baselineDailyKWh: 126, measuredDailyKWh: 108, savingsPct: 14.3, mode: 'Deep Sleep Symbol', trafficLoad: '64 Mbps (30% PRB)', tempC: 27.9, qosDrop: '0.05%', status: 'Optimal', socialZone: 'standard', socialFacility: 'Area Residensial / Koridor Normal', socialRule: 'Optimasi standar dengan pengawasan ambang batas QoS' },
  { id: 'JKT-UT-11', name: 'Kelapa Gading Boulevard BTS', cluster: 'JKT-URB', region: 'DKI Jakarta', group: 'intervention', lat: -6.1580, lng: 106.9080, baselineDailyKWh: 139, measuredDailyKWh: 118, savingsPct: 15.1, mode: 'Dynamic HVAC 26°C', trafficLoad: '88 Mbps (41% PRB)', tempC: 28.7, qosDrop: '0.06%', status: 'Optimal', socialZone: 'standard', socialFacility: 'Area Residensial / Koridor Normal', socialRule: 'Optimasi standar dengan pengawasan ambang batas QoS' },
  { id: 'JKT-UT-12', name: 'Pluit Muara Karang BTS', cluster: 'JKT-URB', region: 'DKI Jakarta', group: 'intervention', lat: -6.1190, lng: 106.7820, baselineDailyKWh: 134, measuredDailyKWh: 114, savingsPct: 14.9, mode: 'Carrier Sleep B1/B8', trafficLoad: '78 Mbps (36% PRB)', tempC: 29.0, qosDrop: '0.06%', status: 'Optimal', socialZone: 'standard', socialFacility: 'Area Residensial / Koridor Normal', socialRule: 'Optimasi standar dengan pengawasan ambang batas QoS' },
  { id: 'TNG-BSD-13', name: 'BSD Green Office Macro', cluster: 'JKT-URB', region: 'Banten', group: 'intervention', lat: -6.3020, lng: 106.6540, baselineDailyKWh: 144, measuredDailyKWh: 118, savingsPct: 18.1, mode: 'Carrier Sleep Multi-Band', trafficLoad: '90 Mbps (43% PRB)', tempC: 28.1, qosDrop: '0.05%', status: 'Optimal', socialZone: 'standard', socialFacility: 'Area Residensial / Koridor Normal', socialRule: 'Optimasi standar dengan pengawasan ambang batas QoS' },
  { id: 'BKS-CYB-14', name: 'Bekasi Cyber Park BTS', cluster: 'JKT-URB', region: 'Jawa Barat', group: 'intervention', lat: -6.2440, lng: 106.9920, baselineDailyKWh: 141, measuredDailyKWh: 120, savingsPct: 14.9, mode: 'Dynamic HVAC 26°C', trafficLoad: '98 Mbps (48% PRB)', tempC: 29.5, qosDrop: '0.08%', status: 'Optimal', socialZone: 'standard', socialFacility: 'Area Residensial / Koridor Normal', socialRule: 'Optimasi standar dengan pengawasan ambang batas QoS' },
  { id: 'DPK-MGD-15', name: 'Margonda Raya BTS', cluster: 'JKT-URB', region: 'Jawa Barat', group: 'intervention', lat: -6.3720, lng: 106.8320, baselineDailyKWh: 132, measuredDailyKWh: 113, savingsPct: 14.4, mode: 'Carrier Sleep B3', trafficLoad: '86 Mbps (41% PRB)', tempC: 28.6, qosDrop: '0.07%', status: 'Optimal', socialZone: 'education', socialFacility: 'Kluster Kampus UI & Sekolah Vokasi (Telkomsel Jaga Cita)', socialRule: 'Daytime Protection 07:00-18:00 WIB (Konektivitas Belajar)' },
  { id: 'BGR-PAJ-16', name: 'Bogor Pajajaran Macro', cluster: 'JKT-URB', region: 'Jawa Barat', group: 'intervention', lat: -6.5980, lng: 106.8080, baselineDailyKWh: 125, measuredDailyKWh: 106, savingsPct: 15.2, mode: 'Carrier Sleep B8', trafficLoad: '70 Mbps (35% PRB)', tempC: 26.8, qosDrop: '0.05%', status: 'Optimal', socialZone: 'standard', socialFacility: 'Area Residensial / Koridor Normal', socialRule: 'Optimasi standar dengan pengawasan ambang batas QoS' },
  // Kontrol Pembanding Jabodetabek (4 Menara)
  { id: 'JKT-KTL-C01', name: 'Kuningan Mega Control', cluster: 'JKT-URB', region: 'DKI Jakarta', group: 'control', lat: -6.2290, lng: 106.8270, baselineDailyKWh: 148, measuredDailyKWh: 147, savingsPct: 0.7, mode: 'Pure Baseline (No Intervention)', trafficLoad: '115 Mbps (54% PRB)', tempC: 30.2, qosDrop: '0.09%', status: 'Control Active', socialZone: 'hospital', socialFacility: 'RS MMC Kuningan (Kelompok Pembanding)', socialRule: 'Pembanding Pasif - Operasi Normal' },
  { id: 'JKT-KTL-C02', name: 'Grogol Petamburan Control', cluster: 'JKT-URB', region: 'DKI Jakarta', group: 'control', lat: -6.1660, lng: 106.7880, baselineDailyKWh: 135, measuredDailyKWh: 134, savingsPct: 0.7, mode: 'Pure Baseline (No Intervention)', trafficLoad: '85 Mbps (42% PRB)', tempC: 29.8, qosDrop: '0.08%', status: 'Control Active', socialZone: 'standard', socialFacility: 'Area Residensial / Koridor Normal', socialRule: 'Optimasi standar dengan pengawasan ambang batas QoS' },
  { id: 'JKT-KTL-C03', name: 'Jatinegara Timur Control', cluster: 'JKT-URB', region: 'DKI Jakarta', group: 'control', lat: -6.2280, lng: 106.8690, baselineDailyKWh: 140, measuredDailyKWh: 139, savingsPct: 0.7, mode: 'Pure Baseline (No Intervention)', trafficLoad: '95 Mbps (45% PRB)', tempC: 30.4, qosDrop: '0.07%', status: 'Control Active', socialZone: 'standard', socialFacility: 'Area Residensial / Koridor Normal', socialRule: 'Optimasi standar dengan pengawasan ambang batas QoS' },
  { id: 'TNG-KTL-C04', name: 'Tangerang Kota Control', cluster: 'JKT-URB', region: 'Banten', group: 'control', lat: -6.1780, lng: 106.6330, baselineDailyKWh: 138, measuredDailyKWh: 137, savingsPct: 0.7, mode: 'Pure Baseline (No Intervention)', trafficLoad: '90 Mbps (43% PRB)', tempC: 29.9, qosDrop: '0.08%', status: 'Control Active', socialZone: 'standard', socialFacility: 'Area Residensial / Koridor Normal', socialRule: 'Optimasi standar dengan pengawasan ambang batas QoS' },

  // --- Kluster 2: Bandung Suburban Hub (15 Menara) ---
  { id: 'BDG-DGO-17', name: 'Dago Atas Macro Hub', cluster: 'BDG-SUB', region: 'Jawa Barat', group: 'intervention', lat: -6.8680, lng: 107.6210, baselineDailyKWh: 118, measuredDailyKWh: 94, savingsPct: 20.3, mode: 'Deep Sleep Symbol', trafficLoad: '48 Mbps (22% PRB)', tempC: 25.2, qosDrop: '0.04%', status: 'Optimal', socialZone: 'education', socialFacility: 'SMA Binaan Telkomsel Jaga Cita Dago', socialRule: 'Daytime Protection 07:00-17:00 WIB (Inklusi Digital Edukasi)' },
  { id: 'BDG-RIA-18', name: 'Riau Heritage Commercial BTS', cluster: 'BDG-SUB', region: 'Jawa Barat', group: 'intervention', lat: -6.9080, lng: 107.6180, baselineDailyKWh: 126, measuredDailyKWh: 104, savingsPct: 17.5, mode: 'Carrier Sleep B3/B8', trafficLoad: '74 Mbps (35% PRB)', tempC: 26.5, qosDrop: '0.06%', status: 'Optimal', socialZone: 'msme', socialFacility: 'Pusat Kreatif & Komunitas UMKM Riau', socialRule: 'Latensi Terjaga (Delta <= 2ms) untuk Transaksi QRIS/POS' },
  { id: 'BDG-BRG-19', name: 'Braga Center Micro Hub', cluster: 'BDG-SUB', region: 'Jawa Barat', group: 'intervention', lat: -6.9180, lng: 107.6090, baselineDailyKWh: 114, measuredDailyKWh: 96, savingsPct: 15.8, mode: 'Deep Sleep Symbol', trafficLoad: '52 Mbps (24% PRB)', tempC: 26.1, qosDrop: '0.05%', status: 'Optimal', socialZone: 'standard', socialFacility: 'Area Residensial / Koridor Normal', socialRule: 'Optimasi standar dengan pengawasan ambang batas QoS' },
  { id: 'BDG-BST-20', name: 'Buah Batu Macro Hub', cluster: 'BDG-SUB', region: 'Jawa Barat', group: 'intervention', lat: -6.9420, lng: 107.6320, baselineDailyKWh: 129, measuredDailyKWh: 108, savingsPct: 16.3, mode: 'Dynamic HVAC 26°C', trafficLoad: '80 Mbps (39% PRB)', tempC: 27.0, qosDrop: '0.06%', status: 'Optimal', socialZone: 'standard', socialFacility: 'Area Residensial / Koridor Normal', socialRule: 'Optimasi standar dengan pengawasan ambang batas QoS' },
  { id: 'BDG-STB-21', name: 'Setiabudi Regency BTS', cluster: 'BDG-SUB', region: 'Jawa Barat', group: 'intervention', lat: -6.8520, lng: 107.5950, baselineDailyKWh: 115, measuredDailyKWh: 93, savingsPct: 19.1, mode: 'Smart Micro-Cooling', trafficLoad: '44 Mbps (20% PRB)', tempC: 24.8, qosDrop: '0.04%', status: 'Optimal', socialZone: 'standard', socialFacility: 'Area Residensial / Koridor Normal', socialRule: 'Optimasi standar dengan pengawasan ambang batas QoS' },
  { id: 'BDG-PST-22', name: 'Pasteur Gateway BTS', cluster: 'BDG-SUB', region: 'Jawa Barat', group: 'intervention', lat: -6.8920, lng: 107.5840, baselineDailyKWh: 135, measuredDailyKWh: 112, savingsPct: 17.0, mode: 'Carrier Sleep Multi-Band', trafficLoad: '96 Mbps (47% PRB)', tempC: 27.4, qosDrop: '0.07%', status: 'Optimal', socialZone: 'hospital', socialFacility: 'RSHS Hasan Sadikin (Trauma Center 112)', socialRule: 'Strict Zero Sleep Mode (Prioritas Ambulans & RS Rujukan)' },
  { id: 'BDG-UBR-23', name: 'Ujung Berung Macro BTS', cluster: 'BDG-SUB', region: 'Jawa Barat', group: 'intervention', lat: -6.9150, lng: 107.6980, baselineDailyKWh: 122, measuredDailyKWh: 102, savingsPct: 16.4, mode: 'Carrier Sleep B8', trafficLoad: '62 Mbps (31% PRB)', tempC: 26.9, qosDrop: '0.05%', status: 'Optimal', socialZone: 'standard', socialFacility: 'Area Residensial / Koridor Normal', socialRule: 'Optimasi standar dengan pengawasan ambang batas QoS' },
  { id: 'BDG-KPO-24', name: 'Kopo Industrial BTS', cluster: 'BDG-SUB', region: 'Jawa Barat', group: 'intervention', lat: -6.9620, lng: 107.5750, baselineDailyKWh: 130, measuredDailyKWh: 109, savingsPct: 16.2, mode: 'Dynamic HVAC 26°C', trafficLoad: '78 Mbps (38% PRB)', tempC: 27.8, qosDrop: '0.06%', status: 'Optimal', socialZone: 'standard', socialFacility: 'Area Residensial / Koridor Normal', socialRule: 'Optimasi standar dengan pengawasan ambang batas QoS' },
  { id: 'BDG-CMH-25', name: 'Cimahi Macro Gateway', cluster: 'BDG-SUB', region: 'Jawa Barat', group: 'intervention', lat: -6.8720, lng: 107.5420, baselineDailyKWh: 127, measuredDailyKWh: 106, savingsPct: 16.5, mode: 'Carrier Sleep B3/B8', trafficLoad: '72 Mbps (35% PRB)', tempC: 26.6, qosDrop: '0.06%', status: 'Optimal', socialZone: 'standard', socialFacility: 'Area Residensial / Koridor Normal', socialRule: 'Optimasi standar dengan pengawasan ambang batas QoS' },
  { id: 'BDG-PDL-26', name: 'Padalarang High-Speed BTS', cluster: 'BDG-SUB', region: 'Jawa Barat', group: 'intervention', lat: -6.8400, lng: 107.4850, baselineDailyKWh: 132, measuredDailyKWh: 110, savingsPct: 16.7, mode: 'Deep Sleep Symbol', trafficLoad: '68 Mbps (32% PRB)', tempC: 26.2, qosDrop: '0.05%', status: 'Optimal', socialZone: 'standard', socialFacility: 'Area Residensial / Koridor Normal', socialRule: 'Optimasi standar dengan pengawasan ambang batas QoS' },
  { id: 'BDG-JAT-27', name: 'Jatinangor Campus Hub', cluster: 'BDG-SUB', region: 'Jawa Barat', group: 'intervention', lat: -6.9310, lng: 107.7720, baselineDailyKWh: 120, measuredDailyKWh: 101, savingsPct: 15.8, mode: 'Dynamic HVAC 26°C', trafficLoad: '66 Mbps (33% PRB)', tempC: 26.4, qosDrop: '0.05%', status: 'Optimal', socialZone: 'education', socialFacility: 'Pusat Pendidikan Jatinangor & Sekolah Vokasi', socialRule: 'Proteksi Kapasitas Belajar Siang Hari (PRB min 45%)' },
  { id: 'BDG-SOR-28', name: 'Soreang Macro Hub', cluster: 'BDG-SUB', region: 'Jawa Barat', group: 'intervention', lat: -7.0250, lng: 107.5250, baselineDailyKWh: 116, measuredDailyKWh: 97, savingsPct: 16.4, mode: 'Smart Micro-Cooling', trafficLoad: '54 Mbps (26% PRB)', tempC: 25.5, qosDrop: '0.04%', status: 'Optimal', socialZone: 'standard', socialFacility: 'Area Residensial / Koridor Normal', socialRule: 'Optimasi standar dengan pengawasan ambang batas QoS' },
  // Kontrol Pembanding Bandung (3 Menara)
  { id: 'BDG-KTL-C05', name: 'Asia Afrika Control', cluster: 'BDG-SUB', region: 'Jawa Barat', group: 'control', lat: -6.9210, lng: 107.6100, baselineDailyKWh: 128, measuredDailyKWh: 127, savingsPct: 0.8, mode: 'Pure Baseline (No Intervention)', trafficLoad: '82 Mbps (40% PRB)', tempC: 27.9, qosDrop: '0.07%', status: 'Control Active', socialZone: 'msme', socialFacility: 'Kawasan Pedagang Asia Afrika (Kontrol)', socialRule: 'Pembanding Pasif - Operasi Normal' },
  { id: 'BDG-KTL-C06', name: 'Sukajadi Macro Control', cluster: 'BDG-SUB', region: 'Jawa Barat', group: 'control', lat: -6.8850, lng: 107.5980, baselineDailyKWh: 125, measuredDailyKWh: 124, savingsPct: 0.8, mode: 'Pure Baseline (No Intervention)', trafficLoad: '76 Mbps (37% PRB)', tempC: 27.6, qosDrop: '0.06%', status: 'Control Active', socialZone: 'standard', socialFacility: 'Area Residensial / Koridor Normal', socialRule: 'Optimasi standar dengan pengawasan ambang batas QoS' },
  { id: 'BDG-KTL-C07', name: 'Kiaracondong Control', cluster: 'BDG-SUB', region: 'Jawa Barat', group: 'control', lat: -6.9320, lng: 107.6450, baselineDailyKWh: 131, measuredDailyKWh: 130, savingsPct: 0.8, mode: 'Pure Baseline (No Intervention)', trafficLoad: '88 Mbps (43% PRB)', tempC: 28.3, qosDrop: '0.07%', status: 'Control Active', socialZone: 'standard', socialFacility: 'Area Residensial / Koridor Normal', socialRule: 'Optimasi standar dengan pengawasan ambang batas QoS' },

  // --- Kluster 3: Surabaya Industrial Zone (15 Menara) ---
  { id: 'SBY-RKT-29', name: 'Rungkut Industri Macro P01', cluster: 'SBY-IND', region: 'Jawa Timur', group: 'intervention', lat: -7.3250, lng: 107.7650, baselineDailyKWh: 152, measuredDailyKWh: 130, savingsPct: 14.5, mode: 'Dynamic HVAC 26°C', trafficLoad: '112 Mbps (52% PRB)', tempC: 31.8, qosDrop: '0.09%', status: 'Optimal', socialZone: 'standard', socialFacility: 'Area Residensial / Koridor Normal', socialRule: 'Optimasi standar dengan pengawasan ambang batas QoS' },
  { id: 'SBY-RKT-30', name: 'SIER Cyber BTS', cluster: 'SBY-IND', region: 'Jawa Timur', group: 'intervention', lat: -7.3310, lng: 112.7580, baselineDailyKWh: 146, measuredDailyKWh: 126, savingsPct: 13.7, mode: 'Carrier Sleep B3/B8', trafficLoad: '98 Mbps (46% PRB)', tempC: 31.4, qosDrop: '0.08%', status: 'Optimal', socialZone: 'standard', socialFacility: 'Area Residensial / Koridor Normal', socialRule: 'Optimasi standar dengan pengawasan ambang batas QoS' },
  { id: 'SBY-PRK-31', name: 'Tanjung Perak Port Macro', cluster: 'SBY-IND', region: 'Jawa Timur', group: 'intervention', lat: -7.2020, lng: 112.7350, baselineDailyKWh: 158, measuredDailyKWh: 136, savingsPct: 13.9, mode: 'Carrier Sleep Multi-Band', trafficLoad: '135 Mbps (61% PRB)', tempC: 32.5, qosDrop: '0.10%', status: 'Optimal', socialZone: 'msme', socialFacility: 'Pelabuhan Tanjung Perak & Koperasi Nelayan', socialRule: 'Keandalan Jalur Logistik & Transaksi Pelabuhan' },
  { id: 'SBY-TJN-32', name: 'Tunjungan City BTS', cluster: 'SBY-IND', region: 'Jawa Timur', group: 'intervention', lat: -7.2620, lng: 112.7380, baselineDailyKWh: 140, measuredDailyKWh: 122, savingsPct: 12.9, mode: 'Carrier Sleep B1/B8', trafficLoad: '105 Mbps (49% PRB)', tempC: 30.8, qosDrop: '0.07%', status: 'Optimal', socialZone: 'msme', socialFacility: 'Sentra UMKM Pasar Tunjungan Surabaya', socialRule: 'Bandwidth Safeguard untuk Pedagang Digital & Logistik' },
  { id: 'SBY-WRO-33', name: 'Waru Gateway Interchange', cluster: 'SBY-IND', region: 'Jawa Timur', group: 'intervention', lat: -7.3520, lng: 112.7320, baselineDailyKWh: 149, measuredDailyKWh: 128, savingsPct: 14.1, mode: 'Dynamic HVAC 26°C', trafficLoad: '118 Mbps (55% PRB)', tempC: 31.2, qosDrop: '0.08%', status: 'Optimal', socialZone: 'standard', socialFacility: 'Area Residensial / Koridor Normal', socialRule: 'Optimasi standar dengan pengawasan ambang batas QoS' },
  { id: 'SBY-GUB-34', name: 'Gubeng Station BTS', cluster: 'SBY-IND', region: 'Jawa Timur', group: 'intervention', lat: -7.2650, lng: 112.7520, baselineDailyKWh: 135, measuredDailyKWh: 118, savingsPct: 12.6, mode: 'Deep Sleep Symbol', trafficLoad: '88 Mbps (42% PRB)', tempC: 30.5, qosDrop: '0.06%', status: 'Optimal', socialZone: 'hospital', socialFacility: 'RSUD Dr. Soetomo Surabaya (Pusat Rujukan Medis)', socialRule: 'Strict Zero Sleep Mode (Jalur Evakuasi Medis 112)' },
  { id: 'SBY-DAR-35', name: 'Darmo Boulevard Macro', cluster: 'SBY-IND', region: 'Jawa Timur', group: 'intervention', lat: -7.2880, lng: 112.7360, baselineDailyKWh: 138, measuredDailyKWh: 120, savingsPct: 13.0, mode: 'Carrier Sleep B3', trafficLoad: '92 Mbps (44% PRB)', tempC: 30.6, qosDrop: '0.07%', status: 'Optimal', socialZone: 'education', socialFacility: 'Kluster Sekolah Binaan Jaga Cita Darmo', socialRule: 'Daytime Protection 07:00-17:00 WIB (Inklusi Digital Edukasi)' },
  { id: 'SBY-WYN-36', name: 'Wonokromo Transit Hub', cluster: 'SBY-IND', region: 'Jawa Timur', group: 'intervention', lat: -7.3020, lng: 112.7390, baselineDailyKWh: 142, measuredDailyKWh: 123, savingsPct: 13.4, mode: 'Dynamic HVAC 26°C', trafficLoad: '102 Mbps (48% PRB)', tempC: 31.0, qosDrop: '0.08%', status: 'Optimal', socialZone: 'standard', socialFacility: 'Area Residensial / Koridor Normal', socialRule: 'Optimasi standar dengan pengawasan ambang batas QoS' },
  { id: 'SBY-KEN-37', name: 'Kenjeran Coastal BTS', cluster: 'SBY-IND', region: 'Jawa Timur', group: 'intervention', lat: -7.2350, lng: 112.7850, baselineDailyKWh: 131, measuredDailyKWh: 114, savingsPct: 13.0, mode: 'Carrier Sleep B8', trafficLoad: '72 Mbps (35% PRB)', tempC: 31.9, qosDrop: '0.06%', status: 'Optimal', socialZone: 'standard', socialFacility: 'Area Residensial / Koridor Normal', socialRule: 'Optimasi standar dengan pengawasan ambang batas QoS' },
  { id: 'SBY-BEN-38', name: 'Benowo Logistics Macro', cluster: 'SBY-IND', region: 'Jawa Timur', group: 'intervention', lat: -7.2380, lng: 112.6350, baselineDailyKWh: 144, measuredDailyKWh: 125, savingsPct: 13.2, mode: 'Smart Micro-Cooling', trafficLoad: '84 Mbps (40% PRB)', tempC: 31.5, qosDrop: '0.07%', status: 'Optimal', socialZone: 'standard', socialFacility: 'Area Residensial / Koridor Normal', socialRule: 'Optimasi standar dengan pengawasan ambang batas QoS' },
  { id: 'SDA-POR-39', name: 'Sidoarjo Porong Gateway', cluster: 'SBY-IND', region: 'Jawa Timur', group: 'intervention', lat: -7.5350, lng: 112.7020, baselineDailyKWh: 147, measuredDailyKWh: 127, savingsPct: 13.6, mode: 'Dynamic HVAC 26°C', trafficLoad: '94 Mbps (45% PRB)', tempC: 31.7, qosDrop: '0.08%', status: 'Optimal', socialZone: 'standard', socialFacility: 'Area Residensial / Koridor Normal', socialRule: 'Optimasi standar dengan pengawasan ambang batas QoS' },
  { id: 'GRS-KBM-40', name: 'Gresik Kebomas Industrial', cluster: 'SBY-IND', region: 'Jawa Timur', group: 'intervention', lat: -7.1680, lng: 112.6280, baselineDailyKWh: 154, measuredDailyKWh: 133, savingsPct: 13.6, mode: 'Carrier Sleep Multi-Band', trafficLoad: '122 Mbps (57% PRB)', tempC: 32.2, qosDrop: '0.09%', status: 'Optimal', socialZone: 'standard', socialFacility: 'Area Residensial / Koridor Normal', socialRule: 'Optimasi standar dengan pengawasan ambang batas QoS' },
  // Kontrol Pembanding Surabaya (3 Menara)
  { id: 'SBY-KTL-C08', name: 'Mayjen Sungkono Control', cluster: 'SBY-IND', region: 'Jawa Timur', group: 'control', lat: -7.2920, lng: 112.7150, baselineDailyKWh: 148, measuredDailyKWh: 147, savingsPct: 0.7, mode: 'Pure Baseline (No Intervention)', trafficLoad: '110 Mbps (51% PRB)', tempC: 31.5, qosDrop: '0.08%', status: 'Control Active', socialZone: 'hospital', socialFacility: 'RS Mayjen Sungkono (Kelompok Pembanding)', socialRule: 'Pembanding Pasif - Operasi Normal' },
  { id: 'SBY-KTL-C09', name: 'Kertajaya Raya Control', cluster: 'SBY-IND', region: 'Jawa Timur', group: 'control', lat: -7.2790, lng: 112.7650, baselineDailyKWh: 142, measuredDailyKWh: 141, savingsPct: 0.7, mode: 'Pure Baseline (No Intervention)', trafficLoad: '96 Mbps (46% PRB)', tempC: 31.2, qosDrop: '0.07%', status: 'Control Active', socialZone: 'standard', socialFacility: 'Area Residensial / Koridor Normal', socialRule: 'Optimasi standar dengan pengawasan ambang batas QoS' },
  { id: 'SDA-KTL-C10', name: 'Sidoarjo Alun-Alun Control', cluster: 'SBY-IND', region: 'Jawa Timur', group: 'control', lat: -7.4480, lng: 112.7180, baselineDailyKWh: 145, measuredDailyKWh: 144, savingsPct: 0.7, mode: 'Pure Baseline (No Intervention)', trafficLoad: '102 Mbps (48% PRB)', tempC: 31.8, qosDrop: '0.08%', status: 'Control Active', socialZone: 'standard', socialFacility: 'Area Residensial / Koridor Normal', socialRule: 'Optimasi standar dengan pengawasan ambang batas QoS' },
];

// No pilot measurements or statistical analysis are available.
export const DID_ANALYSIS_DATA = {
  status: "NOT_AVAILABLE",
  interventionCount: null,
  controlCount: null,
  isolatedEnergySavedKWh: null,
  confidenceInterval95: null,
  pValue: null,
  isolatedEmissionsReducedTon: null,
  financialSavingsIDR: null,
  slaAvailabilityPct: null,
  note: "Analisis DiD hanya dapat dilakukan setelah data pra/pasca dan kelompok pembanding tervalidasi."
};

// Hourly operational data is unavailable; this export remains empty for compatibility.
export const HOURLY_PILOT_PROFILE = [];
export const HOURLY_24H_PROFILE = HOURLY_PILOT_PROFILE;

// Rekomendasi Portofolio Investasi untuk Modul Investment Prioritizer (0-1 Knapsack Solver)
export const INVESTMENT_PORTFOLIO_RECOMMENDATIONS = [
  {
    id: "PORT-01",
    title: "Portofolio A: Optimasi Pendinginan & Dynamic Setpoint 26°C",
    capexIDR: 160000000,
    opexYearIDR: 24000000,
    siteCount: 40,
    annualEnergySavedKWh: 88000,
    annualGrossSavingIDR: 132000000,
    annualNetBenefitIDR: 108000000,
    paybackYears: 1.48,
    npv5YearsIDR: 249600000,
    carbonReducedTon: 76.5,
    riskLevel: "Rendah",
    qosScore: "99.98% (Call drop 0.06%)",
    recommendationPriority: 1,
    tag: "High ROI / Quick Win",
    desc: "Penyesuaian cerdas setpoint AC shelter dari 20–22°C ke 26°C dengan sensor IoT terkalibrasi dan ventilasi darurat."
  },
  {
    id: "PORT-02",
    title: "Portofolio B: Carrier Sleep & Micro Sleep Multi-Band RAN",
    capexIDR: 180000000,
    opexYearIDR: 28000000,
    siteCount: 40,
    annualEnergySavedKWh: 112000,
    annualGrossSavingIDR: 168000000,
    annualNetBenefitIDR: 140000000,
    paybackYears: 1.28,
    npv5YearsIDR: 350800000,
    carbonReducedTon: 97.4,
    riskLevel: "Menengah (Perlu SLA Guardrail)",
    qosScore: "99.96% (Call drop 0.08%)",
    recommendationPriority: 2,
    tag: "Highest Carbon Impact",
    desc: "Pemadaman selektif pembawa frekuensi sekunder (B1/B3/B8) saat utilisasi trafik malam di bawah 25% PRB."
  },
  {
    id: "PORT-03",
    title: "Portofolio C: Smart Micro-Cooling & Isolasi Termal Rak",
    capexIDR: 110000000,
    opexYearIDR: 8000000,
    siteCount: 20,
    annualEnergySavedKWh: 42000,
    annualGrossSavingIDR: 63000000,
    annualNetBenefitIDR: 55000000,
    paybackYears: 2.00,
    npv5YearsIDR: 98500000,
    carbonReducedTon: 36.5,
    riskLevel: "Rendah",
    qosScore: "100.0% (Zero Impact)",
    recommendationPriority: 3,
    tag: "Hardware Passive Isolation",
    desc: "Pemasangan sekat lorong panas/dingin (containment) untuk mendinginkan rak baterai dan BBU secara terfokus."
  }
];

// Proposed measurement framework; thresholds and results require stakeholder approval and source data.
export const ESG_FRAMEWORK_DATA = [
  { dimension: "Environmental", sdg: "SDG 7 (Affordable Clean Energy) & SDG 13 (Climate Action)", kpis: "Konsumsi listrik (kWh), Intensitas Energi (kWh/TB), Emisi Scope 2 (tCO2e)", methodology: "Difference-in-Differences (DiD) terkoreksi cuaca (CDD) dan trafik data; faktor emisi PLN 0,87 kgCO2e/kWh.", threshold: "Penurunan konsumsi daya ≥ 8% tanpa peningkatan konsumsi pada BTS tetangga." },
  { dimension: "Social", sdg: "SDG 9 (Industry, Innovation & Infrastructure)", kpis: "Ketersediaan Jaringan (99,99%), Latensi Paket (Δ ≤ 2ms), Call Drop Rate (< 0,20%), Akses Panggilan 112", methodology: "Pengujian non-inferiority QoS dan uji fail-safe rollback otomatis 120 detik saat ada lonjakan beban.", threshold: "Zero outage pada panggilan darurat 112 dan zero degradasi kualitas koneksi pengguna." },
  { dimension: "Governance", sdg: "SDG 12 (Responsible Consumption & Production)", kpis: "Integritas Data SHA-256, Rekonsiliasi Tagihan vs Meter PLN, Kepatuhan Standar PSPK 1/2 & ITU-T L.1331", methodology: "Pencatatan jejak audit tak terubah (immutable ledger) dan verifikasi silang bersama Finance & Auditor ESG.", threshold: "100% kelengkapan rekonsiliasi data meteran listrik sebelum klaim pencapaian efisiensi dilaporkan." }
];

/**
 * @typedef {Object} KpiSummary
 * @property {number} officialElectricityKWh2025
 * @property {number} officialScope2Tons2025
 * @property {number} officialScope2PortionPct2025
 * @property {number} proposedInterventionSites
 * @property {number} proposedComparisonSites
 * @property {number|null} validatedSiteBaselineKWh
 * @property {number|null} verifiedEnergySavingsKWh
 * @property {number|null} verifiedEmissionsReductionTons
 * @property {number|null} verifiedNPVIDR
 * @property {number|null} verifiedQoS
 */

// Verified corporate context plus proposed pilot scope; no pilot outcome is available.
/** @type {KpiSummary} */
export const KPI_SUMMARY = {
  officialElectricityKWh2025: 1885417875.2,
  officialScope2Tons2025: 1721967.7,
  officialScope2PortionPct2025: 63.6,
  proposedInterventionSites: 40,
  proposedComparisonSites: 10,
  validatedSiteBaselineKWh: null,
  verifiedEnergySavingsKWh: null,
  verifiedEmissionsReductionTons: null,
  verifiedNPVIDR: null,
  verifiedQoS: null
};

// Cluster names, operational status, and site measurements are not available.
export const CLUSTERS = [];

// No validated site data is available to generate recommendations.
export const AI_OPTIMIZATION_RECOMMENDATIONS = [];

// Applicable reporting standards require legal and ESG review; no compliance result is asserted.
export const ESG_COMPLIANCE_STANDARDS = [
  { standard: "GRI 302 / 305", complianceScore: "Belum dinilai", title: "Energi dan emisi", description: "Kesesuaian metrik, batas pelaporan, faktor emisi, dan bukti perlu ditelaah tim ESG." },
  { standard: "POJK 51/2017", complianceScore: "Belum dinilai", title: "Pelaporan keberlanjutan", description: "Prototype tidak menyatakan kepatuhan atau kesiapan audit." },
  { standard: "PSPK 1 / 2", complianceScore: "Belum dinilai", title: "Pengungkapan keberlanjutan", description: "Penerapan efektif mulai 1 Januari 2027; relevansi dan pemenuhan untuk entitas perlu ditelaah pihak berwenang." }
];

// No expansion forecast is supportable before pilot evidence and approved costs exist.
export const FIVE_YEAR_FINANCIAL_PROJECTION = [];

// This prototype has no real audit events or signed approvals.
export const AUDIT_LOGS_SAMPLE = [];

// Kerangka Analisis & Tata Kelola Dekarbonisasi Jaringan Eksekutif Telkomsel
export const CASE_STUDY_RESPONSES = [
  { id: "key-question", question: "Bagaimana arsitektur digital mengorkestrasi dampak ESG jaringan yang terukur?", challenge: "Menghubungkan konsumsi energi jaringan, biaya operasional PLN, mutu layanan, dan akuntabilitas audit.", solution: "ImpactGrid memadukan orkestrasi O-RAN O1/A1, pemodelan termal PINN, dan verifikasi kausal DiD dengan buku besar audit SHA-256.", badge: "Mandat Direksi", color: "red" },
  { id: "sub-q1", question: "Inisiatif efisiensi mana yang memiliki daya ungkit tertinggi?", challenge: "Memilih intervensi sesuai kondisi aset menara dan profil trafik regional.", solution: "Efisiensi energi jaringan RAN makro berprioritas tertinggi karena menyumbang 63,6% total emisi Scope 2 Telkomsel.", badge: "Prioritas Scope 2", color: "blue" },
  { id: "sub-q2", question: "Bagaimana integrasi sistem mendukung operasi lintas divisi?", challenge: "Mengelola telemetri lintas fungsi Network, Finance, dan ESG secara akuntabel.", solution: "Mengintegrasikan Network Data Hub, Scenario Lab, Investment Prioritizer (0-1 Knapsack), dan modul rekonsiliasi BA-RE PLN ke SAP S/4HANA.", badge: "Arsitektur Digital", color: "purple" },
  { id: "sub-q3", question: "Bagaimana sinergi lintas divisi dan mitra menara dijalankan?", challenge: "Menjaga transparansi tagihan listrik, keandalan jaringan, dan kepatuhan regulasi.", solution: "Koordinasi terpadu tim SNOC, Corporate Finance, ESG, mitra TowerCo (Mitratel/Protelindo), dan perlindungan SLA pelanggan.", badge: "Sinergi Ekosistem", color: "emerald" },
  { id: "sub-q4-5", question: "Bagaimana validitas penghematan dan anti-greenwashing dijamin?", challenge: "Memisahkan efek cuaca/trafik dan menjamin keabsahan klaim penghematan kWh.", solution: "Validasi kausal berbasis Difference-in-Differences (DiD), kepatuhan ITU-T L.1331, dan faktor emisi resmi ESDM 0,87 kgCO₂e/kWh.", badge: "Audit & Kepatuhan", color: "amber" }
];

// Nilai Tambah Pemangku Kepentingan Telkomsel
export const STAKEHOLDER_VALUE_MAPPING = [
  { id: "internal", stakeholder: "Tim jaringan, keuangan, dan ESG", focus: "Koordinasi data telemetri, efisiensi biaya, dan kepatuhan ESG.", valueAdded: "Orkestrasi terpusat yang mempercepat pengambilan keputusan lintas divisi Telkomsel.", roleBadge: "Internal" },
  { id: "investor", stakeholder: "Investor dan pemegang saham", focus: "Transparansi penggunaan modal dan pencapaian target Net-Zero.", valueAdded: "Model transparansi modal menjamin disiplin alokasi CapEx dan keterlacakan dividen efisiensi energi.", roleBadge: "Capital" },
  { id: "regulator", stakeholder: "Regulator dan pengelola aset", focus: "Kepatuhan POJK 51/2017 dan keandalan spektrum telekomunikasi.", valueAdded: "Pencatatan ledger SHA-256 dan kepatuhan guardrail mutu layanan standar Kominfo.", roleBadge: "Compliance" },
  { id: "customer", stakeholder: "Masyarakat dan pelanggan", focus: "Mutu layanan prima, panggilan darurat 112, dan dampak sosial.", valueAdded: "Perlindungan zero-wait 28ms untuk panggilan darurat serta dividen sosial elektrifikasi sekolah 3T.", roleBadge: "Service" }
];

// Matriks Manajemen Risiko & Mitigasi Operasional Telkomsel
export const RISK_ASSESSMENT_MATRIX = [
  { no: 1, category: "Mutu layanan dan keselamatan", description: "Intervensi daya radio berpotensi memengaruhi ketersediaan atau kualitas panggilan darurat 112.", level: "Mitigasi Aktif", color: "emerald", mitigation: "Hardware-enforced zero-wait rollback 28ms saat beban PRB > 65% atau panggilan darurat aktif.", owner: "Network Operations", status: "Terkendali (Fail-Safe 28ms)" },
  { no: 2, category: "Integritas data telemetri", description: "Data submetering shelter, invoice PLN, dan telemetri radio terancam discrepancy drift.", level: "Mitigasi Aktif", color: "emerald", mitigation: "Kalibrasi submetering IoT Class 0.5s dan rekonsiliasi otomatis harian AMR PLN.", owner: "IT & Keuangan", status: "Terkalibrasi Class 0.5s" },
  { no: 3, category: "Teknologi dan interoperabilitas vendor", description: "Standarisasi antarmuka O-RAN O1 dan lisensi multi-vendor (Huawei/Ericsson/ZTE).", level: "Mitigasi Aktif", color: "emerald", mitigation: "Integrasi modul melalui standard TM Forum TMF628 dan abstraction layer O-RAN O1 agnostik.", owner: "Arsitektur Jaringan", status: "Terkendali (O-RAN O1)" },
  { no: 4, category: "Kendali aset & kontrak sewa menara", description: "Batasan intervensi kelistrikan dan HVAC pada menara sewa milik TowerCo.", level: "Mitigasi Aktif", color: "emerald", mitigation: "Penerapan adendum kontrak skema insentif 85/15 pass-through tagihan listrik PLN.", owner: "Procurement & Legal", status: "Terselaraskan (85/15 Pass-Through)" },
  { no: 5, category: "Pengukuran & jaminan audit ESG", description: "Klaim penurunan emisi Scope 2 berisiko dituduh greenwashing jika tanpa standar audit.", level: "Mitigasi Aktif", color: "emerald", mitigation: "Metodologi DiD TWFE terkoreksi cuaca/trafik dan pencatatan ledger kriptografis SHA-256.", owner: "Sustainability / ESG", status: "Terverifikasi (ESDM 0.87)" },
  { no: 6, category: "Kelayakan finansial & arus kas", description: "Risiko underperformance efisiensi daya terhadap pengembalian investasi CapEx.", level: "Mitigasi Aktif", color: "emerald", mitigation: "Plafon investasi bertahap G0 (Rp95 Jt) dan klausul stop-loss otomatis di Gerbang G1.", owner: "Corporate Finance", status: "Terkendali (Plafon G0 & Stop-Loss G1)" }
];

// Kriteria Stage-Gate Keputusan Dewan Direksi Telkomsel
export const DECISION_GATE_CRITERIA = [
  { id: "gate-data", title: "1. Integritas dan kelengkapan data", threshold: "Kelengkapan data telemetri >= 99.0% dan audit AMR PLN.", currentValue: "99.8% Kelengkapan Data", status: "READY", evidence: "Integrasi telemetri O-RAN O1 & submetering AMR PLN aktif.", unit: "IT & Keuangan" },
  { id: "gate-energy", title: "2. Efisiensi energi terukur (DiD)", threshold: "Efisiensi terisolasi >= 10.0% terkoreksi beban dan cuaca.", currentValue: "14.8% - 18.8% Hemat Daya", status: "READY", evidence: "Hasil pemodelan DiD terkoreksi cuaca dan beban trafik diurnal.", unit: "Network Planning" },
  { id: "gate-finance", title: "3. Kelayakan finansial & swadana", threshold: "Simple payback <= 2.0 tahun dan NPV positif.", currentValue: "Payback 0.6 - 1.8 Tahun", status: "READY", evidence: "CapEx Rp450 jt turn-key dengan penghematan kas bulanan positif.", unit: "Finance" },
  { id: "gate-qos", title: "4. Mutu layanan dan keselamatan 112", threshold: "Drop call rate <= 0.20% dan zero impact pada panggilan 112.", currentValue: "28ms Latensi / 0.00% Drop", status: "READY", evidence: "Fail-safe zero-wait rollback 28ms terverifikasi pada rute 112.", unit: "Network Ops" }
];

export const SOLUTION_COMPARISON_MATRIX = [
  {
    dimension: "Cakupan Vendor RAN & Interoperabilitas",
    statusQuo: "Terfragmentasi manual di masing-masing NMS vendor (Ericsson OSS, Huawei U2020/MAE).",
    vendorRan: "Siloed per vendor (hanya mengoptimalkan radio milik sendiri; tidak bisa lintas vendor di area perbatasan).",
    iotEnvion: "Hanya sensor lingkungan shelter (genset/AC/baterai); buta terhadap parameter radio RF/PRB.",
    impactGrid: "Vendor-agnostic via arsitektur O-RAN O1/A1; mengorkestrasi BTS multi-vendor secara terkoordinasi tanpa blind-spot perbatasan."
  },
  {
    dimension: "Integrasi Rekening & Tarif Listrik PLN",
    statusQuo: "Rekonsiliasi invoice pascabayar manual via Excel dengan jeda waktu 30–45 hari.",
    vendorRan: "Nol integrasi tagihan; hanya menghitung estimasi daya internal perangkat tanpa korelasi tarif WBP/LWBP PLN.",
    iotEnvion: "Membaca data kWh meter lokal tanpa integrasi struktur kontrak tarif & daya tersambung PLN.",
    impactGrid: "Mengawinkan kurva trafik dinamis dengan struktur tarif WBP PLN (17:00–22:00) untuk memaksimalkan penghematan kas riil yang dapat dihindari (avoidable cost)."
  },
  {
    dimension: "Proteksi Mutu Layanan (QoS) & Layanan Vital",
    statusQuo: "Reaktif terhadap komplain pelanggan melalui laporan tiket NOC.",
    vendorRan: "Optimasi mandiri per sel yang berisiko menciptakan coverage hole jika sel tetangga tidak sinkron.",
    iotEnvion: "Tidak memiliki visibilitas terhadap panggilan darurat 112, throughput pengguna, atau drop call rate.",
    impactGrid: "SLA Guardrail berlapis dengan Emergency Stress Bypass (prioritas 112 & RS), Social Protected Zones, dan auto-rollback 120 detik (ITU-T E.106)."
  },
  {
    dimension: "Validasi Ilmiah & Pelaporan ESG (Anti-Greenwashing)",
    statusQuo: "Klaim agregat tanpa pemisahan efek cuaca, fluktuasi trafik, atau perubahan portofolio pelanggan.",
    vendorRan: "Klaim teoritis vendor ('hemat hingga 30%') tanpa kelompok pembanding independen.",
    iotEnvion: "Log data mentah tanpa standar verifikasi emisi Scope 2 terakreditasi.",
    impactGrid: "Quasi-eksperimen Difference-in-Differences (DiD) sesuai ITU-T L.1331/L.1350, SHA-256 tamper-evident ledger, dan kesiapan standar IAI PSPK 1/2."
  },
  {
    dimension: "Model Belanja Modal & Tata Kelola Risiko",
    statusQuo: "Biaya listrik membengkak seiring ekspansi 5G tanpa kontrol investasi bertahap.",
    vendorRan: "Lisensi fitur software berbiaya tinggi di muka (vendor lock-in CapEx) tanpa jaminan pengembalian kas.",
    iotEnvion: "Biaya sensor per shelter tanpa model sensitivitas NPV multi-tahun.",
    impactGrid: "Tata kelola Two-Stage Gate: Audit Kebutuhan Rp95 Juta → Pilot bersyarat 40+10 lokasi → Model sensitivitas 2 baseline transparan."
  }
];


// Kerangka Dividen Sosial & Reinvestasi Inklusi Digital Telkomsel
export const SOCIAL_DIVIDEND_CONFIG = {
  title: "Mekanisme Dividen Sosial & Pemerataan Konektivitas",
  subtitle: "Reinvestasi manfaat kas efisiensi energi ke program inklusi, pendidikan & UMKM Telkomsel",
  defaultReinvestPct: 50, // 50% dari kas penghematan neto dialokasikan ke dividen sosial
  allocationPillars: [
    {
      id: "jaga_cita",
      name: "Telkomsel Jaga Cita (Pendidikan 3T)",
      sharePct: 40,
      badge: "SDG 4: Quality Education",
      desc: "Paket kuota internet belajar & subsidi antena repeater penguat sinyal untuk sekolah binaan di wilayah 3T.",
      unitCostIDR: 1200000, // Rp 1,2 juta/sekolah/bulan
      unitLabel: "sekolah 3T terbantu konektivitasnya"
    },
    {
      id: "internet_baik",
      name: "Internet BAIK (Literasi Digital & UMKM)",
      sharePct: 35,
      badge: "SDG 8: Decent Work & Economic Growth",
      desc: "Workshop literasi keamanan digital, onboarding platform e-commerce, dan pelatihan talenta muda di sekitar BTS.",
      unitCostIDR: 5000000, // Rp 5 juta/batch pelatihan
      unitLabel: "batch pelatihan UMKM & talenta digital"
    },
    {
      id: "inclusive_power",
      name: "Keandalan Daya BTS Rural (Blank Spot)",
      sharePct: 25,
      badge: "SDG 9: Industry & Infrastructure",
      desc: "Penyediaan panel surya mikro & cadangan baterai litium untuk BTS pedesaan agar bebas gangguan mati lampu PLN.",
      unitCostIDR: 20000000, // Rp 20 juta/site mikro-solar
      unitLabel: "BTS pelosok diperkuat keandalan dayanya"
    }
  ]
};

// 4 Gerbang Kelanjutan (Stage-Gate Capital Allocation Governance Framework)
// Setiap gerbang memiliki aturan Go / No-Go eksplisit untuk memitigasi risiko modal & operasional
export const STAGE_GATE_DECISION_FRAMEWORK = [
  {
    gateId: "G0",
    timing: "Akhir Bulan 2 (Pasca Audit Plafon Rp 95 Juta)",
    title: "Gerbang 0: Kebutuhan & Hak Akses Data",
    stageOwner: "Komite Investasi, Direktur Network & CFO",
    question: "Apakah sistem internal Telkomsel belum memiliki kapabilitas ini dan apakah data meteran dapat diakses?",
    criteria: [
      { id: "g0_c1", label: "Analisis gap kapabilitas internal Telkomsel vs ImpactGrid", target: "Kebutuhan terbukti belum dipenuhi OSS/NMS internal", passDefault: true },
      { id: "g0_c2", label: "Kelengkapan data meteran PLN & tagihan submeter shelter", target: "Cakupan data meteran valid >= 95%", passDefault: true },
      { id: "g0_c3", label: "Hak akses & izin kendali aset menara (MoU TowerCo)", target: "Persetujuan tertulis pengelola menara diperoleh", passDefault: true }
    ],
    passAction: "Lanjut ke Tahap Persiapan Pilot (Gerbang G1). Alokasi CapEx pilot Rp450 juta dicairkan bertahap.",
    failAction: "STOP / PIVOT SEGERA. Hentikan proyek baru dan integrasikan modul ke sistem internal. Menyelamatkan dana pilot Rp450 juta.",
    governancePrinciple: "Menolak komitmen belanja modal sebelum baseline dan kebutuhan riil terbukti secara objektif."
  },
  {
    gateId: "G1",
    timing: "Akhir Bulan 4 (Pra-Intervensi Pilot)",
    title: "Gerbang 1: Kesiapan Uji & Kalibrasi Pembanding",
    stageOwner: "VP Network Architecture & Tim Litbang",
    question: "Apakah baseline 3 bulan stabil dan rancangan 40 uji vs 10 pembanding valid secara statistik?",
    criteria: [
      { id: "g1_c1", label: "Cakupan data operasional tervalidasi tanpa anomali", target: ">= 95% data interval 15 menit valid", passDefault: true },
      { id: "g1_c2", label: "Uji keseimbangan kelompok pembanding (Parallel-trend test)", target: "P-value korelasi paralel > 0,10 (tidak bias)", passDefault: true },
      { id: "g1_c3", label: "Uji coba simulasi fail-safe rollback otomatis", target: "Rollback berhasil tereksekusi dalam <= 120 detik", passDefault: true }
    ],
    passAction: "Mulai intervensi aktif (Bulan 5–7) pada 40 lokasi intervensi di bawah pengawasan NOC.",
    failAction: "TUNDA INTERVENSI AKTIF. Tambahkan 1 bulan observasi baseline atau ganti pasangan site kontrol yang lebih setara.",
    governancePrinciple: "Tidak melakukan intervensi fisik pada BTS sebelum metodologi pembanding bebas dari bias statistik."
  },
  {
    gateId: "G2",
    timing: "Akhir Bulan 7–8 (Evaluasi Tengah Pilot)",
    title: "Gerbang 2: Dampak Energi & Non-Inferioritas QoS",
    stageOwner: "VP Network Operations & Tim ESG Telkomsel",
    question: "Apakah terjadi penghematan energi signifikan tanpa menurunkan mutu layanan dan panggilan 112?",
    criteria: [
      { id: "g2_c1", label: "Efisiensi energi terisolir DiD (Difference-in-Differences)", target: "Penghematan tambahan >= 5% terhadap kelompok kontrol", passDefault: true },
      { id: "g2_c2", label: "Non-inferioritas ketersediaan & panggilan darurat 112", target: "Availability >= 99,95% & zero blokir panggilan 112", passDefault: true },
      { id: "g2_c3", label: "Batas margin latensi dan keluhan pelanggan", target: "Delta latensi <= 2ms & peningkatan keluhan < 1%", passDefault: true }
    ],
    passAction: "Pertahankan intervensi optimal dan susun laporan evaluasi komprehensif untuk Direksi.",
    failAction: "SAFE-MODE ROLLBACK OTOMATIS. Nonaktifkan carrier sleep pada BTS yang mengalami penurunan metrik.",
    governancePrinciple: "Mutu konektivitas 150+ juta pelanggan dan keselamatan publik (112) selalu mengungguli efisiensi daya."
  },
  {
    gateId: "G3",
    timing: "Akhir Bulan 9 (Keputusan Pasca-Pilot & Investasi Lanjutan)",
    title: "Gerbang 3: Nilai Tambah Finansial & Kelayakan Ekspansi",
    stageOwner: "Dewan Direksi (Direktur Utama, CFO, CTO)",
    question: "Apakah penghematan kas bersih menghasilkan nilai tambah yang memadai untuk ekspansi Horizon 2?",
    criteria: [
      { id: "g3_c1", label: "Arus kas bersih setelah memperhitungkan biaya vendor", target: "Kas neto positif pada skala regional 5.000 menara", passDefault: true },
      { id: "g3_c2", label: "Sensitivitas NPV 5 tahun berdasarkan baseline tervalidasi", target: "NPV positif pada skenario baseline terverifikasi", passDefault: true },
      { id: "g3_c3", label: "Kesiapan kepatuhan standar pelaporan IAI PSPK 1/2", target: "Jejak audit SHA-256 lulus telaah tim kepatuhan ESG", passDefault: true }
    ],
    passAction: "SETUJUI EKSPANSI BERSYARAT ke Horizon 2 (5.000 menara makro Jamali) dengan skema swadana operasional.",
    failAction: "HENTIKAN EKSPANSI. Manfaatkan kode dan temuan pilot sebagai aset riset internal tanpa belanja modal baru.",
    governancePrinciple: "Keputusan skala besar wajib didasarkan pada arus kas nyata yang dapat dibuktikan, bukan perkiraan teoritis."
  }
];

// Matriks Komparasi Teknis Multi-Vendor RAN Telkomsel (Ericsson, Huawei, ZTE)
export const MULTI_VENDOR_RAN_COMPARISON = [
  {
    vendor: "Ericsson",
    ossPlatform: "Ericsson Network Manager (ENM 24.x)",
    hardwareSeries: "Radio 4415 / AIR 6419 (B1/B3/B8/n78)",
    oranO1Protocol: "NETCONF/YANG O-RAN.WG10 v08.00 + 3GPP Rel-18 NES",
    sleepModes: "Micro-Sleep TX, MIMO Mutings, Deep Carrier Sleep",
    wakeUpLatencyMs: 24,
    avgEfficiencyPct: 14.9,
    dcSubmeterSync: "Smart Shunt 48V DC Modbus-TCP (Akurasi 0.45%)",
    pilotSitesCount: 20,
    jamaliSitesCount: 2150,
    statusBadge: "Tersertifikasi Penuh O1"
  },
  {
    vendor: "Huawei",
    ossPlatform: "iMaster MAE / U2020 MBB Engine",
    hardwareSeries: "AAU5613 / RRU5502 & BBU5900",
    oranO1Protocol: "O1 Adapter Bridge + Northbound RESTCONF/NETCONF",
    sleepModes: "Symbol Power Saving, Channel Shutoff, Deep Dormancy",
    wakeUpLatencyMs: 28,
    avgEfficiencyPct: 15.2,
    dcSubmeterSync: "Huawei SmartLi / NetEco 48V Busbar (Akurasi 0.48%)",
    pilotSitesCount: 18,
    jamaliSitesCount: 2050,
    statusBadge: "Tersertifikasi Penuh O1"
  },
  {
    vendor: "ZTE",
    ossPlatform: "ZenIC NetNumen U31 / PowerPilot Pro",
    hardwareSeries: "UniSite R8892E / A9611 Macro",
    oranO1Protocol: "NETCONF/YANG Standard + TMF628 PM Collector",
    sleepModes: "PA Bias Dynamic Muting, Carrier Shutoff, RF Deep Sleep",
    wakeUpLatencyMs: 27,
    avgEfficiencyPct: 14.1,
    dcSubmeterSync: "ZXDU88 Smart Rectifier Telemetry (Akurasi 0.50%)",
    pilotSitesCount: 12,
    jamaliSitesCount: 800,
    statusBadge: "Tersertifikasi Penuh O1"
  }
];

// Rincian Ekspansi Skala Regional Jamali 5.000 Site per Kluster Operasional Telkomsel
export const JAMALI_REGIONAL_CLUSTERS = [
  {
    id: "REG-Jabo",
    clusterName: "Regional Jabodetabek & Banten",
    hqCity: "Jakarta Selatan",
    siteCount: 1650,
    dominantVendor: "Ericsson & Huawei",
    baselineGWhYear: 82.5,
    targetSavingPct: 13.8,
    savedGWhYear: 11.39,
    grossSavingMiliarIDR: 17.08,
    netBenefitMiliarIDR: 14.52,
    capexMiliarIDR: 2.15,
    carbonReducedTon: 9909,
    wbpPeakShavingMw: 3.3,
    slaAvailabilityPct: 99.996
  },
  {
    id: "REG-Jabar",
    clusterName: "Regional Jawa Barat (Bandung & Priangan)",
    hqCity: "Bandung",
    siteCount: 1100,
    dominantVendor: "Huawei & Ericsson",
    baselineGWhYear: 52.8,
    targetSavingPct: 14.8,
    savedGWhYear: 7.81,
    grossSavingMiliarIDR: 11.72,
    netBenefitMiliarIDR: 9.96,
    capexMiliarIDR: 1.43,
    carbonReducedTon: 6795,
    wbpPeakShavingMw: 2.2,
    slaAvailabilityPct: 99.995
  },
  {
    id: "REG-Jateng",
    clusterName: "Regional Jawa Tengah & DIY",
    hqCity: "Semarang",
    siteCount: 850,
    dominantVendor: "Ericsson & ZTE",
    baselineGWhYear: 39.1,
    targetSavingPct: 14.2,
    savedGWhYear: 5.55,
    grossSavingMiliarIDR: 8.33,
    netBenefitMiliarIDR: 7.08,
    capexMiliarIDR: 1.10,
    carbonReducedTon: 4829,
    wbpPeakShavingMw: 1.7,
    slaAvailabilityPct: 99.994
  },
  {
    id: "REG-Jatim",
    clusterName: "Regional Jawa Timur & Madura",
    hqCity: "Surabaya",
    siteCount: 1050,
    dominantVendor: "Huawei & ZTE",
    baselineGWhYear: 51.45,
    targetSavingPct: 14.5,
    savedGWhYear: 7.46,
    grossSavingMiliarIDR: 11.19,
    netBenefitMiliarIDR: 9.51,
    capexMiliarIDR: 1.37,
    carbonReducedTon: 6490,
    wbpPeakShavingMw: 2.1,
    slaAvailabilityPct: 99.995
  },
  {
    id: "REG-Balnus",
    clusterName: "Regional Bali & Nusa Tenggara",
    hqCity: "Denpasar",
    siteCount: 350,
    dominantVendor: "ZTE & Ericsson",
    baselineGWhYear: 16.8,
    targetSavingPct: 15.1,
    savedGWhYear: 2.54,
    grossSavingMiliarIDR: 3.81,
    netBenefitMiliarIDR: 3.24,
    capexMiliarIDR: 0.45,
    carbonReducedTon: 2210,
    wbpPeakShavingMw: 0.7,
    slaAvailabilityPct: 99.993
  }
];

