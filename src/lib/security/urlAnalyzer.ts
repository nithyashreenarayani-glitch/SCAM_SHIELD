/**
 * ScamShield URL Static Heuristics Engine
 * Analyzes URL characteristics defensively without making outbound network requests.
 */

export interface UrlCharacteristics {
  rawUrl: string;
  isValid: boolean;
  protocol?: string;
  hostname?: string;
  isIpAddress?: boolean;
  subdomainCount?: number;
  isShortened?: boolean;
  hasLookalikeCharacters?: boolean;
  suspiciousKeywordsFound?: string[];
  indicators: string[];
}

const SHORTENED_DOMAINS = [
  'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'is.gd', 'buff.ly', 
  'ow.ly', 'cutt.ly', 'rb.gy', 'rebrand.ly', 'shorturl.at'
];

const SUSPICIOUS_URL_KEYWORDS = [
  'verify', 'security', 'update', 'login', 'signin', 'banking', 'account',
  'wallet', 'support', 'secure', 'auth', 'recover', 'claim', 'reward',
  'gift', 'cashback', 'suspended', 'kyc', 'pan', 'aadhaar', 'refund'
];

export function analyzeUrlCharacteristics(inputUrl: string): UrlCharacteristics {
  let normalized = inputUrl.trim();
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = 'http://' + normalized;
  }

  let parsed: URL;
  try {
    parsed = new URL(normalized);
  } catch {
    return {
      rawUrl: inputUrl,
      isValid: false,
      indicators: ['Malformed or invalid URL structure']
    };
  }

  const hostname = parsed.hostname.toLowerCase();
  const protocol = parsed.protocol.replace(':', '').toLowerCase();
  const indicators: string[] = [];

  // 1. IP address check
  const ipPattern = /^(?:\d{1,3}\.){3}\d{1,3}$/;
  const isIpAddress = ipPattern.test(hostname);
  if (isIpAddress) {
    indicators.push('URL utilizes a raw IP address instead of a recognized domain name.');
  }

  // 2. HTTP vs HTTPS protocol check
  if (protocol === 'http') {
    indicators.push('Unencrypted HTTP protocol detected (does not use SSL/TLS encryption).');
  }

  // 3. Excessive subdomains
  const parts = hostname.split('.');
  const subdomainCount = Math.max(0, parts.length - 2);
  if (subdomainCount >= 3) {
    indicators.push(`High number of subdomains detected (${subdomainCount}), often used to impersonate trusted entities.`);
  }

  // 4. URL Shortener check
  const isShortened = SHORTENED_DOMAINS.some(d => hostname.endsWith(d));
  if (isShortened) {
    indicators.push('Uses a URL shortening service, masking the final destination address.');
  }

  // 5. Lookalike / Homograph characters (punycode or mixed script)
  const isPunycode = hostname.startsWith('xn--');
  const hasMixedSymbols = /[@_]/.test(hostname);
  const hasLookalikeCharacters = isPunycode || hasMixedSymbols;
  if (isPunycode) {
    indicators.push('Internationalized domain name (punycode) detected, which can be used in IDN homograph impersonations.');
  }
  if (hasMixedSymbols) {
    indicators.push('Unusual symbols (@ or _) detected in the hostname string.');
  }

  // 6. Suspicious keyword search in path/subdomains
  const fullText = (hostname + parsed.pathname).toLowerCase();
  const suspiciousKeywordsFound = SUSPICIOUS_URL_KEYWORDS.filter(kw => fullText.includes(kw));
  if (suspiciousKeywordsFound.length > 0) {
    indicators.push(`Contains high-risk credential/verification keywords: ${suspiciousKeywordsFound.join(', ')}`);
  }

  return {
    rawUrl: inputUrl,
    isValid: true,
    protocol,
    hostname,
    isIpAddress,
    subdomainCount,
    isShortened,
    hasLookalikeCharacters,
    suspiciousKeywordsFound,
    indicators
  };
}
