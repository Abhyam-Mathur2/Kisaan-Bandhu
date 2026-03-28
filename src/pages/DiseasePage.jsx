import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Camera, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  ShieldCheck, 
  Stethoscope,
  RefreshCcw,
  X,
  ChevronRight,
  Loader2,
  Bug
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import { useLanguage } from '../context/LanguageContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

const DiseasePage = () => {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size too large (max 5MB)");
        return;
      }
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      // Update this with your actual backend URL
      const response = await fetch('http://localhost:8000/disease-detection/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Failed to connect to AI server. Please ensure the backend is running.");
      // Fallback for demo if backend is not reachable
      /*
      setResult({
        disease: "Tomato Late Blight",
        disease_hindi: "टमाटर पछेती झुलसा",
        confidence: 0.92,
        symptoms: "Large, dark brown, water-soaked patches on leaves and stems. Fruit develops firm, brown spots.",
        prevention: "Avoid planting near potatoes. Choose resistant varieties.",
        recommendation: "Apply fungicides immediately. Remove and destroy infected plants to prevent spread."
      });
      */
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-2">
          {t("diseaseDetection", "Disease Detection")}
        </h2>
        <p className="text-slate-500 text-sm font-medium">
          Upload a clear photo of the infected plant leaf for instant AI-powered diagnosis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <Card className="p-0 overflow-hidden border-2 border-dashed border-emerald-100 bg-emerald-50/30">
            <div 
              className={cn(
                "relative group cursor-pointer transition-all duration-300",
                !previewUrl ? "aspect-square flex flex-col items-center justify-center p-12" : "p-4"
              )}
              onClick={() => !previewUrl && fileInputRef.current.click()}
            >
              {previewUrl ? (
                <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-emerald-950/20">
                  <img 
                    src={previewUrl} 
                    alt="Leaf preview" 
                    className="w-full h-auto object-cover max-h-[400px]"
                  />
                  <button 
                    onClick={(e) => { e.stopPropagation(); reset(); }}
                    className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-20 h-20 rounded-3xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 group-hover:bg-amber-100 group-hover:text-amber-600 transition-all duration-500 shadow-xl shadow-emerald-200/50">
                    <Camera size={36} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Take or Upload Photo</h3>
                  <p className="text-slate-500 text-xs text-center leading-relaxed">
                    Drag and drop your leaf image here or click to browse.<br/>
                    <span className="font-bold text-emerald-600">Supports: JPG, PNG (Max 5MB)</span>
                  </p>
                </>
              )}
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/*"
                onChange={handleImageSelect}
              />
            </div>
          </Card>

          {previewUrl && !result && (
            <div className="flex gap-4">
              <Button 
                variant="primary" 
                className="flex-1 py-4 text-sm font-black uppercase tracking-widest shadow-xl"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    ANALYZING...
                  </>
                ) : (
                  <>
                    <Stethoscope size={18} />
                    DIAGNOSE NOW
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="px-6 border-2"
                onClick={reset}
                disabled={isAnalyzing}
              >
                <RefreshCcw size={18} />
              </Button>
            </div>
          )}

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3"
            >
              <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
              <p className="text-xs font-bold text-red-600 leading-relaxed">{error}</p>
            </motion.div>
          )}

          <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100">
             <div className="flex items-center gap-2 mb-3">
                <Info size={16} className="text-amber-600" />
                <h4 className="text-[10px] font-black text-amber-800 uppercase tracking-widest">Expert Tips</h4>
             </div>
             <ul className="space-y-3">
                {[
                  "Ensure the leaf is well-lit and in focus.",
                  "Capture both healthy and infected parts of the leaf.",
                  "Take the photo from a top-down perspective."
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 text-[11px] font-bold text-amber-900/70 leading-relaxed">
                    <ChevronRight size={14} className="shrink-0 mt-0.5 text-amber-400" />
                    {tip}
                  </li>
                ))}
             </ul>
          </div>
        </div>

        {/* Results Section */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {isAnalyzing ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6 bg-white rounded-[40px] border border-emerald-50 shadow-sm"
              >
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center text-emerald-600">
                    <Bug size={32} />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 mb-2">Analyzing Sample</h3>
                  <p className="text-slate-500 text-xs font-medium leading-relaxed">
                    Our AI model is scanning the leaf texture for<br/>pathogen signatures...
                  </p>
                </div>
              </motion.div>
            ) : result ? (
              <motion.div 
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Result Header */}
                <Card className="p-6 bg-gradient-to-br from-emerald-600 to-emerald-800 text-white border-none shadow-2xl shadow-emerald-950/20">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                      <CheckCircle2 size={24} />
                    </div>
                    <div className="px-3 py-1 bg-amber-400 text-emerald-950 text-[10px] font-black rounded-full uppercase tracking-widest">
                      {Math.round(result.confidence * 100)}% Confidence
                    </div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black mb-1">{result.disease}</h3>
                    <p className="text-emerald-100 text-lg font-bold hindi-text">{result.disease_hindi}</p>
                  </div>
                </Card>

                {/* Detail Cards */}
                <div className="space-y-4">
                   <DetailCard 
                    icon={AlertCircle} 
                    title="Symptoms" 
                    content={result.symptoms} 
                    color="text-amber-600"
                    bgColor="bg-amber-50"
                  />
                   <DetailCard 
                    icon={ShieldCheck} 
                    title="Prevention" 
                    content={result.prevention} 
                    color="text-emerald-600"
                    bgColor="bg-emerald-50"
                  />
                   <DetailCard 
                    icon={CheckCircle2} 
                    title="Recommended Actions" 
                    content={result.recommendation} 
                    color="text-blue-600"
                    bgColor="bg-blue-50"
                  />
                </div>

                <Button 
                  variant="outline" 
                  className="w-full py-4 text-xs font-black uppercase tracking-widest bg-white border-2"
                  onClick={reset}
                >
                  <RefreshCcw size={16} />
                  TEST ANOTHER LEAF
                </Button>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-4 border-2 border-dashed border-slate-100 rounded-[40px] opacity-60 bg-slate-50/30">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <Bug size={24} />
                </div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                  Diagnosis Result will appear here
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const DetailCard = ({ icon: Icon, title, content, color, bgColor }) => (
  <Card className="p-5 hover:scale-[1.02] transition-transform duration-300">
    <div className="flex gap-4">
      <div className={cn("p-3 rounded-2xl shrink-0 h-fit shadow-sm", bgColor, color)}>
        <Icon size={20} />
      </div>
      <div>
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-slate-400">{title}</h4>
        <p className="text-[13px] font-bold text-slate-700 leading-relaxed">
          {content}
        </p>
      </div>
    </div>
  </Card>
);

export default DiseasePage;
