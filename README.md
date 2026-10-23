# Telkomsel ImpactGrid - Prototype Demo

ImpactGrid adalah usulan sistem pendukung keputusan untuk membandingkan investasi efisiensi energi jaringan dan menelusuri hasilnya. Proposal saat ini mengajukan audit kebutuhan terlebih dahulu, lalu pilot terbatas hanya jika data, izin, biaya, mutu layanan, dan nilai tambah terhadap proses yang berlaku mendukung.

## Status prototipe

Aplikasi ini adalah demonstrasi antarmuka. Data lokasi, meter, trafik, QoS, rekomendasi, simulasi keadaan darurat, hash, dan hasil finansial di dalam aplikasi merupakan contoh atau simulasi. Prototipe tidak terhubung ke sistem Telkomsel, vendor RAN, PLN, OSS/NMS, maupun jaringan aktif; tombol demo tidak mengirim konfigurasi ke perangkat dan tidak membuktikan perlindungan layanan.

Angka publik yang dipakai sebagai konteks berasal dari sumber resmi tahun 2025: penggunaan listrik Telkomsel 1.885.417.875,2 kWh dan emisi Scope 2 1.721.967,7 tCO2e. Angka entitas ini bukan baseline lokasi atau potensi penghematan pilot.

- [Laporan Keberlanjutan Telkom 2025](https://www.telkom.co.id/minio/show/data/lampiran/1778605801197_original_TLKM-SR2025-IND.pdf)
- [Profil emisi Telkomsel di GoZero](https://aro.telkom.co.id/sustainability/)
- [Kolaborasi Telkomsel-Ericsson terkait RAN Energy Efficiency](https://www.telkomsel.com/about-us/news/telkomsel-dan-ericsson-berkolaborasi-perkuat-pengembangan-evolusi-5g-dan-dukung)

## Alur demonstrasi yang disarankan

1. Tunjukkan halaman ringkasan dan baca banner data simulasi.
2. Buka Data Hub untuk menunjukkan bidang yang perlu direkonsiliasi, bukan integrasi aktif.
3. Buka Scenario Lab untuk membandingkan asumsi dan menyebut bahwa baseline lokasi belum diverifikasi.
4. Buka Financial Model untuk memperlihatkan sensitivitas dua asumsi baseline. Jangan menyebut hasilnya sebagai forecast atau persetujuan investasi.
5. Tunjukkan arsitektur human-in-the-loop dan daftar bukti yang diperlukan sebelum pilot.

## Modul demo

- **Overview**: konteks dan alur keputusan.
- **Pilot Validation**: ilustrasi cara mengevaluasi intervensi dan pembanding.
- **Digital Twin / Scenario Lab**: simulasi berbasis asumsi contoh.
- **Telemetry**: contoh tabel lokasi dan data yang perlu dikumpulkan.
- **Optimization**: ilustrasi pemilihan portofolio; belum membuktikan optimasi untuk data Telkomsel.
- **ESG**: demonstrasi struktur bukti dan audit trail; bukan verifikasi independen.
- **Financial Model**: sensitivitas yang mengikuti skenario proposal.
- **Architecture**: gambaran alur usulan.

## Menjalankan secara lokal

Di Windows, jalankan `run-prototype.bat`, atau dari folder ini:

```bash
npm run dev
```

Vite menampilkan alamat lokal, biasanya `http://localhost:5173`.
