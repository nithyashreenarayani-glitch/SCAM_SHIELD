import React, { useState } from 'react';
import { AnalysisType, ThreatAssessment } from '../types';
import { SensitiveWarningBanner } from '../components/ui/SensitiveWarningBanner';
import { LoadingScanner } from '../components/ui/LoadingScanner';
import { AnalysisResultView } from '../components/analysis/AnalysisResultView';
import { MessageAnalyzer } from '../components/analysis/MessageAnalyzer';
import { EmailAnalyzer } from '../components/analysis/EmailAnalyzer';
import { UrlAnalyzer } from '../components/analysis/UrlAnalyzer';
import { PaymentAnalyzer } from '../components/analysis/PaymentAnalyzer';
import {
  MessageSquare,
  Mail,
  Globe,
  CreditCard,
  Shield,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../lib/auth/AuthContext';
import {
  saveLocalHistoryItem,
  getGuestAnalysisCount,
  incrementGuestAnalysisCount,
} from '../lib/storage/historyStorage';

interface AnalyzePageProps {
  initialTab?: AnalysisType;
}

export const AnalyzePage: React.FC<AnalyzePageProps> = ({ initialTab = 'message' }) => {
  const { user, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<AnalysisType>(initialTab);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ThreatAssessment | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkGuestLimit = (): boolean => {
    if (user) return true; // authenticated users have unlimited analyses
    const count = getGuestAnalysisCount();
    if (count >= 5) {
      setError(
        'You have completed 5 guest analyses today. Please sign in or create a free account for unlimited scans and cloud history storage.'
      );
      openAuthModal('signup');
      return false;
    }
    return true;
  };

  const handleAnalyzeMessage = async (message: string) => {
    if (!checkGuestLimit()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/analyze/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze message.');
      }
      data.id = 'scan-' + Date.now();
      data.createdAt = new Date().toISOString();
      data.analysisType = 'message';
      setResult(data);
      saveLocalHistoryItem(data);
      if (!user) incrementGuestAnalysisCount();
    } catch (err: any) {
      setError(err.message || 'Unable to connect to analysis engine. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeEmail = async (payload: {
    sender: string;
    subject: string;
    body: string;
    links: string[];
  }) => {
    if (!checkGuestLimit()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/analyze/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze email.');
      }
      data.id = 'scan-' + Date.now();
      data.createdAt = new Date().toISOString();
      data.analysisType = 'email';
      setResult(data);
      saveLocalHistoryItem(data);
      if (!user) incrementGuestAnalysisCount();
    } catch (err: any) {
      setError(err.message || 'Unable to analyze email.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeUrl = async (url: string) => {
    if (!checkGuestLimit()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/analyze/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to inspect URL.');
      }
      data.id = 'scan-' + Date.now();
      data.createdAt = new Date().toISOString();
      data.analysisType = 'url';
      setResult(data);
      saveLocalHistoryItem(data);
      if (!user) incrementGuestAnalysisCount();
    } catch (err: any) {
      setError(err.message || 'Unable to inspect URL.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzePayment = async (payload: {
    paymentText: string;
    upiId: string;
    requestedAmount: string;
  }) => {
    if (!checkGuestLimit()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/analyze/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to inspect payment request.');
      }
      data.id = 'scan-' + Date.now();
      data.createdAt = new Date().toISOString();
      data.analysisType = 'payment';
      setResult(data);
      saveLocalHistoryItem(data);
      if (!user) incrementGuestAnalysisCount();
    } catch (err: any) {
      setError(err.message || 'Unable to inspect payment request.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  const tabs = [
    { id: 'message' as AnalysisType, label: 'Message', icon: MessageSquare, desc: 'SMS, WhatsApp, DMs' },
    { id: 'email' as AnalysisType, label: 'Email', icon: Mail, desc: 'Phishing & Spoofing' },
    { id: 'url' as AnalysisType, label: 'URL', icon: Globe, desc: 'Domains & Links' },
    { id: 'payment' as AnalysisType, label: 'Payment Request', icon: CreditCard, desc: 'UPI & QR Fraud' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Section (Exact Requirement 5) */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Is this a scam?
        </h1>
        <p className="text-sm sm:text-base text-slate-400">
          Paste suspicious content below and let ScamShield analyze the warning signs.
        </p>
      </div>

      {/* Sensitive Credentials Warning Banner */}
      <SensitiveWarningBanner />

      {/* Error notification if any */}
      {error && (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-950/30 text-red-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <div className="flex-1">{error}</div>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-200 font-bold px-2 py-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Analysis Container or Result View */}
      {loading ? (
        <LoadingScanner />
      ) : result ? (
        <AnalysisResultView assessment={result} onReset={handleReset} />
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 md:p-8 shadow-xl">
          {/* Tabs Navigation (Functional segmented button controls) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 rounded-xl bg-slate-950 border border-slate-800 mb-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setError(null);
                  }}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Tab Analyzer Content */}
          <div className="pt-2">
            {activeTab === 'message' && (
              <MessageAnalyzer onAnalyze={handleAnalyzeMessage} isLoading={loading} />
            )}
            {activeTab === 'email' && (
              <EmailAnalyzer onAnalyze={handleAnalyzeEmail} isLoading={loading} />
            )}
            {activeTab === 'url' && (
              <UrlAnalyzer onAnalyze={handleAnalyzeUrl} isLoading={loading} />
            )}
            {activeTab === 'payment' && (
              <PaymentAnalyzer onAnalyze={handleAnalyzePayment} isLoading={loading} />
            )}
          </div>
        </div>
      )}

      {/* Guest Status Notice if not logged in */}
      {!user && !result && !loading && (
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            <span className="font-semibold text-slate-300">Guest Mode Active: </span>
            You can run up to 5 scans per day as a guest. Create a free account to unlock cloud history and unlimited analysis.
          </div>
          <button
            onClick={() => openAuthModal('signup')}
            className="whitespace-nowrap px-3.5 py-1.5 rounded-lg text-xs font-semibold text-indigo-300 bg-indigo-950/60 border border-indigo-500/30 hover:bg-indigo-900/40 transition"
          >
            Create Free Account
          </button>
        </div>
      )}
    </div>
  );
};
