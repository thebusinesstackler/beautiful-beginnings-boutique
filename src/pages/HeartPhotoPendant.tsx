
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, ArrowLeft, Star, Plus, Minus, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';
import PhotoUpload from '@/components/PhotoUpload';

const HeartPhotoPendant = () => {
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const product = {
    id: 2,
    name: "Heart Photo Pendant",
    price: 15.00,
    images: [
      "https://img.kwcdn.com/product/open/2fe48b660cda4288b8989a4cce3e7ccf-goods.jpeg?imageView2/2/w/800/q/70/format/webp",
      "https://img.kwcdn.com/product/open/2fe48b660cda4288b8989a4cce3e7ccf-goods.jpeg?imageView2/2/w/800/q/70/format/webp",
      "https://img.kwcdn.com/product/open/2fe48b660cda4288b8989a4cce3e7ccf-goods.jpeg?imageView2/2/w/800/q/70/format/webp"
    ],
    description: "Heart-shaped pendant with your favorite photo",
    fullDescription: "Express your love with this beautiful heart-shaped photo pendant. Each piece is carefully crafted to showcase your most treasured memories in an elegant heart design. Perfect for romantic gifts, family photos, or keeping loved ones close to your heart wherever you go.",
    features: ["Heart-shaped design", "High-quality photo printing", "Elegant chain included", "Scratch-resistant surface", "Perfect gift packaging"],
    specifications: ["Chain length: 16-18 inches adjustable", "Pendant size: 1.2 inches heart shape", "Material: Premium stainless steel", "Photo: Crystal clear printing", "Finish: Polished heart design"]
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0]
      });
    }
    toast({
      title: "Added to cart!",
      description: `${quantity} ${product.name}${quantity > 1 ? 's' : ''} added to your cart.`,
    });
  };

  const handlePhotoUpload = (file: File) => {
    console.log('Photo uploaded for heart pendant:', file.name);
    toast({
      title: "Photo uploaded!",
      description: "Your photo has been uploaded for personalization.",
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
          <Link to="/products/necklaces" className="hover:text-primary">Necklaces</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl bg-white">
              <img
                src={product.images[selectedImage]}
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
            
            {/* Image Thumbnails */}
            <div className="flex space-x-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-primary' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
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
                <span className="text-sm text-muted-foreground">(28 reviews)</span>
              </div>
              <p className="text-xl font-bold text-foreground">
                ${product.price.toFixed(2)}
              </p>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              {product.fullDescription}
            </p>

            {/* Photo Upload Section */}
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6">
              <div className="flex items-center mb-3">
                <Sparkles className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-semibold text-foreground">Upload Your Photo</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Upload your favorite photo to personalize this heart pendant
              </p>
              <PhotoUpload onUpload={handlePhotoUpload} />
            </div>

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

        {/* Back to Necklaces */}
        <div className="mt-16">
          <Link to="/products/necklaces">
            <Button variant="outline" className="px-6 py-3">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Necklaces
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HeartPhotoPendant;
