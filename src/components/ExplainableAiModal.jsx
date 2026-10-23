import React from 'react';
import { 
  X, 
  Bot, 
  Sparkles, 
  Sliders, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  HelpCircle, 
  TrendingUp,
  Cpu,
  Layers,
  Zap,
  ArrowRight
} from 'lucide-react';

/**
 * ExplainableAiModal:
 * Detailed Explainable AI (XAI) transparent breakdown providing:
 * - Decision rationale & physics-based equations
 * - Input feature importance & parameter thresholds
 * - Potential operational risks & safeguard mechanisms
 * - Statistical confidence level (%)
 * - Alternative options evaluated (Plan A vs Plan B)
 */
export default function ExplainableAiModal({ 
  isOpen, 
  onClose, 
  recommendation = null 
}) {
  if (!isOpen) return null;

  const data = recommendation || {
    title: "Dynamic Carrier Deep-Sleep & HVAC Setpoint 26°C",
    agentName: "Prophet-RAN + ThermoOptima Swarm",
    siteId: "LOC-INT-001 (Monas Tower, Jakarta)",
    vendor: "Ericsson",
    confidence: 96.8,
    action: "Matikan 3 carrier kapasitas (LTE 2.3GHz & Massive MIMO) dan naikkan setpoint shelter AC ke 26°C",
    rationale: "Model Time-Series LSTM memproyeksikan payload PRB drop di bawah ambang batas 25% mulai 01:15 WIB sampai 05:00 WIB. Beban pendinginan shelter diprediksi stabil pada 28°C ambient.",
    parameters: [
      { name: "PRB Utilization Rate", current: "18.4%", threshold: "< 25.0%", status: "safe" },
      { name: "Active User Count", current: "42 UEs", threshold: "< 100 UEs", status: "safe" },
      { name: "Emergency 112 Guaranteed Carrier", current: "700 & 900 MHz", threshold: "LOCKED ON", status: "locked" },
      { name: "Shelter Internal Temp", current: "24.2°C", threshold: "Max 30°C", status: "safe" },
      { name: "Wake-up Latency Buffer", current: "92 ms", threshold: "< 120 ms (3GPP Rel 18)", status: "safe" }
    ],
    risks: [
      {
        risk: "Lonjakan trafik mendadak (Flash Crowds)",
        severity: "Medium",
        mitigation: "Sentinel-SLA memonitor sinyal PUCCH tiap 100ms. Jika request melonjak >30%, wake-up otomatis <120ms aktif."
      },
      {
        risk: "Overheating shelter saat AC kompresor trip",
        severity: "Low",
        mitigation: "Redundant blower exhaust fan aktif darurat saat sensor mendeteksi temperatur >29.5°C."
      }
    ],
    alternatives: [
      {
        option: "Opsi A (Dipilih): Multi-Carrier Sleep + Dynamic HVAC 26°C",
        benefit: "Hemat listrik 12,4 kWh/jam (Rp 18.600/jam/site)",
        drawback: "Reaktivasi 92ms jika trafik meledak",
        status: "RECOMMENDED"
      },
      {
        option: "Opsi B: Hanya Dynamic HVAC tanpa Radio Sleep",
        benefit: "Hemat listrik 3,2 kWh/jam (Rp 4.800/jam/site)",
        drawback: "Penghematan 74% lebih rendah, emisi tetap tinggi",
        status: "REJECTED"
      },
      {
        option: "Opsi C: Status Quo (Seluruh Carrier & AC 22°C Standar)",
        benefit: "Zero risiko latensi reaktivasi",
        drawback: "Pemborosan energi Rp 142 Jt/thn per site",
        status: "REJECTED"
      }
    ]
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider">
                Explainable AI (XAI) Engine
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
                Confidence: {data.confidence}%
              </span>
            </div>
            <h2 className="text-lg font-black tracking-tight">{data.title}</h2>
            <p className="text-xs text-slate-300 font-normal">
              Agen: <strong className="text-white">{data.agentName}</strong> • Target: {data.siteId}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
          {/* Action Callout */}
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200">
            <span className="text-[10px] font-extrabold text-[#ED0226] uppercase block tracking-wider mb-1">
              Rekomendasi Keputusan Otonom
            </span>
            <p className="text-slate-900 font-bold leading-relaxed">
              {data.action}
            </p>
          </div>

          {/* Rationale */}
          <div className="space-y-1.5">
            <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              1. Rationale & Dasar Pertimbangan Fisika / AI
            </h4>
            <p className="text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 leading-relaxed">
              {data.rationale}
            </p>
          </div>

          {/* Decision Parameters */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              2. Parameter Input & Ambang Batas Aman (Guardrails)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {data.parameters.map((param, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-700 block text-[11px]">{param.name}</span>
                    <span className="text-[10px] text-slate-400">Ambang: {param.threshold}</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-[11px] font-extrabold ${
                      param.status === 'locked' ? 'text-amber-700' : 'text-emerald-700'
                    }`}>
                      {param.current}
                    </span>
                    <span className="text-[9px] block text-slate-400 uppercase">
                      {param.status === 'locked' ? 'Locked (112)' : 'Compliant'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Mitigation */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              3. Analisis Risiko & Mitigasi Fail-Safe
            </h4>
            <div className="space-y-2">
              {data.risks.map((r, i) => (
                <div key={i} className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-900 text-[11px]">{r.risk}</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-200 text-amber-900">
                      Level: {r.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-normal leading-relaxed">
                    <strong>Mitigasi:</strong> {r.mitigation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Alternatives Evaluated */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600" />
              4. Alternatif Keputusan yang Diuji (Multi-Criteria Evaluation)
            </h4>
            <div className="space-y-2">
              {data.alternatives.map((alt, i) => (
                <div 
                  key={i} 
                  className={`p-3 rounded-xl border transition ${
                    alt.status === 'RECOMMENDED'
                      ? 'bg-emerald-50/70 border-emerald-300'
                      : 'bg-slate-50 border-slate-200 opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-bold text-[11px] ${
                      alt.status === 'RECOMMENDED' ? 'text-emerald-900 font-extrabold' : 'text-slate-700'
                    }`}>
                      {alt.option}
                    </span>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                      alt.status === 'RECOMMENDED'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {alt.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[10px] text-slate-600">
                    <p><strong className="text-emerald-700">Dampak:</strong> {alt.benefit}</p>
                    <p><strong className="text-slate-500">Konsekuensi:</strong> {alt.drawback}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Audit Trail terdesentralisasi SHA-256 (GreenLedger)</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition cursor-pointer"
          >
            Tutup Penjelasan
          </button>
        </div>
      </div>
    </div>
  );
}
