-- Fix order_items RLS policy to allow proper order creation
DROP POLICY IF EXISTS "Enable order item insertion during order creation" ON public.order_items;

-- Create a more permissive INSERT policy for order_items
CREATE POLICY "Allow order item creation for valid orders" ON public.order_items
FOR INSERT 
WITH CHECK (
  -- Admins can always insert
  has_role(auth.uid(), 'admin'::app_role) 
  OR 
  -- Anyone can insert if the order exists (for both authenticated and guest users)
  EXISTS (
    SELECT 1 
    FROM public.orders 
    WHERE id = order_items.order_id
  )
);