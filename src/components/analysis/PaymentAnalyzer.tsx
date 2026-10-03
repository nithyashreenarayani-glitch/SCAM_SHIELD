import React, { useState } from 'react';
import { CreditCard, ShieldAlert, Sparkles, Send, QrCode, AlertOctagon } from 'lucide-react';
import { DEMO_SAMPLES } from '../../lib/data/demoSamples';

interface PaymentAnalyzerProps {
  onAnalyze: (payload: { paymentText: string; upiId: string; requestedAmount: string }) => Promise<void>;
  isLoading: boolean;
}

export const PaymentAnalyzer: React.FC<PaymentAnalyzerProps> = ({ onAnalyze, isLoading }) => {
  const [paymentText, setPaymentText] = useState('');
  const [upiId, setUpiId] = useState('');
  const [requestedAmount, setRequestedAmount] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentText.trim()) {
      setError('Please paste the payment message, QR request, or transaction alert.');
      return;
    }
    setError(null);
    onAnalyze({ paymentText, upiId, requestedAmount });
  };

  const handleLoadSample = () => {
    const s = DEMO_SAMPLES.find((item) => item.id === 'demo-upi-cashback');
    if (s) {
      setPaymentText(s.content);
      setUpiId(s.metadata?.upiId || '');
      setRequestedAmount(s.metadata?.requestedAmount || '');
      setError(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Explicit UPI Safety Rule Callout */}
      <div className="p-3.5 rounded-lg border border-red-500/30 bg-red-950/20 text-red-200 text-xs flex items-start gap-2.5">
        <AlertOctagon className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-red-300">Golden UPI Rule: </span>
          You <span className="underline font-semibold">NEVER</span> need to enter your UPI PIN or scan a QR code to receive money. Entering your PIN always debits funds from your bank.
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <CreditCard className="w-4 h-4 text-indigo-400" />
          <span>Payment & UPI Collect Fraud Detector</span>
        </span>

        <button
          type="button"
          onClick={handleLoadSample}
          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Load UPI Cashback Sample</span>
        </button>
      </div>

      <div>
        <label className="block text-[11px] font-medium text-slate-400 mb-1">
          Payment Request Message or QR Code Instructions (Mandatory)
        </label>
        <textarea
          rows={4}
          value={paymentText}
          onChange={(e) => {
            setPaymentText(e.target.value);
            if (error) setError(null);
          }}
          placeholder="e.g. 'Scan this QR code and approve request with your UPI PIN to claim ₹2,500 cashback' or 'Send ₹5 to receive payment'..."
          className="w-full rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            Recipient UPI ID / VPA (Optional)
          </label>
          <input
            type="text"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="e.g. claim-reward@okaxis"
            className="w-full rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 outline-none font-mono"
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            Promised / Requested Amount (Optional)
          </label>
          <input
            type="text"
            value={requestedAmount}
            onChange={(e) => setRequestedAmount(e.target.value)}
            placeholder="e.g. ₹2,499 or $50"
            className="w-full rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 outline-none"
          />
        </div>
      </div>

      {error && (
        <div className="text-xs text-red-400 flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <span className="text-[11px] text-slate-500">
          Analyzes for reverse payment scams, fake refunds, test debits, and QR deception.
        </span>

        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-98 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-600/20"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isLoading ? 'Inspecting Payment Request...' : 'Analyze Payment'}</span>
        </button>
      </div>
    </form>
  );
};
