-- Fix RLS policy for guest checkout orders
DROP POLICY IF EXISTS "Allow order creation for authenticated and guest users" ON public.orders;

-- Create new policy that handles the trigger behavior correctly
CREATE POLICY "Allow order creation for all users" 
ON public.orders 
FOR INSERT 
WITH CHECK (
  -- For authenticated users: must match their user ID
  (auth.uid() IS NOT NULL AND customer_id = auth.uid()) 
  OR 
  -- For guest users: allow insertion regardless of customer_id (trigger will handle it)
  (auth.uid() IS NULL)
);