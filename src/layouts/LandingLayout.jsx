import { motion } from "framer-motion";
import { Link, Outlet } from "react-router-dom";
import { Sprout } from "lucide-react";

export function LandingLayout() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/50">
      {/* Background Orbs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/2 -right-48 w-[500px] h-[500px] bg-teal-200/30 rounded-full blur-[100px]" />
      <div className="absolute -bottom-48 left-1/4 w-80 h-80 bg-emerald-300/20 rounded-full blur-3xl" />

      {/* Header */}
      <header className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between glass border-none">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-emerald-600 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-emerald-200">
            <Sprout className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold text-emerald-900 tracking-tight">
            Kisan <span className="text-emerald-600">Bandhu</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-emerald-800/70">
          <Link to="/" className="hover:text-emerald-900 transition-colors">Home</Link>
          <Link to="#" className="hover:text-emerald-900 transition-colors">Features</Link>
          <Link to="/login" className="px-5 py-2 hover:bg-emerald-100 rounded-xl transition-all">Login</Link>
          <Link to="/signup" className="px-5 py-2 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all">Get Started</Link>
        </nav>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <Outlet />
      </main>
    </div>
  );
}
