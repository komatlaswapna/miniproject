import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  TrendingUp,
  TrendingDown,
  PieChart as PieIcon,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

export default function ReportsPage() {
  const {
    transactions,
    budgets,
    formatCurrency,
    exportTransactionsToCSV,
    user
  } = useApp();

  const reportRef = useRef(null);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((a, b) => a + Number(b.amount), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((a, b) => a + Number(b.amount), 0);

  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;

  // Include categories with expenses even when no budget has been set.
  const categoryNames = new Set([
    ...budgets.map(b => b.category_name).filter(Boolean),
    ...transactions
      .filter(t => t.type === 'expense')
      .map(t => t.category_name || t.category || 'Uncategorized')
  ]);
  const categoryBarData = Array.from(categoryNames, categoryName => {
    const planned = budgets
      .filter(b => b.category_name === categoryName)
      .reduce((sum, budget) => sum + Number(budget.planned_amount || 0), 0);
    const actual = transactions
      .filter(t => t.type === 'expense' && (t.category_name || t.category || 'Uncategorized') === categoryName)
      .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0);

    return {
      category: categoryName.split(' ')[0],
      fullName: categoryName,
      planned,
      actual: Math.round(actual)
    };
  });

  // Radar Chart data for holistic distribution
  const radarData = budgets.slice(0, 6).map(b => {
    const actual = transactions
      .filter(t => t.type === 'expense' && t.category_name === b.category_name)
      .reduce((a, t) => a + Number(t.amount), 0);
    return {
      subject: b.category_name.split(' ')[0],
      A: Math.round(actual),
      B: b.planned_amount,
      fullMark: 1500
    };
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in" ref={reportRef}>
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-indigo-100 dark:border-indigo-900/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Financial Analytics & Executive Report</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-700 dark:text-indigo-300">
                Billing Cycle: October 2026
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Comprehensive variance audits, spending velocity, and categorical allocation breakdowns.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 w-full md:w-auto">
          <button
            onClick={exportTransactionsToCSV}
            className="flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white text-xs font-bold shadow-glow transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Executive Key Metrics - Themed Colored Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-white/85 to-emerald-500/5 dark:from-emerald-950/40 dark:via-slate-900/80 dark:to-emerald-950/20 border border-emerald-200/80 dark:border-emerald-500/30 shadow-md">
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">Total Monthly Inflow</span>
          <p className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">{formatCurrency(totalIncome)}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Salary & Freelance</p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-500/10 via-white/85 to-rose-500/5 dark:from-rose-950/40 dark:via-slate-900/80 dark:to-rose-950/20 border border-rose-200/80 dark:border-rose-500/30 shadow-md">
          <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wide">Total Monthly Outflow</span>
          <p className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400 mt-1">{formatCurrency(totalExpense)}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{transactions.filter(t => t.type === 'expense').length} total debits</p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-white/85 to-indigo-500/5 dark:from-indigo-950/40 dark:via-slate-900/80 dark:to-indigo-950/20 border border-indigo-200/80 dark:border-indigo-500/30 shadow-md">
          <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wide">Net Surplus</span>
          <p className="text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400 mt-1">{formatCurrency(netSavings)}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Added to liquid capital</p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-white/85 to-amber-500/5 dark:from-amber-950/40 dark:via-slate-900/80 dark:to-amber-950/20 border border-amber-200/80 dark:border-amber-500/30 shadow-md">
          <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide">Savings Velocity</span>
          <p className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400 mt-1">{savingsRate}%</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Target benchmark: 20%</p>
        </div>
      </div>

      {/* Visual Analytics Box */}
      <div className="p-6 rounded-3xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Planned Budget vs Actual Spend by Category</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Variance overview across current envelopes</p>
          </div>
          <div className="flex items-center space-x-3 text-xs font-medium">
            <span className="flex items-center space-x-1 text-indigo-600 dark:text-indigo-400">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
              <span>Planned</span>
            </span>
            <span className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Actual</span>
            </span>
          </div>
        </div>

        {categoryBarData.length > 0 ? (
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryBarData} barGap={4} margin={{ top: 8, right: 12, left: 8, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                <XAxis dataKey="category" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={val => `₹${val}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName || ''}
                  formatter={(val, name) => [`₹${Number(val).toLocaleString('en-IN')}`, name]}
                />
                <Bar dataKey="planned" fill="#6366f1" radius={[4, 4, 0, 0]} name="Planned Limit" />
                <Bar dataKey="actual" fill="#10b981" radius={[4, 4, 0, 0]} name="Actual Spend" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-72 items-center justify-center rounded-2xl bg-slate-50 text-sm text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
            Add expenses or budgets to see your category comparison chart.
          </div>
        )}
      </div>
    </div>
  );
}
