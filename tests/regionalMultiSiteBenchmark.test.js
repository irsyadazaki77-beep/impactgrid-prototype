import { describe, it, expect } from 'vitest';
import { EXTENDED_REGIONAL_SITES } from '../src/components/RegionalMultiSiteBenchmark';

describe('Regional Multi-Site Benchmark Catalog & Calculations', () => {
  it('contains at least 6 diverse regional Telkomsel sites', () => {
    expect(EXTENDED_REGIONAL_SITES.length).toBeGreaterThanOrEqual(6);
    const siteIds = EXTENDED_REGIONAL_SITES.map(s => s.id);
    expect(siteIds).toContain('BDG-DGO-P04');
    expect(siteIds).toContain('JKT-SEL-P01');
    expect(siteIds).toContain('SBY-GUB-P02');
    expect(siteIds).toContain('BGR-SNT-P03');
    expect(siteIds).toContain('DPS-KUT-P05');
    expect(siteIds).toContain('MKS-PAN-P06');
  });

  it('verifies that each site has positive power savings and valid PUE improvement', () => {
    EXTENDED_REGIONAL_SITES.forEach(site => {
      expect(site.baselinePowerKw).toBeGreaterThan(site.optimizedPowerKw);
      expect(site.pueBaseline).toBeGreaterThan(site.pueOptimized);
      expect(site.co2BaselineTonsYear).toBeGreaterThan(site.co2OptimizedTonsYear);
      expect(site.capexRoiMonths).toBeGreaterThan(0);
      expect(site.tariffRate).toBeGreaterThan(0);
    });
  });

  it('identifies Jakarta Selatan (JKT-SEL-P01) as having the fastest payback period', () => {
    const sortedByRoi = [...EXTENDED_REGIONAL_SITES].sort((a, b) => a.capexRoiMonths - b.capexRoiMonths);
    expect(sortedByRoi[0].id).toBe('JKT-SEL-P01');
    expect(sortedByRoi[0].capexRoiMonths).toBeLessThanOrEqual(6.0);
  });
});
