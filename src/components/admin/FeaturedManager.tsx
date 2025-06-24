
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Star, Award, Eye, ArrowUp, ArrowDown, Calendar } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image_url: string;
  gallery_images: string[];
  is_featured: boolean;
  is_bestseller: boolean;
  is_active: boolean;
  featured_order: number;
  featured_until: string;
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
        .select('id, name, category, price, image_url, gallery_images, is_featured, is_bestseller, is_active, featured_order, featured_until')
        .order('featured_order', { ascending: true });

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
      let updateData: any = { [field]: value };
      
      // If setting as featured, assign next featured_order
      if (field === 'is_featured' && value) {
        const maxOrder = Math.max(...products.filter(p => p.is_featured).map(p => p.featured_order), 0);
        updateData.featured_order = maxOrder + 1;
      }
      
      // If removing from featured, reset featured_order
      if (field === 'is_featured' && !value) {
        updateData.featured_order = 0;
        updateData.featured_until = null;
      }

      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', productId);

      if (error) throw error;

      // Re-fetch to get updated order
      fetchProducts();

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

  const updateFeaturedOrder = async (productId: string, direction: 'up' | 'down') => {
    const featuredProducts = products
      .filter(p => p.is_featured)
      .sort((a, b) => a.featured_order - b.featured_order);
    
    const currentIndex = featuredProducts.findIndex(p => p.id === productId);
    if (currentIndex === -1) return;

    let newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= featuredProducts.length) return;

    const currentProduct = featuredProducts[currentIndex];
    const swapProduct = featuredProducts[newIndex];

    try {
      await supabase
        .from('products')
        .update({ featured_order: swapProduct.featured_order })
        .eq('id', currentProduct.id);

      await supabase
        .from('products')
        .update({ featured_order: currentProduct.featured_order })
        .eq('id', swapProduct.id);

      fetchProducts();
      toast({
        title: "Success",
        description: "Featured order updated",
      });
    } catch (error) {
      console.error('Error updating featured order:', error);
      toast({
        title: "Error",
        description: "Failed to update featured order",
        variant: "destructive",
      });
    }
  };

  const updateFeaturedUntil = async (productId: string, date: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ featured_until: date || null })
        .eq('id', productId);

      if (error) throw error;

      setProducts(products.map(p => 
        p.id === productId ? { ...p, featured_until: date } : p
      ));

      toast({
        title: "Success",
        description: "Featured expiry date updated",
      });
    } catch (error) {
      console.error('Error updating featured until:', error);
      toast({
        title: "Error",
        description: "Failed to update featured expiry",
        variant: "destructive",
      });
    }
  };

  const getProductImage = (product: Product) => {
    return product.image_url || (product.gallery_images && product.gallery_images[0]) || null;
  };

  const featuredProducts = products.filter(p => p.is_featured).sort((a, b) => a.featured_order - b.featured_order);
  const bestsellerProducts = products.filter(p => p.is_bestseller);

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-charcoal mb-2">Featured & Bestsellers</h2>
        <p className="text-stone">Manage featured products and bestsellers for homepage display</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-cream/50 border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-charcoal">Total Products</CardTitle>
            <Eye className="h-4 w-4 text-stone" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-charcoal">{products.length}</div>
            <p className="text-xs text-stone">Active products</p>
          </CardContent>
        </Card>

        <Card className="bg-blush/30 border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-charcoal">Featured</CardTitle>
            <Star className="h-4 w-4 text-stone" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-charcoal">{featuredProducts.length}</div>
            <p className="text-xs text-stone">Homepage featured</p>
          </CardContent>
        </Card>

        <Card className="bg-cream/50 border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-charcoal">Bestsellers</CardTitle>
            <Award className="h-4 w-4 text-stone" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-charcoal">{bestsellerProducts.length}</div>
            <p className="text-xs text-stone">Bestseller products</p>
          </CardContent>
        </Card>
      </div>

      {/* Featured Products Order Management */}
      {featuredProducts.length > 0 && (
        <Card className="bg-cream/30 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-charcoal">Featured Products Order</CardTitle>
            <CardDescription>Drag or use arrows to reorder how products appear on homepage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {featuredProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col items-center space-y-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateFeaturedOrder(product.id, 'up')}
                        disabled={index === 0}
                        className="p-1"
                      >
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                      <span className="text-xs font-bold bg-terracotta text-white px-2 py-1 rounded">
                        #{index + 1}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateFeaturedOrder(product.id, 'down')}
                        disabled={index === featuredProducts.length - 1}
                        className="p-1"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                    </div>
                    {getProductImage(product) && (
                      <img
                        src={getProductImage(product)}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-500">{product.category}</p>
                      <span className="text-sm font-medium">${product.price?.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <Input
                        type="date"
                        value={product.featured_until ? product.featured_until.split('T')[0] : ''}
                        onChange={(e) => updateFeaturedUntil(product.id, e.target.value)}
                        className="w-32 text-xs"
                        placeholder="Never expires"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Products Management */}
      <Card className="bg-blush/20 border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-charcoal">Product Status Management</CardTitle>
          <CardDescription>Toggle featured and bestseller status for your products</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm">
                <div className="flex items-center space-x-4">
                  {getProductImage(product) && (
                    <img
                      src={getProductImage(product)}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  <div>
                    <h3 className="font-medium flex items-center space-x-2">
                      <span>{product.name}</span>
                      {product.is_featured && <Star className="h-4 w-4 text-terracotta" />}
                      {product.is_bestseller && <Award className="h-4 w-4 text-sage" />}
                    </h3>
                    <p className="text-sm text-gray-500">{product.category}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm font-medium">${product.price?.toFixed(2)}</span>
                      <Badge variant={product.is_active ? "default" : "secondary"}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      {product.is_featured && (
                        <Badge className="bg-terracotta text-white">
                          Featured #{product.featured_order}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`featured-${product.id}`} className="text-sm text-charcoal">
                      Featured
                    </Label>
                    <Switch
                      id={`featured-${product.id}`}
                      checked={product.is_featured}
                      onCheckedChange={(checked) => updateProductFlag(product.id, 'is_featured', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`bestseller-${product.id}`} className="text-sm text-charcoal">
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
