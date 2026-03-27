import { motion } from "framer-motion";
import { useCallback } from "react";
import { 
  Sprout, 
  Bug, 
  CloudRain, 
  TrendingUp, 
  Leaf, 
  ArrowUpRight,
  UploadCloud,
  MapPin,
  Lightbulb
} from "lucide-react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { cn } from "../utils/cn";
import { useCachedResource } from "../hooks/useCachedResource";
import { fetchWeather } from "../data/weatherService";
import { STORAGE_KEYS } from "../data/storageKeys";
import { useUserCoordinates } from "../hooks/useUserCoordinates";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function DashboardPage() {
  const coords = useUserCoordinates();
  const weatherFetcher = useCallback(() => fetchWeather(coords.lat, coords.lon), [coords.lat, coords.lon]);
  const { data: weather } = useCachedResource({
    storageKey: STORAGE_KEYS.weather,
    fetcher: weatherFetcher,
    staleAfterMinutes: 20,
  });

  return (
    <div className="space-y-10 pb-20">
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-[2.5rem] bg-emerald-900 p-10 text-white shadow-2xl"
      >
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10">
          <div className="text-center lg:text-left flex-1">
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight font-display">Hello Farmer John! 👋</h2>
            <p className="text-emerald-50/70 font-medium text-lg max-w-xl">
              {weather?.description
                ? `Current weather: ${weather.description}.`
                : "Fetching live weather for your area."} {" "}
              {typeof weather?.humidity === "number"
                ? `Humidity is ${weather.humidity}%.`
                : "Humidity data will appear shortly."}
            </p>
          </div>
          
          {/* Animated Seedling */}
          <div className="hidden lg:block w-40 h-40 relative">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <motion.path 
                d="M50 90 L50 60" 
                stroke="#34d399" 
                strokeWidth="4" 
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
              <motion.path 
                d="M50 60 Q 30 50 20 60" 
                stroke="#34d399" 
                strokeWidth="4" 
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              />
              <motion.path 
                d="M50 60 Q 70 50 80 60" 
                stroke="#34d399" 
                strokeWidth="4" 
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 1.5 }}
              />
              <motion.circle 
                cx="50" cy="55" r="5" fill="#facc15"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 2, type: "spring" }}
              />
            </svg>
          </div>

          <div className="flex items-center gap-6 bg-white/5 p-6 rounded-[2rem] backdrop-blur-md border border-white/10">
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300/60 mb-1">Temp</span>
              <span className="text-3xl font-black">
                {typeof weather?.temperature === "number" ? `${weather.temperature}°C` : "--"}
              </span>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300/60 mb-1">Humidity</span>
              <span className="text-3xl font-black">
                {typeof weather?.humidity === "number" ? `${weather.humidity}%` : "--"}
              </span>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="flex items-center gap-2 text-emerald-300">
              <MapPin size={20} />
              <span className="text-sm font-bold">{weather?.location || "Locating..."}</span>
            </div>
          </div>
        </div>
        
        {/* Abstract Background Decor */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-emerald-500 rounded-full blur-[100px] opacity-20" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-amber-400 rounded-full blur-[80px] opacity-10" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stats Column */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <motion.div variants={item}>
              <Card className="flex flex-col gap-4 p-8 bg-white border border-emerald-100 shadow-lg shadow-emerald-900/5 overflow-hidden relative group">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-emerald-100 text-emerald-700">
                  <Leaf size={24} />
                </div>
                <div className="relative z-10">
                  <p className="text-emerald-900/40 text-xs font-bold uppercase tracking-widest mb-1">Sustainability</p>
                  <div className="flex items-baseline justify-between mb-2">
                    <h3 className="text-3xl font-black text-emerald-950">82%</h3>
                    <span className="text-[10px] font-black px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg">
                      +5%
                    </span>
                  </div>
                  {/* Sparkline Mockup */}
                  <div className="flex items-end gap-1 h-8 mt-4">
                    {[40, 60, 45, 70, 55, 82].map((h, i) => (
                      <motion.div 
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="flex-1 bg-emerald-500/20 rounded-t-sm group-hover:bg-emerald-500/40 transition-colors"
                      />
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>

            <StatCard 
              icon={TrendingUp} 
              title="Market Trend" 
              value="Stable" 
              trend="↑ 2.4%" 
              color="bg-amber-100 text-amber-700"
              data={[30, 40, 35, 50, 48, 52]}
            />
          </motion.div>

          {/* Main Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureCard 
              icon={Sprout}
              title="Crop Recommendation"
              desc="AI analyzed soil health, climate data and historical trends."
              buttonText="Get Recommendation"
              color="bg-emerald-600"
            />
            <FeatureCard 
              icon={Bug}
              title="Disease Detection"
              desc="Upload a leaf photo and identify potential diseases."
              buttonText="Upload Image"
              isUpload={true}
              color="bg-emerald-700"
            />
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          {/* Today's Tip */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-8 rounded-[2.5rem] bg-amber-50 border border-amber-200 relative overflow-hidden group"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-3 text-amber-700 mb-4">
                <Lightbulb size={24} className="group-hover:rotate-12 transition-transform" />
                <span className="font-black uppercase tracking-widest text-xs">Today's Tip</span>
              </div>
              <p className="text-amber-900/80 font-medium leading-relaxed italic">
                "Adding mulching layers can reduce water evaporation by up to 40% in this week's heat."
              </p>
            </div>
            <Leaf className="absolute -bottom-4 -right-4 text-amber-200/50 w-24 h-24 rotate-12" />
          </motion.div>

          <StatCard 
            icon={CloudRain} 
            title="Rain Risk" 
            value={`${weather?.precipitationChance ?? 0}%`} 
            trend={(weather?.precipitationChance ?? 0) >= 70 ? "High" : (weather?.precipitationChance ?? 0) >= 40 ? "Moderate" : "Low"} 
            color="bg-sky-100 text-sky-700"
            data={(weather?.rainPrediction?.hourlyChances?.length ? weather.rainPrediction.hourlyChances : [10, 15, 8, 20, 12, 12]).map((x) => Math.max(5, x))}
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, title, value, trend, color, data = [] }) {
  return (
    <motion.div variants={item}>
      <Card className="flex flex-col gap-4 p-8 bg-white border border-emerald-100 shadow-lg shadow-emerald-900/5 group overflow-hidden">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-emerald-900/40 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
          <div className="flex items-baseline justify-between mb-4">
            <h3 className="text-3xl font-black text-emerald-950 font-display">{value}</h3>
            <span className="text-[10px] font-black px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg">
              {trend}
            </span>
          </div>
          <div className="flex items-end gap-1 h-8">
            {data.map((h, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className={`flex-1 ${color.split(' ')[0]} opacity-20 rounded-t-sm group-hover:opacity-40 transition-opacity`}
              />
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function FeatureCard({ icon: Icon, title, desc, buttonText, color, isUpload }) {
  return (
    <motion.div variants={item}>
      <Card className="group h-full flex flex-col justify-between p-10 overflow-hidden relative border-none shadow-2xl shadow-emerald-900/5 bg-white">
        <div className="relative z-10">
          <div className={`w-16 h-16 rounded-[1.5rem] ${color} text-white flex items-center justify-center mb-8 shadow-lg group-hover:rotate-12 transition-transform duration-500`}>
            <Icon size={32} />
          </div>
          <h3 className="text-2xl font-black text-emerald-950 mb-4 tracking-tight font-display">{title}</h3>
          <p className="text-emerald-900/60 font-medium leading-relaxed mb-10 max-w-sm">
            {desc}
          </p>
        </div>
        
        <Button className={cn("w-fit group/btn z-10", color)}>
          {isUpload ? <UploadCloud size={18} className="group-hover/btn:-translate-y-1 transition-transform" /> : null}
          {buttonText}
          {!isUpload ? <ArrowUpRight size={18} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" /> : null}
        </Button>

        {/* Growing Plant on Hover */}
        <div className="absolute -bottom-10 -right-10 w-32 h-32 opacity-10 group-hover:opacity-20 group-hover:scale-125 transition-all duration-700 pointer-events-none">
          <Sprout size={120} className="text-emerald-900" />
        </div>
      </Card>
    </motion.div>
  );
}
