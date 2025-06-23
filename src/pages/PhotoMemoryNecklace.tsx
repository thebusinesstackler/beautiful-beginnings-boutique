
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, ArrowLeft, Star, Plus, Minus, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';
import PhotoUpload from '@/components/PhotoUpload';

const PhotoMemoryNecklace = () => {
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const product = {
    id: 1,
    name: "Photo Memory Necklace",
    price: 15.00,
    images: [
      "https://img.kwcdn.com/product/open/2fe48b660cda4288b8989a4cce3e7ccf-goods.jpeg?imageView2/2/w/800/q/70/format/webp",
      "https://img.kwcdn.com/product/open/2fe48b660cda4288b8989a4cce3e7ccf-goods.jpeg?imageView2/2/w/800/q/70/format/webp",
      "https://img.kwcdn.com/product/open/2fe48b660cda4288b8989a4cce3e7ccf-goods.jpeg?imageView2/2/w/800/q/70/format/webp"
    ],
    description: "Keep your loved ones close with this personalized photo necklace",
    fullDescription: "Transform your cherished memories into beautiful wearable art. Each Photo Memory Necklace is carefully crafted with your personalized photo, creating a unique piece of jewelry that keeps your loved ones close to your heart. Perfect for commemorating special moments, loved ones, or meaningful memories.",
    features: ["High-quality photo printing", "Durable chain included", "Water-resistant coating", "Custom engraving available", "Gift-ready packaging"],
    specifications: ["Chain length: 18-20 inches adjustable", "Pendant size: 1 inch diameter", "Material: Stainless steel", "Photo: High-resolution printing", "Finish: Glossy protective coating"]
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
    console.log('Photo uploaded for necklace:', file.name);
    toast({
      title: "Photo uploaded!",
      description: "Your photo has been uploaded for personalization.",
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#faf6ee' }}>
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm mb-8" style={{ color: '#a48f4b' }}>
          <Link to="/" className="hover:opacity-80">Home</Link>
          <span>/</span>
          <Link to="/products/necklaces" className="hover:opacity-80">Necklaces</Link>
          <span>/</span>
          <span style={{ color: '#2d3436' }}>{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200 shadow-md"
              >
                <Heart
                  className={`h-6 w-6 transition-colors duration-200 ${
                    isLiked ? 'fill-current' : ''
                  }`}
                  style={{ color: isLiked ? '#E28F84' : '#a48f4b' }}
                />
              </button>
            </div>
            
            {/* Image Thumbnails */}
            <div className="flex space-x-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors shadow-sm ${
                    selectedImage === index ? 'border-2' : 'border-gray-200'
                  }`}
                  style={{ borderColor: selectedImage === index ? '#E28F84' : '#e5e7eb' }}
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
              <h1 className="text-3xl font-playfair font-bold mb-2" style={{ color: '#2d3436' }}>
                {product.name}
              </h1>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" style={{ color: '#E28F84' }} />
                  ))}
                </div>
                <span className="text-sm" style={{ color: '#a48f4b' }}>(32 reviews)</span>
              </div>
              <p className="text-xl font-bold" style={{ color: '#2d3436' }}>
                ${product.price.toFixed(2)}
              </p>
            </div>

            <p className="leading-relaxed" style={{ color: '#6c5548' }}>
              {product.fullDescription}
            </p>

            {/* Photo Upload Section */}
            <div className="rounded-xl p-6 shadow-sm" style={{ backgroundColor: '#F6DADA' }}>
              <div className="flex items-center mb-3">
                <Sparkles className="h-5 w-5 mr-2" style={{ color: '#E28F84' }} />
                <h3 className="font-semibold" style={{ color: '#2d3436' }}>Upload Your Photo</h3>
              </div>
              <p className="text-sm mb-4" style={{ color: '#6c5548' }}>
                Upload your favorite photo to personalize this necklace
              </p>
              <PhotoUpload onUpload={handlePhotoUpload} />
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium" style={{ color: '#2d3436' }}>Quantity:</span>
              <div className="flex items-center border rounded-lg bg-white shadow-sm" style={{ borderColor: '#F6DADA' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-50 transition-colors"
                >
                  <Minus className="h-4 w-4" style={{ color: '#a48f4b' }} />
                </button>
                <span className="px-4 py-2 min-w-[3rem] text-center" style={{ color: '#2d3436' }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-gray-50 transition-colors"
                >
                  <Plus className="h-4 w-4" style={{ color: '#a48f4b' }} />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button 
              size="lg" 
              className="w-full font-semibold text-white hover:opacity-90 transition-opacity shadow-md"
              onClick={handleAddToCart}
              style={{ backgroundColor: '#E28F84' }}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart - ${(product.price * quantity).toFixed(2)}
            </Button>

            {/* Features */}
            <div className="space-y-4 bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-semibold" style={{ color: '#2d3436' }}>Features:</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm" style={{ color: '#6c5548' }}>
                    <div className="w-1.5 h-1.5 rounded-full mr-3" style={{ backgroundColor: '#E28F84' }} />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Specifications */}
            <div className="space-y-4 bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-semibold" style={{ color: '#2d3436' }}>Specifications:</h3>
              <ul className="space-y-2">
                {product.specifications.map((spec, index) => (
                  <li key={index} className="flex items-center text-sm" style={{ color: '#6c5548' }}>
                    <div className="w-1.5 h-1.5 rounded-full mr-3" style={{ backgroundColor: '#E28F84' }} />
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
            <Button 
              variant="outline" 
              className="px-6 py-3 border-2 font-medium hover:bg-white/50 transition-colors shadow-sm"
              style={{ borderColor: '#E28F84', color: '#E28F84' }}
            >
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

export default PhotoMemoryNecklace;
