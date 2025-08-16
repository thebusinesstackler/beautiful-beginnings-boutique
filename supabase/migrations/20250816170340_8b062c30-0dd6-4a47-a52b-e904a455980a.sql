-- Phase 1: Secure Customer Data Architecture
-- Fix security vulnerability by removing guest customer creation and conflicting policies

-- Step 1: Drop the conflicting INSERT policies from previous migration
DROP POLICY IF EXISTS "Allow customer creation for authenticated users and order process" ON public.customers;
DROP POLICY IF EXISTS "Prevent unauthorized customer creation" ON public.customers;

-- Step 2: Modify the handle_order_customer trigger to REMOVE guest customer creation
-- This trigger will now ONLY handle authenticated users, no more guest customer records
CREATE OR REPLACE FUNCTION public.handle_order_customer()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    existing_customer_id UUID;
BEGIN
    -- ONLY handle authenticated users - NO guest customer creation
    IF auth.uid() IS NOT NULL THEN
        NEW.customer_id = auth.uid();
        
        -- Check if customer profile exists by auth user id
        SELECT id INTO existing_customer_id 
        FROM public.customers 
        WHERE id = auth.uid();
        
        -- Create customer profile if it doesn't exist (authenticated users only)
        IF existing_customer_id IS NULL THEN
            INSERT INTO public.customers (id, email, name, phone, newsletter_subscribed)
            VALUES (
                auth.uid(),
                NEW.customer_email,
                NEW.customer_name,
                NEW.customer_phone,
                false
            );
        ELSE
            -- Update existing customer info
            UPDATE public.customers 
            SET 
                email = COALESCE(NEW.customer_email, email),
                name = COALESCE(NEW.customer_name, name),
                phone = COALESCE(NEW.customer_phone, phone),
                updated_at = now()
            WHERE id = auth.uid();
        END IF;
    ELSE
        -- For guest users, customer_id remains NULL and NO customer record is created
        -- Guest data stays only in the orders table (customer_email, customer_name, customer_phone)
        NEW.customer_id = NULL;
    END IF;
    
    RETURN NEW;
END;
$function$;

-- Step 3: Create ONE secure INSERT policy for customers table
-- Only allows authenticated users and admins, NO guest customer creation
CREATE POLICY "Authenticated users and admins can create customers" 
ON public.customers 
FOR INSERT 
WITH CHECK (
  -- Authenticated user creating their own record
  (auth.uid() IS NOT NULL AND id = auth.uid())
  OR
  -- Admin creating any record
  has_role(auth.uid(), 'admin'::app_role)
);