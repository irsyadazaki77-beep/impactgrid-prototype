import { useEffect } from 'react';
import { isShortcutTargetEditable, resolveTabForMode } from '../utils/demoState';

/**
 * Tab order mappings for numeric 1-5 keys
 */
const EXECUTIVE_TAB_ORDER = ['overview', 'pilotvalidation', 'scenariolab', 'financial', 'esg'];
const ENGINEERING_TAB_ORDER = ['digitaltwin', 'agents', 'telemetry', 'optimization', 'architecture'];

/**
 * Custom hook to register presenter & application keyboard shortcuts.
 *
 * @param {Object} params
 * @param {boolean} [params.disabled=false]
 * @param {string} params.viewMode - 'executive' | 'engineering'
 * @param {string} params.activeTab
 * @param {(tabId: string) => void} params.onNavigateTab
 * @param {(viewMode: string) => void} params.onChangeViewMode
 * @param {() => void} [params.onToggleAutoSim]
 * @param {() => void} [params.onResetDemo]
 * @param {() => void} [params.onToggleSimBar]
 * @param {() => void} [params.onOpenShortcuts]
 * @param {() => void} [params.onOpenCopilot]
 * @param {() => void} [params.onOpenExport]
 * @param {() => void} [params.onTogglePitch]
 * @param {() => void} [params.onOpenTour]
 * @param {() => void} [params.onOpenEmergency]
 * @param {() => void} [params.onOpenMemo]
 * @param {() => void} [params.onOpenDefense]
 */
export function useKeyboardShortcuts({
  disabled = false,
  viewMode,
  activeTab,
  onNavigateTab,
  onChangeViewMode,
  onToggleAutoSim,
  onResetDemo,
  onToggleSimBar,
  onOpenShortcuts,
  onOpenCopilot,
  onOpenCommandPalette,
  onOpenProcurementBoq,
  onOpenJuryScorecard,
  onOpenExport,
  onTogglePitch,
  onOpenTour,
  onOpenEmergency,
  onOpenMemo,
  onOpenDefense,
}) {
  useEffect(() => {
    if (disabled) return undefined;

    const handleKeyDown = (e) => {
      // Wajib panggil isShortcutTargetEditable di baris paling awal
      if (isShortcutTargetEditable(e.target)) return;

      const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      const isCmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      // 1. Shift + ? : Membuka modal panduan pintasan ('shortcuts')
      if (e.shiftKey && (e.key === '?' || e.key === '/')) {
        e.preventDefault();
        onOpenShortcuts?.();
        return;
      }

      // 2. Cmd/Ctrl + Shift + R : Reset simulasi ke INITIAL_SIMULATION_STATE
      if (isCmdOrCtrl && e.shiftKey && (e.key === 'R' || e.key === 'r')) {
        e.preventDefault();
        onResetDemo?.();
        return;
      }

      // 3. Cmd/Ctrl + K : Membuka Global Command Palette ('commandPalette' atau fallback ke 'copilot')
      if (isCmdOrCtrl && !e.shiftKey && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        if (onOpenCommandPalette) {
          onOpenCommandPalette();
        } else {
          onOpenCopilot?.();
        }
        return;
      }

      // 4. Cmd/Ctrl + E : Membuka modal ekspor laporan/audit ('export')
      if (isCmdOrCtrl && !e.shiftKey && (e.key === 'e' || e.key === 'E')) {
        e.preventDefault();
        onOpenExport?.();
        return;
      }

      // Ignore other shortcuts when Ctrl / Cmd / Alt is pressed
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;

      // 5. Space : Toggle autoSim (cegah scroll halaman dengan event.preventDefault())
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        onToggleAutoSim?.();
        return;
      }

      // 6. E / G : Mengubah viewMode ke 'executive' (E) atau 'engineering' (G)
      // serta menyelaraskan activeTab menggunakan resolveTabForMode(activeTab, targetMode)
      const keyLower = e.key.toLowerCase();
      if (keyLower === 'e') {
        if (onChangeViewMode) {
          const targetMode = 'executive';
          onChangeViewMode(targetMode);
          const nextTab = resolveTabForMode(activeTab, targetMode);
          if (nextTab !== activeTab) {
            onNavigateTab(nextTab);
          }
        }
        // Juga toggle simulation bar jika disediakan (pertahankan kompatibilitas)
        onToggleSimBar?.();
        return;
      }

      if (keyLower === 'g') {
        if (onChangeViewMode) {
          const targetMode = 'engineering';
          onChangeViewMode(targetMode);
          const nextTab = resolveTabForMode(activeTab, targetMode);
          if (nextTab !== activeTab) {
            onNavigateTab(nextTab);
          }
        }
        return;
      }

      // 7. Pemetaan Pintasan Tab 1-9, 0, dan V
      if (e.key === '1') {
        onNavigateTab('overview');
        return;
      }
      if (keyLower === 'v') {
        onNavigateTab('pilotvalidation');
        return;
      }
      if (e.key === '2') {
        onNavigateTab(viewMode === 'engineering' ? 'digitaltwin' : 'pilotvalidation');
        return;
      }
      if (e.key === '3') {
        onNavigateTab(viewMode === 'engineering' ? 'agents' : 'scenariolab');
        return;
      }
      if (e.key === '4') {
        onNavigateTab(viewMode === 'engineering' ? 'telemetry' : 'financial');
        return;
      }
      if (e.key === '5') {
        onNavigateTab('scenariolab');
        return;
      }
      if (e.key === '6') {
        onNavigateTab('optimization');
        return;
      }
      if (e.key === '7') {
        onNavigateTab('esg');
        return;
      }
      if (e.key === '8') {
        onNavigateTab('financial');
        return;
      }
      if (e.key === '9' || e.key === '0') {
        onNavigateTab('architecture');
        return;
      }
      if (keyLower === 'w') {
        onTogglePitch?.();
        return;
      }
      if (keyLower === 't') {
        onOpenTour?.();
        return;
      }
      if (keyLower === 's') {
        onOpenEmergency?.();
        return;
      }
      if (keyLower === 'p') {
        onOpenMemo?.();
        return;
      }
      if (keyLower === 'q') {
        onOpenDefense?.();
        return;
      }
      if (keyLower === 'a') {
        onOpenCopilot?.();
        return;
      }
      if (keyLower === 'b') {
        onOpenProcurementBoq?.();
        return;
      }
      if (keyLower === 'j') {
        onOpenJuryScorecard?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    disabled,
    viewMode,
    activeTab,
    onNavigateTab,
    onChangeViewMode,
    onToggleAutoSim,
    onResetDemo,
    onToggleSimBar,
    onOpenShortcuts,
    onOpenCopilot,
    onOpenCommandPalette,
    onOpenProcurementBoq,
    onOpenJuryScorecard,
    onOpenExport,
    onTogglePitch,
    onOpenTour,
    onOpenEmergency,
    onOpenMemo,
    onOpenDefense,
  ]);
}

export default useKeyboardShortcuts;
