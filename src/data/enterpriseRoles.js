// Telkomsel Enterprise Persona / Role Switcher Profiles
export const ENTERPRISE_ROLES = [
  {
    id: 'vp_network',
    title: 'VP Network Operations & Quality',
    shortTitle: 'VP Network Ops',
    department: 'Network Operations & Quality Directorate',
    badge: 'Direksi & Eksekutif',
    badgeColor: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300',
    icon: 'Briefcase',
    viewMode: 'executive',
    activeLens: 'finance',
    preferredTab: 'overview',
    description: 'Pengawasan efisiensi OPEX listrik, ROI CapEx, dan target performa dewan direksi Telkomsel.'
  },
  {
    id: 'noc_leader',
    title: 'NOC Incident Commander & Shift Leader',
    shortTitle: 'NOC Commander',
    department: 'Network Operations Center (NOC) 24/7',
    badge: 'Operasional Kritis',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300',
    icon: 'Activity',
    viewMode: 'engineering',
    activeLens: 'network',
    preferredTab: 'telemetry',
    description: 'Pemantauan alarm real-time, mitigasi gangguan 112, dan disposisi tiket lapangan Mitratel.'
  },
  {
    id: 'rno_engineer',
    title: 'Radio Planning & O-RAN Engineer',
    shortTitle: 'O-RAN Engineer',
    department: 'RAN Planning, Optimization & Engineering',
    badge: 'Otoritas AI Radio',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300',
    icon: 'Cpu',
    viewMode: 'engineering',
    activeLens: 'network',
    preferredTab: 'optimization',
    description: 'Konfigurasi ambang batas AI carrier sleep, Near-RT RIC, dan model termal PINN pendingin shelter.'
  },
  {
    id: 'esg_lead',
    title: 'Head of ESG & Sustainability Governance',
    shortTitle: 'Head of ESG',
    department: 'Corporate Sustainability & Governance Office',
    badge: 'Kepatuhan Hijau',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300',
    icon: 'Leaf',
    viewMode: 'executive',
    activeLens: 'esg',
    preferredTab: 'esg',
    description: 'Pelaporan emisi Scope 2 (GHG Protocol), kepatuhan regulasi POJK 51/2017, dan dekarbonisasi RAN.'
  },
  {
    id: 'auditor',
    title: 'Corporate Internal Auditor & CISO',
    shortTitle: 'Auditor & CISO',
    department: 'Internal Audit & Information Security',
    badge: 'Integritas & Kedaulatan',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300',
    icon: 'ShieldCheck',
    viewMode: 'executive',
    activeLens: 'all',
    preferredTab: 'architecture',
    description: 'Verifikasi cryptographic audit trail SHA-256, kedaulatan data PP 71/2019, dan kepatuhan UU PDP.'
  }
];
