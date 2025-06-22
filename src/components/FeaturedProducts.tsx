
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

const FeaturedProducts = () => {
  const [likedProducts, setLikedProducts] = useState<Set<number>>(new Set());

  const products = [
    {
      id: 1,
      name: "Custom Photo Ornament",
      price: 24.99,
      originalPrice: 29.99,
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400",
      category: "Ornaments",
      description: "Transform your favorite memory into a beautiful keepsake ornament"
    },
    {
      id: 2,
      name: "Seasonal Welcome Wreath",
      price: 49.99,
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400",
      category: "Wreaths",
      description: "Handcrafted seasonal wreath perfect for welcoming guests"
    },
    {
      id: 3,
      name: "Personalized Coffee Mug",
      price: 18.99,
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400",
      category: "Drinkware",
      description: "Start every morning with your favorite photo and a warm drink"
    },
    {
      id: 4,
      name: "Holiday Memory Frame",
      price: 34.99,
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400",
      category: "Home Décor",
      description: "Elegant frame to showcase your most treasured holiday moments"
    }
  ];

  const toggleLike = (productId: number) => {
    const newLiked = new Set(likedProducts);
    if (newLiked.has(productId)) {
      newLiked.delete(productId);
    } else {
      newLiked.add(productId);
    }
    setLikedProducts(newLiked);
  };

  return (
    <section className="py-16 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-4">
            Featured Collections
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our most beloved pieces, each one carefully crafted to turn your memories into lasting treasures
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group animate-fade-in card-hover"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Product Image */}
              <div className="relative overflow-hidden rounded-t-xl">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.originalPrice && (
                  <div className="absolute top-3 left-3 bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-medium">
                    Sale
                  </div>
                )}
                <button
                  onClick={() => toggleLike(product.id)}
                  className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200"
                >
                  <Heart
                    className={`h-4 w-4 transition-colors duration-200 ${
                      likedProducts.has(product.id)
                        ? 'text-red-500 fill-current'
                        : 'text-gray-600'
                    }`}
                  />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="text-xs text-primary font-medium mb-2 uppercase tracking-wide">
                  {product.category}
                </div>
                <h3 className="font-playfair font-semibold text-lg text-foreground mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-foreground">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    className="btn-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button className="btn-secondary px-8 py-3 text-lg">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
