
-- Create categories table
CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create collections table
CREATE TABLE public.collections (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create product_categories junction table
CREATE TABLE public.product_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  category_id uuid REFERENCES public.categories(id) ON DELETE CASCADE,
  UNIQUE(product_id, category_id)
);

-- Create product_collections junction table
CREATE TABLE public.product_collections (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  collection_id uuid REFERENCES public.collections(id) ON DELETE CASCADE,
  UNIQUE(product_id, collection_id)
);

-- Create orders table
CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_email text NOT NULL,
  customer_name text,
  customer_phone text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'fulfilled', 'cancelled', 'refunded')),
  total_amount numeric(10,2) NOT NULL,
  shipping_address jsonb,
  billing_address jsonb,
  uploaded_images text[],
  personalization_data jsonb,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  fulfilled_at timestamp with time zone,
  payment_id text,
  tracking_number text
);

-- Create order_items table
CREATE TABLE public.order_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id),
  quantity integer NOT NULL DEFAULT 1,
  price numeric(10,2) NOT NULL,
  personalization_data jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Create customers table
CREATE TABLE public.customers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  name text,
  phone text,
  total_orders integer DEFAULT 0,
  total_spent numeric(10,2) DEFAULT 0,
  newsletter_subscribed boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create blog_posts table
CREATE TABLE public.blog_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text,
  excerpt text,
  featured_image text,
  meta_title text,
  meta_description text,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
  publish_date timestamp with time zone,
  author_id uuid REFERENCES public.profiles(id),
  view_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create blog_categories table
CREATE TABLE public.blog_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  created_at timestamp with time zone DEFAULT now()
);

-- Create blog_post_categories junction table
CREATE TABLE public.blog_post_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  category_id uuid REFERENCES public.blog_categories(id) ON DELETE CASCADE,
  UNIQUE(post_id, category_id)
);

-- Create promo_codes table
CREATE TABLE public.promo_codes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code text NOT NULL UNIQUE,
  type text NOT NULL CHECK (type IN ('percentage', 'fixed_amount')),
  value numeric(10,2) NOT NULL,
  minimum_order numeric(10,2),
  usage_limit integer,
  used_count integer DEFAULT 0,
  starts_at timestamp with time zone,
  expires_at timestamp with time zone,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- Add new columns to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sku text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS inventory_quantity integer DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS shipping_weight numeric(5,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS shipping_time_days integer;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS tags text[];
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS personalization_options jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_bestseller boolean DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS backorder_allowed boolean DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0;

-- Enable RLS on all new tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin access
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

CREATE POLICY "Admins can manage collections" ON public.collections FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

CREATE POLICY "Admins can manage product_categories" ON public.product_categories FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

CREATE POLICY "Admins can manage product_collections" ON public.product_collections FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

CREATE POLICY "Admins can manage orders" ON public.orders FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

CREATE POLICY "Admins can manage order_items" ON public.order_items FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

CREATE POLICY "Admins can manage customers" ON public.customers FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

CREATE POLICY "Admins can manage blog_posts" ON public.blog_posts FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

CREATE POLICY "Admins can manage blog_categories" ON public.blog_categories FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

CREATE POLICY "Admins can manage blog_post_categories" ON public.blog_post_categories FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

CREATE POLICY "Admins can manage promo_codes" ON public.promo_codes FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

-- Public read access for categories and collections
CREATE POLICY "Public can view active categories" ON public.categories FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "Public can view active collections" ON public.collections FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "Public can view product_categories" ON public.product_categories FOR SELECT TO anon USING (true);
CREATE POLICY "Public can view product_collections" ON public.product_collections FOR SELECT TO anon USING (true);
CREATE POLICY "Public can view published blog_posts" ON public.blog_posts FOR SELECT TO anon USING (status = 'published' AND (publish_date IS NULL OR publish_date <= now()));
CREATE POLICY "Public can view blog_categories" ON public.blog_categories FOR SELECT TO anon USING (true);
CREATE POLICY "Public can view blog_post_categories" ON public.blog_post_categories FOR SELECT TO anon USING (true);

-- Insert some default categories
INSERT INTO public.categories (name, slug, description) VALUES
('Ornaments', 'ornaments', 'Keepsake ornaments for special occasions'),
('Necklaces', 'necklaces', 'Memory jewelry and photo pendants'),
('Slate', 'slate', 'Slate keepsakes and memorial pieces'),
('Snow Globes', 'snow-globes', 'Custom snow globes with photos'),
('Wood Sublimation', 'wood-sublimation', 'Wood art and sublimation pieces')
ON CONFLICT (slug) DO NOTHING;

-- Insert some default blog categories
INSERT INTO public.blog_categories (name, slug, description) VALUES
('Gift Guides', 'gift-guides', 'Curated gift ideas and recommendations'),
('Craft Show Stories', 'craft-show-stories', 'Behind the scenes at craft shows'),
('Behind the Scenes', 'behind-the-scenes', 'The making process and stories'),
('Customer Features', 'customer-features', 'Customer stories and testimonials')
ON CONFLICT (slug) DO NOTHING;
