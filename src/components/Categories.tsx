
import { Link } from 'react-router-dom';

const Categories = () => {
  const categories = [
    {
      name: "Keepsake Ornaments",
      description: "Transform memories into beautiful ornaments",
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400",
      href: "/products/ornaments",
      color: "from-soft-rose/80 to-soft-rose/40"
    },
    {
      name: "Holiday Décor",
      description: "Festive touches for every season",
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400",
      href: "/products/holiday-decor",
      color: "from-sage-green/80 to-sage-green/40"
    },
    {
      name: "Jewelry & Accessories",
      description: "Wear your memories close to your heart",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400",
      href: "/products/jewelry",
      color: "from-gold-accent/80 to-gold-accent/40"
    },
    {
      name: "Personalized Drinkware",
      description: "Sip with style and cherished memories",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400",
      href: "/products/drinkware",
      color: "from-warm-brown/80 to-warm-brown/40"
    },
    {
      name: "Wreaths & Home Décor",
      description: "Welcome guests with handcrafted beauty",
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400",
      href: "/products/wreaths",
      color: "from-primary/80 to-primary/40"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From personalized ornaments to seasonal décor, find the perfect piece to celebrate your special moments
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              to={category.href}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 card-hover animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Background Image */}
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${category.color} group-hover:opacity-90 transition-opacity duration-300`}></div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h3 className="text-xl md:text-2xl font-playfair font-bold mb-2 group-hover:translate-y-0 translate-y-2 transition-transform duration-300">
                  {category.name}
                </h3>
                <p className="text-sm md:text-base opacity-90 group-hover:translate-y-0 translate-y-4 transition-transform duration-300 delay-75">
                  {category.description}
                </p>
                
                {/* Arrow indicator */}
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150">
                  <div className="inline-flex items-center text-sm font-medium">
                    Explore Collection
                    <svg className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
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
