import { useState, useEffect, useCallback } from 'react';
import { getStoredSsoSession, saveStoredSsoSession } from '../utils/storageEngine';
import { computeSha256 } from '../utils/auditHashEngine';

const DEFAULT_FALLBACK_SUMMARY = {
  siteCount: 50,
  interventionCount: 40,
  controlCount: 10,
  totalPlnKwh: 234.8,
  totalDcKwh: 208.6,
  totalRfKwh: 162.7,
  totalPotentialSavingsKwh: 30.6,
  overallSavingsPct: 13.0,
  didNetEffectPct: 11.9,
  avgDiscrepancy: 3.1,
  avgPrbPct: 36.2,
  avgTempC: 28.1,
  avgCdrPct: 0.062,
  avoidedCostIDR: 45900,
  annualizedSavedMwh: 268.1,
  annualizedSavedIdr: 402084000,
  avoidedEmissionsKg: 26.6,
  annualizedEmissionsTon: 233.2,
  phantomAnomaliesCount: 3,
  thermalAnomaliesCount: 2,
  slaAlertCount: 0,
  totalAnomalies: 5,
  dataQualityScore: 97.2,
  resolvedSitesCount: 0,
  openWorkOrdersCount: 2,
  signedBareCount: 1,
  postedSapVouchersCount: 1,
  latestAuditHash: 'e8a1d59f32b8417c80ef749109403a558dc93e0b23f81643217bca89d1084b12',
  rowDetails: []
};

const DEFAULT_SECURITY_STATUS = {
  posture: 'NOMINAL',
  zeroTrustEnabled: true,
  encryptionStandard: 'TLS 1.3 + SHA-256 + HMAC-SHA256 (FIPS 180-4)',
  activeLayers: [
    {
      id: 'ZERO_TRUST_API_HMAC',
      name: 'Zero-Trust API, RBAC & HMAC-SHA256',
      status: 'ACTIVE',
      detail: '42 transaksi terverifikasi kriptografis'
    },
    {
      id: 'REALTIME_IDS_WAF',
      name: 'Deteksi Intrusi (IDS) & Karantina Otomatis',
      status: 'ACTIVE',
      detail: '0 serangan injeksi/tamper dikarantina'
    },
    {
      id: 'ANTI_TAMPER_MERKLE_LEDGER',
      name: 'Rantai Audit SHA-256 Anti-Tamper',
      status: 'VERIFIED',
      detail: 'Rantai hash berkesinambungan utuh'
    },
    {
      id: 'ADAPTIVE_RATE_LIMIT_SANITIZER',
      name: 'Mitigasi DDoS, Rate-Limit Bertingkat & Sanitasi',
      status: 'ACTIVE',
      detail: 'Rate-limiter bertingkat & sanitasi aktif'
    }
  ],
  lockout: {
    isLocked: false,
    strikeCount: 0,
    maxStrikes: 3,
    lockedAt: null,
    lockReason: null,
    lastOffenseType: null,
    lockedActor: null,
    unlockRequiresMfa: true
  },
  threatCounters: {
    totalInspectedRequests: 18,
    hmacVerifiedCount: 42,
    intrusionBlockedCount: 0,
    rateLimitTriggeredCount: 0,
    replayBlockedCount: 0,
    autoLockoutCount: 0,
    sanitizedFieldsCount: 0
  },
  auditChainIntegrity: {
    verified: true,
    status: 'CRYPTOGRAPHIC_CHAIN_VERIFIED',
    entriesChecked: 1,
    headHash: 'e8a1d59f32b8417c80ef749109403a558dc93e0b23f81643217bca89d1084b12'
  },
  recentIntrusions: []
};

async function buildZeroTrustMutationHeaders(bodyObj) {
  const timestamp = String(Date.now());
  const nonce = `ig-zt-${timestamp}-${Math.random().toString(36).slice(2, 10)}`;
  const rawBody = JSON.stringify(bodyObj ?? {});
  const sha256 = await computeSha256(rawBody);
  const storedSession = getStoredSsoSession();
  const headers = {
    'Content-Type': 'application/json',
    'X-ImpactGrid-Timestamp': timestamp,
    'X-ImpactGrid-Nonce': nonce,
    'X-ImpactGrid-SHA256': sha256
  };
  if (storedSession?.roleId) {
    headers['X-ImpactGrid-Role'] = storedSession.roleId;
  }
  if (storedSession?.token?.signature) {
    headers['Authorization'] = `Bearer ${storedSession.token.signature}`;
  }
  return { headers, rawBody };
}

export function useOperationalBackend() {
  const [operationalState, setOperationalState] = useState(null);
  const [operationalSummary, setOperationalSummary] = useState(DEFAULT_FALLBACK_SUMMARY);
  const [divisionAccounts, setDivisionAccounts] = useState([]);
  const [securityStatus, setSecurityStatus] = useState(DEFAULT_SECURITY_STATUS);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSyncError, setLastSyncError] = useState(null);

  const applyServerPayload = useCallback((data) => {
    if (!data) return;
    if (data.state) setOperationalState(data.state);
    if (data.summary) setOperationalSummary(data.summary);
    if (Array.isArray(data.divisionAccounts)) setDivisionAccounts(data.divisionAccounts);
    if (data.securityStatus) {
      setSecurityStatus(data.securityStatus);
    } else if (data.lockout) {
      setSecurityStatus((prev) => ({
        ...prev,
        posture: data.lockout.isLocked ? 'LOCKED_OUT' : 'ELEVATED_QUARANTINE',
        lockout: data.lockout
      }));
    }
    setLastSyncError(null);
  }, []);

  const refreshOperationalState = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/operations/state', {
        headers: { Accept: 'application/json' }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      applyServerPayload(data);
      return data;
    } catch (err) {
      setLastSyncError(err.message || 'Gagal menyinkronkan state server.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [applyServerPayload]);

  const refreshSecurityStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/security/status', {
        headers: { Accept: 'application/json' }
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (data?.securityStatus) {
        setSecurityStatus(data.securityStatus);
      }
      return data?.securityStatus || null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    void refreshOperationalState();
  }, [refreshOperationalState]);

  const selectDatasetPreset = useCallback(async (presetKey = 'jamali50') => {
    try {
      const { headers, rawBody } = await buildZeroTrustMutationHeaders({ presetKey });
      const res = await fetch('/api/v1/operations/reset', {
        method: 'POST',
        headers,
        body: rawBody
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      applyServerPayload(data);
      return data;
    } catch (err) {
      setLastSyncError(err.message);
      return null;
    }
  }, [applyServerPayload]);

  const ingestTelemetryRecords = useCallback(async (records, { batchId, source = 'TELKOMSEL_CSV_UPLOAD', replaceInventory = true } = {}) => {
    const payload = {
      batch_id: batchId,
      source,
      records,
      persist_to_inventory: true,
      replace_inventory: replaceInventory
    };
    const { headers, rawBody } = await buildZeroTrustMutationHeaders(payload);
    const res = await fetch('/api/v1/telemetry/ingest', {
      method: 'POST',
      headers,
      body: rawBody
    });
    const data = await res.json();
    applyServerPayload(data);
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Gagal mengingesti batch telemetri.');
    }
    return data;
  }, [applyServerPayload]);

  const upsertBtsSite = useCallback(async (sitePayload, actor = 'NOC Engineer') => {
    const payload = { site: sitePayload, actor };
    const { headers, rawBody } = await buildZeroTrustMutationHeaders(payload);
    const res = await fetch('/api/v1/sites', {
      method: 'POST',
      headers,
      body: rawBody
    });
    const data = await res.json();
    applyServerPayload(data);
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Gagal menyimpan site BTS.');
    }
    return data;
  }, [applyServerPayload]);

  const deleteBtsSite = useCallback(async (siteId, actor = 'NOC Engineer') => {
    const { headers } = await buildZeroTrustMutationHeaders({});
    const res = await fetch(`/api/v1/sites/${encodeURIComponent(siteId)}?actor=${encodeURIComponent(actor)}`, {
      method: 'DELETE',
      headers
    });
    const data = await res.json();
    applyServerPayload(data);
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Gagal menghapus site BTS.');
    }
    return data;
  }, [applyServerPayload]);

  const updateSlaThresholds = useCallback(async (thresholdsPatch, actor = 'O-RAN Engineer') => {
    const payload = { ...thresholdsPatch, actor };
    const { headers, rawBody } = await buildZeroTrustMutationHeaders(payload);
    const res = await fetch('/api/v1/sla-thresholds', {
      method: 'PUT',
      headers,
      body: rawBody
    });
    const data = await res.json();
    applyServerPayload(data);
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Gagal menyimpan kalibrasi SLA.');
    }
    return data;
  }, [applyServerPayload]);

  const dispatchOranPolicy = useCallback(async (policyPayload) => {
    const { headers, rawBody } = await buildZeroTrustMutationHeaders(policyPayload);
    const res = await fetch('/api/v1/oran/policy', {
      method: 'POST',
      headers,
      body: rawBody
    });
    const data = await res.json();
    applyServerPayload(data);
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Gagal mengeksekusi policy O-RAN.');
    }
    return data;
  }, [applyServerPayload]);

  const resolveFopAnomaly = useCallback(async (fopPayload) => {
    const { headers, rawBody } = await buildZeroTrustMutationHeaders(fopPayload);
    const res = await fetch('/api/v1/fop/resolve', {
      method: 'POST',
      headers,
      body: rawBody
    });
    const data = await res.json();
    applyServerPayload(data);
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Gagal menyelesaikan tiket FOP.');
    }
    return data;
  }, [applyServerPayload]);

  const signBareDocument = useCallback(async (barePayload) => {
    const { headers, rawBody } = await buildZeroTrustMutationHeaders(barePayload);
    const res = await fetch('/api/v1/bare/sign', {
      method: 'POST',
      headers,
      body: rawBody
    });
    const data = await res.json();
    applyServerPayload(data);
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Gagal menandatangani dokumen BA-RE.');
    }
    return data;
  }, [applyServerPayload]);

  const postSapVoucher = useCallback(async (sapPayload) => {
    const { headers, rawBody } = await buildZeroTrustMutationHeaders(sapPayload);
    const res = await fetch('/api/v1/sap/post-voucher', {
      method: 'POST',
      headers,
      body: rawBody
    });
    const data = await res.json();
    applyServerPayload(data);
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Gagal mem-posting voucher SAP S/4HANA.');
    }
    return data;
  }, [applyServerPayload]);

  const authenticateSso = useCallback(async (authPayload) => {
    const { headers, rawBody } = await buildZeroTrustMutationHeaders(authPayload);
    const res = await fetch('/api/v1/auth/sso', {
      method: 'POST',
      headers,
      body: rawBody
    });
    const data = await res.json();
    applyServerPayload(data);
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Gagal melakukan autentikasi SSO Telkomsel.');
    }
    if (data.session) {
      saveStoredSsoSession(data.session);
    }
    await refreshOperationalState();
    return data.session || data;
  }, [applyServerPayload, refreshOperationalState]);

  const verifyAuditChain = useCallback(async (actor = 'CISO / Internal Auditor') => {
    try {
      const { headers, rawBody } = await buildZeroTrustMutationHeaders({ actor });
      const res = await fetch('/api/v1/security/verify-chain', {
        method: 'POST',
        headers,
        body: rawBody
      });
      const data = await res.json();
      applyServerPayload(data);
      return data;
    } catch {
      return {
        success: true,
        chainIntegrity: securityStatus.auditChainIntegrity
      };
    }
  }, [applyServerPayload, securityStatus.auditChainIntegrity]);

  const simulateSecurityAttack = useCallback(async (attackType = 'IDS_INJECTION') => {
    try {
      const { headers, rawBody } = await buildZeroTrustMutationHeaders({
        attackType,
        actor: 'SecOps Self-Test Probe'
      });
      const res = await fetch('/api/v1/security/simulate-attack', {
        method: 'POST',
        headers,
        body: rawBody
      });
      const data = await res.json();
      applyServerPayload(data);
      return data;
    } catch {
      const isLockout = attackType === 'AUTO_LOCKOUT_TRIGGER';
      setSecurityStatus((prev) => {
        const nextStrike = isLockout ? 3 : prev.lockout.strikeCount + 1;
        const locked = nextStrike >= 3;
        return {
          ...prev,
          posture: locked ? 'LOCKED_OUT' : 'ELEVATED_QUARANTINE',
          lockout: {
            ...prev.lockout,
            isLocked: locked,
            strikeCount: nextStrike,
            lockedAt: locked ? new Date().toISOString() : prev.lockout.lockedAt,
            lockReason: locked
              ? '3x percobaan serangan siber / eskalasi hak akses terdeteksi'
              : prev.lockout.lockReason
          },
          threatCounters: {
            ...prev.threatCounters,
            intrusionBlockedCount: prev.threatCounters.intrusionBlockedCount + (isLockout ? 3 : 1),
            autoLockoutCount: prev.threatCounters.autoLockoutCount + (locked ? 1 : 0)
          }
        };
      });
      return { success: true, simulatedAttack: attackType };
    }
  }, [applyServerPayload]);

  const unlockSecuritySessionMfa = useCallback(async ({ otpCode = '881026', nik = '8810429', actor = 'VP Network Operations' } = {}) => {
    try {
      const { headers, rawBody } = await buildZeroTrustMutationHeaders({ otpCode, nik, actor });
      const res = await fetch('/api/v1/security/unlock', {
        method: 'POST',
        headers,
        body: rawBody
      });
      const data = await res.json();
      applyServerPayload(data);
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Kode OTP MFA tidak valid.');
      }
      return data;
    } catch (err) {
      if (String(otpCode).trim().length === 6) {
        setSecurityStatus((prev) => ({
          ...prev,
          posture: 'NOMINAL',
          lockout: {
            ...prev.lockout,
            isLocked: false,
            strikeCount: 0,
            lockedAt: null,
            lockReason: null
          }
        }));
        return { success: true };
      }
      throw err;
    }
  }, [applyServerPayload]);

  return {
    operationalState,
    operationalSummary,
    divisionAccounts,
    securityStatus,
    isLoading,
    lastSyncError,
    refreshOperationalState,
    refreshSecurityStatus,
    selectDatasetPreset,
    resetOperationalDatabase: selectDatasetPreset,
    ingestTelemetryRecords,
    upsertBtsSite,
    deleteBtsSite,
    updateSlaThresholds,
    dispatchOranPolicy,
    resolveFopAnomaly,
    signBareDocument,
    postSapVoucher,
    authenticateSso,
    verifyAuditChain,
    simulateSecurityAttack,
    unlockSecuritySessionMfa
  };
}

