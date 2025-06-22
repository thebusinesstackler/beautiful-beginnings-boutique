
import { Link } from 'react-router-dom';
import { Heart, Instagram, Facebook, Mail, Phone, MapPin, Award } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-primary to-chocolate text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src="/lovable-uploads/5e4be881-9356-47e3-ba32-e012d51e3e8c.png" 
                alt="Beautiful Beginnings Logo" 
                className="h-12 w-12 object-contain bg-white/10 rounded-full p-2"
              />
              <div>
                <h3 className="text-2xl font-playfair font-bold text-background">
                  Beautiful Beginnings
                </h3>
                <p className="text-sm text-background/80 tracking-wide">
                  Handcrafted with Love
                </p>
              </div>
            </div>
            <p className="text-background/90 text-sm mb-8 leading-relaxed">
              Creating treasured keepsakes that celebrate your most precious memories. Each piece is lovingly handcrafted to last a lifetime.
            </p>
            
            {/* Awards */}
            <div className="flex items-center space-x-2 mb-6 p-3 bg-white/10 rounded-lg">
              <Award className="h-5 w-5 text-accent" />
              <span className="text-sm font-medium text-background">5-Star Rated Business</span>
            </div>
            
            <div className="flex space-x-4">
              <a href="#" className="text-background/70 hover:text-background transition-colors duration-200 p-2 bg-white/10 rounded-full hover:bg-white/20">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/70 hover:text-background transition-colors duration-200 p-2 bg-white/10 rounded-full hover:bg-white/20">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-playfair font-bold mb-6 text-background">Shop Collections</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/products/ornaments" className="text-background/80 hover:text-background transition-colors duration-200 hover:pl-2">Keepsake Ornaments</Link></li>
              <li><Link to="/products/jewelry" className="text-background/80 hover:text-background transition-colors duration-200 hover:pl-2">Memory Jewelry</Link></li>
              <li><Link to="/products/slate" className="text-background/80 hover:text-background transition-colors duration-200 hover:pl-2">Slate Keepsakes</Link></li>
              <li><Link to="/products/snow-globes" className="text-background/80 hover:text-background transition-colors duration-200 hover:pl-2">Snow Globes</Link></li>
              <li><Link to="/products/wood-sublimation" className="text-background/80 hover:text-background transition-colors duration-200 hover:pl-2">Wood Art</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-xl font-playfair font-bold mb-6 text-background">Customer Care</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="text-background/80 hover:text-background transition-colors duration-200 hover:pl-2">Our Story</Link></li>
              <li><Link to="/custom-orders" className="text-background/80 hover:text-background transition-colors duration-200 hover:pl-2">Custom Orders</Link></li>
              <li><Link to="/care-instructions" className="text-background/80 hover:text-background transition-colors duration-200 hover:pl-2">Care Guide</Link></li>
              <li><Link to="/shipping" className="text-background/80 hover:text-background transition-colors duration-200 hover:pl-2">Shipping & Returns</Link></li>
              <li><Link to="/reviews" className="text-background/80 hover:text-background transition-colors duration-200 hover:pl-2">Customer Reviews</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-playfair font-bold mb-6 text-background">Get in Touch</h4>
            <div className="space-y-4 text-sm">
              <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg">
                <Phone className="h-5 w-5 text-accent flex-shrink-0" />
                <span className="text-background/90">(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg">
                <Mail className="h-5 w-5 text-accent flex-shrink-0" />
                <span className="text-background/90">hello@beautifulbeginnings.com</span>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-white/10 rounded-lg">
                <MapPin className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-background/90">
                  123 Craft Lane<br />
                  Artisan Village, AV 12345
                </span>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-accent/20 rounded-xl border border-accent/30">
              <h5 className="font-playfair font-bold text-background mb-2">Find Us at Local Markets!</h5>
              <p className="text-xs text-background/80 mb-3">Join us at craft fairs and holiday markets throughout the season.</p>
              <Link to="/events" className="text-sm text-accent hover:underline font-medium">View Schedule →</Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-background/70">
              © 2024 Beautiful Beginnings. All rights reserved. Made with ❤️ for preserving memories.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-background/70 hover:text-background transition-colors duration-200">Privacy Policy</Link>
              <Link to="/terms" className="text-background/70 hover:text-background transition-colors duration-200">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
