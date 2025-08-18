-- Update the handle_order_customer function to create customer records for guest users too
CREATE OR REPLACE FUNCTION public.handle_order_customer()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    existing_customer_id UUID;
    guest_customer_id UUID;
BEGIN
    -- Handle authenticated users
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
        -- Handle guest users - create customer record using email as unique identifier
        IF NEW.customer_email IS NOT NULL THEN
            -- Check if guest customer already exists by email
            SELECT id INTO existing_customer_id 
            FROM public.customers 
            WHERE email = NEW.customer_email;
            
            IF existing_customer_id IS NOT NULL THEN
                -- Update existing guest customer
                NEW.customer_id = existing_customer_id;
                UPDATE public.customers 
                SET 
                    name = COALESCE(NEW.customer_name, name),
                    phone = COALESCE(NEW.customer_phone, phone),
                    updated_at = now()
                WHERE id = existing_customer_id;
            ELSE
                -- Create new guest customer record
                INSERT INTO public.customers (id, email, name, phone, newsletter_subscribed)
                VALUES (
                    gen_random_uuid(),
                    NEW.customer_email,
                    NEW.customer_name,
                    NEW.customer_phone,
                    false
                ) 
                RETURNING id INTO guest_customer_id;
                
                NEW.customer_id = guest_customer_id;
            END IF;
        ELSE
            -- If no email provided for guest, customer_id remains NULL
            NEW.customer_id = NULL;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;