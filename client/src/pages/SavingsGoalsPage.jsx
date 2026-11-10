import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Target,
  PlusCircle,
  Trophy,
  Flame,
  Award,
  Sparkles,
  DollarSign,
  Calendar,
  ArrowRight,
  CheckCircle2,
  X,
  ShieldCheck,
  Laptop,
  Plane
} from 'lucide-react';

export default function SavingsGoalsPage() {
  const {
    savingsGoals,
    addSavingsGoal,
    depositToGoal,
    formatCurrency,
    badges,
    user,
    addToast
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [depositModalGoal, setDepositModalGoal] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');

  const [newGoal, setNewGoal] = useState({
    title: '',
    target_amount: '',
    current_amount: '',
    target_date: '2027-01-01',
    color: '#10b981'
  });

  const totalSavedAcrossGoals = savingsGoals.reduce((a, b) => a + Number(b.current_amount || 0), 0);
  const totalTargetAcrossGoals = savingsGoals.reduce((a, b) => a + Number(b.target_amount || 0), 0);
  const overallProgress = totalTargetAcrossGoals > 0 ? Math.round((totalSavedAcrossGoals / totalTargetAcrossGoals) * 100) : 0;

  const handleCreateGoal = (e) => {
    e.preventDefault();
    if (!newGoal.title.trim() || !newGoal.target_amount) {
      addToast('Please fill all required goal fields', 'error');
      return;
    }

    addSavingsGoal(newGoal);
    setIsAddModalOpen(false);
    setNewGoal({
      title: '',
      target_amount: '',
      current_amount: '',
      target_date: '2027-01-01',
      color: '#10b981'
    });
  };

  const handleConfirmDeposit = (e) => {
    e.preventDefault();
    if (!depositAmount || Number(depositAmount) <= 0) {
      addToast('Please enter a valid deposit amount', 'error');
      return;
    }
    depositToGoal(depositModalGoal.id, depositAmount);
    setDepositModalGoal(null);
    setDepositAmount('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner with Badges & Gamification summary */}
      <div className="p-6 rounded-3xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-indigo-100 dark:border-indigo-900/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Savings Goals & Wealth Jars</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300">
                Gamified XP
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Accumulate dedicated reserves, track milestones, and earn achievement badges.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white text-xs font-bold shadow-glow-emerald transition-all w-full md:w-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Savings Goal</span>
        </button>
      </div>

      {/* Aggregate Savings Progress - Colored Banner Box */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-white/85 to-teal-500/10 dark:from-emerald-950/40 dark:via-slate-900/80 dark:to-teal-950/20 border border-emerald-200/80 dark:border-emerald-500/30 shadow-md space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-700 dark:text-slate-300 font-bold">Total Across All Active Goals</span>
          <span className="font-mono text-emerald-700 dark:text-emerald-400 font-black">
            {formatCurrency(totalSavedAcrossGoals)} / {formatCurrency(totalTargetAcrossGoals)} ({overallProgress}%)
          </span>
        </div>

        <div className="w-full bg-slate-200/80 dark:bg-slate-950 rounded-full h-3 overflow-hidden p-0.5 border border-emerald-100 dark:border-slate-800">
          <div
            className="bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 h-full rounded-full transition-all duration-700"
            style={{ width: `${Math.min(100, overallProgress)}%` }}
          ></div>
        </div>
      </div>

      {/* Goal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {savingsGoals.map(goal => {
          const ratio = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) : 0;
          const percent = Math.min(100, Math.round(ratio * 100));
          const remaining = Math.max(0, goal.target_amount - goal.current_amount);
          const isCompleted = goal.current_amount >= goal.target_amount;

          return (
            <div
              key={goal.id}
              className="p-6 rounded-3xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-slate-700 shadow-md transition-all flex flex-col justify-between space-y-4 relative overflow-hidden"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400">
                    <Target className="w-6 h-6" />
                  </div>
                  {isCompleted ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Goal Achieved 🎉
                    </span>
                  ) : (
                    <span className="text-xs font-mono font-bold text-slate-300">
                      {percent}%
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-100 mt-3">{goal.title}</h3>

                <div className="mt-2 flex items-baseline justify-between">
                  <p className="text-2xl font-mono font-bold text-slate-100">
                    {formatCurrency(goal.current_amount)}
                  </p>
                  <span className="text-xs text-slate-500">
                    Target: {formatCurrency(goal.target_amount)}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden my-3">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-indigo-500 transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Remaining: {formatCurrency(remaining)}</span>
                  <span>Target: {goal.target_date}</span>
                </div>
              </div>

              {/* Deposit Action */}
              <button
                onClick={() => setDepositModalGoal(goal)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700"
              >
                + Add Deposit
              </button>
            </div>
          );
        })}
      </div>

      {/* Add Goal Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-violet-100 border border-violet-200 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-violet-200">
              <h3 className="text-sm font-bold text-slate-900">Create Savings Goal</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-500 hover:text-slate-900">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-4 pt-4">
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Goal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Down Payment, Europe Trip, Laptop"
                  value={newGoal.title}
                  onChange={e => setNewGoal({ ...newGoal, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-violet-50 border border-violet-200 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Target Amount (₹)</label>
                  <input
                    type="number"
                    step="50"
                    required
                    placeholder="5000"
                    value={newGoal.target_amount}
                    onChange={e => setNewGoal({ ...newGoal, target_amount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-violet-50 border border-violet-200 text-slate-900 placeholder:text-slate-400 text-sm font-mono font-bold focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Initial Deposit (₹)</label>
                  <input
                    type="number"
                    step="10"
                    placeholder="0"
                    value={newGoal.current_amount}
                    onChange={e => setNewGoal({ ...newGoal, current_amount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-violet-50 border border-violet-200 text-slate-900 placeholder:text-slate-400 text-sm font-mono focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Target Date</label>
                <input
                  type="date"
                  required
                  value={newGoal.target_date}
                  onChange={e => setNewGoal({ ...newGoal, target_date: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-violet-50 border border-violet-200 text-slate-900 text-xs focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-600 hover:bg-violet-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-glow-emerald"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deposit Modal */}
      {depositModalGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl bg-violet-100 border border-violet-200 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-violet-200">
              <h3 className="text-sm font-bold text-slate-900">Add Deposit to {depositModalGoal.title}</h3>
              <button onClick={() => setDepositModalGoal(null)} className="text-slate-500 hover:text-slate-900">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmDeposit} className="space-y-4 pt-4">
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Deposit Amount (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    step="5"
                    required
                    placeholder="100.00"
                    value={depositAmount}
                    onChange={e => setDepositAmount(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-violet-50 border border-violet-200 text-slate-900 placeholder:text-slate-400 text-sm font-bold font-mono focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDepositModalGoal(null)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-600 hover:bg-violet-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-glow-emerald"
                >
                  Confirm Deposit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
