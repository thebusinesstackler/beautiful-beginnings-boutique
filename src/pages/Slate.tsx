
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, ArrowLeft, Info, Sparkles, Palette } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const Slate = () => {
  const [likedProducts, setLikedProducts] = useState<Set<number>>(new Set());

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const products = [
    {
      id: 1,
      name: "Natural Edge Slate Photo",
      price: 25.00,
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400",
      description: "Beautiful natural edge slate with your photo, perfect for rustic home décor"
    },
    {
      id: 2,
      name: "Rectangular Slate Display",
      price: 30.00,
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400",
      description: "Clean rectangular slate perfect for family photos and special memories"
    },
    {
      id: 3,
      name: "Large Slate Memorial",
      price: 40.00,
      originalPrice: 45.00,
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400",
      description: "Large slate piece perfect for memorial or special occasions"
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

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#faf6ee' }}>
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm mb-8" style={{ color: '#a48f4b' }}>
          <Link to="/" className="hover:opacity-80">Home</Link>
          <span>/</span>
          <span style={{ color: '#2d3436' }}>Slate Products</span>
        </div>

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-6" style={{ color: '#2d3436' }}>
            Slate Photo Keepsakes
          </h1>
          <p className="text-lg max-w-2xl mx-auto mb-4" style={{ color: '#6c5548' }}>
            Elegant slate pieces with your photos, perfect for home décor and memorial displays
          </p>
          <div className="text-sm mb-8" style={{ color: '#a48f4b' }}>
            Price Range: $25.00 - $40.00
          </div>
          
          {/* Call to Action */}
          <div className="bg-white rounded-2xl p-8 max-w-4xl mx-auto mb-12 shadow-sm">
            <div className="flex items-center justify-center mb-4">
              <Palette className="h-8 w-8 mr-3" style={{ color: '#E28F84' }} />
              <Sparkles className="h-6 w-6" style={{ color: '#a48f4b' }} />
            </div>
            <h2 className="text-2xl font-playfair font-semibold mb-3" style={{ color: '#2d3436' }}>
              Design Your Slate Masterpiece
            </h2>
            <p className="mb-6 max-w-2xl mx-auto" style={{ color: '#6c5548' }}>
              Create an elegant and timeless slate keepsake that beautifully displays your most treasured memories
            </p>
            <Button className="text-lg px-8 py-3 text-white font-semibold shadow-md" style={{ backgroundColor: '#E28F84' }}>
              <Sparkles className="h-5 w-5 mr-2" />
              Start Personalizing Now
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group border"
              style={{ borderColor: '#F6DADA' }}
            >
              <div className="relative overflow-hidden rounded-t-xl">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.originalPrice && (
                  <div className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium text-white" style={{ backgroundColor: '#E28F84' }}>
                    Sale
                  </div>
                )}
                <button
                  onClick={() => toggleLike(product.id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200 shadow-md"
                >
                  <Heart
                    className={`h-4 w-4 transition-colors duration-200 ${
                      likedProducts.has(product.id)
                        ? 'fill-current'
                        : ''
                    }`}
                    style={{ color: likedProducts.has(product.id) ? '#E28F84' : '#a48f4b' }}
                  />
                </button>
              </div>

              <div className="p-6">
                <h3 className="font-playfair font-semibold text-lg mb-2 hover:opacity-80 cursor-pointer transition-opacity" style={{ color: '#2d3436' }}>
                  {product.name}
                </h3>
                <p className="text-sm mb-4" style={{ color: '#6c5548' }}>
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold" style={{ color: '#E28F84' }}>
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm line-through" style={{ color: '#a48f4b' }}>
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <Button size="sm" variant="outline" className="border hover:bg-white/50" style={{ borderColor: '#E28F84', color: '#E28F84' }}>
                    <Info className="h-4 w-4 mr-2" />
                    Learn More
                  </Button>
                </div>
                
                <Button size="sm" className="w-full text-white font-semibold" style={{ backgroundColor: '#E28F84' }}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link to="/">
            <Button variant="outline" className="px-6 py-3 border-2 font-medium hover:bg-white/50 transition-colors shadow-sm" style={{ borderColor: '#E28F84', color: '#E28F84' }}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Slate;
