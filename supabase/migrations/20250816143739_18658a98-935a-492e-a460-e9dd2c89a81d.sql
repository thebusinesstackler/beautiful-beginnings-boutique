-- Add public read policy for active FAQs
CREATE POLICY "Public can view active FAQs" 
ON public.faqs 
FOR SELECT 
USING (is_active = true);