export const INITIAL_SIMULATION_STATE = Object.freeze({
  simHour: 14,
  simTimeString: '14:00 WIB',
  scenarioKey: 'normal',
  emergencyActive: false,
});

export function createInitialSimulationState() {
  return { ...INITIAL_SIMULATION_STATE };
}

export function isShortcutTargetEditable(target) {
  if (!target) return false;
  const tagName = target.tagName?.toUpperCase();
  return ['INPUT', 'TEXTAREA', 'SELECT'].includes(tagName)
    || target.isContentEditable === true
    || Boolean(target.closest?.('[contenteditable="true"], [role="textbox"]'));
}

export function resolveTabForMode(tab, mode) {
  const executiveTabs = new Set(['overview', 'pilotvalidation', 'scenariolab', 'financial', 'esg']);
  const engineeringTabs = new Set(['digitaltwin', 'agents', 'telemetry', 'optimization', 'architecture']);
  if (mode === 'executive' && !executiveTabs.has(tab)) return 'overview';
  if (mode === 'engineering' && executiveTabs.has(tab)) return tab;
  return engineeringTabs.has(tab) || executiveTabs.has(tab) ? tab : 'overview';
}
