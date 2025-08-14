
import { useEffect } from 'react';

export const useSecurityHeaders = () => {
  useEffect(() => {
    // Set security headers via meta tags for client-side protection
    const setMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Content Security Policy
    setMetaTag('Content-Security-Policy', 
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' https://web.squarecdn.com https://js.squareup.com; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "font-src 'self' https://fonts.gstatic.com; " +
      "img-src 'self' data: https: blob:; " +
      "connect-src 'self' https://ibdjzzgvxlscmwlbuewd.supabase.co wss://ibdjzzgvxlscmwlbuewd.supabase.co https://pci-connect.squareup.com https://connect.squareup.com; " +
      "frame-src 'self' https://js.squareup.com; " +
      "object-src 'none'; " +
      "base-uri 'self';"
    );

    // Additional security headers
    setMetaTag('X-Frame-Options', 'DENY');
    setMetaTag('X-Content-Type-Options', 'nosniff');
    setMetaTag('Referrer-Policy', 'strict-origin-when-cross-origin');
    setMetaTag('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  }, []);
};
