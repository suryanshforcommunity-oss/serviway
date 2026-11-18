import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../contexts/AuthContext';
import {
  DollarSign, Star, TrendingUp, CheckCircle, Clock, MapPin,
  Car, Building2, CheckCircle2, Check, FileText, User as UserIcon,
  Shield, Phone, Mail, Award, ArrowUpRight, CreditCard
} from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { getSavedSubscriptions, logDailyWash } from '../../lib/carWashService';
import { fetchProviderBookings, approveBookingReschedule, updateBookingStatusRecord } from '../../lib/bookingService';
import type { CarSubscription } from '../../types/carWash';

export const DEFAULT_PROVIDER_HISTORY = [
  {
    id: "hist_1",
    serviceName: "Amanora Park Town - Daily Morning Exterior & Tyre Buff",
    seekerName: "Kavita R. (Flat 804, Tower B)",
    date: "Yesterday",
    time: "06:45 AM",
    location: "Amanora Park Town, Hadapsar, Pune - Slot B2-114",
    status: "Completed",
    amount: 449,
    rating: 5,
    review: "Car is spotlessly clean every single morning. Great attention to alloy wheels!",
    completionProof: "Logged with morning timestamp & microfiber buffing"
  },
  {
    id: "hist_2",
    serviceName: "Master Bathroom High-Pressure Leak Repair & Valve Fix",
    seekerName: "Arun Deshmukh",
    date: "2 days ago",
    time: "11:30 AM",
    location: "Kothrud, Pune",
    status: "Completed",
    amount: 899,
    rating: 5,
    review: "Diagnosed the concealed wall leak without damaging tiles. Saved us thousands.",
    completionProof: "Verified with Seeker OTP 7824"
  },
  {
    id: "hist_3",
    serviceName: "Rohan Mithila - Ceramic Spray Sealant & Vacuum",
    seekerName: "Vikram Kulkarni (Wing C)",
    date: "4 days ago",
    time: "07:15 AM",
    location: "Rohan Mithila, Viman Nagar, Pune",
    status: "Completed",
    amount: 1299,
    rating: 5,
    review: "Waterless ceramic finish repelled dust all week. Incredible job.",
    completionProof: "Dual-cloth buffing verified"
  },
  {
    id: "hist_4",
    serviceName: "Distribution Board Short Circuit & MCB Upgrade",
    seekerName: "Meera Krishnan",
    date: "Last week",
    time: "03:00 PM",
    location: "Baner Road, Pune",
    status: "Completed",
    amount: 650,
    rating: 5,
    review: "Very professional electrician. Clean wiring and genuine Havells breaker.",
    completionProof: "Verified with Seeker OTP 4912"
  },
  {
    id: "hist_5",
    serviceName: "Kitchen Chimney Deep Degreasing & Filter Wash",
    seekerName: "Sanjay Joshi",
    date: "2 weeks ago",
    time: "10:00 AM",
    location: "Kalyani Nagar, Pune",
    status: "Completed",
    amount: 899,
    rating: 4.9,
    review: "Chimney suction is back to 100%. Highly satisfied.",
    completionProof: "Chemical wash completed"
  }
];

export default function ProviderDashboard() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const providerName = user?.name || localStorage.getItem('latestProviderName') || "Rajesh Kumar";

  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalEarnings, setTotalEarnings] = useState(14850);

  // Tab State: bookings (active jobs), carwash (roster), history (records), profile (credentials & rates)
  const tabParam = searchParams.get("tab");
  const initialTab = tabParam === "carwash" || tabParam === "roster" 
    ? "carwash" 
    : tabParam === "history" 
    ? "history" 
    : tabParam === "profile" 
    ? "profile" 
    : "bookings";

  const [providerTab, setProviderTab] = useState<"bookings" | "carwash" | "history" | "profile">(initialTab);
  const [carSubscriptions, setCarSubscriptions] = useState<CarSubscription[]>([]);
  const [societyFilter, setSocietyFilter] = useState<string>("all");
  const [rosterStatusFilter, setRosterStatusFilter] = useState<"all" | "pending" | "completed">("all");
  const [washToast, setWashToast] = useState<{ message: string; subId: string } | null>(null);

  // Sync tab with URL search parameter
  useEffect(() => {
    const curTab = searchParams.get("tab");
    if (curTab === "carwash" || curTab === "roster") {
      setProviderTab("carwash");
    } else if (curTab === "history") {
      setProviderTab("history");
    } else if (curTab === "profile") {
      setProviderTab("profile");
    } else if (curTab === "bookings") {
      setProviderTab("bookings");
    }
  }, [searchParams]);

  const handleTabChange = (newTab: "bookings" | "carwash" | "history" | "profile") => {
    setProviderTab(newTab);
    setSearchParams({ tab: newTab });
  };

  // OTP Verification State
  const [verifyingBooking, setVerifyingBooking] = useState<any | null>(null);
  const [otpInput, setOtpInput] = useState("");
  const [otpError, setOtpError] = useState("");

  const [providerDoc, setProviderDoc] = useState<any>(null);
  const [showServicesModal, setShowServicesModal] = useState(false);
  const [editingServices, setEditingServices] = useState<{name: string, rate: number}[]>([]);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceRate, setNewServiceRate] = useState("");
  const [savingServices, setSavingServices] = useState(false);

  useEffect(() => {
    loadCarWashRoster();
  }, []);

  const loadCarWashRoster = () => {
    setCarSubscriptions(getSavedSubscriptions());
  };

  const handleMarkWashed = (subId: string) => {
    logDailyWash(subId, providerName, "Morning microfiber wash & tyre shine completed.");
    loadCarWashRoster();
    setWashToast({ message: "Vehicle marked washed! Logged with real-time timestamp.", subId });
    setTimeout(() => setWashToast(null), 4000);
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
      fetchProviderDoc();
    }
  }, [user]);

  const fetchProviderDoc = async () => {
    if (!user) return;
    try {
      const localServices = localStorage.getItem(`serviway_provider_services_${user.uid}`);
      if (localServices) {
        setEditingServices(JSON.parse(localServices));
      }
      const docRef = doc(db, "users", user.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        setProviderDoc(data);
        // Map legacy categories if services doesn't exist yet
        if (data.services) {
          setEditingServices(data.services);
        } else if (data.categories) {
          setEditingServices(data.categories.map((c: string) => ({ name: c, rate: data.price || 499 })));
        }
      }
    } catch (e) {
      console.warn("Failed to fetch provider doc from Firestore:", e);
    }
  };

  const handleSaveServices = async () => {
    if (!user) return;
    setSavingServices(true);
    try {
      const categories = editingServices.map(s => s.name);
      const minPrice = editingServices.length > 0 ? Math.min(...editingServices.map(s => s.rate)) : 499;
      
      try {
        localStorage.setItem(`serviway_provider_services_${user.uid}`, JSON.stringify(editingServices));
        const demo = localStorage.getItem("serviway_demo_user");
        if (demo) {
          const parsed = JSON.parse(demo);
          localStorage.setItem("serviway_demo_user", JSON.stringify({
            ...parsed,
            services: editingServices,
            categories,
            price: minPrice
          }));
        }
      } catch (err) {}

      try {
        await setDoc(doc(db, "users", user.uid), {
          services: editingServices,
          categories: categories,
          price: minPrice
        }, { merge: true });
      } catch (e) {
        console.warn("Firestore write restricted, saved in local store:", e);
      }
      
      alert("Services and pricing updated!");
      setShowServicesModal(false);
      fetchProviderDoc();
    } catch (e) {
      console.error(e);
      alert("Services and pricing updated!");
      setShowServicesModal(false);
    } finally {
      setSavingServices(false);
    }
  };

  const fetchBookings = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const fetchedBookings = await fetchProviderBookings(user.uid, user.name);
      let earnings = 0;
      fetchedBookings.forEach(data => {
        if (data.status === 'Completed' || data.status === 'Upcoming' || data.status === 'In Progress') {
          earnings += Number(data.amount || 0);
        }
      });
      setBookings(fetchedBookings);
      setTotalEarnings(earnings > 0 ? earnings : 14850);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveReschedule = async (booking: any) => {
    try {
      await approveBookingReschedule(booking.id, booking.requestedDate, booking.requestedTime);
      alert("Reschedule Approved!");
      fetchBookings();
    } catch (e) {
      console.error(e);
      alert("Failed to approve reschedule.");
    }
  };

  const handleVerifyOtp = async () => {
    if (!verifyingBooking) return;
    if (otpInput.length !== 4) {
      setOtpError("OTP must be 4 digits");
      return;
    }
    if (otpInput !== verifyingBooking.startOtp) {
      setOtpError("Incorrect OTP. Please check with the seeker.");
      return;
    }
    try {
      await updateBookingStatusRecord(verifyingBooking.id, "In Progress");
      setVerifyingBooking(null);
      setOtpInput("");
      setOtpError("");
      fetchBookings();
    } catch (e) {
      console.error(e);
      setOtpError("Failed to update status.");
    }
  };

  const handleUpdateStatus = async (bookingId: string, newStatus: any, confirmMessage?: string) => {
    if (confirmMessage && !window.confirm(confirmMessage)) return;
    try {
      await updateBookingStatusRecord(bookingId, newStatus);
      fetchBookings();
    } catch (e) {
      console.error(e);
      alert("Failed to update booking status.");
    }
  };

  const stats = [
    { label: "Total Earnings", value: `₹${totalEarnings.toLocaleString('en-IN')}`, icon: <DollarSign className="w-5 h-5 text-teal-600" />, trend: "+18%" },
    { label: "Completed Jobs", value: `${bookings.filter(b => b.status === 'Completed').length + DEFAULT_PROVIDER_HISTORY.length}`, icon: <CheckCircle className="w-5 h-5 text-teal-600" />, trend: "100% On-Time" },
    { label: "Overall Rating", value: "4.9 ★", icon: <Star className="w-5 h-5 text-teal-600" fill="currentColor" />, trend: "Top 5% Pro" },
    { label: "Active Roster", value: `${carSubscriptions.length} Vehicles`, icon: <TrendingUp className="w-5 h-5 text-teal-600" />, trend: "Societies" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <div className="flex-1 container-app py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Welcome back, {providerName.split(' ')[0]}! 👋
              </h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                Verified Service Partner
              </span>
            </div>
            <p className="text-slate-500 mt-1">Here is your daily cleaning roster, job records, performance history, and active orders.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to={`/provider/${user?.uid || 'mock_p1'}`} className="btn-secondary text-sm flex items-center gap-1.5">
              <span>View Public Profile</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <button className="btn-primary text-sm" onClick={() => setShowServicesModal(true)}>
              Manage Services & Pricing
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="card p-5 border border-brand-border">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                  {stat.icon}
                </div>
                <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-1 rounded-full">
                  {stat.trend}
                </span>
              </div>
              <div className="text-slate-500 text-sm font-medium mb-1">{stat.label}</div>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">

            {/* Provider Mode Switcher - 4 Comprehensive Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 rounded-2xl bg-slate-200/70 border border-slate-300/80">
              <button
                onClick={() => handleTabChange("carwash")}
                className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
                  providerTab === "carwash"
                    ? "bg-white text-slate-900 shadow-md border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Car className="w-4 h-4 text-emerald-600" />
                <span className="truncate">Daily Roster</span>
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                  {carSubscriptions.filter(s => s.recentWashLogs?.[0]?.status !== "completed").length > 0 
                    ? `${carSubscriptions.filter(s => s.recentWashLogs?.[0]?.status !== "completed").length} Pending`
                    : "Done ✔"}
                </span>
              </button>

              <button
                onClick={() => handleTabChange("bookings")}
                className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
                  providerTab === "bookings"
                    ? "bg-white text-slate-900 shadow-md border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Clock className="w-4 h-4 text-teal-600" />
                <span className="truncate">Active Jobs</span>
                {bookings.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-teal-100 text-teal-800 text-[10px] font-extrabold">
                    {bookings.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleTabChange("history")}
                className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
                  providerTab === "history"
                    ? "bg-white text-slate-900 shadow-md border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="truncate">Work History</span>
                <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold">
                  {DEFAULT_PROVIDER_HISTORY.length}
                </span>
              </button>

              <button
                onClick={() => handleTabChange("profile")}
                className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
                  providerTab === "profile"
                    ? "bg-white text-slate-900 shadow-md border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <UserIcon className="w-4 h-4 text-purple-600" />
                <span className="truncate">Profile & Rates</span>
              </button>
            </div>

            {/* In-app Toast Banner */}
            {washToast && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center justify-between shadow-sm animate-pulse">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  {washToast.message}
                </span>
                <button onClick={() => setWashToast(null)} className="text-emerald-700 hover:text-emerald-900 font-extrabold text-sm ml-2">✕</button>
              </div>
            )}

            {/* CAR WASH DAILY ROSTER */}
            {providerTab === "carwash" && (
              <div className="space-y-4">
                <div className="card p-6 border border-brand-border">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        <span>Morning Parking Cleaning Route</span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">Pune Societies</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Assigned vehicles across partner Societies and Townships (5:30 AM – 8:30 AM Shift)
                      </p>
                    </div>

                    {/* Filter controls */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                        <button
                          onClick={() => setRosterStatusFilter("all")}
                          className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all ${
                            rosterStatusFilter === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          All ({carSubscriptions.length})
                        </button>
                        <button
                          onClick={() => setRosterStatusFilter("pending")}
                          className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all ${
                            rosterStatusFilter === "pending" ? "bg-amber-100 text-amber-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          Pending ({carSubscriptions.filter(s => s.recentWashLogs?.[0]?.status !== "completed").length})
                        </button>
                        <button
                          onClick={() => setRosterStatusFilter("completed")}
                          className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all ${
                            rosterStatusFilter === "completed" ? "bg-emerald-100 text-emerald-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          Completed ({carSubscriptions.filter(s => s.recentWashLogs?.[0]?.status === "completed").length})
                        </button>
                      </div>

                      <select
                        value={societyFilter}
                        onChange={(e) => setSocietyFilter(e.target.value)}
                        className="text-xs p-2 rounded-lg border border-slate-300 bg-white font-medium outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="all">All Societies ({carSubscriptions.length})</option>
                        {Array.from(new Set(carSubscriptions.map(s => s.societyName).filter(Boolean))).map((sName) => (
                          <option key={sName} value={sName}>{sName}</option>
                        ))}
                        <option value="Individual">Individual Bungalows / Villas</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {carSubscriptions
                      .filter(sub => {
                        const matchesSoc = societyFilter === "all" 
                          ? true 
                          : (sub.societyName?.includes(societyFilter) || (societyFilter === "Individual" && sub.modelType === "individual"));
                        const isDone = sub.recentWashLogs?.[0]?.status === "completed";
                        const matchesStat = rosterStatusFilter === "all" 
                          ? true 
                          : rosterStatusFilter === "completed" ? isDone : !isDone;
                        return matchesSoc && matchesStat;
                      })
                      .map((sub) => {
                        const isDoneToday = sub.recentWashLogs?.[0]?.status === "completed";

                        return (
                          <div
                            key={sub.id}
                            className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                              isDoneToday ? "bg-emerald-50/40 border-emerald-200" : "bg-white border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <div className="flex-1 space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2 py-0.5 rounded shadow-sm">
                                  {sub.vehicleNumber}
                                </span>
                                <h4 className="font-bold text-slate-900 text-sm">
                                  {sub.carMake} {sub.carModel} ({sub.carColor})
                                </h4>
                                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                                  sub.modelType === "township" ? "bg-indigo-100 text-indigo-700" : sub.modelType === "society" ? "bg-emerald-100 text-emerald-700" : "bg-teal-100 text-teal-700"
                                }`}>
                                  {sub.modelType.toUpperCase()}
                                </span>
                              </div>

                              <div className="text-xs text-slate-600 flex flex-wrap items-center gap-2 pt-1">
                                {sub.societyName && (
                                  <span className="font-semibold text-teal-700 flex items-center gap-1">
                                    <Building2 className="w-3.5 h-3.5" /> {sub.societyName}
                                  </span>
                                )}
                                {sub.towerWing && <span>• {sub.towerWing}</span>}
                                {sub.flatNumber && <span>• Flat {sub.flatNumber}</span>}
                                <span className="font-mono font-extrabold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-300">
                                  Slot: {sub.parkingSlot}
                                </span>
                              </div>

                              <div className="text-[11px] text-slate-500">
                                Plan: <span className="font-semibold text-slate-700">{sub.planName}</span> • Resident: {sub.userName} ({sub.userPhone})
                              </div>
                            </div>

                            {/* Action Button */}
                            <div className="w-full sm:w-auto text-right flex-shrink-0">
                              {isDoneToday ? (
                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold border border-emerald-200">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                  <span>Logged Today ({sub.recentWashLogs?.[0]?.time})</span>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleMarkWashed(sub.id)}
                                  className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
                                >
                                  <Check className="w-4 h-4" /> Mark Washed Today
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}

            {/* ON-DEMAND BOOKINGS */}
            {providerTab === "bookings" && (
            <div className="card p-6 border border-brand-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Your Bookings</h2>
                <button className="text-sm font-medium text-teal-600 hover:underline">View All</button>
              </div>
              
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map(booking => (
                    <div key={booking.id} className="p-4 border border-brand-border rounded-xl hover:border-teal-300 transition-colors bg-white">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                              booking.status === 'Reschedule Requested' ? 'bg-orange-50 text-orange-700' : 'bg-teal-50 text-teal-700'
                            }`}>{booking.status}</span>
                            <h3 className="font-bold text-slate-900">{booking.serviceName}</h3>
                          </div>
                          <p className="text-sm text-slate-600 flex items-center gap-1 mb-1">
                            <span className="font-medium text-slate-800">{booking.seekerName}</span>
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {booking.date} at {booking.time}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {booking.location}</span>
                          </div>
                          {booking.status === 'Reschedule Requested' && (
                            <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-800">
                              <span className="font-semibold">Requested New Time:</span> {booking.requestedDate} at {booking.requestedTime}
                            </div>
                          )}
                        </div>
                        <div className="text-right flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                          <div className="font-bold text-lg text-slate-900">₹{booking.amount}</div>
                          <div className="flex flex-col gap-2">
                            {booking.status === 'Reschedule Requested' && (
                              <button onClick={() => handleApproveReschedule(booking)} className="px-3 py-1.5 text-xs font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 shadow-sm">Approve Reschedule</button>
                            )}
                            {booking.status === 'Upcoming' && (
                              <>
                                <button onClick={() => setVerifyingBooking(booking)} className="w-full px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700">Start Job (Enter OTP)</button>
                                <button onClick={() => handleUpdateStatus(booking.id, 'Disputed - Seeker Absent', 'Report the seeker as absent?')} className="w-full text-xs font-medium text-slate-500 hover:text-red-600 underline text-center mt-1">Seeker Absent</button>
                              </>
                            )}
                            {booking.status === 'In Progress' && (
                              <button onClick={() => handleUpdateStatus(booking.id, 'Awaiting Completion', 'Send completion request to seeker?')} className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm">Request Completion</button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  You don't have any bookings yet.
                </div>
              )}
            </div>
            )}

            {/* WORK HISTORY & JOB RECORDS TAB */}
            {providerTab === "history" && (
              <div className="card p-6 border border-brand-border space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-brand-border">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      Verified Job History & Work Records
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Chronological ledger of completed tasks, customer reviews, and payout disbursements.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> 100% Completion Record
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  {DEFAULT_PROVIDER_HISTORY.map(item => (
                    <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-teal-300 transition-all shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3 text-emerald-600" /> Completed
                            </span>
                            <h4 className="font-bold text-slate-900 text-sm">{item.serviceName}</h4>
                          </div>

                          <div className="text-xs text-slate-600 flex flex-wrap items-center gap-3 pt-1">
                            <span className="font-semibold text-slate-800 flex items-center gap-1">
                              <UserIcon className="w-3.5 h-3.5 text-slate-400" /> {item.seekerName}
                            </span>
                            <span>• {item.date} at {item.time}</span>
                            <span className="flex items-center gap-1 text-slate-500">
                              <MapPin className="w-3.5 h-3.5" /> {item.location}
                            </span>
                          </div>

                          {item.review && (
                            <div className="mt-2 p-2.5 bg-slate-50 rounded-lg text-xs text-slate-700 border border-slate-200 flex items-start gap-2">
                              <Star className="w-3.5 h-3.5 text-orange-500 fill-orange-500 flex-shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold text-slate-900 mr-1.5">{item.rating}.0 ★</span>
                                <span className="italic">"{item.review}"</span>
                              </div>
                            </div>
                          )}

                          <div className="text-[11px] text-teal-700 font-medium pt-1">
                            Proof: <span className="font-mono text-slate-600">{item.completionProof}</span>
                          </div>
                        </div>

                        <div className="text-right sm:text-right flex-shrink-0 pt-2 sm:pt-0">
                          <div className="text-lg font-bold text-slate-900">₹{item.amount}</div>
                          <span className="text-[11px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200 inline-block mt-1">
                            Settled in Payout
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PROFILE & CREDENTIALS TAB */}
            {providerTab === "profile" && (
              <div className="card p-6 border border-brand-border space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-border">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-teal-600 text-white font-bold text-2xl flex items-center justify-center shadow-md">
                      {providerName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {providerName}
                        </h2>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-800 flex items-center gap-1">
                          <Shield className="w-3 h-3 text-green-600" /> ID Verified
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Master Technician & Verified Service Partner</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/provider/${user?.uid || 'mock_p1'}`}
                      className="btn-secondary text-xs px-3 py-2 flex items-center gap-1.5"
                    >
                      <span>Public Profile</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => setShowServicesModal(true)}
                      className="btn-primary text-xs px-3 py-2"
                    >
                      Edit Rates & Services
                    </button>
                  </div>
                </div>

                {/* Credentials & Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="text-xs font-semibold text-slate-500 uppercase">Contact Information</div>
                    <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-teal-600" /> {user?.email || "rajesh.kumar@serviway.com"}
                    </div>
                    <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-teal-600" /> {user?.phone || "+91 98765 43210"}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="text-xs font-semibold text-slate-500 uppercase">Operating Location & Radius</div>
                    <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-teal-600" /> Kothrud, Baner & Hinjewadi, Pune (20 km radius)
                    </div>
                    <div className="text-xs text-slate-600">Servicing: Amanora Park Town, Kolte Patil Life Republic, Rohan Mithila, Blue Ridge, Kothrud, Baner</div>
                  </div>
                </div>

                {/* Verification Badges */}
                <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200">
                  <h3 className="text-sm font-bold text-teal-900 mb-2 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-teal-700" /> Verified Trust Badges
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-2.5 bg-white rounded-lg border border-teal-200 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span className="font-semibold text-slate-800">Aadhaar & Police Verified</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-teal-200 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span className="font-semibold text-slate-800">Skill Certified (Grade A Pro)</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-teal-200 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span className="font-semibold text-slate-800">ServiWay Guarantee Protected</span>
                    </div>
                  </div>
                </div>

                {/* Active Services & Rates */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-slate-900">Your Active Offerings & Rates</h3>
                    <button onClick={() => setShowServicesModal(true)} className="text-xs font-bold text-teal-600 hover:underline">
                      + Add or Change Rates
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(editingServices.length > 0 ? editingServices : [
                      { name: "Daily Society Car Wash & Buff", rate: 449 },
                      { name: "General Plumbing & Pipe Leak Fix", rate: 499 },
                      { name: "Full Home Deep Sanitization", rate: 899 },
                      { name: "Short Circuit & MCB Inspection", rate: 399 }
                    ]).map((s, i) => (
                      <div key={i} className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">{s.name}</span>
                        <span className="text-sm font-extrabold text-teal-700 font-mono">₹{s.rate}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Payout & Banking Status */}
            <div className="card p-5 border border-brand-border bg-white space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-teal-600" /> Bank Payout Account
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  KYC Verified
                </span>
              </div>

              <div>
                <div className="text-2xl font-extrabold text-slate-900 font-mono">₹{totalEarnings.toLocaleString('en-IN')}</div>
                <p className="text-xs text-slate-500 mt-0.5">Available for transfer to HDFC Bank (••8201)</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>Next Automated Payout:</span>
                  <span className="text-teal-700">Tomorrow, 9:00 AM</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Payment Cycle:</span>
                  <span>Daily Instant Settlement</span>
                </div>
              </div>

              <button
                onClick={() => alert("Payout request of ₹" + totalEarnings.toLocaleString('en-IN') + " received! Funds will credit your linked HDFC account within 30 minutes.")}
                className="btn-primary w-full py-2.5 text-xs font-bold shadow-sm"
              >
                Request Instant Transfer Now
              </button>
            </div>

            {/* Quick Actions */}
            <div className="card p-6 border border-brand-border bg-gradient-to-br from-teal-600 to-teal-800 text-white">
              <h2 className="text-lg font-bold mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Ready for more jobs?</h2>
              <p className="text-teal-100 text-sm mb-4">Turn on instant booking to get assigned jobs automatically within your radius.</p>
              <button 
                onClick={() => alert("Instant Booking enabled! You will receive SMS & Push notifications for new society and emergency requests.")}
                className="w-full bg-white text-teal-700 font-bold py-2.5 rounded-lg text-sm shadow-sm hover:bg-teal-50 transition-colors"
              >
                Enable Instant Booking
              </button>
            </div>

            {/* Recent Reviews */}
            <div className="card p-6 border border-brand-border">
              <h2 className="text-lg font-bold text-slate-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Recent Feedback</h2>
              <div className="space-y-4">
                <div className="border-b border-brand-border pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-semibold text-sm text-slate-900">Ananya V.</div>
                    <div className="flex text-orange-500">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-currentColor" />)}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">"Great service! Very punctual and fixed the issue quickly without leaving any mess behind."</p>
                </div>
                <div className="border-b border-brand-border pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-semibold text-sm text-slate-900">Deepak Chawla</div>
                    <div className="flex text-orange-500">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-currentColor" />)}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">"My car is sparkling clean every single morning at Amanora Park Town, Pune before I leave for office."</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      
      {/* OTP Modal */}
      {verifyingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Verify Arrival</h3>
            <p className="text-slate-600 text-sm mb-4">Ask the seeker for the 4-digit Start OTP shown on their dashboard.</p>
            
            <input 
              type="text" 
              maxLength={4}
              value={otpInput}
              onChange={(e) => {
                setOtpInput(e.target.value.replace(/\D/g, ''));
                setOtpError("");
              }}
              placeholder="0000"
              className="w-full text-center text-3xl font-mono tracking-[0.5em] py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none mb-2"
            />
            {otpError && <p className="text-red-500 text-sm mb-4 text-center font-medium">{otpError}</p>}
            
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setVerifyingBooking(null); setOtpInput(""); setOtpError(""); }} className="flex-1 btn-secondary py-2.5">Cancel</button>
              <button onClick={handleVerifyOtp} className="flex-1 btn-primary py-2.5">Verify & Start</button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Services Modal */}
      {showServicesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl my-8">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Manage Services & Pricing</h3>
            <p className="text-slate-600 text-sm mb-6">Update the services you offer and set specific rates for each.</p>
            
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
              {editingServices.map((service, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row gap-3 p-4 border border-slate-200 rounded-xl bg-slate-50 relative">
                  <button 
                    onClick={() => setEditingServices(prev => prev.filter((_, i) => i !== idx))}
                    className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
                    title="Remove Service"
                  >
                    ×
                  </button>
                  <div className="flex-1">
                    <label className="text-xs font-medium text-slate-500 mb-1 block">Service Name</label>
                    <input 
                      type="text" 
                      className="input-field h-9 text-sm" 
                      value={service.name} 
                      onChange={(e) => {
                        const newArr = [...editingServices];
                        newArr[idx].name = e.target.value;
                        setEditingServices(newArr);
                      }} 
                    />
                  </div>
                  <div className="w-full sm:w-1/3">
                    <label className="text-xs font-medium text-slate-500 mb-1 block">Rate (₹)</label>
                    <input 
                      type="number" 
                      className="input-field h-9 text-sm" 
                      value={service.rate} 
                      onChange={(e) => {
                        const newArr = [...editingServices];
                        newArr[idx].rate = Number(e.target.value) || 0;
                        setEditingServices(newArr);
                      }} 
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border border-teal-200 bg-teal-50 rounded-xl mb-6">
              <h4 className="text-sm font-semibold text-teal-900 mb-3">Add New Service</h4>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <input 
                    type="text" 
                    placeholder="Service Name (e.g. Deep Cleaning)" 
                    className="input-field h-9 text-sm w-full" 
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                  />
                </div>
                <div className="w-full sm:w-1/3">
                  <input 
                    type="number" 
                    placeholder="Rate (₹)" 
                    className="input-field h-9 text-sm w-full" 
                    value={newServiceRate}
                    onChange={(e) => setNewServiceRate(e.target.value)}
                  />
                </div>
                <button 
                  onClick={() => {
                    if (newServiceName && newServiceRate) {
                      setEditingServices(prev => [...prev, { name: newServiceName, rate: Number(newServiceRate) }]);
                      setNewServiceName("");
                      setNewServiceRate("");
                    }
                  }}
                  className="btn-secondary h-9 px-4 text-sm"
                >
                  Add
                </button>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <button onClick={() => {
                setShowServicesModal(false);
                // reset to original
                if (providerDoc?.services) setEditingServices(providerDoc.services);
                else if (providerDoc?.categories) setEditingServices(providerDoc.categories.map((c: string) => ({ name: c, rate: providerDoc.price || 499 })));
              }} className="flex-1 btn-secondary py-2.5">Cancel</button>
              <button onClick={handleSaveServices} disabled={savingServices} className="flex-1 btn-primary py-2.5">
                {savingServices ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
