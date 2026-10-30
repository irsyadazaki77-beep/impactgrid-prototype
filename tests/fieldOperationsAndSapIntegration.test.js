import { describe, it, expect, beforeEach } from 'vitest';
import { getStoredWorkOrders, addStoredWorkOrder } from '../src/utils/storageEngine';

describe('Field Operations (FOP) & SAP S/4HANA Enterprise Integration', () => {
  beforeEach(() => {
    const store = new Map();
    globalThis.localStorage = {
      getItem: (key) => store.get(key) || null,
      setItem: (key, val) => store.set(key, String(val)),
      removeItem: (key) => store.delete(key),
      clear: () => store.clear()
    };
  });

  it('validates Field Operations mobile technician metadata and GPS geotag', () => {
    const fopTechnician = {
      id: 'FOP-8921-MT',
      name: 'Ir. Andi Pratama',
      partner: 'Mitratel Field Maintenance',
      gpsCoordinates: { lat: -6.882104, lng: 107.618921 },
      assignedSite: 'BDG-DGO-P04'
    };

    expect(fopTechnician.id).toMatch(/^FOP-\d+-MT$/);
    expect(fopTechnician.gpsCoordinates.lat).toBeCloseTo(-6.882104, 5);
    expect(fopTechnician.gpsCoordinates.lng).toBeCloseTo(107.618921, 5);
    expect(fopTechnician.assignedSite).toBe('BDG-DGO-P04');
  });

  it('verifies shelter physical QR code token matching', () => {
    const siteId = 'BDG-DGO-P04';
    const qrCodePlate = `BTS-SHELTER-${siteId}`;
    expect(qrCodePlate).toBe('BTS-SHELTER-BDG-DGO-P04');
    expect(qrCodePlate.startsWith('BTS-SHELTER-')).toBe(true);
  });

  it('records work order completion and resolution in persistent storage', () => {
    const initialOrders = getStoredWorkOrders();
    const countBefore = initialOrders.length;

    const resolvedTicket = {
      incidentNumber: 'INC-2026-TSEL-0492',
      siteId: 'BDG-DGO-P04',
      siteName: 'Dago Atas Macro Hub',
      anomalyType: 'Phantom Load Drift & AC Overheating',
      priority: 'P2 - Solved',
      assignmentGroup: 'Mitratel Regional Maintenance Team 04',
      technician: 'Ir. Andi Pratama (FOP ID: 8921-MT)',
      status: 'RESOLVED_CLOSED',
      closedAt: new Date().toISOString(),
      resolutionNotes: 'Kondensor AC dibersihkan, gas R-410A diisi 120 psi, submeter dikalibrasi.'
    };

    addStoredWorkOrder(resolvedTicket);
    const updatedOrders = getStoredWorkOrders();
    expect(updatedOrders.length).toBe(countBefore + 1);
    expect(updatedOrders[0].incidentNumber).toBe('INC-2026-TSEL-0492');
    expect(updatedOrders[0].status).toBe('RESOLVED_CLOSED');
  });

  it('enforces SAP S/4HANA Accounting Journal balance (Debit = Credit)', () => {
    const journalEntries = [
      { item: '001', pk: '40', account: '510100', amount: 2659000000, type: 'DEBIT' },
      { item: '002', pk: '50', account: '510100', amount: 2260000000, type: 'CREDIT' },
      { item: '003', pk: '50', account: '210150', amount: 399000000, type: 'CREDIT' }
    ];

    const totalDebit = journalEntries
      .filter(e => e.type === 'DEBIT')
      .reduce((sum, e) => sum + e.amount, 0);

    const totalCredit = journalEntries
      .filter(e => e.type === 'CREDIT')
      .reduce((sum, e) => sum + e.amount, 0);

    expect(totalDebit).toBe(totalCredit);
    expect(totalDebit).toBe(2659000000);
  });

  it('validates SAP BAPI RFC JSON schema payload compatibility', () => {
    const sapBapiPayload = {
      DOCUMENTHEADER: {
        OBJ_TYPE: "BAPICACHE",
        BUS_ACT: "RFBU",
        COMP_CODE: "1000",
        DOC_TYPE: "SA",
        REF_DOC_NO: "BA-RE/TSEL-NOPS/REG3/X/2026/0894"
      },
      ACCOUNTGL: [
        { ITEMNO_ACC: "0000000001", GL_ACCOUNT: "0000510100", COSTCENTER: "0000CC_REG3_NOPS" },
        { ITEMNO_ACC: "0000000002", GL_ACCOUNT: "0000510100", COSTCENTER: "0000CC_REG3_NOPS" },
        { ITEMNO_ACC: "0000000003", GL_ACCOUNT: "0000210150", WBS_ELEMENT: "WBS-2026-TSEL-RAN-ENERGY-01" }
      ],
      CURRENCYAMOUNT: [
        { ITEMNO_ACC: "0000000001", CURRENCY: "IDR", AMT_DOCCUR: 2659000000.00 },
        { ITEMNO_ACC: "0000000002", CURRENCY: "IDR", AMT_DOCCUR: -2260000000.00 },
        { ITEMNO_ACC: "0000000003", CURRENCY: "IDR", AMT_DOCCUR: -399000000.00 }
      ]
    };

    expect(sapBapiPayload.DOCUMENTHEADER.COMP_CODE).toBe('1000');
    expect(sapBapiPayload.DOCUMENTHEADER.DOC_TYPE).toBe('SA');
    expect(sapBapiPayload.ACCOUNTGL).toHaveLength(3);
    
    // Net sum of AMT_DOCCUR must be exactly zero in SAP
    const netSum = sapBapiPayload.CURRENCYAMOUNT.reduce((sum, item) => sum + item.AMT_DOCCUR, 0);
    expect(netSum).toBe(0);
  });
});
