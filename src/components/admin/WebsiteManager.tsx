
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Save, Eye, EyeOff } from 'lucide-react';
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

const WebsiteManager = () => {
  const [content, setContent] = useState<WebsiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchWebsiteContent();
  }, []);

  const fetchWebsiteContent = async () => {
    try {
      const { data, error } = await supabase
        .from('website_content' as any)
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setContent(data as WebsiteContent);
      } else {
        // Create default content if none exists
        const defaultContent = {
          hero_main_image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=800",
          hero_secondary_images: [
            "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400",
            "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400"
          ],
          hero_title: "Where Memories Begin",
          hero_subtitle: "and Beauty Lasts",
          hero_description: "Capture the magic of your favorite moments—handcrafted photo keepsakes made with love and lasting brilliance. From shimmering ornaments to heartfelt jewelry, Beautiful Beginnings brings your memories to life.",
          about_background_image: "",
          featured_background_image: "",
          testimonials_background_image: ""
        };

        const { data: newData, error: insertError } = await supabase
          .from('website_content' as any)
          .insert([defaultContent])
          .select()
          .single();

        if (insertError) throw insertError;
        setContent(newData as WebsiteContent);
      }
    } catch (error) {
      console.error('Error fetching website content:', error);
      toast({
        title: "Error",
        description: "Failed to load website content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('website_content' as any)
        .update({
          hero_main_image: content.hero_main_image,
          hero_secondary_images: content.hero_secondary_images,
          hero_title: content.hero_title,
          hero_subtitle: content.hero_subtitle,
          hero_description: content.hero_description,
          about_background_image: content.about_background_image,
          featured_background_image: content.featured_background_image,
          testimonials_background_image: content.testimonials_background_image,
          updated_at: new Date().toISOString()
        })
        .eq('id', content.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Website content updated successfully",
      });
    } catch (error) {
      console.error('Error saving website content:', error);
      toast({
        title: "Error",
        description: "Failed to save website content",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (imageUrl: string, field: string) => {
    if (!content) return;

    setContent({
      ...content,
      [field]: imageUrl
    });
  };

  const handleSecondaryImageUpload = (imageUrl: string, index: number) => {
    if (!content) return;

    const newSecondaryImages = [...content.hero_secondary_images];
    newSecondaryImages[index] = imageUrl;

    setContent({
      ...content,
      hero_secondary_images: newSecondaryImages
    });
  };

  const addSecondaryImage = () => {
    if (!content) return;

    setContent({
      ...content,
      hero_secondary_images: [...content.hero_secondary_images, ""]
    });
  };

  const removeSecondaryImage = (index: number) => {
    if (!content) return;

    const newSecondaryImages = content.hero_secondary_images.filter((_, i) => i !== index);
    setContent({
      ...content,
      hero_secondary_images: newSecondaryImages
    });
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-sage border-t-transparent mx-auto mb-4"></div>
        <div className="text-charcoal font-medium">Loading website content...</div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="text-center py-8">
        <p className="text-stone">Failed to load website content</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-charcoal">Website Content Management</h2>
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => setShowPreview(!showPreview)}
            variant="outline"
            size="sm"
          >
            {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-sage hover:bg-sage/90"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hero Section */}
        <Card className="bg-cream/30 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-charcoal">Hero Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-base font-medium text-charcoal">Hero Title</Label>
              <Input
                value={content.hero_title}
                onChange={(e) => setContent({ ...content, hero_title: e.target.value })}
                placeholder="Main hero title"
              />
            </div>

            <div>
              <Label className="text-base font-medium text-charcoal">Hero Subtitle</Label>
              <Input
                value={content.hero_subtitle}
                onChange={(e) => setContent({ ...content, hero_subtitle: e.target.value })}
                placeholder="Hero subtitle"
              />
            </div>

            <div>
              <Label className="text-base font-medium text-charcoal">Hero Description</Label>
              <Textarea
                value={content.hero_description}
                onChange={(e) => setContent({ ...content, hero_description: e.target.value })}
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

        {/* Background Images */}
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
      </div>

      {/* Preview Section */}
      {showPreview && (
        <Card className="bg-stone/10 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-charcoal">Live Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="relative py-12 px-6 rounded-lg overflow-hidden" style={{ backgroundColor: '#FAF5EF' }}>
                <div className="text-center">
                  <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#5B4C37' }}>
                    {content.hero_title}
                    <br />
                    <span className="bg-gradient-to-r from-[#E28F84] to-[#F4A79B] bg-clip-text text-transparent">
                      {content.hero_subtitle}
                    </span>
                  </h1>
                  <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: '#A89B84' }}>
                    {content.hero_description}
                  </p>
                  <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
                    {content.hero_main_image && (
                      <div className="col-span-2">
                        <img
                          src={content.hero_main_image}
                          alt="Hero main preview"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    {content.hero_secondary_images.map((image, index) => (
                      image && (
                        <div key={index}>
                          <img
                            src={image}
                            alt={`Hero secondary ${index + 1} preview`}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                        </div>
                      )
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WebsiteManager;
