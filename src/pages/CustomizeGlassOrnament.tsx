
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, ArrowLeft, Star, Plus, Minus, Camera, CheckCircle, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';
import PhotoUpload from '@/components/PhotoUpload';

const CustomizeGlassOrnament = () => {
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isPhotoConfirmed, setIsPhotoConfirmed] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Product data
  const product = {
    id: 1,
    name: "Custom Glass Photo Ornament",
    price: 24.99,
    image: "/placeholder.svg",
    description: "Transform your favorite memories into a beautiful glass ornament. Our premium glass ornaments are carefully crafted with your personalized photo, creating a lasting keepsake perfect for holidays or year-round display.",
    fullDescription: "Create a stunning personalized glass ornament with your favorite photo. Each ornament is expertly crafted using high-quality glass and advanced printing technology to ensure your memories are preserved beautifully. Perfect for Christmas trees, holiday decorations, or as thoughtful gifts for loved ones. The crystal-clear glass provides excellent photo clarity while the durable construction ensures your ornament will last for years to come.",
    features: [
      "Premium crystal-clear glass construction",
      "High-resolution photo printing",
      "Durable and scratch-resistant finish",
      "Includes hanging ribbon",
      "Perfect gift size at 3.5 inches",
      "Professional quality craftsmanship"
    ]
  };

  const handleAddToCart = () => {
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
          <span style={{ color: '#2d3436' }}>Customize Glass Ornament</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Preview */}
          <div className="space-y-6">
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
                        Preview on Glass Ornament
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="h-16 w-16 mx-auto mb-4" style={{ color: '#a48f4b' }} />
                      <p className="text-lg font-medium" style={{ color: '#2d3436' }}>
                        Upload your photo to see preview
                      </p>
                      <p className="text-sm" style={{ color: '#6c5548' }}>
                        Your photo will appear here on the glass ornament
                      </p>
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

          {/* Product Info */}
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
              <p className="text-2xl font-bold mb-4" style={{ color: '#E28F84' }}>
                ${product.price.toFixed(2)}
              </p>
            </div>

            {/* Product Description */}
            <div className="space-y-4">
              <p className="leading-relaxed text-lg" style={{ color: '#6c5548' }}>
                {product.description}
              </p>
              
              {/* Features */}
              <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-4 border" style={{ borderColor: '#F6DADA' }}>
                <h3 className="font-semibold mb-3" style={{ color: '#2d3436' }}>What's Included:</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#E28F84' }} />
                      <span className="text-sm" style={{ color: '#6c5548' }}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Photo Upload Section */}
            <div className="rounded-xl p-6 shadow-sm border-2" style={{ backgroundColor: 'white', borderColor: '#F6DADA' }}>
              <div className="flex items-center mb-4">
                <Camera className="h-6 w-6 mr-3" style={{ color: '#E28F84' }} />
                <h3 className="text-lg font-semibold" style={{ color: '#2d3436' }}>
                  Upload Your Photo
                </h3>
              </div>
              <p className="text-sm mb-4" style={{ color: '#6c5548' }}>
                Choose your favorite photo to create your personalized glass ornament. For best results, use high-quality images with good lighting.
              </p>
              <PhotoUpload onUpload={handlePhotoUpload} />
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

        {/* Full Product Description */}
        <div className="mt-16 bg-white rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-playfair font-bold mb-6" style={{ color: '#2d3436' }}>
            About Your Custom Glass Ornament
          </h2>
          <p className="leading-relaxed text-lg mb-6" style={{ color: '#6c5548' }}>
            {product.fullDescription}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3" style={{ color: '#2d3436' }}>Perfect For:</h3>
              <ul className="space-y-2 text-sm" style={{ color: '#6c5548' }}>
                <li>• Christmas tree decorations</li>
                <li>• Holiday gift giving</li>
                <li>• Memorial keepsakes</li>
                <li>• Anniversary celebrations</li>
                <li>• Family photo displays</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3" style={{ color: '#2d3436' }}>Care Instructions:</h3>
              <ul className="space-y-2 text-sm" style={{ color: '#6c5548' }}>
                <li>• Handle with care - glass material</li>
                <li>• Clean with soft, dry cloth</li>
                <li>• Store in protective packaging</li>
                <li>• Avoid extreme temperatures</li>
                <li>• Keep away from children under 3</li>
              </ul>
            </div>
          </div>
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
