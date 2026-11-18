import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, MapPin, Star, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { getStoredOrMockProviders, DEFAULT_MOCK_PROVIDERS } from "../../lib/mockProviders";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "Plumbing";
  const locationParam = searchParams.get("location") || "Kothrud, Pune";
  
  const [searchService, setSearchService] = useState(categoryParam);
  const [searchLocation, setSearchLocation] = useState(locationParam);
  const [priceRange, setPriceRange] = useState(5000);
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProviders();
  }, [categoryParam]);

  const fetchProviders = async () => {
    setLoading(true);
    const localProviders = getStoredOrMockProviders();
    try {
      const q = query(collection(db, "users"), where("role", "==", "provider"));
      const querySnapshot = await getDocs(q);
      const firestoreProviders: any[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        firestoreProviders.push({
          id: doc.id,
          name: data.name || "Provider",
          photoUrl: data.photoUrl || "",
          initials: (data.name || "P").substring(0, 2).toUpperCase(),
          color: data.color || "bg-teal-600",
          rating: data.rating || 4.8,
          reviews: data.reviews || 0,
          distance: data.distance || "2.5 km away",
          experience: data.experience || "3 years exp",
          price: data.price || 499,
          categories: data.categories || ["General"],
          featured: data.featured || false,
          available: true,
          description: data.description || "Experienced service provider."
        });
      });

      // Merge firestore with local providers without duplicate IDs
      const combined = [...firestoreProviders];
      for (const lp of localProviders) {
        if (!combined.some(p => p.id === lp.id)) {
          combined.push(lp);
        }
      }
      setProviders(combined.length > 0 ? combined : localProviders);
    } catch (error) {
      console.warn("Firestore fetch error, falling back to verified local providers:", error);
      setProviders(localProviders);
    } finally {
      setLoading(false);
    }
  };

  const seedDatabase = async () => {
    setLoading(true);
    try {
      // 1. Immediately persist full rich provider list to local storage
      localStorage.setItem("serviway_seeded_providers", JSON.stringify(DEFAULT_MOCK_PROVIDERS));
      setProviders(DEFAULT_MOCK_PROVIDERS);

      // 2. Attempt Firestore write asynchronously without blocking or failing the user
      Promise.allSettled(
        DEFAULT_MOCK_PROVIDERS.map(p => setDoc(doc(db, "users", p.id), p))
      ).then(results => {
        const fulfilled = results.filter(r => r.status === "fulfilled").length;
        console.log(`Firestore seeded: ${fulfilled}/${DEFAULT_MOCK_PROVIDERS.length} records written`);
      }).catch(err => {
        console.warn("Firestore seeding restricted by rules, mock data active in local store:", err);
      });

      alert("✅ Test Database Seeded Successfully!\n\nLoaded verified professionals across Plumbing, Electrical, Car Detailing, Cleaning, Carpentry, and AC Repair.");
      fetchProviders();
    } catch (error) {
      console.error("Local seed error:", error);
      alert("Test data seeded with local fallback.");
    } finally {
      setLoading(false);
    }
  };

  const filteredProviders = providers.filter(p => 
    (searchService ? p.categories.some((c: string) => c.toLowerCase().includes(searchService.toLowerCase())) : true) &&
    p.price <= priceRange
  );

  
  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <Navbar />
      
      {/* Search Header */}
      <div className="bg-white border-b border-brand-border pt-6 pb-8">
        <div className="container-app">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            <Link to="/" className="hover:text-teal-600">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/search" className="hover:text-teal-600">Services</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-800 font-medium">{categoryParam}</span>
          </div>
          
          <h1 className="text-3xl font-bold text-slate-900 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {categoryParam} Services in {locationParam.split(',')[0]}
          </h1>
          <div className="flex items-center justify-between mb-6">
            <p className="text-slate-500" style={{ fontFamily: "'Inter', sans-serif" }}>
              {filteredProviders.length} verified providers found near you
            </p>
            <button onClick={seedDatabase} className="btn-secondary text-xs px-3 py-1">
              Seed Test Data
            </button>
          </div>
          
          {/* Active Search Bar */}
          <div className="bg-white rounded-xl border border-brand-border p-2 shadow-sm flex flex-col sm:flex-row gap-2 max-w-3xl">
            <div className="flex items-center gap-2 flex-1 px-3">
              <Search className="w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                value={searchService}
                onChange={(e) => setSearchService(e.target.value)}
                className="flex-1 h-10 text-sm focus:outline-none bg-transparent"
                placeholder="Search services..."
              />
            </div>
            <div className="w-px bg-brand-border hidden sm:block" />
            <div className="flex items-center gap-2 flex-1 px-3">
              <MapPin className="w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="flex-1 h-10 text-sm focus:outline-none bg-transparent"
                placeholder="Location..."
              />
            </div>
            <button className="btn-primary sm:w-auto w-full py-2">Update</button>
          </div>
        </div>
      </div>
      
      {/* Main Layout */}
      <div className="container-app py-8 flex-1 flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar (Filters) */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 flex items-center gap-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </h3>
            <button className="text-sm text-teal-600 font-medium hover:underline">Clear All</button>
          </div>
          
          <hr className="border-brand-border" />
          
          {/* Price Range */}
          <div>
            <h4 className="font-semibold text-slate-800 mb-4 text-sm">Price Range</h4>
            <input 
              type="range" 
              min="0" 
              max="5000" 
              value={priceRange} 
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-teal-600 mb-2"
            />
            <div className="flex items-center justify-between text-sm text-slate-600 font-medium">
              <span>₹0</span>
              <span>₹{priceRange}</span>
            </div>
          </div>
          
          {/* Rating */}
          <div>
            <h4 className="font-semibold text-slate-800 mb-3 text-sm">Rating</h4>
            <div className="space-y-2">
              {['5★ Only', '4★ & above', '3★ & above'].map(rating => (
                <label key={rating} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-brand-border text-teal-600 focus:ring-teal-500" />
                  <span className="text-sm text-slate-600">{rating}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Distance */}
          <div>
            <h4 className="font-semibold text-slate-800 mb-3 text-sm">Distance</h4>
            <div className="space-y-2">
              {['Within 2km', 'Within 5km', 'Within 10km'].map(dist => (
                <label key={dist} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="distance" className="text-teal-600 focus:ring-teal-500 border-brand-border" />
                  <span className="text-sm text-slate-600">{dist}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Sub-categories */}
          <div>
            <h4 className="font-semibold text-slate-800 mb-3 text-sm">Sub-categories</h4>
            <div className="space-y-2">
              {['Pipe Repair', 'Bathroom Fitting', 'Water Heater', 'Drain Cleaning'].map(sub => (
                <label key={sub} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-brand-border text-teal-600 focus:ring-teal-500" />
                  <span className="text-sm text-slate-600">{sub}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>
        
        {/* Right Content (Results) */}
        <div className="flex-1">
          {/* Sort & Count */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <span className="text-sm text-slate-600 font-medium">Showing {filteredProviders.length} providers</span>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-500">Sort by:</span>
              <select className="border border-brand-border rounded-lg bg-white px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium">
                <option>Relevance</option>
                <option>Rating: High to Low</option>
                <option>Price: Low to High</option>
                <option>Distance</option>
              </select>
            </div>
          </div>
          
          {/* Provider List */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12 text-slate-500">Loading providers...</div>
            ) : filteredProviders.length === 0 ? (
              <div className="text-center py-12 text-slate-500">No providers found. Try adjusting filters or click "Seed Test Data".</div>
            ) : (
              filteredProviders.map(p => (
                <div key={p.id} className={`card p-5 flex flex-col sm:flex-row gap-5 relative ${!p.available ? 'opacity-75' : ''}`}>
                {!p.available && (
                  <div className="absolute inset-0 bg-white/40 z-10 flex items-center justify-center rounded-card">
                    <span className="bg-slate-800 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">Fully Booked Today</span>
                  </div>
                )}
                
                {/* Provider Avatar */}
                <div className={`w-24 h-24 sm:w-32 sm:h-32 rounded-xl ${p.color} flex items-center justify-center flex-shrink-0 text-white font-bold text-3xl shadow-inner`}>
                  {p.initials}
                </div>
                
                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{p.name}</h3>
                        {p.featured && <span className="badge bg-orange-100 text-orange-700 text-[10px] uppercase tracking-wide">Featured</span>}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        {p.categories.map((c: string) => (
                          <span key={c} className="bg-teal-50 text-teal-700 px-2 py-0.5 rounded-md font-medium">{c}</span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="text-left sm:text-right">
                      <div className="flex items-center sm:justify-end gap-1 mb-1 text-sm font-bold">
                        <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
                        <span>{p.rating}</span>
                        <span className="text-slate-400 font-normal">({p.reviews})</span>
                      </div>
                      <span className="text-xs text-slate-500 flex items-center sm:justify-end gap-1">
                        <MapPin className="w-3 h-3" /> {p.distance}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2 mt-2 leading-relaxed">{p.description}</p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
                    <div className="flex items-center gap-4 text-xs font-medium w-full sm:w-auto">
                      <span className="text-slate-700 bg-slate-100 px-2 py-1 rounded">{p.experience}</span>
                      <div>
                        <span className="text-slate-400">Starting from</span>
                        <span className="text-lg font-bold text-slate-900 ml-1">₹{p.price}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Link to={`/provider/${p.id}`} className="btn-secondary flex-1 sm:flex-none text-sm py-2 px-4 z-20">View Profile</Link>
                      <Link to={`/provider/${p.id}#book`} className="btn-primary flex-1 sm:flex-none text-sm py-2 px-6 z-20">Book Now</Link>
                    </div>
                  </div>
                </div>
              </div>
            )))}
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-10">
            <button className="p-2 rounded-lg border border-brand-border text-slate-400 hover:bg-slate-50 disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
            <button className="w-10 h-10 rounded-lg bg-teal-600 text-white font-bold text-sm">1</button>
            <button className="w-10 h-10 rounded-lg hover:bg-slate-100 text-slate-600 font-medium text-sm">2</button>
            <button className="w-10 h-10 rounded-lg hover:bg-slate-100 text-slate-600 font-medium text-sm">3</button>
            <span className="text-slate-400">...</span>
            <button className="w-10 h-10 rounded-lg hover:bg-slate-100 text-slate-600 font-medium text-sm">8</button>
            <button className="p-2 rounded-lg border border-brand-border text-slate-600 hover:bg-slate-50"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
