import React, { useEffect, useState } from 'react';
import { Search, Brain, Shield, BarChart3, Loader2 } from 'lucide-react';

interface LoadingScannerProps {
  label?: string;
}

const SCAN_STEPS = [
  { text: 'Inspecting content & sanitizing inputs...', icon: Search },
  { text: 'Identifying social engineering patterns...', icon: Brain },
  { text: 'Evaluating threat heuristics & indicators...', icon: Shield },
  { text: 'Generating comprehensive security assessment...', icon: BarChart3 },
];

export const LoadingScanner: React.FC<LoadingScannerProps> = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < SCAN_STEPS.length - 1 ? prev + 1 : prev));
    }, 650);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
      <div className="relative flex items-center justify-center mb-6">
        <div className="w-16 h-16 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
        <Loader2 className="absolute w-8 h-8 text-indigo-400 animate-pulse" />
      </div>

      <h3 className="text-lg font-semibold text-white mb-2">Analyzing Threat Vector</h3>
      <p className="text-sm text-slate-400 max-w-md mb-6">
        ScamShield AI engine is inspecting syntactic, psychological, and technical deception markers.
      </p>

      {/* Stepper items */}
      <div className="w-full max-w-sm space-y-2.5">
        {SCAN_STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isActive = idx === currentStep;
          const isDone = idx < currentStep;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-indigo-950/40 border border-indigo-500/40 text-indigo-200'
                  : isDone
                  ? 'bg-slate-900/40 border border-slate-800 text-emerald-400'
                  : 'text-slate-500 border border-transparent'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? 'text-indigo-400 animate-bounce' : isDone ? 'text-emerald-400' : 'text-slate-600'
                }`}
              />
              <span className="truncate">{step.text}</span>
              {isDone && <span className="ml-auto text-emerald-400 font-mono text-[10px]">✓ DONE</span>}
              {isActive && <span className="ml-auto text-indigo-400 font-mono text-[10px] animate-pulse">RUNNING...</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};
