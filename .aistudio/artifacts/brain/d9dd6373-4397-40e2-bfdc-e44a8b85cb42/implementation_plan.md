# Penyempurnaan ImpactGrid Enterprise DSS: Unified Role-Based Workspace untuk Tim Bisnis & Operasional Telkomsel

Menyempurnakan platform **ImpactGrid** menjadi sistem pendukung keputusan (*Decision Support System*) dan konsol eksekusi operasional yang terintegrasi penuh, bebas dari tumpang-tindih antarmuka, serta dirancang khusus untuk memaksimalkan produktivitas harian **Tim Bisnis/Finansial** (BoD, VP Finance, Procurement, ESG) dan **Tim Operasional** (SNOC 24/7, RAN/O-RAN Engineering, Teknisi Lapangan FOP) Telkomsel.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> Berdasarkan konfirmasi prioritas pada tahap klarifikasi, rencana penyempurnaan ini mengintegrasikan **seluruh kapabilitas strategis Bisnis & Finansial** serta **alur kerja teknis SNOC & FOP** ke dalam satu arsitektur **Role-Based Workspace (Ruang Kerja Berbasis Peran)** yang bersih, terstruktur, dan saling terhubung secara *real-time*.

- **Keputusan Terkonfirmasi 1 — Fokus Tim Bisnis & Finansial Telkomsel**:
  1. **Kalkulator ROI & Anggaran Dinamis**: Simulasi interaktif CapEx/OpEx, bagi-hasil kontrak sewa *TowerCo* (Mitratel/Protelindo), serta proyeksi DCF 5-tahun (NPV, IRR, Payback) lintas skala (*Pilot 50 Site*, *Regional 5.000 Site*, *Nasional 10.000+ Site*).
  2. **Otomatisasi Dokumen & Settlement**: Alur persetujuan satu klik dari temuan anomali menuju penerbitan Berita Acara Rekonsiliasi Energi (**BA-RE PLN**), jurnal *Credit Note* **SAP S/4HANA**, dan paket keputusan eksekutif.
  3. **Benchmark Finansial & Energi Antar-Regional**: Komparasi *real-time* performa penghematan kWh, deviasi tagihan, dan efisiensi biaya per kluster regional Telkomsel (Jabodetabek, Jabar, Jateng, Jatim, Bali-Nusra, Sumatera, Kalimantan, Sulawesi).
  4. **Kepatuhan ESG, Pajak Karbon & Green BTS**: Pelacakan reduksi emisi *Scope 2* (tCO₂e), kalkulasi eksposur nilai ekonomi karbon/pajak karbon, alokasi *Social Dividend* 15% untuk BTS 3T, dan kesiapan sertifikasi *Green BTS* (POJK 51/2017 & ISO 14064).

- **Keputusan Terkonfirmasi 2 — Fokus Tim Operasional SNOC, RAN & FOP Lapangan**:
  1. **End-to-End Closed-Loop Workflow**: Integrasi langsung dari alarm triase SNOC $\rightarrow$ penerbitan tiket kerja elektronik (*e-Work Order*) FOP lapangan $\rightarrow$ eksekusi kebijakan radio **NETCONF/YANG O-RAN O1** $\rightarrow$ verifikasi hasil kalibrasi.
  2. **Ingest Data BYOD Riil & Deteksi Anomali Otomatis**: Kemampuan unggah data operasional riil (CSV/JSON) dengan mesin deteksi otomatis untuk mengidentifikasi *meter drift*, kebocoran beban termal AC shelter, atau selisih tagihan PLN > 5%.
  3. **Mode Siaga Bencana (Emergency 112), Guard Trafik VIP & Fail-Safe**: Sakelar intervensi darurat instan (< 50ms) yang membatalkan *carrier sleep* demi menjaga 100% kapasitas PRB dan memproteksi trafik prioritas tanpa risiko degradasi QoS.
  4. **Inspeksi Teknis Mendalam per Site (Digital Twin & 3GPP)**: Penelusuran *drill-down* per menara BTS untuk memantau profil termal *Physics-Informed Neural Network* (PINN), status *sub-carrier sleep* 3GPP Rel-18, dan rekonsiliasi 3-arah (PLN vs Sub-meter DC vs Estimasi RAN).

- **Keputusan Terkonfirmasi 3 — Pendekatan UX & Tata Kelola Utama**:
  - **Penyederhanaan UI Berbasis Peran (*Role-Based Workspace*) dengan Alur Kerja Terpadu**: Mengurangi kepadatan elemen visual (*visual clutter*) dengan menghadirkan **Role Action Launcher Bar** kontekstual dan mengelompokkan alur kerja sesuai profil pengguna aktif tanpa menghilangkan akses lintas modul.

---

### 1. Overview & Core Concept

- **Apa yang Dilakukan Penyempurnaan Ini**:
  Menyatukan seluruh modul analitik bisnis dan instrumen kendali teknis yang sebelumnya tersebar di berbagai panel menjadi sebuah **Unified Command & Business Workspace**. Ketika seorang pemangku kepentingan memilih peran mereka (misalnya *VP Network/Finance*, *NOC Incident Commander*, *O-RAN Engineer*, *Head of ESG*, atau *Internal Auditor*), antarmuka secara cerdas menampilkan **Ringkasan KPI Prioritas**, **Alur Kerja Terpadu 4-Langkah (Detect $\rightarrow$ Execute $\rightarrow$ Settle $\rightarrow$ Approve)**, serta akses cepat ke instrumen yang relevan dengan tugas harian mereka.

- **Target Pengguna / Persona Utama**:
  1. **Tim Bisnis & Eksekutif Telkomsel (Direksi, VP Finance, VP Procurement, TowerCo Partnership)**: Membutuhkan kepastian angka ROI/NPV, pengendalian plafon anggaran *Stage-Gate* (G0–G3), negosiasi kontrak sewa menara *TowerCo*, dan bukti penghematan teraudit di SAP S/4HANA.
  2. **Tim Keberlanjutan & Tata Kelola (Head of ESG & Corporate Auditor)**: Membutuhkan pelacakan dekarbonisasi *Scope 2*, valuasi kredit/pajak karbon, transparansi jejak audit kriptografis (SHA-256), dan kepatuhan regulasi.
  3. **Tim Operasional & Teknis (SNOC 24/7, RAN/O-RAN Engineer, Teknisi FOP)**: Membutuhkan deteksi anomali cepat dari data telemetri/BYOD, disposisi tiket lapangan, eksekusi *script* NETCONF multi-vendor (Ericsson, Huawei, ZTE), dan jaminan keamanan *fail-safe* 112.

- **Nilai Tambah Utama (*Key Value*)**:
  - **Zero Friction Collaboration**: Setiap tindakan teknis di lapangan (misal: kalibrasi FOP pada site anomali atau eksekusi *batch* O-RAN) secara instan memperbarui angka penghematan finansial (Rupiah), menurunkan deviasi tagihan PLN, mengkalkulasi ulang NPV/Payback di modul Finansial, dan memperbarui capaian emisi ESG secara *real-time*.

---

### 2. User Experience & Visual Design

- **Alur Kerja Utama Pengguna (*Key User Flows*)**:
  1. **Alur Kerja Tim Bisnis (Simulasi Investasi $\rightarrow$ Benchmark Regional $\rightarrow$ Settlement BA-RE & SAP)**:
     - Pengguna memilih profil **Bisnis / Eksekutif** atau membuka tab **Ringkasan / Dampak Finansial**.
     - Menggunakan **Interactive Business ROI & TowerCo Studio** untuk mengubah parameter tarif listrik PLN, target efisiensi, jumlah site, skema bagi-hasil *TowerCo*, dan melihat perubahan instan pada NPV 5-tahun, IRR, Payback Period, serta tabel sensitivitas.
     - Membandingkan performa efisiensi antar wilayah pada **Matriks Benchmark Regional Real-Time** dan mengekspor laporan kesiapan komite investasi atau memicu penerbitan **BA-RE PLN & Jurnal SAP S/4HANA**.
  2. **Alur Kerja Tim Operasional (Ingest BYOD & Deteksi Anomali $\rightarrow$ Eksekusi O-RAN / FOP $\rightarrow$ Verifikasi 3-Arah)**:
     - Pengguna memilih profil **NOC Commander / O-RAN Engineer** atau membuka tab **Telemetri / Digital Twin / Optimasi**.
     - Mengunggah dataset telemetri (CSV/JSON) atau memuat *preset* kluster regional; sistem secara otomatis menandai site dengan anomali selisih meteran PLN vs Sub-meter DC atau suhu shelter kritis.
     - Menjalankan **Closed-Loop Action**: mengirim kebijakan *Adaptive Carrier Sleep* via NETCONF O-RAN O1 atau menugaskan **Tiket e-WO Teknisi FOP** (baik per site maupun *Batch Calibration*), lengkap dengan perlindungan **Emergency 112 & VIP Traffic Guard**.
     - Memeriksa pembaruan status teknis secara langsung pada **Inspektur Digital Twin 3D & Telemetri 3GPP** hingga status rekonsiliasi berubah menjadi *Verified (< 1.5% Drift)*.

- **Identitas Visual & Tema (*SaaS & Enterprise Dashboard Discipline*)**:
  - **Arah Estetika**: *Precision Enterprise Telemetry & Executive Financial Console* — memadukan ketegasan korporat Telkomsel dengan keterbacaan tingkat tinggi untuk ruang komando SNOC maupun ruang rapat Direksi.
  - **Palet Warna & Kontras (60-30-10 Discipline)**:
    - *60% Kanvas Netral*: Putih bersih (`#FFFFFF` / `slate-50`) pada mode terang untuk rapat eksekutif dan *Deep Slate* (`#0B1324` / `#0F172A`) pada mode gelap untuk pemantauan SNOC 24/7.
    - *30% Permukaan Struktural*: Kartu dengan kedalaman satu lapis (*single-elevation depth*) menggunakan garis batas tipis (`1px solid border-slate-200 dark:border-slate-800`) tanpa tumpukan kartu di dalam kartu yang berlebihan.
    - *10% Aksen Semantik & Korporat*: Merah Telkomsel (`#ED0226`) khusus untuk aksi utama dan status aktif; Hijau Emerald (`#16A34A`) untuk status *Verified / Optimal*; Amber (`#D97706`) untuk peringatan deviasi; Merah Crimson (`#DC2626`) untuk siaga darurat 112.
  - **Tipografi & Disiplin Angka Tabular**:
    - Hierarki tipografi yang tegas dengan ukuran judul bagian yang terkontrol dan keterbacaan teks utama yang nyaman.
    - Seluruh angka finansial (Rp), metrik daya (kW/MWh), persentase efisiensi, waktu simulasi, dan nilai deviasi wajib menggunakan **`tabular-nums` (`font-mono`)** agar lurus secara vertikal di seluruh tabel dan kartu KPI.
    - Metadata ditampilkan sebagai teks bersih dengan pemisah tipografis (`·` atau `/`) sesuai prinsip *Zero-Pill Metadata Discipline*.

- **Umpan Balik Interaktif & Kelengkapan Status (*State Completeness*)**:
  - Respons interaksi instan ($\le 200\text{ms}$) saat mengganti peran (*Role Switch*), mengubah slider parameter finansial, atau mengeksekusi kalibrasi *batch*.
  - Setiap tabel dan matriks data memiliki status lengkap: *Populated State* (data kaya), *Filtered Empty State* (dengan tombol reset filter), serta umpan balik konfirmasi yang jelas setiap kali tindakan operasional berhasil disinkronkan ke basis data operasional.

---

### 3. Key Product Decisions & Trade-Offs

- **Keputusan 1: Menambahkan *Unified Role-Based Action Bar & Workflow Hub* di Atas Workspace Tanpa Menghapus Modul Spesialis**
  - *Pendekatan Terpilih*: Menyediakan bilah **Role-Based Quick Workspace** yang beradaptasi secara dinamis dengan 5 peran korporat Telkomsel (VP Network/Finance, NOC Commander, O-RAN Engineer, Head of ESG, Internal Auditor) sekaligus merapikan tata letak di dalam setiap tab agar alur *Bisnis* dan *Operasional* saling terhubung dengan 1 klik.
  - *Alasan ("Why")*: Memudahkan tim bisnis langsung fokus pada kalkulator ROI, benchmark regional, BA-RE, dan ESG, sementara tim operasional langsung mendapatkan kontrol triase SNOC, ingest BYOD, *dispatch* O-RAN, dan tiket FOP tanpa tersesat di antara puluhan tombol.
  - *Alternatif yang Dipertimbangkan*: Memisahkan aplikasi menjadi dua URL berbeda (satu khusus bisnis, satu khusus teknis). Ditolak karena justru memutus visibilitas *closed-loop* di mana tim bisnis perlu melihat bukti teknis secara langsung dan tim teknis perlu melihat dampak rupiah dari optimasi mereka.

- **Keputusan 2: Sinkronisasi State *Real-Time* Lintas Modul Bisnis & Operasional melalui Full-Stack Operational Store**
  - *Pendekatan Terpilih*: Memperkuat integrasi antara *state* simulasi, daftar site yang telah dikalibrasi FOP (`resolvedSites`), data BYOD yang diunggah, dan *backend operational store* sehingga setiap perubahan di sisi operasional langsung memperbarui kalkulasi finansial (kredit restitusi SAP, NPV, penghematan OPEX) dan metrik kepatuhan ESG.
  - *Alasan ("Why")*: Menjamin konsistensi angka 100% di seluruh tab dan dokumen cetak (BA-RE, SAP Voucher, BoQ, Executive Memo) sehingga siap digunakan untuk simulasi operasional nyata maupun audit internal.

---

### 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Diagram Arsitektur Sistem & Alur Kerja Terpadu**:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                     IMPACTGRID UNIFIED ROLE-BASED WORKSPACE HEADER                     │
│  [Persona Switcher: Bisnis / SNOC / O-RAN / ESG / Audit] ──► [Contextual Action Strip] │
│  [Global Sim & Emergency 112 Guardrail (<50ms)]          ──► [Multi-Screen Sync Bus]   │
└───────────────────┬────────────────────────────────────────────────┬───────────────────┘
                    │                                                │
                    ▼                                                ▼
┌───────────────────────────────────────┐        ┌───────────────────────────────────────┐
│     TIM BISNIS & EKSEKUTIF SUITE      │        │    TIM OPERASIONAL SNOC & FOP SUITE   │
├───────────────────────────────────────┤        ├───────────────────────────────────────┤
│ 1. Kalkulator ROI, DCF & TowerCo      │◄──────►│ 1. Triase SNOC & Emergency 112 Guard  │
│    (Simulasi CapEx/OpEx, WACC, Tarif, │ Sinkron│    (Deteksi Alarm, VIP Traffic Guard, │
│     Bagi-Hasil Mitratel/Protelindo)   │  State │     Instant Override Carrier Sleep)   │
│                                       │  Nyata │                                       │
│ 2. Otomasi Settlement & Persetujuan   │◄──────►│ 2. Ingest BYOD & Rekonsiliasi 3-Arah  │
│    (BA-RE PLN, Jurnal SAP S/4HANA     │        │    (Parser CSV/JSON, Deteksi Otomatis │
│     Credit Note, BoQ & Memo BoD)      │        │     Anomali Meter >5% & Termal AC)    │
│                                       │        │                                       │
│ 3. Benchmark Finansial Antar-Regional │◄──────►│ 3. Closed-Loop FOP & NETCONF O-RAN O1 │
│    (Komparasi Real-Time Kluster       │        │    (Disposisi e-WO Lapangan, Batch    │
│     Jamali & Luar Jawa, Ranking ROI)  │        │     Calibration, Script Multi-Vendor) │
│                                       │        │                                       │
│ 4. Kepatuhan ESG & Pajak Karbon       │◄──────►│ 4. Inspektur Digital Twin & 3GPP      │
│    (Scope 2 tCO₂e, Valuasi Pajak      │        │    (Drill-Down per Site, Termal PINN, │
│     Karbon, Sertifikasi Green BTS)    │        │     Sub-Carrier Sleep & QoS Guard)    │
└───────────────────┬───────────────────┘        └───────────────────┬───────────────────┘
                    │                                                │
                    └───────────────────────┬────────────────────────┘
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│             OPERATIONAL BACKEND STORE & CRYPTOGRAPHIC AUDIT ENGINE (SHA-256)           │
│  • Sinkronisasi Status Site BTS, Kebijakan O-RAN O1, Tiket e-WO FOP & Dokumen BA-RE    │
│  • Pencatatan Rantai Hash Audit Tidak Terbantahkan & Ekspor Dokumen Resmi (CSV/Print)  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

- **Model Data & Strategi State Terpadu**:
  1. **Role & Workspace Context State**: Menyimpan profil peran aktif (`currentRole`), mode tampilan (`executive` vs `engineering`), skala jaringan (`pilot`, `regional`, `national`), serta daftar rekomendasi tindakan prioritas untuk peran tersebut.
  2. **Operational & BYOD Telemetry State**: Menggabungkan data bawaan 50 site pilot dengan data unggahan BYOD pengguna, menghitung selisih 3-arah (*PLN Billing* vs *Sub-meter DC* vs *RAN Telemetry*) secara otomatis, dan mengelompokkan site ke dalam status *Nominal*, *Warning*, *Critical Drift*, atau *FOP Verified*.
  3. **Financial & ESG Dynamic Engine**: Menghitung ulang secara reaktif dampak penghematan energi (MWh), manfaat bersih tahunan (Rp), NPV 5-tahun, bagi-hasil *TowerCo*, nilai ekonomi karbon/pajak karbon, serta indeks kesiapan *Green BTS* berdasarkan jam simulasi, kebijakan O-RAN yang aktif, dan jumlah site anomali yang telah diselesaikan oleh FOP.

- **Pemetaan Interaksi Komponen & Handler Lengkap**:
  1. **Role-Based Quick Action Banner (pada Ringkasan & Workspace Utama)**:
     - Menampilkan misi utama peran aktif, KPI kunci peran tersebut, dan 3–4 tombol aksi langsung (misal untuk *Tim Bisnis*: "Simulasi Kalkulator ROI & TowerCo", "Terbitkan BA-RE & Jurnal SAP", "Benchmark Regional", "Audit Pajak Karbon ESG"; untuk *Tim Operasional*: "Triase Anomali & Tiket FOP", "Unggah Data BYOD CSV/JSON", "Batch Dispatch O-RAN O1", "Simulasi Siaga 112").
  2. **Peningkatan Modul Finansial & Benchmark Bisnis**:
     - Menambahkan kalkulator interaktif kontrak bagi-hasil *TowerCo* & sensitivitas anggaran CapEx/OpEx yang terhubung langsung dengan perbandingan efisiensi antar-regional Telkomsel dan tombol penerbitan cepat dokumen *settlement* (BA-RE PLN, SAP S/4HANA, dan BoQ Pengadaan).
  3. **Peningkatan Modul ESG, Pajak Karbon & Sertifikasi Green BTS**:
     - Menambahkan simulator eksposur Pajak Karbon / Nilai Ekonomi Karbon (Rp/tCO₂e) dan matriks kelayakan sertifikasi **Green BTS Telkomsel** per kluster regional.
  4. **Peningkatan Modul Operasional SNOC, Ingest BYOD & Digital Twin**:
     - Memperkuat *scanner* deteksi anomali otomatis saat ingest data BYOD, menyediakan kontrol *Guard Trafik VIP & Siaga 112* yang responsif, serta memperkaya panel inspeksi *drill-down* per site BTS (status *carrier sleep* 3GPP, kurva termal shelter, dan riwayat kalibrasi FOP).
