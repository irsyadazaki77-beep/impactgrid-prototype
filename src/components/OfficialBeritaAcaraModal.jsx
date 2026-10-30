import React, { useState } from 'react';
import { 
  Printer, 
  X, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  Check, 
  Download, 
  QrCode, 
  AlertTriangle,
  Building2,
  Calendar,
  Fingerprint,
  Zap
} from 'lucide-react';
import { renderQrSvgString } from '../utils/qrCodeGenerator';

const BA_RE_METADATA = {
  docNumber: 'BA-RE/TSEL-NOPS/REG3/X/2026/0894',
  dateString: 'Jumat, 30 Oktober 2026',
  location: 'Gedung Wisma Telkomsel Gegerkalong, Jl. Gegerkalong Hilir No. 47, Bandung',
  sha256Digest: 'e8a1d59f32b8417c80ef749109403a558dc93e0b23f81643217bca89d1084b12',
  qrVerificationUrl: 'https://verify.telkomsel.co.id/audit/ba-re/2026/0894',
  cluster: 'Jawa Barat Urban & Suburban Cluster (Sample 50 Macro Sites)',
  period: 'Periode Siklus Billing: 01 Oktober 2026 s/d 30 Oktober 2026',
  legalBasis: [
    'Undang-Undang No. 30 Tahun 2009 tentang Ketenagalistrikan.',
    'Undang-Undang No. 1 Tahun 2024 (Perubahan Kedua UU ITE) tentang Keabsahan Dokumen dan Tanda Tangan Elektronik.',
    'Undang-Undang No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP).',
    'Peraturan Pemerintah No. 71 Tahun 2019 tentang Penyelenggaraan Sistem dan Transaksi Elektronik (Kedaulatan Data Domestik).',
    'Peraturan Otoritas Jasa Keuangan POJK 51/POJK.03/2017 tentang Penerapan Keuangan Berkelanjutan.',
    'Perjanjian Kerja Sama Induk (PKS) Pasokan Listrik Multiguna PT Telkomsel & PT PLN (Persero) No. PKS-482/TSEL/PLN/2024.'
  ]
};

const SAMPLE_RECON_DATA = [
  {
    siteId: 'JKT-SEL-P01',
    siteName: 'Kebayoran Baru Macro BTS',
    towerCo: 'Mitratel (Owned)',
    plnMeterKwh: 2966.4,
    rectifierDcKwh: 2556.0,
    ossRadioKwh: 2462.4,
    auxLossKwh: 410.4,
    variancePct: 1.2,
    phantomLossRp: 0,
    status: 'SEIMBANG (VALID)',
    notes: 'Deviasi dalam batas toleransi (<3.0%)'
  },
  {
    siteId: 'BDG-DGO-P04',
    siteName: 'Dago Atas Macro Hub',
    towerCo: 'Mitratel (Leased)',
    plnMeterKwh: 2772.0,
    rectifierDcKwh: 2174.4,
    ossRadioKwh: 2073.6,
    auxLossKwh: 597.6,
    variancePct: 10.4,
    phantomLossRp: 3824640,
    status: 'ANOMALI (DISPUTE)',
    notes: 'Kebocoran daya +10.4% (>8% threshold). Investigasi AC shelter & rectifier fan.'
  },
  {
    siteId: 'SBY-RKT-C02',
    siteName: 'Rungkut Industri (Control)',
    towerCo: 'Protelindo',
    plnMeterKwh: 3744.0,
    rectifierDcKwh: 3348.0,
    ossRadioKwh: 3225.6,
    auxLossKwh: 396.0,
    variancePct: 0.8,
    phantomLossRp: 0,
    status: 'SEIMBANG (VALID)',
    notes: 'Deviasi stabil, baseline kontrol operasional.'
  }
];

export default function OfficialBeritaAcaraModal({ isOpen, onClose }) {
  const [copiedText, setCopiedText] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [showFullHash, setShowFullHash] = useState(false);

  if (!isOpen) return null;

  const qrSvgString = renderQrSvgString(
    `TSEL-BARE-2026|DOC:${BA_RE_METADATA.docNumber}|HASH:${BA_RE_METADATA.sha256Digest}|DATE:20261030|STATUS:LEGALLY_SIGNED`,
    120
  );

  const handleCopyText = () => {
    const textContent = `BERITA ACARA REKONSILIASI KONSUMSI ENERGI (BA-RE)
Nomor: ${BA_RE_METADATA.docNumber}
Tanggal: ${BA_RE_METADATA.dateString}
Tempat: ${BA_RE_METADATA.location}

PIHAK-PIHAK YANG BERSEPAKAT:
1. Ir. Bambang Sugiarto, M.T. - VP Network Operations Jawa Barat PT Telekomunikasi Selular (Telkomsel)
2. Ir. H. Dedi Kurniawan, IPM - Senior Manager Niaga & Pelayanan Pelanggan PT PLN (Persero) UID Jawa Barat
3. Ir. Hendra Wicaksono - VP Operations & Maintenance PT Dayamitra Telekomunikasi Tbk (Mitratel)

POKOK KESEPAKATAN:
1. Rekonsiliasi Triangulasi 3-Arah (Meter PLN AMR, Submeter DC Rectifier Kelas 0.5s, dan O-RAN Radio Telemetry).
2. Temuan Anomali Phantom Power pada site BDG-DGO-P04 sebesar +10.4% (Discrepancy kerugian tak tertelusuri Rp 3.824.640,- per bulan).
3. Penerbitan Nota Kredit (Credit Note Adjustment) pengurangan beban tagihan berjalan sebesar nilai anomali terbukti.
4. Integritas data dijamin SHA-256 Ledger: ${BA_RE_METADATA.sha256Digest}

Ditandatangani secara elektronik sesuai UU No. 1 Tahun 2024 dan UU PDP No. 27 Tahun 2022.`;

    navigator.clipboard?.writeText(textContent);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handleDownloadJson = () => {
    const payload = {
      standard: 'TM Forum TMF628 Energy Reconciliation v4.1',
      document: BA_RE_METADATA,
      reconciliationSites: SAMPLE_RECON_DATA,
      summary: {
        totalSitesAudited: 50,
        balancedSites: 48,
        anomalousSites: 2,
        totalAdjustedCreditNoteRp: 7649280,
        energySavedKwhCluster: 14820.5
      },
      cryptography: {
        algorithm: 'SHA-256',
        hash: BA_RE_METADATA.sha256Digest,
        signedBy: [
          { role: 'TSEL_VP_NETWORK', name: 'Ir. Bambang Sugiarto, M.T.', nik: '8810429' },
          { role: 'PLN_UID_SR_MGR', name: 'Ir. H. Dedi Kurniawan, IPM', nip: '19780412' },
          { role: 'TOWERCO_VP_OPS', name: 'Ir. Hendra Wicaksono', id: 'MT-49210' }
        ]
      }
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BA-RE_TSEL_PLN_20261030_${BA_RE_METADATA.docNumber.replace(/[\/\\]/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/85 p-2 sm:p-4 print:p-0 print:bg-white backdrop-blur-xs">
      <div className="my-6 w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white text-slate-900 shadow-2xl print:my-0 print:rounded-none print:border-0 print:shadow-none print:max-w-none">
        
        {/* Sticky Control Action Header (Hidden in Print) */}
        <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-950 px-6 py-3.5 text-white print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#ED0226] text-white">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-extrabold tracking-tight">Berita Acara Rekonsiliasi Energi Resmi (BA-RE)</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-[10px] font-bold text-emerald-400">
                  Tanda Tangan Kriptografis Sah
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                No: {BA_RE_METADATA.docNumber} • Telkomsel &amp; PLN UID
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-slate-800 transition cursor-pointer"
            >
              {copiedText ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedText ? 'Tersalin' : 'Salin Teks Nota'}</span>
            </button>

            <button
              onClick={handleDownloadJson}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-slate-800 transition cursor-pointer"
            >
              {copiedJson ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Download className="h-3.5 w-3.5" />}
              <span>Audit JSON (TMF628)</span>
            </button>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#ED0226] hover:bg-red-700 px-4 py-1.5 text-xs font-bold text-white transition cursor-pointer shadow-md"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Cetak / Ekspor PDF A4</span>
            </button>

            <button
              onClick={onClose}
              aria-label="Tutup Berita Acara"
              className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition cursor-pointer ml-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Printable Official Document Body */}
        <article className="p-8 sm:p-12 print:p-8 space-y-6 text-xs text-slate-900 leading-relaxed font-serif print:space-y-4">
          
          {/* Official Dual Corporate Letterhead */}
          <div className="border-b-4 border-slate-950 pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-base font-black tracking-tighter text-[#ED0226] font-sans">
                    Telkomsel
                  </span>
                  <span className="text-xs font-bold text-slate-400 font-sans">|</span>
                  <span className="text-xs font-black tracking-tight text-slate-900 font-sans">
                    PT TELEKOMUNIKASI SELULAR
                  </span>
                </div>
                <p className="text-[10px] text-slate-600 font-sans">
                  Direktorat Network Operations • Regional Jawa Barat
                </p>
                <p className="text-[9px] text-slate-500 font-sans">
                  The Telkom Hub, Jl. Jend. Gatot Subroto Kav. 52, Jakarta Selatan / Gedung Graha Merah Putih, Bandung
                </p>
              </div>

              <div className="text-right space-y-1">
                <div className="text-xs font-black tracking-tight text-blue-900 font-sans">
                  PT PLN (PERSERO) UID JAWA BARAT
                </div>
                <p className="text-[10px] text-slate-600 font-sans">
                  Divisi Manajemen Niaga &amp; Pelanggan Korporat
                </p>
                <p className="text-[9px] text-slate-500 font-sans">
                  Jl. Asia Afrika No. 63, Braga, Kec. Sumur Bandung, Kota Bandung
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-300 text-center font-sans">
              <h1 className="text-base sm:text-lg font-black uppercase tracking-tight text-slate-950">
                BERITA ACARA REKONSILIASI KONSUMSI ENERGI &amp; DISPUTE PHANTOM POWER
              </h1>
              <p className="text-xs font-bold text-slate-700 tracking-wider mt-0.5">
                NOMOR: {BA_RE_METADATA.docNumber}
              </p>
            </div>
          </div>

          {/* Premise / Preamble */}
          <section className="space-y-2 text-justify">
            <p>
              Pada hari ini, <strong>{BA_RE_METADATA.dateString}</strong>, bertempat di <strong>{BA_RE_METADATA.location}</strong>, telah dilakukan rapat rekonsiliasi dan verifikasi teknis konsumsi energi listrik bersama antara <strong>PT Telekomunikasi Selular (Telkomsel)</strong> dengan <strong>PT PLN (Persero) Unit Induk Distribusi Jawa Barat</strong> dan disaksikan oleh <strong>PT Dayamitra Telekomunikasi Tbk (Mitratel)</strong>, dengan rincian perwakilan pejabat yang bertanda tangan di bawah ini:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/70 text-[11px] font-sans">
              <div>
                <strong className="block text-slate-900 font-black">PIHAK PERTAMA (TELKOMSEL):</strong>
                <div>Nama: <strong>Ir. Bambang Sugiarto, M.T.</strong></div>
                <div>NIK: 8810429</div>
                <div>Jabatan: VP Network Operations Jawa Barat PT Telekomunikasi Selular</div>
              </div>
              <div>
                <strong className="block text-slate-900 font-black">PIHAK KEDUA (PLN PERSERO):</strong>
                <div>Nama: <strong>Ir. H. Dedi Kurniawan, IPM</strong></div>
                <div>NIP: 19780412 200212 1 003</div>
                <div>Jabatan: Senior Manager Niaga &amp; Pelayanan Pelanggan PLN UID Jabar</div>
              </div>
            </div>

            <p>
              Selanjutnya secara bersama-sama disebut sebagai <strong>"PARA PIHAK"</strong>.
            </p>
          </section>

          {/* PASAL 1: DASAR HUKUM & METODOLOGI */}
          <section className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-950 font-sans border-b border-slate-300 pb-1 flex items-center justify-between">
              <span>PASAL 1 — DASAR HUKUM &amp; METODOLOGI REKONSILIASI 3-ARAH</span>
              <span className="text-[10px] text-slate-500 font-mono">ITU-T L.1331 / TM Forum TMF628</span>
            </h3>
            <p className="text-justify">
              1. Rekonsiliasi konsumsi energi ini dilaksanakan mengacu pada PKS Pasokan Tenaga Listrik Bersama, UU Ketenagalistrikan No. 30/2009, UU PDP No. 27/2022, dan Peraturan OJK POJK 51/POJK.03/2017 mengenai Kepatuhan Laporan Emisi Berkelanjutan (Scope 2 GHG).
            </p>
            <p className="text-justify">
              2. Metodologi yang digunakan adalah <strong>Triangulasi Telemetri Tiga Arah (3-Way Telemetry Triangulation)</strong> yang mencakup:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-[11px] font-sans text-slate-800">
              <li><strong>Aliran 1 (Input PLN AC):</strong> Data rekaman Automatic Meter Reading (AMR) kWh meter induk PLN Kelas 0.5s di gerbang shelter BTS.</li>
              <li><strong>Aliran 2 (Output DC Rectifier):</strong> Submetering digital arus searah (48V DC) bersertifikasi industri yang mengukur daya bersih masukan rak telekomunikasi.</li>
              <li><strong>Aliran 3 (Radio Load O-RAN/EMS):</strong> Telemetri utilisasi PRB dan daya transmit RF yang diekstrak langsung dari antarmuka O-RAN O1 Vendor Radio.</li>
            </ul>
          </section>

          {/* PASAL 2: TABEL AUDIT & TEMUAN ANOMALI */}
          <section className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-950 font-sans border-b border-slate-300 pb-1 flex items-center justify-between">
              <span>PASAL 2 — REKAPITULASI PENGUKURAN &amp; TEMUAN PHANTOM POWER</span>
              <span className="text-[10px] font-mono text-[#ED0226]">Sample Audit Kluster 50 Site</span>
            </h3>
            <p className="text-justify">
              Berdasarkan komparasi data telemetri real-time selama siklus penagihan Oktober 2026, PARA PIHAK mencatat hasil audit sampel berikut:
            </p>

            <div className="overflow-x-auto rounded-lg border border-slate-300 font-sans text-[11px]">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-800 text-[10px] font-black uppercase">
                  <tr>
                    <th className="p-2 border-b border-r border-slate-300">Site ID &amp; Nama</th>
                    <th className="p-2 border-b border-r border-slate-300">TowerCo</th>
                    <th className="p-2 border-b border-r border-slate-300 text-right">Meter PLN (AC)</th>
                    <th className="p-2 border-b border-r border-slate-300 text-right">DC Rectifier</th>
                    <th className="p-2 border-b border-r border-slate-300 text-right">O-RAN Load</th>
                    <th className="p-2 border-b border-r border-slate-300 text-right">Unaccounted</th>
                    <th className="p-2 border-b border-slate-300">Status Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {SAMPLE_RECON_DATA.map((s) => (
                    <tr key={s.siteId} className={s.variancePct > 3.0 ? 'bg-amber-50/70 font-semibold' : ''}>
                      <td className="p-2 border-r border-slate-200">
                        <span className="font-mono font-bold block">{s.siteId}</span>
                        <span className="text-[10px] text-slate-600">{s.siteName}</span>
                      </td>
                      <td className="p-2 border-r border-slate-200 text-slate-700">{s.towerCo}</td>
                      <td className="p-2 border-r border-slate-200 text-right font-mono">{s.plnMeterKwh.toFixed(1)} kWh</td>
                      <td className="p-2 border-r border-slate-200 text-right font-mono">{s.rectifierDcKwh.toFixed(1)} kWh</td>
                      <td className="p-2 border-r border-slate-200 text-right font-mono">{s.ossRadioKwh.toFixed(1)} kWh</td>
                      <td className="p-2 border-r border-slate-200 text-right font-mono">
                        <span className={s.variancePct > 3.0 ? 'text-red-600 font-bold' : 'text-emerald-700'}>
                          +{s.variancePct}%
                        </span>
                      </td>
                      <td className="p-2">
                        {s.variancePct > 3.0 ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-red-700 font-bold">
                            <AlertTriangle className="w-3 h-3 text-red-600" />
                            Dispute Anomali
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Sah Seimbang
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-2.5 rounded-lg border border-red-200 bg-red-50/70 text-[11px] font-sans text-red-950 space-y-1">
              <strong>Temuan Khusus Site BDG-DGO-P04:</strong> Ditemukan disparitas energi tak tertelusuri sebesar <strong>10,4%</strong> di atas batas toleransi teknis 3,0%. Analisis model termal membuktikan adanya penurunan COP (Coefficient of Performance) inverter pendingin shelter dan beban parasitik ilegal senilai <strong>Rp 3.824.640,-</strong>.
            </div>
          </section>

          {/* PASAL 3: KESEPAKATAN BILLING & PENYESUAIAN KREDIT */}
          <section className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-950 font-sans border-b border-slate-300 pb-1">
              PASAL 3 — KESEPAKATAN PENYESUAIAN TAGIHAN &amp; KLAUSUL HAK TAGIH
            </h3>
            <p className="text-justify">
              1. <strong>Penyesuaian Faktur PLN:</strong> Atas temuan selisih teknis pada site anomali yang telah diverifikasi log per jamnya, PT PLN (Persero) UID Jawa Barat menerbitkan <em>Credit Note Adjustment</em> yang diperhitungkan langsung sebagai pengurang pada invoice tagihan listrik Telkomsel bulan berikutnya.
            </p>
            <p className="text-justify">
              2. <strong>Tanggung Jawab Pemilik Menara (TowerCo):</strong> Sesuai Kontrak Sewa BTS Bersama Pasal 14 mengenai Kewajiban Fasilitas Pendingin, Mitratel berkewajiban melakukan servis kompresor AC shelter dalam waktu 3x24 jam kalender sejak terbitnya Berita Acara ini. Jika SLA terlampaui, denda pinalti sewa Rp 2.500.000,- dikenakan secara otomatis.
            </p>
          </section>

          {/* PASAL 4: KEABSAHAN HUKUM & INTEGRITAS KRIPTOGRAFIS */}
          <section className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-950 font-sans border-b border-slate-300 pb-1 flex items-center justify-between">
              <span>PASAL 4 — INTEGRITAS KRIPTOGRAFIS &amp; KEDAULATAN DATA (PP 71/2019)</span>
              <span className="text-[10px] text-emerald-700 font-mono">SHA-256 VERIFIED</span>
            </h3>
            <p className="text-justify">
              Dokumen ini mengikat secara hukum bagi PARA PIHAK. Seluruh data mentah telemetri disimpan pada penyimpanan on-premise <strong>Telkom Cloud Sentul &amp; Surabaya</strong> dengan yurisdiksi Republik Indonesia (PP No. 71/2019), bebas dari data pribadi pelanggan (UU PDP No. 27/2022), dan dienkripsi dengan SHA-256 Digest yang tidak dapat diubah (immutable ledger).
            </p>

            <div className="p-3 rounded-xl border border-slate-300 bg-slate-50 font-mono text-[10px] space-y-1">
              <div className="flex items-center justify-between text-slate-600 font-sans text-[11px] font-bold">
                <span>Cryptographic Digest Checksum (SHA-256):</span>
                <span className="text-emerald-700 flex items-center gap-1 font-mono text-[10px]">
                  <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED IMMUTABLE
                </span>
              </div>
              <div className="break-all font-bold text-slate-900 bg-white p-2 rounded border border-slate-200">
                {BA_RE_METADATA.sha256Digest}
              </div>
            </div>
          </section>

          {/* DUAL ELECTRONIC SIGNATURE & VERIFICATION QR CODE BLOCK */}
          <section className="pt-4 border-t-2 border-slate-900 font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end text-center">
              
              {/* Pihak Pertama Signature */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-600 uppercase block">PIHAK PERTAMA</span>
                <span className="text-xs font-black text-slate-950 block">PT TELEKOMUNIKASI SELULAR</span>
                <div className="my-2 py-3 px-2 rounded-xl border border-emerald-300 bg-emerald-50/50 text-[10px] space-y-1">
                  <div className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                    <CheckCircle2 className="w-3 h-3" /> Tanda Tangan Digital Tersertifikasi
                  </div>
                  <div className="font-mono text-[9px] text-slate-500">OIDC NIK: 8810429 • 2026-10-30 11:24 WIB</div>
                  <div className="text-[9px] font-bold text-slate-700">CAP RESMI TELKOMSEL NETWORK OPS</div>
                </div>
                <div>
                  <strong className="block text-xs font-black text-slate-900 underline">Ir. Bambang Sugiarto, M.T.</strong>
                  <span className="text-[10px] text-slate-600 block">VP Network Operations Jawa Barat</span>
                </div>
              </div>

              {/* QR Verification Center Box */}
              <div className="flex flex-col items-center justify-center p-3 rounded-2xl border border-slate-300 bg-slate-50/90 text-center space-y-2">
                <div 
                  className="w-24 h-24 bg-white p-1 rounded-lg border border-slate-200 shadow-xs flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: qrSvgString }}
                />
                <div className="space-y-0.5">
                  <span className="text-[9px] font-black uppercase text-slate-700 block tracking-wider">
                    E-Meterai &amp; Audit QR
                  </span>
                  <span className="text-[8px] font-mono text-slate-500 block">
                    ID: TSEL-BARE-2026-0894
                  </span>
                  <span className="text-[8px] text-emerald-700 font-bold block">
                    Pindai untuk Bukti Audit ISO 27001
                  </span>
                </div>
              </div>

              {/* Pihak Kedua Signature */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-600 uppercase block">PIHAK KEDUA</span>
                <span className="text-xs font-black text-slate-950 block">PT PLN (PERSERO) UID JABAR</span>
                <div className="my-2 py-3 px-2 rounded-xl border border-blue-300 bg-blue-50/50 text-[10px] space-y-1">
                  <div className="inline-flex items-center gap-1 text-blue-700 font-bold">
                    <CheckCircle2 className="w-3 h-3" /> Tanda Tangan Digital Tersertifikasi
                  </div>
                  <div className="font-mono text-[9px] text-slate-500">NIP: 197804122002121003 • 2026-10-30</div>
                  <div className="text-[9px] font-bold text-slate-700">CAP RESMI PLN UID JAWA BARAT</div>
                </div>
                <div>
                  <strong className="block text-xs font-black text-slate-900 underline">Ir. H. Dedi Kurniawan, IPM</strong>
                  <span className="text-[10px] text-slate-600 block">Senior Manager Niaga &amp; Pelayanan</span>
                </div>
              </div>

            </div>
          </section>

          {/* Footer Note */}
          <footer className="pt-4 border-t border-slate-200 text-center text-[9px] text-slate-500 font-sans">
            Dokumen Berita Acara Rekonsiliasi Energi ini sah dan mengikat PARA PIHAK serta diakui oleh Kantor Akuntan Publik (KAP) auditor independen untuk pelaporan keuangan triwulanan dan pemenuhan POJK 51/2017.
          </footer>

        </article>

      </div>
    </div>
  );
}
