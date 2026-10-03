import React from 'react';
import {
  Shield,
  ShieldAlert,
  AlertTriangle,
  ArrowRight,
  MessageSquare,
  Mail,
  Globe,
  CreditCard,
  Lock,
  Brain,
  CheckCircle2,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import heroCyberImage from '../assets/images/scamshield_hero_cyber_1790952790605.jpg';

interface LandingPageProps {
  onNavigate: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-20 pb-12">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-indigo-500/20 bg-indigo-950/30 text-indigo-300 text-xs font-mono font-medium">
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
                <span>AI-Powered Defensive Cybersecurity</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight text-balance">
                  SCAMSHIELD
                </h1>
                <p className="text-2xl sm:text-3xl font-bold text-slate-200 tracking-tight">
                  Don't let scammers fool you.
                </p>
                <p className="text-base sm:text-lg text-slate-400 max-w-xl leading-relaxed">
                  AI-powered protection against phishing, scams, malicious links and social engineering attacks.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('analyze')}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-98 transition shadow-lg shadow-indigo-600/25"
                >
                  <span>Analyze a Scam</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('threats')}
                  className="px-6 py-3 rounded-xl text-sm font-semibold text-slate-200 bg-slate-900 border border-slate-700 hover:bg-slate-800 transition"
                >
                  Explore Threats
                </button>

                <button
                  onClick={() => onNavigate('simulator')}
                  className="px-4 py-3 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition flex items-center gap-1"
                >
                  <span>Take Scam Quiz</span>
                  <span aria-hidden="true">→</span>
                </button>
              </div>

              {/* Zero Fake Claims / Authentic Trust Markers */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>Credential Redaction</span>
                </div>
                <span aria-hidden="true" className="text-slate-700">·</span>
                <div className="flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-indigo-400" />
                  <span>Multi-Vector AI Analysis</span>
                </div>
                <span aria-hidden="true" className="text-slate-700">·</span>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span>Defensive Advisory</span>
                </div>
              </div>
            </div>

            {/* Right Hero Card Visual (Exact Requirement 3 Specification) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-md space-y-5">
                {/* Header of Card */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                      Live Threat Assessment
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">ID: SEC-8921-X</span>
                </div>

                {/* Score & Badge */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div>
                    <div className="text-[11px] text-slate-400 uppercase font-semibold">
                      Threat Risk Score
                    </div>
                    <div className="text-3xl font-extrabold font-mono tabular-nums text-white">
                      87 <span className="text-sm font-normal text-slate-500">/ 100</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/40 bg-red-950/50 text-red-400 font-bold text-xs">
                    <ShieldAlert className="w-4 h-4 text-red-400" />
                    <span>HIGH RISK</span>
                  </div>
                </div>

                {/* Detected Warning Signs (Prompt Requirement 3 items) */}
                <div className="space-y-2">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Detected Indicators
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-950/50 border border-slate-800/80 text-amber-300">
                      <span className="text-amber-400 font-bold">⚠</span>
                      <span>Urgency manipulation</span>
                    </div>
                    <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-950/50 border border-slate-800/80 text-amber-300">
                      <span className="text-amber-400 font-bold">⚠</span>
                      <span>Suspicious payment request</span>
                    </div>
                    <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-950/50 border border-slate-800/80 text-amber-300">
                      <span className="text-amber-400 font-bold">⚠</span>
                      <span>Malicious-looking URL</span>
                    </div>
                    <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-950/50 border border-slate-800/80 text-amber-300">
                      <span className="text-amber-400 font-bold">⚠</span>
                      <span>Impersonation attempt</span>
                    </div>
                  </div>
                </div>

                {/* Quick Interactive Demo Trigger */}
                <button
                  onClick={() => onNavigate('analyze')}
                  className="w-full py-2.5 rounded-lg text-xs font-semibold text-center text-indigo-300 bg-indigo-950/40 border border-indigo-500/30 hover:bg-indigo-900/40 transition"
                >
                  Test Your Content in Analyzer →
                </button>
              </div>

              {/* Atmospheric Background Image container with Fallback */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 -z-10 blur-xl opacity-60" />
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Analysis Vectors */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold">
            Universal Defense Coverage
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Specialized Analyzers for Every Attack Vector
          </h2>
          <p className="text-sm text-slate-400">
            From SMS smishing and job scams to deceptive UPI collect requests and clone domains.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Message */}
          <div
            onClick={() => onNavigate('analyze')}
            className="cursor-pointer group p-5 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-indigo-500/40 transition space-y-3"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-indigo-200 transition">
              Message Analyzer
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Examine SMS, WhatsApp messages, Telegram offers, and social media DMs for psychological coercion and fake alerts.
            </p>
            <div className="text-xs font-semibold text-indigo-400 flex items-center gap-1 pt-1">
              <span>Scan Messages</span>
              <span aria-hidden="true">→</span>
            </div>
          </div>

          {/* Card 2: Email */}
          <div
            onClick={() => onNavigate('analyze')}
            className="cursor-pointer group p-5 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-indigo-500/40 transition space-y-3"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-indigo-200 transition">
              Email Phishing
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Scrutinize sender identities, subject urgency, credential harvest links, and brand impersonation.
            </p>
            <div className="text-xs font-semibold text-indigo-400 flex items-center gap-1 pt-1">
              <span>Inspect Email</span>
              <span aria-hidden="true">→</span>
            </div>
          </div>

          {/* Card 3: URL */}
          <div
            onClick={() => onNavigate('analyze')}
            className="cursor-pointer group p-5 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-indigo-500/40 transition space-y-3"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-indigo-200 transition">
              URL & Domain Inspector
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Analyze raw IP domains, lookalike characters, punycode, excessive subdomains, and URL shortener destinations.
            </p>
            <div className="text-xs font-semibold text-indigo-400 flex items-center gap-1 pt-1">
              <span>Evaluate URL</span>
              <span aria-hidden="true">→</span>
            </div>
          </div>

          {/* Card 4: Payment */}
          <div
            onClick={() => onNavigate('analyze')}
            className="cursor-pointer group p-5 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-indigo-500/40 transition space-y-3"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-indigo-200 transition">
              Payment & UPI Fraud
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Detect fake cashback, reverse payment traps, test debits, and unauthorized QR code authorization requests.
            </p>
            <div className="text-xs font-semibold text-indigo-400 flex items-center gap-1 pt-1">
              <span>Check Payment</span>
              <span aria-hidden="true">→</span>
            </div>
          </div>
        </div>
      </section>

      {/* Transparent Scoring System Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold">
                Transparent Evaluation Framework
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-white mt-1">
                How ScamShield Calculates Risk
              </h3>
            </div>
            <p className="text-xs text-slate-400 max-w-md">
              Scores are never arbitrary. ScamShield evaluates multiple concrete deception signals: credential requests, urgency markers, and domain architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-emerald-500/20">
              <div className="text-xs font-mono font-bold text-emerald-400 mb-1">0 – 24 · LOW RISK</div>
              <p className="text-xs text-slate-300">
                Benign or standard transactional notification without high-risk indicators or coercive demands.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-amber-500/20">
              <div className="text-xs font-mono font-bold text-amber-400 mb-1">25 – 49 · MEDIUM RISK</div>
              <p className="text-xs text-slate-300">
                Vague requests, unverified external links, or mild urgency warranting independent verification.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-orange-500/20">
              <div className="text-xs font-mono font-bold text-orange-400 mb-1">50 – 74 · HIGH RISK</div>
              <p className="text-xs text-slate-300">
                Impersonation of banks, credential harvest portals, or severe threats of penalties/suspensions.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-red-500/20">
              <div className="text-xs font-mono font-bold text-red-400 mb-1">75 – 100 · CRITICAL RISK</div>
              <p className="text-xs text-slate-300">
                Direct OTP/PIN requests, unauthorized QR scans, or remote desktop app download instructions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Simulator Highlight Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-8 rounded-2xl border border-indigo-500/30 bg-indigo-950/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-left">
            <div className="text-xs font-mono uppercase text-indigo-400 font-semibold">
              Interactive Cybersecurity Training
            </div>
            <h3 className="text-2xl font-bold text-white">Can You Spot the Scam?</h3>
            <p className="text-xs md:text-sm text-slate-300 max-w-xl">
              Test your threat awareness against realistic fictional scenarios. Learn the difference between safe verification and common trap choices.
            </p>
          </div>

          <button
            onClick={() => onNavigate('simulator')}
            className="whitespace-nowrap px-6 py-3 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/30"
          >
            Launch Scam Simulator
          </button>
        </div>
      </section>
    </div>
  );
};
