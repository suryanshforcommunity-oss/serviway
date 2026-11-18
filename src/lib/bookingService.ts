import { collection, query, where, getDocs, doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export interface BookingItem {
  id: string;
  seekerId: string;
  seekerName: string;
  providerId: string;
  providerName: string;
  serviceName: string;
  date: string;
  time: string;
  location: string;
  status: "Upcoming" | "In Progress" | "Completed" | "Cancelled" | "Reschedule Requested" | "Disputed - Seeker Absent" | "Disputed - No Show" | "Disputed - Quality" | "Awaiting Completion";
  amount: number;
  startOtp: string;
  createdAt: string;
  requestedDate?: string | null;
  requestedTime?: string | null;
  notes?: string;
}

const BOOKINGS_STORAGE_KEY = "serviway_saved_bookings";

export const DEFAULT_BOOKINGS: BookingItem[] = [
  {
    id: "bk_101",
    seekerId: "demo_seeker_1",
    seekerName: "Priya Sharma",
    providerId: "mock_p1",
    providerName: "Rajesh Kumar",
    serviceName: "General Plumbing & Tap Leak Fix",
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    time: "11:30 AM",
    location: "Flat 402, Rohan Mithila, Viman Nagar, Pune",
    status: "Upcoming",
    amount: 499,
    startOtp: "4821",
    createdAt: new Date().toISOString()
  },
  {
    id: "bk_102",
    seekerId: "demo_seeker_1",
    seekerName: "Priya Sharma",
    providerId: "mock_p2",
    providerName: "Amit Sharma",
    serviceName: "Short Circuit & MCB Tripping Fix",
    date: new Date().toISOString().split("T")[0],
    time: "02:00 PM",
    location: "Bungalow 14, Baner Road, Pune",
    status: "In Progress",
    amount: 399,
    startOtp: "7824",
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: "bk_103",
    seekerId: "demo_seeker_1",
    seekerName: "Priya Sharma",
    providerId: "mock_p3",
    providerName: "SpeedShine AutoCare",
    serviceName: "Full Ceramic Spray & Scratch Shield",
    date: "Yesterday",
    time: "08:15 AM",
    location: "Amanora Park Town, Hadapsar, Pune - Slot B2-108",
    status: "Completed",
    amount: 1299,
    startOtp: "9012",
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

// Helper: Read bookings from local storage
export function getSavedBookings(): BookingItem[] {
  try {
    const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Could not read local bookings:", e);
  }
  try {
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(DEFAULT_BOOKINGS));
  } catch (e) {}
  return DEFAULT_BOOKINGS;
}

// Helper: Save bookings to local storage
export function saveBookings(list: BookingItem[]): void {
  try {
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn("Could not save bookings to local storage:", e);
  }
}

// Create a new booking with dual persistence (LocalStorage instant + Firestore background)
export async function createNewBooking(payload: {
  seekerId: string;
  seekerName: string;
  providerId: string;
  providerName: string;
  serviceName: string;
  date: string;
  time: string;
  location?: string;
  amount: number;
}): Promise<BookingItem> {
  const newId = `bk_${Date.now()}`;
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  const newBooking: BookingItem = {
    id: newId,
    seekerId: payload.seekerId,
    seekerName: payload.seekerName || "Seeker",
    providerId: payload.providerId,
    providerName: payload.providerName || "Service Provider",
    serviceName: payload.serviceName,
    date: payload.date,
    time: payload.time,
    location: payload.location || "Pune, Maharashtra",
    status: "Upcoming",
    amount: payload.amount,
    startOtp: otp,
    createdAt: new Date().toISOString()
  };

  // 1. Immediately persist to localStorage so user flow NEVER breaks
  const existing = getSavedBookings();
  const updated = [newBooking, ...existing];
  saveBookings(updated);

  // 2. Asynchronously attempt Firestore persistence without throwing to user
  try {
    setDoc(doc(db, "bookings", newId), {
      ...newBooking,
      createdAtServer: serverTimestamp()
    }).catch(err => {
      console.warn("Firestore bookings write restricted or offline; saved in local cache:", err);
    });
  } catch (e) {
    console.warn("Firestore background sync exception:", e);
  }

  return newBooking;
}

// Get bookings for Seeker (merging Firestore + LocalStorage)
export async function fetchSeekerBookings(seekerId: string, seekerName?: string): Promise<BookingItem[]> {
  const localList = getSavedBookings();
  const matchedLocal = localList.filter(
    b => b.seekerId === seekerId || 
         (seekerName && b.seekerName?.toLowerCase() === seekerName?.toLowerCase()) ||
         (seekerId.startsWith("demo_") && b.seekerId.startsWith("demo_"))
  );

  try {
    const q = query(collection(db, "bookings"), where("seekerId", "==", seekerId));
    const snap = await Promise.race([
      getDocs(q),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timeout")), 2000))
    ]);
    const firestoreList: BookingItem[] = [];
    snap.forEach(d => firestoreList.push({ id: d.id, ...d.data() } as BookingItem));

    // Merge firestore and local items without duplicates
    const combined = [...firestoreList];
    for (const item of matchedLocal) {
      if (!combined.some(c => c.id === item.id)) {
        combined.push(item);
      }
    }
    return combined.length > 0 ? combined : matchedLocal;
  } catch (e) {
    console.warn("Using local booking store for seeker:", e);
    return matchedLocal;
  }
}

// Get bookings for Provider (merging Firestore + LocalStorage)
export async function fetchProviderBookings(providerId: string, providerName?: string): Promise<BookingItem[]> {
  const localList = getSavedBookings();
  const matchedLocal = localList.filter(
    b => b.providerId === providerId || 
         (providerName && b.providerName?.toLowerCase() === providerName?.toLowerCase()) ||
         b.providerId === "mock_p1" // Fallback to include demo jobs for Rajesh Kumar
  );

  try {
    const q = query(collection(db, "bookings"), where("providerId", "==", providerId));
    const snap = await Promise.race([
      getDocs(q),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timeout")), 2000))
    ]);
    const firestoreList: BookingItem[] = [];
    snap.forEach(d => firestoreList.push({ id: d.id, ...d.data() } as BookingItem));

    const combined = [...firestoreList];
    for (const item of matchedLocal) {
      if (!combined.some(c => c.id === item.id)) {
        combined.push(item);
      }
    }
    return combined.length > 0 ? combined : matchedLocal;
  } catch (e) {
    console.warn("Using local booking store for provider:", e);
    return matchedLocal;
  }
}

// Update booking status
export async function updateBookingStatusRecord(
  bookingId: string, 
  status: BookingItem["status"], 
  extraUpdates?: Partial<BookingItem>
): Promise<void> {
  const list = getSavedBookings();
  const updated = list.map(b => {
    if (b.id === bookingId) {
      return { ...b, status, ...(extraUpdates || {}) };
    }
    return b;
  });
  saveBookings(updated);

  try {
    updateDoc(doc(db, "bookings", bookingId), {
      status,
      ...(extraUpdates || {})
    }).catch(err => {
      console.warn("Firestore updateDoc background error:", err);
    });
  } catch (e) {}
}

// Request reschedule
export async function requestBookingReschedule(bookingId: string, newDate: string, newTime: string): Promise<void> {
  await updateBookingStatusRecord(bookingId, "Reschedule Requested", {
    requestedDate: newDate,
    requestedTime: newTime
  });
}

// Approve reschedule
export async function approveBookingReschedule(bookingId: string, requestedDate: string, requestedTime: string): Promise<void> {
  await updateBookingStatusRecord(bookingId, "Upcoming", {
    date: requestedDate,
    time: requestedTime,
    requestedDate: null,
    requestedTime: null
  });
}
