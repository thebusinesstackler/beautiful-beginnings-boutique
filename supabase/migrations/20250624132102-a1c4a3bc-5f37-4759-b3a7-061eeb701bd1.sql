
-- Create website_content table for managing homepage content
CREATE TABLE public.website_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hero_main_image TEXT,
  hero_secondary_images TEXT[],
  hero_title TEXT,
  hero_subtitle TEXT,
  hero_description TEXT,
  about_background_image TEXT,
  featured_background_image TEXT,
  testimonials_background_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.website_content ENABLE ROW LEVEL SECURITY;

-- Create policy that allows admins to manage website content
CREATE POLICY "Admins can manage website content" ON public.website_content
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Insert default website content
INSERT INTO public.website_content (
  hero_main_image,
  hero_secondary_images,
  hero_title,
  hero_subtitle,
  hero_description,
  about_background_image,
  featured_background_image,
  testimonials_background_image
) VALUES (
  'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=800',
  ARRAY[
    'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400',
    'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400'
  ],
  'Where Memories Begin',
  'and Beauty Lasts',
  'Capture the magic of your favorite moments—handcrafted photo keepsakes made with love and lasting brilliance. From shimmering ornaments to heartfelt jewelry, Beautiful Beginnings brings your memories to life.',
  '',
  '',
  ''
);
