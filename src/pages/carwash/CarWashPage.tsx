import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { useAuth } from "../../contexts/AuthContext";
import {
  Car, Sparkles, Building2, Landmark, Droplets, CheckCircle2,
  Clock, Award, Users, ChevronRight, ArrowRight,
  IndianRupee, X, Check, FileText
} from "lucide-react";
import {
  PRICING_MATRIX,
  getPartnerSocieties,
  createCarSubscription,
  submitSocietyTieUpInquiry
} from "../../lib/carWashService";
import type { VehicleType, CarWashModelType } from "../../types/carWash";

export default function CarWashPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Active view model tab: individual vs society vs township
  const [activeModel, setActiveModel] = useState<CarWashModelType>("individual");
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType>("sedan");

  // Calculator State for Society / Township
  const [calcCars, setCalcCars] = useState<number>(180);
  const [calcModelType, setCalcModelType] = useState<"society" | "township">("society");

  // Subscribe Modal State
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [subModel, setSubModel] = useState<CarWashModelType>("individual");
  const [subVehicleType, setSubVehicleType] = useState<VehicleType>("sedan");
  const [selectedSocietyId, setSelectedSocietyId] = useState("");
  const [customSocietyName, setCustomSocietyName] = useState("");
  const [towerWing, setTowerWing] = useState("");
  const [flatNumber, setFlatNumber] = useState("");
  const [parkingSlot, setParkingSlot] = useState("");
  const [carMake, setCarMake] = useState("");
  const [carModel, setCarModel] = useState("");
  const [carColor, setCarColor] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [billingCycle] = useState<"monthly" | "quarterly" | "annual">("monthly");
  const [subSuccess, setSubSuccess] = useState(false);

  // Tie-up Proposal Modal State
  const [showTieUpModal, setShowTieUpModal] = useState(false);
  const [tieUpType, setTieUpType] = useState<"society" | "township">("society");
  const [tieUpForm, setTieUpForm] = useState({
    societyName: "",
    city: "Pune",
    address: "",
    pincode: "411028",
    totalUnits: 200,
    estimatedVehicles: 150,
    contactName: "",
    designation: "Society Secretary",
    phone: "",
    email: "",
    preferredWashTime: "early_morning" as const,
    notes: ""
  });
  const [tieUpSuccess, setTieUpSuccess] = useState(false);

  const partnerSocieties = useMemo(() => getPartnerSocieties(), []);

  // Calculator outputs
  const calcResults = useMemo(() => {
    const revPercent = calcModelType === "township" ? 15 : 12;
    const avgCarRate = calcModelType === "township" ? 620 : 680;
    const monthlyGross = calcCars * avgCarRate;
    const monthlySocietyShare = Math.round(monthlyGross * (revPercent / 100));
    const annualSocietyShare = monthlySocietyShare * 12;
    const waterSavedPerMonth = calcCars * 150; // 150 liters saved per car per month vs hose wash
    const washersNeeded = Math.ceil(calcCars / 40);

    return {
      monthlyGross,
      monthlySocietyShare,
      annualSocietyShare,
      waterSavedPerMonth,
      washersNeeded,
      revPercent
    };
  }, [calcCars, calcModelType]);

  const handleOpenSubscribe = (model: CarWashModelType, vType?: VehicleType) => {
    setSubModel(model);
    if (vType) setSubVehicleType(vType);
    if (model === "society" || model === "township") {
      const match = partnerSocieties.find(s => s.type === model);
      if (match) setSelectedSocietyId(match.id);
    }
    setSubSuccess(false);
    setShowSubscribeModal(true);
  };

  const handleSubmitSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleNumber || !carMake || !carModel || !parkingSlot) {
      alert("Please fill in the vehicle and parking slot details.");
      return;
    }

    const soc = partnerSocieties.find(s => s.id === selectedSocietyId);
    const socName = soc ? soc.name : customSocietyName;

    createCarSubscription({
      userId: user?.uid || "mock_seeker_guest",
      userName: user?.name || "Guest Resident",
      userPhone: user?.phone || "+91 98765 43210",
      userEmail: user?.email || "resident@serviway.com",
      modelType: subModel,
      societyId: soc?.id,
      societyName: socName,
      towerWing,
      flatNumber,
      parkingSlot,
      carMake,
      carModel,
      carColor: carColor || "Metallic",
      vehicleNumber,
      vehicleType: subVehicleType,
      billingCycle
    });

    setSubSuccess(true);
    setTimeout(() => {
      setShowSubscribeModal(false);
      navigate("/seeker/dashboard");
    }, 1800);
  };

  const handleSubmitTieUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tieUpForm.societyName || !tieUpForm.contactName || !tieUpForm.phone) {
      alert("Please complete required contact details.");
      return;
    }

    submitSocietyTieUpInquiry({
      ...tieUpForm,
      type: tieUpType
    });

    setTieUpSuccess(true);
    setTimeout(() => {
      setShowTieUpModal(false);
      setTieUpSuccess(false);
      alert("Proposal submitted successfully! Our Society Partnerships Manager will contact you within 24 hours.");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-teal-950 to-slate-900 text-white pt-12 pb-20">
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:24px_24px]"></div>
        
        <div className="container-app relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-4 h-4 text-teal-400" />
              Next-Gen Doorstep Car Wash Subscription
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              A Sparkling Clean Car <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-teal-400 to-emerald-300">
                Every Morning in Your Parking
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed mb-8">
              Professional monthly car washing for <strong>Individuals</strong>, gated <strong>Residential Societies</strong>, and mega <strong>Townships</strong> — with verified cleaners, zero groundwater waste, and society revenue share.
            </p>

            {/* Model Switcher Tabs */}
            <div className="inline-flex p-1.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 shadow-xl backdrop-blur-md max-w-full overflow-x-auto">
              <button
                onClick={() => setActiveModel("individual")}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  activeModel === "individual"
                    ? "bg-teal-600 text-white shadow-lg shadow-teal-900/50"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                <Car className="w-4 h-4" />
                Individual Model
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white">Single Car</span>
              </button>

              <button
                onClick={() => setActiveModel("society")}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  activeModel === "society"
                    ? "bg-teal-600 text-white shadow-lg shadow-teal-900/50"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                <Building2 className="w-4 h-4" />
                Society Tie-Up Model
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-400 text-slate-900 font-bold">12% Revenue Share</span>
              </button>

              <button
                onClick={() => setActiveModel("township")}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  activeModel === "township"
                    ? "bg-teal-600 text-white shadow-lg shadow-teal-900/50"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                <Landmark className="w-4 h-4" />
                Mega Township Model
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-300 text-slate-950 font-bold">15% Revenue Share</span>
              </button>
            </div>
          </div>

          {/* Hero Feature Banner Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-6">
            <div className="bg-slate-800/40 border border-slate-700/50 backdrop-blur rounded-2xl p-5 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 flex-shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">Done Before You Wake Up</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Cleaned daily between 5:30 AM & 8:30 AM right in your assigned basement slot.
                </p>
              </div>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/50 backdrop-blur rounded-2xl p-5 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <IndianRupee className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">Society Revenue Share</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Societies & Townships earn 10%–15% recurring revenue directly into RWA maintenance funds.
                </p>
              </div>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/50 backdrop-blur rounded-2xl p-5 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
                <Droplets className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">Eco-Friendly & Scratch-Free</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Waterless nano-polymer sprays & high-GSM microfiber cloths ensure zero paint swirl marks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Model Overview & Pricing Section */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="container-app">
          {/* Active Model Explanation Card */}
          <div className="max-w-5xl mx-auto mb-12">
            {activeModel === "individual" && (
              <div className="bg-teal-50/60 border border-teal-200/80 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-teal-600 text-white text-xs font-semibold uppercase tracking-wider mb-2">
                    Individual Care
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Personal Doorstep Car Wash Subscription</h3>
                  <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                    For standalone villas, independent bungalows, and non-tieup apartments. A dedicated professional visits your car daily at your home parking space.
                  </p>
                </div>
                <button
                  onClick={() => handleOpenSubscribe("individual", selectedVehicleType)}
                  className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-600/30 flex items-center justify-center gap-2 transition-all flex-shrink-0"
                >
                  <Car className="w-4 h-4" /> Subscribe Single Car
                </button>
              </div>
            )}

            {activeModel === "society" && (
              <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-600 text-white text-xs font-semibold uppercase tracking-wider mb-2">
                    Apartment / Gated Community Tie-Up
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Society Tie-Up & Resident Revenue Share</h3>
                  <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                    When your Housing Society (RWA) partners with ServiWay, residents receive <strong>20% discount</strong> and the <strong>Society earns 12% monthly revenue</strong> credited directly to the maintenance fund!
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => { setTieUpType("society"); setShowTieUpModal(true); }}
                    className="px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md shadow-emerald-700/30 flex items-center gap-2 transition-all"
                  >
                    <Building2 className="w-4 h-4" /> Partner Your Society
                  </button>
                  <button
                    onClick={() => handleOpenSubscribe("society", selectedVehicleType)}
                    className="px-5 py-3 rounded-xl bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-50 font-bold text-sm flex items-center gap-2 transition-all"
                  >
                    <Car className="w-4 h-4" /> Join Society Roster
                  </button>
                </div>
              </div>
            )}

            {activeModel === "township" && (
              <div className="bg-indigo-50/60 border border-indigo-200/80 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-600 text-white text-xs font-semibold uppercase tracking-wider mb-2">
                    Mega Integrated Townships (500+ Flats)
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Township Fleet Contract & ESG Water Conservation</h3>
                  <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                    For large integrated campuses (Amanora, Magarpatta, Lodha, etc.). Dedicated mobile electric pressure stations, zero floor flooding, and <strong>15% institutional revenue share</strong> for township governance.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => { setTieUpType("township"); setShowTieUpModal(true); }}
                    className="px-5 py-3 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-sm shadow-md shadow-indigo-700/30 flex items-center gap-2 transition-all"
                  >
                    <Landmark className="w-4 h-4" /> Request Township RFP
                  </button>
                  <button
                    onClick={() => handleOpenSubscribe("township", selectedVehicleType)}
                    className="px-5 py-3 rounded-xl bg-white border border-indigo-300 text-indigo-800 hover:bg-indigo-50 font-bold text-sm flex items-center gap-2 transition-all"
                  >
                    <Car className="w-4 h-4" /> Township Resident Pass
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Vehicle Selector Tabs */}
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Select Your Vehicle Segment</h3>
            <p className="text-sm text-slate-500">Tailored care, microfiber cloths, and dedicated cleaning protocols for each car class</p>

            <div className="flex justify-center gap-2 md:gap-4 mt-6 overflow-x-auto pb-2">
              {[
                { type: "hatchback", label: "Hatchback", desc: "Swift, i20, Tiago, Baleno", icon: "🚗" },
                { type: "sedan", label: "Sedan", desc: "City, Verna, Dzire, Slavia", icon: "🚘" },
                { type: "suv", label: "Compact & Mid SUV", desc: "Creta, Nexon, Brezza, Seltos", icon: "🚙" },
                { type: "luxury", label: "Large SUV / Luxury", desc: "Fortuner, XUV700, BMW, Audi", icon: "🏎️" },
              ].map(item => (
                <button
                  key={item.type}
                  onClick={() => setSelectedVehicleType(item.type as VehicleType)}
                  className={`px-5 py-3 rounded-xl text-left border transition-all ${
                    selectedVehicleType === item.type
                      ? "bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-teal-500"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  <div className={`text-[11px] mt-0.5 truncate max-w-[140px] ${selectedVehicleType === item.type ? "text-slate-300" : "text-slate-500"}`}>
                    {item.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Pricing Card Showcase */}
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Individual Plan */}
              <div className={`rounded-2xl border p-6 flex flex-col justify-between transition-all ${
                activeModel === "individual"
                  ? "border-teal-500 bg-white shadow-xl ring-2 ring-teal-500/20 relative"
                  : "border-slate-200 bg-slate-50/50 hover:bg-white"
              }`}>
                {activeModel === "individual" && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-600 text-white text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                    Selected Model
                  </div>
                )}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-2 py-1 rounded">
                      Individual Owner
                    </span>
                    <Car className="w-5 h-5 text-teal-600" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 capitalize">{selectedVehicleType} Standard</h4>
                  <p className="text-xs text-slate-500 mt-1">Direct single-car home cleaning</p>

                  <div className="mt-4 mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-slate-900">
                        ₹{PRICING_MATRIX.individual[selectedVehicleType].monthly}
                      </span>
                      <span className="text-sm text-slate-400 line-through">
                        ₹{PRICING_MATRIX.individual[selectedVehicleType].original}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">/month</span>
                    </div>
                    <span className="text-[11px] text-teal-600 font-medium">Billed monthly • Cancel anytime</span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-teal-600 flex-shrink-0" />
                      <span><strong>26 Days</strong> Morning Microfiber Dry Wash</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-teal-600 flex-shrink-0" />
                      <span><strong>4 Days</strong> Weekend High-Pressure Foam Wash</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-teal-600 flex-shrink-0" />
                      <span><strong>2 Days</strong> Interior Deep Vacuum & Dash Polish</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-teal-600 flex-shrink-0" />
                      <span>Glass Water-Repellent Treatment</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-teal-600 flex-shrink-0" />
                      <span>Tyre Gloss & Rim Cleaning</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => handleOpenSubscribe("individual", selectedVehicleType)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    activeModel === "individual"
                      ? "bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/30"
                      : "bg-slate-200 hover:bg-slate-300 text-slate-800"
                  }`}
                >
                  Subscribe as Individual <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Card 2: Society Bulk Model */}
              <div className={`rounded-2xl border p-6 flex flex-col justify-between transition-all ${
                activeModel === "society"
                  ? "border-emerald-500 bg-white shadow-xl ring-2 ring-emerald-500/20 relative"
                  : "border-slate-200 bg-slate-50/50 hover:bg-white"
              }`}>
                {activeModel === "society" && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                    Most Popular For Societies
                  </div>
                )}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-1 rounded">
                      Society Tie-Up
                    </span>
                    <Building2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 capitalize">Society Resident Pass</h4>
                  <p className="text-xs text-slate-500 mt-1">20% resident discount + Society revenue</p>

                  <div className="mt-4 mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-slate-900">
                        ₹{PRICING_MATRIX.society[selectedVehicleType].monthly}
                      </span>
                      <span className="text-sm text-slate-400 line-through">
                        ₹{PRICING_MATRIX.society[selectedVehicleType].original}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">/month</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 w-fit">
                      <Award className="w-3.5 h-3.5" /> 12% revenue back to Society RWA
                    </div>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span><strong>Dedicated Washer</strong> assigned to your basement</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span><strong>26 Days</strong> Exterior Microfiber Clean</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span><strong>4 Days</strong> Weekend Deep Foam Wash</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span><strong>2 Days</strong> Interior Vacuum & Dusting</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Live daily wash logs on resident dashboard</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => handleOpenSubscribe("society", selectedVehicleType)}
                    className="w-full py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
                  >
                    Subscribe Society Plan <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => { setTieUpType("society"); setShowTieUpModal(true); }}
                    className="w-full py-2 rounded-xl text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors"
                  >
                    Partner My Society RWA
                  </button>
                </div>
              </div>

              {/* Card 3: Township Fleet Model */}
              <div className={`rounded-2xl border p-6 flex flex-col justify-between transition-all ${
                activeModel === "township"
                  ? "border-indigo-500 bg-white shadow-xl ring-2 ring-indigo-500/20 relative"
                  : "border-slate-200 bg-slate-50/50 hover:bg-white"
              }`}>
                {activeModel === "township" && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                    Enterprise Tier
                  </div>
                )}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider bg-indigo-50 px-2 py-1 rounded">
                      Township Fleet
                    </span>
                    <Landmark className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 capitalize">Township Express Fleet</h4>
                  <p className="text-xs text-slate-500 mt-1">For mega townships (500+ flats)</p>

                  <div className="mt-4 mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-slate-900">
                        ₹{PRICING_MATRIX.township[selectedVehicleType].monthly}
                      </span>
                      <span className="text-sm text-slate-400 line-through">
                        ₹{PRICING_MATRIX.township[selectedVehicleType].original}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">/month</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 w-fit">
                      <Sparkles className="w-3.5 h-3.5" /> 15% revenue to Township Council
                    </div>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                      <span><strong>Waterless Polymer Tech</strong> (Zero floor puddles)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                      <span><strong>Electric Wash Carts</strong> across campus</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                      <span><strong>26 Days</strong> Exterior Express Clean</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                      <span><strong>4 Days</strong> Weekend High-Foam Wash</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                      <span>Township ESG Green Water Conservation Badge</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => handleOpenSubscribe("township", selectedVehicleType)}
                    className="w-full py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
                  >
                    Subscribe Township Plan <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => { setTieUpType("township"); setShowTieUpModal(true); }}
                    className="w-full py-2 rounded-xl text-xs font-semibold text-indigo-700 hover:bg-indigo-50 transition-colors"
                  >
                    Township Management RFP
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Interactive Society & Township Revenue Calculator Section */}
      <section className="py-16 bg-slate-900 text-white relative overflow-hidden">
        <div className="container-app relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <span className="text-teal-400 font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-full bg-teal-950/60 border border-teal-800">
              For RWAs, Management Committees & Township Boards
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold mt-3 text-white">
              Calculate Your Society Revenue & Environmental Savings
            </h2>
            <p className="text-slate-300 text-sm md:text-base mt-2 max-w-2xl mx-auto">
              See how much revenue your Housing Society or Township can generate each month while eliminating unorganized basement washers and saving millions of liters of water.
            </p>
          </div>

          <div className="max-w-5xl mx-auto bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 md:p-10 shadow-2xl backdrop-blur-md">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Sliders and Inputs */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Select Partnership Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setCalcModelType("society")}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        calcModelType === "society"
                          ? "bg-teal-600 border-teal-400 text-white shadow-lg shadow-teal-900/50"
                          : "bg-slate-700/40 border-slate-600 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      <div className="font-bold text-sm">Housing Society</div>
                      <div className="text-[11px] opacity-80">12% Revenue Share (50–500 Cars)</div>
                    </button>

                    <button
                      onClick={() => setCalcModelType("township")}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        calcModelType === "township"
                          ? "bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-900/50"
                          : "bg-slate-700/40 border-slate-600 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      <div className="font-bold text-sm">Mega Township</div>
                      <div className="text-[11px] opacity-80">15% Revenue Share (500+ Cars)</div>
                    </button>
                  </div>
                </div>

                {/* Cars Slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-bold text-slate-200">
                      Enrolled Resident Cars:
                    </label>
                    <span className="text-xl font-extrabold text-teal-300 bg-slate-900 px-3 py-1 rounded-lg border border-slate-700">
                      {calcCars} Cars
                    </span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max={calcModelType === "township" ? 3000 : 600}
                    step="10"
                    value={calcCars}
                    onChange={(e) => setCalcCars(Number(e.target.value))}
                    className="w-full accent-teal-400 h-2 bg-slate-700 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>30 Cars</span>
                    <span>{calcModelType === "township" ? "1,500 Cars" : "300 Cars"}</span>
                    <span>{calcModelType === "township" ? "3,000+ Cars" : "600 Cars"}</span>
                  </div>
                </div>

                <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-700 text-xs text-slate-300 space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
                    <span>Zero upfront investment from society maintenance corpus</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
                    <span>Direct monthly bank transfer into society RWA account</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
                    <span>Biometric gate security integration & vetted cleaners</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Calculated Revenue Outputs */}
              <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 via-teal-950/70 to-slate-900 border border-teal-500/30 rounded-2xl p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                    Estimated Society Payout ({calcResults.revPercent}% Cut)
                  </span>
                  
                  <div className="mt-2 mb-4">
                    <div className="text-3xl md:text-4xl font-extrabold text-white">
                      ₹{calcResults.monthlySocietyShare.toLocaleString()}
                      <span className="text-sm font-normal text-slate-400"> / month</span>
                    </div>
                    <div className="text-sm font-semibold text-emerald-400 mt-1">
                      ₹{calcResults.annualSocietyShare.toLocaleString()} projected annual revenue for RWA
                    </div>
                  </div>

                  <hr className="border-slate-800 my-4" />

                  {/* Impact Grid */}
                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60">
                      <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-bold mb-1">
                        <Droplets className="w-4 h-4" /> Water Conserved
                      </div>
                      <div className="text-base font-bold text-white">
                        {calcResults.waterSavedPerMonth.toLocaleString()} L
                      </div>
                      <div className="text-[10px] text-slate-400">Litres saved / month</div>
                    </div>

                    <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60">
                      <div className="flex items-center gap-1.5 text-teal-400 text-xs font-bold mb-1">
                        <Users className="w-4 h-4" /> Dedicated Crew
                      </div>
                      <div className="text-base font-bold text-white">
                        {calcResults.washersNeeded} Washers
                      </div>
                      <div className="text-[10px] text-slate-400">Stationed on premise</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      setTieUpType(calcModelType);
                      setShowTieUpModal(true);
                    }}
                    className="flex-1 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-extrabold text-xs shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 transition-all"
                  >
                    <FileText className="w-4 h-4" /> Request Official RWA Proposal
                  </button>
                  <button
                    onClick={() => alert(`Call our Society Head directly at +91 98450 12345 or email rwa@serviway.com`)}
                    className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700"
                  >
                    Direct Helpline
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Active Partner Societies & Townships Showcase */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="container-app">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <span className="text-teal-600 font-bold text-xs uppercase tracking-wider">
                Trusted by Top RWAs & Townships
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">
                Featured Partner Communities
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Over 18+ high-density gated societies and integrated townships currently powered by ServiWay
              </p>
            </div>
            <button
              onClick={() => { setTieUpType("society"); setShowTieUpModal(true); }}
              className="mt-4 md:mt-0 text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              Get your society listed <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnerSocieties.map((soc) => (
              <div
                key={soc.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      soc.type === "township"
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}>
                      {soc.type === "township" ? "Mega Township" : "Gated Society"}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      {soc.city}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-base">{soc.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{soc.address}</p>

                  <div className="grid grid-cols-3 gap-2 mt-4 py-3 border-y border-slate-100 text-center">
                    <div>
                      <div className="text-sm font-bold text-slate-900">{soc.enrolledCars}</div>
                      <div className="text-[10px] text-slate-400">Active Cars</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-emerald-600">₹{(soc.monthlyRevenueGenerated / 1000).toFixed(1)}k</div>
                      <div className="text-[10px] text-slate-400">Monthly Payout</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-cyan-600">{(soc.waterSavedLitres / 1000).toFixed(0)}k L</div>
                      <div className="text-[10px] text-slate-400">Water Saved</div>
                    </div>
                  </div>

                  <div className="mt-3 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">RWA Contact:</span> {soc.contactPerson.name} ({soc.contactPerson.designation})
                  </div>
                </div>

                <div className="mt-4 pt-3 flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedSocietyId(soc.id);
                      handleOpenSubscribe(soc.type, "sedan");
                    }}
                    className="flex-1 py-2 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-xs transition-colors flex items-center justify-center gap-1"
                  >
                    <Car className="w-3.5 h-3.5" /> Book in this Society
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Showcase */}
      <section className="py-16 bg-white">
        <div className="container-app">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Flawless Daily Routine</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">How ServiWay Car Care Operates</h2>
            <p className="text-sm text-slate-500 mt-2">Zero interruption to your daily routine, zero morning delays.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "Enroll Your Vehicle",
                desc: "Select Individual, Society, or Township plan. Enter vehicle plate and basement slot number."
              },
              {
                step: "02",
                title: "Basement Morning Wash",
                desc: "Assigned cleaners perform exterior cleaning between 5:30 AM – 8:30 AM before you leave for office."
              },
              {
                step: "03",
                title: "Live Photo Logged",
                desc: "Washer logs timestamp & before/after finish photo directly to your Seeker Dashboard."
              },
              {
                step: "04",
                title: "Society Revenue Credit",
                desc: "10%–15% commission is automatically aggregated and disbursed monthly to your society RWA fund."
              }
            ].map((s) => (
              <div key={s.step} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 relative">
                <span className="text-3xl font-black text-teal-200 block mb-2">{s.step}</span>
                <h4 className="font-bold text-slate-900 text-base mb-1">{s.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe Modal */}
      {showSubscribeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Subscribe to Car Wash System
                </h3>
                <p className="text-xs text-slate-500 capitalize">
                  Model: {subModel} • Tier: {subVehicleType}
                </p>
              </div>
              <button
                onClick={() => setShowSubscribeModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {subSuccess ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-slate-900">Subscription Activated!</h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Your daily car washing subscription has been activated. The morning cleaning crew will visit your designated parking slot starting tomorrow morning!
                </p>
                <p className="text-xs text-teal-600 font-semibold">Redirecting to your dashboard...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitSubscription} className="p-6 space-y-4">
                
                {/* Model Selector in Modal */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Subscription Category</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["individual", "society", "township"] as CarWashModelType[]).map(m => (
                      <button
                        type="button"
                        key={m}
                        onClick={() => setSubModel(m)}
                        className={`py-2 px-1 text-center rounded-lg text-xs font-bold capitalize border transition-all ${
                          subModel === m
                            ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {m} Model
                      </button>
                    ))}
                  </div>
                </div>

                {/* Society Selector if society or township */}
                {(subModel === "society" || subModel === "township") && (
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Select Your {subModel === "township" ? "Township" : "Society"}
                    </label>
                    <select
                      value={selectedSocietyId}
                      onChange={(e) => setSelectedSocietyId(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
                    >
                      <option value="">-- Choose from active partner tie-ups --</option>
                      {partnerSocieties
                        .filter(s => s.type === subModel)
                        .map(s => (
                          <option key={s.id} value={s.id}>
                            {s.name} ({s.city}) — {s.revenueSharePercent}% RWA Payout
                          </option>
                        ))}
                    </select>

                    <div className="mt-2 text-left">
                      <span className="text-[11px] text-slate-500">Not listed? </span>
                      <input
                        type="text"
                        placeholder="Enter Society / Apartment Name"
                        value={customSocietyName}
                        onChange={(e) => setCustomSocietyName(e.target.value)}
                        className="w-full text-xs p-2 mt-1 rounded-lg border border-slate-300"
                      />
                    </div>
                  </div>
                )}

                {/* Vehicle Class Selector */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Vehicle Segment</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(["hatchback", "sedan", "suv", "luxury"] as VehicleType[]).map(v => (
                      <button
                        type="button"
                        key={v}
                        onClick={() => setSubVehicleType(v)}
                        className={`py-2 px-1 text-center rounded-lg text-xs font-bold capitalize border transition-all ${
                          subVehicleType === v
                            ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                            : "bg-slate-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Vehicle Details */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Car Make</label>
                    <input
                      type="text"
                      placeholder="e.g. Hyundai, Honda, Tata"
                      value={carMake}
                      onChange={(e) => setCarMake(e.target.value)}
                      required
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Car Model</label>
                    <input
                      type="text"
                      placeholder="e.g. Creta, City, Nexon"
                      value={carModel}
                      onChange={(e) => setCarModel(e.target.value)}
                      required
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Car License Plate</label>
                    <input
                      type="text"
                      placeholder="e.g. MH 12 AB 1234"
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value)}
                      required
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-mono uppercase focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Car Color</label>
                    <input
                      type="text"
                      placeholder="e.g. White, Grey, Black"
                      value={carColor}
                      onChange={(e) => setCarColor(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                </div>

                {/* Parking Location Details */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Tower / Wing</label>
                    <input
                      type="text"
                      placeholder="e.g. Tower B"
                      value={towerWing}
                      onChange={(e) => setTowerWing(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Flat No.</label>
                    <input
                      type="text"
                      placeholder="e.g. 804"
                      value={flatNumber}
                      onChange={(e) => setFlatNumber(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Parking Slot *</label>
                    <input
                      type="text"
                      placeholder="e.g. B2-108"
                      value={parkingSlot}
                      onChange={(e) => setParkingSlot(e.target.value)}
                      required
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 font-bold"
                    />
                  </div>
                </div>

                {/* Billing Summary */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                    <span>Monthly Plan Rate:</span>
                    <span className="font-bold text-slate-900">
                      ₹{PRICING_MATRIX[subModel][subVehicleType].monthly} / month
                    </span>
                  </div>
                  {subModel !== "individual" && (
                    <div className="flex items-center justify-between text-xs text-emerald-700 font-semibold mb-1">
                      <span>RWA / Society Revenue Share:</span>
                      <span>
                        +{subModel === "township" ? "15%" : "12%"} credited to Society Fund
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-200">
                    <span className="font-bold text-slate-800">Total Due Today:</span>
                    <span className="text-base font-extrabold text-teal-700">
                      ₹{PRICING_MATRIX[subModel][subVehicleType].monthly}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-600/30 transition-all"
                >
                  Confirm Subscription & Schedule First Wash
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Society / Township Tie-Up Modal */}
      {showTieUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Partner Your {tieUpType === "township" ? "Township" : "Society"} with ServiWay
                </h3>
                <p className="text-xs text-slate-500">
                  Generate recurring revenue for maintenance fund • Verified on-premise cleaners
                </p>
              </div>
              <button
                onClick={() => setShowTieUpModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {tieUpSuccess ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-slate-900">Proposal Submitted!</h4>
                <p className="text-xs text-slate-600">
                  Thank you! Our Institutional Partnerships Lead will review your society details and reach out within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitTieUp} className="p-6 space-y-4">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTieUpType("society")}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg border ${
                      tieUpType === "society" ? "bg-emerald-600 text-white border-emerald-600" : "bg-slate-50 text-slate-700"
                    }`}
                  >
                    Housing Society / RWA (12% Share)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTieUpType("township")}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg border ${
                      tieUpType === "township" ? "bg-indigo-600 text-white border-indigo-600" : "bg-slate-50 text-slate-700"
                    }`}
                  >
                    Mega Township (15% Share)
                  </button>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {tieUpType === "township" ? "Township" : "Society"} Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amanora Park Town, Life Republic, Blue Ridge"
                    value={tieUpForm.societyName}
                    onChange={(e) => setTieUpForm({ ...tieUpForm, societyName: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">City *</label>
                    <input
                      type="text"
                      required
                      placeholder="Pune"
                      value={tieUpForm.city}
                      onChange={(e) => setTieUpForm({ ...tieUpForm, city: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Pincode</label>
                    <input
                      type="text"
                      placeholder="e.g. 411028"
                      value={tieUpForm.pincode}
                      onChange={(e) => setTieUpForm({ ...tieUpForm, pincode: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Total Flats / Units</label>
                    <input
                      type="number"
                      value={tieUpForm.totalUnits}
                      onChange={(e) => setTieUpForm({ ...tieUpForm, totalUnits: Number(e.target.value) })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Estimated Cars</label>
                    <input
                      type="number"
                      value={tieUpForm.estimatedVehicles}
                      onChange={(e) => setTieUpForm({ ...tieUpForm, estimatedVehicles: Number(e.target.value) })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <h4 className="text-xs font-bold text-slate-800 mb-2">Primary Contact Person</h4>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="text-[11px] text-slate-600 block mb-1">Contact Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Suresh Narayanan"
                        value={tieUpForm.contactName}
                        onChange={(e) => setTieUpForm({ ...tieUpForm, contactName: e.target.value })}
                        className="w-full text-xs p-2 rounded-lg border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-600 block mb-1">Designation</label>
                      <input
                        type="text"
                        placeholder="e.g. RWA Secretary, President"
                        value={tieUpForm.designation}
                        onChange={(e) => setTieUpForm({ ...tieUpForm, designation: e.target.value })}
                        className="w-full text-xs p-2 rounded-lg border border-slate-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-600 block mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98450 12345"
                        value={tieUpForm.phone}
                        onChange={(e) => setTieUpForm({ ...tieUpForm, phone: e.target.value })}
                        className="w-full text-xs p-2 rounded-lg border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-600 block mb-1">Email</label>
                      <input
                        type="email"
                        placeholder="rwa@society.com"
                        value={tieUpForm.email}
                        onChange={(e) => setTieUpForm({ ...tieUpForm, email: e.target.value })}
                        className="w-full text-xs p-2 rounded-lg border border-slate-300"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl text-xs font-semibold">
                  🎉 Projected Monthly RWA Revenue: ₹{Math.round(tieUpForm.estimatedVehicles * 650 * (tieUpType === "township" ? 0.15 : 0.12)).toLocaleString()} / month credited into society fund
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all"
                >
                  Submit Society Tie-Up Proposal
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
