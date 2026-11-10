# Rencana Penguatan Keamanan Siber (Zero-Trust & Auto-Defense Hardening) — ImpactGrid

Rencana ini menghadirkan arsitektur pertahanan berlapis (*Defense-in-Depth*) pada sisi backend dan API untuk melindungi infrastruktur telemetri energi RAN Telkomsel, eksekusi kebijakan O-RAN, serta penyelesaian finansial SAP S/4HANA dari ancaman peretasan, manipulasi payload, injeksi berbahaya, dan serangan DDoS, dilengkapi mekanisme penguncian sesi otomatis (*auto-lockout*) serta indikator status keamanan ringkas pada antarmuka utama.

## User Review & Critical Decisions

> [!IMPORTANT]
> Seluruh prioritas keamanan yang Anda konfirmasi pada tahap klarifikasi telah diintegrasikan ke dalam cetak biru arsitektur ini. Tinjau pendekatan teknis di bawah sebelum eksekusi dimulai.

- **Keputusan Terkonfirmasi 1 — Empat Lapisan Pertahanan Utama**:
  1. **Zero-Trust API, JWT/HMAC Ketat & Proteksi Endpoint**: Verifikasi token autentikasi, validasi hak akses berbasis peran (*Role-Based Access Control* / RBAC), dan tanda tangan kriptografis HMAC-SHA256 beserta *timestamp/nonce anti-replay* pada seluruh endpoint mutasi kritis.
  2. **Deteksi Intrusi Real-Time (IDS) & Karantina Otomatis**: Mesin inspeksi berbasis aturan (*rule-based WAF/IDS*) yang mendeteksi pola serangan (SQL/NoSQL injection, XSS, *path traversal*, manipulasi parameter fisika Kirchhoff, dan *credential stuffing*) serta langsung mengarantina permintaan mencurigakan.
  3. **Enkripsi Payload End-to-End & Rantai Audit Anti-Tamper**: Kanonikalisasi JSON deterministik dengan rantai *hash* Merkle/SHA-256 berkesinambungan (*append-only*) yang memvalidasi keutuhan histori operasional setiap kali state diakses atau dimodifikasi.
  4. **Mitigasi DDoS, Rate-Limiting Adaptif & Sanitasi Input**: Pembatasan laju bertingkat (*tiered rate-limiting*) per rute (ketat pada autentikasi, AI, dan mutasi kebijakan) disertai daftar blokir penalti otomatis (*penalty box*) dan pembersihan skema payload secara mendalam.
- **Keputusan Terkonfirmasi 2 — Kunci Sesi Otomatis (*Auto-Lockout*)**: Sesi operator dan alamat asal akan dikunci secara otomatis apabila terdeteksi pelanggaran berulang (misalnya kegagalan OTP/token berturut-turut, percobaan eskalasi hak akses RBAC, atau pengiriman payload yang terindikasi *tampering*). Pemulihan sesi memerlukan re-autentikasi SSO dengan kode MFA valid.
- **Keputusan Terkonfirmasi 3 — Visibilitas Ringkas Berfokus Backend**: Alih-alih menambahkan tab baru yang membebani navigasi, fokus utama ditempatkan pada penguatan mesin backend/API, sementara antarmuka menampilkan **indikator status keamanan ringkas** pada bilah atas (beserta *popover* ringkas untuk melihat metrik blokir IDS, status integritas rantai SHA-256, status *auto-lockout*, dan tombol uji ketahanan/*self-test*).

---

## 1. Overview & Core Concept

- **Apa yang Dilakukan**: Mengubah lapisan komunikasi dan penyimpanan operasional ImpactGrid menjadi lingkungan **Zero-Trust** yang secara aktif memvalidasi identitas, izin peran, keutuhan kriptografis, dan kebersihan input pada setiap transaksi API, sekaligus mengunci sesi secara otomatis ketika anomali perilaku atau serangan terdeteksi.
- **Target Pengguna / Persona**:
  - **CISO & Auditor Internal (ISO 27001 / BSSN / PP 71/2019)**: Membutuhkan kepastian bahwa tidak ada perintah O-RAN atau jurnal akuntansi SAP yang dapat dipalsukan atau dieksekusi tanpa otorisasi sah.
  - **VP Network Operations & NOC Incident Commander**: Membutuhkan jaminan ketersediaan sistem (*high availability*) terhadap banjir trafik (DDoS) tanpa mengorbankan kecepatan respons *fail-safe* 112 (<28ms).
- **Nilai Utama**: Mencegah pengambilalihan kendali menara BTS, memblokir injeksi data telemetri palsu (*phantom savings manipulation*), menjaga keabsahan hukum dokumen Berita Acara (BA-RE), dan memberikan visibilitas instan atas postur pertahanan sistem tanpa memperumit alur kerja harian.

---

## 2. User Experience & Visual Design

- **Alur Pengguna Utama (Key User Flows)**:
  1. **Operasi Normal Terlindungi (Zero-Trust Transparent Flow)**: Saat operator terautentikasi mengeksekusi aksi (seperti menerapkan kebijakan O-RAN, memperbarui site BTS, menandatangani BA-RE, atau mem-posting jurnal SAP), klien secara otomatis menyertakan header keamanan (`Authorization` Bearer token, `X-ImpactGrid-Timestamp`, `X-ImpactGrid-Nonce`, dan `X-ImpactGrid-HMAC-SHA256`). Backend memverifikasi tanda tangan dan hak akses RBAC secara instan.
  2. **Indikator Postur Keamanan Ringkas (Compact Security Status Badge)**: Pada bilah status atas (*Navbar*), terdapat indikator keamanan ringkas yang menampilkan postur aktual (`ZERO-TRUST AKTIF · INTEGRITAS TERVERIFIKASI` atau `PERINGATAN IDS` / `SESI TERKUNCI`). Mengklik indikator ini membuka panel *popover* ringkas berisi:
     - Status rantai audit SHA-256 (*Chain Integrity Verified*).
     - Statistik perlindungan real-time (jumlah permintaan terverifikasi HMAC, serangan/injeksi yang dikarantina IDS, dan status *rate-limiter*).
     - Aksi cepat **Verifikasi Rantai Audit & Uji Pertahanan** untuk membuktikan bahwa mesin IDS dan *auto-lockout* bekerja secara nyata.
  3. **Alur Kunci Sesi Otomatis (*Auto-Lockout* & Pemulihan)**: Jika terdeteksi aktivitas berbahaya atau 3 kali pelanggaran keamanan berturut-turut (misalnya manipulasi *hash* payload, percobaan injeksi, atau pelanggaran batas otorisasi peran), backend segera mencabut sesi aktif dan mengaktifkan status `LOCKED_OUT`. Antarmuka menampilkan peringatan penguncian sesi dan mengarahkan operator ke modal **Telkomsel IAM SSO** untuk melakukan verifikasi ulang MFA sebelum dapat melanjutkan eksekusi perintah kritis.

- **Identitas Visual & Tema**:
  - *Aesthetic Direction*: **Precision Enterprise Utility** — bersih, berwibawa, dan berorientasi data tanpa ornamen berlebihan (*anti-slop*), selaras dengan bahasa desain korporat Telkomsel yang sudah ada pada platform.
  - *Color Palette & Mood*: Mempertahankan distribusi warna 60-30-10 pada mode Terang (`#FFFFFF` / `#F8FAFC`) dan Gelap (`#0B1324` / `#060B14`) dengan aksen utama Telkomsel Crimson (`#ED0226`). Status keamanan menggunakan warna semantik terukur yang selalu dipasangkan dengan label teks eksplisit:
    - **Nominal / Terlindungi**: Emerald (`#16A34A` / `text-emerald-600 dark:text-emerald-400`) — `ZERO-TRUST AKTIF`.
    - **Anomali Terkarantina / Peringatan**: Amber (`#D97706` / `text-amber-600 dark:text-amber-400`) — `INTRUSI DIKARANTINA`.
    - **Sesi Terkunci / Pelanggaran Kritis**: Crimson (`#DC2626` / `text-red-600 dark:text-red-400`) — `SESI DIKUNCI OTOMATIS`.
  - *Typography & Hierarchy*: Menggunakan tipografi antarmuka yang bersih untuk label kontrol dan wajib menerapkan angka tabular monospasi (`font-mono tabular-nums`) pada seluruh pencatat waktu (*timestamp*), *digest* SHA-256/HMAC, penghitung blokir IDS, dan sisa waktu *cooldown* kunci sesi.
  - *Component Styling & Layout*: Menggunakan permukaan datar (*single-elevation depth*) dengan garis batas halus `1px` (`border-slate-200 dark:border-slate-800`), tanpa kartu bersarang berlebihan atau garis aksen kiri tebal.
- **Umpan Balik Interaktif & Gerak**: Respons interaksi di bawah `150ms`, transisi status *lockout* dan *unlock* berlangsung instan di DOM tanpa jeda animasi yang menghalangi tindakan pemulihan.

---

## 3. Key Product Decisions & Trade-Offs

- **Keputusan 1: Penegakan Zero-Trust & RBAC dengan Grace-Mode Kontekstual untuk Read-Only vs Mutasi Kritis**
  - *Pendekatan Terpilih*: Endpoint pembacaan telemetri dan kesiapan infrastruktur (`/healthz`, `/readyz`, `/api/v1/operations/state`) tetap dapat diakses dengan proteksi *rate-limiting* dan sanitasi, sedangkan endpoint mutasi kritis (`/api/v1/oran/policy`, `/api/v1/sap/post-voucher`, `/api/v1/bare/sign`, `/api/v1/sites`, `/api/v1/sla-thresholds`, `/api/v1/oss/cli-execute`) melewati lapisan verifikasi Zero-Trust (validasi sesi/peran RBAC, pemeriksaan *nonce anti-replay*, verifikasi HMAC, dan pemindaian IDS).
  - *Mengapa*: Memastikan pemantauan layar eksekutif tidak terputus saat inisialisasi awal, namun menjamin bahwa setiap perubahan konfigurasi jaringan dan transaksi finansial terlindungi secara kriptografis.
  - *Alternatif yang Dipertimbangkan*: Memblokir seluruh endpoint pembacaan sebelum login penuh — ditolak karena akan mengganggu pemuatan awal dashboard dan alur demonstrasi cepat.

- **Keputusan 2: Mesin Deteksi Intrusi (IDS) & Sanitasi Terpadu di Dalam Proses Backend**
  - *Pendekatan Terpilih*: Membangun modul keamanan mandiri di sisi server yang menginspeksi seluruh `req.body`, `req.query`, dan `req.params` secara rekursif terhadap pola injeksi (XSS, SQLi/NoSQLi, *command injection*, *prototype pollution* `__proto__`/`constructor`) serta memelihara skor ancaman (*threat score*) per klien/sesi untuk memicu *auto-lockout* secara deterministik.
  - *Mengapa*: Memberikan perlindungan instan berlatensi sub-milidetik (`<1ms`) tanpa ketergantungan pada layanan WAF eksternal yang memerlukan konfigurasi jaringan tambahan.
  - *Alternatif yang Dipertimbangkan*: Menggunakan pustaka pihak ketiga yang berat — ditolak demi menjaga kecepatan *startup*, portabilitas kontainer Telkom DC, dan kontrol penuh atas aturan spesifik telekomunikasi (seperti batas fisik hukum Kirchhoff dan parameter 3GPP).

- **Keputusan 3: Rantai Audit SHA-256 Berkesinambungan (*Hash-Chained Ledger*)**
  - *Pendekatan Terpilih*: Setiap entri log audit menyimpan `prevHash` dari entri sebelumnya dan menghitung `currentHash = SHA256(prevHash + canonicalJson(entry))`, ditambah pemeriksaan integritas rantai penuh (`verifyAuditChainIntegrity`) yang diekspos melalui API status keamanan.
  - *Mengapa*: Jika peretas mencoba memodifikasi file database JSON secara langsung di penyimpanan, rantai *hash* akan putus dan langsung terdeteksi oleh indikator keamanan.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

### Architecture & Component Diagram

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER (React SPA)                              │
│                                                                              │
│  ┌───────────────────────────────┐      ┌─────────────────────────────────┐  │
│  │ Navbar Compact Security Badge │◄────►│ Security Status Popover         │  │
│  │ (Nominal / Quarantine / Lock) │      │ (Chain Verify, IDS Stats, Test) │  │
│  └──────────────┬────────────────┘      └────────────────┬────────────────┘  │
│                 │                                        │                   │
│                 ▼                                        ▼                   │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ Operational Backend Hook & Zero-Trust Request Signer                   │  │
│  │ • Attaches Bearer JWT, X-ImpactGrid-Timestamp, Nonce & Client SHA-256  │  │
│  │ • Intercepts 401/403/423 (Auto-Lockout) -> Triggers SSO Re-Auth Modal  │  │
│  └──────────────┬─────────────────────────────────────────────────────────┘  │
└─────────────────┼────────────────────────────────────────────────────────────┘
                  │ HTTPS / JSON + Security Headers
                  ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                   EXPRESS BACKEND SECURITY PIPELINE                          │
│                                                                              │
│  [1. Hardened Security Headers & Strict CORS]                                │
│      • CSP, HSTS, X-Frame-Options, X-Content-Type-Options,Permissions-Policy │
│                                  │                                           │
│                                  ▼                                           │
│  [2. Adaptive Tiered Rate-Limiter & DDoS Penalty Box]                        │
│      • General API (120/m) | Auth & AI (20/m) | Critical Mutations (30/m)    │
│      • Auto-blocks flooding IPs & increments Threat Score                    │
│                                  │                                           │
│                                  ▼                                           │
│  [3. Deep Input Sanitizer & Real-Time IDS / WAF Inspector]                   │
│      • Blocks __proto__/constructor pollution, XSS, SQLi, CLI injection      │
│      • Quarantines malicious payloads & logs SECURITY_INTRUSION_BLOCKED      │
│                                  │                                           │
│                                  ▼                                           │
│  [4. Zero-Trust Session, RBAC, Anti-Replay Nonce & Auto-Lockout Guard]       │
│      • Validates session lockout state (HTTP 423 Locked if threshold met)    │
│      • Verifies RBAC permissions & HMAC/SHA-256 payload integrity            │
│                                  │                                           │
│                                  ▼                                           │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ Operational Store & Anti-Tamper Hash-Chained Audit Ledger              │  │
│  │ • Executes BTS CRUD, O-RAN A1/O1 Policy, FOP, BA-RE, SAP S/4HANA       │  │
│  │ • Computes prevHash -> currentHash SHA-256 chain & verifies integrity  │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Data Model & State

1. **Security Telemetry & Intrusion State (Backend Memory & Persistent Audit)**:
   - `securityPosture`: `'NOMINAL' | 'ELEVATED_QUARANTINE' | 'LOCKED_OUT'`
   - `threatCounters`: Penghitung terstruktur untuk `totalInspectedRequests`, `hmacVerifiedCount`, `intrusionBlockedCount`, `rateLimitTriggeredCount`, `replayBlockedCount`, dan `autoLockoutCount`.
   - `sessionLockoutRegistry`: Peta status penguncian berdasarkan identitas sesi/NIK/klien yang menyimpan `strikeCount` (jumlah pelanggaran), `isLocked` (boolean), `lockedAt`, `lockReason`, dan `unlockRequiresMfa` (boolean).
   - `nonceRegistry`: Penyimpanan *sliding-window* untuk `X-ImpactGrid-Nonce` guna mencegah *replay attack* pada transaksi kritis.
   - `intrusionEvents`: Daftar ringkas insiden yang dikarantina (waktu, jenis ancaman seperti `SQLI_OR_XSS_PAYLOAD`, `HMAC_TAMPER_DETECTED`, `UNAUTHORIZED_RBAC_ESCALATION`, `BRUTE_FORCE_OTP`, endpoint target, dan tindakan mitigasi otomatis).

2. **Anti-Tamper Audit Chain Verification**:
   - Setiap entri pada `auditTrail` di penyimpanan persisten memiliki `id`, `timestamp`, `action`, `actor`, `category`, `detail`, `prevHash`, dan `currentHash`.
   - Fungsi verifikasi rantai menghitung ulang *digest* dari entri paling awal hingga terbaru untuk memastikan tidak ada satupun entri historis yang diubah secara ilegal.

### Interactive Component & State Mapping

- **Indikator & Popover Keamanan Ringkas (`Navbar`)**:
  - Menampilkan status real-time dari endpoint `/api/v1/security/status`.
  - Menyediakan tombol **Verifikasi Integritas Rantai Audit** yang memicu pemeriksaan kriptografis penuh pada seluruh log historis dan menampilkan hasilnya (`TERVERIFIKASI` beserta *root hash* terbaru).
  - Menyediakan tombol **Simulasi Uji Serangan & Auto-Lockout** (untuk keperluan pengujian CISO/Auditor) yang mengirimkan *probe* terisolasi ke endpoint keamanan guna mendemonstrasikan bagaimana IDS mengarantina payload berbahaya dan bagaimana sistem mengaktifkan *auto-lockout* saat batas pelanggaran tercapai.
- **Alur Kunci Sesi Otomatis (`Auto-Lockout`) & Pemulihan MFA (`TelkomselSsoModal`)**:
  - Ketika pengguna atau penguji memicu 3 pelanggaran keamanan berturut-turut (atau menekan uji *auto-lockout*), status sesi berubah menjadi `LOCKED_OUT` (HTTP `423 Locked`).
  - Banner peringatan ringkas muncul pada bilah atas dengan tombol **Buka Kunci via MFA SSO**.
  - Saat pengguna melakukan autentikasi ulang pada modal SSO dengan kode OTP MFA yang sah (6 digit numerik valid), endpoint `/api/v1/auth/sso` mereset `strikeCount`, mencabut status *lockout*, mencatat peristiwa `SECURITY_SESSION_UNLOCKED_MFA` ke rantai audit, dan memulihkan akses operasional.
