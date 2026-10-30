import React, { useEffect, useState, useMemo } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, ZoomControl, CircleMarker, Popup, useMap } from 'react-leaflet';
import { MapPin, ShieldAlert, Filter, HeartHandshake, ShieldCheck, GraduationCap, Store, Hospital, Layers, Radio, Building2, Zap } from 'lucide-react';
import { SYNTHETIC_PILOT_SITES_50 } from '../data/mockData';
import IndonesiaSvgOfflineMap from './IndonesiaSvgOfflineMap';

export function getSiteTelcoMetadata(site) {
  const isArea3 = site.cluster === 'SBY-IND';
  const tselArea = isArea3 ? 'Area 3 (Jawa Bali Nusra)' : 'Area 2 (Jabotabek & Jabar)';
  
  let vendor = 'Huawei SingleRAN BBU5900';
  let vendorKey = 'huawei';
  if (site.id.includes('BDG') || site.id.includes('DGO') || site.id.includes('RIA') || site.id.includes('BST')) {
    vendor = 'Ericsson Radio System BB6648';
    vendorKey = 'ericsson';
  } else if (site.id.includes('RKT-30') || site.id.includes('DAR-35') || site.id.includes('TNG-13') || site.id.includes('C04') || site.id.includes('C09')) {
    vendor = 'ZTE Uni-RAN B8300';
    vendorKey = 'zte';
  } else if (parseInt(site.id.slice(-2)) % 3 === 0) {
    vendor = 'Ericsson Radio System BB6648';
    vendorKey = 'ericsson';
  }

  const towerCo = (site.id.includes('04') || site.id.includes('15') || site.id.includes('28') || site.id.includes('39')) 
    ? 'Protelindo' 
    : 'Mitratel (PT Dayamitra Telekomunikasi)';

  const plnTariff = 'Tarif B-3/TM (33 kVA)';
  const bessCapacity = 'LiFePO4 48V 200Ah (15 kWh)';
  
  return { tselArea, vendor, vendorKey, towerCo, plnTariff, bessCapacity };
}

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
  const [areaFilter, setAreaFilter] = useState('all'); // 'all' | 'area2' | 'area3'
  const [vendorFilter, setVendorFilter] = useState('all'); // 'all' | 'huawei' | 'ericsson' | 'zte'
  const [groupFilter, setGroupFilter] = useState('all'); // 'all' | 'intervention' | 'control'
  const [showSocialOverlay, setShowSocialOverlay] = useState(false);
  const [forceSvgMode, setForceSvgMode] = useState(false);

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

  // Filter sites according to selected cluster, area, vendor and group
  const filteredSites = useMemo(() => {
    return SYNTHETIC_PILOT_SITES_50.filter((site) => {
      const meta = getSiteTelcoMetadata(site);
      const matchCluster = activeCluster === 'all' || 
        (activeCluster === 'jkt' && site.cluster === 'JKT-URB') ||
        (activeCluster === 'bdg' && site.cluster === 'BDG-SUB') ||
        (activeCluster === 'sby' && site.cluster === 'SBY-IND');
      const matchArea = areaFilter === 'all' || 
        (areaFilter === 'area2' && (site.cluster === 'JKT-URB' || site.cluster === 'BDG-SUB')) ||
        (areaFilter === 'area3' && site.cluster === 'SBY-IND');
      const matchVendor = vendorFilter === 'all' || meta.vendorKey === vendorFilter;
      const matchGroup = groupFilter === 'all' || site.group === groupFilter;
      return matchCluster && matchArea && matchVendor && matchGroup;
    });
  }, [activeCluster, areaFilter, vendorFilter, groupFilter]);

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
      <div className="flex flex-col gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B1324]/60 p-3 text-xs">
        {/* Row 1: Header, Area & Cluster Selector */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-800 pb-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-100">
              <MapPin className="h-4 w-4 text-[#ED0226]" />
              <span>Kluster Pilot 50 Site</span>
            </div>

            {/* Telkomsel Official Area Filter */}
            <div className="flex items-center gap-1 ml-1">
              <button
                type="button"
                onClick={() => { setAreaFilter('all'); setActiveCluster('all'); }}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition cursor-pointer ${
                  areaFilter === 'all' && activeCluster === 'all'
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                Semua Jamali (50)
              </button>
              <button
                type="button"
                onClick={() => { setAreaFilter('area2'); setActiveCluster('all'); }}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition cursor-pointer ${
                  areaFilter === 'area2'
                    ? 'bg-[#ED0226] text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
                title="Area 2 Telkomsel: Jabotabek & Jawa Barat (Jakarta 20 + Bandung 15)"
              >
                Area 2: Jabotabek & Jabar (35)
              </button>
              <button
                type="button"
                onClick={() => { setAreaFilter('area3'); setActiveCluster('sby'); }}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition cursor-pointer ${
                  areaFilter === 'area3'
                    ? 'bg-[#ED0226] text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
                title="Area 3 Telkomsel: Jawa Bali Nusra (Surabaya Industrial Corridor 15)"
              >
                Area 3: Jawa Bali Nusra (15)
              </button>
            </div>

            {/* Sub-cluster Focus */}
            <div className="hidden lg:flex items-center gap-1 border-l border-slate-300 dark:border-slate-700 pl-2">
              <button
                type="button"
                onClick={() => { setActiveCluster('jkt'); setAreaFilter('all'); }}
                className={`px-2 py-0.5 rounded-md font-semibold text-[10px] transition cursor-pointer ${
                  activeCluster === 'jkt' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                JKT (20)
              </button>
              <button
                type="button"
                onClick={() => { setActiveCluster('bdg'); setAreaFilter('all'); }}
                className={`px-2 py-0.5 rounded-md font-semibold text-[10px] transition cursor-pointer ${
                  activeCluster === 'bdg' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                BDG (15)
              </button>
              <button
                type="button"
                onClick={() => { setActiveCluster('sby'); setAreaFilter('all'); }}
                className={`px-2 py-0.5 rounded-md font-semibold text-[10px] transition cursor-pointer ${
                  activeCluster === 'sby' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                SBY (15)
              </button>
            </div>
          </div>

          {/* Social Protected Zones Toggle */}
          <button
            type="button"
            onClick={() => setShowSocialOverlay(prev => !prev)}
            className={`px-2.5 py-1 rounded-lg border font-bold flex items-center gap-1 transition cursor-pointer ${
              showSocialOverlay
                ? 'bg-rose-600 text-white border-rose-700 shadow-2xs'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
            }`}
            title="Tampilkan Zona Perlindungan Sosial: RS/112, Pendidikan Jaga Cita & Sentra UMKM"
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Zona Proteksi Sosial</span>
            {showSocialOverlay && <span className="ml-0.5 text-[9px] bg-rose-800 text-white px-1 rounded-sm">Aktif</span>}
          </button>
        </div>

        {/* Row 2: Multi-Vendor Filter, Group Filter & Map Mode */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
          {/* Vendor Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium flex items-center gap-1">
              <Radio className="w-3 h-3 text-[#ED0226]" />
              <span>Vendor RAN:</span>
            </span>
            <div className="flex items-center gap-1">
              {[
                { key: 'all', label: 'Semua (50)' },
                { key: 'huawei', label: 'Huawei BBU5900' },
                { key: 'ericsson', label: 'Ericsson BB6648' },
                { key: 'zte', label: 'ZTE B8300' }
              ].map(v => (
                <button
                  key={v.key}
                  type="button"
                  onClick={() => setVendorFilter(v.key)}
                  className={`px-2 py-0.5 rounded-md font-bold text-[10px] transition cursor-pointer ${
                    vendorFilter === v.key
                      ? 'bg-cyan-700 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 hidden sm:inline">Filter Grup:</span>
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
            <button
              type="button"
              onClick={() => setForceSvgMode(prev => !prev)}
              className={`px-2.5 py-1 rounded-lg border font-bold flex items-center gap-1 transition cursor-pointer ${
                forceSvgMode || !isOnline || tileStatus === 'unavailable' || tileStatus === 'timeout'
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
              }`}
              title="Beralih antara Leaflet Tile dan Peta Vektor SVG Mandiri (100% Offline)"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{forceSvgMode ? 'Vektor SVG (Offline)' : 'Mode Vektor'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Map Viewport Container */}
      <div className="relative h-[460px] overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
        {!forceSvgMode && isOnline && tileStatus !== 'unavailable' && tileStatus !== 'timeout' ? (
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
              const meta = getSiteTelcoMetadata(site);
              const isIntervention = site.group === 'intervention';
              const isSocial = showSocialOverlay && site.socialZone && site.socialZone !== 'standard';
              
              // Marker styling
              let markerColor = isIntervention ? '#ED0226' : '#475569';
              let markerFill = isIntervention ? '#EF4444' : '#64748B';
              let markerRadius = isIntervention ? 8 : 6;
              let markerWeight = 2;

              if (showSocialOverlay && site.socialZone === 'hospital') {
                markerColor = '#1D4ED8'; // Blue
                markerFill = '#3B82F6';
                markerRadius = 10;
                markerWeight = 3;
              } else if (showSocialOverlay && site.socialZone === 'education') {
                markerColor = '#047857'; // Emerald
                markerFill = '#10B981';
                markerRadius = 10;
                markerWeight = 3;
              } else if (showSocialOverlay && site.socialZone === 'msme') {
                markerColor = '#B45309'; // Amber
                markerFill = '#F59E0B';
                markerRadius = 10;
                markerWeight = 3;
              }

              return (
                <CircleMarker
                  key={site.id}
                  center={[site.lat, site.lng]}
                  radius={markerRadius}
                  pathOptions={{
                    color: markerColor,
                    weight: markerWeight,
                    fillColor: markerFill,
                    fillOpacity: isSocial ? 0.95 : 0.85
                  }}
                >
                  <Popup className="impactgrid-map-popup">
                    <div className="p-3 text-slate-900 min-w-[270px] space-y-2">
                      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1.5">
                        <span className="font-mono text-[10px] font-bold text-slate-500">{site.id}</span>
                        <div className="flex items-center gap-1">
                          {site.socialZone && site.socialZone !== 'standard' && (
                            <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-bold uppercase ${
                              site.socialZone === 'hospital' ? 'bg-blue-100 text-blue-800' :
                              site.socialZone === 'education' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {site.socialZone === 'hospital' ? 'Medis 112' : site.socialZone === 'education' ? 'Jaga Cita' : 'UMKM'}
                            </span>
                          )}
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                            isIntervention ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}>
                            {isIntervention ? 'Uji Coba' : 'Pembanding'}
                          </span>
                        </div>
                      </div>
                      <h4 className="font-extrabold text-xs text-slate-900 leading-snug">{site.name}</h4>

                      {/* Social Protection Rule Callout */}
                      {site.socialZone && site.socialZone !== 'standard' && (
                        <div className="p-2 rounded-lg bg-rose-50/80 border border-rose-200 text-[10px] space-y-0.5">
                          <div className="font-extrabold text-rose-800 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-rose-600" />
                            <span>{site.socialFacility}</span>
                          </div>
                          <p className="text-slate-700 font-medium">
                            <strong>Aturan:</strong> {site.socialRule}
                          </p>
                        </div>
                      )}

                      <div className="text-[11px] text-slate-600 space-y-1">
                        <div className="flex justify-between">
                          <span>Wilayah Telkomsel:</span>
                          <strong className="text-slate-800">{meta.tselArea}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Vendor Perangkat:</span>
                          <strong className="text-cyan-700">{meta.vendor}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>TowerCo / Mitra:</span>
                          <strong className="text-slate-800">{meta.towerCo}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Tarif & Daya PLN:</span>
                          <span className="text-slate-700 font-medium">{meta.plnTariff}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Baterai BESS:</span>
                          <span className="text-emerald-700 font-medium">{meta.bessCapacity}</span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-slate-100">
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
                        *Data telemetri operasional 50 site pilot Telkomsel O-RAN O1
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        ) : (
          <IndonesiaSvgOfflineMap
            activeCluster={activeCluster}
            groupFilter={groupFilter}
            showSocialOverlay={showSocialOverlay}
          />
        )}

        {/* Legend / Status Overlay Banner */}
        <div className="absolute bottom-3 left-3 right-3 z-[1000] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 rounded-xl border border-amber-300 dark:border-amber-900/60 bg-amber-50/95 dark:bg-[#0B1324]/95 p-3 text-xs leading-relaxed text-amber-950 dark:text-amber-200 shadow-md backdrop-blur-xs">
          <div className="flex items-start gap-2 flex-1">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <span>
              <strong>{tileStatus === 'unavailable' || tileStatus === 'timeout' ? 'Peta dasar belum berhasil dimuat.' : 'Peta Sebaran 50 Lokasi Pilot Sintetis.'}</strong> {tileStatus === 'unavailable' ? 'Tile gagal diakses; demo inti tetap berjalan tanpa peta.' : tileStatus === 'timeout' ? 'Akses peta belum merespons setelah 8 detik; demo inti tetap berjalan.' : `Menampilkan ${filteredSites.length} menara (${interventionCount} intervensi Carrier Sleep/HVAC + ${controlCount} kontrol pembanding) pada koridor Jawa–Bali.`}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0 text-[10px] font-bold">
            <span className="flex items-center gap-1 text-red-600"><span className="w-2.5 h-2.5 rounded-full bg-red-600"></span> Intervensi (40)</span>
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400"><span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span> Kontrol (10)</span>
            {showSocialOverlay && (
              <>
                <span className="flex items-center gap-1 text-blue-600"><span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Medis 112</span>
                <span className="flex items-center gap-1 text-emerald-600"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Jaga Cita</span>
                <span className="flex items-center gap-1 text-amber-600"><span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span> UMKM</span>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}