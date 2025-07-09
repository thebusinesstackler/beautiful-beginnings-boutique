
import { useState, useCallback } from 'react';
import { validateEmail, validatePhone, sanitizeInput } from '@/utils/sanitization';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => boolean;
}

interface ValidationErrors {
  [key: string]: string[];
}

export const useInputValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = useCallback((
    fieldName: string,
    value: string,
    rules: ValidationRule
  ): boolean => {
    const fieldErrors: string[] = [];
    
    // Sanitize input first
    const sanitizedValue = sanitizeInput(value, rules.maxLength || 1000);
    
    if (rules.required && !sanitizedValue.trim()) {
      fieldErrors.push(`${fieldName} is required`);
    }
    
    if (sanitizedValue && rules.minLength && sanitizedValue.length < rules.minLength) {
      fieldErrors.push(`${fieldName} must be at least ${rules.minLength} characters`);
    }
    
    if (sanitizedValue && rules.maxLength && sanitizedValue.length > rules.maxLength) {
      fieldErrors.push(`${fieldName} must be no more than ${rules.maxLength} characters`);
    }
    
    if (sanitizedValue && rules.pattern && !rules.pattern.test(sanitizedValue)) {
      fieldErrors.push(`${fieldName} format is invalid`);
    }
    
    if (sanitizedValue && rules.custom && !rules.custom(sanitizedValue)) {
      fieldErrors.push(`${fieldName} is invalid`);
    }
    
    setErrors(prev => ({
      ...prev,
      [fieldName]: fieldErrors
    }));
    
    return fieldErrors.length === 0;
  }, []);

  const validateEmail = useCallback((email: string): boolean => {
    return validateField('Email', email, {
      required: true,
      maxLength: 254,
      custom: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    });
  }, [validateField]);

  const validatePhone = useCallback((phone: string): boolean => {
    return validateField('Phone', phone, {
      pattern: /^\+?[\d\s\-\(\)]{10,15}$/
    });
  }, [validateField]);

  const clearErrors = useCallback((fieldName?: string) => {
    if (fieldName) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    } else {
      setErrors({});
    }
  }, []);

  return {
    errors,
    validateField,
    validateEmail,
    validatePhone,
    clearErrors
  };
};
