import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="container-app py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-white" fill="white" />
              </div>
              <span className="text-xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                ServiWay
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs">
              Connecting you with trusted home service professionals in your city. Fast, reliable, and guaranteed.
            </p>
            <div className="flex gap-3">
              {['FB', 'TW', 'IG', 'IN'].map((network, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-teal-600 transition-colors text-slate-300 text-xs font-bold">
                  {network}
                </a>
              ))}
            </div>
          </div>

          {/* For Seekers */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>For Seekers</h4>
            <ul className="space-y-2.5">
              {["Browse Services", "How It Works", "Pricing", "Reviews"].map((item) => (
                <li key={item}>
                  <Link to="/search" className="text-sm hover:text-teal-400 transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Providers */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>For Providers</h4>
            <ul className="space-y-2.5">
              {["Join ServiWay", "Provider Dashboard", "Earnings", "Support"].map((item) => (
                <li key={item}>
                  <Link to="/provider/onboarding" className="text-sm hover:text-teal-400 transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Company</h4>
            <ul className="space-y-2.5">
              <li><Link to="/about" className="text-sm hover:text-teal-400 transition-colors">About Us</Link></li>
              <li><a href="#" className="text-sm hover:text-teal-400 transition-colors">Careers</a></li>
              <li><Link to="/privacy" className="text-sm hover:text-teal-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm hover:text-teal-400 transition-colors">Terms of Service</Link></li>
              <li><a href="#" className="text-sm hover:text-teal-400 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm">© 2026 ServiWay. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-teal-600 text-white px-2 py-0.5 rounded-full">v1.0</span>
            <span className="text-xs">Made with ❤️ in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
