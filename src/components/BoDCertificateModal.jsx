import React, { useState } from 'react';
import { Award, CheckCircle2, X, Printer, ShieldCheck, Download, Sparkles, FileText, Lock, AlertTriangle, Key } from 'lucide-react';

export default function BoDCertificateModal({ isOpen, onClose }) {
  const [authorizationStep, setAuthorizationStep] = useState(0); // 0: Review, 1: Gate Evaluation, 2: Authorized
  const [authPasscode, setAuthPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [signOffLogs, setSignOffLogs] = useState([]);

  if (!isOpen) return null;

  const handleStartReview = () => {
    setAuthorizationStep(1);
    setAuthError('');
  };

  const handleAuthorizeDecree = () => {
    // Requires governance confirmation
    if (authPasscode.trim().toUpperCase() !== 'TELKOMSEL2027') {
      setAuthError('Kode otorisasi tata kelola salah. Gunakan TELKOMSEL2027 untuk validasi demo.');
      return;
    }

    setSignOffLogs([
      'Audit 4 Gates diverifikasi otomatis oleh Komite Transisi Jaringan...',
      'Gerbang 1-4 dinyatakan LULUS sesuai kriteria objektif naskah proposal.',
      'Otorisasi dewan disahkan untuk simulasi ekspansi regional Jamali.'
    ]);
    setAuthorizationStep(2);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full border-2 border-emerald-500/40 shadow-2xl flex flex-col overflow-hidden max-h-[92vh]">
        
        {/* Certificate Header Bar */}
        <div className="px-6 py-3.5 bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Award className="w-5 h-5 text-amber-300" />
            <span className="font-extrabold text-sm tracking-tight">Sertifikat Kelulusan Gerbang Keputusan Uji Coba Pilot (2027)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Printable Body */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-6 text-slate-800 bg-emerald-50/20">
          
          {/* Header Formal */}
          <div className="text-center space-y-1.5 border-b-2 border-emerald-600/30 pb-5">
            <div className="flex justify-center items-center gap-2 mb-2">
              <span className="text-lg font-black tracking-tight text-slate-900">
                PT TELEKOMUNIKASI SELULAR
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-[#ED0226] font-bold border border-red-200">
                TELKOMGROUP
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase">
              Surat Pengesahan Kelulusan Tahap Uji Coba (Pilot)
            </h2>
            <p className="text-xs text-slate-500 font-mono">
              Nomor: <strong>TSEL/BOD-CERT/2027/IMPACTGRID-GATE-01</strong> • Tanggal: <strong>30 September 2027</strong>
            </p>
          </div>

          {/* Statement */}
          <div className="text-xs leading-relaxed text-slate-700 space-y-2">
            <p>
              Berdasarkan hasil audit independen dan verifikasi kinerja 9 bulan program uji coba <strong>Telkomsel ImpactGrid</strong> pada <strong>40 Lokasi Intervensi</strong> dan <strong>10 Lokasi Pembanding</strong> di kluster Jawa-Bali (Jamali), Dewan Direksi PT Telekomunikasi Selular dengan ini mengesahkan bahwa seluruh <strong>4 Ambang Batas Kelanjutan (Gate Criteria)</strong> telah terpenuhi:
            </p>
          </div>

          {/* 4 Gates Verification Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-white border border-emerald-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400">Gerbang 1: Integritas Data</span>
                <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">LULUS (98,4%)</span>
              </div>
              <strong className="text-slate-900 block">Kelengkapan Telemetri &gt;= 95%</strong>
              <p className="text-[11px] text-slate-500">Rekonsiliasi AMR Smart Meter PLN dan telemetri O-RAN 15 menitan sinkron 98,4%.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-emerald-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400">Gerbang 2: Efisiensi Terkoreksi</span>
                <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">LULUS (+201.500 kWh)</span>
              </div>
              <strong className="text-slate-900 block">Efisiensi Energi Bersih DiD</strong>
              <p className="text-[11px] text-slate-500">Membuktikan reduksi 10,1% murni intervensi setelah isolasi cuaca & trafik (ITU-T L.1331).</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-emerald-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400">Gerbang 3: Finansial (NPV)</span>
                <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">LULUS (+Rp460 Jt)</span>
              </div>
              <strong className="text-slate-900 block">Net Present Value Positif 5 Tahun</strong>
              <p className="text-[11px] text-slate-500">Penghematan OpEx Rp240 Juta/tahun dengan Payback Period 1,9 tahun (WACC 10%).</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-emerald-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400">Gerbang 4: Mutu Layanan (QoS)</span>
                <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">LULUS (99,98%)</span>
              </div>
              <strong className="text-slate-900 block">SLA Availability &gt;= 99,95%</strong>
              <p className="text-[11px] text-slate-500">Fast-wakeup &lt;120ms aktif sempurna, zero penalti SLA, dan proteksi 100% kanal 112.</p>
            </div>
          </div>

          {/* Formal Ratification Decree or Pending Sign-off Box */}
          {authorizationStep === 2 ? (
            <div className="p-4 rounded-2xl bg-emerald-700 text-white space-y-1 text-center shadow-md animate-in fade-in duration-300">
              <div className="flex items-center justify-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-200 block">
                  KEPUTUSAN SIDANG DEWAN DIREKSI TELKOMSEL (TERVERIFIKASI & DISETUJUI):
                </span>
              </div>
              <div className="text-base font-black tracking-tight">
                DISETUJUI UNTUK EKSPANSI REGIONAL (5.000 MENARA BTS JAMALI 2028–2029)
              </div>
              <p className="text-[11px] text-emerald-100">
                Pemanfaatan mekanisme swadana <em>Self-Funding Reinvestment Pool</em> (50% OpEx savings) untuk membiayai CapEx Fase 2 tanpa membebani kas korporat baru.
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 space-y-2 text-center shadow-xs">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-900">
                <Lock className="w-4 h-4 text-amber-700" />
                <span>STATUS PROTOKOL TATA KELOLA: MENUNGGU EVALUASI & OTORISASI DEWAN DIREKSI</span>
              </div>
              <p className="text-[11px] text-amber-800 max-w-xl mx-auto">
                Sesuai prinsip GCG (*Good Corporate Governance*), keputusan ekspansi tahap 2 tidak dapat diterbitkan tanpa peninjauan langsung metrik 4 Gerbang Kelulusan oleh pemegang otorisasi.
              </p>
              
              {authorizationStep === 1 && (
                <div className="pt-2 max-w-md mx-auto space-y-2">
                  <div className="flex items-center gap-2">
                    <input 
                      type="password" 
                      placeholder="Masukkan kode otorisasi demo (TELKOMSEL2027)" 
                      value={authPasscode}
                      onChange={(e) => setAuthPasscode(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-xl border border-amber-300 bg-white text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      onClick={handleAuthorizeDecree}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer transition shrink-0"
                    >
                      Otorisasi
                    </button>
                  </div>
                  {authError && (
                    <span className="text-[10px] text-rose-600 font-bold block">{authError}</span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Signatures Grid */}
          <div className="pt-4 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Direktur Utama (CEO)</span>
              <div className={`h-10 flex items-center justify-center font-serif italic font-bold ${
                authorizationStep === 2 ? 'text-emerald-800' : 'text-slate-400 line-through'
              }`}>
                {authorizationStep === 2 ? 'Nugroho [Digital Sign]' : '[Menunggu Otorisasi]'}
              </div>
              <span className="text-[11px] font-bold text-slate-900 block">Nugroho</span>
              <span className="text-[9px] text-slate-400">PT Telkomsel</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Direktur Network (CTO)</span>
              <div className={`h-10 flex items-center justify-center font-serif italic font-bold ${
                authorizationStep === 2 ? 'text-emerald-800' : 'text-slate-400 line-through'
              }`}>
                {authorizationStep === 2 ? 'Indra M. [Digital Sign]' : '[Menunggu Otorisasi]'}
              </div>
              <span className="text-[11px] font-bold text-slate-900 block">Indra Mardiatna</span>
              <span className="text-[9px] text-slate-400">Network Director</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Direktur Keuangan (CFO)</span>
              <div className={`h-10 flex items-center justify-center font-serif italic font-bold ${
                authorizationStep === 2 ? 'text-emerald-800' : 'text-slate-400 line-through'
              }`}>
                {authorizationStep === 2 ? 'M. Ramzy [Digital Sign]' : '[Menunggu Otorisasi]'}
              </div>
              <span className="text-[11px] font-bold text-slate-900 block">Mohamad Ramzy</span>
              <span className="text-[9px] text-slate-400">Finance Director</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Head of Sustainability (ESG)</span>
              <div className={`h-10 flex items-center justify-center font-serif italic font-bold ${
                authorizationStep === 2 ? 'text-emerald-800' : 'text-slate-400 line-through'
              }`}>
                {authorizationStep === 2 ? 'Saki B. [Digital Sign]' : '[Menunggu Otorisasi]'}
              </div>
              <span className="text-[11px] font-bold text-slate-900 block">Saki Bramono</span>
              <span className="text-[9px] text-slate-400">VP Corporate Comm.</span>
            </div>
          </div>

          {/* Tamper Proof Seal Footer */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-[10px] text-slate-400 font-mono border-t border-slate-200 gap-2">
            <span>Cryptographic Merkle Hash: 8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d</span>
            <span>Verifikasi: ITU-T L.1331 & POJK 51/POJK.03/2017</span>
          </div>

        </div>

        {/* Modal Action Footer */}
        <div className="px-6 py-3 bg-white border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Status Otorisasi: <strong className={authorizationStep === 2 ? 'text-emerald-700' : 'text-amber-700'}>
              {authorizationStep === 2 ? 'EXECUTIVELY RATIFIED & SIGNED' : 'PENDING BoD GOVERNANCE REVIEW'}
            </strong>
          </span>
          <div className="flex items-center gap-2">
            {authorizationStep < 2 && (
              <button
                onClick={handleStartReview}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-xs"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Mulai Verifikasi BoD</span>
              </button>
            )}
            {authorizationStep === 2 && (
              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Sertifikat</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition"
            >
              Tutup
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
