// Enterprise Persistent Storage Engine
// Manages local state persistence across browser refreshes for Work Orders, Shift Handovers, SSO Sessions, and Autonomous Logs.

export const DEFAULT_WORK_ORDERS = [
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
    anomalyType: 'Battery Autonomy Risk (LiFePO4 String #2 Degradation)',
    priority: 'P3 - Rutin',
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
];

const STORAGE_KEYS = {
  WORK_ORDERS: 'impactgrid_work_orders_v1',
  SHIFT_HANDOVERS: 'impactgrid_shift_handovers_v1',
  SSO_SESSION: 'impactgrid_sso_session_v1',
  AUTONOMOUS_ACTIONS: 'impactgrid_autonomous_actions_v1'
};

function safeGet(key, fallback) {
  try {
    if (typeof localStorage === 'undefined') return fallback;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet(key, value) {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota or disabled storage gracefully
  }
}

// --- WORK ORDERS API ---
export function getStoredWorkOrders() {
  const stored = safeGet(STORAGE_KEYS.WORK_ORDERS, null);
  if (Array.isArray(stored) && stored.length > 0) return stored;
  safeSet(STORAGE_KEYS.WORK_ORDERS, DEFAULT_WORK_ORDERS);
  return DEFAULT_WORK_ORDERS;
}

export function saveStoredWorkOrders(orders) {
  safeSet(STORAGE_KEYS.WORK_ORDERS, orders);
}

export function addStoredWorkOrder(newOrder) {
  const current = getStoredWorkOrders();
  const updated = [newOrder, ...current];
  saveStoredWorkOrders(updated);
  return updated;
}

export function resetStoredWorkOrders() {
  safeSet(STORAGE_KEYS.WORK_ORDERS, DEFAULT_WORK_ORDERS);
  return DEFAULT_WORK_ORDERS;
}

// --- SSO AUTH SESSION API ---
export function getStoredSsoSession() {
  return safeGet(STORAGE_KEYS.SSO_SESSION, null);
}

export function saveStoredSsoSession(session) {
  safeSet(STORAGE_KEYS.SSO_SESSION, session);
}

export function clearStoredSsoSession() {
  try {
    localStorage.removeItem(STORAGE_KEYS.SSO_SESSION);
  } catch {
    // ignore
  }
}

// --- AUTONOMOUS O-RAN ACTIONS LOG API ---
export function getStoredAutonomousActions() {
  return safeGet(STORAGE_KEYS.AUTONOMOUS_ACTIONS, []);
}

export function appendStoredAutonomousAction(action) {
  const current = getStoredAutonomousActions();
  const updated = [action, ...current].slice(0, 50); // Keep latest 50 actions
  safeSet(STORAGE_KEYS.AUTONOMOUS_ACTIONS, updated);
  return updated;
}

export function clearStoredAutonomousActions() {
  safeSet(STORAGE_KEYS.AUTONOMOUS_ACTIONS, []);
}
