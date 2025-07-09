
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

// Enhanced input validation utilities using the new validator
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

// New comprehensive validation functions
export const validateAndSanitizeCustomerData = (data: any) => {
  if (!InputValidator.validateObject(data, ['firstName', 'lastName', 'email'])) {
    throw new ValidationError('Missing required customer fields');
  }

  const email = InputValidator.sanitizeEmail(data.email);
  if (!email) {
    throw new ValidationError('Invalid email address', 'email');
  }

  return {
    firstName: InputValidator.sanitizeString(data.firstName, 50),
    lastName: InputValidator.sanitizeString(data.lastName, 50),
    email: email,
    phone: InputValidator.sanitizePhone(data.phone || '')
  };
};

export const validateAndSanitizeAddress = (data: any) => {
  if (!InputValidator.validateObject(data, ['address', 'city', 'state', 'zipCode'])) {
    throw new ValidationError('Missing required address fields');
  }

  return {
    address: InputValidator.sanitizeString(data.address, 200),
    city: InputValidator.sanitizeString(data.city, 100),
    state: InputValidator.sanitizeString(data.state, 50),
    zipCode: InputValidator.sanitizeString(data.zipCode, 20),
    country: InputValidator.sanitizeString(data.country || 'United States', 100)
  };
};

// File upload validation with enhanced security
export const validateFileUpload = (file: File): { isValid: boolean; error?: string } => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.' };
  }
  
  // Check file size
  if (file.size > maxSize) {
    return { isValid: false, error: 'File too large. Maximum size is 10MB.' };
  }
  
  // Check file name
  const sanitizedName = InputValidator.sanitizeFileName(file.name);
  if (sanitizedName !== file.name || sanitizedName.length === 0) {
    return { isValid: false, error: 'Invalid file name. Use only letters, numbers, hyphens, and underscores.' };
  }
  
  // Check file extension matches MIME type
  const extension = file.name.toLowerCase().split('.').pop();
  const expectedExtensions: Record<string, string[]> = {
    'image/jpeg': ['jpg', 'jpeg'],
    'image/png': ['png'],
    'image/webp': ['webp']
  };
  
  const validExtensions = expectedExtensions[file.type] || [];
  if (!extension || !validExtensions.includes(extension)) {
    return { isValid: false, error: 'File extension does not match file type.' };
  }
  
  return { isValid: true };
};

// Export the validator for direct use
export { InputValidator, ValidationError, SecurityError };
