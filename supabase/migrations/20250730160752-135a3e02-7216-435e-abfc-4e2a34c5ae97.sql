
-- Create gifting_occasions table
CREATE TABLE public.gifting_occasions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  href text NOT NULL,
  icon_name text NOT NULL,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gifting_occasions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage gifting occasions" 
  ON public.gifting_occasions 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  ));

CREATE POLICY "Public can view active gifting occasions" 
  ON public.gifting_occasions 
  FOR SELECT 
  USING (is_active = true);

-- Insert default data
INSERT INTO public.gifting_occasions (title, description, image_url, href, icon_name, sort_order) VALUES
('Anniversaries', 'Celebrate your love story with personalized keepsakes', 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400', '/shop/anniversaries', 'Heart', 1),
('Birthdays', 'Make their special day unforgettable with custom gifts', 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400', '/shop/birthdays', 'Gift', 2),
('Holidays', 'Create magical holiday memories with personalized ornaments', 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400', '/products/ornaments', 'Calendar', 3);
