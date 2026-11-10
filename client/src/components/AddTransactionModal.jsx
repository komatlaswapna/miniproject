import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PlusCircle, X, DollarSign, Calendar, Tag, CreditCard, RefreshCw } from 'lucide-react';

export default function AddTransactionModal({ isOpen, onClose }) {
  const { categories, addTransaction, addToast } = useApp();

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category_name: 'Food & Dining',
    payment_method: 'Credit Card',
    date: new Date().toISOString().split('T')[0],
    is_recurring: false,
    recurring_frequency: 'monthly'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || Number(formData.amount) <= 0) {
      addToast('Please enter a valid amount', 'error');
      return;
    }
    if (!formData.description.trim()) {
      addToast('Please enter a description or merchant name', 'error');
      return;
    }

    addTransaction(formData);
    addToast(`${formData.type === 'income' ? 'Income' : 'Expense'} recorded: ${formData.description}`, 'success');
    onClose();
    // Reset form
    setFormData({
      description: '',
      amount: '',
      type: 'expense',
      category_name: 'Food & Dining',
      payment_method: 'Credit Card',
      date: new Date().toISOString().split('T')[0],
      is_recurring: false,
      recurring_frequency: 'monthly'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md rounded-3xl bg-violet-100 border border-violet-200 p-6 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-violet-200">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Add Transaction</h3>
              <p className="text-xs text-slate-600">Record an income or expense entry</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-violet-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* Type Toggle: Expense vs Income */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-violet-200/70 border border-violet-200">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'expense', category_name: 'Food & Dining' })}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                formData.type === 'expense'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Expense (-)
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'income', category_name: 'Salary & Income' })}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                formData.type === 'income'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Income (+)
            </button>
          </div>

          {/* Amount & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">Amount (₹)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-500 font-bold text-sm">₹</span>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={e => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-violet-50 border border-violet-200 text-slate-900 placeholder:text-slate-400 text-base font-bold focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-violet-50 border border-violet-200 text-slate-900 text-xs focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-medium text-slate-700 mb-1">Merchant / Description</label>
            <input
              type="text"
              required
              placeholder="e.g. Trader Joe's, Uber, Client Wire"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-violet-50 border border-violet-200 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:border-violet-500"
            />
          </div>

          {/* Category & Payment Method */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">Category</label>
              <select
                value={formData.category_name}
                onChange={e => setFormData({ ...formData, category_name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-violet-50 border border-violet-200 text-slate-900 text-xs focus:outline-none focus:border-violet-500"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">Payment Method</label>
              <select
                value={formData.payment_method}
                onChange={e => setFormData({ ...formData, payment_method: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-violet-50 border border-violet-200 text-slate-900 text-xs focus:outline-none focus:border-violet-500"
              >
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Direct Deposit">Direct Deposit / Wire</option>
                <option value="UPI">UPI / GPay</option>
                <option value="Cash">Cash</option>
                <option value="Net Banking">Net Banking</option>
              </select>
            </div>
          </div>

          {/* Recurring Toggle */}
          <div className="p-3 rounded-xl bg-violet-200/60 border border-violet-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4 text-indigo-400" />
              <div>
                <p className="text-xs font-medium text-slate-800">Recurring Transaction</p>
                <p className="text-[10px] text-slate-600">Auto-repeat periodically</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={formData.is_recurring}
              onChange={e => setFormData({ ...formData, is_recurring: e.target.checked })}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-0 bg-violet-50 border-violet-300 cursor-pointer"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-violet-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-glow-emerald transition-all"
            >
              Save Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
