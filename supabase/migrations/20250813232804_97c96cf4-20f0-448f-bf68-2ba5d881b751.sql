-- Allow public users to create orders during checkout
CREATE POLICY "Allow public to create orders" ON public.orders
FOR INSERT 
TO public
WITH CHECK (true);

-- Allow public users to create customers during checkout
CREATE POLICY "Allow public to create customers" ON public.customers
FOR INSERT
TO public  
WITH CHECK (true);

-- Allow public users to create order items during checkout
CREATE POLICY "Allow public to create order_items" ON public.order_items
FOR INSERT
TO public
WITH CHECK (true);