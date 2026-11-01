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

      // 7. 1 s/d 5 : Mengubah activeTab sesuai urutan tab pada viewMode yang sedang aktif
      if (['1', '2', '3', '4', '5'].includes(e.key)) {
        const index = parseInt(e.key, 10) - 1;
        const currentOrder = viewMode === 'engineering' ? ENGINEERING_TAB_ORDER : EXECUTIVE_TAB_ORDER;
        const targetTab = currentOrder[index];
        if (targetTab) {
          onNavigateTab(targetTab);
        }
        return;
      }

      // 8. Pintasan presenter eksisting lainnya (v, 6-9, w, t, s, p, q, a, b, k)
      if (keyLower === 'v') {
        onNavigateTab('pilotvalidation');
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
      if (e.key === '9') {
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
