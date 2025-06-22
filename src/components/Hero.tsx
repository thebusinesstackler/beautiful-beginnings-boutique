
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-cream via-soft-rose/30 to-sage-green/20 py-20 md:py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-50" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f4e4e4' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-playfair font-bold text-foreground mb-6">
              Handcrafted
              <span className="block text-primary">Memories</span>
              <span className="block text-secondary">Made Beautiful</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
              Transform your precious moments into stunning keepsakes. From personalized ornaments to seasonal décor, each piece is lovingly crafted to celebrate your unique story.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button className="btn-primary text-lg px-8 py-4">
                Shop Our Collection
              </Button>
              <Button variant="outline" className="text-lg px-8 py-4 border-primary text-foreground hover:bg-primary/10">
                Custom Orders
              </Button>
            </div>
            
            <div className="mt-12 flex items-center justify-center lg:justify-start space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-gold-accent"></div>
                <span>Free Personalization</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-gold-accent"></div>
                <span>Fast Shipping</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-gold-accent"></div>
                <span>Made to Last</span>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative lg:order-2 animate-fade-in">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl card-hover">
              <img
                src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800"
                alt="Beautiful handcrafted ornaments and gifts in a cozy setting"
                className="w-full h-[400px] md:h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              
              {/* Floating elements */}
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
                <p className="text-sm font-medium text-foreground">✨ New Collection</p>
                <p className="text-xs text-muted-foreground">Holiday 2024</p>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-soft-rose/30 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-sage-green/20 rounded-full blur-xl"></div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="text-center mt-16 animate-bounce">
          <ArrowDown className="h-6 w-6 text-muted-foreground mx-auto" />
          <p className="text-sm text-muted-foreground mt-2">Discover Our Collections</p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
