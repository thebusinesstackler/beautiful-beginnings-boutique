
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ShippingSettings {
  domesticRate: number;
  internationalRate: number;
  freeShippingThreshold: number;
  processingTimeDays: string;
  policy: string;
}

export const useShippingSettings = () => {
  const [settings, setSettings] = useState<ShippingSettings>({
    domesticRate: 5.99,
    internationalRate: 15.99,
    freeShippingThreshold: 75.00,
    processingTimeDays: '3-5',
    policy: 'Free shipping on orders over $75. Processing takes 3-5 business days.'
  });

  useEffect(() => {
    fetchShippingSettings();
  }, []);

  const fetchShippingSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('key, value')
        .in('key', ['domestic_shipping', 'international_shipping', 'free_shipping_threshold', 'processing_time', 'shipping_policy']);

      if (error) throw error;

      if (data && data.length > 0) {
        const newSettings = { ...settings };
        data.forEach(setting => {
          switch (setting.key) {
            case 'domestic_shipping':
              newSettings.domesticRate = parseFloat(setting.value) || 5.99;
              break;
            case 'international_shipping':
              newSettings.internationalRate = parseFloat(setting.value) || 15.99;
              break;
            case 'free_shipping_threshold':
              newSettings.freeShippingThreshold = parseFloat(setting.value) || 75.00;
              break;
            case 'processing_time':
              newSettings.processingTimeDays = setting.value || '3-5';
              break;
            case 'shipping_policy':
              newSettings.policy = setting.value || 'Free shipping on orders over $75. Processing takes 3-5 business days.';
              break;
          }
        });
        setSettings(newSettings);
      }
    } catch (error) {
      console.error('Error fetching shipping settings:', error);
    }
  };

  const calculateShipping = (subtotal: number, isDomestic: boolean = true) => {
    if (subtotal >= settings.freeShippingThreshold) {
      return 0;
    }
    return isDomestic ? settings.domesticRate : settings.internationalRate;
  };

  const getEstimatedDelivery = () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + parseInt(settings.processingTimeDays.split('-')[0]));
    
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + parseInt(settings.processingTimeDays.split('-')[1] || settings.processingTimeDays.split('-')[0]) + 5);
    
    return {
      earliest: startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      latest: endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
  };

  return {
    settings,
    calculateShipping,
    getEstimatedDelivery
  };
};
