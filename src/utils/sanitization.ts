
import DOMPurify from 'dompurify';
import { InputValidator, ValidationError, SecurityError } from './inputValidation';

// Configure DOMPurify with strict settings
const createSanitizer = () => {
  // Create a clean DOMPurify instance
  const purify = DOMPurify();
  
  // Configure allowed tags and attributes for blog content
  const blogConfig = {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'a', 'img'
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target'],
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'iframe'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'style']
  };

  // Strict config for general text
  const textConfig = {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    ALLOW_DATA_ATTR: false
  };

  return { purify, blogConfig, textConfig };
};

const { purify, blogConfig, textConfig } = createSanitizer();

export const sanitizeHtml = (dirty: string): string => {
  if (!dirty || typeof dirty !== 'string') return '';
  
  // Check for potential SQL injection attempts
  if (InputValidator.containsSqlInjection(dirty)) {
    throw new SecurityError('Potential SQL injection detected');
  }
  
  return purify.sanitize(dirty, blogConfig);
};

export const sanitizeText = (dirty: string): string => {
  if (!dirty || typeof dirty !== 'string') return '';
  
  // Check for potential SQL injection attempts
  if (InputValidator.containsSqlInjection(dirty)) {
    throw new SecurityError('Potential SQL injection detected');
  }
  
  return purify.sanitize(dirty, textConfig);
};

export const sanitizeUrl = (url: string): string => {
  if (!url || typeof url !== 'string') return '';
  
  return InputValidator.sanitizeUrl(url);
};

// Simple input validation utilities
export const validateEmail = (email: string): boolean => {
  const sanitized = InputValidator.sanitizeEmail(email);
  return sanitized.length > 0 && sanitized === email.toLowerCase().trim();
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,15}$/;
  const sanitized = InputValidator.sanitizePhone(phone);
  return phoneRegex.test(sanitized) && sanitized.length >= 10;
};

export const validateSlug = (slug: string): boolean => {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  const sanitized = InputValidator.sanitizeString(slug, 100);
  return slugRegex.test(sanitized) && sanitized.length <= 100;
};

export const sanitizeInput = (input: string, maxLength: number = 1000): string => {
  if (!input || typeof input !== 'string') return '';
  
  // Check for potential security threats
  if (InputValidator.containsSqlInjection(input)) {
    throw new SecurityError('Potential SQL injection detected');
  }
  
  return InputValidator.sanitizeString(input, maxLength);
};

// Export the validator and error classes for direct use
export { InputValidator, ValidationError, SecurityError };
