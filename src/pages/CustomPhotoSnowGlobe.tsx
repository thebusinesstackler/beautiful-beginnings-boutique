
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, ArrowLeft, Star, Plus, Minus, Camera, Upload, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';

const CustomPhotoSnowGlobe = () => {
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const product = {
    id: 2,
    name: "Custom Photo Snow Globe",
    price: 25.00,
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400",
    description: "Premium snow globe with your favorite photo and enhanced base details",
    fullDescription: "Transform your most cherished memories into a magical snow globe! Our Custom Photo Snow Globe features your favorite photo beautifully displayed inside a premium glass globe with swirling snow. Each shake brings your memory to life in the most enchanting way. Perfect for preserving special moments, commemorating loved ones, or creating unique gifts that will be treasured forever.",
    features: [
      "Your custom photo professionally printed",
      "Premium quality snow effect",
      "Enhanced decorative base with details",
      "High-resolution photo processing",
      "Protective gift packaging included",
      "Weather-resistant materials"
    ],
    specifications: [
      "Size: 4.5 inches diameter",
      "Material: Premium glass and resin",
      "Photo: High-quality waterproof print",
      "Base: Decorative weighted base",
      "Processing: 3-5 business days"
    ]
  };

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
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to="/products/snow-globes" className="hover:text-primary">Snow Globes</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 p-8">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-96 object-cover rounded-xl"
              />
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200 shadow-lg"
              >
                <Heart
                  className={`h-6 w-6 transition-colors duration-200 ${
                    isLiked ? 'text-red-500 fill-current' : 'text-gray-600'
                  }`}
                />
              </button>
              
              {/* Camera icon overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-6">
                  <Camera className="h-12 w-12 text-white" />
                </div>
              </div>
              
              {/* Sparkle decorations */}
              <div className="absolute top-8 left-8">
                <Sparkles className="h-6 w-6 text-purple-300 animate-pulse" />
              </div>
              <div className="absolute bottom-8 right-8">
                <Sparkles className="h-4 w-4 text-pink-200 animate-pulse" style={{ animationDelay: '1s' }} />
              </div>
            </div>
            
            {/* Photo Upload Preview */}
            <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-6 border-2 border-dashed border-primary/20">
              <div className="text-center">
                <Upload className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Upload Your Photo</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add your favorite photo after purchase to personalize your snow globe
                </p>
                <Button variant="outline" size="sm" className="text-primary border-primary">
                  <Camera className="h-4 w-4 mr-2" />
                  Choose Photo Later
                </Button>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Camera className="h-5 w-5 text-primary" />
                <span className="text-sm text-primary font-medium">Personalized</span>
              </div>
              <h1 className="text-3xl font-playfair font-bold text-foreground mb-2">
                {product.name}
              </h1>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(63 reviews)</span>
              </div>
              <p className="text-2xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </p>
            </div>

            <p className="text-muted-foreground leading-relaxed text-lg">
              {product.fullDescription}
            </p>

            {/* Customization Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Camera className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800">Photo Upload Process</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    After purchase, you'll receive instructions to upload your high-resolution photo. Processing takes 3-5 business days.
                  </p>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100 transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 min-w-[3rem] text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-gray-100 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button 
              size="lg" 
              className="btn-primary w-full text-lg py-4"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart - ${(product.price * quantity).toFixed(2)}
            </Button>

            {/* Features */}
            <div className="space-y-4 bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-foreground flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-primary" />
                Premium Features:
              </h3>
              <ul className="space-y-3">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Specifications */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Product Details:</h3>
              <ul className="space-y-2">
                {product.specifications.map((spec, index) => (
                  <li key={index} className="flex items-center text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3" />
                    {spec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Back to Snow Globes */}
        <div className="mt-16 text-center">
          <Link to="/products/snow-globes">
            <Button variant="outline" className="px-8 py-3 mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Snow Globes
            </Button>
          </Link>
          <Link to="/">
            <Button variant="ghost" className="px-8 py-3">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CustomPhotoSnowGlobe;
