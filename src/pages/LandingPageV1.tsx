import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, MapPin, Star, ArrowRight, ChevronRight, Zap, Clock, ThumbsUp, Car, Sparkles } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const CATEGORIES = [
  { name: "Car Washing", icon: "🚗", color: "gradient-card-teal", slug: "car-washing", img: "/images/car_wash_hero.jpg", isCarWash: true },
  { name: "Plumbing", icon: "🔧", color: "gradient-card-blue", slug: "plumbing", img: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=400" },
  { name: "Electrical", icon: "⚡", color: "gradient-card-yellow", slug: "electrical", img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400" },
  { name: "Cleaning", icon: "🧹", color: "gradient-card-teal", slug: "cleaning", img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=400" },
  { name: "Carpentry", icon: "🪵", color: "gradient-card-orange", slug: "carpentry", img: "/images/carpentry_1784957804509.png" },
  { name: "Painting", icon: "🎨", color: "gradient-card-purple", slug: "painting", img: "/images/painting_1784957866923.png" },
  { name: "AC Repair", icon: "❄️", color: "gradient-card-cyan", slug: "ac-repair", img: "/images/ac_unit_indoor.png" },
  { name: "Appliance Repair", icon: "🔌", color: "gradient-card-indigo", slug: "appliance-repair", img: "/images/appliance_repair_1784957826666.png" },
  { name: "Salon at Home", icon: "💇", color: "gradient-card-rose", slug: "salon", img: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=400" },
  { name: "Pest Control", icon: "🦟", color: "gradient-card-green", slug: "pest-control", img: "/images/pest_control_1784957845702.png" },
  { name: "Security Cameras", icon: "📷", color: "gradient-card-indigo", slug: "security", img: "/images/security_camera_1784958017938.png" },
];

const getFeaturedProviders = () => {
  const latestProviderName = typeof window !== 'undefined' ? localStorage.getItem('latestProviderName') : null;
  const p1Name = latestProviderName || "Rajesh Kumar";
  const p1Initials = p1Name.substring(0, 2).toUpperCase();

  return [
    {
      name: p1Name,
      category: "Plumbing Expert",
      rating: 4.9,
      reviews: 127,
      jobs: 340,
      price: 499,
      initials: p1Initials,
      color: "bg-blue-500",
    },
    {
    name: "Priya Sharma",
    category: "Deep Cleaning Pro",
    rating: 4.8,
    reviews: 98,
    jobs: 210,
    price: 799,
    initials: "PS",
    color: "bg-teal-500",
  },
  {
    name: "Suresh Mehta",
    category: "AC & Appliances",
    rating: 4.7,
    reviews: 204,
    jobs: 520,
    price: 399,
    initials: "SM",
    color: "bg-orange-500",
  },
];
};

const FEATURED_PROVIDERS = getFeaturedProviders();

const TESTIMONIALS = [
  {
    name: "Ananya Verma",
    service: "Deep Cleaning",
    quote: "Booked a cleaner in 2 minutes, and they arrived exactly on time. The house looks spotless. Will definitely use ServiWay again!",
    rating: 5,
    initials: "AV",
    color: "bg-purple-500",
  },
  {
    name: "Vikram Singh",
    service: "Plumbing Repair",
    quote: "Rajesh fixed our pipe leak within an hour. Professional, honest pricing, and super reliable. ServiWay is my go-to now.",
    rating: 5,
    initials: "VS",
    color: "bg-blue-500",
  },
  {
    name: "Meera Pillai",
    service: "Salon at Home",
    quote: "Getting salon services at home is now so easy and affordable. The stylist was amazing and the pricing was transparent.",
    rating: 5,
    initials: "MP",
    color: "bg-rose-500",
  },
];

const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Search & Discover",
    desc: "Browse verified professionals by service type and location. Filter by rating, price, and availability.",
    icon: Search,
    color: "bg-blue-100 text-blue-600",
  },
  {
    step: 2,
    title: "Book Instantly",
    desc: "Choose your preferred time slot, confirm your address, and complete payment securely in minutes.",
    icon: Clock,
    color: "bg-teal-100 text-teal-600",
  },
  {
    step: 3,
    title: "Relax & Rate",
    desc: "Your provider arrives, completes the job to your satisfaction, and you rate the experience.",
    icon: ThumbsUp,
    color: "bg-orange-100 text-orange-600",
  },
];

export default function LandingPageV1() {
  const [searchService, setSearchService] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchService) params.set("q", searchService);
    if (searchLocation) params.set("location", searchLocation);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="gradient-teal relative overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white/5" />
          <div className="absolute top-1/2 -left-32 w-64 h-64 rounded-full bg-white/5" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full bg-white/5" />
        </div>

        <div className="container-app relative z-10 py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur text-white text-sm font-medium px-4 py-2 rounded-full mb-6 border border-white/20">
              <Zap className="w-4 h-4" fill="currentColor" />
              Pune's #1 Doorstep Home &amp; Auto Care Platform
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight text-balance" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Professional Pune Services{" "}
              <span className="text-teal-200">at Your Doorstep</span>
            </h1>
            <p className="text-lg md:text-xl text-teal-100 mb-10 max-w-xl mx-auto">
              Book trusted plumbers, electricians, cleaners &amp; daily society car washes across Pune. Verified local professionals, transparent pricing.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="bg-white rounded-2xl p-2 shadow-modal flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto">
              <div className="flex items-center gap-2 flex-1 px-3">
                <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="What service do you need?"
                  value={searchService}
                  onChange={(e) => setSearchService(e.target.value)}
                  className="flex-1 h-11 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent min-w-0"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>
              <div className="w-px bg-brand-border hidden sm:block" />
              <div className="flex items-center gap-2 flex-1 px-3">
                <MapPin className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Area in Pune (e.g. Kothrud, Baner, Wakad)..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="flex-1 h-11 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent min-w-0"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>
              <button type="submit" className="btn-primary sm:w-auto w-full text-sm">
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white border-b border-brand-border py-5">
        <div className="container-app">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { icon: "👥", value: "50,000+", label: "Happy Customers" },
              { icon: "✅", value: "2,000+", label: "Verified Providers" },
              { icon: "⭐", value: "4.8★", label: "Average Rating" },
              { icon: "🛡️", value: "100%", label: "Satisfaction Guaranteed" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center py-2">
                <span className="text-2xl mb-1">{item.icon}</span>
                <span className="text-lg font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{item.value}</span>
                <span className="text-xs text-slate-500" style={{ fontFamily: "'Inter', sans-serif" }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="section bg-brand-bg">
        <div className="container-app">
          <div className="text-center mb-10">
            <h2 className="section-title">What can we help you with?</h2>
            <p className="section-subtitle mt-2">Choose from 10+ professional home services</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {CATEGORIES.map((cat: any) => (
              <Link
                key={cat.slug}
                to={cat.isCarWash ? "/car-wash" : `/search?category=${cat.slug}`}
                className={`group block p-1.5 rounded-xl ${cat.color} hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative`}
              >
                <div className="relative w-full aspect-[2/1] rounded-lg overflow-hidden bg-white">
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  
                  {/* Dark gradient overlay for text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                  
                  {/* Title text */}
                  <div className="absolute bottom-2 left-0 right-0 text-center px-2">
                    <span className="text-sm font-bold text-white leading-tight shadow-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {cat.name}
                    </span>
                  </div>

                  {/* Top-left icon badge */}
                  <div className={`absolute top-2 left-2 w-7 h-7 rounded-md ${cat.color} flex items-center justify-center text-sm shadow-sm backdrop-blur-sm bg-white/50`}>
                    {cat.icon}
                  </div>

                  {cat.isCarWash && (
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-emerald-500 text-white text-[9px] font-extrabold uppercase shadow">
                      Monthly Subs
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CAR WASH SUBSCRIPTION SPOTLIGHT BANNER ===== */}
      <section className="py-12 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white relative overflow-hidden">
        <div className="container-app relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 bg-slate-800/60 border border-teal-500/30 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <div className="flex-1 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/40">
                <Sparkles className="w-3.5 h-3.5" />
                NEW LAUNCH: DOORSTEP CAR WASH SUBSCRIPTIONS
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                Monthly Car Washing for Individuals, Societies & Mega Townships
              </h2>
              <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
                Cleaned daily right in your basement parking before 8:30 AM! Gated societies and integrated townships partner with us to eliminate unverified washers and <strong>earn 10%–15% revenue back into the society maintenance fund</strong>.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/car-wash"
                  className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/30 flex items-center gap-2 transition-all"
                >
                  <Car className="w-4 h-4" /> View Plans & Subscribe
                </Link>
                <Link
                  to="/car-wash"
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 font-semibold text-sm border border-slate-700 flex items-center gap-2 transition-all"
                >
                  Partner Your Society RWA
                </Link>
              </div>
            </div>

            <div className="w-full lg:w-96 rounded-2xl overflow-hidden border border-teal-500/30 shadow-2xl relative group">
              <img
                src="/images/car_wash_hero.jpg"
                alt="Doorstep Car Washing Subscription"
                className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent flex items-end p-4">
                <div className="text-xs">
                  <span className="font-bold text-white block">Morning Doorstep Cleaning</span>
                  <span className="text-teal-300">From ₹449/mo • 10%–15% Society Revenue Share</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURED PROVIDERS ===== */}
      <section className="section bg-white">
        <div className="container-app">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="section-title">Top-Rated Providers Near You</h2>
              <p className="text-slate-500 text-sm mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>Hand-picked, verified professionals</p>
            </div>
            <Link to="/search" className="btn-ghost hidden sm:flex items-center gap-1 text-sm">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURED_PROVIDERS.map((p) => (
              <div key={p.name} className="card-hover p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-full ${p.color} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                    {p.initials}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 text-base truncate" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{p.name}</h3>
                    <span className="inline-block mt-0.5 px-2 py-0.5 bg-teal-50 text-teal-700 text-xs font-semibold rounded-full">{p.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4" fill={i < Math.floor(p.rating) ? "#F97316" : "none"} color={i < Math.floor(p.rating) ? "#F97316" : "#E2E8F0"} />
                  ))}
                  <span className="text-sm font-semibold text-slate-700 ml-1">{p.rating}</span>
                  <span className="text-xs text-slate-400">({p.reviews} reviews)</span>
                </div>
                <p className="text-xs text-slate-500 mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>{p.jobs}+ jobs completed</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400">Starting from</span>
                    <div className="text-lg font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>₹{p.price}</div>
                  </div>
                  <Link to={`/search`} className="btn-primary text-sm py-2 px-4">Book Now</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="section bg-brand-bg">
        <div className="container-app">
          <div className="text-center mb-12">
            <h2 className="section-title">How ServiWay Works</h2>
            <p className="section-subtitle mt-2">Three simple steps to get any home service done</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-teal-200 to-teal-400 -translate-y-1/2" style={{ top: '2.5rem' }} />

            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="flex flex-col items-center text-center relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-white shadow-card flex items-center justify-center mb-5 relative">
                  <div className={`w-12 h-12 rounded-xl ${step.color} flex items-center justify-center`}>
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-7 h-7 bg-teal-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {step.step}
                  </div>
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{step.title}</h3>
                <p className="text-sm text-slate-500 max-w-xs leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/signup" className="btn-primary inline-flex items-center gap-2">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="section bg-white">
        <div className="container-app">
          <div className="text-center mb-10">
            <h2 className="section-title">What Our Customers Say</h2>
            <p className="section-subtitle mt-2">Real reviews from real customers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="card p-6">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4" fill="#F97316" color="#F97316" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-5 italic" style={{ fontFamily: "'Inter', sans-serif" }}>"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.name}</div>
                    <div className="text-xs text-slate-400">{t.service}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="gradient-teal py-16">
        <div className="container-app text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Ready to book your first service?
          </h2>
          <p className="text-teal-100 mb-8 text-lg">Join 50,000+ happy customers. No subscription needed.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-teal-700 font-bold rounded-lg hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]">
              Book a Service Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/provider/onboarding" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-transparent border-2 border-white/60 text-white font-semibold rounded-lg hover:bg-white/10 transition-all">
              Become a Provider
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
