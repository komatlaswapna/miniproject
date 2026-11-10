import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Plus,
  Camera,
  Upload,
  PieChart as PieIcon,
  Sparkles,
  ArrowRight,
  Palmtree,
  Lightbulb,
  FileText,
  Utensils,
  ShoppingBag,
  Plane,
  Bot,
  Zap,
  BarChart2
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function DashboardPage({ onOpenVoice, onOpenAddTx }) {
  const {
    user,
    transactions = [],
    budgets = [],
    savingsGoals = [],
    formatCurrency,
    setCurrentView,
    applyIterativeAiBudget
  } = useApp();

  const [activeRange, setActiveRange] = useState('30D'); // '7D' | '30D' | '3M' | '6M' | '1Y'

  // Dynamic calculations strictly from logged-in user's data
  const totalIncome = useMemo(() => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  }, [transactions]);

  const totalExpenses = useMemo(() => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  }, [transactions]);

  const availableBalance = totalIncome - totalExpenses;

  const totalSavings = useMemo(() => {
    return (savingsGoals || [])
      .reduce((sum, g) => sum + Number(g.current_amount || 0), 0);
  }, [savingsGoals]);

  const totalPlannedBudget = useMemo(() => {
    return (budgets || [])
      .reduce((sum, b) => sum + Number(b.planned_amount || 0), 0);
  }, [budgets]);

  const budgetUsedPercent = totalPlannedBudget > 0
    ? Math.min(100, Math.round((totalExpenses / totalPlannedBudget) * 100))
    : 0;

  // Real Spline data strictly grouped from user transactions
  const chartData = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return [
        { date: 'Start', income: 0, expenses: 0 },
        { date: 'Today', income: 0, expenses: 0 }
      ];
    }

    const dateMap = {};
    const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    sorted.forEach(t => {
      const d = t.date ? t.date.slice(5) : 'Day';
      if (!dateMap[d]) dateMap[d] = { date: d, income: 0, expenses: 0 };
      if (t.type === 'income') dateMap[d].income += Number(t.amount || 0);
      else dateMap[d].expenses += Number(t.amount || 0);
    });

    const list = Object.values(dateMap);
    return list.length > 0 ? list : [{ date: 'Today', income: 0, expenses: 0 }];
  }, [transactions]);

  return (
    <div className="space-y-6 animate-fade-in text-slate-800 dark:text-slate-100">
      {/* Greeting Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 animate-spring-zoom">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
            <span>Good morning, {user?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Friend'}!</span>
            <span className="text-2xl animate-wave inline-block cursor-default select-none">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {transactions.length === 0 ? 'Welcome to your fresh financial cockpit. Log your first expense to begin tracking!' : "Here's your real-time financial overview"}
          </p>
        </div>
      </div>

      {/* Top Grid: Spending Overview - Full Width Clean Card */}
      <div className="w-full">
        {/* Spending Overview - Colorful Glass Card */}
        <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-indigo-100/80 dark:border-indigo-900/40 rounded-3xl p-6 shadow-xl animate-spring-left delay-75">

          {/* Top Bar of Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                <BarChart2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800 dark:text-white tracking-tight">Spending Overview</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                  Live summary of your income, expenses and savings
                </p>
              </div>
            </div>

            {/* Range Toggle Pills */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100/90 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs font-semibold">
              {['7D', '30D', '3M', '6M', '1Y'].map(range => (
                <button
                  key={range}
                  onClick={() => setActiveRange(range)}
                  className={`px-3 py-1 rounded-lg transition-all duration-200 ${
                    activeRange === range
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm font-bold'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* 4 KPI Boxes - Vibrant Themed Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {/* 1. Total Income Box (Emerald / Mint) */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-emerald-500/5 dark:from-emerald-950/40 dark:via-teal-900/20 dark:to-emerald-950/10 border border-emerald-200 dark:border-emerald-500/30 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wide">Total Income</span>
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
              <p className="text-xl font-black font-mono text-emerald-800 dark:text-emerald-300 mt-2">
                {formatCurrency(totalIncome)}
              </p>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 block">
                {totalIncome > 0 ? '✓ Recorded' : '₹0 recorded'}
              </span>
            </div>

            {/* 2. Total Expenses Box (Rose / Coral) */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-500/15 via-pink-500/10 to-red-500/5 dark:from-rose-950/40 dark:via-pink-900/20 dark:to-rose-950/10 border border-rose-200 dark:border-rose-500/30 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-rose-700 dark:text-rose-400 font-bold uppercase tracking-wide">Total Expenses</span>
                <div className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-600 dark:text-rose-300 flex items-center justify-center">
                  <ArrowDownRight className="w-3.5 h-3.5" />
                </div>
              </div>
              <p className="text-xl font-black font-mono text-rose-800 dark:text-rose-300 mt-2">
                {formatCurrency(totalExpenses)}
              </p>
              <span className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold mt-1 block">
                {transactions.filter(t => t.type === 'expense').length} expenses
              </span>
            </div>

            {/* 3. Available Balance Box (Blue / Indigo) */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/15 via-indigo-500/10 to-cyan-500/5 dark:from-blue-950/40 dark:via-indigo-900/20 dark:to-blue-950/10 border border-blue-200 dark:border-blue-500/30 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-blue-700 dark:text-blue-400 font-bold uppercase tracking-wide">Available Balance</span>
                <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-600 dark:text-blue-300 flex items-center justify-center">
                  <Wallet className="w-3.5 h-3.5" />
                </div>
              </div>
              <p className={`text-xl font-black font-mono mt-2 ${availableBalance >= 0 ? 'text-blue-800 dark:text-blue-300' : 'text-rose-600'}`}>
                {formatCurrency(availableBalance)}
              </p>
              <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-1 block">Net remaining</span>
            </div>

            {/* 4. Savings Box (Purple / Fuchsia) */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/15 via-violet-500/10 to-fuchsia-500/5 dark:from-purple-950/40 dark:via-violet-900/20 dark:to-purple-950/10 border border-purple-200 dark:border-purple-500/30 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-purple-700 dark:text-purple-400 font-bold uppercase tracking-wide">Savings</span>
                <div className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-600 dark:text-purple-300 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              </div>
              <p className="text-xl font-black font-mono text-purple-800 dark:text-purple-300 mt-2">
                {formatCurrency(totalSavings)}
              </p>
              <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold mt-1 block">
                {savingsGoals.length} goals
              </span>
            </div>
          </div>

          {/* Chart Legend */}
          <div className="flex justify-end items-center space-x-4 text-xs font-semibold mb-3 pr-1">
            <span className="flex items-center space-x-1.5 text-indigo-600 dark:text-indigo-400">
              <span className="w-3 h-1.5 rounded-full bg-indigo-500 inline-block"></span>
              <span>Income</span>
            </span>
            <span className="flex items-center space-x-1.5 text-rose-500 dark:text-rose-400">
              <span className="w-3 h-1.5 rounded-full bg-rose-500 inline-block"></span>
              <span>Expenses</span>
            </span>
          </div>

          {/* Line Chart */}
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} tickFormatter={val => `₹${val/1000}K`} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-xs shadow-lg">
                          <p className="font-bold text-slate-700 dark:text-slate-200 mb-1">{label}</p>
                          <p className="text-indigo-600 dark:text-indigo-400 font-mono">• Income: ₹ {payload[0]?.value?.toLocaleString('en-IN')}</p>
                          <p className="text-rose-500 font-mono">• Expenses: ₹ {payload[1]?.value?.toLocaleString('en-IN')}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  isAnimationActive={true}
                  animationDuration={1200}
                  animationEasing="ease-out"
                  dot={{ r: 3.5, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 5, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#f43f5e"
                  strokeWidth={2.5}
                  isAnimationActive={true}
                  animationDuration={1400}
                  animationEasing="ease-out"
                  dot={{ r: 3.5, fill: '#f43f5e', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 5, fill: '#f43f5e', stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Middle Row: Monthly Budget Card + Savings Goal (Donut Ring) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Monthly Budget Card (Indigo / Violet Theme) */}
        <div className="bg-gradient-to-br from-indigo-500/10 via-white/85 to-purple-500/10 dark:from-indigo-950/40 dark:via-slate-900/80 dark:to-purple-950/30 border border-indigo-200/80 dark:border-indigo-500/30 backdrop-blur-xl rounded-[32px] p-6 flex flex-col justify-between shadow-xl animate-spring-zoom delay-150 hover-spring">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-sm">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Monthly Budget</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Total planned across categories</p>
              </div>
            </div>

            <div className="flex items-baseline justify-between mt-2">
              <p className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                {formatCurrency(totalPlannedBudget)}
              </p>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                budgetUsedPercent > 100
                  ? 'text-rose-600 dark:text-rose-400 bg-rose-500/15'
                  : 'text-indigo-700 dark:text-indigo-300 bg-indigo-500/15'
              }`}>
                {budgetUsedPercent}% used
              </span>
            </div>

            <div className="w-full bg-slate-200/70 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden my-4">
              <div
                className={`h-2.5 rounded-full transition-all duration-700 ${
                  budgetUsedPercent > 100 ? 'bg-rose-500' : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'
                }`}
                style={{ width: `${Math.min(100, budgetUsedPercent)}%` }}
              ></div>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('budgets')}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center space-x-1"
          >
            <span>View details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 2: Savings Goal (Emerald / Cyan Theme) */}
        <div className="bg-gradient-to-br from-emerald-500/10 via-white/85 to-teal-500/10 dark:from-emerald-950/40 dark:via-slate-900/80 dark:to-teal-950/30 border border-emerald-200/80 dark:border-emerald-500/30 backdrop-blur-xl rounded-[32px] p-6 flex flex-col justify-between shadow-xl animate-spring-zoom delay-225 hover-spring">
          {(() => {
            const primaryGoal = savingsGoals && savingsGoals.length > 0 ? savingsGoals[0] : null;
            const currentAmount = primaryGoal ? Number(primaryGoal.current_amount || 0) : 0;
            const targetAmount = primaryGoal ? Number(primaryGoal.target_amount || 1) : 1;
            const goalPct = primaryGoal ? Math.min(100, Math.round((currentAmount / targetAmount) * 100)) : 0;

            return (
              <>
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-sm">
                      <Palmtree className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">Savings Goal</h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {primaryGoal ? primaryGoal.title : 'No active goals'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-black font-mono text-slate-900 dark:text-white">
                        {formatCurrency(currentAmount)}
                      </p>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        / {formatCurrency(targetAmount)}
                      </p>
                    </div>

                    {/* Circular SVG Donut Progress */}
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-slate-200 dark:text-slate-800"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-emerald-600 dark:text-emerald-400 transition-all duration-1000 ease-out"
                          strokeDasharray={`${goalPct}, 100`}
                          strokeLinecap="round"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <span className="absolute text-xs font-extrabold text-emerald-700 dark:text-emerald-300">
                        {goalPct}%
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentView('goals')}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center space-x-1 mt-4"
                >
                  <span>{primaryGoal ? 'Add deposit' : 'Create a savings goal'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            );
          })()}
        </div>
      </div>

      {/* Bottom Row: Quick Actions (Amber / Sunset Theme) */}
      <div className="bg-gradient-to-br from-amber-500/10 via-white/85 to-orange-500/10 dark:from-amber-950/40 dark:via-slate-900/80 dark:to-orange-950/30 border border-amber-200/80 dark:border-amber-500/30 backdrop-blur-xl rounded-[32px] p-6 shadow-xl animate-spring-zoom delay-375 hover-spring">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h3>

        {/* 4 Circular Gradient Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <button
            onClick={onOpenAddTx}
            className="flex flex-col items-center group p-3 rounded-2xl hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white flex items-center justify-center shadow-md transition-all group-hover:scale-110 group-hover:-translate-y-0.5">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-2 leading-tight">
              Add Transaction
            </span>
          </button>

          <button
            onClick={() => setCurrentView('receipts')}
            className="flex flex-col items-center group p-3 rounded-2xl hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white flex items-center justify-center shadow-md transition-all group-hover:scale-110 group-hover:-translate-y-0.5">
              <Camera className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-2 leading-tight">
              Scan Receipt
            </span>
          </button>

          <button
            onClick={() => setCurrentView('transactions')}
            className="flex flex-col items-center group p-3 rounded-2xl hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white flex items-center justify-center shadow-md transition-all group-hover:scale-110 group-hover:-translate-y-0.5">
              <Upload className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-2 leading-tight">
              Import CSV
            </span>
          </button>

          <button
            onClick={() => setCurrentView('budgets')}
            className="flex flex-col items-center group p-3 rounded-2xl hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white flex items-center justify-center shadow-md transition-all group-hover:scale-110 group-hover:-translate-y-0.5">
              <PieIcon className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-2 leading-tight">
              Set Budget
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
