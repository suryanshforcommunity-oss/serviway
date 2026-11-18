export interface MockProvider {
  id: string;
  name: string;
  role: "provider";
  categories: string[];
  price: number;
  experience: string;
  description: string;
  rating: number;
  reviews: number;
  distance: string;
  initials: string;
  color: string;
  photoUrl: string;
  featured: boolean;
  available: boolean;
  verified: boolean;
  location: string;
  responseTime: string;
  jobsCompleted: number;
  services: {
    id: string;
    name: string;
    rate: number;
    desc: string;
  }[];
  reviewsList?: {
    id: string;
    user: string;
    rating: number;
    date: string;
    comment: string;
    service: string;
  }[];
}

export const DEFAULT_MOCK_PROVIDERS: MockProvider[] = [
  {
    id: "mock_p1",
    name: "Rajesh Kumar",
    role: "provider",
    categories: ["Plumbing", "Pipe Fitting", "Water Tank Cleaning"],
    price: 499,
    experience: "5 years exp",
    description: "Certified master plumber specializing in high-pressure leak repairs, pipe fitting, sanitary installations, and residential plumbing across Pune.",
    rating: 4.9,
    reviews: 127,
    distance: "1.8 km away",
    initials: "RK",
    color: "bg-teal-600",
    photoUrl: "",
    featured: true,
    available: true,
    verified: true,
    location: "Kothrud & Karve Nagar, Pune",
    responseTime: "< 25 min",
    jobsCompleted: 142,
    services: [
      { id: "s1", name: "General Plumbing & Tap Leak Fix", rate: 499, desc: "Diagnosis and repair of faucet leaks, washbasin traps, and valve washers." },
      { id: "s2", name: "Blocked Drain & Pipe Clearance", rate: 699, desc: "High-pressure mechanical snake clearing for choked drains and kitchen lines." },
      { id: "s3", name: "Complete Toilet & Cistern Overhaul", rate: 899, desc: "Dual flush valve replacement, concealed tank service, and seal waterproofing." }
    ],
    reviewsList: [
      { id: "r1", user: "Vikram Deshpande", rating: 5, date: "Yesterday", comment: "Arrived within 20 mins of booking at Kothrud. Fixed the master bathroom pipe leak without causing any mess. Top notch work!", service: "General Plumbing & Tap Leak Fix" },
      { id: "r2", user: "Pooja Kulkarni", rating: 5, date: "3 days ago", comment: "Very polite and professional. Cleared a blocked kitchen drain that two other plumbers failed to fix in Karve Nagar.", service: "Blocked Drain & Pipe Clearance" }
    ]
  },
  {
    id: "mock_p2",
    name: "Amit Sharma",
    role: "provider",
    categories: ["Electrical", "Wiring", "Appliance Repair"],
    price: 399,
    experience: "8 years exp",
    description: "Licensed electrician with 8+ years experience in domestic wiring, short circuit isolation, inverter setups, and electrical panel maintenance in Pune.",
    rating: 4.8,
    reviews: 94,
    distance: "2.3 km away",
    initials: "AS",
    color: "bg-amber-600",
    photoUrl: "",
    featured: false,
    available: true,
    verified: true,
    location: "Baner & Aundh, Pune",
    responseTime: "< 30 min",
    jobsCompleted: 98,
    services: [
      { id: "s4", name: "Short Circuit & MCB Tripping Fix", rate: 399, desc: "Isolation of faulty circuits, fuse wire replacement, and breaker inspection." },
      { id: "s5", name: "Ceiling Fan & Heavy Light Fixtures", rate: 449, desc: "Safe ceiling installation with load-bearing hooks and regulator wiring." },
      { id: "s6", name: "Inverter & Battery Wiring", rate: 799, desc: "Heavy-duty copper cabling and dual circuit changeover switch setup." }
    ],
    reviewsList: [
      { id: "r3", user: "Karthik Joshi", rating: 5, date: "2 days ago", comment: "Diagnosed our constant MCB trip in Baner in 10 minutes. Safe, clean, and honest pricing.", service: "Short Circuit & MCB Tripping Fix" }
    ]
  },
  {
    id: "mock_p3",
    name: "SpeedShine AutoCare",
    role: "provider",
    categories: ["Car Washing", "Car Detailing", "Waterless Wash"],
    price: 449,
    experience: "6 years exp",
    description: "Pune doorstep car washing subscriptions for Individuals, Societies & Townships with eco-friendly waterless technology, microfiber buffing, and tyre dress.",
    rating: 4.9,
    reviews: 215,
    distance: "1.2 km away",
    initials: "SS",
    color: "bg-blue-600",
    photoUrl: "",
    featured: true,
    available: true,
    verified: true,
    location: "Amanora Park Town & Hadapsar, Pune",
    responseTime: "< 15 min",
    jobsCompleted: 310,
    services: [
      { id: "s7", name: "Daily Morning Society Exterior Wash", rate: 449, desc: "Eco-friendly polymer wash, microfiber dual-cloth buffing, and high-gloss tyre shine." },
      { id: "s8", name: "Deep Interior Vacuum & Sanitization", rate: 799, desc: "High-power HEPA vacuuming of seats, roof liner, carpets, and air vent disinfection." },
      { id: "s9", name: "Full Ceramic Spray & Scratch Shield", rate: 1299, desc: "Hydrophobic ceramic coating spray with 60-day rain and dust repelling shield." }
    ],
    reviewsList: [
      { id: "r4", user: "Deepak Chawla", rating: 5, date: "Yesterday at 7:15 AM", comment: "My sedan is sparkling clean every single morning before I head to office. Best car wash subscription in Pune!", service: "Daily Morning Society Exterior Wash" },
      { id: "r5", user: "Ritu Sengupta", rating: 5, date: "4 days ago", comment: "Waterless tech saves so much water in Amanora Park Town, and the finish is mirror-like.", service: "Full Ceramic Spray & Scratch Shield" }
    ]
  },
  {
    id: "mock_p4",
    name: "Sunita Verma",
    role: "provider",
    categories: ["Cleaning", "House Cleaning", "Kitchen Deep Clean"],
    price: 599,
    experience: "4 years exp",
    description: "Professional deep cleaning specialist in Pune. Non-toxic hospital-grade chemicals, steam sanitization, and specialized grease removal.",
    rating: 4.9,
    reviews: 112,
    distance: "3.1 km away",
    initials: "SV",
    color: "bg-purple-600",
    photoUrl: "",
    featured: false,
    available: true,
    verified: true,
    location: "Viman Nagar & Kalyani Nagar, Pune",
    responseTime: "< 35 min",
    jobsCompleted: 85,
    services: [
      { id: "s10", name: "Intense Kitchen Degreasing & Chimney", rate: 899, desc: "Chemical degreasing of chimney filters, countertop tile grouting, and stove." },
      { id: "s11", name: "Full Home Deep Sanitization", rate: 1499, desc: "Complete 2BHK/3BHK floor scrubbing, window track cleaning, and cobweb removal." }
    ],
    reviewsList: [
      { id: "r6", user: "Ananya Sen", rating: 5, date: "Last week", comment: "Left our Viman Nagar flat sparkling like brand new. Highly recommended!", service: "Intense Kitchen Degreasing & Chimney" }
    ]
  },
  {
    id: "mock_p5",
    name: "Vikram Chauhan",
    role: "provider",
    categories: ["Carpentry", "Furniture Assembly", "Door Repair"],
    price: 450,
    experience: "9 years exp",
    description: "Master carpenter in Pune specializing in modular furniture assembly, wardrobe hinge fixes, wooden door lock replacements, and custom woodwork.",
    rating: 4.8,
    reviews: 156,
    distance: "2.7 km away",
    initials: "VC",
    color: "bg-emerald-600",
    photoUrl: "",
    featured: false,
    available: true,
    verified: true,
    location: "Wakad & Hinjewadi, Pune",
    responseTime: "< 40 min",
    jobsCompleted: 175,
    services: [
      { id: "s12", name: "Door Lock & Handle Fitting", rate: 450, desc: "Mortise lock, cylinder replacement, and deadbolt alignment." },
      { id: "s13", name: "IKEA & Modular Furniture Assembly", rate: 650, desc: "Fast precision assembly of flat-pack beds, study tables, and wardrobes." }
    ],
    reviewsList: [
      { id: "r7", user: "Naveen G.", rating: 5, date: "5 days ago", comment: "Assembled our 6-door wardrobe in Wakad in under 3 hours. True master craftsman.", service: "IKEA & Modular Furniture Assembly" }
    ]
  },
  {
    id: "mock_p6",
    name: "QuickChill AC Services",
    role: "provider",
    categories: ["AC Repair", "Appliance Repair", "HVAC"],
    price: 699,
    experience: "7 years exp",
    description: "Certified cooling technicians serving Pune IT corridors. Foam jet AC servicing, gas pressure test, PCB repair, and anti-bacterial coil wash.",
    rating: 4.8,
    reviews: 188,
    distance: "2.0 km away",
    initials: "QC",
    color: "bg-cyan-600",
    photoUrl: "",
    featured: true,
    available: true,
    verified: true,
    location: "Hinjewadi Phase 1 & Blue Ridge, Pune",
    responseTime: "< 30 min",
    jobsCompleted: 230,
    services: [
      { id: "s14", name: "Power Jet AC Foam Service", rate: 699, desc: "Pressure jet wash of indoor coil, outdoor condenser, and air filter sterilization." },
      { id: "s15", name: "Gas Leakage Check & R32 Top-up", rate: 1499, desc: "Nitrogen pressure leak test, brazing fix, and OEM certified refrigerant recharge." }
    ],
    reviewsList: [
      { id: "r8", user: "Suresh Menon", rating: 5, date: "3 days ago", comment: "AC cooling restored completely at Blue Ridge Hinjewadi. Very clean process with catch-bag.", service: "Power Jet AC Foam Service" }
    ]
  }
];

export const getStoredOrMockProviders = (): MockProvider[] => {
  try {
    const raw = localStorage.getItem("serviway_seeded_providers");
    if (raw && !raw.includes("Bangalore") && !raw.includes("Koramangala")) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Could not read stored providers:", e);
  }
  // Fallback to default mock providers and save
  try {
    localStorage.setItem("serviway_seeded_providers", JSON.stringify(DEFAULT_MOCK_PROVIDERS));
  } catch (e) {
    console.warn(e);
  }
  return DEFAULT_MOCK_PROVIDERS;
};
