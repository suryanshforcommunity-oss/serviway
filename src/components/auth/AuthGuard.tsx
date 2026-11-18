import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import type { UserRole } from "../../types";

interface Props {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export function AuthGuard({ children, allowedRoles, redirectTo = "/login" }: Props) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm font-medium">Loading ServiWay...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to={redirectTo} replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === "provider") return <Navigate to="/provider/dashboard" replace />;
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    return <Navigate to="/seeker/dashboard" replace />;
  }

  return <>{children}</>;
}
