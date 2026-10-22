import React, { useState } from 'react';
import { 
  Radio, 
  Search, 
  Filter, 
  RefreshCw, 
  Database, 
  CheckCircle2, 
  AlertTriangle,
  Layers,
  FileSpreadsheet,
  Building
} from 'lucide-react';
import { PILOT_SITES_SAMPLE, SYSTEM_METADATA } from '../data/mockData';

export default function TelemetryTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 700);
  };

  const filteredSites = PILOT_SITES_SAMPLE.filter(site => {
    const matchesSearch = site.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          site.cluster.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'ALL' || site.type.includes(selectedType);
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Module 1 Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-xs font-bold text-cyan-800">
              <Radio className="w-3.5 h-3.5 text-cyan-600" />
              <span>Modul 1: Network Data Hub</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
              Konsolidasi Data Telemetri & Rekonsiliasi Smart Meter PLN
            </h1>
            <p className="text-xs text-slate-600 max-w-3xl leading-relaxed mt-1">
              Mengintegrasikan data konsumsi listrik aktual, beban trafik data, dan parameter lingkungan dari <strong>40 lokasi intervensi dan 10 lokasi pembanding</strong>, serta merekonsiliasikan catatan smart meter dengan faktur tagihan listrik PLN secara terstruktur.
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold cursor-pointer transition shadow-xs shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-600' : 'text-slate-600'}`} />
            <span>{isRefreshing ? 'Sinkronisasi Data...' : 'Sinkronkan Data Hub'}</span>
          </button>
        </div>

        {/* 4 Pipa Data Utama Network Data Hub */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
            <span className="text-slate-500 font-semibold block text-[11px]">Pipa Meter & Tagihan PLN</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              100% Rekonsiliasi Tagihan
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
            <span className="text-slate-500 font-semibold block text-[11px]">Multi-Vendor RAN Ingestion</span>
            <span className="text-cyan-800 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600" />
              Ericsson, Huawei, ZTE, Nokia
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
            <span className="text-slate-500 font-semibold block text-[11px]">Telemetri Lingkungan Shelter</span>
            <span className="text-amber-800 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
              Suhu Ruang & PUE Terkalibrasi
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
            <span className="text-slate-500 font-semibold block text-[11px]">Kualitas Layanan (QoS)</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Latency & Throughput Aman
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari ID lokasi (LOC-INT-001) / wilayah..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-cyan-500 placeholder-slate-400 font-medium"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-semibold focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="ALL">Semua Kelompok (40 Intervensi + 10 Kontrol)</option>
            <option value="Intervensi">Hanya Lokasi Intervensi (40 Lokasi)</option>
            <option value="Pembanding">Hanya Lokasi Pembanding (10 Kontrol)</option>
          </select>
        </div>
      </div>

      {/* Sites Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Kode Lokasi</th>
                <th className="py-3.5 px-4">Nama Menara / Kluster</th>
                <th className="py-3.5 px-4">Status Kelompok</th>
                <th className="py-3.5 px-4">Baseline Listrik (kWh)</th>
                <th className="py-3.5 px-4">Efisiensi Tercapai</th>
                <th className="py-3.5 px-4">Intervensi Teknis</th>
                <th className="py-3.5 px-4">Mutu Layanan (QoS)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredSites.map((site) => (
                <tr key={site.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {site.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block">{site.name}</span>
                    <span className="text-[11px] text-slate-500 font-medium">{site.cluster}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      site.type === 'Intervensi'
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {site.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900">{site.baselineKWhYear.toLocaleString('id-ID')} kWh</span>
                    <span className="block text-[10px] text-slate-500">Rp 75 Jt beban biaya</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`font-bold ${site.currentEffPct > 0 ? 'text-emerald-700' : 'text-slate-500'}`}>
                      {site.currentEffPct > 0 ? `+${site.currentEffPct}%` : `${site.currentEffPct}%`}
                    </span>
                    <span className="block text-[10px] text-slate-500">{site.savedKWh} kWh dihemat</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 text-[11px] max-w-xs font-medium">
                    {site.intervensiUtama}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-cyan-800">{site.qosLatencyMs} ms</span>
                    <span className="block text-[10px] text-emerald-700 font-semibold">{site.qosSLA}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
          <span>Menampilkan sampel terverifikasi dari 40 lokasi intervensi dan 10 lokasi pembanding</span>
          <span className="font-mono text-[11px] text-slate-600 font-semibold">Total Anggaran Uji Coba: Rp450 Juta (Tabel 5 Proposal)</span>
        </div>
      </div>
    </div>
  );
}
