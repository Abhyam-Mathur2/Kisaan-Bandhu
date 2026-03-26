import { motion } from "framer-motion";
import { 
  Sprout, 
  Bug, 
  CloudRain, 
  TrendingUp, 
  Leaf, 
  ArrowUpRight,
  UploadCloud,
  MapPin
} from "lucide-react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";

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
  return (
    <div className="space-y-10">
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-[2.5rem] bg-emerald-600 p-10 text-white"
      >
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-black mb-2 tracking-tight">Hello Farmer John! 👋</h2>
            <p className="text-emerald-50/80 font-medium text-lg">
              The weather today is perfect for sowing <span className="text-white font-bold underline decoration-emerald-300 underline-offset-4">Wheat</span>.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-emerald-500/30 p-4 rounded-3xl backdrop-blur-sm border border-emerald-400/20">
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-100">Temp</span>
              <span className="text-2xl font-black">24°C</span>
            </div>
            <div className="w-px h-10 bg-emerald-400/30" />
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-100">Humidity</span>
              <span className="text-2xl font-black">62%</span>
            </div>
            <div className="w-px h-10 bg-emerald-400/30" />
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span className="text-sm font-bold">Punjab, IN</span>
            </div>
          </div>
        </div>
        
        {/* Abstract Background Decor */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-emerald-500 rounded-full blur-[100px] opacity-50" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-teal-400 rounded-full blur-[80px] opacity-30" />
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div variants={item}>
          <Card className="flex flex-col gap-4 p-8 glass-dark bg-white border-emerald-50 overflow-hidden relative">
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
              <div className="w-full h-2 bg-emerald-50 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "82%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
            </div>
          </Card>
        </motion.div>
        <StatCard 
          icon={CloudRain} 
          title="Rain Probability" 
          value="12%" 
          trend="Low" 
          color="bg-blue-100 text-blue-700"
        />
        <StatCard 
          icon={TrendingUp} 
          title="Market Trend" 
          value="Stable" 
          trend="↑ 2.4%" 
          color="bg-orange-100 text-orange-700"
        />
        <StatCard 
          icon={Sprout} 
          title="Active Crops" 
          value="3" 
          trend="Healthy" 
          color="bg-teal-100 text-teal-700"
        />
      </motion.div>

      {/* Main Feature Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <FeatureCard 
          icon={Sprout}
          title="Crop Recommendation"
          desc="AI analyzed soil health, climate data and historical trends to find the best crop for your land."
          buttonText="Get Recommendation"
          color="bg-emerald-600"
        />
        <FeatureCard 
          icon={Bug}
          title="Disease Detection"
          desc="Upload a clear photo of your crop leaf and our AI will identify potential diseases and remedies."
          buttonText="Upload Image"
          isUpload={true}
          color="bg-emerald-600"
        />
        <FeatureCard 
          icon={CloudRain}
          title="Climate Risk"
          desc="Predictive insights on droughts, heavy rains, and pest outbreaks for the next 30 days."
          buttonText="Check Risks"
          color="bg-emerald-600"
        />
        <FeatureCard 
          icon={TrendingUp}
          title="Market Insights"
          desc="Live data on crop prices in your local Mandis and national trends to maximize your profit."
          buttonText="View Prices"
          color="bg-emerald-600"
        />
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, title, value, trend, color }) {
  return (
    <motion.div variants={item}>
      <Card className="flex flex-col gap-4 p-8 glass-dark bg-white border-emerald-50">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-emerald-900/40 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-black text-emerald-950">{value}</h3>
            <span className="text-[10px] font-black px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg">
              {trend}
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function FeatureCard({ icon: Icon, title, desc, buttonText, color, isUpload }) {
  return (
    <motion.div variants={item}>
      <Card className="group h-full flex flex-col justify-between p-10 overflow-hidden relative border-none shadow-2xl shadow-emerald-900/5">
        <div className="relative z-10">
          <div className={`w-16 h-16 rounded-[1.5rem] ${color} text-white flex items-center justify-center mb-8 shadow-lg shadow-emerald-200 group-hover:rotate-12 transition-transform duration-500`}>
            <Icon size={32} />
          </div>
          <h3 className="text-3xl font-black text-emerald-950 mb-4 tracking-tight">{title}</h3>
          <p className="text-emerald-900/60 font-medium leading-relaxed mb-10 max-w-sm">
            {desc}
          </p>
        </div>
        
        <Button className="w-fit group/btn">
          {isUpload ? <UploadCloud size={18} className="group-hover/btn:-translate-y-1 transition-transform" /> : null}
          {buttonText}
          {!isUpload ? <ArrowUpRight size={18} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" /> : null}
        </Button>

        {/* Decor */}
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700" />
      </Card>
    </motion.div>
  );
}
