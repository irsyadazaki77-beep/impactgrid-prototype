import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import OverviewTab from './components/OverviewTab';
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

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDirectorTourOpen, setIsDirectorTourOpen] = useState(false);
  const [isPitchWalkthroughActive, setIsPitchWalkthroughActive] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isExecutiveMemoOpen, setIsExecutiveMemoOpen] = useState(false);
  const [isBodDefenseOpen, setIsBodDefenseOpen] = useState(false);
  const [emergencyState, setEmergencyState] = useState({ active: false });
  const [selectedScale, setSelectedScale] = useState('pilot'); // 'pilot' | 'regional' | 'national'
  const [activeLens, setActiveLens] = useState('all'); // 'all' | 'finance' | 'network' | 'esg'
  const [isAutonomous, setIsAutonomous] = useState(true);

  // Presenter Keyboard Shortcuts (T = Tour, S = Stress Test, P = Print Memo, Q = Q&A Defense, 1-7 = Tabs)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if (e.key === '1') setActiveTab('overview');
      if (e.key === '2') setActiveTab('telemetry');
      if (e.key === '3') setActiveTab('scenariolab');
      if (e.key === '4') setActiveTab('optimization');
      if (e.key === '5') setActiveTab('financial');
      if (e.key === '6') setActiveTab('esg');
      if (e.key === '7') setActiveTab('architecture');
      if (e.key.toLowerCase() === 'w') setIsPitchWalkthroughActive(prev => !prev);
      if (e.key.toLowerCase() === 't') setIsDirectorTourOpen(prev => !prev);
      if (e.key.toLowerCase() === 's') setIsEmergencyModalOpen(true);
      if (e.key.toLowerCase() === 'p') setIsExecutiveMemoOpen(true);
      if (e.key.toLowerCase() === 'q') setIsBodDefenseOpen(prev => !prev);
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
        emergencyState={emergencyState}
        selectedScale={selectedScale}
        setSelectedScale={setSelectedScale}
        activeLens={activeLens}
        setActiveLens={setActiveLens}
        isAutonomous={isAutonomous}
        setIsAutonomous={setIsAutonomous}
      />

      {/* Main Layout: Sidebar + Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row min-h-[calc(100vh-60px)]">
        {/* Left Clean Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Dynamic Content Viewport */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-6xl w-full mx-auto overflow-y-auto">
          {activeTab === 'overview' && (
            <OverviewTab 
              setActiveTab={setActiveTab} 
              selectedScale={selectedScale}
              activeLens={activeLens}
              emergencyState={emergencyState}
              onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
            />
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

      {/* 1-Click Executive Board Memo Modal (Print / PDF A4) */}
      <ExecutiveMemoModal
        isOpen={isExecutiveMemoOpen}
        onClose={() => setIsExecutiveMemoOpen(false)}
      />

      {/* BoD Q&A Defense Simulator Modal */}
      <BodDefenseModal
        isOpen={isBodDefenseOpen}
        onClose={() => setIsBodDefenseOpen(false)}
        onNavigateTab={(tabName) => setActiveTab(tabName)}
      />

      {/* Guided 7-Minute Pitch Walkthrough Floating Bar */}
      <GuidedPitchBar
        isActive={isPitchWalkthroughActive}
        onClose={() => setIsPitchWalkthroughActive(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
        onOpenExecutiveMemo={() => setIsExecutiveMemoOpen(true)}
        onOpenBodDefense={() => setIsBodDefenseOpen(true)}
      />

      {/* Global Minimal Footer */}
      <footer className="border-t border-slate-200 bg-white px-6 py-3.5 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-slate-800">Telkomsel ImpactGrid</span>
          <span>•</span>
          <span>Decision Support System for Network Decarbonization</span>
        </div>
        <div className="flex items-center space-x-3 text-[11px]">
          <span>Shortcut: <kbd className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 font-mono text-[10px]">T</kbd> Pitch • <kbd className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 font-mono text-[10px]">S</kbd> Stress Test</span>
          <span>•</span>
          <span>Tim: <strong className="text-slate-700">AWAKENING Reborn</strong></span>
        </div>
      </footer>
    </div>
  );
}
