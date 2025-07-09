
-- Add a customer_id column to the orders table to link orders to customers
ALTER TABLE public.orders ADD COLUMN customer_id UUID REFERENCES public.customers(id);

-- Create an index for better performance when querying orders by customer
CREATE INDEX idx_orders_customer_id ON public.orders(customer_id);

-- Create a function to handle creating/updating customer records when orders are placed
CREATE OR REPLACE FUNCTION public.handle_order_customer()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Create trigger to automatically handle customer creation/updates when orders are inserted
CREATE TRIGGER trigger_handle_order_customer
    BEFORE INSERT ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_order_customer();

-- Create a function to update customer statistics
CREATE OR REPLACE FUNCTION public.update_customer_stats()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Create trigger to update customer stats when orders are updated
CREATE TRIGGER trigger_update_customer_stats
    AFTER UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.update_customer_stats();
