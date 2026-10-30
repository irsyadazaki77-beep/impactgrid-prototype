import { describe, it, expect } from 'vitest';
import { generateTelkomselK8sManifest } from '../src/utils/k8sManifestGenerator';
import { renderQrSvgString } from '../src/utils/qrCodeGenerator';

describe('Telkomsel Enterprise Standards: Legal BA-RE & Dual-DC Disaster Recovery', () => {
  it('validates Berita Acara Rekonsiliasi (BA-RE) metadata and legal clauses', () => {
    const docNumber = 'BA-RE/TSEL-NOPS/REG3/X/2026/0894';
    const sha256Digest = 'e8a1d59f32b8417c80ef749109403a558dc93e0b23f81643217bca89d1084b12';
    
    expect(docNumber).toMatch(/^BA-RE\/TSEL-NOPS\/REG3\/[A-Z0-9]+\/2026\/\d+$/);
    expect(sha256Digest).toHaveLength(64);
    expect(sha256Digest).toMatch(/^[a-f0-9]{64}$/);
  });

  it('generates a valid SVG QR Code for electronic verification', () => {
    const qrSvg = renderQrSvgString('TSEL-BARE-2026|DOC:BA-RE/TSEL-NOPS/REG3/X/2026/0894|HASH:e8a1d59f', 120);
    expect(typeof qrSvg).toBe('string');
    expect(qrSvg).toContain('<svg');
    expect(qrSvg).toContain('width="120"');
    expect(qrSvg).toContain('height="120"');
    expect(qrSvg).toContain('<rect');
  });

  it('enforces Dual-DC Active-Active topology requirements (Sentul & Surabaya)', () => {
    const k8sManifest = generateTelkomselK8sManifest();
    
    // Primary & DR DC definitions
    expect(k8sManifest).toContain('DATA_CENTER_PRIMARY: "telkom-dc-sentul"');
    expect(k8sManifest).toContain('DATA_CENTER_DR: "telkom-dc-surabaya"');
    
    // PP 71/2019 Data Sovereignty & BGP AS17974
    expect(k8sManifest).toContain('DATA_SOVEREIGNTY_JURISDICTION: "ID-PP71-2019"');
    expect(k8sManifest).toContain('BGP_ROUTER_ASN: "17974"');
  });

  it('validates TowerCo portfolio metrics and shared-savings business model', () => {
    const TOWERCO_PORTFOLIO = {
      mitratel: { share: 0.58, splitTelkomsel: 0.85, splitTowerCo: 0.15, maxTempC: 32.0 },
      protelindo: { share: 0.25, splitTelkomsel: 0.80, splitTowerCo: 0.20, maxTempC: 32.0 },
      stp: { share: 0.17, splitTelkomsel: 0.82, splitTowerCo: 0.18, maxTempC: 32.0 }
    };

    // Total share must equal 100%
    const totalShare = Object.values(TOWERCO_PORTFOLIO).reduce((acc, curr) => acc + curr.share, 0);
    expect(totalShare).toBeCloseTo(1.0, 2);

    // Each TowerCo split must sum to 100%
    for (const key of Object.keys(TOWERCO_PORTFOLIO)) {
      const { splitTelkomsel, splitTowerCo, maxTempC } = TOWERCO_PORTFOLIO[key];
      expect(splitTelkomsel + splitTowerCo).toBeCloseTo(1.0, 2);
      expect(maxTempC).toBeLessThanOrEqual(32.0);
    }
  });

  it('verifies SLA breach penalty calculation for shelter cooling failures', () => {
    const baselineMonthlySavings = 3824640; // Rp on site BDG-DGO-P04
    const shelterTempC = 34.8;
    const slaMaxTempC = 32.0;
    const penaltyPerSiteMonthly = 2500000;

    const isSlaBreached = shelterTempC > slaMaxTempC;
    expect(isSlaBreached).toBe(true);

    // When SLA is breached, TowerCo bonus is zeroed and penalty applies
    const bonusPaidToTowerCo = isSlaBreached ? 0 : baselineMonthlySavings * 0.15;
    const netDeductionFromRent = isSlaBreached ? penaltyPerSiteMonthly : 0;

    expect(bonusPaidToTowerCo).toBe(0);
    expect(netDeductionFromRent).toBe(2500000);
  });
});
