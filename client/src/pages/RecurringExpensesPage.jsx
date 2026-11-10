import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CalendarSync,
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Calendar,
  DollarSign,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  ArrowRight
} from 'lucide-react';

export default function RecurringExpensesPage() {
  const {
    recurringRules,
    toggleAutoAddRecurring,
    confirmRecurring,
    formatCurrency,
    addToast
  } = useApp();

  const totalMonthlyCommitted = recurringRules.reduce((a, b) => a + Number(b.estimated_amount), 0);
  const autoAddActiveCount = recurringRules.filter(r => r.auto_add).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400">
            <CalendarSync className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-slate-100">Recurring Expense Automation</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                AI Cadence Detection
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Identifies monthly recharges, rent, utility bills, and SaaS subscriptions with automated ledger entries.
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-right">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Monthly Committed</span>
          <p className="text-xl font-mono font-bold text-slate-100 mt-0.5">{formatCurrency(totalMonthlyCommitted)}</p>
        </div>
      </div>

      {/* Aggregate Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Detected Subscriptions</span>
          <p className="text-2xl font-bold text-slate-100 mt-1">{recurringRules.length} Services</p>
          <p className="text-[11px] text-slate-500 mt-1">Rent, Internet, Streaming, Gym</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Auto-Add Rules Active</span>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{autoAddActiveCount} of {recurringRules.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">Logged automatically on billing day</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Average Confidence</span>
          <p className="text-2xl font-bold text-indigo-400 mt-1">95.8%</p>
          <p className="text-[11px] text-slate-500 mt-1">Pattern match based on past 90 days</p>
        </div>
      </div>

      {/* Recurring Subscriptions List */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CalendarSync className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-100">Detected Recurring Cadences</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Status: Verified periodic frequency</span>
        </div>

        <div className="divide-y divide-slate-800/60">
          {recurringRules.map(rule => (
            <div key={rule.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors">
              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 rounded-xl bg-slate-800 text-indigo-400 mt-0.5">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-bold text-slate-100">{rule.merchant_name}</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300">
                      {Math.round(rule.confidence_score * 100)}% Confidence
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
                    <span>{rule.category_name}</span>
                    <span>•</span>
                    <span className="capitalize">{rule.frequency}</span>
                    <span>•</span>
                    <span>Due Day: <strong className="text-slate-300">{rule.due_day}th</strong></span>
                    <span>•</span>
                    <span className="text-indigo-400">Next due: {rule.next_due_date}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-6 w-full md:w-auto justify-between md:justify-end">
                <div className="text-right">
                  <p className="text-base font-mono font-bold text-slate-100">
                    {formatCurrency(rule.estimated_amount)}
                  </p>
                  <p className="text-[10px] text-slate-500">per month</p>
                </div>

                {/* Auto-Add Toggle Switch */}
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-400 font-medium hidden sm:inline">Auto-Add:</span>
                  <button
                    onClick={() => toggleAutoAddRecurring(rule.id)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      rule.auto_add
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {rule.auto_add ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Enabled</span>
                      </>
                    ) : (
                      <span>Disabled</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
