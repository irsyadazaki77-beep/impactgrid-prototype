import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BASELINES = [
  { key: 'daily', name: 'Asumsi A: 50 kWh/lokasi/hari', annualPerSite: 50 * 365, note: 'Belum diukur; sensitivitas rendah.' },
  { key: 'annual', name: 'Asumsi B: 50 MWh/lokasi/tahun', annualPerSite: 50_000, note: 'Asumsi alternatif dari bahan tim; belum diverifikasi.' },
];
const RATES = [5, 8, 12];

const rupiah = (value) => `Rp ${Math.round(value / 1_000_000).toLocaleString('id-ID')} juta`;

export default function ScenarioLabTab() {
  const [baselineKey, setBaselineKey] = useState('daily');
  const [sites, setSites] = useState(40);
  const [savingPct, setSavingPct] = useState(8);
  const [tariff, setTariff] = useState(1500);
  const baseline = BASELINES.find((item) => item.key === baselineKey);
  const annualKWh = baseline.annualPerSite * sites;
  const savedKWh = annualKWh * savingPct / 100;
  const grossSavings = savedKWh * tariff;
  const scenarios = useMemo(() => RATES.map((rate) => ({
    rate: `${rate}%`,
    energy: Math.round(annualKWh * rate / 100),
    cost: annualKWh * rate / 100 * tariff / 1_000_000,
  })), [annualKWh, tariff]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-amber-300 bg-amber-50 p-6 md:p-8 space-y-3">
        <div className="inline-flex rounded-full border border-amber-300 bg-white px-3 py-1 text-xs font-bold text-amber-900">What-if berbasis asumsi</div>
        <h1 className="text-2xl font-black text-slate-900">Simulasi energi pilot</h1>
        <p className="max-w-4xl text-sm leading-relaxed text-slate-700">Kalkulator ini hanya menunjukkan aritmetika untuk asumsi baseline dan persentase penghematan. Nilainya bukan hasil intervensi, data site, ramalan cuaca, keluaran perangkat, atau klaim energi/emisi. Gunakan data meter terverifikasi sebelum mengambil keputusan.</p>
      </section>

      <section className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-2 md:p-6">
        <label className="space-y-2 text-sm font-semibold text-slate-700">
          <span>Baseline per lokasi (belum divalidasi)</span>
          <select value={baselineKey} onChange={(event) => setBaselineKey(event.target.value)} className="w-full rounded-xl border border-slate-300 bg-white p-3">
            {BASELINES.map((item) => <option key={item.key} value={item.key}>{item.name}</option>)}
          </select>
          <span className="block text-xs font-normal text-slate-500">{baseline.note}</span>
        </label>
        <label className="space-y-2 text-sm font-semibold text-slate-700">
          <span className="flex justify-between"><span>Jumlah lokasi intervensi</span><span>{sites}</span></span>
          <input className="w-full accent-indigo-600" type="range" min="1" max="100" step="1" value={sites} onChange={(event) => setSites(Number(event.target.value))} />
          <span className="block text-xs font-normal text-slate-500">Jumlah lokasi untuk ilustrasi; cakupan pilot usulan saat ini 40 lokasi.</span>
        </label>
        <label className="space-y-2 text-sm font-semibold text-slate-700">
          <span className="flex justify-between"><span>Penghematan tambahan</span><span>{savingPct}%</span></span>
          <input className="w-full accent-emerald-600" type="range" min="5" max="12" step="1" value={savingPct} onChange={(event) => setSavingPct(Number(event.target.value))} />
        </label>
        <label className="space-y-2 text-sm font-semibold text-slate-700">
          <span className="flex justify-between"><span>Biaya energi yang dihindari</span><span>Rp {tariff.toLocaleString('id-ID')}/kWh</span></span>
          <input className="w-full accent-rose-600" type="range" min="1300" max="1800" step="50" value={tariff} onChange={(event) => setTariff(Number(event.target.value))} />
          <span className="block text-xs font-normal text-slate-500">Nilai ini asumsi sensitivitas, bukan tarif atau kontrak yang telah diverifikasi.</span>
        </label>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5"><div className="text-xs font-bold uppercase text-slate-500">Baseline tahunan model</div><div className="mt-2 text-2xl font-black text-slate-900">{annualKWh.toLocaleString('id-ID')} kWh</div><p className="mt-1 text-xs text-slate-500">{sites} lokasi × {baseline.annualPerSite.toLocaleString('id-ID')} kWh/lokasi/tahun</p></article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5"><div className="text-xs font-bold uppercase text-slate-500">Energi pada asumsi {savingPct}%</div><div className="mt-2 text-2xl font-black text-slate-900">{Math.round(savedKWh).toLocaleString('id-ID')} kWh</div><p className="mt-1 text-xs text-slate-500">Hasil hitung dari input di atas</p></article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5"><div className="text-xs font-bold uppercase text-slate-500">Nilai bruto setahun penuh</div><div className="mt-2 text-2xl font-black text-slate-900">{rupiah(grossSavings)}</div><p className="mt-1 text-xs text-slate-500">Belum dikurangi biaya pilot/operasi dan belum disahkan Finance</p></article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 space-y-4">
        <div><h2 className="font-extrabold text-slate-900">Perbandingan asumsi penghematan</h2><p className="text-xs text-slate-500">Semua angka berubah mengikuti baseline dan biaya energi yang dipilih.</p></div>
        <div className="h-64 w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={scenarios} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="rate" /><YAxis /><Tooltip formatter={(value, name) => name === 'cost' ? [`Rp ${Number(value).toFixed(1)} juta`, 'Manfaat bruto'] : [`${Number(value).toLocaleString('id-ID')} kWh`, 'Energi']} /><Bar dataKey="energy" fill="#0f766e" radius={[4, 4, 0, 0]} name="Energi" /></BarChart></ResponsiveContainer></div>
        <div className="overflow-x-auto rounded-xl border border-slate-200"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-3">Asumsi penghematan</th><th className="p-3">Energi/tahun</th><th className="p-3">Nilai bruto/tahun</th></tr></thead><tbody>{scenarios.map((item) => <tr key={item.rate} className="border-t border-slate-100"><td className="p-3">{item.rate}</td><td className="p-3">{item.energy.toLocaleString('id-ID')} kWh</td><td className="p-3">{rupiah(item.cost * 1_000_000)}</td></tr>)}</tbody></table></div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-relaxed text-slate-700"><strong>Belum dihitung:</strong> reduksi emisi, NPV, payback, dan penghematan bersih. Perhitungan tersebut menunggu baseline, faktor emisi, tarif kontrak, biaya aktual, dan porsi manfaat yang diverifikasi.</section>
    </div>
  );
}
