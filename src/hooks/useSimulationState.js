import { useState, useEffect, useCallback } from 'react';
import { createInitialSimulationState } from '../utils/demoState';

/**
 * Custom hook to manage executive simulation state, auto simulation interval,
 * and parametric sandbox what-if parameters.
 *
 * @returns {{
 *   simState: import('../utils/demoState').SimulationState,
 *   setSimState: import('react').Dispatch<import('react').SetStateAction<import('../utils/demoState').SimulationState>>,
 *   autoSim: boolean,
 *   setAutoSim: import('react').Dispatch<import('react').SetStateAction<boolean>>,
 *   simulationMode: 'STRICT_AUDIT'|'PARAMETRIC_SANDBOX',
 *   setSimulationMode: import('react').Dispatch<import('react').SetStateAction<'STRICT_AUDIT'|'PARAMETRIC_SANDBOX'>>,
 *   sandboxParams: {
 *     targetEfficiencyPct: number,
 *     siteCount: number,
 *     tariffPerKWh: number,
 *     capexPerSiteIDR: number
 *   },
 *   setSandboxParams: import('react').Dispatch<import('react').SetStateAction<{
 *     targetEfficiencyPct: number,
 *     siteCount: number,
 *     tariffPerKWh: number,
 *     capexPerSiteIDR: number
 *   }>>,
 *   toggleSimulationMode: () => void,
 *   setScenario: (scenarioKey: string) => void,
 *   stepHour: (delta: number) => void,
 *   toggleAutoSim: () => void,
 *   toggleEmergency: (forceState?: boolean) => void,
 *   resetSimulation: () => void
 * }}
 */
export function useSimulationState() {
  const [simState, setSimState] = useState(createInitialSimulationState);
  const [autoSim, setAutoSim] = useState(false);
  const [simulationMode, setSimulationMode] = useState('STRICT_AUDIT');
  const [sandboxParams, setSandboxParams] = useState({
    targetEfficiencyPct: 8.5,
    siteCount: 40,
    tariffPerKWh: 1500,
    capexPerSiteIDR: 25000000,
  });

  useEffect(() => {
    let interval = null;
    if (autoSim) {
      interval = setInterval(() => {
        setSimState((prev) => {
          const nextHour = (prev.simHour + 1) % 24;
          return {
            ...prev,
            simHour: nextHour,
            simTimeString: `${String(nextHour).padStart(2, '0')}:00 WIB`,
          };
        });
      }, 1400);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoSim]);

  const toggleSimulationMode = useCallback(() => {
    setSimulationMode((prev) => (prev === 'STRICT_AUDIT' ? 'PARAMETRIC_SANDBOX' : 'STRICT_AUDIT'));
  }, []);

  const setScenario = useCallback((scenarioKey) => {
    setSimState((prev) => ({
      ...prev,
      scenarioKey,
      tempC: null,
      trafficMultiplier: null,
      carrierSleepActive: null,
      plnTariffIDR: null,
      emergencyActive: scenarioKey === 'emergency' ? true : prev.emergencyActive,
    }));
  }, []);

  const stepHour = useCallback((delta) => {
    setSimState((prev) => {
      const nextHour = (((prev.simHour + delta) % 24) + 24) % 24;
      return {
        ...prev,
        simHour: nextHour,
        simTimeString: `${String(nextHour).padStart(2, '0')}:00 WIB`,
      };
    });
  }, []);

  const toggleAutoSim = useCallback(() => {
    setAutoSim((prev) => !prev);
  }, []);

  const toggleEmergency = useCallback((forceState) => {
    setSimState((prev) => {
      const nextEmergency = typeof forceState === 'boolean' ? forceState : !prev.emergencyActive;
      return {
        ...prev,
        emergencyActive: nextEmergency,
        scenarioKey: nextEmergency ? 'emergency' : (prev.scenarioKey === 'emergency' ? 'normal' : prev.scenarioKey),
      };
    });
  }, []);

  const resetSimulation = useCallback(() => {
    setSimState(createInitialSimulationState());
    setAutoSim(false);
    setSimulationMode('STRICT_AUDIT');
    setSandboxParams({
      targetEfficiencyPct: 8.5,
      siteCount: 40,
      tariffPerKWh: 1500,
      capexPerSiteIDR: 25000000,
    });
  }, []);

  return {
    simState,
    setSimState,
    autoSim,
    setAutoSim,
    simulationMode,
    setSimulationMode,
    sandboxParams,
    setSandboxParams,
    toggleSimulationMode,
    setScenario,
    stepHour,
    toggleAutoSim,
    toggleEmergency,
    resetSimulation,
  };
}

export default useSimulationState;
