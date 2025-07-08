
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
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-cream to-pearl">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-sage border-t-transparent mx-auto mb-4"></div>
            <div className="text-charcoal font-medium">Loading events...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-cream to-pearl">
      <Navigation />
      
      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-charcoal mb-4">Events & Shows</h1>
            <p className="text-lg text-stone max-w-2xl mx-auto">
              Come meet us in person! We'd love to see you at these upcoming craft fairs, markets, and special events.
            </p>
          </div>

          {/* Events Grid */}
          {events && events.length > 0 ? (
            <div className="grid gap-6 md:gap-8">
              {events.map((event) => (
                <div key={event.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
                  <div className="md:flex">
                    {event.image_url && (
                      <div className="md:w-1/3">
                        <img 
                          src={event.image_url} 
                          alt={event.title}
                          className="w-full h-48 md:h-full object-cover"
                        />
                      </div>
                    )}
                    <div className={`p-6 ${event.image_url ? 'md:w-2/3' : 'w-full'}`}>
                      <h2 className="text-2xl font-bold text-charcoal mb-4">{event.title}</h2>
                      
                      {event.description && (
                        <p className="text-stone mb-4 leading-relaxed">
                          {event.description}
                        </p>
                      )}
                      
                      <div className="space-y-3">
                        {event.start_date && (
                          <div className="flex items-center text-stone">
                            <Calendar className="h-5 w-5 mr-3 text-sage" />
                            <div>
                              <div className="font-medium">{formatDate(event.start_date)}</div>
                              <div className="text-sm flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {formatTime(event.start_date)}
                                {event.end_date && ` - ${formatTime(event.end_date)}`}
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {event.location && (
                          <div className="flex items-center text-stone">
                            <MapPin className="h-5 w-5 mr-3 text-sage" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        
                        {event.event_url && (
                          <div className="pt-2">
                            <a 
                              href={event.event_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-sage hover:text-chocolate font-medium transition-colors duration-200"
                            >
                              Learn more
                              <ExternalLink className="h-4 w-4 ml-1" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-charcoal mb-2">No upcoming events</h3>
              <p className="text-stone">Check back soon for exciting events where you can meet us in person!</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Events;
