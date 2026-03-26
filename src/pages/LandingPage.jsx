import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import {
  ArrowRight,
  Sparkles,
  Sprout,
  ShieldCheck,
  Zap,
  ChevronDown,
} from "lucide-react";
import FarmHeroIllustration from "../components/FarmHeroIllustration";

export function LandingPage() {
  const tagline = "A smart farming companion that thinks for you. AI-powered crop recommendations, disease detection, and climate insights.";

  return (
    <div className="flex flex-col items-center text-center max-w-6xl mx-auto pt-10">
      {/* Hero Section */}
      <div className="relative w-full overflow-hidden rounded-[2.5rem] border border-emerald-100/70 bg-gradient-to-br from-white/80 via-emerald-50/70 to-teal-50/70 px-8 py-10 shadow-[0_30px_80px_-40px_rgba(5,150,105,0.55)] flex flex-col items-center lg:flex-row lg:text-left lg:items-start gap-12 mb-32">
        <div className="pointer-events-none absolute -left-24 -top-24 h-56 w-56 rounded-full bg-emerald-200/50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 right-16 h-64 w-64 rounded-full bg-cyan-100/60 blur-3xl" />
        <div className="flex-1 z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-bold mb-8 border border-amber-200 shadow-sm"
          >
            <Sparkles size={16} />
            <span>Next-Gen Farming Assistant</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl md:text-8xl font-black text-emerald-950 leading-[0.9] tracking-tighter mb-8 font-display"
          >
            Kisan <span className="text-emerald-600">Bandhu</span>
          </motion.h1>

          <motion.div
            className="text-xl md:text-2xl text-emerald-900/70 font-medium mb-12 max-w-2xl leading-relaxed"
          >
            {tagline.split(" ").map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.5 + i * 0.05 }}
              >
                {word}{" "}
              </motion.span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="flex flex-wrap gap-6"
          >
            <Link to="/login">
              <Button size="lg" className="h-16 px-10 text-xl group bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-200/50">
                Launch Dashboard
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="outline" size="lg" className="h-16 px-10 text-xl border-emerald-600/20 text-emerald-700 hover:bg-emerald-50">
                Join Community
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Hero Farm Visual */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="flex-1 relative w-full z-10"
        >
          <FarmHeroIllustration />
        </motion.div>
      </div>

      {/* Bounce Arrow */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="mb-20 text-emerald-600/40"
      >
        <ChevronDown size={48} />
      </motion.div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-20">
        <FeatureItem 
          icon={Sprout} 
          title="Smart Recs" 
          desc="AI analyzed soil & climate" 
          accent="bg-amber-100 text-amber-700"
          delay={1.5} 
        />
        <FeatureItem 
          icon={ShieldCheck} 
          title="Health Guard" 
          desc="Instant crop disease detection" 
          accent="bg-terracotta-100 text-brand-terracotta"
          delay={1.6} 
        />
        <FeatureItem 
          icon={Zap} 
          title="Real-time" 
          desc="Live market & weather data" 
          accent="bg-sky-100 text-sky-700"
          delay={1.7} 
        />
      </div>
    </div>
  );
}

function FeatureItem({ icon: Icon, title, desc, delay, accent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="p-8 rounded-[2.5rem] bg-white/60 backdrop-blur-sm border border-emerald-100 shadow-xl text-left group hover:scale-[1.02] transition-all"
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${accent} group-hover:scale-110 transition-transform`}>
        <Icon size={28} />
      </div>
      <h3 className="text-2xl font-black text-emerald-950 mb-2 font-display">{title}</h3>
      <p className="text-emerald-900/60 font-medium text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
}
