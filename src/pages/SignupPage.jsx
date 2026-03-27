import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { User, Phone, Lock, ArrowLeft } from "lucide-react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { useLanguage } from "../context/LanguageContext";

export function SignupPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validatePhone = (value) => {
    return /^[0-9]{10}$/.test(value);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setError("");

    if (!fullName || !phone || !password) {
      setError("All fields are required.");
      return;
    }

    if (!validatePhone(phone)) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    console.log("[Auth] Signup attempt", { fullName, phone });
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
          <h1 className="text-4xl font-black text-emerald-950 mb-3 tracking-tight">{t("getStartedTitle", "Get Started")}</h1>
          <p className="text-emerald-900/50 font-medium">{t("joinFarmers", "Join thousands of smart farmers today")}</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          <Input 
            label={t("fullName", "Full Name")} 
            type="text" 
            placeholder="John Doe"
            icon={User}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <div>
            <Input 
              label={t("phoneNumber", "Phone Number")} 
              type="tel" 
              placeholder="9876543210"
              icon={Phone}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              maxLength="10"
              required
            />
            <p className="text-[10px] text-emerald-600/60 ml-1 mt-1">Enter 10-digit mobile number</p>
          </div>
          <Input 
            label={t("password", "Password")} 
            type="password" 
            placeholder="••••••••"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

          <Button type="submit" size="lg" className="w-full h-14">
            {t("createAccount", "Create Account")}
          </Button>
        </form>

        <p className="text-center mt-10 text-emerald-900/50 font-medium">
          {t("alreadyAccount", "Already have an account?")} {" "}
          <Link to="/login" className="text-emerald-600 font-bold hover:underline">
            {t("login", "Login")}
          </Link>
        </p>
      </Card>
    </div>
  );
}
