import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import LandingPageV1 from "./LandingPageV1";
import LandingPageV2 from "./LandingPageV2";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && user.role === "provider") {
      navigate("/provider/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  if (!loading && user && user.role === "provider") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-600 text-sm font-semibold">Redirecting to Provider Portal...</p>
        </div>
      </div>
    );
  }

  return theme === 'urban' ? <LandingPageV2 /> : <LandingPageV1 />;
}
