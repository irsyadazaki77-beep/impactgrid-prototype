import React from 'react';
import { 
  FileDown, 
  Sparkles, 
  ShieldAlert, 
  ShieldCheck, 
  Radio, 
  DollarSign, 
  Leaf, 
  SlidersHorizontal,
  Printer,
  HelpCircle
} from 'lucide-react';
import { SYSTEM_METADATA } from '../data/mockData';

export default function Navbar({ 
  onOpenReportModal,
  onOpenDirectorTour,
  onTogglePitchWalkthrough,
  isPitchWalkthroughActive,
  onOpenEmergencyModal,
  onOpenExecutiveMemo,
  onOpenBodDefense,
  emergencyState = { active: false },
  selectedScale,
  setSelectedScale,
  activeLens,
  setActiveLens,
  isAutonomous,
  setIsAutonomous
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-2.5 shadow-xs">
      <div className="flex items-center justify-between max-w-7xl mx-auto gap-4">
        {/* Brand & Subtitle */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="flex items-center justify-center p-1.5 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
            <img 
              src="/assets/logo_utama_impactgrid.png" 
              alt="Telkomsel ImpactGrid Logo" 
              className="h-8 w-auto object-contain" 
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                Telkomsel <span className="text-[#ED0226]">ImpactGrid</span>
              </span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                BCC TSF 2026
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden md:block">
              Cyber-Physical Energy System & DSS • Tim <strong className="text-slate-700">AWAKENING Reborn</strong>
            </p>
          </div>
        </div>

        {/* Center: Integrated Clean Controls (Scale & Perspective) */}
        <div className="hidden lg:flex items-center space-x-2 bg-slate-100/80 p-1 rounded-xl border border-slate-200 text-xs">
          {/* Scale Phase Selector */}
          <div className="flex items-center space-x-0.5 pr-2 border-r border-slate-200">
            <button
              onClick={() => setSelectedScale('pilot')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                selectedScale === 'pilot' 
                  ? 'bg-white text-slate-900 shadow-2xs' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Pilot (40+10 Sites)
            </button>
            <button
              onClick={() => setSelectedScale('regional')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                selectedScale === 'regional' 
                  ? 'bg-white text-slate-900 shadow-2xs' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Regional (5k BTS)
            </button>
            <button
              onClick={() => setSelectedScale('national')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                selectedScale === 'national' 
                  ? 'bg-white text-slate-900 shadow-2xs' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Nasional (10k+ BTS)
            </button>
          </div>

          {/* Stakeholder Lens */}
          <div className="flex items-center space-x-0.5">
            <span className="text-[10px] font-bold text-slate-400 px-1 uppercase">Lensa:</span>
            <button
              onClick={() => setActiveLens('all')}
              className={`px-2 py-0.5 rounded-md font-medium transition cursor-pointer ${
                activeLens === 'all' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setActiveLens('finance')}
              className={`px-2 py-0.5 rounded-md font-medium transition cursor-pointer flex items-center gap-1 ${
                activeLens === 'finance' ? 'bg-amber-100 text-amber-900 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <DollarSign className="w-3 h-3 text-amber-600" />
              <span>CFO</span>
            </button>
            <button
              onClick={() => setActiveLens('network')}
              className={`px-2 py-0.5 rounded-md font-medium transition cursor-pointer flex items-center gap-1 ${
                activeLens === 'network' ? 'bg-cyan-100 text-cyan-900 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Radio className="w-3 h-3 text-cyan-600" />
              <span>CTO</span>
            </button>
            <button
              onClick={() => setActiveLens('esg')}
              className={`px-2 py-0.5 rounded-md font-medium transition cursor-pointer flex items-center gap-1 ${
                activeLens === 'esg' ? 'bg-emerald-100 text-emerald-900 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Leaf className="w-3 h-3 text-emerald-600" />
              <span>ESG</span>
            </button>
          </div>
        </div>

        {/* Right Action Tools: Pitching Mode, Stress Test, and Verification */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          {/* Live Pitch Walkthrough Bar Toggle */}
          <button
            onClick={onTogglePitchWalkthrough}
            className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-black shadow-2xs transition cursor-pointer border ${
              isPitchWalkthroughActive 
                ? 'bg-[#ED0226] text-white border-red-700 animate-pulse' 
                : 'bg-red-50 hover:bg-red-100 text-[#ED0226] border-red-200'
            }`}
            title="Mulai Mode Panduan Presentasi 7 Menit (Shortcut: 'W')"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isPitchWalkthroughActive ? 'Walkthrough Aktif' : 'Walkthrough 7 Min'}</span>
          </button>

          {/* Executive Tour / Pitch Button */}
          <button
            onClick={onOpenDirectorTour}
            className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-2xs transition cursor-pointer"
            title="Mode Panduan Presentasi Khusus Direksi Telkomsel (Shortcut: 'T')"
          >
            <span className="hidden sm:inline">Pitch Modal</span>
          </button>

          {/* BoD Q&A Defense Simulator Button */}
          <button
            onClick={onOpenBodDefense}
            className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-amber-300 text-xs font-bold shadow-2xs transition cursor-pointer"
            title="Contekan 8 Pertanyaan Mematikan Direksi Telkomsel & Layar Bukti (Shortcut: 'Q')"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden lg:inline">Tanya-Jawab BoD</span>
          </button>

          {/* CTO Emergency Stress Test Trigger */}
          <button
            onClick={onOpenEmergencyModal}
            className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
              emergencyState.active
                ? 'bg-red-600 text-white border-red-700 animate-pulse'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-2xs'
            }`}
            title="Simulasi Lonjakan Trafik Ekstrem 300% & Uji Respon SLA 112 (Shortcut: 'S')"
          >
            <ShieldAlert className={`w-3.5 h-3.5 ${emergencyState.active ? 'text-white' : 'text-amber-500'}`} />
            <span className="hidden md:inline">{emergencyState.active ? 'Drill Aktif' : 'CTO Stress Drill'}</span>
          </button>

          {/* 1-Click Executive Memo Print / PDF */}
          <button
            onClick={onOpenExecutiveMemo}
            className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold shadow-2xs transition cursor-pointer"
            title="Cetak Dokumen Memo Eksekutif Resmi Format A4 (Shortcut: 'P')"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden xl:inline">Board Memo A4</span>
          </button>

          {/* Report Button */}
          <button
            onClick={onOpenReportModal}
            className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#ED0226] hover:bg-red-700 text-white text-xs font-bold shadow-2xs transition cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Laporan (Tabel 8)</span>
          </button>
        </div>
      </div>
    </header>
  );
}
