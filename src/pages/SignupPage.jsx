import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, ArrowLeft } from "lucide-react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";

export function SignupPage() {
  const navigate = useNavigate();

  const handleSignup = (e) => {
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
        Back to Home
      </Link>

      <Card className="w-full max-w-md p-10 glass border-none">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-emerald-950 mb-3 tracking-tight">Get Started</h1>
          <p className="text-emerald-900/50 font-medium">Join thousands of smart farmers today</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          <Input 
            label="Full Name" 
            type="text" 
            placeholder="John Doe"
            icon={User}
            required
          />
          <Input 
            label="Email Address" 
            type="email" 
            placeholder="farmer@kisan.com"
            icon={Mail}
            required
          />
          <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••"
            icon={Lock}
            required
          />

          <Button type="submit" size="lg" className="w-full h-14">
            Create Account
          </Button>
        </form>

        <p className="text-center mt-10 text-emerald-900/50 font-medium">
          Already have an account?{" "}
          <Link to="/login" className="text-emerald-600 font-bold hover:underline">
            Login
          </Link>
        </p>
      </Card>
    </div>
  );
}
