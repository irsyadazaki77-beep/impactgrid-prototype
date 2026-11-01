import React, { useState, useMemo } from 'react';
import {
  Terminal,
  Server,
  Globe,
  ShieldAlert,
  CheckCircle2,
  Copy,
  Check,
  Play,
  Database,
  Layers,
  Zap,
  ShieldCheck,
  Flame
} from 'lucide-react';
import {
  TELKOMSEL_API_ENDPOINTS,
  KAFKA_SCHEMA_TOPICS,
  executeTelkomselApiSimulation,
  calculateNationalRegionalRollout,
  simulateChaosResiliencyScenario
} from '../utils/telkomselItMaxCompetitiveEngine';

export default function TelkomselItMaxSuitePanel() {
  const [activeSubTab, setActiveSubTab] = useState('api_gateway'); // 'api_gateway' | 'national_11reg' | 'chaos_lab'

  // 1. API Gateway Playground State
  const [selectedEndpointId, setSelectedEndpointId] = useState('tmf628_telemetry');
  const [executionCount, setExecutionCount] = useState(1);
  const [copiedCurl, setCopiedCurl] = useState(false);

  // 2. 11-Regional Rollout State
  const [deploymentCoveragePct, setDeploymentCoveragePct] = useState(100);
  const [includeBessInRural, setIncludeBessInRural] = useState(true);

  // 3. Chaos Resiliency Lab State
  const [selectedChaosId, setSelectedChaosId] = useState('dc_failover');

  const apiSimResult = useMemo(
    () => executeTelkomselApiSimulation(selectedEndpointId),
    [selectedEndpointId, executionCount]
  );

  const regionalRollout = useMemo(
    () =>
      calculateNationalRegionalRollout({
        deploymentCoveragePct,
        includeBessInRural
      }),
    [deploymentCoveragePct, includeBessInRural]
  );

  const chaosResult = useMemo(
    () => simulateChaosResiliencyScenario(selectedChaosId),
    [selectedChaosId]
  );

  const handleCopyCurl = () => {
    navigator.clipboard?.writeText(apiSimResult.curlSnippet);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Sub-Tab Switcher */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-white p-5 shadow-md space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#ED0226] text-white">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black tracking-tight">
                  Telkomsel IT Enterprise MAX Suite: Open API Gateway, 11-Regional Scale-Up &amp; Chaos Lab
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold">
                  TM Forum + O-RAN O1/A1 + SAP OData Ready
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Dirancang khusus agar setara &amp; langsung kompatibel dengan standar arsitektur IT Telkomsel (Apigee mTLS Gateway, Confluent Kafka Schema Registry, Tier-III DC Sentul/Surabaya, &amp; 11 Regional Network Operations).
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveSubTab('api_gateway')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeSubTab === 'api_gateway'
                  ? 'bg-[#ED0226] text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              1. TMF Open API &amp; Kafka Bus Playground
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('national_11reg')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeSubTab === 'national_11reg'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              2. Rollout Nasional 11 Regional (43.000 BTS)
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('chaos_lab')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeSubTab === 'chaos_lab'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              3. Chaos DR Sentul-Surabaya &amp; Anti-Spoofing Lab
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: TMF OPEN API GATEWAY & KAFKA SCHEMA REGISTRY PLAYGROUND */}
      {activeSubTab === 'api_gateway' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left Column: Endpoint Selector */}
            <div className="lg:col-span-5 space-y-2.5">
              <div className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 px-1">
                Pilih Endpoint Enterprise API Gateway (Apigee mTLS):
              </div>
              {TELKOMSEL_API_ENDPOINTS.map((ep) => {
                const isSelected = ep.id === selectedEndpointId;
                return (
                  <button
                    key={ep.id}
                    type="button"
                    onClick={() => setSelectedEndpointId(ep.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition cursor-pointer ${
                      isSelected
                        ? 'border-[#ED0226] bg-red-50/70 dark:bg-red-950/30 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-black ${
                          ep.method === 'POST'
                            ? 'bg-blue-600 text-white'
                            : 'bg-emerald-600 text-white'
                        }`}
                      >
                        {ep.method}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        SLA &le; {ep.slaLatencyMs}ms
                      </span>
                    </div>
                    <div className="font-mono text-xs font-bold text-slate-900 dark:text-white mt-1.5 break-all">
                      {ep.path}
                    </div>
                    <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
                      {ep.standard}
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                      {ep.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Right Column: Live Execution Console */}
            <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-950 text-slate-100 p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <div className="text-[10px] font-mono uppercase text-amber-400">
                      TARGET BACKEND: {apiSimResult.targetSystem}
                    </div>
                    <div className="text-sm font-black font-mono text-emerald-400 mt-0.5">
                      HTTP {apiSimResult.httpStatusText} • Latensi: {apiSimResult.latencyMs}ms
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setExecutionCount((c) => c + 1)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#ED0226] hover:bg-red-700 text-white text-xs font-black transition cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Kirim Request Live</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyCurl}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-200 transition cursor-pointer"
                    >
                      {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCurl ? 'cURL Tersalin' : 'Salin cURL'}</span>
                    </button>
                  </div>
                </div>

                {/* Request & Response Split */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <div className="text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">
                      Request Payload (JSON):
                    </div>
                    <pre className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto max-h-56">
                      {JSON.stringify(apiSimResult.requestPayload, null, 2)}
                    </pre>
                  </div>

                  <div>
                    <div className="text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">
                      Response Body &amp; Merkle Receipt:
                    </div>
                    <pre className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-56">
                      {JSON.stringify(
                        {
                          headers: apiSimResult.responseHeaders,
                          body: apiSimResult.responseBody
                        },
                        null,
                        2
                      )}
                    </pre>
                  </div>
                </div>

                {/* cURL Snippet */}
                <div>
                  <div className="text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">
                    cURL Command Siap Pakai (Telkomsel Internal Apigee Gateway):
                  </div>
                  <pre className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[10px] font-mono text-amber-300 overflow-x-auto">
                    {apiSimResult.curlSnippet}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Confluent Kafka Schema Registry Table */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[#ED0226]" />
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Spesifikasi Confluent Kafka Event Bus &amp; Schema Registry (Telkom DC Sentul)
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                Throughput Skala Penuh: 24.700+ pesan/detik (43.000 BTS Makro)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {KAFKA_SCHEMA_TOPICS.map((item) => (
                <div
                  key={item.topic}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <code className="font-mono font-black text-[#ED0226] dark:text-red-400">
                      {item.topic}
                    </code>
                    <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px] font-bold">
                      {item.partitions} Partitions
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 font-semibold">
                    {item.format} • {item.throughputMsgSec}
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.keyFields.map((f) => (
                      <span
                        key={f}
                        className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-[10px] text-slate-600 dark:text-slate-300"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: NATIONAL 11-REGIONAL TELKOMSEL ROLLOUT PLANNER */}
      {activeSubTab === 'national_11reg' && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  Simulasi Rollout Nasional 11 Regional Telkomsel ({regionalRollout.totalActiveSites.toLocaleString('id-ID')} Menara Makro)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Memperhitungkan perbedaan faktor emisi grid ESDM per pulau (Jamali 0,87 vs Sumatera 0,79 vs Maluku-Papua Hybrid Genset 1,08 kgCO₂e/kWh).
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold">Cakupan Rollout Nasional:</span>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="10"
                    value={deploymentCoveragePct}
                    onChange={(e) => setDeploymentCoveragePct(Number(e.target.value))}
                    aria-label="Cakupan Rollout Nasional"
                    className="w-28 accent-[#ED0226] cursor-pointer"
                  />
                  <span className="font-mono text-xs font-black text-[#ED0226]">{deploymentCoveragePct}%</span>
                </div>

                <button
                  type="button"
                  onClick={() => setIncludeBessInRural((v) => !v)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    includeBessInRural
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Hybrid BESS 3T/Non-Jamali: {includeBessInRural ? 'AKTIF' : 'NON-AKTIF'}
                </button>
              </div>
            </div>

            {/* National Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <div className="text-[10px] font-bold uppercase text-slate-400">Total Menara Terintegrasi</div>
                <div className="text-lg font-black font-mono text-slate-900 dark:text-white mt-1">
                  {regionalRollout.totalActiveSites.toLocaleString('id-ID')} BTS
                </div>
                <div className="text-[10px] text-slate-500">11 Regional Operasional Telkomsel</div>
              </div>

              <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/60 dark:bg-emerald-950/20">
                <div className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400">Hemat Kas Bersih Telkomsel (85%)</div>
                <div className="text-lg font-black font-mono text-emerald-700 dark:text-emerald-300 mt-1">
                  Rp {(regionalRollout.totalTelkomselNet85Rp / 1000000000).toFixed(1)} Miliar/thn
                </div>
                <div className="text-[10px] text-emerald-600">Setelah Bagi Hasil 15% TowerCo</div>
              </div>

              <div className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/60 dark:bg-blue-950/20">
                <div className="text-[10px] font-bold uppercase text-blue-700 dark:text-blue-400">Energi Listrik Dihemat</div>
                <div className="text-lg font-black font-mono text-blue-700 dark:text-blue-300 mt-1">
                  {(regionalRollout.totalSavedMwh / 1000).toFixed(1)} GWh/thn
                </div>
                <div className="text-[10px] text-blue-600">{regionalRollout.totalSavedMwh.toLocaleString('id-ID')} MWh/tahun</div>
              </div>

              <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-950/20">
                <div className="text-[10px] font-bold uppercase text-amber-700 dark:text-amber-400">Reduksi Emisi Scope 2 Nasional</div>
                <div className="text-lg font-black font-mono text-amber-700 dark:text-amber-300 mt-1">
                  {regionalRollout.totalScope2AbatedTons.toLocaleString('id-ID')} tCO₂e/thn
                </div>
                <div className="text-[10px] text-amber-600">Terverifikasi Faktor Grid ESDM</div>
              </div>
            </div>

            {/* 11-Regional Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900 text-white text-[10px] font-black uppercase">
                    <th className="py-2.5 px-3">Regional Telkomsel</th>
                    <th className="py-2.5 px-3 text-right">Site Aktif</th>
                    <th className="py-2.5 px-3 text-right">Faktor Emisi</th>
                    <th className="py-2.5 px-3 text-right">Porsi Genset</th>
                    <th className="py-2.5 px-3 text-right">Efisiensi</th>
                    <th className="py-2.5 px-3 text-right">Hemat (MWh/thn)</th>
                    <th className="py-2.5 px-3 text-right">Net Telkomsel 85%</th>
                    <th className="py-2.5 px-3 text-right">Reduksi CO₂</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {regionalRollout.regionalBreakdown.map((reg) => (
                    <tr key={reg.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-2 px-3 font-bold text-slate-900 dark:text-white">{reg.name}</td>
                      <td className="py-2 px-3 text-right font-mono">{reg.activeSites.toLocaleString('id-ID')}</td>
                      <td className="py-2 px-3 text-right font-mono">{reg.gridEmissionFactor} kg/kWh</td>
                      <td className="py-2 px-3 text-right font-mono">{reg.dieselSharePct}%</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        -{reg.regionalEfficiencyPct}%
                      </td>
                      <td className="py-2 px-3 text-right font-mono">{reg.annualSavedMwh.toLocaleString('id-ID')}</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                        Rp {(reg.telkomselNet85SavingsRp / 1000000000).toFixed(1)} M
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-emerald-700 dark:text-emerald-300">
                        {reg.scope2AbatedTons.toLocaleString('id-ID')} tCO₂e
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: CHAOS ENGINEERING & CYBER-PHYSICAL RESILIENCY LAB */}
      {activeSubTab === 'chaos_lab' && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                Chaos Engineering &amp; Cyber-Physical Resiliency Lab (Sentul &harr; Surabaya DR + CISO Guard)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Simulasikan kegagalan ekstrem untuk membuktikan bahwa ImpactGrid tidak pernah mengorbankan sinyal pelanggan ataupun integritas data akuntansi SAP.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedChaosId('dc_failover')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedChaosId === 'dc_failover'
                    ? 'bg-[#ED0226] text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                1. Outage DC Sentul &rarr; DR Surabaya
              </button>
              <button
                type="button"
                onClick={() => setSelectedChaosId('spoofing_attack')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedChaosId === 'spoofing_attack'
                    ? 'bg-[#ED0226] text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                2. Injeksi Telemetri Palsu (Anti-Spoofing)
              </button>
              <button
                type="button"
                onClick={() => setSelectedChaosId('backhaul_severed_112')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedChaosId === 'backhaul_severed_112'
                    ? 'bg-[#ED0226] text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                3. Putus Fiber Backhaul + Darurat 112
              </button>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 text-white space-y-4 border border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm sm:text-base font-black text-amber-400">
                {chaosResult.title}
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-mono font-bold">
                RPO: {chaosResult.rpoSeconds}s • RTO: {chaosResult.rtoSeconds}s ({chaosResult.failoverDurationMs}ms)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="text-[10px] font-mono uppercase text-rose-400 font-bold">Gangguan yang Disuntikkan:</div>
                <p className="text-slate-200">{chaosResult.injectedFault}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="text-[10px] font-mono uppercase text-cyan-400 font-bold">Mekanisme Pertahanan Otomatis:</div>
                <p className="text-slate-200">{chaosResult.defenseMechanism}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold">Status Jaringan RAN &amp; Ledger:</div>
                <p className="text-emerald-300 font-bold">{chaosResult.ranImpact}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 flex items-center gap-2.5 text-xs font-bold text-emerald-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{chaosResult.verdict}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
