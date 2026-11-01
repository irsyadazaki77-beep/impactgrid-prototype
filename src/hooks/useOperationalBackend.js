import { useState, useEffect, useCallback } from 'react';
import { saveStoredSsoSession } from '../utils/storageEngine';

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

export function useOperationalBackend() {
  const [operationalState, setOperationalState] = useState(null);
  const [operationalSummary, setOperationalSummary] = useState(DEFAULT_FALLBACK_SUMMARY);
  const [divisionAccounts, setDivisionAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSyncError, setLastSyncError] = useState(null);

  const applyServerPayload = useCallback((data) => {
    if (!data) return;
    if (data.state) setOperationalState(data.state);
    if (data.summary) setOperationalSummary(data.summary);
    if (Array.isArray(data.divisionAccounts)) setDivisionAccounts(data.divisionAccounts);
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

  useEffect(() => {
    void refreshOperationalState();
  }, [refreshOperationalState]);

  const selectDatasetPreset = useCallback(async (presetKey = 'jamali50') => {
    try {
      const res = await fetch('/api/v1/operations/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ presetKey })
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
    const res = await fetch('/api/v1/telemetry/ingest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        batch_id: batchId,
        source,
        records,
        persist_to_inventory: true,
        replace_inventory: replaceInventory
      })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Gagal mengingesti batch telemetri.');
    }
    applyServerPayload(data);
    return data;
  }, [applyServerPayload]);

  const upsertBtsSite = useCallback(async (sitePayload, actor = 'NOC Engineer') => {
    const res = await fetch('/api/v1/sites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ site: sitePayload, actor })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Gagal menyimpan site BTS.');
    }
    applyServerPayload(data);
    return data;
  }, [applyServerPayload]);

  const deleteBtsSite = useCallback(async (siteId, actor = 'NOC Engineer') => {
    const res = await fetch(`/api/v1/sites/${encodeURIComponent(siteId)}?actor=${encodeURIComponent(actor)}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Gagal menghapus site BTS.');
    }
    applyServerPayload(data);
    return data;
  }, [applyServerPayload]);

  const updateSlaThresholds = useCallback(async (thresholdsPatch, actor = 'O-RAN Engineer') => {
    const res = await fetch('/api/v1/sla-thresholds', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...thresholdsPatch, actor })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Gagal menyimpan kalibrasi SLA.');
    }
    applyServerPayload(data);
    return data;
  }, [applyServerPayload]);

  const dispatchOranPolicy = useCallback(async (policyPayload) => {
    const res = await fetch('/api/v1/oran/policy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(policyPayload)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Gagal mengeksekusi policy O-RAN.');
    }
    applyServerPayload(data);
    return data;
  }, [applyServerPayload]);

  const resolveFopAnomaly = useCallback(async (fopPayload) => {
    const res = await fetch('/api/v1/fop/resolve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fopPayload)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Gagal menyelesaikan tiket FOP.');
    }
    applyServerPayload(data);
    return data;
  }, [applyServerPayload]);

  const signBareDocument = useCallback(async (barePayload) => {
    const res = await fetch('/api/v1/bare/sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(barePayload)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Gagal menandatangani dokumen BA-RE.');
    }
    applyServerPayload(data);
    return data;
  }, [applyServerPayload]);

  const postSapVoucher = useCallback(async (sapPayload) => {
    const res = await fetch('/api/v1/sap/post-voucher', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sapPayload)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Gagal mem-posting voucher SAP S/4HANA.');
    }
    applyServerPayload(data);
    return data;
  }, [applyServerPayload]);

  const authenticateSso = useCallback(async (authPayload) => {
    const res = await fetch('/api/v1/auth/sso', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(authPayload)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Gagal melakukan autentikasi SSO Telkomsel.');
    }
    if (data.session) {
      saveStoredSsoSession(data.session);
    }
    await refreshOperationalState();
    return data;
  }, [refreshOperationalState]);

  return {
    operationalState,
    operationalSummary,
    divisionAccounts,
    isLoading,
    lastSyncError,
    refreshOperationalState,
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
    authenticateSso
  };
}
