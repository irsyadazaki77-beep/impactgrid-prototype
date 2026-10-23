with open(r'src\components\OverviewTab.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

target = '<AreaChart data={HOURLY_PILOT_PROFILE}'
replacement = '<AreaChart data={dynamicHourlyData}'

if target in text:
    text = text.replace(target, replacement)
    print("Replaced AreaChart data!")

banner_target = '<div className="h-64 w-full">'
banner_replacement = '''{emergencyState.active && (
          <div className="p-3.5 rounded-2xl bg-amber-500/15 border-2 border-red-500 animate-pulse flex items-center justify-between text-xs mb-3">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
              <span className="font-extrabold text-red-700">
                ⚡ KONDISI DARURAT AKTIF: Mode Sleep Dinonaktifkan (Wake-up: 120ms) • Daya 100% Dipulihkan • Panggilan Darurat 112 & VIP Terlindungi (Drop Call: 0,000%)
              </span>
            </div>
            <button
              onClick={onOpenEmergencyModal}
              className="text-[11px] font-bold text-red-800 underline cursor-pointer"
            >
              Kelola Skenario
            </button>
          </div>
        )}

        <div className="h-64 w-full">'''

if banner_target in text:
    text = text.replace(banner_target, banner_replacement)
    print("Replaced banner target!")

with open(r'src\components\OverviewTab.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("OverviewTab updated successfully!")
