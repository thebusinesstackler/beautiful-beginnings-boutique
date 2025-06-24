import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import FeaturedProductImageUploader from './FeaturedProductImageUploader';

interface FeaturedProduct {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  image: string;
  description: string;
  href: string;
  rating: number;
  reviews: number;
  customer_quote: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

const FeaturedProductsManager = () => {
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    original_price: '',
    image: '',
    description: '',
    href: '',
    rating: 5,
    reviews: 0,
    customer_quote: '',
    is_active: true,
    sort_order: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('featured_products')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setFeaturedProducts((data as FeaturedProduct[]) || []);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      toast({
        title: "Error",
        description: "Failed to load featured products",
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
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        image: formData.image,
        description: formData.description,
        href: formData.href,
        rating: formData.rating,
        reviews: formData.reviews,
        customer_quote: formData.customer_quote,
        is_active: formData.is_active,
        sort_order: formData.sort_order,
      };

      if (editingId) {
        const { error } = await supabase
          .from('featured_products')
          .update({
            ...productData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingId);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Featured product updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('featured_products')
          .insert([productData]);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Featured product created successfully",
        });
      }

      resetForm();
      fetchFeaturedProducts();
    } catch (error) {
      console.error('Error saving featured product:', error);
      toast({
        title: "Error",
        description: "Failed to save featured product",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (product: FeaturedProduct) => {
    setFormData({
      name: product.name,
      price: product.price.toString(),
      original_price: product.original_price?.toString() || '',
      image: product.image,
      description: product.description,
      href: product.href,
      rating: product.rating,
      reviews: product.reviews,
      customer_quote: product.customer_quote,
      is_active: product.is_active,
      sort_order: product.sort_order,
    });
    setEditingId(product.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this featured product?')) return;

    try {
      const { error } = await supabase
        .from('featured_products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Featured product deleted successfully",
      });
      
      fetchFeaturedProducts();
    } catch (error) {
      console.error('Error deleting featured product:', error);
      toast({
        title: "Error",
        description: "Failed to delete featured product",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      original_price: '',
      image: '',
      description: '',
      href: '',
      rating: 5,
      reviews: 0,
      customer_quote: '',
      is_active: true,
      sort_order: 0,
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-sage border-t-transparent mx-auto mb-4"></div>
        <div className="text-charcoal font-medium">Loading featured products...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-charcoal">Featured Products (About Section)</h3>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-sage hover:bg-sage/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Featured Product
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card className="bg-cream/20 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-charcoal">
              {editingId ? 'Edit Featured Product' : 'Add New Featured Product'}
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
                  <Label htmlFor="href">Link URL</Label>
                  <Input
                    id="href"
                    value={formData.href}
                    onChange={(e) => setFormData({ ...formData, href: e.target.value })}
                    placeholder="/products/category"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <Label htmlFor="original_price">Original Price ($)</Label>
                  <Input
                    id="original_price"
                    type="number"
                    step="0.01"
                    value={formData.original_price}
                    onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              {/* Enhanced Image Upload Section */}
              <div>
                <Label className="text-base font-medium text-charcoal mb-4 block">Product Image</Label>
                <FeaturedProductImageUploader
                  currentImage={formData.image}
                  onImageChange={(imageUrl) => setFormData({ ...formData, image: imageUrl })}
                />
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
                <Label htmlFor="customer_quote">Customer Quote</Label>
                <Textarea
                  id="customer_quote"
                  value={formData.customer_quote}
                  onChange={(e) => setFormData({ ...formData, customer_quote: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rating">Rating (1-5)</Label>
                  <Input
                    id="rating"
                    type="number"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })}
                  />
                </div>
                <div>
                  <Label htmlFor="reviews">Number of Reviews</Label>
                  <Input
                    id="reviews"
                    type="number"
                    min="0"
                    value={formData.reviews}
                    onChange={(e) => setFormData({ ...formData, reviews: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>

              <div className="flex space-x-2">
                <Button type="submit" className="bg-sage hover:bg-sage/90">
                  <Save className="h-4 w-4 mr-2" />
                  {editingId ? 'Update' : 'Create'} Featured Product
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

      {/* Featured Products List */}
      <div className="grid gap-4">
        {featuredProducts.map((product) => (
          <Card key={product.id} className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex space-x-4 flex-1">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h4 className="text-lg font-semibold text-charcoal">{product.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.is_active 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <p className="text-stone text-sm mb-2">{product.description}</p>
                    <p className="text-stone text-sm mb-2 italic">"{product.customer_quote}"</p>
                    
                    <div className="flex items-center space-x-4 text-xs text-stone">
                      <span>Price: ${product.price}</span>
                      {product.original_price && <span>Was: ${product.original_price}</span>}
                      <span>Rating: {product.rating}/5 ({product.reviews} reviews)</span>
                      <span>Sort: {product.sort_order}</span>
                    </div>
                  </div>
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
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {featuredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-stone text-lg">No featured products found</p>
          <p className="text-stone text-sm">Create your first featured product to get started</p>
        </div>
      )}
    </div>
  );
};

export default FeaturedProductsManager;
