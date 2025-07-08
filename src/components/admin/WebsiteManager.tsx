
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Save, Eye, EyeOff } from 'lucide-react';
import HeroContentManager from './HeroContentManager';
import BackgroundImagesManager from './BackgroundImagesManager';
import FAQManager from './FAQManager';
import FeaturedManager from './FeaturedManager';
import HomepagePreview from './HomepagePreview';
import TestimonialsManager from './TestimonialsManager';
import CollectionsManager from './CollectionsManager';
import FeaturedProductsManager from './FeaturedProductsManager';

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
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchWebsiteContent();
  }, []);

  const fetchWebsiteContent = async () => {
    try {
      const { data, error } = await supabase
        .from('website_content')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setContent(data as unknown as WebsiteContent);
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
          .from('website_content')
          .insert([defaultContent])
          .select()
          .single();

        if (insertError) throw insertError;
        setContent(newData as unknown as WebsiteContent);
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

  const handleContentChange = (newContent: WebsiteContent) => {
    setContent(newContent);
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    if (!content) return;

    setSaving(true);
    try {
      console.log('Saving website content:', content);
      
      const { error } = await supabase
        .from('website_content')
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

      if (error) {
        console.error('Error saving website content:', error);
        throw error;
      }

      setHasUnsavedChanges(false);
      console.log('Website content saved successfully');
      
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
            disabled={saving || uploading || !hasUnsavedChanges}
            className={`${hasUnsavedChanges ? 'bg-orange-600 hover:bg-orange-700' : 'bg-sage hover:bg-sage/90'} text-white`}
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : hasUnsavedChanges ? 'Save Changes' : 'Saved'}
          </Button>
        </div>
      </div>

      {hasUnsavedChanges && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-orange-800 text-sm">
            ⚠️ You have unsaved changes. Click "Save Changes" to update your website.
          </p>
        </div>
      )}

      {/* Hero and Background Images Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HeroContentManager
          content={content}
          onContentChange={handleContentChange}
          uploading={uploading}
          setUploading={setUploading}
        />

        <BackgroundImagesManager
          content={content}
          onContentChange={handleContentChange}
          uploading={uploading}
          setUploading={setUploading}
        />
      </div>

      {/* Featured Products Section Management */}
      <Card className="bg-blush/10 border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-charcoal">Featured Products (About Section)</CardTitle>
        </CardHeader>
        <CardContent>
          <FeaturedProductsManager />
        </CardContent>
      </Card>

      {/* Featured Products & Bestsellers Management */}
      <FeaturedManager />

      {/* Homepage Preview */}
      <HomepagePreview />

      {/* Collections Management */}
      <Card className="bg-accent/5 border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-charcoal">Collections Management</CardTitle>
        </CardHeader>
        <CardContent>
          <CollectionsManager />
        </CardContent>
      </Card>

      {/* Testimonials Management */}
      <Card className="bg-blush/10 border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-charcoal">Testimonials Management</CardTitle>
        </CardHeader>
        <CardContent>
          <TestimonialsManager />
        </CardContent>
      </Card>

      {/* FAQ Management Section */}
      <FAQManager />

      {/* Live Preview Section */}
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
