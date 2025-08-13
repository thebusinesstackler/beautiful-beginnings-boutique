-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Public can view active categories" ON public.categories;

-- Create a new policy that allows everyone (authenticated and anonymous) to view active categories
CREATE POLICY "Everyone can view active categories" 
ON public.categories 
FOR SELECT 
TO PUBLIC
USING (is_active = true);