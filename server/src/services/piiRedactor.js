/**
 * AegisAI — PII & Secret Redaction Engine
 * High-speed regex & heuristic pattern matcher for enterprise privacy compliance.
 * Complies with Digital Personal Data Protection (DPDP) Act 2023, GDPR, and HIPAA.
 */

export const PII_PATTERNS = [
  // 1. Indian Permanent Account Number (PAN) - Format: 5 uppercase letters, 4 digits, 1 letter
  {
    type: 'PAN_CARD',
    label: 'PAN Number (India ITD)',
    regex: /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/g,
    replacement: '[REDACTED_PAN]',
  },
  // 2. Indian Aadhaar UIDAI Number - 12 digits, optional space or hyphen every 4 digits
  {
    type: 'AADHAAR',
    label: 'Aadhaar UIDAI (India)',
    regex: /\b[2-9]{1}[0-9]{3}[ -]?[0-9]{4}[ -]?[0-9]{4}\b/g,
    replacement: '[REDACTED_AADHAAR]',
  },
  // 3. AWS Access Key ID (e.g., AKIAIOSFODNN7EXAMPLE)
  {
    type: 'API_KEY',
    label: 'AWS Access Key ID',
    regex: /\bAKIA[0-9A-Z]{16}\b/g,
    replacement: '[REDACTED_AWS_KEY]',
  },
  // 4. Generic API Keys & Secret Tokens (OpenAI sk-..., GitHub ghp_..., Slack xoxb-...)
  {
    type: 'API_KEY',
    label: 'Secret / API Key Token',
    regex: /\b(sk-[a-zA-Z0-9_\-]{20,}|ghp_[a-zA-Z0-9]{30,}|xoxb-[0-9]{10,}-[0-9]{10,}-[a-zA-Z0-9]{20,}|AIza[0-9A-Za-z-_]{35})\b/g,
    replacement: '[REDACTED_API_KEY]',
  },
  // 5. Bearer Auth Headers or JWT Tokens
  {
    type: 'API_KEY',
    label: 'Bearer / Auth Token',
    regex: /Bearer\s+[A-Za-z0-9-_]{20,}/gi,
    replacement: 'Bearer [REDACTED_TOKEN]',
  },
  // 6. Credit Card Numbers (Visa, MasterCard, Amex, Discover - 13 to 19 digits)
  {
    type: 'CREDIT_CARD',
    label: 'Credit / Debit Card',
    regex: /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})\b/g,
    replacement: '[REDACTED_CREDIT_CARD]',
  },
  // 7. Email Addresses
  {
    type: 'EMAIL',
    label: 'Email Address',
    regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    replacement: '[REDACTED_EMAIL]',
  },
  // 8. Phone Numbers (Indian +91, international prefixes, 10-digit mobile)
  {
    type: 'PHONE',
    label: 'Mobile / Phone Number',
    regex: /(?:\+?91[\s-]?)?[6789]\d{9}\b|\+?[1-9]\d{0,2}[-.\s]?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}\b/g,
    replacement: '[REDACTED_PHONE]',
  },
];

/**
 * Scans and redacts all identifiable PII & confidential secrets from input text.
 * @param {string} text - Raw input prompt
 * @returns {object} { sanitizedText, detectedPII: string[], details: Array, totalRedactions: number }
 */
export const redactPII = (text = '') => {
  if (!text || typeof text !== 'string') {
    return {
      sanitizedText: '',
      detectedPII: [],
      details: [],
      totalRedactions: 0,
    };
  }

  let sanitizedText = text;
  const detectedTypes = new Set();
  const details = [];
  let totalRedactions = 0;

  for (const pattern of PII_PATTERNS) {
    // Reset regex lastIndex
    pattern.regex.lastIndex = 0;
    const matches = sanitizedText.match(pattern.regex);

    if (matches && matches.length > 0) {
      detectedTypes.add(pattern.type);
      totalRedactions += matches.length;

      matches.forEach((matchedVal) => {
        details.push({
          type: pattern.type,
          label: pattern.label,
          matchedLength: matchedVal.length,
          preview: matchedVal.length > 4 ? `${matchedVal.slice(0, 2)}***${matchedVal.slice(-2)}` : '****',
        });
      });

      sanitizedText = sanitizedText.replace(pattern.regex, pattern.replacement);
    }
  }

  return {
    sanitizedText,
    detectedPII: Array.from(detectedTypes),
    details,
    totalRedactions,
  };
};
