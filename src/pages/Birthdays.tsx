
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, ArrowLeft, Info, Sparkles, Gift, PartyPopper } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSettings } from '@/hooks/useSettings';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description: string;
  category: string;
  seo_title?: string;
}

const Birthdays = () => {
  const { settings } = useSettings();
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
        .select('id, name, price, image_url, description, category, seo_title')
        .eq('is_active', true)
        .in('category', ['Necklaces', 'Ornaments', 'Snow Globes', 'Wood Sublimation', 'Slate'])
        .order('sort_order', { ascending: true })
        .limit(12);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#E28F84] border-t-transparent mx-auto mb-4"></div>
              <p className="text-lg" style={{ color: '#A89B84' }}>Loading birthday gift ideas...</p>
            </div>
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
            <span style={{ color: '#5B4C37' }}>Birthday Gifts</span>
          </div>

          <div className="text-center">
            <div className="mb-8">
               <img 
                src={settings.logo_url || 'https://ibdjzzgvxlscmwlbuewd.supabase.co/storage/v1/object/public/logos/logo_1755556584395.png'} 
                alt={settings.logo_alt_text || 'Beautiful Beginnings'} 
                className="h-48 w-48 object-contain mx-auto"
              />
            </div>
            
            <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold mb-6" style={{ backgroundColor: '#F6DADA', color: '#7A7047' }}>
              <PartyPopper className="h-4 w-4 mr-2" />
              Make Their Day Special
            </div>
            
            <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6 leading-tight">
              <span style={{ color: '#5B4C37' }}>Birthday Gifts</span>
              <br />
              <span className="bg-gradient-to-r from-[#E28F84] to-[#F4A79B] bg-clip-text text-transparent">That Make Memories</span>
            </h1>
            
            <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed" style={{ color: '#A89B84' }}>
              Make their special day unforgettable with personalized gifts that celebrate who they are and the memories you've shared. 
              From custom photo keepsakes to meaningful jewelry, find the perfect way to show how much they mean to you 
              on their birthday and every day after.
            </p>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto mb-12" style={{ borderColor: '#F6DADA', borderWidth: '1px' }}>
              <div className="flex items-center justify-center mb-4">
                <Gift className="h-8 w-8 mr-3" style={{ color: '#E28F84' }} />
                <PartyPopper className="h-6 w-6" style={{ color: '#7A7047' }} />
              </div>
              <h2 className="text-2xl font-playfair font-semibold mb-3" style={{ color: '#5B4C37' }}>
                Celebrate Another Year of Joy
              </h2>
              <p className="mb-6 max-w-2xl mx-auto" style={{ color: '#A89B84' }}>
                Every birthday deserves to be celebrated with something special. Our personalized gifts capture the essence 
                of your relationship and create lasting memories that will be treasured for years to come.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {products.length > 0 ? (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-playfair font-bold mb-4" style={{ color: '#5B4C37' }}>
                Perfect Birthday Gift Ideas
              </h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: '#A89B84' }}>
                Thoughtfully curated gifts that celebrate their unique personality and the special bond you share together.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-gray-100"
                >
                  <div className="relative overflow-hidden aspect-square">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <button
                      onClick={() => toggleLike(product.id)}
                      className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white hover:scale-110 transition-all duration-200 shadow-md"
                    >
                      <Heart
                        className={`h-4 w-4 transition-all duration-200 ${
                          likedProducts.has(product.id)
                            ? 'text-red-500 fill-current scale-110'
                            : 'text-gray-500'
                        }`}
                      />
                    </button>
                    <div className="absolute bottom-4 left-4">
                      <div className="px-3 py-1 rounded-full text-xs font-medium text-white bg-black/50 backdrop-blur-sm">
                        Birthday Gift
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-playfair font-bold text-xl mb-3 group-hover:text-[#E28F84] transition-colors duration-300" style={{ color: '#5B4C37' }}>
                      {product.name}
                    </h3>
                    <p className="text-sm leading-relaxed mb-4 line-clamp-3" style={{ color: '#A89B84' }}>
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-2xl font-bold" style={{ color: '#E28F84' }}>
                        ${product.price.toFixed(2)}
                      </span>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="w-1 h-1 rounded-full" style={{ backgroundColor: '#E28F84' }}></div>
                        ))}
                        <span className="text-xs ml-2" style={{ color: '#A89B84' }}>5.0</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Link to={`/products/${product.category.toLowerCase().replace(' ', '-')}/${product.id}`} className="block">
                        <Button 
                          size="sm"
                          variant="outline" 
                          className="w-full text-sm py-2 border-2 bg-white hover:bg-gray-50 transition-all duration-300"
                          style={{ borderColor: '#E28F84', color: '#5B4C37' }}
                        >
                          <Info className="h-4 w-4 mr-2" />
                          Personalize This Gift
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
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center" style={{ backgroundColor: '#F6DADA' }}>
                  <Gift className="h-12 w-12" style={{ color: '#E28F84' }} />
                </div>
              </div>
              <h3 className="text-2xl font-playfair font-bold mb-4" style={{ color: '#5B4C37' }}>
                New Birthday Gifts Coming Soon
              </h3>
              <p className="text-lg mb-6" style={{ color: '#A89B84' }}>
                We're preparing wonderful new birthday gifts just for you. Check back soon for our latest collection!
              </p>
              <Link to="/">
                <Button 
                  className="px-6 py-3 text-white font-semibold rounded-lg"
                  style={{ backgroundColor: '#E28F84' }}
                >
                  Explore Other Products
                </Button>
              </Link>
            </div>
          </div>
        )}

        <div className="text-center mt-16">
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

export default Birthdays;
