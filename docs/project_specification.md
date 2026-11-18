# ServiWay — Project Specification & Product Documentation

ServiWay is a premium, localized, on-demand home services marketplace inspired by modern platforms like Urban Company. It connects local service professionals (Providers) directly with clients (Seekers), facilitating discovery, custom-rate service bookings, security verifications, dispute resolution, and platform-wide metrics.

---

## 1. Core Vision & Value Proposition

- **Professional & Premium Design**: The interface is built using a modern design system called **ServiWay Administrative Core** and **ServiWay Design System**. It relies on Hanken Grotesk and Inter typography, with a distinct primary Deep Teal (`#0D9488`) color palette to convey trust and operational clarity.
- **Dynamic Pricing**: Instead of flat-rate assumptions, service providers manage customized rate lists for multiple services they offer, allowing seekers to see individual transparent pricing during checkout.
- **Safety & Verification**: Every booking generates a random Secure Start OTP which must be verified before the provider begins work.
- **Dispute Settlement**: A comprehensive administration system allows operators to resolve disputes manually (e.g. seeker absent, work disputes) to guarantee platform integrity.
- **Monetization (10% Commission)**: The platform operates on a business model where the website collects a 10% commission on all completed and non-cancelled gross revenue.

---

## 2. Platform Roles & Permission Matrix

ServiWay supports three distinct roles. Access rules are enforced via a centralized client-side `AuthGuard`:

| Role | Access Permissions | Primary Tasks |
| :--- | :--- | :--- |
| **Seeker** (Client) | Seeker Dashboard, Provider Profiles, Booking Engine | Search services, compare providers, select specific services, choose date/time, manage bookings, initiate disputes, view secure OTPs. |
| **Provider** (Professional) | Onboarding Flow, Provider Dashboard, Services Config | Manage services/rates, toggle categories, track earnings, verify seeker OTPs, update active booking statuses, request help on disputed bookings. |
| **Admin** (Operator) | Admin Dashboard, User & Booking Management | Monitor platform users/providers, delete or change roles (promote/demote), audit bookings, resolve disputes (Resolve or Cancel), view total gross revenue and 10% platform commission. |

---

## 3. Database Schema (Firestore)

ServiWay utilizes a structured, scalable schema in Firebase Firestore:

### `users` Collection
Stores credential-linked profiles for seekers, providers, and administrators.
```typescript
interface UserDocument {
  uid: string;
  name: string;
  email: string;
  role: "seeker" | "provider" | "admin";
  createdAt: Timestamp;
  
  // Provider-specific fields (optional)
  categories?: string[]; // e.g. ["Plumbing", "AC Repair"]
  experience?: string;   // e.g. "Intermediate (2-5 yrs)"
  description?: string;
  price?: number;        // Legacy flat starting price
  services?: Array<{     // Dynamic per-service pricing
    name: string;
    rate: number;
    desc: string;
  }>;
}
```

### `bookings` Collection
Stores transactional service agreements between seekers and providers.
```typescript
interface BookingDocument {
  id: string;
  seekerId: string;
  seekerName: string;
  providerId: string;
  providerName: string;
  serviceName: string; // The specific service booked
  amount: number;      // Specific service rate charged
  date: string;        // Selected booking date
  time: string;        // Selected booking time
  location: string;    // Seeker delivery address
  status: "Upcoming" | "In Progress" | "Completed" | "Cancelled" | "Disputed - Seeker Absent" | "Disputed - Work Incomplete";
  startOtp: string;    // Secure random 4-digit code (e.g. "8421")
  createdAt: Timestamp;
}
```

---

## 4. Key Workflows & User Journeys

### A. Seeker Booking Journey
1. **Discovery**: Seekers land on the homepage and search or browse categories (Plumbing, Appliance Repair, Painting, AC Repair, Carpentry, Pest Control, Security Cams).
2. **Provider Profile View**: The seeker clicks on a provider profile, showing their custom services list along with specific rates (e.g. *Deep AC Cleaning - ₹599* vs *Gas Charging - ₹2499*).
3. **Checkout**: The seeker selects a service, date, and time. The estimated total updates dynamically.
4. **Creation**: On checkout completion, a booking is created in Firestore with a status of `Upcoming` and a secure random `startOtp` (e.g. 4-digit numeric string).

### B. Provider Fulfillment & Verification Journey
1. **Onboarding**: Newly registered providers choose their categories and specify individual rates for each service.
2. **Dashboard Management**: Providers log in to their dashboard to manage active bookings, verify OTPs, and edit their service rates at any time.
3. **Execution**:
   - Provider arrives at the seeker's location.
   - Provider inputs the Seeker's `startOtp` on the provider dashboard to transition the status from `Upcoming` to `In Progress`.
   - Once completed, the status updates to `Completed`.
   - If the seeker is absent or refuses service, the provider can request assistance, transitioning the status to `Disputed`.

### C. Admin Resolution & Oversight Journey
1. **Global Audits**: Admins monitor active users and providers, demoting bad actors or deleting fraudulent accounts.
2. **Dispute Resolution**:
   - The admin checks the **Disputed Bookings** dashboard widget.
   - Admins can **Resolve** the dispute (marking it `Completed` so the provider gets credited) or **Cancel** the dispute (marking it `Cancelled` to prevent charge calculation).
3. **Financial Tracking**: Tracks gross sales generated by the platform and the platform's 10% commission cut.
4. **CSV Exporting**: Generates offline business reports for accounting.

---

## 5. Architectural Technologies Used

- **Frontend**: React (TypeScript) + Vite
- **Styling**: Tailwind CSS + Custom CSS Theme variables (Modern HSL colors)
- **Database & Auth**: Firebase Firestore & Firebase Authentication
- **Graphics & Visualization**: Recharts (Responsive area and bar charts)
- **Icons**: Lucide React

---

## 6. Car Washing System — Subscription & Society Revenue-Share Models

ServiWay includes a comprehensive, multi-tiered automotive car care subscription architecture:

### A. Model Tiers
1. **Individual Model**:
   - For single-vehicle owners living in standalone villas, independent bungalows, or non-tieup buildings.
   - Monthly subscription options: Hatchback (₹599/mo), Sedan (₹799/mo), SUV (₹999/mo), Luxury (₹1,399/mo).
   - Features: 26 days morning microfiber dry wash + 4 weekend foam washes + 2 bi-weekly interior vacuum sessions.
2. **Society Tie-Up Model (Gated Communities & RWAs)**:
   - Official partnership with Housing Society Managing Committees (e.g. 50–500 cars).
   - Dedicated on-premise cleaning crew stationed in society parking basements.
   - **Resident Benefit**: 20% discount on standard rates.
   - **Society Revenue Generation**: 10%–12% recurring revenue share paid directly into the Society Resident Welfare Association (RWA) / Maintenance Corpus each month.
3. **Mega Township Model (Integrated Townships 500+ Flats)**:
   - Designed for large-scale campuses (e.g. Amanora, Magarpatta, Lodha Palava, Hiranandani).
   - Automated fleet with mobile eco-pressure carts and waterless polymer cleaning (saving 150+ liters of water per vehicle per month).
   - **Township Revenue Generation**: 15% institutional revenue share and comprehensive ESG water conservation reporting.

### B. User & Admin Touchpoints
- **Dedicated Hub (`/car-wash`)**: Interactive model switcher, plan selection, dynamic RWA Revenue & Water Savings Calculator, and society proposal request form.
- **Seeker Dashboard (`/seeker/dashboard`)**: Tab for active subscribed vehicles, live morning cleaning verification status with photo proof preview, and pause/resume vacation toggle.
- **Provider Dashboard (`/provider/dashboard`)**: Daily car washing morning route & roster with parking slot mapping and "Mark Washed Today" logging.
- **Admin Console (`/admin`)**: Institutional society tie-up contract review, active contract approvals, RWA revenue disbursement audit, and MRR metrics.

