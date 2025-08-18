-- Create customer-uploads bucket for customer photo uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('customer-uploads', 'customer-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for customer uploads
CREATE POLICY "Allow authenticated users to upload customer photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'customer-uploads' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow public read access to customer uploads" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'customer-uploads');

CREATE POLICY "Allow users to update their own customer uploads" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'customer-uploads' AND auth.role() = 'authenticated');

CREATE POLICY "Allow users to delete their own customer uploads" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'customer-uploads' AND auth.role() = 'authenticated');