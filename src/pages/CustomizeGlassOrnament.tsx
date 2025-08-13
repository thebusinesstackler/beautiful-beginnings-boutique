import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, ArrowLeft, Star, Plus, Minus, Camera, CheckCircle, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import PhotoUpload from '@/components/PhotoUpload';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description: string;
  seo_title?: string;
}

const CustomizeGlassOrnament = () => {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('product');
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isPhotoConfirmed, setIsPhotoConfirmed] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (productId) {
      fetchProduct();
    } else {
      // Use default product if no ID provided
      setProduct({
        id: 'default-glass-ornament',
        name: "Custom Glass Photo Ornament",
        price: 24.99,
        image_url: "/placeholder.svg",
        description: "Transform your favorite memories into a beautiful glass ornament. Our premium glass ornaments are carefully crafted with your personalized photo, creating a lasting keepsake perfect for holidays or year-round display."
      });
      setLoading(false);
    }
    fetchRelatedProducts();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, image_url, description, seo_title')
        .eq('id', productId)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: "Error",
        description: "Failed to load product details. Please try again later.",
        variant: "destructive",
      });
      // Fallback to default product
      setProduct({
        id: 'default-glass-ornament',
        name: "Custom Glass Photo Ornament",
        price: 24.99,
        image_url: "/placeholder.svg",
        description: "Transform your favorite memories into a beautiful glass ornament. Our premium glass ornaments are carefully crafted with your personalized photo, creating a lasting keepsake perfect for holidays or year-round display."
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, image_url, description, seo_title')
        .eq('is_active', true)
        .neq('id', productId || 'none')
        .limit(4);

      if (error) throw error;
      setRelatedProducts(data || []);
    } catch (error) {
      console.error('Error fetching related products:', error);
    } finally {
      setRelatedLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    if (!uploadedPhoto) {
      toast({
        title: "Photo Required",
        description: "Please upload a photo before adding to cart.",
        variant: "destructive",
      });
      return;
    }

    if (!isPhotoConfirmed) {
      toast({
        title: "Please Confirm Photo",
        description: "Please confirm your photo selection before adding to cart.",
        variant: "destructive",
      });
      return;
    }
    
    for (let i = 0; i < quantity; i++) {
      await addToCart({
        id: parseInt(product.id),
        name: product.name,
        price: product.price,
        image: product.image_url
      }, 1, uploadedPhoto);
    }
    toast({
      title: "Added to cart!",
      description: `${quantity} ${product.name}${quantity > 1 ? 's' : ''} added to your cart with your custom photo.`,
    });
  };

  const handlePhotoUpload = (file: File) => {
    console.log('Photo uploaded for glass ornament:', file.name);
    setUploadedPhoto(file);
    setIsPhotoConfirmed(false);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    toast({
      title: "Photo uploaded!",
      description: "Your photo has been uploaded. Please review and confirm it below.",
    });
  };

  const handleConfirmPhoto = () => {
    setIsPhotoConfirmed(true);
    toast({
      title: "Photo confirmed!",
      description: "Your photo selection has been confirmed. You can now add this item to your cart.",
    });
  };

  const getShortDescription = (description: string) => {
    const sentences = description.split('.').filter(s => s.trim());
    return sentences.slice(0, 2).join('.') + (sentences.length > 2 ? '.' : '');
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#faf6ee' }}>
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#E28F84] border-t-transparent mx-auto mb-4"></div>
              <p className="text-lg" style={{ color: '#A89B84' }}>Loading product details...</p>
            </div>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ color: '#2d3436' }}>Product not found</h1>
          <Link to="/products/ornaments">
            <Button variant="outline" style={{ borderColor: '#E28F84', color: '#E28F84' }}>Back to Ornaments</Button>
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
          <Link to="/products/ornaments" className="hover:opacity-80">Ornaments</Link>
          <span>/</span>
          <span style={{ color: '#2d3436' }}>Customize {product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Product Image and Upload */}
          <div className="space-y-6">
            {/* Product Preview */}
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg">
              <div className="relative">
                {photoPreview ? (
                  <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center relative">
                    <img
                      src={photoPreview}
                      alt="Your photo preview"
                      className="max-w-full max-h-full object-contain rounded-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-sm font-medium" style={{ color: '#2d3436' }}>
                        Preview on {product.name}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-96 relative">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-lg flex items-center justify-center">
                      <div className="text-center text-white">
                        <Camera className="h-16 w-16 mx-auto mb-4 opacity-80" />
                        <p className="text-lg font-medium">
                          Upload your photo to see preview
                        </p>
                        <p className="text-sm opacity-80">
                          Your photo will appear here on the ornament
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

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

            {/* Photo Upload Section - Now below the image */}
            <div className="rounded-xl p-6 shadow-sm border-2" style={{ backgroundColor: 'white', borderColor: '#F6DADA' }}>
              <div className="flex items-center mb-4">
                <Camera className="h-6 w-6 mr-3" style={{ color: '#E28F84' }} />
                <h3 className="text-lg font-semibold" style={{ color: '#2d3436' }}>
                  Upload Your Photo
                </h3>
              </div>
              <p className="text-sm mb-4" style={{ color: '#6c5548' }}>
                Choose your favorite photo to create your personalized ornament. For best results, use high-quality images with good lighting.
              </p>
              <PhotoUpload onUpload={handlePhotoUpload} />
            </div>

            {/* Upload Status */}
            {uploadedPhoto && (
              <div className="bg-white rounded-xl p-4 border-2" style={{ borderColor: isPhotoConfirmed ? '#10b981' : '#F6DADA' }}>
                <div className="flex items-center space-x-3">
                  {isPhotoConfirmed ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <Camera className="h-6 w-6" style={{ color: '#E28F84' }} />
                  )}
                  <div className="flex-1">
                    <p className="font-medium" style={{ color: '#2d3436' }}>
                      {uploadedPhoto.name}
                    </p>
                    <p className="text-sm" style={{ color: '#6c5548' }}>
                      {isPhotoConfirmed ? 'Photo confirmed and ready!' : 'Please confirm your photo selection'}
                    </p>
                  </div>
                  {!isPhotoConfirmed && (
                    <Button
                      onClick={handleConfirmPhoto}
                      size="sm"
                      className="text-white"
                      style={{ backgroundColor: '#E28F84' }}
                    >
                      Confirm Photo
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="h-5 w-5" style={{ color: '#E28F84' }} />
                <span className="text-sm font-medium" style={{ color: '#E28F84' }}>Personalized</span>
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
              </div>
              <p className="text-2xl font-bold mb-6" style={{ color: '#E28F84' }}>
                ${product.price.toFixed(2)}
              </p>
            </div>

            {/* Product Description with Read More */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold" style={{ color: '#2d3436' }}>
                Product Description
              </h3>
              <div className="space-y-3">
                <p className="leading-relaxed" style={{ color: '#6c5548' }}>
                  {showFullDescription ? product.description : getShortDescription(product.description)}
                </p>
                {product.description.split('.').length > 2 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="flex items-center text-sm font-medium hover:opacity-80 transition-opacity"
                    style={{ color: '#E28F84' }}
                  >
                    {showFullDescription ? (
                      <>
                        Read less
                        <ChevronUp className="h-4 w-4 ml-1" />
                      </>
                    ) : (
                      <>
                        Read more
                        <ChevronDown className="h-4 w-4 ml-1" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

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
                className={`w-full font-semibold text-white transition-all duration-200 shadow-md ${
                  uploadedPhoto && isPhotoConfirmed 
                    ? 'hover:opacity-90' 
                    : 'opacity-50 cursor-not-allowed'
                }`}
                onClick={handleAddToCart}
                disabled={!uploadedPhoto || !isPhotoConfirmed}
                style={{ backgroundColor: '#E28F84' }}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart - ${(product.price * quantity).toFixed(2)}
              </Button>

              {(!uploadedPhoto || !isPhotoConfirmed) && (
                <p className="text-sm text-center" style={{ color: '#a48f4b' }}>
                  {!uploadedPhoto 
                    ? 'Please upload a photo to continue' 
                    : 'Please confirm your photo selection to continue'
                  }
                </p>
              )}
            </div>
          </div>
        </div>

        {/* People Also Bought Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-playfair font-bold mb-4" style={{ color: '#2d3436' }}>
              People Also Bought
            </h2>
            <p className="text-lg" style={{ color: '#6c5548' }}>
              Complete your collection with these popular items
            </p>
          </div>

          {relatedLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#E28F84] border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                >
                  <div className="relative aspect-square">
                    <img
                      src={relatedProduct.image_url}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2" style={{ color: '#2d3436' }}>
                      {relatedProduct.name}
                    </h3>
                    <p className="text-lg font-bold mb-3" style={{ color: '#E28F84' }}>
                      ${relatedProduct.price.toFixed(2)}
                    </p>
                    <div className="space-y-2">
                      <Link 
                        to={`/products/ornaments/customize-glass?product=${relatedProduct.id}`}
                        className="block"
                      >
                        <Button 
                          size="sm"
                          variant="outline"
                          className="w-full text-xs py-1.5 border-2"
                          style={{ borderColor: '#E28F84', color: '#2d3436' }}
                        >
                          Customize
                        </Button>
                      </Link>
                      <Button 
                        size="sm"
                        className="w-full text-xs py-1.5 text-white"
                        style={{ backgroundColor: '#E28F84' }}
                        onClick={() => addToCart({
                          id: parseInt(relatedProduct.id),
                          name: relatedProduct.name,
                          price: relatedProduct.price,
                          image: relatedProduct.image_url
                        })}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Back to Ornaments */}
        <div className="mt-16">
          <Link to="/products/ornaments">
            <Button 
              variant="outline" 
              className="px-6 py-3 border-2 font-medium hover:bg-white/50 transition-colors shadow-sm"
              style={{ borderColor: '#E28F84', color: '#E28F84' }}
            >
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

export default CustomizeGlassOrnament;
