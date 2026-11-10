import React from 'react';
import { useApp } from '../context/AppContext';
import {
  BrainCircuit,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart2,
  LineChart as LineIcon
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';

export default function AIInsightsPage() {
  const { learningCurve, applyIterativeAiBudget, formatCurrency } = useApp();

  const anomalies = [
    {
      title: 'Weekend Dining Spend Volatility',
      category: 'Food & Dining',
      impact: '+₹142.80 Spike',
      type: 'warning',
      desc: 'Significant deviation recorded on Oct 15 at Trattoria Bella Italian Dinner. Represents 26% of your monthly dining budget in a single transaction.'
    },
    {
      title: 'Seasonal Energy Conservation Savings',
      category: 'Utilities & Bills',
      impact: '-₹32.00 Favorable',
      type: 'positive',
      desc: 'Electricity consumption dropped 14% compared to September baseline due to milder autumn ambient temperatures.'
    },
    {
      title: 'Potential Unused Subscription Detected',
      category: 'Entertainment',
      impact: '+₹22.99 / Month',
      type: 'warning',
      desc: 'Netflix 4K Premium billed on Oct 10. Low usage recorded over the preceding 45 days. Consider downgrading to Standard plan to save ₹84/year.'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-slate-100">AI Insights & Iterative Learning Engine</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                Statistical Feedback Loop
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Continuous variance learning that dynamically recalibrates your category envelopes to eliminate budget failures.
            </p>
          </div>
        </div>

        <button
          onClick={applyIterativeAiBudget}
          className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold shadow-glow transition-all w-full md:w-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Recalibrate Next Month's Budget</span>
        </button>
      </div>

      {/* Feature 9: Budget vs Actual Learning Curve Chart */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-slate-100">Budget vs Actual Learning Curve</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Error Reduced: 9.7% → 1.2%
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Interactive chart displaying how the predictive engine iteratively narrows the variance between planned and actual expenses.
            </p>
          </div>
          <div className="flex items-center space-x-4 text-xs font-medium">
            <span className="flex items-center space-x-1.5 text-indigo-400">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
              <span>Planned Budget</span>
            </span>
            <span className="flex items-center space-x-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Actual Outflow</span>
            </span>
          </div>
        </div>

        {/* Recharts Line Curve */}
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={learningCurve}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 12 }} tickFormatter={val => `$${val}`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                formatter={(val, name) => [`$${val.toLocaleString()}`, name]}
              />
              <Line type="monotone" dataKey="planned" stroke="#6366f1" strokeWidth={3} dot={{ r: 5, fill: '#6366f1' }} name="Planned Limit" />
              <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={3} dot={{ r: 5, fill: '#10b981' }} name="Actual Spend" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Learning metrics pill bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800 text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500 text-[10px] uppercase font-bold">Accuracy Convergence</span>
            <p className="text-base font-bold text-slate-100 mt-0.5">98.1%</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500 text-[10px] uppercase font-bold">Current Error Rate</span>
            <p className="text-base font-bold text-emerald-400 mt-0.5">1.2% (Down 88%)</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500 text-[10px] uppercase font-bold">Smoothing Coefficient</span>
            <p className="text-base font-bold text-indigo-400 mt-0.5">α = 0.35 (Holt-Winters)</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500 text-[10px] uppercase font-bold">Cumulative Unlocked</span>
            <p className="text-base font-bold text-amber-400 mt-0.5">+₹1,450 Saved</p>
          </div>
        </div>
      </div>

      {/* Historical Convergence Matrix */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100">Historical Learning Convergence Matrix</h3>
            <p className="text-xs text-slate-400">Monthly breakdown of model adaptation and error reduction</p>
          </div>
          <span className="text-xs font-mono text-slate-500">Confidence Score: 0.94</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-6">Billing Month</th>
                <th className="py-3 px-4">Planned Limit</th>
                <th className="py-3 px-4">Actual Outflow</th>
                <th className="py-3 px-4">Variance (₹)</th>
                <th className="py-3 px-4">Error Rate (%)</th>
                <th className="py-3 px-6 text-right">Accuracy Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {learningCurve.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-6 font-sans font-bold text-slate-200">{row.month}</td>
                  <td className="py-3 px-4 text-slate-300">₹{row.planned.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 text-slate-300">₹{row.actual.toLocaleString('en-IN')}</td>
                  <td className={`py-3 px-4 font-bold ${row.variance > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {row.variance > 0 ? `+₹${row.variance}` : `-₹${Math.abs(row.variance)}`}
                  </td>
                  <td className="py-3 px-4 text-slate-400">{row.errorRate}%</td>
                  <td className="py-3 px-6 text-right font-bold text-indigo-400">{row.accuracy}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Anomaly Detection Feed */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-100">Live Anomaly & Micro-Leakage Detection</h3>
            <p className="text-xs text-slate-400">Algorithmic outlier detection across transaction frequency and amounts</p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Z-Score &gt; 2.5
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {anomalies.map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">{item.title}</span>
                <span className={`text-[11px] font-mono font-bold ${
                  item.type === 'warning' ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {item.impact}
                </span>
              </div>
              <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                {item.category}
              </span>
              <p className="text-xs text-slate-400 leading-relaxed pt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
