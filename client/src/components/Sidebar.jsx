import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  ReceiptText,
  PieChart,
  Target,
  ScanLine,
  SlidersHorizontal,
  Users,
  BellRing,
  BarChart3,
  Settings,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Globe,
  LogOut
} from 'lucide-react';

import logoImg from '../assets/logo.png';

export default function Sidebar({ collapsed, setCollapsed }) {
  const { currentView, setCurrentView, logout } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ReceiptText },
    { id: 'budgets', label: 'Budgets', icon: PieChart },
    { id: 'goals', label: 'Savings', icon: Target },
    { id: 'receipts', label: 'Receipt Scanner', icon: ScanLine, badge: 'OCR' },
    { id: 'what-if', label: 'What-If Simulator', icon: SlidersHorizontal },
    { id: 'notifications', label: 'Smart Alerts', icon: BellRing },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-full md:w-64 flex-shrink-0 flex flex-col md:justify-between md:h-full border-b md:border-b-0 md:border-r border-violet-200/80 dark:border-white/10 bg-[#F5F0FF]/95 dark:bg-slate-900/80 backdrop-blur-xl select-none">
      <div className="min-w-0">
        {/* Brand Header */}
        <div
          onClick={() => setCurrentView('dashboard')}
          className="cursor-pointer flex items-center space-x-3 px-4 py-2 md:px-6 md:py-6 border-b border-violet-200/80 dark:border-white/10"
        >
          <img
            src={logoImg}
            alt="Expense Tracker logo"
            className="w-8 h-8 md:w-10 md:h-10 object-contain drop-shadow-md hover:scale-110 transition-transform flex-shrink-0"
          />
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">Expense Tracker</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-none mt-0.5">
              Daily Expense & Bill Tracker
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex items-center gap-1 overflow-x-auto p-2 md:block md:space-y-1 md:overflow-visible md:p-4">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                title={item.label}
                className={`flex flex-shrink-0 items-center justify-center md:w-full md:justify-between px-3 py-2.5 md:px-4 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-purple-600 text-white shadow-glow'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'
                  }`} />
                  <span className="hidden md:inline">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`hidden md:inline text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Motivation Promo Card (Matching Screenshot exactly) */}
      <div className="hidden md:block p-4">
        <div className="iridescent-card rounded-3xl p-4 shadow-sm relative overflow-hidden group">
          {/* Subtle gradient wave illustration accent */}
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-tr from-purple-400/20 via-pink-400/20 to-cyan-400/30 blur-lg pointer-events-none"></div>

          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">✦</span>
          </div>
          <p className="text-xs font-bold text-slate-800 dark:text-white leading-tight">
            Small steps create big dreams
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
            Stay consistent with your goals!
          </p>

          <div className="mt-3 flex justify-end">
            <button
              onClick={() => setCurrentView('goals')}
              className="w-7 h-7 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-md transition-transform group-hover:scale-105"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={logout}
          className="w-full mt-3 flex items-center justify-center space-x-2 px-3 py-2 rounded-2xl text-xs font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200/50 dark:border-rose-900/40 transition-colors"
          title="Sign Out of App"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
