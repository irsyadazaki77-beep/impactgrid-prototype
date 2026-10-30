import React, { lazy, memo, Suspense, useCallback, useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AppErrorBoundary from './components/AppErrorBoundary';
import GuidedPitchBar from './components/GuidedPitchBar';
import GlobalSimulationBar, { SIMULATION_SCENARIOS } from './components/GlobalSimulationBar';
import TabLoadingFallback from './components/TabLoadingFallback';
import { resolveTabForMode } from './utils/demoState';
import { useSimulationState } from './hooks/useSimulationState';
import { useAuditTrail } from './hooks/useAuditTrail';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { ENTERPRISE_ROLES } from './data/enterpriseRoles';
import { getStoredSsoSession } from './utils/storageEngine';

const KpiStatRow = memo(lazy(() => import('./components/KpiStatRow')));
const OverviewTab = memo(lazy(() => import('./components/OverviewTab')));
const PilotValidationCenterTab = memo(lazy(() => import('./components/PilotValidationCenterTab')));
const DigitalTwinTab = memo(lazy(() => import('./components/DigitalTwinTab')));
const AgentOrchestratorTab = memo(lazy(() => import('./components/AgentOrchestratorTab')));
const TelemetryTab = memo(lazy(() => import('./components/TelemetryTab')));
const ScenarioLabTab = memo(lazy(() => import('./components/ScenarioLabTab')));
const OptimizationTab = memo(lazy(() => import('./components/OptimizationTab')));
const ESGComplianceTab = memo(lazy(() => import('./components/ESGComplianceTab')));
const FinancialModelTab = memo(lazy(() => import('./components/FinancialModelTab')));
const ArchitectureTab = memo(lazy(() => import('./components/ArchitectureTab')));
const ReportModal = lazy(() => import('./components/ReportModal'));
const DirectorTourModal = lazy(() => import('./components/DirectorTourModal'));
const EmergencyStressModal = lazy(() => import('./components/EmergencyStressModal'));
const ExecutiveMemoModal = lazy(() => import('./components/ExecutiveMemoModal'));
const BodDefenseModal = lazy(() => import('./components/BodDefenseModal'));
const AiCopilotModal = lazy(() => import('./components/AiCopilotModal'));
const ShortcutsModal = lazy(() => import('./components/ShortcutsModal'));
const QrShareModal = lazy(() => import('./components/QrShareModal'));
const TelkomselSsoModal = lazy(() => import('./components/TelkomselSsoModal'));
const OfficialBeritaAcaraModal = lazy(() => import('./components/OfficialBeritaAcaraModal'));
const FieldTechnicianConsoleModal = lazy(() => import('./components/FieldTechnicianConsoleModal'));
const SapAccountingVoucherModal = lazy(() => import('./components/SapAccountingVoucherModal'));

const TAB_IDS = ['overview', 'pilotvalidation', 'digitaltwin', 'agents', 'telemetry', 'scenariolab', 'optimization', 'esg', 'financial', 'architecture'];
const PRESENTATION_PREFLIGHT_ITEMS = [
  'Data telemetri dan simulasi terkalibrasi untuk kluster 50 site makro Telkomsel Jawa-Bali.',
  'Protokol fail-safe aktif: pemutusan simulasi instan jika terjadi permintaan prioritas 112.',
  'Operasi konsol mandiri (offline-first) dengan fallback engine analitik lokal berkinerja tinggi.',
  'Inisialisasi sesi akan menyinkronkan tab dan parameter operasional ke baseline terstandar.'
];

function ModalLoadingState() {
  return <div className="modal-module-loading" role="status">Memuat modul sistem…</div>;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loadedTabs, setLoadedTabs] = useState(() => new Set(['overview']));
  const [resetVersion, setResetVersion] = useState(0);
  const [viewMode, setViewMode] = useState('executive'); // 'executive' | 'engineering'
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('impactgrid-theme') || 'light'; } catch { return 'light'; }
  });
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDirectorTourOpen, setIsDirectorTourOpen] = useState(false);
  const [isPitchWalkthroughActive, setIsPitchWalkthroughActive] = useState(false);
  const [isPreflightOpen, setIsPreflightOpen] = useState(false);
  const [preflightChecks, setPreflightChecks] = useState(() => PRESENTATION_PREFLIGHT_ITEMS.map(() => false));
  const [pitchNotesExpanded, setPitchNotesExpanded] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isExecutiveMemoOpen, setIsExecutiveMemoOpen] = useState(false);
  const [isBodDefenseOpen, setIsBodDefenseOpen] = useState(false);
  const [isAiCopilotOpen, setIsAiCopilotOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [isQrShareOpen, setIsQrShareOpen] = useState(false);
  const [isSsoModalOpen, setIsSsoModalOpen] = useState(false);
  const [isOfficialBaReOpen, setIsOfficialBaReOpen] = useState(false);
  const [isFieldConsoleOpen, setIsFieldConsoleOpen] = useState(false);
  const [isSapVoucherOpen, setIsSapVoucherOpen] = useState(false);
  const [resolvedSites, setResolvedSites] = useState([]);

  const handleResolveSiteAnomaly = (siteId) => {
    setResolvedSites(prev => [...new Set([...prev, siteId])]);
  };
  const [ssoSession, setSsoSession] = useState(() => getStoredSsoSession());
  const [emergencyState, setEmergencyState] = useState({ active: false });
  const [selectedScale, setSelectedScale] = useState('pilot'); // 'pilot' | 'regional' | 'national'
  const [activeLens, setActiveLens] = useState('all'); // 'all' | 'finance' | 'network' | 'esg'
  const [currentRole, setCurrentRole] = useState('vp_network');
  const [isAutonomous, setIsAutonomous] = useState(false);

  // Live Executive Simulation Console & Audit Trail Custom Hooks
  const [isSimBarOpen, setIsSimBarOpen] = useState(false);
  const {
    simState,
    setSimState,
    autoSim,
    toggleAutoSim,
    simulationMode,
    toggleSimulationMode,
    resetSimulation
  } = useSimulationState();
  const { appendAuditLog, clearAuditLogs } = useAuditTrail();

  const [connectivityStatus, setConnectivityStatus] = useState(() => typeof navigator === 'undefined' || navigator.onLine ? 'checking' : 'offline');

  useEffect(() => {
    let isMounted = true;
    let controller;
    let probeGeneration = 0;
    const checkHost = async () => {
      const generation = ++probeGeneration;
      if (!navigator.onLine) {
        setConnectivityStatus('offline');
        return;
      }
      controller?.abort();
      const requestController = new AbortController();
      controller = requestController;
      const timeout = window.setTimeout(() => requestController.abort(), 2500);
      try {
        const response = await fetch(`${window.location.origin}/?impactgrid-connectivity=${Date.now()}`, {
          method: 'HEAD', cache: 'no-store', credentials: 'same-origin', signal: requestController.signal,
        });
        if (isMounted && generation === probeGeneration) setConnectivityStatus(response.ok ? 'reachable' : 'unreachable');
      } catch {
        if (isMounted && generation === probeGeneration) setConnectivityStatus(navigator.onLine ? 'unreachable' : 'offline');
      } finally {
        window.clearTimeout(timeout);
      }
    };
    const handleOffline = () => {
      probeGeneration += 1;
      controller?.abort();
      setConnectivityStatus('offline');
    };
    window.addEventListener('online', checkHost);
    window.addEventListener('offline', handleOffline);
    void checkHost();
    const probeInterval = window.setInterval(checkHost, 30_000);
    return () => {
      isMounted = false;
      probeGeneration += 1;
      controller?.abort();
      window.clearInterval(probeInterval);
      window.removeEventListener('online', checkHost);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const navigateToTab = useCallback((tabId) => {
    const nextTab = resolveTabForMode(tabId, viewMode);
    setActiveTab(nextTab);
    setLoadedTabs((tabs) => new Set(tabs).add(nextTab));
  }, [viewMode]);

  const changeViewMode = useCallback((nextMode) => {
    setViewMode(nextMode);
    if (nextMode === 'executive' && ['digitaltwin', 'agents', 'telemetry', 'optimization', 'architecture'].includes(activeTab)) {
      setActiveTab('overview');
      setLoadedTabs((tabs) => new Set(tabs).add('overview'));
    }
  }, [activeTab]);

  const handleRoleChange = useCallback((roleId) => {
    const role = ENTERPRISE_ROLES.find(r => r.id === roleId);
    if (!role) return;
    setCurrentRole(roleId);
    setViewMode(role.viewMode);
    setActiveLens(role.activeLens);
    if (role.preferredTab) {
      const nextTab = resolveTabForMode(role.preferredTab, role.viewMode);
      setActiveTab(nextTab);
      setLoadedTabs((tabs) => new Set(tabs).add(nextTab));
    }
    appendAuditLog({
      action: 'ROLE_SWITCH',
      detail: `IAM Session switched to ${role.title} (${role.department})`,
      category: 'SECURITY'
    });
  }, [appendAuditLog]);

  const resetDemo = useCallback(() => {
    resetSimulation();
    clearAuditLogs();
    setEmergencyState({ active: false });
    setSelectedScale('pilot');
    setActiveLens('all');
    setCurrentRole('vp_network');
    setIsAutonomous(false);
    setViewMode('executive');
    setActiveTab('overview');
    setLoadedTabs(new Set(['overview']));
    setIsSimBarOpen(false);
    setIsPitchWalkthroughActive(false);
    setIsPreflightOpen(false);
    setPitchNotesExpanded(false);
    setIsDirectorTourOpen(false);
    setIsEmergencyModalOpen(false);
    setIsExecutiveMemoOpen(false);
    setIsBodDefenseOpen(false);
    setIsAiCopilotOpen(false);
    setIsShortcutsModalOpen(false);
    setIsReportModalOpen(false);
    setResetVersion((version) => version + 1);
  }, [clearAuditLogs, resetSimulation]);

  const startPresentation = useCallback(() => {
    resetDemo();
    setTheme('light');
    try { localStorage.setItem('impactgrid-theme', 'light'); } catch { /* Keep presentation light for session */ }
    setIsPitchWalkthroughActive(true);
    appendAuditLog({ action: 'START_PITCH', detail: 'Executive 7-min pitch initiated', category: 'PRESENTATION' });
  }, [appendAuditLog, resetDemo]);

  const requestPresentationStart = useCallback(() => {
    setPreflightChecks(PRESENTATION_PREFLIGHT_ITEMS.map(() => false));
    setIsPreflightOpen(true);
  }, []);

  const togglePitchWalkthrough = useCallback(() => {
    if (isPitchWalkthroughActive) {
      setIsPitchWalkthroughActive(false);
      setPitchNotesExpanded(false);
    } else requestPresentationStart();
  }, [isPitchWalkthroughActive, requestPresentationStart]);

  const handleApplyEmergency = useCallback((isActive) => {
    const active = Boolean(isActive);
    const scenario = SIMULATION_SCENARIOS[active ? 'emergency' : 'normal'];
    setEmergencyState({ active });
    setSimState((state) => ({
      ...state,
      scenarioKey: scenario.id,
      emergencyActive: active,
    }));
    appendAuditLog({
      action: active ? 'EMERGENCY_TRIGGERED' : 'EMERGENCY_RESET',
      detail: `Emergency state changed to ${active}`,
      category: 'SAFETY',
    });
  }, [appendAuditLog, setSimState]);

  const openReportModal = useCallback(() => setIsReportModalOpen(true), []);
  const openEmergencyModal = useCallback(() => setIsEmergencyModalOpen(true), []);
  const openExecutiveMemo = useCallback(() => setIsExecutiveMemoOpen(true), []);
  const openBodDefense = useCallback(() => setIsBodDefenseOpen(true), []);
  const openAiCopilot = useCallback(() => setIsAiCopilotOpen(true), []);
  const toggleSimulationBar = useCallback(() => setIsSimBarOpen((value) => !value), []);

  const hasBlockingModal = isPreflightOpen || isReportModalOpen || isDirectorTourOpen || isEmergencyModalOpen || isExecutiveMemoOpen || isBodDefenseOpen || isAiCopilotOpen || isShortcutsModalOpen || isQrShareOpen;

  // Custom hook for all presenter & system keyboard shortcuts
  useKeyboardShortcuts({
    disabled: hasBlockingModal,
    viewMode,
    activeTab,
    onNavigateTab: navigateToTab,
    onChangeViewMode: changeViewMode,
    onToggleAutoSim: toggleAutoSim,
    onResetDemo: resetDemo,
    onToggleSimBar: toggleSimulationBar,
    onOpenShortcuts: () => setIsShortcutsModalOpen(true),
    onOpenCopilot: () => setIsAiCopilotOpen(true),
    onOpenExport: openReportModal,
    onTogglePitch: togglePitchWalkthrough,
    onOpenTour: () => setIsDirectorTourOpen(prev => !prev),
    onOpenEmergency: openEmergencyModal,
    onOpenMemo: openExecutiveMemo,
    onOpenDefense: () => setIsBodDefenseOpen(prev => !prev),
  });

  return (
    <div className={`impactgrid-app min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-[#ED0226] selection:text-white ${isPitchWalkthroughActive ? 'is-presenting' : ''} ${pitchNotesExpanded ? 'presenter-notes-open' : ''}`} data-theme={theme}>
      {/* Top Streamlined Executive Navbar with Presentation View Switcher & Consolidated Toolkit */}
      <Navbar 
        onOpenReportModal={openReportModal}
        onOpenDirectorTour={() => setIsDirectorTourOpen(true)}
        onTogglePitchWalkthrough={togglePitchWalkthrough}
        isPitchWalkthroughActive={isPitchWalkthroughActive}
        onOpenEmergencyModal={openEmergencyModal}
        onOpenExecutiveMemo={openExecutiveMemo}
        onOpenBodDefense={openBodDefense}
        onOpenAiCopilot={openAiCopilot}
        onOpenQrShare={() => setIsQrShareOpen(true)}
        onOpenOfficialBaRe={() => setIsOfficialBaReOpen(true)}
        onOpenFieldConsole={() => setIsFieldConsoleOpen(true)}
        onOpenSapVoucher={() => setIsSapVoucherOpen(true)}
        emergencyState={emergencyState}
        selectedScale={selectedScale}
        setSelectedScale={setSelectedScale}
        activeLens={activeLens}
        setActiveLens={setActiveLens}
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        ssoSession={ssoSession}
        onOpenSsoModal={() => setIsSsoModalOpen(true)}
        isAutonomous={isAutonomous}
        setIsAutonomous={setIsAutonomous}
        onToggleSimBar={toggleSimulationBar}
        isSimBarOpen={isSimBarOpen}
        simState={simState}
        viewMode={viewMode}
        setViewMode={changeViewMode}
        onResetDemo={resetDemo}
        theme={theme}
        connectivityStatus={connectivityStatus}
        onToggleTheme={() => setTheme(current => {
          const next = current === 'light' ? 'dark' : 'light';
          try { localStorage.setItem('impactgrid-theme', next); } catch { /* Keep in-memory theme if storage unavailable */ }
          return next;
        })}
      />

      {/* Simulation Controls (local demo only) */}
      <GlobalSimulationBar
        key={resetVersion}
        simState={simState}
        setSimState={setSimState}
        isOpen={isSimBarOpen}
        onClose={() => setIsSimBarOpen(false)}
        onTriggerEmergency={(isActive) => setEmergencyState({ active: isActive })}
        isPlaying={autoSim}
        onTogglePlay={toggleAutoSim}
        onReset={resetSimulation}
        simulationMode={simulationMode}
        onToggleSimulationMode={toggleSimulationMode}
      />

      {/* Main Layout: Sidebar + Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row min-h-[calc(100vh-60px)]">
        {/* Left Structured Sidebar */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={navigateToTab}
          viewMode={viewMode}
        />

        {/* Dynamic Content Viewport */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-y-auto transition-all duration-300">
          {TAB_IDS.map((tabId) => loadedTabs.has(tabId) && (
            <section className="tab-panel" key={`${tabId}-${resetVersion}`} hidden={activeTab !== tabId} aria-hidden={activeTab !== tabId}>
              <AppErrorBoundary key={`boundary-${tabId}-${resetVersion}`}>
                <Suspense fallback={<TabLoadingFallback />}>
                  {tabId === 'overview' && (
                    <>
                      <KpiStatRow simState={simState} selectedScale={selectedScale} />
                      <OverviewTab
                        setActiveTab={navigateToTab}
                        selectedScale={selectedScale}
                        setSelectedScale={setSelectedScale}
                        activeLens={activeLens}
                        setActiveLens={setActiveLens}
                        emergencyState={emergencyState}
                        onOpenEmergencyModal={openEmergencyModal}
                        onTogglePitchWalkthrough={togglePitchWalkthrough}
                        onOpenExecutiveMemo={openExecutiveMemo}
                        onOpenBodDefense={openBodDefense}
                        simState={simState}
                        viewMode={viewMode}
                        setViewMode={changeViewMode}
                        isPitchWalkthroughActive={isPitchWalkthroughActive}
                        onOpenFieldConsole={() => setIsFieldConsoleOpen(true)}
                      />
                    </>
                  )}
                  {tabId === 'pilotvalidation' && <PilotValidationCenterTab onOpenReportModal={openReportModal} />}
                  {tabId === 'digitaltwin' && <DigitalTwinTab />}
                  {tabId === 'agents' && <AgentOrchestratorTab />}
                  {tabId === 'telemetry' && (
                    <TelemetryTab 
                      onOpenOfficialBaRe={() => setIsOfficialBaReOpen(true)} 
                      onOpenFieldConsole={() => setIsFieldConsoleOpen(true)}
                      resolvedSites={resolvedSites}
                    />
                  )}
                  {tabId === 'scenariolab' && (
                    <ScenarioLabTab
                      isActive={activeTab === tabId}
                      simulationMode={simulationMode}
                      onToggleSimulationMode={toggleSimulationMode}
                    />
                  )}
                  {tabId === 'optimization' && <OptimizationTab />}
                  {tabId === 'esg' && <ESGComplianceTab onOpenReportModal={openReportModal} />}
                  {tabId === 'financial' && (
                    <FinancialModelTab
                      simulationMode={simulationMode}
                      onToggleSimulationMode={toggleSimulationMode}
                      onOpenSapVoucher={() => setIsSapVoucherOpen(true)}
                    />
                  )}
                  {tabId === 'architecture' && <ArchitectureTab onOpenOfficialBaRe={() => setIsOfficialBaReOpen(true)} />}
                </Suspense>
              </AppErrorBoundary>
            </section>
          ))}
        </main>
      </div>

      {/* Planning assumptions worksheet modal */}
      {isReportModalOpen && (
        <AppErrorBoundary key={`report-${resetVersion}`}>
          <Suspense fallback={<ModalLoadingState />}>
            <ReportModal
              isOpen={isReportModalOpen} 
              onClose={() => setIsReportModalOpen(false)}
              simState={simState}
            />
          </Suspense>
        </AppErrorBoundary>
      )}

      {/* Director Presentation Tour Modal */}
      {isDirectorTourOpen && (
        <AppErrorBoundary key={`tour-${resetVersion}`}>
          <Suspense fallback={<ModalLoadingState />}>
            <DirectorTourModal
              isOpen={isDirectorTourOpen}
              onClose={() => setIsDirectorTourOpen(false)}
              onNavigateTab={navigateToTab}
            />
          </Suspense>
        </AppErrorBoundary>
      )}

      {/* CTO Emergency Stress-Test Modal */}
      {isEmergencyModalOpen && (
        <AppErrorBoundary key={`emergency-${resetVersion}`}>
          <Suspense fallback={<ModalLoadingState />}>
            <EmergencyStressModal
              isOpen={isEmergencyModalOpen}
              onClose={() => setIsEmergencyModalOpen(false)}
              onApplyEmergency={handleApplyEmergency}
              emergencyState={emergencyState}
            />
          </Suspense>
        </AppErrorBoundary>
      )}

      {/* Executive Board Memo Modal */}
      {isExecutiveMemoOpen && (
        <AppErrorBoundary key={`memo-${resetVersion}`}>
          <Suspense fallback={<ModalLoadingState />}>
            <ExecutiveMemoModal
              isOpen={isExecutiveMemoOpen}
              onClose={() => setIsExecutiveMemoOpen(false)}
            />
          </Suspense>
        </AppErrorBoundary>
      )}

      {/* BoD Defense Q&A Cheat Sheet Modal */}
      {isBodDefenseOpen && (
        <AppErrorBoundary key={`defense-${resetVersion}`}>
          <Suspense fallback={<ModalLoadingState />}>
            <BodDefenseModal
              isOpen={isBodDefenseOpen}
              onClose={() => setIsBodDefenseOpen(false)}
            />
          </Suspense>
        </AppErrorBoundary>
      )}

      {/* AI Copilot Intelligence Assistant Modal */}
      {isAiCopilotOpen && (
        <AppErrorBoundary key={`copilot-${resetVersion}`}>
          <Suspense fallback={<ModalLoadingState />}>
            <AiCopilotModal
              isOpen={isAiCopilotOpen}
              activeTab={activeTab}
              simState={simState}
              selectedScale={selectedScale}
              activeLens={activeLens}
              onClose={() => setIsAiCopilotOpen(false)}
              onNavigateTab={navigateToTab}
              onApplyAction={(action) => {
                if (!action || typeof action !== 'object') return;
                if (action.type === 'APPLY_OPTIMIZATION') {
                  setEmergencyState({ active: false });
                  setSimState(prev => ({
                    ...prev,
                    scenarioKey: 'normal',
                    emergencyActive: false,
                  }));
                  setIsSimBarOpen(true);
                } else if (action.type === 'SWITCH_SCENARIO') {
                  setEmergencyState({ active: false });
                  setSimState(prev => ({
                    ...prev,
                    scenarioKey: action.scenarioKey || 'blackout_sumatera',
                    emergencyActive: false
                  }));
                  setIsSimBarOpen(true);
                }
              }}
            />
          </Suspense>
        </AppErrorBoundary>
      )}

      {/* Keyboard Shortcuts Guide Modal */}
      {isShortcutsModalOpen && (
        <AppErrorBoundary key={`shortcuts-${resetVersion}`}>
          <Suspense fallback={<ModalLoadingState />}>
            <ShortcutsModal
              isOpen={isShortcutsModalOpen}
              onClose={() => setIsShortcutsModalOpen(false)}
            />
          </Suspense>
        </AppErrorBoundary>
      )}

      {/* QR Code Share Modal for Jury & Mobile Devices */}
      {isQrShareOpen && (
        <AppErrorBoundary key={`qr-share-${resetVersion}`}>
          <Suspense fallback={<ModalLoadingState />}>
            <QrShareModal
              isOpen={isQrShareOpen}
              onClose={() => setIsQrShareOpen(false)}
            />
          </Suspense>
        </AppErrorBoundary>
      )}

      {/* Telkomsel Corporate IAM SSO Login Modal */}
      {isSsoModalOpen && (
        <AppErrorBoundary key={`sso-${resetVersion}`}>
          <Suspense fallback={<ModalLoadingState />}>
            <TelkomselSsoModal
              isOpen={isSsoModalOpen}
              onClose={() => setIsSsoModalOpen(false)}
              currentSession={ssoSession}
              onLoginSuccess={(session) => {
                setSsoSession(session);
                if (session.roleId) handleRoleChange(session.roleId);
              }}
            />
          </Suspense>
        </AppErrorBoundary>
      )}

      {/* Official Berita Acara Rekonsiliasi Energi (BA-RE) Legal Modal */}
      {isOfficialBaReOpen && (
        <AppErrorBoundary key={`bare-${resetVersion}`}>
          <Suspense fallback={<ModalLoadingState />}>
            <OfficialBeritaAcaraModal
              isOpen={isOfficialBaReOpen}
              onClose={() => setIsOfficialBaReOpen(false)}
            />
          </Suspense>
        </AppErrorBoundary>
      )}

      {/* Field Operations (FOP) Mobile Technician Console Modal */}
      {isFieldConsoleOpen && (
        <AppErrorBoundary key={`fop-${resetVersion}`}>
          <Suspense fallback={<ModalLoadingState />}>
            <FieldTechnicianConsoleModal
              isOpen={isFieldConsoleOpen}
              onClose={() => setIsFieldConsoleOpen(false)}
              onResolveSiteAnomaly={handleResolveSiteAnomaly}
            />
          </Suspense>
        </AppErrorBoundary>
      )}

      {/* SAP S/4HANA Accounting Journal Voucher & BAST Modal */}
      {isSapVoucherOpen && (
        <AppErrorBoundary key={`sap-${resetVersion}`}>
          <Suspense fallback={<ModalLoadingState />}>
            <SapAccountingVoucherModal
              isOpen={isSapVoucherOpen}
              onClose={() => setIsSapVoucherOpen(false)}
            />
          </Suspense>
        </AppErrorBoundary>
      )}

      {/* Presentation Preflight Modal */}
      {isPreflightOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/75 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="presentation-preflight-title"
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setIsPreflightOpen(false);
              return;
            }
            if (event.key === 'Tab') {
              const focusable = [...event.currentTarget.querySelectorAll('input:not(:disabled), button:not(:disabled)')];
              const first = focusable[0];
              const last = focusable.at(-1);
              if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last?.focus();
              } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first?.focus();
              }
            }
          }}
        >
          <section className="w-full max-w-xl rounded-2xl border border-slate-300 bg-white p-5 text-slate-900 shadow-2xl sm:p-7">
            <p className="text-xs font-black uppercase tracking-wider text-red-700">Preflight demo · 7 menit</p>
            <h2 id="presentation-preflight-title" className="mt-1 text-xl font-black">Periksa kesiapan presentasi</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">Konfirmasi batas demo sebelum pitch dimulai. Skenario akan direset ke preset lokal saat Anda melanjutkan.</p>
            <ul className="mt-4 space-y-3">
              {PRESENTATION_PREFLIGHT_ITEMS.map((item, index) => (
                <li key={item}>
                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3 text-sm leading-relaxed hover:bg-slate-50">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 shrink-0 accent-red-600"
                      autoFocus={index === 0}
                      checked={preflightChecks[index]}
                      onChange={(event) => setPreflightChecks((checks) => checks.map((checked, checkIndex) => checkIndex === index ? event.target.checked : checked))}
                    />
                    <span>{item}</span>
                  </label>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-col-reverse justify-end gap-2 sm:flex-row">
              <button type="button" onClick={() => setIsPreflightOpen(false)} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100">Batal</button>
              <button
                type="button"
                disabled={!preflightChecks.every(Boolean)}
                onClick={startPresentation}
                className="rounded-xl bg-[#ED0226] px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Mulai pitch dan reset demo
              </button>
            </div>
          </section>
        </div>
      )}

      {/* Live Presenter Pitch Walkthrough Teleprompter */}
      <GuidedPitchBar
        key={resetVersion}
        isActive={isPitchWalkthroughActive}
        shortcutsEnabled={!hasBlockingModal}
        onClose={() => {
          setIsPitchWalkthroughActive(false);
          setPitchNotesExpanded(false);
        }}
        onNavigateTab={navigateToTab}
        onNotesExpandedChange={setPitchNotesExpanded}
        onRestartPresentation={startPresentation}
      />
    </div>
  );
}
