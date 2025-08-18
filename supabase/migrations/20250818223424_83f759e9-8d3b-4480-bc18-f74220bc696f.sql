-- Create logos storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('logos', 'logos', true);

-- Create RLS policies for logos bucket
CREATE POLICY "Admins can upload logos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'logos' AND 
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update logos" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'logos' AND 
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete logos" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'logos' AND 
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Public can view logos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'logos');