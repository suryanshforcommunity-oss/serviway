# ServiWay 🛠️

> **Modern On-Demand Local Services & Daily Utility Marketplace**

ServiWay is a premium, localized service marketplace connecting verified local service professionals (Providers) with clients (Seekers). It features dynamic per-service pricing, daily society car wash subscriptions, secure OTP verification for work validation, dispute resolution, and platform administrative governance.

---

## 🚀 Live Demo & Deployment

This project is optimized for deployment on [Vercel](https://vercel.com).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/suryanshforcommunity-oss/serviway)

### Vercel Deployment Settings
- **Framework Preset**: Vite
- **Root Directory**: `./` (Root)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **SPA Rewrites**: Handled automatically via `vercel.json`

---

## ✨ Key Features

- **Multi-Role Experience**: Dedicated portals and dashboards for **Seekers**, **Providers**, and **Administrators** protected by client-side auth guards.
- **Dynamic Pricing Engine**: Providers set their own transparent rates for individual services rather than flat assumptions.
- **Daily Car Wash Subscriptions**: Dedicated residential society car cleaning subscription engine with flexible slot bookings and payment confirmation.
- **Secure Start OTP**: 4-digit security code generated for every booking to guarantee provider attendance before work starts.
- **Admin Command Center**: Complete oversight of all bookings, dispute arbitration, user management, and automated 10% platform commission calculation.
- **Flexible Authentication**: Full Firebase Authentication (Email/Password & Google Sign-In) combined with instant One-Click Demo Mode logins for testing all 3 roles.
- **Responsive & Modern UI**: Built with Tailwind CSS, Lucide icons, Framer Motion animations, and custom theme support.

---

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 8](https://vite.dev/)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/)
- **Icons & Animation**: [Lucide React](https://lucide.dev/), [Framer Motion](https://www.framer.com/motion/)
- **Backend / DB**: [Firebase v12](https://firebase.google.com/) (Authentication & Firestore)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🏁 Getting Started Locally

### Prerequisites
- Node.js 18+ installed
- npm or pnpm / yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/suryanshforcommunity-oss/serviway.git
   cd serviway
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

5. Preview production build:
   ```bash
   npm run preview
   ```

---

## 📁 Project Structure

```
serviway/
├── public/                 # Static assets & icons
├── src/
│   ├── components/         # UI components, cards, navigation, wheels, modals
│   ├── contexts/           # AuthContext (Firebase + Demo), ThemeContext
│   ├── lib/                # Firebase config, booking services, mock providers
│   ├── pages/              # Seeker, Provider, Admin dashboards, Search, Auth
│   ├── types/              # TypeScript definitions & data models
│   ├── App.tsx             # Route declarations & AuthGuards
│   └── main.tsx            # Application entrypoint
├── docs/                   # Product specification & documentation
├── vercel.json             # Vercel SPA routing rewrites
├── vite.config.ts          # Vite build config
├── tailwind.config.js      # Tailwind theme configuration
└── package.json            # Project manifest & dependencies
```

---

## 📄 License

MIT License. Designed and developed for the ServiWay community.
