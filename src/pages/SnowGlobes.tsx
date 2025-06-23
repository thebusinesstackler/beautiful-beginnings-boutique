
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, ArrowLeft, Info, Sparkles, Palette } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import CartDrawer from '@/components/CartDrawer';
import { toast } from '@/hooks/use-toast';

const SnowGlobes = () => {
  const [likedProducts, setLikedProducts] = useState<Set<number>>(new Set());
  const { addToCart } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const products = [
    {
      id: 1,
      name: "Winter Botanical Snow Globe",
      price: 20.00,
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400",
      description: "Transform your winter memories into a magical snow globe that captures the beauty of the season",
      link: "/products/snow-globes/winter-botanical"
    },
    {
      id: 2,
      name: "Custom Photo Snow Globe",
      price: 25.00,
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400",
      description: "Your most precious moments preserved in a enchanting snow globe that brings joy with every shake",
      link: "/products/snow-globes/custom-photo"
    }
  ];

  const toggleLike = (productId: number) => {
    const newLiked = new Set(likedProducts);
    if (newLiked.has(productId)) {
      newLiked.delete(productId);
    } else {
      newLiked.add(productId);
    }
    setLikedProducts(newLiked);
  };

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section with larger logo */}
      <section className="relative py-20 overflow-hidden" style={{ backgroundColor: '#FAF5EF' }}>
        {/* Soft decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-rose-200 rounded-full blur-xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-rose-100 rounded-full blur-lg"></div>
          <div className="absolute bottom-32 left-32 w-28 h-28 bg-rose-200 rounded-full blur-xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm mb-8" style={{ color: '#A89B84' }}>
            <Link to="/" className="hover:text-[#E28F84] transition-colors">Home</Link>
            <span>/</span>
            <span style={{ color: '#5B4C37' }}>Snow Globes</span>
          </div>

          <div className="text-center">
            {/* Large logo */}
            <div className="mb-8">
              <img 
                src="/lovable-uploads/5e4be881-9356-47e3-ba32-e012d51e3e8c.png" 
                alt="Beautiful Beginnings Logo" 
                className="h-48 w-48 object-contain mx-auto"
              />
            </div>
            
            <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold mb-6" style={{ backgroundColor: '#F6DADA', color: '#7A7047' }}>
              <Sparkles className="h-4 w-4 mr-2" />
              Handcrafted Memory Keepsakes
            </div>
            
            <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6 leading-tight">
              <span style={{ color: '#5B4C37' }}>Magical Snow Globes</span>
              <br />
              <span className="bg-gradient-to-r from-[#E28F84] to-[#F4A79B] bg-clip-text text-transparent">Where Memories Dance</span>
            </h1>
            
            <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed" style={{ color: '#A89B84' }}>
              Capture the magic of your most precious moments in enchanting snow globes that bring wonder to your world. 
              Each gentle shake releases a flurry of memories, transforming your favorite photos into mesmerizing keepsakes 
              that sparkle with love and lasting beauty.
            </p>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto mb-12" style={{ borderColor: '#F6DADA', borderWidth: '1px' }}>
              <div className="flex items-center justify-center mb-4">
                <Heart className="h-8 w-8 mr-3" style={{ color: '#E28F84' }} />
                <Sparkles className="h-6 w-6" style={{ color: '#7A7047' }} />
              </div>
              <h2 className="text-2xl font-playfair font-semibold mb-3" style={{ color: '#5B4C37' }}>
                Create Your Winter Wonderland
              </h2>
              <p className="mb-6 max-w-2xl mx-auto" style={{ color: '#A89B84' }}>
                Transform your cherished memories into magical snow globes that capture hearts and create smiles. 
                Every shake brings your story to life in a whirlwind of beauty and wonder.
              </p>
              <Button 
                className="text-lg px-8 py-4 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg"
                style={{ backgroundColor: '#E28F84' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F4A79B'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E28F84'}
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Start Creating Magic
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Modern Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 overflow-hidden border border-gray-100"
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <button
                  onClick={() => toggleLike(product.id)}
                  className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg"
                >
                  <Heart
                    className={`h-5 w-5 transition-all duration-200 ${
                      likedProducts.has(product.id)
                        ? 'text-red-500 fill-current scale-110'
                        : 'text-gray-600'
                    }`}
                  />
                </button>
              </div>

              <div className="p-8">
                <h3 className="font-playfair font-bold text-2xl mb-4 group-hover:text-[#E28F84] transition-colors duration-300" style={{ color: '#5B4C37' }}>
                  {product.name}
                </h3>
                <p className="text-base leading-relaxed mb-6" style={{ color: '#A89B84' }}>
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between mb-8">
                  <span className="text-3xl font-bold" style={{ color: '#E28F84' }}>
                    ${product.price.toFixed(2)}
                  </span>
                  <div className="px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: '#F6DADA', color: '#7A7047' }}>
                    Handcrafted with ❤️
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Link to={product.link} className="block">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="w-full text-base py-3 border-2 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-300 hover:scale-105"
                      style={{ borderColor: '#E28F84' }}
                    >
                      <Info className="h-5 w-5 mr-2" />
                      Discover the Magic
                    </Button>
                  </Link>
                  
                  <Button 
                    size="lg" 
                    className="w-full text-base py-3 text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    style={{ backgroundColor: '#E28F84' }}
                    onClick={() => handleAddToCart(product)}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F4A79B'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E28F84'}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Your Collection
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link to="/">
            <Button 
              variant="outline" 
              className="px-8 py-4 text-lg border-2 transition-all duration-300 hover:scale-105"
              style={{ borderColor: '#7A7047', color: '#7A7047' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F6DADA';
                e.currentTarget.style.borderColor = '#7A7047';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = '#7A7047';
              }}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Return to Beautiful Beginnings
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SnowGlobes;
