
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Calendar, MapPin, ExternalLink, Clock } from 'lucide-react';

const Events = () => {
  const { data: events, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_active', true)
        .order('start_date', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-cream via-pearl to-blush/30">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-3 border-sage border-t-transparent mx-auto mb-6"></div>
            <div className="text-charcoal font-medium text-lg">Loading upcoming events...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-cream via-pearl to-blush/30">
      <Navigation />
      
      <main className="flex-1 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Header */}
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-2 bg-sage/10 rounded-full mb-6">
              <span className="text-sage font-medium text-sm uppercase tracking-wide">Events & Shows</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-playfair font-bold text-charcoal mb-6 leading-tight">
              Meet Us in 
              <span className="text-sage block">Person</span>
            </h1>
            <p className="text-xl text-stone max-w-3xl mx-auto leading-relaxed">
              Join us at craft fairs, markets, and special events where you can see our 
              handcrafted keepsakes up close and meet the artisans behind each piece.
            </p>
          </div>

          {/* Events */}
          {events && events.length > 0 ? (
            <div className="space-y-12">
              {events.map((event, index) => (
                <article 
                  key={event.id} 
                  className={`group ${index === 0 ? 'featured-event' : ''}`}
                >
                  <div className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden ${
                    index === 0 ? 'lg:grid lg:grid-cols-2 lg:gap-0' : ''
                  }`}>
                    {/* Featured Image */}
                    {event.image_url && (
                      <div className={`relative overflow-hidden ${
                        index === 0 ? 'lg:order-2 h-64 lg:h-full' : 'h-64'
                      }`}>
                        <img 
                          src={event.image_url} 
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 to-transparent"></div>
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className={`p-8 lg:p-12 ${index === 0 ? 'lg:order-1' : ''}`}>
                      {/* Event Title */}
                      <h2 className={`font-playfair font-bold text-charcoal mb-6 group-hover:text-sage transition-colors duration-300 ${
                        index === 0 ? 'text-3xl lg:text-4xl' : 'text-2xl lg:text-3xl'
                      }`}>
                        {event.title}
                      </h2>
                      
                      {/* Event Description */}
                      {event.description && (
                        <p className={`text-stone leading-relaxed mb-6 ${
                          index === 0 ? 'text-lg' : 'text-base'
                        }`}>
                          {event.description}
                        </p>
                      )}
                      
                      {/* Event Details */}
                      <div className="space-y-4 mb-6">
                        {event.start_date && (
                          <div className="flex items-start gap-3">
                            <Calendar className="h-5 w-5 text-sage mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="font-medium text-charcoal text-lg">
                                {formatDate(event.start_date)}
                              </div>
                              <div className="text-stone flex items-center gap-1 mt-1">
                                <Clock className="h-4 w-4" />
                                <span>
                                  {formatTime(event.start_date)}
                                  {event.end_date && ` - ${formatTime(event.end_date)}`}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {event.location && (
                          <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-sage mt-0.5 flex-shrink-0" />
                            <span className="text-stone font-medium">{event.location}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Event Link */}
                      {event.event_url && (
                        <a 
                          href={event.event_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sage hover:text-chocolate font-medium transition-all duration-300 group-hover:gap-3"
                        >
                          Learn more about this event
                          <ExternalLink className="h-4 w-4 transition-transform duration-300" />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-8 bg-sage/10 rounded-full flex items-center justify-center">
                <span className="text-4xl">🎪</span>
              </div>
              <h3 className="text-2xl font-playfair font-semibold text-charcoal mb-4">
                No Upcoming Events
              </h3>
              <p className="text-lg text-stone max-w-md mx-auto">
                We're planning exciting events where you can meet us in person. 
                Check back soon for craft fairs, markets, and special shows!
              </p>
            </div>
          )}

          {/* Call to Action */}
          {events && events.length > 0 && (
            <div className="mt-20 bg-gradient-to-r from-sage/10 to-forest/10 rounded-2xl p-8 lg:p-12 text-center">
              <h3 className="text-2xl font-playfair font-bold text-charcoal mb-4">
                Can't Make It to an Event?
              </h3>
              <p className="text-stone mb-6 max-w-2xl mx-auto">
                Browse our full collection online and have our handcrafted keepsakes 
                delivered directly to your door. Each piece is made with the same love and attention to detail.
              </p>
              <a 
                href="/shop"
                className="bg-sage hover:bg-forest text-white px-8 py-3 rounded-lg font-medium transition-colors duration-300 inline-block"
              >
                Shop Our Collection
              </a>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Events;
