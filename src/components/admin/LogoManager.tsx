import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Image, Upload } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import CompactPhotoUpload from '@/components/CompactPhotoUpload';

const LogoManager = () => {
  const { settings, updateSettings, loading } = useSettings();
  const [logoUrl, setLogoUrl] = useState(settings.logo_url || '');
  const [logoAltText, setLogoAltText] = useState(settings.logo_alt_text || 'Beautiful Beginnings');

  React.useEffect(() => {
    setLogoUrl(settings.logo_url || '');
    setLogoAltText(settings.logo_alt_text || 'Beautiful Beginnings');
  }, [settings]);

  const handleLogoUpload = (file: File) => {
    // The CompactPhotoUpload component handles the upload and provides the URL
    const uploadedUrl = `/lovable-uploads/${file.name}`;
    setLogoUrl(uploadedUrl);
  };

  const handleSaveLogo = () => {
    updateSettings({
      logo_url: logoUrl,
      logo_alt_text: logoAltText
    });
  };

  return (
    <Card className="bg-cream/30 border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-charcoal">
          <Image className="h-5 w-5 mr-2 text-stone" />
          Logo Management
        </CardTitle>
        <CardDescription>
          Update your website logo that appears in navigation, footer, and category pages
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Logo Preview */}
        <div className="space-y-3">
          <Label className="text-charcoal font-medium">Current Logo</Label>
          <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-sage/20">
            <img 
              src={logoUrl || '/lovable-uploads/5e4be881-9356-47e3-ba32-e012d51e3e8c.png'} 
              alt={logoAltText} 
              className="h-16 w-16 object-contain rounded-lg border border-stone/20"
            />
            <div>
              <p className="text-sm font-medium text-charcoal">Logo Preview</p>
              <p className="text-xs text-stone">{logoAltText}</p>
            </div>
          </div>
        </div>

        {/* Logo Upload */}
        <div className="space-y-3">
          <Label className="text-charcoal font-medium">Upload New Logo</Label>
          <CompactPhotoUpload
            onUpload={handleLogoUpload}
            maxSizeMB={5}
            accept="image/jpeg,image/png,image/webp"
            className="border-dashed border-2 border-sage/30 hover:border-sage/60 transition-colors"
          />
          <p className="text-xs text-stone">
            Recommended: Square format (1:1 ratio), PNG or JPG, max 5MB
          </p>
        </div>

        {/* Logo URL Input */}
        <div className="space-y-2">
          <Label htmlFor="logo_url" className="text-charcoal font-medium">Logo URL</Label>
          <Input 
            id="logo_url" 
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="/lovable-uploads/your-logo.png"
          />
          <p className="text-xs text-stone">
            Direct URL to your logo image (automatically filled when uploading)
          </p>
        </div>

        {/* Alt Text */}
        <div className="space-y-2">
          <Label htmlFor="logo_alt_text" className="text-charcoal font-medium">Logo Alt Text</Label>
          <Input 
            id="logo_alt_text" 
            value={logoAltText}
            onChange={(e) => setLogoAltText(e.target.value)}
            placeholder="Beautiful Beginnings"
          />
          <p className="text-xs text-stone">
            Descriptive text for accessibility and SEO
          </p>
        </div>

        <Button 
          className="bg-sage hover:bg-sage/90 text-white"
          onClick={handleSaveLogo}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Logo Settings'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default LogoManager;