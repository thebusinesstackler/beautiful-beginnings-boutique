import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, ArrowLeft, Star, Plus, Minus, Sparkles, Gift, Clock, Truck, Shield, Camera, Eye, Users, Award, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';
import PhotoUpload from '@/components/PhotoUpload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const WinterBotanicalSnowGlobe = () => {
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState<File | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Related products data
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
    },
    {
      id: 5,
      name: "Slate Photo Keepsake",
      price: 32.50,
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400",
      rating: 5,
      reviews: 19,
      href: "/products/slate"
    }
  ];

  // Product categories
  const categories = [
    {
      name: "Snow Globes",
      description: "Magical memories in glass",
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=300",
      href: "/products/snow-globes",
      count: "12 products"
    },
    {
      name: "Memory Jewelry",
      description: "Wear your memories close",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300",
      href: "/products/necklaces",
      count: "18 products"
    },
    {
      name: "Keepsake Ornaments",
      description: "Holiday memories forever",
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300",
      href: "/products/ornaments",
      count: "24 products"
    }
  ];

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

  const handlePhotoUpload = (file: File) => {
    setUploadedPhoto(file);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/products/snow-globes" className="hover:text-primary">Snow Globes</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{product.name}</span>
        </div>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image & Photo Upload */}
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sage/10 to-blush/10 p-8 border border-stone/20">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-96 object-cover rounded-xl shadow-lg"
              />
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="absolute top-4 right-4 p-3 bg-pearl/90 backdrop-blur-sm rounded-full hover:bg-pearl transition-colors duration-200 shadow-lg"
              >
                <Heart
                  className={`h-6 w-6 transition-colors duration-200 ${
                    isLiked ? 'text-terracotta fill-current' : 'text-stone'
                  }`}
                />
              </button>
              
              {/* Trust badges */}
              <div className="absolute bottom-4 left-4 flex space-x-2">
                <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-medium">
                  <Award className="h-3 w-3 inline mr-1" />
                  Premium Quality
                </div>
              </div>
            </div>

            {/* Photo Upload Section */}
            <Card className="border-2 border-dashed border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Camera className="h-5 w-5 mr-2 text-primary" />
                  Add Your Special Photo (Optional)
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Upload a photo to see how it would look with your snow globe for the perfect personalized gift!
                </p>
              </CardHeader>
              <CardContent>
                <PhotoUpload 
                  onUpload={handlePhotoUpload}
                  maxSizeMB={10}
                  className="mb-4"
                />
                {uploadedPhoto && (
                  <div className="text-center p-4 bg-primary/10 rounded-lg">
                    <p className="text-sm text-primary font-medium">
                      ✨ Photo uploaded! This will look amazing with your snow globe.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Social Proof */}
            <div className="bg-pearl rounded-xl p-4 border border-stone/30">
              <div className="flex items-center justify-center space-x-6 text-sm">
                <div className="flex items-center text-chocolate">
                  <Eye className="h-4 w-4 mr-1" />
                  <span className="font-medium">247 people viewed this today</span>
                </div>
                <div className="flex items-center text-chocolate">
                  <Users className="h-4 w-4 mr-1" />
                  <span className="font-medium">18 sold this week</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Gift className="h-5 w-5 text-primary" />
                <span className="text-sm text-primary font-medium bg-primary/10 px-2 py-1 rounded-full">Perfect Gift</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-3">
                {product.name}
              </h1>
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-accent fill-current" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(47 reviews)</span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">Bestseller</span>
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <p className="text-4xl font-bold text-primary">
                  ${product.price.toFixed(2)}
                </p>
                <div className="text-sm">
                  <p className="text-accent font-medium">Free shipping on orders over $35</p>
                  <p className="text-muted-foreground">Gift wrapping included</p>
                </div>
              </div>
            </div>

            {/* Key Benefits */}
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6 border border-primary/20">
              <h3 className="font-semibold text-foreground mb-3 flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-primary" />
                Why You'll Love This Snow Globe:
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {product.fullDescription}
              </p>
              <p className="text-sm text-primary font-medium flex items-center">
                <Shield className="h-4 w-4 mr-1" />
                Lifetime satisfaction guarantee included!
              </p>
            </div>

            {/* Delivery Information */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="text-center p-4">
                <Clock className="h-8 w-8 text-accent mx-auto mb-2" />
                <h4 className="font-semibold text-sm">Fast Processing</h4>
                <p className="text-xs text-muted-foreground">Ships within 1-2 days</p>
              </Card>
              <Card className="text-center p-4">
                <Truck className="h-8 w-8 text-accent mx-auto mb-2" />
                <h4 className="font-semibold text-sm">Quick Delivery</h4>
                <p className="text-xs text-muted-foreground">3-5 days standard</p>
              </Card>
              <Card className="text-center p-4">
                <Shield className="h-8 w-8 text-accent mx-auto mb-2" />
                <h4 className="font-semibold text-sm">Safe Packaging</h4>
                <p className="text-xs text-muted-foreground">Insured delivery</p>
              </Card>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4 p-6 bg-muted/30 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center border rounded-lg bg-pearl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-muted transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 min-w-[3rem] text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-muted transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <Button 
                size="lg" 
                className="btn-primary w-full text-lg py-4 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart - ${(product.price * quantity).toFixed(2)}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                🎁 Perfect for gifting • ⭐ 30-day money-back guarantee
              </p>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-primary" />
                Product Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Gift Ideas */}
          <Card className="bg-gradient-to-br from-accent/10 to-blush/10 border-accent/30">
            <CardHeader>
              <CardTitle className="flex items-center text-accent">
                <Gift className="h-5 w-5 mr-2" />
                Perfect Gift Ideas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {product.giftIdeas.map((idea, index) => (
                  <li key={index} className="flex items-center text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-accent rounded-full mr-3 flex-shrink-0" />
                    {idea}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* People Also Bought */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-playfair font-bold text-foreground">
              People Also Bought
            </h2>
            <Link to="/products/snow-globes" className="text-primary hover:underline text-sm font-medium">
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 text-accent fill-current" />
                    ))}
                    <span className="text-xs text-muted-foreground">({product.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">${product.price.toFixed(2)}</span>
                    <Link to={product.href}>
                      <Button size="sm" variant="outline" className="text-xs">
                        View
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Browse Categories */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-playfair font-bold text-foreground mb-4">
              Explore More Categories
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our full collection of personalized keepsakes and memory products
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Link key={index} to={category.href}>
                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-charcoal/20 group-hover:bg-charcoal/10 transition-colors" />
                  </div>
                  <CardContent className="p-6 text-center">
                    <h3 className="font-playfair font-semibold text-lg mb-2">{category.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{category.description}</p>
                    <p className="text-xs text-primary font-medium">{category.count}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Back Navigation */}
        <div className="flex justify-center space-x-4">
          <Link to="/products/snow-globes">
            <Button variant="outline" className="px-8 py-3">
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

export default WinterBotanicalSnowGlobe;
