export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type AnalysisType = 'message' | 'email' | 'url' | 'payment';

export interface WarningSign {
  indicator: string;
  explanation: string;
}

export interface SocialEngineeringTactic {
  tactic: string;
  explanation: string;
}

export interface ThreatAssessment {
  id?: string;
  userId?: string;
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  scamCategory: string;
  summary: string;
  warningSigns: WarningSign[];
  socialEngineeringTactics: SocialEngineeringTactic[];
  recommendedActions: string[];
  avoidActions: string[];
  confidence: number; // 0 - 100 percentage
  uncertainties: string[];
  safeInterpretation: string;
  simpleExplanation?: string;
  inputPreview?: string;
  analysisType: AnalysisType;
  createdAt?: string;
  metadata?: {
    senderEmail?: string;
    subject?: string;
    detectedLinks?: string[];
    urlCharacteristics?: {
      protocol?: string;
      domain?: string;
      isIpAddress?: boolean;
      subdomainCount?: number;
      isShortened?: boolean;
      hasSuspiciousKeywords?: boolean;
      hasLookalikeCharacters?: boolean;
    };
    paymentDetails?: {
      upiId?: string;
      requestedAmount?: string;
      pinMentioned?: boolean;
      cashbackClaim?: boolean;
    };
  };
}

export interface ThreatLibraryItem {
  id: string;
  title: string;
  category: string;
  severity: RiskLevel;
  summary: string;
  howItWorks: string[];
  warningSigns: string[];
  exampleSnippet: string;
  exampleAnalysisType: AnalysisType;
  preventionTips: string[];
  incidentResponseSteps: string[];
}

export interface SimulatorOption {
  id: string;
  text: string;
  isSafe: boolean;
  explanation: string;
}

export interface SimulatorQuestion {
  id: string;
  scenarioTitle: string;
  channel: 'SMS' | 'Email' | 'UPI' | 'Social Media' | 'Tech Support';
  content: string;
  senderInfo?: string;
  options: SimulatorOption[];
  threatCategory: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalAnalyses: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  mostCommonCategory: string;
  averageRiskScore: number;
  recentAnalyses: ThreatAssessment[];
  categoryBreakdown: { category: string; count: number }[];
  riskDistribution: { level: RiskLevel; count: number; color: string }[];
}
