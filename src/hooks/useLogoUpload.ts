import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { validateInput } from '@/utils/inputValidation';
import { sanitizeInput } from '@/utils/sanitization';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB for logos
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const useLogoUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    // File size validation
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File Too Large",
        description: "Please select a logo image smaller than 5MB",
        variant: "destructive",
      });
      return false;
    }

    // MIME type validation
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please select a JPEG, PNG, or WebP image for your logo",
        variant: "destructive",
      });
      return false;
    }

    // File extension validation
    const extension = file.name.toLowerCase().split('.').pop();
    const expectedExtensions: Record<string, string[]> = {
      'image/jpeg': ['jpg', 'jpeg'],
      'image/png': ['png'],
      'image/webp': ['webp']
    };

    const validExtensions = expectedExtensions[file.type] || [];
    if (!extension || !validExtensions.includes(extension)) {
      toast({
        title: "File Extension Mismatch",
        description: "File extension does not match the file type",
        variant: "destructive",
      });
      return false;
    }

    // Security validation for filename
    if (!validateInput(file.name, 'filename')) {
      toast({
        title: "Invalid File Name",
        description: "File name contains invalid characters",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const uploadLogo = async (file: File): Promise<string | null> => {
    if (!validateFile(file)) {
      return null;
    }

    setUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const sanitizedFileName = sanitizeInput(`logo_${Date.now()}`);
      const uniqueFileName = `${sanitizedFileName}.${fileExt}`;
      const filePath = uniqueFileName;

      console.log('Uploading logo to Supabase storage:', filePath);

      const { data, error } = await supabase.storage
        .from('logos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Logo upload error:', error);
        toast({
          title: "Upload Failed",
          description: error.message,
          variant: "destructive",
        });
        return null;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(filePath);

      console.log('Logo uploaded successfully:', publicUrl);
      
      toast({
        title: "Logo Uploaded",
        description: "Your logo has been uploaded successfully",
      });

      return publicUrl;
    } catch (error) {
      console.error('Logo upload error:', error);
      toast({
        title: "Upload Failed",
        description: "An error occurred while uploading your logo",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteLogo = async (url: string): Promise<boolean> => {
    try {
      // Validate and sanitize URL
      if (!validateInput(url, 'url')) {
        console.error('Invalid URL format for deletion');
        return false;
      }

      // Extract file path from URL
      const urlParts = url.split('/logos/');
      if (urlParts.length !== 2) {
        console.error('Invalid URL format for deletion');
        return false;
      }

      const filePath = urlParts[1];

      const { error } = await supabase.storage
        .from('logos')
        .remove([filePath]);

      if (error) {
        console.error('Logo delete error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Logo delete error:', error);
      return false;
    }
  };

  return {
    uploadLogo,
    deleteLogo,
    uploading,
    validateFile
  };
};