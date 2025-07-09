
INSERT INTO settings (key, value) 
VALUES ('square_access_token', 'sq0idp-NvV_cerBTAVDgMfzHyXsoA')
ON CONFLICT (key) 
DO UPDATE SET value = EXCLUDED.value;
