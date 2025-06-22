
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, ArrowLeft, Info, Sparkles, Palette } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const Ornaments = () => {
  const [likedProducts, setLikedProducts] = useState<Set<number>>(new Set());

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const products = [
    {
      id: 1,
      name: "Personalized Photo Ornament",
      price: 12.00,
      image: "/placeholder.svg",
      description: "Custom ornament with your favorite photo - perfect keepsake like our Jacob Santa hat ornament"
    },
    {
      id: 2,
      name: "Round Photo Ornament",
      price: 12.00,
      image: "/placeholder.svg",
      description: "Classic round ornament with your personalized photo and custom text"
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
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <span className="text-foreground">Ornaments</span>
        </div>

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-foreground mb-6">
            Photo Ornaments
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            Transform your favorite memories into beautiful keepsake ornaments perfect for any season
          </p>
          <div className="text-sm text-muted-foreground mb-8">
            Price: $12.00
          </div>
          
          {/* Call to Action */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 max-w-4xl mx-auto mb-12">
            <div className="flex items-center justify-center mb-4">
              <Palette className="h-8 w-8 text-primary mr-3" />
              <Sparkles className="h-6 w-6 text-accent" />
            </div>
            <h2 className="text-2xl font-playfair font-semibold text-foreground mb-3">
              Create Your Personal Keepsake
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Upload your favorite photos and we'll handcraft a beautiful ornament that captures your precious memories forever
            </p>
            <Button className="btn-primary text-lg px-8 py-3">
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
              className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group border border-primary/10"
            >
              <div className="relative overflow-hidden rounded-t-xl">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={() => toggleLike(product.id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200 shadow-md"
                >
                  <Heart
                    className={`h-4 w-4 transition-colors duration-200 ${
                      likedProducts.has(product.id)
                        ? 'text-red-500 fill-current'
                        : 'text-gray-600'
                    }`}
                  />
                </button>
              </div>

              <div className="p-6">
                <Link to={`/products/ornaments/${product.id}`}>
                  <h3 className="font-playfair font-semibold text-lg text-foreground mb-2 hover:text-primary cursor-pointer transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground mb-4">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold text-primary">
                    ${product.price.toFixed(2)}
                  </span>
                  <Link to={`/products/ornaments/${product.id}`}>
                    <Button size="sm" variant="outline" className="text-primary border-primary hover:bg-primary hover:text-white">
                      <Info className="h-4 w-4 mr-2" />
                      Learn More
                    </Button>
                  </Link>
                </div>
                
                <Button size="sm" className="btn-primary w-full">
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
            <Button variant="outline" className="px-6 py-3 border-primary text-primary hover:bg-primary hover:text-white">
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

export default Ornaments;
