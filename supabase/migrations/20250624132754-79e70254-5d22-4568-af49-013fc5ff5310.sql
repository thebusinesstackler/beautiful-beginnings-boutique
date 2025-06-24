
-- Create FAQ table for managing frequently asked questions
CREATE TABLE public.faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Create policy that allows admins to manage FAQs
CREATE POLICY "Admins can manage FAQs" ON public.faqs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Insert default FAQ data
INSERT INTO public.faqs (question, answer, sort_order) VALUES 
('How do I upload my photo for personalization?', 'Simply click on any product, then use our easy upload tool to select your photo from your device. We accept JPG, PNG, and HEIC formats. For best results, use high-resolution images.', 1),
('How long does it take to receive my personalized item?', 'Most orders are handcrafted and shipped within 3-5 business days. Standard shipping takes an additional 5-7 business days. Rush orders are available for an additional fee.', 2),
('What if I''m not satisfied with my order?', 'We offer a 100% satisfaction guarantee! If you''re not completely happy with your personalized item, contact us within 30 days for a full refund or replacement.', 3),
('Can I see a preview before my item is made?', 'Yes! After uploading your photo, you''ll see a digital preview of how your item will look. You can make adjustments to text, positioning, and colors before we begin crafting.', 4),
('Do you offer gift wrapping?', 'Absolutely! We offer elegant gift wrapping and can include a personalized note with your order. Gift wrapping is currently complimentary for a limited time.', 5),
('What materials do you use for your products?', 'We use only premium materials including genuine leather, high-quality metals, natural slate, and durable wood. All materials are chosen for their longevity and beauty.', 6),
('Can I order in bulk for special events?', 'Yes! We offer bulk discounts for orders of 10 or more items. Perfect for weddings, corporate gifts, or family reunions. Contact us for special pricing.', 7),
('How do I care for my personalized items?', 'Each item comes with specific care instructions. Generally, avoid direct sunlight and moisture. For jewelry, store in a dry place. For ornaments, handle gently and store safely when not displayed.', 8);
