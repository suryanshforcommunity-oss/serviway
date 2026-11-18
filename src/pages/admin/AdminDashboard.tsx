import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, Wrench, Settings, Search, Bell,
  Download, TrendingUp, ShieldCheck, MessageSquare, BarChart3,
  X, CheckCircle, XCircle, AlertTriangle, LogOut,
  Car, Building2, Droplets, CheckCircle2, Award
} from "lucide-react";
import {
  collection, getDocs, doc, updateDoc, deleteDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  getAllSocietiesAndTownships,
  updateSocietyStatus,
  getSavedSubscriptions
} from "../../lib/carWashService";
import { getSavedBookings } from "../../lib/bookingService";
import { getStoredOrMockProviders } from "../../lib/mockProviders";
import type { SocietyTieUp, CarSubscription } from "../../types/carWash";

const JF = "'Hanken Grotesk','Plus Jakarta Sans',sans-serif";
const TODAY = new Date().toLocaleDateString("en-US", {
  weekday: "long", year: "numeric", month: "long", day: "numeric",
});

function StatusBadge({ status }: { status: string }) {
  const m: Record<string, string> = {
    Confirmed: "bg-teal-50 text-teal-700 border border-teal-200",
    Pending: "bg-amber-50 text-amber-700 border border-amber-200",
    Upcoming: "bg-blue-50 text-blue-700 border border-blue-200",
    "In-Progress": "bg-indigo-50 text-indigo-700 border border-indigo-200",
    "In Progress": "bg-indigo-50 text-indigo-700 border border-indigo-200",
    Completed: "bg-green-50 text-green-700 border border-green-200",
    Cancelled: "bg-red-50 text-red-700 border border-red-200",
    Disputed: "bg-orange-50 text-orange-700 border border-orange-200",
  };
  const key = Object.keys(m).find((k) => status?.startsWith(k));
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold tracking-wide whitespace-nowrap ${m[key ?? ""] || "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
}

function RoleBadge({ role }: { role: string }) {
  const m: Record<string, string> = {
    admin: "bg-purple-50 text-purple-700 border border-purple-200",
    provider: "bg-teal-50 text-teal-700 border border-teal-200",
    seeker: "bg-slate-100 text-slate-600 border border-slate-200",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold tracking-wide ${m[role] || "bg-slate-100 text-slate-600"}`}>
      {role}
    </span>
  );
}

const NAV = [
  { label: "Overview", icon: LayoutDashboard, key: "overview" },
  { label: "Car Wash & Societies", icon: Car, key: "carwash" },
  { label: "Users", icon: Users, key: "users" },
  { label: "Providers", icon: Wrench, key: "providers" },
  { label: "Bookings", icon: BarChart3, key: "bookings" },
  { label: "Settings", icon: Settings, key: "settings" },
];

const DIST_COLORS = ["bg-teal-600","bg-indigo-500","bg-slate-500","bg-amber-500","bg-red-400"];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [nav, setNav] = useState("overview");
  const [search, setSearch] = useState("");
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState<{ title: string; msg: string; onOk: () => void } | null>(null);

  // Car Wash & Society Tie-Up state
  const [societiesList, setSocietiesList] = useState<SocietyTieUp[]>([]);
  const [carSubscriptions, setCarSubscriptions] = useState<CarSubscription[]>([]);

  useEffect(() => {
    loadCarWashData();
  }, []);

  const loadCarWashData = () => {
    setSocietiesList(getAllSocietiesAndTownships());
    setCarSubscriptions(getSavedSubscriptions());
  };

  const handleApproveSociety = (socId: string) => {
    updateSocietyStatus(socId, "active");
    loadCarWashData();
    alert("Society / Township partnership contract approved! Status is now Active.");
  };

  useEffect(() => {
    (async () => {
      try {
        const [uSnap, bSnap] = await Promise.allSettled([
          getDocs(collection(db, "users")),
          getDocs(collection(db, "bookings")),
        ]);
        const us: any[] = []; 
        if (uSnap.status === "fulfilled") {
          uSnap.value.forEach((d) => us.push({ id: d.id, ...d.data() }));
        }
        const bs: any[] = []; 
        if (bSnap.status === "fulfilled") {
          bSnap.value.forEach((d) => bs.push({ id: d.id, ...d.data() }));
        }
        
        // Merge with local stored providers & bookings
        const localProviders = getStoredOrMockProviders();
        for (const lp of localProviders) {
          if (!us.some(u => u.id === lp.id)) us.push(lp);
        }
        const localBookings = getSavedBookings();
        for (const lb of localBookings) {
          if (!bs.some(b => b.id === lb.id)) bs.push(lb);
        }

        setAllUsers(us); 
        setAllBookings(bs);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    })();
  }, []);

  const providers = useMemo(() => allUsers.filter((u) => u.role === "provider"), [allUsers]);
  const seekers = useMemo(() => allUsers.filter((u) => u.role === "seeker"), [allUsers]);
  const totalRevenue = useMemo(() => allBookings.filter((b) => b.status !== "Cancelled").reduce((s, b) => s + Number(b.amount || 0), 0), [allBookings]);
  const commissionRevenue = useMemo(() => Math.round(totalRevenue * 0.10), [totalRevenue]);
  const disputed = useMemo(() => allBookings.filter((b) => String(b.status).startsWith("Disputed")), [allBookings]);

  const trendData = useMemo(() => {
    const map: Record<string, { date: string; bookings: number; revenue: number }> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      map[key] = { date: key, bookings: 0, revenue: 0 };
    }
    allBookings.forEach((b) => {
      if (b.status === "Cancelled") return;
      const ts = b.createdAt?.seconds ? new Date(b.createdAt.seconds * 1000) : null;
      if (!ts) return;
      const key = ts.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (map[key]) { map[key].bookings++; map[key].revenue += Number(b.amount || 0); }
    });
    return Object.values(map);
  }, [allBookings]);

  const serviceDist = useMemo(() => {
    const counts: Record<string, number> = {};
    allBookings.forEach((b) => { const s = b.serviceName || b.service || "Other"; counts[s] = (counts[s] || 0) + 1; });
    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([label, count]) => ({ label, pct: Math.round((count / total) * 100) }));
  }, [allBookings]);

  const confirm = (title: string, msg: string, onOk: () => void) => setConfirmModal({ title, msg, onOk });

  const deleteUser = (uid: string, name: string) => confirm("Delete User", `Delete "${name}" permanently?`, async () => {
    await deleteDoc(doc(db, "users", uid));
    setAllUsers((p) => p.filter((u) => u.id !== uid));
    setConfirmModal(null);
  });

  const changeRole = async (uid: string, newRole: string) => {
    await updateDoc(doc(db, "users", uid), { role: newRole });
    setAllUsers((p) => p.map((u) => (u.id === uid ? { ...u, role: newRole } : u)));
  };

  const cancelBooking = (bid: string) => confirm("Cancel Booking", "Cancel this booking? This cannot be undone.", async () => {
    await updateDoc(doc(db, "bookings", bid), { status: "Cancelled" });
    setAllBookings((p) => p.map((b) => (b.id === bid ? { ...b, status: "Cancelled" } : b)));
    setConfirmModal(null);
  });

  const resolveDispute = async (bid: string) => {
    await updateDoc(doc(db, "bookings", bid), { status: "Completed" });
    setAllBookings((p) => p.map((b) => (b.id === bid ? { ...b, status: "Completed" } : b)));
  };

  const exportCsv = () => {
    const rows = [["ID","Seeker","Provider","Service","Amount","Status","Date"]];
    allBookings.forEach((b) => rows.push([b.id, b.seekerName, b.providerName, b.serviceName, b.amount, b.status, b.createdAt?.seconds ? new Date(b.createdAt.seconds * 1000).toLocaleDateString() : ""]));
    const a = document.createElement("a"); a.href = "data:text/csv," + encodeURIComponent(rows.map((r) => r.join(",")).join("\n")); a.download = "serviway_bookings.csv"; a.click();
  };

  const fUsers = allUsers.filter((u) => !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));
  const fBookings = allBookings.filter((b) => !search || b.seekerName?.toLowerCase().includes(search.toLowerCase()) || b.providerName?.toLowerCase().includes(search.toLowerCase()) || b.serviceName?.toLowerCase().includes(search.toLowerCase()));
  const fProviders = providers.filter((p) => !search || p.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Inter',sans-serif", backgroundColor: "#F8FAFC" }}>
      {confirmModal && (
        <div className="fixed inset-0 z-[999] bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-bold text-slate-900 text-lg mb-2" style={{ fontFamily: JF }}>{confirmModal.title}</h3>
            <p className="text-slate-500 text-sm mb-6">{confirmModal.msg}</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmModal(null)} className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm hover:bg-slate-50">Cancel</button>
              <button onClick={confirmModal.onOk} className="flex-1 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700">Confirm</button>
            </div>
          </div>
        </div>
      )}

      <aside className="w-64 h-screen fixed left-0 top-0 bg-white border-r border-slate-200 flex flex-col p-4 z-50 shadow-sm">
        <div className="mb-8 px-2 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-teal-600 flex items-center justify-center text-white"><Wrench className="w-5 h-5" /></div>
          <div>
            <h1 className="font-bold text-teal-700 text-base leading-none" style={{ fontFamily: JF }}>ServiWay</h1>
            <p className="text-[10px] text-slate-400 tracking-widest font-mono mt-0.5">ADMIN CONSOLE</p>
          </div>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {NAV.map((item) => (
            <button key={item.key} onClick={() => setNav(item.key)} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-mono font-medium transition-all text-left w-full tracking-wide ${nav === item.key ? "bg-teal-50 text-teal-700 shadow-sm" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}>
              <item.icon className={`w-4 h-4 flex-shrink-0 ${nav === item.key ? "text-teal-600" : "text-slate-400"}`} />
              {item.label}
              {item.key === "bookings" && disputed.length > 0 && <span className="ml-auto w-5 h-5 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">{disputed.length}</span>}
            </button>
          ))}
        </nav>
        <div className="mt-auto pt-4 border-t border-slate-100 px-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white text-xs font-bold">{(user?.name || "A")[0].toUpperCase()}</div>
            <div>
              <p className="text-xs font-semibold text-slate-800 leading-tight">{user?.name || "Admin"}</p>
              <p className="text-[10px] text-slate-400 font-mono">Super Admin</p>
            </div>
          </div>
          <button onClick={() => logout().then(() => navigate("/login"))} title="Sign Out" className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"><LogOut className="w-4 h-4" /></button>
        </div>
      </aside>

      <div className="ml-64 flex-1 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search users, providers, bookings…" className="w-full bg-slate-50 border border-slate-200 rounded-full py-2 pl-9 pr-4 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all" />
            {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-3 h-3 text-slate-400" /></button>}
          </div>
          <div className="relative">
            <Bell className="w-5 h-5 text-slate-500" />
            {disputed.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">{disputed.length}</span>}
          </div>
        </header>

        <main className="flex-1 p-6 max-w-[1440px] mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: JF }}>{nav === "overview" ? "Admin Dashboard" : NAV.find((n) => n.key === nav)?.label}</h2>
              <p className="text-slate-400 text-sm mt-1">{TODAY}</p>
            </div>
            <button onClick={exportCsv} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors self-start">
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full" /></div>
          ) : (
            <>
              {nav === "overview" && (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    {[
                      { label: "Total Users", value: allUsers.length.toLocaleString(), icon: Users, bg: "bg-teal-50", ic: "text-teal-600", sub: `${seekers.length} seekers` },
                      { label: "Active Providers", value: providers.length.toLocaleString(), icon: Wrench, bg: "bg-slate-50", ic: "text-slate-600", sub: "Registered providers" },
                      { label: "Total Bookings", value: allBookings.length.toLocaleString(), icon: BarChart3, bg: "bg-indigo-50", ic: "text-indigo-600", sub: `${disputed.length} disputed` },
                      { label: "Total Generated", value: `₹${totalRevenue.toLocaleString()}`, icon: TrendingUp, bg: "bg-teal-50", ic: "text-teal-600", sub: "Excludes cancelled" },
                      { label: "Platform Earnings (10%)", value: `₹${commissionRevenue.toLocaleString()}`, icon: TrendingUp, bg: "bg-emerald-50", ic: "text-emerald-600", sub: "Website commission" },
                    ].map((c) => (
                      <div key={c.label} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                        <div className={`inline-flex p-2 ${c.bg} rounded-lg mb-4`}><c.icon className={`w-5 h-5 ${c.ic}`} /></div>
                        <p className="text-slate-400 text-[10px] font-mono uppercase tracking-wider mb-1">{c.label}</p>
                        <h3 className="text-xl font-bold text-slate-900 leading-tight" style={{ fontFamily: JF }}>{c.value}</h3>
                        <p className="text-slate-400 text-[10px] mt-1">{c.sub}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                    <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                      <h4 className="font-semibold text-slate-900 mb-4" style={{ fontFamily: JF }}>Booking Trend — Last 7 Days</h4>
                      <ResponsiveContainer width="100%" height={210}>
                        <AreaChart data={trendData} margin={{ top: 0, right: 8, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#0d9488" stopOpacity={0.18} />
                              <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                          <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} allowDecimals={false} />
                          <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }} />
                          <Area type="monotone" dataKey="bookings" stroke="#0d9488" strokeWidth={2} fill="url(#tealGrad)" dot={{ r: 4, fill: "#0d9488" }} name="Bookings" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <h4 className="font-semibold text-slate-900 mb-5" style={{ fontFamily: JF }}>Service Distribution</h4>
                      {serviceDist.length === 0 ? (
                        <p className="text-slate-400 text-sm">No booking data yet.</p>
                      ) : (
                        <div className="space-y-4">
                          {serviceDist.map((s, i) => (
                            <div key={s.label} className="space-y-1.5">
                              <div className="flex justify-between text-xs font-mono text-slate-600"><span className="truncate mr-2">{s.label}</span><span>{s.pct}%</span></div>
                              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden"><div className={`${DIST_COLORS[i % DIST_COLORS.length]} h-full rounded-full`} style={{ width: `${s.pct}%` }} /></div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
                    <h4 className="font-semibold text-slate-900 mb-4" style={{ fontFamily: JF }}>Revenue — Last 7 Days</h4>
                    <ResponsiveContainer width="100%" height={190}>
                      <BarChart data={trendData} margin={{ top: 0, right: 8, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                        <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
                        <Tooltip formatter={(v: any) => `₹${Number(v).toLocaleString()}`} contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }} />
                        <Bar dataKey="revenue" fill="#0d9488" radius={[4, 4, 0, 0]} name="Revenue (₹)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {disputed.length > 0 && (
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-6">
                      <div className="flex items-center gap-2 mb-4"><AlertTriangle className="w-5 h-5 text-orange-600" /><h4 className="font-semibold text-orange-900" style={{ fontFamily: JF }}>Disputed Bookings ({disputed.length})</h4></div>
                      <div className="space-y-3">
                        {disputed.map((b) => (
                          <div key={b.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white rounded-lg p-4 border border-orange-100 gap-3">
                            <div>
                              <p className="font-medium text-slate-900 text-sm">{b.serviceName} — {b.seekerName} / {b.providerName}</p>
                              <p className="text-xs text-orange-700 mt-0.5">{b.status}</p>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => resolveDispute(b.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700"><CheckCircle className="w-3.5 h-3.5" /> Resolve</button>
                              <button onClick={() => cancelBooking(b.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700"><XCircle className="w-3.5 h-3.5" /> Cancel</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button onClick={() => setNav("providers")} className="bg-teal-600 p-5 rounded-xl flex gap-4 items-center hover:bg-teal-700 transition-colors text-left w-full">
                      <div className="w-11 h-11 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0"><ShieldCheck className="w-6 h-6 text-white" /></div>
                      <div><h5 className="text-white font-semibold leading-tight" style={{ fontFamily: JF }}>Providers</h5><p className="text-teal-100 text-xs mt-1">{providers.length} registered providers.</p></div>
                    </button>
                    <button onClick={() => setNav("bookings")} className="bg-white p-5 rounded-xl flex gap-4 items-center border border-slate-200 shadow-sm hover:shadow-md transition-all text-left w-full">
                      <div className="w-11 h-11 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0"><MessageSquare className="w-6 h-6 text-slate-500" /></div>
                      <div><h5 className="text-slate-900 font-semibold leading-tight" style={{ fontFamily: JF }}>Bookings</h5><p className="text-slate-400 text-xs mt-1">{disputed.length} disputed need review.</p></div>
                    </button>
                    <button onClick={() => setNav("users")} className="bg-indigo-600 p-5 rounded-xl flex gap-4 items-center hover:bg-indigo-700 transition-colors text-left w-full">
                      <div className="w-11 h-11 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0"><Users className="w-6 h-6 text-white" /></div>
                      <div><h5 className="text-white font-semibold leading-tight" style={{ fontFamily: JF }}>Manage Users</h5><p className="text-indigo-200 text-xs mt-1">{allUsers.length} registered accounts.</p></div>
                    </button>
                  </div>
                </>
              )}

              {nav === "carwash" && (
                <div className="space-y-6">
                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    {[
                      {
                        label: "Total Subscribed Cars",
                        value: (societiesList.reduce((acc, s) => acc + s.enrolledCars, 0) + carSubscriptions.length).toLocaleString(),
                        icon: Car,
                        bg: "bg-teal-50",
                        ic: "text-teal-600",
                        sub: "Individual + Society + Township"
                      },
                      {
                        label: "Partner Communities",
                        value: `${societiesList.filter(s => s.status === "active").length} Active`,
                        icon: Building2,
                        bg: "bg-emerald-50",
                        ic: "text-emerald-600",
                        sub: `${societiesList.filter(s => s.status !== "active").length} Pending / Review`
                      },
                      {
                        label: "RWA Revenue Shared",
                        value: `₹${societiesList.reduce((acc, s) => acc + s.monthlyRevenueGenerated, 0).toLocaleString()}`,
                        icon: Award,
                        bg: "bg-emerald-50",
                        ic: "text-emerald-600",
                        sub: "Disbursed to Society Funds/mo"
                      },
                      {
                        label: "Platform Car MRR",
                        value: `₹${Math.round(societiesList.reduce((acc, s) => acc + s.monthlyRevenueGenerated, 0) * 1.8).toLocaleString()}`,
                        icon: TrendingUp,
                        bg: "bg-indigo-50",
                        ic: "text-indigo-600",
                        sub: "Monthly Recurring Revenue"
                      },
                      {
                        label: "Groundwater Saved",
                        value: `${Math.round(societiesList.reduce((acc, s) => acc + s.waterSavedLitres, 0) / 1000)}k Litres`,
                        icon: Droplets,
                        bg: "bg-cyan-50",
                        ic: "text-cyan-600",
                        sub: "Eco-polymer waterless tech"
                      },
                    ].map((c) => (
                      <div key={c.label} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <div className={`inline-flex p-2 ${c.bg} rounded-lg mb-3`}><c.icon className={`w-5 h-5 ${c.ic}`} /></div>
                        <p className="text-slate-400 text-[10px] font-mono uppercase tracking-wider mb-1">{c.label}</p>
                        <h3 className="text-xl font-bold text-slate-900 leading-tight" style={{ fontFamily: JF }}>{c.value}</h3>
                        <p className="text-slate-400 text-[10px] mt-1">{c.sub}</p>
                      </div>
                    ))}
                  </div>

                  {/* Society & Township Tie-Up Agreements Table */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <h4 className="font-semibold text-slate-900" style={{ fontFamily: JF }}>
                          Housing Society & Township Partnerships ({societiesList.length})
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Institutions tied up on monthly car wash contracts with revenue share models
                        </p>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
                        10%–15% RWA Fund Sharing
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-slate-50">
                            {["Community / Township", "Model Tier", "Location", "Flats / Cars", "Rev Share", "Monthly RWA Payout", "Primary Contact", "Status", "Actions"].map((h) => (
                              <th key={h} className="px-4 py-3 text-[10px] font-mono text-slate-400 uppercase tracking-wider">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {societiesList.map((soc) => (
                            <tr key={soc.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-4 py-3.5">
                                <span className="font-bold text-slate-900 text-sm block">{soc.name}</span>
                                <span className="text-[11px] text-slate-400 font-mono">ID: {soc.id}</span>
                              </td>
                              <td className="px-4 py-3.5">
                                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                                  soc.type === "township" ? "bg-indigo-100 text-indigo-700" : "bg-emerald-100 text-emerald-700"
                                }`}>
                                  {soc.type === "township" ? "Mega Township" : "Housing Society"}
                                </span>
                              </td>
                              <td className="px-4 py-3.5 text-xs text-slate-600">
                                <span className="font-medium text-slate-800">{soc.city}</span>
                                <span className="block text-[11px] text-slate-400">{soc.pincode}</span>
                              </td>
                              <td className="px-4 py-3.5 text-xs">
                                <span className="font-bold text-slate-800">{soc.enrolledCars} cars</span>
                                <span className="text-slate-400 block text-[11px]">of {soc.totalFlats} units</span>
                              </td>
                              <td className="px-4 py-3.5">
                                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                  {soc.revenueSharePercent}%
                                </span>
                              </td>
                              <td className="px-4 py-3.5 text-xs">
                                <span className="font-bold text-slate-900 block">₹{soc.monthlyRevenueGenerated.toLocaleString()}</span>
                                <span className="text-[10px] text-slate-400">Total: ₹{(soc.totalRevenueToDate / 1000).toFixed(0)}k</span>
                              </td>
                              <td className="px-4 py-3.5 text-xs">
                                <span className="font-medium text-slate-800 block">{soc.contactPerson.name}</span>
                                <span className="text-[11px] text-slate-500">{soc.contactPerson.designation}</span>
                                <span className="text-[11px] text-slate-400 block">{soc.contactPerson.phone}</span>
                              </td>
                              <td className="px-4 py-3.5">
                                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                                  soc.status === "active"
                                    ? "bg-green-100 text-green-700"
                                    : soc.status === "pending_approval"
                                    ? "bg-amber-100 text-amber-700 border border-amber-200"
                                    : "bg-blue-100 text-blue-700"
                                }`}>
                                  {soc.status === "active" ? "Active" : soc.status === "pending_approval" ? "Pending Review" : "Contract Review"}
                                </span>
                              </td>
                              <td className="px-4 py-3.5">
                                {soc.status !== "active" ? (
                                  <button
                                    onClick={() => handleApproveSociety(soc.id)}
                                    className="px-2.5 py-1 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded shadow-sm transition-colors whitespace-nowrap"
                                  >
                                    Approve Contract
                                  </button>
                                ) : (
                                  <span className="text-[11px] font-mono text-emerald-700 flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Enrolled
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Active Subscriptions Vehicles Table */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                      <h4 className="font-semibold text-slate-900" style={{ fontFamily: JF }}>
                        Subscribed Vehicles & Daily Morning Route
                      </h4>
                      <span className="text-xs text-slate-500 font-mono">
                        {carSubscriptions.length} Enrolled Vehicles
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-slate-50">
                            {["Vehicle Plate", "Model Tier", "Resident / Owner", "Society / Slot", "Plan & Rate", "RWA Share", "Today's Status"].map((h) => (
                              <th key={h} className="px-4 py-3 text-[10px] font-mono text-slate-400 uppercase tracking-wider">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {carSubscriptions.map((sub) => (
                            <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-4 py-3.5">
                                <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2 py-0.5 rounded">
                                  {sub.vehicleNumber}
                                </span>
                                <span className="text-xs font-semibold text-slate-800 block mt-1">
                                  {sub.carMake} {sub.carModel} ({sub.carColor})
                                </span>
                              </td>
                              <td className="px-4 py-3.5">
                                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                                  sub.modelType === "township" ? "bg-indigo-100 text-indigo-700" : sub.modelType === "society" ? "bg-emerald-100 text-emerald-700" : "bg-teal-100 text-teal-700"
                                }`}>
                                  {sub.modelType.toUpperCase()}
                                </span>
                              </td>
                              <td className="px-4 py-3.5 text-xs text-slate-700">
                                <span className="font-semibold block">{sub.userName}</span>
                                <span className="text-[11px] text-slate-400">{sub.userPhone}</span>
                              </td>
                              <td className="px-4 py-3.5 text-xs">
                                <span className="font-medium text-slate-900 block">{sub.societyName || "Individual Home"}</span>
                                <span className="font-mono font-bold text-teal-700 text-[11px]">Slot {sub.parkingSlot}</span>
                              </td>
                              <td className="px-4 py-3.5 text-xs">
                                <span className="font-bold text-slate-900">₹{sub.monthlyRate}/mo</span>
                                <span className="text-[11px] text-slate-500 block truncate max-w-[120px]">{sub.planName}</span>
                              </td>
                              <td className="px-4 py-3.5 text-xs font-bold text-emerald-700">
                                {sub.societyRevenueCut > 0 ? `+₹${sub.societyRevenueCut}/mo` : "—"}
                              </td>
                              <td className="px-4 py-3.5 text-xs">
                                <span className="px-2 py-0.5 rounded-full font-bold bg-green-50 text-green-700 border border-green-200 text-[11px]">
                                  {sub.recentWashLogs?.[0]?.status === "completed" ? "Washed 06:45 AM" : "Scheduled"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {nav === "users" && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200"><h4 className="font-semibold text-slate-900" style={{ fontFamily: JF }}>All Users ({fUsers.length})</h4></div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead><tr className="bg-slate-50">{["Name","Email","Role","Actions"].map((h)=><th key={h} className="px-5 py-3 text-[10px] font-mono text-slate-400 uppercase tracking-wider">{h}</th>)}</tr></thead>
                      <tbody className="divide-y divide-slate-100">
                        {fUsers.map((u) => (
                          <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-5 py-3.5 font-medium text-slate-900 text-sm">{u.name || "—"}</td>
                            <td className="px-5 py-3.5 text-sm text-slate-500">{u.email}</td>
                            <td className="px-5 py-3.5"><RoleBadge role={u.role} /></td>
                            <td className="px-5 py-3.5"><div className="flex flex-wrap items-center gap-1.5">
                              {u.role !== "admin" && <button onClick={() => changeRole(u.id, "admin")} className="px-2 py-1 text-[10px] font-mono bg-purple-50 text-purple-700 border border-purple-200 rounded hover:bg-purple-100">→ Admin</button>}
                              {u.role !== "provider" && <button onClick={() => changeRole(u.id, "provider")} className="px-2 py-1 text-[10px] font-mono bg-teal-50 text-teal-700 border border-teal-200 rounded hover:bg-teal-100">→ Provider</button>}
                              {u.role !== "seeker" && <button onClick={() => changeRole(u.id, "seeker")} className="px-2 py-1 text-[10px] font-mono bg-slate-100 text-slate-600 border border-slate-200 rounded hover:bg-slate-200">→ Seeker</button>}
                              <button onClick={() => deleteUser(u.id, u.name)} className="px-2 py-1 text-[10px] font-mono bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100">Delete</button>
                            </div></td>
                          </tr>
                        ))}
                        {fUsers.length === 0 && <tr><td colSpan={4} className="px-5 py-10 text-center text-slate-400 text-sm">No users found.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {nav === "providers" && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200"><h4 className="font-semibold text-slate-900" style={{ fontFamily: JF }}>Providers ({fProviders.length})</h4></div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead><tr className="bg-slate-50">{["Name","Email","Services","Experience","Starting Price","Actions"].map((h)=><th key={h} className="px-5 py-3 text-[10px] font-mono text-slate-400 uppercase tracking-wider">{h}</th>)}</tr></thead>
                      <tbody className="divide-y divide-slate-100">
                        {fProviders.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-5 py-3.5 font-medium text-slate-900 text-sm">{p.name}</td>
                            <td className="px-5 py-3.5 text-sm text-slate-500">{p.email}</td>
                            <td className="px-5 py-3.5"><div className="flex flex-wrap gap-1">
                              {(p.categories || []).slice(0, 3).map((c: string) => <span key={c} className="px-1.5 py-0.5 bg-teal-50 text-teal-700 text-[10px] font-mono rounded border border-teal-100">{c}</span>)}
                              {(p.categories || []).length > 3 && <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-mono rounded">+{p.categories.length - 3}</span>}
                            </div></td>
                            <td className="px-5 py-3.5 text-sm text-slate-600">{p.experience || "—"}</td>
                            <td className="px-5 py-3.5 text-sm font-semibold text-teal-700">₹{p.price || "—"}</td>
                            <td className="px-5 py-3.5"><div className="flex gap-1.5">
                              <button onClick={() => changeRole(p.id, "seeker")} className="px-2 py-1 text-[10px] font-mono bg-amber-50 text-amber-700 border border-amber-200 rounded hover:bg-amber-100">Demote</button>
                              <button onClick={() => deleteUser(p.id, p.name)} className="px-2 py-1 text-[10px] font-mono bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100">Delete</button>
                            </div></td>
                          </tr>
                        ))}
                        {fProviders.length === 0 && <tr><td colSpan={6} className="px-5 py-10 text-center text-slate-400 text-sm">No providers found.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {nav === "bookings" && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
                    <h4 className="font-semibold text-slate-900" style={{ fontFamily: JF }}>All Bookings ({fBookings.length})</h4>
                    <span className="text-xs text-slate-400">Total Revenue: <span className="font-bold text-teal-700">₹{totalRevenue.toLocaleString()}</span></span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead><tr className="bg-slate-50">{["ID","Seeker","Provider","Service","Amount","Status","Date","Actions"].map((h)=><th key={h} className="px-5 py-3 text-[10px] font-mono text-slate-400 uppercase tracking-wider">{h}</th>)}</tr></thead>
                      <tbody className="divide-y divide-slate-100">
                        {fBookings.map((b) => (
                          <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-5 py-3 text-[10px] font-mono text-slate-500">{String(b.id).slice(0, 8).toUpperCase()}</td>
                            <td className="px-5 py-3 text-sm text-slate-800">{b.seekerName || "—"}</td>
                            <td className="px-5 py-3 text-sm text-slate-800">{b.providerName || "—"}</td>
                            <td className="px-5 py-3 text-sm text-slate-600">{b.serviceName || "—"}</td>
                            <td className="px-5 py-3 text-sm font-semibold text-teal-700">₹{b.amount || 0}</td>
                            <td className="px-5 py-3"><StatusBadge status={b.status || "Pending"} /></td>
                            <td className="px-5 py-3 text-xs text-slate-400">{b.createdAt?.seconds ? new Date(b.createdAt.seconds * 1000).toLocaleDateString() : "—"}</td>
                            <td className="px-5 py-3"><div className="flex gap-1.5">
                              {String(b.status).startsWith("Disputed") && <button onClick={() => resolveDispute(b.id)} className="px-2 py-1 text-[10px] font-mono bg-green-50 text-green-700 border border-green-200 rounded hover:bg-green-100">Resolve</button>}
                              {b.status !== "Cancelled" && b.status !== "Completed" && <button onClick={() => cancelBooking(b.id)} className="px-2 py-1 text-[10px] font-mono bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100">Cancel</button>}
                            </div></td>
                          </tr>
                        ))}
                        {fBookings.length === 0 && <tr><td colSpan={8} className="px-5 py-10 text-center text-slate-400 text-sm">No bookings found.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {nav === "settings" && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h4 className="font-semibold text-slate-900 mb-6" style={{ fontFamily: JF }}>Platform Settings</h4>
                    <div className="space-y-4 max-w-lg">
                      {[{ label: "Platform Name", val: "ServiWay" }, { label: "Support Email", val: "support@serviway.in" }, { label: "Commission Rate (%)", val: "10" }].map((f) => (
                        <div key={f.label} className="flex flex-col gap-1">
                          <label className="text-xs font-mono text-slate-500 uppercase tracking-wider">{f.label}</label>
                          <input defaultValue={f.val} className="border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
                        </div>
                      ))}
                      <button className="mt-2 px-5 py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 transition-colors">Save Settings</button>
                    </div>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <h4 className="font-semibold text-red-800 mb-2" style={{ fontFamily: JF }}>Danger Zone</h4>
                    <p className="text-red-600 text-sm mb-4">These actions cannot be undone.</p>
                    <button onClick={() => logout().then(() => navigate("/login"))} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700">
                      <LogOut className="w-4 h-4" /> Sign Out of Admin
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

