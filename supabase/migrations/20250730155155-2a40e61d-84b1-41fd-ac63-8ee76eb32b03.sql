
-- Add image_url column to categories table
ALTER TABLE categories ADD COLUMN image_url TEXT;

-- Insert the default categories with their current hardcoded images
INSERT INTO categories (name, slug, description, image_url, sort_order, is_active) VALUES
  ('Keepsake Ornaments', 'ornaments', 'Transform memories into beautiful ornaments', 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400', 1, true),
  ('Memory Jewelry', 'necklaces', 'Wear your loved ones close to your heart', 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400', 2, true),
  ('Slate Keepsakes', 'slate', 'Elegant slate pieces with lasting memories', 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400', 3, true),
  ('Snow Globes', 'snow-globes', 'Magical snow globes with your special moments', 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400', 4, true),
  ('Wood Art', 'wood-sublimation', 'Rustic wood pieces with personalized touches', 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400', 5, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;
