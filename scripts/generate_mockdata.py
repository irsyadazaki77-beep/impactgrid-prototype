import json

# Define the 40 Intervention sites
sites_int_meta = [
    ("Sudirman Central Commercial", "Kluster Jamali (DKI Jakarta)", "Jabodetabek", "Jakarta", "Ericsson", "Rooftop Macro", 50000, 26, 1.35, 12, "NORMAL", "ONLINE_RECONCILED", 2450, -6.215, 106.822),
    ("Rungkut Industri Gateway", "Kluster Jamali (Surabaya, Jatim)", "Jawa Timur", "Surabaya", "Huawei", "Greenfield Monopole", 50000, 26, 1.38, 18, "NORMAL", "ONLINE_RECONCILED", 2380, -7.320, 112.760),
    ("Dago Higher Education Sector", "Kluster Jamali (Bandung, Jabar)", "Jawa Barat", "Bandung", "Nokia", "4-Legged Lattice", 50000, 24, 1.48, 142, "ANOMALY_LEAKAGE", "ONLINE_RECONCILED", 2290, -6.885, 107.615),
    ("Simpang Lima Commercial Tower", "Kluster Jamali (Semarang, Jateng)", "Jawa Tengah", "Semarang", "ZTE", "Rooftop Macro", 50000, 27, 1.40, 15, "NORMAL", "ONLINE_RECONCILED", 2150, -6.990, 110.422),
    ("Malioboro Heritage Tourist Hub", "Kluster Jamali (Yogyakarta, DIY)", "Jawa Tengah", "Yogyakarta", "Ericsson", "Rooftop Macro", 49500, 26, 1.34, 14, "NORMAL", "ONLINE_RECONCILED", 2620, -7.793, 110.366),
    ("Kuta Sunset Beach Sector", "Kluster Jamali (Badung, Bali)", "Bali-Nusra", "Denpasar", "Huawei", "Greenfield Monopole", 51000, 27, 1.39, 22, "NORMAL", "ONLINE_RECONCILED", 2740, -8.723, 115.170),
    ("Kuningan Diplomatic Ring", "Kluster Jamali (DKI Jakarta)", "Jabodetabek", "Jakarta", "Ericsson", "Rooftop Macro", 50200, 25, 1.34, 16, "NORMAL", "ONLINE_RECONCILED", 2580, -6.230, 106.830),
    ("Kelapa Gading Boulevard", "Kluster Jamali (DKI Jakarta)", "Jabodetabek", "Jakarta", "Huawei", "Rooftop Macro", 50500, 26, 1.41, 110, "ANOMALY_LEAKAGE", "ONLINE_RECONCILED", 2310, -6.158, 106.908),
    ("Gubeng Transit Station Ring", "Kluster Jamali (Surabaya, Jatim)", "Jawa Timur", "Surabaya", "ZTE", "Greenfield Monopole", 49800, 26, 1.37, 19, "NORMAL", "ONLINE_RECONCILED", 2420, -7.265, 112.752),
    ("Pasteur Highway Interchange", "Kluster Jamali (Bandung, Jabar)", "Jawa Barat", "Bandung", "Nokia", "4-Legged Lattice", 50100, 25, 1.44, 25, "NORMAL", "ONLINE_RECONCILED", 2500, -6.895, 107.585),
    ("Pandanaran Financial Sector", "Kluster Jamali (Semarang, Jateng)", "Jawa Tengah", "Semarang", "Ericsson", "Rooftop Macro", 49600, 26, 1.38, 16, "NORMAL", "ONLINE_RECONCILED", 2180, -6.988, 110.415),
    ("Sanur Harbour Ferry Terminal", "Kluster Jamali (Denpasar, Bali)", "Bali-Nusra", "Denpasar", "Huawei", "Greenfield Monopole", 50800, 27, 1.40, 20, "NORMAL", "ONLINE_RECONCILED", 2250, -8.675, 115.263),
    ("TB Simatupang Corporate Strip", "Kluster Jamali (DKI Jakarta)", "Jabodetabek", "Jakarta", "Ericsson", "Rooftop Macro", 50400, 26, 1.35, 18, "NORMAL", "ONLINE_RECONCILED", 2690, -6.302, 106.815),
    ("Kemang Urban Entertainment", "Kluster Jamali (DKI Jakarta)", "Jabodetabek", "Jakarta", "Nokia", "Rooftop Macro", 49700, 25, 1.42, 28, "NORMAL", "ONLINE_RECONCILED", 2410, -6.273, 106.815),
    ("Tanjung Perak Port Authority", "Kluster Jamali (Surabaya, Jatim)", "Jawa Timur", "Surabaya", "Huawei", "4-Legged Lattice", 51200, 28, 1.46, 165, "ANOMALY_LEAKAGE", "DISCREPANCY_FLAGGED", 2800, -7.198, 112.733),
    ("Kenjeran Coastal Recreational", "Kluster Jamali (Surabaya, Jatim)", "Jawa Timur", "Surabaya", "ZTE", "Greenfield Monopole", 49200, 26, 1.39, 14, "NORMAL", "ONLINE_RECONCILED", 2050, -7.245, 112.798),
    ("Gedung Sate Civic Center", "Kluster Jamali (Bandung, Jabar)", "Jawa Barat", "Bandung", "Ericsson", "Rooftop Macro", 50000, 25, 1.36, 12, "NORMAL", "ONLINE_RECONCILED", 2350, -6.902, 107.618),
    ("Buah Batu Residential Corridor", "Kluster Jamali (Bandung, Jabar)", "Jawa Barat", "Bandung", "Huawei", "Greenfield Monopole", 49500, 26, 1.40, 19, "NORMAL", "ONLINE_RECONCILED", 2120, -6.945, 107.635),
    ("Solo Baru Commercial Sector", "Kluster Jamali (Sukoharjo, Jateng)", "Jawa Tengah", "Surakarta", "ZTE", "Greenfield Monopole", 49400, 26, 1.37, 16, "NORMAL", "ONLINE_RECONCILED", 2080, -7.595, 110.825),
    ("Sleman Innovation Campus Ring", "Kluster Jamali (Sleman, DIY)", "Jawa Tengah", "Yogyakarta", "Nokia", "Rooftop Macro", 49900, 25, 1.38, 21, "NORMAL", "ONLINE_RECONCILED", 2530, -7.770, 110.378),
    ("Nusa Dua Luxury Convention", "Kluster Jamali (Badung, Bali)", "Bali-Nusra", "Denpasar", "Ericsson", "Rooftop Macro", 50600, 26, 1.34, 15, "NORMAL", "ONLINE_RECONCILED", 2650, -8.802, 115.228),
    ("Ubud Cultural Forest Sector", "Kluster Jamali (Gianyar, Bali)", "Bali-Nusra", "Denpasar", "Huawei", "Greenfield Monopole", 48900, 25, 1.39, 17, "NORMAL", "ONLINE_RECONCILED", 1980, -8.508, 115.263),
    ("BSD City Green Digital Hub", "Kluster Jamali (Tangerang Selatan)", "Jabodetabek", "Tangerang", "Ericsson", "Rooftop Macro", 50800, 26, 1.35, 14, "NORMAL", "ONLINE_RECONCILED", 2850, -6.301, 106.652),
    ("Bintaro Jaya Financial Avenue", "Kluster Jamali (Tangerang Selatan)", "Jabodetabek", "Tangerang", "Huawei", "Greenfield Monopole", 49600, 26, 1.38, 22, "NORMAL", "ONLINE_RECONCILED", 2400, -6.285, 106.725),
    ("Bekasi Barat Manufacturing", "Kluster Jamali (Bekasi, Jabar)", "Jabodetabek", "Bekasi", "ZTE", "4-Legged Lattice", 51500, 28, 1.45, 185, "PHANTOM_HIGH", "DISCREPANCY_FLAGGED", 2700, -6.238, 106.995),
    ("Cikarang Mega Industrial", "Kluster Jamali (Bekasi, Jabar)", "Jabodetabek", "Bekasi", "Huawei", "4-Legged Lattice", 51800, 27, 1.43, 130, "ANOMALY_LEAKAGE", "ONLINE_RECONCILED", 2950, -6.315, 107.155),
    ("Depok Margonda Transit Node", "Kluster Jamali (Depok, Jabar)", "Jabodetabek", "Depok", "Nokia", "Rooftop Macro", 50100, 26, 1.39, 18, "NORMAL", "ONLINE_RECONCILED", 2480, -6.375, 106.832),
    ("Bogor Pajajaran Botanical", "Kluster Jamali (Bogor, Jabar)", "Jabodetabek", "Bogor", "Ericsson", "Greenfield Monopole", 49800, 25, 1.36, 16, "NORMAL", "ONLINE_RECONCILED", 2320, -6.595, 106.805),
    ("Sidoarjo Waru Logistics Node", "Kluster Jamali (Sidoarjo, Jatim)", "Jawa Timur", "Sidoarjo", "Huawei", "4-Legged Lattice", 50900, 26, 1.41, 24, "NORMAL", "ONLINE_RECONCILED", 2610, -7.365, 112.735),
    ("Gresik Petrochemical Complex", "Kluster Jamali (Gresik, Jatim)", "Jawa Timur", "Gresik", "ZTE", "4-Legged Lattice", 51400, 27, 1.44, 155, "ANOMALY_LEAKAGE", "ONLINE_RECONCILED", 2780, -7.165, 112.645),
    ("Cimahi Technology Hub", "Kluster Jamali (Cimahi, Jabar)", "Jawa Barat", "Cimahi", "Nokia", "Greenfield Monopole", 49300, 25, 1.38, 17, "NORMAL", "ONLINE_RECONCILED", 2150, -6.875, 107.545),
    ("Cirebon Sunyaragi Junction", "Kluster Jamali (Cirebon, Jabar)", "Jawa Barat", "Cirebon", "Huawei", "Rooftop Macro", 50200, 26, 1.40, 21, "NORMAL", "ONLINE_RECONCILED", 2280, -6.745, 108.545),
    ("Tegal Pantura Express Ring", "Kluster Jamali (Tegal, Jateng)", "Jawa Tengah", "Tegal", "ZTE", "Greenfield Monopole", 49700, 26, 1.39, 19, "NORMAL", "ONLINE_RECONCILED", 2100, -6.872, 109.135),
    ("Pekalongan Coastal Commerce", "Kluster Jamali (Pekalongan, Jateng)", "Jawa Tengah", "Pekalongan", "Ericsson", "Rooftop Macro", 49500, 26, 1.37, 15, "NORMAL", "ONLINE_RECONCILED", 2040, -6.892, 109.675),
    ("Banyuwangi Ketapang Port", "Kluster Jamali (Banyuwangi, Jatim)", "Jawa Timur", "Banyuwangi", "Huawei", "4-Legged Lattice", 50400, 27, 1.42, 23, "NORMAL", "ONLINE_RECONCILED", 2390, -8.145, 114.395),
    ("Jember Alun-Alun Sector", "Kluster Jamali (Jember, Jatim)", "Jawa Timur", "Jember", "Nokia", "Greenfield Monopole", 49100, 26, 1.38, 18, "NORMAL", "ONLINE_RECONCILED", 1950, -8.172, 113.702),
    ("Medan Merdeka Center Ring", "Kluster Luar Jawa (Medan, Sumut)", "Sumatera", "Medan", "Ericsson", "Rooftop Macro", 50700, 26, 1.39, 20, "NORMAL", "ONLINE_RECONCILED", 2580, 3.595, 98.675),
    ("Palembang Jakabaring Arena", "Kluster Luar Jawa (Palembang, Sumsel)", "Sumatera", "Palembang", "Huawei", "Greenfield Monopole", 50300, 27, 1.41, 25, "NORMAL", "ONLINE_RECONCILED", 2420, -3.020, 104.790),
    ("Balikpapan IKN Transit Hub", "Kluster Luar Jawa (Balikpapan, Kaltim)", "Kalimantan", "Balikpapan", "Ericsson", "Rooftop Macro", 51200, 26, 1.37, 16, "NORMAL", "ONLINE_RECONCILED", 2680, -1.265, 116.835),
    ("Makassar Losari Coastal Ring", "Kluster Luar Jawa (Makassar, Sulsel)", "Sulampua", "Makassar", "Huawei", "Greenfield Monopole", 50600, 27, 1.40, 22, "NORMAL", "ONLINE_RECONCILED", 2510, -5.145, 119.410)
]

# Define 10 Control sites
sites_ctr_meta = [
    ("Kuningan Epicentrum Sector", "Kluster Jamali (DKI Jakarta)", "Jabodetabek", "Jakarta", "Ericsson", "Rooftop Macro", 50000, 25, 1.48, 210, "PHANTOM_HIGH", "DISCREPANCY_FLAGGED", 2550, -6.222, 106.835),
    ("Malang Kota Pendidikan Ring", "Kluster Jamali (Malang, Jatim)", "Jawa Timur", "Malang", "Huawei", "Greenfield Monopole", 49800, 24, 1.42, 25, "NORMAL", "ONLINE_RECONCILED", 2200, -7.978, 112.630),
    ("Cihampelas Tourism Walkway", "Kluster Jamali (Bandung, Jabar)", "Jawa Barat", "Bandung", "Nokia", "Rooftop Macro", 50200, 25, 1.45, 195, "PHANTOM_HIGH", "ONLINE_RECONCILED", 2340, -6.898, 107.603),
    ("Semarang Tugu Muda Ring", "Kluster Jamali (Semarang, Jateng)", "Jawa Tengah", "Semarang", "ZTE", "Greenfield Monopole", 49900, 26, 1.40, 30, "NORMAL", "ONLINE_RECONCILED", 2120, -6.985, 110.408),
    ("Bantul Ringroad Selatan", "Kluster Jamali (Bantul, DIY)", "Jawa Tengah", "Yogyakarta", "Ericsson", "Greenfield Monopole", 49600, 25, 1.39, 22, "NORMAL", "ONLINE_RECONCILED", 1980, -7.845, 110.360),
    ("Jimbaran Bay Fishing Sector", "Kluster Jamali (Badung, Bali)", "Bali-Nusra", "Denpasar", "Huawei", "Greenfield Monopole", 50400, 27, 1.43, 35, "NORMAL", "ONLINE_RECONCILED", 2190, -8.775, 115.175),
    ("Pluit Bay Commercial Complex", "Kluster Jamali (DKI Jakarta)", "Jabodetabek", "Jakarta", "Ericsson", "Rooftop Macro", 50600, 26, 1.46, 230, "PHANTOM_HIGH", "DISCREPANCY_FLAGGED", 2620, -6.118, 106.790),
    ("Darmo Boulevard Historic", "Kluster Jamali (Surabaya, Jatim)", "Jawa Timur", "Surabaya", "Huawei", "Rooftop Macro", 50100, 26, 1.41, 28, "NORMAL", "ONLINE_RECONCILED", 2400, -7.288, 112.738),
    ("Ujungberung Urban Sector", "Kluster Jamali (Bandung, Jabar)", "Jawa Barat", "Bandung", "Nokia", "Greenfield Monopole", 49500, 25, 1.44, 180, "PHANTOM_HIGH", "ONLINE_RECONCILED", 2050, -6.915, 107.695),
    ("Solo Manahan Stadium Sector", "Kluster Jamali (Surakarta, Jateng)", "Jawa Tengah", "Surakarta", "ZTE", "Greenfield Monopole", 49900, 26, 1.40, 24, "NORMAL", "ONLINE_RECONCILED", 2110, -7.555, 110.808)
]

# Intervention Types python dict
py_interventions = [
    {
        "id": "INT-AC",
        "name": "Optimasi Setpoint AC Shelter 26°C",
        "shortName": "Setpoint AC 26°C",
        "category": "Pendinginan / HVAC",
        "capexIDR": 2500000,
        "annualSavingKWh": 3500,
        "annualSavingIDR": 5250000,
        "opexYearIDR": 500000,
        "netBenefitYearIDR": 4750000,
        "paybackYears": 0.53,
        "carbonReducedTon": 3.05,
        "latencyDeltaMs": 0.0,
        "qosProtection": "100% Zero Impact",
        "desc": "Menaikkan suhu thermostat dari 24°C ke 26°C dengan sensor cerdas. Menghemat ~7% konsumsi listrik tanpa risiko degradasi RF."
    },
    {
        "id": "INT-SLEEP",
        "name": "RAN 3GPP Rel-18 Deep Sleep & Micro-sleep",
        "shortName": "3GPP Micro-sleep",
        "category": "Radio Access Network (RAN)",
        "capexIDR": 3500000,
        "annualSavingKWh": 4800,
        "annualSavingIDR": 7200000,
        "opexYearIDR": 1200000,
        "netBenefitYearIDR": 6000000,
        "paybackYears": 0.58,
        "carbonReducedTon": 4.18,
        "latencyDeltaMs": 0.22,
        "qosProtection": "Bypass 112 (<120ms)",
        "desc": "Menidurkan power amplifier radio pada jam sepi trafik (00:00 - 05:00). Wake-up latency 120ms terlindungi guardrail darurat."
    },
    {
        "id": "INT-COMBINED",
        "name": "ImpactGrid Combined (AC 26°C + Micro-sleep)",
        "shortName": "Combined A+B",
        "category": "Strategi Utama ImpactGrid",
        "capexIDR": 4000000,
        "annualSavingKWh": 5200,
        "annualSavingIDR": 7800000,
        "opexYearIDR": 1500000,
        "netBenefitYearIDR": 6300000,
        "paybackYears": 0.63,
        "carbonReducedTon": 4.52,
        "latencyDeltaMs": 0.15,
        "qosProtection": "Multi-Layer Guardrail",
        "desc": "Sinergi pendinginan cerdas 26°C dan sleep mode adaptif 3GPP. Rekomendasi standar untuk 40 lokasi uji coba 2027 (Tabel 5)."
    },
    {
        "id": "INT-SOLAR",
        "name": "Hybrid Solar PV 3 kWp + BESS Peak Shaving",
        "shortName": "Solar PV + BESS",
        "category": "Energi Terbarukan",
        "capexIDR": 18000000,
        "annualSavingKWh": 8500,
        "annualSavingIDR": 12750000,
        "opexYearIDR": 2500000,
        "netBenefitYearIDR": 10250000,
        "paybackYears": 1.76,
        "carbonReducedTon": 7.40,
        "latencyDeltaMs": 0.0,
        "qosProtection": "100% Cadangan BESS",
        "desc": "Instalasi panel surya 3 kWp dan baterai lithium 5 kWh untuk memotong beban puncak siang hari di lokasi bernilai strategis tinggi."
    }
]

output_js = []
output_js.append('''// Data and configurations for Telkomsel ImpactGrid Prototype
// 100% ALIGNED dengan Naskah Proposal Semifinal AWAKENING Reborn (TSF 2026) & Laporan Keberlanjutan Resmi

export const SYSTEM_METADATA = {
  appName: "Telkomsel ImpactGrid",
  tagline: "AI-Assisted Network Sustainability Decision Support System (DSS)",
  teamName: "AWAKENING Reborn",
  competition: "TDC Summit Fest (TSF) 2026 - Business Case Competition",
  caseCollaborator: "PT Telekomunikasi Selular (Telkomsel)",
  version: "v2.8-Finalist-Ready",
  
  // Data Resmi Laporan Keberlanjutan TelkomGroup & Telkomsel 2024/2025
  totalNationwideBTS: 293136,
  totalSubscribers: "156,1 Juta Pelanggan",
  totalAnnualPowerTelkomselKWh: 1885000000,
  totalScope2EmissionsTon: 1722000,
  totalEmissionsOverallTon: 2708749,
  scope2PortionPct: 63.6,
  jamaliPowerConsumptionGWh: 835.5,
  jamaliEmissionsTon: 726890,
  
  // Parameter Perencanaan Uji Coba (Tabel 5 & Paragraf 183 Proposal)
  electricityTariff: 1500,
  gridEmissionFactor: 0.870,
  baselinePowerPerSiteKWh: 50000,
  waccDiscountRate: 10,
  
  // 4 Modul Resmi Naskah Proposal
  modules: [
    { id: "mod1", name: "Network Data Hub", desc: "Konsolidasi telemetri daya multi-vendor, beban trafik data, & rekonsiliasi smart meter/tagihan PLN" },
    { id: "mod2", name: "Scenario Lab", desc: "Simulasi intervensi (pendinginan, micro-sleep, shutdown carrier, solar) terkoreksi cuaca & trafik" },
    { id: "mod3", name: "Investment Prioritizer", desc: "Mesin optimasi portofolio antarlokasi memilih proyek bernilai NPV positif dengan perlindungan QoS" },
    { id: "mod4", name: "ESG Impact Verification", desc: "Metodologi verifikasi emisi terhindar (GRI 302/305, POJK 51) berbasis perbandingan 10 lokasi kontrol (DiD)" }
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
    baselineKWhYear: 2000000,
    baselineCostYearIDR: 3000000000,
    capexIDR: 450000000,
    opexYearIDR: 60000000,
    scenarios: [
      {
        name: "Konservatif (5% Efisiensi)",
        efficiencyPct: 5,
        savedKWhYear: 100000,
        grossSavingIDR: 150000000,
        netBenefitYearIDR: 90000000,
        paybackYears: 5.0,
        npv5YearsIDR: -109000000,
        emissionsReducedTon: 87.0,
        status: "EVALUASI_BELUM_LAYAK"
      },
      {
        name: "Dasar / Baseline (10% Efisiensi)",
        efficiencyPct: 10,
        savedKWhYear: 200000,
        grossSavingIDR: 300000000,
        netBenefitYearIDR: 240000000,
        paybackYears: 1.875,
        npv5YearsIDR: 460000000,
        emissionsReducedTon: 174.0,
        status: "TARGET_TERPILIH_LAYAK"
      },
      {
        name: "Optimistis (15% Efisiensi)",
        efficiencyPct: 15,
        savedKWhYear: 300000,
        grossSavingIDR: 450000000,
        netBenefitYearIDR: 390000000,
        paybackYears: 1.154,
        npv5YearsIDR: 1028000000,
        emissionsReducedTon: 261.0,
        status: "SANGAT_LAYAK"
      }
    ]
  },
  regional: {
    name: "Jangka Menengah (2028–2029) - Standardisasi & Wilayah",
    scope: "5.000 Lokasi Prioritas (Kluster Jamali & Area Biaya Tinggi)",
    sitesCount: 5000,
    capexIDR: 6500000000,
    opexYearIDR: 1800000000,
    netBenefitYearIDR: 4800000000,
    paybackYears: 1.35,
    savedGWhYear: 5.80,
    emissionsReducedTon: 5046
  },
  national: {
    name: "Jangka Panjang (2030–2031) - Perluasan Nasional",
    scope: "10.000+ Lokasi Terpilih (Kesiapan Data & Kendali Aset)",
    sitesCount: 10000,
    capexIDR: 15000000000,
    opexYearIDR: 7000000000,
    netBenefitYearIDR: 14900000000,
    npv5YearsIDR: 41480000000,
    paybackYears: 1.00,
    savedGWhYear: 14.60,
    emissionsReducedTon: 12702
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
''')

output_js.append(f"export const INTERVENTION_TYPES = {json.dumps(py_interventions, indent=2)};\n")

# Build the 50 sites list
sites_sample = []

# 40 Intervention sites
for idx, meta in enumerate(sites_int_meta):
    site_id = f"LOC-INT-{idx+1:03d}"
    name, cluster, region, city, vendor, tower_type, base_kwh, temp_c, pue, phantom_w, phantom_st, meter_st, traffic_gb, lat, lng = meta
    
    # Assign intervention variation
    if idx in [0, 5, 14, 22]:
        int_choice = py_interventions[3] # Solar
        eff_pct = 15.2
        saved_kwh = 6800
    elif idx in [2, 7, 24, 29]:
        int_choice = py_interventions[0] # AC only
        eff_pct = 8.5
        saved_kwh = 4200
    elif idx in [3, 8, 18, 32]:
        int_choice = py_interventions[1] # Sleep only
        eff_pct = 9.8
        saved_kwh = 4900
    else:
        int_choice = py_interventions[2] # Combined
        eff_pct = 10.4 + (idx % 5) * 0.3
        saved_kwh = int(base_kwh * (eff_pct / 100))

    cost_saved = int(saved_kwh * 1500)
    co2_reduced = round((saved_kwh * 0.87) / 1000, 2)
    lat_ms = round(13.2 + (idx % 7) * 0.4, 1)

    site_obj = {
        "id": site_id,
        "name": name,
        "cluster": cluster,
        "region": region,
        "city": city,
        "type": "Intervensi",
        "vendor": vendor,
        "towerType": tower_type,
        "baselineKWhYear": base_kwh,
        "currentEffPct": round(eff_pct, 1),
        "savedKWh": saved_kwh,
        "costSavedIDR": cost_saved,
        "emissionsReducedTon": co2_reduced,
        "qosLatencyMs": lat_ms,
        "qosSLA": "99.98% (Aman)",
        "intervensiUtama": int_choice["name"],
        "interventionId": int_choice["id"],
        "interventionCategory": int_choice["category"],
        "capexIDR": int_choice["capexIDR"],
        "opexYearIDR": int_choice["opexYearIDR"],
        "netAnnualBenefitIDR": cost_saved - int_choice["opexYearIDR"],
        "npv5YearsIDR": int((cost_saved - int_choice["opexYearIDR"]) * 3.79 - int_choice["capexIDR"]),
        "paybackYears": round(int_choice["capexIDR"] / max(1, cost_saved - int_choice["opexYearIDR"]), 2),
        "latencyDeltaMs": int_choice["latencyDeltaMs"],
        "shelterTempC": temp_c,
        "pue": pue,
        "phantomLoadWatt": phantom_w,
        "phantomStatus": phantom_st,
        "smartMeterStatus": meter_st,
        "trafficDailyGB": traffic_gb,
        "energyIntensityKWhPerTB": round((base_kwh / 365) / (traffic_gb / 1000), 1),
        "rectifierHealth": "99.2% Normal" if phantom_st == "NORMAL" else ("92.1% Inefficient" if phantom_st == "ANOMALY_LEAKAGE" else "84.5% Degraded"),
        "solarBatteryKW": 3.0 if int_choice["id"] == "INT-SOLAR" else 1.2,
        "weatherCond": f"Cerah ({temp_c + 6}°C)" if temp_c >= 26 else f"Berawan ({temp_c + 2}°C)",
        "lat": lat,
        "lng": lng
    }
    sites_sample.append(site_obj)

# 10 Control sites
for idx, meta in enumerate(sites_ctr_meta):
    site_id = f"LOC-CTR-{idx+1:03d}"
    name, cluster, region, city, vendor, tower_type, base_kwh, temp_c, pue, phantom_w, phantom_st, meter_st, traffic_gb, lat, lng = meta
    
    site_obj = {
        "id": site_id,
        "name": name,
        "cluster": cluster,
        "region": region,
        "city": city,
        "type": "Pembanding (Kontrol)",
        "vendor": vendor,
        "towerType": tower_type,
        "baselineKWhYear": base_kwh,
        "currentEffPct": 0.2 if idx % 2 == 0 else -0.1,
        "savedKWh": 80 if idx % 2 == 0 else 0,
        "costSavedIDR": 120000 if idx % 2 == 0 else 0,
        "emissionsReducedTon": 0.07 if idx % 2 == 0 else 0.0,
        "qosLatencyMs": round(14.0 + (idx % 5) * 0.3, 1),
        "qosSLA": "99.98% (Baseline)",
        "intervensiUtama": "Status Kuwo (Lokasi Kontrol Tanpa Intervensi)",
        "interventionId": "NONE",
        "interventionCategory": "Baseline Pembanding",
        "capexIDR": 0,
        "opexYearIDR": 0,
        "netAnnualBenefitIDR": 0,
        "npv5YearsIDR": 0,
        "paybackYears": 0,
        "latencyDeltaMs": 0.0,
        "shelterTempC": temp_c,
        "pue": pue,
        "phantomLoadWatt": phantom_w,
        "phantomStatus": phantom_st,
        "smartMeterStatus": meter_st,
        "trafficDailyGB": traffic_gb,
        "energyIntensityKWhPerTB": round((base_kwh / 365) / (traffic_gb / 1000), 1),
        "rectifierHealth": "98.5% Normal" if phantom_st == "NORMAL" else "83.4% Degraded",
        "solarBatteryKW": 0.0,
        "weatherCond": f"Cerah ({temp_c + 7}°C)",
        "lat": lat,
        "lng": lng
    }
    sites_sample.append(site_obj)

output_js.append(f"export const PILOT_SITES_SAMPLE = {json.dumps(sites_sample, indent=2)};\n")

# Difference-in-Differences Dataset (ITU-T L.1331)
did_data = {
    "standard": "ITU-T L.1331 Difference-in-Differences (DiD)",
    "period": "9 Bulan Uji Coba 2027",
    "interventionGroup": {
        "count": 40,
        "baselineKWhYear": 2000000,
        "actualPostKWhYear": 1800000,
        "rawDeltaKWh": -200000,
        "rawDeltaPct": -10.0,
        "trafficIncreasePct": 8.4,
        "cddWeatherDeltaPct": 1.2
    },
    "controlGroup": {
        "count": 10,
        "baselineKWhYear": 500000,
        "actualPostKWhYear": 501500,
        "rawDeltaKWh": 1500,
        "rawDeltaPct": 0.3,
        "trafficIncreasePct": 8.2,
        "cddWeatherDeltaPct": 1.1
    },
    "netIsolatedEffect": {
        "isolatedEnergySavedKWh": 201500,
        "isolatedEmissionsReducedTon": 175.3,
        "confidenceIntervalPct": "95% CI [188.000 - 215.000 kWh]",
        "pValue": "< 0.001 (Statistically Significant)",
        "antiGreenwashingVerdict": "TERBUKTI: Penurunan konsumsi murni akibat intervensi ImpactGrid, bukan fluktuasi cuaca atau penurunan muatan trafik."
    }
}
output_js.append(f"export const DID_ANALYSIS_DATA = {json.dumps(did_data, indent=2)};\n")

output_js.append('''
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

export const HOURLY_24H_PROFILE = HOURLY_PILOT_PROFILE;

// Rekomendasi Modul Investment Prioritizer (Berdasarkan Evaluasi Portofolio Proposal)
export const INVESTMENT_PORTFOLIO_RECOMMENDATIONS = [
  {
    id: "PRJ-2027-01",
    siteGroup: "40 Lokasi Uji Coba 2027 (Prioritas 1: Pendinginan & Micro-Sleep)",
    intervention: "Penyesuaian Suhu AC Shelter (26°C) + RAN Energy Efficiency 3GPP",
    estCostIDR: 160000000,
    grossAnnualSavingIDR: 300000000,
    netAnnualBenefitIDR: 240000000,
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
    estCostIDR: 6500000000,
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
    estCostIDR: 15000000000,
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

export const KPI_SUMMARY = {
  monitoredSites: 50,
  pilotInterventionSites: 40,
  pilotControlSites: 10,
  activeMacroCarriers: 160,
  currentGridPowerMW: 0.24,
  dailyEnergySavedMWh: 0.55,
  annualEnergySavedGWh: 0.20,
  annualGrossSavingsIDR: 300000000,
  annualNetProfitIDR: 240000000,
  scope2ReducedTonsYear: 174,
  fiveYearNPV: 460000000,
  paybackPeriodYears: 1.88,
  currentQoSSLA: 99.982,
  safeSleepModeRatio: 42.6,
  regionalNPV: 41480000000,
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

export const AUDIT_LOGS_SAMPLE = [
  {
    id: "AUD-2027-001",
    timestamp: "2027-03-31 23:59:59",
    module: "Modul 4: ESG Verification",
    event: "Monthly Baseline Reconciliation & Difference-in-Differences Run",
    hashSHA256: "4a9f73b18c5e921d0a33b4e6c7104f29a1b2c3d4e5f60718293a4b5c6d7e8f90",
    validator: "Sistem Otomatis (O-RAN O1 & Smart Meter AMR PLN)",
    status: "VERIFIED_TAMPER_PROOF"
  },
  {
    id: "AUD-2027-002",
    timestamp: "2027-04-15 14:30:00",
    module: "Modul 3: Investment Prioritizer",
    event: "Human-in-the-Loop Portfolio Approval (40 Sites Jamali Pilot)",
    hashSHA256: "8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d",
    validator: "Direktorat Network & Direktorat Finance Telkomsel",
    status: "OFFICIALLY_SIGNED"
  },
  {
    id: "AUD-2027-003",
    timestamp: "2027-06-30 23:59:59",
    module: "Modul 1: Network Data Hub",
    event: "NIST AI Data Completeness Verification (40 Sites >=99.4%)",
    hashSHA256: "1f2e3d4c5b6a7089a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3",
    validator: "Independent 3rd-Party ESG Assurance Auditor",
    status: "AUDIT_READY"
  }
];
''')

with open(r'c:\Users\zakii\OneDrive\Dokumen\BPC & BCC\TDC ITS 2026\impactgrid-prototype\src\data\mockData.js', 'w', encoding='utf-8') as f:
    f.write(''.join(output_js))

print("Successfully written mockData.js!")
