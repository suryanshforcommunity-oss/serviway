import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Zap, CheckCircle, Search, Wrench, AlertCircle } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import type { UserRole } from "../../types";

interface SignUpForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

export default function SignUpPage() {
  const [role, setRole] = useState<UserRole>("seeker");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<SignUpForm>();

  const onSubmit = async (data: SignUpForm) => {
    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await signUp(data.email, data.password, `${data.firstName} ${data.lastName}`, role);
      if (role === "provider") navigate("/provider/onboarding");
      else navigate("/seeker/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle(role);
      if (role === "provider") navigate("/provider/onboarding");
      else navigate("/seeker/dashboard");
    } catch (err: any) {
      setError(err.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-2/5 gradient-teal flex-col justify-between p-10 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10" />
          <div className="absolute bottom-20 -left-16 w-48 h-48 rounded-full bg-white/10" />
        </div>
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="text-xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>ServiWay</span>
          </Link>
        </div>
        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Your home, perfectly maintained
            </h2>
            <p className="text-teal-100 text-base leading-relaxed">
              Join thousands of customers who trust ServiWay for all their home service needs.
            </p>
          </div>
          <div className="space-y-4">
            {["50,000+ happy customers across India", "2,000+ verified & background-checked providers", "Service guarantee & 24/7 support"].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-teal-200 flex-shrink-0" />
                <span className="text-white text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>{item}</span>
              </div>
            ))}
          </div>
          <div className="bg-white/15 rounded-xl p-5 border border-white/20">
            <div className="flex gap-1 mb-2">
              {[...Array(5)].map((_, i) => <span key={i} className="text-yellow-300">★</span>)}
            </div>
            <p className="text-white text-sm italic mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
              "ServiWay saved us from a plumbing disaster at midnight. The provider arrived in 30 minutes!"
            </p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-white text-sm font-bold">A</div>
              <div>
                <div className="text-white text-sm font-semibold">Ananya Verma</div>
                <div className="text-teal-200 text-xs">Kothrud, Pune</div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative z-10 text-teal-200 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
          © 2026 ServiWay. All rights reserved.
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-brand-bg overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>ServiWay</span>
          </Link>

          <h1 className="text-2xl font-bold text-slate-900 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Create your account</h1>
          <p className="text-slate-500 text-sm mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>Join ServiWay to get started</p>

          {/* Role Toggle */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setRole("seeker")}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                role === "seeker"
                  ? "border-teal-600 bg-teal-50 text-teal-700"
                  : "border-brand-border bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              <Search className={`w-5 h-5 ${role === "seeker" ? "text-teal-600" : "text-slate-400"}`} />
              <div className="text-center">
                <div className="font-semibold text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>I'm Looking for</div>
                <div className="font-semibold text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>Services</div>
              </div>
              {role === "seeker" && <CheckCircle className="w-4 h-4 text-teal-600" />}
            </button>
            <button
              type="button"
              onClick={() => setRole("provider")}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                role === "provider"
                  ? "border-teal-600 bg-teal-50 text-teal-700"
                  : "border-brand-border bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              <Wrench className={`w-5 h-5 ${role === "provider" ? "text-teal-600" : "text-slate-400"}`} />
              <div className="text-center">
                <div className="font-semibold text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>I'm a Service</div>
                <div className="font-semibold text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>Provider</div>
              </div>
              {role === "provider" && <CheckCircle className="w-4 h-4 text-teal-600" />}
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span style={{ fontFamily: "'Inter', sans-serif" }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="input-label">First Name</label>
                <input
                  {...register("firstName", { required: "Required" })}
                  className={`input-field ${errors.firstName ? "input-error" : ""}`}
                  placeholder="John"
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="input-label">Last Name</label>
                <input
                  {...register("lastName", { required: "Required" })}
                  className={`input-field ${errors.lastName ? "input-error" : ""}`}
                  placeholder="Doe"
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <label className="input-label">Email Address</label>
              <input
                type="email"
                {...register("email", { required: "Email is required", pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" } })}
                className={`input-field ${errors.email ? "input-error" : ""}`}
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="input-label">Phone Number</label>
              <input
                type="tel"
                {...register("phone", { required: "Phone is required" })}
                className={`input-field ${errors.phone ? "input-error" : ""}`}
                placeholder="+91 98765 43210"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="input-label">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  {...register("password", { required: "Password required", minLength: { value: 8, message: "Min 8 characters" } })}
                  className={`input-field pr-12 ${errors.password ? "input-error" : ""}`}
                  placeholder="At least 8 characters"
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="input-label">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  {...register("confirmPassword", { required: "Please confirm password" })}
                  className={`input-field pr-12 ${errors.confirmPassword ? "input-error" : ""}`}
                  placeholder="Repeat your password"
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <div className="flex items-start gap-2">
              <input type="checkbox" {...register("terms", { required: true })} id="terms" className="mt-0.5 rounded border-brand-border text-teal-600 focus:ring-teal-500" />
              <label htmlFor="terms" className="text-sm text-slate-600 cursor-pointer" style={{ fontFamily: "'Inter', sans-serif" }}>
                I agree to the{" "}
                <a href="#" className="text-teal-600 underline hover:text-teal-700">Terms of Service</a> and{" "}
                <a href="#" className="text-teal-600 underline hover:text-teal-700">Privacy Policy</a>
              </label>
            </div>
            {errors.terms && <p className="text-red-500 text-xs">You must agree to continue</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? (
                <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating account...</span>
              ) : "Create Account"}
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-brand-border" /></div>
            <div className="relative text-center"><span className="bg-brand-bg px-3 text-xs text-slate-400" style={{ fontFamily: "'Inter', sans-serif" }}>or continue with</span></div>
          </div>

          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border-2 border-brand-border rounded-lg hover:border-slate-300 hover:shadow-sm transition-all text-sm font-semibold text-slate-700"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign up with Google
          </button>

          <p className="text-center text-sm text-slate-500 mt-6" style={{ fontFamily: "'Inter', sans-serif" }}>
            Already have an account?{" "}
            <Link to="/login" className="text-teal-600 font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
