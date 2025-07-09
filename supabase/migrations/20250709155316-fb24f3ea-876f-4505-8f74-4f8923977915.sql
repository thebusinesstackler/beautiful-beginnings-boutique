-- Fix search path security vulnerability in update_customer_stats function
ALTER FUNCTION public.update_customer_stats() 
SET search_path = '';

-- Also fix the handle_order_customer function for the same security issue
ALTER FUNCTION public.handle_order_customer() 
SET search_path = '';

-- Update handle_new_user function as well for consistency
ALTER FUNCTION public.handle_new_user() 
SET search_path = '';