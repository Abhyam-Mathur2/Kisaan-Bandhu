import { useEffect, useMemo, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Sprout, 
  Bug, 
  Mic,
  CloudRain, 
  CloudSun,
  BellRing,
  PiggyBank,
  TrendingUp, 
  Settings, 
  LogOut, 
  UserCircle,
  Bot,
  ChevronRight,
  MessageSquare,
  Sparkles
} from "lucide-react";
import { cn } from "../utils/cn";
import AnimatedBackground from "../components/AnimatedBackground";
import AlertSystem from "../components/AlertSystem";
import VoiceButton from "../components/VoiceButton";
import LanguageToggle from "../components/LanguageToggle";
import OfflineBanner from "../components/OfflineBanner";
import BandhuAssistant from "../components/BandhuAssistant";
import { getStoredAlerts } from "../data/alertsService";
import { STORAGE_KEYS } from "../data/storageKeys";
import { useLanguage } from "../context/LanguageContext";

export function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [alerts, setAlerts] = useState(() => getStoredAlerts());
  const [isBandhuOpen, setIsBandhuOpen] = useState(false);

  function handleLogout() {
    localStorage.removeItem(STORAGE_KEYS.authSession);
    navigate("/login", { replace: true });
  }

  const sidebarItems = useMemo(
    () => [
      { icon: LayoutDashboard, label: t("dashboardTitle", "Dashboard"), path: "/dashboard" },
      { icon: Mic, label: "Voice Assistant", path: "/dashboard/voice" },
      { icon: Sprout, label: t("cropRecommendation", "Crop Recommendation"), path: "/dashboard/crop" },
      { icon: Bug, label: t("diseaseDetection", "Disease Detection"), path: "/dashboard/disease" },
      { icon: CloudRain, label: t("climateRisk", "Climate Risk"), path: "/dashboard/climate" },
      { icon: CloudSun, label: t("weather", "Weather"), path: "/dashboard/weather" },
      { icon: BellRing, label: t("alerts", "Alerts"), path: "/dashboard/alerts", showsUnread: true },
      { icon: PiggyBank, label: t("finance", "Finance"), path: "/dashboard/finance" },
      { icon: TrendingUp, label: t("marketInsights", "Market Insights"), path: "/dashboard/market" },
      { icon: Settings, label: t("settings", "Settings"), path: "/dashboard/settings" },
    ],
    [t]
  );

  useEffect(() => {
    function handleAlertsUpdated(event) {
      setAlerts(Array.isArray(event.detail) ? event.detail : getStoredAlerts());
    }
    window.addEventListener("kb:alerts-updated", handleAlertsUpdated);
    return () => window.removeEventListener("kb:alerts-updated", handleAlertsUpdated);
  }, []);

  const unreadCount = useMemo(() => alerts.filter((item) => !item.read).length, [alerts]);

  return (
    <div className="flex h-screen bg-[#F8FAF9] overflow-hidden relative font-sans">
      <div className="absolute inset-0 grain opacity-[0.03] z-0 pointer-events-none" />
      
      {/* Left Sidebar (Navigation) */}
      <aside className="w-64 bg-emerald-950 flex flex-col p-6 h-full shadow-2xl z-20 border-r border-emerald-900/50">
        <Link to="/" className="flex items-center gap-2 mb-10 px-2 group">
          <div className="bg-amber-500 p-2 rounded-xl shadow-lg shadow-amber-500/20">
            <Sprout className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            Kisan <span className="text-amber-400">Bandhu</span>
          </span>
        </Link>

        <nav className="flex-1 space-y-1.5">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={cn(
                  "flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-200",
                  isActive 
                    ? "bg-amber-500 text-white shadow-md shadow-amber-500/20" 
                    : "text-emerald-100/50 hover:text-white hover:bg-white/5"
                )}
              >
                <span className="flex items-center gap-3">
                  <item.icon size={18} />
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-white">
        <AnimatedBackground variant="dashboard" />
        
        {/* Top Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-emerald-50 flex items-center justify-between px-8 flex-shrink-0 z-10">
          <h1 className="text-lg font-black text-slate-800 uppercase tracking-tight">
            {sidebarItems.find(item => item.path === location.pathname)?.label || "Dashboard"}
          </h1>

          <div className="flex items-center gap-4">
            <LanguageToggle compact />
            <AlertSystem unreadCount={unreadCount} />
            <div className="flex items-center gap-3 pl-4 border-l border-emerald-100">
               <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-slate-800">Farmer John</span>
                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Premium User</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 border-2 border-white shadow-sm">
                <UserCircle size={22} />
              </div>
            </div>
          </div>
        </header>

        <OfflineBanner />

        <section className="flex-1 overflow-y-auto p-8 scroll-smooth z-10">
          <Outlet />
        </section>
      </main>

      {/* Right Sidebar (Bandhu AI Quick Access) */}
      <aside className="w-72 bg-white border-l border-emerald-50 flex flex-col z-20 shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.05)]">
        <div className="p-6 border-b border-emerald-50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Assistant</h2>
            <Sparkles size={16} className="text-amber-500" />
          </div>

          {/* Bandhu Status Card */}
          <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 rounded-3xl p-5 text-white shadow-xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <Bot size={80} />
             </div>
             <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">Bandhu Online</span>
                </div>
                <h3 className="text-xl font-bold mb-1">Bandhu</h3>
                <p className="text-[11px] text-emerald-100/70 leading-relaxed mb-4">
                  Your calm and composed companion for resilient farming.
                </p>
                <button 
                  onClick={() => navigate("/dashboard/voice")}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-emerald-950 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  <Mic size={16} />
                  VOICE ASSISTANT
                </button>
             </div>
          </div>
        </div>

        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Quick Insights</h4>
            <div className="space-y-3">
              {[
                { label: "Crop Health", value: "Excellent", color: "text-emerald-600" },
                { label: "Weather Risk", value: "Low", color: "text-amber-600" },
                { label: "Next Action", value: "Irrigation in 2d", color: "text-slate-600" }
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100/50">
                  <span className="text-[11px] font-bold text-slate-500">{stat.label}</span>
                  <span className={cn("text-[11px] font-black", stat.color)}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4">
             <div className="bg-amber-50 rounded-3xl p-4 border border-amber-100">
                <p className="text-[10px] text-amber-800 font-bold leading-relaxed">
                  "Bandhu suggests checking your Wheat field tomorrow morning due to rising humidity."
                </p>
             </div>
          </div>
        </div>

        <div className="p-6 border-t border-emerald-50 mt-auto">
           <button 
             onClick={() => navigate("/dashboard/voice")}
             className="w-full py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 border border-emerald-100"
           >
             <Mic size={16} />
             VOICE MODE
           </button>
        </div>
      </aside>

      {/* Floating Chat UI */}
      <BandhuAssistant 
        isOpen={isBandhuOpen} 
        onClose={() => setIsBandhuOpen(false)} 
      />
    </div>
  );
}
