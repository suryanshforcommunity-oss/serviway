import { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../contexts/AuthContext';
import {
  Search, Calendar, Clock, ShieldCheck, Wrench, Zap, Car, CheckCircle2,
  PauseCircle, PlayCircle, Eye, Sparkles, Building2,
  ChevronRight, ArrowRight, X
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { getUserSubscriptions, toggleSubscriptionStatus } from '../../lib/carWashService';
import { fetchSeekerBookings, requestBookingReschedule, updateBookingStatusRecord } from '../../lib/bookingService';
import type { CarSubscription } from '../../types/carWash';

export default function SeekerDashboard() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const userName = user?.name || "Seeker";

  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Car Wash Subscriptions State
  const [carSubs, setCarSubs] = useState<CarSubscription[]>([]);
  const [activeTab, setActiveTab] = useState<"services" | "carwash">(
    searchParams.get("tab") === "services" ? "services" : "carwash"
  );
  const [selectedSubForLogs, setSelectedSubForLogs] = useState<CarSubscription | null>(null);
  const [selectedPhotoProof, setSelectedPhotoProof] = useState<string | null>(null);

  // Reschedule State
  const [reschedulingBookingId, setReschedulingBookingId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "services") {
      setActiveTab("services");
    } else if (tab === "carwash") {
      setActiveTab("carwash");
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      fetchBookings();
      loadCarSubscriptions();
    } else {
      loadCarSubscriptions();
    }
  }, [user]);

  const loadCarSubscriptions = () => {
    const list = getUserSubscriptions(user?.uid);
    setCarSubs(list);
  };

  const handleToggleSubPause = (subId: string) => {
    toggleSubscriptionStatus(subId);
    loadCarSubscriptions();
  };

  const fetchBookings = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const list = await fetchSeekerBookings(user.uid, user.name);
      setBookings(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestReschedule = async (bookingId: string) => {
    if (!newDate || !newTime) {
      alert("Please select a new date and time.");
      return;
    }
    try {
      await requestBookingReschedule(bookingId, newDate, newTime);
      alert("Reschedule request sent to provider!");
      setReschedulingBookingId(null);
      fetchBookings();
    } catch (e) {
      console.error(e);
      alert("Failed to send reschedule request.");
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

  const categories = [
    { name: "Car Wash (Subs)", icon: <Car className="w-5 h-5" />, color: "bg-emerald-50 text-emerald-600", link: "/car-wash" },
    { name: "Cleaning", icon: <Zap className="w-5 h-5" />, color: "bg-blue-50 text-blue-600", link: "/search?category=cleaning" },
    { name: "Plumbing", icon: <Wrench className="w-5 h-5" />, color: "bg-orange-50 text-orange-600", link: "/search?category=plumbing" },
    { name: "Electrical", icon: <Zap className="w-5 h-5" />, color: "bg-teal-50 text-teal-600", link: "/search?category=electrical" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      
      <div className="flex-1 container-app py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Welcome back, {userName.split(' ')[0]}!
            </h1>
            <p className="text-slate-500 text-sm mt-1">Manage your home services and daily car wash subscriptions.</p>
          </div>
          <Link
            to="/car-wash"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/30 transition-all self-start sm:self-auto"
          >
            <Car className="w-4 h-4" /> Add Car Subscription
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Tab Switcher: Car Wash vs Home Services */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-200/70 border border-slate-300/80">
              <button
                onClick={() => setActiveTab("carwash")}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  activeTab === "carwash"
                    ? "bg-white text-slate-900 shadow-md border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Car className="w-4 h-4 text-teal-600" />
                <span>Car Wash Subscriptions</span>
                <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[11px] font-extrabold">
                  {carSubs.length} Active
                </span>
              </button>

              <button
                onClick={() => setActiveTab("services")}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  activeTab === "services"
                    ? "bg-white text-slate-900 shadow-md border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Wrench className="w-4 h-4 text-orange-600" />
                <span>Home Bookings</span>
                {bookings.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[11px] font-extrabold">
                    {bookings.length}
                  </span>
                )}
              </button>
            </div>

            {/* TAB CONTENT: CAR WASH SUBSCRIPTIONS */}
            {activeTab === "carwash" && (
              <div className="space-y-6">
                
                {/* Active Subscriptions List */}
                <div className="space-y-4">
                  {carSubs.map((sub) => {
                    const latestLog = sub.recentWashLogs?.[0];
                    const isCompletedToday = latestLog?.status === "completed";

                    return (
                      <div
                        key={sub.id}
                        className={`rounded-2xl border p-5 md:p-6 transition-all ${
                          sub.status === "paused"
                            ? "bg-slate-100/70 border-slate-300 opacity-80"
                            : "bg-white border-slate-200 shadow-sm hover:shadow-md"
                        }`}
                      >
                        {/* Top Meta Header */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
                          <div className="flex items-center gap-2">
                            <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                              sub.modelType === "township"
                                ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                                : sub.modelType === "society"
                                ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                : "bg-teal-100 text-teal-700 border border-teal-200"
                            }`}>
                              {sub.modelType === "township" ? "Mega Township Pass" : sub.modelType === "society" ? "Society Tie-Up Pass" : "Individual Doorstep"}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              sub.status === "active" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                            }`}>
                              {sub.status === "active" ? "● Active" : "⏸ Paused"}
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="text-sm font-extrabold text-slate-900">₹{sub.monthlyRate}</span>
                            <span className="text-xs text-slate-400">/mo</span>
                          </div>
                        </div>

                        {/* Vehicle Info & Location Grid */}
                        <div className="py-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                          <div className="md:col-span-7 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold bg-slate-900 text-white px-2 py-0.5 rounded tracking-wide">
                                {sub.vehicleNumber}
                              </span>
                              <h3 className="text-lg font-bold text-slate-900">
                                {sub.carMake} {sub.carModel}
                              </h3>
                            </div>
                            <p className="text-xs text-slate-500">
                              Color: {sub.carColor} • Plan: {sub.planName}
                            </p>
                            
                            {/* Parking Location */}
                            <div className="text-xs text-slate-700 pt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                              {sub.societyName && (
                                <span className="font-semibold text-teal-700 flex items-center gap-1">
                                  <Building2 className="w-3.5 h-3.5" /> {sub.societyName}
                                </span>
                              )}
                              {sub.towerWing && <span>• {sub.towerWing}</span>}
                              {sub.flatNumber && <span>• Flat {sub.flatNumber}</span>}
                              <span className="font-mono font-bold bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200 text-teal-800">
                                Slot {sub.parkingSlot}
                              </span>
                            </div>
                          </div>

                          {/* Today's Status Box */}
                          <div className="md:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-slate-600 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-teal-600" /> Today's Wash
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isCompletedToday
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}>
                                {isCompletedToday ? "Completed" : "Scheduled"}
                              </span>
                            </div>

                            {isCompletedToday ? (
                              <div className="text-xs">
                                <p className="text-slate-800 font-semibold">
                                  Washed at {latestLog?.time} by {latestLog?.washerName}
                                </p>
                                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                  {latestLog?.notes}
                                </p>
                                {latestLog?.photoProofUrl && (
                                  <button
                                    onClick={() => setSelectedPhotoProof(latestLog.photoProofUrl || null)}
                                    className="mt-2 text-[11px] font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
                                  >
                                    <Eye className="w-3.5 h-3.5" /> View Photo Proof
                                  </button>
                                )}
                              </div>
                            ) : (
                              <div className="text-xs text-slate-600">
                                Assigned morning slot: <strong>05:30 AM – 08:30 AM</strong>. Your assigned cleaner will wipe the vehicle before you leave.
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Society Revenue Share Notice */}
                        {sub.societyRevenueCut > 0 && (
                          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-2.5 text-xs text-emerald-800 flex items-center justify-between mb-4">
                            <div className="flex items-center gap-1.5 font-medium">
                              <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                              <span>
                                <strong>₹{sub.societyRevenueCut}/mo</strong> of your fee is directly credited to <strong>{sub.societyName} RWA Maintenance Fund</strong>.
                              </span>
                            </div>
                            <span className="text-[10px] font-bold uppercase bg-emerald-200/60 text-emerald-900 px-2 py-0.5 rounded">
                              RWA Partner
                            </span>
                          </div>
                        )}

                        {/* Actions Footer */}
                        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <span className="text-slate-500">
                            Next renewal: <strong>{sub.nextBillingDate}</strong>
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedSubForLogs(sub)}
                              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold flex items-center gap-1"
                            >
                              <Calendar className="w-3.5 h-3.5" /> Cleaning Logs
                            </button>
                            <button
                              onClick={() => handleToggleSubPause(sub.id)}
                              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition-colors ${
                                sub.status === "active"
                                  ? "border border-amber-200 text-amber-700 hover:bg-amber-50"
                                  : "border border-green-200 text-green-700 hover:bg-green-50"
                              }`}
                            >
                              {sub.status === "active" ? (
                                <>
                                  <PauseCircle className="w-3.5 h-3.5" /> Pause While on Vacation
                                </>
                              ) : (
                                <>
                                  <PlayCircle className="w-3.5 h-3.5" /> Resume Daily Service
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Society Promotion Banner */}
                <div className="rounded-2xl p-6 bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md border border-teal-500/30">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500 text-slate-950">
                      RWA & Township Tie-Up
                    </span>
                    <h4 className="text-lg font-bold text-white">Have Another Car or Living in a Gated Society?</h4>
                    <p className="text-xs text-slate-300 max-w-md">
                      Get your residential society or township tied up with ServiWay. Residents get 20% discount and your society earns thousands in monthly maintenance revenue!
                    </p>
                  </div>
                  <Link
                    to="/car-wash"
                    className="px-5 py-2.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-extrabold text-xs shadow transition-all whitespace-nowrap flex items-center gap-1.5"
                  >
                    <span>Subscribe or Partner RWA</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            )}

            {/* TAB CONTENT: HOME SERVICE BOOKINGS */}
            {activeTab === "services" && (
              <div>
                {/* Quick Search */}
                <div className="card p-6 border border-brand-border bg-gradient-to-r from-teal-600 to-teal-800 text-white rounded-2xl shadow-sm mb-6">
                  <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>What do you need help with?</h2>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input type="text" placeholder="e.g. Electrician, Plumber, AC Repair" className="w-full pl-10 pr-4 py-3 rounded-lg text-slate-900 border-0 focus:ring-2 focus:ring-teal-400 outline-none" />
                    </div>
                    <Link to="/search" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-bold transition-colors flex items-center">
                      Search
                    </Link>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Your Home Bookings</h2>
                </div>
                
                {loading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.map(booking => (
                      <div key={booking.id} className="card p-4 border border-brand-border flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <div className="w-16 h-16 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-2xl uppercase flex-shrink-0">
                          {booking.providerName?.charAt(0)}
                        </div>
                        <div className="flex-1 w-full">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                              booking.status === 'Reschedule Requested' ? 'bg-orange-100 text-orange-700' : 'bg-teal-50 text-teal-700'
                            }`}>{booking.status}</span>
                            <h3 className="font-bold text-slate-900">{booking.serviceName}</h3>
                          </div>
                          <p className="text-sm text-slate-600 mb-2">with {booking.providerName}</p>
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {booking.date}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {booking.time}</span>
                            <span className="font-bold text-slate-700 ml-auto">₹{booking.amount}</span>
                          </div>
                          
                          {/* Rescheduling UI */}
                          {reschedulingBookingId === booking.id && (
                            <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-brand-border">
                              <h4 className="text-sm font-bold text-slate-900 mb-3">Request New Time</h4>
                              <div className="flex flex-col sm:flex-row gap-3">
                                <input type="date" className="input-field flex-1" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
                                <input type="time" className="input-field flex-1" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
                              </div>
                              <div className="flex gap-2 mt-3">
                                <button onClick={() => setReschedulingBookingId(null)} className="btn-secondary text-xs px-3 py-1.5 flex-1">Cancel</button>
                                <button onClick={() => handleRequestReschedule(booking.id)} className="btn-primary text-xs px-3 py-1.5 flex-1">Send Request</button>
                              </div>
                            </div>
                          )}
                          
                          {/* Start OTP Display */}
                          {booking.status === 'Upcoming' && booking.startOtp && (
                            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                              <div>
                                <div className="text-xs text-blue-700 font-semibold uppercase tracking-wider mb-0.5">Start Job OTP</div>
                                <div className="text-sm text-blue-900">Give this to the provider when they arrive</div>
                              </div>
                              <div className="text-2xl font-mono font-bold text-blue-700 tracking-widest bg-white px-3 py-1 rounded shadow-sm">
                                {booking.startOtp}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col gap-2 w-full sm:w-auto h-full justify-center shrink-0 min-w-[140px]">
                          {/* Upcoming Actions */}
                          {booking.status === 'Upcoming' && (
                            <>
                              {reschedulingBookingId !== booking.id && (
                                <button onClick={() => setReschedulingBookingId(booking.id)} className="w-full px-4 py-2 text-sm font-medium text-slate-600 border border-brand-border rounded-lg hover:bg-slate-50">Reschedule</button>
                              )}
                              <button onClick={() => handleUpdateStatus(booking.id, 'Cancelled', 'Are you sure you want to cancel this booking?')} className="w-full px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50">Cancel</button>
                              <button onClick={() => handleUpdateStatus(booking.id, 'Disputed - No Show', 'Report the provider as a no-show?')} className="w-full px-4 py-2 text-sm font-medium text-slate-600 hover:text-red-600 underline">Report No-Show</button>
                            </>
                          )}
                          
                          {/* Awaiting Completion Actions */}
                          {booking.status === 'Awaiting Completion' && (
                            <>
                              <button onClick={() => handleUpdateStatus(booking.id, 'Completed', 'Confirm the job is complete?')} className="w-full px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700">Verify & Complete</button>
                              <button onClick={() => handleUpdateStatus(booking.id, 'Disputed - Quality', 'Are you sure you want to dispute the completion?')} className="w-full px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50">Raise Dispute</button>
                            </>
                          )}

                          {/* General Links */}
                          <Link to={`/provider/${booking.providerId}`} className="w-full px-4 py-2 text-sm font-medium text-slate-600 border border-brand-border rounded-lg text-center hover:bg-slate-50 mt-auto">View Profile</Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="card p-8 border border-brand-border text-center">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Calendar className="w-6 h-6 text-slate-400" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-1">No upcoming bookings</h3>
                    <p className="text-sm text-slate-500 mb-4">You don't have any services scheduled right now.</p>
                    <Link to="/search" className="text-teal-600 font-semibold text-sm hover:underline">Find a service</Link>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            
            {/* Quick Car Wash Promotion Widget */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-200 text-xs font-bold uppercase tracking-wider mb-2">
                <Car className="w-4 h-4" /> Daily Doorstep Car Wash
              </div>
              <h3 className="text-lg font-bold">Never drive a dusty car again</h3>
              <p className="text-xs text-emerald-100 mt-2 leading-relaxed">
                Microfiber scratch-free cleaning, weekly foam wash & interior vacuuming right in your designated society slot.
              </p>
              <Link
                to="/car-wash"
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-emerald-950 font-bold text-xs shadow hover:bg-emerald-50 transition-colors"
              >
                <span>View Plans from ₹449/mo</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Popular Categories */}
            <div className="card p-6 border border-brand-border">
              <h2 className="text-lg font-bold text-slate-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Popular Categories</h2>
              <div className="space-y-3">
                {categories.map((cat, idx) => (
                  <Link key={idx} to={cat.link} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-brand-border">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${cat.color}`}>
                      {cat.icon}
                    </div>
                    <span className="font-semibold text-slate-700">{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Safety Banner */}
            <div className="bg-teal-50 border border-teal-100 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck className="w-6 h-6 text-teal-600" />
                <h3 className="font-bold text-slate-900">ServiWay Guarantee</h3>
              </div>
              <p className="text-sm text-slate-600">All our professionals and society cleaners are verified and background checked for your safety.</p>
            </div>

          </div>
        </div>
      </div>

      {/* Photo Proof Modal */}
      {selectedPhotoProof && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Today's Cleaned Finish Proof
              </h4>
              <button
                onClick={() => setSelectedPhotoProof(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <img
                src={selectedPhotoProof}
                alt="Car Wash Completion Proof"
                className="w-full h-64 object-cover rounded-xl"
              />
              <div className="mt-3 text-xs text-slate-600 flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span>Verified by Society Cleaner</span>
                <span className="font-mono font-bold text-emerald-700">Timestamp: 06:45 AM</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cleaning Logs Modal */}
      {selectedSubForLogs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white">
              <div>
                <h4 className="font-bold text-slate-900 text-base">Monthly Cleaning Log</h4>
                <p className="text-xs text-slate-500">
                  {selectedSubForLogs.carMake} {selectedSubForLogs.carModel} • {selectedSubForLogs.vehicleNumber}
                </p>
              </div>
              <button
                onClick={() => setSelectedSubForLogs(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              {(selectedSubForLogs.recentWashLogs || []).map((log) => (
                <div key={log.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-0.5">
                      <span className="capitalize">{log.type.replace('_', ' ')}</span>
                      <span className="text-slate-400 font-normal">{log.date} at {log.time}</span>
                    </div>
                    <p className="text-xs text-slate-600">{log.notes}</p>
                    <div className="mt-1 text-[11px] text-teal-700 font-medium">
                      Washer: {log.washerName}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}

