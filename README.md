# ImpactGrid - Konsep Proposal AWAKENING Reborn

ImpactGrid adalah usulan sistem pendukung keputusan untuk membandingkan investasi efisiensi energi jaringan dan menelusuri hasilnya. Proposal saat ini mengajukan audit kebutuhan terlebih dahulu, lalu pilot terbatas hanya jika data, izin, biaya, mutu layanan, dan nilai tambah terhadap proses yang berlaku mendukung.

## Status prototipe

Aplikasi ini adalah demonstrasi antarmuka dan tidak memiliki dataset lokasi operasional. Input kalkulator dan log yang terlihat adalah asumsi atau contoh; prototype tidak menghasilkan rekomendasi, audit, hasil pilot, atau simulasi jaringan tervalidasi. Prototipe tidak terhubung ke sistem Telkomsel, vendor RAN, PLN, OSS/NMS, maupun jaringan aktif; tombol demo tidak mengirim konfigurasi ke perangkat dan tidak membuktikan perlindungan layanan.

Angka publik yang dipakai sebagai konteks berasal dari sumber resmi tahun 2025: penggunaan listrik Telkomsel 1.885.417.875,2 kWh dan emisi Scope 2 1.721.967,7 tCO2e. Angka entitas ini bukan baseline lokasi atau potensi penghematan pilot.

- [Laporan Keberlanjutan Telkom 2025](https://www.telkom.co.id/minio/show/data/lampiran/1778605801197_original_TLKM-SR2025-IND.pdf)
- [Profil emisi Telkomsel di GoZero](https://aro.telkom.co.id/sustainability/)
- [Kolaborasi Telkomsel-Ericsson terkait RAN Energy Efficiency](https://www.telkomsel.com/about-us/news/telkomsel-dan-ericsson-berkolaborasi-perkuat-pengembangan-evolusi-5g-dan-dukung)

## Alur demonstrasi yang disarankan

Gunakan tombol **Start Presentation** untuk memulai preset demo dan skrip direksi tujuh menit. Presenter notes memuat naskah resmi, cue visual, sumber/label asumsi, dan batas klaim. Delapan tahapnya: masalah → solusi → rekonsiliasi/skenario → prioritisasi/bukti keputusan → validasi → finansial → ESG → keputusan. Gunakan **Reset demo** untuk menutup presentasi dan mengembalikan state simulasi; tombol ulangi di presenter dock mengulang skrip beserta preset yang sama.

- **0:00–1:00 Masalah:** ringkasan konsumsi listrik dan Scope 2 korporat 2025; bukan baseline lokasi.
- **1:00–2:00 Solusi:** jelaskan pertanyaan keputusan dan audit kemampuan existing.
- **2:00–3:30 Simulasi:** tunjukkan Scenario Lab sebagai DEMO/SIMULATED; tidak ada koneksi atau perintah perangkat.
- **3:30–4:30 Validasi:** audit usulan dua bulan maksimal Rp95 juta; pilot 9 bulan/40+10 lokasi hanya rancangan bersyarat.
- **4:30–5:45 Finansial:** bandingkan dua baseline belum terverifikasi; NPV adalah sensitivitas, bukan forecast.
- **5:45–6:30 ESG:** jelaskan ΔkWh, kWh/TB, mutu layanan, kas, dan kualitas data yang perlu diukur.
- **6:30–7:00 Keputusan:** minta audit kebutuhan terlebih dahulu; pilot atau ekspansi membutuhkan keputusan terpisah.

Pintasan presentasi: **←/→ atau Spasi** untuk tahap, **F** layar penuh, **Esc** keluar, **W** mulai/keluar. Shortcut tidak mengambil alih fokus pada input. Saat offline, simulasi lokal tetap berjalan; peta dan tautan sumber bisa tidak tersedia.

## Modul demo

- **Overview**: konteks dan alur keputusan.
- **Pilot Validation**: ilustrasi cara mengevaluasi intervensi dan pembanding.
- **Digital Twin / Scenario Lab**: simulasi berbasis asumsi contoh.
- **Telemetry**: daftar data lokasi yang perlu dikumpulkan dan direkonsiliasi.
- **Optimization**: ilustrasi pemilihan portofolio; belum membuktikan optimasi untuk data Telkomsel.
- **ESG**: demonstrasi struktur bukti dan audit trail; bukan verifikasi independen.
- **Financial Model**: sensitivitas yang mengikuti skenario proposal.
- **Architecture**: gambaran alur usulan.

## Menjalankan secara lokal

Jalankan dari folder prototype:

```bash
npm run dev
```

Vite menampilkan alamat lokal, biasanya `http://localhost:5173`.

Di Windows, skrip peluncur tersedia satu tingkat di atas folder prototype sebagai `..\run-prototype.bat`.

Untuk mengaktifkan jawaban AI server-side secara opsional, buka terminal kedua dan jalankan `npm run dev:server`. Tanpa `GEMINI_API_KEY` di environment server, aplikasi tetap memakai jawaban lokal. Untuk provider eksternal, atur `GEMINI_API_KEY` hanya di environment server sebelum menjalankan skrip tersebut. Jangan menaruhnya di variabel `VITE_*`, source frontend, atau browser. Vite meneruskan `/api` ke server lokal port 3001; daftar origin lintas domain dapat diatur lewat `CORS_ORIGINS`.

Proxy AI hanya bind ke `127.0.0.1` secara default. Jangan mengeksposnya langsung ke internet: CORS bukan autentikasi. Hosting lintas jaringan memerlukan gateway/autentikasi, TLS, konfigurasi origin, dan rate limit yang sesuai sebelum diaktifkan. Untuk bind eksplisit, `HOST` harus diatur hanya di belakang kontrol tersebut.

## Hosting demo statis di Vercel

Import repository ini sebagai proyek Vercel dan gunakan root repository. [vercel.json](./vercel.json) menetapkan `npm ci`, `npm run build`, folder output `dist`, dan rewrite SPA ke `index.html` agar akses langsung/refresh tetap membuka aplikasi. Versi Vite pada lockfile memerlukan Node.js 20.19+ atau 22.12+; lokal audit memakai Node 24.18.0. Demo statis tidak memerlukan environment variable frontend. Jangan menambahkan secret dengan prefix `VITE_`: nilai tersebut masuk ke bundle browser. Proxy Express opsional bukan Vercel Function dan tetap loopback-only; gunakan jawaban AI lokal pada deployment statis.

Sebelum membagikan URL Preview/Production, cek halaman utama dan deep path dengan refresh, semua asset lokal, status demo, dan fallback map saat tile eksternal tidak dapat diakses. Deployment Vercel aktual memerlukan akses proyek/domain dan belum dijalankan dalam audit workspace ini.

## Validasi build dan demo

```bash
npm ci
npm run build
npm test
npm run test:e2e
```

E2E Chromium membutuhkan browser Playwright yang sudah terpasang. Jika belum ada:

```bash
npx playwright install chromium
```

`npm run test:e2e` membangun versi produksi lebih dahulu, lalu memeriksa navigasi modul, mode Executive/Engineering, modal, reset, simulasi keselamatan lokal, fallback AI offline/gagal, fungsi cetak laporan, tema Light/Dark, refresh deep path, asset lokal, status/fallback peta, dan layout desktop 1366×768, 1920×1080, tablet, serta smartphone di Chromium. Test visual menyimpan screenshot audit pada `test-results` untuk dashboard, ESG, dan Guided Pitch; belum ada baseline screenshot komited di repository. Pitch tujuh menit dijalankan dengan clock virtual agar seluruh rentang waktu dan perpindahan tahap dapat diperiksa tanpa menunggu tujuh menit nyata.

## Release candidate

Hasil dan batas audit rilis terbaru ada di [RELEASE_CANDIDATE_REPORT.md](./RELEASE_CANDIDATE_REPORT.md). Hasil fase sebelumnya tidak digunakan sebagai bukti status kandidat rilis ini.

Catatan rilis kandidat: [RELEASE_NOTES_v1.0.0-rc1.md](./RELEASE_NOTES_v1.0.0-rc1.md).
