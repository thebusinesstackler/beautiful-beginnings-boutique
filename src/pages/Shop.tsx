import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Filter } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
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
  is_active: boolean;
}

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, image_url, gallery_images, category, description, is_active')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      
      setProducts(data || []);
      
      // Extract unique categories
      const uniqueCategories = Array.from(new Set(data?.map(p => p.category) || []));
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category === selectedCategory));
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

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: parseInt(product.id.replace(/-/g, '').substring(0, 8), 16), // Convert UUID to number
      name: product.name,
      price: product.price,
      image: getProductImage(product),
      quantity: 1
    });
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-sage border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20" style={{ backgroundColor: '#faf6ee' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6" style={{ color: '#5B4C37' }}>
            Shop All Products
          </h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: '#A89B84' }}>
            Discover our complete collection of personalized keepsakes and gifts
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b" style={{ borderColor: '#F6DADA' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold" style={{ color: '#5B4C37' }}>
              {filteredProducts.length} Products
            </h2>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Category Filters */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('all')}
                className="mb-2"
                style={selectedCategory === 'all' ? { backgroundColor: '#E28F84', color: 'white' } : {}}
              >
                All Products
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                  className="mb-2"
                  style={selectedCategory === category ? { backgroundColor: '#E28F84', color: 'white' } : {}}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 group"
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
                        onClick={() => handleAddToCart(product)}
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
            <div className="text-center py-16">
              <p className="text-xl mb-4" style={{ color: '#A89B84' }}>No products found</p>
              <p style={{ color: '#A89B84' }}>Try selecting a different category</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Shop;
