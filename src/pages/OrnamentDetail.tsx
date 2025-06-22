
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, ArrowLeft, Star, Plus, Minus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';

const OrnamentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Product data - in a real app this would come from an API
  const products = {
    "1": {
      id: 1,
      name: "Personalized Photo Ornament",
      price: 12.00,
      image: "/placeholder.svg",
      description: "Custom ornament with your favorite photo - perfect keepsake like our Jacob Santa hat ornament",
      fullDescription: "Transform your cherished memories into beautiful keepsake ornaments. Each ornament is carefully crafted with your personalized photo and can include custom text. Perfect for holidays, special occasions, or year-round display.",
      features: ["High-quality photo printing", "Durable materials", "Custom text options", "Gift-ready packaging"],
      specifications: ["Size: 3.5 inches", "Material: Premium ceramic", "Finish: Glossy", "Hanging string included"]
    },
    "2": {
      id: 2,
      name: "Round Photo Ornament",
      price: 12.00,
      image: "/placeholder.svg",
      description: "Classic round ornament with your personalized photo and custom text",
      fullDescription: "Classic round design meets modern personalization. This timeless ornament style showcases your favorite photo in a beautiful circular frame, perfect for any tree or display.",
      features: ["Classic round design", "Photo personalization", "Custom text engraving", "Premium finish"],
      specifications: ["Size: 3.5 inches diameter", "Material: Premium ceramic", "Finish: Matte", "Ribbon included"]
    }
  };

  const product = products[id as keyof typeof products];

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link to="/products/ornaments">
            <Button variant="outline">Back to Ornaments</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      });
    }
    toast({
      title: "Added to cart!",
      description: `${quantity} ${product.name}${quantity > 1 ? 's' : ''} added to your cart.`,
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
          <Link to="/products/ornaments" className="hover:text-primary">Ornaments</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl bg-white">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200"
              >
                <Heart
                  className={`h-6 w-6 transition-colors duration-200 ${
                    isLiked ? 'text-red-500 fill-current' : 'text-gray-600'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-playfair font-bold text-foreground mb-2">
                {product.name}
              </h1>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-accent fill-current" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(24 reviews)</span>
              </div>
              <p className="text-xl font-bold text-foreground">
                ${product.price.toFixed(2)}
              </p>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              {product.fullDescription}
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-gray-100"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button 
              size="lg" 
              className="btn-primary w-full"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart - ${(product.price * quantity).toFixed(2)}
            </Button>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Features:</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Specifications */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Specifications:</h3>
              <ul className="space-y-2">
                {product.specifications.map((spec, index) => (
                  <li key={index} className="flex items-center text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3" />
                    {spec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Back to Products */}
        <div className="mt-16">
          <Link to="/products/ornaments">
            <Button variant="outline" className="px-6 py-3">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Ornaments
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrnamentDetail;
