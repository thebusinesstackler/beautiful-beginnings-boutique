
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail, Phone, Award, Star, LogIn, LogOut, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/hooks/useSettings';

import { useEffect } from 'react';

const Footer = () => {
  const { user, isAdmin, signOut } = useAuth();
  const { settings, fetchSettings } = useSettings();
  

  const handleSignOut = async () => {
    await signOut();
  };

  // Listen for settings updates from other components
  useEffect(() => {
    const handleSettingsUpdate = () => {
      console.log('Settings updated, refetching...');
      fetchSettings();
    };

    window.addEventListener('settingsUpdated', handleSettingsUpdate);
    return () => window.removeEventListener('settingsUpdated', handleSettingsUpdate);
  }, [fetchSettings]);

  return (
    <footer className="relative bg-cream border-t border-stone-200">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sage via-terracotta to-sage"></div>
      
      <div className="w-full px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Company Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-sage/10 rounded-full blur-sm"></div>
                <img 
                  src={settings.logo_url || 'https://ibdjzzgvxlscmwlbuewd.supabase.co/storage/v1/object/public/logos/logo_1755556584395.png'} 
                  alt={settings.logo_alt_text || 'Beautiful Beginnings'} 
                  className="relative h-12 w-12 object-contain rounded-full shadow-md"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-charcoal font-playfair">
                  {settings.store_name}
                </h3>
                <p className="text-sm text-sage font-medium">
                  Handcrafted with Love
                </p>
              </div>
            </div>
            
            <p className="text-charcoal/70 leading-relaxed text-sm">
              Creating treasured keepsakes that celebrate your most precious memories. Each piece is lovingly handcrafted to last a lifetime.
            </p>
            
            {/* Awards Badge */}
            <div className="inline-flex items-center space-x-3 p-3 rounded-lg bg-white border border-sage/20 shadow-sm">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 text-amber-400 fill-current" />
                ))}
              </div>
              <span className="text-sm font-semibold text-charcoal">5-Star Rated</span>
            </div>
          </div>

          {/* Shop Collections */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-charcoal mb-4 font-playfair border-b border-sage/20 pb-2">
              Shop Collections
            </h4>
            <ul className="space-y-3">
              {[
                { to: "/products/ornaments", label: "Keepsake Ornaments" },
                { to: "/products/necklaces", label: "Memory Jewelry" },
                { to: "/products/slate", label: "Slate Keepsakes" },
                { to: "/products/snow-globes", label: "Snow Globes" },
                { to: "/products/wood-sublimation", label: "Wood Art" }
              ].map((item) => (
                <li key={item.to}>
                  <Link 
                    to={item.to} 
                    className="text-charcoal/70 hover:text-sage transition-all duration-300 text-sm hover:translate-x-1 inline-block group"
                  >
                    <span className="border-b border-transparent group-hover:border-sage/60 transition-colors duration-300">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-charcoal mb-4 font-playfair border-b border-sage/20 pb-2">
              Customer Care
            </h4>
            <ul className="space-y-3">
              {[
                { to: "/about", label: "Our Story" },
                { to: "/blog", label: "Blog" },
                { to: "/events", label: "Events & Shows" },
                { to: "/custom-orders", label: "Custom Orders" },
                { to: "/care-instructions", label: "Care Guide" },
                { to: "/shipping-returns", label: "Shipping & Returns" },
                { to: "/reviews", label: "Customer Reviews" }
              ].map((item) => (
                <li key={item.to}>
                  <Link 
                    to={item.to} 
                    className="text-charcoal/70 hover:text-sage transition-all duration-300 text-sm hover:translate-x-1 inline-block group"
                  >
                    <span className="border-b border-transparent group-hover:border-sage/60 transition-colors duration-300">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info & Auth */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-charcoal mb-4 font-playfair border-b border-sage/20 pb-2">
              Get in Touch
            </h4>
            
            {/* Contact Details */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 group">
                <div className="p-2 rounded-lg bg-sage/10 group-hover:bg-sage/20 transition-colors duration-300">
                  <Phone className="h-4 w-4 text-sage" />
                </div>
                <span className="text-sm text-charcoal/70 group-hover:text-charcoal transition-colors duration-300">
                  {settings.store_phone}
                </span>
              </div>
              
              <div className="flex items-center space-x-3 group">
                <div className="p-2 rounded-lg bg-sage/10 group-hover:bg-sage/20 transition-colors duration-300">
                  <Mail className="h-4 w-4 text-sage" />
                </div>
                <Link 
                  to="/contact"
                  className="text-sm text-charcoal/70 group-hover:text-charcoal transition-colors duration-300 hover:underline underline-offset-2"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Auth Section */}
            <div className="space-y-3">
              {user ? (
                <div className="p-4 rounded-lg bg-white border border-sage/20 shadow-sm space-y-3">
                  <p className="text-sm text-sage font-medium">
                    Welcome, {user.email}
                  </p>
                  <div className="flex flex-col space-y-2">
                    {isAdmin && (
                      <Link to="/admin">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start bg-white border-sage/40 text-sage hover:bg-sage/5 hover:border-sage/60 transition-all duration-300"
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Admin Panel
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSignOut}
                      className="w-full justify-start bg-white border-stone/40 text-charcoal/70 hover:bg-stone/5 hover:border-stone/60 transition-all duration-300"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              ) : (
                <Link to="/auth">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-white border-sage/40 text-sage hover:bg-sage/5 hover:border-sage/60 transition-all duration-300"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Admin Login
                  </Button>
                </Link>
              )}
            </div>
            
            <div className="flex space-x-3">
              <a 
                href="#" 
                className="p-3 rounded-lg bg-white border border-sage/20 text-sage hover:bg-sage hover:text-white transition-all duration-300 hover:scale-105 shadow-sm"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a 
                href="#" 
                className="p-3 rounded-lg bg-white border border-sage/20 text-sage hover:bg-sage hover:text-white transition-all duration-300 hover:scale-105 shadow-sm"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-charcoal/70">
              © 2025 {settings.store_name}. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link 
                to="/privacy" 
                className="text-charcoal/70 hover:text-sage transition-colors duration-300 hover:underline underline-offset-4"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="text-charcoal/70 hover:text-sage transition-colors duration-300 hover:underline underline-offset-4"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
