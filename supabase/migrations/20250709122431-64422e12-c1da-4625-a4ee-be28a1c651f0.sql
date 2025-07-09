
-- Fix Function Search Path Mutable issues by setting search_path properly
-- Update handle_order_customer function
CREATE OR REPLACE FUNCTION public.handle_order_customer()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    existing_customer_id UUID;
BEGIN
    -- Check if customer already exists by email
    SELECT id INTO existing_customer_id 
    FROM public.customers 
    WHERE email = NEW.customer_email;
    
    -- If customer doesn't exist, create them
    IF existing_customer_id IS NULL THEN
        INSERT INTO public.customers (email, name, phone, newsletter_subscribed)
        VALUES (
            NEW.customer_email,
            NEW.customer_name,
            NEW.customer_phone,
            false
        )
        RETURNING id INTO existing_customer_id;
    ELSE
        -- Update existing customer info if provided
        UPDATE public.customers 
        SET 
            name = COALESCE(NEW.customer_name, name),
            phone = COALESCE(NEW.customer_phone, phone),
            updated_at = now()
        WHERE id = existing_customer_id;
    END IF;
    
    -- Link the order to the customer
    NEW.customer_id = existing_customer_id;
    
    RETURN NEW;
END;
$$;

-- Update update_customer_stats function
CREATE OR REPLACE FUNCTION public.update_customer_stats()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Update customer statistics when order status changes
    IF TG_OP = 'UPDATE' AND OLD.status != NEW.status AND NEW.status = 'fulfilled' THEN
        UPDATE public.customers
        SET 
            total_orders = (
                SELECT COUNT(*) 
                FROM public.orders 
                WHERE customer_id = NEW.customer_id AND status = 'fulfilled'
            ),
            total_spent = (
                SELECT COALESCE(SUM(total_amount), 0) 
                FROM public.orders 
                WHERE customer_id = NEW.customer_id AND status = 'fulfilled'
            ),
            updated_at = now()
        WHERE id = NEW.customer_id;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Update has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Update handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, is_admin)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.email = 'thebusinesstackler@gmail.com'
  );
  RETURN NEW;
END;
$$;

-- Enable leaked password protection for Auth
ALTER SYSTEM SET auth.password_breach_protection = 'on';
SELECT pg_reload_conf();
