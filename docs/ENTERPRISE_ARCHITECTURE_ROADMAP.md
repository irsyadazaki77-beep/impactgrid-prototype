# ImpactGrid: Enterprise Architecture & Implementation Roadmap
**Telkomsel RAN Energy Optimization & ESG Decision Support System**
*Dokumen Arsitektur Teknis, Integrasi O-RAN, dan Rencana Eksekusi Skala Nasional (2026–2031)*

---

## 1. Ringkasan Eksekutif & Konteks Strategis
Telkomsel mengkonsumsi listrik sebesar **1.885.417.875,2 kWh (1.885,4 GWh)** per tahun yang menghasilkan emisi Scope 2 sebesar **1.721.967,7 tCO₂e** (mencakup 63,6% dari total jejak karbon korporat menurut *Laporan Keberlanjutan Telkom 2025*). Lebih dari 70% konsumsi listrik tersebut berasal dari jaringan Radio Access Network (RAN) dan shelter BTS.

**ImpactGrid** dirancang sebagai Decision Support System (DSS) dan Platform Otomasi Energi Jaringan yang menjembatani kesenjangan antara kebijakan keberlanjutan (ESG/Net-Zero) dengan keandalan operasional telekomunikasi tingkat tinggi (SLA Telkomsel > 99.99%).

---

## 2. Arsitektur Sasaran (Target Architecture)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          IMPACTGRID ENTERPRISE SUITE                            │
├─────────────────────────────────────────────────────────────────────────────────┤
│  [ Executive DSS Layer ]       [ ESG & Carbon Accounting ]    [ Field Ops (FOP) ]│
│  • CFO Financial Cockpit       • GHG Protocol Scope 2 Ledger  • Mobile e-WO App  │
│  • What-If Scenario Lab        • ITU-T L.1331 Compliance      • 3-Shift Dispatch │
│  • Monte Carlo Risk Engine     • Auditor Export (PwC/EY Spec) • SOP Auto-Trigger │
└────────────────────────────────────────┬────────────────────────────────────────┘
                                         │ REST API / GraphQL (OAuth2 mTLS)
┌────────────────────────────────────────▼────────────────────────────────────────┐
│                       NON-RT RIC & SMO LAYER (O-RAN WG2)                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│  • AI Energy Optimization rApp (Prophet-RAN / ThermoOptima PINN)                │
│  • Multi-Objective Policy Engine (Energy vs QoS vs Thermal Protection)          │
│  • A1 Interface Policy Orchestrator                                            │
└───────────────────▲─────────────────────────────────────────────┬───────────────┘
                    │                                             │
      Telemetry Bus │ (Kafka / Cloud PubSub)         Policy Direct│ (A1 / O1 NETCONF)
                    │                                             ▼
┌───────────────────┴─────────────────────────────┐ ┌─────────────────────────────┐
│       INGESTION & TIME-SERIES PIPELINE          │ │     NEAR-RT RIC & xApp      │
├─────────────────────────────────────────────────┤ ├─────────────────────────────┤
│ • IoT Submeter Class 0.5s (Modbus-TCP / MQTT)   │ │ • Zero-Wait Wake-Up xApp    │
│ • AMR PLN Smart Meter (DLMS / COSEM)            │ │ • Emergency 112 Priority    │
│ • Vendor OSS PM/FM Counters (O1 NETCONF/YANG)   │ │ • E2 Interface (< 10ms loop)│
│ • Time-Series DB: ClickHouse / VictoriaMetrics  │ └──────────────┬──────────────┘
└─────────────────────────────────────────────────┘                │
                                                                   ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    PHYSICAL & VIRTUALIZED RAN INFRASTRUCTURE                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│  • Ericsson ENM / Huawei iMaster NCE / ZTE NetNumen Multi-Vendor RAN            │
│  • Shelter Environmental Controls (Inverter Smart HVAC, LiFePO4 BESS DC Bus)    │
│  • Macro Towers: 50 Pilot Sites ➔ 5.000 Jamali ➔ 10.000+ Nasional              │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Strategi Integrasi RAN Multi-Vendor (Heterogeneous Ingestion)

Telkomsel beroperasi dengan peralatan radio dari berbagai vendor terkemuka. ImpactGrid mengadopsi standar **O-RAN Alliance Working Group 10 (O1 Operations and Maintenance)** untuk memastikan independensi vendor (*vendor-neutral*):

| Vendor | Sistem Manajemen Elemen (EMS/OSS) | Protokol Southbound | Parameter yang Dikontrol / Dimonitor |
| :--- | :--- | :--- | :--- |
| **Ericsson** | Ericsson Network Manager (ENM) | O1 / NETCONF over SSH, Bulk PM XML | Micro-sleep Tx, Carrier Shutdown, PRB Load |
| **Huawei** | iMaster NCE / U2020 | O1 / CORBA / REST NBI, SFTP Counter | Symbol power saving, Channel sleep, PA bias |
| **ZTE** | NetNumen U31 | O1 / YANG models, SNMP v3 | Deep sleep mode, RF carrier shutdown |
| **TowerCo** | Mitratel / TBIG / Protelindo | Modbus-TCP / MQTT IoT Gateway | Suhu shelter, Rectifier DC output, genset status |

---

## 4. Pipeline Data Telemetri & Rekonsiliasi 3-Arah

Kelemahan mendasar program efisiensi energi telekomunikasi konvensional adalah ketidakmampuan membuktikan efisiensi bersih akibat fluktuasi cuaca dan beban trafik. ImpactGrid memecahkan ini melalui **Rekonsiliasi 3-Arah (Triple Reconciliation)**:

1. **Titik A: Meter Listrik PLN (Sisi AC Masuk)**
   - Standar Kelas 0.5s via DLMS/COSEM.
   - Mengukur konsumsi total kVA dan kWh trafo shelter.
2. **Titik B: Output Rectifier DC (Sisi -48V DC)**
   - Submetering IoT terkalibrasi.
   - Mengukur konsumsi daya aktual subsistem radio, beban pendingin shelter (HVAC), dan cadangan baterai LiFePO4.
3. **Titik C: OSS RF Radio (Sisi Sektor RAN)**
   - Counter 3GPP PM (Packet Resource Block utilization, throughput, active users).

**Algoritma Difference-in-Differences (DiD):**
$$\Delta\text{kWh}_{\text{net}} = (\text{kWh}_{\text{intervensi, post}} - \text{kWh}_{\text{intervensi, pre}}) - (\text{kWh}_{\text{kontrol, post}} - \text{kWh}_{\text{kontrol, pre}})$$
Menghilangkan bias musim, libur mudik, atau anomali cuaca lokal, menghasilkan data penghematan yang valid secara statistik.

---

## 5. Mesin AI/ML & Perlindungan Fail-Safe SLA

### A. Non-RT RIC rApp (Loop 1–60 Menit)
- **Model:** Kombinasi *Temporal Fusion Transformer (TFT)* dan *Physics-Informed Neural Networks (PINN)*.
- **Fungsi:** Memprediksi beban lalu lintas selular 24 jam ke depan serta disipasi panas kabinet shelter.
- **Output:** Rekomendasi penjadwalan carrier sleep dan modulasi inverter pendingin.

### B. Near-RT RIC xApp (Loop < 28 Milidetik)
- **Fungsi:** Guardrail keselamatan tanpa intervensi manusia (*Zero-Touch Safety Override*).
- **Triggers Fail-Safe:**
  1. *Panggilan Darurat 112:* Pembatalan carrier sleep instan dalam **< 28ms** dengan prioritas 100% PRB.
  2. *Lonjakan Beban Trafik:* Jika utilisasi PRB melampaui 70%, kapasitas sel dibangunkan seketika.
  3. *Anomali Termal:* Jika suhu ambient shelter melampaui 32.0°C, smart HVAC dipacu otomatis.

---

## 6. Kepatuhan Regulasi, Keamanan Siber & Kedaulatan Data

* **Kedaulatan Data:** Memenuhi mandat **PP No. 71 Tahun 2019** (PSTE) dan kebijakan CISO Telkomsel. Seluruh data telemetri dan log operasional disimpan pada fasilitas data center di Indonesia (*Primary: Telkom DC Sentul; DR: Telkom DC Surabaya*).
* **Audit Trail Kriptografis:** Setiap pembacaan telemetri 15-menit diikat menggunakan hash tree **SHA-256 Merkle Ledger** yang tahan manipulasi (*tamper-evident*).
* **Sertifikasi Keamanan:** Arsitektur container berbasis Kubernetes yang telah di-hardening (*readOnlyRootFilesystem: true*, non-root user, NetworkPolicy zero-trust).

---

## 7. Standarisasi Pelaporan ESG & Akuntansi Karbon

ImpactGrid mengotomatiskan pembuatan laporan keberlanjutan sesuai standar internasional:
- **ITU-T L.1331:** Metrik efisiensi energi jaringan telekomunikasi seluler ($kWh / TB$ lalu lintas data).
- **GHG Protocol Scope 2 Guidance:** Metode berbasis lokasi (*location-based*) menggunakan faktor emisi grid Jamali Kementerian ESDM (0,78 kg CO₂e/kWh) dan metode berbasis pasar (*market-based*) untuk verifikasi Sertifikat Energi Terbarukan (REC).
- **POJK No. 51/POJK.03/2017:** Menghasilkan lampiran pengungkapan kinerja lingkungan emisi gas rumah kaca untuk laporan tahunan PT Telkom Indonesia (Persero) Tbk.

---

## 8. Rencana Implementasi Bertahap (3-Phase Rollout Plan)

```
2026 (Q3-Q4)        2027 (Q1-Q3)          2028 - 2029             2030 - 2031
    │                    │                     │                       │
    ▼                    ▼                     ▼                       ▼
[FASE 0: AUDIT]    [FASE 1: PILOT]      [FASE 2: REGIONAL]      [FASE 3: NASIONAL]
Plafon: Rp 95 Jt   40+10 Lokasi Pilot   5.000 Menara Jamali     10.000+ Menara Telkomsel
Audit submetering  CapEx: Rp 450 Jt     CapEx: Rp 6,5 Miliar    CapEx: Rp 15,0 Miliar
& kesiapan API     ROI: 1,9 Tahun       ROI: 1,35 Tahun         ROI: 1,0 Tahun
Validasi baseline  Uji DiD -14.8%       Net: +Rp 4,80 M/th      Net: +Rp 14,90 M/th
                   Zero drop call 112   Emisi: -5.046 tCO₂e/th  Emisi: -12.702 tCO₂e/th
```

1. **Fase 0 (Audit Pra-Pilot, 2 Bulan):**
   - Plafon biaya maksimal Rp 95 Juta untuk survei meter PLN, kalibrasi sensor, dan audit keamanan API.
   - *Syarat Go/No-Go:* Data baseline terverifikasi sebelum sepeser pun belanja modal radio dikucurkan.
2. **Fase 1 (Pilot Terkendali, 9 Bulan):**
   - 40 site intervensi + 10 site pembanding di kluster Jawa Barat & Jabodetabek.
   - Membuktikan efisiensi bersih $\ge 10\%$ dengan call drop rate tetap aman $< 0.8\%$.
3. **Fase 2 (Skala Regional Jawa-Bali):**
   - 5.000 menara makro padat trafik. Swadana (*self-funding*) dari penghematan tagihan listrik PLN.
4. **Fase 3 (Skala Enterprise Nasional):**
   - 10.000+ menara seluruh Indonesia mendukung target Telkomsel Net-Zero Transition 2035.
