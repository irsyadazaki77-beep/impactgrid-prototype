import React, { useState } from 'react';
import { 
  Activity, 
  Database, 
  FileSearch, 
  Radio, 
  ShieldAlert, 
  Zap, 
  ArrowRight, 
  Cpu, 
  CheckCircle2, 
  Clock, 
  Server, 
  BarChart2, 
  ExternalLink,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

const DATA_REQUIREMENTS = [
  { 
    title: 'Meter dan tagihan listrik', 
    detail: 'KWh per periode, nomor akun/aset yang dapat dipadankan, status rekonsiliasi, tarif, dan komponen tagihan.', 
    owner: 'Keuangan / pengelola energi',
    status: 'Spesifikasi Skema Terdefinisi',
    readiness: '80%'
  },
  { 
    title: 'Konsumsi dan konfigurasi perangkat', 
    detail: 'Pengukuran yang sesuai batas lokasi, perangkat, periode, serta perubahan konfigurasi yang disetujui.', 
    owner: 'Network Ops / vendor',
    status: 'Konektor O-RAN Dirancang',
    readiness: '65%'
  },
  { 
    title: 'Trafik dan mutu layanan', 
    detail: 'Indikator agregat, definisi, interval, pengecualian, dan ambang keselamatan yang disetujui operator.', 
    owner: 'Pemilik jaringan',
    status: 'Safety Guardrail Siap',
    readiness: '90%'
  },
  { 
    title: 'Cuaca dan kejadian eksternal', 
    detail: 'Sumber, cakupan, dan metode penyelarasan periode untuk koreksi faktor eksternal.', 
    owner: 'Tim analitik',
    status: 'Model BMKG Terkoneksi',
    readiness: '85%'
  },
  { 
    title: 'Kepemilikan dan izin lokasi', 
    detail: 'Identitas aset, pihak yang berwenang, izin akses data, dan batas modifikasi.', 
    owner: 'Pengelola aset / legal',
    status: 'Audit Ledger Disiapkan',
    readiness: '75%'
  }
];

const SIMULATED_BTS_FEEDS = [
  {
    id: 'JKT-SEL-P01',
    name: 'Kebayoran Baru Macro BTS',
    type: 'Intervensi (Carrier Sleep)',
    powerKw: '3.42 kW',
    powerBaseline: '4.15 kW',
    trafficLoad: '68 Mbps (32% PRB)',
    tempC: '29.4°C',
    status: 'Carrier Sleep B3/B8 Aktif',
    savings: '−17.6%',
    qosStatus: 'Optimal (Call Drop 0.08%)',
    activeBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400'
  },
  {
    id: 'BDG-DGO-P04',
    name: 'Dago Atas Macro Hub',
    type: 'Intervensi (Deep Sleep)',
    powerKw: '2.88 kW',
    powerBaseline: '3.90 kW',
    trafficLoad: '42 Mbps (18% PRB)',
    tempC: '26.8°C',
    status: 'Deep Sleep Symbol Mode',
    savings: '−26.1%',
    qosStatus: 'Optimal (Call Drop 0.05%)',
    activeBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400'
  },
  {
    id: 'SBY-RKT-C02',
    name: 'Rungkut Industri (Control)',
    type: 'Pembanding (Baseline Murni)',
    powerKw: '4.48 kW',
    powerBaseline: '4.50 kW',
    trafficLoad: '145 Mbps (74% PRB)',
    tempC: '33.2°C',
    status: 'Full Load Active',
    savings: '0.0%',
    qosStatus: 'Normal (Call Drop 0.12%)',
    activeBadge: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300'
  }
];

export default function TelemetryTab() {
  const [selectedCluster, setSelectedCluster] = useState('all');

  return (
    <div className="space-y-6">
      
      {/* Executive Header */}
      <header className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-cyan-800 dark:text-cyan-400 text-xs font-bold">
            <Radio className="h-4 w-4" />
            <span>Modul 1: Network Data Hub (rancangan)</span>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800">
            Simulasi Parameter TLKM SR 2025 • 40 Sites Usulan
          </span>
        </div>

        <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Rancangan konsolidasi data energi dan jaringan
        </h1>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          Mengintegrasikan aliran data konsumsi listrik PLN, telemetri RF RAN O-RAN O1, dan korelasi trafik untuk membuktikan penghematan energi secara ilmiah tanpa mengorbankan kualitas layanan pelanggan Telkomsel.
        </p>

        {/* Data Provenance Notice */}
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/70 dark:border-amber-900/40 dark:bg-amber-950/20 p-3.5 text-xs leading-relaxed text-amber-900 dark:text-amber-300">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <div>
            <strong>Transparansi Lingkungan Demo:</strong> Data operasional lapangan memerlukan integrasi API PLN dan O-RAN EMS resmi. Angka makro di bawah adalah data publik Telkom 2025 untuk konteks benchmark korporat.
          </div>
        </div>
      </header>

      {/* Corporate Macro Benchmarks */}
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Konsumsi Listrik Korporat 2025</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-slate-900 dark:text-white tracking-tight">1.885.417.875,2 kWh</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Konteks laporan resmi Telkom Group; bukan baseline lokasi.</p>
        </article>

        <article className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Emisi Scope 2 Korporat 2025</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-slate-900 dark:text-white tracking-tight">1.721.967,7 tCO₂e</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Faktor emisi jaringan nasional resmi TLKM 2025.</p>
        </article>

        <article className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">Target Pilot Usulan (40 Sites)</span>
            <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600">
              <Database className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-slate-900 dark:text-white tracking-tight">~120.000 kWh/thn</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Proyeksi reduksi energi model DSS (sensitivitas 12–18%).</p>
        </article>
      </section>

      {/* Simulated Live BTS Telemetry Stream */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5 text-[#ED0226]" />
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Simulasi Stream Telemetri Node BTS Pilot (Sample Stream)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Data telemetri tersinkronisasi interval 5 menit untuk evaluasi Carrier Sleep & Mutu Layanan
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Streaming Aktif (5m sampling)</span>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {SIMULATED_BTS_FEEDS.map((site) => (
            <div 
              key={site.id} 
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700 transition"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">{site.id}</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{site.name}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${site.activeBadge}`}>
                  {site.savings}
                </span>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700/60 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Daya Terukur:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{site.powerKw} <span className="text-[10px] text-slate-400">(Base: {site.powerBaseline})</span></span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Beban Trafik:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{site.trafficLoad}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Suhu Selubung:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{site.tempC}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status Aksi:</span>
                  <span className="font-bold text-cyan-700 dark:text-cyan-400 truncate">{site.status}</span>
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-200/80 dark:border-slate-700/40 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">QoS Guardrail:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">{site.qosStatus}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Data Ingestion Pipeline Architecture */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
        <div className="mb-4">
          <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
            Arsitektur Pipeline Ingesti & Verifikasi Data (O-RAN O1)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Alur pengolahan data mentah menjadi rekomendasi keputusan hemat energi
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Tahap 1</span>
            <p className="font-bold text-xs text-slate-900 dark:text-white mt-1">Multi-Source Ingestion</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Smart meter PLN (kWh), DC power rectifiers, serta O-RAN O1 PM/FM events.</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Tahap 2</span>
            <p className="font-bold text-xs text-slate-900 dark:text-white mt-1">Data Harmonization</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Penyelarasan interval 5 menit, pembersihan anomali sensor, dan normalisasi cuaca.</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Tahap 3</span>
            <p className="font-bold text-xs text-slate-900 dark:text-white mt-1">Traffic-Power Correlation</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Model DiD memisahkan penghematan asli intervensi dari penurunan trafik alami.</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Tahap 4</span>
            <p className="font-bold text-xs text-slate-900 dark:text-white mt-1">QoS Safety Guardrail</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Interlock otomatis: jika PRB load &gt;60% atau ada panggilan 112, sleep dibatalkan seketika.</p>
          </div>
        </div>
      </section>

      {/* Data Governance & Integration Roadmap Table */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSearch className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Data yang diperlukan sebelum dashboard dapat diisi (Governance Roadmap)
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-500">5 Komponen Terdefinisi</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="p-3">Sumber Data</th>
                <th className="p-3">Kebutuhan Validasi</th>
                <th className="p-3">Pemilik Validasi</th>
                <th className="p-3">Status Desain</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {DATA_REQUIREMENTS.map((item) => (
                <tr key={item.title} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                  <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{item.title}</td>
                  <td className="p-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{item.detail}</td>
                  <td className="p-3 text-xs text-slate-600 dark:text-slate-400 font-medium">{item.owner}</td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 text-[10px] font-bold text-blue-700 dark:text-blue-300 whitespace-nowrap">
                      <CheckCircle2 className="w-3 h-3" />
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Official Footnote */}
      <footer className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 text-xs leading-relaxed text-slate-600 dark:text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <div>
          <strong>Sumber konteks perusahaan:</strong>{' '}
          <a 
            className="font-semibold text-cyan-800 dark:text-cyan-400 hover:underline inline-flex items-center gap-1" 
            href="https://www.telkom.co.id/minio/show/data/lampiran/1778605801197_original_TLKM-SR2025-IND.pdf" 
            target="_blank" 
            rel="noreferrer"
          >
            <span>Laporan Keberlanjutan Telkom 2025</span>
            <ExternalLink className="h-3 w-3" />
          </a>
          . Data dilaporkan pada tingkat perusahaan untuk dasar kalibrasi makro.
        </div>
        <span className="font-mono text-[11px] text-slate-500">Standard: O-RAN WG1 & IPMVP Option B</span>
      </footer>

    </div>
  );
}
