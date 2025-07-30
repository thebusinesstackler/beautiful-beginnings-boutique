
import { Button } from '@/components/ui/button';
import { Heart, Gift, Calendar, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface GiftingOccasion {
  id: string;
  title: string;
  description: string;
  image_url: string;
  href: string;
  icon_name: string;
  sort_order: number;
}

const iconMap = {
  Heart,
  Gift,
  Calendar,
  Star
};

const GiftingSection = () => {
  const { data: occasions, isLoading } = useQuery({
    queryKey: ['gifting-occasions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gifting_occasions')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;
      return data as GiftingOccasion[];
    },
  });

  // Fallback data in case database is empty
  const defaultOccasions: GiftingOccasion[] = [
    {
      id: '1',
      title: "Anniversaries",
      description: "Celebrate your love story with personalized keepsakes",
      image_url: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400",
      href: "/shop/anniversaries",
      icon_name: "Heart",
      sort_order: 1
    },
    {
      id: '2',
      title: "Birthdays",
      description: "Make their special day unforgettable with custom gifts",
      image_url: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400",
      href: "/shop/birthdays",
      icon_name: "Gift",
      sort_order: 2
    },
    {
      id: '3',
      title: "Holidays",
      description: "Create magical holiday memories with personalized ornaments",
      image_url: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400",
      href: "/products/ornaments",
      icon_name: "Calendar",
      sort_order: 3
    }
  ];

  const displayOccasions = occasions && occasions.length > 0 ? occasions : defaultOccasions;

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-b from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-sage border-t-transparent mx-auto"></div>
          <p className="mt-4 text-charcoal">Loading gifting occasions...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-primary/5 to-accent/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-foreground mb-6">
            Perfect Gifts for Your Loved Ones
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Show them how much you care with personalized keepsakes that capture your most precious moments together
          </p>
          <div className="inline-flex items-center px-6 py-3 bg-accent/20 rounded-full text-primary font-semibold">
            <Heart className="h-5 w-5 mr-2" />
            Made with Love for Every Occasion
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {displayOccasions.map((occasion, index) => {
            const IconComponent = iconMap[occasion.icon_name as keyof typeof iconMap] || Heart;
            
            return (
              <div
                key={occasion.id || index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={occasion.image_url}
                    alt={occasion.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-playfair font-bold text-black mb-3">
                    {occasion.title}
                  </h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {occasion.description}
                  </p>
                  <Link to={occasion.href}>
                    <Button size="sm" variant="outline" className="w-full border-2 hover:scale-105 transition-all duration-300" style={{ borderColor: '#E28F84', color: '#7A7047' }}>
                      Shop {occasion.title}
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center space-y-6">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-playfair font-bold text-black mb-4">
              🎁 Limited Time: Free Gift Wrapping
            </h3>
            <p className="text-gray-700 mb-6">
              Make your gift extra special with our complimentary elegant gift wrapping and personalized note
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products/ornaments">
                <Button className="text-lg px-8 py-4 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-white font-semibold" style={{ backgroundColor: '#E28F84' }}>
                  Order Now - Free Shipping
                </Button>
              </Link>
              <Button variant="outline" className="text-lg px-8 py-4 border-2 hover:scale-105 transition-all duration-300" style={{ borderColor: '#E28F84', color: '#7A7047' }}>
                Personalize Your Gift Today
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GiftingSection;
