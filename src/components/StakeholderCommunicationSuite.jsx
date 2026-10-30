import React, { useState } from 'react';
import { 
  FileText, 
  Smartphone, 
  Users, 
  Leaf, 
  ShieldCheck, 
  ExternalLink, 
  Award, 
  Sparkles, 
  QrCode, 
  CheckCircle2,
  TreeDeciduous,
  Sun,
  Share2
} from 'lucide-react';

const ESG_FACTSHEET_DATA = {
  title: 'ESG Factsheet Triwulanan Telkomsel (Q3 2027)',
  period: 'Periode Pilot 9-Bulan: Kluster Surabaya Raya',
  metrics: [
    { label: 'Emisi Scope 2 Dihindari', val: '174,0 tCO₂e/thn', note: 'Faktor ESDM 0,87 kgCO2e/kWh' },
    { label: 'Efisiensi Energi Jaringan', val: '200,0 MWh/thn', note: 'Target Skenario Dasar 10%' },
    { label: 'Intensitas Energi Data', val: '0,14 kWh/TB', note: 'Turun 9,2% vs baseline pra-pilot' },
    { label: 'Non-Inferioritas Mutu QoS', val: '99,94%', note: 'SLA minimum 99,90% terjaga' },
    { label: 'Penghematan Kas Bersih', val: 'Rp 240 Juta/thn', note: 'Setelah dikurangi OpEx Rp60 Jt' },
    { label: 'Dana Reinvestasi Sosial 3T', val: 'Rp 36 Juta/thn', note: '15% ring-fenced community dividend' }
  ],
  governancePoints: [
    'Metodologi Kausal: Difference-in-Differences (DiD) mengisolasi cuaca dan variasi trafik pelanggan.',
    'Kepatuhan Standar: Selaras IAI PSPK 1 & PSPK 2 (efektif 2027) dan POJK No. 51/POJK.03/2017.',
    'Jejak Audit Digital: Seluruh berkas telemetri dan log keputusan diverifikasi hash kriptografis SHA-256.',
    'Kesiapan Audit Independen: Kertas kerja siap ditelaah Kantor Akuntan Publik (KAP) untuk perikatan assurance.'
  ]
};

const SPEAKER_ROSTER = [
  {
    targetAudience: 'Investor, Analis Saham, & Lembaga ESG Rating (MSCI / S&P CSA)',
    spokesperson: 'Direktur Keuangan (CFO) & VP Sustainability Telkomsel',
    keyFocus: 'Valuasi DCF, NPV +Rp460 Juta, Payback 1,9 thn, WACC 10%, kepatuhan IAI PSPK 1 & 2, mitigasi risiko greenwashing.'
  },
  {
    targetAudience: 'Regulator (Kemenkominfo, Kementerian BUMN, Bappenas)',
    spokesperson: 'VP Network Architecture & VP Regulatory Affairs',
    keyFocus: 'Kepatuhan standar mutu QoS (Availability ≥99,9%), pemenuhan standar ITU-T L.1331, sinergi USO/3T, non-gangguan layanan esensial.'
  },
  {
    targetAudience: 'Pelanggan Ritel (B2C) & Media Massa',
    spokesperson: 'VP Corporate Communications & Green Network Champions (Duta Internal)',
    keyFocus: 'Pemberdayaan pelanggan via MyTelkomsel Green Badge, transparansi program Jaga Cita & Internet BAIK, pembuktian fakta tanpa klaim berlebih.'
  }
];

export default function StakeholderCommunicationSuite() {
  const [activeChannel, setActiveChannel] = useState('factsheet'); // 'factsheet' | 'mytelkomsel' | 'speakers'
  const [redeemedPoints, setRedeemedPoints] = useState(false);

  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-6 md:p-8 space-y-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-400">
              <Share2 className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Bab 5.3: Strategi Komunikasi Pemangku Kepentingan & B2C Engagement
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Factsheet ESG 2-Halaman, MyTelkomsel Green Badge, & Matriks Speaker Selection System (Tabel 19 & 20)
              </p>
            </div>
          </div>
        </div>

        {/* Subnavigation buttons */}
        <div className="flex gap-1.5 text-xs">
          <button
            onClick={() => setActiveChannel('factsheet')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeChannel === 'factsheet'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Factsheet ESG Triwulanan
          </button>
          <button
            onClick={() => setActiveChannel('mytelkomsel')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeChannel === 'mytelkomsel'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Mockup MyTelkomsel Green Badge
          </button>
          <button
            onClick={() => setActiveChannel('speakers')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeChannel === 'speakers'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Speaker Selection System
          </button>
        </div>
      </div>

      {/* VIEW 1: ESG FACTSHEET */}
      {activeChannel === 'factsheet' && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700/60 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Publikasi Resmi B2B & Rater ESG</span>
                <h3 className="font-black text-base text-slate-900 dark:text-white mt-0.5">{ESG_FACTSHEET_DATA.title}</h3>
                <span className="text-xs text-slate-500">{ESG_FACTSHEET_DATA.period}</span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold self-start">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Format Ringkas 2-Halaman</span>
              </span>
            </div>

            {/* Key KPI Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {ESG_FACTSHEET_DATA.metrics.map((m, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-white dark:bg-[#0B1324] border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">{m.label}</span>
                  <div className="text-lg font-black text-slate-900 dark:text-white">{m.val}</div>
                  <span className="text-[10px] text-slate-500 block">{m.note}</span>
                </div>
              ))}
            </div>

            {/* Governance Assurance Bulletins */}
            <div className="space-y-2 pt-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Pilar Penjaminan Tata Kelola & Integritas Metodologi:
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                {ESG_FACTSHEET_DATA.governancePoints.map((gp, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{gp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: MYTELKOMSEL GREEN BADGE PREVIEW */}
      {activeChannel === 'mytelkomsel' && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid gap-6 md:grid-cols-2 items-center">
            {/* Phone Mockup Frame */}
            <div className="mx-auto w-full max-w-sm rounded-[36px] border-4 border-slate-800 bg-white dark:bg-slate-950 p-4 shadow-xl space-y-4">
              {/* Phone Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-lg bg-[#ED0226] flex items-center justify-center font-black text-[10px] text-white">
                    T
                  </div>
                  <span className="text-xs font-black text-slate-900 dark:text-white">MyTelkomsel App</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-400">100% Sinyal 5G</span>
              </div>

              {/* Eco Badge Card inside App */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white space-y-3 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                    Eco-Conscious Badge
                  </span>
                  <Leaf className="w-4 h-4 text-emerald-200" />
                </div>
                <div>
                  <h4 className="text-sm font-black">Green Network Pioneer</h4>
                  <p className="text-[11px] text-emerald-100 mt-0.5 leading-snug">
                    Anda terhubung ke BTS bertenaga efisiensi energi cerdas ImpactGrid.
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-white/20 pt-2 text-[10px]">
                  <span>Skor Jaringan Hijau:</span>
                  <strong className="text-white font-black text-xs">88 / 100</strong>
                </div>
              </div>

              {/* Telkomsel Poin Exchange Feature */}
              <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B1324]/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Tukar Telkomsel Poin</span>
                  <span className="text-[11px] font-black text-[#ED0226]">150 Poin Tersedia</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Konversikan 50 Poin untuk mendukung elektrifikasi Solar BTS sekolah di wilayah 3T bersama program <em>Telkomsel Jaga Cita</em>.
                </p>
                <button
                  onClick={() => setRedeemedPoints(true)}
                  disabled={redeemedPoints}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    redeemedPoints
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#ED0226] hover:bg-red-700 text-white'
                  }`}
                >
                  {redeemedPoints ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Berhasil Ditukarkan (+1 Bibit Ditanam)</span>
                    </>
                  ) : (
                    <>
                      <Sun className="w-3.5 h-3.5" />
                      <span>Tukar 50 Poin untuk Solar 3T</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-[10px] text-center text-slate-400">
                Inisiatif Customer Engagement & Green Loyalty Telkomsel
              </div>
            </div>

            {/* Explanation Column */}
            <div className="space-y-4">
              <h3 className="font-black text-lg text-slate-900 dark:text-white">
                Monetisasi Reputasi & Brand Equity Tanpa Biaya Tambahan
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Model bisnis <strong>tidak memonetisasi reputasi hijau secara spekulatif</strong> dalam model DCF kas. Sebaliknya, dampak ESG disalurkan langsung menjadi nilai retensi pelanggan ritel (B2C) melalui ekosistem MyTelkomsel.
              </p>
              <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
                  <TreeDeciduous className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Peningkatan Customer Stickiness:</strong> Generasi Z & Milenial memiliki preferensi tinggi pada penyedia telko berkelanjutan.
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
                  <Sun className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <strong>Sinergi Telkomsel Jaga Cita:</strong> Pelanggan merasa menjadi bagian langsung dalam elektrifikasi sekolah dan puskesmas 3T.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: TELKOMSEL SPEAKER SELECTION FRAMEWORK */}
      {activeChannel === 'speakers' && (
        <div className="space-y-4 animate-fade-in">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Untuk mencegah pesan inkonsisten dan risiko <em>greenwashing</em>, sistem menetapkan <strong>Telkomsel Executive Speaker Selection Framework</strong> yang mencocokkan profil juru bicara dengan kekhawatiran spesifik masing-masing audiens kunci:
          </p>

          <div className="grid gap-3 sm:grid-cols-3">
            {SPEAKER_ROSTER.map((sr, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-2">
                <span className="text-[10px] font-black uppercase text-[#ED0226] block">
                  Audiens #{idx + 1}
                </span>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                  {sr.targetAudience}
                </h4>
                <div className="text-xs pt-1 space-y-1.5">
                  <div className="p-2 rounded-lg bg-white dark:bg-[#0B1324] border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Juru Bicara Resmi:</span>
                    <strong className="text-slate-900 dark:text-white">{sr.spokesperson}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Fokus Pesan & Bukti:</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed mt-0.5">
                      {sr.keyFocus}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
