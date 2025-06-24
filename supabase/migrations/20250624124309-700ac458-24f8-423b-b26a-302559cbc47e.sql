
-- Add additional columns to products table for better homepage control
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS gallery_images TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS featured_order INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS featured_until TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS seo_title TEXT,
ADD COLUMN IF NOT EXISTS seo_description TEXT;

-- Create index for better performance on featured products queries
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured, featured_order) WHERE is_featured = true;

-- Update existing featured products to have sequential featured_order (using a different approach)
WITH featured_products AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as new_order
  FROM public.products 
  WHERE is_featured = true
)
UPDATE public.products 
SET featured_order = featured_products.new_order
FROM featured_products
WHERE public.products.id = featured_products.id;
