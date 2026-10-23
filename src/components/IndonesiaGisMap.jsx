import React, { useState, useEffect } from 'react';
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
  Maximize2,
  AlertTriangle,
  Info,
  DollarSign,
  Filter
} from 'lucide-react';
import { PILOT_SITES_SAMPLE } from '../data/mockData';
import DataBadge from './DataBadge';

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

// Data kluster regional resmi Telkomsel dengan koordinat Lat/Lng riil
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
    financialSavingIDR: 'Rp 22,2 Miliar/thn',
    statusType: 'optimal',
    primaryVendor: 'Ericsson / Huawei',
    anomalyStatus: 'Normal (Toleransi < 1%)',
    recommendedAction: 'Ekspansi dynamic HVAC 26°C ke 1.200 site Macro pedalaman'
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
    financialSavingIDR: 'Rp 42,3 Miliar/thn',
    statusType: 'siaga',
    primaryVendor: 'Ericsson / Nokia',
    anomalyStatus: 'Trafik Padat CBD (Micro-sleep auto-throttle)',
    recommendedAction: 'Gunakan massive MIMO sleep pada jam 02:00-04:30 WIB'
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
    financialSavingIDR: 'Rp 18,6 Miliar/thn',
    statusType: 'optimal',
    primaryVendor: 'Huawei / ZTE',
    anomalyStatus: 'Normal (Zero SLA Breach)',
    recommendedAction: 'Perluas rooftop PV di 450 shelter rural Sukabumi & Garut'
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
    financialSavingIDR: 'Rp 19,6 Miliar/thn',
    statusType: 'optimal',
    primaryVendor: 'Huawei / Nokia',
    anomalyStatus: 'Normal (PUE stabil 1.40)',
    recommendedAction: 'Integrasikan smart meter AMR ke seluruh BTS Pantura'
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
    financialSavingIDR: 'Rp 27,7 Miliar/thn',
    statusType: 'optimal',
    primaryVendor: 'Huawei / ZTE',
    anomalyStatus: 'Normal (Pusat Turis Kuta & Sanur Siaga)',
    recommendedAction: 'Deploy BESS peak shaving untuk menekan beban tarif WBP PLN'
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
    financialSavingIDR: 'Rp 13,3 Miliar/thn',
    statusType: 'optimal',
    primaryVendor: 'Ericsson / Huawei',
    anomalyStatus: 'Model Khusus IKN Nusantara (Zero Scope 2)',
    recommendedAction: 'Standarisasi O-RAN rApp closed-loop di koridor Balikpapan-IKN'
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
    financialSavingIDR: 'Rp 14,7 Miliar/thn',
    statusType: 'optimal',
    primaryVendor: 'ZTE / Huawei',
    anomalyStatus: 'Normal (Grid Sulawesi Selatan Mandiri)',
    recommendedAction: 'Optimalkan siklus discharge baterai LiFePO4 pada 18:00-21:00 WITA'
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
    financialSavingIDR: 'Rp 10,6 Miliar/thn',
    statusType: 'optimal',
    primaryVendor: 'ZTE / FiberStar',
    anomalyStatus: 'Ketergantungan Genset Solar Hybrid Tinggi',
    recommendedAction: 'Ganti genset solar diesel dengan Micro-hydro & Surya terdistribusi'
  }
];

// Rute Palapa Ring Fiber Optic Backbone Nyata
const PALAPA_RING_BACKBONE = [
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
  [
    [-6.2088, 106.8456],
    [-1.2379, 116.8529]
  ],
  [
    [-7.9500, 113.8000],
    [-3.5000, 119.8000]
  ]
];

// Custom marker for Regional Clusters
const createCustomMarkerIcon = (cluster, isSelected, mapLayer) => {
  let badgeColor = cluster.statusType === 'optimal' ? '#10b981' : '#f59e0b';
  let badgeText = `${cluster.savingMW}`;
  if (mapLayer === 'pue') {
    badgeColor = cluster.pue <= 1.40 ? '#10b981' : '#0284c7';
    badgeText = `${cluster.pue} PUE`;
  } else if (mapLayer === 'saving') {
    badgeColor = '#10b981';
    badgeText = `+${cluster.savingPct}`;
  }

  const pinBg = isSelected ? '#ED0226' : '#ffffff';
  const pinBorder = isSelected ? '#ffffff' : '#ED0226';
  const iconColor = isSelected ? '#ffffff' : '#ED0226';
  const scale = isSelected ? 'scale(1.15)' : 'scale(1)';

  const html = `
    <div style="position: relative; transform: translate(-50%, -100%); display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: transform 0.2s ease; z-index: ${isSelected ? 50 : 20};">
      ${isSelected ? `
        <div style="position: absolute; top: -6px; width: 40px; height: 40px; border-radius: 50%; background: rgba(237, 2, 38, 0.35); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      ` : ''}
      <div style="width: 28px; height: 28px; border-radius: 50%; background: ${pinBg}; border: 2px solid ${pinBorder}; box-shadow: 0 3px 10px rgba(0,0,0,0.22); display: flex; align-items: center; justify-content: center; transform: ${scale}; z-index: 10;">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"></path>
          <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"></path>
          <circle cx="12" cy="12" r="2"></circle>
          <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"></path>
          <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"></path>
        </svg>
      </div>
      <div style="margin-top: 3px; white-space: nowrap; background: ${isSelected ? '#0f172a' : 'rgba(255, 255, 255, 0.96)'}; backdrop-filter: blur(4px); color: ${isSelected ? '#ffffff' : '#0f172a'}; padding: 1.5px 7px; border-radius: 10px; font-size: 9.5px; font-weight: 700; box-shadow: 0 2px 6px rgba(0,0,0,0.18); border: 1px solid ${isSelected ? '#334155' : '#cbd5e1'}; display: flex; align-items: center; gap: 4px;">
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

// Custom marker for individual drill-down BTS sites
const createBtsDrillMarkerIcon = (site, isSelected) => {
  const isIntervention = site.type === 'Intervensi';
  const bgColor = isIntervention ? '#ED0226' : '#475569';
  const html = `
    <div style="position: relative; transform: translate(-50%, -50%); display: flex; align-items: center; justify-content: center; cursor: pointer;">
      <div style="width: 14px; height: 14px; border-radius: 50%; background: ${bgColor}; border: 2px solid #ffffff; box-shadow: 0 1px 4px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center;">
        <div style="width: 4px; height: 4px; border-radius: 50%; background: #ffffff;"></div>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-bts-marker',
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
};

export default function IndonesiaGisMap({ onSelectCluster, selectedClusterId }) {
  const [activeClusterId, setActiveClusterId] = useState(selectedClusterId || 'jabodetabek');
  const [mapLayer, setMapLayer] = useState('status'); // 'status' | 'pue' | 'saving'
  const [baseMap, setBaseMap] = useState('osm'); // 'osm' | 'satellite' | 'topo'
  const [showDrillDownBts, setShowDrillDownBts] = useState(true);
  const [selectedBtsSite, setSelectedBtsSite] = useState(null);

  const activeCluster = CLUSTERS.find(c => c.id === (selectedClusterId || activeClusterId)) || CLUSTERS[1];

  const handleMarkerClick = (cluster) => {
    setActiveClusterId(cluster.id);
    setSelectedBtsSite(null);
    if (onSelectCluster) {
      onSelectCluster(cluster);
    }
  };

  return (
    <div className="space-y-4">
      {/* Map Control Sub-Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
          </span>
          <h3 className="text-xs font-bold text-slate-900 tracking-tight">
            Peta Geospasial Interaktif: 8 Wilayah Telkomsel & Drill-Down BTS
          </h3>
          <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            293.136 Menara BTS Terpetakan
          </span>
          <DataBadge type="verified" />
        </div>

        {/* Visual Layer Toggles & Map Style */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* BTS Drill Down Toggle */}
          <button
            onClick={() => setShowDrillDownBts(prev => !prev)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition cursor-pointer flex items-center gap-1.5 ${
              showDrillDownBts 
                ? 'bg-red-50 text-[#ED0226] border-red-200 shadow-2xs' 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Radio className="w-3 h-3" />
            <span>Drill-Down 40 BTS Pilot</span>
          </button>

          {/* Basemap Selection */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setBaseMap('osm')}
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition cursor-pointer ${
                baseMap === 'osm' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              OSM
            </button>
            <button
              onClick={() => setBaseMap('satellite')}
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition cursor-pointer ${
                baseMap === 'satellite' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Satelit
            </button>
            <button
              onClick={() => setBaseMap('topo')}
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition cursor-pointer ${
                baseMap === 'topo' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Topografi
            </button>
          </div>

          {/* Map Layer Mode */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setMapLayer('status')}
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition cursor-pointer ${
                mapLayer === 'status' ? 'bg-[#ED0226] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Status Operasi
            </button>
            <button
              onClick={() => setMapLayer('pue')}
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition cursor-pointer ${
                mapLayer === 'pue' ? 'bg-[#ED0226] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              PUE Shelter
            </button>
            <button
              onClick={() => setMapLayer('saving')}
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition cursor-pointer ${
                mapLayer === 'saving' ? 'bg-[#ED0226] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Daya Hemat
            </button>
          </div>
        </div>
      </div>

      {/* Map Rendering Container */}
      <div className="relative w-full h-[400px] lg:h-[480px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-900">
        <MapContainer
          center={[-2.5, 117.5]}
          zoom={5}
          minZoom={4}
          maxZoom={12}
          scrollWheelZoom={false}
          zoomControl={false}
          className="w-full h-full z-10"
        >
          <ZoomControl position="bottomright" />

          {/* Base Tile Layer */}
          <TileLayer
            attribution={BASEMAP_TILES[baseMap].attribution}
            url={BASEMAP_TILES[baseMap].url}
          />

          {/* Palapa Ring Backbone Polylines */}
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
                  <div className="p-2 font-sans min-w-[220px]">
                    <div className="flex items-center justify-between border-b pb-1 mb-1.5">
                      <span className="font-extrabold text-xs text-slate-900">{cluster.name}</span>
                      <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                        {cluster.sites}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mb-2">{cluster.area}</p>
                    <div className="grid grid-cols-2 gap-1.5 text-[10px] bg-slate-50 p-1.5 rounded mb-1.5">
                      <div>
                        <span className="text-slate-400 block">Daya Hemat:</span>
                        <span className="font-bold text-emerald-700">+{cluster.savingMW}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Finansial:</span>
                        <span className="font-bold text-slate-800">{cluster.financialSavingIDR}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500">
                      <strong>Rekomendasi:</strong> {cluster.recommendedAction}
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Individual Drill-down BTS Sites (Sample 40 Pilot Sites) */}
          {showDrillDownBts && PILOT_SITES_SAMPLE.map((site) => {
            const isSelected = selectedBtsSite?.id === site.id;
            const marker = createBtsDrillMarkerIcon(site, isSelected);

            return (
              <Marker
                key={site.id}
                position={[site.lat, site.lng]}
                icon={marker}
                eventHandlers={{
                  click: () => setSelectedBtsSite(site)
                }}
              >
                <Tooltip direction="top" offset={[0, -8]}>
                  <div className="text-[10px] font-bold">
                    {site.name} ({site.type})
                  </div>
                </Tooltip>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Legend Map Footnote */}
        <div className="absolute bottom-3 left-3 z-[1000] px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200/80 text-[10px] font-sans flex flex-wrap items-center gap-3 shadow-sm pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-[#ED0226] inline-block"></span>
            <span className="text-slate-700 font-semibold">Palapa Ring Backbone</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            <span className="text-slate-700 font-semibold">AI RAN Sleep Aktif</span>
          </div>
          {showDrillDownBts && (
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ED0226] inline-block"></span>
              <span className="text-slate-700 font-semibold">BTS Intervensi</span>
            </div>
          )}
          <span className="text-slate-400 font-mono hidden sm:inline">WGS 84</span>
        </div>
      </div>

      {/* Selected Cluster / BTS Deep-Dive Insights Bar (Executive Card) */}
      {selectedBtsSite ? (
        <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200 text-xs shadow-xs space-y-2">
          <div className="flex items-center justify-between border-b border-red-200/70 pb-2">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#ED0226]" />
              <span className="font-extrabold text-slate-900 text-sm">{selectedBtsSite.name}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-red-700 border border-red-200">
                {selectedBtsSite.type}
              </span>
            </div>
            <button
              onClick={() => setSelectedBtsSite(null)}
              className="text-[10px] text-slate-500 hover:text-slate-800 underline font-semibold cursor-pointer"
            >
              Kembali ke Ikhtisar Regional
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-1">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Vendor RAN</span>
              <span className="font-extrabold text-slate-900">{selectedBtsSite.vendor}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Efisiensi DiD</span>
              <span className="font-extrabold text-emerald-700">+{selectedBtsSite.savingPercent}%</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Suhu Shelter</span>
              <span className="font-extrabold text-slate-800">{selectedBtsSite.tempC}°C (Optimal)</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">PUE Shelter</span>
              <span className="font-extrabold text-cyan-800">{selectedBtsSite.pue}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">SLA Availability</span>
              <span className="font-extrabold text-emerald-700">{selectedBtsSite.slaAvailability}%</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Annual Net Benefit</span>
              <span className="font-extrabold text-emerald-800">
                Rp {(selectedBtsSite.netAnnualBenefitIDR / 1000000).toFixed(1)} Jt
              </span>
            </div>
          </div>
        </div>
      ) : activeCluster && (
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
            <span className="text-[10px] text-slate-500 block mt-0.5">{activeCluster.anomalyStatus}</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Daya Terhemat</span>
            <span className="font-extrabold text-emerald-700 text-sm block mt-0.5">+{activeCluster.savingMW}</span>
            <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">{activeCluster.savingPct} Efisiensi</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Dampak Finansial</span>
            <span className="font-extrabold text-slate-900 text-sm block mt-0.5">{activeCluster.financialSavingIDR}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">PUE {activeCluster.pue}</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Dampak ESG (Scope 2)</span>
            <span className="font-extrabold text-emerald-700 text-sm block mt-0.5">{activeCluster.reductionCo2}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Audit-Ready L.1331</span>
          </div>
        </div>
      )}
    </div>
  );
}
