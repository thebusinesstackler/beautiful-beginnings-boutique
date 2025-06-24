
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
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

interface HeroContentManagerProps {
  content: WebsiteContent;
  onContentChange: (content: WebsiteContent) => void;
  uploading: boolean;
  setUploading: (uploading: boolean) => void;
}

const HeroContentManager: React.FC<HeroContentManagerProps> = ({
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

  const handleSecondaryImageUpload = (imageUrl: string, index: number) => {
    const newSecondaryImages = [...content.hero_secondary_images];
    newSecondaryImages[index] = imageUrl;

    onContentChange({
      ...content,
      hero_secondary_images: newSecondaryImages
    });
  };

  const addSecondaryImage = () => {
    onContentChange({
      ...content,
      hero_secondary_images: [...content.hero_secondary_images, ""]
    });
  };

  const removeSecondaryImage = (index: number) => {
    const newSecondaryImages = content.hero_secondary_images.filter((_, i) => i !== index);
    onContentChange({
      ...content,
      hero_secondary_images: newSecondaryImages
    });
  };

  return (
    <Card className="bg-cream/30 border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-charcoal">Hero Section</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-base font-medium text-charcoal">Hero Title</Label>
          <Input
            value={content.hero_title}
            onChange={(e) => onContentChange({ ...content, hero_title: e.target.value })}
            placeholder="Main hero title"
          />
        </div>

        <div>
          <Label className="text-base font-medium text-charcoal">Hero Subtitle</Label>
          <Input
            value={content.hero_subtitle}
            onChange={(e) => onContentChange({ ...content, hero_subtitle: e.target.value })}
            placeholder="Hero subtitle"
          />
        </div>

        <div>
          <Label className="text-base font-medium text-charcoal">Hero Description</Label>
          <Textarea
            value={content.hero_description}
            onChange={(e) => onContentChange({ ...content, hero_description: e.target.value })}
            placeholder="Hero description text"
            rows={4}
          />
        </div>

        <div>
          <Label className="text-base font-medium text-charcoal mb-2 block">Main Hero Image</Label>
          {content.hero_main_image && (
            <div className="mb-4">
              <img
                src={content.hero_main_image}
                alt="Hero main"
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>
          )}
          <ProductImageUploader
            onImageUploaded={(url) => handleImageUpload(url, 'hero_main_image')}
            uploading={uploading}
            setUploading={setUploading}
          />
        </div>

        <div>
          <Label className="text-base font-medium text-charcoal mb-2 block">Secondary Hero Images</Label>
          {content.hero_secondary_images.map((image, index) => (
            <div key={index} className="mb-4 p-4 border rounded-lg">
              {image && (
                <img
                  src={image}
                  alt={`Hero secondary ${index + 1}`}
                  className="w-full h-24 object-cover rounded mb-2"
                />
              )}
              <div className="flex items-center space-x-2">
                <Input
                  value={image}
                  onChange={(e) => handleSecondaryImageUpload(e.target.value, index)}
                  placeholder="Image URL"
                  className="flex-1"
                />
                <Button
                  onClick={() => removeSecondaryImage(index)}
                  variant="outline"
                  size="sm"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
          <Button
            onClick={addSecondaryImage}
            variant="outline"
            size="sm"
          >
            Add Secondary Image
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeroContentManager;
