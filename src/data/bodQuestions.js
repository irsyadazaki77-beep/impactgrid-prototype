// Enterprise BoD Defense Q&A Suite - Telkomsel Energy & Infrastructure Operations
export const BOD_DEFENSE_QUESTIONS = [
  { 
    id: 'cto-hardware-aging', 
    role: 'Direktur Network / CTO', 
    category: 'Network Reliability', 
    question: 'Apa dampak intervensi pada umur perangkat?', 
    shortAnswer: 'Terkendali aman; dibatasi maksimal 4 siklus switching/hari dan thermal gradient < 1,5°C/menit sesuai 3GPP Rel 17/18.', 
    tacticalPoints: [
      'Menerapkan guardrail frekuensi switching harian untuk menjaga Mean Time Between Failures (MTBF) modul RF Power Amplifier.',
      'Mematuhi spesifikasi 3GPP Rel 17/18 Network Energy Savings dan panduan resmi vendor (Huawei/Ericsson).',
      'Sensor telemetri IoT Kelas 0.5s memantau suhu heat-sink secara kontinu untuk mencegah thermal shock saat transisi mode.'
    ], 
    targetTab: 'architecture', 
    targetSection: 'Mitigasi keandalan dan proteksi perangkat' 
  },
  { 
    id: 'cto-handover-fastuser', 
    role: 'VP Network Architecture / CTO', 
    category: 'Quality of Service', 
    question: 'Bagaimana intervensi memengaruhi kualitas sinyal, handover, dan panggilan darurat?', 
    shortAnswer: 'Mutu layanan (QoS) dijamin oleh fast wake-up 28ms dan interlock prioritas panggilan darurat 112.', 
    tacticalPoints: [
      'Layanan darurat 112 memiliki prioritas mutlak: carrier sleep langsung dibatalkan dalam 28ms jika terdeteksi emergency call setup.',
      'Sleep mode hanya diizinkan aktif saat utilisasi PRB < 25% dan coverage layer 900/2100 MHz tetap standby 100%.',
      'SLA Radio Availability dijaga ketat di atas 99,99% dengan batas toleransi Call Drop Rate < 0,20%.'
    ], 
    targetTab: 'pilotvalidation', 
    targetSection: 'Validasi QoS dan SLA guardrail' 
  },
  { 
    id: 'cfo-vendor-software-cost', 
    role: 'Direktur Keuangan / CFO', 
    category: 'Financial Feasibility', 
    question: 'Apakah anggaran CapEx pilot mencakup seluruh biaya lisensi dan integrasi?', 
    shortAnswer: 'Ya; CapEx Rp450 juta adalah turn-key deployment mencakup 50 IoT meter, gateway O-RAN O1, lisensi, dan cadangan kontingensi 15%.', 
    tacticalPoints: [
      'Mencakup pengadaan & instalasi submeter digital Kelas 0.5s di 50 menara makro Jawa-Bali.',
      'Lisensi containerized microservices terintegrasi langsung dengan private cloud Kubernetes Telkomsel.',
      'Dilengkapi plafon audit kesiapan Gerbang G0 (maksimal Rp95 juta) untuk memvalidasi kelayakan sebelum belanja fisik.'
    ], 
    targetTab: 'financial', 
    targetSection: 'Struktur CapEx dan analisa sensitivitas' 
  },
  { 
    id: 'cfo-tariff-hike', 
    role: 'Direktur Keuangan / CFO', 
    category: 'Sensitivity and Risk', 
    question: 'Bagaimana perubahan tarif listrik PLN atau kontrak TowerCo memengaruhi keekonomian sistem?', 
    shortAnswer: 'Kenaikan tarif PLN justru mempercepat payback; kontrak pass-through TowerCo 85/15 menjamin penghematan dinikmati Telkomsel.', 
    tacticalPoints: [
      'Model dikalibrasi dengan tarif riil PLN B-2/B-3 (Rp1.444-1.500/kWh) dan tarif WBP jam puncak 18:00-22:00.',
      'BESS peak-shaving memangkas konsumsi pada tarif termahal, menghasilkan dividen efisiensi lebih tinggi jika tarif naik.',
      'Klausul pass-through pada kontrak sewa menara Mitratel & Protelindo memastikan efisiensi kWh langsung memotong tagihan bulanan operator.'
    ], 
    targetTab: 'financial', 
    targetSection: 'Model sensitivitas tarif dan kontrak TowerCo' 
  },
  { 
    id: 'esg-blackout-defense', 
    role: 'Komite ESG / Dewan Komisaris', 
    category: 'Measurement Integrity', 
    question: 'Bagaimana membedakan dampak intervensi dari pemadaman listrik atau perubahan trafik musiman?', 
    shortAnswer: 'Diverifikasi secara kausal menggunakan ekonometrika Difference-in-Differences (DiD) 40 site intervensi vs 10 site kontrol.', 
    tacticalPoints: [
      'Metode Two-Way Fixed Effects (TWFE) menormalkan fluktuasi cuaca (Cooling Degree Days) dan trafik libur nasional.',
      'Log pemadaman PLN dan alarm genset dieksklusi secara otomatis dari jendela evaluasi baseline hemat.',
      'Ledger SHA-256 mengunci integritas data telemetri mentah agar bebas dari rekayasa atau manipulasi pelaporan.'
    ], 
    targetTab: 'pilotvalidation', 
    targetSection: 'Metodologi kausal Difference-in-Differences' 
  },
  { 
    id: 'esg-ojk-sanction', 
    role: 'Direktur Legal dan Corporate Secretary', 
    category: 'Regulatory Review', 
    question: 'Bagaimana kepatuhan pelaporan keberlanjutan dan pencegahan risiko greenwashing?', 
    shortAnswer: 'Mengacu standar ESDM Jamali (0,87 kgCO₂e/kWh), IFRS S2, dan ISO 14064-1 dengan audit trail kriptografis.', 
    tacticalPoints: [
      'Faktor emisi grid menggunakan data resmi Kementerian ESDM untuk sistem ketenagalistrikan Jawa-Madura-Bali.',
      'Data diverifikasi independen sesuai prinsip IPMVP Option B (Retrofit Isolation) untuk menjamin auditabilitas pihak ketiga.',
      'Mendukung kepatuhan pelaporan keberlanjutan tahunan Telkomsel ke OJK (POJK No. 51/2017) dan GRI Standards.'
    ], 
    targetTab: 'esg', 
    targetSection: 'Kepatuhan standar ESG dan regulasi OJK' 
  },
  { 
    id: 'ceo-scale-timeline', 
    role: 'Direktur Utama / CEO', 
    category: 'Strategic Execution', 
    question: 'Apa dasar pertimbangan dan peta jalan ekspansi setelah fase pilot?', 
    shortAnswer: 'Mengikuti kerangka tata kelola Stage-Gate G0-G3 yang mensyaratkan kelulusan metrik finansial & SLA sebelum ekspansi 5.000 site.', 
    tacticalPoints: [
      'Fase 1 (Pilot 50 Site Jamali): Membuktikan efisiensi neto >= 8% dan zero SLA penalty selama 6 bulan evaluasi.',
      'Fase 2 (Regional Jamali 5.000 Site): Replikasi model swadana dengan proyeksi penghematan neto Rp 4,8 Miliar/tahun.',
      'Fase 3 (Nasional 10.000+ Site): Ekspansi penuh mendukung target Net-Zero Emission Telkom Group 2060.'
    ], 
    targetTab: 'overview', 
    targetSection: 'Roadmap bertahap dan kerangka tata kelola Stage-Gate' 
  },
  { 
    id: 'ceo-brand-leadership', 
    role: 'Direktur Utama / CEO dan CTO', 
    category: 'Technology Differentiation', 
    question: 'Apa keunggulan kompetitif ImpactGrid dibanding modul bawaan vendor radio tunggal?', 
    shortAnswer: 'Orkestrasi multi-vendor agnostik yang mengintegrasikan data daya shelter/PLN/BESS ke dalam keputusan radio layer.', 
    tacticalPoints: [
      'NMS bawaan Ericsson atau Huawei hanya mengelola radionya sendiri dan buta terhadap kondisi submeter PLN serta temperatur shelter.',
      'ImpactGrid menjembatani multi-vendor (Ericsson, Huawei, ZTE) di atas O-RAN O1 interface dan TM Forum Open API.',
      'Mengubah penghematan energi menjadi brand equity melalui integrasi program loyalitas Telkomsel Jaga Cita dan elektrifikasi sekolah 3T.'
    ], 
    targetTab: 'architecture', 
    targetSection: 'Diferensiasi arsitektur dan orkestrasi multi-vendor' 
  },
  { 
    id: 'cio-security-sovereignty', 
    role: 'Direktur IT & CISO', 
    category: 'Data Sovereignty & Cybersecurity', 
    question: 'Bagaimana kepatuhan kedaulatan data telemetri nasional dan perlindungan serangan siber ke BTS?', 
    shortAnswer: 'Mematuhi PP 71/2019 dan standar ISO 27001; arsitektur Zero-Trust dengan deployment on-premise di Telkom DC Sentul & Surabaya.', 
    tacticalPoints: [
      '100% data telemetri dan kontrol jaringan disimpan di dalam negeri (Telkom Data Center Sentul primary, Surabaya DR) memenuhi PP No. 71/2019.',
      'Komunikasi southbound O1/NETCONF dilindungi mTLS (Mutual TLS) enkripsi AES-256 tanpa port eksternal terbuka ke publik.',
      'Mekanisme air-gap dan read-only telemetry probe memastikan tidak ada akses langsung peretas ke antarmuka kontrol radio.'
    ], 
    targetTab: 'architecture', 
    targetSection: 'Kedaulatan Data & Keamanan Siber PP 71/2019' 
  },
  { 
    id: 'cfo-towerco-split', 
    role: 'Direktur Keuangan & Pengadaan (Procurement)', 
    category: 'TowerCo Commercial Model', 
    question: 'Bagaimana pembagian CapEx IoT & penghematan listrik dengan TowerCo seperti Mitratel, TBIG, dan Protelindo?', 
    shortAnswer: 'Skema pembagian manfaat (Shared Savings) 85% Telkomsel dan 15% TowerCo, dengan opsi CapEx ditanggung sewa bulanan atau swadana.', 
    tacticalPoints: [
      'Submetering IoT dipasang pada junction panel AC/DC shelter dengan izin hak akses bersama TowerCo.',
      'Mitratel menyetujui insentif efisiensi 15% dari penghematan tagihan PLN sebagai kompensasi pemeliharaan smart HVAC & filter shelter.',
      'Menghindari sengketa tagihan listrik lump-sum dengan rekonsiliasi data meter digital DLMS/COSEM transparan.'
    ], 
    targetTab: 'financial', 
    targetSection: 'Skema Kerjasama Komersial TowerCo' 
  }
];
