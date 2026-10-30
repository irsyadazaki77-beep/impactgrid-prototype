import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  Wrench, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Play, 
  RotateCcw, 
  ShieldAlert, 
  Flame, 
  BatteryCharging, 
  Wind, 
  FileText, 
  Download, 
  Check, 
  User, 
  MapPin, 
  Phone, 
  Terminal, 
  RefreshCw,
  Sliders,
  Radio,
  ArrowRight,
  Printer,
  X,
  ShieldCheck,
  Building2
} from 'lucide-react';

export default function NocOperationsRunbookCenter() {
  const [activeSubTab, setActiveSubTab] = useState('work_orders'); // 'work_orders' | 'runbooks' | 'asset_health' | 'shift_handover'
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // --- SUB-TAB 1: WORK ORDERS STATE ---
  const [workOrders, setWorkOrders] = useState([
    {
      id: 'WO-TSEL-JBR-2026-0881',
      siteId: 'BDG-DGO-P04',
      siteName: 'Bandung Dago - Urban Macro 4G/5G',
      anomalyType: 'Phantom Load Drift (+14.2% DC-AC Discrepancy)',
      priority: 'P2 - Mayor',
      priorityColor: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300',
      status: 'On-Site',
      statusColor: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300',
      technician: 'Agus Setiawan',
      technicianPhone: '+62 811-2200-911',
      vendorTeam: 'Mitratel Regional Maintenance Team 04',
      slaMinutesLeft: 154,
      checklist: [
        { text: 'Verifikasi segel kwh meter PLN & kesesuaian trafo kVA', completed: true },
        { text: 'Ukur rugi-rugi kabel busbar DC -48V dengan clamp meter', completed: true },
        { text: 'Kalibrasi submetering IoT Class 0.5s di output rectifier', completed: false },
        { text: 'Foto dokumentasi fisik & update berita acara di SOM Telkomsel', completed: false }
      ]
    },
    {
      id: 'WO-TSEL-JKT-2026-0914',
      siteId: 'JKT-SEL-P01',
      siteName: 'Jakarta Selatan - Dense Urban 5G Massive MIMO',
      anomalyType: 'Rectifier Phase Imbalance & THD Drift (> 4.5%)',
      priority: 'P1 - Kritis',
      priorityColor: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300',
      status: 'Dispatched',
      statusColor: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300',
      technician: 'Rian Pratama',
      technicianPhone: '+62 812-9911-344',
      vendorTeam: 'Telkomsel In-House FOP Metro Jakarta',
      slaMinutesLeft: 228,
      checklist: [
        { text: 'Periksa tegangan masuk 3-fase PLN pada panel AC distribution', completed: true },
        { text: 'Uji swap module rectifier cadangan 50A slot #3', completed: false },
        { text: 'Verifikasi pembagian beban (load sharing) rectifier paralel', completed: false },
        { text: 'Sinkronisasi telemetri rectifier ke gateway O-RAN O1', completed: false }
      ]
    },
    {
      id: 'WO-TSEL-SBY-2026-0742',
      siteId: 'SBY-GUB-P02',
      siteName: 'Surabaya Gubeng - Transit Hub High Throughput',
      anomalyType: 'Shelter Heat Dissipation Risk (Filter AC Mampet, 32.8°C)',
      priority: 'P1 - Kritis',
      priorityColor: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300',
      status: 'Pending Parts',
      statusColor: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300',
      technician: 'Dedi Kurniawan',
      technicianPhone: '+62 813-3321-778',
      vendorTeam: 'Protelindo HVAC Regional East Specialist',
      slaMinutesLeft: 78,
      checklist: [
        { text: 'Inspeksi fisik indoor & outdoor unit AC Inverter', completed: true },
        { text: 'Ganti filter udara G4 yang tersumbat debu jalan raya', completed: false },
        { text: 'Pengukuran tekanan gas refrigeran R32 & ampere kompresor', completed: false },
        { text: 'Uji fungsi ventilasi darurat free-cooling damper otomatis', completed: false }
      ]
    },
    {
      id: 'WO-TSEL-MED-2026-0610',
      siteId: 'MED-POL-P05',
      siteName: 'Medan Polonia - Urban Hybrid Macro',
      anomalyType: 'BESS Battery Cell #2 High Internal Resistance',
      priority: 'P3 - Sedang',
      priorityColor: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300',
      status: 'Resolved',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300',
      technician: 'Faisal Siregar',
      technicianPhone: '+62 811-6600-412',
      vendorTeam: 'Telkomsel Energy & Power Maintenance Sumatera',
      slaMinutesLeft: 0,
      checklist: [
        { text: 'Bypass modul cell baterai LiFePO4 yang terdegradasi', completed: true },
        { text: 'Uji float charging & penyeimbangan tegangan string (BMS)', completed: true },
        { text: 'Verifikasi kapasitas otonom daya cadangan 4 jam', completed: true },
        { text: 'Laporan penutupan tiket ke NOC Manager on Duty', completed: true }
      ]
    }
  ]);

  const [selectedWoId, setSelectedWoId] = useState('WO-TSEL-JBR-2026-0881');
  const activeWo = workOrders.find(w => w.id === selectedWoId) || workOrders[0];

  const toggleChecklist = (woId, idx) => {
    setWorkOrders(prev => prev.map(wo => {
      if (wo.id !== woId) return wo;
      const updatedChecklist = [...wo.checklist];
      updatedChecklist[idx] = { ...updatedChecklist[idx], completed: !updatedChecklist[idx].completed };
      const allDone = updatedChecklist.every(c => c.completed);
      return { 
        ...wo, 
        checklist: updatedChecklist,
        status: allDone ? 'Resolved' : wo.status === 'Resolved' ? 'On-Site' : wo.status,
        statusColor: allDone ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300' :
                     wo.status === 'Resolved' ? 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300' : wo.statusColor
      };
    }));
  };

  const updateWoStatus = (woId, newStatus) => {
    setWorkOrders(prev => prev.map(wo => {
      if (wo.id !== woId) return wo;
      return {
        ...wo,
        status: newStatus,
        statusColor: newStatus === 'Resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                     newStatus === 'On-Site' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                     newStatus === 'Pending Parts' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                     'bg-amber-50 text-amber-700 border-amber-200'
      };
    }));
  };

  // --- SUB-TAB 2: RUNBOOKS STATE ---
  const [selectedRunbook, setSelectedRunbook] = useState('SOP-01');
  const [runbookExecuting, setRunbookExecuting] = useState(false);
  const [runbookLogs, setRunbookLogs] = useState([]);

  const RUNBOOKS = [
    {
      id: 'SOP-01',
      title: 'SOP-01: Auto-Rollback Recovery (Lonjakan Trafik PRB > 70%)',
      category: 'QoS & SLA Guardrail',
      slaTrigger: 'PRB Utilisasi > 70% atau Call Drop Rate > 0.8%',
      latencyGoal: '< 28 ms (Zero-Touch)',
      steps: [
        'Deteksi anomali kongesti radio dari stream telemetri 3GPP PM counter.',
        'Kirim sinyal revert A1-Policy ke Near-RT RIC untuk membatalkan carrier sleep.',
        'Bangunkan carrier kapasitas 1800/2100/2300 MHz pada daya penuh (TRX 40W).',
        'Validasi degradasi throughput pulih ke target minimum p10 >= -2%.'
      ]
    },
    {
      id: 'SOP-02',
      title: 'SOP-02: Transisi Blackout PLN ke BESS & Auto-Genset (AMF)',
      category: 'Power & Grid Emergency',
      slaTrigger: 'Tegangan AC PLN Hilang (0 VAC)',
      latencyGoal: '< 10 ms (Inverter Bus)',
      steps: [
        'Deteksi pemadaman PLN melalui sensor tegangan smart meter AMR.',
        'Lepas beban non-esensial kompresor AC kabinet untuk menghemat energi.',
        'Alihkan pasokan daya sepenuhnya ke string BESS LiFePO4 (-48.2 VDC).',
        'Kirim sinyal start otomatis (AMF) ke genset diesel cadangan bila durasi > 45 menit.'
      ]
    },
    {
      id: 'SOP-03',
      title: 'SOP-03: Mitigasi Cuaca Panas Ekstrem (Ambient > 35°C)',
      category: 'Thermodynamics & Cooling',
      slaTrigger: 'Suhu Luar > 35.0°C & Suhu Kabinet > 29.0°C',
      latencyGoal: '< 60 detik (Inverter Modulation)',
      steps: [
        'Model PINN mendeteksi laju akumulasi panas melebihi kapasitas pasif kabinet.',
        'Modulasi kompresor inverter pendingin ke putaran tertinggi (COP 4.1).',
        'Turunkan daya pancar radio RF sebesar -1.5 dB pada carrier sekunder.',
        'Kunci suhu ruang kabinet di bawah ambang batas kritis 28.0°C.'
      ]
    },
    {
      id: 'SOP-04',
      title: 'SOP-04: Prioritas Panggilan Darurat 112 / BNPB Disaster Bypass',
      category: 'Civil Defense & Safety',
      slaTrigger: 'Sinyal Tanggap Darurat / Gempa Bumi / Banjir dari BPBD',
      latencyGoal: 'Seketika (Instant Override)',
      steps: [
        'Tangkap geofence koordinat radius 5 km dari titik bencana alam.',
        'Batalkan seluruh kebijakan hemat energi di semua sektor menara terdampak.',
        'Maksimalkan jangkauan radio 900 MHz untuk penetrasi sinyal evakuasi.',
        'Kunci operasional penuh tanpa interupsi hingga status tanggap darurat dicabut.'
      ]
    }
  ];

  const currentRunbook = RUNBOOKS.find(r => r.id === selectedRunbook) || RUNBOOKS[0];

  const executeRunbook = () => {
    setRunbookExecuting(true);
    setRunbookLogs([]);
    const timestamp = new Date().toLocaleTimeString('id-ID');
    
    setTimeout(() => {
      setRunbookLogs(prev => [...prev, `[${timestamp}] [INIT] Menginisiasi protokol ${currentRunbook.id}...`]);
    }, 200);

    setTimeout(() => {
      setRunbookLogs(prev => [...prev, `[${timestamp}] [STEP 1] Validasi parameter pemicu: ${currentRunbook.slaTrigger}`]);
    }, 600);

    setTimeout(() => {
      setRunbookLogs(prev => [...prev, `[${timestamp}] [STEP 2] Mengirim perintah eksekusi ke O-RAN Near-RT RIC (Target Latensi: ${currentRunbook.latencyGoal})`]);
    }, 1100);

    setTimeout(() => {
      setRunbookLogs(prev => [...prev, `[${timestamp}] [STEP 3] Parameter terverifikasi: Seluruh sektor berhasil kembali ke kondisi aman.`]);
    }, 1600);

    setTimeout(() => {
      setRunbookLogs(prev => [...prev, `[${timestamp}] [SUCCESS] Protokol ${currentRunbook.id} berhasil dieksekusi tanpa gangguan SLA layanan.`]);
      setRunbookExecuting(false);
    }, 2100);
  };

  // --- SUB-TAB 4: SHIFT HANDOVER STATE ---
  const [shiftNumber, setShiftNumber] = useState('1'); // '1' (Pagi), '2' (Siang), '3' (Malam)
  const [shiftNotes, setShiftNotes] = useState(
    'Kondisi jaringan aman. Total 36 dari 40 site pilot berhasil menjalankan carrier sleep optimal. ' +
    'Site BDG-DGO-P04 sedang dalam penanganan teknisi FOP Mitratel untuk kalibrasi submeter. ' +
    'Tidak ada eskalasi tiket P1 ke pimpinan. Seluruh parameter SLA terjaga pada 99.994% availability.'
  );
  const [leadName, setLeadName] = useState('Ir. Bambang Hariyanto');
  const [leadNik, setLeadNik] = useState('8810429');
  const [isHandoverSigned, setIsHandoverSigned] = useState(false);

  const downloadShiftReport = () => {
    const shiftLabel = shiftNumber === '1' ? 'Shift Pagi (07:00 - 15:00 WIB)' :
                       shiftNumber === '2' ? 'Shift Siang (15:00 - 23:00 WIB)' : 'Shift Malam (23:00 - 07:00 WIB)';
    const content = `===============================================================
BERITA ACARA SERAH TERIMA PIKET NETWORK OPERATIONS CENTER (NOC)
PT TELEKOMUNIKASI SELULAR (TELKOMSEL) - REGIONAL JAMALI
===============================================================
Waktu Pelaporan   : ${new Date().toLocaleString('id-ID')}
Shift Kerja       : ${shiftLabel}
Penanggung Jawab  : ${leadName} (NIK: ${leadNik})
Status Tanda Tangan: ${isHandoverSigned ? 'DISAHKAN DIGITAL' : 'DRAF OPERATOR'}

RINGKASAN METRIK OPERASIONAL SHIFT:
- Total Energi Dihemat     : 248.6 kWh (Rp 372.900)
- Reduksi Emisi Scope 2    : 216.3 kgCO2e
- Carrier Sleep Active     : 36 / 40 Site Pilot
- SLA Radio Availability   : 99.994%
- Tiket Insiden Tertangani : 3 Selesai, 1 Dalam Proses Lapangan

CATATAN RESMI HANDOVER:
${shiftNotes}

DAFTAR TIKET DALAM PROSES:
1. WO-TSEL-JBR-2026-0881 (BDG-DGO-P04) - On-Site Mitratel (Teknisi: Agus Setiawan)
2. WO-TSEL-SBY-2026-0742 (SBY-GUB-P02) - Pending Filter AC (Teknisi: Dedi Kurniawan)
===============================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `berita_acara_shift_noc_${Date.now()}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Executive Operational Header */}
      <header className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-6 md:p-8 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-xs font-bold text-[#ED0226] dark:text-red-400">
              <Wrench className="h-4 w-4" />
              <span>NOC FIELD OPERATIONS & RUNBOOK AUTOMATION CENTER</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Pusat Operasional Lapangan & Otomasi Runbook Telkomsel
            </h2>
            <p className="max-w-4xl text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Modul kerja harian bagi tim Network Operations Center (NOC), Field Operations (FOP Telkomsel & Mitratel), serta teknisi fasilitas menara BTS. Mengintegrasikan disposisi tiket e-Work Order, eksekusi runbook darurat 1-klik, prediksi degradasi baterai/pendingin, dan logbook serah terima piket 3-shift.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/70 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Tiket FOP Aktif</div>
              <div className="text-xl font-black text-slate-900 dark:text-white">3 / 4 Ditangani</div>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">SLA Recovery</div>
              <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">&lt; 28 ms</div>
            </div>
          </div>
        </div>

        {/* Sub-Tabs Navigation */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
          <button
            onClick={() => setActiveSubTab('work_orders')}
            className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeSubTab === 'work_orders'
                ? 'bg-[#ED0226] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>1. Disposisi Tiket e-Work Order Lapangan ({workOrders.filter(w => w.status !== 'Resolved').length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('runbooks')}
            className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeSubTab === 'runbooks'
                ? 'bg-[#ED0226] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>2. Interactive Emergency Runbooks (SOP 01–04)</span>
          </button>
          <button
            onClick={() => setActiveSubTab('asset_health')}
            className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeSubTab === 'asset_health'
                ? 'bg-[#ED0226] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <BatteryCharging className="w-3.5 h-3.5" />
            <span>3. Kartu Kesehatan Aset & Prediksi Kegagalan</span>
          </button>
          <button
            onClick={() => setActiveSubTab('shift_handover')}
            className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeSubTab === 'shift_handover'
                ? 'bg-[#ED0226] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>4. Berita Acara & Shift Handover NOC</span>
          </button>
        </div>
      </header>

      {/* SUB-TAB 1: E-WORK ORDER & FIELD DISPATCH HUB */}
      {activeSubTab === 'work_orders' && (
        <section className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Left: Work Order List */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Daftar Tiket Gangguan Lapangan
                </h2>
                <span className="text-[11px] text-slate-500 font-mono">
                  Total: {workOrders.length} Tiket
                </span>
              </div>

              <div className="space-y-2.5">
                {workOrders.map((wo) => {
                  const isSelected = selectedWoId === wo.id;
                  return (
                    <div
                      key={wo.id}
                      onClick={() => setSelectedWoId(wo.id)}
                      className={`p-4 rounded-xl border transition cursor-pointer space-y-2 ${
                        isSelected
                          ? 'bg-white dark:bg-[#0B1324] border-[#ED0226] ring-2 ring-red-500/10 shadow-xs'
                          : 'bg-slate-50/70 hover:bg-white dark:bg-slate-800/40 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-black text-slate-900 dark:text-white">
                          {wo.id}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${wo.priorityColor}`}>
                            {wo.priority}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${wo.statusColor}`}>
                            {wo.status}
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#ED0226]" />
                          <span>{wo.siteId}</span>
                          <span className="text-slate-400 font-normal hidden sm:inline">- {wo.siteName.split(' - ')[0]}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                          {wo.anomalyType}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
                        <span>Teknisi: <strong className="text-slate-700 dark:text-slate-300">{wo.technician}</strong></span>
                        <span className="flex items-center gap-1 text-red-600 font-bold">
                          <Clock className="w-3 h-3" />
                          <span>{wo.slaMinutesLeft > 0 ? `${Math.floor(wo.slaMinutesLeft / 60)}j ${wo.slaMinutesLeft % 60}m sisa` : 'SLA Selesai'}</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Detailed Work Order Detail & SOP Checklist */}
            <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-slate-400">DETAIL TIKET:</span>
                    <span className="font-mono text-sm font-black text-slate-900 dark:text-white">{activeWo.id}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                    {activeWo.siteName}
                  </h3>
                </div>

                {/* Status Switcher Action */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Status:</span>
                  <select
                    value={activeWo.status}
                    onChange={(e) => updateWoStatus(activeWo.id, e.target.value)}
                    className="text-xs font-bold rounded-lg px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer"
                  >
                    <option value="Dispatched">Dispatched</option>
                    <option value="On-Site">On-Site</option>
                    <option value="Pending Parts">Pending Parts</option>
                    <option value="Resolved">Resolved (Selesai)</option>
                  </select>
                </div>
              </div>

              {/* Technician Info & Vendor Card */}
              <div className="grid gap-3 sm:grid-cols-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Petugas Lapangan (FOP):</span>
                  <strong className="text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#ED0226]" />
                    {activeWo.technician}
                  </strong>
                  <p className="text-slate-500 text-[11px] flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {activeWo.technicianPhone}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Mitra Pelaksana & Menara:</span>
                  <strong className="text-slate-900 dark:text-white text-sm block">
                    {activeWo.vendorTeam}
                  </strong>
                  <span className="text-[10px] text-emerald-600 font-semibold block">
                    Kontrak SLA Aktif (Max Response 4 Jam)
                  </span>
                </div>
              </div>

              {/* Interactive Checklist for Shelter Maintenance */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Checklist Tindakan Perbaikan di Shelter BTS (Standard Operating Procedure):
                  </h4>
                  <span className="text-[10px] text-slate-500">Klik item untuk menandai selesai</span>
                </div>

                <div className="space-y-2">
                  {activeWo.checklist.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => toggleChecklist(activeWo.id, idx)}
                      className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 cursor-pointer transition ${
                        item.completed
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <input 
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => {}} // handled by parent div
                        className="mt-0.5 accent-emerald-600 cursor-pointer"
                      />
                      <span className={`leading-snug ${item.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'font-medium'}`}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resolution Note & Print e-WO Box */}
              <div className="pt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>SOM Terhubung</span>
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span>SLA Audit Trail Tersinkron</span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPrintModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <FileText className="w-3.5 h-3.5 text-[#ED0226]" />
                  <span>Cetak / Unduh Berita Acara e-WO Resmi</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SUB-TAB 2: INTERACTIVE EMERGENCY RUNBOOKS */}
      {activeSubTab === 'runbooks' && (
        <section className="space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <Play className="w-4 h-4 text-[#ED0226]" />
                  Simulasi Eksekusi Runbook SOP Darurat NOC
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Prosedur tanggap darurat otomatis untuk menjaga mutu layanan telekomunikasi tanpa interupsi
                </p>
              </div>
              <span className="text-[11px] font-mono text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                Rollback SLA: &lt; 28 ms Guaranteed
              </span>
            </div>

            {/* Runbook Selector Cards */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {RUNBOOKS.map((rb) => (
                <button
                  key={rb.id}
                  onClick={() => {
                    setSelectedRunbook(rb.id);
                    setRunbookLogs([]);
                  }}
                  className={`p-4 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between space-y-2.5 ${
                    selectedRunbook === rb.id
                      ? 'bg-slate-900 text-white border-slate-800 shadow-md ring-2 ring-red-500/20'
                      : 'bg-slate-50/70 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-bold text-red-500 uppercase block font-mono">
                      {rb.id}
                    </span>
                    <h3 className="font-extrabold text-xs mt-1 leading-snug line-clamp-2">
                      {rb.title.split(': ')[1] || rb.title}
                    </h3>
                  </div>
                  <div className="text-[10px] pt-1.5 border-t border-slate-200/40 dark:border-slate-700 flex justify-between items-center text-slate-400">
                    <span>{rb.category}</span>
                    <Play className="w-3 h-3 text-emerald-500" />
                  </div>
                </button>
              ))}
            </div>

            {/* Selected Runbook Detailed Stepper */}
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-600" />
                    <span>{currentRunbook.title}</span>
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span>Pemicu: <strong className="text-slate-800 dark:text-slate-200">{currentRunbook.slaTrigger}</strong></span>
                    <span>•</span>
                    <span>Target Latensi: <strong className="text-emerald-600">{currentRunbook.latencyGoal}</strong></span>
                  </div>
                </div>

                <button
                  onClick={executeRunbook}
                  disabled={runbookExecuting}
                  className="px-4 py-2 rounded-xl bg-[#ED0226] hover:bg-red-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {runbookExecuting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Mengeksekusi Runbook...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Uji Eksekusi Runbook Ini</span>
                    </>
                  )}
                </button>
              </div>

              {/* Steps Visualizer */}
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {currentRunbook.steps.map((st, i) => (
                  <div key={i} className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-xs space-y-1">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 dark:bg-red-950 text-[10px] font-bold text-red-700 dark:text-red-400">
                      {i + 1}
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-snug">
                      {st}
                    </p>
                  </div>
                ))}
              </div>

              {/* Execution Live Terminal Logs */}
              {runbookLogs.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                    Log Eksekusi Runbook (Real-Time Terminal Output):
                  </span>
                  <pre className="p-3.5 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto space-y-1 border border-slate-800">
                    {runbookLogs.map((log, idx) => (
                      <div key={idx}>{log}</div>
                    ))}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* SUB-TAB 3: PREDICTIVE ASSET HEALTH SCORECARD */}
      {activeSubTab === 'asset_health' && (
        <section className="space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <BatteryCharging className="w-4 h-4 text-[#ED0226]" />
                  Kartu Kesehatan Aset & Diagnostik Prediktif (Preventive Maintenance)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Memantau tanda-tanda keausan sebelum perangkat BTS mengalami *outage* mendadak
                </p>
              </div>
            </div>

            {/* Fleet Health Metrics Row */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 space-y-1">
                <span className="text-[10px] font-bold uppercase text-emerald-800 dark:text-emerald-400 block">Rata-rata SoH Baterai</span>
                <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300">98.4%</div>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-500">Estimasi sisa umur pakai: 7.2 Tahun</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Tegangan String LiFePO4</span>
                <div className="text-2xl font-black text-slate-900 dark:text-white">-48.2 <span className="text-sm font-normal text-slate-400">VDC</span></div>
                <p className="text-[10px] text-slate-500">Keseimbangan sel: ±0.02 V (Stabil)</p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 space-y-1">
                <span className="text-[10px] font-bold uppercase text-amber-800 dark:text-amber-400 block">Filter AC Perlu Servis</span>
                <div className="text-2xl font-black text-amber-700 dark:text-amber-300">3 Menara</div>
                <p className="text-[10px] text-amber-600 dark:text-amber-500">Terdeteksi via varians termal PINN</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Rata-rata MTTR FOP</span>
                <div className="text-2xl font-black text-sky-600 dark:text-sky-400">1.8 <span className="text-sm font-normal text-slate-400">Jam</span></div>
                <p className="text-[10px] text-slate-500">Target SLA Korporat: &lt; 4 Jam</p>
              </div>
            </div>

            {/* Vendor Hardware MTBF / MTTR Reliability Table */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                Indeks Keandalan Perangkat Keras Multi-Vendor (Reliability Index)
              </div>
              <table className="w-full text-left text-xs">
                <thead className="bg-white dark:bg-[#0B1324] text-[10px] uppercase text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="p-3">Komponen & Vendor</th>
                    <th className="p-3">MTBF (Mean Time Between Failure)</th>
                    <th className="p-3">MTTR (Mean Time to Repair)</th>
                    <th className="p-3">Status Pemeliharaan Preventif</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">Ericsson Baseband 6648 + AIR 6449</td>
                    <td className="p-3 font-mono text-slate-600 dark:text-slate-400">195.000 Jam (~22 Tahun)</td>
                    <td className="p-3 font-mono text-slate-600 dark:text-slate-400">1.9 Jam</td>
                    <td className="p-3 text-emerald-600 font-bold text-xs">● Kondisi Sangat Baik</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">Huawei BBU5900 + AAU A8972</td>
                    <td className="p-3 font-mono text-slate-600 dark:text-slate-400">180.000 Jam (~20 Tahun)</td>
                    <td className="p-3 font-mono text-slate-600 dark:text-slate-400">2.1 Jam</td>
                    <td className="p-3 text-emerald-600 font-bold text-xs">● Kondisi Baik</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">Inverter AC Emerson / Vertiv Liebert</td>
                    <td className="p-3 font-mono text-slate-600 dark:text-slate-400">85.000 Jam (~9.7 Tahun)</td>
                    <td className="p-3 font-mono text-slate-600 dark:text-slate-400">2.4 Jam</td>
                    <td className="p-3 text-amber-600 font-bold text-xs">⚠️ Jadwal Cuci Filter (3 Site)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">Submetering IoT Class 0.5s & Gateway</td>
                    <td className="p-3 font-mono text-slate-600 dark:text-slate-400">120.000 Jam (~13.6 Tahun)</td>
                    <td className="p-3 font-mono text-slate-600 dark:text-slate-400">1.1 Jam</td>
                    <td className="p-3 text-emerald-600 font-bold text-xs">● Terkalibrasi Presisi</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* SUB-TAB 4: SHIFT HANDOVER LOGBOOK */}
      {activeSubTab === 'shift_handover' && (
        <section className="space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#ED0226]" />
                  Berita Acara & Konsol Serah Terima Piket NOC (Shift Handover)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Protokol pergantian 3-shift petugas NOC Telkomsel untuk akuntabilitas operasional tanpa celah
                </p>
              </div>

              <button
                onClick={downloadShiftReport}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#ED0226] hover:bg-red-700 text-white text-xs font-bold transition cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Berita Acara (.txt)</span>
              </button>
            </div>

            {/* Shift Picker Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500 mr-2">Pilih Shift Kerja:</span>
              <button
                onClick={() => setShiftNumber('1')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  shiftNumber === '1'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                Shift 1: Pagi (07:00 - 15:00 WIB)
              </button>
              <button
                onClick={() => setShiftNumber('2')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  shiftNumber === '2'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                Shift 2: Siang (15:00 - 23:00 WIB)
              </button>
              <button
                onClick={() => setShiftNumber('3')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  shiftNumber === '3'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                Shift 3: Malam (23:00 - 07:00 WIB)
              </button>
            </div>

            {/* Shift Real-Time Summary Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Energi Dihemat Shift Ini</span>
                <strong className="text-xl font-black text-emerald-600">248.6 kWh</strong>
                <span className="text-[10px] text-slate-500 block">Setara Rp 372.900</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Reduksi Emisi Scope 2</span>
                <strong className="text-xl font-black text-slate-900 dark:text-white">216.3 kgCO₂e</strong>
                <span className="text-[10px] text-slate-500 block">Faktor ESDM 0.87</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Node Carrier Sleep</span>
                <strong className="text-xl font-black text-sky-600">36 / 40 Site</strong>
                <span className="text-[10px] text-slate-500 block">4 Site Traffic Guardrail</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Status Insiden Shift</span>
                <strong className="text-xl font-black text-amber-600">1 Pending Handover</strong>
                <span className="text-[10px] text-slate-500 block">3 Tiket Selesai</span>
              </div>
            </div>

            {/* Logbook Notes Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Catatan Resmi & Catatan Khusus untuk Shift Pengganti:
              </label>
              <textarea
                rows={4}
                value={shiftNotes}
                onChange={(e) => setShiftNotes(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-sans focus:outline-none focus:ring-2 focus:ring-[#ED0226]/30"
              />
            </div>

            {/* Sign-Off Block */}
            <div className="grid gap-4 sm:grid-cols-2 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Petugas Penanggung Jawab Shift (Shift Lead):</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-bold w-1/2"
                  />
                  <input
                    type="text"
                    value={leadNik}
                    onChange={(e) => setLeadNik(e.target.value)}
                    placeholder="NIK Telkomsel"
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono text-slate-600 dark:text-slate-300 w-1/2"
                  />
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Validasi & Pengesahan Digital:</span>
                <button
                  onClick={() => setIsHandoverSigned(!isHandoverSigned)}
                  className={`p-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                    isHandoverSigned
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>{isHandoverSigned ? '✓ BERITA ACARA TELAH DISAHKAN DIGITAL' : 'Tanda Tangan & Sahkan Serah Terima'}</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Official Telkomsel e-Work Order Printable Modal */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full border border-slate-300 shadow-2xl flex flex-col overflow-hidden max-h-[92vh]">
            {/* Modal Action Bar */}
            <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#ED0226]" />
                <span className="font-extrabold text-sm">Dokumen Berita Acara & e-Work Order Lapangan</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak / Simpan PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPrintModalOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Printable View */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-800 font-sans leading-relaxed">
              {/* Header Kop Surat */}
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#ED0226] text-white flex items-center justify-center font-black text-lg">
                    T
                  </div>
                  <div>
                    <h3 className="font-black text-sm tracking-tight text-slate-950">PT TELEKOMUNIKASI SELULAR</h3>
                    <p className="text-[10px] text-slate-600 font-medium">DIREKTORAT NETWORK OPERATIONS • DIVISI OPERATION & MAINTENANCE</p>
                  </div>
                </div>
                <div className="text-right text-[10px] text-slate-500 font-mono">
                  <div>KODE DOKUMEN: <strong>BAST-TSEL-OPS-2026</strong></div>
                  <div>KLASIFIKASI: <strong>INTERNAL RESTRICTED</strong></div>
                </div>
              </div>

              {/* Title & Document Meta */}
              <div className="text-center py-1">
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-950">
                  SURAT PERINTAH KERJA (SPK) & BERITA ACARA SERAH TERIMA PEMELIHARAAN (BAST)
                </h2>
                <span className="text-[11px] font-mono font-bold text-[#ED0226]">
                  NOMOR TIKET SOM: {activeWo.id}
                </span>
              </div>

              {/* Site & Vendor Details Table */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Identitas Menara BTS:</span>
                  <strong className="text-slate-900 text-sm block">{activeWo.siteId}</strong>
                  <span className="text-slate-600 text-[11px]">{activeWo.siteName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">TowerCo & Mitra FOP:</span>
                  <strong className="text-slate-900 text-sm block">{activeWo.vendorTeam}</strong>
                  <span className="text-slate-600 text-[11px]">Teknisi: {activeWo.technician} ({activeWo.technicianPhone})</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Kategori Anomali Energi:</span>
                  <span className="text-slate-900 font-semibold">{activeWo.anomalyType}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Status & Prioritas SLA:</span>
                  <span className="font-bold text-[#ED0226]">{activeWo.priority}</span> • <span>{activeWo.status}</span>
                </div>
              </div>

              {/* Checklist Table */}
              <div className="space-y-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-900 block">
                  I. LEMBAR VERIFIKASI TINDAKAN LAPANGAN (SOP CHECKLIST)
                </span>
                <div className="border border-slate-300 rounded-xl overflow-hidden">
                  <table className="w-full text-[11px] text-left">
                    <thead className="bg-slate-100 border-b border-slate-300 font-bold text-slate-700">
                      <tr>
                        <th className="p-2 w-8 text-center">No</th>
                        <th className="p-2">Item Pekerjaan Pemeliharaan Shelter</th>
                        <th className="p-2 w-28 text-center">Hasil Verifikasi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-medium">
                      {activeWo.checklist.map((item, idx) => (
                        <tr key={idx} className={item.completed ? 'bg-emerald-50/40' : 'bg-white'}>
                          <td className="p-2 text-center text-slate-500 font-mono">{idx + 1}</td>
                          <td className="p-2 text-slate-800">{item.text}</td>
                          <td className="p-2 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.completed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {item.completed ? 'TERVERIFIKASI ✓' : 'DALAM PROSES'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Compliance & Safety Declarations */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[10px] text-slate-600 space-y-1">
                <strong className="text-slate-900 block font-bold uppercase">II. PERNYATAAN KESELAMATAN & KEPATUHAN K3 TELEKOMUNIKASI:</strong>
                <p>1. Pekerjaan dilaksanakan mematuhi regulasi K3 Tower Climbing & isolasi grounding DC -48V.</p>
                <p>2. Submetering IoT Class 0.5s telah dikalibrasi terhadap kWh meter PLN dan disinkronkan ke gateway O-RAN O1.</p>
                <p>3. Pengujian fail-safe rollback 28ms terbukti tidak menimbulkan gangguan terhadap panggilan darurat publik 112.</p>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-8 pt-4 border-t border-slate-300 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Pihak Pertama (Pelaksana Lapangan)</span>
                  <div className="h-16 flex items-center justify-center font-serif italic text-slate-400">
                    [Tanda Tangan Digital Terverifikasi]
                  </div>
                  <strong className="text-slate-900 block underline">{activeWo.technician}</strong>
                  <span className="text-[10px] text-slate-500">Field Engineer Mitra FOP Telkomsel</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Pihak Kedua (Pengawas Operasional)</span>
                  <div className="h-16 flex items-center justify-center font-serif italic text-slate-400">
                    [Disahkan via SOM NOC Telkomsel]
                  </div>
                  <strong className="text-slate-900 block underline">Ir. Hendra Wijaya, S.T.</strong>
                  <span className="text-[10px] text-slate-500">Spv. NOC & Power Infrastructure Telkomsel</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">
                Dokumen resmi sistem operasi ImpactGrid • Terhubung langsung dengan ERP Telkomsel
              </span>
              <button
                type="button"
                onClick={() => setIsPrintModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
