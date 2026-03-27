import { useEffect, useMemo, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Sprout, 
  Bug, 
  CloudRain, 
  CloudSun,
  BellRing,
  PiggyBank,
  TrendingUp, 
  Settings, 
  LogOut, 
  UserCircle 
} from "lucide-react";
import { cn } from "../utils/cn";
import AnimatedBackground from "../components/AnimatedBackground";
import AlertSystem from "../components/AlertSystem";
import VoiceButton from "../components/VoiceButton";
import LanguageToggle from "../components/LanguageToggle";
import OfflineBanner from "../components/OfflineBanner";
import { getStoredAlerts } from "../data/alertsService";
import { useLanguage } from "../context/LanguageContext";

export function DashboardLayout() {
  const location = useLocation();
  const { t } = useLanguage();
  const [alerts, setAlerts] = useState(() => getStoredAlerts());

  const sidebarItems = useMemo(
    () => [
      { icon: LayoutDashboard, label: t("dashboardTitle", "Dashboard"), path: "/dashboard" },
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

    function handleStorage(event) {
      if (event.key === "kb:alerts:list") {
        setAlerts(getStoredAlerts());
      }
    }

    window.addEventListener("kb:alerts-updated", handleAlertsUpdated);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("kb:alerts-updated", handleAlertsUpdated);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const unreadCount = useMemo(
    () => alerts.filter((item) => !item.read).length,
    [alerts]
  );

  return (
    <div className="flex h-screen bg-[#F8FAF9] overflow-hidden relative">
      <div className="absolute inset-0 grain opacity-[0.03] z-0 pointer-events-none" />
      
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-950 flex flex-col p-6 h-full shadow-2xl z-10">
        <Link to="/" className="flex items-center gap-2 mb-10 px-2 group">
          <div className="bg-amber-500 p-2 rounded-xl shadow-lg shadow-amber-500/20">
            <Sprout className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold text-white tracking-tight font-display">
            Kisan <span className="text-amber-400">Bandhu</span>
          </span>
        </Link>

        <nav className="flex-1 space-y-2">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={cn(
                  "flex items-center justify-between gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 group/nav",
                  isActive 
                    ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" 
                    : "text-emerald-100/60 hover:text-white hover:bg-white/5 hover:translate-x-1"
                )}
              >
                <span className="flex items-center gap-3">
                  <item.icon size={20} className={cn("transition-transform", !isActive && "group-hover/nav:scale-110")} />
                  {item.label}
                </span>
                {item.showsUnread && unreadCount > 0 ? (
                  <span className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-black",
                    isActive ? "bg-white text-amber-600" : "bg-red-500 text-white"
                  )}>
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl text-sm font-semibold text-red-300 hover:bg-red-500/10 transition-all duration-300">
            <LogOut size={20} />
            {t("logout", "Logout")}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <AnimatedBackground variant="dashboard" />
        
        {/* Top Header */}
        <header className="h-20 bg-white/50 backdrop-blur-md border-b border-emerald-100/30 flex items-center justify-between px-4 sm:px-6 lg:px-10 flex-shrink-0 z-10">
          <div>
            <h1 className="text-xl font-bold text-slate-800 font-display">
              {sidebarItems.find(item => item.path === location.pathname)?.label || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
            <LanguageToggle compact />
            <VoiceButton text="You are on the Kisan Bandhu dashboard." />
            <AlertSystem unreadCount={unreadCount} />
            <div className="hidden sm:flex items-center gap-3 bg-white p-1.5 pr-4 rounded-full border border-emerald-50 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                <UserCircle size={28} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-800 leading-none">Farmer John</span>
                <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">Premium Plan</span>
              </div>
            </div>
          </div>
        </header>

        <OfflineBanner />

        {/* Dynamic Content */}
        <section className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 scroll-smooth z-10">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
