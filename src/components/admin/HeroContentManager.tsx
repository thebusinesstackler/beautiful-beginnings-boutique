
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { X, Upload, Plus } from 'lucide-react';
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
  const handleMainImageUpload = (imageUrl: string) => {
    onContentChange({
      ...content,
      hero_main_image: imageUrl
    });
  };

  const handleSecondaryImageUpload = (imageUrl: string, index?: number) => {
    const newSecondaryImages = [...content.hero_secondary_images];
    
    if (index !== undefined) {
      // Replace existing image
      newSecondaryImages[index] = imageUrl;
    } else {
      // Add new image
      newSecondaryImages.push(imageUrl);
    }

    onContentChange({
      ...content,
      hero_secondary_images: newSecondaryImages
    });
  };

  const removeMainImage = () => {
    onContentChange({
      ...content,
      hero_main_image: ""
    });
  };

  const removeSecondaryImage = (index: number) => {
    const newSecondaryImages = content.hero_secondary_images.filter((_, i) => i !== index);
    onContentChange({
      ...content,
      hero_secondary_images: newSecondaryImages
    });
  };

  const addSecondaryImageSlot = () => {
    onContentChange({
      ...content,
      hero_secondary_images: [...content.hero_secondary_images, ""]
    });
  };

  return (
    <Card className="bg-cream/30 border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-charcoal">Hero Section</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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

        {/* Main Hero Image */}
        <div>
          <Label className="text-base font-medium text-charcoal mb-2 block">Main Hero Image</Label>
          
          {content.hero_main_image && (
            <div className="mb-4 relative">
              <img
                src={content.hero_main_image}
                alt="Hero main"
                className="w-full h-32 object-cover rounded-lg"
              />
              <Button
                onClick={removeMainImage}
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
              onImageUploaded={handleMainImageUpload}
              uploading={uploading}
              setUploading={setUploading}
            />
            <div className="text-sm text-stone-600">
              Or paste URL:
            </div>
            <Input
              value={content.hero_main_image}
              onChange={(e) => handleMainImageUpload(e.target.value)}
              placeholder="Enter image URL"
            />
          </div>
        </div>

        {/* Secondary Hero Images */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <Label className="text-base font-medium text-charcoal">Secondary Hero Images</Label>
            <Button
              onClick={addSecondaryImageSlot}
              size="sm"
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Image
            </Button>
          </div>
          
          {content.hero_secondary_images.map((image, index) => (
            <div key={index} className="mb-4 p-4 border rounded-lg bg-white/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-charcoal">Image {index + 1}</span>
                <Button
                  onClick={() => removeSecondaryImage(index)}
                  size="sm"
                  variant="destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {image && (
                <div className="mb-4">
                  <img
                    src={image}
                    alt={`Hero secondary ${index + 1}`}
                    className="w-full h-24 object-cover rounded"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <ProductImageUploader
                  onImageUploaded={(url) => handleSecondaryImageUpload(url, index)}
                  uploading={uploading}
                  setUploading={setUploading}
                />
                <div className="text-sm text-stone-600">
                  Or paste URL:
                </div>
                <Input
                  value={image}
                  onChange={(e) => handleSecondaryImageUpload(e.target.value, index)}
                  placeholder="Enter image URL"
                />
              </div>
            </div>
          ))}
          
          {content.hero_secondary_images.length === 0 && (
            <div className="text-center py-8 text-stone-500">
              No secondary images added yet. Click "Add Image" to get started.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HeroContentManager;
