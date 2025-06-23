
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Package, Edit } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface Product {
  id: string;
  name: string;
  category: string;
  inventory_quantity: number;
  is_active: boolean;
  backorder_allowed: boolean;
  price: number;
  image_url: string;
}

const InventoryManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStock, setEditingStock] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, category, inventory_quantity, is_active, backorder_allowed, price, image_url')
        .order('inventory_quantity', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch inventory",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (productId: string, newQuantity: number) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ inventory_quantity: newQuantity })
        .eq('id', productId);

      if (error) throw error;

      setProducts(products.map(p => 
        p.id === productId ? { ...p, inventory_quantity: newQuantity } : p
      ));

      toast({
        title: "Success",
        description: "Stock quantity updated",
      });
    } catch (error) {
      console.error('Error updating stock:', error);
      toast({
        title: "Error",
        description: "Failed to update stock",
        variant: "destructive",
      });
    }
  };

  const toggleBackorder = async (productId: string, allowBackorder: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ backorder_allowed: allowBackorder })
        .eq('id', productId);

      if (error) throw error;

      setProducts(products.map(p => 
        p.id === productId ? { ...p, backorder_allowed: allowBackorder } : p
      ));

      toast({
        title: "Success",
        description: `Backorder ${allowBackorder ? 'enabled' : 'disabled'}`,
      });
    } catch (error) {
      console.error('Error updating backorder setting:', error);
      toast({
        title: "Error",
        description: "Failed to update backorder setting",
        variant: "destructive",
      });
    }
  };

  const handleStockEdit = (productId: string, value: string) => {
    setEditingStock({ ...editingStock, [productId]: value });
  };

  const handleStockUpdate = (productId: string) => {
    const newQuantity = parseInt(editingStock[productId]) || 0;
    updateStock(productId, newQuantity);
    setEditingStock({ ...editingStock, [productId]: '' });
  };

  const lowStockProducts = products.filter(p => p.inventory_quantity < 5);
  const outOfStockProducts = products.filter(p => p.inventory_quantity === 0);

  if (loading) {
    return <div className="text-center py-8">Loading inventory...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-charcoal mb-2">Inventory Management</h2>
        <p className="text-stone">Monitor and manage your product inventory levels</p>
      </div>

      {/* Inventory Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-cream/50 shadow-sm border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-charcoal">Total Products</CardTitle>
            <Package className="h-4 w-4 text-stone" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-charcoal">{products.length}</div>
            <p className="text-xs text-stone">In inventory</p>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 shadow-sm border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800">{lowStockProducts.length}</div>
            <p className="text-xs text-orange-700">Less than 5 items</p>
          </CardContent>
        </Card>

        <Card className="bg-red-50 shadow-sm border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800">{outOfStockProducts.length}</div>
            <p className="text-xs text-red-700">0 items remaining</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <Card className="bg-orange-50 shadow-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-800">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Low Stock Alert
            </CardTitle>
            <CardDescription>These products need restocking soon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-orange-100/50 rounded-lg border-0">
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
                  <Badge variant="destructive">
                    {product.inventory_quantity} left
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Products Inventory */}
      <Card className="bg-blush/20 shadow-sm border-0">
        <CardHeader>
          <CardTitle className="text-charcoal">Product Inventory</CardTitle>
          <CardDescription>Manage stock levels for all products</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4 rounded-lg bg-white shadow-sm border-0">
                <div className="flex items-center space-x-4">
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  <div>
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.category}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge 
                        variant={product.inventory_quantity === 0 ? "destructive" : 
                                product.inventory_quantity < 5 ? "secondary" : "default"}
                      >
                        Stock: {product.inventory_quantity}
                      </Badge>
                      <span className="text-sm text-gray-500">${product.price?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`backorder-${product.id}`} className="text-sm">
                      Allow Backorder
                    </Label>
                    <Switch
                      id={`backorder-${product.id}`}
                      checked={product.backorder_allowed}
                      onCheckedChange={(checked) => toggleBackorder(product.id, checked)}
                      className="data-[state=checked]:bg-sage data-[state=unchecked]:bg-stone/30 border-0 focus:ring-sage focus-visible:ring-sage"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      min="0"
                      className="w-20 border-stone/30 focus:border-sage focus:ring-sage"
                      value={editingStock[product.id] || product.inventory_quantity}
                      onChange={(e) => handleStockEdit(product.id, e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleStockUpdate(product.id);
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStockUpdate(product.id)}
                      disabled={!editingStock[product.id] || editingStock[product.id] === product.inventory_quantity.toString()}
                      className="border-stone text-charcoal hover:bg-cream/50 border-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {products.length === 0 && (
              <p className="text-center py-8 text-gray-500">No products found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryManagement;
