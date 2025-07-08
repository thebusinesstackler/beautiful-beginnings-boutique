
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '@/hooks/useSettings';

const StillHaveQuestions = () => {
  const { settings } = useSettings();

  // Listen for settings updates
  useEffect(() => {
    const handleSettingsUpdate = () => {
      console.log('Settings updated in StillHaveQuestions component');
      // The useSettings hook will automatically update when settings change
    };

    window.addEventListener('settingsUpdated', handleSettingsUpdate);
    return () => window.removeEventListener('settingsUpdated', handleSettingsUpdate);
  }, []);

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
              Call us: {settings.store_phone}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StillHaveQuestions;
