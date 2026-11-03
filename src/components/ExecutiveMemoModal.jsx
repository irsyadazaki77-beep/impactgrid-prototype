import React from 'react';
import { Printer, X, FileText, FileDown } from 'lucide-react';

export default function ExecutiveMemoModal({
  isOpen,
  onClose,
  simState,
  selectedScale = 'pilot',
  operationalSummary,
  resolvedSites = []
}) {
  if (!isOpen) return null;

  const activeSites = operationalSummary?.siteCount || 50;
  const calibratedCount = resolvedSites.length;
  const savingPct = operationalSummary?.overallSavingsPct || 14.8;

  const handleDownloadDossierJson = () => {
    const payload = {
      documentTitle: 'EXECUTIVE INVESTMENT DOSSIER - PT TELEKOMUNIKASI SELULAR',
      initiative: 'ImpactGrid Telco Operations & O-RAN Non-RT RIC',
      stageGate: 'Gerbang Keputusan G0 (Plafon Swadana Rp 95.000.000)',
      generatedAt: new Date().toISOString(),
      selectedScale,
      operationalTelemetry: {
        activeSites,
        calibratedFopSites: calibratedCount,
        currentEfficiencyPct: savingPct,
        simTimeWib: simState?.simTimeString || '14:00 WIB'
      },
      financialHighlights: {
        phase0CapIDR: 95000000,
        phase1CapexIDR: 450000000,
        annualOpexIDR: 60000000,
        baseCaseNpv5YrIDR: 460000000,
        irrPct: 34.2,
        paybackYears: 1.9,
        towerCoPassThroughSharePct: 85
      }
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ImpactGrid_Telkomsel_Executive_Dossier_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/80 p-2 sm:p-4 print:p-0 print:bg-white">
      <div className="my-8 w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white text-slate-900 shadow-2xl print:my-0 print:rounded-none print:border-0 print:shadow-none print:max-w-none">
        {/* Sticky Header with Action Buttons */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-800 bg-slate-900 px-6 py-3.5 text-white print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-amber-300" />
            <div>
              <h2 className="text-sm font-extrabold">Berkas Keputusan Investasi Direksi (A4)</h2>
              <p className="text-[11px] text-slate-300">Executive Investment Dossier 1-Halaman • Dokumen Pengambilan Keputusan Dewan Direksi</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadDossierJson}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition cursor-pointer shadow-xs"
            >
              <FileDown className="h-4 w-4" />
              Unduh JSON
            </button>
            <button 
              type="button"
              onClick={() => window.print()} 
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#ED0226] px-4 py-2 text-xs font-bold text-white hover:bg-red-700 transition cursor-pointer shadow-xs"
            >
              <Printer className="h-4 w-4" />
              Cetak / PDF
            </button>
            <button 
              type="button"
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
                Sistem Pendukung Keputusan (DSS) Efisiensi Energi Jaringan &amp; Validasi ESG ({activeSites} Site Aktif · {calibratedCount} Terkalibrasi)
              </p>
            </div>
            <div className="text-left sm:text-right font-mono text-[11px] space-y-0.5 text-slate-600 border-l sm:border-l-0 sm:border-r-0 border-slate-200 pl-3 sm:pl-0">
              <div><strong>Inisiatif:</strong> ImpactGrid Telco Operations</div>
              <div><strong>Status:</strong> Rekomendasi Komite Investasi (Gerbang G0)</div>
              <div><strong>Target Entitas:</strong> PT Telekomunikasi Selular</div>
            </div>
          </div>

          {/* Governance box */}
          <div className="rounded-xl border border-emerald-300 bg-emerald-50/90 p-3 text-[11px] font-bold text-emerald-950 leading-snug">
            ✓ <strong>STATUS TATA KELOLA INVESTASI MODAL:</strong> Parameter operasional dikalibrasi pada kluster {activeSites} site pilot Jawa Barat &amp; Banten (efisiensi berjalan -{savingPct}%). Komitmen belanja fisik penuh (Fase 1 Rp450 Jt) dikunci melalui pengesahan Audit Baseline 2 Bulan pada Gerbang G0 (Plafon Swadana Rp95 Jt).
          </div>

          {/* 1. Masalah & Fakta Dasar 2025 */}
          <section className="space-y-2">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-950 border-b border-slate-200 pb-1 flex items-center justify-between">
              <span>1. Masalah Bisnis &amp; Materialitas Isu Energi (Laporan Resmi 2025)</span>
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
                <strong className="text-sm font-black text-red-600">Orkestrasi Lintas-Domain</strong>
                <span className="text-[9px] text-slate-500 block">Radio + HVAC + Meter PLN + SAP</span>
              </div>
            </div>
          </section>

          {/* 2. Solusi: Arsitektur 4 Modul ImpactGrid */}
          <section className="space-y-1.5">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-950 border-b border-slate-200 pb-1">
              2. Rancangan Solusi: ImpactGrid Decision Support System
            </h2>
            <p className="text-[11px] text-slate-700">
              ImpactGrid menghubungkan 4 modul terpadu: <strong>Network Data Hub</strong> (rekonsiliasi 3-arah multi-vendor Ericsson/Huawei/ZTE, kontrak PLN, dan submeter DC), <strong>Scenario Lab</strong> (simulasi what-if beban trafik &amp; cuaca), <strong>Investment Prioritizer</strong> (optimasi portofolio 0/1 Knapsack &amp; arbitrase WBP BESS), dan <strong>ESG Impact Verification</strong> (validasi hemat emisi berstandar ITU-T L.1331 &amp; IFRS S2).
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
                    <th className="p-2 bg-red-50 text-red-700">Hemat 8–10% (Kasus Dasar)</th>
                    <th className="p-2">Hemat 12–15% (Optimis)</th>
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
                    <td className="p-2 font-bold">Baseline Makro: 50 MWh/site/th</td>
                    <td className="p-2">2.000.000 kWh/th</td>
                    <td className="p-2 text-rose-700 font-semibold">−Rp 138,5 Jt</td>
                    <td className="p-2 bg-red-50/50 text-emerald-700 font-bold">+Rp 82,3 Jt s/d +Rp 460 Jt</td>
                    <td className="p-2 text-emerald-700 font-semibold">+Rp 376,7 Jt s/d +Rp 1,02 M</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-slate-500 italic">
              *Perbedaan satuan membuktikan bahwa kelayakan finansial sangat sensitif terhadap data meteran nyata. Keputusan investasi wajib mendasarkan diri pada hasil audit baseline Gerbang G0.
            </p>
          </section>

          {/* 4. Trilema ESG & Dividen Sosial (SDG 4, 8, 9, 13) */}
          <section className="space-y-1.5">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-950 border-b border-slate-200 pb-1">
              4. Trilema ESG &amp; Alokasi Dividen Sosial (Inklusi Digital)
            </h2>
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 block font-bold">E (Environment)</strong>
                <span>Reduksi ~174 tCO₂e/th pada pilot 40 site via dynamic carrier sleep &amp; HVAC setpoint 26°C.</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 block font-bold">S (Social Dividend)</strong>
                <span>Reinvestasi 15% kas hemat ke <em>Telkomsel Jaga Cita</em> (sekolah 3T) &amp; zero call-drop pada layanan 112.</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 block font-bold">G (Governance)</strong>
                <span>Jejak audit SHA-256 tamper-evident &amp; verifikasi Difference-in-Differences (DiD) anti-greenwashing.</span>
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
                <strong>Menyetujui Tahap 1: Audit Kebutuhan &amp; Rekonsiliasi Baseline</strong> selama 2 bulan dengan plafon anggaran belanja maksimal <strong>Rp 95 Juta</strong> (Gerbang Keputusan G0 swadana restitusi PLN).
              </li>
              <li>
                <strong>Komitmen Pilot 9 Bulan (40 Uji + 10 Pembanding)</strong> hanya dicairkan jika audit membuktikan: data meteran valid &ge; 95%, kapabilitas lintas-domain siap, dan MoU pass-through TowerCo 85/15 disetujui.
              </li>
              <li>
                <strong>Otoritas Jaringan:</strong> Seluruh tindakan optimasi berada di bawah kendali penuh Network Operations Center dengan guardrail keselamatan otomatis (&lt;28ms auto-rollback pada lonjakan PRB atau panggilan 112).
              </li>
            </ol>
          </section>

          {/* Signature & Endorsement Block */}
          <div className="pt-4 grid grid-cols-3 gap-4 text-center text-[10px] text-slate-600 border-t border-slate-200">
            <div className="space-y-8">
              <span>Diajukan Oleh:</span>
              <div className="font-bold text-slate-900 border-t border-slate-300 pt-1">Network &amp; Energy Architect<br /><span className="text-[9px] font-normal">ImpactGrid Initiative</span></div>
            </div>
            <div className="space-y-8">
              <span>Ditelaah Oleh:</span>
              <div className="font-bold text-slate-900 border-t border-slate-300 pt-1">VP Network Planning &amp; ESG<br /><span className="text-[9px] font-normal">PT Telekomunikasi Selular</span></div>
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
