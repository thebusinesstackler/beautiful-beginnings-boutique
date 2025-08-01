
-- Add public read access to website_content table
-- This allows all visitors to see the hero images while keeping admin write access
CREATE POLICY "Public can view website content" 
  ON public.website_content 
  FOR SELECT 
  USING (true);
