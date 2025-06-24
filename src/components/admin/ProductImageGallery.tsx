
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Eye, GripVertical, Star } from 'lucide-react';

interface ProductImageGalleryProps {
  images: string[];
  primaryImage: string;
  onImagesReorder: (images: string[]) => void;
  onImageRemove: (imageUrl: string) => void;
  onSetPrimary: (imageUrl: string) => void;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  primaryImage,
  onImagesReorder,
  onImageRemove,
  onSetPrimary,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null) return;
    
    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    
    // Remove the dragged image
    newImages.splice(draggedIndex, 1);
    
    // Insert at new position
    newImages.splice(dropIndex, 0, draggedImage);
    
    onImagesReorder(newImages);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No images uploaded yet</p>
        <p className="text-sm">Upload images to see them here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((imageUrl, index) => (
          <div
            key={`${imageUrl}-${index}`}
            className={`relative group bg-white rounded-lg border-2 transition-all duration-200 ${
              draggedIndex === index ? 'opacity-50 scale-95' : ''
            } ${
              imageUrl === primaryImage ? 'border-sage shadow-lg' : 'border-gray-200 hover:border-gray-300'
            }`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
          >
            <div className="aspect-square overflow-hidden rounded-t-lg">
              <img
                src={imageUrl}
                alt={`Product image ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            
            <div className="p-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-1">
                  <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                  <span className="text-xs text-gray-500">#{index + 1}</span>
                </div>
                {imageUrl === primaryImage && (
                  <Badge className="bg-sage text-white text-xs px-1 py-0">
                    <Star className="h-3 w-3 mr-1" />
                    Primary
                  </Badge>
                )}
              </div>
              
              <div className="flex space-x-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs p-1"
                  onClick={() => setPreviewImage(imageUrl)}
                >
                  <Eye className="h-3 w-3" />
                </Button>
                
                {imageUrl !== primaryImage && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs p-1"
                    onClick={() => onSetPrimary(imageUrl)}
                  >
                    <Star className="h-3 w-3" />
                  </Button>
                )}
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:bg-red-50 text-xs p-1"
                  onClick={() => onImageRemove(imageUrl)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-4xl p-4">
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <Button
              onClick={() => setPreviewImage(null)}
              className="absolute top-2 right-2 bg-white text-black hover:bg-gray-100"
              size="sm"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
