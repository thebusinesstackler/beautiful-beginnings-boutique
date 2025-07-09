
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
  domestic_shipping?: string;
  international_shipping?: string;
  free_shipping_threshold?: string;
  processing_time?: string;
  shipping_policy?: string;
  order_confirmation_template?: string;
  shipping_confirmation_template?: string;
  next_show_name?: string;
  next_show_date?: string;
  show_location?: string;
  booth_number?: string;
  show_notes?: string;
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

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      console.log('Fetching ALL settings from database (including Square credentials)...');
      const { data, error } = await supabase
        .from('settings')
        .select('key, value');

      if (error) {
        console.error('Error fetching settings:', error);
        throw error;
      }

      console.log('Settings data received:', data);

      if (data && data.length > 0) {
        const settingsObject: Partial<SiteSettings> = {};
        data.forEach(setting => {
          const key = setting.key as keyof SiteSettings;
          if (setting.value) {
            settingsObject[key] = setting.value;
          }
        });
        
        console.log('Parsed settings object with Square credentials:', settingsObject);
        setSettings(prev => ({ ...prev, ...settingsObject }));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      });
    }
  };

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    setLoading(true);
    try {
      console.log('Updating settings:', newSettings);
      
      // Update each setting in the database
      for (const [key, value] of Object.entries(newSettings)) {
        console.log(`Updating setting: ${key} = ${value ? '[SET]' : '[EMPTY]'}`);
        const { error } = await supabase
          .from('settings')
          .upsert(
            { key, value: value as string },
            { onConflict: 'key' }
          );
        
        if (error) {
          console.error(`Error updating setting ${key}:`, error);
          throw error;
        }
      }
      
      const currentSettings = { ...settings, ...newSettings };
      setSettings(currentSettings);
      console.log('Settings updated successfully:', currentSettings);
      
      toast({
        title: "Settings Updated",
        description: "Your settings have been saved successfully.",
      });

      // Trigger a window event to notify other components about the settings update
      window.dispatchEvent(new CustomEvent('settingsUpdated', { detail: currentSettings }));
      
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

  return { settings, updateSettings, loading, fetchSettings };
};
