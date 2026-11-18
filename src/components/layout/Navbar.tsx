import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import {
  Zap, Menu, X, ChevronDown, LogOut, LayoutDashboard, User, Palette
} from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role === "provider") return "/provider/dashboard";
    if (user.role === "admin") return "/admin";
    return "/seeker/dashboard";
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-brand-border shadow-sm">
      <div className="container-app">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={user?.role === "provider" ? "/provider/dashboard" : "/"} className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              ServiWay
            </span>
          </Link>

          {/* Desktop nav links */}
          {user?.role === "provider" ? (
            <div className="hidden md:flex items-center gap-6">
              <Link to="/provider/dashboard" className="text-sm font-bold text-teal-700 hover:text-teal-800 transition-colors flex items-center gap-1.5">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
              <Link to="/provider/dashboard?tab=carwash" className="text-sm font-medium text-slate-700 hover:text-teal-600 transition-colors">
                Daily Work Roster
              </Link>
              <Link to={`/provider/${user.uid}`} className="text-sm font-medium text-slate-700 hover:text-teal-600 transition-colors">
                My Public Profile
              </Link>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                Provider Portal
              </span>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors">
                Home
              </Link>
              <Link to="/car-wash" className="relative flex items-center gap-1.5 text-sm font-bold text-teal-700 hover:text-teal-800 transition-colors">
                <span>Car Wash</span>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-full">
                  New
                </span>
              </Link>
              <Link to="/search" className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors">
                Services
              </Link>
              <Link to="/#how-it-works" className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors">
                How It Works
              </Link>
              {!user && (
                <Link to="/provider/onboarding" className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors">
                  Become a Provider
                </Link>
              )}
            </div>
          )}

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            <button 
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-full border border-slate-200 mr-2 transition-colors"
              title="Toggle Design Theme"
            >
              <Palette className="w-3.5 h-3.5" />
              {theme === 'urban' ? 'Urban Mode' : 'Vibe Mode'}
            </button>
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-700 max-w-[120px] truncate">{user.name}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-modal border border-brand-border py-1 z-50">
                    <Link
                      to={getDashboardLink()}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-700"
                    >
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link
                      to={user?.role === "provider" ? `/provider/${user?.uid}` : getDashboardLink()}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-700"
                    >
                      <User className="w-4 h-4" /> {user?.role === "provider" ? "My Profile" : "My Account"}
                    </Link>
                    <hr className="my-1 border-brand-border" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm">Sign In</Link>
                <Link to="/signup" className="btn-primary text-sm py-2">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-brand-border mt-2 pt-4 space-y-2">
            <button 
              onClick={() => { toggleTheme(); setMobileOpen(false); }}
              className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-50 flex items-center gap-2 border-l-4 border-teal-600"
            >
              <Palette className="w-4 h-4" />
              Switch to {theme === 'urban' ? 'Vibe Mode' : 'Urban Mode'}
            </button>
            {user?.role === "provider" ? (
              <>
                <Link to="/provider/dashboard" className="block px-4 py-2 text-sm font-bold text-teal-700 bg-teal-50 rounded-lg" onClick={() => setMobileOpen(false)}>
                  Provider Dashboard
                </Link>
                <Link to="/provider/dashboard?tab=carwash" className="block px-4 py-2 text-sm font-medium text-slate-700 hover:text-teal-600" onClick={() => setMobileOpen(false)}>
                  Daily Work Roster
                </Link>
                <Link to={`/provider/${user.uid}`} className="block px-4 py-2 text-sm font-medium text-slate-700 hover:text-teal-600" onClick={() => setMobileOpen(false)}>
                  My Public Profile
                </Link>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm font-medium text-red-600">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/" className="block px-4 py-2 text-sm font-medium text-slate-700 hover:text-teal-600" onClick={() => setMobileOpen(false)}>Home</Link>
                <Link to="/car-wash" className="flex items-center justify-between px-4 py-2 text-sm font-bold text-teal-700 bg-teal-50/50 rounded-lg" onClick={() => setMobileOpen(false)}>
                  <span>Car Wash Subscriptions</span>
                  <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 bg-teal-600 text-white rounded-full">New</span>
                </Link>
                <Link to="/search" className="block px-4 py-2 text-sm font-medium text-slate-700 hover:text-teal-600" onClick={() => setMobileOpen(false)}>Services</Link>
                {!user && (
                  <Link to="/provider/onboarding" className="block px-4 py-2 text-sm font-medium text-slate-700 hover:text-teal-600" onClick={() => setMobileOpen(false)}>Become a Provider</Link>
                )}
                {user ? (
                  <>
                    <Link to={getDashboardLink()} className="block px-4 py-2 text-sm font-medium text-teal-600" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm font-medium text-red-600">Sign Out</button>
                  </>
                ) : (
                  <div className="px-4 pt-2 flex gap-2">
                    <Link to="/login" className="btn-secondary text-sm py-2 flex-1" onClick={() => setMobileOpen(false)}>Sign In</Link>
                    <Link to="/signup" className="btn-primary text-sm py-2 flex-1" onClick={() => setMobileOpen(false)}>Sign Up</Link>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
