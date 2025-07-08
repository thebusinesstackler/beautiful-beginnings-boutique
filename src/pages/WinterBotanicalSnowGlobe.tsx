import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, ArrowLeft, Star, Plus, Minus, Sparkles, Shield, Truck, RotateCcw, ChevronDown, ChevronUp, Gift, Clock, Camera, Eye, Users, Award, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';
import PhotoUpload from '@/components/PhotoUpload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  gallery_images: string[];
  description: string;
  category: string;
}

const WinterBotanicalSnowGlobe = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [uploadedPhoto, setUploadedPhoto] = useState<File | null>(null);
  const [showPersonalization, setShowPersonalization] = useState(false);
  const [showShipping, setShowShipping] = useState(false);
  const [showFAQ, setShowFAQ] = useState<number | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    if (!id) return;
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('category', 'Snow Globes')
        .eq('is_active', true)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: "Error",
        description: "Failed to load product details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const relatedProducts = [
    {
      id: 2,
      name: "Custom Photo Snow Globe",
      price: 25.00,
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400",
      rating: 5,
      reviews: 32,
      href: "/products/snow-globes/custom-photo"
    },
    {
      id: 3,
      name: "Holiday Memory Ornament",
      price: 12.00,
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400",
      rating: 5,
      reviews: 28,
      href: "/products/ornaments"
    },
    {
      id: 4,
      name: "Photo Memory Necklace",
      price: 15.00,
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400",
      rating: 5,
      reviews: 45,
      href: "/products/necklaces"
    }
  ];

  const reviews = [
    { name: "Emma T.", rating: 5, comment: "Absolutely beautiful! The botanical details are stunning and it arrived perfectly packaged.", date: "1 week ago" },
    { name: "David K.", rating: 5, comment: "Perfect holiday decoration. The snow effect is mesmerizing and lasts a long time.", date: "2 weeks ago" },
    { name: "Lisa P.", rating: 5, comment: "Gorgeous craftsmanship. This will be a treasured piece for years to come.", date: "1 month ago" }
  ];

  const faqs = [
    { question: "How long does the snow effect last?", answer: "The premium snow in our globes swirls beautifully for 30+ seconds, much longer than typical snow globes." },
    { question: "Are the botanicals real?", answer: "Yes! We use real preserved botanical elements that are carefully selected and treated for longevity." },
    { question: "Is it safe to ship?", answer: "Absolutely. Each globe is carefully packaged with protective materials and insured during shipping." }
  ];

  const handleAddToCart = () => {
    if (!product) return;
    
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: parseInt(product.id),
        name: product.name,
        price: product.price,
        image: product.image_url
      });
    }
    toast({
      title: "Added to cart!",
      description: `${quantity} ${product.name}${quantity > 1 ? 's' : ''} added to your cart.`,
    });
  };

  const handlePhotoUpload = (file: File) => {
    setUploadedPhoto(file);
    toast({
      title: "Photo uploaded!",
      description: "Your photo has been uploaded for reference.",
    });
  };

  const getProductImages = () => {
    if (!product) return [];
    const images = [];
    if (product.image_url) images.push(product.image_url);
    if (product.gallery_images && product.gallery_images.length > 0) {
      images.push(...product.gallery_images);
    }
    return images.length > 0 ? images : ["https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400"];
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#faf6ee' }}>
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-sage border-t-transparent"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#faf6ee' }}>
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4" style={{ color: '#2d3436' }}>Product not found</h1>
            <Link to="/products/snow-globes">
              <Button variant="outline">Back to Snow Globes</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const productImages = getProductImages();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#faf6ee' }}>
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center space-x-2 text-sm mb-8" style={{ color: '#a48f4b' }}>
          <Link to="/" className="hover:opacity-80">Home</Link>
          <span>/</span>
          <Link to="/products/snow-globes" className="hover:opacity-80">Snow Globes</Link>
          <span>/</span>
          <span style={{ color: '#2d3436' }}>{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg">
              <img
                src={productImages[selectedImage]}
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
              
              {/* Trust badges */}
              <div className="absolute bottom-4 left-4 flex space-x-2">
                <div className="text-xs px-2 py-1 rounded-full font-medium text-white" style={{ backgroundColor: '#a48f4b' }}>
                  <Award className="h-3 w-3 inline mr-1" />
                  Premium Quality
                </div>
              </div>
            </div>
            
            {/* Image Thumbnails */}
            {productImages.length > 1 && (
              <div className="flex space-x-4">
                {productImages.map((image, index) => (
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
            )}

            {/* Photo Upload Section */}
            <Card className="border-2 border-dashed" style={{ borderColor: '#F6DADA' }}>
              <CardHeader>
                <CardTitle className="flex items-center text-lg" style={{ color: '#2d3436' }}>
                  <Camera className="h-5 w-5 mr-2" style={{ color: '#a48f4b' }} />
                  Add Inspiration Photo (Optional)
                </CardTitle>
                <p className="text-sm" style={{ color: '#6c5548' }}>
                  Upload a photo for inspiration or to show us your decor style!
                </p>
              </CardHeader>
              <CardContent>
                <PhotoUpload 
                  onUpload={handlePhotoUpload}
                  maxSizeMB={10}
                  className="mb-4"
                />
                {uploadedPhoto && (
                  <div className="text-center p-4 rounded-lg" style={{ backgroundColor: '#F6DADA' }}>
                    <p className="text-sm font-medium" style={{ color: '#a48f4b' }}>
                      ✨ Photo uploaded! This will help us understand your style.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Social Proof */}
            <div className="bg-white rounded-xl p-4 shadow-sm border" style={{ borderColor: '#F6DADA' }}>
              <div className="flex items-center justify-center space-x-6 text-sm">
                <div className="flex items-center" style={{ color: '#6c5548' }}>
                  <Eye className="h-4 w-4 mr-1" />
                  <span className="font-medium">183 people viewed this today</span>
                </div>
                <div className="flex items-center" style={{ color: '#6c5548' }}>
                  <Users className="h-4 w-4 mr-1" />
                  <span className="font-medium">12 sold this week</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Gift className="h-5 w-5" style={{ color: '#a48f4b' }} />
                <span className="text-sm font-medium px-2 py-1 rounded-full" style={{ color: '#a48f4b', backgroundColor: '#F6DADA' }}>Perfect Gift</span>
              </div>
              <h1 className="text-3xl font-playfair font-bold mb-2" style={{ color: '#2d3436' }}>
                {product.name}
              </h1>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" style={{ color: '#E28F84' }} />
                  ))}
                </div>
                <span className="text-sm" style={{ color: '#a48f4b' }}>(47 reviews)</span>
                <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: '#F6DADA', color: '#a48f4b' }}>Bestseller</span>
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <p className="text-4xl font-bold" style={{ color: '#2d3436' }}>
                  ${product.price.toFixed(2)}
                </p>
                <div className="text-sm">
                  <p className="font-medium" style={{ color: '#E28F84' }}>Free shipping on orders over $35</p>
                  <p style={{ color: '#6c5548' }}>Gift wrapping included</p>
                </div>
              </div>
            </div>

            <p className="leading-relaxed text-lg" style={{ color: '#6c5548' }}>
              {product.description}
            </p>

            <div className="bg-white rounded-xl p-6 shadow-sm border-2" style={{ borderColor: '#F6DADA' }}>
              <h3 className="font-semibold mb-3 flex items-center" style={{ color: '#2d3436' }}>
                <Sparkles className="h-5 w-5 mr-2" style={{ color: '#a48f4b' }} />
                Why You'll Love This Snow Globe:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {relatedProducts.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#E28F84' }} />
                    <span className="text-sm" style={{ color: '#6c5548' }}>{benefit}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm font-medium flex items-center mt-4" style={{ color: '#a48f4b' }}>
                <Shield className="h-4 w-4 mr-1" />
                Lifetime satisfaction guarantee included!
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Card className="text-center p-4">
                <Clock className="h-8 w-8 mx-auto mb-2" style={{ color: '#E28F84' }} />
                <h4 className="font-semibold text-sm" style={{ color: '#2d3436' }}>Fast Processing</h4>
                <p className="text-xs" style={{ color: '#6c5548' }}>Ships within 1-2 days</p>
              </Card>
              <Card className="text-center p-4">
                <Truck className="h-8 w-8 mx-auto mb-2" style={{ color: '#E28F84' }} />
                <h4 className="font-semibold text-sm" style={{ color: '#2d3436' }}>Quick Delivery</h4>
                <p className="text-xs" style={{ color: '#6c5548' }}>3-5 days standard</p>
              </Card>
              <Card className="text-center p-4">
                <Shield className="h-8 w-8 mx-auto mb-2" style={{ color: '#E28F84' }} />
                <h4 className="font-semibold text-sm" style={{ color: '#2d3436' }}>Safe Packaging</h4>
                <p className="text-xs" style={{ color: '#6c5548' }}>Insured delivery</p>
              </Card>
            </div>

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

              <Button 
                size="lg" 
                className="w-full font-semibold text-white hover:opacity-90 transition-opacity shadow-md text-lg py-4"
                onClick={handleAddToCart}
                style={{ backgroundColor: '#E28F84' }}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart - ${(product.price * quantity).toFixed(2)}
              </Button>

              <p className="text-center text-sm" style={{ color: '#6c5548' }}>
                🎁 Perfect for gifting • ⭐ 30-day money-back guarantee
              </p>
            </div>

            <div className="rounded-xl p-4 shadow-sm border-2 bg-white" style={{ borderColor: '#F6DADA' }}>
              <button
                onClick={() => setShowPersonalization(!showPersonalization)}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2" style={{ color: '#a48f4b' }} />
                  <h3 className="font-semibold" style={{ color: '#2d3436' }}>Add Special Touch</h3>
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
                    Share your style preferences or special requests with us
                  </p>
                  <PhotoUpload onUpload={handlePhotoUpload} />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-20 space-y-16">
          <section className="bg-white p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl font-playfair font-bold mb-6" style={{ color: '#2d3436' }}>
              Premium Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#E28F84' }} />
                  <span style={{ color: '#6c5548' }}>{feature}</span>
                </div>
              ))}
            </div>
          </section>

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
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-current" style={{ color: '#E28F84' }} />
                    ))}
                    <span className="text-xs" style={{ color: '#a48f4b' }}>({item.reviews})</span>
                  </div>
                  <p className="font-bold" style={{ color: '#E28F84' }}>${item.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </section>

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

          <section className="bg-white p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl font-playfair font-bold mb-8" style={{ color: '#2d3436' }}>
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                  <button
                    onClick={() => setShowFAQ(showFAQ === index ? null : index)}
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

        <div className="mt-16">
          <Link to="/products/snow-globes">
            <Button 
              variant="outline" 
              className="px-6 py-3 border-2 font-medium hover:bg-white/50 transition-colors shadow-sm"
              style={{ borderColor: '#E28F84', color: '#E28F84' }}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Snow Globes
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default WinterBotanicalSnowGlobe;
