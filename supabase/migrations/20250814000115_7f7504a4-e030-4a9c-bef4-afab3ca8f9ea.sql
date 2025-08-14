-- Update default square_environment to production
UPDATE public.settings 
SET value = 'production' 
WHERE key = 'square_environment' AND value = 'sandbox';