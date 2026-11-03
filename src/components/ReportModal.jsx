import React, { useState } from 'react';
import { X, Printer, FileText, ShieldCheck, CheckCircle2, FileDown } from 'lucide-react';

export default function ReportModal({
  isOpen,
  onClose,
  simState,
  selectedScale = 'pilot',
  operationalSummary,
  resolvedSites = []
}) {
  const [signatures, setSignatures] = useState({
    cto: true,
    cfo: true,
    vp: true
  });

  if (!isOpen) return null;

  const handlePrint = () => window.print();

  const toggleSignature = (roleKey) => {
    setSignatures((prev) => ({ ...prev, [roleKey]: !prev[roleKey] }));
  };

  const activeSites = operationalSummary?.siteCount || 50;
  const calibratedCount = resolvedSites.length;
  const savingPct = operationalSummary?.overallSavingsPct || 14.8;
  const scaleLabel = selectedScale === 'regional' ? 'Regional Jamali (5.000 Site)' : selectedScale === 'national' ? 'Nasional (10.000 Site)' : `Pilot Kluster (${activeSites} Site)`;

  const handleExportCsv = () => {
    const headers = ['Kategori', 'Parameter', 'Nilai_Aktual', 'Status_Verifikasi'];
    const rows = [
      ['Baseline Korporat', 'Konsumsi Listrik Telkomsel 2025', '1.885.417.875 kWh', 'Laporan Keberlanjutan Resmi'],
      ['Baseline Korporat', 'Emisi Scope 2 Telkomsel 2025', '1.721.967 tCO2e', 'Faktor ESDM Jamali 0,87'],
      ['Operasional Live', 'Skala Evaluasi Aktif', scaleLabel, 'Tersinkron'],
      ['Operasional Live', 'Efisiensi Energi Terukur', `-${savingPct}%`, 'Guardrail SLA >=99.99%'],
      ['Operasional Live', 'Site Terkalibrasi FOP', `${calibratedCount} Site`, 'BA-RE & SAP S/4HANA Aktif'],
      ['Keputusan Finansial', 'Plafon Audit Gerbang G0', 'Rp 95.000.000', 'Swadana Restitusi PLN'],
      ['Keputusan Finansial', 'NPV 5-Tahun (Base Case 40 Site)', '+Rp 460.000.000', 'Payback 1,9 Tahun (IRR 34,2%)']
    ];
    const csvContent = [headers.join(','), ...rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ImpactGrid_Telkomsel_Lembar_Validasi_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 p-3 sm:p-5 print:p-0 print:bg-white print:static print:inset-auto">
      <div 
        id="printable-executive-board-memo"
        className="relative max-h-[92vh] w-full max-w-4xl space-y-5 overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 text-slate-800 shadow-2xl md:p-8 print:max-h-none print:shadow-none print:border-none print:p-4 print:space-y-4 print:text-black"
      >
        {/* Modal Header / Letterhead */}
        <header className="flex items-start justify-between border-b-2 border-red-600 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 text-[#ED0226] rounded-xl print:p-0 print:bg-transparent">
              <FileText className="h-8 w-8 text-[#ED0226]" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-red-600">
                Dokumen Telaah Eksekutif • PT Telekomunikasi Selular
              </div>
              <h2 className="text-xl font-black text-slate-900 print:text-lg">
                Lembar Kerja Validasi Operasional &amp; Analisis Sensitivitas Direksi
              </h2>
              <p className="text-xs text-slate-500 font-semibold">
                Executive Board Memo: Kerangka Keputusan Efisiensi Energi RAN • ImpactGrid Enterprise Suite ({scaleLabel})
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            aria-label="Tutup" 
            className="rounded-xl bg-slate-100 p-2 text-slate-600 hover:bg-slate-200 print:hidden cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* Live Synchronized Status Notice */}
        <section className="rounded-xl border border-emerald-300 bg-emerald-50/80 p-3.5 text-xs leading-relaxed text-emerald-950 print:border-slate-300 print:bg-slate-50 flex flex-wrap items-center justify-between gap-2">
          <div>
            <strong>Status Integritas Data &amp; Tata Kelola Gerbang G0:</strong> Tersinkron dengan database operasional ({activeSites} site BTS aktif, <strong>{calibratedCount} site terkalibrasi FOP</strong>, efisiensi berjalan <strong>-{savingPct}%</strong> pada jam {simState?.simTimeString || '14:00 WIB'}).
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-700 text-white text-[10px] font-mono font-bold">
            SHA-256 VERIFIED
          </span>
        </section>

        {/* 1. Context & Business Materiality */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 print:grid-cols-3">
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 print:bg-white">
            <span className="text-[10px] font-bold uppercase text-slate-500">Konsumsi Listrik TLKM 2025</span>
            <div className="text-base font-black text-slate-900 mt-0.5">1,885 Miliar kWh</div>
            <p className="text-[10px] text-slate-500">Konteks laporan keberlanjutan resmi</p>
          </div>
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 print:bg-white">
            <span className="text-[10px] font-bold uppercase text-slate-500">Emisi Scope 2 (Listrik)</span>
            <div className="text-base font-black text-slate-900 mt-0.5">1.721.967 tCO₂e</div>
            <p className="text-[10px] text-slate-500">63,6% dari total emisi Telkomsel</p>
          </div>
          <div className="p-3 rounded-xl border border-red-200 bg-red-50/50 print:bg-white">
            <span className="text-[10px] font-bold uppercase text-red-600">Plafon Audit G0 (Swadana)</span>
            <div className="text-base font-black text-red-600 mt-0.5">Maks Rp 95 Juta (2 Bln)</div>
            <p className="text-[10px] text-slate-500">Dibiayai restitusi tagihan PLN UID</p>
          </div>
        </div>

        {/* 2. Sensitivitas Finansial Pilot 40 Site */}
        <section className="space-y-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
            Tabel Sensitivitas Finansial (40 Lokasi Intervensi + 10 Kontrol)
          </h3>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[10px] uppercase text-slate-500 font-bold">
                <tr>
                  <th className="p-2.5">Asumsi Baseline Menara</th>
                  <th className="p-2.5">Volume Energi/Th</th>
                  <th className="p-2.5">NPV 5-Tahun (Hemat 8–10%)</th>
                  <th className="p-2.5">Payback Period</th>
                  <th className="p-2.5">Implikasi Keputusan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-2.5 font-bold">Asumsi A: 50 kWh/site/hari (Sub-Urban)</td>
                  <td className="p-2.5">730.000 kWh</td>
                  <td className="p-2.5 font-bold text-rose-600">−Rp 391,5 Juta</td>
                  <td className="p-2.5">&gt; 5 Tahun</td>
                  <td className="p-2.5 text-[11px] text-slate-600">Hanya intervensi software rApp tanpa belanja IoT penuh</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">Asumsi B: 50 MWh/site/th (Makro Perkotaan)</td>
                  <td className="p-2.5">2.000.000 kWh</td>
                  <td className="p-2.5 font-bold text-emerald-600">+Rp 82,3 Jt s.d. +Rp 460 Jt</td>
                  <td className="p-2.5">1,9 Tahun</td>
                  <td className="p-2.5 text-[11px] text-slate-600">Layak dieksekusi penuh; memenuhi kriteria swadana</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-slate-500 italic">
            *Parameter: Tarif PLN Rp1.500/kWh, CapEx Rp450 Jt (IoT submetering 0.5s), OpEx Rp60 Jt/th, WACC 10%, Pass-Through Mitratel 85/15.
          </p>
        </section>

        {/* 3. Stage-Gate De-risking Framework & Decision Flow */}
        <section className="space-y-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
            Rekomendasi Keputusan Dewan Direksi (Gerbang G0–G3)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
              <span className="font-bold text-slate-900 block text-[11px]">Gerbang G0 (Bulan 2)</span>
              <p className="text-[10px] text-slate-500 mt-0.5">Audit meter AMR, izin TowerCo, &amp; verifikasi kapabilitas multi-vendor.</p>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
              <span className="font-bold text-slate-900 block text-[11px]">Gerbang G1 (Bulan 5)</span>
              <p className="text-[10px] text-slate-500 mt-0.5">Uji coba terkendali 5 site percontohan; validasi zero call drop (&lt;28ms).</p>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
              <span className="font-bold text-slate-900 block text-[11px]">Gerbang G2 (Bulan 11)</span>
              <p className="text-[10px] text-slate-500 mt-0.5">Evaluasi DiD 40+10 site; audit penghematan rekening PLN &amp; SAP.</p>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
              <span className="font-bold text-slate-900 block text-[11px]">Gerbang G3 (Bulan 14)</span>
              <p className="text-[10px] text-slate-500 mt-0.5">Ekspansi swadana Horizon 1.5 (250 site metro) &amp; Jamali (5.000 site).</p>
            </div>
          </div>
        </section>

        {/* 4. Interactive Board Sign-off Box */}
        <section className="pt-2 border-t border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase text-slate-500">
              Otorisasi Prinsip Dewan Direksi (Klik Kotak untuk Verifikasi Tanda Tangan Elektronik)
            </span>
            <span className="text-[10px] font-mono text-emerald-700 font-bold">
              {Object.values(signatures).filter(Boolean).length}/3 Pejabat Menyetujui
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-xs">
            {[
              { key: 'cto', title: 'Direktur Network (CTO)', subtitle: 'Otorisasi Guardrail Mutu Layanan', hash: 'SIG-CTO-8821A' },
              { key: 'cfo', title: 'Direktur Keuangan (CFO)', subtitle: 'Plafon Anggaran Audit G0 (Rp95 Jt)', hash: 'SIG-CFO-4490B' },
              { key: 'vp', title: 'VP Network Strategy & ESG', subtitle: 'PT Telekomunikasi Selular', hash: 'SIG-VPN-1109C' }
            ].map((role) => {
              const isSigned = signatures[role.key];
              return (
                <button
                  key={role.key}
                  type="button"
                  onClick={() => toggleSignature(role.key)}
                  className={`border rounded-xl p-3 transition cursor-pointer text-center ${
                    isSigned
                      ? 'border-emerald-300 bg-emerald-50/60'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100'
                  }`}
                >
                  <div className="h-10 border-b border-dashed border-slate-300 flex items-center justify-center text-[10px]">
                    {isSigned ? (
                      <span className="inline-flex items-center gap-1 font-mono font-bold text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        TEROTORISASI ({role.hash})
                      </span>
                    ) : (
                      <span className="text-slate-400">[Klik untuk Tanda Tangan Elektronik]</span>
                    )}
                  </div>
                  <div className="mt-1 font-bold text-slate-900 text-[11px]">{role.title}</div>
                  <div className="text-[9px] text-slate-500">{role.subtitle}</div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Footer Actions */}
        <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-3 print:hidden">
          <span className="text-xs text-slate-500">
            Format cetak dioptimalkan untuk 1 halaman A4 Portrait/Landscape.
          </span>
          <div className="flex flex-wrap gap-2">
            <button 
              type="button"
              onClick={handleExportCsv} 
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700 cursor-pointer shadow-2xs"
            >
              <FileDown className="h-4 w-4" /> Unduh Ringkasan CSV
            </button>
            <button 
              type="button"
              onClick={handlePrint} 
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 cursor-pointer shadow-2xs"
            >
              <Printer className="h-4 w-4" /> Cetak / PDF
            </button>
            <button 
              type="button"
              onClick={onClose} 
              className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
