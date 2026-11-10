import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight } from 'lucide-react';
import {
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function WhatIfSimulatorPage() {
  const { transactions = [], categories = [], formatCurrency } = useApp();

  const expenseBreakdown = useMemo(() => {
    const categoryTotals = transactions.reduce((totals, transaction) => {
      if (transaction.type !== 'expense') return totals;

      const amount = Number(transaction.amount);
      if (!Number.isFinite(amount) || amount <= 0) return totals;

      const categoryName = transaction.category_name || transaction.category || 'Uncategorized';
      totals[categoryName] = (totals[categoryName] || 0) + amount;
      return totals;
    }, {});

    const total = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
    const fallbackColors = ['#06b6d4', '#3b82f6', '#a855f7', '#f59e0b', '#6366f1', '#ec4899', '#ef4444', '#10b981'];

    return Object.entries(categoryTotals)
      .map(([name, amount], index) => ({
        name,
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0,
        color: categories.find(category => category.name === name)?.color || fallbackColors[index % fallbackColors.length]
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions, categories]);

  // Simulator scenario sliders
  const [incomeChangePercent, setIncomeChangePercent] = useState(0); // -20% to +50%
  const [rentChange, setRentChange] = useState(0); // -$400 to +$800
  const [discretionaryCutPercent, setDiscretionaryCutPercent] = useState(0); // 0% to 50%
  const [annualInflation, setAnnualInflation] = useState(3.5); // 1% to 12%
  const [oneTimeExpense, setOneTimeExpense] = useState(0); // $0 to $5000
  const [oneTimeMonth, setOneTimeMonth] = useState(4); // Month 1 to 12

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Expense category breakdown */}
      <div className="p-6 rounded-3xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Expenses by Category</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Your recorded expenses as a percentage of total spending</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-5">
          {expenseBreakdown.length > 0 ? (
            <>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseBreakdown}
                      dataKey="amount"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius="82%"
                      label={({ percent }) => percent >= 0.05 ? `${Math.round(percent * 100)}%` : ''}
                      labelLine={false}
                    >
                      {expenseBreakdown.map(entry => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                      formatter={(value, name, item) => [
                        `${formatCurrency(value)} (${item.payload.percentage.toFixed(1)}%)`,
                        name
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2">
                {expenseBreakdown.map(entry => (
                  <div key={entry.name} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 px-3 py-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="h-3 w-3 flex-shrink-0 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="truncate text-xs font-semibold text-slate-700 dark:text-slate-200">{entry.name}</span>
                    </div>
                    <span className="flex-shrink-0 text-right text-xs font-bold text-slate-600 dark:text-slate-300">
                      {entry.percentage.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="col-span-full flex h-64 items-center justify-center rounded-2xl bg-slate-50 text-sm text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
              No expenses recorded yet. Add an expense to see your category breakdown.
            </div>
          )}
        </div>

      </div>

      {/* Simulator Control Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Monthly income change */}
        <div className="p-5 rounded-3xl bg-violet-100 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-900/60 space-y-3">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-slate-700 dark:text-slate-300">Change in Monthly Income</span>
            <span className={`font-mono font-bold ${incomeChangePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {incomeChangePercent > 0 ? `+${incomeChangePercent}%` : `${incomeChangePercent}%`}
            </span>
          </div>
          <input
            type="range"
            min="-30"
            max="50"
            step="5"
            value={incomeChangePercent}
            onChange={e => setIncomeChangePercent(Number(e.target.value))}
            className="w-full accent-violet-300 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>-30% Less</span>
            <span>0% No change</span>
            <span>+50% More</span>
          </div>
        </div>

        {/* Monthly rent change */}
        <div className="p-5 rounded-3xl bg-violet-100 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-900/60 space-y-3">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-slate-700 dark:text-slate-300">Change in Monthly Rent</span>
            <span className={`font-mono font-bold ${rentChange <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {rentChange >= 0 ? `+${formatCurrency(rentChange)}/month` : `-${formatCurrency(Math.abs(rentChange))}/month`}
            </span>
          </div>
          <input
            type="range"
            min="-400"
            max="800"
            step="50"
            value={rentChange}
            onChange={e => setRentChange(Number(e.target.value))}
            className="w-full accent-purple-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>-₹400 Less</span>
            <span>₹0 No change</span>
            <span>+₹800 More</span>
          </div>
        </div>

        {/* Optional spending reduction */}
        <div className="p-5 rounded-3xl bg-violet-100 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-900/60 space-y-3">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-slate-700 dark:text-slate-300">Reduce Optional Spending</span>
            <span className="font-mono font-bold text-emerald-400">
              -{discretionaryCutPercent}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            step="5"
            value={discretionaryCutPercent}
            onChange={e => setDiscretionaryCutPercent(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>0% No reduction</span>
            <span>25% Less</span>
            <span>50% Less</span>
          </div>
        </div>

        {/* Yearly price increase */}
        <div className="p-5 rounded-3xl bg-violet-100 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-900/60 space-y-3">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-slate-700 dark:text-slate-300">Yearly Price Increase</span>
            <span className="font-mono font-bold text-amber-400">
              {annualInflation}%
            </span>
          </div>
          <input
            type="range"
            min="1.0"
            max="12.0"
            step="0.5"
            value={annualInflation}
            onChange={e => setAnnualInflation(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>1% Low</span>
            <span>3.5% Average</span>
            <span>12% High</span>
          </div>
        </div>

        {/* One-time extra expense */}
        <div className="p-5 rounded-3xl bg-violet-100 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-900/60 space-y-3">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-slate-700 dark:text-slate-300">One-Time Extra Expense</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
              {formatCurrency(oneTimeExpense)}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="8000"
            step="200"
            value={oneTimeExpense}
            onChange={e => setOneTimeExpense(Number(e.target.value))}
            className="w-full accent-rose-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>₹0 No expense</span>
            <span>₹2,500 Extra</span>
            <span>₹8,000 Extra</span>
          </div>
        </div>

        {/* Month of one-time expense */}
        <div className="p-5 rounded-3xl bg-violet-100 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-900/60 space-y-3">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-slate-700 dark:text-slate-300">When to Add the Expense</span>
            <span className="font-mono font-bold text-indigo-400">
              Month {oneTimeMonth}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="12"
            step="1"
            value={oneTimeMonth}
            onChange={e => setOneTimeMonth(Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Month 1</span>
            <span>Month 6</span>
            <span>Month 12</span>
          </div>
        </div>
      </div>
    </div>
  );
}
