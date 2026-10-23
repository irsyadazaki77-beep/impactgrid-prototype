import React, { lazy, memo, Suspense, useCallback, useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AppErrorBoundary from './components/AppErrorBoundary';
import GuidedPitchBar from './components/GuidedPitchBar';
import GlobalSimulationBar, { SIMULATION_SCENARIOS } from './components/GlobalSimulationBar';
import { createInitialSimulationState, isShortcutTargetEditable, resolveTabForMode } from './utils/demoState';

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

const TAB_IDS = ['overview', 'pilotvalidation', 'digitaltwin', 'agents', 'telemetry', 'scenariolab', 'optimization', 'esg', 'financial', 'architecture'];

function ModuleLoadingState() {
  return <div className="module-loading" role="status" aria-live="polite" aria-label="Memuat modul">
    <span className="module-loading-bar" /><span className="module-loading-bar" /><span className="module-loading-bar" />
    <span className="sr-only">Memuat modul…</span>
  </div>;
}

function ModalLoadingState() {
  return <div className="modal-module-loading" role="status">Memuat fitur demo…</div>;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loadedTabs, setLoadedTabs] = useState(() => new Set(['overview']));
  const [resetVersion, setResetVersion] = useState(0);
  const [viewMode, setViewMode] = useState('executive'); // 'executive' | 'engineering' (Instruction #2)
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('impactgrid-theme') || 'light'; } catch { return 'light'; }
  });
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDirectorTourOpen, setIsDirectorTourOpen] = useState(false);
  const [isPitchWalkthroughActive, setIsPitchWalkthroughActive] = useState(false);
  const [pitchNotesExpanded, setPitchNotesExpanded] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isExecutiveMemoOpen, setIsExecutiveMemoOpen] = useState(false);
  const [isBodDefenseOpen, setIsBodDefenseOpen] = useState(false);
  const [isAiCopilotOpen, setIsAiCopilotOpen] = useState(false);
  const [emergencyState, setEmergencyState] = useState({ active: false });
  const [selectedScale, setSelectedScale] = useState('pilot'); // 'pilot' | 'regional' | 'national'
  const [activeLens, setActiveLens] = useState('all'); // 'all' | 'finance' | 'network' | 'esg'
  const [isAutonomous, setIsAutonomous] = useState(false);

  // Live Executive Simulation Console State
  const [isSimBarOpen, setIsSimBarOpen] = useState(false);
  const [simState, setSimState] = useState(createInitialSimulationState);
  const [isOnline, setIsOnline] = useState(() => typeof navigator === 'undefined' ? true : navigator.onLine);

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
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

  const resetDemo = useCallback(() => {
    setSimState(createInitialSimulationState());
    setEmergencyState({ active: false });
    setSelectedScale('pilot');
    setActiveLens('all');
    setIsAutonomous(false);
    setViewMode('executive');
    setActiveTab('overview');
    setLoadedTabs(new Set(['overview']));
    setIsSimBarOpen(false);
    setIsPitchWalkthroughActive(false);
    setPitchNotesExpanded(false);
    setIsDirectorTourOpen(false);
    setIsEmergencyModalOpen(false);
    setIsExecutiveMemoOpen(false);
    setIsBodDefenseOpen(false);
    setIsAiCopilotOpen(false);
    setIsReportModalOpen(false);
    setResetVersion((version) => version + 1);
  }, []);

  const startPresentation = useCallback(() => {
    resetDemo();
    setTheme('light');
    try { localStorage.setItem('impactgrid-theme', 'light'); } catch { /* Keep the presentation light for this session. */ }
    setIsPitchWalkthroughActive(true);
  }, [resetDemo]);
  const togglePitchWalkthrough = useCallback(() => {
    if (isPitchWalkthroughActive) {
      setIsPitchWalkthroughActive(false);
      setPitchNotesExpanded(false);
    } else startPresentation();
  }, [isPitchWalkthroughActive, startPresentation]);

  // Presenter Keyboard Shortcuts (T = Tour, S = Stress Test, P = Print Memo, Q = Q&A Defense, E = Simulation Bar, 1-9 = Tabs)
  const hasBlockingModal = isReportModalOpen || isDirectorTourOpen || isEmergencyModalOpen || isExecutiveMemoOpen || isBodDefenseOpen || isAiCopilotOpen;
  useEffect(() => {
    if (hasBlockingModal) return undefined;
    const handleKeyDown = (e) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || isShortcutTargetEditable(e.target)) return;

      if (e.key === '1') navigateToTab('overview');
      if (e.key.toLowerCase() === 'v') navigateToTab('pilotvalidation');
      if (e.key === '2') navigateToTab('digitaltwin');
      if (e.key === '3') navigateToTab('agents');
      if (e.key === '4') navigateToTab('telemetry');
      if (e.key === '5') navigateToTab('scenariolab');
      if (e.key === '6') navigateToTab('optimization');
      if (e.key === '7') navigateToTab('esg');
      if (e.key === '8') navigateToTab('financial');
      if (e.key === '9') navigateToTab('architecture');
      if (e.key.toLowerCase() === 'w') togglePitchWalkthrough();
      if (e.key.toLowerCase() === 't') setIsDirectorTourOpen(prev => !prev);
      if (e.key.toLowerCase() === 's') setIsEmergencyModalOpen(true);
      if (e.key.toLowerCase() === 'p') setIsExecutiveMemoOpen(true);
      if (e.key.toLowerCase() === 'q') setIsBodDefenseOpen(prev => !prev);
      if (e.key.toLowerCase() === 'a') setIsAiCopilotOpen(prev => !prev);
      if (e.key.toLowerCase() === 'e') setIsSimBarOpen(prev => !prev);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasBlockingModal, navigateToTab, togglePitchWalkthrough]);

  const handleApplyEmergency = useCallback((isActive) => {
    const active = Boolean(isActive);
    const scenario = SIMULATION_SCENARIOS[active ? 'emergency' : 'normal'];
    setEmergencyState({ active });
    setSimState((state) => ({
      ...state,
      scenarioKey: scenario.id,
      emergencyActive: active,
    }));
  }, []);
  const openReportModal = useCallback(() => setIsReportModalOpen(true), []);
  const openEmergencyModal = useCallback(() => setIsEmergencyModalOpen(true), []);
  const openExecutiveMemo = useCallback(() => setIsExecutiveMemoOpen(true), []);
  const openBodDefense = useCallback(() => setIsBodDefenseOpen(true), []);
  const openAiCopilot = useCallback(() => setIsAiCopilotOpen(true), []);
  const toggleSimulationBar = useCallback(() => setIsSimBarOpen((value) => !value), []);

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
        emergencyState={emergencyState}
        selectedScale={selectedScale}
        setSelectedScale={setSelectedScale}
        activeLens={activeLens}
        setActiveLens={setActiveLens}
        isAutonomous={isAutonomous}
        setIsAutonomous={setIsAutonomous}
        onToggleSimBar={toggleSimulationBar}
        isSimBarOpen={isSimBarOpen}
        simState={simState}
        viewMode={viewMode}
        setViewMode={changeViewMode}
        onResetDemo={resetDemo}
        theme={theme}
        onToggleTheme={() => setTheme(current => {
          const next = current === 'light' ? 'dark' : 'light';
          try { localStorage.setItem('impactgrid-theme', next); } catch { /* Keep the in-memory theme if storage is unavailable. */ }
          return next;
        })}
      />

      <div className={`demo-status-bar border-b px-4 py-2 text-center text-xs font-semibold shadow-sm ${isOnline ? 'border-amber-300 bg-amber-50 text-amber-950' : 'border-sky-300 bg-sky-50 text-sky-950'}`} role="status">{isOnline ? 'DEMO LOKAL • Semua data adalah contoh/simulasi • Tidak ada koneksi atau perintah ke jaringan' : 'OFFLINE • Simulasi lokal tetap tersedia; peta dasar dan tautan sumber memerlukan internet'}</div>
      {/* Simulation Controls (local demo only) */}
      <GlobalSimulationBar
        key={resetVersion}
        simState={simState}
        setSimState={setSimState}
        isOpen={isSimBarOpen}
        onClose={() => setIsSimBarOpen(false)}
        onTriggerEmergency={(isActive) => setEmergencyState({ active: isActive })}
      />

      {/* Main Layout: Sidebar + Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row min-h-[calc(100vh-60px)]">
        {/* Left Structured Sidebar (Instruction #1) */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={navigateToTab}
          viewMode={viewMode}
        />

        {/* Dynamic Content Viewport */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-y-auto transition-all duration-300">
          {TAB_IDS.map((tabId) => loadedTabs.has(tabId) && <section className="tab-panel" key={`${tabId}-${resetVersion}`} hidden={activeTab !== tabId} aria-hidden={activeTab !== tabId}>
            <AppErrorBoundary key={`boundary-${tabId}-${resetVersion}`}>
            <Suspense fallback={<ModuleLoadingState />}>
              {tabId === 'overview' && <><KpiStatRow simState={simState} selectedScale={selectedScale} /><OverviewTab setActiveTab={navigateToTab} selectedScale={selectedScale} setSelectedScale={setSelectedScale} activeLens={activeLens} setActiveLens={setActiveLens} emergencyState={emergencyState} onOpenEmergencyModal={openEmergencyModal} onTogglePitchWalkthrough={togglePitchWalkthrough} onOpenExecutiveMemo={openExecutiveMemo} onOpenBodDefense={openBodDefense} simState={simState} /></>}
              {tabId === 'pilotvalidation' && <PilotValidationCenterTab onOpenReportModal={openReportModal} />}
              {tabId === 'digitaltwin' && <DigitalTwinTab />}
              {tabId === 'agents' && <AgentOrchestratorTab />}
              {tabId === 'telemetry' && <TelemetryTab />}
              {tabId === 'scenariolab' && <ScenarioLabTab isActive={activeTab === tabId} />}
              {tabId === 'optimization' && <OptimizationTab />}
              {tabId === 'esg' && <ESGComplianceTab onOpenReportModal={openReportModal} />}
              {tabId === 'financial' && <FinancialModelTab />}
              {tabId === 'architecture' && <ArchitectureTab />}
            </Suspense>
            </AppErrorBoundary>
          </section>)}
        </main>
      </div>

      {/* Planning assumptions worksheet modal */}
      {isReportModalOpen && <AppErrorBoundary key={`report-${resetVersion}`}><Suspense fallback={<ModalLoadingState />}><ReportModal
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)}
        simState={simState}
      /></Suspense></AppErrorBoundary>}

      {/* Director Presentation Tour Modal */}
      {isDirectorTourOpen && <AppErrorBoundary key={`tour-${resetVersion}`}><Suspense fallback={<ModalLoadingState />}><DirectorTourModal
        isOpen={isDirectorTourOpen}
        onClose={() => setIsDirectorTourOpen(false)}
        onNavigateTab={navigateToTab}
      /></Suspense></AppErrorBoundary>}

      {/* CTO Emergency Stress-Test Modal */}
      {isEmergencyModalOpen && <AppErrorBoundary key={`emergency-${resetVersion}`}><Suspense fallback={<ModalLoadingState />}><EmergencyStressModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        onApplyEmergency={handleApplyEmergency}
        emergencyState={emergencyState}
      /></Suspense></AppErrorBoundary>}

      {/* Executive Board Memo Modal */}
      {isExecutiveMemoOpen && <AppErrorBoundary key={`memo-${resetVersion}`}><Suspense fallback={<ModalLoadingState />}><ExecutiveMemoModal
        isOpen={isExecutiveMemoOpen}
        onClose={() => setIsExecutiveMemoOpen(false)}
      /></Suspense></AppErrorBoundary>}

      {/* BoD Defense Q&A Cheat Sheet Modal */}
      {isBodDefenseOpen && <AppErrorBoundary key={`defense-${resetVersion}`}><Suspense fallback={<ModalLoadingState />}><BodDefenseModal
        isOpen={isBodDefenseOpen}
        onClose={() => setIsBodDefenseOpen(false)}
      /></Suspense></AppErrorBoundary>}

      {/* AI Copilot Intelligence Assistant Modal */}
      {isAiCopilotOpen && <AppErrorBoundary key={`copilot-${resetVersion}`}><Suspense fallback={<ModalLoadingState />}><AiCopilotModal
        isOpen={isAiCopilotOpen}
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
      /></Suspense></AppErrorBoundary>}

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


