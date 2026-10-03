import { SimulatorQuestion } from '../../types';

export const SIMULATOR_QUESTIONS: SimulatorQuestion[] = [
  {
    id: 'sim-1',
    scenarioTitle: 'Bank Account Suspension Notice',
    channel: 'SMS',
    senderInfo: '+91 98231 00291 (Unknown Mobile Number)',
    content: 'ALERT: Your State Bank account 4921 has been suspended due to unlinked PAN. Update your KYC within 30 minutes at http://sbi-kyc-verify-portal.in to avoid permanent deactivation.',
    threatCategory: 'Banking Phishing',
    difficulty: 'Beginner',
    options: [
      {
        id: 'opt-a',
        text: 'Click the link immediately to verify your PAN before the deadline passes.',
        isSafe: false,
        explanation: 'Dangerous: The link leads to an unauthorized clone website created to capture your internet banking credentials and PAN card details.'
      },
      {
        id: 'opt-b',
        text: 'Reply to the SMS with your bank account number and branch code to ask for support.',
        isSafe: false,
        explanation: 'Unsafe: Responding confirms your active phone number to scammers and may trigger further social engineering attempts.'
      },
      {
        id: 'opt-c',
        text: 'Ignore the SMS link, open your official YONO SBI app independently, or visit your local branch to check your status.',
        isSafe: true,
        explanation: 'Correct & Safe! Genuine banks do not send urgent suspension links from personal 10-digit mobile numbers. Always inspect your account independently via official channels.'
      },
      {
        id: 'opt-d',
        text: 'Forward the message to friends and family in your contacts to warn them.',
        isSafe: false,
        explanation: 'Risky: Forwarding malicious links without context can accidentally cause relatives to click the link.'
      }
    ]
  },
  {
    id: 'sim-2',
    scenarioTitle: 'OLX Marketplace Buyer Pre-Payment',
    channel: 'UPI',
    senderInfo: 'Buyer on WhatsApp ("Col. Ramesh Sharma")',
    content: 'I want to purchase your used couch for ₹12,000. I am in the army and cannot come in person. I am sending you a QR code on Google Pay. Scan it and enter your UPI PIN to receive the ₹12,000 advance immediately.',
    threatCategory: 'UPI Reverse Payment Scam',
    difficulty: 'Intermediate',
    options: [
      {
        id: 'opt-a',
        text: 'Scan the QR code and type your 6-digit UPI PIN to claim the ₹12,000 credit.',
        isSafe: false,
        explanation: 'Dangerous! Entering your UPI PIN NEVER receives money; it authorizes a debit. Doing this will deduct ₹12,000 from your account.'
      },
      {
        id: 'opt-b',
        text: 'Tell the buyer: "Receiving money on UPI never requires a PIN or scanning a QR. Send the payment directly to my UPI ID without any requests."',
        isSafe: true,
        explanation: 'Correct & Safe! You correctly identified that UPI PIN is solely for paying, never for receiving. Scammers often invent military or official personas to fabricate trust.'
      },
      {
        id: 'opt-c',
        text: 'Send ₹1 to the buyer first to verify their account before scanning.',
        isSafe: false,
        explanation: 'Unsafe: Scammers use ₹1 "test" transfers to hook victims or confirm active accounts before initiating larger frauds.'
      },
      {
        id: 'opt-d',
        text: 'Ask the buyer to call your phone and guide you through the QR scan step-by-step.',
        isSafe: false,
        explanation: 'Dangerous: Scammers love phone calls because high-pressure verbal manipulation distracts you from reading the debit warning on your screen.'
      }
    ]
  },
  {
    id: 'sim-3',
    scenarioTitle: 'Corporate Password Expiry Notice',
    channel: 'Email',
    senderInfo: 'it-helpdesk@acme-corporate-support.info',
    content: 'Subject: URGENT: Your Acme Corp Single Sign-On password expires in 2 hours. Failure to update will revoke your email and VPN access. Click here to retain your current password: [Update Credentials]',
    threatCategory: 'Spear Phishing',
    difficulty: 'Intermediate',
    options: [
      {
        id: 'opt-a',
        text: 'Click the link and input your current password so the system marks it as retained.',
        isSafe: false,
        explanation: 'Dangerous: Attackers harvest your current corporate password to compromise enterprise infrastructure.'
      },
      {
        id: 'opt-b',
        text: 'Inspect the sender address (noting the unfamiliar ".info" domain) and report it to your actual corporate security team / IT helpdesk.',
        isSafe: true,
        explanation: 'Correct & Safe! Genuine IT departments send communications from your internal domain (e.g. @acmework.com), not external .info lookalikes.'
      },
      {
        id: 'opt-c',
        text: 'Reply to the email with your employee ID and manager’s name to request an extension.',
        isSafe: false,
        explanation: 'Unsafe: Giving internal organizational hierarchy data helps attackers refine targeted spear phishing against your team.'
      },
      {
        id: 'opt-d',
        text: 'Forward the email to your personal Gmail account to review from home later.',
        isSafe: false,
        explanation: 'Unsafe: Bypasses corporate security gateways and exposes your personal devices to potential payload delivery.'
      }
    ]
  },
  {
    id: 'sim-4',
    scenarioTitle: 'Lucrative Telegram Part-Time Job',
    channel: 'Social Media',
    senderInfo: 'Jessica Talent Recruiter (Telegram)',
    content: 'Earn $300-$500/day by liking travel videos on YouTube! We paid your initial $15 bonus to your wallet. For Tier 2 tasks, deposit $100 to receive $240 in 15 minutes via our merchant crypto liquidity pool.',
    threatCategory: 'Task & Advance Fee Fraud',
    difficulty: 'Advanced',
    options: [
      {
        id: 'opt-a',
        text: 'Deposit the $100 since they already proved legitimacy by giving you a $15 bonus.',
        isSafe: false,
        explanation: 'Dangerous! The small initial payout is bait ("pig butchering" tactic). Once you send $100, they will demand $500 more for "tax release" and freeze your capital.'
      },
      {
        id: 'opt-b',
        text: 'Block the sender, report the Telegram group for fraud, and do not send any funds.',
        isSafe: true,
        explanation: 'Correct & Safe! Legitimate employers never require candidates to pay money or deposit cryptocurrency to earn wages or unlock tasks.'
      },
      {
        id: 'opt-c',
        text: 'Negotiate to deposit only $50 instead to test if they return $120.',
        isSafe: false,
        explanation: 'Unsafe: Any funds sent to task scam pools are irrevocably lost.'
      },
      {
        id: 'opt-d',
        text: 'Invite your friends to the group so you earn referral commission.',
        isSafe: false,
        explanation: 'Unsafe: Spreads financial victimization to your network.'
      }
    ]
  }
];
