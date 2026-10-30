import React, { useState, useMemo } from 'react';
import { Building2, Zap, Sliders, DollarSign, ShieldCheck, CheckCircle2, TrendingUp, Info } from 'lucide-react';

const TOWER_MODELS = [
  {
    key: 'owned',
    name: 'Telkomsel Owned Site',
    partner: 'In-house Aset',
    retainedPct: 100,
    desc: 'Penghematan kWh dinikmati 100% oleh Telkomsel. Kendali penuh instalasi IoT & setpoint HVAC.',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400'
  },
  {
    key: 'passthrough',
    name: 'TowerCo Colocation (Mitratel / Protelindo / TBIG)',
    partner: 'Mitra Menara',
    retainedPct: 85,
    desc: 'Skema tagihan PLN Pass-Through dengan insentif pembagian hemat (85% Telkomsel / 15% Manajemen Site).',
    badge: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400'
  },
  {
    key: 'fixed',
    name: 'TowerCo All-in Fixed Rent',
    partner: 'Kontrak Sewa Flat',
    retainedPct: 70,
    desc: 'Biaya listrik termasuk dalam sewa tetap; memerlukan negosiasi rebate energi berbasis bukti audit.',
    badge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400'
  }
];

const PLN_TARIFFS = [
  { key: 'blend', name: 'Tarif Blend Telko Nasional', rate: 1500, desc: 'Rata-rata tertimbang biaya listrik BTS makro nasional' },
  { key: 'b2', name: 'Golongan PLN B-2/TR', rate: 1444.70, desc: 'Tarif bisnis tegangan rendah makro perkotaan' },
  { key: 'b3', name: 'Golongan PLN B-3/TM', rate: 1114.74, desc: 'Tarif bisnis tegangan menengah BTS hub besar' },
  { key: 'i3', name: 'Industri I-3 WBP (Jam Puncak)', rate: 1650, desc: 'Beban puncak 18:00 - 22:00 WIB' }
];

const CAPEX_BREAKDOWN_40 = [
  { item: 'Smart Sub-metering IoT Kelas 0.5s', unitCost: 5500000, qty: 40, total: 220000000, category: 'Hardware Sensor' },
  { item: 'Smart Environmental & Temp Controller Box', unitCost: 3000000, qty: 40, total: 120000000, category: 'Hardware Shelter' },
  { item: 'Integrasi API Gateway O-RAN O1 & OSS Adapter', unitCost: 65000000, qty: 1, total: 65000000, category: 'Software & Integrasi' },
  { item: 'Cadangan Kontingensi Implementasi (10%)', unitCost: 45000000, qty: 1, total: 45000000, category: 'Risk Reserve' }
];

const OPEX_BREAKDOWN_ANNUAL = [
  { item: 'Kalibrasi & Sertifikasi Akurasi Sensor Tahunan', annualTotal: 20000000, desc: 'Memastikan kepatuhan audit data' },
  { item: 'Lisensi Cloud Data Platform & Stream Processing', annualTotal: 25000000, desc: 'Infrastruktur analitik & deteksi anomali' },
  { item: 'Dukungan Teknisi Lapangan & Pemeliharaan Perangkat', annualTotal: 15000000, desc: 'SLA perbaikan sensor < 48 jam' }
];

export default function TowerCoCapexDetail() {
  const [selectedTowerModel, setSelectedTowerModel] = useState('passthrough');
  const [selectedTariff, setSelectedTariff] = useState('blend');
  const [waccRate, setWaccRate] = useState(10); // 8% - 14%
  const [inflationRate, setInflationRate] = useState(2); // 0% - 5%

  const tower = TOWER_MODELS.find(t => t.key === selectedTowerModel) || TOWER_MODELS[1];
  const tariffObj = PLN_TARIFFS.find(p => p.key === selectedTariff) || PLN_TARIFFS[0];

  // Dynamic 5-Year DCF Calculation
  const calculation = useMemo(() => {
    const siteCount = 40;
    const baseKWhPerSite = 50000; // Baseline 50 MWh
    const efficiencyPct = 10; // Target 10%
    const totalCapEx = 450000000;
    const totalOpEx = 60000000;

    const baseSavedKWhTotal = siteCount * baseKWhPerSite * (efficiencyPct / 100); // 200,000 kWh

    let cumulativeNpv = -totalCapEx;
    const cashflows = [];

    for (let yr = 1; yr <= 5; yr++) {
      // Inflated tariff
      const effectiveTariff = tariffObj.rate * Math.pow(1 + inflationRate / 100, yr - 1);
      // Gross savings
      const grossYearIDR = baseSavedKWhTotal * effectiveTariff;
      // Retained by Telkomsel after TowerCo split
      const telkomselRetainedGross = grossYearIDR * (tower.retainedPct / 100);
      // Net Cashflow
      const netCash = telkomselRetainedGross - totalOpEx;
      // Discounted Cashflow
      const discountFactor = Math.pow(1 + waccRate / 100, yr);
      const discountedCash = netCash / discountFactor;

      cumulativeNpv += discountedCash;

      cashflows.push({
        year: yr,
        effectiveTariff: Math.round(effectiveTariff),
        grossIDR: Math.round(grossYearIDR),
        retainedIDR: Math.round(telkomselRetainedGross),
        netCash: Math.round(netCash),
        discountedCash: Math.round(discountedCash)
      });
    }

    const firstYearNet = cashflows[0].netCash;
    const simplePayback = (totalCapEx / (firstYearNet > 0 ? firstYearNet : 1)).toFixed(1);

    return {
      totalCapEx,
      totalOpEx,
      baseSavedKWhTotal,
      firstYearNet,
      cumulativeNpv: Math.round(cumulativeNpv),
      simplePayback,
      cashflows
    };
  }, [tower, tariffObj, waccRate, inflationRate]);

  const rupiah = (val) => `Rp ${Math.round(val / 1000000).toLocaleString('id-ID')} Juta`;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Parameter Controls Bar */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-5 md:p-6 space-y-5 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 px-2.5 py-0.5 text-[11px] font-bold text-blue-800 dark:text-blue-300">
            <Building2 className="w-3.5 h-3.5" />
            <span>Realitas Bisnis Telekomunikasi: TowerCo & Struktur Tarif PLN</span>
          </div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mt-1">
            Konfigurasi Kepemilikan Menara, PLN WBP/LWBP, & Sensitivitas WACC
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Menguji kelayakan finansial nyata dengan memperhitungkan pembagian penghematan sewa menara dan dinamika tarif listrik.
          </p>
        </div>

        {/* 1. TowerCo Model Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            1. Model Kontrak Sewa Menara (TowerCo)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {TOWER_MODELS.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setSelectedTowerModel(item.key)}
                className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  selectedTowerModel === item.key
                    ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/30 dark:bg-blue-950/30'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white">{item.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${item.badge}`}>
                      {item.retainedPct}% Hak Telkomsel
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-snug">
                    {item.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. PLN Tariffs & Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              2. Golongan Tarif PLN
            </label>
            <select
              value={selectedTariff}
              onChange={(e) => setSelectedTariff(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              {PLN_TARIFFS.map(p => (
                <option key={p.key} value={p.key}>
                  {p.name} (Rp {p.rate.toLocaleString('id-ID')}/kWh)
                </option>
              ))}
            </select>
            <p className="text-[10px] text-slate-400">{tariffObj.desc}</p>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>3. Tingkat Diskonto (WACC)</span>
              <span className="text-blue-600 font-mono">{waccRate}%</span>
            </div>
            <input
              type="range"
              min="8"
              max="14"
              step="0.5"
              value={waccRate}
              onChange={(e) => setWaccRate(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <p className="text-[10px] text-slate-400">Standar Telkom Group 10% (Uji ketahanan 8% - 14%)</p>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>4. Inflasi Tarif Listrik</span>
              <span className="text-emerald-600 font-mono">+{inflationRate}%/th</span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={inflationRate}
              onChange={(e) => setInflationRate(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <p className="text-[10px] text-slate-400">Ekspektasi penyesuaian tarif listrik tahunan PLN</p>
          </div>
        </div>

        {/* Dynamic Metric Output Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/30">
            <span className="text-xs font-bold text-blue-700 dark:text-blue-300">Hasil NPV 5-Tahun Terkoreksi</span>
            <div className={`mt-1 text-2xl font-black tabular-nums ${calculation.cumulativeNpv >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}`}>
              {rupiah(calculation.cumulativeNpv)}
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              CapEx {rupiah(calculation.totalCapEx)} • WACC {waccRate}% • TowerCo {tower.retainedPct}%
            </p>
          </div>

          <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/30">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">Payback Period Skenario</span>
            <div className="mt-1 text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
              {calculation.simplePayback} Tahun
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Arus kas bersih Thn-1: {rupiah(calculation.firstYearNet)}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Volume Hemat 40 Site</span>
            <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white tabular-nums">
              {calculation.baseSavedKWhTotal.toLocaleString('id-ID')} kWh/th
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Setara 200 MWh/th (~174 tCO₂e/th)
            </p>
          </div>
        </div>
      </section>

      {/* CapEx & OpEx Rigorous Breakdown Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* CapEx Breakdown */}
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Rincian Alokasi Investasi Awal (CapEx Rp 450 Juta)
              </h3>
              <p className="text-[11px] text-slate-500">Plafon Audit G0 Rp 95 Juta sebelum pencairan penuh</p>
            </div>
            <span className="text-xs font-black text-red-600 font-mono">40 Menara Pilot</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-[10px] uppercase font-bold text-slate-500">
                <tr>
                  <th className="p-2.5">Item Komponen</th>
                  <th className="p-2.5">Qty</th>
                  <th className="p-2.5">Satuan</th>
                  <th className="p-2.5">Total Biaya</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {CAPEX_BREAKDOWN_40.map(item => (
                  <tr key={item.item}>
                    <td className="p-2.5 font-medium text-slate-900 dark:text-white">
                      {item.item}
                      <span className="block text-[10px] text-slate-400">{item.category}</span>
                    </td>
                    <td className="p-2.5">{item.qty}</td>
                    <td className="p-2.5 font-mono text-[11px]">Rp {(item.unitCost / 1000000).toFixed(1)}M</td>
                    <td className="p-2.5 font-mono font-bold text-slate-900 dark:text-white">Rp {(item.total / 1000000).toFixed(0)} Jt</td>
                  </tr>
                ))}
                <tr className="bg-slate-50/70 dark:bg-slate-800/40 font-black">
                  <td colSpan={3} className="p-2.5 text-right">Total Investasi CapEx Pilot:</td>
                  <td className="p-2.5 font-mono text-red-600">Rp 450 Juta</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* OpEx Breakdown */}
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Rincian Biaya Operasional (OpEx Rp 60 Juta/Tahun)
              </h3>
              <p className="text-[11px] text-slate-500">Untuk pemeliharaan kualitas data, cloud, & sertifikasi</p>
            </div>
            <span className="text-xs font-black text-blue-600 font-mono">Tahunan</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-[10px] uppercase font-bold text-slate-500">
                <tr>
                  <th className="p-2.5">Item Biaya Rutin</th>
                  <th className="p-2.5">Keterangan</th>
                  <th className="p-2.5">Biaya/Tahun</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {OPEX_BREAKDOWN_ANNUAL.map(item => (
                  <tr key={item.item}>
                    <td className="p-2.5 font-medium text-slate-900 dark:text-white">{item.item}</td>
                    <td className="p-2.5 text-[11px] text-slate-500">{item.desc}</td>
                    <td className="p-2.5 font-mono font-bold text-slate-900 dark:text-white">Rp {(item.annualTotal / 1000000).toFixed(0)} Jt</td>
                  </tr>
                ))}
                <tr className="bg-slate-50/70 dark:bg-slate-800/40 font-black">
                  <td colSpan={2} className="p-2.5 text-right">Total Biaya OpEx/Tahun:</td>
                  <td className="p-2.5 font-mono text-blue-600">Rp 60 Juta/th</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-200">
            <strong>Klausul Swadana (Self-Funding):</strong> Biaya OpEx tahun ke-2 dst. dipotong langsung dari kas penghematan listrik yang terbukti di tagihan PLN, tanpa membebani budget O&M Telkomsel.
          </div>
        </section>
      </div>
    </div>
  );
}
