
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { validateInput } from '@/utils/inputValidation';
import { sanitizeInput } from '@/utils/sanitization';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB - matches bucket limit
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const useSecurePhotoUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    // File size validation (matches bucket limit)
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 10MB",
        variant: "destructive",
      });
      return false;
    }

    // MIME type validation (matches bucket restrictions)
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please select a JPEG, PNG, or WebP image",
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

  const uploadPhoto = async (file: File, fileName?: string): Promise<string | null> => {
    if (!validateFile(file)) {
      return null;
    }

    setUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const sanitizedFileName = fileName ? sanitizeInput(fileName) : `${Date.now()}_${Math.random().toString(36).substring(2)}`;
      const uniqueFileName = `${sanitizedFileName}.${fileExt}`;
      const filePath = `customer-photos/${uniqueFileName}`;

      console.log('Uploading file to secure bucket:', filePath);

      const { data, error } = await supabase.storage
        .from('customer-uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        toast({
          title: "Upload Failed",
          description: error.message,
          variant: "destructive",
        });
        return null;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('customer-uploads')
        .getPublicUrl(filePath);

      console.log('File uploaded successfully:', publicUrl);
      
      toast({
        title: "Upload Successful",
        description: "Your photo has been uploaded securely",
      });

      return publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "An error occurred while uploading your photo",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deletePhoto = async (url: string): Promise<boolean> => {
    try {
      // Validate and sanitize URL
      if (!validateInput(url, 'url')) {
        console.error('Invalid URL format for deletion');
        return false;
      }

      // Extract file path from URL
      const urlParts = url.split('/customer-uploads/');
      if (urlParts.length !== 2) {
        console.error('Invalid URL format for deletion');
        return false;
      }

      const filePath = urlParts[1];

      const { error } = await supabase.storage
        .from('customer-uploads')
        .remove([filePath]);

      if (error) {
        console.error('Delete error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Delete error:', error);
      return false;
    }
  };

  return {
    uploadPhoto,
    deletePhoto,
    uploading,
    validateFile
  };
};
