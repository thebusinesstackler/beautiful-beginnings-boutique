
import { useState, useEffect } from 'react';

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
    // Load shipping settings from localStorage (admin panel integration)
    const savedSettings = localStorage.getItem('shippingSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error parsing shipping settings:', error);
      }
    }
  }, []);

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
