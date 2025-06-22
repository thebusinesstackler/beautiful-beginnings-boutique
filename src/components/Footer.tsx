
import { Link } from 'react-router-dom';
import { Heart, Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-rich-brown text-warm-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="h-8 w-8 text-coral-pink fill-current" />
              <div>
                <h3 className="text-xl font-playfair font-bold">
                  Beautiful Beginnings
                </h3>
                <p className="text-xs text-warm-cream/70">Handcrafted with Love</p>
              </div>
            </div>
            <p className="text-warm-cream/80 text-sm mb-6">
              Creating treasured keepsakes that celebrate your most precious memories. Each piece is lovingly handcrafted to last a lifetime.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-warm-cream/60 hover:text-coral-pink transition-colors duration-200">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-warm-cream/60 hover:text-coral-pink transition-colors duration-200">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-playfair font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products/ornaments" className="text-warm-cream/80 hover:text-warm-cream transition-colors duration-200">Keepsake Ornaments</Link></li>
              <li><Link to="/products/holiday-decor" className="text-warm-cream/80 hover:text-warm-cream transition-colors duration-200">Holiday Décor</Link></li>
              <li><Link to="/products/jewelry" className="text-warm-cream/80 hover:text-warm-cream transition-colors duration-200">Jewelry & Accessories</Link></li>
              <li><Link to="/products/drinkware" className="text-warm-cream/80 hover:text-warm-cream transition-colors duration-200">Personalized Drinkware</Link></li>
              <li><Link to="/products/wreaths" className="text-warm-cream/80 hover:text-warm-cream transition-colors duration-200">Wreaths & Home Décor</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-lg font-playfair font-semibold mb-4">Customer Care</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-warm-cream/80 hover:text-warm-cream transition-colors duration-200">About Us</Link></li>
              <li><Link to="/custom-orders" className="text-warm-cream/80 hover:text-warm-cream transition-colors duration-200">Custom Orders</Link></li>
              <li><Link to="/care-instructions" className="text-warm-cream/80 hover:text-warm-cream transition-colors duration-200">Care Instructions</Link></li>
              <li><Link to="/shipping" className="text-warm-cream/80 hover:text-warm-cream transition-colors duration-200">Shipping Info</Link></li>
              <li><Link to="/returns" className="text-warm-cream/80 hover:text-warm-cream transition-colors duration-200">Returns & Exchanges</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-playfair font-semibold mb-4">Get in Touch</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-coral-pink flex-shrink-0" />
                <span className="text-warm-cream/80">(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-coral-pink flex-shrink-0" />
                <span className="text-warm-cream/80">hello@beautifulbeginnings.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-coral-pink flex-shrink-0 mt-0.5" />
                <span className="text-warm-cream/80">
                  123 Craft Lane<br />
                  Artisan Village, AV 12345
                </span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-golden-brown/20 rounded-lg">
              <h5 className="font-medium text-warm-cream mb-2">Craft Show Schedule</h5>
              <p className="text-xs text-warm-cream/70">Find us at local markets and fairs!</p>
              <Link to="/events" className="text-xs text-coral-pink hover:underline">View Schedule →</Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-warm-cream/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-warm-cream/60">
              © 2024 Beautiful Beginnings. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-warm-cream/60 hover:text-warm-cream transition-colors duration-200">Privacy Policy</Link>
              <Link to="/terms" className="text-warm-cream/60 hover:text-warm-cream transition-colors duration-200">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
