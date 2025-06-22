
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Heart, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-slate-50 to-white py-20 md:py-32 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-xl"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-secondary rounded-full mix-blend-multiply filter blur-xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-accent/10 rounded-full text-sm font-semibold text-accent mb-6 border border-accent/20">
              <Sparkles className="h-4 w-4 mr-2" />
              Handcrafted Since 2020
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="text-foreground">Beautiful</span>
              <br />
              <span className="text-gradient">Beginnings</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
              Transform your precious memories into lasting treasures. Each piece is lovingly handcrafted to celebrate life's most beautiful moments.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Button className="btn-primary text-lg px-8 py-3 group">
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" className="text-lg px-8 py-3 border-2 hover:bg-accent hover:text-white hover:border-accent transition-all duration-200">
                Customize Your Gift
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-border mb-8">
              <div className="flex items-center justify-center lg:justify-start space-x-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">500+</p>
                  <p className="text-sm text-muted-foreground">Happy Customers</p>
                </div>
                <div className="w-px h-12 bg-border"></div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">4.9</p>
                  <div className="flex items-center justify-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">Rating</p>
                </div>
                <div className="w-px h-12 bg-border"></div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">Free</p>
                  <p className="text-sm text-muted-foreground">Shipping</p>
                </div>
              </div>
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left p-4 rounded-lg bg-white/50 border border-border/50">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mx-auto lg:mx-0 mb-2">
                  <Heart className="h-5 w-5 text-accent" />
                </div>
                <p className="text-sm font-semibold text-foreground">Handmade</p>
                <p className="text-xs text-muted-foreground">with Heart</p>
              </div>
              <div className="text-center lg:text-left p-4 rounded-lg bg-white/50 border border-border/50">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mx-auto lg:mx-0 mb-2">
                  <Star className="h-5 w-5 text-accent" />
                </div>
                <p className="text-sm font-semibold text-foreground">Premium</p>
                <p className="text-xs text-muted-foreground">Quality</p>
              </div>
              <div className="text-center lg:text-left p-4 rounded-lg bg-white/50 border border-border/50">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mx-auto lg:mx-0 mb-2">
                  <Sparkles className="h-5 w-5 text-accent" />
                </div>
                <p className="text-sm font-semibold text-foreground">Lasting</p>
                <p className="text-xs text-muted-foreground">Memories</p>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="relative lg:order-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="grid grid-cols-2 gap-4">
              {/* Main large image */}
              <div className="col-span-2 relative rounded-2xl overflow-hidden shadow-2xl card-hover">
                <img
                  src="https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=800"
                  alt="Beautiful handcrafted ornaments"
                  className="w-full h-64 md:h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-sm font-semibold">Holiday Collection</p>
                  <p className="text-xs opacity-90">Personalized Ornaments</p>
                </div>
              </div>
              
              {/* Smaller images */}
              <div className="relative rounded-xl overflow-hidden shadow-lg card-hover">
                <img
                  src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400"
                  alt="Handcrafted jewelry"
                  className="w-full h-32 md:h-40 object-cover"
                />
              </div>
              
              <div className="relative rounded-xl overflow-hidden shadow-lg card-hover">
                <img
                  src="https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400"
                  alt="Custom slate products"
                  className="w-full h-32 md:h-40 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
