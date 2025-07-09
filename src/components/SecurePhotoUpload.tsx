
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Image as ImageIcon, AlertTriangle } from 'lucide-react';
import { useSecurePhotoUpload } from '@/hooks/useSecurePhotoUpload';

interface SecurePhotoUploadProps {
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
  existingPhotos?: string[];
  className?: string;
}

const SecurePhotoUpload: React.FC<SecurePhotoUploadProps> = ({
  onPhotosChange,
  maxPhotos = 5,
  existingPhotos = [],
  className = ''
}) => {
  const [photos, setPhotos] = useState<string[]>(existingPhotos);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadPhoto, deletePhoto, uploading, validateFile } = useSecurePhotoUpload();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    for (const file of files) {
      if (photos.length >= maxPhotos) {
        break;
      }

      if (!validateFile(file)) {
        continue;
      }

      const photoUrl = await uploadPhoto(file);
      if (photoUrl) {
        const newPhotos = [...photos, photoUrl];
        setPhotos(newPhotos);
        onPhotosChange(newPhotos);
      }
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = async (index: number) => {
    const photoUrl = photos[index];
    const success = await deletePhoto(photoUrl);
    
    if (success) {
      const newPhotos = photos.filter((_, i) => i !== index);
      setPhotos(newPhotos);
      onPhotosChange(newPhotos);
    }
  };

  const canAddMore = photos.length < maxPhotos;

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ImageIcon className="h-5 w-5 text-sage" />
          <h3 className="text-lg font-medium text-charcoal">Upload Photos</h3>
          <Badge variant="outline" className="text-xs">
            {photos.length}/{maxPhotos}
          </Badge>
        </div>
        
        {canAddMore && (
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            variant="outline"
            size="sm"
            className="border-sage text-sage hover:bg-sage/10"
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Add Photos'}
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Security Notice */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-3">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Secure Upload</p>
              <p className="text-xs mt-1">
                Files are securely stored with 10MB limit. Only JPEG, PNG, and WebP formats accepted.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-cream rounded-lg overflow-hidden border border-stone-200">
                <img
                  src={photo}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Failed to load image:', photo);
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <button
                  onClick={() => handleRemovePhoto(index)}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove photo"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {photos.length === 0 && !uploading && (
        <Card className="bg-gray-50 border-dashed border-2 border-gray-300">
          <CardContent className="p-8 text-center">
            <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 mb-2">No photos uploaded yet</p>
            <p className="text-sm text-gray-500">
              Click "Add Photos" to upload images securely
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SecurePhotoUpload;
