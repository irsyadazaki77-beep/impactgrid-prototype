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
  appName: "ImpactGrid — Konsep Studi Kasus Telkomsel",
  tagline: "Rancangan sistem pendukung keputusan efisiensi energi jaringan",
  teamName: "AWAKENING Reborn",
  competition: "TDC Summit Fest (TSF) 2026 - Business Case Competition",
  caseCollaborator: "PT Telekomunikasi Selular (Telkomsel)",
  version: "Prototype konseptual - tanpa data operasional",
  
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
  
  // 4 Modul Resmi Naskah Proposal
  modules: [
    { id: "mod1", name: "Network Data Hub", desc: "Usulan konsolidasi data energi, trafik, meter/tagihan, dan metadata setelah akses serta rekonsiliasi disetujui" },
    { id: "mod2", name: "Scenario Lab", desc: "Sensitivitas asumsi untuk opsi yang perlu dikaji; belum menggunakan data cuaca, trafik, atau perangkat terukur" },
    { id: "mod3", name: "Investment Prioritizer", desc: "Kerangka perbandingan portofolio yang menunggu baseline, biaya, batas layanan, dan kriteria yang disetujui" },
    { id: "mod4", name: "ESG Impact Verification", desc: "Kerangka pengukuran yang memerlukan baseline, faktor emisi, pembanding, dan tinjauan ESG" }
  ]
};

// Proposal horizons are conditional. Only the pilot parameters below are illustrative sensitivities.
export const IMPLEMENTATION_HORIZONS = {
  pilot: {
    name: "Rancangan pilot (bersyarat; baseline belum tervalidasi)",
    scope: "Usulan 40 lokasi intervensi + 10 lokasi pembanding",
    totalSites: 50,
    interventionSites: 40,
    controlSites: 10,
    status: "Cakupan usulan; belum disetujui atau dijalankan",
    assumptionNote: "Baseline dan biaya di bawah adalah input sensitivitas proposal, bukan data site atau penawaran tervalidasi.",
    baselineKWhYear: 730000,
    baselineCostYearIDR: 1095000000,
    capexIDR: 450000000,
    opexYearIDR: 60000000,
    scenarios: [
      {
        name: "Hemat 5% - asumsi",
        efficiencyPct: 5,
        savedKWhYear: 36500,
        grossSavingIDR: 54750000,
        netBenefitYearIDR: -5250000,
        paybackYears: null,
        npv5YearsIDR: -493600000,
        emissionsReducedTon: null,
        status: "SENSITIVITAS_BELUM_TERVERIFIKASI"
      },
      {
        name: "Hemat 8% - asumsi",
        efficiencyPct: 8,
        savedKWhYear: 58400,
        grossSavingIDR: 87600000,
        netBenefitYearIDR: 27600000,
        paybackYears: null,
        npv5YearsIDR: -391500000,
        emissionsReducedTon: null,
        status: "SENSITIVITAS_BELUM_TERVERIFIKASI"
      },
      {
        name: "Hemat 12% - asumsi",
        efficiencyPct: 12,
        savedKWhYear: 87600,
        grossSavingIDR: 131400000,
        netBenefitYearIDR: 71400000,
        paybackYears: null,
        npv5YearsIDR: -255300000,
        emissionsReducedTon: null,
        status: "SENSITIVITAS_BELUM_TERVERIFIKASI"
      }
    ]
  },
  regional: {
    name: "Ekspansi regional (proyeksi proposal 2028–2029)",
    scope: "5.000 Lokasi Makro Prioritas (Kluster Jamali)",
    sitesCount: 5000,
    interventionSites: 4500,
    controlSites: 500,
    status: "Proyeksi proposal bersyarat pasca-pilot",
    assumptionNote: "Estimasi berdasarkan replikasi intervensi pendingin efisien dan Carrier Sleep pada kluster bertarif listrik tinggi.",
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
    name: "Perluasan nasional penuh (visi proposal 2030–2031)",
    scope: "10.000+ Menara Makro Terpilih Nasional",
    sitesCount: 10000,
    interventionSites: 9000,
    controlSites: 1000,
    status: "Proyeksi jangka panjang net-zero transition",
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

// Estimasi proposal; belum merupakan anggaran yang disetujui atau quotation vendor.
export const PILOT_CAPEX_BREAKDOWN = [
  {
    komponen: "1. Pengembangan Prototipe Sistem (CapEx)",
    biayaIDR: 180000000,
    status: "Estimasi tim; belum ada quotation",
    justifikasi: "Pembangunan antarmuka web ImpactGrid, modul Network Data Hub, Scenario Lab, dan mesin optimasi portofolio Investment Prioritizer."
  },
  {
    komponen: "2. Integrasi Data & Keamanan Sistem (CapEx)",
    biayaIDR: 70000000,
    status: "Estimasi tim; belum ada asesmen atau quotation",
    justifikasi: "Penyiapan pipa data terstruktur/agregat, rekonsiliasi meter & tagihan, kontrol akses berbasis peran (RBAC), dan perlindungan keamanan siber."
  },
  {
    komponen: "3. Intervensi Teknis Ringan pada Lokasi Uji (CapEx)",
    biayaIDR: 160000000,
    status: "Estimasi tim; belum ada quotation atau daftar lokasi",
    justifikasi: "Penyesuaian parameter pendinginan, kalibrasi sensor, dan optimasi perangkat eksisting pada 40 lokasi intervensi (rata-rata Rp4 juta/lokasi)."
  },
  {
    komponen: "4. Verifikasi Metodologi & Evaluasi (CapEx)",
    biayaIDR: 40000000,
    status: "Estimasi tim; lingkup dan biaya belum disepakati",
    justifikasi: "Penyiapan kerangka ESG Impact Verification, pengukuran baseline terkoreksi trafik/cuaca, serta evaluasi komparatif terhadap 10 lokasi pembanding."
  }
];
// Candidate intervention types are concepts only; no cost, savings, carbon, or QoS value is validated.
export const INTERVENTION_TYPES = [
  { id: "INT-AC", name: "Evaluasi setpoint pendinginan", shortName: "Pendinginan", category: "HVAC", capexIDR: null, annualSavingKWh: null, annualSavingIDR: null, opexYearIDR: null, netBenefitYearIDR: null, paybackYears: null, carbonReducedTon: null, latencyDeltaMs: null, qosProtection: "Belum diuji", desc: "Opsi untuk dikaji bersama pemilik lokasi, perangkat, dan tim operasi." },
  { id: "INT-SLEEP", name: "Kajian fitur hemat energi RAN", shortName: "Fitur RAN", category: "RAN", capexIDR: null, annualSavingKWh: null, annualSavingIDR: null, opexYearIDR: null, netBenefitYearIDR: null, paybackYears: null, carbonReducedTon: null, latencyDeltaMs: null, qosProtection: "Belum diuji", desc: "Opsi vendor dan perangkat harus dipastikan sebelum analisis kelayakan." },
  { id: "INT-COMBINED", name: "Kombinasi intervensi (belum ditentukan)", shortName: "Kombinasi", category: "Rancangan", capexIDR: null, annualSavingKWh: null, annualSavingIDR: null, opexYearIDR: null, netBenefitYearIDR: null, paybackYears: null, carbonReducedTon: null, latencyDeltaMs: null, qosProtection: "Belum diuji", desc: "Kombinasi hanya ditentukan setelah audit teknis dan data baseline tersedia." },
  { id: "INT-SOLAR", name: "Kajian opsi energi terbarukan dan penyimpanan", shortName: "Energi terbarukan", category: "Energi", capexIDR: null, annualSavingKWh: null, annualSavingIDR: null, opexYearIDR: null, netBenefitYearIDR: null, paybackYears: null, carbonReducedTon: null, latencyDeltaMs: null, qosProtection: "Belum diuji", desc: "Kelayakan bergantung pada lokasi, aset, izin, biaya, dan kinerja yang diukur." }
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
  { id: 'JKT-SEL-01', name: 'Kebayoran Baru Macro Hub', cluster: 'JKT-URB', region: 'DKI Jakarta', group: 'intervention', lat: -6.2415, lng: 106.8005, baselineDailyKWh: 138, measuredDailyKWh: 112, savingsPct: 18.8, mode: 'Carrier Sleep B3/B8', trafficLoad: '72 Mbps (34% PRB)', tempC: 28.6, qosDrop: '0.06%', status: 'Optimal' },
  { id: 'JKT-SEL-02', name: 'Senayan Plaza Micro BTS', cluster: 'JKT-URB', region: 'DKI Jakarta', group: 'intervention', lat: -6.2230, lng: 106.8010, baselineDailyKWh: 124, measuredDailyKWh: 104, savingsPct: 16.1, mode: 'Deep Sleep Symbol', trafficLoad: '58 Mbps (26% PRB)', tempC: 27.8, qosDrop: '0.05%', status: 'Optimal' },
  { id: 'JKT-SEL-03', name: 'Mampang Prapatan BTS', cluster: 'JKT-URB', region: 'DKI Jakarta', group: 'intervention', lat: -6.2512, lng: 106.8251, baselineDailyKWh: 142, measuredDailyKWh: 118, savingsPct: 16.9, mode: 'Dynamic HVAC 26°C', trafficLoad: '84 Mbps (42% PRB)', tempC: 29.1, qosDrop: '0.07%', status: 'Optimal' },
  { id: 'JKT-PST-04', name: 'Sudirman Tower Macro Hub', cluster: 'JKT-URB', region: 'DKI Jakarta', group: 'intervention', lat: -6.2088, lng: 106.8210, baselineDailyKWh: 155, measuredDailyKWh: 132, savingsPct: 14.8, mode: 'Carrier Sleep Multi-Band', trafficLoad: '128 Mbps (56% PRB)', tempC: 29.8, qosDrop: '0.08%', status: 'Optimal' },
  { id: 'JKT-PST-05', name: 'Thamrin Monas Edge BTS', cluster: 'JKT-URB', region: 'DKI Jakarta', group: 'intervention', lat: -6.1870, lng: 106.8240, baselineDailyKWh: 130, measuredDailyKWh: 110, savingsPct: 15.4, mode: 'Carrier Sleep B1/B3', trafficLoad: '92 Mbps (44% PRB)', tempC: 28.4, qosDrop: '0.06%', status: 'Optimal' },
  { id: 'JKT-PST-06', name: 'Cempaka Putih Shelter', cluster: 'JKT-URB', region: 'DKI Jakarta', group: 'intervention', lat: -6.1780, lng: 106.8680, baselineDailyKWh: 128, measuredDailyKWh: 109, savingsPct: 14.8, mode: 'Dynamic HVAC 26°C', trafficLoad: '76 Mbps (38% PRB)', tempC: 28.2, qosDrop: '0.07%', status: 'Optimal' },
  { id: 'JKT-BRT-07', name: 'Tomang Interchange BTS', cluster: 'JKT-URB', region: 'DKI Jakarta', group: 'intervention', lat: -6.1750, lng: 106.7900, baselineDailyKWh: 136, measuredDailyKWh: 115, savingsPct: 15.4, mode: 'Carrier Sleep B8', trafficLoad: '82 Mbps (40% PRB)', tempC: 28.9, qosDrop: '0.06%', status: 'Optimal' },
  { id: 'JKT-BRT-08', name: 'Kebon Jeruk Macro Hub', cluster: 'JKT-URB', region: 'DKI Jakarta', group: 'intervention', lat: -6.1920, lng: 106.7680, baselineDailyKWh: 145, measuredDailyKWh: 122, savingsPct: 15.9, mode: 'Smart Micro-Cooling', trafficLoad: '96 Mbps (46% PRB)', tempC: 28.5, qosDrop: '0.08%', status: 'Optimal' },
  { id: 'JKT-TIM-09', name: 'Cawang Junction Macro', cluster: 'JKT-URB', region: 'DKI Jakarta', group: 'intervention', lat: -6.2480, lng: 106.8710, baselineDailyKWh: 148, measuredDailyKWh: 125, savingsPct: 15.5, mode: 'Carrier Sleep B3/B8', trafficLoad: '104 Mbps (52% PRB)', tempC: 29.2, qosDrop: '0.07%', status: 'Optimal' },
  { id: 'JKT-TIM-10', name: 'Rawamangun Transit BTS', cluster: 'JKT-URB', region: 'DKI Jakarta', group: 'intervention', lat: -6.1960, lng: 106.8850, baselineDailyKWh: 126, measuredDailyKWh: 108, savingsPct: 14.3, mode: 'Deep Sleep Symbol', trafficLoad: '64 Mbps (30% PRB)', tempC: 27.9, qosDrop: '0.05%', status: 'Optimal' },
  { id: 'JKT-UT-11', name: 'Kelapa Gading Boulevard BTS', cluster: 'JKT-URB', region: 'DKI Jakarta', group: 'intervention', lat: -6.1580, lng: 106.9080, baselineDailyKWh: 139, measuredDailyKWh: 118, savingsPct: 15.1, mode: 'Dynamic HVAC 26°C', trafficLoad: '88 Mbps (41% PRB)', tempC: 28.7, qosDrop: '0.06%', status: 'Optimal' },
  { id: 'JKT-UT-12', name: 'Pluit Muara Karang BTS', cluster: 'JKT-URB', region: 'DKI Jakarta', group: 'intervention', lat: -6.1190, lng: 106.7820, baselineDailyKWh: 134, measuredDailyKWh: 114, savingsPct: 14.9, mode: 'Carrier Sleep B1/B8', trafficLoad: '78 Mbps (36% PRB)', tempC: 29.0, qosDrop: '0.06%', status: 'Optimal' },
  { id: 'TNG-BSD-13', name: 'BSD Green Office Macro', cluster: 'JKT-URB', region: 'Banten', group: 'intervention', lat: -6.3020, lng: 106.6540, baselineDailyKWh: 144, measuredDailyKWh: 118, savingsPct: 18.1, mode: 'Carrier Sleep Multi-Band', trafficLoad: '90 Mbps (43% PRB)', tempC: 28.1, qosDrop: '0.05%', status: 'Optimal' },
  { id: 'BKS-CYB-14', name: 'Bekasi Cyber Park BTS', cluster: 'JKT-URB', region: 'Jawa Barat', group: 'intervention', lat: -6.2440, lng: 106.9920, baselineDailyKWh: 141, measuredDailyKWh: 120, savingsPct: 14.9, mode: 'Dynamic HVAC 26°C', trafficLoad: '98 Mbps (48% PRB)', tempC: 29.5, qosDrop: '0.08%', status: 'Optimal' },
  { id: 'DPK-MGD-15', name: 'Margonda Raya BTS', cluster: 'JKT-URB', region: 'Jawa Barat', group: 'intervention', lat: -6.3720, lng: 106.8320, baselineDailyKWh: 132, measuredDailyKWh: 113, savingsPct: 14.4, mode: 'Carrier Sleep B3', trafficLoad: '86 Mbps (41% PRB)', tempC: 28.6, qosDrop: '0.07%', status: 'Optimal' },
  { id: 'BGR-PAJ-16', name: 'Bogor Pajajaran Macro', cluster: 'JKT-URB', region: 'Jawa Barat', group: 'intervention', lat: -6.5980, lng: 106.8080, baselineDailyKWh: 125, measuredDailyKWh: 106, savingsPct: 15.2, mode: 'Carrier Sleep B8', trafficLoad: '70 Mbps (35% PRB)', tempC: 26.8, qosDrop: '0.05%', status: 'Optimal' },
  // Kontrol Pembanding Jabodetabek (4 Menara)
  { id: 'JKT-KTL-C01', name: 'Kuningan Mega Control', cluster: 'JKT-URB', region: 'DKI Jakarta', group: 'control', lat: -6.2290, lng: 106.8270, baselineDailyKWh: 148, measuredDailyKWh: 147, savingsPct: 0.7, mode: 'Pure Baseline (No Intervention)', trafficLoad: '115 Mbps (54% PRB)', tempC: 30.2, qosDrop: '0.09%', status: 'Control Active' },
  { id: 'JKT-KTL-C02', name: 'Grogol Petamburan Control', cluster: 'JKT-URB', region: 'DKI Jakarta', group: 'control', lat: -6.1660, lng: 106.7880, baselineDailyKWh: 135, measuredDailyKWh: 134, savingsPct: 0.7, mode: 'Pure Baseline (No Intervention)', trafficLoad: '85 Mbps (42% PRB)', tempC: 29.8, qosDrop: '0.08%', status: 'Control Active' },
  { id: 'JKT-KTL-C03', name: 'Jatinegara Timur Control', cluster: 'JKT-URB', region: 'DKI Jakarta', group: 'control', lat: -6.2280, lng: 106.8690, baselineDailyKWh: 140, measuredDailyKWh: 139, savingsPct: 0.7, mode: 'Pure Baseline (No Intervention)', trafficLoad: '95 Mbps (45% PRB)', tempC: 30.4, qosDrop: '0.07%', status: 'Control Active' },
  { id: 'TNG-KTL-C04', name: 'Tangerang Kota Control', cluster: 'JKT-URB', region: 'Banten', group: 'control', lat: -6.1780, lng: 106.6330, baselineDailyKWh: 138, measuredDailyKWh: 137, savingsPct: 0.7, mode: 'Pure Baseline (No Intervention)', trafficLoad: '90 Mbps (43% PRB)', tempC: 29.9, qosDrop: '0.08%', status: 'Control Active' },

  // --- Kluster 2: Bandung Suburban Hub (15 Menara) ---
  { id: 'BDG-DGO-17', name: 'Dago Atas Macro Hub', cluster: 'BDG-SUB', region: 'Jawa Barat', group: 'intervention', lat: -6.8680, lng: 107.6210, baselineDailyKWh: 118, measuredDailyKWh: 94, savingsPct: 20.3, mode: 'Deep Sleep Symbol', trafficLoad: '48 Mbps (22% PRB)', tempC: 25.2, qosDrop: '0.04%', status: 'Optimal' },
  { id: 'BDG-RIA-18', name: 'Riau Heritage Commercial BTS', cluster: 'BDG-SUB', region: 'Jawa Barat', group: 'intervention', lat: -6.9080, lng: 107.6180, baselineDailyKWh: 126, measuredDailyKWh: 104, savingsPct: 17.5, mode: 'Carrier Sleep B3/B8', trafficLoad: '74 Mbps (35% PRB)', tempC: 26.5, qosDrop: '0.06%', status: 'Optimal' },
  { id: 'BDG-BRG-19', name: 'Braga Center Micro Hub', cluster: 'BDG-SUB', region: 'Jawa Barat', group: 'intervention', lat: -6.9180, lng: 107.6090, baselineDailyKWh: 114, measuredDailyKWh: 96, savingsPct: 15.8, mode: 'Deep Sleep Symbol', trafficLoad: '52 Mbps (24% PRB)', tempC: 26.1, qosDrop: '0.05%', status: 'Optimal' },
  { id: 'BDG-BST-20', name: 'Buah Batu Macro Hub', cluster: 'BDG-SUB', region: 'Jawa Barat', group: 'intervention', lat: -6.9420, lng: 107.6320, baselineDailyKWh: 129, measuredDailyKWh: 108, savingsPct: 16.3, mode: 'Dynamic HVAC 26°C', trafficLoad: '80 Mbps (39% PRB)', tempC: 27.0, qosDrop: '0.06%', status: 'Optimal' },
  { id: 'BDG-STB-21', name: 'Setiabudi Regency BTS', cluster: 'BDG-SUB', region: 'Jawa Barat', group: 'intervention', lat: -6.8520, lng: 107.5950, baselineDailyKWh: 115, measuredDailyKWh: 93, savingsPct: 19.1, mode: 'Smart Micro-Cooling', trafficLoad: '44 Mbps (20% PRB)', tempC: 24.8, qosDrop: '0.04%', status: 'Optimal' },
  { id: 'BDG-PST-22', name: 'Pasteur Gateway BTS', cluster: 'BDG-SUB', region: 'Jawa Barat', group: 'intervention', lat: -6.8920, lng: 107.5840, baselineDailyKWh: 135, measuredDailyKWh: 112, savingsPct: 17.0, mode: 'Carrier Sleep Multi-Band', trafficLoad: '96 Mbps (47% PRB)', tempC: 27.4, qosDrop: '0.07%', status: 'Optimal' },
  { id: 'BDG-UBR-23', name: 'Ujung Berung Macro BTS', cluster: 'BDG-SUB', region: 'Jawa Barat', group: 'intervention', lat: -6.9150, lng: 107.6980, baselineDailyKWh: 122, measuredDailyKWh: 102, savingsPct: 16.4, mode: 'Carrier Sleep B8', trafficLoad: '62 Mbps (31% PRB)', tempC: 26.9, qosDrop: '0.05%', status: 'Optimal' },
  { id: 'BDG-KPO-24', name: 'Kopo Industrial BTS', cluster: 'BDG-SUB', region: 'Jawa Barat', group: 'intervention', lat: -6.9620, lng: 107.5750, baselineDailyKWh: 130, measuredDailyKWh: 109, savingsPct: 16.2, mode: 'Dynamic HVAC 26°C', trafficLoad: '78 Mbps (38% PRB)', tempC: 27.8, qosDrop: '0.06%', status: 'Optimal' },
  { id: 'BDG-CMH-25', name: 'Cimahi Macro Gateway', cluster: 'BDG-SUB', region: 'Jawa Barat', group: 'intervention', lat: -6.8720, lng: 107.5420, baselineDailyKWh: 127, measuredDailyKWh: 106, savingsPct: 16.5, mode: 'Carrier Sleep B3/B8', trafficLoad: '72 Mbps (35% PRB)', tempC: 26.6, qosDrop: '0.06%', status: 'Optimal' },
  { id: 'BDG-PDL-26', name: 'Padalarang High-Speed BTS', cluster: 'BDG-SUB', region: 'Jawa Barat', group: 'intervention', lat: -6.8400, lng: 107.4850, baselineDailyKWh: 132, measuredDailyKWh: 110, savingsPct: 16.7, mode: 'Deep Sleep Symbol', trafficLoad: '68 Mbps (32% PRB)', tempC: 26.2, qosDrop: '0.05%', status: 'Optimal' },
  { id: 'BDG-JAT-27', name: 'Jatinangor Campus Hub', cluster: 'BDG-SUB', region: 'Jawa Barat', group: 'intervention', lat: -6.9310, lng: 107.7720, baselineDailyKWh: 120, measuredDailyKWh: 101, savingsPct: 15.8, mode: 'Dynamic HVAC 26°C', trafficLoad: '66 Mbps (33% PRB)', tempC: 26.4, qosDrop: '0.05%', status: 'Optimal' },
  { id: 'BDG-SOR-28', name: 'Soreang Macro Hub', cluster: 'BDG-SUB', region: 'Jawa Barat', group: 'intervention', lat: -7.0250, lng: 107.5250, baselineDailyKWh: 116, measuredDailyKWh: 97, savingsPct: 16.4, mode: 'Smart Micro-Cooling', trafficLoad: '54 Mbps (26% PRB)', tempC: 25.5, qosDrop: '0.04%', status: 'Optimal' },
  // Kontrol Pembanding Bandung (3 Menara)
  { id: 'BDG-KTL-C05', name: 'Asia Afrika Control', cluster: 'BDG-SUB', region: 'Jawa Barat', group: 'control', lat: -6.9210, lng: 107.6100, baselineDailyKWh: 128, measuredDailyKWh: 127, savingsPct: 0.8, mode: 'Pure Baseline (No Intervention)', trafficLoad: '82 Mbps (40% PRB)', tempC: 27.9, qosDrop: '0.07%', status: 'Control Active' },
  { id: 'BDG-KTL-C06', name: 'Sukajadi Macro Control', cluster: 'BDG-SUB', region: 'Jawa Barat', group: 'control', lat: -6.8850, lng: 107.5980, baselineDailyKWh: 125, measuredDailyKWh: 124, savingsPct: 0.8, mode: 'Pure Baseline (No Intervention)', trafficLoad: '76 Mbps (37% PRB)', tempC: 27.6, qosDrop: '0.06%', status: 'Control Active' },
  { id: 'BDG-KTL-C07', name: 'Kiaracondong Control', cluster: 'BDG-SUB', region: 'Jawa Barat', group: 'control', lat: -6.9320, lng: 107.6450, baselineDailyKWh: 131, measuredDailyKWh: 130, savingsPct: 0.8, mode: 'Pure Baseline (No Intervention)', trafficLoad: '88 Mbps (43% PRB)', tempC: 28.3, qosDrop: '0.07%', status: 'Control Active' },

  // --- Kluster 3: Surabaya Industrial Zone (15 Menara) ---
  { id: 'SBY-RKT-29', name: 'Rungkut Industri Macro P01', cluster: 'SBY-IND', region: 'Jawa Timur', group: 'intervention', lat: -7.3250, lng: 107.7650, baselineDailyKWh: 152, measuredDailyKWh: 130, savingsPct: 14.5, mode: 'Dynamic HVAC 26°C', trafficLoad: '112 Mbps (52% PRB)', tempC: 31.8, qosDrop: '0.09%', status: 'Optimal' },
  { id: 'SBY-RKT-30', name: 'SIER Cyber BTS', cluster: 'SBY-IND', region: 'Jawa Timur', group: 'intervention', lat: -7.3310, lng: 112.7580, baselineDailyKWh: 146, measuredDailyKWh: 126, savingsPct: 13.7, mode: 'Carrier Sleep B3/B8', trafficLoad: '98 Mbps (46% PRB)', tempC: 31.4, qosDrop: '0.08%', status: 'Optimal' },
  { id: 'SBY-PRK-31', name: 'Tanjung Perak Port Macro', cluster: 'SBY-IND', region: 'Jawa Timur', group: 'intervention', lat: -7.2020, lng: 112.7350, baselineDailyKWh: 158, measuredDailyKWh: 136, savingsPct: 13.9, mode: 'Carrier Sleep Multi-Band', trafficLoad: '135 Mbps (61% PRB)', tempC: 32.5, qosDrop: '0.10%', status: 'Optimal' },
  { id: 'SBY-TJN-32', name: 'Tunjungan City BTS', cluster: 'SBY-IND', region: 'Jawa Timur', group: 'intervention', lat: -7.2620, lng: 112.7380, baselineDailyKWh: 140, measuredDailyKWh: 122, savingsPct: 12.9, mode: 'Carrier Sleep B1/B8', trafficLoad: '105 Mbps (49% PRB)', tempC: 30.8, qosDrop: '0.07%', status: 'Optimal' },
  { id: 'SBY-WRO-33', name: 'Waru Gateway Interchange', cluster: 'SBY-IND', region: 'Jawa Timur', group: 'intervention', lat: -7.3520, lng: 112.7320, baselineDailyKWh: 149, measuredDailyKWh: 128, savingsPct: 14.1, mode: 'Dynamic HVAC 26°C', trafficLoad: '118 Mbps (55% PRB)', tempC: 31.2, qosDrop: '0.08%', status: 'Optimal' },
  { id: 'SBY-GUB-34', name: 'Gubeng Station BTS', cluster: 'SBY-IND', region: 'Jawa Timur', group: 'intervention', lat: -7.2650, lng: 112.7520, baselineDailyKWh: 135, measuredDailyKWh: 118, savingsPct: 12.6, mode: 'Deep Sleep Symbol', trafficLoad: '88 Mbps (42% PRB)', tempC: 30.5, qosDrop: '0.06%', status: 'Optimal' },
  { id: 'SBY-DAR-35', name: 'Darmo Boulevard Macro', cluster: 'SBY-IND', region: 'Jawa Timur', group: 'intervention', lat: -7.2880, lng: 112.7360, baselineDailyKWh: 138, measuredDailyKWh: 120, savingsPct: 13.0, mode: 'Carrier Sleep B3', trafficLoad: '92 Mbps (44% PRB)', tempC: 30.6, qosDrop: '0.07%', status: 'Optimal' },
  { id: 'SBY-WYN-36', name: 'Wonokromo Transit Hub', cluster: 'SBY-IND', region: 'Jawa Timur', group: 'intervention', lat: -7.3020, lng: 112.7390, baselineDailyKWh: 142, measuredDailyKWh: 123, savingsPct: 13.4, mode: 'Dynamic HVAC 26°C', trafficLoad: '102 Mbps (48% PRB)', tempC: 31.0, qosDrop: '0.08%', status: 'Optimal' },
  { id: 'SBY-KEN-37', name: 'Kenjeran Coastal BTS', cluster: 'SBY-IND', region: 'Jawa Timur', group: 'intervention', lat: -7.2350, lng: 112.7850, baselineDailyKWh: 131, measuredDailyKWh: 114, savingsPct: 13.0, mode: 'Carrier Sleep B8', trafficLoad: '72 Mbps (35% PRB)', tempC: 31.9, qosDrop: '0.06%', status: 'Optimal' },
  { id: 'SBY-BEN-38', name: 'Benowo Logistics Macro', cluster: 'SBY-IND', region: 'Jawa Timur', group: 'intervention', lat: -7.2380, lng: 112.6350, baselineDailyKWh: 144, measuredDailyKWh: 125, savingsPct: 13.2, mode: 'Smart Micro-Cooling', trafficLoad: '84 Mbps (40% PRB)', tempC: 31.5, qosDrop: '0.07%', status: 'Optimal' },
  { id: 'SDA-POR-39', name: 'Sidoarjo Porong Gateway', cluster: 'SBY-IND', region: 'Jawa Timur', group: 'intervention', lat: -7.5350, lng: 112.7020, baselineDailyKWh: 147, measuredDailyKWh: 127, savingsPct: 13.6, mode: 'Dynamic HVAC 26°C', trafficLoad: '94 Mbps (45% PRB)', tempC: 31.7, qosDrop: '0.08%', status: 'Optimal' },
  { id: 'GRS-KBM-40', name: 'Gresik Kebomas Industrial', cluster: 'SBY-IND', region: 'Jawa Timur', group: 'intervention', lat: -7.1680, lng: 112.6280, baselineDailyKWh: 154, measuredDailyKWh: 133, savingsPct: 13.6, mode: 'Carrier Sleep Multi-Band', trafficLoad: '122 Mbps (57% PRB)', tempC: 32.2, qosDrop: '0.09%', status: 'Optimal' },
  // Kontrol Pembanding Surabaya (3 Menara)
  { id: 'SBY-KTL-C08', name: 'Mayjen Sungkono Control', cluster: 'SBY-IND', region: 'Jawa Timur', group: 'control', lat: -7.2920, lng: 112.7150, baselineDailyKWh: 148, measuredDailyKWh: 147, savingsPct: 0.7, mode: 'Pure Baseline (No Intervention)', trafficLoad: '110 Mbps (51% PRB)', tempC: 31.5, qosDrop: '0.08%', status: 'Control Active' },
  { id: 'SBY-KTL-C09', name: 'Kertajaya Raya Control', cluster: 'SBY-IND', region: 'Jawa Timur', group: 'control', lat: -7.2790, lng: 112.7650, baselineDailyKWh: 142, measuredDailyKWh: 141, savingsPct: 0.7, mode: 'Pure Baseline (No Intervention)', trafficLoad: '96 Mbps (46% PRB)', tempC: 31.2, qosDrop: '0.07%', status: 'Control Active' },
  { id: 'SDA-KTL-C10', name: 'Sidoarjo Alun-Alun Control', cluster: 'SBY-IND', region: 'Jawa Timur', group: 'control', lat: -7.4480, lng: 112.7180, baselineDailyKWh: 145, measuredDailyKWh: 144, savingsPct: 0.7, mode: 'Pure Baseline (No Intervention)', trafficLoad: '102 Mbps (48% PRB)', tempC: 31.8, qosDrop: '0.08%', status: 'Control Active' }
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

// Rekomendasi Portofolio Investasi untuk Modul Investment Prioritizer (Berdasarkan Evaluasi Portofolio Proposal)
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

// Case-study responses describe the proposal, not achieved outcomes.
export const CASE_STUDY_RESPONSES = [
  { id: "key-question", question: "Bagaimana teknologi digital dapat mendukung dampak ESG yang terukur?", challenge: "Menghubungkan konsumsi energi jaringan, biaya, mutu layanan, dan akuntabilitas data.", solution: "ImpactGrid diusulkan sebagai sistem pendukung keputusan untuk menyatukan data, membandingkan opsi, dan membantu dokumentasi; data serta dampak belum divalidasi.", badge: "Key Question", color: "red" },
  { id: "sub-q1", question: "Program ESG apa yang layak diprioritaskan?", challenge: "Memilih intervensi sesuai kondisi aset dan kebutuhan layanan.", solution: "Efisiensi energi jaringan dapat dikaji setelah audit teknis, izin aset, baseline, dan biaya.", badge: "Sub-Question 1", color: "blue" },
  { id: "sub-q2", question: "Bagaimana teknologi digital mendukung program?", challenge: "Mengelola data lintas fungsi tanpa menganggap rekomendasi otomatis sebagai bukti.", solution: "Rancangan modul meliputi konsolidasi data, simulasi, prioritisasi, dan kerangka pengukuran; integrasi aktual belum tersedia.", badge: "Sub-Question 2", color: "purple" },
  { id: "sub-q3", question: "Bagaimana stakeholder dilibatkan?", challenge: "Menjaga transparansi, keamanan, dan batas kewenangan.", solution: "Perlu pelibatan tim jaringan, keuangan, ESG, legal, vendor, dan pengelola aset serta aturan publikasi data agregat.", badge: "Sub-Question 3", color: "emerald" },
  { id: "sub-q4-5", question: "Bagaimana keberhasilan dan keberlanjutan diukur?", challenge: "Mencegah klaim dampak sebelum data memadai.", solution: "Uji coba 40 lokasi intervensi dan 10 pembanding adalah usulan. Baseline, biaya, hasil energi, dampak emisi, kelayakan, dan skala belum tervalidasi.", badge: "Sub-Question 4 & 5", color: "amber" }
];

// Intended stakeholder value; benefits are not yet measured or guaranteed.
export const STAKEHOLDER_VALUE_MAPPING = [
  { id: "internal", stakeholder: "Tim jaringan, keuangan, dan ESG", focus: "Koordinasi data, teknis, biaya, dan pengukuran.", valueAdded: "Rancangan dapat membantu menyiapkan pembandingan opsi setelah data dan kewenangan tersedia.", roleBadge: "Internal" },
  { id: "investor", stakeholder: "Investor dan pemegang saham", focus: "Transparansi penggunaan modal dan klaim ESG.", valueAdded: "Model sensitivitas dapat membantu menunjukkan asumsi dan ketidakpastian; tidak membuktikan imbal hasil.", roleBadge: "Capital" },
  { id: "regulator", stakeholder: "Regulator dan pengelola aset", focus: "Kesesuaian pelaporan serta batas kendali aset.", valueAdded: "Kerangka dokumentasi masih perlu ditelaah sesuai aturan dan persetujuan yang berlaku.", roleBadge: "Compliance" },
  { id: "customer", stakeholder: "Masyarakat dan pelanggan", focus: "Mutu layanan, cakupan, dan privasi.", valueAdded: "Setiap intervensi harus melewati evaluasi keselamatan dan privasi oleh pemilik jaringan.", roleBadge: "Service" }
];

// Proposed risk controls only; no control is implemented or verified by the prototype.
export const RISK_ASSESSMENT_MATRIX = [
  { no: 1, category: "Mutu layanan dan keselamatan", description: "Intervensi berpotensi memengaruhi ketersediaan atau kualitas layanan.", level: "Perlu kajian", color: "red", mitigation: "Operator menetapkan batas, uji aman, pemantauan, dan prosedur rollback sebelum pilot.", owner: "Pemilik jaringan", status: "Usulan; belum diuji" },
  { no: 2, category: "Integritas data", description: "Data meter, tagihan, trafik, dan cuaca mungkin tidak sinkron atau tidak lengkap.", level: "Perlu kajian", color: "amber", mitigation: "Tetapkan sumber utama, rekonsiliasi, aturan kualitas, dan pengecualian bersama pemilik data.", owner: "Keuangan dan IT", status: "Belum tersedia" },
  { no: 3, category: "Teknologi dan vendor", description: "Ketersediaan antarmuka, lisensi, dan kompatibilitas belum diketahui.", level: "Perlu kajian", color: "red", mitigation: "Lakukan asesmen arsitektur dan keamanan bersama operator serta vendor; jangan mengasumsikan dukungan O-RAN.", owner: "Arsitektur jaringan", status: "Belum dikaji" },
  { no: 4, category: "Kendali aset", description: "Perubahan pada perangkat atau lokasi dapat memerlukan persetujuan pemilik aset.", level: "Perlu kajian", color: "amber", mitigation: "Petakan kepemilikan dan izin untuk setiap opsi intervensi.", owner: "Legal dan pengadaan", status: "Belum dikaji" },
  { no: 5, category: "Pengukuran ESG", description: "Baseline, faktor emisi, dan atribusi dampak belum ditetapkan.", level: "Perlu kajian", color: "amber", mitigation: "Sepakati metodologi, batas inventaris, faktor emisi, dokumentasi, dan tinjauan independen.", owner: "Tim ESG", status: "Belum dihitung" },
  { no: 6, category: "Kelayakan finansial", description: "Biaya dan manfaat aktual belum diketahui.", level: "Perlu kajian", color: "amber", mitigation: "Periksa meter, tagihan, kontrak, biaya aktual, dan pihak penerima manfaat sebelum gerbang investasi.", owner: "Keuangan", status: "Belum dihitung" }
];

// Decision gates must be agreed with accountable owners before the pilot.
export const DECISION_GATE_CRITERIA = [
  { id: "gate-data", title: "1. Integritas dan kelengkapan data", threshold: "Ambang dan metode ukur perlu disepakati sebelum pilot.", currentValue: null, status: "PENDING", evidence: "Belum ada dataset pilot.", unit: "IT dan Keuangan" },
  { id: "gate-energy", title: "2. Perubahan konsumsi energi", threshold: "Arah, periode, koreksi, dan batas materialitas perlu ditetapkan.", currentValue: null, status: "PENDING", evidence: "Belum ada pengukuran sebelum/sesudah.", unit: "Network Planning" },
  { id: "gate-finance", title: "3. Kelayakan finansial", threshold: "WACC, biaya, manfaat, dan aturan keputusan perlu disetujui.", currentValue: null, status: "PENDING", evidence: "Baseline serta biaya aktual belum tersedia.", unit: "Finance" },
  { id: "gate-qos", title: "4. Mutu layanan dan keselamatan", threshold: "Batas serta prosedur keselamatan ditetapkan oleh operator.", currentValue: null, status: "PENDING", evidence: "QoS, latency, rollback, dan layanan darurat belum diuji.", unit: "Network Ops" }
];

export const SOLUTION_COMPARISON_MATRIX = [
  { dimension: "Ketersediaan dan integrasi data", statusQuo: "Proses dan sumber data perlu dipetakan bersama unit terkait.", vendorRan: "Kapabilitas tiap sistem/vendor perlu dikonfirmasi.", iotEnvion: "Cakupan data tiap sistem perlu dikonfirmasi.", impactGrid: "Usulan konsolidasi data; integrasi dan akses belum dibuktikan." },
  { dimension: "Dukungan keputusan", statusQuo: "Alur dan kriteria saat ini belum dipetakan.", vendorRan: "Fitur dan batas rekomendasi perlu diverifikasi.", iotEnvion: "Kapabilitas analitik perlu diverifikasi.", impactGrid: "Usulan membandingkan opsi berdasarkan kriteria yang disepakati." },
  { dimension: "Mutu layanan dan keselamatan", statusQuo: "Prosedur operator menjadi acuan.", vendorRan: "Batas dan pengujian perlu dikaji bersama vendor.", iotEnvion: "Peran dalam pemantauan perlu dipastikan.", impactGrid: "Tidak mengendalikan jaringan; prosedur dan uji operator tetap diperlukan." },
  { dimension: "Pengukuran ESG", statusQuo: "Metode pelaporan perlu ditelaah.", vendorRan: "Data dan metrik perlu dikonfirmasi.", iotEnvion: "Sumber dan batas inventaris perlu ditetapkan.", impactGrid: "Kerangka pencatatan diusulkan; hasil, faktor emisi, dan kesesuaian belum divalidasi." },
  { dimension: "Kelayakan finansial", statusQuo: "Biaya dan manfaat aktual perlu diaudit.", vendorRan: "Biaya lisensi dan manfaat perlu diminta dari vendor.", iotEnvion: "Biaya dan manfaat perlu diperiksa.", impactGrid: "Model sensitivitas disediakan; belum ada forecast atau bukti pengembalian." }
];
