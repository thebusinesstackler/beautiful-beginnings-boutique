-- Add policy allowing customers to view their own orders
CREATE POLICY "Customers can view their own orders" 
ON public.orders 
FOR SELECT 
TO authenticated
USING (customer_email = auth.email());