import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LogoSettings {
  logo_url: string;
  logo_alt_text: string;
}

export const useLogo = () => {
  const [logoSettings, setLogoSettings] = useState<LogoSettings>({
    logo_url: '/lovable-uploads/5e4be881-9356-47e3-ba32-e012d51e3e8c.png',
    logo_alt_text: 'Beautiful Beginnings'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogoSettings();
    
    // Listen for settings updates
    const handleSettingsUpdate = () => {
      fetchLogoSettings();
    };

    window.addEventListener('settingsUpdated', handleSettingsUpdate);
    return () => window.removeEventListener('settingsUpdated', handleSettingsUpdate);
  }, []);

  const fetchLogoSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('key, value')
        .in('key', ['logo_url', 'logo_alt_text']);

      if (error) throw error;

      if (data && data.length > 0) {
        const settings: Partial<LogoSettings> = {};
        data.forEach(setting => {
          if (setting.key === 'logo_url' && setting.value) {
            settings.logo_url = setting.value;
          }
          if (setting.key === 'logo_alt_text' && setting.value) {
            settings.logo_alt_text = setting.value;
          }
        });
        
        setLogoSettings(prev => ({ ...prev, ...settings }));
      }
    } catch (error) {
      console.error('Error fetching logo settings:', error);
    } finally {
      setLoading(false);
    }
  };

  return { logoSettings, loading };
};