import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, ArrowLeft, Star, Plus, Minus, Camera, Upload, Sparkles, Shield, Truck, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import PhotoUpload from '@/components/PhotoUpload';
import WoodCustomizationOptions from '@/components/WoodCustomizationOptions';
import WoodPhotoUploadGuide from '@/components/WoodPhotoUploadGuide';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description: string;
  category: string;
  personalization_options?: any;
  seo_title?: string;
  seo_description?: string;
  inventory_quantity?: number;
}

const ProductDetail = () => {
  const { category, id } = useParams<{ category: string; id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPersonalization, setShowPersonalization] = useState(false);
  const [showShipping, setShowShipping] = useState(false);
  const [showFAQ, setShowFAQ] = useState<number | null>(null);
  const [customizations, setCustomizations] = useState<any>({});
  const { addToCart } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: "Error",
        description: "Failed to load product. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
    console.log('Photo uploaded for product:', file.name);
    toast({
      title: "Photo uploaded!",
      description: "Your photo has been uploaded for personalization.",
    });
  };

  const handleCustomizationChange = (newCustomizations: any) => {
    setCustomizations(newCustomizations);
    console.log('Customizations updated:', newCustomizations);
  };

  const hasPersonalization = product?.personalization_options && 
    typeof product.personalization_options === 'object' && 
    product.personalization_options.photo_upload;

  const isWoodSublimation = product?.category === 'Wood Sublimation';

  const faqs = isWoodSublimation ? [
    { question: "How do I upload my photo for wood sublimation?", answer: "Simply click 'Personalize this item' and use our easy upload tool. We accept high-resolution JPG, PNG formats up to 20MB for the best wood sublimation results." },
    { question: "What makes wood sublimation special?", answer: "Wood sublimation permanently bonds your photo to the wood surface, creating vibrant colors that complement the natural grain. Each piece is unique due to the wood's natural patterns." },
    { question: "Can I choose different wood types?", answer: "Yes! We offer Pine, Oak, and Cedar options. Each wood type has its own grain pattern and color characteristics that will show through your photo." },
    { question: "How long does wood sublimation take?", answer: "Wood sublimation requires 3-5 business days for processing, plus shipping time. The careful sublimation process ensures your photo bonds perfectly with the wood." }
  ] : [
    { question: "How do I upload my photo?", answer: "Simply click 'Personalize this item' and use our easy upload tool. We accept JPG, PNG formats up to 20MB." },
    { question: "Can I add custom text?", answer: "Yes! You can add names, dates, or short messages during the personalization process." },
    { question: "What image size works best?", answer: "For best results, use high-resolution images (at least 1000x1000 pixels) with good lighting and clear focus." }
  ];

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#faf6ee' }}>
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="text-xl">Loading product...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#faf6ee' }}>
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ color: '#2d3436' }}>Product not found</h1>
          <Link to={`/products/${category?.toLowerCase().replace(' ', '-')}`}>
            <Button variant="outline" style={{ borderColor: '#E28F84', color: '#E28F84' }}>
              Back to {category}
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#faf6ee' }}>
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm mb-8" style={{ color: '#a48f4b' }}>
          <Link to="/" className="hover:opacity-80">Home</Link>
          <span>/</span>
          <Link to={`/products/${category?.toLowerCase().replace(' ', '-')}`} className="hover:opacity-80">{product.category}</Link>
          <span>/</span>
          <span style={{ color: '#2d3436' }}>{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg">
              <img
                src={product.image_url}
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
              
              {hasPersonalization && (
                <>
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
                </>
              )}
            </div>
            
            {/* Wood Photo Upload Guide for Wood Sublimation products */}
            {isWoodSublimation && hasPersonalization && (
              <WoodPhotoUploadGuide />
            )}

            {/* Photo Upload Preview for personalizable products */}
            {hasPersonalization && (
              <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-6 border-2 border-dashed border-primary/20">
                <div className="text-center">
                  <Upload className="h-8 w-8 text-primary mx-auto mb-3" style={{ color: '#E28F84' }} />
                  <h3 className="font-semibold mb-2" style={{ color: '#2d3436' }}>Upload Your Photo</h3>
                  <p className="text-sm mb-4" style={{ color: '#a48f4b' }}>
                    Add your favorite photo after purchase to personalize your {product.category.toLowerCase()}
                  </p>
                  <Button variant="outline" size="sm" style={{ color: '#E28F84', borderColor: '#E28F84' }}>
                    <Camera className="h-4 w-4 mr-2" />
                    Choose Photo Later
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              {hasPersonalization && (
                <div className="flex items-center space-x-2 mb-2">
                  <Camera className="h-5 w-5" style={{ color: '#E28F84' }} />
                  <span className="text-sm font-medium" style={{ color: '#E28F84' }}>Personalized</span>
                </div>
              )}
              <h1 className="text-3xl font-playfair font-bold mb-2" style={{ color: '#2d3436' }}>
                {product.name}
              </h1>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" style={{ color: '#E28F84' }} />
                  ))}
                </div>
                <span className="text-sm" style={{ color: '#a48f4b' }}>(24 reviews)</span>
              </div>
              <p className="text-2xl font-bold mb-4" style={{ color: '#E28F84' }}>
                ${product.price.toFixed(2)}
              </p>
            </div>

            <p className="leading-relaxed text-lg" style={{ color: '#6c5548' }}>
              {product.description}
            </p>

            {/* Enhanced Wood Sublimation Info */}
            {isWoodSublimation && hasPersonalization && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Sparkles className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800">Wood Sublimation Process</h4>
                    <p className="text-sm text-amber-700 mt-1">
                      Your photo will be permanently transferred onto natural wood using our sublimation process. 
                      The wood grain adds character and makes each piece unique. Processing takes 3-5 business days.
                    </p>
                  </div>
                </div>
              </div>
            )}

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

            {/* Enhanced Personalization Section */}
            {hasPersonalization && (
              <div className="rounded-xl p-4 shadow-sm border-2" style={{ backgroundColor: 'white', borderColor: '#F6DADA' }}>
                <button
                  onClick={() => setShowPersonalization(!showPersonalization)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <div className="flex items-center">
                    <Sparkles className="h-5 w-5 mr-2" style={{ color: '#a48f4b' }} />
                    <h3 className="font-semibold" style={{ color: '#2d3436' }}>
                      {isWoodSublimation ? 'Customize Your Wood Piece' : 'Personalize this item'}
                    </h3>
                  </div>
                  {showPersonalization ? (
                    <ChevronUp className="h-5 w-5" style={{ color: '#a48f4b' }} />
                  ) : (
                    <ChevronDown className="h-5 w-5" style={{ color: '#a48f4b' }} />
                  )}
                </button>
                
                {showPersonalization && (
                  <div className="mt-6 space-y-6 animate-fade-in">
                    {/* Wood Customization Options */}
                    {isWoodSublimation && (
                      <WoodCustomizationOptions 
                        personalizationOptions={product.personalization_options}
                        onCustomizationChange={handleCustomizationChange}
                      />
                    )}
                    
                    {/* Photo Upload */}
                    <div>
                      <h4 className="font-medium mb-3" style={{ color: '#2d3436' }}>
                        Upload Your Photo
                      </h4>
                      <PhotoUpload onUpload={handlePhotoUpload} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        {hasPersonalization && (
          <div className="mt-20">
            <section className="bg-white p-8 rounded-xl shadow-sm">
              <h2 className="text-2xl font-playfair font-bold mb-8" style={{ color: '#2d3436' }}>
                {isWoodSublimation ? 'Wood Sublimation FAQ' : 'Frequently Asked Questions'}
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
          </div>
        )}

        {/* Shipping & Returns */}
        <div className="mt-8">
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
                    Ships in 2–3 business days · Free returns on defects
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
                    <p className="text-sm" style={{ color: '#6c5548' }}>Orders processed within 24 hours and shipped within 2-3 business days.</p>
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

        {/* Back to Products */}
        <div className="mt-16">
          <Link to={`/products/${category?.toLowerCase().replace(' ', '-')}`}>
            <Button 
              variant="outline" 
              className="px-6 py-3 border-2 font-medium hover:bg-white/50 transition-colors shadow-sm"
              style={{ borderColor: '#E28F84', color: '#E28F84' }}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to {product.category}
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
