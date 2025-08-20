-- Add RLS policies for order_items table to allow admins to view order details

-- Enable RLS on order_items table
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Allow admins to view all order items
CREATE POLICY "Admins can view all order items" 
ON public.order_items 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_admin = true
  )
);

-- Allow admins to manage order items (for future use)
CREATE POLICY "Admins can manage order items" 
ON public.order_items 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_admin = true
  )
);

-- Allow order creation process to insert order items
CREATE POLICY "Allow order creation to insert items" 
ON public.order_items 
FOR INSERT 
WITH CHECK (true);

-- Also add RLS policy for orders table to allow admins to view all orders
CREATE POLICY "Admins can view all orders" 
ON public.orders 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_admin = true
  )
);

-- Allow admins to manage orders
CREATE POLICY "Admins can manage orders" 
ON public.orders 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_admin = true
  )
);

-- Allow order creation process to insert orders (for both authenticated and anonymous users)
CREATE POLICY "Allow order creation" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);