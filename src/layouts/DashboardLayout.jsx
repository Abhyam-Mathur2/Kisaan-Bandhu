import { motion } from "framer-motion";
import { Link, Outlet, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Sprout, 
  Bug, 
  CloudRain, 
  TrendingUp, 
  Settings, 
  LogOut, 
  Bell, 
  UserCircle 
} from "lucide-react";
import { cn } from "../utils/cn";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Sprout, label: "Crop Recommendation", path: "/dashboard/crop" },
  { icon: Bug, label: "Disease Detection", path: "/dashboard/disease" },
  { icon: CloudRain, label: "Climate Risk", path: "/dashboard/climate" },
  { icon: TrendingUp, label: "Market Insights", path: "/dashboard/market" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

export function DashboardLayout() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-[#F8FAF9] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-emerald-100/50 flex flex-col p-6 h-full shadow-2xl shadow-emerald-900/5">
        <Link to="/" className="flex items-center gap-2 mb-10 px-2 group">
          <div className="bg-emerald-600 p-2 rounded-xl shadow-lg shadow-emerald-200">
            <Sprout className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold text-emerald-900 tracking-tight">
            Kisan <span className="text-emerald-600">Bandhu</span>
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
                  "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300",
                  isActive 
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" 
                    : "text-emerald-800/60 hover:text-emerald-800 hover:bg-emerald-50"
                )}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-emerald-50">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all duration-300">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white/50 backdrop-blur-md border-b border-emerald-100/30 flex items-center justify-between px-10 flex-shrink-0">
          <div>
            <h1 className="text-xl font-bold text-slate-800">
              {sidebarItems.find(item => item.path === location.pathname)?.label || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-400 hover:text-emerald-600 transition-colors">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-3 bg-white p-1.5 pr-4 rounded-full border border-emerald-50 shadow-sm">
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

        {/* Dynamic Content */}
        <section className="flex-1 overflow-y-auto p-10 scroll-smooth">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
