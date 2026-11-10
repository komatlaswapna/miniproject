import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ToastContainer from './components/ToastContainer';
import VoiceExpenseModal from './components/VoiceExpenseModal';
import AddTransactionModal from './components/AddTransactionModal';

// Pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import ReceiptScannerPage from './pages/ReceiptScannerPage';
import BudgetsPage from './pages/BudgetsPage';
import SavingsGoalsPage from './pages/SavingsGoalsPage';
import WhatIfSimulatorPage from './pages/WhatIfSimulatorPage';
import SharedBudgetsPage from './pages/SharedBudgetsPage';
import NotificationsPage from './pages/NotificationsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

function AppContent() {
  const { currentView, setCurrentView, user } = useApp();
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isAddTxModalOpen, setIsAddTxModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Landing Page view
  if (currentView === 'landing') {
    return (
      <>
        <LandingPage />
        <ToastContainer />
      </>
    );
  }

  // Auth Page view
  if (currentView === 'auth') {
    return (
      <>
        <AuthPage />
        <ToastContainer />
      </>
    );
  }

  // Auth Guard: User MUST sign in before accessing the Dashboard or internal features!
  if (!user?.isAuthenticated) {
    return (
      <>
        <AuthPage />
        <ToastContainer />
      </>
    );
  }

  // App Pages with Sidebar + Navbar
  const renderCurrentPage = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardPage onOpenVoice={() => setIsVoiceModalOpen(true)} onOpenAddTx={() => setIsAddTxModalOpen(true)} />;
      case 'transactions':
        return <TransactionsPage onOpenAddTx={() => setIsAddTxModalOpen(true)} />;
      case 'receipts':
        return <ReceiptScannerPage />;
      case 'budgets':
        return <BudgetsPage />;
      case 'goals':
        return <SavingsGoalsPage />;
      case 'what-if':
        return <WhatIfSimulatorPage />;
      case 'shared':
        return <SharedBudgetsPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage onOpenVoice={() => setIsVoiceModalOpen(true)} onOpenAddTx={() => setIsAddTxModalOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen p-1 sm:p-4 lg:p-6 flex items-center justify-center relative overflow-hidden transition-colors duration-300">
      {/* Dreamy Ambient Floating 3D Crystal Gemstones & Orbs */}
      <div className="absolute top-8 left-6 w-16 h-16 rounded-2xl rotate-12 bg-gradient-to-tr from-cyan-400/30 to-indigo-500/20 backdrop-blur-md border border-white/40 shadow-lg pointer-events-none hidden md:block"></div>
      <div className="absolute bottom-12 left-10 w-12 h-12 rounded-xl -rotate-12 bg-gradient-to-tr from-pink-400/30 to-purple-500/20 backdrop-blur-md border border-white/40 shadow-lg pointer-events-none hidden md:block"></div>
      <div className="absolute top-16 right-12 w-20 h-20 rounded-3xl rotate-45 bg-gradient-to-tr from-purple-400/20 to-pink-500/30 backdrop-blur-md border border-white/40 shadow-lg pointer-events-none hidden lg:block"></div>
      <div className="absolute bottom-20 right-8 w-14 h-14 rounded-2xl -rotate-45 bg-gradient-to-tr from-indigo-400/20 to-cyan-400/30 backdrop-blur-md border border-white/40 shadow-lg pointer-events-none hidden md:block"></div>

      {/* Main Glassmorphic Dashboard Window Container */}
      <div className="w-full max-w-[1600px] h-[98dvh] md:h-[96vh] glass-panel-light rounded-2xl md:rounded-[32px] overflow-hidden flex flex-col md:flex-row shadow-2xl relative z-10 text-slate-800 dark:text-slate-100 transition-colors duration-300">
        {/* Sidebar Navigation */}
        <Sidebar collapsed={isSidebarCollapsed} setCollapsed={setIsSidebarCollapsed} />

        {/* Main Workspace Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F5F0FF]/90 dark:bg-slate-950/40 backdrop-blur-md">
          {/* Top Navbar */}
          <Navbar
            onOpenVoice={() => setIsVoiceModalOpen(true)}
            onOpenAddTx={() => setIsAddTxModalOpen(true)}
          />

          {/* Scrollable Page Body */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7">
            <div className="max-w-[1400px] mx-auto">
              {renderCurrentPage()}
            </div>
          </main>
        </div>
      </div>

      {/* Voice Expense Modal (Feature 7) */}
      <VoiceExpenseModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddTxModalOpen}
        onClose={() => setIsAddTxModalOpen(false)}
      />

      {/* Global Toast Feedback */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
