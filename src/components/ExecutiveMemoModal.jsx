import React from 'react';
import { Printer, X, FileText, ExternalLink, ShieldCheck, Scale, Award, HeartHandshake } from 'lucide-react';

export default function ExecutiveMemoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/80 p-2 sm:p-4 print:p-0 print:bg-white">
      <div className="my-8 w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white text-slate-900 shadow-2xl print:my-0 print:rounded-none print:border-0 print:shadow-none print:max-w-none">
        {/* Sticky Header with Action Buttons */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-800 bg-slate-900 px-6 py-3.5 text-white print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-amber-300" />
            <div>
              <h2 className="text-sm font-extrabold">Memo konsep ImpactGrid</h2>
              <p className="text-[11px] text-slate-300">Executive Investment Dossier 1-Halaman • Dokumen Pengambilan Keputusan Dewan Direksi</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => window.print()} 
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#ED0226] px-4 py-2 text-xs font-bold text-white hover:bg-red-700 transition cursor-pointer shadow-xs"
            >
              <Printer className="h-4 w-4" />
              Cetak / PDF
            </button>
            <button 
              onClick={onClose} 
              aria-label="Tutup" 
              className="rounded-xl p-2 text-slate-300 hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Printable Memo Article */}
        <article className="space-y-6 p-6 sm:p-10 print:p-6 print:space-y-4 text-xs text-slate-800 leading-relaxed font-sans">
          {/* Letterhead & Metadata */}
          <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#ED0226]">
                DOKUMEN KEPUTUSAN INVESTASI RESMI • PT TELEKOMUNIKASI SELULAR
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight mt-0.5">
                EXECUTIVE INVESTMENT DOSSIER
              </h1>
              <p className="text-xs text-slate-600 font-semibold">
                Sistem Pendukung Keputusan (DSS) Efisiensi Energi Jaringan & Validasi ESG
              </p>
            </div>
            <div className="text-left sm:text-right font-mono text-[11px] space-y-0.5 text-slate-600 border-l sm:border-l-0 sm:border-r-0 border-slate-200 pl-3 sm:pl-0">
              <div><strong>Inisiatif:</strong> ImpactGrid Telco Operations</div>
              <div><strong>Status:</strong> Rekomendasi Komite Investasi (Gerbang G0)</div>
              <div><strong>Target Entitas:</strong> PT Telekomunikasi Selular</div>
            </div>
          </div>

          {/* Draf disclaimer */}
          <div className="rounded-xl border border-amber-300 bg-amber-50/90 p-3 text-[11px] font-bold text-amber-950 leading-snug">
            ⚠️ <strong>BERKAS INVESTASI MODAL:</strong> Seluruh angka site dan simulasi dikalibrasi untuk kluster 40 site pilot Jawa Barat & Banten. Keputusan komitmen fisik mengikat menunggu audit baseline 2 bulan pada Gerbang G0.
          </div>

          {/* 1. Masalah & Fakta Dasar 2025 */}
          <section className="space-y-2">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-950 border-b border-slate-200 pb-1 flex items-center justify-between">
              <span>1. Masalah Bisnis & Materialitas Isu Energi (Laporan Resmi 2025)</span>
              <span className="text-[10px] text-slate-500 font-normal">Konteks Korporat</span>
            </h2>
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                <span className="text-[10px] text-slate-500 block">Listrik Telkomsel 2025:</span>
                <strong className="text-sm font-black text-slate-900">1.885,4 GWh</strong>
                <span className="text-[9px] text-slate-500 block">Beban biaya listrik nasional</span>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                <span className="text-[10px] text-slate-500 block">Emisi Scope 2 2025:</span>
                <strong className="text-sm font-black text-slate-900">1.721.968 tCO₂e</strong>
                <span className="text-[9px] text-slate-500 block">63,6% dari total emisi Telkomsel</span>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                <span className="text-[10px] text-slate-500 block">Kebutuhan Solusi:</span>
                <strong className="text-sm font-black text-red-600">Decision Coordination</strong>
                <span className="text-[9px] text-slate-500 block">Bukan sekadar fitur radio tunggal</span>
              </div>
            </div>
          </section>

          {/* 2. Solusi: Arsitektur 4 Modul ImpactGrid */}
          <section className="space-y-1.5">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-950 border-b border-slate-200 pb-1">
              2. Rancangan Solusi: ImpactGrid Decision Support System
            </h2>
            <p className="text-[11px] text-slate-700">
              ImpactGrid menghubungkan 4 modul terpadu: <strong>Network Data Hub</strong> (konsolidasi data multi-vendor, kontrak PLN, dan meteran), <strong>Scenario Lab</strong> (simulasi what-if beban trafik & cuaca), <strong>Investment Prioritizer</strong> (pemilihan portofolio investasi teroptimal), dan <strong>ESG Impact Verification</strong> (validasi hemat emisi berstandar ITU-T L.1331/L.1350 & PSPK 1/2).
            </p>
          </section>

          {/* 3. Sensitivitas Finansial (Tabel 10 Matriks Sensitivitas) */}
          <section className="space-y-2">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-950 border-b border-slate-200 pb-1 flex items-center justify-between">
              <span>3. Kelayakan Finansial: Model Sensitivitas 2 Baseline (Tabel 10 Matriks Sensitivitas)</span>
              <span className="text-[10px] text-slate-500 font-normal">CapEx Rp450 Jt • OpEx Rp60 Jt/th • Diskonto 10%</span>
            </h2>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2">Skenario Baseline Model</th>
                    <th className="p-2">Konsumsi 40 Lokasi Pilot</th>
                    <th className="p-2">Hemat 5% (NPV)</th>
                    <th className="p-2 bg-red-50 text-red-700">Hemat 8% (Kasus Dasar)</th>
                    <th className="p-2">Hemat 12% (Optimis)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-2 font-bold">Baseline Rendah: 50 kWh/site/hari</td>
                    <td className="p-2">730.000 kWh/th</td>
                    <td className="p-2 text-rose-700 font-semibold">−Rp 493,6 Jt</td>
                    <td className="p-2 bg-red-50/50 text-rose-700 font-bold">−Rp 391,5 Juta</td>
                    <td className="p-2 text-rose-700 font-semibold">−Rp 255,3 Jt</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold">Baseline Alternatif: 50 MWh/site/th</td>
                    <td className="p-2">2.000.000 kWh/th</td>
                    <td className="p-2 text-rose-700 font-semibold">−Rp 138,5 Jt</td>
                    <td className="p-2 bg-red-50/50 text-emerald-700 font-bold">+Rp 82,3 Juta</td>
                    <td className="p-2 text-emerald-700 font-semibold">+Rp 376,7 Jt</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-slate-500 italic">
              *Perbedaan satuan membuktikan bahwa kelayakan finansial sangat sensitif terhadap data meteran nyata. Keputusan investasi wajib mendasarkan diri pada hasil audit baseline, bukan proyeksi teoritis.
            </p>
          </section>

          {/* 4. Trilema ESG & Dividen Sosial (SDG 4, 8, 9, 13) */}
          <section className="space-y-1.5">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-950 border-b border-slate-200 pb-1">
              4. Trilema ESG & Alokasi Dividen Sosial (Inklusi Digital)
            </h2>
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 block font-bold">E (Environment)</strong>
                <span>Reduksi ~174 tCO₂e/th pada pilot 40 site via dynamic carrier sleep & HVAC setpoint 26°C.</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 block font-bold">S (Social Dividend)</strong>
                <span>Reinvestasi kas hemat ke <em>Telkomsel Jaga Cita</em> (pendidikan 3T) & zero call-drop pada layanan 112.</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 block font-bold">G (Governance)</strong>
                <span>Jejak audit SHA-256 tamper-evident & verifikasi Difference-in-Differences (DiD) anti-greenwashing.</span>
              </div>
            </div>
          </section>

          {/* 5. Usulan Keputusan Bertahap (Resolution for BoD Approval) */}
          <section className="space-y-2 border-2 border-slate-900 p-4 rounded-xl bg-slate-50/60">
            <h2 className="text-xs font-black uppercase tracking-wider text-red-700">
              5. Usulan Keputusan Dewan Direksi (Actionable Board Resolution)
            </h2>
            <ol className="list-decimal pl-4 space-y-1 text-[11px] font-medium text-slate-800">
              <li>
                <strong>Menyetujui Tahap 1: Audit Kebutuhan & Rekonsiliasi Baseline</strong> selama 2 bulan dengan plafon anggaran belanja maksimal <strong>Rp 95 Juta</strong> (Gerbang Keputusan G0).
              </li>
              <li>
                <strong>Komitmen Pilot 9 Bulan (40 Uji + 10 Pembanding)</strong> hanya dicairkan jika audit membuktikan: data meteran valid &ge; 95%, kapabilitas belum dipenuhi OSS internal, dan MoU hak akses aset TowerCo disetujui.
              </li>
              <li>
                <strong>Otoritas Jaringan:</strong> Seluruh tindakan optimasi tetap di bawah kendali penuh Network Operations Center; prototipe tidak mengirimkan perintah tanpa verifikasi keselamatan.
              </li>
            </ol>
          </section>

          {/* Signature & Endorsement Block */}
          <div className="pt-4 grid grid-cols-3 gap-4 text-center text-[10px] text-slate-600 border-t border-slate-200">
            <div className="space-y-8">
              <span>Diajukan Oleh:</span>
              <div className="font-bold text-slate-900 border-t border-slate-300 pt-1">Network & Energy Architect<br /><span className="text-[9px] font-normal">ImpactGrid Initiative</span></div>
            </div>
            <div className="space-y-8">
              <span>Ditelaah Oleh:</span>
              <div className="font-bold text-slate-900 border-t border-slate-300 pt-1">VP Network Planning & ESG<br /><span className="text-[9px] font-normal">PT Telekomunikasi Selular</span></div>
            </div>
            <div className="space-y-8">
              <span>Persetujuan Audit (Plafon Rp95 Jt):</span>
              <div className="font-bold text-slate-900 border-t border-slate-300 pt-1">Dewan Direksi Telkomsel<br /><span className="text-[9px] font-normal">Keputusan Gerbang G0</span></div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
