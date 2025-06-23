
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Store, CreditCard, Truck, Mail } from 'lucide-react';

const AdminSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#7A7047' }}>Admin Settings</h2>
        <p className="text-gray-600">Configure your store settings and preferences</p>
      </div>

      {/* Store Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Store className="h-5 w-5 mr-2" />
            Store Information
          </CardTitle>
          <CardDescription>Basic information about your store</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="store_name">Store Name</Label>
              <Input id="store_name" defaultValue="Beautiful Beginnings" />
            </div>
            <div>
              <Label htmlFor="store_email">Contact Email</Label>
              <Input id="store_email" type="email" defaultValue="contact@beautifulbeginnings.com" />
            </div>
            <div>
              <Label htmlFor="store_phone">Phone Number</Label>
              <Input id="store_phone" defaultValue="+1 (555) 123-4567" />
            </div>
            <div>
              <Label htmlFor="store_website">Website URL</Label>
              <Input id="store_website" defaultValue="https://beautifulbeginnings.com" />
            </div>
          </div>
          <div>
            <Label htmlFor="store_address">Store Address</Label>
            <Textarea id="store_address" defaultValue="123 Craft Lane, Creative City, CC 12345" />
          </div>
          <Button style={{ backgroundColor: '#E28F84' }}>Save Store Information</Button>
        </CardContent>
      </Card>

      {/* Payment Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Payment Settings
          </CardTitle>
          <CardDescription>Configure payment processing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="square_app_id">Square Application ID</Label>
              <Input id="square_app_id" placeholder="Enter Square App ID" />
            </div>
            <div>
              <Label htmlFor="square_location_id">Square Location ID</Label>
              <Input id="square_location_id" placeholder="Enter Square Location ID" />
            </div>
          </div>
          <div>
            <Label htmlFor="payment_instructions">Payment Instructions</Label>
            <Textarea 
              id="payment_instructions" 
              placeholder="Special instructions for customers about payment..."
              rows={3}
            />
          </div>
          <Button style={{ backgroundColor: '#E28F84' }}>Save Payment Settings</Button>
        </CardContent>
      </Card>

      {/* Shipping Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Truck className="h-5 w-5 mr-2" />
            Shipping Settings
          </CardTitle>
          <CardDescription>Configure shipping zones and pricing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="domestic_shipping">Domestic Shipping Rate</Label>
              <Input id="domestic_shipping" type="number" step="0.01" placeholder="5.99" />
            </div>
            <div>
              <Label htmlFor="international_shipping">International Shipping Rate</Label>
              <Input id="international_shipping" type="number" step="0.01" placeholder="15.99" />
            </div>
            <div>
              <Label htmlFor="free_shipping_threshold">Free Shipping Threshold</Label>
              <Input id="free_shipping_threshold" type="number" step="0.01" placeholder="75.00" />
            </div>
            <div>
              <Label htmlFor="processing_time">Processing Time (days)</Label>
              <Input id="processing_time" type="number" placeholder="3-5" />
            </div>
          </div>
          <div>
            <Label htmlFor="shipping_policy">Shipping Policy</Label>
            <Textarea 
              id="shipping_policy" 
              placeholder="Describe your shipping policy..."
              rows={4}
            />
          </div>
          <Button style={{ backgroundColor: '#E28F84' }}>Save Shipping Settings</Button>
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            Email Settings
          </CardTitle>
          <CardDescription>Configure email notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="order_confirmation_template">Order Confirmation Email Template</Label>
            <Textarea 
              id="order_confirmation_template" 
              placeholder="Thank you for your order! Your order #{{order_id}} has been received..."
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="shipping_confirmation_template">Shipping Confirmation Template</Label>
            <Textarea 
              id="shipping_confirmation_template" 
              placeholder="Great news! Your order #{{order_id}} has shipped..."
              rows={4}
            />
          </div>
          <Button style={{ backgroundColor: '#E28F84' }}>Save Email Settings</Button>
        </CardContent>
      </Card>

      {/* Craft Show Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Craft Show Schedule
          </CardTitle>
          <CardDescription>Manage your craft show appearances</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="next_show_name">Next Show Name</Label>
              <Input id="next_show_name" placeholder="Spring Craft Fair" />
            </div>
            <div>
              <Label htmlFor="next_show_date">Show Date</Label>
              <Input id="next_show_date" type="date" />
            </div>
            <div>
              <Label htmlFor="show_location">Location</Label>
              <Input id="show_location" placeholder="Community Center, Main St" />
            </div>
            <div>
              <Label htmlFor="booth_number">Booth Number</Label>
              <Input id="booth_number" placeholder="A-15" />
            </div>
          </div>
          <div>
            <Label htmlFor="show_notes">Show Notes</Label>
            <Textarea 
              id="show_notes" 
              placeholder="Special preparations, new products to showcase..."
              rows={3}
            />
          </div>
          <Button style={{ backgroundColor: '#E28F84' }}>Save Show Information</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
