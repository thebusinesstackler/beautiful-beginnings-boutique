
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const StillHaveQuestions = () => {
  const [phoneNumber, setPhoneNumber] = useState('(555) 123-4567');

  useEffect(() => {
    fetchPhoneNumber();
  }, []);

  const fetchPhoneNumber = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'store_phone')
        .single();

      if (data && data.value) {
        setPhoneNumber(data.value);
      }
    } catch (error) {
      console.error('Error fetching phone number:', error);
    }
  };

  return (
    <section className="py-16" style={{ backgroundColor: '#FAF5EF' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#5B4C37' }}>
          Still Have Questions?
        </h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: '#A89B84' }}>
          We're here to help! Whether you need assistance with personalization, shipping, or anything else, 
          don't hesitate to reach out.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            asChild
            className="text-lg px-8 py-3 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg"
            style={{ backgroundColor: '#E28F84' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F4A79B'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E28F84'}
          >
            <Link to="/shop">
              Start Personalizing Now
            </Link>
          </Button>
          
          <div className="flex items-center space-x-2">
            <Phone className="h-5 w-5" style={{ color: '#7A7047' }} />
            <span className="text-lg font-medium" style={{ color: '#7A7047' }}>
              Call us: {phoneNumber}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StillHaveQuestions;
