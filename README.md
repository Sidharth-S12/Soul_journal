# SOUL Journal

<p align="center">
  <b>A professional trading journal & performance analytics terminal</b><br/>
  Log your edge. Review with honesty. Evolve daily.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/Vite-8.0-646CFF?style=flat-square&logo=vite" />
  <img src="https://img.shields.io/badge/Firebase-12.x-FFCA28?style=flat-square&logo=firebase" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?style=flat-square&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" />
</p>

---

## Overview

**Soul Journal** is a dark-themed, professional-grade trading journal built for serious traders. It combines real-time performance visualization, trade tracking, journaling, and psychology-aware insights into a single sleek terminal — designed to help traders develop discipline, track their edge, and grow consistently.

---

## Features

- **Performance Overview Chart** — Professional TradingView-style area chart with volume bars, zero-line split gradient (profit green / drawdown red), crosshair cursor, animated active dot, and 1W / 2W / 1M range selector
- **Stat Cards** — Net P&L, Win Rate (circular progress), Total Trades (bar chart), and Expectancy with weekly delta badges
- **Recent Trades Table** — Paginated trade log with symbol, direction, P&L, and session tags
- **Calendar Widget** — Heatmap of daily P&L performance across the month
- **Latest Journal Entry** — Quick-view of your most recent trade notes
- **Insight Card** — AI-style pattern insights based on recent trade history
- **Today's Focus** — Daily goal tracker with motivational quote and completion progress
- **Authentication** — Email/password login, signup, email verification, and password reset via Firebase Auth
- **Protected Routes** — All dashboard pages are gated behind verified auth
- **Responsive Design** — Mobile bottom nav + full desktop sidebar layout

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 8 |
| Styling | Tailwind CSS v4 (custom dark trading theme) |
| Charts | Recharts 3 (ComposedChart, AreaChart, BarChart) |
| Animations | Framer Motion 12 |
| Icons | Lucide React + React Icons |
| Auth & DB | Firebase 12 (Auth, Firestore) |
| Routing | React Router DOM v7 |
| Security | React Google reCAPTCHA |
| Build Tool | Vite with `@vitejs/plugin-react` |
| Linting | ESLint 10 with React Hooks plugin |

---

## Project Structure

```
soul-journal/
├── public/
├── src/
│   ├── assets/               # Static assets (logo, images)
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── MainPerformanceChart.jsx   # TradingView-style P&L + volume chart
│   │   │   ├── PerformanceBreakdown.jsx
│   │   │   ├── RecentTradesTable.jsx
│   │   │   ├── CalendarWidget.jsx
│   │   │   ├── InsightCard.jsx
│   │   │   ├── LatestJournalEntry.jsx
│   │   │   ├── StatCard.jsx
│   │   │   └── StreakCard.jsx
│   │   └── ui/
│   │       ├── Logo.jsx                  # Brand SVG logo (inline vector)
│   │       ├── Navbar.jsx
│   │       ├── Sidebar.jsx
│   │       └── TradingBackground.jsx
│   ├── context/
│   │   └── AuthContext.jsx               # Firebase auth state provider
│   ├── firebase/                         # Firebase config & init
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── ForgotPassword.jsx
│   │   └── VerifyEmail.jsx
│   ├── routes/
│   │   └── ProtectedRoute.jsx
│   ├── styles/
│   │   ├── App.css
│   │   └── index.css                     # Tailwind theme + custom glass panels
│   ├── App.jsx
│   └── main.jsx
├── .env                                  # Firebase credentials (not committed)
├── index.html
├── vite.config.js
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Firebase project with **Authentication** and **Firestore** enabled

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/soul-journal.git
cd soul-journal

# Install dependencies
npm install
```

### Environment Setup

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
npm run preview
```

---

## Design System

Soul Journal uses a fully custom dark trading theme defined in `src/styles/index.css`:

| Token | Value | Usage |
|---|---|---|
| `--color-primary` | `#FF003D` | Accent, active states, drawdown |
| `--color-trading-green` | `#00FF88` | Profit, positive P&L |
| `--color-trading-red` | `#FF003D` | Loss, negative P&L |
| `--color-bg-deepest` | `#020617` | Page background |
| `--color-bg-darker` | `#030712` | Sidebar, panels |
| `--color-card-bg` | `rgba(10,15,30,0.75)` | Glass cards |
| `--font-heading` | Poppins / Outfit | All headings |
| `--font-body` | Inter | Body text |

Key component classes: `.glass-panel`, `.glass-card`, `.btn-primary`, `.btn-glass`, `.neon-border`

---

## Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a project
2. Enable **Email/Password** authentication under Authentication → Sign-in method
3. Enable **Firestore Database** in production or test mode
4. Copy your web app config into `.env` as shown above
5. (Optional) Set up reCAPTCHA v2 at [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## Roadmap

- [ ] Connect live trade data via broker API
- [ ] AI-powered trade analysis and pattern recognition
- [ ] Multi-account support
- [ ] Export journal to PDF / CSV
- [ ] Mobile app (React Native)
- [ ] Playbook builder with strategy templates
- [ ] Leaderboard and community features

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License. See `LICENSE` for details.

---

<p align="center">
  Built with ❤️ for traders who take their craft seriously.<br/>
  <b>SOUL Journal — Terminal v4.0</b>
</p>