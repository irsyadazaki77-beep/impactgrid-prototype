import { describe, expect, it } from 'vitest';
import { createInitialSimulationState, isShortcutTargetEditable, resolveTabForMode } from '../src/utils/demoState.js';

describe('demo state helpers', () => {
  it('returns independent fresh copies of the initial simulation state', () => {
    const first = createInitialSimulationState();
    const second = createInitialSimulationState();
    first.simHour = 2;
    expect(second.simHour).toBe(14);
    expect(second).toMatchObject({ scenarioKey: 'normal', emergencyActive: false });
    expect(second).not.toHaveProperty('tempC');
  });

  it.each(['INPUT', 'TEXTAREA', 'SELECT'])('disables shortcuts for %s elements', (tagName) => {
    expect(isShortcutTargetEditable({ tagName })).toBe(true);
  });

  it('disables shortcuts for editable regions and textbox roles', () => {
    expect(isShortcutTargetEditable({ isContentEditable: true })).toBe(true);
    expect(isShortcutTargetEditable({ closest: (selector) => selector.includes('role="textbox"') ? {} : null })).toBe(true);
    expect(isShortcutTargetEditable({ tagName: 'DIV' })).toBe(false);
    expect(isShortcutTargetEditable(null)).toBe(false);
  });

  it('keeps the selected tab valid when switching presentation modes', () => {
    expect(resolveTabForMode('architecture', 'executive')).toBe('overview');
    expect(resolveTabForMode('telemetry', 'engineering')).toBe('telemetry');
    expect(resolveTabForMode('financial', 'engineering')).toBe('financial');
    expect(resolveTabForMode('unknown', 'engineering')).toBe('overview');
  });
});
