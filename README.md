# ScamShield — AI-Powered Cybersecurity & Threat Assessment Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![AI Engine](https://img.shields.io/badge/AI%20Engine-Google%20Gemini%203.8%20Flash-indigo.svg)](https://ai.google.dev/)
[![Database](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-emerald.svg)](https://supabase.com/)

> **"Don't let scammers fool you."**  
> ScamShield is a production-quality cybersecurity intelligence platform that helps users analyze and identify potentially dangerous scams across SMS messages, WhatsApp chats, phishing emails, social media DMs, suspicious website URLs, and UPI / payment requests.

---

## 1. Problem Statement
Digital financial fraud and spear phishing attacks have grown exponentially with the adoption of instant payment rails (UPI) and automated messaging bots. Attackers exploit psychological pressure—fear, artificial urgency, and brand impersonation—to induce victims into surrendering OTPs, debiting their accounts via reverse payment QR codes, or entering credentials into clone websites. Victims frequently lack technical tools to verify unexpected notifications before panic sets in.

---

## 2. The Solution
ScamShield provides an instant, defensive threat verification engine. Users submit any suspicious text, email, link, or payment request. ScamShield evaluates the content using:
1. **Automated Credential Sanitization**: Client-side & server-side regex scrubber that strips real OTPs, passwords, card numbers, and UPI PINs before analysis.
2. **Multi-Vector AI Intelligence**: Powered by Google Gemini (`gemini-3.8-flash`) through secure server-side API routes, evaluating syntactic manipulation, brand impersonation, and social engineering coercion.
3. **Defensive Static Link Heuristics**: Evaluates raw IP hostnames, excessive subdomains, punycode lookalikes, and URL shortener destinations without querying dangerous remote hosts.
4. **Transparent Risk Scoring**:
   - `0–24`: **LOW RISK** (Standard notification, no coercive demands)
   - `25–49`: **MEDIUM RISK** (Vague link or mild urgency requiring caution)
   - `50–74`: **HIGH RISK** (Impersonation, credential harvesting link, or penalty threats)
   - `75–100`: **CRITICAL RISK** (Direct OTP/PIN requests, unauthorized QR debit traps)
5. **Beginner Explanation Mode**: "Explain Like I'm New to Cybersecurity" toggle converting dense forensic logs into clear, jargon-free advice.

---

## 3. Key Features

- **Message Analyzer**: Evaluates SMS, WhatsApp texts, Instagram DMs, and Telegram task offers. Includes instant sample presets (Bank KYC block, Courier fees, YouTube task fraud).
- **Email Phishing Inspector**: Analyzes sender email spoofing, high-pressure subject lines, email body text, and embedded link lists.
- **URL & Domain Inspector**: Analyzes raw IP addresses, subdomains, punycode lookalikes, and URL shorteners defensibly.
- **UPI & Payment Fraud Detector**: Specifically engineered to detect reverse payment scams (tricking users into entering their UPI PIN to "receive" money).
- **Threat Intelligence Library**: Educational guide covering Phishing, UPI Scams, Job Fraud, Tech Support Scams, Package Reschedule Scams, and Social Engineering Tactics.
- **Scam Simulator ("Can You Spot the Scam?")**: Interactive scenario-based training drill testing user vigilance with instant situational feedback and a Cyber Awareness Score.
- **User Telemetry Dashboard**: Aggregate statistics computed from actual stored analyses: risk distribution, most frequent scam categories, and historical timeline.
- **Privacy First**: Sensitive credential redaction, user-controlled data wipe, and rate limiting.

---

## 4. Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion.
- **Backend**: Express API server with Vite middleware integration.
- **AI Engine**: Google Gemini API via official `@google/genai` TypeScript SDK on the server-side (`gemini-3.8-flash`).
- **Database & Auth**: Supabase PostgreSQL with Row Level Security (RLS) & Supabase Auth, plus local session fallback.
- **Deployment**: Vercel / Netlify / Cloud Run compatible.

---

## 5. Environment Variables

Create a `.env` file in the root directory:

```bash
# Google Gemini API Key (Server-side threat analysis)
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# Supabase PostgreSQL & Auth (Optional for cloud sync, local fallback active by default)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Client aliases for Vite
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"
```

---

## 6. Local Setup & Execution

### Prerequisites
- Node.js 18+ or 20+
- npm 9+

### Commands

```bash
# 1. Install dependencies
npm install

# 2. Run the full-stack development server (Express + Vite on port 3000)
npm run dev

# 3. Build for production
npm run build

# 4. Run production server
npm start
```

Open `http://localhost:3000` in your web browser.

---

## 7. Supabase Database Setup

To provision the Supabase database:
1. Log into [Supabase](https://supabase.com) and create a new project.
2. Navigate to the **SQL Editor**.
3. Copy and run the schema file located at:
   `/supabase/migrations/001_scamshield_schema.sql`
4. The migration will create:
   - `public.profiles`
   - `public.analyses`
   - `public.threat_library`
   - `public.simulator_questions`
   - `public.simulator_attempts`
   - Row Level Security (RLS) policies ensuring users can only read, write, and delete their own scans.
5. Add your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to your environment variables.

---

## 8. Deployment

### Vercel Deployment
1. Import repository into Vercel.
2. Set Build Command to `npm run build` and Output Directory to `dist`.
3. Configure the environment variables (`GEMINI_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
4. Deploy.

---

## 9. Security & Ethical Considerations
- **Defensive Utility Only**: ScamShield does not perform offensive scanning, credential harvesting, or exploitation.
- **Untrusted Prompt Isolation**: Analyzed content is treated as untrusted data with strict system instruction boundaries to neutralize prompt injection exploits.
- **Client Key Protection**: `GEMINI_API_KEY` is strictly confined to server-side routes and never exposed to browser bundles.
