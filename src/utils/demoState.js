/**
 * @typedef {Object} SimulationState
 * @property {number} simHour - Current hour in 24-hour simulation cycle (0-23)
 * @property {string} simTimeString - Formatted time string (e.g. '14:00 WIB')
 * @property {string} scenarioKey - Active scenario identifier (e.g. 'normal', 'heatwave', 'emergency')
 * @property {boolean} emergencyActive - Flag indicating if emergency safety protocol scenario is engaged
 * @property {number|null} [tempC] - Temperature override in Celsius
 * @property {number|null} [trafficMultiplier] - Multiplier for network traffic load
 * @property {boolean|null} [carrierSleepActive] - Forced carrier sleep mode state
 * @property {number|null} [plnTariffIDR] - Custom PLN electricity tariff in IDR/kWh
 */

export const INITIAL_SIMULATION_STATE = Object.freeze({
  simHour: 14,
  simTimeString: '14:00 WIB',
  scenarioKey: 'normal',
  emergencyActive: false,
});

/**
 * Returns a fresh, independent copy of the initial simulation state.
 *
 * @returns {SimulationState}
 */
export function createInitialSimulationState() {
  return { ...INITIAL_SIMULATION_STATE };
}

/**
 * Checks if the given keyboard event target is an interactive or editable input element,
 * indicating that global shortcut listeners should be suppressed.
 *
 * @param {EventTarget|Element|null} target - DOM element receiving keyboard events
 * @returns {boolean} True if the target is editable or inside an editable field
 */
export function isShortcutTargetEditable(target) {
  if (!target) return false;
  const tagName = target.tagName?.toUpperCase();
  return ['INPUT', 'TEXTAREA', 'SELECT'].includes(tagName)
    || target.isContentEditable === true
    || Boolean(target.closest?.('[contenteditable="true"], [role="textbox"]'));
}

/**
 * Resolves the appropriate tab ID when switching presentation view modes.
 *
 * @param {string} tab - Desired or current tab ID
 * @param {'executive'|'engineering'} mode - Presentation view mode
 * @returns {string} Safe resolved tab ID
 */
export function resolveTabForMode(tab, mode) {
  const executiveTabs = new Set(['overview', 'pilotvalidation', 'scenariolab', 'financial', 'esg']);
  const engineeringTabs = new Set(['digitaltwin', 'agents', 'telemetry', 'optimization', 'architecture']);
  if (mode === 'executive' && !executiveTabs.has(tab)) return 'overview';
  if (mode === 'engineering' && executiveTabs.has(tab)) return tab;
  return engineeringTabs.has(tab) || executiveTabs.has(tab) ? tab : 'overview';
}
