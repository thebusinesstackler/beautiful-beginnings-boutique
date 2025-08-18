-- Add card details and payment method columns to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS card_last_4 TEXT,
ADD COLUMN IF NOT EXISTS card_brand TEXT,
ADD COLUMN IF NOT EXISTS card_exp_month INTEGER,
ADD COLUMN IF NOT EXISTS card_exp_year INTEGER,
ADD COLUMN IF NOT EXISTS payment_method TEXT;