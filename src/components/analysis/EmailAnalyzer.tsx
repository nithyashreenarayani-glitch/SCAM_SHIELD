import React, { useState } from 'react';
import { Mail, ShieldAlert, Sparkles, Send, Link as LinkIcon } from 'lucide-react';
import { DEMO_SAMPLES } from '../../lib/data/demoSamples';

interface EmailAnalyzerProps {
  onAnalyze: (payload: { sender: string; subject: string; body: string; links: string[] }) => Promise<void>;
  isLoading: boolean;
}

export const EmailAnalyzer: React.FC<EmailAnalyzerProps> = ({ onAnalyze, isLoading }) => {
  const [sender, setSender] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [linksText, setLinksText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) {
      setError('Please provide the email body text to analyze.');
      return;
    }
    setError(null);
    const links = linksText
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    onAnalyze({ sender, subject, body, links });
  };

  const handleLoadSample = () => {
    const s = DEMO_SAMPLES.find((item) => item.id === 'demo-email-executive-spoof');
    if (s) {
      setSender(s.metadata?.senderEmail || '');
      setSubject(s.metadata?.subject || '');
      setBody(s.content);
      setLinksText((s.metadata?.detectedLinks || []).join('\n'));
      setError(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Mail className="w-4 h-4 text-indigo-400" />
          <span>Email Phishing & Spoofing Inspector</span>
        </span>

        <button
          type="button"
          onClick={handleLoadSample}
          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Load Corporate Phishing Sample</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            Sender Email Address (or Display Name)
          </label>
          <input
            type="text"
            value={sender}
            onChange={(e) => setSender(e.target.value)}
            placeholder="e.g. security-team@account-alert-update.com"
            className="w-full rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            Email Subject Line
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. URGENT: Your password expires in 2 hours"
            className="w-full rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-medium text-slate-400 mb-1">
          Email Body Text (Mandatory)
        </label>
        <textarea
          rows={5}
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Paste the email message body here..."
          className="w-full rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
          <LinkIcon className="w-3 h-3 text-slate-400" />
          <span>Detected Hyperlinks Inside Email (Optional, one per line)</span>
        </label>
        <textarea
          rows={2}
          value={linksText}
          onChange={(e) => setLinksText(e.target.value)}
          placeholder="https://acme-sso-verify.org/portal/login"
          className="w-full rounded-lg border border-slate-800 bg-slate-950/70 p-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 outline-none font-mono"
        />
      </div>

      {error && (
        <div className="text-xs text-red-400 flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <span className="text-[11px] text-slate-500">
          Checks for credential theft, urgency, brand spoofing, and malicious links.
        </span>

        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-98 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-600/20"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isLoading ? 'Inspecting Email...' : 'Analyze Email'}</span>
        </button>
      </div>
    </form>
  );
};
