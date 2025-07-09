
// Basic input validation utilities
export const validateInput = (value: string, type: 'email' | 'password' | 'text' = 'text'): boolean => {
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
