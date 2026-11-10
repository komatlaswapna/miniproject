import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  PlusCircle,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  Receipt,
  UserCheck,
  Split,
  Calendar,
  X,
  CreditCard
} from 'lucide-react';

export default function SharedBudgetsPage() {
  const { sharedGroups, addSharedExpense, formatCurrency, addToast } = useApp();

  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);

  const activeGroup = sharedGroups[activeGroupIndex] || sharedGroups[0];

  const [newSharedExpense, setNewSharedExpense] = useState({
    title: '',
    amount: '',
    category: 'Utilities & Bills',
    paid_by: activeGroup?.members[0]?.id || 'usr-1',
    date: new Date().toISOString().split('T')[0]
  });

  // Calculate Member Balances & Simplified Settlement Debts
  const { memberBalances, settlements, totalGroupSpend } = useMemo(() => {
    if (!activeGroup) return { memberBalances: {}, settlements: [], totalGroupSpend: 0 };

    const balances = {};
    activeGroup.members.forEach(m => { balances[m.id] = 0; });

    let totalSpend = 0;

    activeGroup.expenses.forEach(exp => {
      const amt = Number(exp.amount || 0);
      totalSpend += amt;
      balances[exp.paid_by] = (balances[exp.paid_by] || 0) + amt;

      const splitCount = activeGroup.members.length || 1;
      const perPerson = amt / splitCount;

      activeGroup.members.forEach(m => {
        balances[m.id] = (balances[m.id] || 0) - perPerson;
      });
    });

    // Greedy Debt Simplification
    const debtors = [];
    const creditors = [];

    for (const [id, bal] of Object.entries(balances)) {
      const rounded = Math.round(bal * 100) / 100;
      if (rounded < -0.01) debtors.push({ id, amount: Math.abs(rounded) });
      else if (rounded > 0.01) creditors.push({ id, amount: rounded });
    }

    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);

    const simplified = [];
    let d = 0, c = 0;
    while (d < debtors.length && c < creditors.length) {
      const debtor = debtors[d];
      const creditor = creditors[c];
      const settleAmount = Math.min(debtor.amount, creditor.amount);

      if (settleAmount > 0.01) {
        const debtorMember = activeGroup.members.find(m => m.id === debtor.id);
        const creditorMember = activeGroup.members.find(m => m.id === creditor.id);
        simplified.push({
          from: debtorMember?.name || debtor.id,
          to: creditorMember?.name || creditor.id,
          amount: Number(settleAmount.toFixed(2))
        });
      }

      debtor.amount -= settleAmount;
      creditor.amount -= settleAmount;

      if (debtor.amount <= 0.01) d++;
      if (creditor.amount <= 0.01) c++;
    }

    return {
      memberBalances: balances,
      settlements: simplified,
      totalGroupSpend: totalSpend
    };
  }, [activeGroup]);

  const handleCreateSharedExpense = (e) => {
    e.preventDefault();
    if (!newSharedExpense.title.trim() || !newSharedExpense.amount) {
      addToast('Please specify expense title and amount', 'error');
      return;
    }

    addSharedExpense(activeGroup.id, {
      title: newSharedExpense.title,
      amount: Number(newSharedExpense.amount),
      category: newSharedExpense.category,
      paid_by: newSharedExpense.paid_by,
      date: newSharedExpense.date,
      splits: activeGroup.members.map(m => ({
        user_id: m.id,
        amount: Number(newSharedExpense.amount) / activeGroup.members.length,
        is_paid: m.id === newSharedExpense.paid_by
      }))
    });

    setIsAddExpenseModalOpen(false);
    setNewSharedExpense({
      title: '',
      amount: '',
      category: 'Utilities & Bills',
      paid_by: activeGroup.members[0]?.id || 'usr-1',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleSettleUpAction = (settle) => {
    addToast(`Settlement recorded: ${settle.from} paid ${formatCurrency(settle.amount)} to ${settle.to}!`, 'success');
  };

  if (!activeGroup) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-teal-100 dark:border-teal-900/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{activeGroup.name}</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-700 dark:text-teal-300">
                Debt Simplification Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {activeGroup.description} • {activeGroup.members.length} Authorized Members
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddExpenseModalOpen(true)}
          className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:opacity-95 text-white text-xs font-bold shadow-glow-emerald transition-all w-full md:w-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Shared Expense</span>
        </button>
      </div>

      {/* Simplified Settlement Center Box */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-500/10 via-white/85 to-indigo-500/10 dark:from-teal-950/40 dark:via-slate-900/80 dark:to-indigo-950/40 border border-teal-200/80 dark:border-teal-500/30 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Split className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Minimal Debt Settlements (Who Owes Whom)</h3>
          </div>
          <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-400">
            Total Group Spend: {formatCurrency(totalGroupSpend)}
          </span>
        </div>

        {settlements.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 rounded-2xl bg-slate-950/40 border border-slate-800">
            All shared balances are settled! Nobody owes anyone in this group. 🥂
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {settlements.map((s, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-300">
                    <span className="font-bold text-slate-100">{s.from}</span> owes <span className="font-bold text-teal-300">{s.to}</span>
                  </p>
                  <p className="text-lg font-mono font-bold text-emerald-400 mt-0.5">
                    {formatCurrency(s.amount)}
                  </p>
                </div>
                <button
                  onClick={() => handleSettleUpAction(s)}
                  className="px-3 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold transition-colors"
                >
                  Settle Up
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Members Balances Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {activeGroup.members.map(member => {
          const bal = memberBalances[member.id] || 0;
          const isCreditor = bal > 0.01;
          const isDebtor = bal < -0.01;

          return (
            <div key={member.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex items-center space-x-3.5">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-12 h-12 rounded-2xl object-cover border border-slate-700"
              />
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-200 truncate">{member.name}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">{member.role}</p>
                <p className={`text-sm font-mono font-bold mt-1 ${
                  isCreditor ? 'text-emerald-400' : isDebtor ? 'text-rose-400' : 'text-slate-400'
                }`}>
                  {isCreditor ? `+${formatCurrency(bal)}` : isDebtor ? `-${formatCurrency(Math.abs(bal))}` : '₹0.00 settled'}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Shared Expenses Ledger */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Receipt className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-100">Group Expense Ledger</h3>
          </div>
          <span className="text-xs text-slate-500">{activeGroup.expenses.length} Split Entries</span>
        </div>

        <div className="divide-y divide-slate-800/60">
          {activeGroup.expenses.map(exp => {
            const payer = activeGroup.members.find(m => m.id === exp.paid_by);
            return (
              <div key={exp.id} className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-slate-800 text-teal-400">
                    <Receipt className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-100">{exp.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Paid by <span className="text-slate-200 font-semibold">{payer?.name || exp.paid_by}</span> • {exp.date} • {exp.category}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono font-bold text-slate-100">{formatCurrency(exp.amount)}</p>
                  <p className="text-[10px] text-teal-400">
                    {formatCurrency(exp.amount / activeGroup.members.length)} / person
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Shared Expense Modal */}
      {isAddExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100">Add Shared Group Expense</h3>
              <button onClick={() => setIsAddExpenseModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSharedExpense} className="space-y-4 pt-4">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Expense Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fiber Wi-Fi, Water Bill, Groceries"
                  value={newSharedExpense.title}
                  onChange={e => setNewSharedExpense({ ...newSharedExpense, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Total Bill Amount (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="90.00"
                    value={newSharedExpense.amount}
                    onChange={e => setNewSharedExpense({ ...newSharedExpense, amount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm font-bold font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Who Paid?</label>
                  <select
                    value={newSharedExpense.paid_by}
                    onChange={e => setNewSharedExpense({ ...newSharedExpense, paid_by: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-teal-500"
                  >
                    {activeGroup.members.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Category</label>
                  <select
                    value={newSharedExpense.category}
                    onChange={e => setNewSharedExpense({ ...newSharedExpense, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-teal-500"
                  >
                    <option value="Utilities & Bills">Utilities & Bills</option>
                    <option value="Housing & Rent">Housing & Rent</option>
                    <option value="Food & Dining">Groceries & Dining</option>
                    <option value="Shopping">Household Supplies</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newSharedExpense.date}
                    onChange={e => setNewSharedExpense({ ...newSharedExpense, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 text-[11px] text-slate-400">
                Split Type: <span className="text-teal-300 font-semibold">Equal 3-Way Split</span> ({formatCurrency(Number(newSharedExpense.amount || 0) / activeGroup.members.length)} / member)
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-glow-emerald"
                >
                  Save & Split
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
