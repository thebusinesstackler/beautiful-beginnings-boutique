
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { usePhotoUpload } from '@/hooks/usePhotoUpload';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Image } from 'lucide-react';

interface CategoryImageUploaderProps {
  currentImageUrl?: string;
  onImageUpdate: (imageUrl: string | null) => void;
  categoryName: string;
}

const CategoryImageUploader: React.FC<CategoryImageUploaderProps> = ({
  currentImageUrl,
  onImageUpdate,
  categoryName
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const { uploadPhoto } = usePhotoUpload();
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const uploadedUrl = await uploadPhoto(file);
      if (uploadedUrl) {
        setPreviewUrl(uploadedUrl);
        onImageUpdate(uploadedUrl);
        toast({
          title: "Success",
          description: "Category image uploaded successfully",
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageUpdate(null);
    toast({
      title: "Image Removed",
      description: "Category image has been removed",
    });
  };

  return (
    <div className="space-y-4">
      <Label>Category Image</Label>
      
      {previewUrl ? (
        <Card className="bg-cream/30 border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="relative">
              <img
                src={previewUrl}
                alt={`${categoryName} category`}
                className="w-full h-40 object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400";
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="absolute top-2 right-2 bg-white hover:bg-red-50 text-red-600 border-red-200"
                onClick={handleRemoveImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-cream/30 border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="border-2 border-dashed border-stone/30 rounded-lg p-8 text-center">
              <Image className="h-12 w-12 mx-auto text-stone mb-4" />
              <p className="text-stone mb-4">No image uploaded</p>
              <Label htmlFor={`image-upload-${categoryName}`} className="cursor-pointer">
                <Button
                  type="button"
                  variant="outline"
                  className="border-stone text-charcoal hover:bg-cream/50"
                  disabled={isUploading}
                  asChild
                >
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    {isUploading ? 'Uploading...' : 'Upload Image'}
                  </span>
                </Button>
              </Label>
            </div>
          </CardContent>
        </Card>
      )}

      <Input
        id={`image-upload-${categoryName}`}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
        disabled={isUploading}
      />

      {previewUrl && (
        <div className="flex space-x-2">
          <Label htmlFor={`image-replace-${categoryName}`} className="cursor-pointer flex-1">
            <Button
              type="button"
              variant="outline"
              className="w-full border-stone text-charcoal hover:bg-cream/50"
              disabled={isUploading}
              asChild
            >
              <span>
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Replace Image'}
              </span>
            </Button>
          </Label>
          <Input
            id={`image-replace-${categoryName}`}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
            disabled={isUploading}
          />
        </div>
      )}

      <p className="text-xs text-stone">
        Recommended size: 400x400px or larger. Max file size: 5MB. Supported formats: JPG, PNG, WebP
      </p>
    </div>
  );
};

export default CategoryImageUploader;
