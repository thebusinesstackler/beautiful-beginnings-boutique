
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, Package, ShoppingCart, Users, AlertTriangle, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  lowStockProducts: number;
  recentOrders: any[];
  topProducts: any[];
}

const DashboardOverview = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    lowStockProducts: 0,
    recentOrders: [],
    topProducts: []
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch total revenue and orders
      const { data: orders } = await supabase
        .from('orders')
        .select('total_amount, status, created_at, customer_email')
        .order('created_at', { ascending: false });

      // Fetch products
      const { data: products } = await supabase
        .from('products')
        .select('*');

      // Fetch customers
      const { data: customers } = await supabase
        .from('customers')
        .select('*');

      const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
      const totalOrders = orders?.length || 0;
      const totalProducts = products?.length || 0;
      const totalCustomers = customers?.length || 0;
      const lowStockProducts = products?.filter(p => (p.inventory_quantity || 0) < 5).length || 0;
      const recentOrders = orders?.slice(0, 5) || [];

      setStats({
        totalRevenue,
        totalOrders,
        totalProducts,
        totalCustomers,
        lowStockProducts,
        recentOrders,
        topProducts: products?.slice(0, 5) || []
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard statistics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#5B4C37' }}>Dashboard Overview</h2>
        <p className="text-gray-600">Welcome to your Beautiful Beginnings admin panel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card style={{ backgroundColor: '#FAF5EF' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: '#5B4C37' }}>Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4" style={{ color: '#A89B84' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: '#5B4C37' }}>${stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs" style={{ color: '#A89B84' }}>All time earnings</p>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: '#F6DADA' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: '#5B4C37' }}>Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4" style={{ color: '#A89B84' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: '#5B4C37' }}>{stats.totalOrders}</div>
            <p className="text-xs" style={{ color: '#A89B84' }}>Orders received</p>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: '#FAF5EF' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: '#5B4C37' }}>Products</CardTitle>
            <Package className="h-4 w-4" style={{ color: '#A89B84' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: '#5B4C37' }}>{stats.totalProducts}</div>
            <p className="text-xs" style={{ color: '#A89B84' }}>In catalog</p>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: '#F6DADA' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: '#5B4C37' }}>Customers</CardTitle>
            <Users className="h-4 w-4" style={{ color: '#A89B84' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: '#5B4C37' }}>{stats.totalCustomers}</div>
            <p className="text-xs" style={{ color: '#A89B84' }}>Registered customers</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {stats.lowStockProducts > 0 && (
        <Card className="border-orange-200" style={{ backgroundColor: '#FFF8F0' }}>
          <CardHeader>
            <CardTitle className="flex items-center" style={{ color: '#B8860B' }}>
              <AlertTriangle className="h-5 w-5 mr-2" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p style={{ color: '#8B6914' }}>
              You have {stats.lowStockProducts} product(s) with low inventory (less than 5 items)
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card style={{ backgroundColor: '#FAF5EF' }}>
          <CardHeader>
            <CardTitle style={{ color: '#5B4C37' }}>Recent Orders</CardTitle>
            <CardDescription>Latest customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentOrders.map((order, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg" style={{ backgroundColor: 'white' }}>
                  <div>
                    <p className="font-medium">{order.customer_email}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${order.total_amount?.toFixed(2)}</p>
                    <Badge variant={order.status === 'fulfilled' ? 'default' : 'secondary'}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {stats.recentOrders.length === 0 && (
                <p className="text-gray-500 text-center py-4">No orders yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card style={{ backgroundColor: '#F6DADA' }}>
          <CardHeader>
            <CardTitle style={{ color: '#5B4C37' }}>Product Catalog</CardTitle>
            <CardDescription>Your current products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg" style={{ backgroundColor: 'white' }}>
                  <div className="flex items-center space-x-3">
                    {product.image_url && (
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    )}
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${product.price?.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">
                      Stock: {product.inventory_quantity || 0}
                    </p>
                  </div>
                </div>
              ))}
              {stats.topProducts.length === 0 && (
                <p className="text-gray-500 text-center py-4">No products yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
