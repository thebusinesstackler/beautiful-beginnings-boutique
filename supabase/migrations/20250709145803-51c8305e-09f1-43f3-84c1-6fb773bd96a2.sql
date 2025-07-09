
-- Update RLS policies for customer-uploads storage bucket to allow public uploads
-- while maintaining security for other operations

-- First, let's remove any overly restrictive policies on storage.objects for customer-uploads
DROP POLICY IF EXISTS "Users can upload to customer-uploads" ON storage.objects;
DROP POLICY IF EXISTS "Users can view customer-uploads" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete from customer-uploads" ON storage.objects;

-- Create new policies that allow public uploads but restrict other operations
CREATE POLICY "Anyone can upload to customer-uploads" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'customer-uploads');

CREATE POLICY "Anyone can view customer-uploads" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'customer-uploads');

-- Only allow authenticated users to delete (for admin cleanup)
CREATE POLICY "Authenticated users can delete from customer-uploads" 
  ON storage.objects 
  FOR DELETE 
  USING (bucket_id = 'customer-uploads' AND auth.role() = 'authenticated');

-- Update the bucket to ensure it's public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'customer-uploads';
