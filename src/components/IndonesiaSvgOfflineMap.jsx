import React, { useState, useMemo } from 'react';
import { ShieldCheck, HeartHandshake, Hospital, GraduationCap, Store, Info, CheckCircle2 } from 'lucide-react';
import { SYNTHETIC_PILOT_SITES_50 } from '../data/mockData';

// Map geographic coordinates to SVG coordinates (1000 x 480 canvas)
// Java & Bali bounds: Lng 105.5 to 115.5, Lat -5.6 to -8.8
function geoToSvg(lat, lng) {
  const minLng = 105.5;
  const maxLng = 115.5;
  const minLat = -8.8;
  const maxLat = -5.6;

  const x = ((lng - minLng) / (maxLng - minLng)) * 900 + 50;
  const y = ((maxLat - lat) / (maxLat - minLat)) * 360 + 60;
  return { x, y };
}

export default function IndonesiaSvgOfflineMap({ activeCluster = 'all', groupFilter = 'all', showSocialOverlay = false }) {
  const [selectedSite, setSelectedSite] = useState(null);

  // Filter sites
  const filteredSites = useMemo(() => {
    return SYNTHETIC_PILOT_SITES_50.filter((site) => {
      const matchCluster = activeCluster === 'all' || 
        (activeCluster === 'jkt' && site.cluster === 'JKT-URB') ||
        (activeCluster === 'bdg' && site.cluster === 'BDG-SUB') ||
        (activeCluster === 'sby' && site.cluster === 'SBY-IND');
      const matchGroup = groupFilter === 'all' || site.group === groupFilter;
      return matchCluster && matchGroup;
    });
  }, [activeCluster, groupFilter]);

  return (
    <div className="relative w-full h-full min-h-[460px] bg-slate-900 overflow-hidden select-none rounded-2xl flex flex-col justify-between">
      {/* Offline Mode Banner Top */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 rounded-xl bg-slate-950/80 border border-slate-700/80 px-3 py-1.5 text-xs text-slate-200 backdrop-blur-md shadow-lg">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="font-bold">Mode Peta Vektor Mandiri (100% Offline Ready)</span>
        <span className="text-[10px] text-slate-400">Koridor Jawa–Bali</span>
      </div>

      {/* Main SVG Map Canvas */}
      <div className="w-full h-full flex-1 flex items-center justify-center p-2">
        <svg
          viewBox="0 0 1000 480"
          className="w-full h-full max-h-[500px]"
          style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            </pattern>
            {/* Glow Filter */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Grid */}
          <rect width="1000" height="480" fill="url(#grid)" />

          {/* Stylized Island Landmass (Java, Madura, Bali) */}
          <g fill="#1e293b" stroke="#334155" strokeWidth="1.5">
            {/* Western Java (Banten & Jabodetabek & Jabar) */}
            <path d="M 60 170 Q 120 150 200 160 Q 280 180 340 210 Q 380 230 420 230 Q 360 270 290 280 Q 200 290 120 260 Q 70 230 60 170 Z" />
            {/* Central Java */}
            <path d="M 400 220 Q 480 210 560 220 Q 640 230 650 260 Q 590 280 500 285 Q 430 280 400 220 Z" />
            {/* East Java */}
            <path d="M 640 235 Q 720 220 780 240 Q 820 260 840 290 Q 760 300 680 290 Q 640 270 640 235 Z" />
            {/* Madura Island */}
            <path d="M 720 200 Q 770 190 810 210 Q 780 225 730 220 Z" />
            {/* Bali Island */}
            <path d="M 860 275 Q 890 265 915 285 Q 885 305 860 275 Z" />
          </g>

          {/* Cluster Region Enclosures & Labels */}
          {/* Jabodetabek */}
          <circle cx="180" cy="190" r="48" fill="rgba(239, 68, 68, 0.06)" stroke="rgba(239, 68, 68, 0.3)" strokeDasharray="4 4" />
          <text x="180" y="130" fill="#94a3b8" fontSize="11" fontWeight="bold" textAnchor="middle">Jabodetabek Metro (20 Site)</text>

          {/* Bandung */}
          <circle cx="280" cy="245" r="40" fill="rgba(59, 130, 246, 0.06)" stroke="rgba(59, 130, 246, 0.3)" strokeDasharray="4 4" />
          <text x="280" y="305" fill="#94a3b8" fontSize="11" fontWeight="bold" textAnchor="middle">Bandung Suburban (15 Site)</text>

          {/* Surabaya */}
          <circle cx="730" cy="250" r="42" fill="rgba(16, 185, 129, 0.06)" stroke="rgba(16, 185, 129, 0.3)" strokeDasharray="4 4" />
          <text x="730" y="180" fill="#94a3b8" fontSize="11" fontWeight="bold" textAnchor="middle">Surabaya Industrial (15 Site)</text>

          {/* Render 50 Site Markers */}
          {filteredSites.map((site) => {
            const { x, y } = geoToSvg(site.lat, site.lng);
            const isIntervention = site.group === 'intervention';
            const isSelected = selectedSite?.id === site.id;
            const isHospital = showSocialOverlay && site.socialZone === 'hospital';
            const isEdu = showSocialOverlay && site.socialZone === 'education';

            let markerColor = isIntervention ? '#ef4444' : '#94a3b8';
            if (isHospital) markerColor = '#3b82f6';
            if (isEdu) markerColor = '#10b981';

            return (
              <g
                key={site.id}
                className="cursor-pointer transition-transform hover:scale-125"
                onClick={() => setSelectedSite(site)}
              >
                {/* Outer Ring for Intervention */}
                {isIntervention && (
                  <circle cx={x} cy={y} r="8" fill="none" stroke={markerColor} strokeWidth="1" opacity="0.4">
                    <animate attributeName="r" values="6;12;6" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0;0.6" dur="3s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Core Marker Pin */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? '6' : '4.5'}
                  fill={markerColor}
                  stroke="#ffffff"
                  strokeWidth={isSelected ? '2' : '1'}
                  filter={isSelected ? 'url(#glow)' : undefined}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Site Detail Modal / Flyout Bottom */}
      {selectedSite ? (
        <div className="absolute bottom-14 left-4 right-4 z-20 rounded-xl border border-slate-700 bg-slate-950/95 p-4 text-slate-100 shadow-2xl backdrop-blur-md max-w-lg mx-auto animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-red-400">{selectedSite.id}</span>
              <span className="text-sm font-extrabold text-white">{selectedSite.name}</span>
            </div>
            <button
              onClick={() => setSelectedSite(null)}
              className="text-slate-400 hover:text-white text-xs px-2 py-0.5 rounded bg-slate-800"
            >
              ✕ Tutup
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2.5 text-xs">
            <div className="bg-slate-900/80 p-2 rounded-lg">
              <span className="text-[10px] text-slate-400 block">Status Grup</span>
              <strong className={selectedSite.group === 'intervention' ? 'text-red-400' : 'text-slate-300'}>
                {selectedSite.group === 'intervention' ? 'Uji Coba 40 Site' : 'Kontrol 10 Site'}
              </strong>
            </div>

            <div className="bg-slate-900/80 p-2 rounded-lg">
              <span className="text-[10px] text-slate-400 block">Efisiensi Daya</span>
              <strong className="text-emerald-400">
                {selectedSite.savingsPct > 0 ? `−${selectedSite.savingsPct}%` : 'Baseline 0%'}
              </strong>
            </div>

            <div className="bg-slate-900/80 p-2 rounded-lg">
              <span className="text-[10px] text-slate-400 block">Konsumsi / Hari</span>
              <strong>{selectedSite.measuredDailyKWh} kWh</strong>
            </div>

            <div className="bg-slate-900/80 p-2 rounded-lg">
              <span className="text-[10px] text-slate-400 block">Call Drop Rate</span>
              <strong className="text-emerald-400">{selectedSite.qosDrop}</strong>
            </div>
          </div>

          {selectedSite.socialZone && selectedSite.socialZone !== 'standard' && (
            <div className="mt-2 p-2 rounded-lg bg-blue-950/60 border border-blue-900 text-[11px] text-blue-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
              <span><strong>Zona Prioritas:</strong> {selectedSite.socialFacility} ({selectedSite.socialRule})</span>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
