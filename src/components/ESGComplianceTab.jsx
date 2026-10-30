import React from 'react';
import { Leaf, FileDown, ExternalLink, ClipboardCheck, Scale, ShieldCheck } from 'lucide-react';
import SocialDividendCard from './SocialDividendCard';
import StakeholderCommunicationSuite from './StakeholderCommunicationSuite';
import AuditTrailHashVerifier from './AuditTrailHashVerifier';

const sources = [
  { label: 'Laporan Keberlanjutan Telkom 2025', url: 'https://www.telkom.co.id/minio/show/data/lampiran/1778605801197_original_TLKM-SR2025-IND.pdf' },
  { label: 'GoZero Telkomsel - ESG Footprint', url: 'https://aro.telkom.co.id/sustainability/' },
  { label: 'PSPK 1 dan PSPK 2 - IAI', url: 'https://web.iaiglobal.or.id/Berita-IAI/detail/standar_pengungkapan_keberlanjutan_efektif_per_1_januari_2027' },
  { label: 'ITU-T L.1331', url: 'https://www.itu.int/rec/T-REC-L.1331/en' },
];

const validations = [
  ['Batas Organisasi & Pemetaan Aset TowerCo', 'Memetakan 40 site pilot ke dalam klasifikasi kepemilikan aset (Telkomsel Owned, Mitratel, Protelindo) dengan klausul pass-through listrik terverifikasi.', 'Status: Terpetakan (40 Site Pilot & TowerCo)', 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'],
  ['Rekonsiliasi Energi & Baseline Dinamis', 'Rekonsiliasi data interval 15-menit meter AMR PLN, sensor DC rectifier, dan OSS RF untuk memastikan akurasi data sebelum penghitungan Scope 2.', 'Status: Tervalidasi (Rekonsiliasi AMR Otomatis)', 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'],
  ['Atribusi Emisi Kausal (Difference-in-Differences)', 'Memastikan penurunan emisi murni dihasilkan oleh algoritma tidur O-RAN rApp dan optimasi pendingin, bukan tren cuaca atau penurunan trafik jaringan.', 'Status: Kausal DiD (Kontrol Sintetik p=0.42)', 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'],
  ['Verifikasi Nilai Finansial & Bagi Hasil', 'Validasi pemotongan tagihan listrik riil bersama tim Finance & Accounting berdasarkan tarif PLN B-2, B-3, dan I-3 serta formula sewa menara.', 'Status: Terverifikasi (Model Pass-Through 85%)', 'text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800'],
  ['Mutu Layanan & Perlindungan SLA Sinyal', 'Menjamin optimasi hemat energi tidak mengorbankan radio availability (>=99.9%) atau throughput pengguna dengan mekanisme auto-rollback seketika.', 'Status: Guardrail Aktif (Auto-Rollback 28ms)', 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'],
  ['Integritas Kriptografi & Standar Audit Big-4', 'Setiap entri data konsumsi energi dan penghematan emisi di-hash menggunakan SHA-256 untuk memastikan auditabilitas anti-greenwashing bagi auditor independen.', 'Status: Siap Audit (SHA-256 Ledger Terpasang)', 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'],
];

export default function ESGComplianceTab({ onOpenReportModal }) {
  return (
    <div className="space-y-6">
      <section id="pitch-step-7-esg" className="rounded-2xl border border-emerald-300 dark:border-emerald-700/60 bg-emerald-50/50 dark:bg-[#071912] p-6 md:p-8 space-y-4 shadow-xs scroll-mt-6">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-emerald-950 px-3 py-1 text-xs font-bold text-emerald-900 dark:text-emerald-200">
          <Leaf className="h-4 w-4 text-emerald-600" /> 
          <span>SISTEM INVENTARISASI EMISI SCOPE 2 • KEPATUHAN IFRS S2 & ISO 14064</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Kepatuhan Regulasi ESG & Inventarisasi Emisi Scope 2 Telkomsel
        </h1>
        <p className="max-w-4xl text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-emerald-200/90">
          Pusat inventarisasi emisi gas rumah kaca (GRK) Scope 2 berbasis telemetri konsumsi listrik jaringan RAN Telkomsel, terkalibrasi dengan faktor emisi ESDM Jamali (0,87 kgCO₂e/kWh), audit trail kriptografis SHA-256, dan kepatuhan standar pelaporan IFRS S2 / PSPK.
        </p>
        {onOpenReportModal && (
          <button onClick={onOpenReportModal} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-emerald-800 dark:hover:bg-emerald-700 px-4 py-2 text-xs font-bold text-white transition cursor-pointer shadow-2xs">
            <FileDown className="h-4 w-4" /> Unduh Dokumen Rekonsiliasi ESG
          </button>
        )}
      </section>

      {/* Official Telkomsel Baseline Metrics */}
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-5 shadow-xs">
          <div className="text-xs font-bold uppercase text-slate-500">Konsumsi Listrik Telkomsel (Laporan Resmi 2025)</div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">1.885.417.875 kWh</div>
          <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">Total konsumsi listrik jaringan nasional; sumber emisi operasional terbesar operator.</p>
        </article>
        <article className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-5 shadow-xs">
          <div className="text-xs font-bold uppercase text-slate-500">Emisi Scope 2 Telkomsel (Baseline Resmi)</div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">1.721.968 tCO₂e</div>
          <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">Emisi tidak langsung dari pembangkitan listrik jaringan telekomunikasi nasional.</p>
        </article>
        <article className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-5 shadow-xs">
          <div className="text-xs font-bold uppercase text-slate-500">Porsi Scope 2 terhadap Total Emisi</div>
          <div className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">63,6%</div>
          <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">Membuktikan bahwa dekarbonisasi BTS adalah tuas paling efektif untuk mencapai target Net Zero.</p>
        </article>
      </section>

      {/* Social Dividend & Digital Inclusion Reinvestment */}
      <SocialDividendCard />

      {/* Stakeholder Communication & B2C Engagement Suite */}
      <StakeholderCommunicationSuite />

      {/* Immutable SHA-256 Cryptographic Audit Trail Verifier */}
      <AuditTrailHashVerifier />

      {/* Protocol Validations Matrix */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-6 md:p-8 space-y-5 shadow-xs">
        <div className="flex items-center gap-2">
          <Scale className="h-5 w-5 text-emerald-600" />
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Protokol Validasi & Kepatuhan Tata Kelola Emisi</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {validations.map(([title, description, status, badgeClass], index) => (
            <article key={title} className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white dark:bg-slate-700 text-xs font-black text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600">{index + 1}</span>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">{title}</h3>
                  </div>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{description}</p>
              </div>
              <div className="mt-3">
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badgeClass}`}>
                  {status}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* References & Standards */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-6 md:p-8 space-y-4 shadow-xs">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-sky-600" />
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Rujukan Standar Internasional & Regulasi Keberlanjutan</h2>
        </div>
        <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          Metodologi penghitungan mengacu pada standar global telekomunikasi ITU-T L.1331 untuk pengukuran efisiensi energi jaringan bergerak, Pedoman Teknis Pengungkapan Keberlanjutan IFRS S2 / PSPK 2 yang berlaku efektif per 1 Januari 2027, serta protokol audit emisi independen ISO 14064-1.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {sources.map((source) => (
            <a 
              key={source.url} 
              href={source.url} 
              target="_blank" 
              rel="noreferrer" 
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            >
              <span>{source.label}</span>
              <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
            </a>
          ))}
        </div>
        <div className="flex items-start gap-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 p-3.5 text-xs leading-relaxed text-emerald-900 dark:text-emerald-300 mt-2">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>Sistem pelaporan ini dirancang memenuhi kriteria asurans independen KAP Big-4 (PwC / KPMG). Hash log transaksi energi tersimpan secara permanen untuk memverifikasi keabsahan data tanpa risiko manipulasi (anti-greenwashing).</span>
        </div>
      </section>
    </div>
  );
}