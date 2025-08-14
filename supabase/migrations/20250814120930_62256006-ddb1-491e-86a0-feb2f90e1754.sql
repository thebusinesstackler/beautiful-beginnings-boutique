-- Enable leaked password protection for enhanced security
-- This prevents users from using commonly leaked passwords
UPDATE auth.config 
SET leaked_password_protection = true;