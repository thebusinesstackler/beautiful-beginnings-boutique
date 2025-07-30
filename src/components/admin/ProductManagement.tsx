import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Package, Plus, Edit, Trash2, Save, X, Star, Award, ArrowUp, ArrowDown } from 'lucide-react';
import ProductImageManager from './ProductImageManager';
import HomepagePreview from './HomepagePreview';
import AIContentGenerator from './AIContentGenerator';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  gallery_images: string[];
  is_active: boolean;
  is_featured: boolean;
  is_bestseller: boolean;
  featured_order: number;
  inventory_quantity: number;
  seo_title: string;
  seo_description: string;
  created_at: string;
  updated_at: string;
}

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image_url: '',
    gallery_images: [] as string[],
    inventory_quantity: '',
    is_active: true,
    is_featured: false,
    is_bestseller: false,
    seo_title: '',
    seo_description: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        image_url: formData.image_url,
        gallery_images: formData.gallery_images,
        inventory_quantity: parseInt(formData.inventory_quantity) || 0,
        is_active: formData.is_active,
        is_featured: formData.is_featured,
        is_bestseller: formData.is_bestseller,
        seo_title: formData.seo_title,
        seo_description: formData.seo_description
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Product created successfully",
        });
      }

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
      price: product.price.toString(),
      category: product.category,
      image_url: product.image_url || '',
      gallery_images: product.gallery_images || [],
      inventory_quantity: product.inventory_quantity?.toString() || '0',
      is_active: product.is_active,
      is_featured: product.is_featured || false,
      is_bestseller: product.is_bestseller || false,
      seo_title: product.seo_title || '',
      seo_description: product.seo_description || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      
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

  const updateFeaturedOrder = async (productId: string, direction: 'up' | 'down') => {
    const product = products.find(p => p.id === productId);
    if (!product || !product.is_featured) return;

    const featuredProducts = products
      .filter(p => p.is_featured)
      .sort((a, b) => a.featured_order - b.featured_order);
    
    const currentIndex = featuredProducts.findIndex(p => p.id === productId);
    if (currentIndex === -1) return;

    let newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= featuredProducts.length) return;

    // Swap the featured_order values
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
        description: "Product order updated",
      });
    } catch (error) {
      console.error('Error updating product order:', error);
      toast({
        title: "Error",
        description: "Failed to update product order",
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
      image_url: '',
      gallery_images: [],
      inventory_quantity: '',
      is_active: true,
      is_featured: false,
      is_bestseller: false,
      seo_title: '',
      seo_description: ''
    });
    setEditingProduct(null);
    setShowAddForm(false);
  };

  const categories = ['Snow Globes', 'Necklaces', 'Ornaments', 'Slate', 'Wood Sublimation'];

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  const featuredProducts = products.filter(p => p.is_featured);
  const bestsellerProducts = products.filter(p => p.is_bestseller);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-2">Product Management</h2>
          <p className="text-stone">Manage your product catalog and homepage featured products</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="bg-sage hover:bg-sage/90 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Product Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-cream/50 border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-charcoal">Total Products</CardTitle>
            <Package className="h-4 w-4 text-stone" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-charcoal">{products.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-blush/30 border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-charcoal">Active Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-charcoal">
              {products.filter(p => p.is_active).length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-cream/50 border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-charcoal">Featured</CardTitle>
            <Star className="h-4 w-4 text-stone" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-charcoal">{featuredProducts.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-blush/30 border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-charcoal">Bestsellers</CardTitle>
            <Award className="h-4 w-4 text-stone" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-charcoal">{bestsellerProducts.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-cream/50 border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-charcoal">Low Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-charcoal">
              {products.filter(p => (p.inventory_quantity || 0) < 5).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Homepage Preview */}
      <HomepagePreview />

      {/* Add/Edit Product Form */}
      {showAddForm && (
        <Card className="bg-cream/30 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-charcoal">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="price">Price ($)</Label>
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
                  <Label htmlFor="inventory">Inventory Quantity</Label>
                  <Input
                    id="inventory"
                    type="number"
                    value={formData.inventory_quantity}
                    onChange={(e) => setFormData({ ...formData, inventory_quantity: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="description">Description</Label>
                  <AIContentGenerator
                    productName={formData.name}
                    category={formData.category}
                    contentType="description"
                    onContentGenerated={(content) => setFormData({ ...formData, description: content })}
                    disabled={!formData.name || !formData.category}
                  />
                </div>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Enter product description or use AI to generate one"
                />
              </div>

              {/* SEO Fields with AI Generation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="seo_title">SEO Title</Label>
                    <AIContentGenerator
                      productName={formData.name}
                      category={formData.category}
                      contentType="seo_title"
                      onContentGenerated={(content) => setFormData({ ...formData, seo_title: content })}
                      disabled={!formData.name || !formData.category}
                      size="sm"
                    />
                  </div>
                  <Input
                    id="seo_title"
                    value={formData.seo_title}
                    onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                    placeholder="SEO optimized title"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="seo_description">SEO Description</Label>
                    <AIContentGenerator
                      productName={formData.name}
                      category={formData.category}
                      contentType="seo_description"
                      onContentGenerated={(content) => setFormData({ ...formData, seo_description: content })}
                      disabled={!formData.name || !formData.category}
                      size="sm"
                    />
                  </div>
                  <Input
                    id="seo_description"
                    value={formData.seo_description}
                    onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                    placeholder="SEO meta description"
                  />
                </div>
              </div>

              {/* Product Images */}
              <ProductImageManager
                imageUrl={formData.image_url}
                galleryImages={formData.gallery_images}
                onImageUrlChange={(url) => setFormData({ ...formData, image_url: url })}
                onGalleryImagesChange={(images) => setFormData({ ...formData, gallery_images: images })}
              />

              {/* Product Status Toggles */}
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Product is active</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                  />
                  <Label htmlFor="is_featured">Featured on homepage</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_bestseller"
                    checked={formData.is_bestseller}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_bestseller: checked })}
                  />
                  <Label htmlFor="is_bestseller">Bestseller</Label>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button 
                  type="submit"
                  className="bg-sage hover:bg-sage/90 text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingProduct ? 'Update' : 'Create'} Product
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Products List */}
      <Card className="bg-blush/20 border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-charcoal">Products ({products.length})</CardTitle>
          <CardDescription>Your product catalog with homepage controls</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm">
                <div className="flex items-center space-x-4">
                  {(product.image_url || (product.gallery_images && product.gallery_images[0])) && (
                    <img
                      src={product.image_url || product.gallery_images[0]}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium">{product.name}</h3>
                      {product.is_featured && <Star className="h-4 w-4 text-terracotta" />}
                      {product.is_bestseller && <Award className="h-4 w-4 text-sage" />}
                    </div>
                    <p className="text-sm text-gray-600">{product.category}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm font-medium">${product.price?.toFixed(2)}</span>
                      <Badge variant={product.is_active ? "default" : "secondary"}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline">
                        Stock: {product.inventory_quantity || 0}
                      </Badge>
                      {product.is_featured && (
                        <Badge className="bg-terracotta text-white">
                          Featured #{product.featured_order}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {product.is_featured && (
                    <div className="flex flex-col space-y-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateFeaturedOrder(product.id, 'up')}
                        className="p-1"
                      >
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateFeaturedOrder(product.id, 'down')}
                        className="p-1"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(product)}
                    className="border-stone text-charcoal hover:bg-cream/50"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {products.length === 0 && (
              <p className="text-center py-8 text-gray-500">No products found. Create your first product!</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductManagement;
