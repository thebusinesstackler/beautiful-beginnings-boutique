
-- Enable personalization options for existing Wood Sublimation products
UPDATE products 
SET personalization_options = '{"photo_upload": true, "text_customization": true, "wood_type_options": ["Pine", "Oak", "Cedar"], "size_options": ["8x10", "11x14", "16x20"]}'::jsonb
WHERE category = 'Wood Sublimation' AND personalization_options IS NULL;

-- Also ensure they are active and have inventory
UPDATE products 
SET is_active = true, inventory_quantity = COALESCE(inventory_quantity, 25)
WHERE category = 'Wood Sublimation';
