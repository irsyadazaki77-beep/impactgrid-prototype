import React, { useState } from 'react';
import { 
  X, 
  Wrench, 
  CheckCircle2, 
  AlertTriangle, 
  QrCode, 
  Smartphone, 
  MapPin, 
  Wifi, 
  Camera, 
  Send, 
  Check, 
  ShieldCheck, 
  Clock, 
  Server, 
  Zap, 
  Thermometer, 
  Gauge, 
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { addStoredWorkOrder } from '../utils/storageEngine';

export default function FieldTechnicianConsoleModal({ isOpen, onClose, onResolveSiteAnomaly, onOpenOfficialBaRe, onOpenSapVoucher }) {
  const [currentStep, setCurrentStep] = useState(1); // 1: Check-in, 2: Diagnostic, 3: Action, 4: Verify & Close
  const [isQrScanned, setIsQrScanned] = useState(false);
  const [isBleConnected, setIsBleConnected] = useState(false);
  const [checklist, setChecklist] = useState({
    cleanFilter: false,
    refrigerantRefill: false,
    calibrateSubmeter: false,
    groundingTest: false
  });
  const [isClosingTicket, setIsClosingTicket] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen) return null;

  const allChecked = Object.values(checklist).every(Boolean);

  const handleScanQr = () => {
    setIsQrScanned(true);
  };

  const handleConnectBle = () => {
    setIsBleConnected(true);
  };

  const toggleChecklistItem = (key) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFinishWorkOrder = () => {
    setIsClosingTicket(true);
    setTimeout(() => {
      // Save resolution record to persistent storage
      addStoredWorkOrder({
        incidentNumber: 'INC-2026-TSEL-0492',
        siteId: 'BDG-DGO-P04',
        siteName: 'Dago Atas Macro Hub',
        anomalyType: 'Phantom Load Drift & AC Overheating',
        priority: 'P2 - Solved',
        assignmentGroup: 'Mitratel Regional Maintenance Team 04',
        technician: 'Ir. Andi Pratama (FOP ID: 8921-MT)',
        status: 'RESOLVED_CLOSED',
        closedAt: new Date().toISOString(),
        resolutionNotes: 'Kondensor AC dibersihkan, gas R-410A diisi 120 psi, smart submeter dikalibrasi ulang. Suhu shelter turun ke 23.8°C.'
      });

      if (onResolveSiteAnomaly) {
        onResolveSiteAnomaly('BDG-DGO-P04');
      }

      setIsClosingTicket(false);
      setIsCompleted(true);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/85 p-2 sm:p-4 backdrop-blur-xs animate-fade-in">
      <div className="my-6 w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] text-slate-900 shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Mobile Header Bar */}
        <header className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-5 py-3.5 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#ED0226] text-white">
              <Smartphone className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-black uppercase tracking-wider">Telkomsel FOP Mobile Console</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/50 text-[9px] font-bold text-emerald-400">
                  Online BLE / GPS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                WO: WO-2026-TSEL-MT-00492 • Mitratel Field Ops
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Tutup Konsol Teknisi"
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* Technician ID & GPS Status Strip */}
        <div className="bg-slate-100 dark:bg-slate-900 px-5 py-2 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">Teknisi:</span>
            <span>Ir. Andi Pratama (ID: FOP-8921-MT)</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-mono text-[10px]">
            <MapPin className="w-3 h-3 text-red-500" />
            <span>-6.882104, 107.618921 (Akurasi: 3m)</span>
          </div>
        </div>

        {/* Stepper Progress Bar */}
        <div className="px-5 pt-3 pb-2 bg-white dark:bg-[#0B1324] border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
            <button 
              onClick={() => setCurrentStep(1)}
              className={`flex items-center gap-1 cursor-pointer ${currentStep === 1 ? 'text-[#ED0226] font-black' : ''}`}
            >
              <span>1. Check-in QR</span>
            </button>
            <ArrowRight className="w-3 h-3 text-slate-300" />
            <button 
              onClick={() => setCurrentStep(2)}
              className={`flex items-center gap-1 cursor-pointer ${currentStep === 2 ? 'text-[#ED0226] font-black' : ''}`}
            >
              <span>2. Diagnostik BLE</span>
            </button>
            <ArrowRight className="w-3 h-3 text-slate-300" />
            <button 
              onClick={() => setCurrentStep(3)}
              className={`flex items-center gap-1 cursor-pointer ${currentStep === 3 ? 'text-[#ED0226] font-black' : ''}`}
            >
              <span>3. Servis Lapangan</span>
            </button>
            <ArrowRight className="w-3 h-3 text-slate-300" />
            <button 
              onClick={() => setCurrentStep(4)}
              className={`flex items-center gap-1 cursor-pointer ${currentStep === 4 ? 'text-[#ED0226] font-black' : ''}`}
            >
              <span>4. Verifikasi &amp; Selesai</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* STEP 1: CHECK-IN & GATE SCAN */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-red-600 block">
                  Target Intervensi Menara BTS:
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  BDG-DGO-P04 — Dago Atas Macro Hub
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Mitratel Shelter Site • Jl. Ir. H. Juanda No. 120, Dago, Coblong, Bandung
                </p>
                <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400 pt-1">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Anomali: Suhu Shelter 34.8°C &amp; Kebocoran Daya +10.4%</span>
                </div>
              </div>

              {/* QR Scanner Simulation Card */}
              <div className="p-5 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 dark:bg-red-950/40 text-[#ED0226] flex items-center justify-center">
                  <QrCode className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Pindai Pelat QR Gerbang Shelter
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Arahkan kamera ke barcode pelat identitas aset BTS untuk membuka kunci pintar Telkomsel SmartLock.
                  </p>
                </div>

                {isQrScanned ? (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Aset Terverifikasi: BTS-SHELTER-BDG-DGO-P04 (Pintu Terbuka)</span>
                  </div>
                ) : (
                  <button
                    onClick={handleScanQr}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#ED0226] hover:bg-red-700 text-white text-xs font-bold transition cursor-pointer shadow-xs"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Simulasikan Pindai QR Pelat Gerbang</span>
                  </button>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  disabled={!isQrScanned}
                  onClick={() => setCurrentStep(2)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold transition cursor-pointer disabled:opacity-40"
                >
                  <span>Lanjut ke Diagnostik BLE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: DIAGNOSTIC & BLE CLAMP METER */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Sinkronisasi Clamp Meter Digital (IoT)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Fluke 376 FC Bluetooth Smart Clamp Meter
                  </p>
                </div>
                {!isBleConnected ? (
                  <button
                    onClick={handleConnectBle}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer"
                  >
                    <Wifi className="w-3.5 h-3.5" />
                    <span>Pairing BLE</span>
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>BLE Terhubung (100% Signal)</span>
                  </span>
                )}
              </div>

              {/* Real-time Field Measurements */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/40 dark:bg-red-950/20 space-y-1">
                  <div className="flex items-center gap-1.5 text-red-700 dark:text-red-400 font-bold text-xs">
                    <Thermometer className="w-4 h-4" />
                    <span>Suhu Ruang Shelter:</span>
                  </div>
                  <div className="text-xl font-black text-red-600 dark:text-red-400 font-mono">
                    34.8°C
                  </div>
                  <span className="text-[9px] text-red-800 font-semibold block">
                    CRITICAL (Batas SLA: 32.0°C)
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold text-xs">
                    <Zap className="w-4 h-4" />
                    <span>Daya Input PLN (AC):</span>
                  </div>
                  <div className="text-xl font-black text-amber-600 dark:text-amber-400 font-mono">
                    3.85 kW
                  </div>
                  <span className="text-[9px] text-slate-500 block">
                    Phase R: 16.2A, S: 15.8A, T: 16.5A
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-1">
                  <div className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-400 font-bold text-xs">
                    <Server className="w-4 h-4" />
                    <span>Output Rectifier 48V:</span>
                  </div>
                  <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                    3.02 kW
                  </div>
                  <span className="text-[9px] text-slate-500 block">
                    Tegangan: 53.5V • Arus: 56.4A
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 space-y-1">
                  <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 font-bold text-xs">
                    <Gauge className="w-4 h-4" />
                    <span>Phantom Load Loss:</span>
                  </div>
                  <div className="text-xl font-black text-rose-600 dark:text-rose-400 font-mono">
                    +10.4%
                  </div>
                  <span className="text-[9px] text-rose-700 font-semibold block">
                    Kerugian: Rp 3.824.640,-/bln
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300 space-y-1">
                <strong>Analisis Diagnostik Otomatis:</strong> Kompresor inverter unit pendingin AC Shelter mengalami penurunan efisiensi (COP rendah) akibat filter kondensor tersumbat debu jalan raya dan tekanan freon turun ke 75 psi.
              </div>

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold transition cursor-pointer"
                >
                  Kembali
                </button>
                <button
                  disabled={!isBleConnected}
                  onClick={() => setCurrentStep(3)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold transition cursor-pointer disabled:opacity-40"
                >
                  <span>Lanjut ke Tindakan Servis</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ACTION CHECKLIST */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Checklist Tindakan Pemeliharaan Shelter (SOP Telkomsel / Mitratel)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Centang seluruh pekerjaan lapangan setelah dilaksanakan secara fisik:
                </p>
              </div>

              <div className="space-y-2">
                {[
                  {
                    key: 'cleanFilter',
                    title: '1. Pembersihan Sirip Kondensor & Filter Udara AC',
                    detail: 'Membersihkan kotoran sirip evaporator outdoor unit menggunakan cairan pembersih koil bertekanan.'
                  },
                  {
                    key: 'refrigerantRefill',
                    title: '2. Pengisian Ulang Refrigeran R-410A (120 psi)',
                    detail: 'Memeriksa kebocoran nepel pipa tembaga dan mengisi gas freon hingga tekanan hisap stabil 120 psi.'
                  },
                  {
                    key: 'calibrateSubmeter',
                    title: '3. Kalibrasi Ulang Submeter Kelas 0.5s',
                    detail: 'Menguji presisi CT (Current Transformer) submeter digital DC rectifier terhadap beban radio riil.'
                  },
                  {
                    key: 'groundingTest',
                    title: '4. Pengujian Tahanan Grounding Shelter (< 1.0 Ohm)',
                    detail: 'Mengukur elektroda tembaga penangkal petir shelter BTS. Hasil pengukuran aktual: 0.76 Ohm (PASS).'
                  }
                ].map(item => (
                  <label
                    key={item.key}
                    onClick={() => toggleChecklistItem(item.key)}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border transition cursor-pointer ${
                      checklist[item.key]
                        ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checklist[item.key]}
                      onChange={() => {}} // Handled by label click
                      className="mt-0.5 h-4 w-4 shrink-0 rounded text-[#ED0226] focus:ring-red-500 accent-[#ED0226]"
                    />
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        {item.title}
                      </span>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {item.detail}
                      </p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold transition cursor-pointer"
                >
                  Kembali
                </button>
                <button
                  disabled={!allChecked}
                  onClick={() => setCurrentStep(4)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold transition cursor-pointer disabled:opacity-40"
                >
                  <span>Lanjut ke Verifikasi Hasil</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: POST-SERVICE VERIFICATION & TICKET CLOSURE */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-2xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verifikasi Telemetri Pasca Pemeliharaan (Fluke + AMR)</span>
                </div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Kondisi Shelter Dago Atas Berhasil Dipulihkan!
                </h3>
              </div>

              {/* Before vs After Comparison */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Kondisi Awal (Pre-Service):</span>
                  <div className="text-rose-600 font-bold font-mono">Suhu: 34.8°C (Panas)</div>
                  <div className="text-amber-600 font-bold font-mono">Input Listrik: 3.85 kW</div>
                  <div className="text-red-600 font-bold font-mono">Kebocoran: +10.4% (Dispute)</div>
                </div>

                <div className="p-3 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-emerald-600 block">Kondisi Pasca-Servis (Post-Service):</span>
                  <div className="text-emerald-600 font-bold font-mono">Suhu: 23.8°C (Optimal)</div>
                  <div className="text-emerald-600 font-bold font-mono">Input Listrik: 3.12 kW (-19%)</div>
                  <div className="text-emerald-600 font-bold font-mono">Discrepancy: +0.7% (Klop)</div>
                </div>
              </div>

              {/* Audit Sign-off Box */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Penutupan Tiket ITSM ServiceNow (INC-2026-TSEL-0492)
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    SLA: Diselesaikan dalam 2 jam 14 menit
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Menutup tiket insiden resmi, menghapus penalti pemotongan sewa Mitratel, dan mengembalikan status site <code>BDG-DGO-P04</code> di Digital Twin menjadi normal hijau.
                </p>
              </div>

              {isCompleted ? (
                <div className="p-4 rounded-xl bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 text-center space-y-2.5">
                  <div className="inline-flex items-center justify-center p-2 rounded-full bg-emerald-500 text-white">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-xs font-black text-emerald-900 dark:text-emerald-200 uppercase tracking-wider">
                    Work Order Sukses Diselesaikan &amp; Closed-Loop Aktif!
                  </h4>
                  <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                    Tiket ServiceNow INC-2026-TSEL-0492 ditutup (RESOLVED_COMPLETED). Rekonsiliasi Berita Acara (BA-RE) dan Jurnal SAP S/4HANA otomatis diperbarui dengan Nota Kredit Rp 3.824.640.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    {onOpenOfficialBaRe && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenOfficialBaRe();
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
                      >
                        Lihat Update Berita Acara (BA-RE)
                      </button>
                    )}
                    {onOpenSapVoucher && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenSapVoucher();
                        }}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition cursor-pointer"
                      >
                        Lihat Posting Jurnal SAP S/4HANA
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition cursor-pointer"
                    >
                      Tutup Konsol FOP
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between pt-2">
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold transition cursor-pointer"
                  >
                    Kembali
                  </button>
                  <button
                    disabled={isClosingTicket}
                    onClick={handleFinishWorkOrder}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ED0226] hover:bg-red-700 text-white text-xs font-bold transition cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {isClosingTicket ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span>{isClosingTicket ? 'Menutup Tiket...' : 'Selesaikan WO & Tutup Tiket ServiceNow'}</span>
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
