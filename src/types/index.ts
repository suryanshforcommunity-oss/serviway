export type UserRole = "seeker" | "provider" | "admin";

export interface User {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  photoUrl?: string;
  createdAt: Date;
}

export interface Provider {
  uid: string;
  displayName: string;
  bio: string;
  categories: string[];
  serviceArea: { pincodes: string[]; radiusKm: number; city: string };
  pricing: PricingItem[];
  verificationStatus: "pending" | "approved" | "rejected";
  portfolioUrls: string[];
  idDocUrl?: string;
  rating: number;
  totalReviews: number;
  totalJobsCompleted: number;
  yearsExperience: number;
  availability: {
    isOnline: boolean;
    workingHours: Record<string, { start: string; end: string }>;
  };
  createdAt: Date;
}

export interface PricingItem {
  serviceId: string;
  name: string;
  min: number;
  max: number;
  rateType: "per_visit" | "per_hour" | "per_day";
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  slug: string;
  color: string;
  sortOrder: number;
  isActive: boolean;
}

export type BookingStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "inProgress"
  | "completed"
  | "cancelled";

export interface Booking {
  id: string;
  seekerId: string;
  seekerName: string;
  providerId: string;
  providerName: string;
  serviceId: string;
  serviceName: string;
  categoryId: string;
  status: BookingStatus;
  scheduledAt: Date;
  address: {
    line1: string;
    city: string;
    pincode: string;
  };
  amount: { service: number; convenience: number; total: number };
  paymentStatus: "pending" | "paid" | "refunded";
  paymentMethod?: string;
  seekerNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  bookingId: string;
  seekerId: string;
  seekerName: string;
  providerId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  imageUrl?: string;
  timestamp: Date;
  read: boolean;
}

export * from "./carWash";
