
-- Insert Winter Botanical Snow Globe
INSERT INTO products (
  name,
  description,
  price,
  category,
  image_url,
  is_active,
  is_featured,
  is_bestseller,
  featured_order,
  inventory_quantity,
  seo_title,
  seo_description
) VALUES (
  'Winter Botanical Snow Globe',
  'Transform your winter memories into a magical snow globe that captures the beauty of the season. Each gentle shake releases a flurry of memories, creating a mesmerizing keepsake that sparkles with love and lasting beauty.',
  20.00,
  'Snow Globes',
  'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400',
  true,
  true,
  false,
  1,
  50,
  'Winter Botanical Snow Globe - Handcrafted Memory Keepsake',
  'Transform your winter memories into a magical snow globe that captures the beauty of the season. Handcrafted with love for lasting memories.'
);

-- Insert Custom Photo Snow Globe
INSERT INTO products (
  name,
  description,
  price,
  category,
  image_url,
  is_active,
  is_featured,
  is_bestseller,
  featured_order,
  inventory_quantity,
  seo_title,
  seo_description,
  personalization_options
) VALUES (
  'Custom Photo Snow Globe',
  'Your most precious moments preserved in a enchanting snow globe that brings joy with every shake. Transform your cherished memories into magical snow globes that capture hearts and create smiles.',
  25.00,
  'Snow Globes',
  'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400',
  true,
  true,
  true,
  2,
  30,
  'Custom Photo Snow Globe - Personalized Memory Keepsake',
  'Create personalized snow globes with your favorite photos. Premium quality with professional photo processing and beautiful snow effect.',
  '{"photo_upload": true, "custom_text": false, "size_options": ["standard"], "processing_time": "3-5 business days"}'
);
