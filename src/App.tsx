import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthGuard } from "./components/auth/AuthGuard";

// Pages
import LandingPage from "./pages/LandingPage";
import SignUpPage from "./pages/auth/SignUpPage";
import LoginPage from "./pages/auth/LoginPage";
import SearchPage from "./pages/search/SearchPage";
import ProviderProfile from "./pages/provider/ProviderProfile";
import ProviderOnboarding from "./pages/provider/ProviderOnboarding";
import ProviderDashboard from "./pages/provider/ProviderDashboard";
import SeekerDashboard from "./pages/seeker/SeekerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AboutPage from "./pages/static/AboutPage";
import PrivacyPage from "./pages/static/PrivacyPage";
import TermsPage from "./pages/static/TermsPage";
import OptionWheelDemoPage from "./pages/OptionWheelDemoPage";
import CarWashPage from "./pages/carwash/CarWashPage";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/car-wash" element={<CarWashPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/option-wheel" element={<OptionWheelDemoPage />} />

          {/* Static provider routes MUST come before the dynamic :id route */}
          <Route path="/provider/onboarding" element={
            <AuthGuard allowedRoles={["provider"]} redirectTo="/login">
              <ProviderOnboarding />
            </AuthGuard>
          } />
          <Route path="/provider/dashboard" element={<AuthGuard allowedRoles={["provider"]}><ProviderDashboard /></AuthGuard>} />

          {/* Dynamic provider profile - must come AFTER static routes */}
          <Route path="/provider/:id" element={<ProviderProfile />} />

          {/* Other dashboards */}
          <Route path="/seeker/dashboard" element={<AuthGuard allowedRoles={["seeker"]}><SeekerDashboard /></AuthGuard>} />
          <Route path="/admin" element={<AuthGuard allowedRoles={["admin"]}><AdminDashboard /></AuthGuard>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
