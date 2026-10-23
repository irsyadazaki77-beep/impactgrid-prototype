import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import OverviewTab from './components/OverviewTab';
import DigitalTwinTab from './components/DigitalTwinTab';
import AgentOrchestratorTab from './components/AgentOrchestratorTab';
import TelemetryTab from './components/TelemetryTab';
import ScenarioLabTab from './components/ScenarioLabTab';
import OptimizationTab from './components/OptimizationTab';
import ESGComplianceTab from './components/ESGComplianceTab';
import FinancialModelTab from './components/FinancialModelTab';
import ArchitectureTab from './components/ArchitectureTab';
import ReportModal from './components/ReportModal';
import DirectorTourModal from './components/DirectorTourModal';
import EmergencyStressModal from './components/EmergencyStressModal';
import ExecutiveMemoModal from './components/ExecutiveMemoModal';
import BodDefenseModal from './components/BodDefenseModal';
import GuidedPitchBar from './components/GuidedPitchBar';
import AiCopilotModal from './components/AiCopilotModal';
import GlobalSimulationBar from './components/GlobalSimulationBar';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDirectorTourOpen, setIsDirectorTourOpen] = useState(false);
  const [isPitchWalkthroughActive, setIsPitchWalkthroughActive] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isExecutiveMemoOpen, setIsExecutiveMemoOpen] = useState(false);
  const [isBodDefenseOpen, setIsBodDefenseOpen] = useState(false);
  const [isAiCopilotOpen, setIsAiCopilotOpen] = useState(false);
  const [emergencyState, setEmergencyState] = useState({ active: false });
  const [selectedScale, setSelectedScale] = useState('pilot'); // 'pilot' | 'regional' | 'national'
  const [activeLens, setActiveLens] = useState('all'); // 'all' | 'finance' | 'network' | 'esg'
  const [isAutonomous, setIsAutonomous] = useState(true);

  // Live Executive Simulation Console State
  const [isSimBarOpen, setIsSimBarOpen] = useState(false);
  const [simState, setSimState] = useState({
    simHour: 14,
    simTimeString: '14:00 WIB',
    scenarioKey: 'normal',
    tempC: 28,
    trafficMultiplier: 1.0,
    carrierSleepActive: true,
    plnTariffIDR: 1500,
    emergencyActive: false
  });

  // Presenter Keyboard Shortcuts (T = Tour, S = Stress Test, P = Print Memo, Q = Q&A Defense, E = Simulation Bar, 1-9 = Tabs)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if (e.key === '1') setActiveTab('overview');
      if (e.key === '2') setActiveTab('digitaltwin');
      if (e.key === '3') setActiveTab('agents');
      if (e.key === '4') setActiveTab('telemetry');
      if (e.key === '5') setActiveTab('scenariolab');
      if (e.key === '6') setActiveTab('optimization');
      if (e.key === '7') setActiveTab('esg');
      if (e.key === '8') setActiveTab('financial');
      if (e.key === '9') setActiveTab('architecture');
      if (e.key.toLowerCase() === 'w') setIsPitchWalkthroughActive(prev => !prev);
      if (e.key.toLowerCase() === 't') setIsDirectorTourOpen(prev => !prev);
      if (e.key.toLowerCase() === 's') setIsEmergencyModalOpen(true);
      if (e.key.toLowerCase() === 'p') setIsExecutiveMemoOpen(true);
      if (e.key.toLowerCase() === 'q') setIsBodDefenseOpen(prev => !prev);
      if (e.key.toLowerCase() === 'a') setIsAiCopilotOpen(prev => !prev);
      if (e.key.toLowerCase() === 'e') setIsSimBarOpen(prev => !prev);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleApplyEmergency = (isActive) => {
    setEmergencyState({ active: isActive });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-[#ED0226] selection:text-white">
      {/* Top Streamlined Executive Navbar */}
      <Navbar 
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenDirectorTour={() => setIsDirectorTourOpen(true)}
        onTogglePitchWalkthrough={() => setIsPitchWalkthroughActive(prev => !prev)}
        isPitchWalkthroughActive={isPitchWalkthroughActive}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
        onOpenExecutiveMemo={() => setIsExecutiveMemoOpen(true)}
        onOpenBodDefense={() => setIsBodDefenseOpen(true)}
        onOpenAiCopilot={() => setIsAiCopilotOpen(true)}
        emergencyState={emergencyState}
        selectedScale={selectedScale}
        setSelectedScale={setSelectedScale}
        activeLens={activeLens}
        setActiveLens={setActiveLens}
        isAutonomous={isAutonomous}
        setIsAutonomous={setIsAutonomous}
        onToggleSimBar={() => setIsSimBarOpen(prev => !prev)}
        isSimBarOpen={isSimBarOpen}
        simState={simState}
      />

      {/* Live Global Simulation Console Dropdown Bar */}
      <GlobalSimulationBar
        simState={simState}
        setSimState={setSimState}
        isOpen={isSimBarOpen}
        onClose={() => setIsSimBarOpen(false)}
        onTriggerEmergency={(isActive) => setEmergencyState({ active: isActive })}
      />

      {/* Main Layout: Sidebar + Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row min-h-[calc(100vh-60px)]">
        {/* Left Clean Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Dynamic Content Viewport */}
        <main className={`flex-1 p-4 md:p-6 lg:p-8 max-w-6xl w-full mx-auto overflow-y-auto transition-all duration-300 ${
          isPitchWalkthroughActive ? 'pb-28 md:pb-32' : ''
        }`}>
          {activeTab === 'overview' && (
            <OverviewTab 
              setActiveTab={setActiveTab} 
              selectedScale={selectedScale}
              setSelectedScale={setSelectedScale}
              activeLens={activeLens}
              setActiveLens={setActiveLens}
              emergencyState={emergencyState}
              onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
              onTogglePitchWalkthrough={() => setIsPitchWalkthroughActive(prev => !prev)}
              onOpenExecutiveMemo={() => setIsExecutiveMemoOpen(true)}
              onOpenBodDefense={() => setIsBodDefenseOpen(true)}
              simState={simState}
            />
          )}

          {activeTab === 'digitaltwin' && (
            <DigitalTwinTab />
          )}

          {activeTab === 'agents' && (
            <AgentOrchestratorTab />
          )}

          {activeTab === 'telemetry' && (
            <TelemetryTab />
          )}

          {activeTab === 'scenariolab' && (
            <ScenarioLabTab />
          )}

          {activeTab === 'optimization' && (
            <OptimizationTab 
              isAutonomous={isAutonomous} 
              setIsAutonomous={setIsAutonomous} 
            />
          )}

          {activeTab === 'esg' && (
            <ESGComplianceTab onOpenReportModal={() => setIsReportModalOpen(true)} />
          )}

          {activeTab === 'financial' && (
            <FinancialModelTab />
          )}

          {activeTab === 'architecture' && (
            <ArchitectureTab />
          )}
        </main>
      </div>

      {/* Audit Report Export Modal */}
      <ReportModal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)} 
      />

      {/* Director Presentation Tour Modal */}
      <DirectorTourModal
        isOpen={isDirectorTourOpen}
        onClose={() => setIsDirectorTourOpen(false)}
        onNavigateTab={(tabName) => setActiveTab(tabName)}
      />

      {/* CTO Emergency Stress-Test Modal */}
      <EmergencyStressModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        onApplyEmergency={handleApplyEmergency}
        emergencyState={emergencyState}
      />

      {/* Executive Board Memo Modal */}
      <ExecutiveMemoModal
        isOpen={isExecutiveMemoOpen}
        onClose={() => setIsExecutiveMemoOpen(false)}
      />

      {/* BoD Defense Q&A Cheat Sheet Modal */}
      <BodDefenseModal
        isOpen={isBodDefenseOpen}
        onClose={() => setIsBodDefenseOpen(false)}
      />

      {/* AI Copilot Intelligence Assistant Modal */}
      <AiCopilotModal
        isOpen={isAiCopilotOpen}
        onClose={() => setIsAiCopilotOpen(false)}
        onNavigateTab={(tabName) => setActiveTab(tabName)}
        onApplyAction={(action) => {
          if (action.type === 'APPLY_OPTIMIZATION') {
            setSimState(prev => ({
              ...prev,
              carrierSleepActive: true,
              tempC: 26,
              plnTariffIDR: 1500
            }));
            setIsSimBarOpen(true);
          } else if (action.type === 'SWITCH_SCENARIO') {
            setSimState(prev => ({
              ...prev,
              scenarioKey: action.scenarioKey || 'blackout_sumatera',
              carrierSleepActive: true,
              tempC: 31,
              trafficMultiplier: 0.9,
              plnTariffIDR: 0,
              emergencyActive: false
            }));
            setIsSimBarOpen(true);
          }
        }}
      />

      {/* Live Presenter Pitch Walkthrough Teleprompter */}
      <GuidedPitchBar
        isActive={isPitchWalkthroughActive}
        onClose={() => setIsPitchWalkthroughActive(false)}
        onNavigateTab={(tabName) => setActiveTab(tabName)}
      />
    </div>
  );
}
