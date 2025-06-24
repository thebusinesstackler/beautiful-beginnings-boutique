
-- Create featured_products table for managing the featured products in the About section
CREATE TABLE public.featured_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  href TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  reviews INTEGER NOT NULL DEFAULT 0,
  customer_quote TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.featured_products ENABLE ROW LEVEL SECURITY;

-- Create policy that allows admins to manage featured products
CREATE POLICY "Admins can manage featured products" ON public.featured_products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Create policy that allows public read access to active featured products
CREATE POLICY "Public can view active featured products" ON public.featured_products
  FOR SELECT USING (is_active = true);

-- Insert the default featured products (the ones currently in the About component)
INSERT INTO public.featured_products (name, price, original_price, image, description, href, rating, reviews, customer_quote, sort_order) VALUES 
('Holiday Sparkle Ornaments', 22.50, 25.00, 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=600', 'A shimmering memory you can hang with love. These glossy, vibrant photo ornaments are perfect for Christmas trees, mantle displays, or gift tags.', '/products/ornaments', 5, 24, 'A picture is worth a thousand words—ours are worth a lifetime!', 1),
('Heartfelt Wearables', 15.00, NULL, 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=600', 'Keep love close with beautiful charm bracelets, lockets, and keychains. Each piece is sublimated with your chosen photo and finished with a polished, durable gloss.', '/products/necklaces', 5, 18, 'Keepsakes that feel like hugs from home.', 2),
('Whimsy Wood Decor', 12.00, NULL, 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=600', 'Bring a little merry to every corner with playful countdowns, rustic wreaths, and timeless accents made to charm.', '/products/wood-sublimation', 5, 32, 'We don''t just make gifts—we make stories that stay.', 3);
