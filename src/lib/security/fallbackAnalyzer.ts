import { ThreatAssessment, RiskLevel, WarningSign, SocialEngineeringTactic } from '../../types';
import { sanitizeContent } from './sanitizer';
import { analyzeUrlCharacteristics } from './urlAnalyzer';

/**
 * Intelligent Client-Side Threat Assessment Engine
 * Operates when network boundaries or serverless routes return non-JSON responses.
 * Evaluates semantic urgency, banking impersonation, credential harvesting,
 * reverse payment traps, and deceptive URL structures.
 */

export function analyzeMessageLocally(rawText: string): ThreatAssessment {
  const { sanitized, redactedCount } = sanitizeContent(rawText);
  const text = rawText.toLowerCase();

  let riskScore = 15;
  const warningSigns: WarningSign[] = [];
  const tactics: SocialEngineeringTactic[] = [];
  const recommendedActions: string[] = [];
  const avoidActions: string[] = [];
  let category = 'Suspicious Communication';

  // 1. Urgency / Panic patterns
  if (
    /urgent|immediately|within \d+\s*(?:hour|minute|day)|blocked|suspended|deactivated|expire|legal action|police|arrest/i.test(
      text
    )
  ) {
    riskScore += 25;
    warningSigns.push({
      indicator: 'Urgency & Fear Manipulation',
      explanation: 'Pressures the recipient to act immediately under threat of service suspension or penalty.',
    });
    tactics.push({
      tactic: 'Artificial Urgency & Fear',
      explanation: 'Forces rapid decision-making before the target can independently verify legitimacy.',
    });
  }

  // 2. Banking / KYC / Financial impersonation
  if (
    /sbi|hdfc|icici|axis|pnb|kotak|bank|kyc|pan\s*card|aadhaar|account\s*(?:blocked|restricted|hold)|electricity bill/i.test(
      text
    )
  ) {
    riskScore += 25;
    category = 'Banking / KYC Impersonation Phishing';
    warningSigns.push({
      indicator: 'Financial / Utility Impersonation',
      explanation: 'Claims to represent an established financial institution or critical public service.',
    });
    tactics.push({
      tactic: 'Authority Exploitation',
      explanation: 'Uses recognized banking or utility branding to intimidate the recipient.',
    });
  }

  // 3. Credential or OTP solicitation
  if (
    /otp|pin|password|cvv|credentials|verify your pan|update kyc|click to unlock|claim refund/i.test(
      text
    ) ||
    redactedCount > 0
  ) {
    riskScore += 25;
    warningSigns.push({
      indicator: 'Credential or Sensitive Secret Solicitation',
      explanation: 'Requests sensitive identifiers, verification codes, or personal security credentials.',
    });
    tactics.push({
      tactic: 'Credential Harvesting',
      explanation: 'Attempts to gain direct access to your banking, digital wallet, or personal account.',
    });
  }

  // 4. Embedded URL detection
  const urlMatches = rawText.match(/https?:\/\/[^\s]+/gi) || rawText.match(/\b[a-zA-Z0-9-]+\.(?:in|xyz|top|cc|app|club|link|site|info|online|ru|cn)\b/gi);
  if (urlMatches && urlMatches.length > 0) {
    const inspected = analyzeUrlCharacteristics(urlMatches[0]);
    if (inspected.indicators.length > 0) {
      riskScore += 20;
      warningSigns.push({
        indicator: 'Suspicious or Lookalike Hyperlink',
        explanation: `Includes link (${urlMatches[0].slice(0, 35)}...) with high-risk domain or unverified structure.`,
      });
    }
  }

  // 5. Lottery / Easy Job / Work-from-home tasks
  if (
    /part[- ]time|youtube\s*like|telegram\s*group|earn \d+|won lottery|prize|crypto investment|guaranteed return/i.test(
      text
    )
  ) {
    riskScore += 30;
    category = 'Employment / Task Reward Scam';
    warningSigns.push({
      indicator: 'Unrealistic Financial Incentive',
      explanation: 'Promises high rewards or earnings for simple remote tasks or lottery winnings.',
    });
    tactics.push({
      tactic: 'Greed & Financial Bait',
      explanation: 'Lures victims with outsized promises of passive income or unearned winnings.',
    });
  }

  // Clamp riskScore 0-100
  riskScore = Math.min(Math.max(riskScore, 5), 98);

  const riskLevel: RiskLevel =
    riskScore >= 75 ? 'CRITICAL' : riskScore >= 50 ? 'HIGH' : riskScore >= 25 ? 'MEDIUM' : 'LOW';

  recommendedActions.push(
    'Do not click embedded links, download attachments, or scan QR codes.',
    'Contact the purported institution directly via their official app or website.',
    'Block the sender and report the message to national cyber fraud reporting portals.'
  );

  avoidActions.push(
    'Never share your OTP, PIN, password, or CVV with anyone.',
    'Never enter your UPI PIN to receive money or lottery rewards.',
    'Do not install remote-desktop software (AnyDesk, TeamViewer) at caller instruction.'
  );

  return {
    id: 'local-' + Date.now(),
    riskScore,
    riskLevel,
    scamCategory: category,
    summary: `ScamShield detected ${warningSigns.length} notable security indicators in this communication. The pattern aligns closely with ${category.toLowerCase()}.`,
    warningSigns,
    socialEngineeringTactics: tactics,
    recommendedActions,
    avoidActions,
    confidence: 88,
    uncertainties: ['Contextual relationship between sender and recipient cannot be verified without logs.'],
    safeInterpretation: 'If you legitimately requested this message, access your account through official channels only.',
    simpleExplanation:
      'This message contains telltale warning signs of fraud: urgency, claims about your account, or requests to click unknown links. Real banks never ask for passwords or PINs.',
    inputPreview: sanitized.slice(0, 140) + (sanitized.length > 140 ? '...' : ''),
    analysisType: 'message',
    createdAt: new Date().toISOString(),
  };
}

export function analyzeEmailLocally(payload: {
  sender: string;
  subject: string;
  body: string;
  links: string[];
}): ThreatAssessment {
  const fullContent = `${payload.sender} ${payload.subject} ${payload.body}`.toLowerCase();
  let riskScore = 20;
  const warningSigns: WarningSign[] = [];
  const tactics: SocialEngineeringTactic[] = [];
  let category = 'Email Phishing Attempt';

  // Sender domain spoofing check
  const senderMatch = payload.sender.match(/@([a-zA-Z0-9.-]+)/);
  const senderDomain = senderMatch ? senderMatch[1].toLowerCase() : '';

  if (
    /paypal|google|microsoft|apple|amazon|netflix|bank|support|security|billing/i.test(fullContent) &&
    senderDomain &&
    !/(?:paypal\.com|google\.com|microsoft\.com|apple\.com|amazon\.com|netflix\.com)$/i.test(senderDomain)
  ) {
    riskScore += 35;
    warningSigns.push({
      indicator: 'Sender Domain Mismatch (Brand Impersonation)',
      explanation: `Email claims to represent a recognized brand, but the sender domain is "${senderDomain}".`,
    });
    tactics.push({
      tactic: 'Brand Impersonation',
      explanation: 'Leveraging trusted brand logos and names to disguise malicious emails.',
    });
  }

  // Urgent Subject line
  if (/urgent|action required|suspended|unauthorized|warning|invoice attached|payment failed/i.test(payload.subject)) {
    riskScore += 20;
    warningSigns.push({
      indicator: 'Alarmist Subject Line',
      explanation: 'Subject line uses alarmist phrasing designed to provoke hasty reactions.',
    });
  }

  // Links inspection
  if (payload.links && payload.links.length > 0) {
    const hasSuspiciousLink = payload.links.some((l) => analyzeUrlCharacteristics(l).indicators.length > 0);
    if (hasSuspiciousLink) {
      riskScore += 25;
      warningSigns.push({
        indicator: 'Deceptive Links in Body',
        explanation: 'Email contains links leading to domains outside the verified corporate infrastructure.',
      });
    }
  }

  riskScore = Math.min(Math.max(riskScore, 10), 96);
  const riskLevel: RiskLevel =
    riskScore >= 75 ? 'CRITICAL' : riskScore >= 50 ? 'HIGH' : riskScore >= 25 ? 'MEDIUM' : 'LOW';

  return {
    id: 'local-' + Date.now(),
    riskScore,
    riskLevel,
    scamCategory: category,
    summary: `Analysis identified ${warningSigns.length} phishing indicators in this email from ${payload.sender || 'unknown sender'}.`,
    warningSigns,
    socialEngineeringTactics: tactics,
    recommendedActions: [
      'Do not click any links or download attached files.',
      'Check the full sender header to verify the actual domain.',
      'Mark the email as Phishing / Spam in your email client.',
    ],
    avoidActions: [
      'Never reply with sensitive information.',
      'Do not use customer service numbers listed in suspicious emails.',
    ],
    confidence: 85,
    uncertainties: ['Email server SPF/DKIM headers are unavailable for direct cryptographic verification.'],
    safeInterpretation: 'Official communications from service providers can always be viewed by logging into your account directly.',
    simpleExplanation:
      'This email pretends to be an official alert to make you panic and click links. Real companies do not send links asking you to re-enter your password.',
    inputPreview: `${payload.subject} | From: ${payload.sender}`.slice(0, 140),
    analysisType: 'email',
    createdAt: new Date().toISOString(),
  };
}

export function analyzeUrlLocally(url: string): ThreatAssessment {
  const characteristics = analyzeUrlCharacteristics(url);
  let riskScore = 15;
  const warningSigns: WarningSign[] = [];
  const tactics: SocialEngineeringTactic[] = [];
  let category = 'Suspicious Web Link';

  if (characteristics.isIpAddress) {
    riskScore += 40;
    warningSigns.push({
      indicator: 'Direct IP Address Host',
      explanation: 'URL navigates to an IP address rather than a registered, branded domain name.',
    });
  }

  if (characteristics.isShortened) {
    riskScore += 25;
    warningSigns.push({
      indicator: 'URL Shortener Redirection',
      explanation: 'Uses link shorteners (bit.ly, tinyurl) to obscure the true destination server.',
    });
  }

  if (characteristics.hasLookalikeCharacters) {
    riskScore += 35;
    category = 'Lookalike / Punycode Phishing Domain';
    warningSigns.push({
      indicator: 'Homograph / Lookalike Domain',
      explanation: 'Uses character substitutions or deceptive subdomains to mimic legitimate sites.',
    });
  }

  if (characteristics.suspiciousKeywordsFound && characteristics.suspiciousKeywordsFound.length > 0) {
    riskScore += 25;
    warningSigns.push({
      indicator: 'Security Keywords in Domain Name',
      explanation: 'Embeds words like "login", "secure", "verify", or "support" in non-official domains.',
    });
  }

  if ((characteristics.subdomainCount || 0) > 3) {
    riskScore += 20;
    warningSigns.push({
      indicator: 'Excessive Subdomain Depth',
      explanation: 'Excessive subdomains are frequently used to hide malicious server paths on mobile screens.',
    });
  }

  riskScore = Math.min(Math.max(riskScore, 10), 98);
  const riskLevel: RiskLevel =
    riskScore >= 75 ? 'CRITICAL' : riskScore >= 50 ? 'HIGH' : riskScore >= 25 ? 'MEDIUM' : 'LOW';

  return {
    id: 'local-' + Date.now(),
    riskScore,
    riskLevel,
    scamCategory: category,
    summary: `Heuristic inspection detected ${warningSigns.length} domain anomalies. ${riskLevel === 'CRITICAL' || riskLevel === 'HIGH' ? 'High probability of credential-harvesting portal.' : 'Low risk detected, but exercise caution.'}`,
    warningSigns,
    socialEngineeringTactics: tactics,
    recommendedActions: [
      'Do not navigate to this address.',
      'If you have already loaded the site, do not type passwords or submit forms.',
      'Verify the authentic domain via Google Search or bookmarks.',
    ],
    avoidActions: ['Do not accept untrusted SSL certificate warnings or download software.'],
    confidence: 90,
    uncertainties: ['Destination server page content was not rendered to protect privacy.'],
    safeInterpretation: 'If you were expecting this link from a friend, confirm with them via another channel.',
    simpleExplanation:
      'This website address looks deceptive or uses tricks like numbers or extra words to look like a famous website.',
    inputPreview: url.slice(0, 140),
    analysisType: 'url',
    createdAt: new Date().toISOString(),
    metadata: {
      urlCharacteristics: characteristics,
    },
  };
}

export function analyzePaymentLocally(payload: {
  paymentText: string;
  upiId?: string;
  requestedAmount?: string;
}): ThreatAssessment {
  const full = `${payload.paymentText} ${payload.upiId || ''} ${payload.requestedAmount || ''}`.toLowerCase();
  let riskScore = 20;
  const warningSigns: WarningSign[] = [];
  const tactics: SocialEngineeringTactic[] = [];
  let category = 'Payment / UPI Request';

  // Reverse Payment Scam: "Enter PIN to receive cash"
  if (/enter pin|receive (?:money|cash|fund|reward)|pin to receive|scan qr to receive/i.test(full)) {
    riskScore += 55;
    category = 'UPI Reverse Payment Scam (Debit Trap)';
    warningSigns.push({
      indicator: 'Critical Rule Violation: "PIN to Receive"',
      explanation: 'Demands entering a UPI PIN to receive money. Entering your PIN ALWAYS debits your bank account.',
    });
    tactics.push({
      tactic: 'Reverse Transaction Deception',
      explanation: 'Exploiting confusion between sending and receiving money on UPI / payment platforms.',
    });
  }

  // QR Code to collect money
  if (/qr code|scan|collect request/i.test(full)) {
    riskScore += 25;
    warningSigns.push({
      indicator: 'Collect Request / QR Code Scan',
      explanation: 'Scammers frequently send "Collect" requests disguised as payment approvals.',
    });
  }

  // Cashback / OLX buyer trick
  if (/cashback|olx|quikr|buyer will pay|advance token|army officer|courier insurance/i.test(full)) {
    riskScore += 25;
    category = 'Marketplace / Advance Fee Scam';
    warningSigns.push({
      indicator: 'Marketplace Buyer Trap Pattern',
      explanation: 'Common script where fake buyers pretend to send money in advance using QR codes.',
    });
  }

  riskScore = Math.min(Math.max(riskScore, 10), 99);
  const riskLevel: RiskLevel =
    riskScore >= 75 ? 'CRITICAL' : riskScore >= 50 ? 'HIGH' : riskScore >= 25 ? 'MEDIUM' : 'LOW';

  return {
    id: 'local-' + Date.now(),
    riskScore,
    riskLevel,
    scamCategory: category,
    summary: `ScamShield detected critical financial safety red flags in this payment scenario. ${riskScore >= 70 ? 'High probability of reverse payment theft.' : 'Proceed with extreme care.'}`,
    warningSigns,
    socialEngineeringTactics: tactics,
    recommendedActions: [
      'Decline any "Collect" or debit requests on your payment app.',
      'Remember: You NEVER need to enter a UPI PIN or scan a QR code to receive funds.',
      'Report the UPI ID to your bank and payment provider immediately.',
    ],
    avoidActions: [
      'NEVER enter your 4-digit or 6-digit UPI PIN to "accept" a refund or payment.',
      'Do not approve payment links sent by strangers on WhatsApp or SMS.',
    ],
    confidence: 94,
    uncertainties: ['Bank transaction reference ID cannot be verified without app gateway integration.'],
    safeInterpretation: 'Legitimate buyers or employers transfer funds directly to your account or UPI handle without asking you to scan anything.',
    simpleExplanation:
      'CRITICAL RULE: You NEVER need to enter your PIN to get money. Entering your PIN means money will leave your bank account.',
    inputPreview: payload.paymentText.slice(0, 140),
    analysisType: 'payment',
    createdAt: new Date().toISOString(),
    metadata: {
      paymentDetails: {
        upiId: payload.upiId,
        requestedAmount: payload.requestedAmount,
        pinMentioned: /pin/i.test(full),
        cashbackClaim: /cashback|reward/i.test(full),
      },
    },
  };
}
