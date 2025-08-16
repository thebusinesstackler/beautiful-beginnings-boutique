-- Phase 1: Enable Guest Checkout - Update Orders RLS Policies

-- Drop existing restrictive INSERT policy for orders
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;

-- Create new guest-friendly INSERT policy
CREATE POLICY "Allow order creation for authenticated and guest users" 
ON public.orders 
FOR INSERT 
WITH CHECK (
  -- For authenticated users: customer_id must match auth.uid()
  (auth.uid() IS NOT NULL AND customer_id = auth.uid()) OR
  -- For guest users: customer_id can be NULL
  (auth.uid() IS NULL AND customer_id IS NULL)
);

-- Update the handle_order_customer function to support guest orders
CREATE OR REPLACE FUNCTION public.handle_order_customer()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
    existing_customer_id UUID;
BEGIN
    -- For authenticated users, use their auth.uid() as customer_id
    IF auth.uid() IS NOT NULL THEN
        NEW.customer_id = auth.uid();
        
        -- Check if customer profile exists by auth user id
        SELECT id INTO existing_customer_id 
        FROM public.customers 
        WHERE id = auth.uid();
        
        -- Create customer profile if it doesn't exist
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
        -- For guest users, allow customer_id to remain NULL
        -- Still create a customer record for order tracking, but not linked to auth
        INSERT INTO public.customers (email, name, phone, newsletter_subscribed)
        VALUES (
            NEW.customer_email,
            NEW.customer_name,
            NEW.customer_phone,
            false
        );
    END IF;
    
    RETURN NEW;
END;
$$;

-- Phase 2: Add public access to non-sensitive settings
CREATE POLICY "Public can view non-sensitive settings" 
ON public.settings 
FOR SELECT 
USING (
  key NOT IN (
    'square_access_token', 
    'square_app_secret', 
    'square_application_secret',
    'square_webhook_signature_key'
  )
);

-- Phase 3: Update customers table to allow guest customer creation
DROP POLICY IF EXISTS "Allow public to create customers" ON public.customers;

CREATE POLICY "Allow customer creation for orders" 
ON public.customers 
FOR INSERT 
WITH CHECK (true);