-- Fix RLS policies for guest checkout
-- First, drop the existing restrictive INSERT policy for orders
DROP POLICY IF EXISTS "Allow order creation for all users" ON orders;

-- Create a more permissive INSERT policy for orders that allows both guest and authenticated users
CREATE POLICY "Allow guest and authenticated order creation" 
ON orders 
FOR INSERT 
WITH CHECK (
  -- Allow guests (no auth) with customer_id = NULL
  (auth.uid() IS NULL AND customer_id IS NULL) OR
  -- Allow authenticated users with customer_id = auth.uid()
  (auth.uid() IS NOT NULL AND customer_id = auth.uid()) OR
  -- Allow authenticated users to create guest orders too
  (auth.uid() IS NOT NULL AND customer_id IS NULL)
);

-- Update order_items policy to be more permissive for order creation
DROP POLICY IF EXISTS "Allow public to create order_items" ON order_items;

CREATE POLICY "Allow order_items creation during checkout" 
ON order_items 
FOR INSERT 
WITH CHECK (true);  -- Allow any order item creation since orders are already protected