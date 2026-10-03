import React from 'react';
import { Lock, ShieldAlert } from 'lucide-react';

export const SensitiveWarningBanner: React.FC = () => {
  return (
    <div className="flex items-start gap-3 p-3.5 rounded-lg border border-amber-500/20 bg-amber-950/20 text-amber-200 text-xs md:text-sm">
      <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
      <div>
        <span className="font-semibold text-amber-300">Safety & Privacy Advisory: </span>
        Never submit live credentials, passwords, OTPs, UPI PINs, or CVV numbers. ScamShield runs client-side redaction, but you should never disclose secrets anywhere.
      </div>
    </div>
  );
};
