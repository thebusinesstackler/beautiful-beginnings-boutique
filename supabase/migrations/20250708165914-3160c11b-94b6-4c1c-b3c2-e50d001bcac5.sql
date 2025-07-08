
-- Add additional settings keys for all the different setting types
INSERT INTO public.settings (key, value) VALUES
  -- Store Information (already exists but adding for completeness)
  ('store_name', 'Beautiful Beginnings'),
  ('store_email', 'hello@beautifulbeginnings.com'),
  ('store_phone', '(555) 123-4567'),
  ('store_website', 'https://beautifulbeginnings.com'),
  ('store_address', '123 Craft Lane\nArtisan Village, AV 12345'),
  
  -- Square Settings (some already exist)
  ('square_app_id', ''),
  ('square_location_id', ''),
  ('square_access_token', ''),
  ('square_environment', 'sandbox'),
  
  -- Shipping Settings
  ('domestic_shipping', '5.99'),
  ('international_shipping', '15.99'),
  ('free_shipping_threshold', '75.00'),
  ('processing_time', '3-5'),
  ('shipping_policy', 'Free shipping on orders over $75. Processing takes 3-5 business days.'),
  
  -- Email Settings
  ('order_confirmation_template', 'Thank you for your order! Your order #{{order_id}} has been received and is being processed.'),
  ('shipping_confirmation_template', 'Great news! Your order #{{order_id}} has shipped and is on its way to you.'),
  
  -- Craft Show Schedule
  ('next_show_name', ''),
  ('next_show_date', ''),
  ('show_location', ''),
  ('booth_number', ''),
  ('show_notes', '')
ON CONFLICT (key) DO NOTHING;
