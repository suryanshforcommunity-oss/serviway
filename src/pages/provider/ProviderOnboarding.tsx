import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { useAuth } from "../../contexts/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function ProviderOnboarding() {
  const [step, setStep] = useState(2); // Mocking step 2 for the requested design
  const navigate = useNavigate();

  const { user } = useAuth();
  // Selected services state mock
  const [selectedServices, setSelectedServices] = useState<string[]>(["Plumbing"]);
  const [serviceRates, setServiceRates] = useState<Record<string, number>>({ "Plumbing": 499 });
  const [experience, setExperience] = useState("Intermediate (2-5 yrs)");
  const [description, setDescription] = useState("");
  const [basePrice] = useState(499); // Deprecated but kept for fallback
  const [saving, setSaving] = useState(false);

  const providerName = user?.name || localStorage.getItem('latestProviderName') || "Rajesh Kumar";
  const providerInitials = providerName.substring(0, 2).toUpperCase();

  const handleToggleService = (service: string) => {
    setSelectedServices(prev => {
      if (prev.includes(service)) {
        return prev.filter(s => s !== service);
      } else {
        setServiceRates(sr => ({ ...sr, [service]: 499 }));
        return [...prev, service];
      }
    });
  };

  const handleSave = async () => {
    if (!user) {
      alert("You must be logged in.");
      return;
    }
    setSaving(true);
    try {
      const mappedServices = selectedServices.map(s => ({
        name: s,
        rate: serviceRates[s] || 499
      }));
      const minPrice = mappedServices.length > 0 ? Math.min(...mappedServices.map(s => s.rate)) : basePrice;

      const updatedUser = {
        ...user,
        role: "provider" as const,
        categories: selectedServices,
        services: mappedServices,
        experience,
        description,
        price: minPrice,
        onboardingComplete: true
      };
      localStorage.setItem("serviway_demo_user", JSON.stringify(updatedUser));
      localStorage.setItem("latestProviderName", user.name);

      try {
        await setDoc(doc(db, "users", user.uid), {
          name: user.name,
          email: user.email,
          role: "provider",
          categories: selectedServices,
          services: mappedServices,
          experience,
          description,
          price: minPrice,
          onboardingComplete: true
        }, { merge: true });
      } catch (e: any) {
        console.warn("Firestore onboarding write restricted, saved in local session:", e);
      }
      navigate("/provider/dashboard");
    } catch (e: any) {
      console.error("Failed to complete onboarding:", e);
      navigate("/provider/dashboard");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <Navbar />

      <div className="bg-white border-b border-brand-border">
        <div className="container-app py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Complete your profile</h1>
              <p className="text-sm text-slate-500 mt-1">Get ready to receive bookings on ServiWay</p>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-teal-600 mb-1">Step {step} of 5</div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div 
                    key={s} 
                    className={`h-2 rounded-full w-12 ${s < step ? 'bg-teal-600' : s === step ? 'bg-teal-600' : 'bg-slate-200'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-app py-8 flex-1">
        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
          
          {/* Form Area */}
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-900 mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>What services do you offer?</h2>
            
            <div className="card p-6 mb-6">
              <label className="input-label mb-3">Service Categories</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {["Car Washing", "Plumbing", "Electrical", "Cleaning", "Carpentry", "Painting", "AC Repair", "Appliance Repair", "Salon", "Pest Control", "Security"].map(cat => (
                  <button
                    key={cat}
                    onClick={() => handleToggleService(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                      selectedServices.includes(cat) 
                        ? 'bg-teal-50 border-teal-600 text-teal-700' 
                        : 'bg-white border-brand-border text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
                {selectedServices.filter(s => !["Car Washing", "Plumbing", "Electrical", "Cleaning", "Carpentry", "Painting", "AC Repair", "Appliance Repair", "Salon", "Pest Control", "Security"].includes(s)).map(cat => (
                  <button
                    key={cat}
                    onClick={() => handleToggleService(cat)}
                    className="px-4 py-2 rounded-full text-sm font-medium border bg-teal-50 border-teal-600 text-teal-700"
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mb-6">
                <input 
                  type="text" 
                  id="customServiceInput"
                  placeholder="Can't find your service? Type it here..." 
                  className="input-field flex-1 h-10" 
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const val = (e.target as HTMLInputElement).value.trim();
                      if (val && !selectedServices.includes(val)) {
                        setSelectedServices(prev => [...prev, val]);
                        (e.target as HTMLInputElement).value = "";
                      }
                    }
                  }}
                />
                <button 
                  className="btn-secondary h-10 px-4 whitespace-nowrap"
                  onClick={() => {
                    const input = document.getElementById('customServiceInput') as HTMLInputElement;
                    const val = input?.value.trim();
                    if (val && !selectedServices.includes(val)) {
                      setSelectedServices(prev => [...prev, val]);
                      input.value = "";
                    }
                  }}
                >
                  Add Custom
                </button>
              </div>

              <label className="input-label mb-3">Experience Level</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                {["Beginner (0-2 yrs)", "Intermediate (2-5 yrs)", "Expert (5+ yrs)"].map(exp => (
                  <button
                    key={exp}
                    onClick={() => setExperience(exp)}
                    className={`p-4 rounded-xl border text-center transition-colors ${
                      experience === exp
                        ? 'border-teal-600 bg-teal-50 text-teal-700 font-semibold'
                        : 'bg-white border-brand-border text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {exp}
                  </button>
                ))}
              </div>
              
              <label className="input-label mb-3">Set your pricing</label>
              <div className="space-y-4 mb-6">
                {selectedServices.map(service => (
                  <div key={service} className="p-4 rounded-xl border border-brand-border bg-slate-50">
                    <div className="font-semibold text-slate-900 mb-3">{service}</div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <span className="text-xs text-slate-500 mb-1 block">Base Rate (₹)</span>
                        <input 
                          type="number" 
                          className="input-field h-10" 
                          value={serviceRates[service] || ''} 
                          onChange={(e) => setServiceRates(prev => ({ ...prev, [service]: Number(e.target.value) || 0 }))} 
                        />
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 mb-1 block">Max Price (₹)</span>
                        <input type="number" className="input-field h-10" placeholder="e.g. 999" />
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 mb-1 block">Rate Type</span>
                        <select className="input-field h-10 px-2">
                          <option>Per Visit</option>
                          <option>Per Hour</option>
                          <option>Per Day</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
                <button className="btn-ghost text-sm w-full border border-dashed border-teal-300 py-3 rounded-xl">+ Add specific sub-service</button>
              </div>

              <label className="input-label mb-2">Description</label>
              <textarea 
                className="input-field min-h-[100px] py-3 resize-y" 
                placeholder="Describe your expertise and what makes you stand out (min 100 chars)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="flex items-center justify-between">
              <button className="btn-secondary" onClick={() => setStep(1)}>Back</button>
              <div className="flex items-center gap-4">
                <button className="text-teal-600 text-sm font-semibold hover:underline">Save for Later</button>
                <button className="btn-primary" onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save & Continue"}
                </button>
              </div>
            </div>
          </div>
          
          {/* Preview Panel */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="sticky top-24">
              <h3 className="font-bold text-slate-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Profile Preview</h3>
              <p className="text-sm text-slate-500 mb-4">This is how customers will see you.</p>
              
              <div className="card p-5">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-xl shadow-inner uppercase">
                    {providerInitials}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{providerName}</h4>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-teal-50 text-teal-700 text-[10px] uppercase tracking-wide font-semibold rounded-full">
                      {selectedServices[0] || "Provider"}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded">New Provider</span>
                  <span className="text-xs text-slate-500">{experience}</span>
                </div>
                
                <hr className="border-brand-border my-4" />
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Starting from</span>
                  <span className="font-bold text-slate-900">₹{selectedServices.length > 0 ? Math.min(...selectedServices.map(s => serviceRates[s] || 499)) : basePrice}</span>
                </div>
              </div>
              
              <div className="mt-6 card p-5 bg-teal-50 border-teal-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-teal-900">Profile Completeness</span>
                  <span className="text-sm font-bold text-teal-700">45%</span>
                </div>
                <div className="w-full h-2 bg-teal-200 rounded-full mb-4">
                  <div className="h-full bg-teal-600 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <ul className="space-y-2 text-xs">
                  <li className="flex items-center gap-2 text-teal-700"><Check className="w-3 h-3" /> Basic Info</li>
                  <li className="flex items-center gap-2 text-slate-400"><div className="w-3 h-3 border border-slate-300 rounded-full" /> Services & Pricing</li>
                  <li className="flex items-center gap-2 text-slate-400"><div className="w-3 h-3 border border-slate-300 rounded-full" /> Service Area</li>
                  <li className="flex items-center gap-2 text-slate-400"><div className="w-3 h-3 border border-slate-300 rounded-full" /> Documents</li>
                </ul>
              </div>
            </div>
          </div>
          
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
