import React, { useState } from 'react';
import { ThreatLibraryItem } from '../types';
import { THREAT_LIBRARY_ITEMS } from '../lib/data/threatLibraryData';
import {
  BookOpen,
  Search,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  X,
  ExternalLink,
  LifeBuoy,
} from 'lucide-react';

interface ThreatLibraryPageProps {
  onTestSnippet?: (snippet: string, type: string) => void;
}

export const ThreatLibraryPage: React.FC<ThreatLibraryPageProps> = ({ onTestSnippet }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeItem, setActiveItem] = useState<ThreatLibraryItem | null>(null);

  const categories = [
    'All',
    'Phishing',
    'UPI Scams',
    'Banking Scams',
    'Job Scams',
    'Delivery Scams',
    'Tech-support Scams',
  ];

  const filteredItems = THREAT_LIBRARY_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      search === '' ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.summary.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold">
          Cyber Defense Knowledge Base
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Threat Intelligence Library
        </h1>
        <p className="text-sm text-slate-400">
          In-depth breakdowns of modern digital scams, deceptive psychological vectors, and concrete counter-measures.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/60">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search scams, vectors, keywords..."
            className="w-full rounded-lg border border-slate-800 bg-slate-950/80 pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-600 focus:border-indigo-500 outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-2 text-slate-500 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Threat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveItem(item)}
            className="cursor-pointer group flex flex-col justify-between p-5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-indigo-500/40 transition shadow-sm space-y-4"
          >
            <div>
              {/* Card Meta Header (Zero-Pill: Clean unboxed text) */}
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-mono">
                <span>{item.category}</span>
                <span
                  className={`font-semibold ${
                    item.severity === 'CRITICAL'
                      ? 'text-red-400'
                      : item.severity === 'HIGH'
                      ? 'text-orange-400'
                      : 'text-amber-400'
                  }`}
                >
                  {item.severity} SEVERITY
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-indigo-200 transition mb-2">
                {item.title}
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                {item.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-indigo-400 font-medium">
              <span>View Anatomy & Protection</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-slate-500 text-sm">
          No threat guides match your search. Try another query or select "All".
        </div>
      )}

      {/* Detailed Modal for Threat Article */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            {/* Close Button */}
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
                <span>{activeItem.category}</span>
                <span aria-hidden="true">·</span>
                <span
                  className={`font-bold ${
                    activeItem.severity === 'CRITICAL'
                      ? 'text-red-400'
                      : activeItem.severity === 'HIGH'
                      ? 'text-orange-400'
                      : 'text-amber-400'
                  }`}
                >
                  {activeItem.severity} RISK TIER
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">{activeItem.title}</h2>
              <p className="text-xs md:text-sm text-slate-300 mt-2 leading-relaxed">
                {activeItem.summary}
              </p>
            </div>

            {/* How it Works */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                How It Works (Mechanics)
              </h3>
              <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-300">
                {activeItem.howItWorks.map((step, idx) => (
                  <li key={idx} className="leading-relaxed">
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Warning Signs */}
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Primary Warning Signs</span>
              </div>
              <ul className="space-y-1 text-xs text-slate-200">
                {activeItem.warningSigns.map((sign, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{sign}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Fictional Realistic Example */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span>Realistic Fictional Scenario</span>
                <span className="font-mono text-[10px] text-slate-500">FOR TRAINING ONLY</span>
              </div>
              <p className="text-xs font-mono text-slate-200 bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                "{activeItem.exampleSnippet}"
              </p>
            </div>

            {/* Prevention & Incident Response */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>How To Stay Safe</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {activeItem.preventionTips.map((tip, idx) => (
                    <li key={idx}>✓ {tip}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                  <LifeBuoy className="w-4 h-4 text-indigo-400" />
                  <span>If You Already Interacted</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {activeItem.incidentResponseSteps.map((step, idx) => (
                    <li key={idx}>• {step}</li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={() => setActiveItem(null)}
              className="w-full py-2.5 rounded-lg text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition"
            >
              Close Article
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
