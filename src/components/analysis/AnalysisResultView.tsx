import React, { useState } from 'react';
import { ThreatAssessment } from '../../types';
import { RiskGauge } from '../ui/RiskGauge';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Share2,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  Brain,
  Eye,
  Info,
} from 'lucide-react';
import { saveLocalHistoryItem } from '../../lib/storage/historyStorage';

interface AnalysisResultViewProps {
  assessment: ThreatAssessment;
  onReset: () => void;
}

export const AnalysisResultView: React.FC<AnalysisResultViewProps> = ({ assessment, onReset }) => {
  const [simpleMode, setSimpleMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleCopy = () => {
    const reportText = `
=== SCAMSHIELD THREAT ASSESSMENT ===
Risk Score: ${assessment.riskScore}/100 (${assessment.riskLevel} RISK)
Category: ${assessment.scamCategory}
Confidence: ${assessment.confidence}%

Summary:
${assessment.summary}

Warning Signs:
${assessment.warningSigns.map((w) => `• [${w.indicator}]: ${w.explanation}`).join('\n')}

Social Engineering Tactics:
${assessment.socialEngineeringTactics.map((t) => `• ${t.tactic}: ${t.explanation}`).join('\n')}

What You Should Do:
${assessment.recommendedActions.map((a) => `✓ ${a}`).join('\n')}

What NOT To Do:
${assessment.avoidActions.map((a) => `✕ ${a}`).join('\n')}

Safe Verification:
${assessment.safeInterpretation}
====================================
    `.trim();

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    saveLocalHistoryItem(assessment);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Banner & Mode Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold">
            Security Evaluation Complete
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Threat Assessment Report
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Plain Language Toggle */}
          <button
            onClick={() => setSimpleMode(!simpleMode)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              simpleMode
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>Explain for Beginners</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 hover:text-indigo-200 transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{saved ? 'Saved!' : 'Save Scan'}</span>
          </button>
        </div>
      </div>

      {/* Primary Threat Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-xl border border-slate-800 bg-slate-900/70 shadow-xl">
        {/* Left Column: Gauge */}
        <div className="flex flex-col items-center justify-center md:border-r md:border-slate-800 pr-0 md:pr-4">
          <RiskGauge
            score={assessment.riskScore}
            riskLevel={assessment.riskLevel}
            confidence={assessment.confidence}
            size="lg"
          />
          <p className="mt-2 text-[11px] text-slate-500 text-center max-w-[200px]">
            ScamShield algorithmic score based on verifiable deceptive signals.
          </p>
        </div>

        {/* Right Columns: Summary & Explanations */}
        <div className="md:col-span-2 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-slate-300">Category:</span>
              <span className="text-indigo-300 font-medium">{assessment.scamCategory}</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{assessment.analysisType} Analysis</span>
            </div>

            {/* Beginner Mode Card vs Technical Mode */}
            {simpleMode ? (
              <div className="mt-3 p-4 rounded-lg bg-indigo-950/30 border border-indigo-500/30 text-indigo-100 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  Plain English Explanation
                </div>
                <p className="text-sm leading-relaxed text-indigo-100">
                  {assessment.simpleExplanation ||
                    'This message is suspicious because it is trying to frighten you into acting quickly. Genuine organizations will never shut down your account without verified warning or ask for secret PINs and passwords.'}
                </p>
              </div>
            ) : (
              <div className="mt-3 space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                  Executive Summary
                </h3>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {assessment.summary}
                </p>
              </div>
            )}
          </div>

          {/* Safe Interpretation Box */}
          {assessment.safeInterpretation && (
            <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200">Verification Context: </span>
                {assessment.safeInterpretation}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Warning Signs & Social Engineering Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Warning Signs */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Detected Warning Signs ({assessment.warningSigns.length})
            </h3>
          </div>

          <div className="space-y-3">
            {assessment.warningSigns.map((sign, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-950/40 border border-slate-800/80">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300 mb-1">
                  <span>⚠</span>
                  <span>{sign.indicator}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{sign.explanation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Social Engineering Tactics */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Brain className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Social Engineering Manipulation ({assessment.socialEngineeringTactics.length})
            </h3>
          </div>

          <div className="space-y-3">
            {assessment.socialEngineeringTactics.map((tactic, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-950/40 border border-slate-800/80">
                <div className="text-xs font-bold text-purple-300 mb-1">
                  {tactic.tactic}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{tactic.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Plan: What To Do vs What NOT To Do */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recommended Actions */}
        <div className="p-5 rounded-xl border border-emerald-900/30 bg-emerald-950/10 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 border-b border-emerald-900/30 pb-2">
            <CheckCircle2 className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              What You Should Do (Recommended)
            </h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-200">
            {assessment.recommendedActions.map((action, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold shrink-0">✓</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Avoid Actions */}
        <div className="p-5 rounded-xl border border-red-900/30 bg-red-950/10 space-y-3">
          <div className="flex items-center gap-2 text-red-400 border-b border-red-900/30 pb-2">
            <XCircle className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-red-300">
              What NOT To Do (Strict Prohibitions)
            </h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-200">
            {assessment.avoidActions.map((action, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-red-400 font-bold shrink-0">✕</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Uncertainties & Context */}
      {assessment.uncertainties && assessment.uncertainties.length > 0 && (
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 text-xs text-slate-400">
          <span className="font-semibold text-slate-300">Assessment Caveats & Uncertainties: </span>
          {assessment.uncertainties.join(' · ')}
        </div>
      )}

      {/* Bottom Action Footer */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Analyze Another Item</span>
        </button>

        <span className="text-xs text-slate-500">
          ScamShield is an educational advisory tool. Always independently confirm with verified institutions.
        </span>
      </div>
    </div>
  );
};
