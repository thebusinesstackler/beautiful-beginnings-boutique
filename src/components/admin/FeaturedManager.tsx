import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Star, Award, Eye, EyeOff } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image_url: string;
  is_featured: boolean;
  is_bestseller: boolean;
  is_active: boolean;
}

const FeaturedManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, category, price, image_url, is_featured, is_bestseller, is_active')
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProductFlag = async (productId: string, field: 'is_featured' | 'is_bestseller', value: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ [field]: value })
        .eq('id', productId);

      if (error) throw error;

      setProducts(products.map(p => 
        p.id === productId ? { ...p, [field]: value } : p
      ));

      const fieldName = field === 'is_featured' ? 'Featured' : 'Bestseller';
      toast({
        title: "Success",
        description: `${fieldName} status updated`,
      });
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      toast({
        title: "Error",
        description: `Failed to update ${field}`,
        variant: "destructive",
      });
    }
  };

  const featuredProducts = products.filter(p => p.is_featured);
  const bestsellerProducts = products.filter(p => p.is_bestseller);

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#5B4C37' }}>Featured & Bestsellers</h2>
        <p className="text-gray-600">Manage featured products and bestsellers for homepage display</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card style={{ backgroundColor: '#FAF5EF' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: '#5B4C37' }}>Total Products</CardTitle>
            <Eye className="h-4 w-4" style={{ color: '#A89B84' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: '#5B4C37' }}>{products.length}</div>
            <p className="text-xs" style={{ color: '#A89B84' }}>Active products</p>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: '#F6DADA' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: '#5B4C37' }}>Featured</CardTitle>
            <Star className="h-4 w-4" style={{ color: '#A89B84' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: '#5B4C37' }}>{featuredProducts.length}</div>
            <p className="text-xs" style={{ color: '#A89B84' }}>Featured products</p>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: '#FAF5EF' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: '#5B4C37' }}>Bestsellers</CardTitle>
            <Award className="h-4 w-4" style={{ color: '#A89B84' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: '#5B4C37' }}>{bestsellerProducts.length}</div>
            <p className="text-xs" style={{ color: '#A89B84' }}>Bestseller products</p>
          </CardContent>
        </Card>
      </div>

      {/* All Products Management */}
      <Card style={{ backgroundColor: '#F6DADA' }}>
        <CardHeader>
          <CardTitle style={{ color: '#5B4C37' }}>Product Status Management</CardTitle>
          <CardDescription>Toggle featured and bestseller status for your products</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg" style={{ backgroundColor: 'white' }}>
                <div className="flex items-center space-x-4">
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  <div>
                    <h3 className="font-medium flex items-center space-x-2">
                      <span>{product.name}</span>
                      {product.is_featured && <Star className="h-4 w-4" style={{ color: '#E28F84' }} />}
                      {product.is_bestseller && <Award className="h-4 w-4" style={{ color: '#A9B28F' }} />}
                    </h3>
                    <p className="text-sm text-gray-500">{product.category}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm font-medium">${product.price?.toFixed(2)}</span>
                      <Badge variant={product.is_active ? "default" : "secondary"}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`featured-${product.id}`} className="text-sm" style={{ color: '#5B4C37' }}>
                      Featured
                    </Label>
                    <Switch
                      id={`featured-${product.id}`}
                      checked={product.is_featured}
                      onCheckedChange={(checked) => updateProductFlag(product.id, 'is_featured', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`bestseller-${product.id}`} className="text-sm" style={{ color: '#5B4C37' }}>
                      Bestseller
                    </Label>
                    <Switch
                      id={`bestseller-${product.id}`}
                      checked={product.is_bestseller}
                      onCheckedChange={(checked) => updateProductFlag(product.id, 'is_bestseller', checked)}
                    />
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

export default FeaturedManager;
