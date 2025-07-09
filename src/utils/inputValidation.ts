
// Comprehensive input validation and sanitization utilities

export const InputValidator = {
  // String sanitization
  sanitizeString: (input: any, maxLength: number = 1000): string => {
    if (typeof input !== 'string') return '';
    return input.trim().slice(0, maxLength).replace(/[<>\"'&]/g, '');
  },

  // Email validation and sanitization
  sanitizeEmail: (email: any): string => {
    if (typeof email !== 'string') return '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const sanitized = email.trim().toLowerCase().slice(0, 254);
    return emailRegex.test(sanitized) ? sanitized : '';
  },

  // Phone number sanitization
  sanitizePhone: (phone: any): string => {
    if (typeof phone !== 'string') return '';
    return phone.replace(/[^\d\+\-\(\)\s]/g, '').slice(0, 20);
  },

  // URL sanitization
  sanitizeUrl: (url: any): string => {
    if (typeof url !== 'string') return '';
    try {
      const urlObj = new URL(url);
      // Only allow http, https protocols
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return '';
      }
      return urlObj.toString().slice(0, 2048);
    } catch {
      return '';
    }
  },

  // Numeric value sanitization
  sanitizeAmount: (amount: any, min: number = 0, max: number = 999999): number => {
    const num = Number(amount);
    if (isNaN(num) || num < min || num > max) return 0;
    return Math.round(num * 100) / 100; // Round to 2 decimal places
  },

  // File name sanitization
  sanitizeFileName: (fileName: any): string => {
    if (typeof fileName !== 'string') return '';
    return fileName
      .replace(/[^a-zA-Z0-9\-_\.]/g, '')
      .slice(0, 255);
  },

  // HTML content sanitization (basic)
  sanitizeHtml: (html: any): string => {
    if (typeof html !== 'string') return '';
    return html
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .slice(0, 10000);
  },

  // Validate object structure
  validateObject: (obj: any, requiredFields: string[]): boolean => {
    if (!obj || typeof obj !== 'object') return false;
    return requiredFields.every(field => obj.hasOwnProperty(field));
  },

  // Rate limiting helper
  createRateLimiter: () => {
    const requests = new Map<string, number[]>();
    
    return (identifier: string, maxRequests: number = 10, windowMs: number = 60000): boolean => {
      const now = Date.now();
      const windowStart = now - windowMs;
      
      if (!requests.has(identifier)) {
        requests.set(identifier, []);
      }
      
      const userRequests = requests.get(identifier)!;
      
      // Remove old requests
      const validRequests = userRequests.filter(time => time > windowStart);
      
      if (validRequests.length >= maxRequests) {
        return false; // Rate limit exceeded
      }
      
      validRequests.push(now);
      requests.set(identifier, validRequests);
      
      return true; // Request allowed
    };
  },

  // SQL injection prevention (basic check)
  containsSqlInjection: (input: string): boolean => {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|SCRIPT)\b)/i,
      /(--|\/\*|\*\/|;|'|"|\||&)/,
      /(\bOR\b|\bAND\b).+?=/i
    ];
    
    return sqlPatterns.some(pattern => pattern.test(input));
  }
};

// Custom error types for better error handling
export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class SecurityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SecurityError';
  }
}
