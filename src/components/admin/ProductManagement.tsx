import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Star, Award } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  sku: string;
  inventory_quantity: number;
  shipping_weight: number;
  shipping_time_days: number;
  tags: string[];
  is_active: boolean;
  is_featured: boolean;
  is_bestseller: boolean;
  backorder_allowed: boolean;
  image_url: string;
  images: string[];
  personalization_options: any;
}

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    sku: '',
    inventory_quantity: '',
    shipping_weight: '',
    shipping_time_days: '',
    tags: '',
    is_active: true,
    is_featured: false,
    is_bestseller: false,
    backorder_allowed: false,
    image_url: '',
    personalization_options: '{}'
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

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

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        sku: formData.sku,
        inventory_quantity: parseInt(formData.inventory_quantity) || 0,
        shipping_weight: parseFloat(formData.shipping_weight) || null,
        shipping_time_days: parseInt(formData.shipping_time_days) || null,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        is_active: formData.is_active,
        is_featured: formData.is_featured,
        is_bestseller: formData.is_bestseller,
        backorder_allowed: formData.backorder_allowed,
        image_url: formData.image_url,
        personalization_options: formData.personalization_options ? JSON.parse(formData.personalization_options) : null
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;
        toast({ title: "Success", description: "Product updated successfully" });
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;
        toast({ title: "Success", description: "Product created successfully" });
      }

      setShowForm(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price?.toString() || '',
      category: product.category,
      sku: product.sku || '',
      inventory_quantity: product.inventory_quantity?.toString() || '0',
      shipping_weight: product.shipping_weight?.toString() || '',
      shipping_time_days: product.shipping_time_days?.toString() || '',
      tags: product.tags?.join(', ') || '',
      is_active: product.is_active,
      is_featured: product.is_featured || false,
      is_bestseller: product.is_bestseller || false,
      backorder_allowed: product.backorder_allowed || false,
      image_url: product.image_url || '',
      personalization_options: JSON.stringify(product.personalization_options || {})
    });
    setShowForm(true);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      toast({ title: "Success", description: "Product deleted successfully" });
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      sku: '',
      inventory_quantity: '',
      shipping_weight: '',
      shipping_time_days: '',
      tags: '',
      is_active: true,
      is_featured: false,
      is_bestseller: false,
      backorder_allowed: false,
      image_url: '',
      personalization_options: '{}'
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#5B4C37' }}>Product Management</h2>
          <p className="text-gray-600">Add, edit, and manage your product catalog</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          style={{ backgroundColor: '#E28F84' }}
          className="hover:opacity-90 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {showForm && (
        <Card style={{ backgroundColor: '#FAF5EF' }}>
          <CardHeader>
            <CardTitle style={{ color: '#5B4C37' }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</CardTitle>
            <CardDescription>
              {editingProduct ? 'Update product information' : 'Create a new product listing'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.slug}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="inventory_quantity">Inventory Quantity</Label>
                  <Input
                    id="inventory_quantity"
                    type="number"
                    value={formData.inventory_quantity}
                    onChange={(e) => setFormData({ ...formData, inventory_quantity: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="shipping_weight">Shipping Weight (lbs)</Label>
                  <Input
                    id="shipping_weight"
                    type="number"
                    step="0.1"
                    value={formData.shipping_weight}
                    onChange={(e) => setFormData({ ...formData, shipping_weight: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="shipping_time_days">Shipping Time (days)</Label>
                  <Input
                    id="shipping_time_days"
                    type="number"
                    value={formData.shipping_time_days}
                    onChange={(e) => setFormData({ ...formData, shipping_time_days: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="holiday, jewelry, gift"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                  />
                  <Label htmlFor="is_featured">Featured</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_bestseller"
                    checked={formData.is_bestseller}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_bestseller: checked })}
                  />
                  <Label htmlFor="is_bestseller">Bestseller</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="backorder_allowed"
                    checked={formData.backorder_allowed}
                    onCheckedChange={(checked) => setFormData({ ...formData, backorder_allowed: checked })}
                  />
                  <Label htmlFor="backorder_allowed">Allow Backorder</Label>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button type="submit" style={{ backgroundColor: '#E28F84' }} className="text-white hover:opacity-90">
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingCategory(null);
                    resetForm();
                  }}
                  style={{ borderColor: '#A89B84', color: '#5B4C37' }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card style={{ backgroundColor: '#F6DADA' }}>
        <CardHeader>
          <CardTitle style={{ color: '#5B4C37' }}>Products ({products.length})</CardTitle>
          <CardDescription>Manage your product catalog</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div>
                    <h3 className="font-medium flex items-center space-x-2">
                      <span>{product.name}</span>
                      {product.is_featured && <Star className="h-4 w-4 text-blue-500" />}
                      {product.is_bestseller && <Award className="h-4 w-4 text-green-500" />}
                    </h3>
                    <p className="text-sm text-gray-500">{product.category}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant={product.is_active ? "default" : "secondary"}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        Stock: {product.inventory_quantity || 0}
                      </span>
                      {product.sku && (
                        <span className="text-sm text-gray-500">SKU: {product.sku}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-medium">${product.price?.toFixed(2)}</p>
                    {product.tags && product.tags.length > 0 && (
                      <div className="flex space-x-1 mt-1">
                        {product.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="outline" style={{ fontSize: '10px' }}>
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
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

export default ProductManagement;
