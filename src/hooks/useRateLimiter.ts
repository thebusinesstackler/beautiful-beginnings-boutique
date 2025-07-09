
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs?: number;
}

interface RateLimitState {
  attempts: number;
  firstAttempt: number;
  blocked: boolean;
  blockedUntil?: number;
}

export const useRateLimiter = (config: RateLimitConfig) => {
  const [state, setState] = useState<RateLimitState>({
    attempts: 0,
    firstAttempt: 0,
    blocked: false
  });
  const { toast } = useToast();

  const checkRateLimit = useCallback((): boolean => {
    const now = Date.now();
    
    // Check if currently blocked
    if (state.blocked && state.blockedUntil && now < state.blockedUntil) {
      const remainingMs = state.blockedUntil - now;
      const remainingSeconds = Math.ceil(remainingMs / 1000);
      toast({
        title: "Too Many Attempts",
        description: `Please wait ${remainingSeconds} seconds before trying again.`,
        variant: "destructive",
      });
      return false;
    }
    
    // Reset if window has passed
    if (now - state.firstAttempt > config.windowMs) {
      setState({
        attempts: 1,
        firstAttempt: now,
        blocked: false
      });
      return true;
    }
    
    // Check if limit exceeded
    if (state.attempts >= config.maxAttempts) {
      const blockDuration = config.blockDurationMs || config.windowMs;
      setState(prev => ({
        ...prev,
        blocked: true,
        blockedUntil: now + blockDuration
      }));
      
      toast({
        title: "Rate Limit Exceeded",
        description: "Too many attempts. Please try again later.",
        variant: "destructive",
      });
      return false;
    }
    
    // Increment attempts
    setState(prev => ({
      ...prev,
      attempts: prev.attempts + 1
    }));
    
    return true;
  }, [state, config, toast]);

  const reset = useCallback(() => {
    setState({
      attempts: 0,
      firstAttempt: 0,
      blocked: false
    });
  }, []);

  return { checkRateLimit, reset, isBlocked: state.blocked };
};
