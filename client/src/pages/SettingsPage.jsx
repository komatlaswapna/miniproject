import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Save
} from 'lucide-react';

export default function SettingsPage() {
  const {
    user,
    setUser,
    addToast
  } = useApp();

  const [fullName, setFullName] = useState(user.full_name || 'Alex Rivera');
  const [email, setEmail] = useState(user.email || 'alex.rivera@smartspend.ai');
  const [currency, setCurrency] = useState(user.currency || 'INR');
  const [monthlyIncome, setMonthlyIncome] = useState(user.monthly_income || 50000);

  const currencySymbols = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£'
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUser(prev => ({
      ...prev,
      full_name: fullName,
      email,
      currency,
      currencySymbol: currencySymbols[currency] || '₹',
      monthly_income: Number(monthlyIncome)
    }));
    addToast('Account profile and currency preferences updated', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Profile & Currency Form */}
      <form onSubmit={handleSaveProfile} className="p-6 rounded-3xl bg-gradient-to-br from-violet-200/90 via-fuchsia-100/85 to-indigo-100/90 border border-violet-200/80 shadow-[0_22px_45px_-20px_rgba(168,85,247,0.55)] space-y-5 text-slate-800">
        <div className="pb-3 border-b border-violet-200/80 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-violet-600" />
            <h3 className="text-sm font-bold text-slate-800">Personal Financial Profile</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-medium text-violet-700 mb-1">Full Legal Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/70 border border-violet-200 text-slate-800 text-xs focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-violet-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/70 border border-violet-200 text-slate-800 text-xs focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-medium text-violet-700 mb-1">Preferred Currency</label>
            <select
              value={currency}
              onChange={e => setCurrency(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/70 border border-violet-200 text-slate-800 text-xs focus:outline-none focus:border-violet-500"
            >
              <option value="INR">INR (₹) - Indian Rupee</option>
              <option value="USD">USD ($) - US Dollar</option>
              <option value="EUR">EUR (€) - Euro</option>
              <option value="GBP">GBP (£) - British Pound</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-violet-700 mb-1">Baseline Monthly Income</label>
            <input
              type="number"
              step="100"
              required
              value={monthlyIncome}
              onChange={e => setMonthlyIncome(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/70 border border-violet-200 text-slate-800 text-xs font-mono font-bold focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-500 hover:to-fuchsia-400 text-white text-xs font-bold shadow-[0_12px_24px_rgba(168,85,247,0.35)] transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
