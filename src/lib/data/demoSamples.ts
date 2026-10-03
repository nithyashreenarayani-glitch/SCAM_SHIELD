export interface DemoSample {
  id: string;
  title: string;
  type: 'message' | 'email' | 'url' | 'payment';
  category: string;
  content: string;
  metadata?: {
    senderEmail?: string;
    subject?: string;
    detectedLinks?: string[];
    upiId?: string;
    requestedAmount?: string;
  };
}

export const DEMO_SAMPLES: DemoSample[] = [
  {
    id: 'demo-sbi-phishing',
    title: 'Bank KYC Account Block',
    type: 'message',
    category: 'Banking Phishing',
    content: 'Dear Customer, your State Bank net banking will be locked today due to incomplete PAN KYC. Avoid suspension by verifying immediately at https://sbi-kyc-verify-online.com/auth'
  },
  {
    id: 'demo-upi-cashback',
    title: 'UPI Cashback & QR Reward',
    type: 'payment',
    category: 'UPI Fraud',
    content: 'GooglePay Reward Notification: You have won ₹2,499 direct festival cashback! Scan the attached QR code and enter your 6-digit UPI PIN to credit ₹2,499 into your bank account immediately.',
    metadata: {
      upiId: 'reward-claim@okaxis',
      requestedAmount: '₹2,499'
    }
  },
  {
    id: 'demo-delivery-reschedule',
    title: 'Postal Courier Address Fee',
    type: 'message',
    category: 'Delivery Scam',
    content: 'USPS Notice: Your package #US99201482 could not be delivered due to an incorrect postal address. Please confirm your correct street address and pay the $1.25 redelivery fee at https://usps-parcel-redeliver.top/track within 12 hours.'
  },
  {
    id: 'demo-email-executive-spoof',
    title: 'Corporate SSO Password Expiry',
    type: 'email',
    category: 'Credential Phishing',
    content: 'Dear Colleague, our annual security audit requires all employees to re-verify their corporate portal credentials. Your access to Gmail and Slack will be suspended at 5:00 PM unless verified. Please authenticate immediately.',
    metadata: {
      senderEmail: 'security-admin@acme-sso-verify.org',
      subject: 'ACTION REQUIRED: Security Verification for Corporate Account',
      detectedLinks: ['https://acme-sso-verify.org/portal/login']
    }
  },
  {
    id: 'demo-fake-job-telegram',
    title: 'YouTube Video Review Job',
    type: 'message',
    category: 'Task Scam',
    content: 'Hi! I am recruiter Sarah from Media Group. We offer remote work liking videos. Daily salary ₹2,500 - ₹8,000 for 1 hour per day. No experience needed. Join our Telegram channel https://t.me/media_tasks_vip now to receive your first ₹500 welcome bonus.'
  },
  {
    id: 'demo-url-malicious-clone',
    title: 'Lookalike Banking Domain',
    type: 'url',
    category: 'Phishing Domain',
    content: 'http://192.168.1.100/verify-account/hdfc-secure-banking-login.php?session=92812'
  }
];
