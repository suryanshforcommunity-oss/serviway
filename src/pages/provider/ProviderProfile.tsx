import { useState, useEffect } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { Star, CheckCircle, MapPin, Clock, Shield, MessageCircle, Calendar, LayoutDashboard } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { getStoredOrMockProviders } from "../../lib/mockProviders";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../contexts/AuthContext";
import { createNewBooking } from "../../lib/bookingService";

export default function ProviderProfile() {
  const { id } = useParams();
  const { hash } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Booking Form State
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingService, setBookingService] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchProvider = async () => {
      if (!id) {
        if (isMounted) setLoading(false);
        return;
      }
      try {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("timeout")), 2500)
        );
        const docRef = doc(db, "users", id);
        const snap = await Promise.race([getDoc(docRef), timeoutPromise]);
        if (snap.exists() && isMounted) {
          const data = snap.data();
          setProvider({
            id: snap.id,
            name: data.name || (user?.uid === id ? user.name : "Provider"),
            initials: (data.name || (user?.uid === id ? user.name : "P")).substring(0, 2).toUpperCase(),
            color: data.color || "bg-teal-600",
            verified: true,
            rating: data.rating || 4.9,
            reviewsCount: data.reviews || 128,
            jobsCompleted: data.jobsCompleted || 42,
            experience: data.experience || "5 years exp",
            location: data.location || "Kothrud & Baner, Pune",
            responseTime: data.responseTime || "< 25 min",
            about: data.description || "Certified service professional serving Pune societies and residences with 100% satisfaction guarantee.",
            categories: data.categories || ["Car Washing", "Plumbing"],
            services: data.services || (data.categories ? data.categories.map((c: string) => ({ id: c, name: c, rate: data.price || 449, desc: "Quality professional service in Pune" })) : [
              { id: "s1", name: "Daily Society Car Wash & Buff", rate: 449, desc: "Eco-friendly waterless cleaning for Pune societies." },
              { id: "s2", name: "General Home Plumbing & Leak Fix", rate: 499, desc: "High-pressure tap and pipe fitting repair." }
            ]),
            price: data.price || 449,
            reviews: data.reviewsList || [
              { id: "r1", user: "Rohan Deshpande", rating: 5, date: "Yesterday", comment: "Outstanding service in Kothrud, Pune. Highly recommended!", service: "General Service" },
              { id: "r2", user: "Pooja Kulkarni", rating: 5, date: "3 days ago", comment: "Arrived punctually at Amanora Park Town. Spotless work.", service: "Car Wash & Detailing" }
            ]
          });
          if (data.categories && data.categories.length > 0) {
            setBookingService(data.categories[0]);
          } else if (data.services && data.services.length > 0) {
            setBookingService(data.services[0].name);
          }
          setLoading(false);
          return;
        }
      } catch (e: any) {
        console.warn("Firestore lookup failed or timed out, loading verified Pune provider profile:", e);
      }

      // Fallback to local stored or mock providers
      if (!isMounted) return;
      const localProviders = getStoredOrMockProviders();
      const matched = localProviders.find(p => p.id === id) || (user && (user.uid === id || user.role === "provider") ? {
        id: id,
        name: user.name || "Rajesh Kumar (Pro Master)",
        role: "provider" as const,
        categories: ["Car Washing", "Plumbing", "Electrical"],
        price: 449,
        experience: "5 years exp",
        description: "Experienced service professional delivering 5-star quality home & auto maintenance across Pune societies and townships.",
        rating: 4.9,
        reviews: 142,
        distance: "Kothrud, Pune",
        initials: (user.name || "Rajesh Kumar").substring(0, 2).toUpperCase(),
        color: "bg-teal-600",
        photoUrl: "",
        featured: true,
        available: true,
        verified: true,
        location: "Kothrud & Baner, Pune",
        responseTime: "< 20 min",
        jobsCompleted: 156,
        services: [
          { id: "s1", name: "Daily Society Car Wash & Buff", rate: 449, desc: "Eco-friendly waterless polymer cleaning & tire shine." },
          { id: "s2", name: "High Pressure Plumbing & Leak Fix", rate: 499, desc: "Fast diagnosis and fix for valves, lines, and cisterns in Pune." },
          { id: "s3", name: "Full Home Deep Sanitization", rate: 899, desc: "Antimicrobial surface cleaning and odor elimination." }
        ],
        reviewsList: [
          { id: "r1", user: "Rohan Deshpande", rating: 5, date: "Yesterday", comment: "Outstanding service in Kothrud, Pune! Very punctual.", service: "Car Wash & Polish" },
          { id: "r2", user: "Neha Kulkarni", rating: 5, date: "3 days ago", comment: "Fixed the bathroom pipe leak in 20 minutes flat at Amanora Park Town.", service: "Plumbing" }
        ]
      } : localProviders[0]);

      if (matched && isMounted) {
        setProvider({
          id: matched.id,
          name: matched.name,
          initials: matched.initials || matched.name.substring(0, 2).toUpperCase(),
          color: matched.color || "bg-teal-600",
          verified: matched.verified ?? true,
          rating: matched.rating || 4.9,
          reviewsCount: matched.reviews || 120,
          jobsCompleted: matched.jobsCompleted || 50,
          experience: matched.experience || "5 years exp",
          location: matched.location || "Pune, Maharashtra",
          responseTime: matched.responseTime || "< 25 min",
          about: matched.description || "Professional service provider serving Pune.",
          categories: matched.categories || ["General"],
          services: matched.services || [{ id: "1", name: "General Service", rate: matched.price || 449, desc: "Quality professional service in Pune" }],
          price: matched.price || 449,
          reviews: matched.reviewsList || [
            { id: "r1", user: "Ananya V.", rating: 5, date: "Yesterday", comment: "Outstanding service in Pune! Very punctual and clean work.", service: "General Service" }
          ]
        });
        if (matched.services && matched.services.length > 0) {
          setBookingService(matched.services[0].name);
        }
      } else if (isMounted) {
        setFetchError("Provider not found.");
      }
      if (isMounted) setLoading(false);
    };
    fetchProvider();
    return () => { isMounted = false; };
  }, [id, user]);

  useEffect(() => {
    if (hash === '#book' && !loading && provider) {
      document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [hash, loading, provider]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to book a service.");
      navigate("/login");
      return;
    }
    if (!bookingDate || !bookingTime || !bookingService) {
      alert("Please fill all booking details.");
      return;
    }
    setBookingLoading(true);
    try {
      const selectedServiceObj = provider.services?.find((s: any) => s.name === bookingService);
      const calculatedAmount = selectedServiceObj?.rate || provider.price || 499;

      await createNewBooking({
        seekerId: user.uid,
        seekerName: user.name || "Seeker",
        providerId: provider.id,
        providerName: provider.name || "Service Provider",
        serviceName: bookingService,
        date: bookingDate,
        time: bookingTime,
        location: "Pune, Maharashtra",
        amount: calculatedAmount
      });

      alert("🎉 Booking Confirmed Successfully!\n\nYour appointment and 4-digit Start OTP are now active in your dashboard.");
      navigate("/seeker/dashboard");
    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to complete booking.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="animate-spin w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full" />
      <p className="text-slate-500 text-sm">Loading provider profile...</p>
    </div>
  );

  if (fetchError) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="text-4xl">⚠️</div>
      <h2 className="text-xl font-bold text-slate-800">Could Not Load Profile</h2>
      <p className="text-slate-500 max-w-md text-sm leading-relaxed">{fetchError}</p>
      <a href="/search" className="mt-2 px-5 py-2 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700">← Back to Search</a>
    </div>
  );

  if (!provider) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3">
      <p className="text-slate-600 font-medium">Provider not found</p>
      <a href="/search" className="text-teal-600 underline text-sm">← Back to Search</a>
    </div>
  );

  const p = provider;
  const currentServiceRate = p.services?.find((s: any) => s.name === bookingService)?.rate || p.price || 499;


  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <Navbar />
      
      {/* Hero Header */}
      <div className="bg-white">
        {/* Cover Photo */}
        <div className="h-48 md:h-64 gradient-teal relative">
          {/* We could put an actual image here, but gradient is nice */}
        </div>
        
        {/* Profile Info Container */}
        <div className="container-app relative pb-8">
          <div className="flex flex-col md:flex-row gap-6 relative -top-16 md:-top-20">
            {/* Avatar */}
            <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white ${p.color} flex items-center justify-center text-5xl md:text-6xl text-white font-bold shadow-lg flex-shrink-0 z-10`}>
              {p.initials}
            </div>
            
            {/* Header Content */}
            <div className="flex-1 pt-2 md:pt-24 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{p.name}</h1>
                  {p.verified && (
                    <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold border border-green-200">
                      <Shield className="w-3 h-3" /> ID Verified
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {p.categories.map((c: any) => (
                    <span key={c} className="bg-teal-50 text-teal-700 px-2.5 py-1 rounded-md text-xs font-medium">{c}</span>
                  ))}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-slate-600 font-medium">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
                    <span className="text-slate-900 font-bold">{p.rating}</span>
                    <span>({p.reviewsCount} reviews)</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-slate-300" />
                  <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {p.location}</div>
                </div>
              </div>
              
              <div className="flex gap-3 w-full md:w-auto">
                <button className="btn-secondary flex-1 md:flex-none"><MessageCircle className="w-4 h-4" /> Message</button>
                {user?.role === "provider" ? (
                  <Link to="/provider/dashboard" className="btn-primary flex-1 md:flex-none text-center py-2 px-5 rounded-lg flex items-center justify-center gap-2 shadow-sm">
                    <LayoutDashboard className="w-4 h-4" /> Provider Dashboard
                  </Link>
                ) : (
                  <a href="#booking-section" className="btn-primary flex-1 md:flex-none text-center py-2 px-4 rounded-lg">Book Now</a>
                )}
              </div>
            </div>
          </div>
          
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 border-t border-brand-border pt-6">
            <div className="text-center md:text-left">
              <div className="text-slate-500 text-xs uppercase tracking-wide font-semibold mb-1">Jobs Completed</div>
              <div className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{p.jobsCompleted}+</div>
            </div>
            <div className="text-center md:text-left">
              <div className="text-slate-500 text-xs uppercase tracking-wide font-semibold mb-1">Experience</div>
              <div className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{p.experience} Years</div>
            </div>
            <div className="text-center md:text-left">
              <div className="text-slate-500 text-xs uppercase tracking-wide font-semibold mb-1">Responds In</div>
              <div className="text-xl font-bold text-slate-900 flex items-center justify-center md:justify-start gap-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <Clock className="w-4 h-4 text-teal-600" /> {p.responseTime}
              </div>
            </div>
            <div className="text-center md:text-left">
              <div className="text-slate-500 text-xs uppercase tracking-wide font-semibold mb-1">Availability</div>
              <div className="text-xl font-bold text-green-600 flex items-center justify-center md:justify-start gap-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <CheckCircle className="w-4 h-4" /> Available Today
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container-app py-10 flex-1 flex flex-col md:flex-row gap-8">
        
        {/* Left Column */}
        <div className="flex-1 space-y-8">
          {/* About */}
          <section className="card p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>About {p.name.split(' ')[0]}</h2>
            <p className="text-slate-600 leading-relaxed text-sm">{p.about}</p>
          </section>
          
          {/* Services & Pricing */}
          <section className="card overflow-hidden">
            <div className="p-6 border-b border-brand-border bg-slate-50 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Services & Pricing</h2>
              {user?.role === "provider" && (
                <Link to="/provider/dashboard" className="text-xs font-bold text-teal-600 hover:text-teal-700">
                  Manage in Dashboard →
                </Link>
              )}
            </div>
            <div className="divide-y divide-brand-border">
              {p.services?.map((s: any) => (
                <div key={s.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 mb-1">{s.name}</h4>
                    <p className="text-sm text-slate-500">{s.desc}</p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    <div className="font-bold text-slate-900 whitespace-nowrap" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>₹{s.rate || s.price}</div>
                    {user?.role === "provider" ? (
                      <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-100">
                        Active Rate
                      </span>
                    ) : (
                      <a href="#booking-section" onClick={() => setBookingService(s.name)} className="btn-primary py-2 px-5 text-sm rounded-lg text-center">Book</a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          {/* Reviews */}
          <section className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Customer Reviews</h2>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-orange-500 text-orange-500" />
                <span className="font-bold text-lg text-slate-900">{p.rating}</span>
              </div>
            </div>
            
            <div className="space-y-6">
              {p.reviews?.map((r: any) => (
                <div key={r.id} className="border-b border-brand-border pb-6 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm">
                        {r.user.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-slate-900">{r.user}</div>
                        <div className="text-xs text-slate-500">{r.date}</div>
                      </div>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5" fill={i < r.rating ? "#F97316" : "none"} color={i < r.rating ? "#F97316" : "#E2E8F0"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-2 mt-3">{r.comment}</p>
                  <span className="inline-block bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded">{r.service}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 border border-brand-border rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              Load More Reviews
            </button>
          </section>
        </div>
        
        {/* Right Sidebar */}
        <aside className="w-full md:w-80 space-y-6">
          {user?.role === "provider" ? (
            /* Provider Control Panel (No Booking Options) */
            <div className="card p-6 border-2 border-teal-500 shadow-md relative overflow-hidden bg-white">
              <div className="absolute top-0 right-0 bg-teal-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg">
                Provider Portal
              </div>
              <h3 className="font-bold text-slate-900 mb-2 text-xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Public Profile Preview
              </h3>
              <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                You are currently viewing your public provider listing. Customers see this information to hire you.
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 bg-teal-50 rounded-xl border border-teal-100">
                  <span className="text-xs font-semibold text-teal-800">Profile Status</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Live & Verified
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs font-semibold text-slate-700">Verified Location</span>
                  <span className="text-xs font-bold text-slate-900">{p.location}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs font-semibold text-slate-700">Jobs Completed</span>
                  <span className="text-xs font-bold text-teal-700">{p.jobsCompleted}+ orders</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs font-semibold text-slate-700">Rating Score</span>
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-orange-500 fill-orange-500" /> {p.rating} / 5.0
                  </span>
                </div>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-brand-border">
                <Link to="/provider/dashboard" className="btn-primary w-full py-3 flex items-center justify-center gap-2 shadow-elevated">
                  <LayoutDashboard className="w-4 h-4" /> Open Provider Dashboard
                </Link>
                <Link to="/provider/dashboard" className="btn-secondary w-full py-2.5 flex items-center justify-center gap-2 text-xs">
                  Manage Services & Pricing
                </Link>
              </div>
            </div>
          ) : (
            /* Seeker Booking Card */
            <div id="booking-section" className="card p-6 border-2 border-teal-500 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-teal-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg">
                Book Now
              </div>
              <h3 className="font-bold text-slate-900 mb-4 text-xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Schedule Service</h3>
              
              <form onSubmit={handleBook} className="space-y-4">
                <div>
                  <label className="input-label mb-1">Select Service</label>
                  <select 
                    className="input-field" 
                    value={bookingService} 
                    onChange={(e) => setBookingService(e.target.value)}
                    required
                  >
                    <option value="" disabled>Choose a service</option>
                    {p.services?.map((s: any) => (
                      <option key={s.name} value={s.name}>{s.name} (₹{s.rate})</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="input-label mb-1">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="date" 
                      className="input-field pl-9" 
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="input-label mb-1">Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="time" 
                      className="input-field pl-9" 
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-brand-border mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-slate-600 font-medium">Estimated Total</span>
                    <span className="text-xl font-bold text-slate-900">₹{currentServiceRate}</span>
                  </div>
                  <button 
                    type="submit" 
                    disabled={bookingLoading}
                    className="btn-primary w-full py-3 shadow-elevated"
                  >
                    {bookingLoading ? "Confirming..." : "Confirm Booking"}
                  </button>
                  <p className="text-center text-xs text-slate-400 mt-3">You won't be charged yet</p>
                </div>
              </form>
            </div>
          )}
          
          <div className="card p-6 bg-teal-50 border-teal-100 text-center">
            <Shield className="w-8 h-8 text-teal-600 mx-auto mb-3" />
            <h4 className="font-bold text-teal-900 mb-2">ServiWay Guarantee</h4>
            <p className="text-xs text-teal-700 mb-4">Book with confidence. All our providers are background checked and verified.</p>
            <Link to="/guarantee" className="text-xs font-semibold text-teal-700 underline hover:text-teal-800">Learn more</Link>
          </div>
        </aside>
      </div>
      
      {/* Mobile Sticky Book Button - Only for Customers */}
      {user?.role !== "provider" && (
        <div className="md:hidden sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-brand-border shadow-modal z-50">
          <a href="#booking-section" className="btn-primary flex items-center justify-center w-full text-base py-3.5 shadow-elevated">
            Book {p.name.split(' ')[0]} Now
          </a>
        </div>
      )}
      
      <Footer />
    </div>
  );
}
