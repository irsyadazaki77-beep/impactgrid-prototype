// Executive presentation script for Telkomsel Board of Directors & SNOC Review.
// Retains clear provenance between corporate sustainability baseline, pilot parameters,
// and live operational telemetry.
export const PRESENTATION_STEPS = Object.freeze([
  {
    step: 1,
    startSeconds: 0,
    endSeconds: 60,
    timing: '0:00–1:00',
    title: 'Konteks Korporat: Beban Energi & Emisi Scope 2',
    tab: 'overview',
    targetId: 'pitch-step-1-overview',
    message: 'Konsumsi listrik jaringan mencapai 1,885 TWh/tahun (63,6% emisi Scope 2 Telkomsel); diperlukan visibilitas per site BTS.',
    visual: 'Ringkasan • Konteks energi korporat Telkomsel & integrasi telemetri SNOC',
    evidence: 'Laporan Keberlanjutan Telkom 2025 (1.885.417.875,2 kWh) & Profil GoZero (1.721.967,7 tCO2e Scope 2).',
    script: 'Telkomsel mengelola skala jaringan terbesar secara nasional. Laporan Keberlanjutan Telkom 2025 mencatat konsumsi listrik 1.885.417.875,2 kWh, sementara profil GoZero mencatat emisi Scope 2 sebesar 1.721.967,7 ton CO2e atau 63,6% dari profil emisi Telkomsel. ImpactGrid hadir untuk menjembatani kesenjangan antara target efisiensi korporat dan rekonsiliasi energi presisi pada level site BTS.',
    presenterNote: 'Sumber angka: Laporan Keberlanjutan 2025 & GoZero. Tekankan bagaimana visibilitas per site menghubungkan operasi teknis SNOC dengan pembukuan finansial.'
  },
  {
    step: 2,
    startSeconds: 60,
    endSeconds: 120,
    timing: '1:00–2:00',
    title: 'Orkestrasi Lintas-Fungsi: Melengkapi OSS Multi-Vendor',
    tab: 'overview',
    targetId: 'pitch-step-2-pillars',
    message: 'ImpactGrid mengorkestrasi telemetri Ericsson ENM, Huawei iMaster MAE, dan ZTE NetNumen dengan meter PLN AMR & SAP.',
    visual: 'Ringkasan • Alur kerja 4 langkah dari deteksi anomali hingga jurnal akrual SAP S/4HANA',
    evidence: 'Standar O-RAN O1/A1, TMF628 Performance Management, dan kelas akurasi meter IEC 62053-22 (0.5S).',
    script: 'Telkomsel telah mengoperasikan fitur hemat daya bawaan vendor RAN. Namun tantangannya adalah menyatukan data trafik OSS multi-vendor dengan tagihan riil PLN AMR dan kontrak TowerCo. ImpactGrid menyatukan keempat langkah tersebut: pemantauan & deteksi anomali, optimasi AI O-RAN dengan guardrails QoS, rekonsiliasi BA-RE & tiket FOP, hingga pembukuan finansial & ESG.',
    presenterNote: 'Tegaskan posisi ImpactGrid sebagai lapisan orkestrasi lintas-vendor dan lintas-divisi (Network, Energy Management, Finance, dan ESG).'
  },
  {
    step: 3,
    startSeconds: 120,
    endSeconds: 165,
    timing: '2:00–2:45',
    title: 'Scenario Lab: Sensitivitas Tarif, Cuaca & Beban Trafik',
    tab: 'scenariolab',
    targetId: 'pitch-step-3-scenarios',
    message: 'Uji ketahanan penghematan daya terhadap fluktuasi tarif PLN, suhu ekstrem, dan lonjakan trafik musiman.',
    visual: 'Simulasi What-If • Uji sensitivitas parameter operasional dan finansial secara real-time',
    evidence: 'Model kopel elektro-termal site BTS, kurva beban 24 jam, dan tarif listrik industri/bisnis PLN.',
    script: 'Melalui Scenario Lab, tim perencana jaringan dan finansial dapat menguji dampak perubahan tarif listrik, lonjakan suhu lingkungan yang memicu beban pendingin kabinet, serta lonjakan trafik. Setiap perubahan parameter langsung memperbarui proyeksi penghematan kWh, arus kas bersih, dan batas aman SLA.',
    presenterNote: 'Tunjukkan bagaimana perubahan asumsi langsung terhitung secara deterministik pada metrik finansial dan teknis.'
  },
  {
    step: 4,
    startSeconds: 165,
    endSeconds: 210,
    timing: '2:45–3:30',
    title: 'Simulasi Monte Carlo & Prioritisasi CapEx Knapsack',
    tab: 'scenariolab',
    targetId: 'pitch-step-4-montecarlo',
    message: 'Evaluasi distribusi probabilitas NPV (P10/P50/P90) dan pemilihan portofolio intervensi paling optimal.',
    visual: 'Scenario Lab • Distribusi risiko Monte Carlo dan alokasi modal berbasis bukti',
    evidence: 'Simulasi stokastik 500 iterasi dan optimasi 0-1 Knapsack untuk efisiensi modal kerja.',
    script: 'Untuk memitigasi risiko ketidakpastian di lapangan, mesin Monte Carlo mengevaluasi rentang hasil P10, P50, hingga P90. Selanjutnya, modul optimasi portofolio membantu komite memilih kombinasi intervensi—baik O-RAN sleep software-only, retrofit smart meter AMR, maupun BESS LiFePO4—yang memaksimalkan NPV di bawah plafon anggaran.',
    presenterNote: 'Tekankan disiplin alokasi modal: intervensi dipilih berdasarkan rasio pengembalian kas tertinggi per rupiah CapEx.'
  },
  {
    step: 5,
    startSeconds: 210,
    endSeconds: 270,
    timing: '3:30–4:30',
    title: 'Tata Kelola Stage-Gate: Audit G0 & Pilot Kuasi-Eksperimen',
    tab: 'pilotvalidation',
    targetId: 'pitch-step-5-pilotvalidation',
    message: 'Keputusan bertahap: Audit kesiapan Rp 95 Jt (G0–G1) diikuti Pilot 40 Site Intervensi + 10 Site Kontrol (G2).',
    visual: 'Validasi Pilot • Metodologi Difference-in-Differences (DiD) dan proteksi layanan darurat 112',
    evidence: 'Desain 40 site intervensi + 10 site kontrol pembanding selama 9 bulan; auto-rollback 28ms saat PRB > 35%.',
    script: 'Kami menerapkan disiplin tata kelola Stage-Gate G0 hingga G3. Tahap awal adalah Audit Kesiapan 2 bulan senilai Rp 95 juta untuk memverifikasi kelengkapan meter dan skema kontrak pass-through. Selanjutnya, Pilot 9 bulan pada 40 site intervensi dan 10 site pembanding membuktikan dampak penghematan menggunakan metode Difference-in-Differences dengan jaminan auto-rollback 28 milidetik demi menjaga panggilan darurat 112.',
    presenterNote: 'Soroti mekanisme keselamatan jaringan (QoS Guardrail) dan pembanding ilmiah DiD agar penghematan tidak tercampur fluktuasi cuaca/trafik.'
  },
  {
    step: 6,
    startSeconds: 270,
    endSeconds: 345,
    timing: '4:30–5:45',
    title: 'Kelayakan Finansial: Arus Kas, NPV & Rekonsiliasi SAP',
    tab: 'financial',
    targetId: 'pitch-step-6-financial',
    message: 'Transparansi penuh antara baseline konservatif dan terkalibrasi, lengkap dengan BA-RE PLN dan jurnal akrual SAP.',
    visual: 'Dampak Finansial • Sensitivitas NPV 5 tahun, kurva J-Curve, dan integrasi dokumen BA-RE / SAP FI-CO',
    evidence: 'WACC 10,0%, tarif Rp 1.500/kWh, dan otomatisasi dokumen Berita Acara Rekonsiliasi Energi (BA-RE).',
    script: 'Pada halaman Dampak Finansial, Direksi dapat meninjau sensitivitas NPV pada berbagai skenario baseline konsumsi site serta ekspansi ke 5.000 site Regional Jamali dengan NPV +Rp 11,70 Miliar. Lebih penting lagi, setiap kWh yang dihemat dan setiap anomali tagihan yang dipulihkan langsung diterjemahkan menjadi draf Berita Acara Rekonsiliasi Energi dan voucher jurnal akrual SAP S/4HANA.',
    presenterNote: 'Tunjukkan bahwa efisiensi teknis langsung terhubung ke pengurangan OpEx riil di laporan laba-rugi.'
  },
  {
    step: 7,
    startSeconds: 345,
    endSeconds: 390,
    timing: '5:45–6:30',
    title: 'Kepatuhan ESG: Audit Trail SHA-256 & Dividen Sosial 3T',
    tab: 'esg',
    targetId: 'pitch-step-7-esg',
    message: 'Pelaporan Scope 2 terverifikasi sesuai POJK 51/2017 & ISSB IFRS S2, disertai alokasi efisiensi untuk inklusi digital 3T.',
    visual: 'Dampak ESG • Jejak audit kriptografis SHA-256, metrik kWh/TB, dan program Dividen Sosial Jaga Cita',
    evidence: 'Faktor emisi grid Jamali 0,78 kg CO2e/kWh (Kementerian ESDM) dan verifikasi integritas payload SHA-256.',
    script: 'Untuk mendukung komitmen ESG Telkomsel dan kepatuhan POJK 51/2017 serta ISSB IFRS S2, setiap rekaman penghematan kWh diikat dengan tanda tangan kriptografis SHA-256 dari meter kelas 0.5S hingga buku besar ESG. Sebagian dari penghematan biaya operasional ini juga dipetakan ke dalam program Dividen Sosial untuk memperluas konektivitas edukasi di wilayah 3T.',
    presenterNote: 'Tekankan keterlacakan data (data lineage) dari sensor fisik hingga pengungkapan keberlanjutan korporat.'
  },
  {
    step: 8,
    startSeconds: 390,
    endSeconds: 420,
    timing: '6:30–7:00',
    title: 'Keputusan Direksi: Persetujuan Gerbang G0–G1',
    tab: 'pilotvalidation',
    targetId: 'pitch-step-8-decisiongates',
    message: 'Rekomendasi eksekutif: Setujui Audit Kesiapan Rp 95 Jt (G0–G1) dengan klausul penghentian otomatis jika target gagal.',
    visual: 'Validasi Pilot • Gerbang keputusan bertahap G0–G3 dan One-Pager Keputusan Direksi',
    evidence: 'Komitmen risiko terkendali: plafon awal Rp 95 Jt, SLA CDR < 0,08%, dan transparansi lintas direktorat.',
    script: 'Sebagai penutup, keputusan yang kami ajukan hari ini sangat terukur: persetujuan Gerbang G0–G1 untuk Audit Kesiapan senilai Rp 95 juta selama 2 bulan. Ekspansi ke tahap pilot maupun skala regional hanya akan dieksekusi apabila seluruh syarat akurasi data, penghematan bersih, dan keselamatan SLA jaringan terbukti terpenuhi. Terima kasih.',
    presenterNote: 'Arahkan perhatian Direksi ke tombol One-Pager Direksi atau Sertifikat Stage-Gate untuk penandatanganan keputusan.'
  }
]);

export const PRESENTATION_DURATION_SECONDS = 7 * 60;

