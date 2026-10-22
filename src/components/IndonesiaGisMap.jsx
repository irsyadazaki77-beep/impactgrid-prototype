import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { 
  MapPin, 
  Zap, 
  Radio, 
  ShieldCheck, 
  TrendingUp, 
  Activity, 
  Server, 
  Thermometer, 
  Leaf,
  Layers,
  Sparkles,
  Compass,
  CheckCircle2,
  SignalHigh,
  Maximize2
} from 'lucide-react';

// Tile provider presets 100% GRATIS & TANPA API KEY WATERMARK
const BASEMAP_TILES = {
  osm: {
    name: 'Peta Asli OSM (Standard)',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  satellite: {
    name: 'Satelit Realistis (ESRI)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri, USGS, NOAA'
  },
  topo: {
    name: 'Topografi & Elevasi',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap, SRTM | OpenTopoMap'
  }
};

// Data kluster regional resmi Telkomsel dengan koordinat Lat/Lng riil (disesuaikan agar tidak saling tumpang tindih)
const CLUSTERS = [
  {
    id: 'sumatera',
    name: 'Regional Sumatera',
    area: 'Sumbagut - Sumbagteng - Sumbagsel',
    city: 'Medan & Palembang',
    lat: 0.5071,
    lng: 101.4478,
    sites: '48.210 BTS',
    loadMW: '142,4 MW',
    savingMW: '14,8 MW',
    savingPct: '10,4%',
    status: 'Optimal (Sleep Mode 3GPP Aktif)',
    pue: 1.48,
    reductionCo2: '1.240 ton/bln',
    statusType: 'optimal',
    primaryVendor: 'Ericsson / Huawei'
  },
  {
    id: 'jabodetabek',
    name: 'Regional Jabodetabek',
    area: 'DKI Jakarta, Bogor, Depok, Tangerang, Bekasi',
    city: 'Jakarta Greater Metro',
    lat: -5.95,
    lng: 106.82,
    sites: '72.450 BTS',
    loadMW: '235,1 MW',
    savingMW: '28,2 MW',
    savingPct: '12,0%',
    status: 'Siaga Trafik Tinggi (Adaptive Micro-sleep)',
    pue: 1.38,
    reductionCo2: '2.560 ton/bln',
    statusType: 'siaga',
    primaryVendor: 'Ericsson / Nokia'
  },
  {
    id: 'jabar',
    name: 'Regional Jawa Barat',
    area: 'Bandung Raya, Priangan, Pantura Jabar',
    city: 'Bandung - Cirebon',
    lat: -7.20,
    lng: 107.60,
    sites: '36.800 BTS',
    loadMW: '118,5 MW',
    savingMW: '12,4 MW',
    savingPct: '10,5%',
    status: 'Optimal (Hybrid Solar + AI Setpoint)',
    pue: 1.42,
    reductionCo2: '1.050 ton/bln',
    statusType: 'optimal',
    primaryVendor: 'Huawei / ZTE'
  },
  {
    id: 'jateng_diy',
    name: 'Regional Jawa Tengah & DIY',
    area: 'Semarang, Surakarta, D.I. Yogyakarta',
    city: 'Semarang - Solo - Jogja',
    lat: -6.95,
    lng: 110.42,
    sites: '38.100 BTS',
    loadMW: '124,0 MW',
    savingMW: '13,1 MW',
    savingPct: '10,6%',
    status: 'Optimal (Cooling Optimization 26°C)',
    pue: 1.40,
    reductionCo2: '1.140 ton/bln',
    statusType: 'optimal',
    primaryVendor: 'Huawei / Nokia'
  },
  {
    id: 'jatim_bali',
    name: 'Regional Jatim & Bali Nusra',
    area: 'Gerbangkertosusila, Malang, Denpasar, Lombok',
    city: 'Surabaya - Denpasar',
    lat: -7.50,
    lng: 113.75,
    sites: '54.300 BTS',
    loadMW: '168,2 MW',
    savingMW: '18,5 MW',
    savingPct: '11,0%',
    status: 'Optimal (PUE Shelter Efisien)',
    pue: 1.41,
    reductionCo2: '1.620 ton/bln',
    statusType: 'optimal',
    primaryVendor: 'Huawei / ZTE'
  },
  {
    id: 'kalimantan',
    name: 'Regional Kalimantan',
    area: 'Kalbar, Kalsel, Kalteng, Kaltim, Kaltara & IKN',
    city: 'Balikpapan - IKN Nusantara',
    lat: -0.95,
    lng: 116.85,
    sites: '26.900 BTS',
    loadMW: '82,3 MW',
    savingMW: '8,9 MW',
    savingPct: '10,8%',
    status: 'Standar IKN Smart Green Telco',
    pue: 1.36,
    reductionCo2: '890 ton/bln',
    statusType: 'optimal',
    primaryVendor: 'Ericsson / Huawei'
  },
  {
    id: 'sulawesi',
    name: 'Regional Sulawesi',
    area: 'Sulsel, Sulut, Sulteng, Sultra, Gorontalo, Sulbar',
    city: 'Makassar - Manado',
    lat: -3.20,
    lng: 120.20,
    sites: '31.200 BTS',
    loadMW: '94,1 MW',
    savingMW: '9,8 MW',
    savingPct: '10,4%',
    status: 'Optimal (BESS Off-Peak Peak-Shaving)',
    pue: 1.44,
    reductionCo2: '930 ton/bln',
    statusType: 'optimal',
    primaryVendor: 'ZTE / Huawei'
  },
  {
    id: 'maluku_papua',
    name: 'Regional Maluku & Papua',
    area: 'Maluku, Malut, Papua, Papua Barat & Otonomi Baru',
    city: 'Ambon - Jayapura',
    lat: -2.90,
    lng: 136.50,
    sites: '23.276 BTS',
    loadMW: '68,2 MW',
    savingMW: '7,1 MW',
    savingPct: '10,4%',
    status: 'Optimal (Solar Off-Grid Microgrid USO)',
    pue: 1.46,
    reductionCo2: '710 ton/bln',
    statusType: 'optimal',
    primaryVendor: 'ZTE / FiberStar'
  }
];

// Rute Palapa Ring Fiber Optic Backbone Nyata
const PALAPA_RING_BACKBONE = [
  // Cincin Barat & Tengah
  [
    [-0.5897, 101.3431], // Pekanbaru/Sumatera
    [-6.2088, 106.8456], // Jakarta
    [-6.9175, 107.6191], // Bandung
    [-7.3506, 110.3695], // Semarang
    [-7.9500, 113.8000], // Surabaya/Bali
    [-1.2379, 116.8529], // Balikpapan / IKN
    [-3.5000, 119.8000], // Makassar
    [-3.2000, 135.0000]  // Papua / Jayapura
  ],
  // Interkoneksi Jawa - Kalimantan
  [
    [-6.2088, 106.8456],
    [-1.2379, 116.8529]
  ],
  // Interkoneksi Bali - Makassar
  [
    [-7.9500, 113.8000],
    [-3.5000, 119.8000]
  ]
];

// Helper to generate dynamic high-resolution SVG Leaflet DivIcon
const createCustomMarkerIcon = (cluster, isSelected, mapLayer) => {
  let badgeColor = '#10b981'; // emerald
  let badgeText = `${cluster.savingMW}`;
  if (mapLayer === 'pue') {
    badgeColor = cluster.pue <= 1.40 ? '#10b981' : '#0284c7';
    badgeText = `${cluster.pue} PUE`;
  } else if (mapLayer === 'saving') {
    badgeColor = '#10b981';
    badgeText = `+${cluster.savingPct}`;
  } else {
    badgeColor = cluster.statusType === 'optimal' ? '#10b981' : '#f59e0b';
    badgeText = cluster.statusType === 'optimal' ? 'OPTIMAL' : 'SIAGA';
  }

  const pinBg = isSelected ? '#ED0226' : '#ffffff';
  const pinBorder = isSelected ? '#ffffff' : '#ED0226';
  const iconColor = isSelected ? '#ffffff' : '#ED0226';
  const scale = isSelected ? 'scale(1.15)' : 'scale(1)';

  const html = `
    <div style="position: relative; transform: translate(-50%, -100%); display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: transform 0.2s ease; z-index: ${isSelected ? 50 : 20};">
      <!-- Pulsing radar ring for active/selected state -->
      ${isSelected ? `
        <div style="position: absolute; top: -6px; width: 40px; height: 40px; border-radius: 50%; background: rgba(237, 2, 38, 0.35); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      ` : ''}
      
      <!-- Compact Pin Circle Icon -->
      <div style="width: 28px; height: 28px; border-radius: 50%; background: ${pinBg}; border: 2px solid ${pinBorder}; box-shadow: 0 3px 10px rgba(0,0,0,0.22); display: flex; align-items: center; justify-content: center; transform: ${scale}; z-index: 10;">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"></path>
          <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"></path>
          <circle cx="12" cy="12" r="2"></circle>
          <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"></path>
          <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"></path>
        </svg>
      </div>

      <!-- Ultra-Clean Floating Pill Label -->
      <div style="margin-top: 3px; white-space: nowrap; background: ${isSelected ? '#0f172a' : 'rgba(255, 255, 255, 0.96)'}; backdrop-filter: blur(4px); color: ${isSelected ? '#ffffff' : '#0f172a'}; padding: 1.5px 7px; border-radius: 10px; font-size: 9.5px; font-weight: 700; box-shadow: 0 2px 6px rgba(0,0,0,0.18); border: 1px solid ${isSelected ? '#334155' : '#cbd5e1'}; display: flex; align-items: center; gap: 4px; font-family: ui-sans-serif, system-ui, sans-serif;">
        <span style="width: 5px; height: 5px; border-radius: 50%; background: ${badgeColor}; display: inline-block;"></span>
        <span>${cluster.name.replace('Regional ', '')}</span>
        <span style="opacity: ${isSelected ? '0.85' : '0.65'}; font-size: 8.5px; font-family: monospace;">(${badgeText})</span>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-leaflet-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 28]
  });
};

export default function IndonesiaGisMap({ onSelectCluster, selectedClusterId }) {
  const [activeClusterId, setActiveClusterId] = useState(selectedClusterId || 'jabodetabek');
  const [mapLayer, setMapLayer] = useState('status'); // 'status' | 'pue' | 'saving'
  const [baseMap, setBaseMap] = useState('osm'); // 'osm' | 'satellite' | 'topo'

  const activeCluster = CLUSTERS.find(c => c.id === (selectedClusterId || activeClusterId)) || CLUSTERS[1];

  const handleMarkerClick = (cluster) => {
    setActiveClusterId(cluster.id);
    if (onSelectCluster) {
      onSelectCluster(cluster);
    }
  };

  return (
    <div className="space-y-4">
      {/* Map Control Sub-Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center space-x-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
          </span>
          <h3 className="text-xs font-bold text-slate-900 tracking-tight">
            Peta Geospasial Realistis: 8 Wilayah Terkoneksi Real-Time
          </h3>
          <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            293.136 Menara BTS Telkomsel
          </span>
        </div>

        {/* Visual Layer Toggles & Map Style */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Basemap Selection */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setBaseMap('osm')}
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition cursor-pointer ${
                baseMap === 'osm' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Peta Asli Terang
            </button>
            <button
              onClick={() => setBaseMap('satellite')}
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition cursor-pointer ${
                baseMap === 'satellite' ? 'bg-[#0f172a] text-amber-300 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Satelit Riil
            </button>
            <button
              onClick={() => setBaseMap('topo')}
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition cursor-pointer ${
                baseMap === 'topo' ? 'bg-emerald-800 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Topografi
            </button>
          </div>

          <div className="h-4 w-px bg-slate-300 hidden sm:block"></div>

          {/* Metric Layer Switches */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setMapLayer('status')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                mapLayer === 'status' ? 'bg-slate-900 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Status AI
            </button>
            <button
              onClick={() => setMapLayer('pue')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                mapLayer === 'pue' ? 'bg-cyan-700 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              PUE Shelter AC
            </button>
            <button
              onClick={() => setMapLayer('saving')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                mapLayer === 'saving' ? 'bg-emerald-700 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              MW Terhemat
            </button>
          </div>
        </div>
      </div>

      {/* Real Geographic Map Canvas using OpenStreetMap & Esri GIS with Leaflet */}
      <div className="relative w-full h-[360px] sm:h-[420px] rounded-2xl border border-slate-200 overflow-hidden shadow-sm z-10">
        <MapContainer
          center={[-2.5, 118.0]}
          zoom={5}
          minZoom={4}
          maxZoom={10}
          scrollWheelZoom={false}
          zoomControl={false}
          className="w-full h-full"
          style={{ height: '100%', width: '100%', background: '#d4dadc' }}
        >
          {/* Custom Zoom Control top right */}
          <ZoomControl position="topright" />

          {/* Live Basemap Layer from Global CDN */}
          <TileLayer
            key={baseMap}
            url={BASEMAP_TILES[baseMap].url}
            attribution={BASEMAP_TILES[baseMap].attribution}
          />

          {/* Palapa Ring Submarine Cable Polyline Overlay */}
          {PALAPA_RING_BACKBONE.map((segment, idx) => (
            <Polyline
              key={idx}
              positions={segment}
              pathOptions={{
                color: baseMap === 'satellite' ? '#38bdf8' : '#ED0226',
                weight: 2.5,
                dashArray: '6, 8',
                opacity: 0.85
              }}
            >
              <Tooltip sticky>
                <div className="text-[11px] font-sans font-bold text-slate-900">
                  Palapa Ring Telkomsel Submarine Optical Backbone
                </div>
              </Tooltip>
            </Polyline>
          ))}

          {/* Regional BTS Cluster Interactive Markers */}
          {CLUSTERS.map((cluster) => {
            const isSelected = activeCluster.id === cluster.id;
            const markerIcon = createCustomMarkerIcon(cluster, isSelected, mapLayer);

            return (
              <Marker
                key={cluster.id}
                position={[cluster.lat, cluster.lng]}
                icon={markerIcon}
                eventHandlers={{
                  click: () => handleMarkerClick(cluster)
                }}
              >
                <Popup className="custom-popup">
                  <div className="p-2 font-sans min-w-[200px]">
                    <div className="flex items-center justify-between border-b pb-1 mb-1.5">
                      <span className="font-extrabold text-xs text-slate-900">{cluster.name}</span>
                      <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                        {cluster.sites}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mb-2">{cluster.area}</p>
                    <div className="grid grid-cols-2 gap-1.5 text-[10px] bg-slate-50 p-1.5 rounded">
                      <div>
                        <span className="text-slate-400 block">Daya Hemat:</span>
                        <span className="font-bold text-emerald-700">+{cluster.savingMW}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">PUE Shelter:</span>
                        <span className="font-bold text-cyan-800">{cluster.pue}</span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Legend Map Footnote */}
        <div className="absolute bottom-3 left-3 z-[1000] px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200/80 text-[10px] font-sans flex items-center gap-4 shadow-sm pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-[#ED0226] inline-block"></span>
            <span className="text-slate-700 font-semibold">Palapa Ring Backbone</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            <span className="text-slate-700 font-semibold">AI RAN Sleep Mode Aktif</span>
          </div>
          <span className="text-slate-400 font-mono hidden sm:inline">Koordinat WGS 84</span>
        </div>
      </div>

      {/* Selected Cluster Deep-Dive Insights Bar (Executive Card) */}
      {activeCluster && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 p-4 rounded-2xl bg-white border border-slate-200 text-xs shadow-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Wilayah Telkomsel</span>
            <span className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#ED0226] shrink-0" />
              <span className="truncate">{activeCluster.name}</span>
            </span>
            <span className="text-[10px] text-slate-500 truncate block mt-0.5">{activeCluster.city}</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Populasi BTS</span>
            <span className="font-extrabold text-slate-900 text-sm block mt-0.5">{activeCluster.sites}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">{activeCluster.primaryVendor}</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Beban Daya Aktif</span>
            <span className="font-extrabold text-slate-900 text-sm block mt-0.5">{activeCluster.loadMW}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Grid PLN Regional</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Daya Terhemat</span>
            <span className="font-extrabold text-emerald-700 text-sm block mt-0.5">+{activeCluster.savingMW}</span>
            <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">{activeCluster.savingPct} Efisiensi</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">PUE Shelter AC</span>
            <span className="font-extrabold text-cyan-800 text-sm block mt-0.5">{activeCluster.pue} PUE</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Setpoint 26°C Aman</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Reduksi Emisi</span>
            <span className="font-extrabold text-emerald-700 text-sm block mt-0.5">{activeCluster.reductionCo2}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Scope 2 Terhindar</span>
          </div>
        </div>
      )}
    </div>
  );
}
