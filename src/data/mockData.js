// Data and configurations for Telkomsel ImpactGrid Prototype
// 100% ALIGNED dengan Naskah Proposal Semifinal AWAKENING Reborn (TSF 2026) & Laporan Keberlanjutan Resmi

export const SYSTEM_METADATA = {
  appName: "Telkomsel ImpactGrid",
  tagline: "AI-Assisted Network Sustainability Decision Support System (DSS)",
  teamName: "AWAKENING Reborn",
  competition: "TDC Summit Fest (TSF) 2026 - Business Case Competition",
  caseCollaborator: "PT Telekomunikasi Selular (Telkomsel)",
  version: "v2.6-Semifinal-Verified",
  
  // Data Resmi Laporan Keberlanjutan TelkomGroup & Telkomsel 2024/2025
  totalNationwideBTS: 293136, // Total BTS Telkomsel nasional
  totalSubscribers: "156,1 Juta Pelanggan",
  totalAnnualPowerTelkomselKWh: 1885000000, // 1,885 Miliar kWh (6.984.695 Gigajoule, naik 7,3%)
  totalScope2EmissionsTon: 1722000, // 1,722 Juta ton CO2e (Scope 2 berbasis lokasi)
  totalEmissionsOverallTon: 2708749, // 2.708.749 ton CO2e total emisi
  scope2PortionPct: 63.6, // 63,6% dari total emisi Telkomsel
  jamaliPowerConsumptionGWh: 835.5, // Konsumsi listrik sistem Jamali 835,5 GWh
  jamaliEmissionsTon: 726890, // Beban emisi sistem Jamali 726.890 ton CO2e
  
  // Parameter Perencanaan Uji Coba (Tabel 5 & Paragraf 183 Proposal)
  electricityTariff: 1500, // Tarif rata-rata listrik PLN Rp1.500/kWh
  gridEmissionFactor: 0.870, // Faktor emisi grid 0,870 kg CO2e / kWh
  baselinePowerPerSiteKWh: 50000, // Baseline rata-rata: 50.000 kWh/lokasi/tahun (137 kWh/hari)
  waccDiscountRate: 10, // Suku diskonto WACC 10%
  
  // 4 Modul Resmi Naskah Proposal
  modules: [
    { id: "mod1", name: "Network Data Hub", desc: "Konsolidasi telemetri daya, beban trafik data, & rekonsiliasi smart meter/tagihan PLN" },
    { id: "mod2", name: "Scenario Lab", desc: "Simulasi intervensi (pendinginan, micro-sleep, shutdown carrier, solar) terkoreksi cuaca & trafik" },
    { id: "mod3", name: "Investment Prioritizer", desc: "Mesin optimasi portofolio antarlokasi memilih proyek bernilai NPV positif dengan perlindungan QoS" },
    { id: "mod4", name: "ESG Impact Verification", desc: "Metodologi verifikasi emisi terhindar (GRI 302/305, POJK 51) berbasis perbandingan 10 lokasi kontrol" }
  ]
};

// 3 Tahap Horizon Implementasi (Tabel 7 Proposal)
export const IMPLEMENTATION_HORIZONS = {
  pilot: {
    name: "Jangka Pendek (2027) - Uji Coba 9 Bulan",
    scope: "40 Lokasi Intervensi + 10 Lokasi Pembanding (Kontrol)",
    totalSites: 50,
    interventionSites: 40,
    controlSites: 10,
    baselineKWhYear: 2000000, // 2,0 GWh/tahun
    baselineCostYearIDR: 3000000000, // Rp 3,0 Miliar/tahun (40 x 50.000 kWh x Rp1.500)
    capexIDR: 450000000, // Rp 450 Juta
    opexYearIDR: 60000000, // Rp 60 Juta / tahun
    scenarios: [
      {
        name: "Konservatif (5% Efisiensi)",
        efficiencyPct: 5,
        savedKWhYear: 100000, // 100 MWh
        grossSavingIDR: 150000000, // Rp 150 Jt
        netBenefitYearIDR: 90000000, // Rp 90 Jt (setelah OpEx Rp60 Jt)
        paybackYears: 5.0,
        npv5YearsIDR: -109000000, // -Rp 109 Jt (Belum Layak)
        emissionsReducedTon: 87.0,
        status: "EVALUASI_BELUM_LAYAK"
      },
      {
        name: "Dasar / Baseline (10% Efisiensi)",
        efficiencyPct: 10,
        savedKWhYear: 200000, // 200 MWh
        grossSavingIDR: 300000000, // Rp 300 Jt
        netBenefitYearIDR: 240000000, // Rp 240 Jt (setelah OpEx Rp60 Jt)
        paybackYears: 1.875, // ~1,9 Tahun
        npv5YearsIDR: 460000000, // +Rp 460 Juta
        emissionsReducedTon: 174.0, // ~174 ton CO2e/thn
        status: "TARGET_TERPILIH_LAYAK"
      },
      {
        name: "Optimistis (15% Efisiensi)",
        efficiencyPct: 15,
        savedKWhYear: 300000, // 300 MWh
        grossSavingIDR: 450000000, // Rp 450 Jt
        netBenefitYearIDR: 390000000, // Rp 390 Jt (setelah OpEx Rp60 Jt)
        paybackYears: 1.154, // ~1,2 Tahun
        npv5YearsIDR: 1028000000, // +Rp 1.028 Juta (+Rp 1,028 Miliar)
        emissionsReducedTon: 261.0,
        status: "SANGAT_LAYAK"
      }
    ]
  },
  regional: {
    name: "Jangka Menengah (2028–2029) - Standardisasi & Wilayah",
    scope: "5.000 Lokasi Prioritas (Kluster Jamali & Area Biaya Tinggi)",
    sitesCount: 5000,
    capexIDR: 6500000000, // Rp 6,50 Miliar
    opexYearIDR: 1800000000, // Rp 1,80 Miliar / tahun (Reinvestasi Efisiensi)
    netBenefitYearIDR: 4800000000, // Rp 4,80 Miliar / tahun
    paybackYears: 1.35, // ~1,35 Tahun
    savedGWhYear: 5.80, // ~5,80 GWh/thn
    emissionsReducedTon: 5046 // ~5.046 ton CO2e/thn
  },
  national: {
    name: "Jangka Panjang (2030–2031) - Perluasan Nasional",
    scope: "10.000+ Lokasi Terpilih (Kesiapan Data & Kendali Aset)",
    sitesCount: 10000,
    capexIDR: 15000000000, // Rp 15,00 Miliar
    opexYearIDR: 7000000000, // Rp 7,00 Miliar / tahun
    netBenefitYearIDR: 14900000000, // Rp 14,90 Miliar / tahun
    npv5YearsIDR: 41480000000, // +Rp 41,48 Miliar
    paybackYears: 1.00, // ~1,00 Tahun
    savedGWhYear: 14.60, // ~14,60 GWh/thn
    emissionsReducedTon: 12702 // ~12.702 ton CO2e/thn
  }
};

// Rincian Komponen Anggaran Biaya CapEx Uji Coba 40 Lokasi (Tabel 5 Proposal)
export const PILOT_CAPEX_BREAKDOWN = [
  {
    komponen: "1. Pengembangan Prototipe Sistem (CapEx)",
    biayaIDR: 180000000,
    justifikasi: "Pembangunan antarmuka web ImpactGrid, modul Network Data Hub, Scenario Lab, dan mesin optimasi portofolio Investment Prioritizer."
  },
  {
    komponen: "2. Integrasi Data & Keamanan Sistem (CapEx)",
    biayaIDR: 70000000,
    justifikasi: "Penyiapan pipa data terstruktur/agregat, rekonsiliasi meter & tagihan, kontrol akses berbasis peran (RBAC), dan perlindungan keamanan siber."
  },
  {
    komponen: "3. Intervensi Teknis Ringan pada Lokasi Uji (CapEx)",
    biayaIDR: 160000000,
    justifikasi: "Penyesuaian parameter pendinginan, kalibrasi sensor, dan optimasi perangkat eksisting pada 40 lokasi intervensi (rata-rata Rp4 juta/lokasi)."
  },
  {
    komponen: "4. Verifikasi Metodologi & Evaluasi (CapEx)",
    biayaIDR: 40000000,
    justifikasi: "Penyiapan kerangka ESG Impact Verification, pengukuran baseline terkoreksi trafik/cuaca, serta evaluasi komparatif terhadap 10 lokasi pembanding."
  }
];

// 40 Lokasi Intervensi + 10 Lokasi Pembanding Uji Coba (Sesuai Proposal)
export const PILOT_SITES_SAMPLE = [
  // Lokasi Intervensi (40 Lokasi)
  {
    id: "LOC-INT-001",
    name: "Kawasan Bisnis Sudirman Central",
    cluster: "Kluster Jamali (DKI Jakarta)",
    type: "Intervensi",
    baselineKWhYear: 50000,
    currentEffPct: 10.4,
    savedKWh: 5200,
    costSavedIDR: 7800000,
    emissionsReducedTon: 4.52,
    qosLatencyMs: 14.2,
    qosSLA: "99.98% (Aman)",
    intervensiUtama: "Optimasi Setpoint AC Shelter (26°C) + Micro-sleep RAN"
  },
  {
    id: "LOC-INT-002",
    name: "Rungkut Industri Gateway",
    cluster: "Kluster Jamali (Surabaya, Jatim)",
    type: "Intervensi",
    baselineKWhYear: 50000,
    currentEffPct: 11.2,
    savedKWh: 5600,
    costSavedIDR: 8400000,
    emissionsReducedTon: 4.87,
    qosLatencyMs: 15.0,
    qosSLA: "99.97% (Aman)",
    intervensiUtama: "Carrier Shutdown Sekunder 2.1 GHz Off-peak + Smart Meter"
  },
  {
    id: "LOC-INT-003",
    name: "Dago Higher Education Sector",
    cluster: "Kluster Jamali (Bandung, Jabar)",
    type: "Intervensi",
    baselineKWhYear: 50000,
    currentEffPct: 9.8,
    savedKWh: 4900,
    costSavedIDR: 7350000,
    emissionsReducedTon: 4.26,
    qosLatencyMs: 13.5,
    qosSLA: "99.99% (Aman)",
    intervensiUtama: "MIMO Channel Downscaling Malam Hari + Kalibrasi Sensor"
  },
  {
    id: "LOC-INT-004",
    name: "Simpang Lima Commercial Tower",
    cluster: "Kluster Jamali (Semarang, Jateng)",
    type: "Intervensi",
    baselineKWhYear: 50000,
    currentEffPct: 10.1,
    savedKWh: 5050,
    costSavedIDR: 7575000,
    emissionsReducedTon: 4.39,
    qosLatencyMs: 16.1,
    qosSLA: "99.98% (Aman)",
    intervensiUtama: "Optimasi Pendingin Shelter + Verifikasi Data Tagihan"
  },
  // Lokasi Pembanding / Kontrol (10 Lokasi - Tanpa Intervensi, baseline murni)
  {
    id: "LOC-CTR-001",
    name: "Kuningan Epicentrum Sector",
    cluster: "Kluster Jamali (DKI Jakarta)",
    type: "Pembanding (Kontrol)",
    baselineKWhYear: 50000,
    currentEffPct: 0.2, // fluktuasi normal cuaca
    savedKWh: 100,
    costSavedIDR: 150000,
    emissionsReducedTon: 0.09,
    qosLatencyMs: 14.1,
    qosSLA: "99.98% (Baseline)",
    intervensiUtama: "Status Kuwo (Lokasi Kontrol Tanpa Intervensi)"
  },
  {
    id: "LOC-CTR-002",
    name: "Malang Kota Pendidikan Ring",
    cluster: "Kluster Jamali (Malang, Jatim)",
    type: "Pembanding (Kontrol)",
    baselineKWhYear: 50000,
    currentEffPct: -0.1,
    savedKWh: 0,
    costSavedIDR: 0,
    emissionsReducedTon: 0.00,
    qosLatencyMs: 14.8,
    qosSLA: "99.98% (Baseline)",
    intervensiUtama: "Status Kuwo (Lokasi Kontrol Tanpa Intervensi)"
  }
];

// Profil Beban 24 Jam Uji Coba Terkoreksi Trafik (40 Lokasi Intervensi)
export const HOURLY_PILOT_PROFILE = [
  { time: "00:00", trafficPct: 24, baselineKW: 228.3, optimizedKW: 198.6, savedKW: 29.7, qosIndex: 99.99 },
  { time: "01:00", trafficPct: 18, baselineKW: 224.2, optimizedKW: 188.3, savedKW: 35.9, qosIndex: 99.99 },
  { time: "02:00", trafficPct: 13, baselineKW: 222.8, optimizedKW: 182.7, savedKW: 40.1, qosIndex: 99.99 },
  { time: "03:00", trafficPct: 11, baselineKW: 221.5, optimizedKW: 179.4, savedKW: 42.1, qosIndex: 99.99 },
  { time: "04:00", trafficPct: 14, baselineKW: 222.8, optimizedKW: 183.8, savedKW: 39.0, qosIndex: 99.99 },
  { time: "05:00", trafficPct: 22, baselineKW: 225.6, optimizedKW: 191.8, savedKW: 33.8, qosIndex: 99.98 },
  { time: "06:00", trafficPct: 42, baselineKW: 231.1, optimizedKW: 207.9, savedKW: 23.2, qosIndex: 99.98 },
  { time: "07:00", trafficPct: 65, baselineKW: 237.9, optimizedKW: 221.2, savedKW: 16.7, qosIndex: 99.98 },
  { time: "08:00", trafficPct: 79, baselineKW: 243.4, optimizedKW: 229.4, savedKW: 14.0, qosIndex: 99.98 },
  { time: "09:00", trafficPct: 88, baselineKW: 247.5, optimizedKW: 235.1, savedKW: 12.4, qosIndex: 99.97 },
  { time: "10:00", trafficPct: 92, baselineKW: 250.2, optimizedKW: 237.7, savedKW: 12.5, qosIndex: 99.97 },
  { time: "11:00", trafficPct: 95, baselineKW: 251.6, optimizedKW: 239.0, savedKW: 12.6, qosIndex: 99.97 },
  { time: "12:00", trafficPct: 97, baselineKW: 252.9, optimizedKW: 240.3, savedKW: 12.6, qosIndex: 99.97 },
  { time: "13:00", trafficPct: 94, baselineKW: 251.6, optimizedKW: 239.0, savedKW: 12.6, qosIndex: 99.97 },
  { time: "14:00", trafficPct: 91, baselineKW: 250.2, optimizedKW: 237.7, savedKW: 12.5, qosIndex: 99.97 },
  { time: "15:00", trafficPct: 89, baselineKW: 248.9, optimizedKW: 236.5, savedKW: 12.4, qosIndex: 99.97 },
  { time: "16:00", trafficPct: 86, baselineKW: 247.5, optimizedKW: 235.1, savedKW: 12.4, qosIndex: 99.98 },
  { time: "17:00", trafficPct: 84, baselineKW: 246.1, optimizedKW: 233.8, savedKW: 12.3, qosIndex: 99.98 },
  { time: "18:00", trafficPct: 88, baselineKW: 248.9, optimizedKW: 235.2, savedKW: 13.7, qosIndex: 99.98 },
  { time: "19:00", trafficPct: 98, baselineKW: 254.3, optimizedKW: 242.0, savedKW: 12.3, qosIndex: 99.97 },
  { time: "20:00", trafficPct: 100, baselineKW: 255.7, optimizedKW: 243.2, savedKW: 12.5, qosIndex: 99.97 },
  { time: "21:00", trafficPct: 92, baselineKW: 251.6, optimizedKW: 237.8, savedKW: 13.8, qosIndex: 99.98 },
  { time: "22:00", trafficPct: 71, baselineKW: 242.0, optimizedKW: 220.2, savedKW: 21.8, qosIndex: 99.98 },
  { time: "23:00", trafficPct: 45, baselineKW: 233.8, optimizedKW: 205.7, savedKW: 28.1, qosIndex: 99.99 }
];

// Rekomendasi Modul Investment Prioritizer (Berdasarkan Evaluasi Portofolio Proposal)
export const INVESTMENT_PORTFOLIO_RECOMMENDATIONS = [
  {
    id: "PRJ-2027-01",
    siteGroup: "40 Lokasi Uji Coba 2027 (Prioritas 1: Pendinginan & Micro-Sleep)",
    intervention: "Penyesuaian Suhu AC Shelter (26°C) + RAN Energy Efficiency 3GPP",
    estCostIDR: 160000000, // Rp 160 Jt
    grossAnnualSavingIDR: 300000000, // Rp 300 Jt
    netAnnualBenefitIDR: 240000000, // Rp 240 Jt
    paybackYears: 1.875,
    npv10PctIDR: 460000000,
    carbonReducedTon: 174,
    qosAssurance: "Zero Service Degradation (Layanan Intratrafik Stabil)",
    humanDecision: "DISETUJUI TIM JARINGAN & KEUANGAN"
  },
  {
    id: "PRJ-2028-02",
    siteGroup: "Kluster Jamali Biaya Listrik Tinggi (5.000 Lokasi)",
    intervention: "Replikasi Standar Pendingin Efisien + Smart Meter AMR + O-RAN Sleep",
    estCostIDR: 6500000000, // Rp 6,5 M
    grossAnnualSavingIDR: 6600000000,
    netAnnualBenefitIDR: 4800000000,
    paybackYears: 1.35,
    npv10PctIDR: 11700000000,
    carbonReducedTon: 5046,
    qosAssurance: "Kepatuhan SLA >99.95% Otomatis Terkoreksi Trafik",
    humanDecision: "REKOMENDASI FASE EKSPANSI REGIONAL"
  },
  {
    id: "PRJ-2030-03",
    siteGroup: "10.000+ Menara Makro Nasional (Skala Penuh)",
    intervention: "Integrasi Nasional Terpadu ImpactGrid DSS & Verifikasi Emisi Scope 2",
    estCostIDR: 15000000000, // Rp 15,0 M
    grossAnnualSavingIDR: 21900000000,
    netAnnualBenefitIDR: 14900000000,
    paybackYears: 1.00,
    npv10PctIDR: 41480000000,
    carbonReducedTon: 12702,
    qosAssurance: "Didukung 100% Audit Trail Terenkripsi & Lokasi Pembanding",
    humanDecision: "TARGET JANGKA PANJANG KORPORAT"
  }
];

// Matriks Pelaporan Dampak Keberlanjutan E-S-G (Tabel 8 Proposal)
export const ESG_FRAMEWORK_DATA = [
  {
    dimension: "Environmental (Lingkungan)",
    sdg: "SDG 7 (Energi Bersih) & SDG 13 (Penanganan Perubahan Iklim)",
    kpis: "Intensitas energi (kWh per Terabita trafik), Konsumsi listrik dihemat (kWh), Emisi Scope 2 dihindari (ton CO2e).",
    methodology: "Selisih konsumsi listrik terhadap baseline terkoreksi trafik & cuaca (standar ITU-T L.1331), dikalikan faktor emisi grid (0,87 kgCO2e/kWh), dibandingkan 10 lokasi pembanding.",
    threshold: "Penghematan energi positif setelah koreksi trafik/cuaca; berkontribusi menurunkan porsi beban emisi Scope 2 (63,6% total emisi Telkomsel)."
  },
  {
    dimension: "Social (Sosial & Pelanggan)",
    sdg: "SDG 9 (Industri, Inovasi & Infrastruktur) & Inklusi Digital",
    kpis: "Ketersediaan jaringan (Availability > 99,95%), Latensi & Throughput, Jumlah keluhan layanan wilayah uji.",
    methodology: "Pemantauan indikator mutu layanan sebelum, selama, dan sesudah intervensi serta evaluasi umpan balik kanal resmi pelanggan di wilayah uji.",
    threshold: "Mutu layanan wajib memenuhi batas SLA teknis yang disepakati; dilarang mengurangi cakupan di wilayah berkonektivitas terbatas."
  },
  {
    dimension: "Governance (Tata Kelola)",
    sdg: "SDG 12 (Konsumsi & Produksi Bertanggung Jawab) & Akuntabilitas",
    kpis: "Tingkat kelengkapan data (>=95%), Keterlacakan persetujuan & asumsi, Pemisahan atribusi portofolio.",
    methodology: "Rekonsiliasi data meter dan tagihan listrik PLN, pencatatan versi model, sumber data, logika rekomendasi, serta otorisasi unit berwenang.",
    threshold: "Kelengkapan data minimal >=95% pada lokasi uji; lokasi anomali dikeluarkan dari klaim agar bebas dari greenwashing."
  }
];

// -------------------------------------------------------------
// BACKWARD COMPATIBILITY & HARMONIZED DATA FOR PROTOTYPE TABS
// -------------------------------------------------------------

export const KPI_SUMMARY = {
  monitoredSites: 50,
  pilotInterventionSites: 40,
  pilotControlSites: 10,
  activeMacroCarriers: 160,
  currentGridPowerMW: 0.24,
  dailyEnergySavedMWh: 0.55,
  annualEnergySavedGWh: 0.20, // 200 MWh pada Skenario Dasar 10%
  annualGrossSavingsIDR: 300000000, // Rp 300 Juta
  annualNetProfitIDR: 240000000, // Rp 240 Juta
  scope2ReducedTonsYear: 174, // 174 ton CO2e/thn
  fiveYearNPV: 460000000, // Rp 460 Juta (Skenario Dasar Pilot)
  paybackPeriodYears: 1.88, // 1,9 Tahun
  currentQoSSLA: 99.982,
  safeSleepModeRatio: 42.6,
  regionalNPV: 41480000000, // Rp 41,48 Miliar
  regionalPaybackYears: 1.02,
  regionalGrossSavingsIDR: 21960000000
};

export const CLUSTERS = [
  {
    id: "CLS-JKT-01",
    name: "Jabodetabek Central & Business District",
    region: "Jabodetabek",
    btsCount: 15,
    primaryVendor: "Ericsson / Huawei",
    avgPowerKw: 1.62,
    optimizedPowerKw: 1.34,
    powerSavedPct: 17.3,
    trafficLoadGbps: 184.2,
    currentSleepMode: "Adaptive 3GPP Advanced",
    qosSLA: 99.985,
    status: "OPTIMIZED",
    smartMeterHealth: "100% ONLINE",
    solarHybridShare: "4.2%"
  },
  {
    id: "CLS-JATIM-02",
    name: "Jawa Timur Metro (Surabaya - Malang)",
    region: "Jawa Timur",
    btsCount: 12,
    primaryVendor: "Huawei / ZTE",
    avgPowerKw: 1.54,
    optimizedPowerKw: 1.28,
    powerSavedPct: 16.8,
    trafficLoadGbps: 142.0,
    currentSleepMode: "Carrier Shutdown Off-Peak",
    qosSLA: 99.980,
    status: "OPTIMIZED",
    smartMeterHealth: "100% ONLINE",
    solarHybridShare: "5.8%"
  },
  {
    id: "CLS-JABAR-03",
    name: "Jawa Barat & Bandung Raya",
    region: "Jawa Barat",
    btsCount: 13,
    primaryVendor: "Nokia / Huawei",
    avgPowerKw: 1.58,
    optimizedPowerKw: 1.32,
    powerSavedPct: 16.4,
    trafficLoadGbps: 128.5,
    currentSleepMode: "MIMO Channel Downscaling",
    qosSLA: 99.991,
    status: "OPTIMIZED",
    smartMeterHealth: "98.5% ONLINE",
    solarHybridShare: "3.5%"
  },
  {
    id: "CLS-CTR-04",
    name: "Wilayah Pembanding / Lokasi Kontrol (10 Sites)",
    region: "Jawa-Bali",
    btsCount: 10,
    primaryVendor: "Multi-Vendor Baseline",
    avgPowerKw: 1.59,
    optimizedPowerKw: 1.59,
    powerSavedPct: 0.1,
    trafficLoadGbps: 135.0,
    currentSleepMode: "Standard Standby",
    qosSLA: 99.982,
    status: "CONTROL_BASELINE",
    smartMeterHealth: "100% ONLINE",
    solarHybridShare: "0.0%"
  }
];

export const HOURLY_24H_PROFILE = HOURLY_PILOT_PROFILE;

export const AI_OPTIMIZATION_RECOMMENDATIONS = [
  {
    id: "REC-OPT-01",
    clusterId: "CLS-JKT-01",
    clusterName: "Kawasan Bisnis Sudirman (15 BTS)",
    action: "Aktivasi 3GPP Advanced Micro-Sleep & Setpoint HVAC 26°C",
    targetCarriers: 45,
    currentLoadPct: 18,
    projectedSavingKw: 4.2,
    projectedSavingPct: 18.5,
    qosRisk: "LOW (<0.1ms)",
    slaImpact: "0.00% (Protected)",
    confidence: 99.4,
    safetyGuardrailPassed: true,
    status: "READY_FOR_EXECUTION"
  },
  {
    id: "REC-OPT-02",
    clusterId: "CLS-JATIM-02",
    clusterName: "Rungkut Industri Surabaya (12 BTS)",
    action: "Shutdown Carrier Sekunder 2.1 GHz Off-Peak (00:00 - 05:00)",
    targetCarriers: 36,
    currentLoadPct: 14,
    projectedSavingKw: 3.8,
    projectedSavingPct: 19.2,
    qosRisk: "LOW (<0.2ms)",
    slaImpact: "0.00% (Protected)",
    confidence: 98.7,
    safetyGuardrailPassed: true,
    status: "READY_FOR_EXECUTION"
  },
  {
    id: "REC-OPT-03",
    clusterId: "CLS-JABAR-03",
    clusterName: "Dago Higher Education Bandung (13 BTS)",
    action: "MIMO Layer Downscaling 64T64R ke 32T32R pada Jam Sepi",
    targetCarriers: 26,
    currentLoadPct: 22,
    projectedSavingKw: 2.9,
    projectedSavingPct: 14.8,
    qosRisk: "NEGLIGIBLE (<0.05ms)",
    slaImpact: "0.00% (Protected)",
    confidence: 99.8,
    safetyGuardrailPassed: true,
    status: "READY_FOR_EXECUTION"
  }
];

export const ESG_COMPLIANCE_STANDARDS = [
  {
    standard: "GRI 302 & 305",
    complianceScore: "100% AUDIT READY",
    title: "Pengungkapan Efisiensi Energi & Emisi Gas Rumah Kaca Scope 2",
    description: "Perhitungan emisi didasarkan pada selisih konsumsi listrik terhadap baseline terkoreksi trafik & cuaca, dikalikan faktor emisi grid Jamali 0,870 kg CO2e/kWh, serta diverifikasi terhadap 10 lokasi pembanding."
  },
  {
    standard: "POJK No. 51/2017",
    complianceScore: "TERPENUHI LENGKAP",
    title: "Penerapan Keuangan Berkelanjutan bagi Emiten & Lembaga Jasa Keuangan",
    description: "Menyediakan jejak audit digital investasi ESG yang transparan, rasio manfaat finansial terhadap dampak lingkungan yang dapat diverifikasi oleh akuntan publik dan regulator OJK."
  },
  {
    standard: "IAI PSPK 1 & 2",
    complianceScore: "STANDAR TERBARU 2024",
    title: "Pernyataan Standar Pelaporan Keberlanjutan Ikatan Akuntan Indonesia",
    description: "Selaras dengan IFRS S1/S2 Sustainability-related Financial Disclosures untuk mengukur keterkaitan antara risiko iklim, efisiensi operasional BTS, dan ketahanan arus kas masa depan."
  },
  {
    standard: "ITU-T L.1331 & L.1350",
    complianceScore: "GLOBAL TELECOM STANDARD",
    title: "Assessment of Mobile Network Energy Efficiency & Base Station Metrics",
    description: "Menggunakan KPI terstandardisasi internasional: Intensitas Energi (kWh per Terabita trafik data) guna mencegah distorsi efisiensi semu saat trafik jaringan berfluktuasi."
  }
];

export const FIVE_YEAR_FINANCIAL_PROJECTION = [
  {
    year: "2027 (Tahun 1)",
    phase: "Tahap Uji Coba (40 Intervensi + 10 Kontrol)",
    scaleBTS: 50,
    capexMiliar: 0.45,
    opexMiliar: 0.06,
    grossSavingMiliar: 0.30,
    netCashflowMiliar: 0.24,
    reinvestmentFundMiliar: 0.12,
    emissionsSavedTons: 174
  },
  {
    year: "2028 (Tahun 2)",
    phase: "Ekspansi Regional Kluster Jamali",
    scaleBTS: 2500,
    capexMiliar: 3.25,
    opexMiliar: 0.90,
    grossSavingMiliar: 3.30,
    netCashflowMiliar: 2.40,
    reinvestmentFundMiliar: 1.20,
    emissionsSavedTons: 2523
  },
  {
    year: "2029 (Tahun 3)",
    phase: "Konsolidasi Wilayah Biaya Tinggi",
    scaleBTS: 5000,
    capexMiliar: 6.50,
    opexMiliar: 1.80,
    grossSavingMiliar: 6.60,
    netCashflowMiliar: 4.80,
    reinvestmentFundMiliar: 2.40,
    emissionsSavedTons: 5046
  },
  {
    year: "2030 (Tahun 4)",
    phase: "Rollout Nasional Tahap 1",
    scaleBTS: 7500,
    capexMiliar: 10.00,
    opexMiliar: 3.50,
    grossSavingMiliar: 11.00,
    netCashflowMiliar: 7.50,
    reinvestmentFundMiliar: 3.75,
    emissionsSavedTons: 7569
  },
  {
    year: "2031 (Tahun 5)",
    phase: "Skala Penuh Menara Makro Terpilih",
    scaleBTS: 10000,
    capexMiliar: 15.00,
    opexMiliar: 7.00,
    grossSavingMiliar: 21.90,
    netCashflowMiliar: 14.90,
    reinvestmentFundMiliar: 7.45,
    emissionsSavedTons: 12702
  }
];
