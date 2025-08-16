-- Phase 2: Implement Strict RLS Policies for customers table
-- Ensure zero-trust access to customer PII with comprehensive security

-- Step 1: Clean up any remaining conflicting or insecure policies
DROP POLICY IF EXISTS "Allow customer creation for authenticated users and order proce" ON public.customers;
DROP POLICY IF EXISTS "Prevent unauthorized customer creation" ON public.customers; 

-- Step 2: Implement strict SELECT policy - customers can only see their own data
CREATE POLICY "Users can view only their own customer data" 
ON public.customers 
FOR SELECT 
USING (
  -- User can only see their own customer record
  (auth.uid() IS NOT NULL AND id = auth.uid())
  OR
  -- Admins can see all customer records
  has_role(auth.uid(), 'admin'::app_role)
);

-- Step 3: Implement strict UPDATE policy - customers can only update their own data
CREATE POLICY "Users can update only their own customer data" 
ON public.customers 
FOR UPDATE 
USING (
  -- User can only update their own customer record
  (auth.uid() IS NOT NULL AND id = auth.uid())
  OR
  -- Admins can update any customer record
  has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  -- Ensure the updated record still belongs to the user
  (auth.uid() IS NOT NULL AND id = auth.uid())
  OR
  -- Admins can update any customer record
  has_role(auth.uid(), 'admin'::app_role)
);

-- Step 4: Implement strict DELETE policy - only admins can delete customer records
CREATE POLICY "Only admins can delete customer records" 
ON public.customers 
FOR DELETE 
USING (
  -- Only admins can delete customer records
  has_role(auth.uid(), 'admin'::app_role)
);

-- Verify our INSERT policy from Phase 1 is still in place
-- (This should already exist from Phase 1, but let's ensure it's correct)
CREATE POLICY "Authenticated users and admins can create customers" 
ON public.customers 
FOR INSERT 
WITH CHECK (
  -- Authenticated user creating their own record
  (auth.uid() IS NOT NULL AND id = auth.uid())
  OR
  -- Admin creating any record
  has_role(auth.uid(), 'admin'::app_role)
);