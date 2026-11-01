/**
 * Pure Logic Engine for Telkomsel IT Enterprise "MAX Edition" Competitive Capabilities:
 * 1. TMF Open API (TMF628/TMF621), O-RAN A1-P, SAP OData & Kafka Schema Registry Playground
 * 2. National 11-Regional Telkomsel Rollout & Regional Grid Emission / Diesel Hybrid Planner
 * 3. Chaos Engineering, DR Failover (Sentul <-> Surabaya), & Anti-Spoofing Physics Guard
 */

export const TELKOMSEL_API_ENDPOINTS = [
  {
    id: 'tmf628_telemetry',
    method: 'POST',
    path: '/tmf-api/performanceManagement/v4/energyMeasurement',
    standard: 'TM Forum TMF628 v4.1.0 + IEC 62056 DLMS/COSEM',
    targetSystem: 'ImpactGrid ClickHouse Telemetry Hub (Telkom DC Sentul)',
    slaLatencyMs: 38,
    description: 'Ingesti real-time 15-menitan yang menggabungkan kWh Meter PLN AMR, Submeter DC Rectifier 48V Kelas 0.5s, dan counter PRB O-RAN O1.',
    defaultPayload: {
      siteId: 'BDG-DGO-P04',
      idpelPln: '53811049281',
      intervalStart: '2026-10-30T14:00:00+07:00',
      intervalEnd: '2026-10-30T14:15:00+07:00',
      plnAcKwh: 3.48,
      rectifierDcKwh: 3.09,
      ossRadioRfKwh: 2.88,
      prbUtilizationPct: 24.3,
      shelterTempC: 26.8,
      meterClass: '0.5s_KAN_CERTIFIED'
    }
  },
  {
    id: 'oran_a1_policy',
    method: 'POST',
    path: '/oran-smo/a1-p/v2/policytypes/20008/policies/tsel-eco-sleep-04',
    standard: 'O-RAN.WG2.A1AP-v04.00 + 3GPP TS 28.541',
    targetSystem: 'Near-RT RIC & Multi-Vendor O1 Adapter (Ericsson ENM / Huawei NCE / ZTE)',
    slaLatencyMs: 24,
    description: 'Injeksi kebijakan A1 untuk Deep Carrier Sleep (B3/B8) disertai kompensasi RET tilt +1.5° pada BTS tetangga beda vendor.',
    defaultPayload: {
      policyId: 'tsel-eco-sleep-04',
      primaryCellId: 'JKT-SEL-01-S1',
      primaryVendor: 'ERICSSON_ENM',
      sleepMode: 'CARRIER_AND_SYMBOL_SLEEP',
      targetBands: ['B3_1800MHz', 'B8_900MHz'],
      anchorBandKeepAlive: 'B1_2100MHz',
      borderGuardCompensation: {
        enabled: true,
        neighborCellId: 'DPK-MGD-15-S2',
        neighborVendor: 'HUAWEI_IMASTER_NCE',
        retTiltDeltaDeg: 1.5,
        txPowerBoostDb: 1.8
      },
      safetyGuardrail: {
        emergency112ZeroWaitRollbackMs: 28,
        maxTempThresholdC: 32.0,
        deadManSwitchHeartbeatSec: 120
      }
    }
  },
  {
    id: 'tmf621_servicenow',
    method: 'POST',
    path: '/tmf-api/troubleTicket/v4/troubleTicket',
    standard: 'TM Forum TMF621 v4.0 + Telkomsel ITIL v4 ServiceNow Bridge',
    targetSystem: 'Telkomsel ITSM ServiceNow & FOP Mobile e-WO Console',
    slaLatencyMs: 62,
    description: 'Pembuatan tiket lapangan otomatis saat terdeteksi anomali Phantom Power >= 8% lengkap dengan kunci geofence GPS & BLE shelter.',
    defaultPayload: {
      externalId: 'WO-2026-TSEL-MT-00492',
      severity: 'HIGH_FINANCIAL_LEAKAGE',
      ticketType: 'SHELTER_PHANTOM_LOAD_AUDIT',
      siteId: 'BDG-DGO-P04',
      towerCoPartner: 'MITRATEL',
      detectedVariancePct: 10.4,
      estimatedMonthlyLeakageIDR: 3824640,
      geofenceLock: {
        lat: -6.868,
        lng: 107.621,
        maxRadiusMeters: 25,
        bleBeaconUuid: 'TSEL-SHELTER-BLE-BDG04'
      }
    }
  },
  {
    id: 'sap_odata_bapi',
    method: 'POST',
    path: '/sap/opu/odata/sap/ZFI_IMPACTGRID_BAPI_SRV/JournalVoucherSet',
    standard: 'SAP S/4HANA FI-CO OData v4 / RFC BAPI_ACC_DOCUMENT_POST',
    targetSystem: 'SAP S/4HANA Production (Company Code 1000 Telkomsel)',
    slaLatencyMs: 85,
    description: 'Posting jurnal akuntansi otomatis atas penghematan energi O-RAN, bagi hasil 85/15 TowerCo, dan klaim restitusi BA-RE PLN.',
    defaultPayload: {
      companyCode: '1000',
      documentType: 'SA',
      fiscalYear: '2026',
      period: '10',
      referenceBaRe: 'BA-RE/TSEL-NOPS/REG3/X/2026/0894',
      costCenter: 'CC-REG3-NOPS',
      wbsElement: 'WBS-2026-TSEL-RAN-ENERGY-01',
      totalDebitIDR: 2662824640,
      totalCreditIDR: 2662824640,
      isBalanced: true
    }
  },
  {
    id: 'esg_merkle_verify',
    method: 'GET',
    path: '/esg-ledger/v1/merkleProof/BDG-DGO-P04',
    standard: 'POJK No. 51/POJK.03/2017 + IAI PSPK 1 & 2 + ITU-T L.1331',
    targetSystem: 'GreenLedger Immutable SHA-256 Audit Store',
    slaLatencyMs: 19,
    description: 'Verifikasi bukti kriptografis Merkle Tree & isolasi kausal Difference-in-Differences (DiD) untuk auditor eksternal KAP.',
    defaultPayload: {
      siteId: 'BDG-DGO-P04',
      auditPeriod: '2026-10',
      gridEmissionFactorKgCo2PerKwh: 0.87,
      didControlGroupRef: 'BDG-KTL-C05'
    }
  }
];

export const KAFKA_SCHEMA_TOPICS = [
  {
    topic: 'tsel.ran.o1.pm.15m.v2',
    format: 'Apache Avro (Confluent Schema Registry ID #4091)',
    partitions: 24,
    retention: '90 Hari (Hot) + 7 Tahun ClickHouse Cold Archive',
    throughputMsgSec: '18.500 msg/detik (Skala Nasional 43.000 BTS)',
    keyFields: ['site_id', 'cell_id', 'vendor_ems', 'prb_dl_pct', 'tx_power_dbm', 'active_rrc_users', 'emergency_112_flag']
  },
  {
    topic: 'tsel.shelter.iot.dlms.v1',
    format: 'Protobuf v3 (mTLS Edge Gateway Signed)',
    partitions: 12,
    retention: '180 Hari',
    throughputMsgSec: '6.200 msg/detik',
    keyFields: ['site_id', 'idpel_pln', 'ac_pln_kwh', 'dc_rectifier_48v_kwh', 'battery_soc_pct', 'shelter_temp_c', 'hvac_compressor_state']
  },
  {
    topic: 'tsel.ric.xapp.112override.v1',
    format: 'Raw Binary / Ultra-Low-Latency Protobuf',
    partitions: 32,
    retention: '365 Hari (WORM Compliance)',
    throughputMsgSec: 'Event-Driven (< 28ms Zero-Wait Priority)',
    keyFields: ['event_uuid', 'site_id', 'trigger_reason', 'wake_up_latency_ms', 'restored_carriers', 'sha256_chain_hash']
  },
  {
    topic: 'tsel.erp.sap.settlement.v1',
    format: 'JSON Schema Draft-07 (Signed JWS)',
    partitions: 6,
    retention: '10 Tahun (Audit Pajak & Keuangan)',
    throughputMsgSec: 'Batch Bulanan & Real-Time FOP Restitution',
    keyFields: ['ba_re_doc_no', 'sap_doc_no', 'company_code', 'gl_debit_110420', 'gl_credit_510100', 'towerco_share_15pct_rp']
  }
];

export const TELKOMSEL_11_REGIONALS = [
  { id: 'R01', code: 'SUMBAGUT', name: 'Regional 1 — Sumbagut (Medan & Aceh)', macroSites: 3800, gridEmissionFactor: 0.79, dieselSharePct: 12, baseTariffRp: 1520, wbpSharePct: 22 },
  { id: 'R02', code: 'SUMBAGTENG', name: 'Regional 2 — Sumbagteng (Padang & Pekanbaru)', macroSites: 3400, gridEmissionFactor: 0.80, dieselSharePct: 14, baseTariffRp: 1520, wbpSharePct: 21 },
  { id: 'R03', code: 'SUMBAGSEL', name: 'Regional 3 — Sumbagsel (Palembang & Lampung)', macroSites: 3600, gridEmissionFactor: 0.82, dieselSharePct: 10, baseTariffRp: 1500, wbpSharePct: 22 },
  { id: 'R04', code: 'JABOTABEK_INNER', name: 'Regional 4 — DKI Jakarta & Inner Metro', macroSites: 6500, gridEmissionFactor: 0.87, dieselSharePct: 1, baseTariffRp: 1500, wbpSharePct: 28 },
  { id: 'R05', code: 'JABAR', name: 'Regional 5 — Jawa Barat (Bandung & Sekitar)', macroSites: 5400, gridEmissionFactor: 0.87, dieselSharePct: 2, baseTariffRp: 1500, wbpSharePct: 26 },
  { id: 'R06', code: 'JATENG_DIY', name: 'Regional 6 — Jawa Tengah & DIY (Semarang & Jogja)', macroSites: 4900, gridEmissionFactor: 0.87, dieselSharePct: 2, baseTariffRp: 1500, wbpSharePct: 24 },
  { id: 'R07', code: 'JATIM', name: 'Regional 7 — Jawa Timur (Surabaya & Malang)', macroSites: 5200, gridEmissionFactor: 0.87, dieselSharePct: 3, baseTariffRp: 1500, wbpSharePct: 25 },
  { id: 'R08', code: 'BALI_NUSRA', name: 'Regional 8 — Bali & Nusa Tenggara', macroSites: 2800, gridEmissionFactor: 0.85, dieselSharePct: 18, baseTariffRp: 1580, wbpSharePct: 24 },
  { id: 'R09', code: 'KALIMANTAN', name: 'Regional 9 — Kalimantan (Balikpapan & Banjarmasin)', macroSites: 3100, gridEmissionFactor: 0.86, dieselSharePct: 22, baseTariffRp: 1620, wbpSharePct: 22 },
  { id: 'R10', code: 'SULAWESI', name: 'Regional 10 — Sulawesi (Makassar & Manado)', macroSites: 2900, gridEmissionFactor: 0.81, dieselSharePct: 20, baseTariffRp: 1600, wbpSharePct: 22 },
  { id: 'R11', code: 'MALUKU_PAPUA', name: 'Regional 11 — Maluku & Papua (3T Prioritas Inklusi)', macroSites: 1400, gridEmissionFactor: 1.08, dieselSharePct: 58, baseTariffRp: 1850, wbpSharePct: 20 }
];

/**
 * Simulates executing an Enterprise API request through Telkomsel Apigee / mTLS Gateway.
 */
export function executeTelkomselApiSimulation(endpointId = 'tmf628_telemetry', customPayloadObj = null) {
  const endpoint = TELKOMSEL_API_ENDPOINTS.find((e) => e.id === endpointId) || TELKOMSEL_API_ENDPOINTS[0];
  const payload = customPayloadObj && typeof customPayloadObj === 'object' ? customPayloadObj : endpoint.defaultPayload;

  // Deterministic cryptographic digest for response verification
  const payloadStr = JSON.stringify(payload);
  let hashAcc = 2166136261;
  for (let i = 0; i < payloadStr.length; i++) {
    hashAcc ^= payloadStr.charCodeAt(i);
    hashAcc = Math.imul(hashAcc, 16777619);
  }
  const hexDigest = `8f4e2a${Math.abs(hashAcc).toString(16).padStart(8, '0')}91c03b77d2e415809a6c31f4b820e1d5a97c34`;

  const curlSnippet = [
    `curl -X ${endpoint.method} "https://api-internal.telkomsel.co.id${endpoint.path}" \\`,
    `  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6InRzZWwtc25vYy0yMDI2In0..." \\`,
    `  -H "X-Telkomsel-Apigee-Env: sentul-prod-mTLS" \\`,
    `  -H "X-ImpactGrid-SHA256: ${hexDigest}" \\`,
    `  -H "Content-Type: application/json" \\`,
    endpoint.method !== 'GET' ? `  -d '${JSON.stringify(payload)}'` : ''
  ]
    .filter(Boolean)
    .join('\n');

  return {
    endpointId: endpoint.id,
    httpStatus: 200,
    httpStatusText: '200 OK (Telkom DC Sentul Primary Gateway)',
    latencyMs: endpoint.slaLatencyMs,
    standard: endpoint.standard,
    targetSystem: endpoint.targetSystem,
    requestPayload: payload,
    responseHeaders: {
      'x-tsel-apigee-trace-id': `tsel-snoc-${endpoint.id}-${Math.abs(hashAcc % 90000) + 10000}`,
      'x-oran-o1-mtls-verified': 'true (CN=smo-sentul.telkomsel.co.id)',
      'x-data-residency': 'ID-JKT-SENTUL-DC (PP 71/2019 Compliant)',
      'x-merkle-leaf-sha256': hexDigest
    },
    responseBody: {
      ack: 'COMMITTED',
      timestampWib: '2026-10-30T14:15:02+07:00',
      targetSystem: endpoint.targetSystem,
      merkleLeafHash: hexDigest,
      verificationNote:
        endpoint.id === 'tmf628_telemetry'
          ? 'Triangulasi 3-arah tersimpan di ClickHouse. Deviasi < 8% (Nominal).'
          : endpoint.id === 'oran_a1_policy'
            ? 'Kebijakan A1-P aktif. Kompensasi RET +1.5° BTS tetangga dikonfirmasi sebelum carrier sleep.'
            : endpoint.id === 'tmf621_servicenow'
              ? 'Tiket e-WO ServiceNow diterbitkan ke aplikasi mobile FOP lengkap dengan kunci geofence BLE.'
              : endpoint.id === 'sap_odata_bapi'
                ? 'Dokumen jurnal SAP FI-CO berhasil diposting seimbang (Debit = Kredit).'
                : 'Bukti Merkle Tree & DiD terverifikasi sah untuk audit POJK 51/2017.'
    },
    curlSnippet
  };
}

/**
 * Computes the National 11-Regional Telkomsel Rollout & Financial/ESG Master Plan.
 */
export function calculateNationalRegionalRollout({
  deploymentCoveragePct = 100,
  includeBessInRural = true
} = {}) {
  const safeCoverageRatio = Math.max(10, Math.min(100, Number(deploymentCoveragePct) || 100)) / 100;

  const regionalBreakdown = TELKOMSEL_11_REGIONALS.map((reg) => {
    const activeSites = Math.round(reg.macroSites * safeCoverageRatio);
    // Baseline daily kWh per macro site (~132 kWh/day)
    const annualBaselineMwh = Math.round((activeSites * 132 * 365) / 1000);
    // Base efficiency from O-RAN Carrier Sleep + Dynamic HVAC 26°C is ~15.2%, boosted in high-diesel regions if BESS hybrid is enabled
    const regionalEfficiencyPct = Number(
      (14.8 + (reg.wbpSharePct - 20) * 0.25 + (includeBessInRural && reg.dieselSharePct >= 15 ? 3.4 : 0)).toFixed(1)
    );
    const annualSavedMwh = Math.round(annualBaselineMwh * (regionalEfficiencyPct / 100));

    // Blended effective cost per kWh (PLN + Diesel share for 3T/Non-Jamali)
    const blendedTariffRp = Math.round(
      reg.baseTariffRp * (1 - reg.dieselSharePct / 100) + 5200 * (reg.dieselSharePct / 100)
    );
    const grossAnnualSavingsRp = annualSavedMwh * 1000 * blendedTariffRp;
    const telkomselNet85SavingsRp = Math.round(grossAnnualSavingsRp * 0.85);
    const towerCoShare15Rp = grossAnnualSavingsRp - telkomselNet85SavingsRp;
    const scope2AbatedTons = Math.round(annualSavedMwh * reg.gridEmissionFactor);

    return {
      ...reg,
      activeSites,
      annualBaselineMwh,
      regionalEfficiencyPct,
      annualSavedMwh,
      blendedTariffRp,
      grossAnnualSavingsRp,
      telkomselNet85SavingsRp,
      towerCoShare15Rp,
      scope2AbatedTons
    };
  });

  const totalActiveSites = regionalBreakdown.reduce((s, r) => s + r.activeSites, 0);
  const totalSavedMwh = regionalBreakdown.reduce((s, r) => s + r.annualSavedMwh, 0);
  const totalGrossSavingsRp = regionalBreakdown.reduce((s, r) => s + r.grossAnnualSavingsRp, 0);
  const totalTelkomselNet85Rp = regionalBreakdown.reduce((s, r) => s + r.telkomselNet85SavingsRp, 0);
  const totalTowerCoShare15Rp = regionalBreakdown.reduce((s, r) => s + r.towerCoShare15Rp, 0);
  const totalScope2AbatedTons = regionalBreakdown.reduce((s, r) => s + r.scope2AbatedTons, 0);

  return {
    deploymentCoveragePct: Math.round(safeCoverageRatio * 100),
    includeBessInRural,
    regionalCount: regionalBreakdown.length,
    totalActiveSites,
    totalSavedMwh,
    totalGrossSavingsRp,
    totalTelkomselNet85Rp,
    totalTowerCoShare15Rp,
    totalScope2AbatedTons,
    regionalBreakdown
  };
}

/**
 * Simulates Chaos Engineering & Cyber-Physical Resiliency Scenarios:
 * 1. 'dc_failover': Telkom DC Sentul Primary Outage -> Surabaya DR Failover (<1.8s)
 * 2. 'spoofing_attack': Telemetry Spoofing / Fake Greenwashing Injection -> Blocked by Kirchhoff Physics & Merkle Hash
 * 3. 'backhaul_severed_112': Backhaul Fiber Cut + 112 Surge -> Edge xApp 120s Dead-Man Switch Autonomous Recovery
 */
export function simulateChaosResiliencyScenario(scenarioId = 'dc_failover') {
  const scenarios = {
    dc_failover: {
      scenarioId: 'dc_failover',
      title: 'Skenario 1: Pemadaman Total Telkom DC Sentul (Primary Data Center Outage)',
      injectedFault: 'Memutus koneksi jaringan core & power feed pada kluster Kubernetes Utama di Telkom DC Sentul.',
      detectionLatencyMs: 420,
      failoverDurationMs: 1780,
      rpoSeconds: 0,
      rtoSeconds: 1.78,
      activeDataCenter: 'Telkom DC Surabaya (Active-Active DR Site)',
      ranImpact: 'ZERO_RAN_IMPACT (0.00% Call Drop • xApp Lokal Tetap Berjalan Mandiri)',
      defenseMechanism: 'Istio Multi-Cluster mTLS Mesh + Patroni PostgreSQL/ClickHouse Synchronous Replication + MirrorMaker2 Kafka.',
      verdict: ' LULUS UJI KETAHANAN TIER-III (RTO 1,78 Detik < Batas SLA 5 Detik • Zero Data Loss)'
    },
    spoofing_attack: {
      scenarioId: 'spoofing_attack',
      title: 'Skenario 2: Serangan Injeksi Telemetri Palsu (Anti-Greenwashing & Anti-Spoofing)',
      injectedFault: 'Pihak eksternal mencoba menyuntikkan klaim palsu penghematan -45% kWh pada site BDG-DGO-P04 tanpa penurunan arus DC.',
      detectionLatencyMs: 12,
      failoverDurationMs: 12,
      rpoSeconds: 0,
      rtoSeconds: 0.012,
      activeDataCenter: 'Telkom DC Sentul (Security Guardrail Quarantine)',
      ranImpact: 'PAKET PALSU DIKARANTINA (Buku Besar ESG & Jurnal SAP S/4HANA 100% Terlindungi)',
      defenseMechanism: 'Validasi Hukum Fisika Kirchhoff (AC PLN vs DC 48V vs RF PRB) + Verifikasi Signature mTLS + Rantai Hash Merkle SHA-256.',
      verdict: 'LULUS UJI CISO & AUDITOR KAP (100% Paket Manipulasi Ditolak Sebelum Masuk Database)'
    },
    backhaul_severed_112: {
      scenarioId: 'backhaul_severed_112',
      title: 'Skenario 3: Putus Kabel FO Backhaul + Panggilan Darurat 112 Massal',
      injectedFault: 'Koneksi fiber optik antara BTS shelter dan SMO Sentul terputus total saat 3 carrier sedang dalam mode Eco-Sleep.',
      detectionLatencyMs: 28,
      failoverDurationMs: 28,
      rpoSeconds: 0,
      rtoSeconds: 0.028,
      activeDataCenter: 'Autonomous Edge xApp Failsafe (On-Site Baseband Unit)',
      ranImpact: '100% CARRIER BANGUN OTOMATIS LOKAL (Panggilan 112 Tersambung Tanpa Menunggu Server Pusat)',
      defenseMechanism: 'Hardware Watchdog Timer 120s (Dead-Man Switch) + Interrupt Prioritas RRC Emergency 112 < 28ms langsung di BBU lokal.',
      verdict: 'LULUS UJI KESELAMATAN PUBLIK ITU-T E.106 (Zero Dependency pada Koneksi Cloud/Backhaul)'
    }
  };

  return scenarios[scenarioId] || scenarios.dc_failover;
}
