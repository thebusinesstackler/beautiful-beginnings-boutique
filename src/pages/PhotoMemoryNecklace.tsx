
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, ArrowLeft, Star, Plus, Minus, Sparkles, Shield, Truck, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [showPersonalization, setShowPersonalization] = useState(false);
  const [showShipping, setShowShipping] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
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
    specifications: ["Chain length: 18-20 inches adjustable", "Pendant size: 1 inch diameter", "Material: Stainless steel", "Photo: High-resolution printing", "Finish: Glossy protective coating"],
    benefits: ["Scratch-resistant glossy finish", "Handmade and sublimated", "Ships within 3 business days", "Lifetime memory preservation", "Perfect gift for any occasion"]
  };

  const relatedProducts = [
    { id: 2, name: "Heart Photo Pendant", price: 18.00, image: "https://img.kwcdn.com/product/open/2fe48b660cda4288b8989a4cce3e7ccf-goods.jpeg?imageView2/2/w/800/q/70/format/webp" },
    { id: 3, name: "Custom Photo Bracelet", price: 12.00, image: "https://img.kwcdn.com/product/open/2fe48b660cda4288b8989a4cce3e7ccf-goods.jpeg?imageView2/2/w/800/q/70/format/webp" },
    { id: 4, name: "Photo Memory Ornament", price: 8.00, image: "https://img.kwcdn.com/product/open/2fe48b660cda4288b8989a4cce3e7ccf-goods.jpeg?imageView2/2/w/800/q/70/format/webp" }
  ];

  const reviews = [
    { name: "Sarah M.", rating: 5, comment: "Absolutely beautiful! The photo quality is amazing and it arrived perfectly packaged.", date: "2 weeks ago" },
    { name: "Mike R.", rating: 5, comment: "Got this for my wife with our wedding photo. She loves it and wears it every day!", date: "1 month ago" },
    { name: "Jennifer L.", rating: 4, comment: "Great quality necklace. The chain is sturdy and the photo came out clear.", date: "3 weeks ago" }
  ];

  const faqs = [
    { question: "How do I upload my photo?", answer: "Simply click 'Personalize this item' and use our easy upload tool. We accept JPG, PNG formats up to 20MB." },
    { question: "Can I edit it after I place the order?", answer: "You can make changes within 2 hours of placing your order. After that, production begins and changes aren't possible." },
    { question: "What image size works best?", answer: "For best results, use high-resolution images (at least 1000x1000 pixels) with good lighting and clear focus." }
  ];

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
              <p className="text-2xl font-bold mb-4" style={{ color: '#2d3436' }}>
                ${product.price.toFixed(2)}
              </p>
            </div>

            <p className="leading-relaxed" style={{ color: '#6c5548' }}>
              {product.fullDescription}
            </p>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
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

              {/* Primary Add to Cart Button */}
              <Button 
                size="lg" 
                className="w-full font-semibold text-white hover:opacity-90 transition-opacity shadow-md"
                onClick={handleAddToCart}
                style={{ backgroundColor: '#E28F84' }}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart - ${(product.price * quantity).toFixed(2)}
              </Button>
            </div>

            {/* Personalization Toggle */}
            <div className="rounded-xl p-4 shadow-sm border-2" style={{ backgroundColor: 'white', borderColor: '#F6DADA' }}>
              <button
                onClick={() => setShowPersonalization(!showPersonalization)}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2" style={{ color: '#a48f4b' }} />
                  <h3 className="font-semibold" style={{ color: '#2d3436' }}>Personalize this item</h3>
                </div>
                {showPersonalization ? (
                  <ChevronUp className="h-5 w-5" style={{ color: '#a48f4b' }} />
                ) : (
                  <ChevronDown className="h-5 w-5" style={{ color: '#a48f4b' }} />
                )}
              </button>
              
              {showPersonalization && (
                <div className="mt-4 animate-fade-in">
                  <p className="text-sm mb-4" style={{ color: '#6c5548' }}>
                    Upload your favorite photo to personalize this necklace
                  </p>
                  <PhotoUpload onUpload={handlePhotoUpload} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Below the Fold Content */}
        <div className="mt-20 space-y-16">
          {/* Product Benefits */}
          <section className="bg-white p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl font-playfair font-bold mb-6" style={{ color: '#2d3436' }}>
              Why Choose Our Photo Memory Necklace?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#E28F84' }} />
                  <span style={{ color: '#6c5548' }}>{benefit}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Related Products */}
          <section>
            <h2 className="text-2xl font-playfair font-bold mb-8" style={{ color: '#2d3436' }}>
              Customers Also Bought
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-semibold mb-2" style={{ color: '#2d3436' }}>{item.name}</h3>
                  <p className="font-bold" style={{ color: '#E28F84' }}>${item.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Customer Reviews */}
          <section className="bg-white p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl font-playfair font-bold mb-8" style={{ color: '#2d3436' }}>
              Customer Reviews
            </h2>
            <div className="space-y-6">
              {reviews.map((review, index) => (
                <div key={index} className="border-b border-gray-100 pb-6 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold" style={{ color: '#2d3436' }}>{review.name}</span>
                      <div className="flex items-center">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" style={{ color: '#E28F84' }} />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm" style={{ color: '#a48f4b' }}>{review.date}</span>
                  </div>
                  <p style={{ color: '#6c5548' }}>{review.comment}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ Section */}
          <section className="bg-white p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl font-playfair font-bold mb-8" style={{ color: '#2d3436' }}>
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                  <button
                    onClick={() => setShowFAQ(showFAQ === index ? -1 : index)}
                    className="w-full flex items-center justify-between text-left py-2"
                  >
                    <h3 className="font-semibold" style={{ color: '#2d3436' }}>{faq.question}</h3>
                    {showFAQ === index ? (
                      <ChevronUp className="h-5 w-5" style={{ color: '#a48f4b' }} />
                    ) : (
                      <ChevronDown className="h-5 w-5" style={{ color: '#a48f4b' }} />
                    )}
                  </button>
                  {showFAQ === index && (
                    <p className="mt-2 animate-fade-in" style={{ color: '#6c5548' }}>{faq.answer}</p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Shipping & Returns */}
          <section className="bg-white p-8 rounded-xl shadow-sm">
            <button
              onClick={() => setShowShipping(!showShipping)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center space-x-3">
                <Truck className="h-6 w-6" style={{ color: '#E28F84' }} />
                <div>
                  <h2 className="text-xl font-playfair font-bold" style={{ color: '#2d3436' }}>
                    Shipping & Returns
                  </h2>
                  <p className="text-sm" style={{ color: '#a48f4b' }}>
                    Ships in 3–5 business days · Free returns on defects
                  </p>
                </div>
              </div>
              {showShipping ? (
                <ChevronUp className="h-5 w-5" style={{ color: '#a48f4b' }} />
              ) : (
                <ChevronDown className="h-5 w-5" style={{ color: '#a48f4b' }} />
              )}
            </button>
            
            {showShipping && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                <div className="flex items-start space-x-3">
                  <Truck className="h-5 w-5 mt-1" style={{ color: '#E28F84' }} />
                  <div>
                    <h4 className="font-semibold mb-1" style={{ color: '#2d3436' }}>Fast Shipping</h4>
                    <p className="text-sm" style={{ color: '#6c5548' }}>Orders processed within 24 hours and shipped within 3-5 business days.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <RotateCcw className="h-5 w-5 mt-1" style={{ color: '#E28F84' }} />
                  <div>
                    <h4 className="font-semibold mb-1" style={{ color: '#2d3436' }}>Easy Returns</h4>
                    <p className="text-sm" style={{ color: '#6c5548' }}>Free returns within 30 days for manufacturing defects.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 mt-1" style={{ color: '#E28F84' }} />
                  <div>
                    <h4 className="font-semibold mb-1" style={{ color: '#2d3436' }}>Quality Guarantee</h4>
                    <p className="text-sm" style={{ color: '#6c5548' }}>100% satisfaction guarantee or your money back.</p>
                  </div>
                </div>
              </div>
            )}
          </section>
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
