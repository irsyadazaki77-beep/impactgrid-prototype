# Telkomsel ImpactGrid — Interactive Control Tower Prototype

> **Prototipe Resmi untuk Babak Semifinal Business Case Competition (BCC) TDC Summit Fest 2026 (TSF 2026)**  
> **Case Collaborator**: PT Telekomunikasi Selular (Telkomsel)  
> **Tim Pengusul**: AWAKENING Reborn  

---

## 📌 Gambaran Umum Sistem
**ImpactGrid** adalah platform *Cyber-Physical Energy System* (CPES) dan *Decision Support System* (DSS) berbasis kecerdasan buatan (*AI vendor-agnostic*) yang dirancang khusus untuk memecahkan **dilema dekarbonisasi dan biaya energi RAN Telkomsel**. 

Sistem ini mengorkestrasi 4 modul inti untuk mengoptimasi konsumsi listrik pada **293.136 BTS** nasional secara dinamis tanpa mengorbankan Service Level Agreement (*QoS SLA*) jaringan telekomunikasi.

---

## 🚀 Cara Menjalankan Prototipe

### Cara Cepat (Windows):
Cukup klik dua kali file **`run-prototype.bat`** di folder utama, atau buka terminal dan jalankan:

```bash
cd impactgrid-prototype
npm run dev
```

Aplikasi akan otomatis berjalan pada: `http://localhost:5173`

---

## 🛠️ Modul & Fitur yang Diimplementasikan

| Modul | Nama Modul | Fitur & Fungsi Interaktif |
|---|---|---|
| **Command Center** | Executive Control Tower | Ringkasan KPI nasional (10.000 BTS Pilot), Grafik Profil Beban Daya 24 Jam (Baseline vs Optimized), dan Status Kluster Regional (Jabodetabek, Jatim, Jabar, Jateng, Sumatera, Bali). |
| **Modul 1** | Cross-Domain Telemetry Aggregator | Pipeline penarikan data multi-vendor RAN (Ericsson ENM, Huawei iMaster, ZTE NetNumen, Nokia NetAct) & Smart Meter PLN (AMR/AMI) dengan filter pencarian site BTS. |
| **Modul 2** | Scenario Lab Digital Twin | Sandbox simulasi *What-If* interaktif. Pengguna dapat mengubah slider intensitas sleep mode 3GPP, ambang batas trafik, suhu shelter AC (PUE), dan porsi solar hybrid untuk melihat proyeksi penghematan GWh, rupiah, dan emisi Scope 2. |
| **Modul 3** | AI Multi-Objective Optimization Engine | Kurva trade-off **Pareto Frontier** (Efisiensi Energi vs Delta Latency QoS), Rekomendasi Aksi AI *Real-time*, tombol toggle *Autonomous Closed-Loop vs Human-in-the-Loop*, dan sistem proteksi *Multi-Layer Safety Guardrails* (panggilan darurat 112). |
| **Modul 4** | ESG Audit-Ready MRV Dashboard | Pelacak pemenuhan target dekarbonisasi 2030 (defisit 547.000 ton CO2e), metrik ekuivalen lingkungan nyata (pohon, mobil, batubara), matriks kepatuhan regulasi (GRI 302/305, POJK 51, BEI ESG), serta log audit terenkripsi SHA-256 anti-greenwashing. |
| **Finansial** | Self-Funding Reinvestment Loop | Model finansial 5 tahun (2027–2031) yang membuktikan bagaimana penghematan OPEX listrik Rp 21,96 Miliar/tahun di Fase 1 mendanai ekspansi CapEx fase berikutnya secara mandiri (NPV 5 Tahun Rp 41,48 Miliar, Payback 1,02 Tahun). |
| **Arsitektur** | Diagram Kasus Semifinal | Penampil 4 diagram visual kunci proposal (`gambar1_issue_tree.png`, `gambar2_roadmap.png`, `gambar3_arsitektur.png`, `gambar4_alur_optimasi.png`) dengan anotasi langsung ke rubrik penilaian juri. |
| **Ekspor** | Export Laporan Audit MRV | Modal sertifikat verifikasi emisi dan pencetakan dokumen PDF audit-ready untuk pemangku kepentingan. |

---

## 💻 Teknologi yang Digunakan
* **Frontend**: React 19, Vite, Tailwind CSS v4
* **Ikon**: Lucide React
* **Visualisasi Data & Grafik**: Recharts
* **Desain UI**: Modern Dark Mode bergaya Enterprise Telecom Control Tower dengan aksen warna Telkomsel Red (`#ED0226`)
