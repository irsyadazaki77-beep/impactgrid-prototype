import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { PRESENTATION_DURATION_SECONDS, PRESENTATION_STEPS } from '../src/data/presentationScript.js';

describe('executive presentation script', () => {
  it('matches all eight spoken sections in the official 7-minute script', () => {
    const official = readFileSync(new URL('../skrip_presentasi_7_menit_direktur.md', import.meta.url), 'utf8');
    const officialSections = [...official.matchAll(/^## [^\n]+\n\n"([\s\S]*?)"\s*$/gm)].map((match) => match[1]);
    const officialTimings = [...official.matchAll(/^## ([0-9:]+-[0-9:]+) \|/gm)].map((match) => match[1]);
    expect(PRESENTATION_STEPS.map((step) => step.script)).toEqual(officialSections);
    expect(PRESENTATION_STEPS.map((step) => step.timing.replaceAll('–', '-'))).toEqual(officialTimings);
  });

  it('covers exactly seven minutes with contiguous, ordered stages', () => {
    expect(PRESENTATION_STEPS).toHaveLength(8);
    expect(PRESENTATION_DURATION_SECONDS).toBe(420);
    expect(PRESENTATION_STEPS[0].startSeconds).toBe(0);
    expect(PRESENTATION_STEPS.at(-1).endSeconds).toBe(PRESENTATION_DURATION_SECONDS);
    PRESENTATION_STEPS.forEach((step, index) => {
      expect(step.step).toBe(index + 1);
      expect(step.endSeconds).toBeGreaterThan(step.startSeconds);
      if (index > 0) expect(step.startSeconds).toBe(PRESENTATION_STEPS[index - 1].endSeconds);
      expect(step.message).toBeTruthy();
      expect(step.visual).toBeTruthy();
      expect(step.evidence).toBeTruthy();
      expect(step.presenterNote).toBeTruthy();
    });
  });

  it('follows the requested executive story and stays in Executive tabs', () => {
    expect(PRESENTATION_STEPS.map(({ tab }) => tab)).toEqual([
      'overview', 'overview', 'scenariolab', 'scenariolab', 'pilotvalidation', 'financial', 'esg', 'pilotvalidation'
    ]);
    expect(PRESENTATION_STEPS[5].evidence).toContain('Rp450 jt');
    expect(PRESENTATION_STEPS[5].presenterNote).toContain('bukan forecast');
    expect(PRESENTATION_STEPS[7].message).toContain('audit');
  });
});
