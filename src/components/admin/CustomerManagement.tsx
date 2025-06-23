import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Users, Mail, Download, Search } from 'lucide-react';

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
  const { toast } = useToast();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('total_spent', { ascending: false });

      if (error) throw error;
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
    return <div className="text-center py-8">Loading customers...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#5B4C37' }}>Customer Management</h2>
          <p className="text-gray-600">View and manage your customer base</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={exportNewsletterSubscribers} variant="outline" style={{ borderColor: '#A89B84', color: '#5B4C37' }}>
            <Mail className="h-4 w-4 mr-2" />
            Export Newsletter
          </Button>
          <Button onClick={exportCustomers} variant="outline" style={{ borderColor: '#A89B84', color: '#5B4C37' }}>
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card style={{ backgroundColor: '#FAF5EF' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: '#5B4C37' }}>Total Customers</CardTitle>
            <Users className="h-4 w-4" style={{ color: '#A89B84' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: '#5B4C37' }}>{customerStats.total}</div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: '#F6DADA' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: '#5B4C37' }}>Newsletter Subscribers</CardTitle>
            <Mail className="h-4 w-4" style={{ color: '#A89B84' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: '#5B4C37' }}>{customerStats.newsletter}</div>
            <p className="text-xs" style={{ color: '#A89B84' }}>
              {customerStats.total > 0 ? Math.round((customerStats.newsletter / customerStats.total) * 100) : 0}% of customers
            </p>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: '#FAF5EF' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: '#5B4C37' }}>High-Value Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: '#5B4C37' }}>{customerStats.highValue}</div>
            <p className="text-xs" style={{ color: '#A89B84' }}>Spent over $100</p>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: '#F6DADA' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: '#5B4C37' }}>Customer Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: '#5B4C37' }}>${customerStats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs" style={{ color: '#A89B84' }}>Total customer value</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card style={{ backgroundColor: '#FAF5EF' }}>
        <CardHeader>
          <CardTitle style={{ color: '#5B4C37' }}>Search Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
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
      <Card style={{ backgroundColor: '#F6DADA' }}>
        <CardHeader>
          <CardTitle style={{ color: '#5B4C37' }}>Customers ({filteredCustomers.length})</CardTitle>
          <CardDescription>Customer database and order history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCustomers.map((customer) => (
              <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{customer.email}</h3>
                  {customer.name && (
                    <p className="text-sm text-gray-600">{customer.name}</p>
                  )}
                  {customer.phone && (
                    <p className="text-sm text-gray-500">{customer.phone}</p>
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
                  <p className="text-sm text-gray-500">
                    Joined {new Date(customer.created_at).toLocaleDateString()}
                  </p>
                  {(customer.total_spent || 0) > 100 && (
                    <Badge variant="secondary" className="mt-1">High Value</Badge>
                  )}
                </div>
              </div>
            ))}
            {filteredCustomers.length === 0 && (
              <p className="text-center py-8 text-gray-500">No customers found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerManagement;
