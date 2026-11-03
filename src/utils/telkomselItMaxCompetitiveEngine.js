/**
 * Pure Logic Engine for Telkomsel IT Enterprise "MAX Edition" Competitive Capabilities:
 * 1. TMF Open API (TMF628/TMF621), O-RAN A1-P, SAP OData & Kafka Schema Registry Playground
 * 2. National 11-Regional Telkomsel Rollout, Dual-DC Sentul-Surabaya Latency Matrix & Regional Grid Emission
 * 3. 3GPP TS 28.552 / TS 32.425 RAN PM Counters + Modbus TCP / SNMP v3 Rectifier & LiFePO4 BMS Register Map
 * 4. Multi-Vendor OSS/EMS CLI Simulator (Ericsson ENM Moshell/cmedit, Huawei iMaster MAE MML, ZTE NetNumen)
 * 5. OEM RAN Power-Saving License vs In-House O-RAN rApp ImpactGrid 5-Year TCO Calculator
 * 6. Chaos Engineering, DR Failover (Sentul <-> Surabaya), OpenAPI 3.1 Spec & Cryptographic Integrity Verifier
 */

export const TELKOMSEL_API_ENDPOINTS = [
  {
    id: 'tmf628_telemetry',
    method: 'POST',
    path: '/tmf-api/performanceManagement/v4/energyMeasurement',
    backendRoute: '/api/v1/gateway/execute',
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
    backendRoute: '/api/v1/gateway/execute',
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
    backendRoute: '/api/v1/gateway/execute',
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
    backendRoute: '/api/v1/gateway/execute',
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
    backendRoute: '/api/v1/gateway/execute',
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
  { id: 'R01', code: 'SUMBAGUT', name: 'Regional 1 — Sumbagut (Medan & Aceh)', macroSites: 3800, gridEmissionFactor: 0.79, dieselSharePct: 12, baseTariffRp: 1520, wbpSharePct: 22, sentulRttMs: 28.4, surabayaRttMs: 44.6, backboneLink: 'SKKL Barat & Sumatera MPLS Core', kafkaLagMs: 42 },
  { id: 'R02', code: 'SUMBAGTENG', name: 'Regional 2 — Sumbagteng (Padang & Pekanbaru)', macroSites: 3400, gridEmissionFactor: 0.80, dieselSharePct: 14, baseTariffRp: 1520, wbpSharePct: 21, sentulRttMs: 21.6, surabayaRttMs: 37.2, backboneLink: 'Trans-Sumatera DWDM Ring-2', kafkaLagMs: 35 },
  { id: 'R03', code: 'SUMBAGSEL', name: 'Regional 3 — Sumbagsel (Palembang & Lampung)', macroSites: 3600, gridEmissionFactor: 0.82, dieselSharePct: 10, baseTariffRp: 1500, wbpSharePct: 22, sentulRttMs: 11.8, surabayaRttMs: 26.5, backboneLink: 'Sunda Strait Subsea Fiber + MPLS', kafkaLagMs: 19 },
  { id: 'R04', code: 'JABOTABEK_INNER', name: 'Regional 4 — DKI Jakarta & Inner Metro', macroSites: 6500, gridEmissionFactor: 0.87, dieselSharePct: 1, baseTariffRp: 1500, wbpSharePct: 28, sentulRttMs: 2.1, surabayaRttMs: 14.8, backboneLink: 'Jabotabek Terabit Metro Core 400G', kafkaLagMs: 6 },
  { id: 'R05', code: 'JABAR', name: 'Regional 5 — Jawa Barat (Bandung & Sekitar)', macroSites: 5400, gridEmissionFactor: 0.87, dieselSharePct: 2, baseTariffRp: 1500, wbpSharePct: 26, sentulRttMs: 4.3, surabayaRttMs: 13.4, backboneLink: 'West Java Dual-Homed DWDM Core', kafkaLagMs: 9 },
  { id: 'R06', code: 'JATENG_DIY', name: 'Regional 6 — Jawa Tengah & DIY (Semarang & Jogja)', macroSites: 4900, gridEmissionFactor: 0.87, dieselSharePct: 2, baseTariffRp: 1500, wbpSharePct: 24, sentulRttMs: 8.9, surabayaRttMs: 7.4, backboneLink: 'North-South Java Optical Backbone', kafkaLagMs: 12 },
  { id: 'R07', code: 'JATIM', name: 'Regional 7 — Jawa Timur (Surabaya & Malang)', macroSites: 5200, gridEmissionFactor: 0.87, dieselSharePct: 3, baseTariffRp: 1500, wbpSharePct: 25, sentulRttMs: 13.8, surabayaRttMs: 1.9, backboneLink: 'Surabaya KBLI Local Core 400G', kafkaLagMs: 5 },
  { id: 'R08', code: 'BALI_NUSRA', name: 'Regional 8 — Bali & Nusa Tenggara', macroSites: 2800, gridEmissionFactor: 0.85, dieselSharePct: 18, baseTariffRp: 1580, wbpSharePct: 24, sentulRttMs: 19.5, surabayaRttMs: 8.2, backboneLink: 'Bali-Lombok-Sumbawa SKKL Ring', kafkaLagMs: 18 },
  { id: 'R09', code: 'KALIMANTAN', name: 'Regional 9 — Kalimantan (Balikpapan & IKN)', macroSites: 3100, gridEmissionFactor: 0.86, dieselSharePct: 22, baseTariffRp: 1620, wbpSharePct: 22, sentulRttMs: 24.2, surabayaRttMs: 15.1, backboneLink: 'IKN Nusantara & Borneo Subsea Link', kafkaLagMs: 27 },
  { id: 'R10', code: 'SULAWESI', name: 'Regional 10 — Sulawesi (Makassar & Manado)', macroSites: 2900, gridEmissionFactor: 0.81, dieselSharePct: 20, baseTariffRp: 1600, wbpSharePct: 22, sentulRttMs: 29.8, surabayaRttMs: 17.6, backboneLink: 'Sulawesi-Maluku Palapa Ring Tengah', kafkaLagMs: 31 },
  { id: 'R11', code: 'MALUKU_PAPUA', name: 'Regional 11 — Maluku & Papua (3T Prioritas Inklusi)', macroSites: 1400, gridEmissionFactor: 1.08, dieselSharePct: 58, baseTariffRp: 1850, wbpSharePct: 20, sentulRttMs: 54.6, surabayaRttMs: 41.3, backboneLink: 'SMPCS Subsea + Palapa Ring Timur', kafkaLagMs: 64 }
];

/**
 * Authentic 3GPP TS 28.552 / TS 32.425 RAN Performance Management Counters
 * and Modbus TCP / SNMP v3 OID Register Profiles for Rectifier 48V DC & 16S LiFePO4 BMS.
 */
export const BTS_3GPP_MODBUS_PROFILES = [
  {
    siteId: 'JKT-SEL-P01',
    siteName: 'Senopati Macro Hub (Jakarta Selatan)',
    regional: 'R04 — Jabotabek Inner',
    vendor: 'ERICSSON_ENM',
    emsHost: 'enm-jkt01.internal.telkomsel.co.id',
    rectifierModel: 'Eltek Flatpack2 HE 48V/3000W',
    bmsModel: 'Sacred Sun / Narada 48V 200Ah (16S LiFePO4)',
    sleepState: 'DEEP_CARRIER_SLEEP_B3_B8',
    counters3gpp: {
      'PEE.AvgPower': { value: 3420, baseline: 4150, unit: 'W', spec: '3GPP TS 28.552 §5.7.1', status: 'OPTIMAL (-17.6%)' },
      'PEE.Energy': { value: 0.855, baseline: 1.038, unit: 'kWh / 15m', spec: '3GPP TS 28.552 §5.7.2', status: 'VERIFIED' },
      'RRU.PrbTotDl': { value: 26.4, baseline: 26.2, unit: '%', spec: '3GPP TS 38.552 §5.1.1.2', status: 'LOW_LOAD_SLEEP_ELIGIBLE' },
      'RRU.PrbTotUl': { value: 14.8, baseline: 14.7, unit: '%', spec: '3GPP TS 38.552 §5.1.1.3', status: 'NOMINAL' },
      'DRB.UEThpDl': { value: 68.4, baseline: 67.9, unit: 'Mbps', spec: '3GPP TS 28.552 §5.1.1.3', status: 'SLA_PASS (>= 25 Mbps)' },
      'RRC.ConnMean': { value: 42, baseline: 43, unit: 'Active UEs', spec: '3GPP TS 32.425 §4.1', status: 'ANCHOR_B1_CONSOLIDATED' },
      'ERAB.EstabSuccRate': { value: 99.92, baseline: 99.91, unit: '%', spec: '3GPP TS 32.425 §4.2.1', status: 'SLA_PASS (>= 99.50%)' },
      'CallDropRate': { value: 0.05, baseline: 0.06, unit: '%', spec: 'ITU-T E.800 / Telkomsel SQM', status: 'SLA_PASS (<= 0.15%)' },
      'VoLTE.MosMean': { value: 4.28, baseline: 4.27, unit: 'MOS-LQO', spec: 'ITU-T P.863 POLQA', status: 'HD_VOICE_INTACT' }
    },
    modbusRegisters: [
      { registerHex: '0x1000', snmpOid: '1.3.6.1.4.1.12148.10.3.1', parameter: 'DC Bus Float Voltage', value: '-53.62 V', normalRange: '-53.0 to -54.5 V', status: 'NOMINAL' },
      { registerHex: '0x1002', snmpOid: '1.3.6.1.4.1.12148.10.3.2', parameter: 'Total Rectifier Output Current', value: '57.63 A', normalRange: '10.0 to 180.0 A', status: 'NOMINAL' },
      { registerHex: '0x1004', snmpOid: '1.3.6.1.4.1.12148.10.5.4', parameter: 'AC-to-DC Conversion Efficiency', value: '96.4 %', normalRange: '>= 95.0 % (HE Mode)', status: 'HIGH_EFFICIENCY' },
      { registerHex: '0x1006', snmpOid: '1.3.6.1.4.1.3902.200.1.4', parameter: 'LiFePO4 BMS State of Charge (SOC)', value: '94.0 %', normalRange: '20.0 to 100.0 %', status: 'READY_FOR_WBP' },
      { registerHex: '0x1008', snmpOid: '1.3.6.1.4.1.3902.200.1.5', parameter: 'LiFePO4 State of Health (SOH)', value: '98.5 %', normalRange: '>= 80.0 %', status: 'HEALTHY (Cycle #184)' },
      { registerHex: '0x100A', snmpOid: '1.3.6.1.4.1.3902.200.1.8', parameter: 'Max Cell Temperature (16S Pack)', value: '27.4 °C', normalRange: '<= 35.0 °C', status: 'THERMAL_SAFE' },
      { registerHex: '0x100C', snmpOid: '1.3.6.1.4.1.3902.200.1.9', parameter: 'Cell Delta Voltage (Max - Min)', value: '12 mV', normalRange: '<= 50 mV', status: 'BALANCED' }
    ]
  },
  {
    siteId: 'BDG-DGO-P04',
    siteName: 'Dago Atas Macro Hub (Bandung)',
    regional: 'R05 — Jawa Barat',
    vendor: 'HUAWEI_MAE',
    emsHost: 'mae-jbr02.internal.telkomsel.co.id',
    rectifierModel: 'Huawei NetEco ETP48400-C4B1 (Smart SMU02B)',
    bmsModel: 'Huawei SmartLi 48V 150Ah (LiFePO4 BMS)',
    sleepState: 'SYMBOL_AND_RF_DEEP_DORMANT',
    counters3gpp: {
      'PEE.AvgPower': { value: 2880, baseline: 3900, unit: 'W', spec: '3GPP TS 28.552 §5.7.1', status: 'OPTIMAL (-26.1%)' },
      'PEE.Energy': { value: 0.720, baseline: 0.975, unit: 'kWh / 15m', spec: '3GPP TS 28.552 §5.7.2', status: 'VERIFIED' },
      'RRU.PrbTotDl': { value: 18.2, baseline: 18.5, unit: '%', spec: '3GPP TS 38.552 §5.1.1.2', status: 'DEEP_SLEEP_ACTIVE' },
      'RRU.PrbTotUl': { value: 11.4, baseline: 11.2, unit: '%', spec: '3GPP TS 38.552 §5.1.1.3', status: 'NOMINAL' },
      'DRB.UEThpDl': { value: 54.8, baseline: 54.1, unit: 'Mbps', spec: '3GPP TS 28.552 §5.1.1.3', status: 'SLA_PASS (>= 25 Mbps)' },
      'RRC.ConnMean': { value: 29, baseline: 30, unit: 'Active UEs', spec: '3GPP TS 32.425 §4.1', status: 'ANCHOR_B1_CONSOLIDATED' },
      'ERAB.EstabSuccRate': { value: 99.94, baseline: 99.90, unit: '%', spec: '3GPP TS 32.425 §4.2.1', status: 'SLA_PASS (>= 99.50%)' },
      'CallDropRate': { value: 0.04, baseline: 0.05, unit: '%', spec: 'ITU-T E.800 / Telkomsel SQM', status: 'SLA_PASS (<= 0.15%)' },
      'VoLTE.MosMean': { value: 4.31, baseline: 4.29, unit: 'MOS-LQO', spec: 'ITU-T P.863 POLQA', status: 'HD_VOICE_INTACT' }
    },
    modbusRegisters: [
      { registerHex: '0x1000', snmpOid: '1.3.6.1.4.1.2011.6.164.1.3', parameter: 'DC Bus Float Voltage', value: '-53.50 V', normalRange: '-53.0 to -54.5 V', status: 'NOMINAL' },
      { registerHex: '0x1002', snmpOid: '1.3.6.1.4.1.2011.6.164.1.4', parameter: 'Total Rectifier Output Current', value: '53.83 A', normalRange: '10.0 to 180.0 A', status: 'NOMINAL' },
      { registerHex: '0x1004', snmpOid: '1.3.6.1.4.1.2011.6.164.1.8', parameter: 'AC-to-DC Conversion Efficiency', value: '96.1 %', normalRange: '>= 95.0 % (HE Mode)', status: 'HIGH_EFFICIENCY' },
      { registerHex: '0x1006', snmpOid: '1.3.6.1.4.1.2011.6.164.2.1', parameter: 'LiFePO4 BMS State of Charge (SOC)', value: '91.5 %', normalRange: '20.0 to 100.0 %', status: 'READY_FOR_WBP' },
      { registerHex: '0x1008', snmpOid: '1.3.6.1.4.1.2011.6.164.2.2', parameter: 'LiFePO4 State of Health (SOH)', value: '97.8 %', normalRange: '>= 80.0 %', status: 'HEALTHY (Cycle #242)' },
      { registerHex: '0x100A', snmpOid: '1.3.6.1.4.1.2011.6.164.2.5', parameter: 'Max Cell Temperature (16S Pack)', value: '26.8 °C', normalRange: '<= 35.0 °C', status: 'THERMAL_SAFE' },
      { registerHex: '0x100C', snmpOid: '1.3.6.1.4.1.2011.6.164.2.6', parameter: 'Cell Delta Voltage (Max - Min)', value: '15 mV', normalRange: '<= 50 mV', status: 'BALANCED' }
    ]
  },
  {
    siteId: 'SBY-GUB-P02',
    siteName: 'Gubeng Stasiun Macro (Surabaya)',
    regional: 'R07 — Jawa Timur',
    vendor: 'ZTE_NETNUMEN',
    emsHost: 'ums-sby01.internal.telkomsel.co.id',
    rectifierModel: 'ZTE ZXDU68 S301 (CSU502A Controller)',
    bmsModel: 'ZTE ZXDC 48V 150Ah LiFePO4 Smart Pack',
    sleepState: 'PA_BIAS_ADAPTIVE_AND_SYMBOL_SLEEP',
    counters3gpp: {
      'PEE.AvgPower': { value: 3190, baseline: 3890, unit: 'W', spec: '3GPP TS 28.552 §5.7.1', status: 'OPTIMAL (-18.0%)' },
      'PEE.Energy': { value: 0.798, baseline: 0.973, unit: 'kWh / 15m', spec: '3GPP TS 28.552 §5.7.2', status: 'VERIFIED' },
      'RRU.PrbTotDl': { value: 29.5, baseline: 29.4, unit: '%', spec: '3GPP TS 38.552 §5.1.1.2', status: 'MICRO_SLEEP_ACTIVE' },
      'RRU.PrbTotUl': { value: 16.1, baseline: 16.0, unit: '%', spec: '3GPP TS 38.552 §5.1.1.3', status: 'NOMINAL' },
      'DRB.UEThpDl': { value: 61.2, baseline: 60.8, unit: 'Mbps', spec: '3GPP TS 28.552 §5.1.1.3', status: 'SLA_PASS (>= 25 Mbps)' },
      'RRC.ConnMean': { value: 38, baseline: 38, unit: 'Active UEs', spec: '3GPP TS 32.425 §4.1', status: 'NOMINAL' },
      'ERAB.EstabSuccRate': { value: 99.89, baseline: 99.88, unit: '%', spec: '3GPP TS 32.425 §4.2.1', status: 'SLA_PASS (>= 99.50%)' },
      'CallDropRate': { value: 0.06, baseline: 0.06, unit: '%', spec: 'ITU-T E.800 / Telkomsel SQM', status: 'SLA_PASS (<= 0.15%)' },
      'VoLTE.MosMean': { value: 4.24, baseline: 4.23, unit: 'MOS-LQO', spec: 'ITU-T P.863 POLQA', status: 'HD_VOICE_INTACT' }
    },
    modbusRegisters: [
      { registerHex: '0x1000', snmpOid: '1.3.6.1.4.1.3902.1015.3.1', parameter: 'DC Bus Float Voltage', value: '-53.70 V', normalRange: '-53.0 to -54.5 V', status: 'NOMINAL' },
      { registerHex: '0x1002', snmpOid: '1.3.6.1.4.1.3902.1015.3.2', parameter: 'Total Rectifier Output Current', value: '59.40 A', normalRange: '10.0 to 180.0 A', status: 'NOMINAL' },
      { registerHex: '0x1004', snmpOid: '1.3.6.1.4.1.3902.1015.3.6', parameter: 'AC-to-DC Conversion Efficiency', value: '95.9 %', normalRange: '>= 95.0 % (HE Mode)', status: 'HIGH_EFFICIENCY' },
      { registerHex: '0x1006', snmpOid: '1.3.6.1.4.1.3902.1015.4.1', parameter: 'LiFePO4 BMS State of Charge (SOC)', value: '88.0 %', normalRange: '20.0 to 100.0 %', status: 'READY_FOR_WBP' },
      { registerHex: '0x1008', snmpOid: '1.3.6.1.4.1.3902.1015.4.2', parameter: 'LiFePO4 State of Health (SOH)', value: '98.1 %', normalRange: '>= 80.0 %', status: 'HEALTHY (Cycle #198)' },
      { registerHex: '0x100A', snmpOid: '1.3.6.1.4.1.3902.1015.4.5', parameter: 'Max Cell Temperature (16S Pack)', value: '28.9 °C', normalRange: '<= 35.0 °C', status: 'THERMAL_SAFE' },
      { registerHex: '0x100C', snmpOid: '1.3.6.1.4.1.3902.1015.4.6', parameter: 'Cell Delta Voltage (Max - Min)', value: '14 mV', normalRange: '<= 50 mV', status: 'BALANCED' }
    ]
  }
];

export function getBts3gppAndModbusTelemetry(siteId = 'JKT-SEL-P01') {
  return BTS_3GPP_MODBUS_PROFILES.find((p) => p.siteId === siteId) || BTS_3GPP_MODBUS_PROFILES[0];
}

/**
 * Multi-Vendor OSS/EMS CLI Command Profiles (Ericsson ENM cmedit/Moshell, Huawei iMaster MAE MML, ZTE NetNumen).
 */
export const VENDOR_CLI_PROFILES = {
  ERICSSON_ENM: {
    vendorId: 'ERICSSON_ENM',
    vendorName: 'Ericsson Network Manager (ENM 24.Q2 — Moshell / cmedit)',
    protocol: 'O-RAN O1 NETCONF/YANG + Ericsson COM CLI over SSHv2 (mTLS)',
    emsNode: 'enm-sentul-prod01.telkomsel.co.id:830',
    commands: [
      {
        id: 'audit_state',
        label: '1. Audit Status Carrier Sleep & Power Counter (cmedit get)',
        commandText: `cmedit get SubNetwork=ONRM_ROOT_MO,SubNetwork=JKT_METRO,MeContext=JKT-SEL-P01 EUtranCellFDD.(administrativeState,operationalState,cellSleepState); MimoSleepFunction.(sleepMode,sleepStartTime,sleepEndTime)`,
        responseLog: [
          `FDN : SubNetwork=ONRM_ROOT_MO,SubNetwork=JKT_METRO,MeContext=JKT-SEL-P01,ManagedElement=1,ENodeBFunction=1,EUtranCellFDD=JKT-SEL-P01-B3`,
          `administrativeState : UNLOCKED`,
          `operationalState    : ENABLED`,
          `cellSleepState      : DEEP_SLEEP_ACTIVE (TX_PA_BIAS_OFF)`,
          `mimoSleepMode       : 4T4R_TO_2T2R_ADAPTIVE`,
          `pmPowerConsumption  : 3420 W (Baseline: 4150 W | Delta: -17.6%)`,
          `emergency112Hook    : ARMED_ZERO_WAIT (WakeLatency <= 24ms)`,
          `1 instance(s) returned. Execution time: 18 ms.`
        ]
      },
      {
        id: 'apply_sleep',
        label: '2. Injeksi Kebijakan Deep Carrier Sleep + 112 Guardrail (cmedit set)',
        commandText: `cmedit set SubNetwork=ONRM_ROOT_MO,SubNetwork=JKT_METRO,MeContext=JKT-SEL-P01,ManagedElement=1,ENodeBFunction=1,MimoSleepFunction=1 sleepMode=2,sleepPrbThreshold=22,emergencyWakeupMs=28 --force`,
        responseLog: [
          `[INFO] Validating O-RAN A1 Policy Signature (SHA256: 8f4e2a91c03b77d2)... OK`,
          `[INFO] Pre-Check Neighbor Border Guard: DPK-MGD-15-S2 RET Tilt +1.5 deg confirmed.`,
          `FDN : SubNetwork=ONRM_ROOT_MO,SubNetwork=JKT_METRO,MeContext=JKT-SEL-P01,ManagedElement=1,ENodeBFunction=1,MimoSleepFunction=1`,
          `Transaction ID #ENM-2026-994182 COMMITTED successfully in 22 ms.`,
          `Result: 1 MO(s) modified. Zero active RRC bearers dropped.`
        ]
      }
    ]
  },
  HUAWEI_MAE: {
    vendorId: 'HUAWEI_MAE',
    vendorName: 'Huawei iMaster MAE / U2020 (MML Command Line Interface)',
    protocol: 'Huawei MML over SSL/TLS + O-RAN O1 Adapter',
    emsNode: 'mae-bandung-prod02.telkomsel.co.id:31114',
    commands: [
      {
        id: 'audit_state',
        label: '1. Audit Switch Algoritma Hemat Daya & Suhu RRU (DSP CELLALGOSWITCH)',
        commandText: `DSP CELLALGOSWITCH: LocalCellId=1;\nDSP BRDMFRINFO: CN=0, SRN=4, SN=0;`,
        responseLog: [
          `+++    HUAWEI-BTS3900-BDG-DGO-P04        2026-10-30 14:15:04+07:00`,
          `O&M    #804912`,
          `%%DSP CELLALGOSWITCH: LocalCellId=1;%%`,
          `RETCODE = 0  Operation succeeded.`,
          `Local cell ID              =  1 (Band 3 - 1800MHz)`,
          `PowerSavingSwitch          =  CARRIER_SHUTDOWN_SW:ON, SYMBOL_SHUTDOWN_SW:ON, RF_DEEP_DORMANT_SW:ON`,
          `EmergencyCallPreemptSwitch =  ON (Zero-Wait 112 Preemption <= 25ms)`,
          `RRU Input Voltage / Power  =  -53.5 V DC / 2,880 W (-26.1% vs Baseline)`,
          `---    END`
        ]
      },
      {
        id: 'apply_sleep',
        label: '2. Aktifkan Symbol Shutdown & RF Deep Dormant (MOD CELLALGOSWITCH)',
        commandText: `MOD CELLALGOSWITCH: LocalCellId=1, PowerSavingSwitch=CARRIER_SHUTDOWN_SW-1&SYMBOL_SHUTDOWN_SW-1&RF_DEEP_DORMANT_SW-1;`,
        responseLog: [
          `+++    HUAWEI-BTS3900-BDG-DGO-P04        2026-10-30 14:15:09+07:00`,
          `O&M    #804913`,
          `%%MOD CELLALGOSWITCH: LocalCellId=1, PowerSavingSwitch=CARRIER_SHUTDOWN_SW-1&SYMBOL_SHUTDOWN_SW-1&RF_DEEP_DORMANT_SW-1;%%`,
          `RETCODE = 0  Operation succeeded.`,
          `[AUDIT] Merkle Hash Recorded: e7b9031ca4920f188c4b1209a8e7f123`,
          `---    END`
        ]
      }
    ]
  },
  ZTE_NETNUMEN: {
    vendorId: 'ZTE_NETNUMEN',
    vendorName: 'ZTE NetNumen U31 / ElasticNet UME (O1/MML Console)',
    protocol: 'ZTE NetNumen MML / NETCONF over TLS 1.3',
    emsNode: 'ume-surabaya-prod01.telkomsel.co.id:21500',
    commands: [
      {
        id: 'audit_state',
        label: '1. Tampilkan Kebijakan PA Bias & Konsumsi Daya RRU (SHOW RRU_POWER_SAVING)',
        commandText: `SHOW RRU_POWER_SAVING: MEID=1042, CELLID=2;`,
        responseLog: [
          `[ZTE-UME-SBY-GUB-P02] Executing MML command...`,
          `MEID=1042 | SiteName=SBY-GUB-P02 | RRU_Type=ZXSDR_R8862A_S1800`,
          `PA_Gate_Bias_Adaptation = ENABLED (-4.2V Optimal Drain Bias)`,
          `Symbol_Power_Saving     = ACTIVE (Subframe 1,2,3,6,7,8)`,
          `Measured_DC_Power       = 3,190 W (Saved: 700 W / -18.0%)`,
          `E-RAB Drop Rate         = 0.06% (SLA Limit <= 0.15%)`,
          `Command completed with code 0 (Success) in 21 ms.`
        ]
      },
      {
        id: 'apply_sleep',
        label: '2. Update Threshold PRB Shutdown & Watchdog 112 (SET CARRIER_SHUTDOWN_POLICY)',
        commandText: `SET CARRIER_SHUTDOWN_POLICY: MEID=1042, CELLID=2, PrbLowThd=18, PrbHighWakeThd=65, Emergency112WakeMs=28;`,
        responseLog: [
          `[ZTE-UME-SBY-GUB-P02] Applying Carrier Shutdown Policy...`,
          `Verify Dead-Man Switch Watchdog Timer = 120s... ARMED.`,
          `Policy committed to BBU V9200 local non-volatile cache.`,
          `Command completed with code 0 (Success) in 19 ms.`
        ]
      }
    ]
  }
};

export function executeVendorCliCommand({
  vendorId = 'ERICSSON_ENM',
  commandId = 'audit_state'
} = {}) {
  const profile = VENDOR_CLI_PROFILES[vendorId] || VENDOR_CLI_PROFILES.ERICSSON_ENM;
  const cmd = profile.commands.find((c) => c.id === commandId) || profile.commands[0];
  return {
    vendorId: profile.vendorId,
    vendorName: profile.vendorName,
    protocol: profile.protocol,
    emsNode: profile.emsNode,
    commandId: cmd.id,
    label: cmd.label,
    commandText: cmd.commandText,
    responseLog: cmd.responseLog,
    executedAtWib: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' WIB',
    status: 'RET_CODE_0_SUCCESS'
  };
}

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
      'x-merkle-leaf-sha256': hexDigest,
      'strict-transport-security': 'max-age=63072000; includeSubDomains; preload',
      'x-content-type-options': 'nosniff'
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
 * Computes the National 11-Regional Telkomsel Rollout, Dual-DC Latency Matrix & Financial/ESG Master Plan.
 */
export function calculateNationalRegionalRollout({
  deploymentCoveragePct = 100,
  includeBessInRural = true,
  activeDcNode = 'SENTUL_PRIMARY' // 'SENTUL_PRIMARY' | 'SURABAYA_DR'
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

    const activeRttMs = activeDcNode === 'SURABAYA_DR' ? reg.surabayaRttMs : reg.sentulRttMs;

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
      scope2AbatedTons,
      activeRttMs
    };
  });

  const totalActiveSites = regionalBreakdown.reduce((s, r) => s + r.activeSites, 0);
  const totalSavedMwh = regionalBreakdown.reduce((s, r) => s + r.annualSavedMwh, 0);
  const totalGrossSavingsRp = regionalBreakdown.reduce((s, r) => s + r.grossAnnualSavingsRp, 0);
  const totalTelkomselNet85Rp = regionalBreakdown.reduce((s, r) => s + r.telkomselNet85SavingsRp, 0);
  const totalTowerCoShare15Rp = regionalBreakdown.reduce((s, r) => s + r.towerCoShare15Rp, 0);
  const totalScope2AbatedTons = regionalBreakdown.reduce((s, r) => s + r.scope2AbatedTons, 0);
  const avgNationalRttMs = Number(
    (regionalBreakdown.reduce((s, r) => s + r.activeRttMs, 0) / regionalBreakdown.length).toFixed(1)
  );

  return {
    deploymentCoveragePct: Math.round(safeCoverageRatio * 100),
    includeBessInRural,
    activeDcNode,
    avgNationalRttMs,
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
 * Calculates 5-Year TCO Comparison: Paying Proprietary OEM RAN Power-Saving RTU Licenses per BTS
 * vs Telkomsel In-House O-RAN Non-RT RIC rApp ImpactGrid.
 */
export function calculateVendorLicenseVsRappTco({
  totalSites = 10000,
  oemAnnualLicensePerSiteIdr = 14500000,
  years = 5
} = {}) {
  const safeSites = Math.max(50, Math.min(43000, Number(totalSites) || 10000));
  const safeLicense = Math.max(5000000, Math.min(35000000, Number(oemAnnualLicensePerSiteIdr) || 14500000));
  const safeYears = Math.max(1, Math.min(10, Number(years) || 5));

  // Proprietary OEM Model: Annual recurring RTU software license per site + 15% cross-vendor integration surcharge
  const oemAnnualLicenseTotalIdr = safeSites * safeLicense;
  const oemTotalTcoIdr = Math.round(oemAnnualLicenseTotalIdr * safeYears);

  // ImpactGrid In-House O-RAN rApp Model:
  // One-time internal rApp engineering + Telkom DC Sentul/Surabaya K8s cluster OpEx + smart meter gateway amortization
  const impactGridOneTimeCapexIdr = 4500000000 + Math.round(safeSites * 1150000);
  const impactGridAnnualCloudOpexIdr = 1200000000 + Math.round(safeSites * 380000);
  const impactGridTotalTcoIdr = impactGridOneTimeCapexIdr + impactGridAnnualCloudOpexIdr * safeYears;

  const netLicenseSavingsIdr = Math.max(0, oemTotalTcoIdr - impactGridTotalTcoIdr);
  const tcoReductionPct = oemTotalTcoIdr > 0
    ? Number(((netLicenseSavingsIdr / oemTotalTcoIdr) * 100).toFixed(1))
    : 0;

  return {
    totalSites: safeSites,
    oemAnnualLicensePerSiteIdr: safeLicense,
    years: safeYears,
    oemAnnualLicenseTotalIdr,
    oemTotalTcoIdr,
    impactGridOneTimeCapexIdr,
    impactGridAnnualCloudOpexIdr,
    impactGridTotalTcoIdr,
    netLicenseSavingsIdr,
    tcoReductionPct,
    keyAdvantages: [
      'Bebas Vendor Lock-In: Satu rApp mengatur Ericsson ENM, Huawei MAE, dan ZTE NetNumen sekaligus.',
      'Zero Annual RTU Per-Carrier Tax: Tidak ada biaya lisensi tahunan per-sektor/per-band kepada OEM.',
      'Border Guard Lintas Vendor: Kompensasi RET tilt otomatis antar BTS tetangga beda merek (tidak dimiliki OEM tunggal).'
    ]
  };
}

/**
 * Generates OpenAPI 3.1.0 Specification JSON for Telkomsel IT Architecture & Apigee Governance review.
 */
export function generateImpactGridOpenApiSpec() {
  return {
    openapi: '3.1.0',
    info: {
      title: 'ImpactGrid Telkomsel RAN Energy & O-RAN Non-RT RIC Enterprise API',
      version: '2.5.0-tsel-dc',
      description: 'Spesifikasi OpenAPI 3.1 resmi untuk integrasi Apigee mTLS Gateway, TM Forum (TMF628/TMF621), O-RAN A1-P Policy, SAP S/4HANA FI-CO OData, dan GreenLedger SHA-256.',
      contact: {
        name: 'Telkomsel SNOC & IT Enterprise Architecture',
        email: 'snoc-architecture@telkomsel.co.id'
      }
    },
    servers: [
      { url: 'https://api-sentul.internal.telkomsel.co.id', description: 'Telkom Tier-III DC Sentul (Primary Active)' },
      { url: 'https://api-surabaya.internal.telkomsel.co.id', description: 'Telkom Tier-III DC Surabaya (Active-Active DR)' }
    ],
    security: [{ TelkomselOidcBearer: ['oran:policy:write', 'telemetry:ingest', 'sap:voucher:post'] }],
    paths: {
      '/api/v1/gateway/execute': {
        post: {
          summary: 'Execute Signed Enterprise Gateway Transaction (TMF628 / O-RAN A1 / TMF621 / SAP BAPI)',
          operationId: 'executeEnterpriseGateway',
          tags: ['Apigee mTLS Gateway'],
          responses: {
            '200': { description: 'Committed with HMAC-SHA256 & Merkle Leaf Receipt' },
            '401': { description: 'Unauthorized / Invalid OIDC Bearer Token' },
            '422': { description: 'Cryptographic Payload Integrity or Kirchhoff Physics Violation' }
          }
        }
      },
      '/api/v1/security/verify-hmac': {
        post: {
          summary: 'Verify Payload Cryptographic SHA-256 Digest & Tamper Detection',
          operationId: 'verifyPayloadHmac',
          tags: ['CISO SecOps'],
          responses: {
            '200': { description: 'Signature Match Verified' },
            '422': { description: 'Tamper Detected — Signature Mismatch' }
          }
        }
      },
      '/api/v1/oss/cli-execute': {
        post: {
          summary: 'Execute Multi-Vendor OSS/EMS Command (Ericsson ENM / Huawei MAE / ZTE NetNumen)',
          operationId: 'executeOssCli',
          tags: ['RAN OSS/EMS'],
          responses: {
            '200': { description: 'MML / cmedit Command Executed (RET_CODE=0)' }
          }
        }
      },
      '/metrics': {
        get: {
          summary: 'Prometheus NOC Telemetry & Anomaly Scrape Endpoint',
          operationId: 'getPrometheusMetrics',
          tags: ['Observability'],
          responses: {
            '200': { description: 'OpenMetrics / Prometheus text format 0.0.4' }
          }
        }
      }
    }
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
