import React, { useState, useMemo } from 'react';
import { QrCode, X, Copy, Check, Smartphone, Sparkles } from 'lucide-react';
import { renderQrSvgString } from '../utils/qrCodeGenerator';

export default function QrShareModal({ isOpen, onClose }) {
  const defaultUrl = useMemo(() => {
    if (typeof window !== 'undefined' && window.location.origin) {
      return window.location.origin;
    }
    return 'https://impactgrid-demo.telkomsel.com';
  }, []);

  const [shareUrl, setShareUrl] = useState(defaultUrl);
  const [copied, setCopied] = useState(false);

  const qrSvg = useMemo(() => {
    return renderQrSvgString(shareUrl || defaultUrl, 220);
  }, [shareUrl, defaultUrl]);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback if clipboard API not available
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/80 p-3 sm:p-4 animate-fade-in">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] text-slate-900 dark:text-slate-100 shadow-2xl space-y-5 p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#ED0226] border border-red-200 dark:border-red-900/50">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight text-slate-950 dark:text-white">
                ImpactGrid Mobile Ops • Field Engineer & Management Portal
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Akses konsol supervisi real-time di smartphone/tablet untuk pengawasan lapangan & pimpinan Telkomsel
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Tutup"
            className="rounded-xl p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
          <div 
            className="p-3 bg-white rounded-2xl shadow-md border border-slate-200/80 flex items-center justify-center"
            dangerouslySetInnerHTML={{ __html: qrSvg }}
          />

          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-[#ED0226]" />
            <span>Arahkan kamera smartphone untuk membuka langsung</span>
          </span>
        </div>

        {/* URL Input & Copy Bar */}
        <div className="space-y-1.5 text-xs">
          <label className="font-extrabold text-slate-700 dark:text-slate-300 block">
            Tautan Akses Web Prototipe:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={shareUrl}
              onChange={(e) => setShareUrl(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 font-mono focus:ring-2 focus:ring-red-500/30 focus:outline-hidden"
              placeholder="https://..."
            />
            <button
              onClick={handleCopy}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shrink-0 shadow-2xs ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Salin'}</span>
            </button>
          </div>
        </div>

        {/* Presentation & Mobile Tips */}
        <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-[11px] space-y-1.5 text-amber-900 dark:text-amber-200">
          <div className="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Fitur Konsol Supervisi Mobile Telkomsel Field Ops:</span>
          </div>
          <ul className="list-disc pl-4 space-y-0.5 text-slate-600 dark:text-slate-400">
            <li><strong>Responsive Field Interface:</strong> Navigasi drawer cepat, kartu telemetri adaptif, dan peta sebaran BTS.</li>
            <li><strong>Edge Offline Architecture:</strong> Tetap beroperasi optimal di site remote 3T berkat model pemrosesan lokal mandiri.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
