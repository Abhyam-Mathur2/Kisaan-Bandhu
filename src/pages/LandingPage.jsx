import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { ArrowRight, Sparkles, Sprout, ShieldCheck, Zap } from "lucide-react";

export function LandingPage() {
  return (
    <div className="flex flex-col items-center text-center max-w-4xl mx-auto pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/50 border border-emerald-200 text-emerald-700 text-sm font-bold mb-8"
      >
        <Sparkles size={16} />
        <span>Next-Gen Farming Assistant</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-6xl md:text-8xl font-black text-emerald-950 leading-[0.9] tracking-tighter mb-8"
      >
        Kisan <span className="text-emerald-600">Bandhu</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-xl md:text-2xl text-emerald-900/60 font-medium mb-12 max-w-2xl"
      >
        A smart farming companion that thinks for you. AI-powered crop recommendations, disease detection, and climate insights.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-wrap justify-center gap-6"
      >
        <Link to="/login">
          <Button size="lg" className="h-16 px-10 text-xl group">
            Launch Dashboard
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
        <Link to="/signup">
          <Button variant="outline" size="lg" className="h-16 px-10 text-xl">
            Join the Community
          </Button>
        </Link>
      </motion.div>

      {/* Floating Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full">
        <FeatureItem 
          icon={Sprout} 
          title="Smart Recs" 
          desc="AI analyzed soil & climate" 
          delay={0.4} 
        />
        <FeatureItem 
          icon={ShieldCheck} 
          title="Health Guard" 
          desc="Instant crop disease detection" 
          delay={0.5} 
        />
        <FeatureItem 
          icon={Zap} 
          title="Real-time" 
          desc="Live market & weather data" 
          delay={0.6} 
        />
      </div>
    </div>
  );
}

function FeatureItem({ icon: Icon, title, desc, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="p-8 rounded-3xl glass border-none text-left group hover-glow"
    >
      <div className="bg-emerald-600 w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-bold text-emerald-950 mb-2">{title}</h3>
      <p className="text-emerald-900/50 font-medium text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
}
