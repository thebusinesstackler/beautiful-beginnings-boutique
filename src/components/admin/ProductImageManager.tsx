
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Plus, GripVertical, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProductImageManagerProps {
  imageUrl: string;
  galleryImages: string[];
  onImageUrlChange: (url: string) => void;
  onGalleryImagesChange: (images: string[]) => void;
}

const ProductImageManager: React.FC<ProductImageManagerProps> = ({
  imageUrl,
  galleryImages,
  onImageUrlChange,
  onGalleryImagesChange,
}) => {
  const [newImageUrl, setNewImageUrl] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const addGalleryImage = () => {
    if (newImageUrl.trim()) {
      const updatedImages = [...galleryImages, newImageUrl.trim()];
      onGalleryImagesChange(updatedImages);
      setNewImageUrl('');
    }
  };

  const removeGalleryImage = (index: number) => {
    const updatedImages = galleryImages.filter((_, i) => i !== index);
    onGalleryImagesChange(updatedImages);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const updatedImages = [...galleryImages];
    const [movedImage] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, movedImage);
    onGalleryImagesChange(updatedImages);
  };

  const setAsPrimary = (imageUrl: string, index: number) => {
    // Set the clicked image as primary
    onImageUrlChange(imageUrl);
    // Remove it from gallery and add the old primary to gallery
    const updatedImages = [...galleryImages];
    updatedImages.splice(index, 1);
    if (imageUrl) {
      updatedImages.unshift(imageUrl);
    }
    onGalleryImagesChange(updatedImages);
  };

  return (
    <Card className="bg-cream/30 border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-charcoal">Product Images</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Primary Image */}
        <div>
          <Label htmlFor="primary-image">Primary Image URL</Label>
          <div className="flex space-x-2">
            <Input
              id="primary-image"
              value={imageUrl}
              onChange={(e) => onImageUrlChange(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
            {imageUrl && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPreviewImage(imageUrl)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
          </div>
          {imageUrl && (
            <div className="mt-2">
              <img
                src={imageUrl}
                alt="Primary product image"
                className="w-20 h-20 object-cover rounded border-2 border-sage"
              />
              <Badge variant="default" className="mt-1">Primary</Badge>
            </div>
          )}
        </div>

        {/* Gallery Images */}
        <div>
          <Label>Gallery Images</Label>
          <div className="space-y-2">
            {galleryImages.map((image, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 bg-white rounded border">
                <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                <img
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="flex-1 text-sm text-gray-600 truncate">
                  {image}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAsPrimary(image, index)}
                >
                  Set Primary
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewImage(image)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeGalleryImage(index)}
                  className="text-red-600 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Add New Gallery Image */}
          <div className="flex space-x-2 mt-2">
            <Input
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="Add gallery image URL"
            />
            <Button
              type="button"
              onClick={addGalleryImage}
              size="sm"
              className="bg-sage hover:bg-sage/90"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>

        {/* Image Preview Modal */}
        {previewImage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="relative max-w-4xl max-h-4xl">
              <img
                src={previewImage}
                alt="Preview"
                className="max-w-full max-h-full object-contain"
              />
              <Button
                onClick={() => setPreviewImage(null)}
                className="absolute top-4 right-4 bg-white text-black hover:bg-gray-100"
                size="sm"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductImageManager;
