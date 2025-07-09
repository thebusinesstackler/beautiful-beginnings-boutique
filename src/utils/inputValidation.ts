
// Basic input validation utilities
export const validateInput = (value: string, type: 'email' | 'password' | 'text' | 'filename' | 'url' = 'text'): boolean => {
  if (!value || value.trim().length === 0) {
    return false;
  }

  switch (type) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    case 'password':
      return value.length >= 6;
    case 'text':
      return value.trim().length > 0;
    case 'filename':
      // Basic filename validation - no path traversal or special characters
      const filenameRegex = /^[a-zA-Z0-9._-]+$/;
      return filenameRegex.test(value) && !value.includes('..');
    case 'url':
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    default:
      return true;
  }
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const validateRequired = (value: string): boolean => {
  return value !== null && value !== undefined && value.trim().length > 0;
};

// Add the missing classes that sanitization.ts expects
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

export class InputValidator {
  static containsSqlInjection(input: string): boolean {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
      /(--|\/\*|\*\/|;)/,
      /(\b(OR|AND)\b.*=.*)/i
    ];
    return sqlPatterns.some(pattern => pattern.test(input));
  }

  static sanitizeString(input: string, maxLength: number = 1000): string {
    if (!input || typeof input !== 'string') return '';
    return input.trim().slice(0, maxLength).replace(/[<>]/g, '');
  }

  static sanitizeEmail(email: string): string {
    if (!email || typeof email !== 'string') return '';
    return email.toLowerCase().trim();
  }

  static sanitizePhone(phone: string): string {
    if (!phone || typeof phone !== 'string') return '';
    return phone.replace(/[^\d\s\-\(\)\+]/g, '').trim();
  }

  static sanitizeUrl(url: string): string {
    if (!url || typeof url !== 'string') return '';
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.toString();
    } catch {
      return '';
    }
  }

  static sanitizeFileName(filename: string): string {
    if (!filename || typeof filename !== 'string') return '';
    return filename.replace(/[^a-zA-Z0-9._-]/g, '').trim();
  }

  static validateObject(obj: any, requiredFields: string[]): boolean {
    if (!obj || typeof obj !== 'object') return false;
    return requiredFields.every(field => obj[field] !== undefined && obj[field] !== null);
  }
}
