import { describe, it, expect } from 'vitest';
import { DID_ANALYSIS_DATA, ESG_COMPLIANCE_STANDARDS, KPI_SUMMARY, PILOT_SITES_SAMPLE, SYSTEM_METADATA } from '../src/data/mockData.js';

describe('demo data boundaries', () => {
  it('does not represent proposed pilot locations as measured sample data', () => {
    expect(PILOT_SITES_SAMPLE).toEqual([]);
    expect(KPI_SUMMARY.proposedInterventionSites).toBe(40);
    expect(KPI_SUMMARY.proposedComparisonSites).toBe(10);
    expect(KPI_SUMMARY.validatedSiteBaselineKWh).toBeNull();
  });

  it('keeps pilot impact and evidence metrics explicitly unavailable', () => {
    expect(DID_ANALYSIS_DATA.status).toBe('NOT_AVAILABLE');
    expect(DID_ANALYSIS_DATA.interventionCount).toBeNull();
    expect(DID_ANALYSIS_DATA.isolatedEnergySavedKWh).toBeNull();
    expect(DID_ANALYSIS_DATA.isolatedEmissionsReducedTon).toBeNull();
    expect(DID_ANALYSIS_DATA.pValue).toBeNull();
  });

  it('does not label ESG standards as compliant before review', () => {
    expect(ESG_COMPLIANCE_STANDARDS.length).toBeGreaterThan(0);
    expect(ESG_COMPLIANCE_STANDARDS.every((item) => item.complianceScore === 'Belum dinilai')).toBe(true);
  });

  it('keeps energy tariff as an illustrative input and emission factor unknown', () => {
    expect(SYSTEM_METADATA.electricityTariff).toBe(1500);
    expect(SYSTEM_METADATA.gridEmissionFactor).toBeNull();
  });
});
