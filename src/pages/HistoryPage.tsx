import React, { useState, useEffect } from 'react';
import { ThreatAssessment, RiskLevel, AnalysisType } from '../types';
import {
  getLocalHistory,
  deleteLocalHistoryItem,
  clearLocalHistory,
} from '../lib/storage/historyStorage';
import {
  History as HistoryIcon,
  Search,
  Filter,
  Trash2,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ShieldX,
  X,
  ArrowUpDown,
  Download,
} from 'lucide-react';
import { AnalysisResultView } from '../components/analysis/AnalysisResultView';

export const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<ThreatAssessment[]>([]);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [selectedScan, setSelectedScan] = useState<ThreatAssessment | null>(null);

  const loadData = () => {
    setHistory(getLocalHistory());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteLocalHistoryItem(id);
    loadData();
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear your local analysis history?')) {
      clearLocalHistory();
      loadData();
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `scamshield_history_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredHistory = history
    .filter((item) => {
      const matchesRisk = riskFilter === 'ALL' || item.riskLevel === riskFilter;
      const matchesType = typeFilter === 'ALL' || item.analysisType === typeFilter;
      const matchesSearch =
        search === '' ||
        (item.inputPreview && item.inputPreview.toLowerCase().includes(search.toLowerCase())) ||
        (item.scamCategory && item.scamCategory.toLowerCase().includes(search.toLowerCase())) ||
        (item.summary && item.summary.toLowerCase().includes(search.toLowerCase()));
      return matchesRisk && matchesType && matchesSearch;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold">
            Audit Records & Threat Logs
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Analysis History
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review past evaluations. Sensitive secrets (OTPs, PINs, card numbers) are automatically redacted.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <>
              <button
                onClick={handleExportJson}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 bg-slate-900 text-slate-300 hover:text-white transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>
              <button
                onClick={handleClearAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-red-900/40 bg-red-950/20 text-red-400 hover:bg-red-950/40 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Controls Bar: Search & Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-xl border border-slate-800 bg-slate-900/60">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search preview, category..."
            className="w-full rounded-lg border border-slate-800 bg-slate-950 pl-8 pr-3 py-2 text-xs text-white placeholder:text-slate-600 focus:border-indigo-500 outline-none"
          />
        </div>

        {/* Risk Filter */}
        <div>
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 outline-none"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="CRITICAL">Critical Risk (75-100)</option>
            <option value="HIGH">High Risk (50-74)</option>
            <option value="MEDIUM">Medium Risk (25-49)</option>
            <option value="LOW">Low Risk (0-24)</option>
          </select>
        </div>

        {/* Vector Filter */}
        <div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 outline-none"
          >
            <option value="ALL">All Vectors</option>
            <option value="message">Messages (SMS/Chat)</option>
            <option value="email">Emails</option>
            <option value="url">URLs & Links</option>
            <option value="payment">Payment & UPI</option>
          </select>
        </div>

        {/* Sort Toggle */}
        <button
          onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-800 bg-slate-950 text-xs text-slate-300 hover:text-white transition"
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span>{sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
        </button>
      </div>

      {/* History Cards List */}
      <div className="space-y-3">
        {filteredHistory.map((scan) => {
          const dateStr = scan.createdAt
            ? new Date(scan.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
            : 'Recent';

          const getRiskColor = (level: RiskLevel) => {
            switch (level) {
              case 'CRITICAL':
                return 'text-red-400 border-red-500/30 bg-red-950/30';
              case 'HIGH':
                return 'text-orange-400 border-orange-500/30 bg-orange-950/30';
              case 'MEDIUM':
                return 'text-amber-400 border-amber-500/30 bg-amber-950/30';
              default:
                return 'text-emerald-400 border-emerald-500/30 bg-emerald-950/30';
            }
          };

          return (
            <div
              key={scan.id}
              onClick={() => setSelectedScan(scan)}
              className="cursor-pointer group flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-indigo-500/40 transition gap-4"
            >
              {/* Left Column: Metadata & Preview */}
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                  <span>{dateStr}</span>
                  <span aria-hidden="true">·</span>
                  <span className="uppercase text-slate-400">{scan.analysisType}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-indigo-300 truncate">{scan.scamCategory}</span>
                </div>
                <p className="text-xs text-slate-200 line-clamp-1 font-mono">
                  {scan.inputPreview || scan.summary}
                </p>
              </div>

              {/* Right Column: Score & Delete */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                <div
                  className={`px-3 py-1 rounded-md border text-xs font-mono font-bold tabular-nums ${getRiskColor(
                    scan.riskLevel
                  )}`}
                >
                  {scan.riskScore}/100 · {scan.riskLevel}
                </div>

                <button
                  onClick={(e) => handleDelete(e, scan.id || '')}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition"
                  title="Delete scan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredHistory.length === 0 && (
          <div className="text-center py-16 rounded-xl border border-slate-800 bg-slate-900/30 text-slate-500 text-xs space-y-2">
            <HistoryIcon className="w-8 h-8 text-slate-600 mx-auto" />
            <p>No analysis records found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedScan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setSelectedScan(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
            <AnalysisResultView
              assessment={selectedScan}
              onReset={() => setSelectedScan(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
