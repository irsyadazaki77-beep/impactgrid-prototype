import React, { useState, useMemo } from 'react';
import {
  BatteryCharging,
  Zap,
  Radio,
  ShieldCheck,
  AlertTriangle,
  ArrowLeftRight,
  CheckCircle2,
  Flame
} from 'lucide-react';
import {
  simulateWbpLwbpBessArbitrage,
  simulateCrossVendorBorderGuard
} from '../utils/telkomselNextGenOperationsEngine';

export default function WbpBessAndBorderGuardPanel() {
  // 1. WBP/LWBP & BESS Arbitrage State
  const [bessCapacityKwh, setBessCapacityKwh] = useState(15);
  const [topologyMode, setTopologyMode] = useState('jamali_pln_wbp'); // 'jamali_pln_wbp' | 'rural_3t_diesel_hybrid'
  const [siteCount, setSiteCount] = useState(40);

  // 2. Cross-Vendor Border Guard State
  const [borderGuardEnabled, setBorderGuardEnabled] = useState(true);
  const [vendorPairKey, setVendorPairKey] = useState('ericsson_huawei');
  const [trafficLoadPct, setTrafficLoadPct] = useState(18);

  const vendorPairs = {
    ericsson_huawei: {
      primary: 'Ericsson (ENM — JKT-SEL-01 Kebayoran)',
      neighbor: 'Huawei (iMaster NCE — DPK-MGD-15 Margonda)'
    },
    huawei_zte: {
      primary: 'Huawei (iMaster NCE — BDG-DGO-17 Dago)',
      neighbor: 'ZTE (NetNumen U31 — BDG-CMH-25 Cimahi)'
    },
    ericsson_zte: {
      primary: 'Ericsson (ENM — SBY-RKT-29 Rungkut)',
      neighbor: 'ZTE (NetNumen U31 — SDA-POR-39 Sidoarjo)'
    }
  };

  const activePair = vendorPairs[vendorPairKey] || vendorPairs.ericsson_huawei;

  const bessSim = useMemo(
    () =>
      simulateWbpLwbpBessArbitrage({
        bessCapacityKwh,
        topologyMode,
        siteCount
      }),
    [bessCapacityKwh, topologyMode, siteCount]
  );

  const borderSim = useMemo(
    () =>
      simulateCrossVendorBorderGuard({
        borderGuardEnabled,
        primaryVendor: activePair.primary,
        neighborVendor: activePair.neighbor,
        trafficLoadPct
      }),
    [borderGuardEnabled, activePair.primary, activePair.neighbor, trafficLoadPct]
  );

  return (
    <div className="space-y-6">
      {/* SECTION 1: 24-Hour PLN WBP/LWBP & BESS LiFePO4 Peak-Shaving Arbitrage */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <BatteryCharging className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  Simulator Arbitrase Tarif PLN WBP/LWBP (17:00–22:00 WIB) &amp; BESS Peak-Shaving
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                  Jawaban Pertanyaan Jam Sibuk CTO
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Saat jam sibuk WBP (17:00–22:00 WIB, tarif 1,5x Rp 2.250/kWh), radio 100% aktif menjaga QoS pelanggan sementara beban listrik dipangkas via DC Bus LiFePO4 48V.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setTopologyMode('jamali_pln_wbp')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                topologyMode === 'jamali_pln_wbp'
                  ? 'bg-[#ED0226] text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Grid PLN Jamali (WBP 1.5x)
            </button>
            <button
              type="button"
              onClick={() => setTopologyMode('rural_3t_diesel_hybrid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                topologyMode === 'rural_3t_diesel_hybrid'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Site 3T Non-Jamali (Hybrid Genset Solar)
            </button>
          </div>
        </div>

        {/* Controls & KPI Strip */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          <div className="lg:col-span-5 space-y-3 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Kapasitas Baterai LiFePO4 48V per Shelter</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">{bessCapacityKwh} kWh</span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                step="5"
                value={bessCapacityKwh}
                onChange={(e) => setBessCapacityKwh(Number(e.target.value))}
                aria-label="Kapasitas Baterai LiFePO4 per Shelter"
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>5 kWh (Buffer)</span>
                <span>15 kWh (Standar Rak)</span>
                <span>40 kWh (Full Hybrid)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Jumlah Menara Kluster Terpasang</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">{siteCount} Site</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="10"
                value={siteCount}
                onChange={(e) => setSiteCount(Number(e.target.value))}
                aria-label="Jumlah Menara Kluster Terpasang"
                className="w-full accent-[#ED0226] cursor-pointer"
              />
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <div className="text-[10px] font-bold uppercase text-slate-400">Tarif Puncak WBP</div>
              <div className="text-sm font-black font-mono text-slate-900 dark:text-white mt-1">
                Rp {(topologyMode === 'rural_3t_diesel_hybrid' ? bessSim.dieselCostPerKwhRp : bessSim.wbpTariffRp).toLocaleString('id-ID')}/kWh
              </div>
              <div className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">
                {topologyMode === 'rural_3t_diesel_hybrid' ? 'BBM Solar Industri' : '17:00–22:00 (1,5x LWBP)'}
              </div>
            </div>

            <div className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/60 dark:bg-emerald-950/20">
              <div className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400">Hemat Khusus WBP</div>
              <div className="text-sm font-black font-mono text-emerald-700 dark:text-emerald-300 mt-1">
                Rp {(bessSim.annualWbpArbitrageOnlyRp / 1000000).toFixed(1)} Jt/thn
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                Murni Peak-Shaving Jam Sibuk
              </div>
            </div>

            <div className="p-3 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/60 dark:bg-blue-950/20">
              <div className="text-[10px] font-bold uppercase text-blue-700 dark:text-blue-400">Total Hemat Kluster</div>
              <div className="text-sm font-black font-mono text-blue-700 dark:text-blue-300 mt-1">
                Rp {(bessSim.annualClusterSavingsRp / 1000000).toFixed(1)} Jt/thn
              </div>
              <div className="text-[10px] text-blue-600 dark:text-blue-400 mt-0.5">
                -{bessSim.costReductionPct}% Tagihan Total
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <div className="text-[10px] font-bold uppercase text-slate-400">Status Radio WBP</div>
              <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-1">
                100% ON (Zero Sleep)
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Kapasitas Trafik Malam Aman
              </div>
            </div>
          </div>
        </div>

        {/* 24-Hour Visual Arbitrage Bar Strip */}
        <div className="p-4 rounded-xl bg-slate-950 text-white space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <span className="font-bold text-slate-200">
              Profil 24-Jam Beban Listrik Grid PLN/Genset vs Siklus Charge/Discharge BESS
            </span>
            <div className="flex items-center gap-3 text-[10px] font-mono">
              <span className="inline-flex items-center gap-1 text-cyan-300">
                <span className="w-2 h-2 rounded-full bg-cyan-400" /> 00:00–05:00 Carrier Sleep + Charge BESS
              </span>
              <span className="inline-flex items-center gap-1 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-slate-400" /> 06:00–16:00 Dynamic HVAC 26°C
              </span>
              <span className="inline-flex items-center gap-1 text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> 17:00–22:00 WBP Peak-Shaving Discharge (Radio 100% ON)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-12 sm:grid-cols-24 gap-1 pt-2 items-end h-28">
            {bessSim.hourlyProfile.map((h) => {
              const heightPct = Math.min(100, Math.round((h.optimizedGridKw / 7.0) * 100));
              const isWbp = h.bessAction === 'PEAK_SHAVING_DISCHARGE';
              const isCharge = h.bessAction === 'CHARGING';
              return (
                <div key={h.hour} className="flex flex-col items-center gap-1 h-full justify-end group">
                  <div className="text-[8px] font-mono text-slate-400">{h.optimizedGridKw}</div>
                  <div
                    className={`w-full rounded-t transition-all ${
                      isWbp
                        ? 'bg-emerald-400'
                        : isCharge
                          ? 'bg-cyan-400'
                          : 'bg-slate-600'
                    }`}
                    style={{ height: `${Math.max(15, heightPct)}%` }}
                    title={`${h.hourLabel} WIB • ${h.tariffZone} • Grid: ${h.optimizedGridKw} kW (Baseline ${h.baselineKw} kW) • ${h.ranMode}`}
                  />
                  <div className="text-[8px] font-mono text-slate-400">
                    {String(h.hour).padStart(2, '0')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 2: Cross-Vendor Border Handover & Coverage-Hole Guard */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  Cross-Vendor Border Handover Guard (Ericsson ENM &harr; Huawei iMaster NCE &harr; ZTE NetNumen)
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 text-[10px] font-bold">
                  Anti Coverage-Hole Perbatasan Kluster
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Mencegah hilangnya sinyal di perbatasan kluster multi-vendor dengan menginstruksikan BTS tetangga menaikkan sudut RET &amp; pilot power via O-RAN O1 sebelum carrier utama masuk mode Eco-Sleep.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setBorderGuardEnabled(true)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                borderGuardEnabled
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              O-RAN O1 Border Guard AKTIF
            </button>
            <button
              type="button"
              onClick={() => setBorderGuardEnabled(false)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                !borderGuardEnabled
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Simulasi Silo Vendor (Tanpa Guard)
            </button>
          </div>
        </div>

        {/* Pair Selector & Telemetry */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          <div className="lg:col-span-5 space-y-3 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <div>
              <label htmlFor="border-vendor-pair-select" className="block text-xs font-bold mb-1">
                Pilih Koridor Perbatasan Lintas-Vendor Telkomsel
              </label>
              <select
                id="border-vendor-pair-select"
                value={vendorPairKey}
                onChange={(e) => setVendorPairKey(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-bold"
              >
                <option value="ericsson_huawei">Perbatasan Jaksel (Ericsson) &harr; Depok (Huawei)</option>
                <option value="huawei_zte">Perbatasan Bandung (Huawei) &harr; Cimahi (ZTE)</option>
                <option value="ericsson_zte">Perbatasan Surabaya (Ericsson) &harr; Sidoarjo (ZTE)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Utilisasi PRB Sel Utama (Off-Peak)</span>
                <span className="font-mono text-blue-600 dark:text-blue-400">{trafficLoadPct}% PRB</span>
              </div>
              <input
                type="range"
                min="10"
                max="40"
                step="1"
                value={trafficLoadPct}
                onChange={(e) => setTrafficLoadPct(Number(e.target.value))}
                aria-label="Utilisasi PRB Sel Utama"
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <div className="text-[10px] font-bold uppercase text-slate-400">Kompensasi RET Tetangga</div>
                <div className="text-sm font-black font-mono text-slate-900 dark:text-white mt-1">
                  {borderSim.neighborRetTiltDeg}° ({borderSim.borderGuardEnabled ? '+1.5° Uptilt' : 'Statis'})
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Boost TX: +{borderSim.neighborTxPowerBoostDb} dB
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <div className="text-[10px] font-bold uppercase text-slate-400">Sinyal RSRP Perbatasan</div>
                <div
                  className={`text-sm font-black font-mono mt-1 ${
                    borderSim.coverageHoleDetected ? 'text-rose-600' : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {borderSim.borderRsrpDbm} dBm
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {borderSim.coverageHoleDetected ? 'Coverage Hole!' : 'Kuat & Merata'}
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <div className="text-[10px] font-bold uppercase text-slate-400">Handover Success</div>
                <div
                  className={`text-sm font-black font-mono mt-1 ${
                    borderSim.coverageHoleDetected ? 'text-rose-600' : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {borderSim.handoverSuccessRatePct}%
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Ping-Pong: {borderSim.pingPongHandoverPct}%
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <div className="text-[10px] font-bold uppercase text-slate-400">Hemat Daya Bersih</div>
                <div className="text-sm font-black font-mono text-blue-600 dark:text-blue-400 mt-1">
                  -{borderSim.clusterNetEnergySavingPct}% kWh
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Net Pasca Kompensasi
                </div>
              </div>
            </div>

            <div
              className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                borderSim.coverageHoleDetected
                  ? 'border-rose-300 bg-rose-50/80 dark:border-rose-900 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200'
                  : 'border-emerald-300 bg-emerald-50/80 dark:border-emerald-900 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200'
              }`}
            >
              {borderSim.coverageHoleDetected ? (
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              )}
              <div className="text-xs">
                <div className="font-black">{borderSim.slaVerdict}</div>
                <p className="mt-0.5 opacity-90">{borderSim.engineeringExplanation}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
