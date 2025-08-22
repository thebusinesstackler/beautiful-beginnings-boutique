-- Drop the problematic existing INSERT policy
DROP POLICY IF EXISTS "Allow order creation to insert items" ON public.order_items;

-- Create a new INSERT policy that properly allows order item insertion
CREATE POLICY "Enable order item insertion during order creation" 
ON public.order_items 
FOR INSERT 
WITH CHECK (
  -- Allow admins to insert any order items
  public.has_role(auth.uid(), 'admin'::app_role) OR
  -- Allow any user (authenticated or guest) to insert order items 
  -- as long as the order_id references a valid order
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE id = order_id
  )
);