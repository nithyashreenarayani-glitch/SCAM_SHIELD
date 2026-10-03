import { ThreatLibraryItem } from '../../types';

export const THREAT_LIBRARY_ITEMS: ThreatLibraryItem[] = [
  {
    id: 'phishing-credential-harvesting',
    title: 'Credential Harvesting & Brand Phishing',
    category: 'Phishing',
    severity: 'CRITICAL',
    summary: 'Deceptive messages and clone websites designed to trick individuals into disclosing account passwords, 2FA codes, or credentials.',
    howItWorks: [
      'Attacker sends an email or text mimicking a recognized service (bank, email provider, or streaming platform).',
      'The message asserts that your account will be suspended, locked, or deleted within hours unless verified.',
      'A link directs you to an identical-looking fraudulent clone site.',
      'Entered passwords and 2FA tokens are immediately relayed to the attacker.'
    ],
    warningSigns: [
      'False urgency (e.g. "Action required within 2 hours or access terminated").',
      'Sender address uses subtle domain lookalikes (e.g., support@paypa1-update.com).',
      'Generic greetings such as "Dear Customer" instead of your actual registered name.',
      'Embedded links pointing to unfamiliar or shortened domains.'
    ],
    exampleSnippet: 'Urgent: Your Netflix membership is on hold due to a billing issue. Update your payment details within 24 hours at https://netflix-billing-renew.cc/login to avoid immediate termination.',
    exampleAnalysisType: 'email',
    preventionTips: [
      'Never click links in unexpected security alert emails.',
      'Navigate to the organization’s website independently by typing the official address into your browser.',
      'Enable passkeys or hardware security keys (FIDO2) which are immune to credential phishing.',
      'Inspect the top-level domain carefully before typing any credentials.'
    ],
    incidentResponseSteps: [
      'Change your password immediately on the genuine service website.',
      'Invalidate active sessions across all devices if supported.',
      'If you reused that password anywhere else, change it on those platforms too.',
      'Enable Multi-Factor Authentication (MFA) using an authenticator app.'
    ]
  },
  {
    id: 'upi-cashback-qr-scam',
    title: 'UPI "Receive Money" & Reverse Payment Scams',
    category: 'UPI Scams',
    severity: 'CRITICAL',
    summary: 'Frauds exploiting confusion over UPI PIN mechanics, convincing victims that entering their PIN will receive money instead of sending it.',
    howItWorks: [
      'Scammer poses as a buyer, lottery representative, or customer support agent on WhatsApp or classifieds.',
      'They claim you won cashback or they are prepaying for an item you listed.',
      'They send a collect request or QR code marked "Scan & Enter UPI PIN to claim ₹4,999".',
      'Entering your UPI PIN authorizes an outgoing debit transaction from your bank account.'
    ],
    warningSigns: [
      'Any prompt instructing you to enter your UPI PIN to RECEIVE or ACCEPT money.',
      'Requests to send ₹1 or ₹5 first "to test and verify the account".',
      'Scammers sending screenshots of fake transaction receipts or payment proofs.',
      'Aggressive push to stay on phone call while you complete the transaction.'
    ],
    exampleSnippet: 'Congratulations! You have received ₹3,500 cashback from PhonePe Rewards. Scan this QR code and approve request with your UPI PIN to credit funds immediately.',
    exampleAnalysisType: 'payment',
    preventionTips: [
      'Fundamental Rule: You NEVER need to enter your UPI PIN to receive money.',
      'Receiving money via UPI requires only your UPI ID or mobile number—zero authorization needed on your end.',
      'Never scan QR codes sent by unknown individuals over messaging apps.',
      'Do not perform "test transactions" under any circumstances.'
    ],
    incidentResponseSteps: [
      'Immediately report the transaction in your UPI app and bank helpline.',
      'Call the National Cyber Crime Helpline (1930 in India) or file an official cyber crime report.',
      'Block the recipient UPI VPA and contact number.',
      'Change your UPI PIN inside your official banking application.'
    ]
  },
  {
    id: 'banking-kyc-suspension',
    title: 'Bank KYC & Account Block Impersonation',
    category: 'Banking Scams',
    severity: 'HIGH',
    summary: 'Bogus notifications claiming your bank account or debit card has been blocked due to pending KYC verification or PAN card link.',
    howItWorks: [
      'Attacker sends bulk SMS headers mimicking legitimate bank alerts (e.g. SBI, HDFC, ICICI).',
      'The message warns that debit transactions are disabled due to expired KYC.',
      'Directs victim to download an APK or submit PAN/Aadhaar/OTP on a fake portal.',
      'Fraudsters take over net banking or issue unauthorized transfers.'
    ],
    warningSigns: [
      'SMS sent from standard 10-digit mobile numbers rather than official bank alpha headers.',
      'Threat of account closure within 12 or 24 hours.',
      'Instructions to install an APK file (e.g., "SBI_Support.apk") or remote desktop app.',
      'Requests for debit card CVV, expiry, and OTP on the same screen.'
    ],
    exampleSnippet: 'Dear Customer, your HDFC net banking has been deactivated due to unlinked PAN card. Visit https://hdfc-kyc-portal.online/pan-link immediately to avoid permanent closure.',
    exampleAnalysisType: 'message',
    preventionTips: [
      'Banks never ask for sensitive credentials or KYC uploads via unofficial third-party websites or APKs.',
      'Complete KYC updates in person at a physical branch or through the official bank app downloaded from Play Store/App Store.',
      'Check SMS sender IDs against official financial institution registries.'
    ],
    incidentResponseSteps: [
      'Call your bank’s official 24/7 fraud helpline to freeze your debit card and internet banking.',
      'Do not delete the SMS—save screenshots for evidence.',
      'Report the phishing website to the national CERT / cyber defense team.'
    ]
  },
  {
    id: 'fake-job-task-scam',
    title: 'Work-from-Home & "Part-Time Task" Fraud',
    category: 'Job Scams',
    severity: 'HIGH',
    summary: 'Fake recruiters offering lucrative daily income for simple tasks (liking YouTube videos, reviewing hotels) leading to prepaid crypto deposits.',
    howItWorks: [
      'Victim contacted on WhatsApp or Telegram with an unsolicited offer of ₹3,000–₹10,000/day for remote task completion.',
      'Victim completes 3 simple tasks and receives an initial payout (₹200–₹500) to build trust.',
      'Victim is invited into a VIP Telegram group and asked to deposit money for "High Return Merchant Tasks".',
      'Once a large sum is deposited, withdrawals are frozen and further payments are demanded under the guise of taxes.'
    ],
    warningSigns: [
      'Unsolicited job offers via WhatsApp or Telegram without any formal interview or application.',
      'Pay promises that are disproportionately high for trivial mechanical tasks.',
      'Requirement to pay a "security deposit" or "task unlock fee" to withdraw earned wages.',
      'Communication strictly conducted via anonymous Telegram channels.'
    ],
    exampleSnippet: 'Hi! I am Emma from Global Marketing Talent. We are hiring part-time reviewers. Earn $150 to $400 daily working 30 mins from phone. Reply YES to start task #1.',
    exampleAnalysisType: 'message',
    preventionTips: [
      'Legitimate companies never require candidates to pay money to get hired or work.',
      'Research the recruiting agency on official company LinkedIn and web portals.',
      'Be wary of any platform requiring cryptocurrency or personal UPI transfers for corporate employment.'
    ],
    incidentResponseSteps: [
      'Cease all communications and do not transfer further "clearance fees".',
      'Document chat logs, payment receipts, and wallet/UPI addresses.',
      'File an online complaint with cyber crime law enforcement.'
    ]
  },
  {
    id: 'delivery-parcel-fee-scam',
    title: 'Failed Delivery & Fake Courier Reschedule',
    category: 'Delivery Scams',
    severity: 'MEDIUM',
    summary: 'Notifications claiming an incoming package cannot be delivered due to an incorrect address or missing ₹10 fee.',
    howItWorks: [
      'Victim receives an SMS stating a package from FedEx, DHL, or Postal Service is held at a warehouse.',
      'A link requests address update and payment of a nominal fee (e.g., $1.50 or ₹25).',
      'The payment gateway steals credit card details and authorizes recurring charges or high-value debits.'
    ],
    warningSigns: [
      'Sender number is an international or generic mobile number.',
      'You are not expecting an active package, or the tracking number does not match your courier receipts.',
      'URL links to an arbitrary non-official domain (e.g., fedx-reschedule-desk.com).'
    ],
    exampleSnippet: 'USPS: Your package could not be delivered on 02/10 due to incomplete street address. Please update your address and pay $1.20 redelivery fee here: https://usps-parcel-track9.top/info',
    exampleAnalysisType: 'message',
    preventionTips: [
      'Track deliveries solely by copying the tracking number directly into the official courier website.',
      'Postal services do not withhold packages for nominal 1-dollar digital fees over SMS.'
    ],
    incidentResponseSteps: [
      'Block your payment card immediately if card details were submitted.',
      'Check your bank statement for unauthorized pending authorizations.'
    ]
  },
  {
    id: 'tech-support-remote-access',
    title: 'Tech Support & Remote Access Scams',
    category: 'Tech-support Scams',
    severity: 'CRITICAL',
    summary: 'Deceptive browser pop-ups or phone calls claiming your computer is infected with viruses, directing you to install remote access tools.',
    howItWorks: [
      'Full-screen lock warning mimics Microsoft Defender or Apple Security with loud sirens.',
      'Victim calls the toll-free number provided and speaks to a fraudulent technician.',
      'Caller instructs victim to install AnyDesk, TeamViewer, or UltraViewer.',
      'Scammer accesses bank accounts, blackens screen, or installs persistent trojans.'
    ],
    warningSigns: [
      'Pop-up windows that refuse to close or sound audio sirens.',
      'Requests to download remote control utilities by an unsolicited caller.',
      'Demands for payment via gift cards, wire transfer, or cryptocurrency.'
    ],
    exampleSnippet: 'CRITICAL SECURITY ALERT: Microsoft System Detected Trojan Spyware. Computer locked to prevent financial theft. Call Windows Support Toll-Free: 1-800-449-0199 immediately.',
    exampleAnalysisType: 'message',
    preventionTips: [
      'Major tech companies never display phone numbers in pop-ups or initiate unsolicited calls to fix computers.',
      'Close locked browser tabs using Task Manager (Ctrl + Shift + Esc or Cmd + Option + Esc).',
      'Never allow unknown parties remote access to your workstation or mobile device.'
    ],
    incidentResponseSteps: [
      'Disconnect your computer from Wi-Fi / Ethernet immediately.',
      'Uninstall remote desktop utilities (AnyDesk, TeamViewer) installed during the incident.',
      'Run a full antivirus scan using a reputable security suite.',
      'Change all account passwords from a separate, clean device.'
    ]
  }
];
