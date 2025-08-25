-- Update admin status for kimberlycompton@yahoo.com
UPDATE public.profiles 
SET is_admin = true, updated_at = now()
WHERE id = '1d6533c5-066e-48f6-815e-2e2cb6adb966' AND email = 'kimberlycompton@yahoo.com';