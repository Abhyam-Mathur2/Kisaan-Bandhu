import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { STORAGE_KEYS } from "../data/storageKeys";

const LanguageContext = createContext(null);

const translations = {
  en: {
    navHome: "Home",
    navFeatures: "Features",
    navLogin: "Login",
    navGetStarted: "Get Started",
    dashboardTitle: "Dashboard",
    cropRecommendation: "Crop Recommendation",
    diseaseDetection: "Disease Detection",
    climateRisk: "Climate Risk",
    weather: "Weather",
    alerts: "Alerts",
    finance: "Finance",
    marketInsights: "Market Insights",
    settings: "Settings",
    logout: "Logout",
    offlineBanner: "Offline mode: showing saved data where available.",
    backToHome: "Back to Home",
    welcomeBack: "Welcome Back",
    continueJourney: "Continue your smart farming journey",
    phoneNumber: "Phone Number",
    password: "Password",
    forgotPassword: "Forgot Password?",
    signIn: "Sign In",
    noAccount: "Don't have an account?",
    createAccount: "Create Account",
    getStartedTitle: "Get Started",
    joinFarmers: "Join thousands of smart farmers today",
    fullName: "Full Name",
    alreadyAccount: "Already have an account?",
    login: "Login",
    nextGenAssistant: "Next-Gen Farming Assistant",
    landingTagline: "A smart farming companion that thinks for you. AI-powered crop recommendations, disease detection, and climate insights.",
    launchDashboard: "Launch Dashboard",
    joinCommunity: "Join Community",
    smartRecs: "Smart Recs",
    smartRecsDesc: "AI analyzed soil and climate",
    healthGuard: "Health Guard",
    healthGuardDesc: "Instant crop disease detection",
    realtime: "Real-time",
    realtimeDesc: "Live market and weather data",
  },
  hi: {
    navHome: "होम",
    navFeatures: "फ़ीचर्स",
    navLogin: "लॉगिन",
    navGetStarted: "शुरू करें",
    dashboardTitle: "डैशबोर्ड",
    cropRecommendation: "फसल सुझाव",
    diseaseDetection: "रोग पहचान",
    climateRisk: "जलवायु जोखिम",
    weather: "मौसम",
    alerts: "अलर्ट",
    finance: "वित्त",
    marketInsights: "बाजार जानकारी",
    settings: "सेटिंग्स",
    logout: "लॉगआउट",
    offlineBanner: "ऑफलाइन मोड: जहां उपलब्ध है वहां सहेजा हुआ डेटा दिखाया जा रहा है।",
    backToHome: "होम पर वापस",
    welcomeBack: "फिर से स्वागत है",
    continueJourney: "अपनी स्मार्ट खेती यात्रा जारी रखें",
    phoneNumber: "मोबाइल नंबर",
    password: "पासवर्ड",
    forgotPassword: "पासवर्ड भूल गए?",
    signIn: "साइन इन",
    noAccount: "खाता नहीं है?",
    createAccount: "खाता बनाएं",
    getStartedTitle: "शुरू करें",
    joinFarmers: "आज ही हजारों स्मार्ट किसानों से जुड़ें",
    fullName: "पूरा नाम",
    alreadyAccount: "पहले से खाता है?",
    login: "लॉगिन",
    nextGenAssistant: "अगली पीढ़ी का खेती सहायक",
    landingTagline: "एक स्मार्ट खेती साथी जो आपके लिए सोचता है। एआई आधारित फसल सुझाव, रोग पहचान और जलवायु जानकारी।",
    launchDashboard: "डैशबोर्ड खोलें",
    joinCommunity: "समुदाय से जुड़ें",
    smartRecs: "स्मार्ट सुझाव",
    smartRecsDesc: "मिट्टी और जलवायु का एआई विश्लेषण",
    healthGuard: "फसल सुरक्षा",
    healthGuardDesc: "तुरंत फसल रोग पहचान",
    realtime: "रीयल-टाइम",
    realtimeDesc: "लाइव बाजार और मौसम डेटा",
  },
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    if (typeof window === "undefined") {
      return "en";
    }
    return localStorage.getItem(STORAGE_KEYS.language) || "en";
  });

  useEffect(() => {
    function handleStorage(event) {
      if (event.key === STORAGE_KEYS.language && event.newValue) {
        setLanguage(event.newValue);
      }
    }

    function handleLocalChange(event) {
      if (event.detail) {
        setLanguage(event.detail);
      }
    }

    window.addEventListener("storage", handleStorage);
    window.addEventListener("kb:language-change", handleLocalChange);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("kb:language-change", handleLocalChange);
    };
  }, []);

  const value = useMemo(() => {
    const dict = translations[language] || translations.en;
    return {
      language,
      setLanguage,
      t: (key, fallback = "") => dict[key] || fallback || key,
    };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
}
