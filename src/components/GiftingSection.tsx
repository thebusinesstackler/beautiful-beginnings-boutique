
import { Button } from '@/components/ui/button';
import { Heart, Gift, Calendar, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const GiftingSection = () => {
  const occasions = [
    {
      icon: Heart,
      title: "Anniversaries",
      description: "Celebrate your love story with personalized keepsakes",
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400"
    },
    {
      icon: Gift,
      title: "Birthdays",
      description: "Make their special day unforgettable with custom gifts",
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400"
    },
    {
      icon: Calendar,
      title: "Holidays",
      description: "Create magical holiday memories with personalized ornaments",
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400"
    }
  ];

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
          {occasions.map((occasion, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={occasion.image}
                  alt={occasion.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center">
                    <occasion.icon className="h-5 w-5 text-primary" />
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
                <Button size="sm" variant="outline" className="w-full border-2 hover:scale-105 transition-all duration-300" style={{ borderColor: '#E28F84', color: '#7A7047' }}>
                  Shop {occasion.title}
                </Button>
              </div>
            </div>
          ))}
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
