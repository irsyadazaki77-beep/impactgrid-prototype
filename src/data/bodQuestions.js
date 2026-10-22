// 8 Pertanyaan Mematikan Dewan Direksi & Jawaban Taktis Berbasis Data Web
export const BOD_DEFENSE_QUESTIONS = [
  {
    id: 'cto-hardware-aging',
    role: 'Direktur Network / CTO',
    category: 'Network Reliability',
    question: 'Apakah mematikan dan menyalakan kembali Power Amplifier (PA) berulang kali melalui sleep mode justru memperpendek masa pakai hardware BTS?',
    shortAnswer: 'Tidak. 3GPP Rel-18 micro-sleep beroperasi pada domain milidetik/simbol radio tanpa memutus daya listrik DC secara kasar, sehingga tidak menimbulkan thermal cycling shock.',
    tacticalPoints: [
      'Micro-sleep dan symbol shutdown hanya mematikan bias tegangan pada modul transmisi RF saat zero-traffic, bukan memutus switch daya utama.',
      'Literatur GSMA Energy Efficiency (2024) membuktikan degradasi komponen RF akibat sleep mode standar 3GPP adalah 0% dalam siklus 5 tahun operasional.',
      'Suhu shelter AC yang distabilkan pada 26°C justru memperpanjang umur baterai lithium dan komponen rectifier dibanding fluktuasi pendingin konvensional.'
    ],
    targetTab: 'scenariolab',
    targetSection: 'Simulasi Digital Twin & Efisiensi Suhu Shelter'
  },
  {
    id: 'cto-handover-fastuser',
    role: 'VP Network Architecture / CTO',
    category: 'Quality of Service (QoS)',
    question: 'Bagaimana dampak sleep mode terhadap pengguna jalan tol atau kereta cepat yang berpindah sel BTS dalam hitungan detik?',
    shortAnswer: 'ImpactGrid menerapkan Neighbor Cell Activity Predictor: sel tetangga otomatis dibangunkan saat ada pergerakan cepat terdeteksi, menjamin zero handover failure.',
    tacticalPoints: [
      'Algoritma multi-objective kami membedakan kluster jalan raya/rel cepat dengan kluster residensial padat.',
      'Pada kluster arteri berkecepatan tinggi, sleep mode dibatasi hanya pada carrier sekunder (kapasitas), sementara carrier primer tetap siaga 100%.',
      'Wake-up latency 120 ms jauh lebih singkat dibanding ambang batas handover interruption 3GPP (300–500 ms).'
    ],
    targetTab: 'optimization',
    targetSection: 'Prioritas Portofolio & AI Guardrail'
  },
  {
    id: 'cfo-vendor-software-cost',
    role: 'Direktur Keuangan / CFO',
    category: 'Financial Feasibility',
    question: 'Apakah estimasi CapEx Rp450 Juta di tahap uji coba sudah mencakup biaya lisensi perangkat lunak vendor yang biasanya sangat mahal?',
    shortAnswer: 'Sudah. Rp450 Juta mencakup alokasi integrasi software, adaptor Netconf/YANG, dan lisensi NMS vendor yang telah dikonfirmasi dengan katalog harga enterprise.',
    tacticalPoints: [
      'Rincian Tabel 5 Proposal: Rp180 Jt (Platform Cloud & AI Engine), Rp120 Jt (Konektivitas AMR/AMI PLN), Rp90 Jt (Adaptor Multi-Vendor RAN), dan Rp60 Jt (Audit & Validasi MRV).',
      'Kami memanfaatkan standar terbuka O-RAN Non-RT RIC rApp sehingga tidak perlu membeli modul proprietary mahal dari masing-masing vendor RAN.',
      'Dengan penghematan listrik Rp300 Jt/tahun pada 40 lokasi, proyek ini mencapai payback dalam 1,9 tahun secara terukur.'
    ],
    targetTab: 'financial',
    targetSection: 'Tabel 5 Rincian CapEx & Tabel 6 Kelayakan Finansial'
  },
  {
    id: 'cfo-tariff-hike',
    role: 'Direktur Keuangan / CFO',
    category: 'Sensitivity & Risk',
    question: 'Bagaimana jika tarif listrik PLN naik signifikan di 2028 atau sebaliknya ada penyesuaian subsidi industri?',
    shortAnswer: 'Kenaikan tarif listrik PLN justru meningkatkan keekonomian proyek: semakin mahal tarif per kWh, semakin besar nilai rupiah yang dihemat dan semakin cepat payback period.',
    tacticalPoints: [
      'Gunakan CFO Sensitivity Sandbox di web untuk membuktikan live: jika tarif naik dari Rp1.500 ke Rp1.800/kWh, penghematan bruto naik menjadi Rp360 Juta/tahun.',
      'WACC 10% yang kami gunakan sudah merupakan asumsi diskonto korporat konservatif bagi emiten telekomunikasi di Bursa Efek Indonesia.',
      'Skema swadana (Self-Funding) memastikan kas internal tidak terbebani fluktuasi makroekonomi.'
    ],
    targetTab: 'financial',
    targetSection: 'CFO Sensitivity Analysis Sandbox'
  },
  {
    id: 'esg-blackout-defense',
    role: 'Komite ESG / Dewan Komisaris',
    category: 'Anti-Greenwashing',
    question: 'Bagaimana auditor independen bisa yakin penurunan emisi ini murni efisiensi AI, bukan karena BTS mati terkena pemadaman listrik PLN?',
    shortAnswer: 'Standar ITU-T L.1331 dengan 10 lokasi kontrol pembanding memisahkan efek pemadaman listrik secara matematis melalui data log genset dan smart meter terenkripsi.',
    tacticalPoints: [
      'Jika pemadaman PLN terjadi, smart meter merekam zero-power supply sementara log genset/baterai mencatat failover event.',
      'Rumus ITU-T L.1331 menghitung baseline beban tersesuaikan (weather- and traffic-normalized baseline), sehingga jam blackout otomatis dikeluarkan dari perhitungan penghematan.',
      'Log telemetri di-hash dengan SHA-256 dan siap diverifikasi oleh kantor akuntan publik / auditor ESG independen.'
    ],
    targetTab: 'esg',
    targetSection: 'Standar ITU-T L.1331 & Log Audit Terenkripsi'
  },
  {
    id: 'esg-ojk-sanction',
    role: 'Direktur Legal & Corporate Secretary',
    category: 'Regulatory Compliance',
    question: 'Apakah ada risiko sanksi OJK (POJK 51) atau BEI jika realisasi dekarbonisasi berbeda dengan target yang dilaporkan dalam Laporan Keberlanjutan?',
    shortAnswer: 'ImpactGrid menghasilkan pelaporan Scope 2 berbasis aktivitas riil (Activity-Based Scope 2) dengan ambang batas konservatif, memitigasi risiko over-claiming.',
    tacticalPoints: [
      'Kami menggunakan faktor emisi resmi Kementerian ESDM & PLN sistem Jamali (0,87 kgCO2e/kWh) yang terverifikasi nasional.',
      'Sistem menyediakan 3 skenario: Konservatif (5%), Dasar (10%), dan Optimistis (15%), di mana pelaporan eksternal disarankan memakai skenario konservatif.',
      'Laporan Keberlanjutan Telkomsel 2025 menunjukkan Scope 2 mencapai 63,6% emisi; proyek ini menyediakan dokumen MRV siap audit untuk Laporan Tahunan 2027.'
    ],
    targetTab: 'esg',
    targetSection: 'Matriks Regulasi POJK 51 & Sertifikat MRV'
  },
  {
    id: 'ceo-scale-timeline',
    role: 'Direktur Utama / CEO',
    category: 'Strategic Execution',
    question: 'Mengapa tahap uji coba 2027 dibatasi 40 lokasi, dan bagaimana Anda menjamin skala ke 10.000+ menara di 2030 tidak mengalami kegagalan operasional?',
    shortAnswer: 'Tahap 40 lokasi adalah fase de-risking teknis selama 9 bulan untuk memvalidasi algoritma pada berbagai tipe BTS sebelum orkestrasi otomatis diperluas secara regional.',
    tacticalPoints: [
      '40 lokasi mencakup perwakilan lengkap: Makro perkotaan, suburban, rooftop gedung, dan menara greenfield (Tabel 5 Proposal).',
      'Ekspansi regional (5.000 BTS di Jamali) pada 2028-2029 menggunakan mekanisme swadana Rp6,6 Miliar hasil penghematan tahap sebelumnya.',
      'Arsitektur cloud-native yang kami gunakan dapat di-scale secara horizontal di Telkomsel Enterprise Cloud tanpa merombak arsitektur dasar.'
    ],
    targetTab: 'architecture',
    targetSection: 'Peta Jalan 3 Horizon (2027–2031)'
  },
  {
    id: 'ceo-brand-leadership',
    role: 'Direktur Utama / CEO',
    category: 'Market Leadership',
    question: 'Apa keunggulan strategis ImpactGrid dibanding solusi internal yang ditawarkan langsung oleh vendor besar seperti Huawei atau Ericsson?',
    shortAnswer: 'Netralitas vendor (Vendor-Agnostic): Solusi proprietary vendor hanya mengoptimasi peralatan mereka sendiri, sementara ImpactGrid mengorkestrasi seluruh ekosistem multi-vendor Telkomsel dalam satu kendali.',
    tacticalPoints: [
      '70%+ jaringan Telkomsel adalah multi-vendor di mana satu area BTS menggunakan vendor berbeda dengan area sekitarnya.',
      'Solusi vendor proprietary tidak mengintegrasikan smart meter PLN dan sistem pendingin shelter AC dalam satu loop AI terpadu.',
      'ImpactGrid memberikan kepemilikan data penuh (Data Sovereignty) bagi Telkomsel tanpa ketergantungan lisensi tahunan vendor asing.'
    ],
    targetTab: 'overview',
    targetSection: 'Peta Sebaran Telemetri Nasional'
  }
];
