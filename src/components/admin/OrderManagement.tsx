import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Package, Download, Eye, CheckCircle } from 'lucide-react';

interface Order {
  id: string;
  customer_email: string;
  customer_name: string;
  status: string;
  total_amount: number;
  created_at: string;
  uploaded_images: string[];
  personalization_data: any;
}

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const updateData: any = { status: newStatus };
      if (newStatus === 'fulfilled') {
        updateData.fulfilled_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);

      if (error) throw error;

      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));

      toast({
        title: "Success",
        description: `Order status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const exportOrders = () => {
    const csvContent = [
      ['Order ID', 'Customer Email', 'Customer Name', 'Status', 'Amount', 'Date'],
      ...orders.map(order => [
        order.id,
        order.customer_email,
        order.customer_name || '',
        order.status,
        order.total_amount,
        new Date(order.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    paid: orders.filter(o => o.status === 'paid').length,
    fulfilled: orders.filter(o => o.status === 'fulfilled').length,
    revenue: orders.reduce((sum, order) => sum + (order.total_amount || 0), 0)
  };

  if (loading) {
    return <div className="text-center py-8">Loading orders...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#5B4C37' }}>Order Management</h2>
          <p className="text-gray-600">View and manage customer orders</p>
        </div>
        <Button onClick={exportOrders} variant="outline" style={{ borderColor: '#A89B84', color: '#5B4C37' }}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card style={{ backgroundColor: '#FAF5EF' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: '#5B4C37' }}>Total Orders</CardTitle>
            <Package className="h-4 w-4" style={{ color: '#A89B84' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: '#5B4C37' }}>{orderStats.total}</div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: '#FFF8F0' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: '#5B4C37' }}>Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: '#E6A23C' }}>{orderStats.pending}</div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: '#F0F8FF' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: '#5B4C37' }}>Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: '#4F8AC7' }}>{orderStats.paid}</div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: '#F0FDF4' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: '#5B4C37' }}>Fulfilled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: '#16A34A' }}>{orderStats.fulfilled}</div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: '#F6DADA' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: '#5B4C37' }}>Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: '#5B4C37' }}>${orderStats.revenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Controls */}
      <Card style={{ backgroundColor: '#FAF5EF' }}>
        <CardHeader>
          <CardTitle style={{ color: '#5B4C37' }}>Filter Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="fulfilled">Fulfilled</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Orders List */}
      <Card style={{ backgroundColor: '#F6DADA' }}>
        <CardHeader>
          <CardTitle style={{ color: '#5B4C37' }}>Orders ({filteredOrders.length})</CardTitle>
          <CardDescription>Manage customer orders and fulfillment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4" style={{ backgroundColor: 'white' }}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium">Order #{order.id.slice(0, 8)}</h3>
                    <p className="text-sm text-gray-500">{order.customer_email}</p>
                    {order.customer_name && (
                      <p className="text-sm text-gray-500">{order.customer_name}</p>
                    )}
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-lg">${order.total_amount?.toFixed(2)}</p>
                    <Badge variant={
                      order.status === 'fulfilled' ? 'default' :
                      order.status === 'paid' ? 'secondary' :
                      order.status === 'pending' ? 'outline' : 'destructive'
                    }>
                      {order.status}
                    </Badge>
                  </div>
                </div>

                {/* Order Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {order.uploaded_images && order.uploaded_images.length > 0 && (
                      <Badge variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        {order.uploaded_images.length} image(s)
                      </Badge>
                    )}
                    {order.personalization_data && (
                      <Badge variant="outline">Personalized</Badge>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    {order.status === 'pending' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateOrderStatus(order.id, 'paid')}
                        style={{ borderColor: '#A89B84', color: '#5B4C37' }}
                      >
                        Mark Paid
                      </Button>
                    )}
                    {order.status === 'paid' && (
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, 'fulfilled')}
                        style={{ backgroundColor: '#E28F84' }}
                        className="text-white hover:opacity-90"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Fulfill
                      </Button>
                    )}
                  </div>
                </div>

                {/* Customer Images */}
                {order.uploaded_images && order.uploaded_images.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Customer Images:</p>
                    <div className="flex space-x-2">
                      {order.uploaded_images.map((imageUrl, index) => (
                        <img
                          key={index}
                          src={imageUrl}
                          alt={`Customer upload ${index + 1}`}
                          className="w-16 h-16 object-cover rounded border cursor-pointer"
                          onClick={() => window.open(imageUrl, '_blank')}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {filteredOrders.length === 0 && (
              <p className="text-center py-8 text-gray-500">No orders found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderManagement;
