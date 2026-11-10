import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Mic, MicOff, Sparkles, Check, X, AlertCircle, ArrowRight } from 'lucide-react';

export default function VoiceExpenseModal({ isOpen, onClose }) {
  const { categories, addTransaction, addToast } = useApp();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [extractedData, setExtractedData] = useState({
    amount: '',
    description: '',
    category_name: 'Food & Dining',
    payment_method: 'Credit Card',
    type: 'expense',
    date: new Date().toISOString().split('T')[0]
  });
  const [recognitionInstance, setRecognitionInstance] = useState(null);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(true);

  // Initialize Web Speech API
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setHasSpeechSupport(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const currentTranscript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      setTranscript(currentTranscript);
      parseVoiceInput(currentTranscript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
      setIsListening(false);
    };

    setRecognitionInstance(recognition);
  }, []);

  const toggleListening = () => {
    if (!recognitionInstance) return;

    if (isListening) {
      recognitionInstance.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      try {
        recognitionInstance.start();
        setIsListening(true);
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
  };

  // Rule-based NLP extraction from spoken sentence
  const parseVoiceInput = (text) => {
    const lower = text.toLowerCase();

    // 1. Extract Amount ($45, 45 dollars, 45.50, rupees 500)
    const amountMatch = lower.match(/(?:\$|usd|rs\.?|rupees|dollars|inr)?\s*(\d+(?:\.\d{1,2})?)\s*(?:dollars|bucks|rupees)?/i);
    const amount = amountMatch ? amountMatch[1] : '';

    // 2. Extract Type (income vs expense)
    const isIncome = lower.includes('earned') || lower.includes('salary') || lower.includes('income') || lower.includes('received') || lower.includes('freelance');
    const type = isIncome ? 'income' : 'expense';

    // 3. Extract Category
    let category = isIncome ? 'Salary & Income' : 'Shopping';
    if (lower.includes('food') || lower.includes('dining') || lower.includes('dinner') || lower.includes('lunch') || lower.includes('starbucks') || lower.includes('coffee') || lower.includes('grocery') || lower.includes('burger') || lower.includes('pizza') || lower.includes('restaurant')) {
      category = 'Food & Dining';
    } else if (lower.includes('uber') || lower.includes('taxi') || lower.includes('fuel') || lower.includes('gas') || lower.includes('petrol') || lower.includes('metro') || lower.includes('transport')) {
      category = 'Transportation';
    } else if (lower.includes('rent') || lower.includes('apartment') || lower.includes('housing')) {
      category = 'Housing & Rent';
    } else if (lower.includes('power') || lower.includes('electric') || lower.includes('wifi') || lower.includes('internet') || lower.includes('utility') || lower.includes('water')) {
      category = 'Utilities & Bills';
    } else if (lower.includes('movie') || lower.includes('cinema') || lower.includes('netflix') || lower.includes('spotify') || lower.includes('game')) {
      category = 'Entertainment';
    } else if (lower.includes('doctor') || lower.includes('medicine') || lower.includes('pharmacy') || lower.includes('health') || lower.includes('hospital')) {
      category = 'Healthcare';
    }

    // 4. Extract Merchant / Clean Description
    let desc = text.replace(/(?:i spent|spent|paid|bought|got|added|for|at|on|dollars|bucks|in cash|with credit card)/gi, ' ').trim();
    if (!desc || desc.length < 3) {
      desc = `${category} Entry`;
    } else {
      desc = desc.charAt(0).toUpperCase() + desc.slice(1);
    }

    // 5. Payment method
    let payment = 'Credit Card';
    if (lower.includes('cash')) payment = 'Cash';
    else if (lower.includes('debit') || lower.includes('atm')) payment = 'Debit Card';
    else if (lower.includes('upi') || lower.includes('gpay') || lower.includes('phonepe')) payment = 'UPI';
    else if (lower.includes('apple pay')) payment = 'Apple Pay';

    setExtractedData(prev => ({
      ...prev,
      amount: amount || prev.amount,
      description: desc || prev.description,
      category_name: category,
      payment_method: payment,
      type
    }));
  };

  const handleSimulateVoice = (samplePhrase) => {
    setTranscript(samplePhrase);
    parseVoiceInput(samplePhrase);
  };

  const handleConfirmSave = (e) => {
    e.preventDefault();
    if (!extractedData.amount || Number(extractedData.amount) <= 0) {
      addToast('Please specify a valid transaction amount', 'error');
      return;
    }
    if (!extractedData.description) {
      addToast('Please enter a description for the transaction', 'error');
      return;
    }

    addTransaction(extractedData);
    addToast(`Voice expense added: ${extractedData.description} ($${extractedData.amount})`, 'success');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-violet-100 border border-violet-200 p-6 shadow-2xl overflow-hidden relative">
        {/* Glow Header */}
        <div className="flex items-center justify-between pb-4 border-b border-violet-200">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <span>Voice Expense Input</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                  AI Voice Parser
                </span>
              </h3>
              <p className="text-xs text-slate-600">Speak naturally to log an income or expense</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-violet-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Microphone Recording Action Area */}
        <div className="py-6 flex flex-col items-center justify-center text-center">
          <button
            type="button"
            onClick={toggleListening}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-200 ${
              isListening
                ? 'bg-rose-500 text-white ring-4 ring-rose-500/20 shadow-md'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-glow'
            }`}
          >
            {isListening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
          </button>

          <p className="mt-4 text-sm font-semibold text-slate-800">
            {isListening ? 'Listening... Speak your expense now' : 'Click microphone to start speaking'}
          </p>
          <p className="text-xs text-slate-600 mt-1">
            e.g., <span className="italic text-indigo-300">"Spent 42 dollars at Starbucks for coffee on credit card"</span>
          </p>

          {/* Quick Demo Voice Test Chips */}
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            <span className="text-[11px] text-slate-600 self-center">Or test sample:</span>
            <button
              type="button"
              onClick={() => handleSimulateVoice('Spent 48.50 rupees at Whole Foods for groceries on UPI')}
              className="text-xs px-2.5 py-1 rounded-lg bg-violet-50 hover:bg-violet-200 text-slate-700 border border-violet-200 transition-colors"
            >
              🛒 Groceries ₹48.50
            </button>
            <button
              type="button"
              onClick={() => handleSimulateVoice('Paid 25 rupees for Uber ride to airport via UPI')}
              className="text-xs px-2.5 py-1 rounded-lg bg-violet-50 hover:bg-violet-200 text-slate-700 border border-violet-200 transition-colors"
            >
              🚗 Uber ₹25.00
            </button>
            <button
              type="button"
              onClick={() => handleSimulateVoice('Received 1200 rupees freelance client bonus via direct deposit')}
              className="text-xs px-2.5 py-1 rounded-lg bg-violet-50 hover:bg-violet-200 text-slate-700 border border-violet-200 transition-colors"
            >
              💰 Freelance ₹1,200
            </button>
          </div>
        </div>

        {/* Live Spoken Transcript */}
        {transcript && (
          <div className="mb-4 p-3 rounded-xl bg-violet-50 border border-violet-200">
            <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 flex items-center space-x-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Transcribed Speech</span>
            </p>
            <p className="text-xs text-slate-700 font-mono italic">"{transcript}"</p>
          </div>
        )}

        {/* Editable Extracted Confirmation Fields */}
        <form onSubmit={handleConfirmSave} className="space-y-3.5 pt-2 border-t border-violet-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-800">Editable Confirmation:</span>
            <span className="text-[10px] text-emerald-400 font-mono">Review & Edit before saving</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">Amount (₹)</label>
              <input
                type="number"
                step="0.01"
                required
                value={extractedData.amount}
                onChange={e => setExtractedData({ ...extractedData, amount: e.target.value })}
                placeholder="0.00"
                className="w-full px-3 py-2 rounded-xl bg-violet-50 border border-violet-200 text-slate-900 placeholder:text-slate-400 text-sm font-bold focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">Type</label>
              <select
                value={extractedData.type}
                onChange={e => setExtractedData({ ...extractedData, type: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-violet-50 border border-violet-200 text-slate-900 text-sm focus:outline-none focus:border-violet-500"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-700 mb-1">Description / Merchant</label>
            <input
              type="text"
              required
              value={extractedData.description}
              onChange={e => setExtractedData({ ...extractedData, description: e.target.value })}
              placeholder="e.g. Starbucks, Uber, Groceries"
              className="w-full px-3 py-2 rounded-xl bg-violet-50 border border-violet-200 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:border-violet-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">Category</label>
              <select
                value={extractedData.category_name}
                onChange={e => setExtractedData({ ...extractedData, category_name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-violet-50 border border-violet-200 text-slate-900 text-xs focus:outline-none focus:border-violet-500"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">Payment Method</label>
              <select
                value={extractedData.payment_method}
                onChange={e => setExtractedData({ ...extractedData, payment_method: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-violet-50 border border-violet-200 text-slate-900 text-xs focus:outline-none focus:border-violet-500"
              >
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="UPI">UPI / GPay</option>
                <option value="Cash">Cash</option>
                <option value="Direct Deposit">Direct Deposit</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-violet-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold shadow-glow transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Save Transaction</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
