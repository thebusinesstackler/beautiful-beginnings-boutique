import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import CartDrawer from '@/components/CartDrawer';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getCartCount } = useCart();

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Snow Globes', href: '/products/snow-globes' },
    { name: 'Necklaces', href: '/products/necklaces' },
    { name: 'Ornaments', href: '/products/ornaments' },
    { name: 'Slate Products', href: '/products/slate' },
    { name: 'Wood Pictures', href: '/products/wood-sublimation' },
  ];

  return (
    <nav className="shadow-lg sticky top-0 z-50" style={{ backgroundColor: '#faf6ee', borderBottom: '1px solid #F6DADA' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex-shrink-0"
            style={{ outline: 'none', boxShadow: 'none', border: 'none' }}
          >
            <img 
              src="/lovable-uploads/5e4be881-9356-47e3-ba32-e012d51e3e8c.png" 
              alt="Beautiful Beginnings Logo" 
              className="h-16 w-16 object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="px-3 py-2 text-sm font-medium transition-colors duration-200 relative group"
                  style={{ 
                    color: '#a48f4b',
                    outline: 'none',
                    boxShadow: 'none',
                    border: 'none'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#E28F84'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#a48f4b'}
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-200 group-hover:w-full" style={{ backgroundColor: '#E28F84' }}></span>
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
                className="relative transition-colors duration-200"
                style={{ 
                  color: '#a48f4b',
                  outline: 'none',
                  boxShadow: 'none',
                  border: 'none'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F6DADA'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <ShoppingCart className="h-5 w-5" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium" style={{ backgroundColor: '#E28F84' }}>
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
                className="transition-colors duration-200"
                style={{ 
                  color: '#a48f4b',
                  outline: 'none',
                  boxShadow: 'none',
                  border: 'none'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F6DADA'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden animate-fade-in">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3" style={{ backgroundColor: '#faf6ee', borderTop: '1px solid #F6DADA' }}>
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-3 py-2 text-base font-medium transition-colors duration-200 rounded-md"
                  style={{ 
                    color: '#a48f4b',
                    outline: 'none',
                    boxShadow: 'none',
                    border: 'none'
                  }}
                  onClick={() => setIsMenuOpen(false)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F6DADA';
                    e.currentTarget.style.color = '#a48f4b';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#a48f4b';
                  }}
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
