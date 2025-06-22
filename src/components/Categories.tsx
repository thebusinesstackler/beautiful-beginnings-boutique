
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Categories = () => {
  const categories = [
    {
      name: "Keepsake Ornaments",
      description: "Transform memories into beautiful ornaments",
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400",
      href: "/products/ornaments",
      featured: true
    },
    {
      name: "Memory Jewelry",
      description: "Wear your loved ones close to your heart",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400",
      href: "/products/jewelry",
      featured: false
    },
    {
      name: "Slate Keepsakes",
      description: "Elegant slate pieces with lasting memories",
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400",
      href: "/products/slate",
      featured: false
    },
    {
      name: "Snow Globes",
      description: "Magical snow globes with your special moments",
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400",
      href: "/products/snow-globes",
      featured: false
    },
    {
      name: "Wood Art",
      description: "Rustic wood pieces with personalized touches",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400",
      href: "/products/wood-sublimation",
      featured: false
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-warm-cream to-light-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-chocolate mb-6">
            Our Product Categories
          </h2>
          <p className="text-lg text-dark-brown max-w-2xl mx-auto leading-relaxed">
            Each piece is carefully crafted to preserve your most precious memories
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={category.href}
              className={`group block bg-white rounded-2xl shadow-lg overflow-hidden card-hover ${
                category.featured ? 'ring-2 ring-saddle-brown' : ''
              }`}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-playfair font-semibold text-chocolate mb-2">
                  {category.name}
                </h3>
                <p className="text-dark-brown mb-4 leading-relaxed">
                  {category.description}
                </p>
                <div className="flex items-center text-saddle-brown font-medium group-hover:text-peru transition-colors">
                  Explore Collection
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
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
