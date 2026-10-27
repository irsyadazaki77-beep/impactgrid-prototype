import { useState, useEffect, useCallback } from 'react';

const AUDIT_STORAGE_KEY = 'impactgrid_audit_logs_v1';

/**
 * @typedef {Object} AuditLogEntry
 * @property {string} id
 * @property {string} timestamp
 * @property {string} action
 * @property {string} detail
 * @property {string} category
 * @property {string} actor
 */

function loadAuditLogsFromStorage() {
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Return empty on storage or JSON parsing error
  }
  return [];
}

/**
 * Custom hook to manage persistent and immutable audit trail logs.
 *
 * @returns {{
 *   auditLogs: AuditLogEntry[],
 *   appendAuditLog: (entry: { action: string, detail?: string, category?: string, actor?: string }) => void,
 *   clearAuditLogs: () => void
 * }}
 */
export function useAuditTrail() {
  const [auditLogs, setAuditLogs] = useState(loadAuditLogsFromStorage);

  useEffect(() => {
    try {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(auditLogs));
    } catch {
      // Ignore storage write issues (quota/private browsing)
    }
  }, [auditLogs]);

  const appendAuditLog = useCallback(({ action, detail = '', category = 'GENERAL', actor = 'Executive User' }) => {
    const now = new Date();
    const entry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: now.toISOString(),
      action,
      detail,
      category,
      actor,
    };
    setAuditLogs((prev) => [entry, ...prev]);
  }, []);

  const clearAuditLogs = useCallback(() => {
    setAuditLogs([]);
    try {
      localStorage.removeItem(AUDIT_STORAGE_KEY);
    } catch {
      // Ignore storage remove errors
    }
  }, []);

  return {
    auditLogs,
    appendAuditLog,
    clearAuditLogs,
  };
}

export default useAuditTrail;
