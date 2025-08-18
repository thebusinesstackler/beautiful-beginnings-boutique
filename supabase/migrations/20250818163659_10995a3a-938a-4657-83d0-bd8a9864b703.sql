-- Update Square configuration policy to use standardized column name
-- First drop the old policy
DROP POLICY IF EXISTS "Public can view Square configuration keys" ON public.settings;

-- Create new policy with correct standardized naming
CREATE POLICY "Public can view Square configuration keys" 
ON public.settings 
FOR SELECT 
TO PUBLIC
USING (key IN ('square_application_id', 'square_location_id', 'square_environment'));

-- Update any existing square_app_id records to use standardized naming
UPDATE public.settings 
SET key = 'square_application_id' 
WHERE key = 'square_app_id';

-- Also update any database records that reference the old square_access_token setting
-- These should not be stored in the settings table but in Supabase secrets
DELETE FROM public.settings 
WHERE key IN ('square_access_token', 'square_app_id');