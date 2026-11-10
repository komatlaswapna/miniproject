import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Filter,
  Download,
  Upload,
  PlusCircle,
  Trash2,
  Edit2,
  Tag,
  CreditCard,
  Calendar,
  ArrowUpDown,
  CheckCircle2,
  X,
  FileSpreadsheet
} from 'lucide-react';

export default function TransactionsPage({ onOpenAddTx }) {
  const {
    transactions,
    deleteTransaction,
    updateTransaction,
    categories,
    formatCurrency,
    exportTransactionsToCSV,
    importTransactionsCSV,
    addToast
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all'); // 'all' | 'expense' | 'income'
  const [selectedPayment, setSelectedPayment] = useState('all');
  const [editingTx, setEditingTx] = useState(null);

  const fileInputRef = useRef(null);

  // Filtered & Searched data
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchSearch = t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.category_name.toLowerCase().includes(search.toLowerCase());
      const matchCategory = selectedCategory === 'all' || t.category_name === selectedCategory;
      const matchType = selectedType === 'all' || t.type === selectedType;
      const matchPayment = selectedPayment === 'all' || t.payment_method === selectedPayment;
      return matchSearch && matchCategory && matchType && matchPayment;
    });
  }, [transactions, search, selectedCategory, selectedType, selectedPayment]);

  const totalFilteredExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((a, b) => a + Number(b.amount), 0);

  const totalFilteredIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((a, b) => a + Number(b.amount), 0);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        importTransactionsCSV(text);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingTx) return;
    updateTransaction(editingTx.id, {
      description: editingTx.description,
      amount: Number(editingTx.amount),
      category_name: editingTx.category_name,
      payment_method: editingTx.payment_method,
      date: editingTx.date
    });
    setEditingTx(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Controls Bar */}
      <div className="p-5 rounded-3xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-indigo-100 dark:border-indigo-900/40 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search descriptions, merchants..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100/90 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-end">
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Import CSV bank/credit statements"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
              <span>Import CSV</span>
            </button>

            <button
              onClick={exportTransactionsToCSV}
              title="Export all transactions to CSV file"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={onOpenAddTx}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white text-xs font-bold shadow-glow-emerald transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Entry</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-200/80 dark:border-slate-800/80 text-xs">
          <div className="flex items-center space-x-1 text-slate-500 dark:text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span className="font-semibold">Filters:</span>
          </div>

          {/* Type filter */}
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-100/90 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Types</option>
            <option value="expense">Expenses Only</option>
            <option value="income">Incomes Only</option>
          </select>

          {/* Category filter */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-100/90 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>

          {/* Payment filter */}
          <select
            value={selectedPayment}
            onChange={e => setSelectedPayment(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-100/90 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Payment Methods</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Direct Deposit">Direct Deposit</option>
            <option value="UPI">UPI / GPay</option>
            <option value="Apple Pay">Apple Pay</option>
            <option value="Cash">Cash</option>
          </select>

          {(search || selectedCategory !== 'all' || selectedType !== 'all' || selectedPayment !== 'all') && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('all');
                setSelectedType('all');
                setSelectedPayment('all');
              }}
              className="text-xs text-rose-500 hover:underline ml-auto font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Summary strip for current filtered view */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-white/85 to-emerald-500/5 dark:from-emerald-950/40 dark:via-slate-900/80 dark:to-emerald-950/20 border border-emerald-200/80 dark:border-emerald-500/30 shadow-md">
          <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">Total Filtered Inflow</p>
          <p className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">{formatCurrency(totalFilteredIncome)}</p>
        </div>
        <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-500/10 via-white/85 to-rose-500/5 dark:from-rose-950/40 dark:via-slate-900/80 dark:to-rose-950/20 border border-rose-200/80 dark:border-rose-500/30 shadow-md">
          <p className="text-[11px] font-bold uppercase tracking-wide text-rose-700 dark:text-rose-400">Total Filtered Outflow</p>
          <p className="text-xl font-black font-mono text-rose-600 dark:text-rose-400 mt-1">{formatCurrency(totalFilteredExpense)}</p>
        </div>
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-white/85 to-indigo-500/5 dark:from-indigo-950/40 dark:via-slate-900/80 dark:to-indigo-950/20 border border-indigo-200/80 dark:border-indigo-500/30 shadow-md">
          <p className="text-[11px] font-bold uppercase tracking-wide text-indigo-700 dark:text-indigo-400">Net Delta</p>
          <p className="text-xl font-black font-mono text-indigo-600 dark:text-indigo-400 mt-1">{formatCurrency(totalFilteredIncome - totalFilteredExpense)}</p>
        </div>
      </div>

      {/* Transactions Table Box */}
      <div className="rounded-3xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-6">Description / Merchant</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-6 text-right">Amount</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">
                    No transactions match your current search criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center space-x-3">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          tx.type === 'income' ? 'bg-emerald-400' : 'bg-rose-400'
                        }`}></span>
                        <div>
                          <p className="font-bold text-slate-100">{tx.description}</p>
                          {tx.is_recurring && (
                            <span className="text-[10px] text-indigo-400 font-medium">Recurring</span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-medium">
                        {tx.category_name}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 font-mono">
                      {tx.payment_method || 'Card'}
                    </td>

                    <td className="py-3.5 px-4 text-slate-400">
                      {tx.date}
                    </td>

                    <td className="py-3.5 px-6 text-right font-mono font-bold">
                      <span className={tx.type === 'income' ? 'text-emerald-400' : 'text-slate-100'}>
                        {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1 opacity-70 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditingTx(tx)}
                          className="p-1 rounded text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
                          title="Edit transaction"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteTransaction(tx.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                          title="Delete transaction"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between text-xs text-slate-400">
          <span>Showing {filteredTransactions.length} of {transactions.length} total entries</span>
          <span>CSV Format: RFC 4180 Compliant</span>
        </div>
      </div>

      {/* Edit Transaction Modal */}
      {editingTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100">Edit Transaction</h3>
              <button onClick={() => setEditingTx(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 pt-4">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Description</label>
                <input
                  type="text"
                  required
                  value={editingTx.description}
                  onChange={e => setEditingTx({ ...editingTx, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editingTx.amount}
                    onChange={e => setEditingTx({ ...editingTx, amount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={editingTx.date}
                    onChange={e => setEditingTx({ ...editingTx, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Category</label>
                <select
                  value={editingTx.category_name}
                  onChange={e => setEditingTx({ ...editingTx, category_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingTx(null)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
