import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Package, Download, Eye, CheckCircle, Users, Image as ImageIcon, RefreshCw, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import OrderDetailsModal from './OrderDetailsModal';

interface Order {
  id: string;
  customer_email: string;
  customer_name: string;
  customer_phone: string;
  status: string;
  total_amount: number;
  created_at: string;
  uploaded_images: string[];
  personalization_data: any;
  shipping_address: any;
  billing_address: any;
  payment_id: string;
  square_order_id: string;
  tracking_number: string;
  notes: string;
  fulfilled_at: string;
  customer_id: string;
}

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [deleteConfirmOrder, setDeleteConfirmOrder] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      console.log('Fetching orders from database...');
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log('Fetched orders:', data);
      
      // Log image data for each order to help with debugging
      data?.forEach(order => {
        console.log(`Order ${order.id}:`, {
          uploaded_images: order.uploaded_images,
          uploaded_images_count: order.uploaded_images?.length || 0,
          personalization_data: order.personalization_data,
          has_personalization_uploadedImages: !!(order.personalization_data && 
            typeof order.personalization_data === 'object' && 
            order.personalization_data !== null && 
            'uploadedImages' in order.personalization_data)
        });
      });
      
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
        order.id === orderId ? { ...order, status: newStatus, ...updateData } : order
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

  const deleteOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) throw error;

      // Remove from local state
      setOrders(orders.filter(order => order.id !== orderId));
      setDeleteConfirmOrder(null);

      toast({
        title: "Success",
        description: "Order deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting order:', error);
      toast({
        title: "Error",
        description: "Failed to delete order",
        variant: "destructive",
      });
    }
  };

  const syncSquareOrders = async () => {
    setIsSyncing(true);
    try {
      console.log('🔄 Starting Square orders sync...');
      
      const { data, error } = await supabase.functions.invoke('sync-square-orders', {});
      
      if (error) throw error;
      
      console.log('✅ Sync completed:', data);
      
      toast({
        title: "Success",
        description: `${data.syncedCount} missing orders synced from Square`,
      });
      
      // Refresh orders after sync
      fetchOrders();
      
    } catch (error) {
      console.error('❌ Sync error:', error);
      toast({
        title: "Error",
        description: "Failed to sync orders from Square",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const exportOrders = () => {
    const csvContent = [
      ['Order ID', 'Customer ID', 'Customer Email', 'Customer Name', 'Status', 'Amount', 'Date', 'Has Images'],
      ...orders.map(order => [
        order.id,
        order.customer_id || '',
        order.customer_email,
        order.customer_name || '',
        order.status,
        order.total_amount,
        new Date(order.created_at).toLocaleDateString(),
        getAllOrderImages(order).length > 0 ? 'Yes' : 'No'
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

  const handleViewOrder = (order: Order) => {
    console.log('Viewing order:', order);
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const getAllOrderImages = (order: Order) => {
    const images = [];
    
    if (order.uploaded_images && Array.isArray(order.uploaded_images)) {
      order.uploaded_images.forEach(imageUrl => {
        if (imageUrl && typeof imageUrl === 'string') {
          images.push(imageUrl);
        }
      });
    }
    
    if (order.personalization_data && 
        typeof order.personalization_data === 'object' && 
        order.personalization_data !== null) {
      
      const personalizationData = order.personalization_data as Record<string, any>;
      
      if (personalizationData.uploadedImages && Array.isArray(personalizationData.uploadedImages)) {
        personalizationData.uploadedImages.forEach((imageUrl: string) => {
          if (imageUrl && typeof imageUrl === 'string') {
            images.push(imageUrl);
          }
        });
      }
      
      if (personalizationData.items && Array.isArray(personalizationData.items)) {
        personalizationData.items.forEach((item: any) => {
          if (item.uploadedPhotoUrl && typeof item.uploadedPhotoUrl === 'string') {
            images.push(item.uploadedPhotoUrl);
          }
        });
      }
    }
    
    if (Array.isArray(order.personalization_data)) {
      order.personalization_data.forEach((item: any) => {
        if (item.uploadedPhotoUrl && typeof item.uploadedPhotoUrl === 'string') {
          images.push(item.uploadedPhotoUrl);
        }
      });
    }
    
    return [...new Set(images)];
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    paid: orders.filter(o => o.status === 'paid').length,
    fulfilled: orders.filter(o => o.status === 'fulfilled').length,
    revenue: orders.reduce((sum, order) => sum + (order.total_amount || 0), 0),
    uniqueCustomers: new Set(orders.filter(o => o.customer_id).map(o => o.customer_id)).size,
    withImages: orders.filter(o => getAllOrderImages(o).length > 0).length
  };

  if (loading) {
    return <div className="text-center py-8">Loading orders...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-charcoal mb-2">Order Management</h2>
          <p className="text-stone text-sm sm:text-base">View and manage customer orders with uploaded photos. Sync missing orders from Square.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={syncSquareOrders} 
            variant="outline" 
            disabled={isSyncing}
            className="border-sage text-sage hover:bg-sage/10 w-full sm:w-auto"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync Square Orders'}
          </Button>
          <Button onClick={exportOrders} variant="outline" className="border-stone text-charcoal hover:bg-cream/50 w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
        <Card className="bg-cream/50 border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-charcoal">Total Orders</CardTitle>
            <Package className="h-3 w-3 sm:h-4 sm:w-4 text-stone" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-charcoal">{orderStats.total}</div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-charcoal">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-orange-600">{orderStats.pending}</div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-charcoal">Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-blue-600">{orderStats.paid}</div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-charcoal">Fulfilled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-green-600">{orderStats.fulfilled}</div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-charcoal">Customers</CardTitle>
            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-stone" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-purple-600">{orderStats.uniqueCustomers}</div>
          </CardContent>
        </Card>

        <Card className="bg-pink-50 border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-charcoal">With Images</CardTitle>
            <ImageIcon className="h-3 w-3 sm:h-4 sm:w-4 text-stone" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-pink-600">{orderStats.withImages}</div>
          </CardContent>
        </Card>

        <Card className="bg-blush/30 border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-charcoal">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-charcoal">${orderStats.revenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Controls */}
      <Card className="bg-cream/30 border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-charcoal text-sm sm:text-base">Filter Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-[200px]">
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
      <Card className="bg-blush/20 border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-charcoal text-sm sm:text-base">Orders ({filteredOrders.length})</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Manage customer orders and fulfillment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {filteredOrders.map((order) => {
              const orderImages = getAllOrderImages(order);
              
              return (
                <div key={order.id} className="border rounded-lg p-3 sm:p-4 bg-white shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 sm:mb-4 gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-charcoal text-sm sm:text-base">Order #{order.id}</h3>
                      <p className="text-xs sm:text-sm text-stone truncate">{order.customer_email}</p>
                      {order.customer_name && (
                        <p className="text-xs sm:text-sm text-stone">{order.customer_name}</p>
                      )}
                      {order.customer_id && (
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            <Users className="h-3 w-3 mr-1" />
                            Customer ID: {order.customer_id.slice(0, 8)}
                          </Badge>
                        </div>
                      )}
                      <p className="text-xs sm:text-sm text-stone">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-base sm:text-lg text-charcoal">${order.total_amount?.toFixed(2)}</p>
                      <Badge variant={
                        order.status === 'fulfilled' ? 'default' :
                        order.status === 'paid' ? 'secondary' :
                        order.status === 'pending' ? 'outline' : 'destructive'
                      }>
                        {order.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Enhanced Customer Images Preview */}
                  {orderImages.length > 0 && (
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t bg-blue-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-3">
                        <ImageIcon className="h-4 w-4 text-blue-600" />
                        <p className="text-xs sm:text-sm font-medium text-blue-800">
                          Customer Images ({orderImages.length})
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {orderImages.slice(0, 4).map((imageUrl, index) => (
                          <div key={index} className="relative">
                            <img
                              src={imageUrl}
                              alt={`Customer upload ${index + 1}`}
                              className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => handleViewOrder(order)}
                              onError={(e) => {
                                console.error('Failed to load image:', imageUrl);
                                e.currentTarget.style.display = 'none';
                              }}
                              onLoad={() => console.log('Thumbnail loaded:', imageUrl)}
                            />
                          </div>
                        ))}
                        {orderImages.length > 4 && (
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-500">
                            +{orderImages.length - 4}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Order Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mt-3 sm:mt-4">
                    <div className="flex flex-wrap items-center gap-2">
                      {orderImages.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          <ImageIcon className="h-3 w-3 mr-1" />
                          {orderImages.length} image(s)
                        </Badge>
                      )}
                      {order.personalization_data && (
                        <Badge variant="outline" className="text-xs">Personalized</Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewOrder(order)}
                        className="border-sage text-sage hover:bg-sage/10 text-xs sm:text-sm"
                      >
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        View Details
                      </Button>
                      {order.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateOrderStatus(order.id, 'paid')}
                          className="border-stone text-charcoal hover:bg-cream/50 text-xs sm:text-sm"
                        >
                          Mark Paid
                        </Button>
                      )}
                      {order.status === 'paid' && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, 'fulfilled')}
                          className="bg-sage hover:bg-sage/90 text-white text-xs sm:text-sm"
                        >
                          <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          Fulfill
                        </Button>
                       )}
                       <Button
                         size="sm"
                         variant="outline"
                         onClick={() => setDeleteConfirmOrder(order.id)}
                         className="border-red-300 text-red-600 hover:bg-red-50 text-xs sm:text-sm"
                       >
                         <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                         Delete
                       </Button>
                     </div>
                  </div>
                </div>
              );
            })}
            {filteredOrders.length === 0 && (
              <p className="text-center py-6 sm:py-8 text-stone text-sm sm:text-base">No orders found</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={closeModal}
      />

      {/* Delete Confirmation Dialog */}
      {deleteConfirmOrder && (
        <Dialog open={!!deleteConfirmOrder} onOpenChange={() => setDeleteConfirmOrder(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Order</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this order? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteConfirmOrder(null)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => deleteOrder(deleteConfirmOrder)}
              >
                Delete Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default OrderManagement;
