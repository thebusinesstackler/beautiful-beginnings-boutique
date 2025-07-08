
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';

const PeopleAlsoBought = () => {
  const { addToCart } = useCart();

  const { data: recommendedProducts } = useQuery({
    queryKey: ['recommended-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .or('is_bestseller.eq.true,is_featured.eq.true')
        .limit(4);
      
      if (error) throw error;
      return data;
    },
  });

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price || 0,
      image: product.image_url || product.images?.[0] || '/placeholder.svg'
    });
    
    toast({
      title: "Added to Cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  if (!recommendedProducts || recommendedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 bg-gradient-to-br from-sage/5 to-forest/5 rounded-2xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-playfair font-bold text-charcoal mb-3">
          People Also Bought
        </h2>
        <p className="text-stone max-w-2xl mx-auto">
          Complete your order with these popular items that other customers love
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendedProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 group">
            <div className="aspect-square mb-4 rounded-lg overflow-hidden bg-stone-100">
              <img
                src={product.image_url || product.images?.[0] || '/placeholder.svg'}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            <div className="space-y-3">
              <h3 className="font-playfair font-semibold text-charcoal text-lg leading-tight">
                {product.name}
              </h3>
              
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold text-sage">
                  ${product.price?.toFixed(2) || '0.00'}
                </div>
                
                <Button
                  onClick={() => handleAddToCart(product)}
                  size="sm"
                  className="bg-sage hover:bg-forest text-white transition-colors duration-200"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PeopleAlsoBought;
