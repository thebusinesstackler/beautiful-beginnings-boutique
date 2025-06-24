
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, Link, Image as ImageIcon } from 'lucide-react';

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

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `featured-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `featured-products/${fileName}`;

      console.log('Uploading featured product image:', fileName);

      // Create bucket if it doesn't exist
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === 'featured-images');
      
      if (!bucketExists) {
        console.log('Creating featured-images bucket...');
        await supabase.storage.createBucket('featured-images', { public: true });
      }

      const { error: uploadError } = await supabase.storage
        .from('featured-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('featured-images')
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
        description: "Image must be smaller than 5MB",
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
    const file = event.dataTransfer.files[0];
    
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please drop an image file",
        variant: "destructive",
      });
      return;
    }

    if (file.size <= 5 * 1024 * 1024) {
      await handleImageUpload(file);
    } else {
      toast({
        title: "Error",
        description: "Image must be smaller than 5MB",
        variant: "destructive",
      });
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="space-y-4">
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
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <p className="text-xs text-gray-500 mt-2">Max 5MB. JPG, PNG, WebP supported.</p>
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
