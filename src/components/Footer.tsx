
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail, Phone, MapPin, Award, Star } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src="/lovable-uploads/5e4be881-9356-47e3-ba32-e012d51e3e8c.png" 
                alt="Beautiful Beginnings Logo" 
                className="h-12 w-12 object-contain"
              />
              <div>
                <h3 className="text-xl font-bold text-white">
                  Beautiful Beginnings
                </h3>
                <p className="text-sm text-slate-300">
                  Handcrafted with Love
                </p>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Creating treasured keepsakes that celebrate your most precious memories. Each piece is lovingly handcrafted to last a lifetime.
            </p>
            
            {/* Awards Badge */}
            <div className="flex items-center space-x-2 p-3 bg-slate-800 rounded-lg border border-slate-700">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-sm font-medium text-white">5-Star Rated</span>
            </div>
          </div>

          {/* Shop Collections */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Shop Collections</h4>
            <ul className="space-y-3">
              <li><Link to="/products/ornaments" className="text-slate-300 hover:text-white transition-colors duration-200 text-sm">Keepsake Ornaments</Link></li>
              <li><Link to="/products/necklaces" className="text-slate-300 hover:text-white transition-colors duration-200 text-sm">Memory Jewelry</Link></li>
              <li><Link to="/products/slate" className="text-slate-300 hover:text-white transition-colors duration-200 text-sm">Slate Keepsakes</Link></li>
              <li><Link to="/products/snow-globes" className="text-slate-300 hover:text-white transition-colors duration-200 text-sm">Snow Globes</Link></li>
              <li><Link to="/products/wood-sublimation" className="text-slate-300 hover:text-white transition-colors duration-200 text-sm">Wood Art</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Customer Care</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-slate-300 hover:text-white transition-colors duration-200 text-sm">Our Story</Link></li>
              <li><Link to="/custom-orders" className="text-slate-300 hover:text-white transition-colors duration-200 text-sm">Custom Orders</Link></li>
              <li><Link to="/care-instructions" className="text-slate-300 hover:text-white transition-colors duration-200 text-sm">Care Guide</Link></li>
              <li><Link to="/shipping" className="text-slate-300 hover:text-white transition-colors duration-200 text-sm">Shipping & Returns</Link></li>
              <li><Link to="/reviews" className="text-slate-300 hover:text-white transition-colors duration-200 text-sm">Customer Reviews</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Get in Touch</h4>
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span className="text-slate-300 text-sm">(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span className="text-slate-300 text-sm">hello@beautifulbeginnings.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300 text-sm">
                  123 Craft Lane<br />
                  Artisan Village, AV 12345
                </span>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors duration-200 p-2 bg-slate-800 rounded-lg hover:bg-slate-700">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors duration-200 p-2 bg-slate-800 rounded-lg hover:bg-slate-700">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-slate-400">
              © 2024 Beautiful Beginnings. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-slate-400 hover:text-white transition-colors duration-200">Privacy Policy</Link>
              <Link to="/terms" className="text-slate-400 hover:text-white transition-colors duration-200">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
