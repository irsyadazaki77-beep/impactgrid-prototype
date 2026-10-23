import React from 'react';
import { Activity, Database, FileSearch, Radio, ShieldAlert, Zap } from 'lucide-react';

const DATA_REQUIREMENTS = [
  { title: 'Meter dan tagihan listrik', detail: 'KWh per periode, nomor akun/aset yang dapat dipadankan, status rekonsiliasi, tarif, dan komponen tagihan.', owner: 'Keuangan / pengelola energi' },
  { title: 'Konsumsi dan konfigurasi perangkat', detail: 'Pengukuran yang sesuai batas lokasi, perangkat, periode, serta perubahan konfigurasi yang disetujui.', owner: 'Network Ops / vendor' },
  { title: 'Trafik dan mutu layanan', detail: 'Indikator agregat, definisi, interval, pengecualian, dan ambang keselamatan yang disetujui operator.', owner: 'Pemilik jaringan' },
  { title: 'Cuaca dan kejadian eksternal', detail: 'Sumber, cakupan, dan metode penyelarasan periode untuk koreksi faktor eksternal.', owner: 'Tim analitik' },
  { title: 'Kepemilikan dan izin lokasi', detail: 'Identitas aset, pihak yang berwenang, izin akses data, dan batas modifikasi.', owner: 'Pengelola aset / legal' }
];

export default function TelemetryTab() {
  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs">
        <div className="flex items-center gap-2 text-cyan-800 text-xs font-bold">
          <Radio className="h-4 w-4" />
          <span>Modul 1: Network Data Hub (rancangan)</span>
        </div>
        <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900">Rancangan konsolidasi data energi dan jaringan</h1>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-slate-700">
          Tidak ada site, meter, vendor, tagihan, atau telemetri operasional yang terhubung. Karena itu halaman ini tidak menampilkan daftar lokasi, anomali, angka QoS, ataupun status rekonsiliasi seolah-olah hasil lapangan.
        </p>
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
          <div><strong>Baseline lokasi belum tersedia.</strong> Angka pada laporan korporat adalah konteks perusahaan dan tidak dapat dipakai menggantikan pembacaan meter serta tagihan pada lokasi pilot.</div>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <Zap className="h-5 w-5 text-amber-600" />
          <p className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-500">Konsumsi listrik korporat 2025</p>
          <p className="mt-1 text-xl font-black text-slate-900">1.885.417.875,2 kWh</p>
          <p className="mt-2 text-xs text-slate-500">Konteks laporan Telkomsel; bukan baseline lokasi.</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <Activity className="h-5 w-5 text-emerald-700" />
          <p className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-500">Emisi Scope 2 korporat 2025</p>
          <p className="mt-1 text-xl font-black text-slate-900">1.721.967,7 tCO₂e</p>
          <p className="mt-2 text-xs text-slate-500">Data korporat; bukan reduksi dampak ImpactGrid.</p>
        </article>
        <article className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <Database className="h-5 w-5 text-amber-800" />
          <p className="mt-3 text-xs font-bold uppercase tracking-wide text-amber-800">Baseline pilot</p>
          <p className="mt-1 text-xl font-black text-amber-950">Belum tersedia</p>
          <p className="mt-2 text-xs text-amber-900">Perlu meter, tagihan, batas aset, dan periode pengukuran yang disepakati.</p>
        </article>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-4 flex items-center gap-2">
          <FileSearch className="h-4 w-4 text-indigo-600" />
          <h2 className="text-sm font-extrabold text-slate-900">Data yang diperlukan sebelum dashboard dapat diisi</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr><th className="p-3">Sumber</th><th className="p-3">Kebutuhan</th><th className="p-3">Pemilik validasi</th><th className="p-3">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {DATA_REQUIREMENTS.map((item) => (
                <tr key={item.title}>
                  <td className="p-3 font-bold text-slate-800">{item.title}</td>
                  <td className="p-3 text-xs leading-relaxed text-slate-600">{item.detail}</td>
                  <td className="p-3 text-xs text-slate-600">{item.owner}</td>
                  <td className="p-3"><span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-800">Belum diterima</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-600">
        <strong>Sumber konteks perusahaan:</strong> <a className="font-semibold text-cyan-800 underline" href="https://www.telkom.co.id/minio/show/data/lampiran/1778605801197_original_TLKM-SR2025-IND.pdf" target="_blank" rel="noreferrer">Laporan Keberlanjutan Telkom 2025</a>. Data tersebut dilaporkan pada tingkat perusahaan dan tidak membuktikan nilai per lokasi.
      </footer>
    </div>
  );
}
