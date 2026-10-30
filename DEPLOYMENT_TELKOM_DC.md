# Panduan Deployment Enterprise Telkom Data Center (Sentul & Surabaya)
## ImpactGrid RAN Energy Operations Suite — PT Telekomunikasi Selular (Telkomsel)

Dokumen ini adalah prosedur operasional standar (SOP) deployment sistem **ImpactGrid** ke infrastruktur privat Telkomsel (Telkom Cloud Sentul sebagai Primary Data Center dan Telkom Cloud Surabaya sebagai Disaster Recovery Center), mematuhi regulasi kedaulatan data Republik Indonesia (**PP No. 71/2019** dan **UU No. 27/2022 tentang Pelindungan Data Pribadi**).

---

## 1. Arsitektur Topologi & Kedaulatan Data

```
               [ Internet / External Traffic ]
                              │ (TLS 1.3 / WAF Cloud Armor)
                              ▼
            [ Telkomsel Edge Envoy / Ingress Gateway ]
                              │
               ┌──────────────┴──────────────┐
               ▼                             ▼
   [ Data Center Sentul ]         [ Data Center Surabaya ]
   (Primary DC - Active)          (Disaster Recovery - Active)
   ├── K8s Cluster (3-12 Pods)    ├── K8s Cluster (3-12 Pods)
   ├── Istio mTLS 128-bit         ├── Istio mTLS 128-bit
   ├── TimescaleDB Primary        ├── TimescaleDB Replica (<1m RPO)
   └── Apache Kafka Ingest        └── Apache Kafka MirrorMaker
```

* **Data Residency:** 100% data telemetri, kontrak sewa TowerCo, dan log audit tersimpan di dalam wilayah Republik Indonesia.
* **Tingkat Ketersediaan (High Availability):** Target SLA **99.99%** dengan RTO &lt; 15 menit dan RPO &lt; 1 menit.
* **Enkripsi:** TLS 1.3 eksternal, mTLS internal antar-pod (Istio Service Mesh), AES-256 at-rest untuk TimescaleDB.

---

## 2. Persyaratan Sistem & Dependensi

* **Cluster Kubernetes:** v1.28+ (Telkom Cloud Private / Tanzu / OpenShift / GKE On-Prem)
* **Ingress Controller:** Istio Ingress Gateway / Envoy dengan sertifikat TLS Telkomsel CA
* **Container Runtime:** Containerd v1.7+
* **StorageClass:** `telkom-dc-fast-nvme` (untuk TimescaleDB persistence)
* **Koneksi Jaringan Telkomsel:**
  * O-RAN Near-RT / Non-RT RIC via O1 / A1 Interface (Port 8443)
  * ServiceNow ITSM Table API (`https://telkomsel.service-now.com/api/now/table/incident`)
  * Netcool Omnibus (Port 443 / TM Forum TMF642)
  * Prometheus NOC Scraping (Port 3001/9090)

---

## 3. Langkah Deployment Kubernetes (Sentul & Surabaya)

### Langkah 3.1: Konfigurasi Namespace & Secret
```bash
# 1. Masuk ke konteks cluster Telkom DC Sentul
kubectl config use-context telkom-dc-sentul-admin

# 2. Buat secret kredensial aman (disinkronkan dari HashiCorp Vault)
kubectl create namespace impactgrid-telecom --dry-run=client -o yaml | kubectl apply -f -
kubectl create secret generic impactgrid-secrets \
  --namespace=impactgrid-telecom \
  --from-literal=TELKOMSEL_IAM_CLIENT_ID="tsel-iam-impactgrid-prod" \
  --from-literal=SERVICENOW_BEARER_TOKEN="vault:secret/data/telkomsel/servicenow#token" \
  --from-literal=DATABASE_URL="postgres://impactgrid:vault@timescaledb-ha.internal:5432/ran_energy"
```

### Langkah 3.2: Terapkan Manifest Produksi
```bash
# 3. Terapkan manifest arsitektur resmi
kubectl apply -f impactgrid-tsel-dc-k8s.yaml

# 4. Verifikasi status deployment dan pod HPA
kubectl get pods -n impactgrid-telecom -o wide
kubectl get hpa -n impactgrid-telecom
```

### Langkah 3.3: Uji Pemeriksaan Kesehatan (Health Checks)
```bash
# Liveness probe (HTTP 200)
curl -i https://impactgrid.internal.telkomsel.co.id/healthz

# Readiness probe & status DC Sentul/Surabaya
curl -i https://impactgrid.internal.telkomsel.co.id/readyz

# Prometheus scrape metrics
curl -s https://impactgrid.internal.telkomsel.co.id/metrics | grep impactgrid_
```

---

## 4. Langkah Pengujian Lokal / Edge Sandbox (Docker Compose)

Untuk pengujian cepat pada server gateway NOC regional atau workstation engineer:

```bash
# 1. Salin konfigurasi environment
git clone <repo-impactgrid>
cd impactgrid-prototype

# 2. Build dan jalankan seluruh container
docker compose up -d --build

# 3. Pantau log real-time
docker compose logs -f impactgrid-core

# 4. Akses Dashboard & Prometheus
# - ImpactGrid Core: http://localhost:3001
# - Prometheus GUI: http://localhost:9090
```

---

## 5. Ingest Telemetri REST API (O-RAN EdgeX / IoT Submetering)

Contoh pengiriman batch telemetri energi BTS dari gateway EdgeX:

```bash
curl -X POST "http://localhost:3001/api/v1/telemetry/ingest" \
  -H "Content-Type: application/json" \
  -d '{
    "batch_id": "BATCH-TSEL-BDG-20261030-01",
    "source": "TELKOMSEL_EDGEX_GW_WEST_JAVA",
    "records": [
      {
        "site_id": "BDG-DGO-P04",
        "pln_kwh": 48.2,
        "rectifier_dc_kwh": 41.5,
        "smart_meter_kwh": 41.2,
        "temp_celsius": 38.4,
        "power_factor": 0.94
      }
    ]
  }'
```

**Respon API:**
```json
{
  "success": true,
  "batch_id": "BATCH-TSEL-BDG-20261030-01",
  "records_processed": 1,
  "anomalies_count": 2,
  "audit_hash": "a1f9e8...",
  "anomalies": [
    {
      "site_id": "BDG-DGO-P04",
      "type": "PHANTOM_POWER_DISCREPANCY",
      "severity": "HIGH",
      "recommended_action": "DISPATCH_E_WO_SERVICENOW"
    },
    {
      "site_id": "BDG-DGO-P04",
      "type": "SHELTER_HEAT_DISSIPATION",
      "severity": "CRITICAL",
      "recommended_action": "DISPATCH_E_WO_SERVICENOW"
    }
  ]
}
```

---

## 6. Prosedur Eskalasi Insiden & Audit

1. **Tiket Gangguan Otomatis:** Setiap anomali terdeteksi langsung diinjeksi ke ServiceNow ITIL (`INC-2026-TSEL-XXXX`) dengan CMDB CI BTS Shelter dan notifikasi SMS/WhatsApp FOP Mitratel.
2. **Kepatuhan Audit:** Hash SHA-256 dicatat pada tabel audit ledger yang tidak dapat diubah (append-only) untuk verifikasi laporan kepatuhan POJK 51/2017 dan GHG Protocol Scope 2.
3. **Emergency Contact:** Telkomsel NOC Tier 2 (Extension: 8810 / Email: `noc.energy@telkomsel.co.id`).
