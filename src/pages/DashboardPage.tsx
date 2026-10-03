import React, { useMemo } from 'react';
import { getLocalHistory } from '../lib/storage/historyStorage';
import { ThreatAssessment, RiskLevel } from '../types';
import {
  Activity,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ShieldX,
  PieChart,
  BarChart2,
  TrendingUp,
  PlusCircle,
  ExternalLink,
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const history = useMemo(() => getLocalHistory(), []);

  // Compute real statistics based strictly on stored analyses
  const stats = useMemo(() => {
    const total = history.length;
    let critical = 0;
    let high = 0;
    let medium = 0;
    let low = 0;
    let scoreSum = 0;
    const catMap: { [cat: string]: number } = {};

    history.forEach((scan) => {
      scoreSum += scan.riskScore || 0;
      if (scan.riskLevel === 'CRITICAL') critical++;
      else if (scan.riskLevel === 'HIGH') high++;
      else if (scan.riskLevel === 'MEDIUM') medium++;
      else low++;

      const cat = scan.scamCategory || 'Uncategorized';
      catMap[cat] = (catMap[cat] || 0) + 1;
    });

    let mostCommonCategory = 'None yet';
    let maxCatCount = 0;
    Object.entries(catMap).forEach(([c, cnt]) => {
      if (cnt > maxCatCount) {
        maxCatCount = cnt;
        mostCommonCategory = c;
      }
    });

    const averageRisk = total > 0 ? Math.round(scoreSum / total) : 0;

    return {
      total,
      critical,
      high,
      medium,
      low,
      averageRisk,
      mostCommonCategory,
      categories: Object.entries(catMap).map(([category, count]) => ({
        category,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      })),
    };
  }, [history]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold">
            Telemetry & Threat Intelligence
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Security Intelligence Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Metrics aggregated exclusively from your verified local and cloud analysis history.
          </p>
        </div>

        <button
          onClick={() => onNavigate('analyze')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Threat Scan</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Analyses */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1">
          <div className="text-[11px] font-mono uppercase text-slate-400">Total Scans</div>
          <div className="text-2xl md:text-3xl font-extrabold font-mono tabular-nums text-white">
            {stats.total}
          </div>
          <div className="text-[11px] text-slate-500">Evaluated forensic items</div>
        </div>

        {/* High & Critical Risk */}
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-950/20 space-y-1">
          <div className="text-[11px] font-mono uppercase text-red-400 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>High & Critical</span>
          </div>
          <div className="text-2xl md:text-3xl font-extrabold font-mono tabular-nums text-red-400">
            {stats.critical + stats.high}
          </div>
          <div className="text-[11px] text-red-300/70">
            {stats.total > 0
              ? `${Math.round(((stats.critical + stats.high) / stats.total) * 100)}% of total volume`
              : '0%'}
          </div>
        </div>

        {/* Medium Risk */}
        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-950/20 space-y-1">
          <div className="text-[11px] font-mono uppercase text-amber-400 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Medium Risk</span>
          </div>
          <div className="text-2xl md:text-3xl font-extrabold font-mono tabular-nums text-amber-400">
            {stats.medium}
          </div>
          <div className="text-[11px] text-amber-300/70">Require manual verification</div>
        </div>

        {/* Low Risk / Benign */}
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/20 space-y-1">
          <div className="text-[11px] font-mono uppercase text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Low Risk</span>
          </div>
          <div className="text-2xl md:text-3xl font-extrabold font-mono tabular-nums text-emerald-400">
            {stats.low}
          </div>
          <div className="text-[11px] text-emerald-300/70">Nominal indicators</div>
        </div>
      </div>

      {stats.total === 0 ? (
        /* Empty State */
        <div className="text-center py-16 rounded-2xl border border-slate-800 bg-slate-900/40 p-8 space-y-4">
          <Activity className="w-10 h-10 text-slate-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">No Analyses Recorded Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Scan your first suspicious message, email, or UPI request to generate real threat metrics.
            </p>
          </div>
          <button
            onClick={() => onNavigate('analyze')}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500"
          >
            Launch First Analysis
          </button>
        </div>
      ) : (
        /* Populated Analytics */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Risk Level Distribution Chart */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-indigo-400" />
                <span>Risk Level Breakdown</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Avg Score: {stats.averageRisk}/100
              </span>
            </div>

            <div className="space-y-3 pt-2">
              {/* Critical */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-red-400 font-semibold">Critical Risk (75-100)</span>
                  <span className="font-mono text-slate-400">{stats.critical}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-red-500 transition-all duration-500"
                    style={{
                      width: `${stats.total > 0 ? (stats.critical / stats.total) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              {/* High */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-orange-400 font-semibold">High Risk (50-74)</span>
                  <span className="font-mono text-slate-400">{stats.high}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-orange-500 transition-all duration-500"
                    style={{
                      width: `${stats.total > 0 ? (stats.high / stats.total) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              {/* Medium */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-amber-400 font-semibold">Medium Risk (25-49)</span>
                  <span className="font-mono text-slate-400">{stats.medium}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 transition-all duration-500"
                    style={{
                      width: `${stats.total > 0 ? (stats.medium / stats.total) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              {/* Low */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-emerald-400 font-semibold">Low Risk (0-24)</span>
                  <span className="font-mono text-slate-400">{stats.low}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-500"
                    style={{
                      width: `${stats.total > 0 ? (stats.low / stats.total) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Scam Category Breakdown */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-indigo-400" />
                <span>Detected Scam Categories</span>
              </div>
              <span className="text-[11px] text-slate-400 truncate max-w-[150px]">
                Top: {stats.mostCommonCategory}
              </span>
            </div>

            <div className="space-y-3 pt-2">
              {stats.categories.map((cat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 truncate max-w-[200px]">{cat.category}</span>
                    <span className="font-mono tabular-nums text-slate-400">
                      {cat.count} scan{cat.count > 1 ? 's' : ''} ({cat.percentage}%)
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 transition-all duration-500"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity Mini-Feed */}
      {history.length > 0 && (
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Recent Threat Audit Stream
            </h3>
            <button
              onClick={() => onNavigate('history')}
              className="text-xs text-indigo-400 hover:text-indigo-300"
            >
              View Full History →
            </button>
          </div>

          <div className="divide-y divide-slate-800/60">
            {history.slice(0, 4).map((item) => (
              <div
                key={item.id}
                onClick={() => onNavigate('history')}
                className="py-2.5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-800/30 px-2 rounded-lg transition"
              >
                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-200 truncate">
                    {item.scamCategory}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono truncate">
                    {item.inputPreview}
                  </div>
                </div>

                <div className="text-xs font-mono font-bold tabular-nums text-slate-300">
                  {item.riskScore}/100
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
