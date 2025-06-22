
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import CartDrawer from '@/components/CartDrawer';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getCartCount } = useCart();

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Snow Globes', href: '/products/snow-globes' },
    { name: 'Necklaces', href: '/products/necklaces' },
    { name: 'Ornaments', href: '/products/ornaments' },
    { name: 'Slate Products', href: '/products/slate' },
    { name: 'Wood Pictures', href: '/products/wood-sublimation' },
  ];

  return (
    <nav className="bg-primary shadow-lg sticky top-0 z-50 relative overflow-hidden">
      {/* Decorative leaves */}
      <div className="absolute inset-0 opacity-10">
        <Leaf className="absolute top-2 left-10 h-6 w-6 text-accent rotate-12" />
        <Leaf className="absolute top-4 right-20 h-4 w-4 text-accent -rotate-45" />
        <Leaf className="absolute bottom-2 left-1/4 h-5 w-5 text-accent rotate-45" />
        <Leaf className="absolute bottom-3 right-1/3 h-4 w-4 text-accent -rotate-12" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/5e4be881-9356-47e3-ba32-e012d51e3e8c.png" 
                alt="Beautiful Beginnings Logo" 
                className="h-12 w-12 object-contain bg-white/20 rounded-full p-2"
              />
              <div>
                <h1 className="text-2xl font-playfair font-bold text-white">
                  Beautiful Beginnings
                </h1>
                <p className="text-xs text-white/80 -mt-1 tracking-wide">
                  Handcrafted with Love
                </p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-white/90 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10 relative group"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-200 group-hover:w-full"></span>
                </Link>
              ))}
            </div>
          </div>

          {/* Cart & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <CartDrawer>
              <Button
                variant="ghost"
                size="sm"
                className="relative hover:bg-white/10 transition-colors duration-200 text-white hover:text-white"
              >
                <ShoppingCart className="h-6 w-6" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {getCartCount()}
                  </span>
                )}
              </Button>
            </CartDrawer>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="hover:bg-white/10 transition-colors duration-200 text-white hover:text-white"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden animate-fade-in">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-primary border-t border-white/20">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-white/90 hover:text-white block px-4 py-3 rounded-lg text-base font-medium hover:bg-white/10 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
