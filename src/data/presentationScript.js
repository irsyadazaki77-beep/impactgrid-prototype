// Executive presentation is kept in the same sequence and wording as
// skrip_presentasi_7_menit_direktur.md. All demo figures retain their source
// and assumption labels so the presenter can distinguish context from evidence.
export const PRESENTATION_STEPS = Object.freeze([
  {
    step: 1,
    startSeconds: 0,
    endSeconds: 60,
    timing: '0:00–1:00',
    title: 'Masalah: konteks energi dan emisi',
    tab: 'overview',
    message: 'Isu energi material di tingkat perusahaan; belum ada baseline penghematan per lokasi.',
    visual: 'Ringkasan • konteks perusahaan dan baseline yang belum tersedia',
    evidence: 'Laporan Keberlanjutan Telkom 2025; Profil GoZero. Angka korporat, bukan baseline BTS.',
    script: 'Telkomsel memiliki skala layanan nasional. Laporan Keberlanjutan Telkom 2025 mencatat konsumsi listrik 1.885.417.875,2 kWh. Profil GoZero mencatat emisi Scope 2 sebesar 1.721.967,7 ton CO2e atau 63,6% dari emisi Telkomsel. Angka ini menunjukkan materialitas isu di tingkat perusahaan. Angka tersebut belum memberi tahu berapa energi yang dapat dihemat pada satu lokasi BTS.',
    presenterNote: 'Sumber angka: laporan keberlanjutan 2025 dan profil GoZero. Tegaskan konteks korporat; jangan menyebutnya baseline atau dampak ImpactGrid.'
  },
  {
    step: 2,
    startSeconds: 60,
    endSeconds: 120,
    timing: '1:00–2:00',
    title: 'Solusi: keputusan lintas fungsi yang lebih baik',
    tab: 'overview',
    message: 'ImpactGrid mengusulkan alur keputusan yang melengkapi kemampuan existing, bukan menggantikannya.',
    visual: 'Ringkasan • kebutuhan pemetaan sistem existing dan gerbang keputusan',
    evidence: 'Skrip proposal; kapabilitas RAN Energy Efficiency dan pemantauan energi existing perlu diaudit.',
    script: 'Telkomsel sudah mempublikasikan kapabilitas RAN Energy Efficiency dan pemantauan energi. Usulan kami tidak menganggap kemampuan itu belum ada. Pertanyaan yang ingin diuji ialah apakah proses lintas fungsi dapat memilih lokasi dan intervensi dengan lebih baik, memperhitungkan biaya yang benar-benar dapat dihindari, menjaga mutu layanan, dan membuktikan hasilnya.',
    presenterNote: 'Akui sistem dan kemampuan existing. Tekankan bahwa audit menentukan apakah perlu integrasi, perluasan, riset terbatas, atau penghentian.'
  },
  {
    step: 3,
    startSeconds: 120,
    endSeconds: 165,
    timing: '2:00–2:45',
    title: 'Simulasi: rekonsiliasi dan bandingkan skenario',
    tab: 'scenariolab',
    message: 'Mulai dari rekonsiliasi data dan membandingkan skenario; semua angka di layar adalah DEMO/SIMULATED.',
    visual: 'Simulasi Skenario • tinjau input sensitivitas, bukan hasil jaringan',
    evidence: 'Data pada prototype adalah contoh/simulasi. Tidak ada koneksi ke jaringan Telkomsel atau perangkat.',
    script: 'Di prototipe ini, kita melihat rancangan empat langkah. Pertama, rekonsiliasi data dan bandingkan skenario. Banner di atas menjelaskan bahwa data di layar adalah simulasi.',
    presenterNote: 'Network Data Hub dan Scenario Lab adalah rancangan dalam proposal; jangan menyebutnya sistem produksi.'
  },
  {
    step: 4,
    startSeconds: 165,
    endSeconds: 210,
    timing: '2:45–3:30',
    title: 'Simulasi: prioritisasi dan bukti keputusan',
    tab: 'scenariolab',
    message: 'Prioritisasi dan pencatatan bukti masih berupa rancangan; tidak ada aksi ke jaringan.',
    visual: 'Scenario Lab • lanjutkan ke portofolio dan persetujuan',
    evidence: 'Semua angka prototype adalah simulasi. Tidak ada koneksi atau perintah ke perangkat.',
    script: 'Langkah berikutnya ialah pilih portofolio sesuai anggaran, lalu catat hasil dan persetujuannya. Tidak ada integrasi langsung ke jaringan Telkomsel atau pengiriman perintah ke perangkat.',
    presenterNote: 'Investment Prioritizer dan ESG Impact Verification adalah rancangan dalam proposal; prototype tidak menerapkan perubahan pada jaringan.'
  },
  {
    step: 5,
    startSeconds: 210,
    endSeconds: 270,
    timing: '3:30–4:30',
    title: 'Validasi: audit dahulu, pilot bersyarat',
    tab: 'pilotvalidation',
    message: 'Minta audit kebutuhan 2 bulan; pilot hanya dipertimbangkan setelah gerbang data, izin, dan operasi lolos.',
    visual: 'Validasi Pilot • pemilik data, kebutuhan bukti, dan gerbang pilot',
    evidence: 'Usulan proposal: audit maksimal Rp95 juta; rancangan pilot 9 bulan, 40 intervensi + 10 pembanding.',
    script: 'Keputusan awal yang kami usulkan adalah audit kebutuhan dua bulan dengan batas Rp95 juta. Audit memeriksa sistem yang sudah ada, data meter dan tagihan, kontrak, hak aset, serta desain pembanding. Jika kebutuhan belum terpenuhi dan persyaratan pilot tersedia, rancangan awalnya sembilan bulan dengan 40 lokasi intervensi dan 10 pembanding. Semua perubahan tetap disetujui tim jaringan.',
    presenterNote: 'Rp95 juta dan jumlah lokasi adalah parameter usulan, bukan anggaran yang disetujui atau pilot yang sudah berjalan.'
  },
  {
    step: 6,
    startSeconds: 270,
    endSeconds: 345,
    timing: '4:30–5:45',
    title: 'Finansial: sensitivitas, bukan janji hasil',
    tab: 'financial',
    message: 'NPV berubah tanda karena baseline belum tervalidasi; keputusan investasi belum dapat ditarik.',
    visual: 'Dampak Finansial • bandingkan dua baseline pada asumsi hemat 8%',
    evidence: 'Asumsi proposal: hemat 8%, Rp1.500/kWh, CapEx Rp450 jt, OpEx Rp60 jt/tahun, diskonto 10%.',
    script: 'Model saat ini belum memiliki baseline site yang terukur. Pada asumsi 50 kWh per lokasi per hari, NPV indikatif skenario penghematan 8% sekitar minus Rp391,5 juta. Pada asumsi alternatif 50 MWh per lokasi per tahun, hasilnya sekitar positif Rp82,3 juta. Perubahan tanda ini memperlihatkan bahwa keputusan investasi bergantung pada data meter, kontrak energi, biaya aktual, dan porsi penghematan yang diterima Telkomsel.',
    presenterNote: 'Kedua baseline adalah asumsi proposal yang belum diverifikasi. Nilai mengikuti horizon arus kas proposal 2027–2031; sebut sebagai sensitivitas, bukan forecast.'
  },
  {
    step: 7,
    startSeconds: 345,
    endSeconds: 390,
    timing: '5:45–6:30',
    title: 'ESG: ukur sebelum mengklaim',
    tab: 'esg',
    message: 'Energi, layanan, emisi, dan kualitas data perlu metode serta bukti yang disetujui.',
    visual: 'Dampak ESG • indikator pengukuran dan bukti yang masih dibutuhkan',
    evidence: 'Metrik yang diusulkan: ΔkWh, kWh/TB, mutu layanan, kas bersih, kualitas data; faktor emisi belum disetujui.',
    script: 'Kami akan menilai perubahan kWh dan kWh per terabyte, mutu layanan per lokasi, manfaat kas setelah biaya, serta kualitas dan keterlacakan data. Emisi dihitung setelah faktor dan batas pelaporannya disetujui. Hash membantu mengetahui apakah rekaman berubah, tetapi tidak membuktikan bahwa sensor atau angka asalnya benar.',
    presenterNote: 'Jangan mengklaim reduksi emisi, assurance, atau hasil pilot. Hash memeriksa perubahan berkas, bukan kebenaran data sumber.'
  },
  {
    step: 8,
    startSeconds: 390,
    endSeconds: 420,
    timing: '6:30–7:00',
    title: 'Keputusan: setujui audit kebutuhan terlebih dahulu',
    tab: 'pilotvalidation',
    message: 'Keputusan yang diminta adalah audit; kelanjutan pilot dan pembangunan tetap keputusan terpisah.',
    visual: 'Validasi Pilot • tutup pada gerbang keputusan bertahap',
    evidence: 'Usulan proposal; hasil audit dapat mendukung integrasi, pilot riset terbatas, business case baru, atau penghentian.',
    script: 'Karena itu kami meminta persetujuan untuk audit kebutuhan terlebih dahulu, bukan persetujuan ekspansi. Hasil audit akan menentukan apakah ImpactGrid perlu menjadi modul baru, memperluas sistem existing, diuji sebagai riset terbatas, atau dihentikan. Terima kasih.',
    presenterNote: 'Sampaikan satu permintaan keputusan yang jelas. Jangan mengasumsikan persetujuan audit, pilot, atau ekspansi.'
  }
]);

export const PRESENTATION_DURATION_SECONDS = 7 * 60;
