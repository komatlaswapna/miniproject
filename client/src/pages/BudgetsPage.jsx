import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  PieChart as PieIcon,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Edit2,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Calendar,
  X
} from 'lucide-react';

export default function BudgetsPage() {
  const {
    budgets = [],
    transactions = [],
    formatCurrency,
    applyIterativeAiBudget,
    updateBudget,
    categories = [],
    addToast
  } = useApp();

  const [selectedMonth, setSelectedMonth] = useState('2026-10');
  const [editingBudget, setEditingBudget] = useState(null);
  const [isAddBudgetOpen, setIsAddBudgetOpen] = useState(false);
  const [newBudgetCategory, setNewBudgetCategory] = useState('Food & Dining');
  const [newBudgetAmount, setNewBudgetAmount] = useState('');

  // Calculate actual spending per category
  const categoryActuals = {};
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      categoryActuals[t.category_name] = (categoryActuals[t.category_name] || 0) + Number(t.amount);
    });

  const displayBudgets = budgets || [];

  const totalPlanned = displayBudgets.reduce((acc, b) => acc + Number(b.planned_amount), 0);
  const totalActual = Object.values(categoryActuals).reduce((acc, val) => acc + val, 0);
  const overallUtilization = totalPlanned > 0 ? Math.round((totalActual / totalPlanned) * 100) : 0;
  const budgetCategories = categories.filter(category => category.type === 'expense');

  const handleUpdateLimit = (e) => {
    e.preventDefault();
    if (!editingBudget) return;
    const newAmount = Number(editingBudget.planned_amount);
    if (newAmount <= 0) {
      addToast('Planned amount must be greater than zero', 'error');
      return;
    }

    if (updateBudget) {
      updateBudget(editingBudget.category_name, newAmount);
    }
    setEditingBudget(null);
  };

  const handleCreateNewBudget = (e) => {
    e.preventDefault();
    const amount = Number(newBudgetAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      addToast('Please enter a valid budget limit', 'error');
      return;
    }
    if (updateBudget) {
      updateBudget(newBudgetCategory, amount);
    }
    setNewBudgetAmount('');
    setIsAddBudgetOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner & Iterative Optimizer Trigger */}
      <div className="p-6 rounded-3xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-indigo-100 dark:border-indigo-900/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
            <PieIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Budgets</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300">
                Spending limits
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Set a limit for each spending category.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => {
              setNewBudgetCategory(budgetCategories[0]?.name || '');
              setNewBudgetAmount('');
              setIsAddBudgetOpen(true);
            }}
            className="flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md"
          >
            <span>+ Add Budget</span>
          </button>

          <button
            onClick={applyIterativeAiBudget}
            className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 hover:opacity-95 text-white text-xs font-bold shadow-glow transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Adjust budgets with AI</span>
          </button>
        </div>
      </div>

      {/* Aggregate Health Strip - Themed Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-white/85 to-indigo-500/5 dark:from-indigo-950/40 dark:via-slate-900/80 dark:to-indigo-950/20 border border-indigo-200/80 dark:border-indigo-500/30 shadow-md">
          <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wide">Budget total</span>
          <p className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100 mt-1">{formatCurrency(totalPlanned)}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{budgets.length} categories</p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-500/10 via-white/85 to-rose-500/5 dark:from-rose-950/40 dark:via-slate-900/80 dark:to-rose-950/20 border border-rose-200/80 dark:border-rose-500/30 shadow-md">
          <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wide">Spent</span>
          <p className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400 mt-1">{formatCurrency(totalActual)}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{overallUtilization}% of budget</p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-white/85 to-emerald-500/5 dark:from-emerald-950/40 dark:via-slate-900/80 dark:to-emerald-950/20 border border-emerald-200/80 dark:border-emerald-500/30 shadow-md">
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">Left to spend</span>
          <p className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">{formatCurrency(Math.max(0, totalPlanned - totalActual))}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Remaining from your budget</p>
        </div>
      </div>

      {/* Categories Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayBudgets.length === 0 && (
          <p className="col-span-full rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-6 text-center text-sm text-slate-500 dark:text-slate-400">
            No budgets yet. Add a budget to track your spending.
          </p>
        )}
        {displayBudgets.map(b => {
          const actual = categoryActuals[b.category_name] || 0;
          const ratio = b.planned_amount > 0 ? (actual / b.planned_amount) : 0;
          const percentage = Math.round(ratio * 100);
          const variance = actual - b.planned_amount;
          const isBreached = ratio >= 1.0;
          const isWarning = ratio >= 0.8 && !isBreached;

          return (
            <div
              key={b.id}
              className={`p-5 rounded-3xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border transition-all duration-300 relative flex flex-col justify-between shadow-md ${
                isBreached
                  ? 'border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.15)] bg-rose-500/5 dark:bg-rose-950/20'
                  : isWarning
                  ? 'border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.15)] bg-amber-500/5 dark:bg-amber-950/20'
                  : 'border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-700'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{b.category_name}</h3>
                    <div className="flex items-center space-x-1.5 mt-0.5">
                      {isBreached ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-300 flex items-center space-x-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>100% Breached</span>
                        </span>
                      ) : isWarning ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center space-x-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>80% Threshold</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>On Track</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setEditingBudget({ category_name: b.category_name, planned_amount: b.planned_amount, bRef: b })}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Edit planned budget"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Amounts Comparison */}
                <div className="flex items-baseline justify-between mt-2">
                  <div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Spent / Limit</p>
                    <p className="text-lg font-mono font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                      {formatCurrency(actual)} <span className="text-xs font-normal text-slate-400 dark:text-slate-500">/ {formatCurrency(b.planned_amount)}</span>
                    </p>
                  </div>
                  <span className={`text-sm font-mono font-bold ${
                    isBreached ? 'text-rose-600 dark:text-rose-400' : isWarning ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'
                  }`}>
                    {percentage}%
                  </span>
                </div>

                {/* Visual Progress Bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-950 rounded-full h-2 overflow-hidden my-3">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      isBreached ? 'bg-rose-500' : isWarning ? 'bg-amber-400' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${Math.min(100, percentage)}%` }}
                  ></div>
                </div>

                {/* Variance Note */}
                <div className="text-[11px] flex items-center justify-between text-slate-400 pt-1">
                  <span>Variance:</span>
                  <span className={`font-mono font-semibold ${
                    variance > 0 ? 'text-rose-400' : 'text-emerald-400'
                  }`}>
                    {variance > 0 ? `+${formatCurrency(variance)} over` : `${formatCurrency(Math.abs(variance))} remaining`}
                  </span>
                </div>
              </div>

              {/* AI Recommendation footer */}
              {b.ai_recommended_amount && (
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] bg-slate-950/40 p-2.5 rounded-xl">
                  <div className="flex items-center space-x-1.5 text-indigo-300">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>AI Target:</span>
                  </div>
                  <span className="font-mono font-bold text-indigo-300">
                    {formatCurrency(b.ai_recommended_amount)}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Budget Modal */}
      {isAddBudgetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl bg-[#F3E8FF] border border-violet-200 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-violet-200">
              <h3 className="text-sm font-bold text-slate-900">Add a budget</h3>
              <button onClick={() => setIsAddBudgetOpen(false)} className="text-slate-500 hover:text-slate-900" aria-label="Close">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewBudget} className="space-y-4 pt-4">
              <div>
                <label htmlFor="budget-category" className="block text-[11px] font-medium text-slate-600 mb-1">Category</label>
                <select
                  id="budget-category"
                  required
                  value={newBudgetCategory}
                  onChange={e => setNewBudgetCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-violet-100 border border-violet-300 text-slate-900 text-sm focus:outline-none focus:border-indigo-500"
                >
                  {budgetCategories.map(category => (
                    <option key={category.id} value={category.name}>{category.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="budget-amount" className="block text-[11px] font-medium text-slate-600 mb-1">Monthly limit</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-600 font-bold text-sm">₹</span>
                  <input
                    id="budget-amount"
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={newBudgetAmount}
                    onChange={e => setNewBudgetAmount(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-violet-100 border border-violet-300 text-slate-900 text-sm font-bold font-mono focus:outline-none focus:border-indigo-500"
                    placeholder="Enter amount"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddBudgetOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-600 hover:bg-violet-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                >
                  Save budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Budget Modal */}
      {editingBudget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100">Adjust {editingBudget.category_name} Limit</h3>
              <button onClick={() => setEditingBudget(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateLimit} className="space-y-4 pt-4">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">New Monthly Limit (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    step="10"
                    required
                    value={editingBudget.planned_amount}
                    onChange={e => setEditingBudget({ ...editingBudget, planned_amount: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm font-bold font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingBudget(null)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                >
                  Save Limit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
