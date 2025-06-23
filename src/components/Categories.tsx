import { Link } from 'react-router-dom';
import { ArrowRight, Heart } from 'lucide-react';

const Categories = () => {
  const categories = [
    {
      name: "Keepsake Ornaments",
      description: "Transform memories into beautiful ornaments",
      href: "/products/ornaments",
      featured: true
    },
    {
      name: "Memory Jewelry",
      description: "Wear your loved ones close to your heart",
      href: "/products/necklaces",
      featured: false
    },
    {
      name: "Slate Keepsakes",
      description: "Elegant slate pieces with lasting memories",
      href: "/products/slate",
      featured: false
    },
    {
      name: "Snow Globes",
      description: "Magical snow globes with your special moments",
      href: "/products/snow-globes",
      featured: false
    },
    {
      name: "Wood Art",
      description: "Rustic wood pieces with personalized touches",
      href: "/products/wood-sublimation",
      featured: false
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-rose-50/30 relative overflow-hidden">
      {/* Soft decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-rose-200 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-rose-100 rounded-full blur-lg"></div>
        <div className="absolute bottom-32 left-32 w-28 h-28 bg-rose-200 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-24 w-20 h-20 bg-rose-100 rounded-full blur-lg"></div>
      </div>

      <div className="container mx-auto px-4 relative">
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
              key={index}
              to={category.href}
              className={`group block bg-white rounded-2xl shadow-sm hover:shadow-xl overflow-hidden transition-all duration-300 hover:-translate-y-2 relative border border-rose-100 ${
                category.featured ? 'ring-2 ring-rose-200' : ''
              }`}
            >
              {/* Updated image */}
              <div className="aspect-square overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400"
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
      </div>
    </section>
  );
};

export default Categories;
