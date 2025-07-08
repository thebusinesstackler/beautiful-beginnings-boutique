
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import ProductImageUploader from './ProductImageUploader';

interface WebsiteContent {
  id: string;
  hero_main_image: string;
  hero_secondary_images: string[];
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  about_background_image: string;
  featured_background_image: string;
  testimonials_background_image: string;
  updated_at: string;
}

interface BackgroundImagesManagerProps {
  content: WebsiteContent;
  onContentChange: (content: WebsiteContent) => void;
  uploading: boolean;
  setUploading: (uploading: boolean) => void;
}

const BackgroundImagesManager: React.FC<BackgroundImagesManagerProps> = ({
  content,
  onContentChange,
  uploading,
  setUploading
}) => {
  const handleImageUpload = (imageUrl: string, field: string) => {
    onContentChange({
      ...content,
      [field]: imageUrl
    });
  };

  const removeImage = (field: string) => {
    onContentChange({
      ...content,
      [field]: ""
    });
  };

  const ImageSection = ({ 
    title, 
    field, 
    imageUrl 
  }: { 
    title: string; 
    field: string; 
    imageUrl: string; 
  }) => (
    <div>
      <Label className="text-base font-medium text-charcoal mb-2 block">{title}</Label>
      
      {imageUrl && (
        <div className="mb-4 relative">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-24 object-cover rounded-lg"
          />
          <Button
            onClick={() => removeImage(field)}
            size="sm"
            variant="destructive"
            className="absolute top-2 right-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <div className="space-y-2">
        <ProductImageUploader
          onImageUploaded={(url) => handleImageUpload(url, field)}
          uploading={uploading}
          setUploading={setUploading}
        />
        <div className="text-sm text-stone-600">
          Or paste URL:
        </div>
        <Input
          value={imageUrl}
          onChange={(e) => handleImageUpload(e.target.value, field)}
          placeholder={`${title} background image URL`}
        />
      </div>
    </div>
  );

  return (
    <Card className="bg-blush/20 border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-charcoal">Section Background Images</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ImageSection
          title="About Section Background"
          field="about_background_image"
          imageUrl={content.about_background_image}
        />

        <ImageSection
          title="Featured Products Background"
          field="featured_background_image"
          imageUrl={content.featured_background_image}
        />

        <ImageSection
          title="Testimonials Background"
          field="testimonials_background_image"
          imageUrl={content.testimonials_background_image}
        />
      </CardContent>
    </Card>
  );
};

export default BackgroundImagesManager;
