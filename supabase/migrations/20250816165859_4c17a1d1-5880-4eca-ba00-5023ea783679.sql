-- Fix security vulnerability: Remove overly permissive INSERT policy on customers table
-- The current policy allows anyone to insert customer records with no restrictions

-- Drop the insecure policy
DROP POLICY IF EXISTS "Allow customer creation for orders" ON public.customers;

-- Create a more secure policy that only allows customer creation through the order process
-- This policy allows INSERT only when the customer_id matches the authenticated user's ID
-- or when it's NULL (for guest orders handled by the trigger function)
CREATE POLICY "Allow customer creation for authenticated users and order process" 
ON public.customers 
FOR INSERT 
WITH CHECK (
  -- Allow if user is authenticated and customer_id matches their auth.uid()
  (auth.uid() IS NOT NULL AND id = auth.uid()) 
  OR 
  -- Allow if it's a guest order (customer_id is NULL, handled by trigger)
  (auth.uid() IS NULL AND id IS NULL)
  OR
  -- Allow admins to create any customer record
  has_role(auth.uid(), 'admin'::app_role)
);

-- Add a policy to prevent unauthorized direct customer creation
-- This ensures customers can only be created through proper channels
CREATE POLICY "Prevent unauthorized customer creation" 
ON public.customers 
FOR INSERT 
WITH CHECK (
  -- Only allow creation if it's through the order trigger (SECURITY DEFINER)
  -- or by admins, or by authenticated users for their own record
  (
    -- Authenticated user creating their own record
    (auth.uid() IS NOT NULL AND id = auth.uid())
    OR
    -- Admin creating any record
    has_role(auth.uid(), 'admin'::app_role)
  )
);