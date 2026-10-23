import React from 'react';
import { Leaf, FileDown, ExternalLink, ClipboardCheck, Database, Scale, ShieldCheck } from 'lucide-react';

const sources = [
  { label: 'Laporan Keberlanjutan Telkom 2025', url: 'https://www.telkom.co.id/minio/show/data/lampiran/1778605801197_original_TLKM-SR2025-IND.pdf' },
  { label: 'GoZero Telkomsel - ESG Footprint', url: 'https://aro.telkom.co.id/sustainability/' },
  { label: 'PSPK 1 dan PSPK 2 - IAI', url: 'https://web.iaiglobal.or.id/Berita-IAI/detail/standar_pengungkapan_keberlanjutan_efektif_per_1_januari_2027' },
  { label: 'ITU-T L.1331', url: 'https://www.itu.int/rec/T-REC-L.1331/en' },
];

const validations = [
  ['Batas organisasi dan aset', 'Pastikan lokasi serta peralatan berada dalam kendali atau izin intervensi Telkomsel; petakan aset milik tower company.'],
  ['Energi dan baseline', 'Rekonsiliasi meter, tagihan, interval data, dan periode operasi. Gunakan baseline per site yang disahkan pemilik data.'],
  ['Efek intervensi', 'Tetapkan kelompok pembanding dan periode pra/pasca. Koreksi trafik, cuaca, perubahan perangkat, dan gangguan; laporkan ketidakpastian.'],
  ['Biaya dan manfaat', 'Verifikasi kontrak serta tarif efektif, biaya yang benar-benar dapat dihindari, penawaran vendor, CapEx, dan OpEx bersama Finance.'],
  ['Mutu layanan dan keamanan', 'Tetapkan batas QoS dan prosedur rollback bersama tim operasi. Uji aman di lingkungan yang disetujui; prototipe tidak mengendalikan jaringan.'],
  ['Emisi dan pelaporan', 'Gunakan faktor emisi resmi yang sesuai lokasi dan periode setelah disetujui ESG. Hash hanya menjaga integritas berkas, bukan membuktikan kebenaran data.'],
];

export default function ESGComplianceTab({ onOpenReportModal }) {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-amber-300 bg-amber-50 p-6 md:p-8 space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-white px-3 py-1 text-xs font-bold text-amber-900">
          <Leaf className="h-4 w-4" /> Rancangan pengukuran ESG
        </div>
        <h1 className="text-2xl font-black text-slate-900">Metodologi diusulkan; hasil pilot dan verifikasi belum tersedia</h1>
        <p className="max-w-4xl text-sm leading-relaxed text-slate-700">
          Halaman ini memisahkan konteks resmi perusahaan dari rancangan pengukuran ImpactGrid. Angka perusahaan di bawah bersumber dari publikasi 2025; angka tersebut bukan baseline site dan tidak membuktikan reduksi emisi dari solusi ini.
        </p>
        {onOpenReportModal && (
          <button onClick={onOpenReportModal} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800">
            <FileDown className="h-4 w-4" /> Lihat lembar kerja validasi
          </button>
        )}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-xs font-bold uppercase text-slate-500">Listrik Telkomsel • 2025</div>
          <div className="mt-2 text-2xl font-black text-slate-900">1.885.417.875,2 kWh</div>
          <p className="mt-2 text-xs leading-relaxed text-slate-600">Konsumsi tingkat perusahaan dalam laporan; bukan data untuk 40 lokasi pilot.</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-xs font-bold uppercase text-slate-500">Emisi Scope 2 • 2025</div>
          <div className="mt-2 text-2xl font-black text-slate-900">1.721.967,7 tCO₂e</div>
          <p className="mt-2 text-xs leading-relaxed text-slate-600">Angka laporan; nilai agregat ini tidak dipakai menghitung dampak pilot.</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-xs font-bold uppercase text-slate-500">Bagian Scope 2 • 2025</div>
          <div className="mt-2 text-2xl font-black text-slate-900">63,6%</div>
          <p className="mt-2 text-xs leading-relaxed text-slate-600">Porsi terhadap total emisi Telkomsel yang dilaporkan sebesar 2.708.749 tCO₂e.</p>
        </article>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 space-y-5">
        <div className="flex items-center gap-2"><Scale className="h-5 w-5 text-red-600" /><h2 className="text-lg font-extrabold text-slate-900">Daftar validasi sebelum klaim dampak</h2></div>
        <div className="grid gap-3 md:grid-cols-2">
          {validations.map(([title, description], index) => (
            <article key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-black text-slate-600">{index + 1}</span><h3 className="font-extrabold text-slate-900">{title}</h3></div>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">{description}</p>
              <div className="mt-3 text-[10px] font-black uppercase tracking-wide text-amber-800">Status: belum divalidasi</div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-2"><ClipboardCheck className="h-5 w-5 text-sky-700" /><h2 className="text-lg font-extrabold text-slate-900">Rujukan dan batas klaim</h2></div>
        <p className="text-sm leading-relaxed text-slate-600">PSPK 1 dan PSPK 2 berlaku mulai 1 Januari 2027. ITU-T L.1331 dapat dijadikan rujukan pengukuran efisiensi energi jaringan, tetapi rujukan standar tidak otomatis berarti metode atau hasil ImpactGrid telah diaudit atau disetujui.</p>
        <div className="flex flex-wrap gap-2">
          {sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100">{source.label}<ExternalLink className="h-3 w-3" /></a>)}
        </div>
        <div className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-600"><Database className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" /><span>Website memakai data sintetis. Tidak ada nilai emisi pilot, sertifikat assurance, audit independen, atau persetujuan korporat yang dihasilkan dari demo ini.</span></div>
      </section>
    </div>
  );
}
