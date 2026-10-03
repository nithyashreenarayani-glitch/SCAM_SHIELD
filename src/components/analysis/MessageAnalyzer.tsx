import React, { useState } from 'react';
import { DEMO_SAMPLES } from '../../lib/data/demoSamples';
import { MessageSquare, ShieldAlert, Sparkles, Send } from 'lucide-react';

interface MessageAnalyzerProps {
  onAnalyze: (message: string) => Promise<void>;
  isLoading: boolean;
}

export const MessageAnalyzer: React.FC<MessageAnalyzerProps> = ({ onAnalyze, isLoading }) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Please paste suspicious message text to analyze.');
      return;
    }
    setError(null);
    onAnalyze(content);
  };

  const handleSelectSample = (sampleId: string) => {
    const s = DEMO_SAMPLES.find((item) => item.id === sampleId);
    if (s) {
      setContent(s.content);
      setError(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4 text-indigo-400" />
          <span>Suspicious Message Content</span>
        </label>

        {/* Example Presets */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Try Fictional Sample:</span>
          <select
            onChange={(e) => {
              if (e.target.value) handleSelectSample(e.target.value);
            }}
            defaultValue=""
            className="text-xs bg-slate-900 border border-slate-700 rounded-md px-2.5 py-1 text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="" disabled>
              Select Example Scam
            </option>
            <option value="demo-sbi-phishing">Bank KYC Account Suspension</option>
            <option value="demo-delivery-reschedule">Courier Delivery Fee Request</option>
            <option value="demo-fake-job-telegram">Lucrative Telegram Job Offer</option>
          </select>
        </div>
      </div>

      <div className="relative">
        <textarea
          rows={6}
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Paste the suspicious message here... e.g. 'Your SBI account will be blocked today. Verify immediately by clicking https://...'"
          className="w-full rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
        />
        <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
          <span>SMS · WhatsApp · Instagram DM · Telegram · Messenger</span>
          <span className="font-mono tabular-nums">{content.length} / 10,000 chars</span>
        </div>
      </div>

      {error && (
        <div className="text-xs text-red-400 flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => handleSelectSample('demo-sbi-phishing')}
          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Load Bank Phishing Sample</span>
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-98 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-600/20"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isLoading ? 'Scanning Message...' : 'Analyze Message'}</span>
        </button>
      </div>
    </form>
  );
};
