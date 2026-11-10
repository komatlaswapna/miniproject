import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import logoImg from '../assets/logo.png';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

export default function AuthPage() {
  const { setCurrentView, setUser, addToast } = useApp();

  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [accountNotFound, setAccountNotFound] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setAccountNotFound(false);

    const cleanIdentifier = email.trim();
    const cleanPassword = password.trim();

    if (!cleanIdentifier || !cleanPassword) {
      setErrorMessage('Please enter both username/email and password.');
      setIsLoading(false);
      return;
    }

    try {
      if (mode === 'signup') {
        // Try backend registration first
        try {
          const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fullName: fullName.trim() || cleanIdentifier,
              email: cleanIdentifier,
              username: cleanIdentifier,
              password: cleanPassword
            })
          });
          const data = await res.json();
          if (!res.ok) {
            setErrorMessage(data.message || 'Registration failed');
            setIsLoading(false);
            return;
          }

          // Register successful: user starts with fresh empty data!
          setUser(data.user);
          addToast(`Account created successfully! Welcome, ${data.user.full_name}!`, 'success');
          setCurrentView('dashboard');
          return;
        } catch (serverErr) {
          // Fallback to local storage persistent user database
          const localUsers = JSON.parse(localStorage.getItem('smartspend_local_users') || '[]');
          const exists = localUsers.some(u => 
            u.email.toLowerCase() === cleanIdentifier.toLowerCase() ||
            u.username.toLowerCase() === cleanIdentifier.toLowerCase()
          );

          if (exists) {
            setErrorMessage('An account with this email/username already exists. Please sign in instead.');
            setIsLoading(false);
            return;
          }

          const newUser = {
            id: `usr-${Date.now()}`,
            email: cleanIdentifier,
            username: cleanIdentifier,
            password: cleanPassword,
            full_name: fullName.trim() || cleanIdentifier,
            currency: 'INR',
            currencySymbol: '₹',
            monthly_income: 0,
            points: 100,
            streak_count: 1,
            level: 1,
            isAuthenticated: true
          };

          localUsers.push(newUser);
          localStorage.setItem('smartspend_local_users', JSON.stringify(localUsers));

          // Set completely fresh empty user data
          localStorage.setItem(`smartspend_user_data_${newUser.id}`, JSON.stringify({
            transactions: [],
            budgets: [],
            savingsGoals: [],
            recurringRules: [],
            sharedGroups: [],
            notifications: []
          }));

          setUser(newUser);
          addToast(`Account created successfully! Welcome, ${newUser.full_name}!`, 'success');
          setCurrentView('dashboard');
          return;
        }
      } else {
        // Mode === 'login': Must check in database if user exists and password matches!
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: cleanIdentifier,
              username: cleanIdentifier,
              password: cleanPassword
            })
          });

          const data = await res.json();
          if (!res.ok) {
            if (res.status === 404 || data.error === 'ACCOUNT_NOT_FOUND') {
              setAccountNotFound(true);
              setErrorMessage('Account does not exist! Please create an account.');
            } else if (res.status === 401 || data.error === 'INVALID_PASSWORD') {
              setAccountNotFound(false);
              setErrorMessage('Incorrect password! Please check your password and try again.');
            } else {
              setErrorMessage(data.message || 'Authentication failed');
            }
            setIsLoading(false);
            return;
          }

          // Successful login
          setUser(data.user);
          addToast(`Welcome back, ${data.user.full_name}!`, 'success');
          setCurrentView('dashboard');
          return;
        } catch (serverErr) {
          // Fallback to local storage database check
          const localUsers = JSON.parse(localStorage.getItem('smartspend_local_users') || '[]');
          const found = localUsers.find(u => 
            u.email.toLowerCase() === cleanIdentifier.toLowerCase() ||
            u.username.toLowerCase() === cleanIdentifier.toLowerCase()
          );

          if (!found) {
            setAccountNotFound(true);
            setErrorMessage('Account does not exist! No user found with this email/username. Please create an account.');
            setIsLoading(false);
            return;
          }

          if (found.password !== cleanPassword) {
            setAccountNotFound(false);
            setErrorMessage('Incorrect password! Please check your password and try again.');
            setIsLoading(false);
            return;
          }

          const { password: _, ...safeUser } = found;
          setUser({ ...safeUser, isAuthenticated: true });
          addToast(`Welcome back, ${safeUser.full_name}!`, 'success');
          setCurrentView('dashboard');
          return;
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = (role) => {
    if (role === 'alex') {
      setUser({
        id: 'usr-demo-alex',
        email: 'alex.rivera@smartspend.ai',
        full_name: 'Alex Rivera',
        role_title: 'Demo Spender',
        currency: 'INR',
        currencySymbol: '₹',
        monthly_income: 78500,
        points: 520,
        streak_count: 7,
        level: 3,
        isAuthenticated: true
      });
      addToast('Signed in as Alex Rivera (Demo Account with Sample Data)', 'success');
    } else {
      setUser({
        id: 'usr-demo-jordan',
        email: 'jordan.chen@flat402.com',
        full_name: 'Jordan Chen',
        role_title: 'Demo Roommate',
        currency: 'INR',
        currencySymbol: '₹',
        monthly_income: 50000,
        points: 240,
        streak_count: 3,
        level: 2,
        isAuthenticated: true
      });
      addToast('Signed in as Jordan Chen (Demo Account with Sample Data)', 'success');
    }
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F5F0FF] flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-800 relative overflow-hidden">
      {/* Background glow radial */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-violet-200/50 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div
          onClick={() => setCurrentView('landing')}
          className="cursor-pointer inline-flex items-center space-x-2.5 mb-4"
        >
          <img
            src={logoImg}
            alt="Expense Tracker logo"
            className="w-11 h-11 object-contain drop-shadow-lg hover:scale-110 transition-transform"
          />
          <span className="font-extrabold text-2xl tracking-tight text-slate-800">Expense Tracker</span>
        </div>
        <h2 className="text-xl font-bold text-slate-800">
          {mode === 'login' ? 'Sign in to your account' : 'Create your financial account'}
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Supabase Auth with Row Level Security & Enterprise Encryption
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="p-8 rounded-3xl bg-violet-100 border border-violet-200 shadow-[0_24px_60px_-24px_rgba(139,92,246,0.4)] space-y-6">
          {/* Tab Selector */}
          <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-white border border-violet-200">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMessage(''); }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'login' ? 'bg-violet-600 text-white shadow' : 'text-slate-600 hover:text-violet-700'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setErrorMessage(''); }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'signup' ? 'bg-violet-600 text-white shadow' : 'text-slate-600 hover:text-violet-700'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Quick Demo Shortcuts */}
          <div className="p-3 rounded-2xl bg-white border border-violet-200 text-center space-y-2">
            <p className="text-[11px] font-semibold text-violet-700">⚡ Instant Demo Sign-in (No Password Needed)</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoSignIn('alex')}
                className="py-1.5 px-2 rounded-xl bg-white hover:bg-violet-50 border border-violet-200 text-xs font-bold text-slate-700 transition-colors"
              >
                Alex (Primary)
              </button>
              <button
                type="button"
                onClick={() => handleDemoSignIn('jordan')}
                className="py-1.5 px-2 rounded-xl bg-white hover:bg-violet-50 border border-violet-200 text-xs font-bold text-slate-700 transition-colors"
              >
                Jordan (Roommate)
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
              {accountNotFound && (
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMessage('');
                    setAccountNotFound(false);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-violet-100 to-fuchsia-100 hover:from-violet-200 hover:to-fuchsia-200 border border-violet-300 text-violet-800 font-bold text-xs transition-all flex items-center justify-center space-x-2 shadow-sm animate-pulse"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Click here to Create Account (Sign Up) →</span>
                </button>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Full Legal Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Swapna / Alex Rivera"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-violet-200 text-slate-800 text-xs placeholder:text-slate-400 focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                {mode === 'login' ? 'Username or Email Address' : 'Email or Username'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="username or email@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-violet-200 text-slate-800 text-xs placeholder:text-slate-400 focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 rounded-xl bg-white border border-violet-200 text-slate-800 text-xs placeholder:text-slate-400 focus:outline-none focus:border-violet-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-violet-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-500 hover:to-fuchsia-400 text-white font-bold text-xs shadow-glow transition-all"
            >
              <span>{isLoading ? 'Authenticating...' : mode === 'login' ? 'Sign In to Cockpit' : 'Register Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setCurrentView('landing')}
              className="text-xs text-slate-600 hover:text-violet-700 transition-colors"
            >
              ← Back to Product Showcase
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
