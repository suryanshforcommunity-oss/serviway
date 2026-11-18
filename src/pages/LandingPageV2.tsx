import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, MapPin, Star, ChevronRight, Car, Sparkles } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const CATEGORIES = [
  { name: "Car Wash Subscriptions", img: "/images/car_wash_hero.jpg", slug: "car-washing", isCarWash: true },
  { name: "Women's Salon", img: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=400", slug: "salon" },
  { name: "Men's Salon", img: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=400", slug: "salon-men" },
  { name: "AC & Appliance Repair", img: "/images/ac_unit_indoor.png", slug: "ac-repair" },
  { name: "Cleaning & Pest Control", img: "/images/pest_control_1784957845702.png", slug: "cleaning" },
  { name: "Electricians", img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400", slug: "electrical" },
  { name: "Plumbers", img: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=400", slug: "plumbing" },
  { name: "Carpenters", img: "/images/carpentry_1784957804509.png", slug: "carpentry" },
  { name: "Painting & Waterproofing", img: "/images/painting_1784957866923.png", slug: "painting" },
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
    },
    {
      name: "Priya Sharma",
      category: "Deep Cleaning Pro",
      rating: 4.8,
      reviews: 98,
      jobs: 210,
      price: 799,
      initials: "PS",
    },
    {
      name: "Suresh Mehta",
      category: "AC & Appliances",
      rating: 4.7,
      reviews: 204,
      jobs: 520,
      price: 399,
      initials: "SM",
    },
    {
      name: "Amit Patel",
      category: "Electrician",
      rating: 4.9,
      reviews: 310,
      jobs: 850,
      price: 299,
      initials: "AP",
    },
  ];
};

const FEATURED_PROVIDERS = getFeaturedProviders();

export default function LandingPageV2() {
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
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section className="relative bg-white pt-16 pb-24 border-b border-slate-200">
        <div className="container-app relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" /> Pune's Doorstep Home &amp; Auto Care Platform
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight max-w-4xl">
            Pune home services, on demand.
          </h1>
          
          {/* Search Box - Utilitarian & Clean */}
          <form onSubmit={handleSearch} className="w-full max-w-3xl flex flex-col md:flex-row shadow-lg border border-slate-200 rounded-lg overflow-hidden bg-white mt-4">
            <div className="flex-1 flex items-center px-4 py-4 md:border-r border-slate-200">
              <MapPin className="w-5 h-5 text-slate-400 mr-3" />
              <input
                type="text"
                placeholder="Select your area in Pune (e.g. Kothrud, Baner, Wakad)"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full text-slate-900 outline-none text-base placeholder:text-slate-400 font-medium"
              />
            </div>
            <div className="flex-[2] flex items-center px-4 py-4">
              <Search className="w-5 h-5 text-slate-400 mr-3" />
              <input
                type="text"
                placeholder="Search for 'AC Repair' or 'Cleaning'"
                value={searchService}
                onChange={(e) => setSearchService(e.target.value)}
                className="w-full text-slate-900 outline-none text-base placeholder:text-slate-400 font-medium"
              />
            </div>
          </form>
          
          <div className="mt-8 text-sm text-slate-500 font-medium flex gap-6 flex-wrap justify-center">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span> Women's Therapies</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span> Salon for Men</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span> Men's Therapies</span>
          </div>
        </div>
      </section>

      {/* ===== CATEGORY GRID ===== */}
      <section className="bg-white py-16 border-b border-slate-200">
        <div className="container-app">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">What are you looking for?</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {CATEGORIES.map((cat: any) => (
              <Link 
                key={cat.slug} 
                to={cat.isCarWash ? "/car-wash" : `/search?category=${cat.slug}`}
                className="group flex flex-col rounded-lg overflow-hidden border border-slate-200 hover:shadow-md transition-shadow bg-white relative"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100 relative">
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {cat.isCarWash && (
                    <span className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                      Daily Subscription
                    </span>
                  )}
                </div>
                <div className="p-4 flex items-center justify-between">
                  <span className="font-semibold text-slate-900 text-sm md:text-base group-hover:text-black">{cat.name}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-black transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CAR WASH HIGHLIGHT SECTION ===== */}
      <section className="bg-slate-900 text-white py-12 border-b border-slate-800">
        <div className="container-app">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-slate-800/80 border border-slate-700 rounded-2xl p-6 md:p-8">
            <div className="space-y-3 max-w-xl">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> New: Doorstep Car Wash Subscriptions
              </span>
              <h3 className="text-2xl font-bold text-white">
                Individual, Society & Township Models
              </h3>
              <p className="text-sm text-slate-300">
                Daily morning cleaning before 8:30 AM in your assigned parking slot. <strong>Housing Societies & Townships earn 10%–15% revenue share</strong> credited to the maintenance fund.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/car-wash"
                className="px-6 py-3 rounded-lg bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-sm flex items-center gap-2 transition-all"
              >
                <Car className="w-4 h-4" /> View Subscriptions & Calculator
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURED PROFESSIONALS ===== */}
      <section className="bg-slate-50 py-16">
        <div className="container-app">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Highly Rated Professionals</h2>
            <Link to="/search" className="text-sm font-semibold text-slate-900 hover:underline">See all</Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_PROVIDERS.map((p, idx) => (
              <div key={idx} className="bg-white rounded-lg border border-slate-200 p-5 hover:shadow-lg transition-shadow flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
                    {p.initials}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{p.name}</h3>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{p.category}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5 mb-4">
                  <div className="flex items-center gap-1 bg-green-700 text-white px-1.5 py-0.5 rounded text-xs font-bold">
                    {p.rating} <Star className="w-3 h-3 fill-current" />
                  </div>
                  <span className="text-xs text-slate-500">({p.reviews} reviews)</span>
                </div>
                
                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Starting from</div>
                    <div className="font-bold text-slate-900">₹{p.price}</div>
                  </div>
                  <Link to="/search" className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded hover:bg-slate-800 transition-colors">
                    Book
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== VALUE PROPOSITION (Clean) ===== */}
      <section className="bg-white py-16 border-t border-slate-200">
        <div className="container-app">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <div>
              <div className="w-12 h-12 rounded bg-slate-100 flex items-center justify-center mx-auto md:mx-0 mb-4">
                <span className="text-xl">✅</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Verified Professionals</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Every provider undergoes a strict background check and identity verification process.</p>
            </div>
            <div>
              <div className="w-12 h-12 rounded bg-slate-100 flex items-center justify-center mx-auto md:mx-0 mb-4">
                <span className="text-xl">🛡️</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Safe & Hygienic</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Our professionals follow strict safety protocols and use sanitized equipment for all services.</p>
            </div>
            <div>
              <div className="w-12 h-12 rounded bg-slate-100 flex items-center justify-center mx-auto md:mx-0 mb-4">
                <span className="text-xl">💳</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Transparent Pricing</h3>
              <p className="text-slate-600 text-sm leading-relaxed">No hidden charges. What you see is exactly what you pay upon job completion.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
