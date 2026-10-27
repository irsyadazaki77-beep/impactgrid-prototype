import React, { useState } from 'react';
import { 
  FileSearch, 
  ShieldAlert, 
  X, 
  CheckCircle2, 
  Hash, 
  Database, 
  Calendar, 
  Filter, 
  FileCheck, 
  ArrowRight,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { computeSha256 } from '../utils/auditHashEngine';

const MOCK_AUDIT_EVIDENCES = [
  {
    id: "EVD-2027-001",
    category: "Energi & Meter",
    title: "Rekonsiliasi Meteran PLN vs Submeter Shelter (Batch 1)",
    timestamp: "2027-03-15 14:30 WIB",
    scope: "16 Sites Jabodetabek Macro",
    summary: "Verifikasi delta kWh harian pra-intervensi terkoreksi faktor cuaca CDD.",
    hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    verifiedBy: "Tim Finansial & Pengelola Energi Telkomsel",
    status: "Verified Integrity"
  },
  {
    id: "EVD-2027-002",
    category: "Mutu Layanan (QoS)",
    title: "Log Audit Ketersediaan & Panggilan Darurat 112",
    timestamp: "2027-04-02 09:15 WIB",
    scope: "40 Lokasi Uji Coba (Carrier Sleep Aktif)",
    summary: "Hasil evaluasi drop call rate 0,06% (ambang batas SLA < 0,20%); zero outage pada panggilan darurat.",
    hash: "a4f89d31e9c20183b2781a7d8329b31d0411a774b9e14a1c5847b2c91834f82a",
    verifiedBy: "Network Operations Center (NOC) Telkomsel",
    status: "Verified Integrity"
  },
  {
    id: "EVD-2027-003",
    category: "ESG & Emisi",
    title: "Perhitungan Emisi Terhindar Scope 2 (Standar ITU-T L.1331)",
    timestamp: "2027-05-20 16:45 WIB",
    scope: "Kluster Jawa-Bali (40 Uji + 10 Pembanding)",
    summary: "Metode Difference-in-Differences (DiD) mencatat penurunan teratribusi 88 MWh/th (~76,5 tCO2e).",
    hash: "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918",
    verifiedBy: "Divisi Corporate Sustainability / ESG Telkomsel",
    status: "Verified Integrity"
  }
];

export default function EvidenceExplorerModal({ isOpen, onClose }) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [verifyingId, setVerifyingId] = useState(null);
  const [verifiedMap, setVerifiedMap] = useState({});

  if (!isOpen) return null;

  const handleVerifyHash = async (evidence) => {
    setVerifyingId(evidence.id);
    const calculated = await computeSha256(evidence);
    setTimeout(() => {
      setVerifiedMap(prev => ({
        ...prev,
        [evidence.id]: { valid: true, timestamp: new Date().toLocaleTimeString('id-ID') }
      }));
      setVerifyingId(null);
    }, 400);
  };

  const filteredEvidences = selectedFilter === 'all' 
    ? MOCK_AUDIT_EVIDENCES 
    : MOCK_AUDIT_EVIDENCES.filter(e => e.category.toLowerCase().includes(selectedFilter.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="evidence-explorer-title">
      <div className="w-full max-w-3xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="flex items-start justify-between bg-slate-900 text-white p-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#ED0226] text-white">
                <FileSearch className="h-4 w-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-red-300">
                Evidence Explorer & Immutable Audit Ledger
              </span>
            </div>
            <h2 id="evidence-explorer-title" className="text-xl font-black text-white">
              Pusat Penelusuran Bukti & Verifikasi Audit Trail
            </h2>
            <p className="text-xs text-slate-300">
              Rancangan pencatatan bukti terdesentralisasi berdasar hash kriptografis SHA-256 untuk laporan keberlanjutan Telkomsel.
            </p>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            aria-label="Tutup" 
            className="rounded-xl p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Audit Notice */}
          <div className="flex items-start gap-3 rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/20 p-4 text-xs leading-relaxed text-amber-950 dark:text-amber-200">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <div>
              <strong>Integritas Bukti Audit:</strong> Hash SHA-256 membuktikan bahwa rekaman data tidak mengalami perubahan (*tamper-proof*). Namun, validitas angka sumber tetap wajib diaudit bersama auditor eksternal dan unit berwenang sebelum dipublikasikan.
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Kategori:</span>
              {['all', 'Energi', 'Mutu', 'ESG'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedFilter(cat)}
                  className={`px-3 py-1 rounded-xl font-bold transition cursor-pointer ${
                    selectedFilter === cat
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'all' ? 'Semua Bukti' : cat}
                </button>
              ))}
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              3 Entri Audit Terenkripsi
            </span>
          </div>

          {/* Evidence List */}
          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {filteredEvidences.map((item) => {
              const isVerified = verifiedMap[item.id]?.valid;
              return (
                <div 
                  key={item.id}
                  className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {item.id}
                      </span>
                      <span className="text-[10px] font-bold text-red-600 dark:text-red-400">
                        {item.category}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {item.timestamp}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-xs text-slate-900 dark:text-slate-100">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px]">
                    <div className="flex items-center gap-1.5 overflow-hidden font-mono text-slate-500">
                      <Hash className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[280px] sm:max-w-[400px]">
                        {item.hash}
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={verifyingId === item.id || isVerified}
                      onClick={() => handleVerifyHash(item)}
                      className={`px-3 py-1 rounded-lg font-bold text-[10px] flex items-center gap-1 transition cursor-pointer shrink-0 ${
                        isVerified
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400'
                          : 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900'
                      }`}
                    >
                      {isVerified ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Hash Valid</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3" />
                          <span>{verifyingId === item.id ? 'Memverifikasi...' : 'Verifikasi Integritas'}</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                    <span>Diverifikasi oleh: <strong className="text-slate-700 dark:text-slate-300">{item.verifiedBy}</strong></span>
                    <span>Cakupan: <strong className="text-slate-700 dark:text-slate-300">{item.scope}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}