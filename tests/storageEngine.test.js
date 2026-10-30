import { describe, expect, it, beforeEach } from 'vitest';
import { 
  getStoredWorkOrders, 
  addStoredWorkOrder, 
  resetStoredWorkOrders,
  getStoredSsoSession,
  saveStoredSsoSession,
  clearStoredSsoSession,
  getStoredAutonomousActions,
  appendStoredAutonomousAction,
  clearStoredAutonomousActions
} from '../src/utils/storageEngine';

describe('Enterprise Persistent Storage Engine', () => {
  beforeEach(() => {
    const store = new Map();
    globalThis.localStorage = {
      getItem: (key) => store.get(key) || null,
      setItem: (key, val) => store.set(key, String(val)),
      removeItem: (key) => store.delete(key),
      clear: () => store.clear(),
    };
  });

  it('initializes with default seed work orders when empty', () => {
    const orders = getStoredWorkOrders();
    expect(Array.isArray(orders)).toBe(true);
    expect(orders.length).toBeGreaterThanOrEqual(4);
    expect(orders[0].siteId).toBe('BDG-DGO-P04');
  });

  it('prepends newly added work orders to storage', () => {
    const initialCount = getStoredWorkOrders().length;
    const newOrder = {
      id: 'WO-TSEL-TEST-9999',
      siteId: 'TEST-SITE-01',
      siteName: 'Test BTS Macro',
      anomalyType: 'Power Factor Drift',
      priority: 'P2',
      status: 'Dispatched'
    };
    const updated = addStoredWorkOrder(newOrder);
    expect(updated.length).toBe(initialCount + 1);
    expect(updated[0].id).toBe('WO-TSEL-TEST-9999');
  });

  it('persists and clears Telkomsel IAM SSO sessions', () => {
    expect(getStoredSsoSession()).toBeNull();
    const session = {
      isAuthenticated: true,
      nik: '8810429',
      roleId: 'vp_network',
      name: 'Ir. Bambang Hariyanto'
    };
    saveStoredSsoSession(session);
    expect(getStoredSsoSession()?.nik).toBe('8810429');
    clearStoredSsoSession();
    expect(getStoredSsoSession()).toBeNull();
  });

  it('records and rotates autonomous O-RAN decision logs', () => {
    clearStoredAutonomousActions();
    expect(getStoredAutonomousActions().length).toBe(0);
    appendStoredAutonomousAction({
      id: 'ACT-TEST-01',
      siteId: 'BDG-01',
      action: 'Deep Sleep 2100MHz'
    });
    const actions = getStoredAutonomousActions();
    expect(actions.length).toBe(1);
    expect(actions[0].siteId).toBe('BDG-01');
  });
});
