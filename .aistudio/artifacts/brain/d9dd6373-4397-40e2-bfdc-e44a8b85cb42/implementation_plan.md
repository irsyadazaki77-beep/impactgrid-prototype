# Pembaruan Fase 2 ImpactGrid Enterprise DSS — Standar Ekspansi Regional Jamali & Integrasi Lintas Modul Telkomsel

Melanjutkan penyempurnaan Fase 1 pada halaman utama dan matriks telemetri, **Fase 2** mentransformasikan seluruh **9 tab sekunder dan modal pendukung** menjadi ekosistem komando jaringan yang terhubung secara dinamis (*real-time cross-tab synchronization*), mendukung simulasi ekspansi **Skala Regional Jamali (5.000 Site)**, menyediakan **Batch Dispatch O-RAN O1 & Tiket FOP Massal**, serta membersihkan sisa istilah studi kasus lomba di seluruh sudut aplikasi.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> Seluruh keputusan arsitektur dan produk pada rencana Fase 2 ini disusun berdasarkan konfirmasi Anda pada tahap klarifikasi:

- **Keputusan 1 — Cakupan Penyempurnaan Menyeluruh (9 Tab Sekunder & Modal)**: Merombak tata letak, alur kerja, dan kedalaman fitur pada seluruh tab Eksekutif (*Validasi Pilot, Simulasi Skenario, Dampak Finansial, Dampak ESG*) dan tab Teknis NOC (*Digital Twin, Orkestrasi Agen, Telemetri, Optimasi, Arsitektur*) beserta modal dokumen korporat.
- **Keputusan 2 — Sinkronisasi Data & State Real-Time Lintas Tab**: Setiap perubahan pada daftar site BTS (tambah/ubah/hapus/kalibrasi FOP), jam simulasi 24-jam, skenario cuaca/trafik, maupun pemilihan skala proyek akan langsung memperbarui perhitungan kW, kWh, penghematan Rupiah, NPV, dan reduksi emisi $\text{tCO}_2\text{e}$ di seluruh tab tanpa nilai statis yang terputus.
- **Keputusan 3 — Simulasi Ekspansi Skala Regional Jamali (5.000 Site) & Multi-Kluster**: Menambahkan selector skala proyek interaktif (*Pilot 50 Site*, *Metro 250 Site*, *Regional Jamali 5.000 Site*, dan *Nasional 10.000+ Site*) yang mengalirkan parameter ke simulasi Monte Carlo, proyeksi arus kas 5 tahun, dan alokasi solver *0-1 Knapsack*.
- **Keputusan 4 — Otomasi Batch Dispatch O-RAN O1 & Tiket e-WO FOP Massal**: Menghadirkan konsol eksekusi massal (*Batch Operations*) untuk mengirim kebijakan *Carrier Sleep* O-RAN O1/A1 ke puluhan kluster sekaligus dan menerbitkan tiket *Field Operations (FOP)* massal bagi seluruh site berstatus *Phantom Load* atau deviasi termal.
- **Keputusan 5 — Standarisasi Korporat, Multi-Vendor RAN & Ekspor Dokumen Resmi**: Menghapus tuntas sisa istilah studi kasus lomba (*Key Question*, *Sub-Question*, *BCC TSF 2026*, *Rubrik Juri*) termasuk pada metadata HTML, merampingkan halaman tab sekunder yang terlalu panjang menjadi sub-modul terstruktur, memperkaya matriks komparasi multi-vendor RAN (**Ericsson ENM, Huawei U2020/iMaster MAE, ZTE NetNumen**), dan menyempurnakan fitur cetak/unduh dokumen resmi (**BA-RE PLN, BoQ Pengadaan, Jurnal SAP S/4HANA**).

---

## 1. Overview & Core Concept

- **Apa yang Dihadirkan di Fase 2**:
  1. **Unified Telemetry & Financial State Engine**: Satu sumber kebenaran (*Single Source of Truth*) yang menghubungkan database operasional site BTS, status kalibrasi lapangan FOP, dan jam simulasi diurnal (00:00–23:00 WIB) ke seluruh kalkulator di tab *Digital Twin*, *Simulasi Skenario*, *Dampak Finansial*, *Optimasi*, dan *Dampak ESG*.
  2. **Regional Jamali 5.000-Site Scaling Workbench**: Kemampuan bagi tim *Network Planning* dan *Corporate Finance* untuk menguji transisi dari fase Pilot (40+10 site) menuju ekspansi Metro (250 site) dan Regional Jawa-Madura-Bali (5.000 site) per kluster regional (Jabodetabek, Jabar, Jateng-DIY, Jatim, Bali-Nusra).
  3. **Batch O-RAN O1 Policy & Mass FOP Dispatch**: Alur kerja *NOC Engineering* untuk mengeksekusi perintah *Netconf/YANG* lintas vendor (Ericsson, Huawei, ZTE) dan menyelesaikan anomali kelistrikan banyak site secara serentak (*Batch Closed-Loop*).
  4. **Official Corporate Print & Export Engine**: Pembuatan dokumen siap cetak A4 dan ekspor berkas terstruktur untuk Berita Acara Rekonsiliasi Energi (BA-RE PLN), Rincian Anggaran BoQ, dan Voucher Jurnal Akuntansi SAP S/4HANA.
- **Target Pengguna / Persona**:
  - **Direksi & VP Finance / ESG Telkomsel**: Meninjau kelayakan ekspansi 5.000 site Jamali, sensitivitas tarif PLN WBP/LWBP, kepatuhan pelaporan keberlanjutan *IFRS S2 / PSPK 1 & 2*, dan pengesahan anggaran CapEx swadana.
  - **Tim SNOC, RAN Engineering & FOP Regional**: Mengelola parameter termal *Digital Twin* per site, mengeksekusi *batch policy* O-RAN rApp, membandingkan performa perangkat Ericsson/Huawei/ZTE, dan menutup tiket anomali meteran PLN secara massal.

---

## 2. User Experience & Visual Design

### A. Alur Pengguna Utama (Key User Flows)

1. **Alur 1 — Sinkronisasi Real-Time Lintas Tab (Dari Telemetri & Jam Simulasi ke Digital Twin, Finansial & ESG)**:
   - Pengguna menggeser waktu operasional pada *Global Simulation Bar* (misal ke pukul **19:00 WIB Puncak WBP** atau **02:00 WIB Off-Peak Deep Sleep**) atau mengkalibrasi site anomali di tab **Telemetri**.
   - Saat berpindah ke tab **Digital Twin**, daftar site menampilkan seluruh site aktif (termasuk site yang baru ditambahkan atau dikalibrasi) dengan beban trafik PRB dan suhu shelter yang otomatis mengikuti jam simulasi aktif, lengkap dengan tombol **Terapkan Kebijakan ke Site Ini**.
   - Saat membuka tab **Dampak Finansial** dan **Dampak ESG**, angka penghematan energi aktual, nilai klaim restitusi PLN yang telah diselesaikan FOP, dan total reduksi emisi $\text{tCO}_2\text{e}$ langsung tercermin pada kartu ringkasan atas dan tabel arus kas.

2. **Alur 2 — Simulasi Ekspansi Skala Regional Jamali 5.000 Site & Multi-Kluster**:
   - Pada tab **Simulasi Skenario** dan **Dampak Finansial**, pengguna dapat memilih cakupan skala secara instan melalui tombol prasetel:
     - **Fase 1: Pilot (40 Intervensi + 10 Kontrol)**
     - **Fase 1.5: Kluster Metro Prioritas (250 Site)**
     - **Fase 2: Regional Jamali (5.000 Site — Jabodetabek, Jabar, Jateng, Jatim, Bali)**
     - **Fase 3: Skala Nasional (10.000+ Site)**
   - Memilih **Regional Jamali 5.000 Site** secara otomatis menyesuaikan parameter konsumsi baseline (GWh/tahun), proyeksi penghematan kas bersih, distribusi probabilitas *Monte Carlo 1.000 Iterasi*, serta rincian alokasi per kluster regional.

3. **Alur 3 — Otomasi Batch Dispatch Perintah O-RAN O1 & Tiket FOP Massal**:
   - Di tab **Telemetri**, **Orkestrasi Agen**, dan **Optimasi**, operator NOC dapat memilih beberapa site atau seluruh kluster anomalik sekaligus, lalu menekan tombol **Eksekusi Batch Kalibrasi FOP & BA-RE** atau **Batch Dispatch O-RAN O1 Policy**.
   - Sistem memproses seluruh site terpilih, memperbarui status disparitas meteran menjadi *Terkalibrasi (< 1,0%)*, mengakumulasi nilai Nota Kredit Restitusi PLN pada **Jurnal SAP S/4HANA**, dan mencatat hash transaksi kolektif ke buku besar audit SHA-256.

4. **Alur 4 — Komparasi Multi-Vendor RAN (Ericsson, Huawei, ZTE) & Ekspor Dokumen Resmi**:
   - Di tab **Arsitektur** dan **Digital Twin**, pengguna dapat memfilter dan membandingkan telemetri serta dukungan komando *O-RAN O1 / Netconf YANG* pada tiga ekosistem vendor utama Telkomsel: **Ericsson (ENM / Radio 4415)**, **Huawei (iMaster MAE / AAU5613)**, dan **ZTE (NetNumen U31 / UniSite)**.
   - Dari modal **BA-RE PLN**, **BoQ Pengadaan**, maupun **Jurnal SAP S/4HANA**, pengguna dapat menekan tombol **Cetak Dokumen Resmi A4** atau **Unduh Berkas CSV/JSON** dengan kop surat standar *PT Telekomunikasi Selular*.

### B. Identitas Visual, Tata Letak & Disiplin Tipografi

- **Perampingan Tab Sekunder (Zero Visual Bloating)**:
  - Tab yang sebelumnya menumpuk banyak seksi panjang ke bawah (**Dampak Finansial**, **Dampak ESG**, **Optimasi**, dan **Arsitektur**) dirampingkan menggunakan navigasi sub-modul (*segmented workspace tabs*) sehingga setiap layar memiliki tepat satu fokus utama (*Single Focal Anchor*) di area *above-the-fold*.
- **Palet Warna & Kontras Korporat Telkomsel (60-30-10)**:
  - **60% Kanvas Netral**: Putih bersih (`#FFFFFF` / `#F8FAFC`) pada mode terang dan biru-abu gelap presisi (`#0B1324` / `#0F172A`) pada mode gelap.
  - **30% Permukaan Struktural**: Garis pembatas tipis 1px (`border-slate-200 dark:border-slate-800`) tanpa tumpukan kartu di dalam kartu.
  - **10% Aksen Korporat**: Merah Telkomsel (`#ED0226`) untuk aksi utama dan status aktif, dipadukan indikator semantik hijau (`#16A34A` nominal/terkalibrasi), amber (`#D97706` peringatan WBP/termal), dan merah (`#DC2626` anomali kritis/112).
- **Tipografi & Disiplin Angka Tabular**:
  - Tajuk utama menggunakan `Outfit` / `Plus Jakarta Sans`, teks operasional menggunakan `Plus Jakarta Sans`, dan seluruh metrik daya (kW, kWh, GWh), nilai finansial (Rp), latensi (ms), serta persentase menggunakan `JetBrains Mono` dengan `tabular-nums` agar rata kanan/desimal secara presisi.
- **Pembersihan Total Istilah Lomba & Metadata**:
  - Memperbarui `<title>` dan `<meta name="description">` pada halaman utama serta seluruh teks di tab **Arsitektur** (*Key Question / Sub-Question* diubah menjadi **Matriks Kepatuhan Tata Kelola & Strategi Dekarbonisasi Jaringan Telkomsel**), modal **Pertahanan Direksi**, dan **Lembar Kerja Validasi**.

---

## 3. Key Product Decisions & Trade-Offs

- **Keputusan 1: Arsitektur Sub-Tab Terfokus pada Tab Sekunder vs. Halaman Gulir Panjang**
  - *Pendekatan Terpilih*: Mengelompokkan konten pada tab **Dampak Finansial** (3 sub-tab: *Model NPV & Sensitivitas*, *Ekspansi 4-Horizon & Jamali 5.000 Site*, *Kontrak TowerCo & Akuisisi*), **Dampak ESG** (3 sub-tab: *Inventarisasi Scope 2 & Kepatuhan*, *Valuasi Karbon & Dividen Sosial 3T*, *Ledger Kriptografi SHA-256*), **Optimasi** (3 sub-tab: *Solver CapEx 0-1 Knapsack*, *Kurva Pareto & Batch Closed-Loop*, *Manajemen WBP PLN & BESS*), dan **Arsitektur** (4 sub-tab: *Topologi O-RAN & Multi-Vendor*, *Integrasi IT Enterprise SAP/ServiceNow*, *Tata Kelola & Mitigasi Risiko*, *Benchmarking Komparatif*).
  - *Alasan*: Menghilangkan kelelahan gulir (*scroll fatigue*) saat rapat tinjauan teknis maupun direksi, sambil memastikan **100% fitur dan analisis tetap tersedia utuh** tanpa ada informasi yang dihapus.

- **Keputusan 2: State Sinkronisasi Terpusat di Level Aplikasi (`App.jsx` + `useOperationalBackend`)**
  - *Pendekatan Terpilih*: Mengalirkan `simState` (jam simulasi, skenario aktif, mode kalkulasi), `operationalState` (daftar site, ringkasan kW/kWh aktual, site terkalibrasi FOP), serta handler aksi massal (`onBatchResolveAnomalies`, `onBatchDispatchOranPolicy`) ke seluruh 9 tab sekunder.
  - *Alasan*: Memastikan konsistensi penuh; ketika operator menyelesaikan seluruh anomali FOP atau memilih skenario *Regional Jamali 5.000 Site*, semua tab langsung menampilkan angka yang selaras.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

### A. Diagram Arsitektur & Aliran State Lintas Tab (Fase 2)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                UNIFIED ENTERPRISE STATE & OPERATIONAL STORE (App + Server)             │
│  • Active Sites (50 Pilot + BYOD + Multi-Vendor Ericsson / Huawei / ZTE Metadata)      │
│  • Diurnal Simulation Engine (00:00–23:00 WIB, Scenario Key, Scale Preset 50..5.000)   │
│  • Closed-Loop Ledger (Resolved FOP Sites, BA-RE PLN Claims, SAP FI-CO Credit Notes)   │
└───────────────┬────────────────────────────────────────────────────────┬───────────────┘
                │                                                        │
                ▼                                                        ▼
┌───────────────────────────────────────────┐  ┌─────────────────────────────────────────┐
│     MODUL EKSEKUTIF & PERENCANAAN MODAL   │  │     MODUL TEKNIS SNOC & O-RAN ENGINEERING│
├───────────────────────────────────────────┤  ├─────────────────────────────────────────┤
│ 1. Ringkasan (Executive & NOC Hub)        │  │ 6. Digital Twin (3D PINN + Live Site    │
│ 2. Validasi Pilot (DiD Kausal + StageGate)│  │    Sync + Multi-Vendor Telemetry)       │
│ 3. Simulasi Skenario (Prasetel Pilot 50,  │  │ 7. Orkestrasi Agen (4 rApp + Batch      │
│    Metro 250, Jamali 5.000 + Monte Carlo) │  │    Policy Dispatch & Arbitrase Konflik) │
│ 4. Dampak Finansial (NPV/IRR Dinamis +    │  │ 8. Telemetri (CRUD Site + Batch FOP     │
│    Realisasi Restitusi BA-RE & SAP)       │  │    Calibration + 3-Way Matrix)          │
│ 5. Dampak ESG (Scope 2 Real-Time +        │  │ 9. Optimasi (Knapsack Solver + Pareto + │
│    IDXCarbon + SHA-256 Audit Verifier)    │  │    WBP/BESS Guard)                      │
│                                           │  │10. Arsitektur (O-RAN Layer + Komparasi  │
│                                           │  │    Ericsson/Huawei/ZTE + IT Hub)        │
└─────────────────────┬─────────────────────┘  └────────────────────┬────────────────────┘
                      │                                             │
                      └──────────────────────┬──────────────────────┘
                                             ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│              OFFICIAL DOCUMENT & EXPORT SUITE (Cetak A4 / CSV / JSON / BAPI)           │
│  • Berita Acara Rekonsiliasi Energi (BA-RE PLN)  • Voucher Jurnal SAP S/4HANA FI-CO    │
│  • Rincian Pengadaan BoQ & Kontrak TowerCo       • Lembar Kerja Audit & Executive Memo │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### B. Pemetaan Interaksi Komponen & Mutasi State

1. **Sinkronisasi Tab `DigitalTwinTab` & `TelemetryTab`**:
   - Menerima `operationalSites`, `simState`, `resolvedSites`, `onResolveSiteAnomaly`, dan `onBatchResolveAnomalies`.
   - Operator dapat memilih site dari seluruh daftar operasional, menyinkronkan beban trafik PRB & suhu lingkungan dengan jam simulasi 24-jam aktif (`Sinkronkan dengan Jam Simulasi`), serta memfilter performa berdasarkan vendor RAN (**Ericsson, Huawei, ZTE**).
   - Menambahkan tombol **Batch Kalibrasi FOP (Semua Site Anomali)** pada tab **Telemetri** untuk menyelesaikan seluruh site berstatus *Phantom Load* dalam satu klik sekaligus memperbarui BA-RE PLN dan Jurnal SAP.

2. **Sinkronisasi Tab `ScenarioLabTab` & `FinancialModelTab` (Skala Regional Jamali 5.000 Site)**:
   - Menambahkan pemilih skala cepat (*Quick Scale Presets*): **Pilot 40 Site**, **Metro 250 Site**, **Regional Jamali 5.000 Site**, dan **Nasional 10.000 Site** pada `ScenarioLabTab` yang memperbarui jumlah site, proyeksi penghematan kWh/MWh/GWh, simulasi *Monte Carlo 1.000 Iterasi*, serta rincian kluster regional Jawa-Madura-Bali.
   - Menghubungkan `FinancialModelTab` dengan `operationalSummary` dan `resolvedSites` sehingga bagian atas menampilkan **Realisasi Penghematan Operasional Aktif & Restitusi BA-RE PLN Tersinkron** berdampingan dengan **Model Sensitivitas & Roadmap 4-Horizon** yang dikelompokkan ke dalam 3 sub-tab ringkas.

3. **Sinkronisasi Tab `AgentOrchestratorTab`, `OptimizationTab` & `ArchitectureTab`**:
   - Pada `AgentOrchestratorTab`, menambahkan aksi **Batch Dispatch Kebijakan O-RAN A1/O1 ke Kluster Aktif** yang mencatat eksekusi ke log terminal NOC dan jejak audit.
   - Pada `OptimizationTab` dan `ESGComplianceTab`, merampingkan komponen ke dalam sub-tab yang rapi tanpa kehilangan satu pun analisis, serta menyinkronkan angka karbon dan anggaran CapEx dengan skala proyek aktif.
   - Pada `ArchitectureTab` dan `mockData.js`, menambahkan matriks teknis **Komparasi Multi-Vendor RAN (Ericsson vs Huawei vs ZTE)** yang mencakup protokol O1/Netconf, latensi wake-up carrier sleep, dan integrasi submetering DC, serta mengganti seluruh istilah *Key Question / Sub-Question / Studi Kasus Lomba* menjadi nomenklatur tata kelola enterprise Telkomsel.

4. **Penyempurnaan Fitur Ekspor & Cetak Dokumen Resmi (`OfficialBeritaAcaraModal`, `ProcurementBoqModal`, `SapAccountingVoucherModal`, `ReportModal`)**:
   - Menambahkan fungsi unduh berkas (`CSV` / `JSON` / cetak format resmi A4) pada dokumen BA-RE PLN, BoQ Pengadaan, dan Jurnal SAP S/4HANA yang memuat rincian seluruh site anomali yang telah dikalibrasi oleh tim FOP.
