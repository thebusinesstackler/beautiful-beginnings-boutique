
import { Button } from '@/components/ui/button';
import { ArrowDown, Sparkles, Heart, Star } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-background via-muted to-secondary/20 py-24 md:py-32 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 text-accent/20 animate-float">
        <Sparkles size={24} />
      </div>
      <div className="absolute top-40 right-20 text-primary/20 animate-float" style={{ animationDelay: '1s' }}>
        <Heart size={20} />
      </div>
      <div className="absolute bottom-32 left-1/4 text-secondary/30 animate-float" style={{ animationDelay: '2s' }}>
        <Star size={18} />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-secondary/20 rounded-full text-sm font-medium text-primary mb-6">
              <Sparkles className="h-4 w-4 mr-2" />
              Handcrafted with Love Since 2020
            </div>
            
            <h1 className="text-5xl md:text-7xl font-playfair font-bold mb-8 leading-tight">
              <span className="text-foreground">Beautiful</span>
              <br />
              <span className="text-gradient">Beginnings</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
              Transform your precious memories into lasting treasures. Each piece is lovingly handcrafted to celebrate life's most beautiful moments.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start mb-12">
              <Button className="btn-primary text-lg group">
                Explore Collection
                <ArrowDown className="ml-2 h-5 w-5 group-hover:translate-y-1 transition-transform" />
              </Button>
              <Button variant="outline" className="text-lg px-8 py-4 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                Custom Orders
              </Button>
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-3">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground">Handmade</p>
                <p className="text-xs text-muted-foreground">with Heart</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-3">
                  <Star className="h-6 w-6 text-accent" />
                </div>
                <p className="text-sm font-medium text-foreground">Premium</p>
                <p className="text-xs text-muted-foreground">Quality</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-3">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground">Lasting</p>
                <p className="text-xs text-muted-foreground">Memories</p>
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-sm font-medium">✨ Holiday Collection</p>
                  <p className="text-xs opacity-90">Personalized Ornaments</p>
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
            
            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 bg-white shadow-lg rounded-full p-4 animate-float">
              <div className="text-center">
                <p className="text-xs font-bold text-primary">500+</p>
                <p className="text-xs text-muted-foreground">Happy Customers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="text-center mt-20 animate-bounce">
          <div className="inline-flex flex-col items-center space-y-2">
            <ArrowDown className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground font-medium">Discover Our Story</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
