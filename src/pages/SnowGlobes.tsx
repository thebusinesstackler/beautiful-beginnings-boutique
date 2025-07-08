
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, ArrowLeft, Info, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description: string;
  seo_title?: string;
}

const SnowGlobes = () => {
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, image_url, description, seo_title')
        .eq('category', 'Snow Globes')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load products. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = (productId: string) => {
    const newLiked = new Set(likedProducts);
    if (newLiked.has(productId)) {
      newLiked.delete(productId);
    } else {
      newLiked.add(productId);
    }
    setLikedProducts(newLiked);
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: parseInt(product.id),
      name: product.name,
      price: product.price,
      image: product.image_url
    });
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const truncateDescription = (description: string, maxLength: number = 150) => {
    if (!description) return '';
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength).trim() + '...';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-sage border-t-transparent"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden" style={{ backgroundColor: '#FAF5EF' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-rose-200 rounded-full blur-xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-rose-100 rounded-full blur-lg"></div>
          <div className="absolute bottom-32 left-32 w-28 h-28 bg-rose-200 rounded-full blur-xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center space-x-2 text-sm mb-8" style={{ color: '#A89B84' }}>
            <Link to="/" className="hover:text-[#E28F84] transition-colors">Home</Link>
            <span>/</span>
            <span style={{ color: '#5B4C37' }}>Snow Globes</span>
          </div>

          <div className="text-center">
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
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {products.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 overflow-hidden border border-gray-100"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <button
                    onClick={() => toggleLike(product.id)}
                    className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg"
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

                <div className="p-6">
                  <h3 className="font-playfair font-bold text-xl mb-3 group-hover:text-[#E28F84] transition-colors duration-300" style={{ color: '#5B4C37' }}>
                    {product.name}
                  </h3>
                  <p className="text-sm leading-relaxed mb-4 h-12 overflow-hidden" style={{ color: '#A89B84' }}>
                    {truncateDescription(product.description, 100)}
                  </p>
                  
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-2xl font-bold" style={{ color: '#E28F84' }}>
                      ${product.price.toFixed(2)}
                    </span>
                    <div className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#F6DADA', color: '#7A7047' }}>
                      Handcrafted
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Link to={`/products/snow-globes/${product.id}`} className="block">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full text-sm py-2 border-2 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-300"
                        style={{ borderColor: '#E28F84' }}
                      >
                        <Info className="h-4 w-4 mr-2" />
                        Learn More
                      </Button>
                    </Link>
                    
                    <Button 
                      size="sm" 
                      className="w-full text-sm py-2 text-white font-semibold transition-all duration-300 hover:shadow-md"
                      style={{ backgroundColor: '#E28F84' }}
                      onClick={() => handleAddToCart(product)}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F4A79B'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E28F84'}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl mb-4" style={{ color: '#A89B84' }}>No snow globes available at the moment.</p>
            <p style={{ color: '#A89B84' }}>Check back soon for new magical creations!</p>
          </div>
        )}

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
