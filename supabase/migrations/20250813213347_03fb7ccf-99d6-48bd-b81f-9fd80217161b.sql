-- Create storage policies to allow anonymous users to upload customer photos
-- This allows anonymous users to upload files to the customer-uploads folder in product-images bucket

-- Policy for anonymous users to insert files into customer-uploads folder
CREATE POLICY "Allow anonymous uploads to customer-uploads folder" 
ON storage.objects 
FOR INSERT 
TO anon 
WITH CHECK (bucket_id = 'product-images' AND name LIKE 'customer-uploads/%');

-- Policy for anonymous users to read their uploaded files (needed for generating public URLs)
CREATE POLICY "Allow anonymous read access to customer-uploads folder" 
ON storage.objects 
FOR SELECT 
TO anon 
USING (bucket_id = 'product-images' AND name LIKE 'customer-uploads/%');