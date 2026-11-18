import { Link } from "react-router-dom";
import { Zap, Shield, Star, Users, Target, Heart } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

const stats = [
  { value: "5,000+", label: "Verified Pune Providers" },
  { value: "1,20,000+", label: "Pune Bookings Completed" },
  { value: "4.9/5", label: "Average Pune Rating" },
  { value: "Pune Exclusive", label: "Kothrud to Hinjewadi & Hadapsar" },
];

const values = [
  { icon: Shield, title: "Trust First", desc: "Every Pune provider is background-checked, Aadhaar-verified, and reviewed by real local residents before accepting bookings.", color: "bg-teal-50 text-teal-600" },
  { icon: Star, title: "Quality Guaranteed", desc: "Not satisfied? We'll send another certified Pune professional for free or provide a full instant refund.", color: "bg-orange-50 text-orange-600" },
  { icon: Users, title: "Fair Pune Community", desc: "We believe in dignified earnings for local service professionals and honest, transparent rates for Pune households.", color: "bg-purple-50 text-purple-600" },
  { icon: Target, title: "Transparent Pricing", desc: "What you see is what you pay across Pune. No hidden transportation charges, no surprise fees. Ever.", color: "bg-blue-50 text-blue-600" },
  { icon: Heart, title: "Proudly Built for Pune", desc: "Designed specifically for the unique gated societies, IT parks, and residential neighborhoods of Pune, Maharashtra.", color: "bg-red-50 text-red-600" },
  { icon: Zap, title: "Instant Doorstep Booking", desc: "Book an expert plumber, electrician, cleaner or daily car wash in under 60 seconds with verified local arrival times.", color: "bg-yellow-50 text-yellow-600" },
];

const team = [
  { name: "Suryansh Shelke", role: "Chief Executive Officer (CEO)", initials: "SS", color: "bg-teal-600", desc: "Leading Pune's premier doorstep service revolution." },
  { name: "Aditya Fale", role: "Chief Technology Officer (CTO)", initials: "AF", color: "bg-purple-600", desc: "Architecting real-time society dispatch and matching algorithms." },
  { name: "Pratik Kasar", role: "Chief Marketing Officer (CMO)", initials: "PK", color: "bg-orange-500", desc: "Driving community partnerships across Pune townships." },
  { name: "Shravani Pande", role: "Chief Financial Officer (CFO)", initials: "SP", color: "bg-blue-600", desc: "Overseeing transparent pricing and provider earnings growth." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <Navbar />

      {/* Hero */}
      <div className="bg-white border-b border-brand-border">
        <div className="container-app py-20 text-center">
          <span className="inline-block px-3 py-1 bg-teal-50 text-teal-700 text-xs font-semibold rounded-full mb-4 uppercase tracking-wide">Serving Pune Exclusively</span>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            We're on a mission to make home &amp; auto care<br className="hidden md:block" /> <span className="text-teal-600">100% trustworthy across Pune</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            ServiWay is Pune's dedicated home services and society car care platform. Founded in Pune, engineered for Pune residents.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-teal-600 text-white">
        <div className="container-app py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.value}</div>
                <div className="text-teal-200 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Origin Story */}
      <div className="container-app py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>The Problem We're Solving in Pune</h2>
          <div className="space-y-4 text-slate-600 leading-relaxed text-base">
            <p>Finding dependable home repair professionals and reliable daily car wash cleaners across Pune societies—from Hinjewadi to Hadapsar—was filled with uncertainty, fluctuating prices, and unverified personnel.</p>
            <p>Pune's rapid growth created massive gated townships like Amanora Park Town, Life Republic, and Blue Ridge, where residents struggled with unorganized service workers, while skilled technicians lacked consistent income and fair recognition.</p>
            <p>ServiWay was founded in Pune by Suryansh Shelke, Aditya Fale, Pratik Kasar, and Shravani Pande to create a structured, transparent ecosystem. We rigorously vet every professional, standardize society parking operations, and provide transparent digital tracking.</p>
            <p className="font-semibold text-slate-800">Pune is our home, and delivering excellence to Pune residents is our daily commitment.</p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-slate-50 border-y border-brand-border py-20">
        <div className="container-app">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>What We Stand For</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v) => (
              <div key={v.title} className="card p-6">
                <div className={`w-12 h-12 rounded-xl ${v.color} flex items-center justify-center mb-4`}>
                  <v.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{v.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="container-app py-20">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Executive Leadership</h2>
        <p className="text-center text-slate-500 text-sm max-w-lg mx-auto mb-12">The founding team leading Pune's fastest growing on-demand home and society care network.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {team.map((t) => (
            <div key={t.name} className="card p-6 text-center border border-slate-200 hover:shadow-lg transition-all">
              <div className={`w-20 h-20 rounded-2xl ${t.color} flex items-center justify-center text-white font-extrabold text-2xl mx-auto mb-4 shadow-md`}>
                {t.initials}
              </div>
              <div className="font-bold text-slate-900 text-base">{t.name}</div>
              <div className="text-xs font-semibold text-teal-700 mt-1 mb-2">{t.role}</div>
              <p className="text-xs text-slate-500 leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-teal-600 text-white">
        <div className="container-app py-16 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Join the ServiWay Community</h2>
          <p className="text-teal-100 mb-8 max-w-xl mx-auto">Whether you're looking for services or ready to offer yours, we're here for you.</p>
          <div className="flex gap-4 justify-center">
            <Link to="/search" className="bg-white text-teal-700 font-bold px-6 py-3 rounded-lg hover:bg-teal-50 transition-colors">Find a Service</Link>
            <Link to="/signup" className="border border-white text-white font-bold px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors">Become a Provider</Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
