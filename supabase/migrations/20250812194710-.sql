-- Add logo settings to the settings table
INSERT INTO public.settings (key, value) VALUES 
  ('logo_url', '/lovable-uploads/5e4be881-9356-47e3-ba32-e012d51e3e8c.png'),
  ('logo_alt_text', 'Beautiful Beginnings')
ON CONFLICT (key) DO NOTHING;