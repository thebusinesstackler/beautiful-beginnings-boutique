
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, Link, Image as ImageIcon, Shield } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';

interface FeaturedProductImageUploaderProps {
  currentImage: string;
  onImageChange: (imageUrl: string) => void;
}

const FeaturedProductImageUploader: React.FC<FeaturedProductImageUploaderProps> = ({
  currentImage,
  onImageChange,
}) => {
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { isAdmin } = useAuth();

  const handleImageUpload = async (file: File) => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only administrators can upload featured product images",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `featured-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `featured-products/${fileName}`;

      console.log('Uploading featured product image:', fileName);

      // Try to upload to product-images bucket with enhanced security
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      console.log('Featured product image uploaded successfully:', data.publicUrl);
      
      onImageChange(data.publicUrl);
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading featured product image:', error);
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
    const file = event.target.files?.[0];
    if (!file) return;

    // Enhanced validation matching bucket restrictions
    if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
      toast({
        title: "Error",
        description: "Please select a JPEG, PNG, or WebP image file",
        variant: "destructive",
      });
      return;
    }

    // Check file size (10MB limit matching bucket)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image must be smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    await handleImageUpload(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUrlAdd = () => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only administrators can add featured product images",
        variant: "destructive",
      });
      return;
    }

    if (imageUrl.trim()) {
      console.log('Adding featured product image URL:', imageUrl.trim());
      onImageChange(imageUrl.trim());
      setImageUrl('');
      toast({
        title: "Success",
        description: "Image URL added successfully",
      });
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only administrators can upload featured product images",
        variant: "destructive",
      });
      return;
    }

    const file = event.dataTransfer.files[0];
    
    if (!file) return;
    
    if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
      toast({
        title: "Error",
        description: "Please drop a JPEG, PNG, or WebP image file",
        variant: "destructive",
      });
      return;
    }

    if (file.size <= 10 * 1024 * 1024) {
      await handleImageUpload(file);
    } else {
      toast({
        title: "Error",
        description: "Image must be smaller than 10MB",
        variant: "destructive",
      });
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
          <strong>Access Restricted:</strong> Only administrators can upload featured product images.
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
          <strong>Enhanced Security:</strong> Files are validated with bucket-level restrictions. 
          Only JPEG, PNG, and WebP images up to 10MB are accepted.
        </AlertDescription>
      </Alert>

      {/* Current Image Preview */}
      {currentImage && (
        <div className="mb-4">
          <Label className="text-sm font-medium text-charcoal mb-2 block">Current Image</Label>
          <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
            <img
              src={currentImage}
              alt="Current featured product"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* File Upload */}
      <div>
        <Label className="text-sm font-medium text-charcoal mb-2 block">Upload New Image</Label>
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-sage transition-colors cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="text-gray-600 mb-2">
            {uploading ? 'Uploading...' : 'Drag and drop an image here, or click to select'}
          </p>
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            size="sm"
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Select Image'}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
          <p className="text-xs text-gray-500 mt-2">Max 10MB. JPG, PNG, WebP supported.</p>
        </div>
      </div>

      {/* URL Input */}
      <div>
        <Label className="text-sm font-medium text-charcoal mb-2 block">Or add image URL</Label>
        <div className="flex space-x-2">
          <Input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1"
          />
          <Button
            type="button"
            onClick={handleUrlAdd}
            disabled={!imageUrl.trim()}
            variant="outline"
            size="sm"
          >
            <Link className="h-4 w-4 mr-2" />
            Add URL
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProductImageUploader;
