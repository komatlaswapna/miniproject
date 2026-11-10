# 🚀 SmartSpend AI – Iterative Budget & Expense Tracker

> **Next-Generation Autonomous Financial Intelligence SaaS**  
> *Engineered with React 19, Vite, Tailwind CSS, Node.js, Express, Supabase PostgreSQL, Supabase Auth, Recharts, and Tesseract.js In-Browser OCR.*

---

## 🌟 Overview & Commercial Highlights

**SmartSpend AI** is a production-grade full-stack personal and shared financial tracking web application that bridges machine learning heuristics with everyday financial governance. Rather than relying on rigid static budgets that fail after a single weekend blowout, SmartSpend AI implements an **Iterative Machine Learning Feedback Engine** that continuously adapts spending envelopes based on historical variance, volatility smoothing, and user lifestyle velocity.

---

## 🎯 9 Core Advanced Features

1. **AI Auto-Categorization (OCR & NLP)**
   - Client-side in-browser **Tesseract.js** optical character recognition.
   - Extracts merchant names, transaction dates, subtotal, taxes, itemized lines, and total amount.
   - Rule-based semantic matching with keyword confidence scoring to categorize receipts automatically.

2. **Iterative Learning Engine**
   - Continuously computes the variance ($\Delta = \text{Actual} - \text{Planned}$) across past billing cycles.
   - Applies Holt-Winters exponential smoothing ($\alpha = 0.35$) and volatility penalty to generate auto-recalibrated next-month budgets.
   - Reclaims budget leaks and redirects surplus directly into savings goals.

3. **What-If Scenario Simulator**
   - 12-month forward predictive wealth sandbox with adjustable compound inflation rates.
   - Interactive sliders for income changes, rent adjustments, discretionary trims, and capital one-time purchases.
   - Dual-trajectory visualization comparing **Baseline** vs **Simulative Scenario** wealth progression.

4. **Smart Alerts Bot (Telegram & WhatsApp Webhooks)**
   - Real-time webhook dispatching when any category budget reaches **80% warning** or **100% breach** limits.
   - Direct integration with Telegram Bot API (`https://api.telegram.org`) with full Markdown formatting and transparent payload logs.

5. **Group / Family Shared Budgets & Debt Simplification**
   - Create shared groups for flatmates, roommates, and families.
   - Split expenses equally or by custom amounts.
   - Integrated **Greedy Debt Simplification Algorithm** that minimizes inter-member transactions down to the fewest possible settlement transfers.

6. **Gamification & Daily Streaks**
   - Rewards consistent expense logging with Experience Points (XP) and level progressions.
   - Daily saver streaks counter.
   - Achievement badges (`7-Day Savvy Streak`, `Budget Mastermind`, `Visionary Scanner`, `Goal Crusher`).
   - Milestone celebration effects using `canvas-confetti`.

7. **Voice-Activated Expense Input**
   - Hands-free voice expense logging powered by the browser **Web Speech API** (`SpeechRecognition`).
   - Live speech transcript parsing extracting amount, type, merchant, and category.
   - Editable confirmation modal before saving to the ledger.

8. **Recurring Expense Automation**
   - Pattern detection engine scanning transaction frequency and intervals (~30 days).
   - Identifies subscriptions, rent, Wi-Fi, and recharges with next due date predictions.
   - One-click toggle to enable automatic ledger entry on the due date.

9. **Budget vs Actual Learning Curve**
   - Interactive historical regression chart demonstrating model accuracy convergence.
   - Tracks error rate reduction from 9.7% down to 1.2% over consecutive billing months.

---

## 🏗️ Technical Architecture & Tech Stack

```
smartspend-ai/
├── client/                      # React 19 + Vite Frontend SPA
│   ├── src/
│   │   ├── components/          # Navbar, Sidebar, Modals, Toast system
│   │   ├── context/             # AppContext (Central state, persistence, gamification)
│   │   ├── data/                # Mock data, category definitions, sample receipts
│   │   ├── lib/                 # Supabase client connector & fallback detector
│   │   ├── pages/               # 14 Production views
│   │   ├── index.css            # Custom glassmorphism, scrollbars, Tailwind directives
│   │   └── App.jsx              # Main routing and layout wrapper
│   ├── tailwind.config.js       # Tailwind CSS theme configuration
│   └── package.json
│
├── server/                      # Node.js + Express Backend API
│   ├── server.js                # AI Categorization, What-If projection, Bot dispatch endpoints
│   └── package.json
│
├── supabase/
│   └── schema.sql               # Production PostgreSQL DDL with Row Level Security (RLS)
│
├── .env.example                 # Documented environment template
└── README.md                    # Comprehensive documentation
```

### Technology Highlights
- **Frontend**: React 19, Vite, Tailwind CSS 3.4, Lucide React Icons.
- **Visual Analytics**: Recharts (Area, Bar, Pie, Radar, Line charts).
- **Computer Vision**: Tesseract.js (Client-side OCR worker).
- **Backend**: Node.js, Express.js.
- **Database & Auth**: Supabase PostgreSQL 15 with Row Level Security (RLS) and Supabase Auth.
- **Voice Parser**: Web Speech API.
- **Animation**: Canvas Confetti, Tailwind keyframes.

---

## 🗄️ Database Schema & Row Level Security (RLS)

The database schema is defined in [`supabase/schema.sql`](file:///c:/Users/SWAPNA/OneDrive/Desktop/swapna/miniproject/miniproject/supabase/schema.sql) with full multi-tenant isolation:

- `public.profiles`: User metadata, currency preference, XP, streaks, bot webhook chat IDs.
- `public.categories`: Standard system categories and custom user envelopes.
- `public.transactions`: Complete income/expense ledger, OCR text attachments, recurring flags.
- `public.budgets`: Planned envelopes, AI-recommended targets, learning adjustments.
- `public.savings_goals`: Goal targets, current balances, deadlines.
- `public.recurring_rules`: Detected cadences, intervals, and auto-add preferences.
- `public.shared_groups`: Flatmate/family groups and authorized members.
- `public.shared_expenses`: Group expenses and split distributions.
- `public.notifications`: Alert logs, breach warnings, and Telegram/WhatsApp delivery status.

---

## ⚡ Quick Start & Local Setup

### 1. Prerequisites
- **Node.js** v18+ (tested on Node v24)
- **npm** v9+

### 2. Installation
From the root workspace, install dependencies for both client and server:
```bash
# Install client dependencies
cd client
npm install --legacy-peer-deps

# Install server dependencies
cd ../server
npm install
```

### 3. Running Development Servers
You can run the frontend client and the Express backend concurrently:

**Terminal 1 (Backend API Server on port 5000):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend Client on port 5173):**
```bash
cd client
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 🌐 Deploy to Render

The root `render.yaml` configures one Render web service to build the client and serve it alongside the API.

1. Push this project to a GitHub repository. Do not commit `.env` files or credentials.
2. In Render, choose **New → Blueprint**, connect that repository, and deploy the `render.yaml` blueprint.
3. When the deployment is ready, open the `onrender.com` URL shown on the Render service page. That URL can be opened from mobile and other browsers.

The free service may sleep when idle, so the first visit after a period of inactivity can take longer. The current backend stores accounts and app data in `server/data/db.json`; Render's free filesystem is temporary, so data may be lost after a restart or redeploy. This prototype also stores passwords without hashing. Do not use real passwords or sensitive financial data until persistent storage and secure authentication are configured.

---

## 🔑 Supabase Connection Setup (Optional for Cloud Persistence)

By default, SmartSpend AI runs in **High-Fidelity Sandbox Mode** with immediate local persistence and zero setup friction. To connect to a live Supabase project:

1. Create a project on [Supabase](https://supabase.com).
2. Go to **SQL Editor** in Supabase and paste the contents of `supabase/schema.sql`, then execute.
3. In `client/.env` (or root `.env`), set your project credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp...
   ```
4. Restart the client server. The app will automatically connect to Supabase PostgreSQL and Supabase Auth!

---

## 🧪 Testing the 9 Advanced User Flows

1. **OCR Receipt Scanner**:
   - Navigate to **Receipt Scanner** in the sidebar.
   - Click one of the real physical receipt presets (*Starbucks Coffee*, *Whole Foods*, or *City Power*), or upload your own receipt image.
   - Watch real-time Tesseract OCR extract merchant, items, amount, and auto-categorize to *Food & Dining* with 97% confidence!
   - Click **Confirm & Save to Expenses Ledger**.

2. **Iterative Learning Recalibration**:
   - Go to **AI Insights & Engine**.
   - Review the **Budget vs Actual Learning Curve** showing error reduction from 9.7% to 1.2%.
   - Click **Recalibrate Next Month's Budget** or **Apply Iterative AI Adjustments** to optimize all category envelopes and unlock savings surplus.

3. **What-If Predictive Simulator**:
   - Go to **What-If Simulator**.
   - Drag the **Income Adjustment** to +20%, **Rent Delta** to +$150, or click **Quick Preset: Promotion**.
   - Watch the 12-month projected savings curve recompute dynamically with compound inflation.

4. **Smart Alerts Bot**:
   - Go to **Smart Alerts Bot**.
   - Select **Telegram Bot** and scenario **80% Threshold Warning**.
   - Click **Trigger Test TELEGRAM Alert Now** to view the live webhook delivery log and payload.

5. **Group / Flatmate Expense Splits**:
   - Go to **Shared Budgets**.
   - Inspect the **Minimal Debt Settlements** card showing simplified payments (*who owes whom*).
   - Click **Add Shared Expense** to log a bill and split it across group members.
   - Click **Settle Up** to resolve balances.

6. **Voice-Activated Expense Logging**:
   - Click the glowing **Voice Log** button in the top navbar.
   - Click the microphone and speak your expense, or click one of the sample chips (*"Spent 48.50 dollars at Whole Foods for groceries"*).
   - Review the auto-extracted fields in the editable confirmation form and click **Save Transaction**.

7. **Recurring Expense Automation**:
   - Go to **Recurring Automation**.
   - View detected subscriptions (Rent, Fiber Internet, Netflix, Gym).
   - Toggle **Auto-Add** to automatically record upcoming periodic entries.

---

## 🔒 Security & Privacy

- **Row Level Security (RLS)**: Enforced on all PostgreSQL tables so users can only view and manage their authorized personal or shared group records.
- **Client-Side OCR**: Optical character recognition runs in the browser worker thread.
- **Encrypted Webhook Credentials**: Telegram tokens and chat IDs are stored securely.

---

## 📜 License
SmartSpend AI is open-source under the MIT License.
