import type { CarSubscription, SocietyTieUp, SocietyInquiryForm, WashLogItem, VehicleType, CarWashModelType } from "../types/carWash";

const SOCIETIES_STORAGE_KEY = "serviway_carwash_societies";
const SUBSCRIPTIONS_STORAGE_KEY = "serviway_carwash_subscriptions";

// Pre-seeded Partner Societies & Townships
// Pre-seeded Partner Societies & Townships (Pune Exclusively)
export const DEFAULT_SOCIETIES: SocietyTieUp[] = [
  {
    id: "town_1",
    name: "Amanora Park Town",
    type: "township",
    city: "Pune",
    address: "Hadapsar Kharadi Bypass, Magarpatta Road",
    pincode: "411028",
    totalFlats: 3200,
    enrolledCars: 1450,
    contactPerson: {
      name: "Col. Sanjeev Kulkarni",
      designation: "Township Facility Director",
      phone: "+91 98220 54321",
      email: "facilities@amanorapark.in"
    },
    revenueSharePercent: 15,
    monthlyRevenueGenerated: 174000,
    totalRevenueToDate: 1218000,
    status: "active",
    dedicatedWashersCount: 24,
    waterSavedLitres: 217500,
    contractStartDate: "2025-06-15",
    notes: "Township wide waterless cleaning. 4 mobile eco-pressure carts deployed."
  },
  {
    id: "town_2",
    name: "Kolte Patil Life Republic",
    type: "township",
    city: "Pune",
    address: "Hinjewadi - Marunji Road",
    pincode: "411057",
    totalFlats: 4500,
    enrolledCars: 1980,
    contactPerson: {
      name: "Mahesh Deshpande",
      designation: "Township Facility Head",
      phone: "+91 98901 22334",
      email: "facility@liferepublicpune.com"
    },
    revenueSharePercent: 15,
    monthlyRevenueGenerated: 237600,
    totalRevenueToDate: 1425600,
    status: "active",
    dedicatedWashersCount: 30,
    waterSavedLitres: 297000,
    contractStartDate: "2025-05-01",
    notes: "Premier Hinjewadi Township partnership. Resident rating 4.9/5."
  },
  {
    id: "soc_1",
    name: "Rohan Mithila",
    type: "society",
    city: "Pune",
    address: "Symbiosis Road, Viman Nagar",
    pincode: "411014",
    totalFlats: 380,
    enrolledCars: 245,
    contactPerson: {
      name: "Prashant Joshi",
      designation: "RWA Secretary",
      phone: "+91 98223 99881",
      email: "rwa.rohanmithila@gmail.com"
    },
    revenueSharePercent: 12,
    monthlyRevenueGenerated: 23520,
    totalRevenueToDate: 164640,
    status: "active",
    dedicatedWashersCount: 5,
    waterSavedLitres: 36750,
    contractStartDate: "2025-08-01",
    notes: "Basement 1 and 2 designated wash zones. Biometric entry enabled."
  },
  {
    id: "soc_2",
    name: "Blue Ridge Township",
    type: "township",
    city: "Pune",
    address: "Phase 1, Hinjewadi IT Park",
    pincode: "411057",
    totalFlats: 3600,
    enrolledCars: 1620,
    contactPerson: {
      name: "Anand Shinde",
      designation: "Township Administrator",
      phone: "+91 98812 66778",
      email: "admin@blueridgepune.in"
    },
    revenueSharePercent: 15,
    monthlyRevenueGenerated: 194400,
    totalRevenueToDate: 1166400,
    status: "active",
    dedicatedWashersCount: 26,
    waterSavedLitres: 243000,
    contractStartDate: "2025-07-01",
    notes: "IT Corridor hub. Rapid early morning cleaning completed before 8:00 AM."
  },
  {
    id: "soc_3",
    name: "Kumar Posidon",
    type: "society",
    city: "Pune",
    address: "Baner Road, Near Pancard Club",
    pincode: "411045",
    totalFlats: 160,
    enrolledCars: 108,
    contactPerson: {
      name: "Anil Bapat",
      designation: "Society Treasurer",
      phone: "+91 94220 33112",
      email: "posidon.committee@yahoo.com"
    },
    revenueSharePercent: 12,
    monthlyRevenueGenerated: 10368,
    totalRevenueToDate: 51840,
    status: "active",
    dedicatedWashersCount: 3,
    waterSavedLitres: 16200,
    contractStartDate: "2026-01-10",
    notes: "Evening interior vacuum sessions conducted on alternating Saturdays."
  },
  {
    id: "soc_4",
    name: "Magarpatta City (Cosmos & Trillium)",
    type: "township",
    city: "Pune",
    address: "Magarpatta Road, Hadapsar",
    pincode: "411028",
    totalFlats: 2800,
    enrolledCars: 1290,
    contactPerson: {
      name: "Sunil Magar",
      designation: "PMS Operations Lead",
      phone: "+91 98230 44556",
      email: "carcare@magarpattacity.com"
    },
    revenueSharePercent: 15,
    monthlyRevenueGenerated: 154800,
    totalRevenueToDate: 928800,
    status: "active",
    dedicatedWashersCount: 22,
    waterSavedLitres: 193500,
    contractStartDate: "2025-09-01",
    notes: "Eco-friendly zero water runoff protocol strictly enforced."
  }
];

// Pre-seeded Pune User Subscriptions with Pending & Completed Jobs
export const DEFAULT_SUBSCRIPTIONS: CarSubscription[] = [
  {
    id: "sub_101",
    userId: "mock_seeker_1",
    userName: "Rahul Verma",
    userPhone: "+91 98201 12345",
    userEmail: "rahul.verma@example.com",
    modelType: "township",
    societyId: "town_1",
    societyName: "Amanora Park Town",
    towerWing: "Tower B, Sector 2",
    flatNumber: "804",
    parkingSlot: "B2-108",
    carMake: "Hyundai",
    carModel: "Creta SX",
    carColor: "Polar White",
    vehicleNumber: "MH 12 QX 4821",
    vehicleType: "suv",
    planId: "township_suv",
    planName: "Township Premium SUV Care",
    monthlyRate: 749,
    societyRevenueCut: 112, // 15% to Amanora Facility Fund
    billingCycle: "monthly",
    status: "active",
    startDate: "2026-01-01",
    nextBillingDate: "2026-11-01",
    recentWashLogs: [
      {
        id: "log_1_prev",
        date: "Yesterday",
        time: "06:40 AM",
        status: "completed",
        washerName: "Ramesh Pawar",
        type: "daily_exterior",
        notes: "Full body dust wiped and mirrors conditioned."
      }
    ],
    createdAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "sub_102",
    userId: "mock_seeker_2",
    userName: "Neha Kulkarni",
    userPhone: "+91 98900 87654",
    userEmail: "neha.k@example.com",
    modelType: "township",
    societyId: "town_1",
    societyName: "Amanora Park Town",
    towerWing: "Sector 3, Aspire Tower",
    flatNumber: "1402",
    parkingSlot: "P1-042",
    carMake: "Honda",
    carModel: "City ZX",
    carColor: "Radiant Red",
    vehicleNumber: "MH 12 TS 9002",
    vehicleType: "sedan",
    planId: "township_sedan",
    planName: "Township Eco Express Sedan",
    monthlyRate: 599,
    societyRevenueCut: 89, // 15% to Amanora Facility Fund
    billingCycle: "monthly",
    status: "active",
    startDate: "2026-02-15",
    nextBillingDate: "2026-11-15",
    recentWashLogs: [
      {
        id: "log_today_1",
        date: "Today",
        time: "06:15 AM",
        status: "completed",
        washerName: "Amit Jadhav",
        type: "daily_exterior",
        photoProofUrl: "/images/car_wash_hero.jpg",
        notes: "Waterless nano-polymer wash completed. Spotless finish."
      }
    ],
    createdAt: "2026-02-15T00:00:00Z"
  },
  {
    id: "sub_103",
    userId: "mock_seeker_3",
    userName: "Tanmay Deshmukh",
    userPhone: "+91 98224 55667",
    userEmail: "tanmay.d@example.com",
    modelType: "township",
    societyId: "town_2",
    societyName: "Kolte Patil Life Republic",
    towerWing: "Sector R1, Arezo Tower",
    flatNumber: "502",
    parkingSlot: "B1-055",
    carMake: "Tata",
    carModel: "Nexon EV Max",
    carColor: "Daytona Grey",
    vehicleNumber: "MH 14 DE 7733",
    vehicleType: "suv",
    planId: "township_suv",
    planName: "Township Premium SUV Care",
    monthlyRate: 749,
    societyRevenueCut: 112,
    billingCycle: "monthly",
    status: "active",
    startDate: "2026-02-01",
    nextBillingDate: "2026-11-01",
    recentWashLogs: [
      {
        id: "log_3_prev",
        date: "Yesterday",
        time: "07:05 AM",
        status: "completed",
        washerName: "Ramesh Pawar",
        type: "daily_exterior",
        notes: "High gloss tyre dressing and windshield cleaned."
      }
    ],
    createdAt: "2026-02-01T00:00:00Z"
  },
  {
    id: "sub_104",
    userId: "mock_seeker_4",
    userName: "Priya Nair",
    userPhone: "+91 97660 11223",
    userEmail: "priya.nair@example.com",
    modelType: "society",
    societyId: "soc_1",
    societyName: "Rohan Mithila",
    towerWing: "Wing C",
    flatNumber: "301",
    parkingSlot: "C-204",
    carMake: "Mahindra",
    carModel: "XUV700 AX7L",
    carColor: "Midnight Black",
    vehicleNumber: "MH 12 LK 1190",
    vehicleType: "suv",
    planId: "society_suv",
    planName: "Society Daily SUV Pass",
    monthlyRate: 799,
    societyRevenueCut: 96,
    billingCycle: "monthly",
    status: "active",
    startDate: "2026-03-01",
    nextBillingDate: "2026-11-01",
    recentWashLogs: [],
    createdAt: "2026-03-01T00:00:00Z"
  },
  {
    id: "sub_105",
    userId: "mock_seeker_5",
    userName: "Sameer Joshi",
    userPhone: "+91 98810 99441",
    userEmail: "sameer.j@example.com",
    modelType: "township",
    societyId: "soc_2",
    societyName: "Blue Ridge Township",
    towerWing: "Tower 12",
    flatNumber: "1102",
    parkingSlot: "B2-210",
    carMake: "Kia",
    carModel: "Seltos GTX+",
    carColor: "Gravity Grey",
    vehicleNumber: "MH 14 AB 5521",
    vehicleType: "suv",
    planId: "township_suv",
    planName: "Township Eco SUV Pass",
    monthlyRate: 749,
    societyRevenueCut: 112,
    billingCycle: "monthly",
    status: "active",
    startDate: "2026-01-20",
    nextBillingDate: "2026-11-20",
    recentWashLogs: [
      {
        id: "log_today_5",
        date: "Today",
        time: "06:40 AM",
        status: "completed",
        washerName: "Ramesh Pawar",
        type: "daily_exterior",
        notes: "Exterior microfiber dry wash done, windshield wiped clean, tyre dressed."
      }
    ],
    createdAt: "2026-01-20T00:00:00Z"
  },
  {
    id: "sub_106",
    userId: "mock_seeker_6",
    userName: "Vikram Malhotra",
    userPhone: "+91 97110 33445",
    userEmail: "vikram.m@example.com",
    modelType: "individual",
    parkingSlot: "Bungalow Bay 1, Kothrud",
    carMake: "BMW",
    carModel: "330i M Sport",
    carColor: "Phytonic Blue",
    vehicleNumber: "MH 12 MJ 0007",
    vehicleType: "luxury",
    planId: "ind_luxury",
    planName: "Individual Executive Luxury Care",
    monthlyRate: 1399,
    societyRevenueCut: 0,
    billingCycle: "monthly",
    status: "active",
    startDate: "2026-03-01",
    nextBillingDate: "2026-11-01",
    recentWashLogs: [],
    createdAt: "2026-03-01T00:00:00Z"
  }
];

export const PRICING_MATRIX = {
  individual: {
    hatchback: { monthly: 599, original: 799, name: "Individual Daily Hatchback Care" },
    sedan: { monthly: 799, original: 999, name: "Individual Daily Sedan Care" },
    suv: { monthly: 999, original: 1299, name: "Individual Daily SUV Care" },
    luxury: { monthly: 1399, original: 1799, name: "Individual Executive Luxury Care" }
  },
  society: {
    hatchback: { monthly: 479, original: 799, name: "Society Daily Hatchback Pass", discountText: "20% RWA Discount", revSharePercent: 12 },
    sedan: { monthly: 639, original: 999, name: "Society Daily Sedan Pass", discountText: "20% RWA Discount", revSharePercent: 12 },
    suv: { monthly: 799, original: 1299, name: "Society Daily SUV Pass", discountText: "20% RWA Discount", revSharePercent: 12 },
    luxury: { monthly: 1119, original: 1799, name: "Society Executive Luxury Pass", discountText: "20% RWA Discount", revSharePercent: 12 }
  },
  township: {
    hatchback: { monthly: 449, original: 799, name: "Township Eco Hatchback Pass", discountText: "25% Township Fleet Rate", revSharePercent: 15 },
    sedan: { monthly: 599, original: 999, name: "Township Eco Sedan Pass", discountText: "25% Township Fleet Rate", revSharePercent: 15 },
    suv: { monthly: 749, original: 1299, name: "Township Eco SUV Pass", discountText: "25% Township Fleet Rate", revSharePercent: 15 },
    luxury: { monthly: 1049, original: 1799, name: "Township Executive Luxury Pass", discountText: "25% Township Fleet Rate", revSharePercent: 15 }
  }
};

// Storage Helpers with automatic migration from legacy city cache to Pune
export function getSavedSocieties(): SocietyTieUp[] {
  try {
    const raw = localStorage.getItem(SOCIETIES_STORAGE_KEY);
    if (raw && !raw.includes("Bangalore") && !raw.includes("Prestige Falcon City") && !raw.includes("Mumbai")) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error(e);
  }
  try {
    localStorage.setItem(SOCIETIES_STORAGE_KEY, JSON.stringify(DEFAULT_SOCIETIES));
  } catch (e) {}
  return DEFAULT_SOCIETIES;
}

export function saveSocieties(list: SocietyTieUp[]): void {
  try {
    localStorage.setItem(SOCIETIES_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error(e);
  }
}

export function getSavedSubscriptions(): CarSubscription[] {
  try {
    const raw = localStorage.getItem(SUBSCRIPTIONS_STORAGE_KEY);
    if (raw && !raw.includes("Prestige Falcon City") && !raw.includes("KA 05") && !raw.includes("KA 01")) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error(e);
  }
  try {
    localStorage.setItem(SUBSCRIPTIONS_STORAGE_KEY, JSON.stringify(DEFAULT_SUBSCRIPTIONS));
  } catch (e) {}
  return DEFAULT_SUBSCRIPTIONS;
}

export function saveSubscriptions(list: CarSubscription[]): void {
  try {
    localStorage.setItem(SUBSCRIPTIONS_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error(e);
  }
}

// Public API
export function getPartnerSocieties(filterType?: "society" | "township"): SocietyTieUp[] {
  const all = getSavedSocieties();
  if (filterType) return all.filter(s => s.type === filterType && s.status === "active");
  return all.filter(s => s.status === "active");
}

export function getAllSocietiesAndTownships(): SocietyTieUp[] {
  return getSavedSocieties();
}

export function submitSocietyTieUpInquiry(form: SocietyInquiryForm): SocietyTieUp {
  const societies = getSavedSocieties();
  const revPercent = form.type === "township" ? 15 : 12;
  const estimatedRevenue = Math.round(form.estimatedVehicles * 650 * (revPercent / 100));

  const newTieUp: SocietyTieUp = {
    id: `tieup_${Date.now()}`,
    name: form.societyName,
    type: form.type,
    city: form.city,
    address: form.address,
    pincode: form.pincode,
    totalFlats: Number(form.totalUnits),
    enrolledCars: 0,
    contactPerson: {
      name: form.contactName,
      designation: form.designation,
      phone: form.phone,
      email: form.email
    },
    revenueSharePercent: revPercent,
    monthlyRevenueGenerated: estimatedRevenue,
    totalRevenueToDate: 0,
    status: "pending_approval",
    dedicatedWashersCount: Math.ceil(form.estimatedVehicles / 45),
    waterSavedLitres: 0,
    contractStartDate: new Date().toISOString().split("T")[0],
    notes: form.notes || `Preferred shift: ${form.preferredWashTime}`
  };

  const updated = [newTieUp, ...societies];
  saveSocieties(updated);
  return newTieUp;
}

export function updateSocietyStatus(id: string, status: SocietyTieUp["status"]): void {
  const societies = getSavedSocieties();
  const updated = societies.map(s => s.id === id ? { ...s, status } : s);
  saveSocieties(updated);
}

export function getUserSubscriptions(userId?: string): CarSubscription[] {
  const all = getSavedSubscriptions();
  if (!userId) return all;
  // If matched or matches mock seekers, return relevant
  const filtered = all.filter(s => s.userId === userId || s.userId.startsWith("mock_"));
  return filtered.length > 0 ? filtered : all;
}

export function createCarSubscription(payload: {
  userId: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  modelType: CarWashModelType;
  societyId?: string;
  societyName?: string;
  towerWing?: string;
  flatNumber?: string;
  parkingSlot: string;
  carMake: string;
  carModel: string;
  carColor: string;
  vehicleNumber: string;
  vehicleType: VehicleType;
  billingCycle: "monthly" | "quarterly" | "annual";
}): CarSubscription {
  const current = getSavedSubscriptions();
  const matrix = PRICING_MATRIX[payload.modelType][payload.vehicleType];
  const monthlyRate = matrix.monthly;
  const revPercent = payload.modelType === "township" ? 15 : payload.modelType === "society" ? 12 : 0;
  const societyRevenueCut = Math.round(monthlyRate * (revPercent / 100));

  const newSub: CarSubscription = {
    id: `sub_${Date.now()}`,
    userId: payload.userId,
    userName: payload.userName,
    userPhone: payload.userPhone,
    userEmail: payload.userEmail,
    modelType: payload.modelType,
    societyId: payload.societyId,
    societyName: payload.societyName,
    towerWing: payload.towerWing,
    flatNumber: payload.flatNumber,
    parkingSlot: payload.parkingSlot,
    carMake: payload.carMake,
    carModel: payload.carModel,
    carColor: payload.carColor,
    vehicleNumber: payload.vehicleNumber.toUpperCase(),
    vehicleType: payload.vehicleType,
    planId: `${payload.modelType}_${payload.vehicleType}`,
    planName: matrix.name,
    monthlyRate,
    societyRevenueCut,
    billingCycle: payload.billingCycle,
    status: "active",
    startDate: new Date().toISOString().split("T")[0],
    nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    recentWashLogs: [
      {
        id: `log_${Date.now()}`,
        date: "Today",
        time: "Scheduled for Tomorrow 06:30 AM",
        status: "pending",
        washerName: "Assigned Society Washer",
        type: "daily_exterior",
        notes: "Subscription activated! First morning wash scheduled."
      }
    ],
    createdAt: new Date().toISOString()
  };

  const updated = [newSub, ...current];
  saveSubscriptions(updated);

  // If society, increment society enrolled count
  if (payload.societyId) {
    const societies = getSavedSocieties();
    const updatedSoc = societies.map(s => {
      if (s.id === payload.societyId) {
        return {
          ...s,
          enrolledCars: s.enrolledCars + 1,
          monthlyRevenueGenerated: s.monthlyRevenueGenerated + societyRevenueCut,
          waterSavedLitres: s.waterSavedLitres + 150
        };
      }
      return s;
    });
    saveSocieties(updatedSoc);
  }

  return newSub;
}

export function logDailyWash(subscriptionId: string, washerName: string, notes?: string, type: WashLogItem["type"] = "daily_exterior"): void {
  const subs = getSavedSubscriptions();
  const timeNow = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  
  const updated = subs.map(sub => {
    if (sub.id === subscriptionId) {
      const newLog: WashLogItem = {
        id: `log_${Date.now()}`,
        date: "Today",
        time: timeNow,
        status: "completed",
        washerName,
        type,
        photoProofUrl: "/images/car_wash_hero.jpg",
        notes: notes || "Daily scratchless microfiber exterior wash and tyre polish completed."
      };
      return {
        ...sub,
        recentWashLogs: [newLog, ...(sub.recentWashLogs || [])]
      };
    }
    return sub;
  });

  saveSubscriptions(updated);
}

export function toggleSubscriptionStatus(subscriptionId: string): "active" | "paused" {
  const subs = getSavedSubscriptions();
  let nextStatus: "active" | "paused" = "active";
  const updated = subs.map(sub => {
    if (sub.id === subscriptionId) {
      nextStatus = sub.status === "active" ? "paused" : "active";
      return { ...sub, status: nextStatus };
    }
    return sub;
  });
  saveSubscriptions(updated);
  return nextStatus;
}
