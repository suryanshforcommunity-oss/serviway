import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

export default function PrivacyPage() {
  const sections = [
    {
      title: "1. Information We Collect",
      content: [
        { subtitle: "Account Information", text: "When you register, we collect your name, email address, phone number, and role (seeker or provider). For providers, we also collect professional information such as services offered, experience, and pricing." },
        { subtitle: "Booking Data", text: "We collect details of every booking made on our platform including the date, time, service type, location, and transaction amount to facilitate and mediate services." },
        { subtitle: "Identity Verification (Providers)", text: "To ensure safety, providers must submit a government-issued ID (Aadhaar, PAN, or Driving License). This data is encrypted and used solely for verification purposes." },
        { subtitle: "Usage Data", text: "We collect information about how you use the platform including pages visited, features used, and device information to improve our service." },
        { subtitle: "Location Data", text: "With your permission, we collect your location to match you with nearby providers. You can disable this at any time in your device settings." },
      ]
    },
    {
      title: "2. How We Use Your Information",
      content: [
        { subtitle: "Service Delivery", text: "To connect seekers with providers, process bookings, facilitate payments, and send notifications about your appointments." },
        { subtitle: "Safety & Trust", text: "To verify identities, run background checks on providers, investigate disputes, detect fraud, and enforce our Community Guidelines." },
        { subtitle: "Communication", text: "To send booking confirmations, OTP codes for job verification, reminders, receipts, and important policy updates." },
        { subtitle: "Platform Improvement", text: "To understand how users interact with ServiWay and improve our features, UI, and matching algorithms." },
      ]
    },
    {
      title: "3. Data Sharing & Third Parties",
      content: [
        { subtitle: "Between Users", text: "When a booking is confirmed, the provider is shared the seeker's general location (not exact address until confirmed). The seeker is shown the provider's name, photo, and rating." },
        { subtitle: "Payment Processors", text: "Payment data is processed through RazorPay and is never stored on our servers. We receive only a transaction confirmation." },
        { subtitle: "We Do NOT Sell Your Data", text: "ServiWay does not sell, rent, or trade your personal information to third parties for their marketing purposes. Period." },
        { subtitle: "Legal Requirements", text: "We may disclose information if required by Indian law, court order, or to protect the safety of our users." },
      ]
    },
    {
      title: "4. Data Security",
      content: [
        { subtitle: "Encryption", text: "All data is encrypted in transit (TLS 1.3) and at rest (AES-256). Your password is hashed using bcrypt and is never stored in plain text." },
        { subtitle: "Access Control", text: "Only authorized ServiWay personnel can access user data, and only when necessary for support or safety purposes. All access is logged." },
        { subtitle: "Firebase Security", text: "We use Google Firebase, which is ISO 27001 certified and compliant with GDPR and India's Personal Data Protection standards." },
      ]
    },
    {
      title: "5. Your Rights",
      content: [
        { subtitle: "Access", text: "You can request a copy of all data we hold about you by emailing privacy@serviway.in." },
        { subtitle: "Correction", text: "You can update most of your personal information directly from your account settings." },
        { subtitle: "Deletion", text: "You can request account deletion at any time. We will delete your data within 30 days, except where we are legally required to retain it (e.g., transaction records for 7 years under Indian tax law)." },
        { subtitle: "Data Portability", text: "You can request an export of your booking history, reviews received, and profile data in JSON format." },
      ]
    },
    {
      title: "6. Cookies & Tracking",
      content: [
        { subtitle: "Essential Cookies", text: "We use essential cookies to keep you logged in and maintain your session. These cannot be disabled as they are necessary for the platform to function." },
        { subtitle: "Analytics Cookies", text: "With your consent, we use Google Analytics to understand usage patterns. You can opt out at any time." },
        { subtitle: "No Ad Tracking", text: "We do not use advertising cookies or share your browsing data with ad networks." },
      ]
    },
    {
      title: "7. Children's Privacy",
      content: [
        { subtitle: "", text: "ServiWay is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If you believe a child has registered, please contact us immediately at privacy@serviway.in." },
      ]
    },
    {
      title: "8. Changes to This Policy",
      content: [
        { subtitle: "", text: "We may update this Privacy Policy from time to time. We will notify you via email and in-app notification at least 14 days before any material changes take effect. Continued use of ServiWay after that date constitutes acceptance of the new policy." },
      ]
    },
    {
      title: "9. Contact Us",
      content: [
        { subtitle: "", text: "For any privacy-related questions or requests, contact our Data Protection Officer at privacy@serviway.in or write to: ServiWay Technologies Pvt. Ltd., 4th Floor, ICC Trade Tower, Senapati Bapat Road, Pune - 411016, Maharashtra, India." },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <Navbar />

      <div className="bg-white border-b border-brand-border">
        <div className="container-app py-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Privacy Policy</h1>
          <p className="text-slate-500">Last updated: July 25, 2026 · Effective: July 25, 2026</p>
          <div className="mt-4 p-4 bg-teal-50 border border-teal-200 rounded-xl text-teal-800 text-sm">
            <strong>The short version:</strong> We collect only what we need to run ServiWay, we never sell your data, and you are always in control of your information.
          </div>
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
