
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail, Phone, MapPin, Award, Star, LogIn, LogOut, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <footer className="relative bg-gradient-to-br from-charcoal via-chocolate to-charcoal text-cream">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sage via-terracotta to-sage"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 mb-16">
          
          {/* Company Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center space-x-4 mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-sage/20 rounded-full blur-md"></div>
                <img 
                  src="/lovable-uploads/5e4be881-9356-47e3-ba32-e012d51e3e8c.png" 
                  alt="Beautiful Beginnings Logo" 
                  className="relative h-14 w-14 object-contain rounded-full shadow-lg"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-cream font-playfair">
                  Beautiful Beginnings
                </h3>
                <p className="text-sm text-sage font-medium">
                  Handcrafted with Love
                </p>
              </div>
            </div>
            
            <p className="text-stone leading-relaxed text-sm">
              Creating treasured keepsakes that celebrate your most precious memories. Each piece is lovingly handcrafted to last a lifetime.
            </p>
            
            {/* Awards Badge */}
            <div className="inline-flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-sage/10 to-terracotta/10 border border-sage/20 backdrop-blur-sm">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current drop-shadow-sm" />
                ))}
              </div>
              <span className="text-sm font-semibold text-cream">5-Star Rated</span>
            </div>
          </div>

          {/* Shop Collections */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-cream mb-6 font-playfair border-b border-sage/30 pb-2">
              Shop Collections
            </h4>
            <ul className="space-y-4">
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
                    className="text-stone hover:text-cream transition-all duration-300 text-sm hover:translate-x-2 inline-block group"
                  >
                    <span className="border-b border-transparent group-hover:border-sage transition-colors duration-300">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-cream mb-6 font-playfair border-b border-sage/30 pb-2">
              Customer Care
            </h4>
            <ul className="space-y-4">
              {[
                { to: "/about", label: "Our Story" },
                { to: "/custom-orders", label: "Custom Orders" },
                { to: "/care-instructions", label: "Care Guide" },
                { to: "/shipping", label: "Shipping & Returns" },
                { to: "/reviews", label: "Customer Reviews" }
              ].map((item) => (
                <li key={item.to}>
                  <Link 
                    to={item.to} 
                    className="text-stone hover:text-cream transition-all duration-300 text-sm hover:translate-x-2 inline-block group"
                  >
                    <span className="border-b border-transparent group-hover:border-sage transition-colors duration-300">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info & Auth */}
          <div className="space-y-8">
            <h4 className="text-lg font-bold text-cream mb-6 font-playfair border-b border-sage/30 pb-2">
              Get in Touch
            </h4>
            
            {/* Contact Details */}
            <div className="space-y-5">
              <div className="flex items-center space-x-4 group">
                <div className="p-2 rounded-lg bg-terracotta/20 group-hover:bg-terracotta/30 transition-colors duration-300">
                  <Phone className="h-4 w-4 text-terracotta" />
                </div>
                <span className="text-sm text-stone group-hover:text-cream transition-colors duration-300">
                  (555) 123-4567
                </span>
              </div>
              
              <div className="flex items-center space-x-4 group">
                <div className="p-2 rounded-lg bg-terracotta/20 group-hover:bg-terracotta/30 transition-colors duration-300">
                  <Mail className="h-4 w-4 text-terracotta" />
                </div>
                <span className="text-sm text-stone group-hover:text-cream transition-colors duration-300">
                  hello@beautifulbeginnings.com
                </span>
              </div>
              
              <div className="flex items-start space-x-4 group">
                <div className="p-2 rounded-lg bg-terracotta/20 group-hover:bg-terracotta/30 transition-colors duration-300 mt-0.5">
                  <MapPin className="h-4 w-4 text-terracotta" />
                </div>
                <span className="text-sm text-stone group-hover:text-cream transition-colors duration-300">
                  123 Craft Lane<br />
                  Artisan Village, AV 12345
                </span>
              </div>
            </div>

            {/* Auth Section */}
            <div className="space-y-4">
              {user ? (
                <div className="p-4 rounded-xl bg-sage/10 border border-sage/20 space-y-3">
                  <p className="text-sm text-sage font-medium">
                    Welcome, {user.email}
                  </p>
                  <div className="flex flex-col space-y-2">
                    {profile?.is_admin && (
                      <Link to="/admin">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start bg-transparent border-sage/40 text-sage hover:bg-sage/10 hover:border-sage/60 transition-all duration-300"
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
                      className="w-full justify-start bg-transparent border-stone/40 text-stone hover:bg-stone/10 hover:border-stone/60 transition-all duration-300"
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
                    className="w-full justify-start bg-transparent border-sage/40 text-sage hover:bg-sage/10 hover:border-sage/60 transition-all duration-300"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Admin Login
                  </Button>
                </Link>
              )}
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="p-3 rounded-xl bg-sage/10 text-sage hover:bg-sage hover:text-cream transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="p-3 rounded-xl bg-sage/10 text-sage hover:bg-sage hover:text-cream transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-sage/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="text-sm text-stone">
              © 2024 Beautiful Beginnings. All rights reserved.
            </div>
            <div className="flex space-x-8 text-sm">
              <Link 
                to="/privacy" 
                className="text-stone hover:text-cream transition-colors duration-300 hover:underline underline-offset-4"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="text-stone hover:text-cream transition-colors duration-300 hover:underline underline-offset-4"
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
