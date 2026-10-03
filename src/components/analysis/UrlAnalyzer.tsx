import React, { useState, useEffect } from 'react';
import { Globe, ShieldAlert, Sparkles, Send, ExternalLink, Check, AlertCircle } from 'lucide-react';
import { analyzeUrlCharacteristics, UrlCharacteristics } from '../../lib/security/urlAnalyzer';
import { DEMO_SAMPLES } from '../../lib/data/demoSamples';

interface UrlAnalyzerProps {
  onAnalyze: (url: string) => Promise<void>;
  isLoading: boolean;
}

export const UrlAnalyzer: React.FC<UrlAnalyzerProps> = ({ onAnalyze, isLoading }) => {
  const [url, setUrl] = useState('');
  const [liveHeuristics, setLiveHeuristics] = useState<UrlCharacteristics | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (url.trim().length > 3) {
      const parsed = analyzeUrlCharacteristics(url);
      setLiveHeuristics(parsed);
    } else {
      setLiveHeuristics(null);
    }
  }, [url]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please enter a website URL to inspect.');
      return;
    }
    setError(null);
    onAnalyze(url);
  };

  const handleLoadSample = (sampleUrl: string) => {
    setUrl(sampleUrl);
    setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-indigo-400" />
          <span>Suspicious Link & Domain Inspector</span>
        </label>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleLoadSample('http://192.168.1.100/verify-account/hdfc-secure-banking-login.php?session=92812')}
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load IP Phishing Link</span>
          </button>
          <span className="text-slate-600">·</span>
          <button
            type="button"
            onClick={() => handleLoadSample('https://sbi-secure-update-kyc.top/online/login.html')}
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Lookalike Domain
          </button>
        </div>
      </div>

      <div className="relative">
        <input
          type="text"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (error) setError(null);
          }}
          placeholder="https://example-banking-verification.com/login"
          className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 font-mono outline-none transition"
        />
      </div>

      {/* Live Static Indicators Preview */}
      {liveHeuristics && liveHeuristics.isValid && (
        <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/50 space-y-2">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Client-Side Static Heuristics</span>
            <span className="font-mono text-indigo-400">{liveHeuristics.hostname}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-500 block text-[10px]">Protocol</span>
              <span className={`font-mono font-semibold ${liveHeuristics.protocol === 'https' ? 'text-emerald-400' : 'text-amber-400'}`}>
                {liveHeuristics.protocol?.toUpperCase() || 'UNKNOWN'}
              </span>
            </div>

            <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-500 block text-[10px]">IP Hostname</span>
              <span className={`font-mono font-semibold ${liveHeuristics.isIpAddress ? 'text-red-400' : 'text-emerald-400'}`}>
                {liveHeuristics.isIpAddress ? 'YES (SUSPICIOUS)' : 'NO (DOMAIN)'}
              </span>
            </div>

            <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-500 block text-[10px]">Subdomains</span>
              <span className={`font-mono font-semibold ${(liveHeuristics.subdomainCount || 0) >= 3 ? 'text-orange-400' : 'text-slate-200'}`}>
                {liveHeuristics.subdomainCount || 0} Level(s)
              </span>
            </div>

            <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-500 block text-[10px]">Shortened URL</span>
              <span className={`font-mono font-semibold ${liveHeuristics.isShortened ? 'text-amber-400' : 'text-slate-200'}`}>
                {liveHeuristics.isShortened ? 'YES' : 'NO'}
              </span>
            </div>
          </div>

          {liveHeuristics.indicators.length > 0 && (
            <div className="pt-1 space-y-1">
              {liveHeuristics.indicators.map((ind, i) => (
                <div key={i} className="text-[11px] text-amber-300 flex items-start gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-400 mt-0.5" />
                  <span>{ind}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="text-xs text-red-400 flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <span className="text-[11px] text-slate-500">
          ScamShield inspects domain structure defensively without making outbound web connections.
        </span>

        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-98 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-600/20"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isLoading ? 'Evaluating URL...' : 'Analyze URL'}</span>
        </button>
      </div>
    </form>
  );
};
