
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, ArrowLeft, Info } from 'lucide-react';
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
      description: "Beautiful snow globe with winter botanical scene, perfect for holiday displays"
    },
    {
      id: 2,
      name: "Custom Photo Snow Globe",
      price: 25.00,
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400",
      description: "Premium snow globe with your favorite photo and enhanced base details"
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
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <span className="text-foreground">Snow Globes</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-playfair font-bold text-foreground mb-4">
            Snow Globes
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Beautiful snow globes with your favorite photos, perfect for holiday displays and year-round memories
          </p>
          <div className="mt-4 text-sm text-muted-foreground">
            Price Range: $20.00 - $25.00
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
                <h3 className="font-playfair font-semibold text-lg text-foreground mb-2 hover:text-primary cursor-pointer transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold text-foreground">
                    ${product.price.toFixed(2)}
                  </span>
                  <Button size="sm" variant="outline" className="text-primary border-primary hover:bg-primary hover:text-white">
                    <Info className="h-4 w-4 mr-2" />
                    Learn More
                  </Button>
                </div>
                
                <Button 
                  size="sm" 
                  className="btn-primary w-full"
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
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

export default SnowGlobes;
