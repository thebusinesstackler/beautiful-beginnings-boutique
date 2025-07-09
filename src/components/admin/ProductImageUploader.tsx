
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Plus, AlertTriangle, Shield } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';

interface ProductImageUploaderProps {
  onImageUploaded: (imageUrl: string) => void;
  uploading: boolean;
  setUploading: (uploading: boolean) => void;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ProductImageUploader: React.FC<ProductImageUploaderProps> = ({
  onImageUploaded,
  uploading,
  setUploading,
}) => {
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { isAdmin } = useAuth();

  const validateFile = (file: File): boolean => {
    // Check file size (now matches bucket limit)
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File Too Large",
        description: "File size must be less than 10MB",
        variant: "destructive",
      });
      return false;
    }

    // Check MIME type (matches bucket restrictions)
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Only JPEG, PNG, and WebP images are allowed",
        variant: "destructive",
      });
      return false;
    }

    // Check file extension matches MIME type
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

    // Security check for file name
    if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
      toast({
        title: "Invalid File Name",
        description: "File name contains invalid characters",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleImageUpload = async (file: File) => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only administrators can upload product images",
        variant: "destructive",
      });
      return;
    }

    if (!validateFile(file)) {
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      console.log('Uploading file:', fileName);

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      console.log('Image uploaded successfully:', data.publicUrl);
      
      onImageUploaded(data.publicUrl);
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      await handleImageUpload(file);
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUrlAdd = () => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only administrators can add product images",
        variant: "destructive",
      });
      return;
    }

    if (imageUrl.trim()) {
      // Basic URL validation
      try {
        new URL(imageUrl.trim());
        console.log('Adding image URL:', imageUrl.trim());
        onImageUploaded(imageUrl.trim());
        setImageUrl('');
        toast({
          title: "Success",
          description: "Image URL added successfully",
        });
      } catch {
        toast({
          title: "Invalid URL",
          description: "Please enter a valid image URL",
          variant: "destructive",
        });
      }
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only administrators can upload product images",
        variant: "destructive",
      });
      return;
    }

    const files = Array.from(event.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      toast({
        title: "Error",
        description: "Please drop image files only",
        variant: "destructive",
      });
      return;
    }

    for (const file of imageFiles) {
      await handleImageUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  if (!isAdmin) {
    return (
      <Alert className="bg-red-50 border-red-200">
        <Shield className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>Access Restricted:</strong> Only administrators can upload product images.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {/* Enhanced Security Notice */}
      <Alert className="bg-blue-50 border-blue-200">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Enhanced Security:</strong> Files are validated for type, size, and security. 
          Only JPEG, PNG, and WebP images up to 10MB are accepted. Bucket-level restrictions are enforced.
        </AlertDescription>
      </Alert>

      {/* File Upload */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-sage transition-colors"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
        <p className="text-gray-600 mb-4">Drag and drop images here, or click to select</p>
        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="mb-2"
        >
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? 'Uploading...' : 'Select Images'}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <p className="text-xs text-gray-500">Max 10MB per image. JPG, PNG, WebP supported.</p>
      </div>

      {/* URL Input */}
      <div className="flex space-x-2">
        <div className="flex-1">
          <Label htmlFor="image-url">Or add image URL</Label>
          <Input
            id="image-url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <Button
          type="button"
          onClick={handleUrlAdd}
          disabled={!imageUrl.trim()}
          className="mt-6 bg-sage hover:bg-sage/90"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ProductImageUploader;
