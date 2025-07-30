
import { Link } from 'react-router-dom';
import { ArrowRight, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url?: string;
  sort_order: number;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to empty array if error
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Map category slugs to their corresponding product pages
  const getHref = (slug: string) => {
    const hrefMap: { [key: string]: string } = {
      'ornaments': '/products/ornaments',
      'necklaces': '/products/necklaces',
      'slate': '/products/slate',
      'snow-globes': '/products/snow-globes',
      'wood-sublimation': '/products/wood-sublimation'
    };
    return hrefMap[slug] || `/products/${slug}`;
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-white to-rose-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-rose-400 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading categories...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-rose-50/30 relative overflow-hidden">
      {/* Soft decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-rose-200 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-rose-100 rounded-full blur-lg"></div>
        <div className="absolute bottom-32 left-32 w-28 h-28 bg-rose-200 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-24 w-20 h-20 bg-rose-100 rounded-full blur-lg"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-rose-100 rounded-full text-sm font-medium text-rose-700 mb-6">
            <Heart className="h-4 w-4 mr-2" />
            Handcrafted Collections
          </div>
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-slate-800 mb-6">
            Our Product Categories
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Each piece is carefully crafted to preserve your most precious memories
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={getHref(category.slug)}
              className="group block bg-white rounded-2xl shadow-sm hover:shadow-xl overflow-hidden transition-all duration-300 hover:-translate-y-2 relative border border-rose-100"
            >
              {/* Category image */}
              <div className="aspect-square overflow-hidden">
                <img
                  src={category.image_url || "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400"}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400";
                  }}
                />
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-playfair font-semibold text-slate-800 mb-2">
                  {category.name}
                </h3>
                <p className="text-slate-600 mb-4 leading-relaxed">
                  {category.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-white font-medium bg-gradient-to-r from-rose-400 to-rose-500 px-6 py-3 rounded-full group-hover:from-rose-500 group-hover:to-rose-600 transition-all duration-300 shadow-md hover:shadow-lg">
                    Explore Collection
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {categories.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-600 text-lg">No categories available at the moment.</p>
            <p className="text-slate-500 mt-2">Please check back soon for our handcrafted collections.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Categories;
