
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import ProductImageUploader from './ProductImageUploader';
import ProductImageGallery from './ProductImageGallery';

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
  const [uploading, setUploading] = useState(false);

  const handleImageUploaded = (newImageUrl: string) => {
    const allImages = [imageUrl, ...galleryImages].filter(Boolean);
    
    if (!allImages.includes(newImageUrl)) {
      if (!imageUrl) {
        // If no primary image set, make this the primary
        onImageUrlChange(newImageUrl);
      } else {
        // Add to gallery
        onGalleryImagesChange([...galleryImages, newImageUrl]);
      }
    }
  };

  const handleImagesReorder = (reorderedImages: string[]) => {
    onGalleryImagesChange(reorderedImages);
  };

  const handleImageRemove = (imageUrlToRemove: string) => {
    if (imageUrlToRemove === imageUrl) {
      // If removing primary image, promote first gallery image to primary
      const remainingGallery = galleryImages.filter(img => img !== imageUrlToRemove);
      if (remainingGallery.length > 0) {
        onImageUrlChange(remainingGallery[0]);
        onGalleryImagesChange(remainingGallery.slice(1));
      } else {
        onImageUrlChange('');
      }
    } else {
      // Remove from gallery
      onGalleryImagesChange(galleryImages.filter(img => img !== imageUrlToRemove));
    }
  };

  const handleSetPrimary = (newPrimaryUrl: string) => {
    // If the new primary is currently in gallery, swap it with current primary
    const updatedGallery = galleryImages.filter(img => img !== newPrimaryUrl);
    if (imageUrl) {
      updatedGallery.unshift(imageUrl);
    }
    
    onImageUrlChange(newPrimaryUrl);
    onGalleryImagesChange(updatedGallery);
  };

  // Combine all images for display
  const allImages = [imageUrl, ...galleryImages].filter(Boolean);

  return (
    <Card className="bg-cream/30 border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-charcoal">Product Images</CardTitle>
        <p className="text-sm text-stone">
          Upload and manage your product images. Drag to reorder, click star to set as primary.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium text-charcoal mb-4 block">
            Upload New Images
          </Label>
          <ProductImageUploader
            onImageUploaded={handleImageUploaded}
            uploading={uploading}
            setUploading={setUploading}
          />
        </div>

        {allImages.length > 0 && (
          <div>
            <Label className="text-base font-medium text-charcoal mb-4 block">
              Product Gallery ({allImages.length} images)
            </Label>
            <ProductImageGallery
              images={allImages}
              primaryImage={imageUrl}
              onImagesReorder={handleImagesReorder}
              onImageRemove={handleImageRemove}
              onSetPrimary={handleSetPrimary}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductImageManager;
