-- Remove ALL RLS policies from orders and order_items tables

-- Drop all existing policies on orders table
DROP POLICY IF EXISTS "Allow guest and authenticated order creation" ON orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Admins can delete orders" ON orders;
DROP POLICY IF EXISTS "Admins can manage all orders" ON orders;

-- Drop all existing policies on order_items table
DROP POLICY IF EXISTS "Allow order_items creation during checkout" ON order_items;
DROP POLICY IF EXISTS "Admins can manage order_items" ON order_items;

-- Disable RLS entirely on both tables
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;