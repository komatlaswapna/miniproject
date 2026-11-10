// Seed & mock data for SmartSpend AI matching the modern glassmorphic dashboard

export const INITIAL_CATEGORIES = [
  { id: 'cat-1', name: 'Food & Dining', icon: 'Utensils', color: '#06b6d4', type: 'expense' },
  { id: 'cat-2', name: 'Shopping', icon: 'ShoppingBag', color: '#3b82f6', type: 'expense' },
  { id: 'cat-3', name: 'Travel', icon: 'Plane', color: '#a855f7', type: 'expense' },
  { id: 'cat-4', name: 'Bills & Utilities', icon: 'FileText', color: '#f59e0b', type: 'expense' },
  { id: 'cat-5', name: 'Housing & Rent', icon: 'Home', color: '#6366f1', type: 'expense' },
  { id: 'cat-6', name: 'Entertainment', icon: 'Film', color: '#ec4899', type: 'expense' },
  { id: 'cat-7', name: 'Healthcare', icon: 'HeartPulse', color: '#ef4444', type: 'expense' },
  { id: 'cat-8', name: 'Investment & Savings', icon: 'TrendingUp', color: '#10b981', type: 'expense' },
  { id: 'cat-9', name: 'Salary & Income', icon: 'Wallet', color: '#22c55e', type: 'income' },
];

export const INITIAL_TRANSACTIONS = [
  {
    id: 'tx-101',
    description: 'Swiggy Food Order',
    amount: 320,
    type: 'expense',
    category_name: 'Food & Dining',
    date: '2025-04-28',
    payment_method: 'UPI',
    is_recurring: false,
    receipt_url: null
  },
  {
    id: 'tx-102',
    description: 'Electricity Bill',
    amount: 1250,
    type: 'expense',
    category_name: 'Bills & Utilities',
    date: '2025-04-27',
    payment_method: 'Net Banking',
    is_recurring: true,
    recurring_frequency: 'monthly',
    receipt_url: null
  },
  {
    id: 'tx-103',
    description: 'Amazon Shopping',
    amount: 2460,
    type: 'expense',
    category_name: 'Shopping',
    date: '2025-04-26',
    payment_method: 'Credit Card',
    is_recurring: false,
    receipt_url: null
  },
  {
    id: 'tx-104',
    description: 'Salary Credit',
    amount: 45000,
    type: 'income',
    category_name: 'Salary & Income',
    date: '2025-04-25',
    payment_method: 'Direct Deposit',
    is_recurring: true,
    recurring_frequency: 'monthly',
    receipt_url: null
  },
  {
    id: 'tx-105',
    description: 'Freelance Design Payment',
    amount: 33500,
    type: 'income',
    category_name: 'Salary & Income',
    date: '2025-04-10',
    payment_method: 'Wire Transfer',
    is_recurring: false,
    receipt_url: null
  },
  {
    id: 'tx-106',
    description: 'Apartment Maintenance & Rent',
    amount: 28500,
    type: 'expense',
    category_name: 'Housing & Rent',
    date: '2025-04-02',
    payment_method: 'Bank Transfer',
    is_recurring: true,
    recurring_frequency: 'monthly',
    receipt_url: null
  },
  {
    id: 'tx-107',
    description: 'Airtel Broadband Wi-Fi',
    amount: 999,
    type: 'expense',
    category_name: 'Bills & Utilities',
    date: '2025-04-05',
    payment_method: 'UPI',
    is_recurring: true,
    recurring_frequency: 'monthly',
    receipt_url: null
  },
  {
    id: 'tx-108',
    description: 'Flight Booking to Goa',
    amount: 5200,
    type: 'expense',
    category_name: 'Travel',
    date: '2025-04-14',
    payment_method: 'Credit Card',
    is_recurring: false,
    receipt_url: null
  }
];

export const INITIAL_BUDGETS = [
  {
    id: 'bg-1',
    category_name: 'Food & Dining',
    planned_amount: 15000,
    actual_amount: 12000,
    month: '2025-04',
    color: '#06b6d4',
    percentage: 80,
    ai_recommended_amount: 12500,
    confidence_score: 0.94
  },
  {
    id: 'bg-2',
    category_name: 'Shopping',
    planned_amount: 10000,
    actual_amount: 7500,
    month: '2025-04',
    color: '#3b82f6',
    percentage: 75,
    ai_recommended_amount: 8000,
    confidence_score: 0.91
  },
  {
    id: 'bg-3',
    category_name: 'Travel',
    planned_amount: 8000,
    actual_amount: 5200,
    month: '2025-04',
    color: '#a855f7',
    percentage: 65,
    ai_recommended_amount: 7000,
    confidence_score: 0.88
  },
  {
    id: 'bg-4',
    category_name: 'Bills & Utilities',
    planned_amount: 12000,
    actual_amount: 8100,
    month: '2025-04',
    color: '#f59e0b',
    percentage: 68,
    ai_recommended_amount: 9500,
    confidence_score: 0.95
  },
  {
    id: 'bg-5',
    category_name: 'Housing & Rent',
    planned_amount: 30000,
    actual_amount: 28500,
    month: '2025-04',
    color: '#6366f1',
    percentage: 95,
    ai_recommended_amount: 29000,
    confidence_score: 0.98
  }
];

export const INITIAL_SAVINGS_GOALS = [
  {
    id: 'goal-1',
    title: 'Holiday Trip - Goa',
    target_amount: 30000,
    current_amount: 12800,
    target_date: '2025-06-30',
    icon: 'Palmtree',
    color: '#10b981',
    status: 'active'
  },
  {
    id: 'goal-2',
    title: 'Emergency Rainy Day Reserve',
    target_amount: 100000,
    current_amount: 65000,
    target_date: '2025-12-31',
    icon: 'ShieldCheck',
    color: '#6366f1',
    status: 'active'
  },
  {
    id: 'goal-3',
    title: 'MacBook Pro M3 Max',
    target_amount: 180000,
    current_amount: 92000,
    target_date: '2025-09-15',
    icon: 'Laptop',
    color: '#a855f7',
    status: 'active'
  }
];

export const INITIAL_RECURRING_RULES = [
  {
    id: 'rec-1',
    merchant_name: 'Apartment Maintenance & Rent',
    estimated_amount: 28500,
    category_name: 'Housing & Rent',
    frequency: 'monthly',
    due_day: 2,
    next_due_date: '2025-05-02',
    confidence_score: 0.99,
    auto_add: true,
    is_confirmed: true
  },
  {
    id: 'rec-2',
    merchant_name: 'Electricity & Power Utility',
    estimated_amount: 1250,
    category_name: 'Bills & Utilities',
    frequency: 'monthly',
    due_day: 27,
    next_due_date: '2025-05-27',
    confidence_score: 0.96,
    auto_add: true,
    is_confirmed: true
  },
  {
    id: 'rec-3',
    merchant_name: 'Airtel Gigabit Broadband',
    estimated_amount: 999,
    category_name: 'Bills & Utilities',
    frequency: 'monthly',
    due_day: 5,
    next_due_date: '2025-05-05',
    confidence_score: 0.97,
    auto_add: true,
    is_confirmed: true
  },
  {
    id: 'rec-4',
    merchant_name: 'Netflix 4K Ultra Plan',
    estimated_amount: 649,
    category_name: 'Entertainment',
    frequency: 'monthly',
    due_day: 15,
    next_due_date: '2025-05-15',
    confidence_score: 0.95,
    auto_add: false,
    is_confirmed: true
  }
];

export const INITIAL_SHARED_GROUPS = [
  {
    id: 'grp-1',
    name: 'Flat 402 - Roommates',
    description: 'Shared rent, highspeed Wi-Fi, electricity, DTH, and groceries',
    created_by: 'usr-1',
    members: [
      { id: 'usr-1', name: 'Alex Kumar (You)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', role: 'admin' },
      { id: 'usr-2', name: 'Jordan Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', role: 'member' },
      { id: 'usr-3', name: 'Maya Patel', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', role: 'member' }
    ],
    expenses: [
      {
        id: 'sexp-1',
        title: 'Monthly Highspeed Gigabit Wi-Fi',
        amount: 999,
        paid_by: 'usr-1',
        category: 'Bills & Utilities',
        date: '2025-04-05',
        splits: [
          { user_id: 'usr-1', amount: 333, is_paid: true },
          { user_id: 'usr-2', amount: 333, is_paid: false },
          { user_id: 'usr-3', amount: 333, is_paid: false }
        ]
      },
      {
        id: 'sexp-2',
        title: 'Supermarket Groceries & Cleaning Supplies',
        amount: 3600,
        paid_by: 'usr-2',
        category: 'Shopping',
        date: '2025-04-12',
        splits: [
          { user_id: 'usr-1', amount: 1200, is_paid: false },
          { user_id: 'usr-2', amount: 1200, is_paid: true },
          { user_id: 'usr-3', amount: 1200, is_paid: false }
        ]
      }
    ]
  }
];

export const INITIAL_BADGES = [
  {
    id: 'bdg-1',
    badge_key: 'streak_7',
    badge_name: '7-Day Savvy Streak',
    description: 'Tracked daily expenses for 7 consecutive days',
    icon: 'Flame',
    earned_at: '2025-04-22'
  },
  {
    id: 'bdg-2',
    badge_key: 'budget_champion',
    badge_name: 'Budget Mastermind',
    description: 'Maintained total monthly expenses under 85% of budget',
    icon: 'Award',
    earned_at: '2025-04-20'
  },
  {
    id: 'bdg-3',
    badge_key: 'ocr_pioneer',
    badge_name: 'Visionary Scanner',
    description: 'Scanned 5+ receipts with AI OCR auto-categorization',
    icon: 'Scan',
    earned_at: '2025-04-18'
  }
];

export const INITIAL_LEARNING_CURVE = [
  { month: 'Nov 2024', planned: 58000, actual: 64200, accuracy: 89.3, errorRate: 10.6, variance: 6200 },
  { month: 'Dec 2024', planned: 60000, actual: 62800, accuracy: 91.5, errorRate: 4.6, variance: 2800 },
  { month: 'Jan 2025', planned: 57000, actual: 58200, accuracy: 94.2, errorRate: 2.1, variance: 1200 },
  { month: 'Feb 2025', planned: 55000, actual: 55800, accuracy: 96.0, errorRate: 1.4, variance: 800 },
  { month: 'Mar 2025', planned: 54000, actual: 54300, accuracy: 97.6, errorRate: 0.5, variance: 300 },
  { month: 'Apr 2025 (Live)', planned: 60000, actual: 52340, accuracy: 98.4, errorRate: 1.2, variance: -7660 }
];

export const SAMPLE_RECEIPTS = [
  {
    id: 'rcp-sample-1',
    title: 'Starbucks Coffee Receipt',
    date: '2025-04-28',
    amount: 320.00,
    merchant: 'Starbucks Coffee',
    category: 'Food & Dining',
    items: ['1x Iced Caramel Macchiato ₹ 320.00'],
    raw_ocr: "STARBUCKS COFFEE\nSTORE #1084 - INDIRANAGAR\nDATE: 04/28/2025 08:30 AM\n-------------------------\n1 ICED CARAMEL MACCHIATO  320.00\nSUBTOTAL                  320.00\nGST (5%)                   16.00\nTOTAL AMOUNT             ₹320.00\nPAID VIA UPI / GPAY"
  },
  {
    id: 'rcp-sample-2',
    title: 'Swiggy Food Order',
    date: '2025-04-28',
    amount: 450.00,
    merchant: 'Swiggy Gourmet Delivery',
    category: 'Food & Dining',
    items: ['Paneer Tikka Roll ₹ 220', 'Mango Lassi ₹ 130', 'Delivery ₹ 100'],
    raw_ocr: "SWIGGY ORDER INVOICE #8819\nDELIVERY DATE: 28/04/2025\n=========================\nPANEER TIKKA ROLL         220.00\nMANGO LASSI               130.00\nDELIVERY & PACKAGING      100.00\nTOTAL PAID:              ₹450.00"
  },
  {
    id: 'rcp-sample-3',
    title: 'Electricity Power Bill',
    date: '2025-04-27',
    amount: 1250.00,
    merchant: 'City Electricity Board',
    category: 'Bills & Utilities',
    items: ['Monthly Residential Power ₹ 1250.00'],
    raw_ocr: "ELECTRICITY BILLING STATEMENT\nACCOUNT NO: #88219-01\nBILL DATE: 27/04/2025\nRESIDENTIAL USAGE:      ₹1,250.00\nTOTAL AMOUNT DUE:       ₹1,250.00\nSTATUS: PAID VIA AUTOPAY"
  }
];
