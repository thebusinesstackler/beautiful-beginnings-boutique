
-- Update product-images bucket with MIME type restrictions and file size limits
UPDATE storage.buckets 
SET 
  file_size_limit = 10485760, -- 10MB limit
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
WHERE id = 'product-images';

-- Drop old storage policies that use deprecated is_admin field
DROP POLICY IF EXISTS "Admins can manage product images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload product images" ON storage.objects;

-- Create new storage policies using role-based authorization system
CREATE POLICY "Anyone can view product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Admins can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'product-images' 
    AND public.has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Admins can update product images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'product-images' 
    AND public.has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Admins can delete product images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'product-images' 
    AND public.has_role(auth.uid(), 'admin'::app_role)
  );

-- Update customer-uploads bucket policies to use role-based system
DROP POLICY IF EXISTS "Anyone can upload customer images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view customer images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can manage customer uploads" ON storage.objects;

CREATE POLICY "Anyone can upload to customer-uploads"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'customer-uploads');

CREATE POLICY "Anyone can view customer uploads"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'customer-uploads');

CREATE POLICY "Admins can manage customer uploads"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'customer-uploads' 
    AND public.has_role(auth.uid(), 'admin'::app_role)
  );
