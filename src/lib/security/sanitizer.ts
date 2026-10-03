/**
 * ScamShield Privacy Sanitizer
 * Automatically redacts obvious secrets (OTPs, credit card numbers, UPI PINs, CVVs)
 * before persisting or forwarding to AI analysis engines.
 */

export function sanitizeContent(text: string): { sanitized: string; redactedCount: number } {
  if (!text) return { sanitized: '', redactedCount: 0 };

  let count = 0;
  let sanitized = text;

  // 1. Credit / Debit card 16-digit numbers (with optional spaces or dashes)
  const cardRegex = /\b(?:\d{4}[-\s]?){3}\d{4}\b/g;
  sanitized = sanitized.replace(cardRegex, () => {
    count++;
    return '[REDACTED_CARD_NUMBER]';
  });

  // 2. CVV / CVC (3-4 digits preceded by cvv/cvc keywords)
  const cvvRegex = /\b(?:cvv|cvc|security code)\s*[:=]?\s*(\d{3,4})\b/gi;
  sanitized = sanitized.replace(cvvRegex, (match, digits) => {
    count++;
    return match.replace(digits, '[REDACTED_CVV]');
  });

  // 3. OTP codes (4-8 digits preceded by OTP / one time password / verification code)
  const otpKeywordRegex = /\b(?:otp|one[- ]time[- ]password|verification code|auth code|secret pin|login code)\s*(?:is|:|=|-)?\s*(\d{4,8})\b/gi;
  sanitized = sanitized.replace(otpKeywordRegex, (match, digits) => {
    count++;
    return match.replace(digits, '[REDACTED_OTP]');
  });

  // 4. UPI PIN mentions (e.g. "my pin is 1234")
  const upiPinRegex = /\b(?:upi[- ]?pin|mpin|atm[- ]?pin)\s*[:=]?\s*(\d{4,6})\b/gi;
  sanitized = sanitized.replace(upiPinRegex, (match, digits) => {
    count++;
    return match.replace(digits, '[REDACTED_PIN]');
  });

  // 5. Password declarations (e.g. "password: secret123")
  const pwdRegex = /\b(?:password|pwd|passphrase)\s*[:=]\s*([^\s]{4,32})/gi;
  sanitized = sanitized.replace(pwdRegex, (match, pwd) => {
    count++;
    return match.replace(pwd, '[REDACTED_PASSWORD]');
  });

  return { sanitized, redactedCount: count };
}
