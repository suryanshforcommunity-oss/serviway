import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

export default function TermsPage() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: [
        { subtitle: "", text: "By accessing or using the ServiWay platform, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions, you must not use our services." },
      ]
    },
    {
      title: "2. Platform Description",
      content: [
        { subtitle: "", text: "ServiWay is an online marketplace connecting individuals seeking home services ('Seekers') with independent professionals offering such services ('Providers'). ServiWay does not directly provide the services; we provide the platform to facilitate connections and payments." },
      ]
    },
    {
      title: "3. User Accounts",
      content: [
        { subtitle: "Registration", text: "You must be at least 18 years old to register. You agree to provide accurate, current, and complete information during registration." },
        { subtitle: "Account Security", text: "You are responsible for safeguarding your password. You agree not to disclose your password to any third party and to take sole responsibility for any activities under your account." },
      ]
    },
    {
      title: "4. Seeker Obligations",
      content: [
        { subtitle: "Booking", text: "When booking a service, you agree to provide an accurate description of the work required and a safe environment for the Provider." },
        { subtitle: "Payment", text: "You agree to pay the agreed-upon price for the services rendered. Payments must be processed through the ServiWay platform unless otherwise explicitly stated." },
        { subtitle: "Cancellations & No-Shows", text: "Cancellations made less than 2 hours before the scheduled service time may be subject to a 50% cancellation fee. If a Seeker is not present at the scheduled location (Seeker Absent), their account will be flagged. Three strikes will result in a permanent platform ban." },
      ]
    },
    {
      title: "5. Provider Obligations",
      content: [
        { subtitle: "Professionalism", text: "Providers agree to perform services with the highest standard of care, skill, and professionalism." },
        { subtitle: "Verification", text: "Providers must undergo and pass background checks and identity verification before accepting bookings. Falsifying identity will lead to immediate legal action." },
        { subtitle: "OTP Verification & Fraud", text: "Providers must collect the One-Time Password (OTP) from the Seeker upon physical arrival to officially start a job. Attempting to bypass the OTP system, demanding the OTP over the phone before arrival, or falsely marking a job as complete is considered fraud and will result in immediate termination, forfeiture of pending earnings, and a permanent ban." },
      ]
    },
    {
      title: "6. Dispute Resolution",
      content: [
        { subtitle: "Reporting", text: "Any disputes regarding service quality, no-shows, or payment must be reported through the platform within 24 hours of the scheduled service time. False reporting is heavily penalized." },
        { subtitle: "Admin Authority", text: "ServiWay Administration acts as the final arbitrator in all disputes. Admins retain the right to reverse transactions, apply fines up to ₹5,000 for fraudulent behavior, and permanently ban offending parties based on system logs (e.g., OTP verification timestamps, in-app messaging, GPS metadata)." },
      ]
    },
    {
      title: "7. Limitation of Liability",
      content: [
        { subtitle: "", text: "ServiWay is not liable for any indirect, incidental, special, consequential, or punitive damages resulting from your access to or use of, or inability to access or use, the platform or services provided by independent Providers." },
      ]
    },
    {
      title: "8. Termination",
      content: [
        { subtitle: "", text: "We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms." },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <Navbar />

      <div className="bg-white border-b border-brand-border">
        <div className="container-app py-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Terms of Service</h1>
          <p className="text-slate-500">Last updated: July 25, 2026</p>
        </div>
      </div>

      <div className="container-app py-12 flex-1">
        <div className="max-w-3xl mx-auto space-y-10">
          {sections.map((section) => (
            <section key={section.title} className="card p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{section.title}</h2>
              <div className="space-y-4">
                {section.content.map((item, i) => (
                  <div key={i}>
                    {item.subtitle && <h3 className="font-semibold text-slate-800 mb-1">{item.subtitle}</h3>}
                    <p className="text-slate-600 text-sm leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
