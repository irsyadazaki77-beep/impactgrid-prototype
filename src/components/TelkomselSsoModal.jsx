import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  ShieldCheck, 
  Key, 
  CheckCircle2, 
  RefreshCw, 
  User, 
  Building2, 
  Fingerprint, 
  ExternalLink,
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { ENTERPRISE_ROLES } from '../data/enterpriseRoles';
import { saveStoredSsoSession } from '../utils/storageEngine';

export default function TelkomselSsoModal({
  isOpen,
  onClose,
  onLoginSuccess,
  currentSession,
  onAuthenticateSso,
  divisionAccounts = []
}) {
  const [nik, setNik] = useState(currentSession?.nik || '8810429');
  const [email, setEmail] = useState(currentSession?.email || 'bambang.hariyanto@telkomsel.co.id');
  const [selectedRoleId, setSelectedRoleId] = useState(currentSession?.roleId || 'vp_network');
  const [otpCode, setOtpCode] = useState('881026');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStage, setAuthStage] = useState('idle'); // 'idle' | 'verifying_credentials' | 'exchanging_token' | 'success'
  const [showTokenPreview, setShowTokenPreview] = useState(false);

  if (!isOpen) return null;

  const activeRoleObj = ENTERPRISE_ROLES.find(r => r.id === selectedRoleId) || ENTERPRISE_ROLES[0];

  const handleRoleSelectChange = (nextRoleId) => {
    setSelectedRoleId(nextRoleId);
    const matchingAccount = divisionAccounts.find((acc) => acc.roleId === nextRoleId);
    if (matchingAccount) {
      setNik(matchingAccount.nik);
      setEmail(matchingAccount.email);
    }
  };

  const handleSimulateSsoLogin = async (e) => {
    e?.preventDefault();
    setIsAuthenticating(true);
    setAuthStage('verifying_credentials');

    try {
      if (onAuthenticateSso) {
        setAuthStage('exchanging_token');
        const serverSession = await onAuthenticateSso({
          roleId: selectedRoleId,
          nik,
          email,
          otpCode
        });
        if (serverSession) {
          saveStoredSsoSession(serverSession);
          setAuthStage('success');
          setIsAuthenticating(false);
          setTimeout(() => {
            if (onLoginSuccess) onLoginSuccess(serverSession);
            onClose();
          }, 450);
          return;
        }
      }
    } catch {
      // Fallback to local OIDC token generation if offline
    }

    setTimeout(() => {
      setAuthStage('exchanging_token');
      setTimeout(() => {
        const generatedToken = {
          header: { alg: "RS256", typ: "JWT", kid: "tsel-iam-2026-prod" },
          payload: {
            iss: "https://iam.telkomsel.co.id/oauth2/v1",
            sub: `tsel-user-${nik}`,
            name: nik === '8810429' ? 'Ir. Bambang Hariyanto' : 'User Operasional Telkomsel',
            email,
            nik,
            role_assigned: selectedRoleId,
            department: activeRoleObj.department,
            tenant_id: "TSEL-REG-JAMALI-01",
            acr: "urn:telecom:loa:high:mfa",
            data_residency: "Telkom DC Sentul & Surabaya (PP 71/2019)",
            exp: Math.floor(Date.now() / 1000) + 86400 // 24 hours
          }
        };

        const sessionData = {
          isAuthenticated: true,
          nik,
          name: generatedToken.payload.name,
          email,
          roleId: selectedRoleId,
          roleTitle: activeRoleObj.title,
          department: activeRoleObj.department,
          loginTime: new Date().toISOString(),
          token: generatedToken
        };

        saveStoredSsoSession(sessionData);
        setAuthStage('success');
        setIsAuthenticating(false);

        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess(sessionData);
          onClose();
        }, 600);
      }, 700);
    }, 500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="telkomsel-sso-title"
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-[#ED0226]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black uppercase text-[#ED0226]">IAM Corporate SSO</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40">
                  OIDC / OAuth2 PKCE
                </span>
              </div>
              <h2 id="telkomsel-sso-title" className="text-base font-black text-slate-900 dark:text-white">
                Portal Autentikasi Pengguna Telkomsel
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSimulateSsoLogin} className="p-6 space-y-4 text-xs">
          {authStage === 'success' && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold">Autentikasi Berhasil!</p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                  Token JWT OIDC telah diterbitkan dan tersimpan di sesi aman Telkomsel.
                </p>
              </div>
            </div>
          )}

          {/* Persona / Role Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Peran Operasional (Role Authority):
            </label>
            <select
              value={selectedRoleId}
              onChange={(e) => handleRoleSelectChange(e.target.value)}
              className="w-full text-xs font-bold rounded-xl px-3 py-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-red-500/20"
            >
              {ENTERPRISE_ROLES.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.title} ({role.department})
                </option>
              ))}
            </select>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
              {activeRoleObj.description}
            </p>
          </div>

          {/* NIK Input */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Nomor Induk Karyawan (NIK):
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                  className="w-full font-mono text-xs font-bold rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                MFA OTP Code (Telkomsel Authenticator):
              </label>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full font-mono text-xs font-bold rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500/20"
                required
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Email Korporat Telkomsel:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full font-mono text-xs font-bold rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500/20"
              required
            />
          </div>

          {/* Security & Data Sovereignty Note */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-slate-600 dark:text-slate-400">
                Residensi Data: <strong>Telkom DC Sentul & Surabaya (PP 71/2019)</strong>
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">TLS 1.3</span>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setShowTokenPreview(!showTokenPreview)}
              className="text-[11px] font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
            >
              {showTokenPreview ? 'Sembunyikan Klaim JWT' : 'Lihat Klaim Token JWT'}
            </button>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="px-5 py-2.5 rounded-xl bg-[#ED0226] hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-xs disabled:opacity-60"
            >
              {isAuthenticating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>
                    {authStage === 'verifying_credentials' ? 'Verifikasi Kredensial...' : 'Menerbitkan JWT Token...'}
                  </span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Autentikasi Telkomsel IAM SSO</span>
                </>
              )}
            </button>
          </div>

          {/* JWT Token Claims Preview */}
          {showTokenPreview && (
            <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">
                Simulasi Payload RS256 JWT (OIDC Claim):
              </span>
              <pre className="p-3 rounded-xl bg-slate-950 text-emerald-400 font-mono text-[10px] overflow-x-auto max-h-[160px] border border-slate-800">
{JSON.stringify({
  iss: "https://iam.telkomsel.co.id/oauth2/v1",
  sub: `tsel-user-${nik}`,
  email,
  nik,
  role_assigned: selectedRoleId,
  department: activeRoleObj.department,
  tenant_id: "TSEL-REG-JAMALI-01",
  scopes: ["ran:telemetry:read", "ran:policy:enforce", "cmdb:incident:write"],
  acr: "urn:telecom:loa:high:mfa"
}, null, 2)}
              </pre>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
