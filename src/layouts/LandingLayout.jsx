import { motion } from "framer-motion";
import { Link, Outlet } from "react-router-dom";
import { Sprout } from "lucide-react";
import AnimatedBackground from "../components/AnimatedBackground";
import LanguageToggle from "../components/LanguageToggle";
import { useLanguage } from "../context/LanguageContext";

export function LandingLayout() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-amber-50/30 via-emerald-50 to-teal-100">
      <AnimatedBackground variant="landing" />

      {/* Header */}
      <header className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between bg-white/40 backdrop-blur-md border-b border-amber-100/20 shadow-sm">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-emerald-600 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-emerald-200">
            <Sprout className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold text-emerald-900 tracking-tight font-display">
            Kisan <span className="text-emerald-600">Bandhu</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-emerald-800/70">
          <Link to="/" className="hover:text-emerald-900 transition-colors">{t("navHome", "Home")}</Link>
          <Link to="#" className="hover:text-emerald-900 transition-colors">{t("navFeatures", "Features")}</Link>
          <LanguageToggle compact />
          <Link to="/login" className="px-5 py-2 hover:bg-amber-100/50 rounded-xl transition-all">{t("navLogin", "Login")}</Link>
          <Link to="/signup" className="px-5 py-2 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all">{t("navGetStarted", "Get Started")}</Link>
        </nav>

        <div className="md:hidden">
          <LanguageToggle compact />
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <Outlet />
      </main>
    </div>
  );
}
