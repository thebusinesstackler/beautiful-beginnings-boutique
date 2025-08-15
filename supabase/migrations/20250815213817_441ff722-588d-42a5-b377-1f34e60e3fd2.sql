-- Remove the public access to Square credentials for security
DROP POLICY IF EXISTS "Public can view Square configuration keys" ON public.settings;

-- Create a more secure policy that only allows admins to view Square config
-- No public access to payment credentials whatsoever
CREATE POLICY "Admins can view all settings including Square config" 
ON public.settings 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Ensure only admins can manage settings (this policy should already exist but let's make sure)
DROP POLICY IF EXISTS "Admins can manage settings" ON public.settings;
CREATE POLICY "Admins can manage settings" 
ON public.settings 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));