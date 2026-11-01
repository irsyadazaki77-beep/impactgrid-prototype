import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  X,
  Zap,
  Radio,
  HelpCircle,
  Layers,
  ShieldCheck,
  ArrowRight,
  CornerDownLeft,
  CheckCircle2,
  FileText,
  Database,
  Wrench,
  Sparkles
} from 'lucide-react';
import { searchCommandPalette } from '../utils/enterpriseCommandAndClosedLoopEngine';

const CATEGORY_TABS = [
  { id: 'all', label: 'Semua' },
  { id: 'actions', label: 'Aksi Cepat & Modal' },
  { id: 'modules', label: '10 Modul Utama' },
  { id: 'sites', label: '50 Site BTS Pilot' },
  { id: 'bod', label: '10 Q&A Direksi' },
  { id: 'evidence', label: 'Bukti & Regulasi' }
];

export default function CommandPaletteModal({
  isOpen,
  onClose,
  onNavigateTab,
  onChangeViewMode,
  onExecuteAction,
  resolvedSites = []
}) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const results = useMemo(
    () => searchCommandPalette(query, { category: activeCategory, limit: 30 }),
    [query, activeCategory]
  );

  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 30);
    } else {
      setQuery('');
      setActiveCategory('all');
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeCategory]);

  if (!isOpen) return null;

  const isBdgResolved = Array.isArray(resolvedSites) && resolvedSites.includes('BDG-DGO-P04');

  const handleSelectItem = (item) => {
    if (!item) return;
    if (item.actionType) {
      onExecuteAction?.(item);
      onClose();
      return;
    }
    if (item.viewMode && onChangeViewMode) {
      onChangeViewMode(item.viewMode);
    }
    if (item.tab && onNavigateTab) {
      onNavigateTab(item.tab);
    }
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
      return;
    }
    if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      handleSelectItem(results[selectedIndex]);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[85] flex items-start justify-center bg-slate-950/80 p-3 sm:p-6 pt-12 sm:pt-20 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="command-palette-title"
      onKeyDown={handleKeyDown}
    >
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] text-slate-900 dark:text-slate-100 shadow-2xl flex flex-col max-h-[82vh]">
        {/* Top Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 px-4 py-3.5 bg-slate-50/80 dark:bg-slate-900/80">
          <Search className="w-5 h-5 text-[#ED0226] shrink-0" />
          <div className="flex-1 min-w-0">
            <label htmlFor="command-palette-search" id="command-palette-title" className="sr-only">
              Pencarian Cepat Command Palette ImpactGrid
            </label>
            <input
              ref={inputRef}
              id="command-palette-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ketik ID Site BTS (BDG-DGO-P04, JKT-SEL-P01), BoQ, SAP, BA-RE, POJK 51, atau pertanyaan BoD..."
              className="w-full bg-transparent text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-1 rounded-lg"
            >
              Reset
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup Command Palette"
            className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-200/80 dark:border-slate-800 overflow-x-auto no-scrollbar bg-white dark:bg-[#0B1324]">
          {CATEGORY_TABS.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#ED0226] text-white'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Closed-Loop Status Strip */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200/60 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-[#ED0226] shrink-0" />
            <span>
              Status Closed-Loop Site <strong>BDG-DGO-P04</strong>:{' '}
              {isBdgResolved ? (
                <strong className="text-emerald-600 dark:text-emerald-400">
                  TERKALIBRASI FOP • BA-RE &amp; SAP S/4HANA Tersinkronisasi
                </strong>
              ) : (
                <strong className="text-amber-600 dark:text-amber-400">
                  ANOMALI +10.4% AKTIF • Siap Diselesaikan via FOP / Instant Loop
                </strong>
              )}
            </span>
          </div>
          <span className="font-mono text-[10px] text-slate-400">
            {results.length} hasil ditemukan
          </span>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/70 p-2">
          {results.length === 0 ? (
            <div className="py-12 px-4 text-center space-y-2">
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Tidak ditemukan hasil untuk &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-slate-500">
                Coba kata kunci seperti <code>BDG-DGO-P04</code>, <code>BoQ</code>, <code>SAP</code>, <code>112</code>, <code>TowerCo</code>, atau <code>POJK 51</code>.
              </p>
            </div>
          ) : (
            results.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onMouseEnter={() => setSelectedIndex(index)}
                  onClick={() => handleSelectItem(item)}
                  className={`w-full flex items-center justify-between gap-3 p-3 rounded-xl text-left transition cursor-pointer ${
                    isSelected
                      ? 'bg-red-50/90 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div
                      className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                        item.category === 'actions'
                          ? 'bg-red-100 text-[#ED0226] dark:bg-red-950/60 dark:text-red-400'
                          : item.category === 'sites'
                            ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300'
                            : item.category === 'bod'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                              : item.category === 'evidence'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {item.category === 'actions' && <Zap className="w-4 h-4" />}
                      {item.category === 'sites' && <Radio className="w-4 h-4" />}
                      {item.category === 'bod' && <HelpCircle className="w-4 h-4" />}
                      {item.category === 'evidence' && <ShieldCheck className="w-4 h-4" />}
                      {item.category === 'modules' && <Layers className="w-4 h-4" />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-400">
                            · {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 text-xs font-bold text-[#ED0226]">
                    <span className="hidden sm:inline text-[11px]">Buka</span>
                    <CornerDownLeft className="w-3.5 h-3.5" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer Hints */}
        <footer className="px-4 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span><strong className="font-mono text-slate-700 dark:text-slate-300">↑↓</strong> Navigasi</span>
            <span><strong className="font-mono text-slate-700 dark:text-slate-300">Enter</strong> Eksekusi</span>
            <span><strong className="font-mono text-slate-700 dark:text-slate-300">Esc</strong> Tutup</span>
          </div>
          <div className="font-mono text-[10px] text-slate-400">
            ImpactGrid Global Spotlight · 50 BTS Sites · 10 BoD Defenses · Closed-Loop Ready
          </div>
        </footer>
      </div>
    </div>
  );
}
