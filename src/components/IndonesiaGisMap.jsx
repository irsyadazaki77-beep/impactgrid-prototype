import React, { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, ZoomControl, useMap } from 'react-leaflet';
import { MapPin, ShieldAlert } from 'lucide-react';

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

export default function IndonesiaGisMap() {
  const [isOnline, setIsOnline] = useState(() => typeof navigator === 'undefined' ? true : navigator.onLine);
  const [tileStatus, setTileStatus] = useState('loading');
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

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">
        <div className="flex items-center gap-2 font-bold text-slate-800"><MapPin className="h-4 w-4 text-slate-600" />Peta dasar Indonesia</div>
        <span className="text-slate-500">Peta dasar © OpenStreetMap contributors</span>
      </div>
      <div className="relative h-[420px] overflow-hidden rounded-xl border border-slate-200">
        {isOnline ? <MapContainer center={[-2.5, 118]} zoom={4} scrollWheelZoom={false} zoomControl={false} className="h-full w-full">
          <MapResizeHandler />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            eventHandlers={{
              load: () => setTileStatus((status) => status === 'unavailable' ? status : 'ready'),
              tileerror: () => setTileStatus('unavailable'),
            }}
          />
          <ZoomControl position="topright" />
        </MapContainer> : <div className="grid h-full place-items-center bg-slate-100 p-6 text-center text-sm text-slate-600"><p><strong>Peta tidak tersedia saat offline.</strong><br />Simulasi lokal dan data contoh tetap berjalan.</p></div>}
        <div className="absolute bottom-3 left-3 right-3 z-[1000] flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50/95 p-3 text-xs leading-relaxed text-amber-950 shadow">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <span><strong>{tileStatus === 'unavailable' || tileStatus === 'timeout' ? 'Peta dasar belum berhasil dimuat.' : 'Belum ada data lokasi.'}</strong> {tileStatus === 'unavailable' ? 'Tile gagal diakses; demo inti tetap berjalan tanpa peta.' : tileStatus === 'timeout' ? 'Akses peta belum merespons setelah 8 detik; demo inti tetap berjalan.' : 'Peta ini hanya menunjukkan geografi dasar; tidak ada menara, kluster, rute jaringan, atau KPI operasional yang dipetakan.'}</span>
        </div>
      </div>
    </section>
  );
}
