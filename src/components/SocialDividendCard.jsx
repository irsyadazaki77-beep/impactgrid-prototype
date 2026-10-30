import React, { useState, useMemo } from 'react';
import { HeartHandshake, GraduationCap, Store, Zap, ShieldCheck, ArrowRight, Sparkles, Sliders } from 'lucide-react';
import { SOCIAL_DIVIDEND_CONFIG, IMPLEMENTATION_HORIZONS } from '../data/mockData';

export default function SocialDividendCard({ selectedScale = 'pilot' }) {
  const [reinvestPct, setReinvestPct] = useState(50); // Default 50% dividen sosial

  // Hitung dasar kas penghematan neto sesuai skala implementasi
  const netBenefitAnnualIDR = useMemo(() => {
    if (selectedScale === 'regional') {
      return IMPLEMENTATION_HORIZONS.regional.netBenefitYearIDR; // Rp 4,80 Miliar
    }
    if (selectedScale === 'national') {
      return IMPLEMENTATION_HORIZONS.national.netBenefitYearIDR; // Rp 14,90 Miliar
    }
    // Pilot: Target efisiensi hemat neto ~Rp 240 Jt s.d. Rp 300 Jt
    return 240_000_000;
  }, [selectedScale]);

  const socialFundIDR = (netBenefitAnnualIDR * reinvestPct) / 100;
  const operatorRetainedIDR = netBenefitAnnualIDR - socialFundIDR;

  // Alokasi ke 3 pilar sosial studi kasus Telkomsel
  const calculatedPillars = useMemo(() => {
    return SOCIAL_DIVIDEND_CONFIG.allocationPillars.map((pillar) => {
      const pillarFund = (socialFundIDR * pillar.sharePct) / 100;
      const unitsAchieved = Math.floor(pillarFund / pillar.unitCostIDR);
      return {
        ...pillar,
        fundIDR: pillarFund,
        unitsAchieved
      };
    });
  }, [socialFundIDR]);

  const formatIDR = (num) => {
    if (num >= 1_000_000_000) {
      return `Rp ${(num / 1_000_000_000).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Miliar/th`;
    }
    return `Rp ${(num / 1_000_000).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} Juta/th`;
  };

  const getPillarIcon = (id) => {
    switch (id) {
      case 'jaga_cita': return GraduationCap;
      case 'internet_baik': return Store;
      case 'inclusive_power': return Zap;
      default: return HeartHandshake;
    }
  };

  return (
    <section className="rounded-2xl border border-rose-200 dark:border-rose-950/80 bg-gradient-to-br from-rose-50/50 via-white to-amber-50/30 dark:from-slate-900/90 dark:via-slate-900/70 dark:to-slate-950/90 p-5 sm:p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-100 dark:border-rose-950/60 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/50 px-2.5 py-0.5 text-[11px] font-bold text-rose-800 dark:text-rose-300">
            <HeartHandshake className="w-3.5 h-3.5 text-rose-600" />
            <span>Pilar Sosial ESG • Studi Kasus Telkomsel</span>
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Mekanisme Dividen Sosial: Reinvestasi Efisiensi Daya ke Inklusi Digital
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Menjawab tuntas tantangan studi kasus Telkomsel: menghubungkan penghematan kas operasional energi dengan program nyata <em>Telkomsel Jaga Cita</em>, <em>Internet BAIK</em>, dan elektrifikasi BTS daerah tertinggal (3T).
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 bg-white dark:bg-slate-800/80 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
          <Sliders className="w-4 h-4 text-rose-600" />
          <div className="text-right">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Porsi Reinvestasi:</span>
            <span className="text-xs font-black text-rose-600 dark:text-rose-400">{reinvestPct}% dari Kas Hemat</span>
          </div>
        </div>
      </div>

      {/* Interactive Control Slider */}
      <div className="bg-white/80 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/90 dark:border-slate-700/80 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-extrabold text-slate-800 dark:text-slate-200">
            Simulasi Pembagian Manfaat Kas Efisiensi Jaringan ({formatIDR(netBenefitAnnualIDR)})
          </span>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-rose-700 dark:text-rose-400 font-bold">
              Dana Sosial: <strong>{formatIDR(socialFundIDR)}</strong>
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">
              Ditahan Telkomsel: <strong>{formatIDR(operatorRetainedIDR)}</strong>
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={reinvestPct}
            onChange={(e) => setReinvestPct(Number(e.target.value))}
            className="w-full accent-rose-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>10% (Konservatif)</span>
            <span>50% (Rekomendasi Kebijakan ESG)</span>
            <span>100% (Filantropi Penuh)</span>
          </div>
        </div>
      </div>

      {/* 3 Impact Output Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {calculatedPillars.map((pillar) => {
          const Icon = getPillarIcon(pillar.id);
          return (
            <article 
              key={pillar.id}
              className="bg-white dark:bg-slate-800/80 rounded-xl p-4 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-3 shadow-2xs hover:border-rose-300 transition"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    Porsi {pillar.sharePct}%
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-slate-100">{pillar.name}</h4>
                  <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold">{pillar.badge}</span>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700/80 space-y-1 bg-rose-50/40 dark:bg-rose-950/20 p-2.5 rounded-lg">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Hasil Dampak Terukur:</div>
                <div className="text-base font-black text-rose-700 dark:text-rose-400">
                  {pillar.unitsAchieved.toLocaleString('id-ID')} <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{pillar.unitLabel}</span>
                </div>
                <div className="text-[10px] text-slate-500">
                  Anggaran terserap: {formatIDR(pillar.fundIDR)}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Assurance Note */}
      <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed">
        <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <span>
          <strong>Tata Kelola ESG Terpercaya:</strong> Alokasi dana dividen sosial diaudit melalui jejak audit tak terubah (immutable log), memastikan tidak ada <em>greenwashing</em> dan setiap rupiah penghematan daya benar-benar memberi manfaat bagi masyarakat.
        </span>
      </div>
    </section>
  );
}
