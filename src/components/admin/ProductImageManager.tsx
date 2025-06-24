
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
    console.log('New image uploaded:', newImageUrl);
    
    if (!imageUrl) {
      // If no primary image set, make this the primary
      console.log('Setting as primary image');
      onImageUrlChange(newImageUrl);
    } else {
      // Add to gallery if not already there
      if (!galleryImages.includes(newImageUrl)) {
        console.log('Adding to gallery');
        onGalleryImagesChange([...galleryImages, newImageUrl]);
      }
    }
  };

  const handleImagesReorder = (reorderedImages: string[]) => {
    // The reordered images include the primary image, so we need to separate them
    const primaryIndex = reorderedImages.findIndex(img => img === imageUrl);
    
    if (primaryIndex === -1) {
      // Primary image not in the list, just update gallery
      onGalleryImagesChange(reorderedImages);
    } else {
      // Remove primary from the list to get the gallery images
      const newGallery = [...reorderedImages];
      newGallery.splice(primaryIndex, 1);
      onGalleryImagesChange(newGallery);
    }
  };

  const handleImageRemove = (imageUrlToRemove: string) => {
    console.log('Removing image:', imageUrlToRemove);
    
    if (imageUrlToRemove === imageUrl) {
      // If removing primary image, promote first gallery image to primary
      if (galleryImages.length > 0) {
        onImageUrlChange(galleryImages[0]);
        onGalleryImagesChange(galleryImages.slice(1));
      } else {
        onImageUrlChange('');
      }
    } else {
      // Remove from gallery
      onGalleryImagesChange(galleryImages.filter(img => img !== imageUrlToRemove));
    }
  };

  const handleSetPrimary = (newPrimaryUrl: string) => {
    console.log('Setting new primary:', newPrimaryUrl);
    
    // Remove the new primary from gallery
    const updatedGallery = galleryImages.filter(img => img !== newPrimaryUrl);
    
    // Add the current primary to gallery if it exists
    if (imageUrl && imageUrl !== newPrimaryUrl) {
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
