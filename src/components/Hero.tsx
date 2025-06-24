import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Heart, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface WebsiteContent {
  id: string;
  hero_main_image: string;
  hero_secondary_images: string[];
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
}

const Hero = () => {
  const [content, setContent] = useState<WebsiteContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWebsiteContent();
  }, []);

  const fetchWebsiteContent = async () => {
    try {
      const { data, error } = await supabase
        .from('website_content')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setContent(data as WebsiteContent);
      }
    } catch (error) {
      console.error('Error fetching website content:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fallback content if database content is not available
  const fallbackContent = {
    hero_main_image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=800",
    hero_secondary_images: [
      "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400",
      "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400"
    ],
    hero_title: "Where Memories Begin",
    hero_subtitle: "and Beauty Lasts",
    hero_description: "Capture the magic of your favorite moments—handcrafted photo keepsakes made with love and lasting brilliance. From shimmering ornaments to heartfelt jewelry, Beautiful Beginnings brings your memories to life."
  };

  const displayContent = content || fallbackContent;

  return (
    <section className="relative py-20 md:py-32 overflow-hidden" style={{ backgroundColor: '#FAF5EF' }}>
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl" style={{ backgroundColor: '#E28F84' }}></div>
        <div className="absolute top-40 right-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl" style={{ backgroundColor: '#7A7047' }}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl" style={{ backgroundColor: '#F4A79B' }}></div>
      </div>
      
      <div className="relative w-full px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          {/* Content */}
          <div className="text-center lg:text-left animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold mb-6 border" style={{ backgroundColor: '#F6DADA', color: '#7A7047', borderColor: '#E28F84' }}>
              <Sparkles className="h-4 w-4 mr-2" />
              Handcrafted Since 2020
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span style={{ color: '#5B4C37' }}>{displayContent.hero_title}</span>
              <br />
              <span className="bg-gradient-to-r from-[#E28F84] to-[#F4A79B] bg-clip-text text-transparent font-bold">{displayContent.hero_subtitle}</span>
            </h1>
            
            <p className="text-xl mb-8 max-w-2xl leading-relaxed" style={{ color: '#A89B84' }}>
              {displayContent.hero_description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Button 
                asChild
                className="text-lg px-8 py-3 group text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg"
                style={{ backgroundColor: '#E28F84' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F4A79B'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E28F84'}
              >
                <Link to="/shop">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
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
            {loading ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 bg-gray-200 animate-pulse rounded-2xl h-64 md:h-80"></div>
                <div className="bg-gray-200 animate-pulse rounded-xl h-32 md:h-40"></div>
                <div className="bg-gray-200 animate-pulse rounded-xl h-32 md:h-40"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {/* Main large image */}
                <div className="col-span-2 relative rounded-2xl overflow-hidden shadow-2xl card-hover">
                  <img
                    src={displayContent.hero_main_image}
                    alt="Beautiful handcrafted ornaments"
                    className="w-full h-64 md:h-80 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=800";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-sm font-semibold">Holiday Collection</p>
                    <p className="text-xs opacity-90">Personalized Ornaments</p>
                  </div>
                </div>
                
                {/* Smaller images */}
                {displayContent.hero_secondary_images && displayContent.hero_secondary_images.length > 0 ? (
                  displayContent.hero_secondary_images.slice(0, 2).map((image, index) => (
                    <div key={index} className="relative rounded-xl overflow-hidden shadow-lg card-hover">
                      <img
                        src={image}
                        alt={`Handcrafted product ${index + 1}`}
                        className="w-full h-32 md:h-40 object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400";
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <>
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
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
