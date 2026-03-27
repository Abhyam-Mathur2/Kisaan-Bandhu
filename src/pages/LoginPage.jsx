import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { useLanguage } from "../context/LanguageContext";

export function LoginPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6">
      <Link 
        to="/" 
        className="self-start flex items-center gap-2 text-emerald-700 font-bold mb-10 hover:translate-x-[-4px] transition-transform"
      >
        <ArrowLeft size={20} />
        {t("backToHome", "Back to Home")}
      </Link>

      <Card className="w-full max-w-md p-10 glass border-none">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-emerald-950 mb-3 tracking-tight">{t("welcomeBack", "Welcome Back")}</h1>
          <p className="text-emerald-900/50 font-medium">{t("continueJourney", "Continue your smart farming journey")}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <Input 
            label={t("emailAddress", "Email Address")} 
            type="email" 
            placeholder="farmer@kisan.com"
            icon={Mail}
            required
          />
          <Input 
            label={t("password", "Password")} 
            type="password" 
            placeholder="••••••••"
            icon={Lock}
            required
          />
          
          <div className="flex justify-end">
            <button type="button" className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
              {t("forgotPassword", "Forgot Password?")}
            </button>
          </div>

          <Button type="submit" size="lg" className="w-full h-14">
            {t("signIn", "Sign In")}
          </Button>
        </form>

        <p className="text-center mt-10 text-emerald-900/50 font-medium">
          {t("noAccount", "Don't have an account?")} {" "}
          <Link to="/signup" className="text-emerald-600 font-bold hover:underline">
            {t("createAccount", "Create Account")}
          </Link>
        </p>
      </Card>
    </div>
  );
}
