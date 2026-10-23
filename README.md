# ImpactGrid - Konsep Proposal AWAKENING Reborn

ImpactGrid adalah usulan sistem pendukung keputusan untuk membandingkan investasi efisiensi energi jaringan dan menelusuri hasilnya. Proposal saat ini mengajukan audit kebutuhan terlebih dahulu, lalu pilot terbatas hanya jika data, izin, biaya, mutu layanan, dan nilai tambah terhadap proses yang berlaku mendukung.

## Status prototipe

Aplikasi ini adalah demonstrasi antarmuka dan tidak memiliki dataset lokasi operasional. Input kalkulator dan log yang terlihat adalah asumsi atau contoh; prototype tidak menghasilkan rekomendasi, audit, hasil pilot, atau simulasi jaringan tervalidasi. Prototipe tidak terhubung ke sistem Telkomsel, vendor RAN, PLN, OSS/NMS, maupun jaringan aktif; tombol demo tidak mengirim konfigurasi ke perangkat dan tidak membuktikan perlindungan layanan.

Angka publik yang dipakai sebagai konteks berasal dari sumber resmi tahun 2025: penggunaan listrik Telkomsel 1.885.417.875,2 kWh dan emisi Scope 2 1.721.967,7 tCO2e. Angka entitas ini bukan baseline lokasi atau potensi penghematan pilot.

- [Laporan Keberlanjutan Telkom 2025](https://www.telkom.co.id/minio/show/data/lampiran/1778605801197_original_TLKM-SR2025-IND.pdf)
- [Profil emisi Telkomsel di GoZero](https://aro.telkom.co.id/sustainability/)
- [Kolaborasi Telkomsel-Ericsson terkait RAN Energy Efficiency](https://www.telkomsel.com/about-us/news/telkomsel-dan-ericsson-berkolaborasi-perkuat-pengembangan-evolusi-5g-dan-dukung)

## Alur demonstrasi yang disarankan

Gunakan tombol **Start Presentation** untuk memulai preset demo dan skrip direksi tujuh menit. Presenter notes memuat naskah resmi, cue visual, sumber/label asumsi, dan batas klaim. Tahapannya: masalah → solusi → simulasi → validasi → finansial → ESG → keputusan. Gunakan **Reset demo** untuk menutup presentasi dan mengembalikan state simulasi; tombol ulangi di presenter dock mengulang skrip beserta preset yang sama.

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

## Validasi build dan demo

```bash
npm run build
npm run test
npx playwright install chromium
npm run test:e2e
```

`npm run test:e2e` membangun versi produksi lebih dahulu, lalu menguji navigasi modul, modal, reset, fallback offline, AI lokal, fungsi cetak/PDF, dan lebar desktop, tablet, serta mobile di Chromium. Tes ini juga mencetak metrik cold load browser.

### Snapshot verifikasi FASE 7 (23 Oktober 2026)

- `npm run build`: lulus, 2.576 modul Vite.
- `npm run test`: 18 tes lulus.
- `npm run test:e2e`: 8 tes Chromium lulus; pitch 420 detik dijalankan memakai clock virtual. Browser menguji preset ulang yang reproducible, ketujuh tahap/navigasi, presenter notes, modal/shortcut, viewport 1920×1080 dan mobile 390 px, overflow horizontal, offline fallback, serta error JavaScript.
- Pada cold-load run final lokal tanpa throttling: DOMContentLoaded 52 ms, LCP 460 ms, JavaScript awal 102.511 byte ditransfer / 322.345 byte terurai. Angka ini khusus lingkungan lokal dan dapat berubah antar-run.
- Tidak ada kegagalan test tersisa. Node menampilkan peringatan konfigurasi `NO_COLOR`/`FORCE_COLOR`; tidak ada console error browser pada tes pitch.
