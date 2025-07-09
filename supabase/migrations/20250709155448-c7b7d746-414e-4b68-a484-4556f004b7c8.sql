-- Fix search path security vulnerability in has_role function
-- This is critical since it's a SECURITY DEFINER function
ALTER FUNCTION public.has_role(_user_id uuid, _role app_role) 
SET search_path = '';