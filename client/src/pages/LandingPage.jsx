import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  ScanLine,
  Camera,
  Mic,
  BellRing,
  Wallet,
  Receipt,
  PiggyBank,
  Users,
  CheckCircle2
} from 'lucide-react';
import logoImg from '../assets/logo.png';
import step1Img from '../assets/step1-receipt-scan.jpg';
import step2Img from '../assets/step2-ai-categorize.jpg';
import step3Img from '../assets/step3-wealth-growth.jpg';
import use1Img from '../assets/use1-daily-expense.jpg';
import use2Img from '../assets/use2-bill-archive.jpg';
import use3Img from '../assets/use3-budget-alert.jpg';
import use4Img from '../assets/use4-group-split.jpg';
import heroShowcaseImg from '../assets/hero-showcase.jpg';

export default function LandingPage() {
  const { setCurrentView, user } = useApp();

  // Require authentication before entering dashboard/inner app
  const navigateSecure = (target = 'dashboard') => {
    if (user?.isAuthenticated) {
      setCurrentView(target);
    } else {
      setCurrentView('auth');
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0FF] text-slate-800 flex flex-col justify-between selection:bg-indigo-600 selection:text-white">

      {/* Modern Navigation Bar with Big 3D Logo */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
          {/* Prominent Logo & Title (Without AI badge) */}
          <div
            className="flex items-center space-x-3.5 cursor-pointer group"
            onClick={() => scrollToSection('home')}
          >
            <div className="relative">
              <img
                src={logoImg}
                alt="Expense Tracker"
                className="w-14 h-14 sm:w-16 sm:h-16 object-contain drop-shadow-md group-hover:scale-105 transition-transform"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-2xl sm:text-3xl tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Expense Tracker
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Daily Expense & Bill Tracker
              </p>
            </div>
          </div>

          {/* Navigation Bar in Middle (Home, How to Use, Uses) */}
          <nav className="flex items-center space-x-4 sm:space-x-8 text-xs sm:text-sm font-bold text-slate-600">
            <button
              onClick={() => scrollToSection('home')}
              className="hover:text-indigo-600 transition-colors cursor-pointer py-1"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('how-to-use')}
              className="hover:text-indigo-600 transition-colors cursor-pointer py-1"
            >
              How to Use
            </button>
            <button
              onClick={() => scrollToSection('uses')}
              className="hover:text-indigo-600 transition-colors cursor-pointer py-1"
            >
              Uses
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setCurrentView('auth')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 border border-slate-200 transition-all"
            >
              Sign In
            </button>
            <button
              onClick={() => navigateSecure('dashboard')}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-6 py-12 flex-grow">
        {/* HERO SECTION: Simple, Direct & Visually Stunning */}
        <div id="home" className="text-center max-w-4xl mx-auto scroll-mt-24">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Track Daily Expenses.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
              Save More Money.
            </span>
          </h1>

          {/* Simple CTA Buttons */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => navigateSecure('dashboard')}
              className="flex items-center space-x-2 px-7 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition-all hover:scale-105 active:scale-95"
            >
              <span>Start Free Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigateSecure('receipts')}
              className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-semibold text-sm shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              <ScanLine className="w-4 h-4 text-indigo-600" />
              <span>Scan Bill</span>
            </button>
          </div>

          {/* EYE-CATCHING 3D HERO SHOWCASE IMAGE */}
          <div className="mt-12 relative max-w-4xl mx-auto">
            {/* Ambient colorful glow behind the image */}
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-400/20 via-purple-400/20 to-pink-400/20 rounded-3xl blur-2xl -z-10 transform scale-95" />

            <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 bg-white/60 shadow-2xl p-2 sm:p-3 backdrop-blur-sm group">
              <img
                src={heroShowcaseImg}
                alt="Expense Tracker dashboard showcase"
                className="w-full h-auto rounded-2xl object-cover shadow-sm group-hover:scale-[1.01] transition-transform duration-500"
              />

              {/* Floating Highlight Badge 1 (Left) */}
              <div className="hidden sm:flex absolute top-6 left-6 items-center space-x-2.5 px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl text-left hover:scale-105 transition-transform">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-900">Receipt Auto-Scanned</p>
                  <p className="text-[10px] text-emerald-600 font-semibold font-mono">₹ 1,250 • Saved in 2s</p>
                </div>
              </div>

              {/* Floating Highlight Badge 2 (Right) */}
              <div className="hidden sm:flex absolute bottom-8 right-6 items-center space-x-2.5 px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl text-left hover:scale-105 transition-transform">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-900">Monthly Savings Growth</p>
                  <p className="text-[10px] text-indigo-600 font-semibold font-mono">+₹ 8,000 / month ↑</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 EASY VISUAL STEPS (Clean, Picture-First, No Clutter) */}
        <div id="how-to-use" className="mt-20 scroll-mt-24">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              How It Works in 3 Simple Steps
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              No complicated accounting. Anyone can start saving in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="rounded-3xl p-5 bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all text-left">
              <div className="overflow-hidden rounded-2xl mb-4 bg-slate-50">
                <img
                  src={step1Img}
                  alt="Scan Receipt"
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                Step 1
              </span>
              <h3 className="text-base font-black text-slate-900 mt-2">
                1. Take a Photo
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Take a photo of any paper bill or say what you spent. Prices and shop names are saved in 2 seconds.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-3xl p-5 bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all text-left">
              <div className="overflow-hidden rounded-2xl mb-4 bg-slate-50">
                <img
                  src={step2Img}
                  alt="Auto Categorized"
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700">
                Step 2
              </span>
              <h3 className="text-base font-black text-slate-900 mt-2">
                2. Auto Sorted
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Groceries, bills, and shopping are automatically sorted into neat folders with zero manual math.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-3xl p-5 bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all text-left">
              <div className="overflow-hidden rounded-2xl mb-4 bg-slate-50">
                <img
                  src={step3Img}
                  alt="Save Money"
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                Step 3
              </span>
              <h3 className="text-base font-black text-slate-900 mt-2">
                3. Save More Money
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Get WhatsApp alerts before you overspend and easily grow your savings every single month.
              </p>
            </div>
          </div>
        </div>

        {/* 3 CLEAN HIGHLIGHTS */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-bold text-slate-900">Camera Bill Scan</h4>
              <p className="text-xs text-slate-500">No typing needed</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
              <Mic className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-bold text-slate-900">Voice Talking Input</h4>
              <p className="text-xs text-slate-500">Just speak to record</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <BellRing className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-bold text-slate-900">WhatsApp Warnings</h4>
              <p className="text-xs text-slate-500">Stop overspending</p>
            </div>
          </div>
        </div>

        {/* USES SECTION (Picture-First, Short & Easy Like Steps) */}
        <div id="uses" className="mt-20 scroll-mt-24">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Everyday Uses
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Simple ways Expense Tracker helps you manage spending every day.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Use 1 */}
            <div className="rounded-3xl p-5 bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all text-left">
              <div className="overflow-hidden rounded-2xl mb-4 bg-slate-50">
                <img
                  src={use1Img}
                  alt="Daily Expense Tracking"
                  className="w-full h-44 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                Daily Expenses
              </span>
              <h3 className="text-base font-black text-slate-900 mt-2">
                1. Track Daily Spends
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Log tea, food, fuel, and shopping in 2 seconds.
              </p>
            </div>

            {/* Use 2 */}
            <div className="rounded-3xl p-5 bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all text-left">
              <div className="overflow-hidden rounded-2xl mb-4 bg-slate-50">
                <img
                  src={use2Img}
                  alt="Paper Bill Archiving"
                  className="w-full h-44 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700">
                Bill Scanner
              </span>
              <h3 className="text-base font-black text-slate-900 mt-2">
                2. Store Paper Bills
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Photo scan store bills and keep receipts safe forever.
              </p>
            </div>

            {/* Use 3 */}
            <div className="rounded-3xl p-5 bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all text-left">
              <div className="overflow-hidden rounded-2xl mb-4 bg-slate-50">
                <img
                  src={use3Img}
                  alt="Budget Overspend Alerts"
                  className="w-full h-44 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                Save Money
              </span>
              <h3 className="text-base font-black text-slate-900 mt-2">
                3. Budget Alerts
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Get warnings before overspending and save ₹5,000+ monthly.
              </p>
            </div>

            {/* Use 4 */}
            <div className="rounded-3xl p-5 bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all text-left">
              <div className="overflow-hidden rounded-2xl mb-4 bg-slate-50">
                <img
                  src={use4Img}
                  alt="Group Bill Splitting"
                  className="w-full h-44 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700">
                Roommates & Trips
              </span>
              <h3 className="text-base font-black text-slate-900 mt-2">
                4. Split Group Bills
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Easily split rent and food with flatmates with zero confusion.
              </p>
            </div>
          </div>
        </div>

        {/* SIMPLE CALL TO ACTION BANNER */}
        <div className="mt-16 p-8 sm:p-10 rounded-3xl bg-indigo-600 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h3 className="text-xl sm:text-2xl font-black">
              Ready to start saving money?
            </h3>
            <p className="text-xs sm:text-sm text-indigo-100 mt-1">
              Takes only 30 seconds. Free to use with zero setup.
            </p>
          </div>
          <button
            onClick={() => navigateSecure('dashboard')}
            className="whitespace-nowrap flex items-center space-x-2 px-7 py-3.5 rounded-2xl bg-white text-indigo-700 hover:bg-slate-100 font-extrabold text-xs sm:text-sm shadow-md transition-all hover:scale-105 active:scale-95"
          >
            <span>Sign In & Start Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* MINIMAL FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-6 px-6 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center space-x-2.5">
            <img src={logoImg} alt="Expense Tracker logo" className="w-7 h-7 object-contain" />
            <span className="font-bold text-slate-900">Expense Tracker</span>
            <span>• Indian Rupees (₹) Expense Tracker</span>
          </div>

          <div className="flex items-center space-x-4 font-medium text-slate-600">
            <button onClick={() => navigateSecure('dashboard')} className="hover:text-indigo-600 transition-colors">Dashboard</button>
            <button onClick={() => navigateSecure('receipts')} className="hover:text-indigo-600 transition-colors">Bill Scanner</button>
            <button onClick={() => setCurrentView('auth')} className="hover:text-indigo-600 transition-colors">Sign In</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
