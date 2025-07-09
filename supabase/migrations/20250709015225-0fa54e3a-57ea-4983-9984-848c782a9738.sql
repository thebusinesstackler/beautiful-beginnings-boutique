
-- Create app_role enum for proper role-based access
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table for proper role management
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create audit log table for admin actions
CREATE TABLE public.admin_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    table_name TEXT,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Create customer_uploads bucket for secure file storage
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'customer-uploads',
    'customer-uploads',
    true,
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
);

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
    ON public.user_roles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
    ON public.user_roles FOR ALL
    USING (public.has_role(auth.uid(), 'admin'));

-- RLS policies for audit log
CREATE POLICY "Admins can view audit logs"
    ON public.admin_audit_log FOR SELECT
    USING (public.has_role(auth.uid(), 'admin'));

-- Update existing RLS policies to use role-based system
DROP POLICY IF EXISTS "Admins can manage orders" ON public.orders;
CREATE POLICY "Admins can manage orders"
    ON public.orders FOR ALL
    USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can manage customers" ON public.customers;
CREATE POLICY "Admins can manage customers"
    ON public.customers FOR ALL
    USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can manage settings" ON public.settings;
CREATE POLICY "Admins can manage settings"
    ON public.settings FOR ALL
    USING (public.has_role(auth.uid(), 'admin'));

-- Storage policies for customer uploads
CREATE POLICY "Anyone can upload customer images"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'customer-uploads');

CREATE POLICY "Anyone can view customer images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'customer-uploads');

CREATE POLICY "Admins can manage customer uploads"
    ON storage.objects FOR ALL
    USING (bucket_id = 'customer-uploads' AND public.has_role(auth.uid(), 'admin'));

-- Remove sensitive Square credentials from settings table (will be moved to secrets)
DELETE FROM public.settings WHERE key IN ('square_access_token', 'square_app_id');

-- Add initial admin user (replace with actual admin email)
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'thebusinesstackler@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
