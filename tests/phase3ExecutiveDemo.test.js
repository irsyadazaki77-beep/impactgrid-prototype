import { describe, it, expect } from 'vitest';
import { PILOT_SITES_SAMPLE, SYSTEM_METADATA } from '../src/data/mockData';

describe('Phase 3 Executive & Live Demo Test Suite', () => {
  it('should have 50 sample sites total (40 intervention, 10 control)', () => {
    expect(PILOT_SITES_SAMPLE.length).toBe(50);
    const interventions = PILOT_SITES_SAMPLE.filter(s => s.type === 'Intervensi');
    const controls = PILOT_SITES_SAMPLE.filter(s => s.type.includes('Pembanding') || s.type.includes('Kontrol'));
    expect(interventions.length).toBe(40);
    expect(controls.length).toBe(10);
  });

  it('should guarantee emergency 112 wake-up latency constraint (< 120ms)', () => {
    PILOT_SITES_SAMPLE.forEach(site => {
      // 3GPP Rel-18 micro-sleep latency constraint
      expect(site.latencyDeltaMs).toBeLessThanOrEqual(120);
    });
  });

  it('should verify SLA availability is maintained at safe levels across all sites (>= 99.9%)', () => {
    PILOT_SITES_SAMPLE.forEach(site => {
      expect(site.qosSLA).toBeDefined();
      const numMatch = parseFloat(site.qosSLA.replace('%', ''));
      expect(numMatch).toBeGreaterThanOrEqual(99.9);
    });
  });

  it('should ensure positive financial net benefit across all intervention sites', () => {
    const interventions = PILOT_SITES_SAMPLE.filter(s => s.type === 'Intervensi');
    interventions.forEach(site => {
      expect(site.netAnnualBenefitIDR).toBeGreaterThan(0);
      expect(site.savedKWh).toBeGreaterThan(0);
      expect(site.emissionsReducedTon).toBeGreaterThan(0);
    });
  });

  it('should verify baseline PLN tariff is set correctly', () => {
    expect(SYSTEM_METADATA.electricityTariff).toBe(1500);
    expect(SYSTEM_METADATA.gridEmissionFactor).toBe(0.87);
  });
});
