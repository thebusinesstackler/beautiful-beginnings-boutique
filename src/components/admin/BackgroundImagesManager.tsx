
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
}

const BackgroundImagesManager: React.FC<BackgroundImagesManagerProps> = ({
  content,
  onContentChange
}) => {
  const handleImageUpload = (imageUrl: string, field: string) => {
    onContentChange({
      ...content,
      [field]: imageUrl
    });
  };

  return (
    <Card className="bg-blush/20 border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-charcoal">Section Background Images</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium text-charcoal mb-2 block">About Section Background</Label>
          {content.about_background_image && (
            <div className="mb-4">
              <img
                src={content.about_background_image}
                alt="About background"
                className="w-full h-24 object-cover rounded-lg"
              />
            </div>
          )}
          <Input
            value={content.about_background_image}
            onChange={(e) => handleImageUpload(e.target.value, 'about_background_image')}
            placeholder="About section background image URL"
          />
        </div>

        <div>
          <Label className="text-base font-medium text-charcoal mb-2 block">Featured Products Background</Label>
          {content.featured_background_image && (
            <div className="mb-4">
              <img
                src={content.featured_background_image}
                alt="Featured background"
                className="w-full h-24 object-cover rounded-lg"
              />
            </div>
          )}
          <Input
            value={content.featured_background_image}
            onChange={(e) => handleImageUpload(e.target.value, 'featured_background_image')}
            placeholder="Featured section background image URL"
          />
        </div>

        <div>
          <Label className="text-base font-medium text-charcoal mb-2 block">Testimonials Background</Label>
          {content.testimonials_background_image && (
            <div className="mb-4">
              <img
                src={content.testimonials_background_image}
                alt="Testimonials background"
                className="w-full h-24 object-cover rounded-lg"
              />
            </div>
          )}
          <Input
            value={content.testimonials_background_image}
            onChange={(e) => handleImageUpload(e.target.value, 'testimonials_background_image')}
            placeholder="Testimonials section background image URL"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BackgroundImagesManager;
