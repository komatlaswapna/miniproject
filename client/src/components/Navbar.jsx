import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  Sun,
  Moon,
  Mic,
  Camera,
  PlusCircle,
  Search,
  Calendar,
  ChevronDown,
  Sparkles,
  Keyboard,
  LogOut,
  User as UserIcon
} from 'lucide-react';

export default function Navbar({ onOpenVoice, onOpenAddTx }) {
  const {
    currentView,
    setCurrentView,
    darkMode,
    setDarkMode,
    user,
    logout,
    notifications,
    formatCurrency
  } = useApp();

  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b border-violet-200/80 dark:border-white/10 bg-[#F5F0FF]/90 dark:bg-slate-900/40 backdrop-blur-xl">
      {/* Search Input Bar (Matching Screenshot) */}
      <div className="relative w-full max-w-md hidden sm:block">
        <Search className="w-4 h-4 absolute left-4 top-3 text-slate-400" />
        <input
          type="text"
          placeholder="Search transactions, categories, or anything..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-white/70 dark:bg-slate-950/70 border border-white/80 dark:border-white/10 text-xs text-slate-700 dark:text-slate-100 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400/40 transition-all"
        />
      </div>

      {/* Right Controls: Date Range, Voice, Scan, Notifications, Dark Mode, Profile */}
      <div className="flex items-center space-x-3 ml-auto">
        {/* Date Range Selector Pill (Matching Screenshot) */}
        <div className="hidden lg:flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-white/70 dark:bg-slate-950/70 border border-white/80 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm">
          <Calendar className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          <span>Apr 1, 2025 - Apr 30, 2025</span>
          <ChevronDown className="w-3 h-3 text-slate-400 ml-1" />
        </div>

        {/* Quick Voice Log Button */}
        <button
          onClick={onOpenVoice}
          title="Add expense via Voice Command"
          className="flex items-center space-x-1.5 px-3 py-2 rounded-2xl bg-white/70 dark:bg-slate-950/70 hover:bg-white dark:hover:bg-slate-900 border border-white/80 dark:border-white/10 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-sm transition-all hover:scale-105 active:scale-95"
        >
          <Mic className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          <span className="hidden md:inline">Voice</span>
        </button>

        {/* Quick Type / Manual Log Button (Between Voice & Scan) */}
        <button
          onClick={onOpenAddTx}
          title="Add expense by Typing"
          className="flex items-center space-x-1.5 px-3 py-2 rounded-2xl bg-white/70 dark:bg-slate-950/70 hover:bg-white dark:hover:bg-slate-900 border border-white/80 dark:border-white/10 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-sm transition-all hover:scale-105 active:scale-95 group"
        >
          <Keyboard className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
          <span className="hidden md:inline">Type</span>
        </button>

        {/* Quick Scan Receipt Button */}
        <button
          onClick={() => setCurrentView('receipts')}
          title="Scan Receipt with AI OCR"
          className="flex items-center space-x-1.5 px-3 py-2 rounded-2xl bg-white/70 dark:bg-slate-950/70 hover:bg-white dark:hover:bg-slate-900 border border-white/80 dark:border-white/10 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-sm transition-all hover:scale-105 active:scale-95"
        >
          <Camera className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="hidden md:inline">Scan</span>
        </button>

        {/* Notification Bell with Pink Dot Badge (Matching Screenshot) */}
        <div className="relative">
          <button
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="w-10 h-10 rounded-2xl bg-white/70 dark:bg-slate-950/70 hover:bg-white dark:hover:bg-slate-900 border border-white/80 dark:border-white/10 text-slate-600 dark:text-slate-300 flex items-center justify-center shadow-sm relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900"></span>
          </button>

          {/* Dropdown Panel */}
          {showNotifDropdown && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-3xl glass-card-clean shadow-2xl p-4 z-50 animate-scale-up">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Alerts & Notifications</h3>
                </div>
                <button
                  onClick={() => {
                    setCurrentView('notifications');
                    setShowNotifDropdown(false);
                  }}
                  className="text-xs text-purple-600 dark:text-purple-400 hover:underline font-medium"
                >
                  Bot Settings
                </button>
              </div>

              <div className="py-2 divide-y divide-slate-100 dark:divide-slate-800 max-h-72 overflow-y-auto">
                {notifications.slice(0, 4).map(n => (
                  <div key={n.id} className="py-3 px-1 hover:bg-purple-50/50 dark:hover:bg-slate-800/40 rounded-xl transition-colors">
                    <div className="flex items-start justify-between">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{n.title}</p>
                      <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dark / Light Mode Crescent Toggle (Matching Screenshot) */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-10 h-10 rounded-2xl bg-white/70 dark:bg-slate-950/70 hover:bg-white dark:hover:bg-slate-900 border border-white/80 dark:border-white/10 text-slate-600 dark:text-slate-300 flex items-center justify-center shadow-sm transition-colors"
          title="Toggle Dark / Light Theme"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>

        {/* User Profile Pill with Dropdown */}
        <div className="relative">
          <div
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="cursor-pointer flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-white/70 dark:bg-slate-950/70 hover:bg-white dark:hover:bg-slate-900 border border-white/80 dark:border-white/10 shadow-sm transition-all"
          >
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100">Profile</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* Profile Dropdown Menu */}
          {showProfileDropdown && (
            <div className="absolute right-0 mt-3 w-56 rounded-2xl glass-card-clean shadow-2xl p-2 z-50 animate-scale-up border border-slate-200 dark:border-slate-800">
              <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{user.full_name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setCurrentView('settings');
                    setShowProfileDropdown(false);
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-purple-50/50 dark:hover:bg-slate-800/40 transition-colors text-left"
                >
                  <UserIcon className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span>Profile & Settings</span>
                </button>

                <button
                  onClick={() => {
                    setShowProfileDropdown(false);
                    logout();
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-500 hover:bg-rose-50/70 dark:hover:bg-rose-950/40 transition-colors text-left mt-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
