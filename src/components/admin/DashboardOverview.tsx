
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

      const { data: products } = await supabase
        .from('products')
        .select('*');

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
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-sage border-t-transparent mx-auto mb-4"></div>
        <div className="text-charcoal">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-charcoal mb-2">Dashboard Overview</h2>
        <p className="text-stone">Your business at a glance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border-stone-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-charcoal">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-sage" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-charcoal">${stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-stone mt-1">All time earnings</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-stone-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-charcoal">Total Orders</CardTitle>
            <ShoppingCart className="h-5 w-5 text-terracotta" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-charcoal">{stats.totalOrders}</div>
            <p className="text-xs text-stone mt-1">Orders received</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-stone-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-charcoal">Products</CardTitle>
            <Package className="h-5 w-5 text-chocolate" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-charcoal">{stats.totalProducts}</div>
            <p className="text-xs text-stone mt-1">In catalog</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-stone-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-charcoal">Customers</CardTitle>
            <Users className="h-5 w-5 text-forest" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-charcoal">{stats.totalCustomers}</div>
            <p className="text-xs text-stone mt-1">Registered customers</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {stats.lowStockProducts > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center text-amber-800">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-amber-700">
              You have {stats.lowStockProducts} product(s) with low inventory (less than 5 items)
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <Card className="bg-white border-stone-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-charcoal">Recent Orders</CardTitle>
            <CardDescription className="text-stone">Latest customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentOrders.map((order, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-cream/30 rounded-lg border border-stone-100">
                  <div>
                    <p className="font-medium text-charcoal">{order.customer_email}</p>
                    <p className="text-sm text-stone">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-charcoal">${order.total_amount?.toFixed(2)}</p>
                    <Badge variant={order.status === 'fulfilled' ? 'default' : 'secondary'} className="mt-1">
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {stats.recentOrders.length === 0 && (
                <p className="text-stone text-center py-8">No orders yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="bg-white border-stone-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-charcoal">Product Catalog</CardTitle>
            <CardDescription className="text-stone">Your current products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-blush/20 rounded-lg border border-stone-100">
                  <div className="flex items-center space-x-3">
                    {product.image_url && (
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg border border-stone-200"
                      />
                    )}
                    <div>
                      <p className="font-medium text-charcoal">{product.name}</p>
                      <p className="text-sm text-stone">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-charcoal">${product.price?.toFixed(2)}</p>
                    <p className="text-sm text-stone">
                      Stock: {product.inventory_quantity || 0}
                    </p>
                  </div>
                </div>
              ))}
              {stats.topProducts.length === 0 && (
                <p className="text-stone text-center py-8">No products yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
