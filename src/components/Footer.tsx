
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail, Phone, MapPin, Award, Star } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative" style={{ backgroundColor: '#7A7047', color: '#FAF5EF' }}>
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
                <h3 className="text-xl font-bold" style={{ color: '#FAF5EF' }}>
                  Beautiful Beginnings
                </h3>
                <p className="text-sm" style={{ color: '#A89B84' }}>
                  Handcrafted with Love
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: '#A89B84' }}>
              Creating treasured keepsakes that celebrate your most precious memories. Each piece is lovingly handcrafted to last a lifetime.
            </p>
            
            {/* Awards Badge */}
            <div className="flex items-center space-x-2 p-3 rounded-lg" style={{ backgroundColor: '#5B4C37', borderColor: '#A89B84', borderWidth: '1px' }}>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-sm font-medium" style={{ color: '#FAF5EF' }}>5-Star Rated</span>
            </div>
          </div>

          {/* Shop Collections */}
          <div>
            <h4 className="text-lg font-semibold mb-6" style={{ color: '#FAF5EF' }}>Shop Collections</h4>
            <ul className="space-y-3">
              <li><Link to="/products/ornaments" className="transition-colors duration-200 text-sm" style={{ color: '#A89B84' }} onMouseEnter={(e) => e.currentTarget.style.color = '#FAF5EF'} onMouseLeave={(e) => e.currentTarget.style.color = '#A89B84'}>Keepsake Ornaments</Link></li>
              <li><Link to="/products/necklaces" className="transition-colors duration-200 text-sm" style={{ color: '#A89B84' }} onMouseEnter={(e) => e.currentTarget.style.color = '#FAF5EF'} onMouseLeave={(e) => e.currentTarget.style.color = '#A89B84'}>Memory Jewelry</Link></li>
              <li><Link to="/products/slate" className="transition-colors duration-200 text-sm" style={{ color: '#A89B84' }} onMouseEnter={(e) => e.currentTarget.style.color = '#FAF5EF'} onMouseLeave={(e) => e.currentTarget.style.color = '#A89B84'}>Slate Keepsakes</Link></li>
              <li><Link to="/products/snow-globes" className="transition-colors duration-200 text-sm" style={{ color: '#A89B84' }} onMouseEnter={(e) => e.currentTarget.style.color = '#FAF5EF'} onMouseLeave={(e) => e.currentTarget.style.color = '#A89B84'}>Snow Globes</Link></li>
              <li><Link to="/products/wood-sublimation" className="transition-colors duration-200 text-sm" style={{ color: '#A89B84' }} onMouseEnter={(e) => e.currentTarget.style.color = '#FAF5EF'} onMouseLeave={(e) => e.currentTarget.style.color = '#A89B84'}>Wood Art</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-lg font-semibold mb-6" style={{ color: '#FAF5EF' }}>Customer Care</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="transition-colors duration-200 text-sm" style={{ color: '#A89B84' }} onMouseEnter={(e) => e.currentTarget.style.color = '#FAF5EF'} onMouseLeave={(e) => e.currentTarget.style.color = '#A89B84'}>Our Story</Link></li>
              <li><Link to="/custom-orders" className="transition-colors duration-200 text-sm" style={{ color: '#A89B84' }} onMouseEnter={(e) => e.currentTarget.style.color = '#FAF5EF'} onMouseLeave={(e) => e.currentTarget.style.color = '#A89B84'}>Custom Orders</Link></li>
              <li><Link to="/care-instructions" className="transition-colors duration-200 text-sm" style={{ color: '#A89B84' }} onMouseEnter={(e) => e.currentTarget.style.color = '#FAF5EF'} onMouseLeave={(e) => e.currentTarget.style.color = '#A89B84'}>Care Guide</Link></li>
              <li><Link to="/shipping" className="transition-colors duration-200 text-sm" style={{ color: '#A89B84' }} onMouseEnter={(e) => e.currentTarget.style.color = '#FAF5EF'} onMouseLeave={(e) => e.currentTarget.style.color = '#A89B84'}>Shipping & Returns</Link></li>
              <li><Link to="/reviews" className="transition-colors duration-200 text-sm" style={{ color: '#A89B84' }} onMouseEnter={(e) => e.currentTarget.style.color = '#FAF5EF'} onMouseLeave={(e) => e.currentTarget.style.color = '#A89B84'}>Customer Reviews</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6" style={{ color: '#FAF5EF' }}>Get in Touch</h4>
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 flex-shrink-0" style={{ color: '#E28F84' }} />
                <span className="text-sm" style={{ color: '#A89B84' }}>(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 flex-shrink-0" style={{ color: '#E28F84' }} />
                <span className="text-sm" style={{ color: '#A89B84' }}>hello@beautifulbeginnings.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: '#E28F84' }} />
                <span className="text-sm" style={{ color: '#A89B84' }}>
                  123 Craft Lane<br />
                  Artisan Village, AV 12345
                </span>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="#" className="transition-colors duration-200 p-2 rounded-lg" style={{ backgroundColor: '#5B4C37', color: '#A89B84' }} onMouseEnter={(e) => { e.currentTarget.style.color = '#FAF5EF'; e.currentTarget.style.backgroundColor = '#A89B84'; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#A89B84'; e.currentTarget.style.backgroundColor = '#5B4C37'; }}>
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="transition-colors duration-200 p-2 rounded-lg" style={{ backgroundColor: '#5B4C37', color: '#A89B84' }} onMouseEnter={(e) => { e.currentTarget.style.color = '#FAF5EF'; e.currentTarget.style.backgroundColor = '#A89B84'; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#A89B84'; e.currentTarget.style.backgroundColor = '#5B4C37'; }}>
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8" style={{ borderTop: '1px solid #A89B84' }}>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm" style={{ color: '#A89B84' }}>
              © 2024 Beautiful Beginnings. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="transition-colors duration-200" style={{ color: '#A89B84' }} onMouseEnter={(e) => e.currentTarget.style.color = '#FAF5EF'} onMouseLeave={(e) => e.currentTarget.style.color = '#A89B84'}>Privacy Policy</Link>
              <Link to="/terms" className="transition-colors duration-200" style={{ color: '#A89B84' }} onMouseEnter={(e) => e.currentTarget.style.color = '#FAF5EF'} onMouseLeave={(e) => e.currentTarget.style.color = '#A89B84'}>Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
