import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Star, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  gallery_images: string[];
  category: string;
  description: string;
  is_featured: boolean;
  featured_order: number;
}

const FeaturedProducts = () => {
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, image_url, gallery_images, category, description, is_featured, featured_order')
        .eq('is_featured', true)
        .eq('is_active', true)
        .order('featured_order', { ascending: true })
        .limit(4);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      toast({
        title: "Error",
        description: "Failed to load featured products",
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

  const getProductImage = (product: Product) => {
    return product.image_url || (product.gallery_images && product.gallery_images[0]) || "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400";
  };

  const getProductHref = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'Snow Globes': '/products/snow-globes',
      'Necklaces': '/products/necklaces',
      'Ornaments': '/products/ornaments',
      'Slate': '/products/slate',
      'Wood Sublimation': '/products/wood-sublimation'
    };
    return categoryMap[category] || '/products';
  };

  if (loading) {
    return (
      <section className="py-20" style={{ backgroundColor: '#FAF5EF' }}>
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-sage border-t-transparent mx-auto mb-4"></div>
            <div className="text-charcoal font-medium">Loading featured products...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20" style={{ backgroundColor: '#FAF5EF' }}>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in max-w-7xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-6" style={{ backgroundColor: '#F6DADA', color: '#7A7047' }}>
            <Star className="h-4 w-4 mr-2" />
            Customer Favorites
          </div>
          <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6" style={{ color: '#5B4C37' }}>
            Featured Collections
          </h2>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: '#A89B84' }}>
            Discover our most beloved pieces, each one carefully crafted to turn your memories into lasting treasures
          </p>
        </div>

        {/* Section Divider */}
        <div className="w-full h-px mb-12 max-w-7xl mx-auto" style={{ backgroundColor: '#F6DADA' }}></div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 group animate-fade-in"
                style={{ borderColor: '#F6DADA', borderWidth: '1px' }}
              >
                {/* Product Image */}
                <div className="relative overflow-hidden rounded-t-2xl">
                  <Link to={getProductHref(product.category)}>
                    <img
                      src={getProductImage(product)}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </Link>
                  
                  {/* Like Button */}
                  <button
                    onClick={() => toggleLike(product.id)}
                    className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 hover:scale-110"
                  >
                    <Heart
                      className={`h-5 w-5 transition-colors duration-200 ${
                        likedProducts.has(product.id)
                          ? 'text-red-500 fill-current'
                          : 'text-gray-600'
                      }`}
                    />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded" style={{ backgroundColor: '#F6DADA', color: '#7A7047' }}>
                      {product.category}
                    </span>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-3 w-3 fill-current"
                          style={{ color: '#E28F84' }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <Link to={getProductHref(product.category)}>
                    <h3 className="font-playfair font-bold text-xl mb-3 line-clamp-2 hover:text-primary transition-colors leading-tight" style={{ color: '#5B4C37' }}>
                      {product.name}
                    </h3>
                  </Link>
                  
                  <p className="text-sm mb-4 line-clamp-2 leading-relaxed" style={{ color: '#A89B84' }}>
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold" style={{ color: '#5B4C37' }}>
                        ${product.price.toFixed(2)}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105 text-white font-semibold"
                      style={{ backgroundColor: '#E28F84' }}
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
          <div className="text-center py-16 max-w-7xl mx-auto">
            <p className="text-xl text-stone mb-4">No featured products available</p>
            <p className="text-stone">Products can be featured from the admin dashboard</p>
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-16 max-w-7xl mx-auto">
          <Button 
            className="px-10 py-4 text-lg group font-semibold rounded-lg border-2 transition-all duration-200"
            style={{ 
              borderColor: '#a48f4b', 
              color: '#a48f4b',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F6DADA';
              e.currentTarget.style.borderColor = '#a48f4b';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = '#a48f4b';
            }}
          >
            View All Products
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
