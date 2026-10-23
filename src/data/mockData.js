// Synthetic demonstration data for the ImpactGrid concept prototype.
// Corporate context is sourced separately; site-level values are not operational Telkomsel data.

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
    name: "Ekspansi regional (bersyarat)",
    scope: "Cakupan ditentukan setelah evaluasi pilot",
    sitesCount: null,
    capexIDR: null,
    opexYearIDR: null,
    netBenefitYearIDR: null,
    paybackYears: null,
    savedGWhYear: null,
    emissionsReducedTon: null
  },
  national: {
    name: "Ekspansi nasional (hipotesis; belum dihitung)",
    scope: "Skala ditentukan setelah bukti dan kelayakan pilot",
    sitesCount: null,
    capexIDR: null,
    opexYearIDR: null,
    netBenefitYearIDR: null,
    npv5YearsIDR: null,
    paybackYears: null,
    savedGWhYear: null,
    emissionsReducedTon: null
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

// No approved or verified site-level dataset is available.
export const PILOT_SITES_SAMPLE = [];

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

// Rekomendasi Modul Investment Prioritizer (Berdasarkan Evaluasi Portofolio Proposal)
// No approved investment portfolio or expansion forecast exists.
export const INVESTMENT_PORTFOLIO_RECOMMENDATIONS = [];

// Proposed measurement framework; thresholds and results require stakeholder approval and source data.
export const ESG_FRAMEWORK_DATA = [
  { dimension: "Environmental", sdg: "SDG 7 / SDG 13", kpis: "Konsumsi listrik dan intensitas energi; emisi Scope 2 hanya jika faktor dan batas inventaris disepakati.", methodology: "Baseline, periode, koreksi trafik/cuaca, faktor emisi, dan metode atribusi perlu ditetapkan dan didokumentasikan.", threshold: "Belum ditetapkan." },
  { dimension: "Social", sdg: "SDG 9", kpis: "Indikator mutu dan ketersediaan layanan yang disetujui operator.", methodology: "Uji keselamatan dan evaluasi layanan harus dilakukan oleh pemilik jaringan sebelum, selama, dan sesudah intervensi.", threshold: "Belum ditetapkan oleh operator." },
  { dimension: "Governance", sdg: "SDG 12", kpis: "Kelengkapan, asal-usul, versi, persetujuan, dan keterlacakan data.", methodology: "Rekonsiliasi meter/tagihan, akses, audit, dan aturan eksklusi harus ditentukan bersama unit berwenang.", threshold: "Belum ditetapkan." }
];

// Verified corporate context plus proposed pilot scope; no pilot outcome is available.
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
