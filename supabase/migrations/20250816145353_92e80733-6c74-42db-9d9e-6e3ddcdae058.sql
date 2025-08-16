-- Fix orders table security by implementing strict customer_id-based RLS

-- First, drop all existing problematic email-based policies
DROP POLICY IF EXISTS "Customers can update their own orders" ON public.orders;
DROP POLICY IF EXISTS "Allow validated public order creation" ON public.orders;
DROP POLICY IF EXISTS "Customers can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Only admins can delete orders" ON public.orders;

-- Make customer_id not nullable since it's required for security
ALTER TABLE public.orders ALTER COLUMN customer_id SET NOT NULL;

-- Update the trigger to set customer_id to auth.uid() for authenticated users
CREATE OR REPLACE FUNCTION public.handle_order_customer()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
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
        -- For unauthenticated users (shouldn't happen with new policies)
        RAISE EXCEPTION 'Orders can only be created by authenticated users';
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create strict RLS policies based on customer_id and auth.uid()

-- Customers can only view their own orders
CREATE POLICY "Users can view their own orders"
ON public.orders
FOR SELECT
TO authenticated
USING (customer_id = auth.uid());

-- Customers can only create orders for themselves
CREATE POLICY "Users can create their own orders"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (
    customer_id = auth.uid()
    AND customer_email IS NOT NULL 
    AND customer_email != ''
    AND total_amount > 0
    AND status = 'pending'
    AND payment_id IS NULL
);

-- Customers can only update their own orders
CREATE POLICY "Users can update their own orders"
ON public.orders
FOR UPDATE
TO authenticated
USING (customer_id = auth.uid())
WITH CHECK (customer_id = auth.uid());

-- Only admins can delete orders
CREATE POLICY "Admins can delete orders"
ON public.orders
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can manage all orders
CREATE POLICY "Admins can manage all orders"
ON public.orders
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));