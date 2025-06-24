
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Star, Heart, ShoppingCart, Eye, EyeOff } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  gallery_images: string[];
  category: string;
  description: string;
  is_featured: boolean;
  featured_order: number;
}

const HomepagePreview = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (showPreview) {
      fetchFeaturedProducts();
    }
  }, [showPreview]);

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, image_url, gallery_images, category, description, is_featured, featured_order')
        .eq('is_featured', true)
        .eq('is_active', true)
        .order('featured_order', { ascending: true })
        .limit(4);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      toast({
        title: "Error",
        description: "Failed to load homepage preview",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getProductImage = (product: Product) => {
    return product.image_url || (product.gallery_images && product.gallery_images[0]) || "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400";
  };

  return (
    <Card className="bg-blush/20 border-0 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-charcoal">Homepage Preview</CardTitle>
          <Button
            onClick={() => {
              setShowPreview(!showPreview);
              if (!showPreview) {
                setLoading(true);
              }
            }}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span>{showPreview ? 'Hide Preview' : 'Show Preview'}</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showPreview ? (
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-sage border-t-transparent mx-auto mb-4"></div>
                <div className="text-charcoal">Loading preview...</div>
              </div>
            ) : (
              <div>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-4" style={{ backgroundColor: '#F6DADA', color: '#7A7047' }}>
                    <Star className="h-4 w-4 mr-2" />
                    Customer Favorites
                  </div>
                  <h3 className="text-2xl font-playfair font-bold mb-4" style={{ color: '#5B4C37' }}>
                    Featured Collections
                  </h3>
                  <p className="text-sm max-w-2xl mx-auto" style={{ color: '#A89B84' }}>
                    This is how your featured products will appear on the homepage
                  </p>
                </div>

                {products.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="bg-white rounded-lg shadow-sm border group"
                        style={{ borderColor: '#F6DADA' }}
                      >
                        <div className="relative overflow-hidden rounded-t-lg">
                          <img
                            src={getProductImage(product)}
                            alt={product.name}
                            className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <button className="absolute top-2 right-2 p-1 bg-white/90 rounded-full">
                            <Heart className="h-3 w-3 text-gray-600" />
                          </button>
                        </div>
                        <div className="p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded" style={{ backgroundColor: '#F6DADA', color: '#7A7047' }}>
                              {product.category}
                            </span>
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="h-2 w-2 fill-current"
                                  style={{ color: '#E28F84' }}
                                />
                              ))}
                            </div>
                          </div>
                          <h4 className="font-playfair font-bold text-sm mb-2 line-clamp-2" style={{ color: '#5B4C37' }}>
                            {product.name}
                          </h4>
                          <p className="text-xs mb-2 line-clamp-2" style={{ color: '#A89B84' }}>
                            {product.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold" style={{ color: '#5B4C37' }}>
                              ${product.price.toFixed(2)}
                            </span>
                            <Button
                              size="sm"
                              className="text-white text-xs px-2 py-1"
                              style={{ backgroundColor: '#E28F84' }}
                            >
                              <ShoppingCart className="h-3 w-3 mr-1" />
                              Add
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No featured products selected</p>
                    <p className="text-sm mt-2">Use the "Featured" toggle in Product Management to add products</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Click "Show Preview" to see how your homepage will look</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HomepagePreview;
