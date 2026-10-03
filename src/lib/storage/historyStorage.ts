import { ThreatAssessment } from '../../types';
import { supabase, isSupabaseConfigured } from '../supabase/client';

const LOCAL_STORAGE_KEY = 'scamshield_analysis_history';
const GUEST_COUNT_KEY = 'scamshield_guest_analyses_today';

// Initial educational demonstration scan so new users immediately see populated historical data
const INITIAL_DEMO_SCANS: ThreatAssessment[] = [
  {
    id: 'demo-scan-1',
    riskScore: 87,
    riskLevel: 'HIGH',
    scamCategory: 'Banking Phishing / Credential Harvesting',
    summary: 'The submitted message mimics a State Bank alert threatening immediate account block unless a suspicious non-official link is visited.',
    warningSigns: [
      {
        indicator: 'Urgency Manipulation',
        explanation: 'Pressures the recipient to act immediately under threat of bank account suspension.'
      },
      {
        indicator: 'Malicious-looking Link',
        explanation: 'Destination URL is a lookalike domain unassociated with official banking infrastructure.'
      },
      {
        indicator: 'Impersonation Attempt',
        explanation: 'Fabricates institutional identity to manipulate recipient into surrendering net banking credentials.'
      }
    ],
    socialEngineeringTactics: [
      {
        tactic: 'Fear & Loss Aversion',
        explanation: 'Threatening account deactivation to trigger panic and hasty compliance.'
      },
      {
        tactic: 'False Urgency',
        explanation: 'Arbitrary short deadline to prevent independent verification with bank customer support.'
      }
    ],
    recommendedActions: [
      'Do not click the embedded link under any circumstance.',
      'Log into your official banking app directly from your phone.',
      'Report the message sender to your cellular network and cyber crime portal.',
      'Delete or block the suspicious sender.'
    ],
    avoidActions: [
      'Never input your internet banking password on external portals.',
      'Never share your OTP or debit card PIN.',
      'Do not call phone numbers provided within the suspicious text.'
    ],
    confidence: 94,
    uncertainties: ['Sender phone number carrier routing is not verified.'],
    safeInterpretation: 'If you have an active bank account, genuine account notifications appear inside your banking app inbox or via official verified SMS sender headers.',
    simpleExplanation: 'This is a fake bank message trying to frighten you into clicking a bad link. Real banks will never shut down your account via an unverified text link.',
    inputPreview: 'Dear Customer, your State Bank net banking will be locked today due to incomplete PAN KYC. Avoid suspension by verifying immediately...',
    analysisType: 'message',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'demo-scan-2',
    riskScore: 92,
    riskLevel: 'CRITICAL',
    scamCategory: 'UPI Reverse Payment Scam',
    summary: 'Content instructs recipient to enter their secret UPI PIN to receive festival cashback or buyer payment.',
    warningSigns: [
      {
        indicator: 'PIN to Receive Inversion',
        explanation: 'Requests the secret UPI PIN under the false premise that entering it credits incoming money.'
      },
      {
        indicator: 'Unrealistic Cash Reward',
        explanation: 'Promises unsolicited monetary reward to induce compliance.'
      }
    ],
    socialEngineeringTactics: [
      {
        tactic: 'Greed & Excitement Hook',
        explanation: 'Dangling unexpected cashback to bypass standard financial skepticism.'
      }
    ],
    recommendedActions: [
      'Decline any request prompting for a PIN.',
      'Block the sender immediately on WhatsApp or payment platforms.'
    ],
    avoidActions: [
      'Never enter your UPI PIN to receive money (entering PIN always deducts funds).'
    ],
    confidence: 98,
    uncertainties: [],
    safeInterpretation: 'Legitimate merchant cashbacks are deposited straight to bank accounts without requiring recipient authorization.',
    simpleExplanation: 'You NEVER need your UPI PIN to get money. If someone asks for your PIN to send you money, they are trying to steal from your account.',
    inputPreview: 'GooglePay Reward: You won ₹2,499 cashback! Scan QR and enter 6-digit UPI PIN to credit funds immediately...',
    analysisType: 'payment',
    createdAt: new Date(Date.now() - 3600000 * 26).toISOString()
  }
];

export function getLocalHistory(): ThreatAssessment[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_SCANS));
      return INITIAL_DEMO_SCANS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_SCANS;
  }
}

export function saveLocalHistoryItem(item: ThreatAssessment): void {
  try {
    const current = getLocalHistory();
    const updated = [item, ...current.filter((i) => i.id !== item.id)];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save to local storage', err);
  }
}

export function deleteLocalHistoryItem(id: string): void {
  try {
    const current = getLocalHistory();
    const updated = current.filter((i) => i.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to delete history item', err);
  }
}

export function clearLocalHistory(): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]));
  } catch (err) {
    console.error('Failed to clear history', err);
  }
}

export function getGuestAnalysisCount(): number {
  try {
    const record = localStorage.getItem(GUEST_COUNT_KEY);
    if (!record) return 0;
    const { count, date } = JSON.parse(record);
    const today = new Date().toDateString();
    if (date !== today) return 0;
    return count || 0;
  } catch {
    return 0;
  }
}

export function incrementGuestAnalysisCount(): number {
  try {
    const current = getGuestAnalysisCount();
    const newCount = current + 1;
    const today = new Date().toDateString();
    localStorage.setItem(GUEST_COUNT_KEY, JSON.stringify({ count: newCount, date: today }));
    return newCount;
  } catch {
    return 1;
  }
}
