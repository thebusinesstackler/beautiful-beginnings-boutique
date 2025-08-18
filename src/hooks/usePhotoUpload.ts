
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const usePhotoUpload = () => {
  const uploadPhoto = async (file: File, customerId?: string): Promise<string | null> => {
    try {
      console.log('Starting photo upload...', { fileName: file.name, size: file.size, customerId });

      // Generate a unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExtension = file.name.split('.').pop();
      const fileName = `${timestamp}-${randomString}.${fileExtension}`;
      const filePath = `customer-uploads/${fileName}`;

      console.log('Uploading file to Supabase storage:', filePath);

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('customer-uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        throw error;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('customer-uploads')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;
      console.log('File uploaded successfully, public URL:', publicUrl);

      // If we have a customer ID, we could save this to a customer_uploads table
      // For now, just return the URL
      return publicUrl;

    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  return { uploadPhoto };
};
