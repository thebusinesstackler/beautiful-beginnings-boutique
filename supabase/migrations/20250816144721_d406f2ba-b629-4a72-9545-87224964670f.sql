-- Add comprehensive RLS policies for orders table security

-- Allow customers to update their own orders (for shipping address changes, etc.)
CREATE POLICY "Customers can update their own orders"
ON public.orders
FOR UPDATE
TO authenticated
USING (customer_email = auth.email())
WITH CHECK (customer_email = auth.email());

-- Restrict public order creation with basic validation
DROP POLICY IF EXISTS "Allow public to create orders" ON public.orders;
CREATE POLICY "Allow validated public order creation"
ON public.orders
FOR INSERT
WITH CHECK (
  -- Ensure required fields are present
  customer_email IS NOT NULL 
  AND customer_email != ''
  AND total_amount > 0
  -- Prevent tampering with admin-only fields
  AND status = 'pending'
  AND customer_id IS NULL -- This will be set by trigger
  AND payment_id IS NULL -- This will be set by payment processor
);

-- Ensure only admins can delete orders (for GDPR compliance, etc.)
CREATE POLICY "Only admins can delete orders"
ON public.orders
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));