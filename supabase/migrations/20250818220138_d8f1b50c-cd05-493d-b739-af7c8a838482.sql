-- Allow guest checkout by making customer_id nullable in orders table
ALTER TABLE public.orders 
ALTER COLUMN customer_id DROP NOT NULL;