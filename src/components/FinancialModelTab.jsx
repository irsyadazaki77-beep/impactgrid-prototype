import React, { useMemo, useState } from 'react';

const CAPEX = 450_000_000;
const OPEX_YEAR = 60_000_000;
const BASELINE_CASES = [
  { name: 'Skenario rendah: 50 kWh/lokasi/hari', annualKWh: 40 * 50 * 365, note: 'Belum diverifikasi dengan meter; 730.000 kWh/tahun untuk 40 lokasi.' },
  { name: 'Skenario alternatif: 50 MWh/lokasi/tahun', annualKWh: 40 * 50_000, note: 'Asumsi bahan tim; bukan baseline pilot terukur.' },
];
const SAVING_RATES = [5, 8, 12];

function calculate(annualKWh, savingPct, tariff, discountPct) {
  const grossFullYear = annualKWh * savingPct / 100 * tariff;
  const cashFlows = [grossFullYear * 3 / 12 - OPEX_YEAR * 9 / 12];
  for (let year = 2; year <= 5; year++) cashFlows.push(grossFullYear - OPEX_YEAR);
  const rate = discountPct / 100;
  const npv = -CAPEX + cashFlows.reduce((sum, cf, i) => sum + cf / (1 + rate) ** (i + 1), 0);
  return { grossFullYear, cashFlows, npv };
}

function rupiah(value) {
  return `Rp ${Math.round(value / 1_000_000).toLocaleString('id-ID')} juta`;
}

export default function FinancialModelTab() {
  const [tariff, setTariff] = useState(1500);
  const [discount, setDiscount] = useState(10);
  const results = useMemo(() => BASELINE_CASES.map((baseline) => ({
    ...baseline,
    scenarios: SAVING_RATES.map((savingPct) => ({
      savingPct,
      ...calculate(baseline.annualKWh, savingPct, tariff, discount),
    })),
  })), [tariff, discount]);
  const baseCase = results[0].scenarios[1];
  const alternateCase = results[1].scenarios[1];

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-amber-300 bg-amber-50 p-6 md:p-8 space-y-3">
        <div className="inline-flex rounded-full border border-amber-300 bg-white px-3 py-1 text-xs font-bold text-amber-900">Model sensitivitas - data lapangan belum tersedia</div>
        <h1 className="text-2xl font-black text-slate-900">Kelayakan finansial pilot</h1>
        <p className="max-w-4xl text-sm leading-relaxed text-slate-700">
          Semua hasil di halaman ini adalah simulasi. Baseline lokasi, biaya yang benar-benar dapat dihindari, penawaran vendor, dan bagian penghematan yang diterima Telkomsel belum divalidasi. Model mengikuti jadwal proposal: tindakan aktif tiga bulan pada 2027, biaya operasi sembilan bulan, lalu empat tahun operasi penuh. Kredit karbon dan manfaat reputasi tidak dimasukkan.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-xs font-bold uppercase text-slate-500">Skenario rendah, hemat 8%</div>
          <div className="mt-2 text-2xl font-black text-rose-700">{rupiah(baseCase.npv)}</div>
          <p className="mt-2 text-xs text-slate-600">Baseline 50 kWh/lokasi/hari; belum diukur di lapangan.</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-xs font-bold uppercase text-slate-500">Skenario alternatif, hemat 8%</div>
          <div className={`mt-2 text-2xl font-black ${alternateCase.npv >= 0 ? 'text-amber-700' : 'text-rose-700'}`}>{rupiah(alternateCase.npv)}</div>
          <p className="mt-2 text-xs text-slate-600">Baseline 50 MWh/lokasi/tahun; asumsi alternatif bahan tim.</p>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 space-y-5">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">Ubah asumsi simulasi</h2>
          <p className="text-xs text-slate-500">Tarif efektif dan diskonto perlu ditetapkan Finance; kontrol ini tidak mengambil data PLN atau Telkomsel.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <label className="space-y-2 text-sm font-semibold text-slate-700">
            <span className="flex justify-between"><span>Biaya energi yang dihindari</span><span>Rp {tariff.toLocaleString('id-ID')}/kWh</span></span>
            <input className="w-full accent-rose-600" type="range" min="1300" max="1800" step="50" value={tariff} onChange={(e) => setTariff(Number(e.target.value))} />
          </label>
          <label className="space-y-2 text-sm font-semibold text-slate-700">
            <span className="flex justify-between"><span>Tingkat diskonto</span><span>{discount}%</span></span>
            <input className="w-full accent-indigo-600" type="range" min="8" max="12" step="0.5" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
          </label>
        </div>
      </section>

      {results.map((baseline) => (
        <section key={baseline.name} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 bg-slate-50 p-5">
            <h2 className="font-extrabold text-slate-900">{baseline.name}</h2>
            <p className="mt-1 text-xs text-slate-600">{baseline.note} Baseline total: {baseline.annualKWh.toLocaleString('id-ID')} kWh/tahun.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white text-xs uppercase text-slate-500"><tr><th className="p-3">Penghematan tambahan</th><th className="p-3">Manfaat bruto setahun penuh</th><th className="p-3">NPV 2027-2031</th></tr></thead>
              <tbody>{baseline.scenarios.map((scenario) => <tr key={scenario.savingPct} className="border-t border-slate-100"><td className="p-3">{scenario.savingPct}%</td><td className="p-3">{rupiah(scenario.grossFullYear)}</td><td className={`p-3 font-bold ${scenario.npv >= 0 ? 'text-amber-700' : 'text-rose-700'}`}>{rupiah(scenario.npv)}</td></tr>)}</tbody>
            </table>
          </div>
        </section>
      ))}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-relaxed text-slate-700">
        <h2 className="font-extrabold text-slate-900">Cara membaca hasil</h2>
        <p className="mt-2">NPV pilot berubah tanda ketika baseline berubah. Karena itu, hasil di atas tidak menyatakan proyek layak atau tidak layak. Audit yang diusulkan terlebih dahulu memeriksa data meter dan tagihan, kontrak energi, lokasi yang eligible, biaya aktual, serta nilai tambah terhadap proses existing. Anggaran audit yang diusulkan adalah maksimum Rp95 juta; kelanjutan pilot memerlukan keputusan terpisah.</p>
      </section>
    </div>
  );
}
