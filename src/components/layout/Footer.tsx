import React, { useState } from 'react';
import { Shield, Lock, FileText, ExternalLink, X, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  return (
    <>
      <footer className="border-t border-slate-800/80 bg-slate-950 mt-16 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Col 1: Brand & Purpose */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                  <Shield className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <span className="text-sm font-bold text-white tracking-tight">ScamShield</span>
              </div>
              <p className="text-slate-400 max-w-md text-xs leading-relaxed">
                ScamShield is an open, AI-powered cybersecurity defense platform built to protect individuals from social engineering, credential phishing, fake job offers, and UPI reverse payment scams.
              </p>
              <div className="text-[11px] text-slate-500">
                AI Threat Engine powered by Google Gemini (server-side `@google/genai` SDK) & Supabase PostgreSQL architecture.
              </div>
            </div>

            {/* Col 2: Core Vectors */}
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
                Analysis Vectors
              </h4>
              <ul className="space-y-1.5 text-slate-400">
                <li>SMS & Chat Messages</li>
                <li>Phishing Emails & Spoofing</li>
                <li>Malicious URL & Domain Heuristics</li>
                <li>UPI Collect & QR Code Fraud</li>
              </ul>
            </div>

            {/* Col 3: Resources & Safety */}
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
                Security & Privacy
              </h4>
              <ul className="space-y-1.5">
                <li>
                  <button
                    onClick={() => setPrivacyModalOpen(true)}
                    className="text-slate-400 hover:text-indigo-400 transition"
                  >
                    Privacy Architecture
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setPrivacyModalOpen(true)}
                    className="text-slate-400 hover:text-indigo-400 transition"
                  >
                    Credential Redaction Policy
                  </button>
                </li>
                <li className="text-slate-500">National Cyber Helpline: 1930</li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>
              © 2026 ScamShield. Defensive, educational cybersecurity initiative.
            </div>
            <div className="flex items-center gap-4">
              <span>Zero telemetry tracking</span>
              <span aria-hidden="true">·</span>
              <span>Client-side secret sanitization</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Privacy Architecture Modal */}
      {privacyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setPrivacyModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">ScamShield Privacy & Data Policy</h3>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                <strong>1. Automated Credential Sanitization:</strong> Before submitted text is evaluated by the AI engine or stored in the database, ScamShield runs client-side and server-side regex redaction to strip potential OTPs, passwords, credit card numbers, and UPI PINs.
              </p>
              <p>
                <strong>2. Untrusted Prompt Delimitation:</strong> User input is treated strictly as passive forensic evidence and wrapped in isolated execution boundaries to resist prompt injection manipulation.
              </p>
              <p>
                <strong>3. Server-Side AI Execution:</strong> All Gemini API calls are performed on secure backend routes. API keys are never exposed in browser bundles or client network traces.
              </p>
              <p>
                <strong>4. User Data Control:</strong> Users can delete individual records or wipe their entire scan history at any time with a single click.
              </p>
              <p>
                <strong>5. Educational Disclaimer:</strong> ScamShield provides algorithmic probability assessments based on detectable scam hallmarks. It is not an absolute forensic guarantee. Always verify financial inquiries through verified official channels.
              </p>
            </div>

            <button
              onClick={() => setPrivacyModalOpen(false)}
              className="mt-6 w-full py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </>
  );
};
