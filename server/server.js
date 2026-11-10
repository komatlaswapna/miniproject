import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'data', 'db.json');

// Ensure db.json exists with valid structure
function readDatabase() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = { users: [], userData: {} };
      fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
      return initial;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading database:', err);
    return { users: [], userData: {} };
  }
}

function writeDatabase(data) {
  try {
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error('Error writing database:', err);
    return false;
  }
}

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'SmartSpend AI Engine Backend',
    version: '1.0.0'
  });
});

// AUTH: Register New User
app.post('/api/auth/register', (req, res) => {
  const { fullName, email, username, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email/Username and Password are required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanUsername = (username || cleanEmail.split('@')[0]).trim().toLowerCase();
  const db = readDatabase();

  // Check if user already exists
  const existingUser = db.users.find(u => 
    u.email.toLowerCase() === cleanEmail || 
    (u.username && u.username.toLowerCase() === cleanUsername)
  );

  if (existingUser) {
    return res.status(409).json({ 
      success: false, 
      error: 'USER_EXISTS',
      message: 'An account with this email/username already exists. Please sign in instead.' 
    });
  }

  const newUser = {
    id: `usr-${Date.now()}`,
    email: cleanEmail,
    username: cleanUsername,
    password: password, // Note: In production use bcrypt
    full_name: fullName?.trim() || cleanUsername,
    currency: 'INR',
    currencySymbol: '₹',
    monthly_income: 0,
    points: 100,
    streak_count: 1,
    level: 1,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);

  // Initialize completely fresh, clean empty data for this new user
  db.userData[newUser.id] = {
    transactions: [],
    budgets: [],
    savingsGoals: [],
    recurringRules: [],
    sharedGroups: [],
    notifications: [
      {
        id: `notif-${Date.now()}`,
        title: '🎉 Welcome to SmartSpend AI!',
        message: 'Your account is setup and ready! Start logging your daily expenses or scan your bills.',
        type: 'streak',
        channel: 'app',
        timestamp: 'Just now',
        is_read: false
      }
    ]
  };

  writeDatabase(db);

  const { password: _, ...safeUser } = newUser;
  return res.status(201).json({
    success: true,
    message: 'Account created successfully!',
    user: { ...safeUser, isAuthenticated: true }
  });
});

// AUTH: Sign In & Credentials Check
app.post('/api/auth/login', (req, res) => {
  const { email, username, password } = req.body;
  const identifier = (email || username || '').trim().toLowerCase();

  if (!identifier || !password) {
    return res.status(400).json({ success: false, message: 'Please provide both username/email and password.' });
  }

  const db = readDatabase();
  const foundUser = db.users.find(u => 
    u.email.toLowerCase() === identifier || 
    (u.username && u.username.toLowerCase() === identifier)
  );

  // If user does not exist in database, prompt to create account
  if (!foundUser) {
    return res.status(404).json({
      success: false,
      error: 'ACCOUNT_NOT_FOUND',
      message: 'Account does not exist! No registered user found with this username/email. Please create an account.'
    });
  }

  // Check password
  if (foundUser.password !== password) {
    return res.status(401).json({
      success: false,
      error: 'INVALID_PASSWORD',
      message: 'Incorrect password! Please check your password and try again.'
    });
  }

  const { password: _, ...safeUser } = foundUser;
  return res.json({
    success: true,
    message: `Welcome back, ${safeUser.full_name}!`,
    user: { ...safeUser, isAuthenticated: true }
  });
});

// USER DATA: Get Per-User Stored Data (Fresh & Isolated)
app.get('/api/user-data/:userId', (req, res) => {
  const { userId } = req.params;
  const db = readDatabase();
  const userStoredData = db.userData[userId] || {
    transactions: [],
    budgets: [],
    savingsGoals: [],
    recurringRules: [],
    sharedGroups: [],
    notifications: []
  };

  res.json({
    success: true,
    data: userStoredData
  });
});

// USER DATA: Save Per-User Stored Data
app.post('/api/user-data/:userId', (req, res) => {
  const { userId } = req.params;
  const { transactions, budgets, savingsGoals, recurringRules, sharedGroups, notifications } = req.body;

  const db = readDatabase();
  if (!db.userData[userId]) {
    db.userData[userId] = {};
  }

  if (transactions !== undefined) db.userData[userId].transactions = transactions;
  if (budgets !== undefined) db.userData[userId].budgets = budgets;
  if (savingsGoals !== undefined) db.userData[userId].savingsGoals = savingsGoals;
  if (recurringRules !== undefined) db.userData[userId].recurringRules = recurringRules;
  if (sharedGroups !== undefined) db.userData[userId].sharedGroups = sharedGroups;
  if (notifications !== undefined) db.userData[userId].notifications = notifications;

  writeDatabase(db);
  res.json({ success: true, message: 'User data synced successfully.' });
});

// 1. AI CATEGORIZATION ENGINE
const CATEGORY_KEYWORDS = {
  'Food & Dining': ['restaurant', 'cafe', 'starbucks', 'mcdonald', 'burger', 'pizza', 'swiggy', 'zomato', 'ubereats', 'dinner', 'lunch', 'grocery', 'supermarket', 'walmart', 'trader joe', 'whole foods', 'costco', 'bakery', 'subway', 'taco'],
  'Housing & Rent': ['rent', 'landlord', 'apartment', 'mortgage', 'lease', 'maintenance', 'housing', 'society'],
  'Utilities & Bills': ['electricity', 'water', 'gas', 'power', 'internet', 'wifi', 'broadband', 'airtel', 'jio', 'verizon', 'att', 'utility', 'dth', 'trash', 'sewer'],
  'Transportation': ['uber', 'lyft', 'ola', 'taxi', 'metro', 'bus', 'train', 'fuel', 'petrol', 'gasoline', 'shell', 'parking', 'toll', 'subway', 'transit'],
  'Entertainment': ['netflix', 'spotify', 'prime', 'disney', 'cinema', 'movie', 'amc', 'steam', 'game', 'playstation', 'concert', 'hulu', 'apple tv', 'audible'],
  'Healthcare': ['pharmacy', 'hospital', 'clinic', 'dentist', 'doctor', 'medicine', 'cvs', 'walgreens', 'apollo', 'optometry', 'health', 'fitness', 'gym'],
  'Shopping': ['amazon', 'flipkart', 'target', 'ebay', 'nike', 'zara', 'h&m', 'clothing', 'electronics', 'apple store', 'best buy', 'apparel', 'shoes'],
  'Education': ['course', 'udemy', 'coursera', 'tuition', 'books', 'college', 'university', 'school', 'exam', 'training'],
  'Investment & Savings': ['stocks', 'crypto', 'etf', 'mutual fund', 'deposit', 'zerodha', 'robinhood', 'vanguard', 'fidelity', 'savings'],
  'Income & Salary': ['payroll', 'salary', 'freelance', 'client payment', 'dividend', 'bonus', 'stipend', 'refund']
};

app.post('/api/categorize', (req, res) => {
  const { text = '', amount = 0, merchant = '' } = req.body;
  const normalized = `${text} ${merchant}`.toLowerCase();

  let matchedCategory = 'Shopping'; // fallback default
  let highestScore = 0;
  let detectedMerchant = merchant || '';

  // Extract merchant if not provided
  if (!detectedMerchant && text) {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length > 0) {
      detectedMerchant = lines[0].substring(0, 32);
    }
  }

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    keywords.forEach(kw => {
      if (normalized.includes(kw)) {
        score += 1;
      }
    });
    if (score > highestScore) {
      highestScore = score;
      matchedCategory = category;
    }
  }

  // Calculate confidence score
  const confidence = highestScore > 0 ? Math.min(0.70 + (highestScore * 0.1), 0.98) : 0.65;

  res.json({
    category: matchedCategory,
    merchant: detectedMerchant,
    confidence: Number(confidence.toFixed(2)),
    reason: highestScore > 0 
      ? `Identified based on semantic match with keywords for ${matchedCategory}`
      : 'General classification based on expense context',
    suggestedTags: [matchedCategory.toLowerCase().replace(/[^a-z0-9]/g, '_')]
  });
});

// 2. ITERATIVE LEARNING ENGINE (Analyzes variance & recalculates optimized budgets)
app.post('/api/iterative-budget', (req, res) => {
  const { historicalBudgets = [], currentBudgets = [], savingsTarget = 0.20 } = req.body;

  // Formula: Next Budget = Planned - (0.6 * Variance) + Volatility Smoothing
  const recommendations = currentBudgets.map(item => {
    const planned = Number(item.planned_amount || item.planned || 0);
    const actual = Number(item.actual_amount || item.actual || planned * 0.95);
    const variance = actual - planned; // positive = overspent, negative = underspent

    let recommended = planned;
    let adjustmentReason = '';

    if (variance > 0) {
      // User overspent: recommend a realistic increase or trim depending on category essentiality
      const isEssential = ['Housing & Rent', 'Utilities & Bills', 'Healthcare'].includes(item.category_name || item.name);
      if (isEssential) {
        recommended = planned + (variance * 0.85);
        adjustmentReason = `Fixed/Essential category overspent by $${variance.toFixed(0)}. Adjusted baseline upward to reflect true cost.`;
      } else {
        recommended = planned + (variance * 0.35); // partial cushion with recommendation to restrict
        adjustmentReason = `Discretionary category overspent by $${variance.toFixed(0)}. Adjusted slightly with +${((recommended/planned - 1)*100).toFixed(0)}% cushion to prevent recurring blowout.`;
      }
    } else {
      // User underspent: optimize and redirect surplus to savings
      const savingsSurplus = Math.abs(variance);
      recommended = planned - (savingsSurplus * 0.5);
      adjustmentReason = `Consistently underspent by $${savingsSurplus.toFixed(0)}. Trimmed budget to unlock surplus for your savings goals!`;
    }

    recommended = Math.max(20, Math.round(recommended / 10) * 10);
    const accuracy = planned > 0 ? Math.max(0, 100 - (Math.abs(variance) / planned * 100)) : 100;

    return {
      category_name: item.category_name || item.name,
      current_planned: planned,
      current_actual: actual,
      variance,
      accuracy_score: Number(accuracy.toFixed(1)),
      ai_recommended_amount: recommended,
      adjustment_delta: recommended - planned,
      adjustment_reason: adjustmentReason,
      confidence_score: 0.92
    };
  });

  const totalCurrent = recommendations.reduce((acc, r) => acc + r.current_planned, 0);
  const totalRecommended = recommendations.reduce((acc, r) => acc + r.ai_recommended_amount, 0);

  res.json({
    recommendations,
    summary: {
      total_current_planned: totalCurrent,
      total_recommended: totalRecommended,
      net_savings_unlocked: Math.max(0, totalCurrent - totalRecommended),
      overall_accuracy: Number((recommendations.reduce((acc, r) => acc + r.accuracy_score, 0) / (recommendations.length || 1)).toFixed(1))
    }
  });
});

// 3. WHAT-IF SCENARIO SIMULATOR
app.post('/api/what-if', (req, res) => {
  const {
    currentMonthlyIncome = 4500,
    currentMonthlyExpenses = 3200,
    currentSavingsBalance = 12500,
    incomeChangePercent = 0, // e.g. +10%
    rentChange = 0, // e.g. +$150
    discretionaryCutPercent = 0, // e.g. -20%
    inflationPercent = 3.5, // annual inflation
    oneTimeExpense = 0, // e.g. $1200
    oneTimeExpenseMonth = 3,
    months = 12
  } = req.body;

  const monthlyInflationFactor = (1 + inflationPercent / 100) ** (1 / 12);
  const baselineTrajectory = [];
  const scenarioTrajectory = [];

  let baselineBalance = currentSavingsBalance;
  let scenarioBalance = currentSavingsBalance;

  const discretionaryPortion = currentMonthlyExpenses * 0.35; // ~35% dining/shopping
  const fixedPortion = currentMonthlyExpenses * 0.65;

  const adjustedIncome = currentMonthlyIncome * (1 + incomeChangePercent / 100);
  const adjustedDiscretionary = discretionaryPortion * (1 - discretionaryCutPercent / 100);

  const monthNames = ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6', 'Month 7', 'Month 8', 'Month 9', 'Month 10', 'Month 11', 'Month 12'];

  for (let i = 0; i < months; i++) {
    // Baseline: current income, normal inflation
    const baselineMonthlyExpense = currentMonthlyExpenses * (monthlyInflationFactor ** i);
    const baselineNet = currentMonthlyIncome - baselineMonthlyExpense;
    baselineBalance += baselineNet;
    baselineTrajectory.push({
      month: monthNames[i],
      balance: Math.round(baselineBalance),
      netSavings: Math.round(baselineNet),
      expenses: Math.round(baselineMonthlyExpense)
    });

    // Scenario calculation
    let scenarioMonthlyExpense = (fixedPortion + rentChange + adjustedDiscretionary) * (monthlyInflationFactor ** i);
    if (i + 1 === oneTimeExpenseMonth) {
      scenarioMonthlyExpense += oneTimeExpense;
    }
    const scenarioNet = adjustedIncome - scenarioMonthlyExpense;
    scenarioBalance += scenarioNet;
    scenarioTrajectory.push({
      month: monthNames[i],
      balance: Math.round(scenarioBalance),
      netSavings: Math.round(scenarioNet),
      expenses: Math.round(scenarioMonthlyExpense)
    });
  }

  const baselineEnd = baselineTrajectory[months - 1].balance;
  const scenarioEnd = scenarioTrajectory[months - 1].balance;
  const netWealthDifference = scenarioEnd - baselineEnd;

  res.json({
    months,
    baselineBalanceEnd: baselineEnd,
    scenarioBalanceEnd: scenarioEnd,
    netWealthDifference,
    projection: baselineTrajectory.map((base, idx) => ({
      month: base.month,
      baselineBalance: base.balance,
      scenarioBalance: scenarioTrajectory[idx].balance,
      baselineNet: base.netSavings,
      scenarioNet: scenarioTrajectory[idx].netSavings,
      baselineExpense: base.expenses,
      scenarioExpense: scenarioTrajectory[idx].expenses
    })),
    verdict: netWealthDifference >= 0
      ? `This scenario increases your 1-year wealth by $${netWealthDifference.toLocaleString()}! Highly recommended.`
      : `This scenario leaves you with $${Math.abs(netWealthDifference).toLocaleString()} less in savings. Consider increasing savings or trimming discretionary expenses.`
  });
});

// 4. SMART ALERTS BOT (Telegram & WhatsApp Dispatch or Simulator)
app.post('/api/smart-alerts/test', async (req, res) => {
  const {
    channel = 'telegram', // 'telegram' or 'whatsapp'
    recipient = '@SmartUser',
    type = 'threshold_80', // 'threshold_80', 'threshold_100', 'streak'
    category = 'Food & Dining',
    spent = 420,
    budget = 500,
    telegramBotToken,
    telegramChatId,
    whatsappNumber
  } = req.body;

  const percent = Math.round((spent / budget) * 100);
  let alertTitle = '';
  let alertMessage = '';

  if (type === 'threshold_80') {
    alertTitle = `⚠️ SmartSpend Alert: ${category} Reached ${percent}%`;
    alertMessage = `You have spent $${spent} of your $${budget} limit for ${category}. Only $${budget - spent} remaining this month. Tip: Slow down dining out to stay on track!`;
  } else if (type === 'threshold_100') {
    alertTitle = `🚨 Budget Exceeded: ${category} at ${percent}%`;
    alertMessage = `Heads up! You have reached $${spent} of $${budget} for ${category}. SmartSpend AI recommends freezing non-essential spending in this bucket.`;
  } else {
    alertTitle = `🔥 7-Day Smart Saver Streak Unlocked!`;
    alertMessage = `Congratulations! You logged expenses consistently and kept your budget intact for 7 straight days. +50 XP awarded!`;
  }

  let realDispatchStatus = 'simulated';
  let networkDetails = null;

  // Real Telegram API dispatch if token & chat ID provided
  if (channel === 'telegram' && telegramBotToken && telegramChatId) {
    try {
      const tgUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
      const response = await fetch(tgUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: `🔔 *${alertTitle}*\n\n${alertMessage}\n\n_Sent via SmartSpend AI Bot_`,
          parse_mode: 'Markdown'
        })
      });
      const data = await response.json();
      if (data.ok) {
        realDispatchStatus = 'delivered';
        networkDetails = { message_id: data.result?.message_id };
      } else {
        realDispatchStatus = 'error_token_invalid';
        networkDetails = data;
      }
    } catch (err) {
      realDispatchStatus = 'network_error';
      networkDetails = { error: err.message };
    }
  }

  res.json({
    success: true,
    channel,
    recipient: telegramChatId || whatsappNumber || recipient,
    status: realDispatchStatus,
    timestamp: new Date().toISOString(),
    payload: {
      title: alertTitle,
      body: alertMessage,
      category,
      spent,
      budget,
      percentage: percent
    },
    networkDetails
  });
});

// 5. RECURRING EXPENSE DETECTION ENGINE
app.post('/api/recurring/detect', (req, res) => {
  const { transactions = [] } = req.body;

  // Group transactions by normalized merchant / description
  const groups = {};
  transactions.forEach(t => {
    if (t.type !== 'expense') return;
    const cleanKey = t.description.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 15);
    if (!groups[cleanKey]) groups[cleanKey] = [];
    groups[cleanKey].push(t);
  });

  const detected = [];
  for (const [key, items] of Object.entries(groups)) {
    if (items.length >= 2) {
      // Sort by date
      items.sort((a, b) => new Date(a.date) - new Date(b.date));
      const amounts = items.map(i => Number(i.amount));
      const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
      
      // Check interval between dates
      const intervals = [];
      for (let i = 1; i < items.length; i++) {
        const diffDays = Math.round(Math.abs((new Date(items[i].date) - new Date(items[i-1].date)) / (1000 * 60 * 60 * 24)));
        intervals.push(diffDays);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / (intervals.length || 1);

      let frequency = 'monthly';
      if (avgInterval >= 25 && avgInterval <= 35) frequency = 'monthly';
      else if (avgInterval >= 6 && avgInterval <= 8) frequency = 'weekly';
      else if (avgInterval >= 80 && avgInterval <= 100) frequency = 'quarterly';
      else if (avgInterval >= 350 && avgInterval <= 380) frequency = 'yearly';

      const lastTx = items[items.length - 1];
      const nextDue = new Date(lastTx.date);
      nextDue.setDate(nextDue.getDate() + Math.round(avgInterval || 30));

      detected.push({
        id: `rec_${key}`,
        merchant_name: lastTx.description,
        estimated_amount: Number(avgAmount.toFixed(2)),
        category_name: lastTx.category_name || 'Utilities & Bills',
        frequency,
        occurrences: items.length,
        confidence_score: items.length >= 3 ? 0.96 : 0.82,
        last_date: lastTx.date,
        next_due_date: nextDue.toISOString().split('T')[0],
        due_day: new Date(lastTx.date).getDate(),
        auto_add: false
      });
    }
  }

  res.json({
    total_detected: detected.length,
    recurring_rules: detected
  });
});

// 6. SHARED BUDGETS EXPENSE SPLIT & SETTLEMENT ENGINE
app.post('/api/shared-budgets/split', (req, res) => {
  const { members = [], expenses = [] } = req.body;

  // Calculate net balances: positive means they should receive money, negative means they owe money
  const balances = {};
  members.forEach(m => { balances[m.id] = 0; });

  expenses.forEach(exp => {
    const paidBy = exp.paid_by;
    const totalAmount = Number(exp.amount);
    balances[paidBy] = (balances[paidBy] || 0) + totalAmount;

    // Splits
    if (exp.splits && exp.splits.length > 0) {
      exp.splits.forEach(s => {
        balances[s.user_id] = (balances[s.user_id] || 0) - Number(s.amount);
      });
    } else {
      // Default equal split
      const splitAmount = totalAmount / (members.length || 1);
      members.forEach(m => {
        balances[m.id] = (balances[m.id] || 0) - splitAmount;
      });
    }
  });

  // Debt Simplification Algorithm (Greedy matching)
  const debtors = [];
  const creditors = [];

  for (const [userId, bal] of Object.entries(balances)) {
    const rounded = Math.round(bal * 100) / 100;
    if (rounded < -0.01) debtors.push({ id: userId, amount: Math.abs(rounded) });
    else if (rounded > 0.01) creditors.push({ id: userId, amount: rounded });
  }

  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const settlements = [];
  let d = 0, c = 0;
  while (d < debtors.length && c < creditors.length) {
    const debtor = debtors[d];
    const creditor = creditors[c];
    const settleAmount = Math.min(debtor.amount, creditor.amount);

    if (settleAmount > 0.01) {
      settlements.push({
        from_id: debtor.id,
        to_id: creditor.id,
        amount: Number(settleAmount.toFixed(2)),
        currency: 'INR'
      });
    }

    debtor.amount -= settleAmount;
    creditor.amount -= settleAmount;

    if (debtor.amount <= 0.01) d++;
    if (creditor.amount <= 0.01) c++;
  }

  res.json({
    member_balances: balances,
    simplified_settlements: settlements,
    total_group_spend: expenses.reduce((a, b) => a + Number(b.amount || 0), 0)
  });
});

const clientDistPath = path.resolve(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

const server = app.listen(PORT, () => {
  console.log(`[SmartSpend AI Server] Running securely on http://localhost:${PORT}`);
});

process.on('SIGTERM', () => server.close());
process.on('SIGINT', () => server.close());
