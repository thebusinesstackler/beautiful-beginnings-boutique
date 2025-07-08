
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SiteSettings {
  store_name: string;
  store_email: string;
  store_phone: string;
  store_website: string;
  store_address: string;
  square_app_id?: string;
  square_location_id?: string;
  square_access_token?: string;
  square_environment?: string;
}

export const useSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>({
    store_name: 'Beautiful Beginnings',
    store_email: 'hello@beautifulbeginnings.com',
    store_phone: '(555) 123-4567',
    store_website: 'https://beautifulbeginnings.com',
    store_address: '123 Craft Lane\nArtisan Village, AV 12345'
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    setLoading(true);
    try {
      // For now, we'll store settings in localStorage since we don't have a settings table
      // In a real app, you'd want to create a settings table in the database
      const currentSettings = { ...settings, ...newSettings };
      localStorage.setItem('siteSettings', JSON.stringify(currentSettings));
      setSettings(currentSettings);
      
      toast({
        title: "Settings Updated",
        description: "Your store settings have been saved successfully.",
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load settings from localStorage on component mount
    const savedSettings = localStorage.getItem('siteSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
      } catch (error) {
        console.error('Error parsing saved settings:', error);
      }
    }
  }, []);

  return { settings, updateSettings, loading };
};
