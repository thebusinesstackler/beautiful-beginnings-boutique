
import { Link } from 'react-router-dom';
import { Heart, Instagram, Facebook, Mail, Phone, MapPin, Award, Leaf } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white text-foreground relative overflow-hidden">
      {/* Decorative leaves */}
      <div className="absolute inset-0 opacity-5">
        <Leaf className="absolute top-8 left-16 h-8 w-8 text-primary rotate-12" />
        <Leaf className="absolute top-12 right-24 h-6 w-6 text-primary -rotate-45" />
        <Leaf className="absolute bottom-16 left-32 h-7 w-7 text-primary rotate-45" />
        <Leaf className="absolute bottom-20 right-40 h-5 w-5 text-primary -rotate-12" />
        <Leaf className="absolute top-32 left-1/4 h-6 w-6 text-accent rotate-90" />
        <Leaf className="absolute bottom-32 right-1/3 h-8 w-8 text-accent -rotate-30" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        {/* Centered Logo Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center space-x-4 mb-6">
            <img 
              src="/lovable-uploads/5e4be881-9356-47e3-ba32-e012d51e3e8c.png" 
              alt="Beautiful Beginnings Logo" 
              className="h-20 w-20 object-contain"
            />
            <div>
              <h3 className="text-4xl font-playfair font-bold text-primary">
                Beautiful Beginnings
              </h3>
              <p className="text-lg text-muted-foreground tracking-wide">
                Handcrafted with Love
              </p>
            </div>
          </div>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
            Creating treasured keepsakes that celebrate your most precious memories. Each piece is lovingly handcrafted to last a lifetime.
          </p>
          
          {/* Awards */}
          <div className="flex items-center justify-center space-x-2 mb-8 p-4 bg-accent/10 rounded-xl inline-flex">
            <Award className="h-6 w-6 text-accent" />
            <span className="text-lg font-medium text-foreground">5-Star Rated Business</span>
          </div>
          
          <div className="flex justify-center space-x-4">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200 p-3 bg-primary/5 rounded-full hover:bg-primary/10">
              <Instagram className="h-6 w-6" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200 p-3 bg-primary/5 rounded-full hover:bg-primary/10">
              <Facebook className="h-6 w-6" />
            </a>
          </div>
        </div>

        {/* Links Section - Left and Right of Center */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Quick Links - Left Side */}
          <div className="lg:col-span-1">
            <h4 className="text-xl font-playfair font-bold mb-6 text-primary">Shop Collections</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/products/ornaments" className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:pl-2">Keepsake Ornaments</Link></li>
              <li><Link to="/products/necklaces" className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:pl-2">Memory Jewelry</Link></li>
              <li><Link to="/products/slate" className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:pl-2">Slate Keepsakes</Link></li>
              <li><Link to="/products/snow-globes" className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:pl-2">Snow Globes</Link></li>
              <li><Link to="/products/wood-sublimation" className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:pl-2">Wood Art</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="lg:col-span-1">
            <h4 className="text-xl font-playfair font-bold mb-6 text-primary">Customer Care</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:pl-2">Our Story</Link></li>
              <li><Link to="/custom-orders" className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:pl-2">Custom Orders</Link></li>
              <li><Link to="/care-instructions" className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:pl-2">Care Guide</Link></li>
              <li><Link to="/shipping" className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:pl-2">Shipping & Returns</Link></li>
              <li><Link to="/reviews" className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:pl-2">Customer Reviews</Link></li>
            </ul>
          </div>

          {/* Contact Info - Right Side */}
          <div className="lg:col-span-2">
            <h4 className="text-xl font-playfair font-bold mb-6 text-primary">Get in Touch</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
                <Phone className="h-5 w-5 text-accent flex-shrink-0" />
                <span className="text-muted-foreground">(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
                <Mail className="h-5 w-5 text-accent flex-shrink-0" />
                <span className="text-muted-foreground">hello@beautifulbeginnings.com</span>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-primary/5 rounded-lg md:col-span-2">
                <MapPin className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">
                  123 Craft Lane<br />
                  Artisan Village, AV 12345
                </span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-accent/10 rounded-xl border border-accent/20">
              <h5 className="font-playfair font-bold text-primary mb-2">Find Us at Local Markets!</h5>
              <p className="text-xs text-muted-foreground mb-3">Join us at craft fairs and holiday markets throughout the season.</p>
              <Link to="/events" className="text-sm text-accent hover:underline font-medium">View Schedule →</Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              © 2024 Beautiful Beginnings. All rights reserved. Made with ❤️ for preserving memories.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors duration-200">Privacy Policy</Link>
              <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors duration-200">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
