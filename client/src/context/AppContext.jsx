import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import {
  INITIAL_CATEGORIES,
  INITIAL_TRANSACTIONS,
  INITIAL_BUDGETS,
  INITIAL_SAVINGS_GOALS,
  INITIAL_RECURRING_RULES,
  INITIAL_SHARED_GROUPS,
  INITIAL_BADGES,
  INITIAL_LEARNING_CURVE
} from '../data/mockData';

const AppContext = createContext();

const LOCAL_STORAGE_KEY = 'smartspend_state_v1';
const CURRENT_VIEW_KEY = `${LOCAL_STORAGE_KEY}_current_view`;
const VALID_VIEWS = new Set([
  'landing',
  'auth',
  'dashboard',
  'transactions',
  'receipts',
  'budgets',
  'goals',
  'what-if',
  'shared',
  'notifications',
  'reports',
  'settings'
]);

export function AppProvider({ children }) {
  // Navigation & View state
  const [currentView, setCurrentView] = useState(() => {
    const savedView = localStorage.getItem(CURRENT_VIEW_KEY);
    return VALID_VIEWS.has(savedView) ? savedView : 'landing';
  });
  const navigateToView = (view) => {
    if (!VALID_VIEWS.has(view)) return;
    localStorage.setItem(CURRENT_VIEW_KEY, view);
    setCurrentView(view);
  };
  const [darkMode, setDarkMode] = useState(false);

  // User Profile
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_user`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      id: null,
      email: '',
      full_name: '',
      role_title: 'Member',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      currency: 'INR',
      currencySymbol: '₹',
      monthly_income: 0,
      points: 100,
      streak_count: 1,
      level: 1,
      isAuthenticated: false
    };
  });

  // State collections (Per-user isolated)
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [transactions, setTransactions] = useState([]);
  const [loadedUserDataId, setLoadedUserDataId] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [recurringRules, setRecurringRules] = useState([]);
  const [sharedGroups, setSharedGroups] = useState([]);
  const [badges, setBadges] = useState(INITIAL_BADGES);
  const [learningCurve, setLearningCurve] = useState(INITIAL_LEARNING_CURVE);
  const [notifications, setNotifications] = useState([]);

  // Helper to get storage key for user
  const getUserDataStorageKey = (userId) => `smartspend_user_data_${userId || 'guest'}`;

  // Hydrate per-user data when user changes
  useEffect(() => {
    let isCurrentUser = true;
    setLoadedUserDataId(null);

    if (!user?.isAuthenticated || !user?.id) {
      // Clear data if not authenticated
      setTransactions([]);
      setBudgets([]);
      setSavingsGoals([]);
      setRecurringRules([]);
      setSharedGroups([]);
      setNotifications([]);
      return () => {
        isCurrentUser = false;
      };
    }

    const loadData = async () => {
      // Check if user is one of demo users who should have sample data
      const isDemoUser = user.email?.includes('demo') || user.email === 'alex.rivera@smartspend.ai' || user.id === 'usr-demo-01';

      // 1. Try to fetch from server database
      try {
        const res = await fetch(`/api/user-data/${user.id}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            const d = json.data;
            if (!isCurrentUser) return;
            setTransactions(d.transactions || []);
            setBudgets(d.budgets || []);
            setSavingsGoals(d.savingsGoals || []);
            setRecurringRules(d.recurringRules || []);
            setSharedGroups(d.sharedGroups || []);
            setNotifications(d.notifications || []);
            setLoadedUserDataId(user.id);
            return;
          }
        }
      } catch (err) {
        // Fall through to localStorage
      }

      // 2. Fallback to localStorage per-user key
      const localSaved = localStorage.getItem(getUserDataStorageKey(user.id));
      if (localSaved) {
        try {
          const parsed = JSON.parse(localSaved);
          if (!isCurrentUser) return;
          setTransactions(parsed.transactions || []);
          setBudgets(parsed.budgets || []);
          setSavingsGoals(parsed.savingsGoals || []);
          setRecurringRules(parsed.recurringRules || []);
          setSharedGroups(parsed.sharedGroups || []);
          setNotifications(parsed.notifications || []);
          setLoadedUserDataId(user.id);
          return;
        } catch (e) {}
      }

      if (!isCurrentUser) return;

      // 3. If demo user, load demo data; if newly registered real user, start COMPLETELY FRESH & EMPTY!
      if (isDemoUser) {
        setTransactions(INITIAL_TRANSACTIONS);
        setBudgets(INITIAL_BUDGETS);
        setSavingsGoals(INITIAL_SAVINGS_GOALS);
        setRecurringRules(INITIAL_RECURRING_RULES);
        setSharedGroups(INITIAL_SHARED_GROUPS);
        setNotifications([
          {
            id: 'notif-1',
            title: '⚠️ Food & Dining Reached 80%',
            message: 'You have spent ₹12,000 of your ₹15,000 limit.',
            type: 'warning',
            channel: 'app',
            timestamp: '2 hours ago',
            is_read: false
          }
        ]);
      } else {
        // New user has completely empty fresh data!
        setTransactions([]);
        setBudgets([]);
        setSavingsGoals([]);
        setRecurringRules([]);
        setSharedGroups([]);
        setNotifications([
          {
            id: `notif-welcome-${Date.now()}`,
            title: '🎉 Welcome to SmartSpend AI!',
            message: 'Your account is ready and clean. Start by adding your first income or expense!',
            type: 'streak',
            channel: 'app',
            timestamp: 'Just now',
            is_read: false
          }
        ]);
      }

      setLoadedUserDataId(user.id);
    };

    loadData();

    return () => {
      isCurrentUser = false;
    };
  }, [user?.id, user?.isAuthenticated]);

  // Sync active user to localStorage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_user`, JSON.stringify(user));
  }, [user]);

  // Sync user data to localStorage & server whenever it updates
  useEffect(() => {
    if (!user?.isAuthenticated || !user?.id || loadedUserDataId !== user.id) return;

    const payload = {
      transactions,
      budgets,
      savingsGoals,
      recurringRules,
      sharedGroups,
      notifications
    };

    // Save to local storage under user-specific key
    localStorage.setItem(getUserDataStorageKey(user.id), JSON.stringify(payload));

    // Try background sync to server
    fetch(`/api/user-data/${user.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(() => {});
  }, [user?.id, user?.isAuthenticated, loadedUserDataId, transactions, budgets, savingsGoals, recurringRules, sharedGroups, notifications]);

  // Toast System
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Update budget limit helper
  const updateBudget = (categoryName, newAmount) => {
    setBudgets(prev => {
      const exists = prev.some(b => b.category_name === categoryName);
      if (exists) {
        return prev.map(b => b.category_name === categoryName ? { ...b, planned_amount: Number(newAmount) } : b);
      }
      return [...prev, { id: `b-${Date.now()}`, category_name: categoryName, planned_amount: Number(newAmount), color: '#3b82f6' }];
    });
    addToast(`Budget saved for ${categoryName}: ${formatCurrency(newAmount)}`, 'success');
  };

  // Dark mode effect
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [darkMode]);

  // Supabase Initial Hydration if configured
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const fetchSupabaseData = async () => {
      try {
        const { data: txData, error: txError } = await supabase
          .from('transactions')
          .select('*')
          .order('date', { ascending: false });

        if (!txError && txData && txData.length > 0) {
          setTransactions(txData);
        }

        const { data: bgData, error: bgError } = await supabase
          .from('budgets')
          .select('*');

        if (!bgError && bgData && bgData.length > 0) {
          setBudgets(bgData);
        }

        const { data: sgData, error: sgError } = await supabase
          .from('savings_goals')
          .select('*');

        if (!sgError && sgData && sgData.length > 0) {
          setSavingsGoals(sgData);
        }
      } catch (err) {
        console.warn('Supabase fetch error, maintaining local state:', err);
      }
    };

    fetchSupabaseData();
  }, []);

  // Currency helper
  const formatCurrency = (amount) => {
    const symbol = user?.currencySymbol || '₹';
    return `${symbol}${Number(amount || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  // Award Points & Gamification
  const awardPoints = (pointsToAdd, reason = 'Action Completed') => {
    setUser(prev => {
      const newPoints = prev.points + pointsToAdd;
      const newLevel = Math.floor(newPoints / 200) + 1;
      return {
        ...prev,
        points: newPoints,
        level: newLevel
      };
    });
    addToast(`+${pointsToAdd} XP: ${reason}! 🌟`, 'success');
  };

  // Add Transaction (Synced with Supabase & Local)
  const addTransaction = async (newTx) => {
    const transaction = {
      ...newTx,
      id: `tx-${Date.now()}`,
      amount: Number(newTx.amount),
      date: newTx.date || new Date().toISOString().split('T')[0]
    };

    setTransactions(prev => [transaction, ...prev]);
    awardPoints(15, 'Transaction Logged');

    // Sync to Supabase if live
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('transactions').insert([
          {
            user_id: user.id || 'usr-demo-01',
            description: transaction.description,
            amount: transaction.amount,
            type: transaction.type,
            category_name: transaction.category_name,
            payment_method: transaction.payment_method,
            date: transaction.date,
            is_recurring: Boolean(transaction.is_recurring),
            raw_ocr_text: transaction.raw_ocr_text || null
          }
        ]);
      } catch (err) {
        console.warn('Supabase insert failed, stored locally:', err);
      }
    }

    // Check budget thresholds if it's an expense
    if (transaction.type === 'expense') {
      checkBudgetBreach(transaction.category_name, transaction.amount);
    }
  };

  const updateTransaction = async (id, updatedFields) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updatedFields } : t));
    addToast('Transaction updated successfully', 'success');

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('transactions').update(updatedFields).eq('id', id);
      } catch (err) {
        console.warn('Supabase update failed:', err);
      }
    }
  };

  const deleteTransaction = async (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    addToast('Transaction deleted', 'info');

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('transactions').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete failed:', err);
      }
    }
  };

  // Budget Breach checker
  const checkBudgetBreach = (categoryName, recentAmount) => {
    const budget = budgets.find(b => b.category_name === categoryName);
    if (!budget) return;

    // Calculate current month total
    const totalSpent = transactions
      .filter(t => t.type === 'expense' && t.category_name === categoryName)
      .reduce((acc, t) => acc + Number(t.amount), 0) + Number(recentAmount);

    const ratio = totalSpent / budget.planned_amount;

    if (ratio >= 1.0) {
      const breachNotif = {
        id: `notif-${Date.now()}`,
        title: `🚨 100% Limit Breach: ${categoryName}`,
        message: `Total spend reached ${formatCurrency(totalSpent)} against your limit of ${formatCurrency(budget.planned_amount)}. SmartSpend alert triggered!`,
        type: 'alert',
        channel: user.telegram_alerts_enabled ? 'telegram' : 'app',
        timestamp: 'Just now',
        is_read: false
      };
      setNotifications(prev => [breachNotif, ...prev]);
      addToast(`Budget Limit Reached for ${categoryName}! Check alerts.`, 'warning');
    } else if (ratio >= 0.80) {
      const warnNotif = {
        id: `notif-${Date.now()}`,
        title: `⚠️ 80% Threshold Warning: ${categoryName}`,
        message: `You have spent ${formatCurrency(totalSpent)} of your ${formatCurrency(budget.planned_amount)} budget (${Math.round(ratio * 100)}%).`,
        type: 'warning',
        channel: user.telegram_alerts_enabled ? 'telegram' : 'app',
        timestamp: 'Just now',
        is_read: false
      };
      setNotifications(prev => [warnNotif, ...prev]);
    }
  };

  // Apply Iterative AI Budget
  const applyIterativeAiBudget = async () => {
    // Call server API or perform high-accuracy mathematical adaptation
    try {
      const response = await fetch('/api/iterative-budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentBudgets: budgets.map(b => {
            const actual = transactions
              .filter(t => t.type === 'expense' && t.category_name === b.category_name)
              .reduce((acc, t) => acc + Number(t.amount), 0);
            return { ...b, actual_amount: actual };
          })
        })
      });

      if (response.ok) {
        const data = await response.json();
        setBudgets(prev => prev.map(b => {
          const rec = data.recommendations.find(r => r.category_name === b.category_name);
          return rec ? {
            ...b,
            planned_amount: rec.ai_recommended_amount,
            ai_recommended_amount: rec.ai_recommended_amount,
            is_iterative_applied: true,
            confidence_score: rec.confidence_score
          } : b;
        }));
        confetti({ particleCount: 30, spread: 45, origin: { y: 0.65 }, ticks: 120 });
        awardPoints(50, 'Iterative Budget Engine Optimization Applied');
        addToast(`SmartSpend AI adjusted your budgets! Unlocked ${formatCurrency(data.summary.net_savings_unlocked)} monthly savings surplus.`, 'success');
        return;
      }
    } catch (err) {
      console.warn('Backend iterative API unreachable, using local iterative engine calculation', err);
    }

    // Local calculation fallback
    setBudgets(prev => prev.map(b => {
      const spent = transactions
        .filter(t => t.type === 'expense' && t.category_name === b.category_name)
        .reduce((acc, t) => acc + Number(t.amount), 0);
      const variance = spent - b.planned_amount;
      const optimized = Math.max(50, Math.round((b.planned_amount + variance * 0.4) / 10) * 10);
      return {
        ...b,
        planned_amount: optimized,
        is_iterative_applied: true
      };
    }));
    confetti({ particleCount: 25, spread: 40, ticks: 100 });
    awardPoints(40, 'Iterative AI Budget Refinement');
    addToast('Budgets dynamically refined with past spending variance!', 'success');
  };

  // Savings Goals actions
  const addSavingsGoal = (goal) => {
    const newGoal = {
      ...goal,
      id: `goal-${Date.now()}`,
      current_amount: Number(goal.current_amount || 0),
      target_amount: Number(goal.target_amount)
    };
    setSavingsGoals(prev => [...prev, newGoal]);
    awardPoints(25, 'New Savings Goal Created');
  };

  const depositToGoal = (id, amount) => {
    const numAmount = Number(amount);
    let reachedTarget = false;

    setSavingsGoals(prev => prev.map(g => {
      if (g.id === id) {
        const updated = g.current_amount + numAmount;
        if (updated >= g.target_amount && g.current_amount < g.target_amount) {
          reachedTarget = true;
        }
        return { ...g, current_amount: updated };
      }
      return g;
    }));

    if (reachedTarget) {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 }, ticks: 150 });
      awardPoints(100, '🏆 Savings Goal Reached!');
      addToast('CONGRATULATIONS! You hit 100% of your savings goal! 🎉', 'success');
    } else {
      awardPoints(20, 'Savings Deposit Logged');
      addToast(`Deposited ${formatCurrency(numAmount)} to goal!`, 'success');
    }
  };

  // Shared Expense
  const addSharedExpense = (groupId, expenseData) => {
    setSharedGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        const newExpense = {
          ...expenseData,
          id: `sexp-${Date.now()}`,
          date: expenseData.date || new Date().toISOString().split('T')[0]
        };
        return {
          ...g,
          expenses: [newExpense, ...g.expenses]
        };
      }
      return g;
    }));
    awardPoints(25, 'Shared Group Expense Added');
    addToast('Shared expense split recorded among group members', 'success');
  };

  // Recurring confirmation
  const toggleAutoAddRecurring = (id) => {
    setRecurringRules(prev => prev.map(r => r.id === id ? { ...r, auto_add: !r.auto_add } : r));
    addToast('Recurring auto-entry preference updated', 'info');
  };

  const confirmRecurring = (id) => {
    setRecurringRules(prev => prev.map(r => r.id === id ? { ...r, is_confirmed: true } : r));
    awardPoints(15, 'Confirmed Recurring Rule');
    addToast('Recurring subscription confirmed', 'success');
  };

  // CSV Import / Export
  const exportTransactionsToCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount', 'Payment Method', 'Recurring'];
    const rows = transactions.map(t => [
      t.date,
      `"${t.description.replace(/"/g, '""')}"`,
      `"${t.category_name}"`,
      t.type,
      t.amount,
      `"${t.payment_method || ''}"`,
      t.is_recurring ? 'Yes' : 'No'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smartspend_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Transactions exported to CSV successfully', 'success');
  };

  const importTransactionsCSV = (csvText) => {
    try {
      const lines = csvText.split(/\r\n|\n/).filter(l => l.trim().length > 0);
      if (lines.length <= 1) throw new Error('File contains no transaction data');

      const parsedTransactions = [];
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map(s => s.trim().replace(/^"|"$/g, ''));
        if (parts.length >= 4) {
          parsedTransactions.push({
            id: `csv-${Date.now()}-${i}`,
            date: parts[0] || new Date().toISOString().split('T')[0],
            description: parts[1] || 'Imported Entry',
            category_name: parts[2] || 'Shopping',
            type: (parts[3] || 'expense').toLowerCase().includes('income') ? 'income' : 'expense',
            amount: parseFloat(parts[4]) || 10,
            payment_method: parts[5] || 'Credit Card',
            is_recurring: (parts[6] || '').toLowerCase() === 'yes'
          });
        }
      }

      setTransactions(prev => [...parsedTransactions, ...prev]);
      awardPoints(40, `Imported ${parsedTransactions.length} Transactions`);
      addToast(`Successfully imported ${parsedTransactions.length} transactions from CSV!`, 'success');
    } catch (err) {
      addToast(`Failed to parse CSV: ${err.message}`, 'error');
    }
  };

  // Reset demo data
  const resetToSampleData = () => {
    setTransactions(INITIAL_TRANSACTIONS);
    setBudgets(INITIAL_BUDGETS);
    setSavingsGoals(INITIAL_SAVINGS_GOALS);
    setRecurringRules(INITIAL_RECURRING_RULES);
    setSharedGroups(INITIAL_SHARED_GROUPS);
    setBadges(INITIAL_BADGES);
    addToast('Demo dataset refreshed to default state', 'info');
  };

  // Sign out user
  const logout = () => {
    setUser(prev => {
      const updated = { ...prev, isAuthenticated: false };
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_user`, JSON.stringify(updated));
      return updated;
    });
    setCurrentView('landing');
    addToast('You have been signed out successfully.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView: navigateToView,
        darkMode,
        setDarkMode,
        user,
        setUser,
        logout,
        categories,
        transactions,
        budgets,
        savingsGoals,
        recurringRules,
        sharedGroups,
        badges,
        learningCurve,
        notifications,
        toasts,
        formatCurrency,
        addToast,
        removeToast,
        awardPoints,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        updateBudget,
        applyIterativeAiBudget,
        addSavingsGoal,
        depositToGoal,
        addSharedExpense,
        toggleAutoAddRecurring,
        confirmRecurring,
        exportTransactionsToCSV,
        importTransactionsCSV,
        resetToSampleData,
        isSupabaseConfigured
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
