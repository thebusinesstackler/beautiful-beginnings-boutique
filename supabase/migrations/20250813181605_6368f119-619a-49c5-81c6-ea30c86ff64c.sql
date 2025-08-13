-- Create a policy to allow public read access to specific Square configuration keys
CREATE POLICY "Public can view Square configuration keys" 
ON public.settings 
FOR SELECT 
TO PUBLIC
USING (key IN ('square_app_id', 'square_location_id', 'square_environment'));