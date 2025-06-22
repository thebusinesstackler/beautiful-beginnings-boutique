import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const WoodSublimation = () => {
  const [likedProducts, setLikedProducts] = useState<Set<number>>(new Set());

  const products = [
    {
      id: 1,
      name: "Wood Forest Silhouette",
      price: 15.00,
      image: "/lovable-uploads/dcd1b4a7-b3b9-4b3a-9b1a-1b4a7b3b9b4a.png",
      description: "Beautiful wood piece with forest silhouette cutouts, perfect for rustic décor"
    },
    {
      id: 2,
      name: "HOME Photo Display",
      price: 20.00,
      image: "/lovable-uploads/0e6f2d5b-8c7a-4d3e-9f1b-2c5b8a7d3e9f.png",
      description: "Charming 'HOME' wooden letters with circular photo display"
    },
    {
      id: 3,
      name: "SPOOKY Photo Display",
      price: 20.00,
      image: "/lovable-uploads/f3a9c2d1-7b5e-4c8f-a6d3-9e2c1b5f8a4d.png",
      description: "Fun 'SPOOKY' Halloween-themed wooden letters with photo display"
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
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <span className="text-foreground">Wood Sublimation</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-playfair font-bold text-foreground mb-4">
            Wood Photo Displays
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Beautiful wood pieces and decorative displays that bring warmth and personality to your photo memories
          </p>
          <div className="mt-4 text-sm text-muted-foreground">
            Price Range: $15.00 - $20.00
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
            >
              <div className="relative overflow-hidden rounded-t-xl">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={() => toggleLike(product.id)}
                  className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200"
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
                <h3 className="font-playfair font-semibold text-lg text-foreground mb-2">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-foreground">
                    ${product.price.toFixed(2)}
                  </span>
                  <Button size="sm" className="btn-primary">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link to="/">
            <Button variant="outline" className="px-6 py-3">
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

export default WoodSublimation;
