import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageCircle,
  Send,
  User,
  Phone,
  ShieldCheck
} from 'lucide-react';

export default function NotificationsPage() {
  const {
    user,
    setUser,
    addToast
  } = useApp();

  const [fullName, setFullName] = useState(user.full_name || 'swapna');
  const [whatsappNumber, setWhatsappNumber] = useState(user.whatsapp_number || '+91 98765 43210');

  const handleSaveAndSend = (e) => {
    e.preventDefault();
    if (!whatsappNumber || whatsappNumber.trim().length < 6) {
      addToast('Please enter a valid WhatsApp phone number', 'error');
      return;
    }

    setUser(prev => ({
      ...prev,
      full_name: fullName,
      whatsapp_number: whatsappNumber,
      daily_summary: true,
      alert_threshold_80: true,
      alert_threshold_100: true
    }));

    addToast('Daily WhatsApp updates and alerts activated successfully! 📲', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-xl mx-auto">
      {/* Light Lavender Notification Card */}
      <div className="p-6 sm:p-8 rounded-[32px] bg-purple-50/90 dark:bg-purple-950/30 backdrop-blur-xl border border-purple-200/90 dark:border-purple-800/40 shadow-xl shadow-purple-100/70 dark:shadow-none space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-purple-200/80 dark:border-purple-800/40">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-purple-100">
                WhatsApp Daily Updates & Alerts
              </h2>
              <p className="text-xs text-purple-700/80 dark:text-purple-300 font-medium mt-0.5">
                Receive your daily financial summaries and alerts directly on WhatsApp
              </p>
            </div>
          </div>
          <span className="hidden sm:flex text-[11px] text-emerald-700 dark:text-emerald-400 font-mono font-bold items-center space-x-1 bg-emerald-100/70 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Encrypted</span>
          </span>
        </div>

        {/* User Input Form */}
        <form onSubmit={handleSaveAndSend} className="space-y-5">
          {/* User Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-purple-200 mb-1.5 flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>User Name</span>
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="e.g. swapna"
              className="w-full px-4 py-3 rounded-2xl bg-white/95 dark:bg-slate-900 border border-purple-200 dark:border-purple-800/60 text-slate-800 dark:text-slate-100 text-xs font-medium focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200/50 transition-all placeholder:text-slate-400 shadow-sm"
            />
          </div>

          {/* WhatsApp Phone Number */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-purple-200 mb-1.5 flex items-center space-x-1.5">
              <Phone className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>WhatsApp Phone Number</span>
            </label>
            <input
              type="tel"
              required
              value={whatsappNumber}
              onChange={e => setWhatsappNumber(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-3 rounded-2xl bg-white/95 dark:bg-slate-900 border border-purple-200 dark:border-purple-800/60 text-slate-800 dark:text-slate-100 text-xs font-medium focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200/50 transition-all placeholder:text-slate-400 shadow-sm font-mono"
            />
          </div>

          {/* Send / Activate Button at the very bottom */}
          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-purple-200 dark:shadow-none hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Send Daily WhatsApp Updates</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
