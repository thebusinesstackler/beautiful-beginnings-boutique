
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Store, Truck, Mail, CreditCard, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

const AdminSettings = () => {
  const { settings, updateSettings, loading } = useSettings();
  const [formData, setFormData] = useState(settings);
  const [showAccessToken, setShowAccessToken] = useState(false);

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

  const handleSaveSquareSettings = () => {
    updateSettings({
      square_app_id: formData.square_app_id,
      square_location_id: formData.square_location_id,
      square_access_token: formData.square_access_token,
      square_environment: formData.square_environment
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

      {/* Square Settings - Enhanced for better accessibility */}
      <Card className="bg-blue-50 border-blue-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-charcoal">
            <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
            Square Payment Settings
            <AlertCircle className="h-4 w-4 ml-2 text-orange-500" />
          </CardTitle>
          <CardDescription>
            Configure Square payment integration for your checkout system.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Important Notice */}
          <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-blue-800 text-sm">
                <p className="font-semibold mb-2">Square Configuration Required</p>
                <ul className="space-y-1 text-xs">
                  <li>• Get your Square credentials from the <a href="https://developer.squareup.com/apps" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">Square Developer Dashboard</a></li>
                  <li>• Access Token is used for API authentication</li>
                  <li>• Use sandbox tokens for testing, production tokens for live payments</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="square_app_id" className="text-charcoal font-medium">
                Square Application ID *
              </Label>
              <Input 
                id="square_app_id" 
                value={formData.square_app_id || ''}
                onChange={(e) => handleInputChange('square_app_id', e.target.value)}
                placeholder="sandbox-sq0idb-... or sq0idb-..."
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-600">
                Found in your Square Developer Dashboard under "Credentials"
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="square_location_id" className="text-charcoal font-medium">
                Square Location ID *
              </Label>
              <Input 
                id="square_location_id" 
                value={formData.square_location_id || ''}
                onChange={(e) => handleInputChange('square_location_id', e.target.value)}
                placeholder="L..."
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-600">
                Your business location ID from Square Dashboard
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="square_environment" className="text-charcoal font-medium">
                Environment *
              </Label>
              <select 
                id="square_environment"
                value={formData.square_environment || 'sandbox'}
                onChange={(e) => handleInputChange('square_environment', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage bg-white"
              >
                <option value="sandbox">Sandbox (Testing)</option>
                <option value="production">Production (Live)</option>
              </select>
              <p className="text-xs text-gray-600">
                Use Sandbox for testing, Production for live payments
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="square_access_token" className="text-charcoal font-medium">
                Access Token *
              </Label>
              <div className="relative">
                <Input 
                  id="square_access_token" 
                  type={showAccessToken ? "text" : "password"}
                  value={formData.square_access_token || ''}
                  onChange={(e) => handleInputChange('square_access_token', e.target.value)}
                  placeholder="EAAAl... (Sandbox) or sq0atp-... (Production)"
                  className="font-mono text-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowAccessToken(!showAccessToken)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showAccessToken ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-600">
                Sandbox tokens start with "EAAAl", Production with "sq0atp-"
              </p>
            </div>
          </div>

          {/* Configuration Status */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Configuration Status</h4>
            <div className="space-y-1 text-sm">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${formData.square_app_id ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={formData.square_app_id ? 'text-green-700' : 'text-red-700'}>
                  Application ID: {formData.square_app_id ? 'Configured' : 'Missing'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${formData.square_location_id ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={formData.square_location_id ? 'text-green-700' : 'text-red-700'}>
                  Location ID: {formData.square_location_id ? 'Configured' : 'Missing'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${formData.square_access_token ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={formData.square_access_token ? 'text-green-700' : 'text-red-700'}>
                  Access Token: {formData.square_access_token ? 'Configured' : 'Missing'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-blue-700">
                  Environment: {formData.square_environment || 'sandbox'}
                </span>
              </div>
            </div>
          </div>
          
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
            onClick={handleSaveSquareSettings}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Square Settings'}
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
