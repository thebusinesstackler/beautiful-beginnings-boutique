
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Store, Truck, Mail, AlertTriangle } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AdminSettings = () => {
  const { settings, updateSettings, loading } = useSettings();
  const [formData, setFormData] = useState(settings);

  React.useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveStoreInfo = () => {
    updateSettings({
      store_name: formData.store_name,
      store_email: formData.store_email,
      store_phone: formData.store_phone,
      store_website: formData.store_website,
      store_address: formData.store_address
    });
  };

  const handleSaveShippingSettings = () => {
    updateSettings({
      domestic_shipping: formData.domestic_shipping,
      international_shipping: formData.international_shipping,
      free_shipping_threshold: formData.free_shipping_threshold,
      processing_time: formData.processing_time,
      shipping_policy: formData.shipping_policy
    });
  };

  const handleSaveEmailSettings = () => {
    updateSettings({
      order_confirmation_template: formData.order_confirmation_template,
      shipping_confirmation_template: formData.shipping_confirmation_template
    });
  };

  const handleSaveCraftShowSettings = () => {
    updateSettings({
      next_show_name: formData.next_show_name,
      next_show_date: formData.next_show_date,
      show_location: formData.show_location,
      booth_number: formData.booth_number,
      show_notes: formData.show_notes
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-charcoal mb-2">Admin Settings</h2>
        <p className="text-stone">Configure your store settings and preferences</p>
      </div>

      {/* Store Information */}
      <Card className="bg-cream/30 border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-charcoal">
            <Store className="h-5 w-5 mr-2 text-stone" />
            Store Information
          </CardTitle>
          <CardDescription>Basic information about your store (appears in footer and homepage)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="store_name" className="text-charcoal">Store Name</Label>
              <Input 
                id="store_name" 
                value={formData.store_name}
                onChange={(e) => handleInputChange('store_name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="store_email" className="text-charcoal">Contact Email</Label>
              <Input 
                id="store_email" 
                type="email" 
                value={formData.store_email}
                onChange={(e) => handleInputChange('store_email', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="store_phone" className="text-charcoal">Phone Number</Label>
              <Input 
                id="store_phone" 
                value={formData.store_phone}
                onChange={(e) => handleInputChange('store_phone', e.target.value)}
                placeholder="(555) 123-4567"
              />
              <p className="text-xs text-stone mt-1">This will appear on your homepage</p>
            </div>
            <div>
              <Label htmlFor="store_website" className="text-charcoal">Website URL</Label>
              <Input 
                id="store_website" 
                value={formData.store_website}
                onChange={(e) => handleInputChange('store_website', e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="store_address" className="text-charcoal">Store Address</Label>
            <Textarea 
              id="store_address" 
              value={formData.store_address}
              onChange={(e) => handleInputChange('store_address', e.target.value)}
            />
          </div>
          <Button 
            className="bg-sage hover:bg-sage/90 text-white"
            onClick={handleSaveStoreInfo}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Store Information'}
          </Button>
        </CardContent>
      </Card>

      {/* Square Payment Settings - Security Notice */}
      <Card className="bg-red-50 border-red-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-red-800">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Square Payment Configuration
          </CardTitle>
          <CardDescription className="text-red-700">
            For security reasons, Square credentials are now managed through server environment variables
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="bg-red-100 border-red-300">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Security Enhancement:</strong> Square API credentials are no longer stored in the database for security reasons. 
              These sensitive credentials are now managed through secure server environment variables.
              <br /><br />
              <strong>For developers:</strong> Square credentials should be configured in the Supabase Edge Function secrets:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>SQUARE_ACCESS_TOKEN</li>
                <li>SQUARE_APP_ID</li>
                <li>SQUARE_LOCATION_ID</li>
                <li>SQUARE_ENVIRONMENT</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Shipping Settings */}
      <Card className="bg-cream/30 border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-charcoal">
            <Truck className="h-5 w-5 mr-2 text-stone" />
            Shipping Settings
          </CardTitle>
          <CardDescription>Configure shipping zones and pricing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="domestic_shipping" className="text-charcoal">Domestic Shipping Rate</Label>
              <Input 
                id="domestic_shipping" 
                type="number" 
                step="0.01" 
                placeholder="5.99"
                value={formData.domestic_shipping || ''}
                onChange={(e) => handleInputChange('domestic_shipping', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="international_shipping" className="text-charcoal">International Shipping Rate</Label>
              <Input 
                id="international_shipping" 
                type="number" 
                step="0.01" 
                placeholder="15.99"
                value={formData.international_shipping || ''}
                onChange={(e) => handleInputChange('international_shipping', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="free_shipping_threshold" className="text-charcoal">Free Shipping Threshold</Label>
              <Input 
                id="free_shipping_threshold" 
                type="number" 
                step="0.01" 
                placeholder="75.00"
                value={formData.free_shipping_threshold || ''}
                onChange={(e) => handleInputChange('free_shipping_threshold', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="processing_time" className="text-charcoal">Processing Time (days)</Label>
              <Input 
                id="processing_time" 
                placeholder="3-5"
                value={formData.processing_time || ''}
                onChange={(e) => handleInputChange('processing_time', e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="shipping_policy" className="text-charcoal">Shipping Policy</Label>
            <Textarea 
              id="shipping_policy" 
              placeholder="Describe your shipping policy..."
              rows={4}
              value={formData.shipping_policy || ''}
              onChange={(e) => handleInputChange('shipping_policy', e.target.value)}
            />
          </div>
          <Button 
            className="bg-sage hover:bg-sage/90 text-white"
            onClick={handleSaveShippingSettings}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Shipping Settings'}
          </Button>
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card className="bg-blush/20 border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-charcoal">
            <Mail className="h-5 w-5 mr-2 text-stone" />
            Email Settings
          </CardTitle>
          <CardDescription>Configure email notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="order_confirmation_template" className="text-charcoal">Order Confirmation Email Template</Label>
            <Textarea 
              id="order_confirmation_template" 
              placeholder="Thank you for your order! Your order #{{order_id}} has been received..."
              rows={4}
              value={formData.order_confirmation_template || ''}
              onChange={(e) => handleInputChange('order_confirmation_template', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="shipping_confirmation_template" className="text-charcoal">Shipping Confirmation Template</Label>
            <Textarea 
              id="shipping_confirmation_template" 
              placeholder="Great news! Your order #{{order_id}} has shipped..."
              rows={4}
              value={formData.shipping_confirmation_template || ''}
              onChange={(e) => handleInputChange('shipping_confirmation_template', e.target.value)}
            />
          </div>
          <Button 
            className="bg-sage hover:bg-sage/90 text-white"
            onClick={handleSaveEmailSettings}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Email Settings'}
          </Button>
        </CardContent>
      </Card>

      {/* Craft Show Settings */}
      <Card className="bg-cream/30 border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-charcoal">
            <Settings className="h-5 w-5 mr-2 text-stone" />
            Craft Show Schedule
          </CardTitle>
          <CardDescription>Manage your craft show appearances</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="next_show_name" className="text-charcoal">Next Show Name</Label>
              <Input 
                id="next_show_name" 
                placeholder="Spring Craft Fair"
                value={formData.next_show_name || ''}
                onChange={(e) => handleInputChange('next_show_name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="next_show_date" className="text-charcoal">Show Date</Label>
              <Input 
                id="next_show_date" 
                type="date"
                value={formData.next_show_date || ''}
                onChange={(e) => handleInputChange('next_show_date', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="show_location" className="text-charcoal">Location</Label>
              <Input 
                id="show_location" 
                placeholder="Community Center, Main St"
                value={formData.show_location || ''}
                onChange={(e) => handleInputChange('show_location', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="booth_number" className="text-charcoal">Booth Number</Label>
              <Input 
                id="booth_number" 
                placeholder="A-15"
                value={formData.booth_number || ''}
                onChange={(e) => handleInputChange('booth_number', e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="show_notes" className="text-charcoal">Show Notes</Label>
            <Textarea 
              id="show_notes" 
              placeholder="Special preparations, new products to showcase..."
              rows={3}
              value={formData.show_notes || ''}
              onChange={(e) => handleInputChange('show_notes', e.target.value)}
            />
          </div>
          <Button 
            className="bg-sage hover:bg-sage/90 text-white"
            onClick={handleSaveCraftShowSettings}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Show Information'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
