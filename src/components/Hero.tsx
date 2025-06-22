
import { Button } from '@/components/ui/button';
import { ArrowDown, Sparkles, Heart, Star, Leaf } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative bg-white py-24 md:py-32 overflow-hidden">
      {/* Animated leaf background - reduced opacity for better text readability */}
      <div className="absolute inset-0 opacity-5">
        <Leaf className="absolute top-10 left-10 h-16 w-16 text-primary rotate-12 animate-float" />
        <Leaf className="absolute top-20 right-20 h-12 w-12 text-accent -rotate-45 animate-float" style={{ animationDelay: '1s' }} />
        <Leaf className="absolute top-60 right-1/3 h-14 w-14 text-accent -rotate-12 animate-float" style={{ animationDelay: '0.5s' }} />
        <Leaf className="absolute bottom-40 left-16 h-18 w-18 text-primary rotate-90 animate-float" style={{ animationDelay: '1.5s' }} />
        <Leaf className="absolute bottom-60 right-24 h-10 w-10 text-accent -rotate-30 animate-float" style={{ animationDelay: '2.5s' }} />
        <Leaf className="absolute bottom-32 left-1/3 h-22 w-22 text-accent rotate-60 animate-float" style={{ animationDelay: '0.8s' }} />
        <Leaf className="absolute bottom-20 right-1/2 h-12 w-12 text-accent rotate-120 animate-float" style={{ animationDelay: '2.2s' }} />
      </div>

      {/* Decorative elements - repositioned to avoid text interference */}
      <div className="absolute top-20 left-10 text-accent/15 animate-float">
        <Sparkles size={20} />
      </div>
      <div className="absolute bottom-32 right-20 text-primary/15 animate-float" style={{ animationDelay: '1s' }}>
        <Heart size={18} />
      </div>
      <div className="absolute bottom-16 left-1/4 text-secondary/20 animate-float" style={{ animationDelay: '2s' }}>
        <Star size={16} />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-secondary/15 rounded-full text-sm font-semibold text-primary mb-6 border border-primary/20">
              <Sparkles className="h-4 w-4 mr-2" />
              Handcrafted with Love Since 2020
            </div>
            
            <h1 className="text-5xl md:text-7xl font-playfair font-bold mb-8 leading-tight">
              <span className="text-foreground">Beautiful</span>
              <br />
              <span className="text-gradient font-black">Beginnings</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl leading-relaxed font-medium">
              Transform your precious memories into lasting treasures. Each piece is lovingly handcrafted to celebrate life's most beautiful moments.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start mb-12">
              <Button className="btn-primary text-xl px-12 py-6 group shadow-xl hover:shadow-2xl font-bold">
                Order Now - Free Shipping
                <ArrowDown className="ml-2 h-6 w-6 group-hover:translate-y-1 transition-transform" />
              </Button>
              <Button variant="outline" className="text-xl px-12 py-6 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-lg hover:shadow-xl font-semibold">
                Personalize Your Gift Today
              </Button>
            </div>

            {/* Urgency Banner - improved contrast */}
            <div className="bg-gradient-to-r from-accent/15 to-primary/15 rounded-xl p-6 mb-8 border-2 border-accent/40 backdrop-blur-sm">
              <div className="text-center">
                <p className="text-lg font-bold text-primary mb-2">🎁 Limited Time Offer</p>
                <p className="text-muted-foreground font-medium">Free gift wrapping & personalized note with every order</p>
              </div>
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="w-12 h-12 bg-primary/15 rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-3 border border-primary/30">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-bold text-foreground">Handmade</p>
                <p className="text-xs text-muted-foreground font-medium">with Heart</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="w-12 h-12 bg-accent/15 rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-3 border border-accent/30">
                  <Star className="h-6 w-6 text-accent" />
                </div>
                <p className="text-sm font-bold text-foreground">Premium</p>
                <p className="text-xs text-muted-foreground font-medium">Quality</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-3 border border-secondary/30">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-bold text-foreground">Lasting</p>
                <p className="text-xs text-muted-foreground font-medium">Memories</p>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="relative lg:order-2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="grid grid-cols-2 gap-6">
              {/* Main large image */}
              <div className="col-span-2 relative rounded-3xl overflow-hidden shadow-2xl card-hover">
                <img
                  src="https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=800"
                  alt="Beautiful handcrafted ornaments"
                  className="w-full h-64 md:h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white text-with-shadow">
                  <p className="text-sm font-bold">✨ Holiday Collection</p>
                  <p className="text-xs opacity-95 font-medium">Personalized Ornaments</p>
                </div>
              </div>
              
              {/* Smaller images */}
              <div className="relative rounded-2xl overflow-hidden shadow-xl card-hover">
                <img
                  src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400"
                  alt="Handcrafted jewelry"
                  className="w-full h-32 md:h-40 object-cover"
                />
                <div className="absolute inset-0 bg-primary/20"></div>
              </div>
              
              <div className="relative rounded-2xl overflow-hidden shadow-xl card-hover">
                <img
                  src="https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400"
                  alt="Custom slate products"
                  className="w-full h-32 md:h-40 object-cover"
                />
                <div className="absolute inset-0 bg-accent/20"></div>
              </div>
            </div>
            
            {/* Floating badge - enhanced contrast */}
            <div className="absolute -top-4 -right-4 bg-white shadow-2xl rounded-full p-4 animate-float border-2 border-secondary/10">
              <div className="text-center">
                <p className="text-xs font-black text-primary">500+</p>
                <p className="text-xs text-muted-foreground font-semibold">Happy Customers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="text-center mt-20 animate-bounce">
          <div className="inline-flex flex-col items-center space-y-2">
            <ArrowDown className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground font-semibold">Discover Our Story</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
