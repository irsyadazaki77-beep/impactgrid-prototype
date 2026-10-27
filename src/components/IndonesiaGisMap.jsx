import React, { useEffect, useState, useMemo } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, ZoomControl, CircleMarker, Popup, useMap } from 'react-leaflet';
import { MapPin, ShieldAlert, Filter } from 'lucide-react';
import { SYNTHETIC_PILOT_SITES_50 } from '../data/mockData';

function MapResizeHandler() {
  const map = useMap();
  useEffect(() => {
    const container = map.getContainer();
    let animationFrame = 0;
    const invalidateSize = () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = 0;
        map.invalidateSize({ animate: false, pan: false });
      });
    };
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(invalidateSize);
    observer?.observe(container);
    window.addEventListener('resize', invalidateSize);
    invalidateSize();
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', invalidateSize);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, [map]);
  return null;
}

function MapViewRecenter({ targetCenter, targetZoom }) {
  const map = useMap();
  useEffect(() => {
    if (targetCenter) {
      map.flyTo(targetCenter, targetZoom, { duration: 0.8 });
    }
  }, [targetCenter, targetZoom, map]);
  return null;
}

export default function IndonesiaGisMap() {
  const [isOnline, setIsOnline] = useState(() => typeof navigator === 'undefined' ? true : navigator.onLine);
  const [tileStatus, setTileStatus] = useState('loading');
  const [activeCluster, setActiveCluster] = useState('all'); // 'all' | 'jkt' | 'bdg' | 'sby'
  const [groupFilter, setGroupFilter] = useState('all'); // 'all' | 'intervention' | 'control'

  useEffect(() => {
    const handleOnline = () => { setIsOnline(true); setTileStatus('loading'); };
    const handleOffline = () => { setIsOnline(false); setTileStatus('loading'); };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!isOnline || tileStatus !== 'loading') return undefined;
    const timeout = window.setTimeout(() => setTileStatus((status) => status === 'loading' ? 'timeout' : status), 8000);
    return () => window.clearTimeout(timeout);
  }, [isOnline, tileStatus]);

  // Filter sites according to selected cluster and group
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

  // Center & zoom coordinates depending on cluster
  const currentView = useMemo(() => {
    if (activeCluster === 'jkt') return { center: [-6.22, 106.82], zoom: 11 };
    if (activeCluster === 'bdg') return { center: [-6.91, 107.61], zoom: 11 };
    if (activeCluster === 'sby') return { center: [-7.28, 112.74], zoom: 11 };
    return { center: [-6.9, 109.5], zoom: 7 }; // Focus view on Java / Jamali corridor
  }, [activeCluster]);

  const interventionCount = filteredSites.filter(s => s.group === 'intervention').length;
  const controlCount = filteredSites.filter(s => s.group === 'control').length;

  return (
    <section className="space-y-3">
      {/* Interactive Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-100">
            <MapPin className="h-4 w-4 text-[#ED0226]" />
            <span>Peta Kluster Pilot 50 Menara (Sintetis)</span>
          </div>

          <div className="flex items-center gap-1 ml-1">
            <button
              type="button"
              onClick={() => setActiveCluster('all')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition cursor-pointer ${
                activeCluster === 'all'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              Semua Jamali (50)
            </button>
            <button
              type="button"
              onClick={() => setActiveCluster('jkt')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition cursor-pointer ${
                activeCluster === 'jkt'
                  ? 'bg-[#ED0226] text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              Jakarta (20)
            </button>
            <button
              type="button"
              onClick={() => setActiveCluster('bdg')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition cursor-pointer ${
                activeCluster === 'bdg'
                  ? 'bg-[#ED0226] text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              Bandung (15)
            </button>
            <button
              type="button"
              onClick={() => setActiveCluster('sby')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition cursor-pointer ${
                activeCluster === 'sby'
                  ? 'bg-[#ED0226] text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              Surabaya (15)
            </button>
          </div>
        </div>

        {/* Group Filter Toggles */}
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="text-slate-500 hidden sm:inline">Filter:</span>
          <button
            type="button"
            onClick={() => setGroupFilter(g => g === 'all' ? 'intervention' : g === 'intervention' ? 'control' : 'all')}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1 hover:bg-slate-100 cursor-pointer"
          >
            <Filter className="w-3 h-3 text-[#ED0226]" />
            <span>
              {groupFilter === 'all' ? 'Semua Tipe' : groupFilter === 'intervention' ? 'Hanya Intervensi' : 'Hanya Kontrol'}
            </span>
            <span className="ml-1 text-[10px] px-1 rounded-sm bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
              {filteredSites.length}
            </span>
          </button>
        </div>
      </div>

      {/* Map Viewport Container */}
      <div className="relative h-[440px] overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
        {isOnline ? (
          <MapContainer 
            center={currentView.center} 
            zoom={currentView.zoom} 
            scrollWheelZoom={false} 
            zoomControl={false} 
            className="h-full w-full z-0"
          >
            <MapResizeHandler />
            <MapViewRecenter targetCenter={currentView.center} targetZoom={currentView.zoom} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              eventHandlers={{
                load: () => setTileStatus((status) => status === 'unavailable' ? status : 'ready'),
                tileerror: () => setTileStatus('unavailable'),
              }}
            />
            <ZoomControl position="topright" />

            {/* Render 50 Interactive Site Markers */}
            {filteredSites.map((site) => {
              const isIntervention = site.group === 'intervention';
              return (
                <CircleMarker
                  key={site.id}
                  center={[site.lat, site.lng]}
                  radius={isIntervention ? 8 : 6}
                  pathOptions={{
                    color: isIntervention ? '#ED0226' : '#475569',
                    weight: 2,
                    fillColor: isIntervention ? '#EF4444' : '#64748B',
                    fillOpacity: 0.85
                  }}
                >
                  <Popup className="impactgrid-map-popup">
                    <div className="p-3 text-slate-900 min-w-[240px] space-y-2">
                      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1.5">
                        <span className="font-mono text-[10px] font-bold text-slate-500">{site.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          isIntervention ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {isIntervention ? 'Uji Coba' : 'Pembanding'}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-xs text-slate-900 leading-snug">{site.name}</h4>
                      <div className="text-[11px] text-slate-600 space-y-1">
                        <div className="flex justify-between">
                          <span>Wilayah / Kluster:</span>
                          <strong className="text-slate-800">{site.region}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Mode Efisiensi:</span>
                          <strong className="text-red-600">{site.mode}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Konsumsi Harian:</span>
                          <strong>{site.measuredDailyKWh} kWh <span className="text-slate-400 font-normal">/ {site.baselineDailyKWh} kWh</span></strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Penghematan:</span>
                          <strong className={site.savingsPct > 5 ? 'text-emerald-600' : 'text-slate-600'}>
                            {site.savingsPct > 0 ? `−${site.savingsPct}%` : 'Baseline'}
                          </strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Trafik & Utilisasi:</span>
                          <span className="text-slate-700">{site.trafficLoad}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status QoS Call Drop:</span>
                          <span className="text-emerald-700 font-bold">{site.qosDrop}</span>
                        </div>
                      </div>
                      <div className="pt-1.5 border-t border-slate-100 text-[9px] text-slate-400 italic">
                        *Data demonstrasi proposal AWAKENING Reborn (simulasi)
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        ) : (
          <div className="grid h-full place-items-center bg-slate-100 dark:bg-slate-800 p-6 text-center text-sm text-slate-600 dark:text-slate-300">
            <p><strong>Peta tidak tersedia saat offline.</strong><br />Simulasi lokal dan data contoh tetap berjalan.</p>
          </div>
        )}

        {/* Legend / Status Overlay Banner */}
        <div className="absolute bottom-3 left-3 right-3 z-[1000] flex items-start gap-2.5 rounded-xl border border-amber-300 dark:border-amber-900/60 bg-amber-50/95 dark:bg-slate-900/95 p-3 text-xs leading-relaxed text-amber-950 dark:text-amber-200 shadow-md backdrop-blur-xs">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <div className="flex-1">
            <span>
              <strong>{tileStatus === 'unavailable' || tileStatus === 'timeout' ? 'Peta dasar belum berhasil dimuat.' : 'Peta Sebaran 50 Lokasi Pilot Sintetis.'}</strong> {tileStatus === 'unavailable' ? 'Tile gagal diakses; demo inti tetap berjalan tanpa peta.' : tileStatus === 'timeout' ? 'Akses peta belum merespons setelah 8 detik; demo inti tetap berjalan.' : `Menampilkan ${filteredSites.length} menara (${interventionCount} intervensi Carrier Sleep/HVAC + ${controlCount} kontrol pembanding) pada koridor Jawa–Bali.`}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-3 shrink-0 text-[10px] font-bold">
            <span className="flex items-center gap-1 text-red-600"><span className="w-2.5 h-2.5 rounded-full bg-red-600"></span> Intervensi (40)</span>
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400"><span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span> Kontrol (10)</span>
          </div>
        </div>
      </div>
    </section>
  );
}