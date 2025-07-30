
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import ProductImageManager from './ProductImageManager';
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
}

interface ProductFormProps {
  product?: Product | null;
  onSave: () => void;
  onCancel: () => void;
}

const categories = [
  'Snow Globes',
  'Necklaces',
  'Ornaments',
  'Slate',
  'Wood Sublimation'
];

const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onCancel }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image_url: '',
    gallery_images: [] as string[],
    is_active: true,
    seo_title: '',
    seo_description: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        category: product.category || '',
        image_url: product.image_url || '',
        gallery_images: product.gallery_images || [],
        is_active: product.is_active,
        seo_title: (product as any).seo_title || '',
        seo_description: (product as any).seo_description || '',
      });
    }
  }, [product]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        image_url: formData.image_url,
        gallery_images: formData.gallery_images,
        is_active: formData.is_active,
        seo_title: formData.seo_title,
        seo_description: formData.seo_description,
      };

      if (product) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('products')
          .insert(productData);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Product created successfully",
        });
      }

      onSave();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price ($)</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={(e) => handleInputChange('price', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="description">Description</Label>
          <AIContentGenerator
            productName={formData.name}
            category={formData.category}
            contentType="description"
            onContentGenerated={(content) => handleInputChange('description', content)}
            disabled={!formData.name || !formData.category}
          />
        </div>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={4}
          placeholder="Enter product description or use AI to generate one"
        />
      </div>

      {/* SEO Fields with AI Generation */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="seo_title">SEO Title</Label>
            <AIContentGenerator
              productName={formData.name}
              category={formData.category}
              contentType="seo_title"
              onContentGenerated={(content) => handleInputChange('seo_title', content)}
              disabled={!formData.name || !formData.category}
            />
          </div>
          <Input
            id="seo_title"
            value={formData.seo_title}
            onChange={(e) => handleInputChange('seo_title', e.target.value)}
            placeholder="SEO optimized title (auto-generated or custom)"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="seo_description">SEO Description</Label>
            <AIContentGenerator
              productName={formData.name}
              category={formData.category}
              contentType="seo_description"
              onContentGenerated={(content) => handleInputChange('seo_description', content)}
              disabled={!formData.name || !formData.category}
            />
          </div>
          <Textarea
            id="seo_description"
            value={formData.seo_description}
            onChange={(e) => handleInputChange('seo_description', e.target.value)}
            rows={2}
            placeholder="SEO meta description (auto-generated or custom)"
          />
        </div>
      </div>

      {/* Enhanced Image Management */}
      <ProductImageManager
        imageUrl={formData.image_url}
        galleryImages={formData.gallery_images}
        onImageUrlChange={(url) => handleInputChange('image_url', url)}
        onGalleryImagesChange={(images) => handleInputChange('gallery_images', images)}
      />

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={loading}
          style={{ backgroundColor: '#E28F84' }}
        >
          {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
