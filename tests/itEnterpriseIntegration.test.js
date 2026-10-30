import { describe, it, expect } from 'vitest';
import { generateTelkomselK8sManifest } from '../src/utils/k8sManifestGenerator.js';

describe('Telkomsel Enterprise IT Integration & K8s Generator', () => {
  it('generates a complete multi-tier Kubernetes YAML manifest', () => {
    const yaml = generateTelkomselK8sManifest();
    expect(typeof yaml).toBe('string');
    expect(yaml).toContain('apiVersion: v1');
    expect(yaml).toContain('kind: Namespace');
    expect(yaml).toContain('name: impactgrid-telecom');
    expect(yaml).toContain('kind: ConfigMap');
    expect(yaml).toContain('kind: Deployment');
    expect(yaml).toContain('kind: Service');
    expect(yaml).toContain('kind: HorizontalPodAutoscaler');
    expect(yaml).toContain('kind: NetworkPolicy');
  });

  it('contains Telkomsel dual data-center and standard telecom configurations', () => {
    const yaml = generateTelkomselK8sManifest();
    expect(yaml).toContain('DATA_CENTER_PRIMARY: "telkom-dc-sentul"');
    expect(yaml).toContain('DATA_CENTER_DR: "telkom-dc-surabaya"');
    expect(yaml).toContain('TMF_API_GATEWAY_URL: "https://api.telkomsel.co.id/tmf-api"');
    expect(yaml).toContain('ORAN_O1_VES_COLLECTOR');
    expect(yaml).toContain('DATA_SOVEREIGNTY_JURISDICTION: "ID-PP71-2019"');
  });

  it('enforces hardened container security contexts compliant with CISO standards', () => {
    const yaml = generateTelkomselK8sManifest();
    expect(yaml).toContain('readOnlyRootFilesystem: true');
    expect(yaml).toContain('runAsNonRoot: true');
    expect(yaml).toContain('allowPrivilegeEscalation: false');
    expect(yaml).toContain('drop: ["ALL"]');
  });
});
