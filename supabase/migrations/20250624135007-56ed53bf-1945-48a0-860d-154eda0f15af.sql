
-- Create testimonials table for managing customer testimonials
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  image TEXT,
  product TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Create policy that allows admins to manage testimonials
CREATE POLICY "Admins can manage testimonials" ON public.testimonials
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Create policy that allows public read access to active testimonials
CREATE POLICY "Public can view active testimonials" ON public.testimonials
  FOR SELECT USING (is_active = true);

-- Insert default testimonial data (the ones currently hardcoded in the frontend)
INSERT INTO public.testimonials (name, rating, text, image, product, sort_order) VALUES 
('Sarah Johnson', 5, 'I ordered a photo necklace for my mom''s birthday and she absolutely loved it! The quality is amazing and it arrived beautifully packaged. Will definitely order again!', 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=100', 'Photo Memory Necklace', 1),
('Michael Chen', 5, 'The personalized ornament we got for our first Christmas together is perfect. It''s become our most treasured decoration. The craftsmanship is incredible!', 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=100', 'Custom Photo Ornament', 2),
('Emily Rodriguez', 5, 'I''ve ordered several slate keepsakes as gifts and everyone has been blown away by the quality. The photos come out so clear and beautiful!', 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=100', 'Slate Photo Keepsake', 3);
