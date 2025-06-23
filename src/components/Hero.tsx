import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Heart, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden" style={{ backgroundColor: '#FAF5EF' }}>
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl" style={{ backgroundColor: '#E28F84' }}></div>
        <div className="absolute top-40 right-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl" style={{ backgroundColor: '#7A7047' }}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl" style={{ backgroundColor: '#F4A79B' }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold mb-6 border" style={{ backgroundColor: '#F6DADA', color: '#7A7047', borderColor: '#E28F84' }}>
              <Sparkles className="h-4 w-4 mr-2" />
              Handcrafted Since 2020
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span style={{ color: '#5B4C37' }}>Where Memories Begin</span>
              <br />
              <span className="bg-gradient-to-r from-[#E28F84] to-[#F4A79B] bg-clip-text text-transparent font-bold">and Beauty Lasts</span>
            </h1>
            
            <p className="text-xl mb-8 max-w-2xl leading-relaxed" style={{ color: '#A89B84' }}>
              Capture the magic of your favorite moments—handcrafted photo keepsakes made with love and lasting brilliance. From shimmering ornaments to heartfelt jewelry, Beautiful Beginnings brings your memories to life.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Button 
                className="text-lg px-8 py-3 group text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg"
                style={{ backgroundColor: '#E28F84' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F4A79B'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E28F84'}
              >
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                className="text-lg px-8 py-3 border-2 transition-all duration-200 font-semibold rounded-lg"
                style={{ 
                  borderColor: '#E28F84', 
                  color: '#7A7047',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F6DADA';
                  e.currentTarget.style.borderColor = '#E28F84';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = '#E28F84';
                }}
              >
                Customize Your Gift
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="bg-white rounded-xl p-6 shadow-lg mb-8" style={{ borderColor: '#F6DADA', borderWidth: '1px' }}>
              <div className="flex items-center justify-center lg:justify-start space-x-6">
                <div className="text-center">
                  <p className="text-2xl font-bold" style={{ color: '#5B4C37' }}>500+</p>
                  <p className="text-sm" style={{ color: '#A89B84' }}>Happy Customers</p>
                </div>
                <div className="w-px h-12" style={{ backgroundColor: '#F6DADA' }}></div>
                <div className="text-center">
                  <p className="text-2xl font-bold" style={{ color: '#5B4C37' }}>4.9</p>
                  <div className="flex items-center justify-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm" style={{ color: '#A89B84' }}>Rating</p>
                </div>
                <div className="w-px h-12" style={{ backgroundColor: '#F6DADA' }}></div>
                <div className="text-center">
                  <p className="text-2xl font-bold" style={{ color: '#5B4C37' }}>Free</p>
                  <p className="text-sm" style={{ color: '#A89B84' }}>Shipping</p>
                </div>
              </div>
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left p-4 rounded-lg bg-white/50" style={{ borderColor: '#F6DADA', borderWidth: '1px' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto lg:mx-0 mb-2" style={{ backgroundColor: '#F6DADA' }}>
                  <Heart className="h-5 w-5" style={{ color: '#E28F84' }} />
                </div>
                <p className="text-sm font-semibold" style={{ color: '#5B4C37' }}>Handmade</p>
                <p className="text-xs" style={{ color: '#A89B84' }}>with Heart</p>
              </div>
              <div className="text-center lg:text-left p-4 rounded-lg bg-white/50" style={{ borderColor: '#F6DADA', borderWidth: '1px' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto lg:mx-0 mb-2" style={{ backgroundColor: '#F6DADA' }}>
                  <Star className="h-5 w-5" style={{ color: '#E28F84' }} />
                </div>
                <p className="text-sm font-semibold" style={{ color: '#5B4C37' }}>Glossy & Glowing</p>
                <p className="text-xs" style={{ color: '#A89B84' }}>Guaranteed</p>
              </div>
              <div className="text-center lg:text-left p-4 rounded-lg bg-white/50" style={{ borderColor: '#F6DADA', borderWidth: '1px' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto lg:mx-0 mb-2" style={{ backgroundColor: '#F6DADA' }}>
                  <Sparkles className="h-5 w-5" style={{ color: '#E28F84' }} />
                </div>
                <p className="text-sm font-semibold" style={{ color: '#5B4C37' }}>Lasting</p>
                <p className="text-xs" style={{ color: '#A89B84' }}>Memories</p>
              </div>
            </div>
          </div>

          {/* Updated Image Gallery */}
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
                  src="https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400"
                  alt="Handcrafted jewelry"
                  className="w-full h-32 md:h-40 object-cover"
                />
              </div>
              
              <div className="relative rounded-xl overflow-hidden shadow-lg card-hover">
                <img
                  src="https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400"
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
