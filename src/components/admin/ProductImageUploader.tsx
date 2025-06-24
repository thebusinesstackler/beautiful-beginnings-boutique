
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Plus } from 'lucide-react';

interface ProductImageUploaderProps {
  onImageUploaded: (imageUrl: string) => void;
  uploading: boolean;
  setUploading: (uploading: boolean) => void;
}

const ProductImageUploader: React.FC<ProductImageUploaderProps> = ({
  onImageUploaded,
  uploading,
  setUploading,
}) => {
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) {
        // If bucket doesn't exist, create it first
        if (uploadError.message.includes('Bucket not found')) {
          await supabase.storage.createBucket('product-images', { public: true });
          // Retry upload
          const { error: retryError } = await supabase.storage
            .from('product-images')
            .upload(filePath, file);
          if (retryError) throw retryError;
        } else {
          throw uploadError;
        }
      }

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

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
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size must be less than 5MB",
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
    if (imageUrl.trim()) {
      onImageUploaded(imageUrl.trim());
      setImageUrl('');
      toast({
        title: "Success",
        description: "Image URL added successfully",
      });
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
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
      if (file.size <= 5 * 1024 * 1024) {
        await handleImageUpload(file);
      } else {
        toast({
          title: "Error",
          description: `${file.name} is too large (max 5MB)`,
          variant: "destructive",
        });
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="space-y-4">
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
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <p className="text-xs text-gray-500">Max 5MB per image. JPG, PNG, WebP supported.</p>
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
