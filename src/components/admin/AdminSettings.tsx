import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Store, CreditCard, Truck, Mail } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

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
          <CardDescription>Basic information about your store (appears in footer)</CardDescription>
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
              />
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

      {/* Payment Settings */}
      <Card className="bg-blush/20 border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-charcoal">
            <CreditCard className="h-5 w-5 mr-2 text-stone" />
            Payment Settings
          </CardTitle>
          <CardDescription>Configure payment processing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="square_app_id" className="text-charcoal">Square Application ID</Label>
              <Input id="square_app_id" placeholder="Enter Square App ID" />
            </div>
            <div>
              <Label htmlFor="square_location_id" className="text-charcoal">Square Location ID</Label>
              <Input id="square_location_id" placeholder="Enter Square Location ID" />
            </div>
          </div>
          <div>
            <Label htmlFor="payment_instructions" className="text-charcoal">Payment Instructions</Label>
            <Textarea 
              id="payment_instructions" 
              placeholder="Special instructions for customers about payment..."
              rows={3}
            />
          </div>
          <Button className="bg-sage hover:bg-sage/90 text-white">
            Save Payment Settings
          </Button>
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
              <Input id="domestic_shipping" type="number" step="0.01" placeholder="5.99" />
            </div>
            <div>
              <Label htmlFor="international_shipping" className="text-charcoal">International Shipping Rate</Label>
              <Input id="international_shipping" type="number" step="0.01" placeholder="15.99" />
            </div>
            <div>
              <Label htmlFor="free_shipping_threshold" className="text-charcoal">Free Shipping Threshold</Label>
              <Input id="free_shipping_threshold" type="number" step="0.01" placeholder="75.00" />
            </div>
            <div>
              <Label htmlFor="processing_time" className="text-charcoal">Processing Time (days)</Label>
              <Input id="processing_time" type="number" placeholder="3-5" />
            </div>
          </div>
          <div>
            <Label htmlFor="shipping_policy" className="text-charcoal">Shipping Policy</Label>
            <Textarea 
              id="shipping_policy" 
              placeholder="Describe your shipping policy..."
              rows={4}
            />
          </div>
          <Button className="bg-sage hover:bg-sage/90 text-white">
            Save Shipping Settings
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
            />
          </div>
          <div>
            <Label htmlFor="shipping_confirmation_template" className="text-charcoal">Shipping Confirmation Template</Label>
            <Textarea 
              id="shipping_confirmation_template" 
              placeholder="Great news! Your order #{{order_id}} has shipped..."
              rows={4}
            />
          </div>
          <Button className="bg-sage hover:bg-sage/90 text-white">
            Save Email Settings
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
              <Input id="next_show_name" placeholder="Spring Craft Fair" />
            </div>
            <div>
              <Label htmlFor="next_show_date" className="text-charcoal">Show Date</Label>
              <Input id="next_show_date" type="date" />
            </div>
            <div>
              <Label htmlFor="show_location" className="text-charcoal">Location</Label>
              <Input id="show_location" placeholder="Community Center, Main St" />
            </div>
            <div>
              <Label htmlFor="booth_number" className="text-charcoal">Booth Number</Label>
              <Input id="booth_number" placeholder="A-15" />
            </div>
          </div>
          <div>
            <Label htmlFor="show_notes" className="text-charcoal">Show Notes</Label>
            <Textarea 
              id="show_notes" 
              placeholder="Special preparations, new products to showcase..."
              rows={3}
            />
          </div>
          <Button className="bg-sage hover:bg-sage/90 text-white">
            Save Show Information
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
