
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Users, Mail, Download, Search, Plus, RefreshCw } from 'lucide-react';

interface Customer {
  id: string;
  email: string;
  name: string;
  phone: string;
  total_orders: number;
  total_spent: number;
  newsletter_subscribed: boolean;
  created_at: string;
}

const CustomerManagement = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    email: '',
    name: '',
    phone: '',
    newsletter_subscribed: false
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      console.log('Fetching customers...');
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('total_spent', { ascending: false });

      if (error) {
        console.error('Error fetching customers:', error);
        throw error;
      }
      
      console.log('Customers fetched:', data);
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch customers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = async () => {
    if (!newCustomer.email) {
      toast({
        title: "Error",
        description: "Email is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('customers')
        .insert([{
          email: newCustomer.email,
          name: newCustomer.name || null,
          phone: newCustomer.phone || null,
          newsletter_subscribed: newCustomer.newsletter_subscribed
        }])
        .select();

      if (error) throw error;

      setCustomers([...customers, ...data]);
      setNewCustomer({ email: '', name: '', phone: '', newsletter_subscribed: false });
      setIsAddingCustomer(false);
      toast({
        title: "Success",
        description: "Customer added successfully",
      });
    } catch (error) {
      console.error('Error adding customer:', error);
      toast({
        title: "Error",
        description: "Failed to add customer",
        variant: "destructive",
      });
    }
  };

  const exportCustomers = () => {
    const csvContent = [
      ['Email', 'Name', 'Phone', 'Total Orders', 'Total Spent', 'Newsletter', 'Join Date'],
      ...customers.map(customer => [
        customer.email,
        customer.name || '',
        customer.phone || '',
        customer.total_orders || 0,
        customer.total_spent || 0,
        customer.newsletter_subscribed ? 'Yes' : 'No',
        new Date(customer.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customers.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportNewsletterSubscribers = () => {
    const subscribers = customers.filter(c => c.newsletter_subscribed);
    const csvContent = [
      ['Email', 'Name'],
      ...subscribers.map(customer => [customer.email, customer.name || ''])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'newsletter_subscribers.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredCustomers = customers.filter(customer =>
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.name && customer.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const customerStats = {
    total: customers.length,
    newsletter: customers.filter(c => c.newsletter_subscribed).length,
    highValue: customers.filter(c => (c.total_spent || 0) > 100).length,
    totalRevenue: customers.reduce((sum, customer) => sum + (customer.total_spent || 0), 0)
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-sage" />
        <p className="text-charcoal">Loading customers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-2">Customer Management</h2>
          <p className="text-stone">View and manage your customer base</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={fetchCustomers} variant="outline" className="border-stone text-charcoal hover:bg-cream/50">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={isAddingCustomer} onOpenChange={setIsAddingCustomer}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-sage text-sage hover:bg-sage/10">
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
                <DialogDescription>
                  Add a new customer to your database manually.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    placeholder="customer@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    placeholder="Customer Name"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="newsletter"
                    checked={newCustomer.newsletter_subscribed}
                    onCheckedChange={(checked) => 
                      setNewCustomer({ ...newCustomer, newsletter_subscribed: checked as boolean })
                    }
                  />
                  <Label htmlFor="newsletter">Subscribe to newsletter</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingCustomer(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCustomer} className="bg-sage hover:bg-sage/90 text-white">
                  Add Customer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button onClick={exportNewsletterSubscribers} variant="outline" className="border-stone text-charcoal hover:bg-cream/50">
            <Mail className="h-4 w-4 mr-2" />
            Export Newsletter
          </Button>
          <Button onClick={exportCustomers} variant="outline" className="border-stone text-charcoal hover:bg-cream/50">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-cream/50 border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-charcoal">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-stone" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-charcoal">{customerStats.total}</div>
          </CardContent>
        </Card>

        <Card className="bg-blush/30 border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-charcoal">Newsletter Subscribers</CardTitle>
            <Mail className="h-4 w-4 text-stone" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-charcoal">{customerStats.newsletter}</div>
            <p className="text-xs text-stone">
              {customerStats.total > 0 ? Math.round((customerStats.newsletter / customerStats.total) * 100) : 0}% of customers
            </p>
          </CardContent>
        </Card>

        <Card className="bg-cream/50 border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-charcoal">High-Value Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-charcoal">{customerStats.highValue}</div>
            <p className="text-xs text-stone">Spent over $100</p>
          </CardContent>
        </Card>

        <Card className="bg-blush/30 border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-charcoal">Customer Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-charcoal">${customerStats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-stone">Total customer value</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="bg-cream/30 border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-charcoal">Search Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-stone" />
            <Input
              placeholder="Search by email or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers List */}
      <Card className="bg-blush/20 border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-charcoal">Customers ({filteredCustomers.length})</CardTitle>
          <CardDescription>Customer database and order history</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCustomers.length === 0 && !loading ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-stone mx-auto mb-4" />
              <p className="text-stone text-lg mb-2">No customers found</p>
              <p className="text-stone/70 text-sm mb-4">
                {customers.length === 0 
                  ? "Customers will appear here automatically when orders are placed, or you can add them manually."
                  : "Try adjusting your search terms."
                }
              </p>
              {customers.length === 0 && (
                <Button 
                  onClick={() => setIsAddingCustomer(true)}
                  className="bg-sage hover:bg-sage/90 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Customer
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCustomers.map((customer) => (
                <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm">
                  <div>
                    <h3 className="font-medium text-charcoal">{customer.email}</h3>
                    {customer.name && (
                      <p className="text-sm text-stone">{customer.name}</p>
                    )}
                    {customer.phone && (
                      <p className="text-sm text-stone">{customer.phone}</p>
                    )}
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="outline">
                        {customer.total_orders || 0} orders
                      </Badge>
                      <Badge variant="outline">
                        ${(customer.total_spent || 0).toFixed(2)} spent
                      </Badge>
                      {customer.newsletter_subscribed && (
                        <Badge variant="default">Newsletter</Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-stone">
                      Joined {new Date(customer.created_at).toLocaleDateString()}
                    </p>
                    {(customer.total_spent || 0) > 100 && (
                      <Badge variant="secondary" className="mt-1">High Value</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerManagement;
