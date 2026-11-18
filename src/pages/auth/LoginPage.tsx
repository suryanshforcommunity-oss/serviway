import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Zap, AlertCircle, Wrench, Shield, User as UserIcon } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, signIn, signInWithGoogle, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  useEffect(() => {
    if (user) {
      if (user.role === "provider") {
        navigate("/provider/dashboard", { replace: true });
      } else if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/seeker/dashboard", { replace: true });
      }
    }
  }, [user, navigate]);

  const onSubmit = async (data: LoginForm) => {
    setError("");
    setLoading(true);
    try {
      const role = await signIn(data.email, data.password);
      if (role === "provider") {
        navigate("/provider/dashboard");
      } else if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/seeker/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      const role = await signInWithGoogle();
      if (role === "provider") {
        navigate("/provider/dashboard");
      } else if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/seeker/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role: "provider" | "seeker" | "admin") => {
    loginAsDemo(role);
    if (role === "provider") {
      navigate("/provider/dashboard");
    } else if (role === "admin") {
      navigate("/admin");
    } else {
      navigate("/seeker/dashboard");
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
              Welcome Back
            </h2>
            <p className="text-teal-100 text-base leading-relaxed">
              Sign in to manage your bookings, messages, and profile.
            </p>
          </div>
        </div>
        <div className="relative z-10 text-teal-200 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
          © 2026 ServiWay. All rights reserved.
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-brand-bg">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>ServiWay</span>
          </Link>

          <h1 className="text-2xl font-bold text-slate-900 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Welcome Back</h1>
          <p className="text-slate-500 text-sm mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>Please enter your details to sign in.</p>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span style={{ fontFamily: "'Inter', sans-serif" }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="input-label">Email Address</label>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                className={`input-field ${errors.email ? "input-error" : ""}`}
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-slate-700" style={{ fontFamily: "'Inter', sans-serif" }}>Password</label>
                <Link to="/forgot-password" className="text-sm font-medium text-teal-600 hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  {...register("password", { required: "Password required" })}
                  className={`input-field pr-12 ${errors.password ? "input-error" : ""}`}
                  placeholder="••••••••"
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? (
                <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Signing in...</span>
              ) : "Sign In"}
            </button>
          </form>

          <div className="relative my-6">
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
            Sign in with Google
          </button>

          {/* Quick Demo Logins Section */}
          <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              <span>⚡ Quick One-Click Demo Access</span>
            </div>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleDemoLogin("provider")}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all"
              >
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4" />
                  <span>Login as Service Provider</span>
                </div>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono">Instant Dashboard →</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin("seeker")}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors"
                >
                  <UserIcon className="w-3.5 h-3.5 text-slate-500" />
                  <span>Customer Demo</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin("admin")}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 text-slate-500" />
                  <span>Admin Demo</span>
                </button>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-slate-500 mt-6" style={{ fontFamily: "'Inter', sans-serif" }}>
            Don't have an account?{" "}
            <Link to="/signup" className="text-teal-600 font-semibold hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
