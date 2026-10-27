import { describe, it, expect } from 'vitest';
import { 
  SYNTHETIC_PILOT_SITES_50, 
  SIMULATED_CLUSTERS, 
  IMPLEMENTATION_HORIZONS, 
  INVESTMENT_PORTFOLIO_RECOMMENDATIONS,
  ESG_FRAMEWORK_DATA 
} from '../src/data/mockData.js';

describe('Comprehensive Master Plan: Data Foundation & Integrity', () => {
  it('validates synthetic pilot sites distribution (40 intervention + 10 control)', () => {
    expect(SYNTHETIC_PILOT_SITES_50).toHaveLength(50);

    const interventionSites = SYNTHETIC_PILOT_SITES_50.filter(s => s.group === 'intervention');
    const controlSites = SYNTHETIC_PILOT_SITES_50.filter(s => s.group === 'control');

    expect(interventionSites).toHaveLength(40);
    expect(controlSites).toHaveLength(10);

    // Verify all intervention sites have valid positive efficiency targets
    interventionSites.forEach(site => {
      expect(site.savingsPct).toBeGreaterThanOrEqual(10.0);
      expect(site.measuredDailyKWh).toBeLessThan(site.baselineDailyKWh);
      expect(site.lat).toBeLessThan(0); // Southern hemisphere (Indonesia)
      expect(site.lng).toBeGreaterThan(100); // Indonesia longitude
    });

    // Verify all control sites show baseline behaviour without intervention
    controlSites.forEach(site => {
      expect(site.savingsPct).toBeLessThan(1.5);
      expect(site.mode).toContain('Baseline');
    });

    // Verify all 50 sites protect QoS SLA (Call drop rate strictly below 0.20%)
    SYNTHETIC_PILOT_SITES_50.forEach(site => {
      const dropRateNum = parseFloat(site.qosDrop);
      expect(dropRateNum).toBeLessThan(0.20);
    });
  });

  it('validates 3 regional clusters in Jamali corridor', () => {
    expect(SIMULATED_CLUSTERS).toHaveLength(3);
    const totalClusterSites = SIMULATED_CLUSTERS.reduce((sum, c) => sum + c.count, 0);
    expect(totalClusterSites).toBe(50);

    const jkt = SIMULATED_CLUSTERS.find(c => c.id === 'jkt');
    const bdg = SIMULATED_CLUSTERS.find(c => c.id === 'bdg');
    const sby = SIMULATED_CLUSTERS.find(c => c.id === 'sby');

    expect(jkt.count).toBe(20);
    expect(bdg.count).toBe(15);
    expect(sby.count).toBe(15);
  });

  it('validates 3 implementation horizons from proposal tables 4 & 7', () => {
    const { pilot, regional, national } = IMPLEMENTATION_HORIZONS;

    // Pilot Horizon (2027)
    expect(pilot.totalSites).toBe(50);
    expect(pilot.capexIDR).toBe(450_000_000);
    expect(pilot.opexYearIDR).toBe(60_000_000);

    // Regional Horizon (2028-2029)
    expect(regional.sitesCount).toBe(5000);
    expect(regional.capexIDR).toBe(6_500_000_000);
    expect(regional.netBenefitYearIDR).toBe(4_800_000_000);
    expect(regional.paybackYears).toBe(1.35);
    expect(regional.npv5YearsIDR).toBe(11_700_000_000);
    expect(regional.savedGWhYear).toBe(5.80);
    expect(regional.emissionsReducedTon).toBe(5046);

    // National Horizon (2030-2031)
    expect(national.sitesCount).toBe(10000);
    expect(national.capexIDR).toBe(15_000_000_000);
    expect(national.netBenefitYearIDR).toBe(14_900_000_000);
    expect(national.paybackYears).toBe(1.00);
    expect(national.npv5YearsIDR).toBe(41_480_000_000);
    expect(national.savedGWhYear).toBe(14.60);
    expect(national.emissionsReducedTon).toBe(12702);
  });

  it('validates knapsack candidate portfolios and budget feasibility', () => {
    expect(INVESTMENT_PORTFOLIO_RECOMMENDATIONS).toHaveLength(3);

    const portA = INVESTMENT_PORTFOLIO_RECOMMENDATIONS[0];
    const portB = INVESTMENT_PORTFOLIO_RECOMMENDATIONS[1];

    // Combination of Portofolio A & B fits within Rp 450 Juta pilot CapEx
    const combinedCapEx = portA.capexIDR + portB.capexIDR;
    expect(combinedCapEx).toBeLessThanOrEqual(450_000_000);

    const combinedNetBenefit = portA.annualNetBenefitIDR + portB.annualNetBenefitIDR;
    expect(combinedNetBenefit).toBe(248_000_000);
    expect(combinedCapEx / combinedNetBenefit).toBeLessThan(2.0); // Simple payback < 2 years
  });

  it('validates ESG measurement framework standards compliance', () => {
    expect(ESG_FRAMEWORK_DATA).toHaveLength(3);
    const env = ESG_FRAMEWORK_DATA.find(d => d.dimension === 'Environmental');
    const soc = ESG_FRAMEWORK_DATA.find(d => d.dimension === 'Social');
    const gov = ESG_FRAMEWORK_DATA.find(d => d.dimension === 'Governance');

    expect(env.sdg).toContain('SDG 7');
    expect(soc.sdg).toContain('SDG 9');
    expect(gov.sdg).toContain('SDG 12');
    expect(env.methodology).toContain('Difference-in-Differences');
  });
});
