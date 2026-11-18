export type VehicleType = "hatchback" | "sedan" | "suv" | "luxury";

export type CarWashModelType = "individual" | "society" | "township";

export interface CarWashPlan {
  id: string;
  name: string;
  vehicleType: VehicleType;
  modelType: CarWashModelType;
  monthlyPrice: number;
  originalPrice: number;
  exteriorWashesPerMonth: number; // e.g. 26 days
  foamWashesPerMonth: number; // e.g. 4 days
  interiorCleansPerMonth: number; // e.g. 2 days
  features: string[];
  popular?: boolean;
}

export interface WashLogItem {
  id: string;
  date: string;
  time: string;
  status: "completed" | "in_progress" | "pending" | "skipped";
  washerName: string;
  type: "daily_exterior" | "foam_wash" | "interior_deep";
  photoProofUrl?: string;
  notes?: string;
}

export interface CarSubscription {
  id: string;
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
  carMake: string; // e.g. Hyundai
  carModel: string; // e.g. Creta
  carColor: string; // e.g. Polar White
  vehicleNumber: string; // e.g. MH 12 AB 4589
  vehicleType: VehicleType;
  planId: string;
  planName: string;
  monthlyRate: number;
  societyRevenueCut: number; // Monthly revenue earned by the society for this car
  billingCycle: "monthly" | "quarterly" | "annual";
  status: "active" | "paused" | "pending_activation" | "cancelled";
  startDate: string;
  nextBillingDate: string;
  recentWashLogs: WashLogItem[];
  createdAt: string;
}

export interface SocietyTieUp {
  id: string;
  name: string;
  type: "society" | "township";
  city: string;
  address: string;
  pincode: string;
  totalFlats: number;
  enrolledCars: number;
  contactPerson: {
    name: string;
    designation: string; // "RWA President", "Society Secretary", "Facility Director"
    phone: string;
    email: string;
  };
  revenueSharePercent: number; // e.g. 12% for society, 15% for township
  monthlyRevenueGenerated: number; // e.g. ₹28,500
  totalRevenueToDate: number; // e.g. ₹1,85,000
  status: "active" | "contract_review" | "in_discussion" | "pending_approval";
  dedicatedWashersCount: number;
  waterSavedLitres: number;
  contractStartDate: string;
  notes?: string;
}

export interface SocietyInquiryForm {
  societyName: string;
  type: "society" | "township";
  city: string;
  address: string;
  pincode: string;
  totalUnits: number;
  estimatedVehicles: number;
  contactName: string;
  designation: string;
  phone: string;
  email: string;
  preferredWashTime: "early_morning" | "late_morning" | "both";
  notes?: string;
}
